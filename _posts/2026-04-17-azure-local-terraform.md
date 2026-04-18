---
title: "Azure Local: Terraform Deployment"
excerpt: "Deploy Azure Local with Terraform using a fixed AVM fork, staged validation and a service principal ready for pipeline-driven AVD and AKS automation."
date: 2026-04-17
categories:
  - Blog
tags:
  - Azure Local
  - Azure Stack HCI
  - Terraform
  - Automation
  - Infrastructure as Code

sticky: false

header:
  teaser: "/assets/img/post/2026-04-17-azure-local-terraform.webp"
  image: "/assets/img/post/2026-04-17-azure-local-terraform.webp"
  og_image: "/assets/img/post/2026-04-17-azure-local-terraform.webp"
  overlay_image: "/assets/img/post/2026-04-17-azure-local-terraform.webp"
  overlay_filter: 0.5

toc: true
toc_label: "Topics Overview"
toc_icon: "list-ul"

sidebar:
  nav: "Azurelocal"
---

## Introduction

If you have been following this series, you already know how I built my Azure Local demolab step by step: preparing the Hyper-V host, configuring the domain controller, registering the node with Azure Arc and then walking through the portal deployment. That workflow works, but it is entirely manual. Every time I tear down and rebuild the lab I repeat the same sequence of clicks and commands and every time I do that I risk a small configuration drift.

A few months ago I decided to change that. The goal was straightforward: replace the portal deployment path with a fully automated Terraform run that I could trigger from a pipeline with a service account and that I could later reuse for AVD, AKS and other workloads on top of Azure Local. Less clicking, more repeatable infrastructure.

Getting there turned out to be more work than I expected. The [Azure Verified Module (AVM) for Azure Local](https://github.com/Azure/terraform-azurerm-avm-res-azurestackhci-cluster) is a good starting point, but it was written against a specific point in time and the Azure Local deployment API has moved since then. From the end of 2025 onward, several things changed: resource provider behavior, required role assignments and the API version that the Azure control plane actually accepts. When I first tried to apply the module against my lab, I got a series of failures that took real investigation to understand.

This article covers what I built, what broke, how I fixed it and how the deployment now flows end to end. I will also explain where I plan to take the repository from here.

## The AzSHCI Repository

All of the automation lives in my [AzSHCI repository](https://github.com/schmittnieto/AzSHCI). It has two parallel paths that work together:

- **`scripts/01Lab/`**: PowerShell scripts that handle everything from Azure prerequisites through Hyper-V infrastructure setup, domain controller configuration and Arc registration. These run before Terraform comes into the picture.
- **`terraform/`**: A root Terraform configuration that calls a local fork of the AVM module. The fork carries the fixes and additions that were needed to make the deployment work against the current Azure API.

The long-term vision for the repository is a single codebase that can deploy not just the Azure Local cluster but also the workloads on top of it: AVD host pools, AKS clusters and potentially other services. The Terraform path is designed from the start to be consumed from a CI/CD pipeline using a service principal, so every credential is handled through a Key Vault and no secrets live in the repository.

## Prerequisites: The First Script

Before any Terraform runs, Azure needs to be in the right state. The script `scripts/01Lab/00_AzurePreRequisites.ps1` handles that in a single, interactive run.

What it does:

1. Checks for and installs the required Az PowerShell modules (`Az.Accounts`, `Az.Resources`).
2. Verifies your Azure session and prompts a device code login if no active session is found.
3. Lets you select a subscription interactively.
4. Lets you choose an existing resource group or create a new one.
5. Assigns the required RBAC roles to a user or to a newly created service principal.
6. Registers all required resource providers.

The roles it assigns fall into two scopes. At resource group scope: `Azure Connected Machine Onboarding`, `Azure Connected Machine Resource Administrator`, `Key Vault Data Access Administrator`, `Key Vault Secrets Officer`, `Key Vault Contributor` and `Storage Account Contributor`. At subscription scope: `Azure Stack HCI Administrator` and `Reader`.

The resource providers it registers cover the full Azure Local stack: `Microsoft.HybridCompute`, `Microsoft.AzureStackHCI`, `Microsoft.Kubernetes`, `Microsoft.KubernetesConfiguration`, `Microsoft.ExtendedLocation`, `Microsoft.ResourceConnector`, `Microsoft.HybridContainerService` and several others.

If you create a service principal through this script, it prints the connection details at the end. Those credentials go into your Terraform variables file and Key Vault reference and from that point the pipeline can run unattended. Here is a full run with sensitive values redacted:

```plaintext
Checking required Az modules...
Module 'Az.Accounts' is available.
Module 'Az.Resources' is available.
All required modules loaded.
Active session: admin@<tenant>.com on subscription 'Azure-Abonnement 1'.
Use this session? (Y/N): N
Starting device code login...
[Login to Azure] To sign in, use a web browser to open the page https://login.microsoft.com/device
and enter the code GAX*****QB to authenticate.

Authenticated to Azure.
Retrieving available subscriptions...

Select the subscription to use:
    0. Azure-Abonnement 1
Select subscription: 0
Using subscription 'Azure-Abonnement 1' (<subscription-id>).

Resource Group setup:
  1. Use an existing resource group
  2. Create a new resource group
Select option (1 or 2): 2

Recommended resource group name: 'rg-azlocal-lab'
Enter resource group name (press Enter to accept recommendation): rg-azlocal-demolab

Select the Azure region for the new resource group:
    0. westeurope
    1. northeurope
    2. eastus
    ...
Enter a list number or type a region name directly: 0
Creating resource group 'rg-azlocal-demolab' in 'westeurope'...
Resource group 'rg-azlocal-demolab' created.

Select how to assign the required Azure RBAC roles:
  1. Assign to an existing user account
  2. Create a new Service Principal and assign roles to it
Select option (1 or 2): 2

Recommended SPN name: 'sp-azlocal-lab'
Enter SPN display name (press Enter to accept recommendation): sp-azlocal-demolab
Creating app registration 'sp-azlocal-demolab'...
App registration created. AppId: <app-id>
Creating service principal...
Service principal created. ObjectId: <object-id>
Generating client secret (valid for 2 years)...
Client secret generated.
Waiting 20 seconds for the SPN to propagate before assigning roles...

Assigning resource group scoped roles to 'sp-azlocal-demolab'...
Assigned 'Azure Connected Machine Onboarding' at RG scope.
Assigned 'Azure Connected Machine Resource Administrator' at RG scope.
Assigned 'Key Vault Data Access Administrator' at RG scope.
Assigned 'Key Vault Secrets Officer' at RG scope.
Assigned 'Key Vault Contributor' at RG scope.
Assigned 'Storage Account Contributor' at RG scope.

Assigning subscription scoped roles to 'sp-azlocal-demolab'...
Assigned 'Azure Stack HCI Administrator' at subscription scope.
Assigned 'Reader' at subscription scope.

Checking and registering required resource providers...
Provider 'Microsoft.HybridCompute' is already registered.
Provider 'Microsoft.GuestConfiguration' is already registered.
Provider 'Microsoft.HybridConnectivity' is already registered.
Provider 'Microsoft.AzureStackHCI' is already registered.
Provider 'Microsoft.Kubernetes' is already registered.
Provider 'Microsoft.KubernetesConfiguration' is already registered.
Provider 'Microsoft.ExtendedLocation' is already registered.
Provider 'Microsoft.ResourceConnector' is already registered.
Provider 'Microsoft.HybridContainerService' is already registered.
Provider 'Microsoft.Attestation' is already registered.
Provider 'Microsoft.Storage' is already registered.
Provider 'Microsoft.KeyVault' is already registered.
Provider 'Microsoft.Insights' is already registered.

Azure prerequisites setup completed.

Summary:
  Subscription : Azure-Abonnement 1 (<subscription-id>)
  Resource Group: rg-azlocal-demolab (location: westeurope)
  Principal    : sp-azlocal-demolab

================================================================
  SERVICE PRINCIPAL CONNECTION DETAILS
  Save these values securely. The secret cannot be retrieved
  again after this session ends.
================================================================

  Display Name    : sp-azlocal-demolab
  Tenant ID       : <tenant-id>
  Subscription ID : <subscription-id>
  App ID          : <app-id>
  Client Secret   : <client-secret>
  Secret Expiry   : 2028-04-17

  IMPORTANT: Rotate this secret before it expires to avoid service disruptions.

  To connect with this SPN in PowerShell:

  $spnCredential = New-Object PSCredential(
      "<app-id>",
      (ConvertTo-SecureString "<client-secret>" -AsPlainText -Force))
  Connect-AzAccount -ServicePrincipal `
      -Tenant "<tenant-id>" `
      -Subscription "<subscription-id>" `
      -Credential $spnCredential

================================================================
```

## Infrastructure and Cluster Preparation

With the Azure side ready, the next scripts prepare the local environment:

- **`00_Infra_AzHCI.ps1`** builds the Hyper-V infrastructure: virtual switches, storage paths and the Azure Local node VM.
- **`01_DC.ps1`** sets up the domain controller that the cluster needs for Active Directory integration.
- **`02_Cluster.ps1`** performs the Arc registration of the node. After this script completes, the machine appears in Azure as an Arc-enabled server and is ready for the Terraform deployment step.

## The Terraform Architecture

The Terraform configuration is a thin root module that creates a few shared prerequisites and then calls the Azure Local cluster module. The shared prerequisites are:

- **Key Vault** with RBAC authorization enabled, used to store the deployment credentials.
- **Witness storage account** for the cluster quorum.
- Required **role assignments** at resource group scope for the Arc machine identity and the Azure Stack HCI resource provider service principal.
- **Edge device registration** (`Microsoft.AzureStackHCI/edgeDevices`) for the Arc node.

The cluster module is a local fork of the AVM module. The fork is not a divergence for its own sake. It carries specific fixes that the upstream module did not have at the time of writing and I will describe those in the next section.

### Staged deployment

The deployment happens in two stages, controlled by a single variable:

**Stage 1 (`is_exported = false`)**: Terraform creates the Key Vault, storage account, RBAC assignments and edge device registration, then submits `deploymentSettings` to Azure with `deploymentMode = Validate`. Azure runs a validation sequence that checks connectivity, Active Directory and node configuration. This takes roughly 10 to 30 minutes.

**Stage 2 (`is_exported = true`)**: After validation succeeds in the portal, you flip `is_exported` to `true` and run `terraform apply` again. This patches `deploymentMode` to `Deploy` and Azure starts the full cluster provisioning, which takes 30 to 60 minutes.

A second variable, `deployment_completed`, controls whether Terraform attempts to read post-deployment data sources like the custom location. Set it to `false` during and after deployment and flip it to `true` only after the Azure portal confirms the deployment is complete.

## What Broke and How I Fixed It

This section documents the real debugging journey. I am including it because if you try to use any version of the AVM module against a current Azure subscription, you will likely hit some of these same issues.

### Missing edgeDevices resource

The most impactful missing piece was the `Microsoft.AzureStackHCI/edgeDevices` resource. This resource registers each Arc machine with the HCI edge management system and lets the LcmController's ARM client communicate back to Azure. Without it, every deployment settings validation failed with:

```
Failed to download deployment settings file using edge Arm client
```

The upstream AVM module did not include this resource at all. Adding `edgedevices.tf` with the correct API version (`2025-09-15-preview`) and ensuring it depends on the RBAC assignments resolved the failure.

### Missing role assignments

The ARM QuickStart template assigns two roles to the Arc machine identity at resource group scope that the AVM module was not creating:

- `Azure Stack HCI Device Management Role`
- `Azure Stack HCI Connected InfraVMs`

Without these, the LcmController cannot install the required Arc extensions. I added `machine_rg_role_assign` in `rolebindings.tf` to mirror the ARM template behavior.

### API version changes

Between late 2024 and early 2025, the live Azure endpoint stopped accepting `networkingType` and `networkingPattern` as body fields. Sending them causes an HTTP 400 `ObjectAdditionalProperties` error. The fix is to omit them by setting both variables to empty strings; the `merge()` logic in `locals.tf` then drops them from the JSON body.

The API version itself also matters. The ARM QuickStart template uses `2025-09-15-preview` for both `Microsoft.AzureStackHCI/clusters` and `Microsoft.AzureStackHCI/clusters/deploymentSettings`. Using a newer preview version can change how the control plane processes the request. After several failed attempts with `2026-03-01-preview`, reverting to `2025-09-15-preview` was the right call.

### The LcmController 0.settings bug

This one took the most iterations to nail down and I want to be honest: I went down several wrong paths before finding the real cause. The full investigation trail, including the false leads and the intermediate workarounds I tried, is documented in the [CHANGELOG](https://github.com/schmittnieto/AzSHCI/blob/main/terraform/CHANGELOG.md) if you want the unfiltered version. I will keep this section to what actually matters.

The symptom was a BITS failure during validation:

```
Cannot bind argument to parameter 'Source' because it is an empty string.
```

The root cause is a type-checking bug in `DownloadHelpers.psm1` inside the `AzureEdgeLifecycleManager` Arc extension (NuGet package `10.2601.0.1162`). When Terraform creates `deploymentSettings`, Azure writes a minimal object to the LcmController runtime settings file that carries only cloud identity markers and no actual deployment payload. A null-check in `GetTargetBuildManifest` fails to detect this correctly because `[string]::IsNullOrEmpty()` returns `$false` for any non-null PowerShell object, even one with no useful content. The fallback that would download the cloud manifest never activates and the code ends up with four empty download URLs.

One important lesson from this: the four required Arc extensions (`AzureEdgeTelemetryAndDiagnostics`, `AzureEdgeDeviceManagement`, `AzureEdgeLifecycleManager`, `AzureEdgeRemoteSupport`) must be installed through the cluster creation process itself. Trying to pre-stage them manually before `terraform apply` is not only unnecessary, it can leave the node in a state where validation rejects it. Let Terraform handle the extension installation as part of Stage 1. The `03_TroubleshootingExtensions.ps1` script remains in the repository as a troubleshooting tool for environments where extensions end up in a `Failed` state after a previous failed apply, not as a required step in the normal flow.

## Step-by-Step Deployment

With all of the above in place, here is the actual deployment flow.

### Step 1: Azure prerequisites

Run `00_AzurePreRequisites.ps1`, select or create a resource group and either assign roles to your own account or let the script create a service principal. Note the SPN credentials if you created one. The full output of this script is shown in the [Prerequisites section above](#prerequisites-the-first-script).

### Step 2: Build the Hyper-V infrastructure

Run `00_Infra_AzHCI.ps1` to create the Hyper-V host infrastructure for the lab node. This step is identical to the one described in the [demolab article](/blog/azure-stack-hci-demolab/), so refer to it for a detailed walkthrough.

<a href="/assets/img/post/2026-04-17-azure-local-terraform/00_Infra_Overview.webp" target="_blank">
  <img src="/assets/img/post/2026-04-17-azure-local-terraform/00_Infra_Overview.webp" alt="Hyper-V infrastructure overview" style="border: 2px solid grey;">
</a>

### Step 3: Configure the domain controller

Run `01_DC.ps1` to set up Active Directory on the domain controller VM. Again, this step is identical to the one covered in the [demolab article](/blog/azure-stack-hci-demolab/).

<a href="/assets/img/post/2026-04-17-azure-local-terraform/01_DC_Setup.webp" target="_blank">
  <img src="/assets/img/post/2026-04-17-azure-local-terraform/01_DC_Setup.webp" alt="Domain controller setup" style="border: 2px solid grey;">
</a>

### Step 4: Register the node with Arc

Run `02_Cluster.ps1` to Arc-register the Azure Local node. Confirm the machine appears in Azure portal as an Arc-enabled server before continuing.

<a href="/assets/img/post/2026-04-17-azure-local-terraform/02_Cluster_ArcRegistration.webp" target="_blank">
  <img src="/assets/img/post/2026-04-17-azure-local-terraform/02_Cluster_ArcRegistration.webp" alt="Cluster Node Setup" style="border: 2px solid grey;">
</a>

<a href="/assets/img/post/2026-04-17-azure-local-terraform/02_Cluster_ArcPortal.webp" target="_blank">
  <img src="/assets/img/post/2026-04-17-azure-local-terraform/02_Cluster_ArcPortal.webp" alt="Arc node in Azure portal" style="border: 2px solid grey;">
</a>

### Step 5: Configure Terraform variables

Copy `terraform/terraform.tfvars.example` to `terraform/terraform.tfvars`. Replace every `TODO` value with your actual credentials and network settings. Key variables for a single-node lab:

```hcl
management_adapters = ["MGMT1"]
rdma_enabled        = false
networking_type     = ""
networking_pattern  = ""
witness_type        = ""
is_exported         = false
deployment_completed = false
```

### Step 6: Authenticate with Azure CLI

Terraform uses the Azure CLI session to authenticate. Log in with the service principal created in Step 1 and set the target subscription:

```powershell
az login --service-principal `
    --username "<app-id>" `
    --password "<client-secret>" `
    --tenant "<tenant-id>"
az account set --subscription "<subscription-id>"
```

### Step 7: Initialize and run Stage 1 (Validate)

```powershell
terraform init
terraform plan
terraform apply
```

Review the plan output before confirming the apply. Terraform creates the Key Vault, storage account, RBAC assignments and edge device registration, then submits the deployment settings to Azure for validation.

<a href="/assets/img/post/2026-04-17-azure-local-terraform/TF_Init.webp" target="_blank">
  <img src="/assets/img/post/2026-04-17-azure-local-terraform/TF_Init.webp" alt="terraform init output" style="border: 2px solid grey;">
</a>

<a href="/assets/img/post/2026-04-17-azure-local-terraform/TF_Plan_Stage1.webp" target="_blank">
  <img src="/assets/img/post/2026-04-17-azure-local-terraform/TF_Plan_Stage1.webp" alt="terraform plan output Stage 1" style="border: 2px solid grey;">
</a>

<a href="/assets/img/post/2026-04-17-azure-local-terraform/TF_Apply_Stage1_Validate.webp" target="_blank">
  <img src="/assets/img/post/2026-04-17-azure-local-terraform/TF_Apply_Stage1_Validate.webp" alt="Stage 1 apply complete" style="border: 2px solid grey;">
</a>

Validation runs as part of the apply itself. Once Terraform reports the apply as complete, Stage 1 is done (takes arround 90 minutes) and you can move straight to Stage 2.

### Step 8: Switch to Stage 2 (Deploy)

Set `is_exported = true` in `terraform.tfvars` and run `terraform apply` again. Terraform patches `deploymentMode` to `Deploy` and Azure starts the full cluster provisioning. This apply will run for 90 to 180 minutes while Azure works through the FullCloudDeployment plan.

<a href="/assets/img/post/2026-04-17-azure-local-terraform/TF_Apply_Stage2.webp" target="_blank">
  <img src="/assets/img/post/2026-04-17-azure-local-terraform/TF_Apply_Stage2.webp" alt="Stage 2 terraform apply" style="border: 2px solid grey;">
</a>

While Terraform is waiting, you can follow the deployment progress in real time in the Azure portal under the Azure Local resource. Each step of the plan is shown individually, which makes it much easier to spot a failure early rather than waiting for a Terraform timeout.

<a href="/assets/img/post/2026-04-17-azure-local-terraform/TF_Portal_Deploying.webp" target="_blank">
  <img src="/assets/img/post/2026-04-17-azure-local-terraform/TF_Portal_Deploying.webp" alt="Azure portal showing deployment steps in progress" style="border: 2px solid grey;">
</a>

Once the apply finishes and all steps complete successfully, this is what it looks like from both sides. First, the Terraform output confirming all resources were created:

<a href="/assets/img/post/2026-04-17-azure-local-terraform/TF_Apply_Stage2_completed.webp" target="_blank">
  <img src="/assets/img/post/2026-04-17-azure-local-terraform/TF_Apply_Stage2_completed.webp" alt="Terraform apply Stage 2 complete" style="border: 2px solid grey;">
</a>

And the Azure portal showing the cluster as successfully deployed:

<a href="/assets/img/post/2026-04-17-azure-local-terraform/TF_Portal_Deployed.webp" target="_blank">
  <img src="/assets/img/post/2026-04-17-azure-local-terraform/TF_Portal_Deployed.webp" alt="Azure portal showing deployment complete" style="border: 2px solid grey;">
</a>

### Step 9: Enable post-deployment outputs

Once the portal confirms the deployment is complete and Terraform finishes the apply, set `deployment_completed = true` in `terraform.tfvars` and run `terraform apply` once more. This allows Terraform to read the custom location output that is only available after the Azure deployment engine finishes.

<a href="/assets/img/post/2026-04-17-azure-local-terraform/TF_Apply_Stage2_Complete.webp" target="_blank">
  <img src="/assets/img/post/2026-04-17-azure-local-terraform/TF_Apply_Stage2_Complete.webp" alt="Terraform apply complete with post-deployment outputs" style="border: 2px solid grey;">
</a>

## Recovery Helpers

If a `terraform apply` times out or you lose Terraform state after a successful apply, the configuration includes two recovery variables to help you get back on track without destroying and rebuilding:

- **`import_deployment_settings`** (`bool`, default `false`): When `true`, imports the pre-existing `deploymentSettings/default` into state before the plan phase. Use this when a previous apply timed out but the resource already exists in Azure.

- **`import_machine_rg_role_assignment_ids`** (`map(string)`, default `{}`): When the `machine_rg_role_assign` role assignments already exist in Azure and a new apply would fail with `409 Conflict`, populate this map with the existing assignment GUIDs (visible in the 409 error message) and run `terraform apply` to import them. Reset to `{}` afterward.

If the Arc machine was manually deleted from Azure and you need to run `terraform destroy`, set `enable_cluster_module = false` to skip the cluster module and avoid failing Arc data-source lookups.

It is also worth noting that the cluster deployment creates additional Azure resources such as Arc extensions and logical networks that are lifecycle-managed by the cluster resource itself: they are created and destroyed together with it, so they do not need to be imported separately. The custom location is the exception, it is the only post-deployment resource that Terraform captures in state and exposes as an output, since workload modules (AVD, AKS) need to reference it. Everything else is handled by Azure as part of the cluster's own lifecycle.

## What Is Next

The cluster deployment is the foundation. The repository's goal from the start has been to automate the full workload lifecycle on top of Azure Local, not just the cluster itself. The next steps are:

- **Azure Virtual Desktop**: A Terraform module for AVD host pools, session hosts and workspace configuration, deployable against the custom location created by the cluster deployment.
- **AKS on Azure Local**: Terraform for AKS cluster creation using the Arc-enabled Kubernetes stack, scoped to the same resource group and custom location.
- **Pipelines**: GitHub Actions or Azure DevOps pipeline definitions that call these Terraform configurations using the service principal created by `00_AzurePreRequisites.ps1`. The goal is a single pipeline trigger that goes from a fresh Arc-registered node to a fully deployed cluster with workloads.

If you have questions, hit issues, or have already gone through a similar Terraform journey with Azure Local, I would love to hear from you in the comments below. The repository is public and pull requests are welcome.
