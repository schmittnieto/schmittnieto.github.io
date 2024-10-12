---
title: "Azure Stack HCI: Demolab"
excerpt: "Streamline your Azure Stack HCI deployment on minimal hardware with the AzSHCI scripts. This guide compares existing solutions and provides a step-by-step deployment process for efficient testing and development."
date: 2024-10-04
last_modified_at: 2024-10-05
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
toc_min_header: 1
toc_max_header: 2
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



## Getting Started with AzSHCI

### Understanding Nested Virtualization

The **AzSHCI** scripts leverage **Nested Virtualization** to create a fully functional Azure Stack HCI environment within your existing hypervisor setup. This means you can run virtual machines (VMs) inside other VMs, allowing you to simulate a complex infrastructure on minimal hardware.

The deployment process involves the following key steps:

- **Installation of Windows Server 2025 Evaluation**: The scripts automate the setup of a Windows Server 2025 VM, which will be configured as an Active Directory Domain Controller (DC). This includes installing updates and preparing the environment for cluster registration, which is essential for setting up Azure Stack HCI.

- **Setup of the Azure Stack HCI Node**: Another VM is created to serve as the Azure Stack HCI node. Thanks to Nested Virtualization, this node can act as a hypervisor itself, allowing you to run additional workloads or services on top of it.

By utilizing Nested Virtualization, you can simulate a realistic Azure Stack HCI deployment without the need for extensive physical hardware, making it ideal for testing and development purposes.


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

Below is the exact deployment process to set up your Azure Stack HCI environment using the **AzSHCI** scripts. This guide will help you get everything up and running smoothly.

### 1. Download the Scripts from the Repository

Clone the **AzSHCI** repository to your local machine:

```
git clone https://github.com/schmittnieto/AzSHCI.git
```

Or download the repository manually: [Download Here](https://github.com/schmittnieto/AzSHCI/archive/refs/heads/main.zip)

### 2. Download the Necessary ISO Files

- **Windows Server 2025 Evaluation ISO**: [Download Here](https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2025)
- **Azure Stack HCI OS ISO**: Download directly from the Azure Portal.

Place both ISO files in the `C:\ISO` directory and rename the isos if you consider it convenient, for example I renamed the Azure Stack HCI iso to `HCI23H2.iso` and the Windows Server 2025 iso to `W2025.iso`.

### 3. Preparing Your Environment

Navigate to the scripts directory:

```
cd AzSHCI/scripts/01Lab
```

Ensure your execution policy allows script execution:

```
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 4. Initial infrastructure script

Considering that you are in the scripts folder, make sure to change the iso variables (`$isoPath_HCI = “C:\ISO\HCI23H2.iso”` and `$isoPath_DC = “C:\ISO\WS2025.iso”`) in the `00_Infra_AzHCI.ps1` script to match yours.

The you can run the script:

```
.\00_Infra_AzHCI.ps1
```

This script will set up the virtual networking, create necessary folder structures, and deploy the VMs for the Domain Controller (DC) and the Azure Stack HCI node.


### 5. Manual Installation of the DC Operating System

- **Start the DC VM**: Open Hyper-V Manager and start the `DC` VM.
- **Follow the Installation Wizard**: Proceed through the Windows Server 2025 installation wizard.
- **Perform First Login**: Log in as the Administrator for the first time.

No additional configuration is needed at this stage.

### 6. Domain Controller configuration script

Before running the script, modify the `$defaultUser` and `$defaultPwd` variables in `01_DC.ps1` to match your administrator credentials.

```
# In 01_DC.ps1
$defaultUser = "Administrator"
$defaultPwd = "YourAdminPassword"
```

Then, execute the script:

```
.\01_DC.ps1
```

This process takes approximately **30 minutes** due to Windows Updates. The script will:

- Remove the ISO from the VM.
- Configure network settings.
- Promote the server to a Domain Controller.
- Install updates and prepare the environment for cluster registration.

### 7. Manual Installation of the Node Operating System

- **Start the NODE VM**: Open Hyper-V Manager and start the `NODE` VM.
- **Follow the Installation Wizard**: Proceed through the Azure Stack HCI OS installation wizard.
- **Perform First Login**: Log in as the Administrator for the first time.

No additional configuration is needed at this stage.

### 8. Node configuration and ARC registration

Before running the script, modify the `$defaultUser` and `$defaultPwd` variables in `02_Cluster.ps1` to match your administrator credentials.

```
# In 02_Cluster.ps1
$defaultUser = "Administrator"
$defaultPwd = "YourAdminPassword"
```

Then, execute the script:

```
.\02_Cluster.ps1
```

This process takes approximately **10 minutes** and will require you to:

- Authenticate to Azure.
- Select the Resource Group where the node will be registered.

The script will:

- Remove the ISO from the VM.
- Configure network settings.
- Install required Windows features.
- Register the node with Azure Arc.

### 9. Verify Node Extension Installation

After running Script 02, the Azure Connected Machine extensions should begin installing automatically. This can take up to **20 minutes**. To verify:

- Go to the Azure Portal.
- Navigate to the Azure Arc machines.
- Check that all extensions are installed and in a successful state.
- ![Extension](/assets/img/post/2024-10-04-azure-stack-hci-demolab/extensions.png)

If you encounter any issues or failures with the extensions, run Script 03:

```
.\03_TroubleshootingExtensions.ps1
```

This script will troubleshoot and fix common extension issues.


### 10. Registering the Cluster

*This section will be detailed in a future update, complete with step-by-step instructions and screenshots.*

Once the cluster node script completes and extensions are correctly installed, follow these steps to register your cluster in Azure:

1. **Assign Required Rights:**

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

2. **Initial Cluster Registration:**

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

3. **Perform Cloud Deployment:**

   - Initiate the cloud deployment and wait approximately 2 hours for the cluster to be ready for subsequent steps.


## Cost Considerations

One of the advantages of using the **AzSHCI** scripts and Nested Virtualization is the minimal cost involved in setting up your Azure Stack HCI environment.

- **Hardware Costs**: 0€
  - I use my regular work laptop for deployment, so there are no additional hardware expenses.

- **License Costs for the Domain Controller**: 0€
  - We use the Windows Server 2025 Evaluation version, which is free for 90 days—ample time for testing and development.

- **License Costs for the Node**: 0€
  - The Azure Stack HCI OS does not incur costs until you register it with Azure Stack HCI.

- **Azure Stack HCI Costs**: 0€
  - Azure Stack HCI is free for the first 60 days. Since we won't exceed this period for our testing, no costs will be incurred.

Additionally, every **2 to 3 weeks**, I delete all resources in the Resource Group and use Script `99_Offboarding.ps1` to remove all the infrastructure, allowing me to perform a fresh deployment. This practice helps avoid any unintended costs and keeps the environment clean for new tests.


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

This project is licensed under the MIT License - see the [LICENSE](https://github.com/schmittnieto/AzSHCI/blob/main/LICENSE) file for details.

## Contact

For any questions or issues, please open an [issue](https://github.com/schmittnieto/AzSHCI/issues) in the repository.


Thank you for using **AzSHCI**! I hope these scripts simplify your Azure Stack HCI deployment process and enable efficient testing and development in your environment.

## RAW Scripts 

To make it easier to read I have moved all the RAW scripts to the end of the article, they will be automatically synchronized via Github Actions to the article. That is to say, in case there are modifications in the Github repository where they are located, these will be picked up in the scripts here.

### 00_Infra_AzHCI.ps1
<!-- 00INFRA:START -->

<!-- 00INFRA:END -->

### 01_DC.ps1

<!-- 01DC:START -->

<!-- 01DC:END -->

### 02_Cluster.ps1

<!-- 02CLUSTER:START -->

<!-- 02CLUSTER:END -->

### 03_TroubleshootingExtensions.ps1

<!-- 03TROUBLESHOOTING:START -->

<!-- 03TROUBLESHOOTING:END -->

### 99_Offboarding.ps1

<!-- 99OFFBOARDING:START -->

<!-- 99OFFBOARDING:END -->
