---
title: "Azure Local: VM Deployment"
excerpt: "Deploy VMs on Azure Local easily and discover the process, management features, and benefits of integrated VM deployments."
date: 2024-11-02
last_modified_at: 2025-05-05
categories:
  - Blog
tags:
  - Chronicloud Series
  - Azure Stack HCI
  - Azure Local

sticky: false

redirect_from:
  - /blog/azure-local-vm-deployment/
  - /blog/azure-stack-hci-vm-deployment/

header:
  teaser: "/assets/img/post/2024-11-02-azure-stack-hci-vmdeployment.webp"
  image: "/assets/img/post/2024-11-02-azure-stack-hci-vmdeployment.webp"
  og_image: "/assets/img/post/2024-11-02-azure-stack-hci-vmdeployment.webp"
  overlay_image: "/assets/img/post/2024-11-02-azure-stack-hci-vmdeployment.webp"
  overlay_filter: 0.5
  caption: "Photo credit: [**ChatGPT**](https://chatgpt.com)"

toc: true
toc_label: "Topics Overview" 
toc_icon: "list-ul"

sidebar:
  nav: "Azurelocal"
  
---

This article was created before Azure Stack HCI was renamed to Azure Local ([link](https://learn.microsoft.com/en-us/azure/azure-local/rename-to-azure-local?view=azloc-24112)) in November 2024, which is why some references or hardcoded URLs may still point to Azure Stack HCI. However, the content has been updated accordingly, and if you find any errors, I would greatly appreciate it if you could report them either through the comment function or by emailing blog@schmitt-nieto.com
{: .notice--info}

## Azure Local VM Deployment

Welcome back to the [Chronicloud Series](/blog/chronicloud-series/)! If you've been following along, you should have successfully set up your **Azure Local DemoLab** and optimized it with **Day 2 Operations**. In the previous articles, [Azure Local DemoLab](/blog/azure-stack-hci-demolab/) and [Azure Local: Day2 Operations](/blog/azure-stack-hci-day2/), we walked you through the initial setup and essential post-deployment configurations. Now, it's time to take the next step: deploying virtual machines (VMs) on your Azure Local environment.

This article will guide you through the **Azure Local VM Deployment** process using the **Azure Arc Resource Bridge**. We'll cover the deployment steps, management capabilities from both cluster and VM perspectives, and highlight the advantages of using Azure Local-integrated Arc VMs. Additionally, we'll discuss manual deployment methods and introduce a custom script from the **AzSHCI** repository to streamline VM access.

## Prerequisites

Before diving into VM deployment, ensure that you have completed the following:

1. **Azure Local DemoLab** setup.
2. **Azure Local Day 2 Operations** configured.

These foundational steps are crucial for a smooth VM deployment experience.

## Deploying VMs over Azure Arc Resource Bridge

The **Azure Arc Resource Bridge** plays a pivotal role in deploying and managing VMs on Azure Local. Here's a step-by-step overview of the deployment process:

### 1. Initiate VM Deployment from Azure

You can start deploying a VM using various methods such as the Azure Portal, Azure CLI, ARM templates, Bicep, or Terraform. Since we've already managed VM images in the Day 2 Operations, we'll now focus on creating Arc VMs using those images.

Steps to create an Arc VM via Azure Portal:

1. **Sign In and Navigate**: Log in to the Azure Portal and navigate to your Azure Local cluster resource.

2. **Access Virtual Machines**: In your cluster resource, go to Virtual machines and click on **+ Create VM**.
<a href="/assets/img/post/2024-11-02-azure-stack-hci-demolab-vmdeployment/01.png" target="_blank">
  <img src="/assets/img/post/2024-11-02-azure-stack-hci-demolab-vmdeployment/01.png" alt="Deploying VM Azure Local 01" style="border: 2px solid grey;">
</a>

3. **Fill in Project Details**:
   - **Subscription**: Choose the subscription you wish to use.
   - **Resource Group**: Select an existing resource group or create a new one.

4. **Configure Instance Details**:
   - **Virtual Machine Name**: Enter a name following Azure's naming conventions (lowercase letters, numbers, and hyphens).
   - **Custom Location**: Select the custom location associated with your Azure Local cluster.
   - **Security Type**: Choose between Standard or Trusted Launch VMs.
   - **Storage Path**: Select a storage path for your VM's files. You can let Azure choose automatically or specify manually.
   - **Image**: Select the VM image you've previously downloaded, such as `Windows Server 2022 Datacenter: Azure Edition`.
   - **Administrator Account**: Provide a username and password for the VM's local administrator account.
   - **Virtual Processor Count**: Specify the number of vCPUs.
   - **Memory**: Allocate the desired amount of memory in MB.
   - **Memory Type**: Choose between static or dynamic memory.**This cannot be changed after deployment**.
<a href="/assets/img/post/2024-11-02-azure-stack-hci-demolab-vmdeployment/02.png" target="_blank">
  <img src="/assets/img/post/2024-11-02-azure-stack-hci-demolab-vmdeployment/02.png" alt="Deploying VM Azure Local 02" style="border: 2px solid grey;">
</a>

5. **Enable Guest Management**:
   - In the **VM extensions** section, enable **Guest Management** to allow for extensions and Arc integration.
<a href="/assets/img/post/2024-11-02-azure-stack-hci-demolab-vmdeployment/03.png" target="_blank">
  <img src="/assets/img/post/2024-11-02-azure-stack-hci-demolab-vmdeployment/03.png" alt="Deploying VM Azure Local 03" style="border: 2px solid grey;">
</a>

6. **Domain Join (Optional)**:
   - If you wish to domain join the VM, enable **Domain Join** and provide the necessary Active Directory credentials.
<a href="/assets/img/post/2024-11-02-azure-stack-hci-demolab-vmdeployment/04.png" target="_blank">
  <img src="/assets/img/post/2024-11-02-azure-stack-hci-demolab-vmdeployment/04.png" alt="Deploying VM Azure Local 04" style="border: 2px solid grey;">
</a>

7. **Add Disks (Optional)**:
   - Add additional disks if required, specifying their size, provisioning type, and storage path.

8. **Configure Networking**:
   - Add at least one network interface. If you've enabled guest management, this step is mandatory.
   - Configure the network settings, including IP allocation methods and static IPs if needed.
<a href="/assets/img/post/2024-11-02-azure-stack-hci-demolab-vmdeployment/05.png" target="_blank">
  <img src="/assets/img/post/2024-11-02-azure-stack-hci-demolab-vmdeployment/05.png" alt="Deploying VM Azure Local 05" style="border: 2px solid grey;">
</a>

9. **Review and Create**:
   - Review all the configurations and click **Create** to initiate the deployment.

### 2. Azure Arc Resource Bridge Handles Deployment

Once you've initiated the deployment, the **Azure Arc Resource Bridge** takes over:

- **Parameter Transmission**: All deployment parameters are sent to the Arc Resource Bridge.
- **VM Creation**: The Arc Resource Bridge communicates with your Azure Local cluster to create the VM based on the provided specifications.

### 3. Post-Deployment Processes

After the VM is created, several processes are automatically initiated:

#### a. Azure Arc Registration

If **Guest Management** is enabled, the VM is registered with **Azure Arc** upon its first boot. This registration is facilitated through the **Arc Resource Bridge**, ensuring seamless integration without direct registration as with conventional Arc VMs.

#### b. Domain Join

If you've opted for **Domain Join** during deployment, the VM will automatically join the specified domain using VM scripts and the **Arc Agent**, streamlining the process and ensuring compliance with your organization's policies.

<a href="/assets/img/post/2024-11-02-azure-stack-hci-demolab-vmdeployment/06.png" target="_blank">
  <img src="/assets/img/post/2024-11-02-azure-stack-hci-demolab-vmdeployment/06.png" alt="Deploying VM Azure Local 06" style="border: 2px solid grey;">
</a>

## Managing Deployed VMs

Once your VMs are up and running, you have comprehensive management capabilities from both the **Cluster** and **VM** perspectives.

### Cluster Perspective

From the cluster's viewpoint, you can manage the following aspects of all VMs deployed via Azure:

- **CPU and RAM Allocation**: Adjust CPU cores and memory allocations within predefined limits. Note that changing any of these parameters will result in a **restart of the VM without warning**.

- **Storage Management**: Add additional storage disks to VMs. However, you cannot modify the `DiskPath` where the VM or its disks reside within the cluster.

- **Network Configuration**: Add new network interfaces to VMs. Existing network interfaces cannot be altered, and configurations cannot be mixed or modified directly from Azure.

**Note:** The Arc VMs provisioned on Azure Local offer more options than traditional Arc VMs, specifically related to cluster resource management like **Disk**, **Size**, and **Networking**. This enhanced functionality allows for better integration and management of resources directly from the Azure Portal.

<a href="/assets/img/post/2024-11-02-azure-stack-hci-demolab-vmdeployment/07.png" target="_blank">
  <img src="/assets/img/post/2024-11-02-azure-stack-hci-demolab-vmdeployment/07.png" alt="Deploying VM Azure Local 07" style="border: 2px solid grey;">
</a>

### VM Perspective

From the VM's perspective, management is akin to managing any VM in **Azure Arc**:

- **Extensions**: Install and manage extensions to enhance VM functionality.

- **Policies**: Apply and enforce policies to ensure compliance and security.

- **Azure Update Manager**: Manage and automate updates to keep VMs secure and up-to-date.

- **Machine Configuration**: Define configurations and enforce compliance settings on your VM to ensure it meets specific criteria and standards.

- **Automanage**: Simplify VM management by automatically applying best practices for configuration, security, and compliance.

- **Run Command (Preview)**: Execute PowerShell scripts or commands directly on the VM from the Azure Portal without needing a direct connection.

- **Inventory**: Collect and view inventory data about software installed on the VM, aiding in asset management and compliance.

- **Change Tracking**: Monitor and track changes to the VM's infrastructure, including files, registry keys, services, and software.

- **Monitoring Capabilities**: Leverage Azure Monitor to gain insights into the VM's performance, health, and availability, allowing for proactive management.

<a href="/assets/img/post/2024-11-02-azure-stack-hci-demolab-vmdeployment/08.png" target="_blank">
  <img src="/assets/img/post/2024-11-02-azure-stack-hci-demolab-vmdeployment/08.png" alt="Deploying VM Azure Local 08" style="border: 2px solid grey;">
</a>

## Advantages of Azure Local-Integrated Arc VMs

Deploying VMs through Azure Local-integrated **Azure Arc** offers significant benefits over conventional Arc VMs:

- **Cost Efficiency**: Integrated Arc VMs on Azure Local do not incur additional costs for services like **Policies**, **Azure Update Manager**, or **Extended Security Updates**. This ensures predictable and lower operational costs.

- **Seamless Integration**: Enhanced integration with Azure services, providing a unified management experience without the overhead of managing separate billing for additional services.

## Manual VM Deployment Methods

While deploying VMs via Azure Arc Resource Bridge offers numerous advantages, there are alternative methods for manual deployment:

- **PowerShell**: Deploy VMs using PowerShell scripts.
- **Windows Admin Center (WAC)**: Utilize the WAC interface for VM deployment.
- **Failover Cluster Manager**: Deploy directly through the Cluster Manager.

However, manually deployed VMs have limitations:

- **Azure Portal Visibility**: These VMs do not appear in the Azure Portal as they are not registered with Azure Arc. This hampers uniform management across all VMs.

- **Management Challenges**: Lack of integration with Azure Arc features like Policies and Update Manager can lead to inconsistent management practices.

Microsoft is actively working on solutions to "rehydrate" these manually deployed VMs, ensuring they can be integrated into Azure Arc for unified management. Currently, a workaround is available, detailed in [Kenny Lowe's blog](https://www.kennylowe.org/2024/06/03/migrate-to-hci.html/), which we'll explore in a future article on VM migration to Azure Local.

## Enhancing VM Access with Custom Scripts

To streamline VM access without exposing firewall ports, I've configured a custom script in the **AzSHCI** repository. This script sets up the **OpenSSH** extension on Windows servers and establishes an RDP connection using SSH tunneling. 

**Key Points:**

- **Script Location**: The script is available in my [AzSHCI GitHub repository](https://github.com/schmittnieto/AzSHCI/tree/main/scripts/03VMDeployment/20_SSHRDPArcVM.ps1).

- **Functionality**: It configures the OpenSSH server on your VMs and allows secure RDP access without opening additional firewall ports.

- **Based On**: The script is inspired by [Alexander Ortha's article](https://www.linkedin.com/pulse/azurearc-using-rdp-ssh-alexander-ortha-7sxae/), but I've modified it to rely more on PowerShell and less on the Azure CLI for a streamlined process.

By using this script, you can securely manage your VMs without big changes on your network security, making remote administration more convenient.

<a href="/assets/img/post/2024-11-02-azure-stack-hci-demolab-vmdeployment/99.png" target="_blank">
  <img src="/assets/img/post/2024-11-02-azure-stack-hci-demolab-vmdeployment/99.png" alt="RDP over SSH on Arc VM" style="border: 2px solid grey;">
</a>

## Conclusion

Deploying VMs on **Azure Local** using the **Azure Arc Resource Bridge** streamlines the integration between your on-premises infrastructure and Azure services. By following the steps outlined in this article, you can efficiently deploy, manage, and optimize your VMs while maintaining cost-effectiveness and operational excellence.

From initiating deployments through the Azure Portal or infrastructure-as-code tools to managing resources from both cluster and VM perspectives, Azure Local provides a robust and flexible environment for your virtual workloads. The advantages of integrated Arc VMs, combined with the ability to enhance access through custom scripts, make Azure Local a compelling choice for modern hybrid cloud deployments.

Stay tuned for upcoming articles where we'll delve into:

- Setting up and managing **Azure Virtual Desktop (AVD)** on Azure Local
- Deploying and managing **AKS (Azure Kubernetes Service)** on Azure Local

Thank you for following along, and I look forward to hearing about your **Azure Local** deployment experiences!


