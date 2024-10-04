---
title: "Azure Stack HCI: Demolab"
excerpt: "Streamline your Azure Stack HCI deployment on minimal hardware with the AzSHCI scripts. This guide compares existing solutions and provides a step-by-step deployment process for efficient testing and development."
date: 2024-10-04
categories:
  - Blog
tags:
  - Chronicloud Series
  - Azure Stack HCI

header:
  teaser: "/assets/img/post/2024-10-04-azure-stack-hci-demolab.webp"
  image: "/assets/img/post/2024-10-04-azure-stack-hci-demolab.webp"
  og_image: "/assets/img/post/2024-10-04-azure-stack-hci-demolab.webp"
  overlay_image: "/assets/img/post/2024-10-04-azure-stack-hci-demolab.webp"
  overlay_filter: 0.5
  caption: "Photo credit: [**ChatGPT**](https://chatgpt.com)"

toc: true
toc_label: "Topics Overview" 
toc_icon: "list-ul"
---

## Introduction

Azure Stack HCI is a hyperconverged infrastructure solution that combines software-defined compute, storage, and networking. While it's a powerful tool for modernizing your data center and integrating with Azure services, setting it up for testing or development can be resource-intensive.

Deploying Azure Stack HCI can often seem daunting, especially when constrained by hardware resources. Traditional methods typically require substantial infrastructure, making it challenging for individuals or small teams to set up testing and lab environments. In this article, I'll explore a streamlined approach using the **AzSHCI** scripts, which allow you to deploy Azure Stack HCI on minimal hardware setups, such as a laptop.

### Existing Solutions and Their Limitations

Several tools and guides exist to help deploy Azure Stack HCI in lab environments. However, they often come with limitations that make them less suitable for minimal hardware setups.

#### MSLab by Jaromir Kaspar

[MSLab](https://github.com/microsoft/MSLab) is a comprehensive solution that allows you to deploy various Microsoft products in a lab environment.

- **Pros:**
  - Supports a wide range of scenarios and configurations.
  - Highly customizable and feature-rich.
  - Served as the foundation for my lab setups for a long time.

- **Cons:**
  - The latest versions, such as Azure Stack HCI 2408, have not been updated and are somewhat discontinued.
  - Setup process involves more steps and hardware resources compared to AzSHCI.

Additionally, the [DellGEOS Repository](https://github.com/DellGEOS/AzureStackHOLs) offers more current scenarios and use cases. Most scenarios in the DellGEOS repository are designed for infrastructures somewhat more robust than a simple laptop. In the past, DellGEOS has been the base for my configurations on Azure Stack HCI with Dell hardware, providing very current troubleshooting scenarios.

#### Azure Arc Jumpstart by Lior Kamrat

[Azure Arc Jumpstart](https://azurearcjumpstart.io/) provides automated deployment scenarios for Azure Arc-enabled resources.

- **Pros:**
  - Automates Azure Arc deployments with ease.
  - Contains beautifully documented infrastructure with detailed diagrams.

- **Cons:**
  - Makes it difficult to carry out PoCs that extend beyond HCI, such as AVD on HCI.
  - Lack of flexibility in networking due to virtualization and Azure-based implementation, limiting access to VM consoles.
  - Costs approximate around $3,000 per month, not accounting for additional expenses. [Cost Details](https://aka.ms/JumpstartHCIBoxCost)

#### Manual Deployment

Deploying Azure Stack HCI manually using the [Deployment Guide](https://learn.microsoft.com/en-us/azure-stack/hci/deploy/deployment-virtual) is another option. However, this manual approach has several drawbacks:

- **Pros:**
  - Direct control over the deployment process.

- **Cons:**
  - The configuration hasn't been updated since April this year.
  - Missing steps and incomplete documentation make the process cumbersome.
  - Performing a manual deployment is much more tedious and time-consuming compared to using AzSHCI scripts.

### Why AzSHCI?

The **AzSHCI** scripts are designed to bridge this gap by providing a lightweight, efficient way to deploy Azure Stack HCI on minimal hardware. Key advantages include:

- **Resource Efficiency:** Optimized for environments with limited CPU, RAM, and storage.
- **Simplicity:** Straightforward scripts that are easy to understand and modify.
- **Quick Deployment:** Allows you to set up a single-node Azure Stack HCI cluster rapidly for testing and development.

## Prerequisites

Before you begin, ensure you meet the following requirements:

- **Hardware Requirements:**
  - A computer with a **TPM chip**.
  - A **processor** capable of running Hyper-V.
  - **Recommended RAM:** 64 GB or more.
  - **Minimum RAM for Basic Testing:** 32 GB.

- **Software Requirements:**
  - **Azure Subscription:** With the necessary permissions.
  - **ISO Files:**
    - **Windows Server 2025 Evaluation:** [Download Here](https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2025)
    - **Azure Stack HCI OS:** Download directly from the Azure Portal.

- **Directory Setup:**
  - Store your ISO files in `C:\ISO`.


## Getting Started with AzSHCI

### Repository Overview

The **AzSHCI** scripts are hosted on GitHub: [github.com/schmittnieto/AzSHCI](https://github.com/schmittnieto/AzSHCI)

The repository is structured as follows:

```
AzSHCI/
│
├── scripts/
│   └── 01Lab/
│       ├── 00_Infra_AzHCI.ps1
│       ├── 01_DC.ps1
│       ├── 02_Cluster.ps1
│       ├── 03_TroubleshootingExtensions.ps1
│       ├── 99_Offboarding.ps1
│
├── README.md
└── LICENSE
```

### Script Breakdown

#### 00_Infra_AzHCI.ps1

**Configuration and VM Creation Script**

- **Purpose:** Sets up virtual networking, creates necessary folder structures, and deploys both the HCI node and Domain Controller VMs.
- **Features:**
  - Configures an internal virtual switch with NAT.
  - Creates directories for VM and disk storage.
  - Automates VM creation and initial configuration.

#### 01_DC.ps1

**Domain Controller Configuration Script**

- **Purpose:** Configures the Domain Controller VM, including network settings and Active Directory setup.
- **Features:**
  - Removes ISO media from the VM.
  - Renames the VM and sets static IP.
  - Sets the time zone and installs necessary Windows features.
  - Promotes the server to a Domain Controller.
  - Configures DNS forwarders and creates Organizational Units (OUs) in Active Directory.

#### 02_Cluster.ps1

**Cluster Node Configuration Script**

- **Purpose:** Configures the Azure Stack HCI node VM.
- **Features:**
  - Removes ISO media from the VM.
  - Creates a setup user and renames the VM.
  - Configures network adapters with static IPs and RDMA.
  - Installs essential Windows features like Hyper-V and Failover Clustering.
  - Registers the node with Azure Arc and integrates Azure services.

#### 03_TroubleshootingExtensions.ps1

**Troubleshooting Azure Connected Machine Extensions**

- **Purpose:** Manages Azure Connected Machine extensions for the HCI nodes.
- **Features:**
  - Installs required PowerShell modules (`Az.Compute` and `Az.StackHCI`) if not already installed.
  - Connects to Azure using device code authentication and allows you to select a subscription and resource group.
  - Retrieves Azure Arc VMs from Azure using `Az.StackHCI`, filtering for machines with `CloudMetadataProvider` set to "AzSHCI".
  - Validates that required Azure Connected Machine extensions are installed.
  - Fixes any failed extensions by removing locks, deleting, and reinstalling them.
  - Adds any missing extensions based on a predefined list.

#### 99_Offboarding.ps1

**Offboarding Script to Clean Up Configurations**

- **Purpose:** Cleans up the deployment by removing VMs, associated VHD files, virtual switches, NAT settings, and designated folder structures.
- **Features:**
  - Stops and removes specified VMs.
  - Deletes associated virtual hard disk (VHD) files.
  - Removes virtual switches and NAT configurations.
  - Cleans up folder structures.


## Step-by-Step Deployment Guide

### 1. Cloning the Repository

Open PowerShell and run:

```
git clone https://github.com/schmittnieto/AzSHCI.git
```

### 2. Preparing Your Environment

Navigate to the scripts directory:

```
cd AzSHCI/scripts/01Lab
```

Ensure your execution policy allows script execution:

```
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 3. Modifying Script Variables

Before running the scripts, open each `.ps1` file and modify the variables in the **Variable Region** to match your environment and requirements. Specifically, add your local administrator credentials to the `$defaultUser` and `$defaultPwd` variables within the scripts.

### 4. Executing the Scripts

#### Initialize Infrastructure and Create VMs

Run the following command:

```
.\00_Infra_AzHCI.ps1
```
<!-- 00INFRA:START -->

<!-- 00INFRA:END -->

#### Configure Domain Controller

Before running `01_DC.ps1`, ensure the VM is powered on and Windows Server is installed (no need to install any roles). Add your local administrator credentials to the `$defaultUser` and `$defaultPwd` variables in the script.

Run:

```
.\01_DC.ps1
```
<!-- 01DC:START -->

<!-- 01DC:END -->

This process will take approximately 20 minutes as it installs Windows Updates, creates Organizational Units (OUs), and sets up the necessary administrator for the cluster as defined in the script variables.

#### Configure Cluster Node

After successfully running `01_DC.ps1`, proceed to install the cluster node. Update the `$defaultUser` and `$defaultPwd` variables in `02_Cluster.ps1` with your local administrator credentials.

Run:

```
.\02_Cluster.ps1
```
<!-- 02CLUSTER:START -->

<!-- 02CLUSTER:END -->

This script will prompt you to register the node with Azure upon completion, approximately 4-5 minutes into the execution.

#### Troubleshoot Extensions (Optional)

If you encounter issues with Azure Connected Machine extensions, run:

```
.\03_TroubleshootingExtensions.ps1
```

<!-- 03TROUBLESHOOTING:START -->

<!-- 03TROUBLESHOOTING:END -->

#### Cleanup and Offboarding (if errors occur during the process)

Run:

```
.\99_Offboarding.ps1
```

<!-- 99OFFBOARDING:START -->

<!-- 99OFFBOARDING:END -->

### 5. Registering the Cluster

*This section will be detailed in a future update, complete with step-by-step instructions and screenshots.*

Once the cluster node script completes, follow these steps to register your cluster in Azure:

1. **Verify Extensions Installation:**
   - Ensure that the node's extensions have been installed successfully. If not, use the troubleshooting script.
   - ![Extension](/assets/img/post/2024-10-04-azure-stack-hci-demolab/extensions.png)

2. **Assign Required Rights:**

   - **Subscription Level:**
     - If not an Owner or Contributor, assign the following roles to the user performing the registration:
       - Azure Stack HCI Administrator
       - Reader

   - **Resource Group Level:**
     - Assign the following roles to the user within the Resource Group where deployment will occur:
       - Key Vault Data Access Administrator
       - Key Vault Secrets Officer
       - Key Vault Contributor
       - Storage Account Contributor

   - **Microsoft Entra Roles and Administrators:**
     - Assign the following role to the user performing the deployment:
       - Cloud Application Administrator

   *In the near future, I plan to automate this process (granting granular rights to a user for deployment) using a script.*

3. **Initial Cluster Registration:**

   - Use the Azure Portal for initial cluster registration: [Azure Stack HCI Deployment via Portal](https://learn.microsoft.com/en-us/azure-stack/hci/deploy/deploy-via-portal)
   
   - **Network Configuration:**
     - Apply the following network settings to the interfaces:
       - ![Network Configuration](/assets/img/post/2024-10-04-azure-stack-hci-demolab/networkconfiguration.png)
     - Personally, I use the following IP configurations:
       - ![IP Configuration](/assets/img/post/2024-10-04-azure-stack-hci-demolab/ipconfiguration.png)

   - **Custom Location and User Configuration:**
     - Configure users and custom locations as defined in the scripts (credentials are exposed in the scripts):
       - ![AD Configuration](/assets/img/post/2024-10-04-azure-stack-hci-demolab/adconfiguration.png)

   - **Security Options:**
     - It's crucial to disable BitLocker to prevent excessive storage consumption (totaling 2.1 TB), which could render your system inoperable if you lack sufficient capacity:
       - ![Security Options](/assets/img/post/2024-10-04-azure-stack-hci-demolab/securityoptions.png)

   - **Finalize Configuration:**
     - Leave the remaining settings at default. The system will be ready for provisioning after the validation, which take approximately 20 minutes.

4. **Perform Cloud Deployment:**

   - Initiate the cloud deployment and wait approximately 2 hours for the cluster to be ready for subsequent steps.


## Conclusion

By following these steps, you should have a functional Azure Stack HCI environment running on minimal hardware. The **AzSHCI** scripts are designed to make the deployment process as smooth as possible, allowing you to focus on exploring Azure Stack HCI features without worrying about extensive setup procedures.


## Additional Resources

- **AzSHCI GitHub Repository:** [github.com/schmittnieto/AzSHCI](https://github.com/schmittnieto/AzSHCI)
- **MSLab Repository:** [github.com/microsoft/MSLab](https://github.com/microsoft/MSLab)
- **DellGEOS AzureStackHOLs:** [github.com/DellGEOS/AzureStackHOLs](https://github.com/DellGEOS/AzureStackHOLs)
- **Azure Arc Jumpstart:** [azurearcjumpstart.io](https://azurearcjumpstart.io/)
- **Azure Stack HCI Documentation:** [Microsoft Docs](https://docs.microsoft.com/en-us/azure-stack/hci/)


## Future Enhancements

Planned updates include:

- **Azure Kubernetes Service (AKS) Integration** 
- **Azure Virtual Desktop (AVD) Deployment** 
- **Azure Arc Managed VMs Setup** 

In the coming weeks, I will add more tests and case studies, providing detailed articles to cover these topics comprehensively.

Stay tuned for these updates!

## Contributing

Contributions are welcome! If you have suggestions, improvements, or bug fixes, feel free to fork the repository and submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or issues, please open an [issue](https://github.com/schmittnieto/AzSHCI/issues) in the repository.


Thank you for using **AzSHCI**! I hope these scripts simplify your Azure Stack HCI deployment process and enable efficient testing and development in your environment.


