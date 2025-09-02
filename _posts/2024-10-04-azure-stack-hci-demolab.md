---
title: "Azure Local: Demolab"
excerpt: "Streamline Azure Local deployment on minimal hardware with AzSHCI scripts. Compare solutions and follow step-by-step instructions for efficient development."
date: 2024-10-04
last_modified_at: 2025-05-05
categories:
  - Blog
tags:
  - Chronicloud Series
  - Azure Stack HCI
  - Azure Local

redirect_from:
  - /blog/azure-local-demolab/
  - /blog/azure-stack-hci-demolab/
  - /azure-local-lab/

sticky: false

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

sidebar:
  nav: "Azurelocal"
  
---

This article was created before Azure Stack HCI was renamed to Azure Local ([link](https://learn.microsoft.com/en-us/azure/azure-local/rename-to-azure-local?view=azloc-24112)) in November 2024, which is why some references or hardcoded URLs may still point to Azure Stack HCI. However, the content has been updated accordingly, and if you find any errors, I would greatly appreciate it if you could report them either through the comment function or by emailing blog@schmitt-nieto.com
{: .notice--info}

## Azure Local: Demolab

Azure Local is a hyperconverged infrastructure solution that combines software-defined compute, storage, and networking. While it's a powerful tool for modernizing your data center and integrating with Azure services, setting it up for testing or development can be resource-intensive.

Deploying Azure Local can often seem daunting, especially when constrained by hardware resources. Traditional methods typically require substantial infrastructure, making it challenging for individuals or small teams to set up testing and lab environments. In this article, I'll explore a streamlined approach using the **AzSHCI** scripts, which allow you to deploy Azure Local on minimal hardware setups, such as a laptop.

## Existing Solutions and Their Limitations

Several tools and guides exist to help deploy Azure Local in lab environments. However, they often come with limitations that make them less suitable for minimal hardware setups.

### MSLab by Jaromir Kaspar

[MSLab](https://github.com/microsoft/MSLab) is a comprehensive solution that allows you to deploy various Microsoft products in a lab environment.

- **Pros:**
  - Supports a wide range of scenarios and configurations.
  - Highly customizable and feature-rich.
  - Served as the foundation for my lab setups for a long time.
  - Maintained by the community.

- **Cons:**
  - Setup process involves more steps and hardware resources compared to AzSHCI.

Additionally, the [DellGEOS Repository](https://github.com/DellGEOS/AzureStackHOLs) offers more current scenarios and use cases. Most scenarios in the DellGEOS repository are designed for infrastructures somewhat more robust than a simple laptop. In the past, DellGEOS has been the base for my configurations on Azure Local with Dell hardware, providing very current troubleshooting scenarios.

### Azure Arc Jumpstart by Lior Kamrat

[Azure Arc Jumpstart](https://azurearcjumpstart.io/) provides automated deployment scenarios for Azure Arc-enabled resources.

- **Pros:**
  - Automates Azure Arc deployments with ease.
  - Contains beautifully documented infrastructure with detailed diagrams.

- **Cons:**
  - Makes it difficult to carry out PoCs that extend beyond HCI, such as AVD on HCI.
  - Lack of flexibility in networking due to virtualization and Azure-based implementation, limiting access to VM consoles.
  - Costs approximate around $3,000 per month, not accounting for additional expenses. [Cost Details](https://aka.ms/JumpstartHCIBoxCost)

### Manual Deployment

Deploying Azure Local manually using the [Deployment Guide](https://learn.microsoft.com/en-us/azure-stack/hci/deploy/deployment-virtual) is another option. However, this manual approach has several drawbacks:

- **Pros:**
  - Direct control over the deployment process.

- **Cons:**
  - The configuration hasn't been updated since April this year.
  - Missing steps and incomplete documentation make the process cumbersome.
  - Performing a manual deployment is much more tedious and time-consuming compared to using AzSHCI scripts.

## Why AzSHCI?

The **AzSHCI** scripts are designed to bridge this gap by providing a lightweight, efficient way to deploy Azure Local on minimal hardware. Key advantages include:

- **Resource Efficiency:** Optimized for environments with limited CPU, RAM, and storage.
- **Simplicity:** Straightforward scripts that are easy to understand and modify.
- **Quick Deployment:** Allows you to set up a single-node Azure Local cluster rapidly for testing and development.

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

The **AzSHCI** scripts leverage **Nested Virtualization** to create a fully functional Azure Local environment within your existing hypervisor setup. This means you can run virtual machines (VMs) inside other VMs, allowing you to simulate a complex infrastructure on minimal hardware.

The deployment process involves the following key steps:

- **Installation of Windows Server 2025 Evaluation**: The scripts automate the setup of a Windows Server 2025 VM, which will be configured as an Active Directory Domain Controller (DC). This includes installing updates and preparing the environment for cluster registration, which is essential for setting up Azure Local.

- **Setup of the Azure Local Node**: Another VM is created to serve as the Azure Local node. Thanks to Nested Virtualization, this node can act as a hypervisor itself, allowing you to run additional workloads or services on top of it.

By utilizing Nested Virtualization, you can simulate a realistic Azure Local deployment without the need for extensive physical hardware, making it ideal for testing and development purposes.


### Repository Overview

The **AzSHCI** scripts are hosted on GitHub: [github.com/schmittnieto/AzSHCI](https://github.com/schmittnieto/AzSHCI)

<a href="https://github.com/schmittnieto/AzSHCI"><img src="https://badgen.net/https/raw.githubusercontent.com/schmittnieto/AzSHCI/refs/heads/main/lastdeployment.json?cache=300"></a>

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

- **Purpose:** Configures the Azure Local node VM.
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

Below is the exact deployment process to set up your Azure Local environment using the **AzSHCI** scripts. This guide will help you get everything up and running smoothly.

### 1. Download the Scripts from the Repository

Clone the **AzSHCI** repository to your local machine:

```
git clone https://github.com/schmittnieto/AzSHCI.git
```

Or download the repository manually: [Download Here](https://github.com/schmittnieto/AzSHCI/archive/refs/heads/main.zip)

### 2. Download the Necessary ISO Files

- **Windows Server 2025 Evaluation ISO**: [Download Here](https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2025)
- **Azure Local OS ISO**: Download directly from the Azure Portal.

Place both ISO files in the `C:\ISO` directory and rename the isos if you consider it convenient, for example I renamed the Azure Local iso to `HCI23H2.iso` and the Windows Server 2025 iso to `W2025.iso`.

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

This script will set up the virtual networking, create necessary folder structures, and deploy the VMs for the Domain Controller (DC) and the Azure Local node.


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
- **Follow the Installation Wizard**: Proceed through the Azure Local OS installation wizard.
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
> ⚠️ **Warning:** This step is no longer required (Since April 2025) as the extension installation is now handled automatically during the cluster deployment starting from version **2503**. I will show how to perform this step in the next section.

After running Script 02, the Azure Connected Machine extensions should begin installing automatically. This can take up to **20 minutes**. To verify:

- Go to the Azure Portal.
- Navigate to the Azure Arc machines.
- Check that all extensions are installed and in a successful state.
<a href="/assets/img/post/2024-10-04-azure-stack-hci-demolab/extensions.png" target="_blank">
   <img src="/assets/img/post/2024-10-04-azure-stack-hci-demolab/extensions.png" alt="Extension" style="border: 2px solid grey;">
</a>

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
       - Azure Local Administrator
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

   - Use the Azure Portal for initial cluster registration: [Azure Local Deployment via Portal](https://learn.microsoft.com/en-us/azure-stack/hci/deploy/deploy-via-portal)

   - **Extension Installation**
     - Since April 2025, extensions must be installed manually during the cluster deployment. To do this, simply select the nodes and click the Install extensions button:
<a href="/assets/img/post/2024-10-04-azure-stack-hci-demolab/2503.png" target="_blank">
  <img src="/assets/img/post/2024-10-04-azure-stack-hci-demolab/2503.png" alt="Extension Installation" style="border: 2px solid grey;">
</a>

   - **Network Configuration:**
     - Apply the following network settings to the interfaces:
<a href="/assets/img/post/2024-10-04-azure-stack-hci-demolab/networkconfiguration.png" target="_blank">
  <img src="/assets/img/post/2024-10-04-azure-stack-hci-demolab/networkconfiguration.png" alt="Network Configuration" style="border: 2px solid grey;">
</a>

     - Personally, I use the following IP configurations:
<a href="/assets/img/post/2024-10-04-azure-stack-hci-demolab/ipconfiguration.png" target="_blank">
  <img src="/assets/img/post/2024-10-04-azure-stack-hci-demolab/ipconfiguration.png" alt="IP Configuration" style="border: 2px solid grey;">
</a>

   - **Custom Location and User Configuration:**
     - Configure users and custom locations as defined in the scripts (credentials are exposed in the scripts):
<a href="/assets/img/post/2024-10-04-azure-stack-hci-demolab/adconfiguration.png" target="_blank">
  <img src="/assets/img/post/2024-10-04-azure-stack-hci-demolab/adconfiguration.png" alt="AD Configuration" style="border: 2px solid grey;">
</a>

   - **Security Options:**
     - It's crucial to disable BitLocker to prevent excessive storage consumption (totaling 2.1 TB), which could render your system inoperable if you lack sufficient capacity:
<a href="/assets/img/post/2024-10-04-azure-stack-hci-demolab/securityoptions.png" target="_blank">
  <img src="/assets/img/post/2024-10-04-azure-stack-hci-demolab/securityoptions.png" alt="Security Options" style="border: 2px solid grey;">
</a>

   - **Finalize Configuration:**
     - Leave the remaining settings at default. The system will be ready for provisioning after the validation, which take approximately 20 minutes.

3. **Perform Cloud Deployment:**

   - Initiate the cloud deployment and wait approximately 2 hours for the cluster to be ready for subsequent steps.


## Cost Considerations

One of the advantages of using the **AzSHCI** scripts and Nested Virtualization is the minimal cost involved in setting up your Azure Local environment.

- **Hardware Costs**: 0€
  - I use my regular work laptop for deployment, so there are no additional hardware expenses.

- **License Costs for the Domain Controller**: 0€
  - We use the Windows Server 2025 Evaluation version, which is free for 90 days, ample time for testing and development.

- **License Costs for the Node**: 0€
  - The Azure Local OS does not incur costs.

- **Azure Local Costs**: 0€
  - Azure Local is free for the first 60 days. Since we won't exceed this period for our testing, no costs will be incurred.

Additionally, every **2 to 3 weeks**, I delete all resources in the Resource Group and use Script `99_Offboarding.ps1` to remove all the infrastructure, allowing me to perform a fresh deployment. This practice helps avoid any unintended costs and keeps the environment clean for new tests.


## Conclusion

By following these steps, you should have a functional Azure Local environment running on minimal hardware. The **AzSHCI** scripts are designed to make the deployment process as smooth as possible, allowing you to focus on exploring Azure Local features without worrying about extensive setup procedures.


## Additional Resources

- **AzSHCI GitHub Repository:** [github.com/schmittnieto/AzSHCI](https://github.com/schmittnieto/AzSHCI)
- **MSLab Repository:** [github.com/microsoft/MSLab](https://github.com/microsoft/MSLab)
- **DellGEOS AzureStackHOLs:** [github.com/DellGEOS/AzureStackHOLs](https://github.com/DellGEOS/AzureStackHOLs)
- **Azure Arc Jumpstart:** [azurearcjumpstart.io](https://azurearcjumpstart.io/)
- **Azure Local Documentation:** [Microsoft Docs](https://docs.microsoft.com/en-us/azure-stack/hci/)


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


Thank you for using **AzSHCI**! I hope these scripts simplify your Azure Local deployment process and enable efficient testing and development in your environment.

## RAW Scripts 

To make it easier to read I have moved all the RAW scripts to the end of the article, they will be automatically synchronized via Github Actions to the article. That is to say, in case there are modifications in the Github repository where they are located, these will be picked up in the scripts here.

### 00_Infra_AzHCI.ps1
<!-- 00INFRA:START -->
```powershell
# 00_Infra_AzHCI.ps1
# Configuration and VM Creation Script

<#
.SYNOPSIS
    Configures virtual networking, creates necessary folder structures, and deploys HCI Node and Domain Controller VMs.

.DESCRIPTION
    This script performs the following tasks:
    - Checks for required prerequisites.
    - Configures an internal virtual switch with NAT.
    - Ensures the required folder structures exist.
    - Creates two virtual machines: an HCI Node and a Domain Controller.
    - Configures networking, storage, and security settings for the VMs.

.NOTES
    - Designed by Cristian Schmitt Nieto. For more information and usage, visit: https://schmitt-nieto.com/blog/azure-stack-hci-demolab/
    - Run this script with administrative privileges.
    - Ensure the ISO paths are correct before execution.
    - Execution Policy may need to be set to allow the script to run. To set the execution policy, you can run:
      Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
    - Approved PowerShell Verb Usage:
      - Functions and cmdlets should use approved verbs. This script uses `New` for creating resources.
#>

#region Variables

# Virtual Switch and Network Configuration
$vSwitchName = "azurestackhci"
$vSwitchNIC = "vEthernet ($vSwitchName)"
$vNetIPNetwork = "172.19.19.0/24"
$vIPNetworkPrefixLength = ($vNetIPNetwork -split '/')[1]
$natName = "azurestackhci"
$HCIRootFolder = "C:\HCI"

# ISO Paths
$isoPath_HCI = "C:\ISO\HCI23H2.iso"    # Replace with the actual path to your HCI Node ISO
$isoPath_DC = "C:\ISO\WS2025.iso"      # Replace with the actual path to your Domain Controller ISO

# HCI Node VM Configuration
$HCIVMName = "NODE"
$HCI_Memory = 32GB
$HCI_Processors = 8
$HCI_Disks = @(
    @{ Path = "${HCIVMName}_C.vhdx"; Size = 127GB },
    @{ Path = "s2d1.vhdx"; Size = 1024GB },
    @{ Path = "s2d2.vhdx"; Size = 1024GB }
)
$HCI_NetworkAdapters = @("MGMT1", "MGMT2")

# Domain Controller VM Configuration
$DCVMName = "DC"
$DC_Memory = 4GB
$DC_Processors = 2
$DC_Disks = @(
    @{ Path = "${DCVMName}_C.vhdx"; Size = 60GB }
)
$DC_NetworkAdapters = @("MGMT1")

# Tasks for Progress Bar
$tasks = @(
    "Checking Prerequisites",
    "Configuring Virtual Switch and NAT",
    "Setting Up Folder Structures",
    "Creating HCI Node VM",
    "Creating Domain Controller VM"
)

$totalTasks = $tasks.Count
$currentTask = 0

#endregion

#region Functions

# Function to Display Messages with Colors
function Write-Message {
    param (
        [string]$Message,
        [ValidateSet("Info", "Success", "Warning", "Error")]
        [string]$Type = "Info"
    )

    switch ($Type) {
        "Info"    { Write-Host $Message -ForegroundColor Cyan }
        "Success" { Write-Host $Message -ForegroundColor Green }
        "Warning" { Write-Host $Message -ForegroundColor Yellow }
        "Error"   { Write-Host $Message -ForegroundColor Red }
    }

    # Optional: Log messages to a file
    # Add-Content -Path "C:\Path\To\Your\LogFile.txt" -Value "$((Get-Date).ToString('yyyy-MM-dd HH:mm:ss')) [$Type] $Message"
}

# Function to Ensure the Folder Structure Exists
function Set-FolderStructure {
    param (
        [string]$BaseFolder
    )
    $vmFolder = Join-Path -Path $BaseFolder -ChildPath "VM"
    $diskFolder = Join-Path -Path $BaseFolder -ChildPath "Disk"

    try {
        if (-not (Test-Path -Path $BaseFolder)) {
            Write-Message "Base folder does not exist. Creating: $BaseFolder" -Type "Info"
            New-Item -Path $BaseFolder -ItemType Directory -Force | Out-Null
            Write-Message "Base folder created: $BaseFolder" -Type "Success"
        } else {
            Write-Message "Base folder already exists: $BaseFolder" -Type "Info"
        }

        if (-not (Test-Path -Path $vmFolder)) {
            Write-Message "VM folder does not exist. Creating: $vmFolder" -Type "Info"
            New-Item -Path $vmFolder -ItemType Directory -Force | Out-Null
            Write-Message "VM folder created: $vmFolder" -Type "Success"
        } else {
            Write-Message "VM folder already exists: $vmFolder" -Type "Info"
        }

        if (-not (Test-Path -Path $diskFolder)) {
            Write-Message "Disk folder does not exist. Creating: $diskFolder" -Type "Info"
            New-Item -Path $diskFolder -ItemType Directory -Force | Out-Null
            Write-Message "Disk folder created: $diskFolder" -Type "Success"
        } else {
            Write-Message "Disk folder already exists: $diskFolder" -Type "Info"
        }
    } catch {
        Write-Message "Failed to set up folder structure. Error: $_" -Type "Error"
        throw
    }
}

# Function to Create or Verify the Internal VMSwitch
function Invoke-InternalVMSwitch {
    param (
        [string]$VMSwitchName
    )

    try {
        $existingSwitch = Get-VMSwitch -Name $VMSwitchName -ErrorAction SilentlyContinue
        if ($null -ne $existingSwitch) {
            Write-Message "The internal VM Switch '$VMSwitchName' already exists." -Type "Success"
        } else {
            Write-Message "The internal VM Switch '$VMSwitchName' does not exist. Creating it now..." -Type "Info"
            New-VMSwitch -Name $VMSwitchName -SwitchType Internal -ErrorAction Stop | Out-Null
            Write-Message "Internal VM Switch '$VMSwitchName' created successfully!" -Type "Success"
        }
    } catch {
        Write-Message "Failed to create internal VM Switch '$VMSwitchName'. Error: $_" -Type "Error"
        throw
    }
}

# Function to Calculate the Gateway (First Usable Address in the Subnet)
function Get-Gateway {
    param (
        [string]$IPNetwork
    )
    try {
        $ip, $cidr = $IPNetwork -split '/'
        $networkAddress = [System.Net.IPAddress]::Parse($ip)
        $addressBytes = $networkAddress.GetAddressBytes()
        $addressBytes[3] += 1  # Increment the last octet by 1
        $gateway = [System.Net.IPAddress]::new($addressBytes)
        return $gateway
    } catch {
        Write-Message "Invalid IP network format: $IPNetwork. Error: $_" -Type "Error"
        throw
    }
}

# Function to Create VMs
function New-VMCreation {
    param (
        [string]$VMName,
        [string]$VMFolder,
        [string]$DiskFolder,
        [string]$ISOPath,
        [long]$Memory,
        [int]$Processors,
        [array]$Disks,
        [array]$NetworkAdapters
    )

    try {
        # Create virtual hard disk for the OS
        $VHDName = $Disks[0].Path
        $VHDPath = Join-Path -Path $DiskFolder -ChildPath $VHDName
        if (-not (Test-Path -Path $VHDPath)) {
            New-VHD -Path $VHDPath -SizeBytes $Disks[0].Size -ErrorAction Stop | Out-Null
            Write-Message "VHD created at '$VHDPath'." -Type "Success"
        } else {
            Write-Message "VHD already exists at '$VHDPath'. Skipping creation." -Type "Warning"
        }

        # Create the VM
        if (-not (Get-VM -Name $VMName -ErrorAction SilentlyContinue)) {
            New-VM -Name $VMName -MemoryStartupBytes $Memory -VHDPath $VHDPath -Generation 2 -Path $VMFolder -ErrorAction Stop | Out-Null
            Write-Message "VM '$VMName' created successfully." -Type "Success"
        } else {
            Write-Message "VM '$VMName' already exists. Skipping creation." -Type "Warning"
            return
        }

        # Configure memory and processors
        Set-VMMemory -VMName $VMName -DynamicMemoryEnabled $false -ErrorAction Stop | Out-Null
        Set-VMProcessor -VMName $VMName -Count $Processors -ErrorAction Stop | Out-Null
        Write-Message "Memory and processor settings configured for VM '$VMName'." -Type "Success"

        # Disable checkpoints
        Set-VM -VMName $VMName -CheckpointType Disabled -ErrorAction Stop | Out-Null
        Write-Message "Checkpoints disabled for VM '$VMName'." -Type "Success"

        # Remove default network adapter
        Get-VMNetworkAdapter -VMName $VMName | Remove-VMNetworkAdapter -ErrorAction Stop | Out-Null
        Write-Message "Default network adapter removed from VM '$VMName'." -Type "Success"

        # Add network adapters and connect them to the VMSwitch
        foreach ($nic in $NetworkAdapters) {
            Add-VMNetworkAdapter -VMName $VMName -Name $nic -ErrorAction Stop | Out-Null
            Connect-VMNetworkAdapter -VMName $VMName -Name $nic -SwitchName $vSwitchName -ErrorAction Stop | Out-Null
            Write-Message "Network adapter '$nic' added and connected to '$vSwitchName' for VM '$VMName'." -Type "Success"
        }

        # Enable MAC spoofing
        Get-VMNetworkAdapter -VMName $VMName | Set-VMNetworkAdapter -MacAddressSpoofing On -ErrorAction Stop | Out-Null
        Write-Message "MAC spoofing enabled for VM '$VMName'." -Type "Success"

        # Configure Key Protector and vTPM
        $GuardianName = $VMName
        $existingGuardian = Get-HgsGuardian -Name $GuardianName -ErrorAction SilentlyContinue
        if ($null -ne $existingGuardian) {
            Write-Message "HgsGuardian '$GuardianName' already exists. Deleting and recreating..." -Type "Warning"
            Remove-HgsGuardian -Name $GuardianName -ErrorAction Stop | Out-Null
            Write-Message "HgsGuardian '$GuardianName' deleted." -Type "Success"
        } else {
            Write-Message "HgsGuardian '$GuardianName' does not exist. Creating it now..." -Type "Info"
        }

        $newGuardian = New-HgsGuardian -Name $GuardianName -GenerateCertificates -ErrorAction Stop
        Write-Message "HgsGuardian '$GuardianName' created successfully!" -Type "Success"

        $kp = New-HgsKeyProtector -Owner $newGuardian -AllowUntrustedRoot -ErrorAction Stop
        Set-VMKeyProtector -VMName $VMName -KeyProtector $kp.RawData -ErrorAction Stop | Out-Null
        Enable-VMTPM -VMName $VMName -ErrorAction Stop | Out-Null
        Write-Message "KeyProtector and vTPM applied to VM '$VMName'." -Type "Success"

        # Create and attach additional disks
        for ($i = 1; $i -lt $Disks.Count; $i++) {
            $disk = $Disks[$i]
            $diskPath = Join-Path -Path $DiskFolder -ChildPath $disk.Path
            if (-not (Test-Path -Path $diskPath)) {
                New-VHD -Path $diskPath -SizeBytes $disk.Size -ErrorAction Stop | Out-Null
                Write-Message "Additional VHD created at '$diskPath'." -Type "Success"
            } else {
                Write-Message "Additional VHD already exists at '$diskPath'. Skipping creation." -Type "Warning"
            }
            Add-VMHardDiskDrive -VMName $VMName -Path $diskPath -ErrorAction Stop | Out-Null
            Write-Message "Additional disk '$disk.Path' attached to VM '$VMName'." -Type "Success"
        }

        # Enable nested virtualization
        Set-VMProcessor -VMName $VMName -ExposeVirtualizationExtensions $true -ErrorAction Stop | Out-Null
        Write-Message "Nested virtualization enabled for VM '$VMName'." -Type "Success"

        # Add boot ISO
        Add-VMDvdDrive -VMName $VMName -Path $ISOPath -ErrorAction Stop | Out-Null
        Write-Message "ISO '$ISOPath' mounted as DVD drive for VM '$VMName'." -Type "Success"

        # Set boot order to prioritize the DVD drive first
        $bootOrder = Get-VMFirmware -VMName $VMName -ErrorAction Stop
        $dvdBoot = ($bootOrder.BootOrder | Where-Object { $_.Device -like '*Dvd*' })[0]
        if ($dvdBoot) {
            Set-VMFirmware -VMName $VMName -FirstBootDevice $dvdBoot -ErrorAction Stop | Out-Null
            Write-Message "Boot order set to prioritize DVD drive for VM '$VMName'." -Type "Success"
        } else {
            Write-Message "DVD drive not found in boot order for VM '$VMName'." -Type "Warning"
        }

        # Configure VM to shut down when the host shuts down
        Set-VM -Name $VMName -AutomaticStopAction ShutDown -ErrorAction Stop | Out-Null
        Write-Message "Configured VM '$VMName' to shut down when the host shuts down." -Type "Success"

        # Configure VM to take no action when the host starts
        Set-VM -Name $VMName -AutomaticStartAction Nothing -ErrorAction Stop | Out-Null
        Write-Message "Configured VM '$VMName' to take no action on host start." -Type "Success"

    } catch {
        Write-Message "Failed to create or configure VM '$VMName'. Error: $_" -Type "Error"
        throw
    }
}

# Function to Test for TPM Chip
function Test-TPM {
    try {
        $tpm = Get-TPM -ErrorAction SilentlyContinue
        if ($null -eq $tpm) {
            Write-Message "TPM chip not found on the host. A TPM is required for the Key Protector and vTPM." -Type "Error"
            exit 1
        } elseif (-not $tpm.TpmEnabled) {
            Write-Message "TPM chip is present but not enabled. Please enable TPM in the BIOS/UEFI settings." -Type "Error"
            exit 1
        } else {
            Write-Message "TPM chip is present and enabled." -Type "Success"
        }
    } catch {
        Write-Message "Failed to check TPM status. Error: $_" -Type "Error"
        exit 1
    }
}

# Function to Test for Hyper-V Role
function Test-HyperV {
    try {
        # Query Win32_OptionalFeature for Hyper-V
        $hyperVFeature = Get-CimInstance -ClassName Win32_OptionalFeature -Filter "Name='Microsoft-Hyper-V-All'" -ErrorAction Stop

        if ($hyperVFeature.InstallState -eq 1) {
            Write-Message "Hyper-V role is already installed on the host." -Type "Success"
        }
        else {
            Write-Message "Hyper-V role is not installed on the host. Installing Hyper-V role and management tools..." -Type "Info"

            # Determine OS type
            $os = Get-CimInstance -ClassName Win32_OperatingSystem
            $productType = $os.ProductType
            # ProductType 1 = Workstation, 2 = Domain Controller, 3 = Server

            if ($productType -eq 1) {
                # Client OS - use Enable-WindowsOptionalFeature
                Write-Message "Detected Client Operating System. Installing Hyper-V using Enable-WindowsOptionalFeature..." -Type "Info"
                Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All -All -NoRestart -ErrorAction Stop
            }
            else {
                # Server OS - use DISM
                Write-Message "Detected Server Operating System. Installing Hyper-V using DISM..." -Type "Info"
                dism.exe /Online /Enable-Feature /All /FeatureName:Microsoft-Hyper-V /IncludeManagementTools /NoRestart | Out-Null
            }

            Write-Message "Hyper-V role and management tools installed successfully. A restart is required." -Type "Success"

            # Optional: Implement a progress bar or sleep before restarting
            Start-SleepWithProgress -Seconds 60 -Activity "Restarting Host" -Status "Please wait while the host restarts..."

            # Restart the computer to apply changes
            Restart-Computer -Force
        }
    }
    catch {
        Write-Message "Failed to check or install Hyper-V role. Error: $_" -Type "Error"
        exit 1
    }
}

# Function to Update Progress Bar (Main Progress)
function Update-ProgressBarMain {
    param (
        [int]$CurrentStep,
        [int]$TotalSteps,
        [string]$StatusMessage
    )

    $percent = [math]::Round(($CurrentStep / $TotalSteps) * 100)
    Write-Progress -Id 1 -Activity "Overall Progress" -Status $StatusMessage -PercentComplete $percent
}

# Function to Start Sleep with Progress Message and Additional Progress Bar (Subtask)
function Start-SleepWithProgress {
    param(
        [int]$Seconds,
        [string]$Activity = "Waiting",
        [string]$Status = "Please wait..."
    )

    Write-Message "$Activity : $Status" -Type "Info"

    for ($i = 1; $i -le $Seconds; $i++) {
        $percent = [math]::Round(($i / $Seconds) * 100)
        Write-Progress -Id 2 -Activity "Sleep Progress" -Status "$Activity : $i/$Seconds seconds elapsed..." -PercentComplete $percent
        Start-Sleep -Seconds 1
    }

    Write-Progress -Id 2 -Activity "Sleep Progress" -Completed
    Write-Message "$Activity : Completed." -Type "Success"
}

#endregion

#region Script Execution

foreach ($task in $tasks) {
    $currentTask++
    Update-ProgressBarMain -CurrentStep $currentTask -TotalSteps $totalTasks -StatusMessage "$task..."

    switch ($task) {
        "Checking Prerequisites" {
            Write-Message "Checking prerequisites..." -Type "Info"
            # Test for TPM
            Test-TPM

            # Test for Hyper-V role and management tools
            Test-HyperV

            Write-Message "Prerequisite checks completed successfully." -Type "Success"
        }
        "Configuring Virtual Switch and NAT" {
            Write-Message "Configuring virtual switch and NAT settings..." -Type "Info"

            # Create internal VMSwitch
            Invoke-InternalVMSwitch -VMSwitchName $vSwitchName
            Start-Sleep -Seconds 3

            # Calculate Gateway
            try {
                $vIPNetworkGW = Get-Gateway -IPNetwork $vNetIPNetwork
                Write-Message "Calculated gateway: $vIPNetworkGW" -Type "Info"
            } catch {
                Write-Message "Failed to calculate gateway. Exiting script." -Type "Error"
                exit 1
            }

            # Assign IP and NAT
            try {
                # Assign the IP address to the host's vSwitch interface
                $existingIPAddress = Get-NetIPAddress -IPAddress $vIPNetworkGW -InterfaceAlias $vSwitchNIC -ErrorAction SilentlyContinue
                if ($null -eq $existingIPAddress) {
                    Write-Message "Assigning IP address $vIPNetworkGW to interface $vSwitchNIC" -Type "Info"
                    New-NetIPAddress -IPAddress $vIPNetworkGW -PrefixLength $vIPNetworkPrefixLength -InterfaceAlias $vSwitchNIC -ErrorAction Stop | Out-Null
                    Write-Message "IP address $vIPNetworkGW assigned successfully to $vSwitchNIC." -Type "Success"
                } else {
                    Write-Message "IP address $vIPNetworkGW already exists on interface $vSwitchNIC. Skipping assignment." -Type "Warning"
                }

                # Create NAT configuration if it doesn't exist
                $existingNat = Get-NetNat -Name $natName -ErrorAction SilentlyContinue
                if ($null -eq $existingNat) {
                    Write-Message "Creating new NAT with name: $natName" -Type "Info"
                    New-NetNat -Name $natName -InternalIPInterfaceAddressPrefix $vNetIPNetwork -ErrorAction Stop | Out-Null
                    Write-Message "NAT '$natName' created successfully." -Type "Success"
                } else {
                    Write-Message "A NAT with the name '$natName' already exists. Skipping creation." -Type "Warning"
                }
            } catch {
                Write-Message "Failed to configure IP address or NAT. Error: $_" -Type "Error"
                exit 1
            }

            Start-Sleep -Seconds 3

            Write-Message "Virtual switch and NAT configuration completed successfully!" -Type "Success"
        }
        "Setting Up Folder Structures" {
            Write-Message "Setting up folder structures..." -Type "Info"
            try {
                Set-FolderStructure -BaseFolder $HCIRootFolder
                $HCIDiskFolder = Join-Path -Path $HCIRootFolder -ChildPath "Disk"
                $HCIVMFolder = Join-Path -Path $HCIRootFolder -ChildPath "VM"
                Write-Message "Folder structures set up successfully." -Type "Success"
            } catch {
                Write-Message "Failed to set up folder structures. Error: $_" -Type "Error"
                exit 1
            }
        }
        "Creating HCI Node VM" {
            Write-Message "Creating HCI Node VM..." -Type "Info"
            try {
                New-VMCreation -VMName $HCIVMName `
                              -VMFolder $HCIVMFolder `
                              -DiskFolder $HCIDiskFolder `
                              -ISOPath $isoPath_HCI `
                              -Memory $HCI_Memory `
                              -Processors $HCI_Processors `
                              -Disks $HCI_Disks `
                              -NetworkAdapters $HCI_NetworkAdapters

                # Disable time synchronization on the HCI Node VM
                Get-VMIntegrationService -VMName $HCIVMName | Where-Object { $_.Name -like "*Sync*" } | Disable-VMIntegrationService -ErrorAction Stop | Out-Null
                Write-Message "Time synchronization disabled for VM '$HCIVMName'." -Type "Success"
            } catch {
                Write-Message "Failed to create HCI Node VM '$HCIVMName'. Error: $_" -Type "Error"
                exit 1
            }
        }
        "Creating Domain Controller VM" {
            Write-Message "Creating Domain Controller VM..." -Type "Info"
            try {
                New-VMCreation -VMName $DCVMName `
                              -VMFolder $HCIVMFolder `
                              -DiskFolder $HCIDiskFolder `
                              -ISOPath $isoPath_DC `
                              -Memory $DC_Memory `
                              -Processors $DC_Processors `
                              -Disks $DC_Disks `
                              -NetworkAdapters $DC_NetworkAdapters
                # Disable time synchronization on the DC VM
                Get-VMIntegrationService -VMName $DCVMName | Where-Object { $_.Name -like "*Sync*" } | Disable-VMIntegrationService -ErrorAction Stop | Out-Null
                Write-Message "Time synchronization disabled for VM '$DCVMName'." -Type "Success"
            } catch {
                Write-Message "Failed to create Domain Controller VM '$DCVMName'. Error: $_" -Type "Error"
                exit 1
            }
        }
    }
}

# Complete the Progress Bar
Write-Progress -Id 1 -Activity "Configuring Infrastructure and Creating VMs" -Completed -Status "All tasks completed."

Write-Message "All configurations and VM creations completed successfully." -Type "Success"

#endregion
```
<!-- 00INFRA:END -->

### 01_DC.ps1

<!-- 01DC:START -->
```powershell
# 01_DC.ps1
# Domain Controller Configuration Script

<#
.SYNOPSIS
    Configures the Domain Controller VM, sets network settings, promotes it to a Domain Controller, installs updates, and sets up Active Directory Organizational Units.

.DESCRIPTION
    This script performs the following tasks:
    - Sets up credentials and network configurations.
    - Removes the ISO from the DC VM.
    - Renames the Domain Controller VM.
    - Configures network adapters with static IP settings.
    - Sets the time zone.
    - Promotes the VM to a Domain Controller.
    - Installs Windows Updates.
    - Configures DNS forwarders.
    - Creates Organizational Units (OUs) in Active Directory.
    - Installs necessary modules and creates Azure Local AD objects.

.NOTES
    - Designed by Cristian Schmitt Nieto. For more information and usage, visit: https://schmitt-nieto.com/blog/azure-stack-hci-demolab/
    - Run this script with administrative privileges.
    - Ensure the Execution Policy allows the script to run. To set the execution policy, you can run:
      Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
#>

#region Variables

# Define credentials and variables
$defaultUser = "Administrator"
$defaultPwd = "Start#1234"
$DefaultSecuredPassword = ConvertTo-SecureString $defaultPwd -AsPlainText -Force
$DefaultCredentials = New-Object System.Management.Automation.PSCredential ($defaultUser, $DefaultSecuredPassword)

# VM and Domain Variables
$dcVMName  = "DC"
$domainName = "azurestack.local"
$netBIOSName = "AZURESTACK"

$NIC1 = "MGMT1"
$nic1IP = "172.19.19.2"
$nic1GW = "172.19.19.1"
$nic1DNS = "172.19.19.2"

# Variables for DNS forwarder and time zone
$dnsForwarder = "8.8.8.8"
$timeZone = "W. Europe Standard Time" # Use "Get-TimeZone -ListAvailable" to get a list of available Time Zones

# User for Azure Local LCM User (to be used later)
$setupUser = "hciadmin"
$setupPwd = "dgemsc#utquMHDHp3M"

# Sleep durations in seconds
$SleepRename = 20     # Sleep Timer for after PC Renaming
$SleepDomain = 360    # Sleep Timer for after Domain Making
$SleepUpdates = 240   # Sleep Timer for after Update Installation
# $SleepADServices = 30 # Increased Sleep Timer after DC promotion before configuring AD

# Total number of steps for progress calculation
$totalSteps = 12
$currentStep = 0

#endregion

#region Functions

# Function to Display Messages with Colors
function Write-Message {
    param (
        [string]$Message,
        [ValidateSet("Info", "Success", "Warning", "Error")]
        [string]$Type = "Info"
    )

    switch ($Type) {
        "Info"    { Write-Host $Message -ForegroundColor Cyan }
        "Success" { Write-Host $Message -ForegroundColor Green }
        "Warning" { Write-Host $Message -ForegroundColor Yellow }
        "Error"   { Write-Host $Message -ForegroundColor Red }
    }

    # Optional: Log messages to a file
    # Uncomment and configure the following lines to enable logging
    # $LogFile = "C:\HCI\DeploymentLogs\01_DC_Log_$(Get-Date -Format 'yyyyMMdd_HHmmss').txt"
    # New-Item -Path (Split-Path $LogFile) -ItemType Directory -Force | Out-Null
    # Add-Content -Path $LogFile -Value "$((Get-Date).ToString('yyyy-MM-dd HH:mm:ss')) [$Type] $Message"
}

# Function to Update Progress Bar (Main Progress)
function Update-ProgressBar {
    param (
        [int]$CurrentStep,
        [int]$TotalSteps,
        [string]$StatusMessage
    )

    $percent = [math]::Round(($CurrentStep / $TotalSteps) * 100)
    Write-Progress -Id 1 -Activity "Overall Progress" -Status $StatusMessage -PercentComplete $percent
}

# Function to Start Sleep with Progress Message and Additional Progress Bar (Subtask)
function Start-SleepWithProgress {
    param(
        [int]$Seconds,
        [string]$Activity = "Waiting",
        [string]$Status = "Please wait..."
    )

    Write-Message "$Activity : $Status" -Type "Info"

    for ($i = 1; $i -le $Seconds; $i++) {
        # Check if a key has been pressed
        if ([Console]::KeyAvailable) {
            $key = [Console]::ReadKey($true)
            if ($key.Key -eq 'Spacebar') {
                Write-Message "Sleep skipped by user." -Type "Warning"
                break
            }
        }

        $percent = [math]::Round(($i / $Seconds) * 100)
        Write-Progress -Id 2 -Activity "Sleep Progress" -Status "$Activity : $i/$Seconds seconds elapsed... Use Spacebar to Skip" -PercentComplete $percent
        Start-Sleep -Seconds 1
    }

    Write-Progress -Id 2 -Activity "Sleep Progress" -Completed
    Write-Message "$Activity : Completed." -Type "Success"
}

# Function to Wait Until Active Directory is Ready
function Wait-UntilADReady {
    param(
        [string]$VMName,
        [int]$Timeout = 600 # Timeout in seconds (10 minutes)
    )

    $elapsed = 0
    $interval = 10

    Write-Message "Checking if Active Directory services are operational on VM '$VMName'..." -Type "Info"

    while ($elapsed -lt $Timeout) {
        try {
            Invoke-Command -VMName $VMName -Credential $DomainAdminCredentials -ScriptBlock {
                Get-ADDomain -ErrorAction Stop
            } -ErrorAction Stop -WarningAction SilentlyContinue | Out-Null

            Write-Message "Active Directory services are operational on VM '$VMName'." -Type "Success"
            return
        } catch {
            Write-Message "Active Directory services not ready yet. Waiting..." -Type "Info"
            Start-Sleep -Seconds $interval
            $elapsed += $interval
        }
    }

    Write-Message "Active Directory services did not become operational within the expected time." -Type "Error"
    exit 1
}

#endregion

#region Script Execution

# Step 1: Remove ISO from DC VM
$currentStep++
Update-ProgressBar -CurrentStep $currentStep -TotalSteps $totalSteps -StatusMessage "Removing ISO from VM..."
Write-Message "Removing ISO from DC VM '$dcVMName'..." -Type "Info"
try {
    Get-VMDvdDrive -VMName $dcVMName | Where-Object { $_.DvdMediaType -eq "ISO" } | Remove-VMDvdDrive -ErrorAction Stop -WarningAction SilentlyContinue | Out-Null
    Write-Message "ISO removed from VM '$dcVMName'." -Type "Success"
} catch {
    Write-Message "Failed to remove ISO from VM '$dcVMName'. Error: $_" -Type "Error"
    exit 1
}

# Step 2: Retrieve and format MAC address
$currentStep++
Update-ProgressBar -CurrentStep $currentStep -TotalSteps $totalSteps -StatusMessage "Retrieving MAC address..."
Write-Message "Retrieving MAC address for network adapter '$NIC1' on VM '$dcVMName'..." -Type "Info"
try {
    $dcMacNIC1 = Get-VMNetworkAdapter -VMName $dcVMName -Name $NIC1 -ErrorAction Stop -WarningAction SilentlyContinue
    $dcMacNIC1Address = $dcMacNIC1.MacAddress
    $dcFinalMacNIC1 = $dcMacNIC1Address.Insert(2,"-").Insert(5,"-").Insert(8,"-").Insert(11,"-").Insert(14,"-").ToUpper()
    Write-Message "Formatted MAC address for '$NIC1': $dcFinalMacNIC1" -Type "Success"
} catch {
    Write-Message "Failed to retrieve MAC address for '$NIC1'. Error: $_" -Type "Error"
    exit 1
}

# Step 3: Rename the DC VM
$currentStep++
Update-ProgressBar -CurrentStep $currentStep -TotalSteps $totalSteps -StatusMessage "Renaming VM..."
Write-Message "Renaming VM '$dcVMName'..." -Type "Info"
try {
    Invoke-Command -VMName $dcVMName -Credential $DefaultCredentials -ScriptBlock {
        param($dcVMName)
        $ErrorActionPreference = 'Stop'
        $WarningPreference = 'SilentlyContinue'
        $VerbosePreference = 'SilentlyContinue'
        $ProgressPreference = 'SilentlyContinue'

        # Rename computer
        Rename-Computer -NewName $dcVMName -Force -ErrorAction Stop

        # Restart computer
        Restart-Computer -Force -ErrorAction Stop
    } -ArgumentList $dcVMName -ErrorAction Stop -WarningAction SilentlyContinue -Verbose:$false | Out-Null
    Write-Message "VM '$dcVMName' has been renamed and will restart to apply changes." -Type "Success"

    # Restart the DC VM to apply changes
    Write-Message "VM '$dcVMName' is restarting..." -Type "Info"
    Start-SleepWithProgress -Seconds $SleepRename -Activity "Restarting VM" -Status "Waiting for VM to restart" # 20 Seconds
} catch {
    Write-Message "Failed to rename or restart VM '$dcVMName'. Error: $_" -Type "Error"
    exit 1
}

# Step 4: Configure Network Settings
$currentStep++
Update-ProgressBar -CurrentStep $currentStep -TotalSteps $totalSteps -StatusMessage "Configuring network settings..."
Write-Message "Configuring network settings for VM '$dcVMName'..." -Type "Info"
try {
    Invoke-Command -VMName $dcVMName -Credential $DefaultCredentials -ScriptBlock {
        param($NIC1, $nic1IP, $nic1GW, $nic1DNS, $dcFinalMacNIC1)
        $ErrorActionPreference = 'Stop'
        $WarningPreference = 'SilentlyContinue'
        $VerbosePreference = 'SilentlyContinue'
        $ProgressPreference = 'SilentlyContinue'

        # Rename network adapter based on MAC address
        Get-NetAdapter -Physical | Where-Object { $_.MacAddress -eq $dcFinalMacNIC1 } | Rename-NetAdapter -NewName $NIC1 -ErrorAction Stop -WarningAction SilentlyContinue | Out-Null

        # Disable DHCP and set static IP
        Set-NetIPInterface -InterfaceAlias $NIC1 -Dhcp Disabled -ErrorAction Stop -WarningAction SilentlyContinue | Out-Null
        New-NetIPAddress -InterfaceAlias $NIC1 -IPAddress $nic1IP -PrefixLength 24 -DefaultGateway $nic1GW -ErrorAction Stop -WarningAction SilentlyContinue | Out-Null
        Set-DnsClientServerAddress -InterfaceAlias $NIC1 -ServerAddresses $nic1DNS -ErrorAction Stop -WarningAction SilentlyContinue | Out-Null
    } -ArgumentList $NIC1, $nic1IP, $nic1GW, $nic1DNS, $dcFinalMacNIC1 -ErrorAction Stop -WarningAction SilentlyContinue -Verbose:$false | Out-Null

    Write-Message "The IP address of NIC '$NIC1' is $nic1IP." -Type "Success"
} catch {
    Write-Message "Failed to configure network settings for VM '$dcVMName'. Error: $_" -Type "Error"
    exit 1
}

# Step 5: Set the time zone
$currentStep++
Update-ProgressBar -CurrentStep $currentStep -TotalSteps $totalSteps -StatusMessage "Setting time zone..."
Write-Message "Setting time zone for VM '$dcVMName'..." -Type "Info"
try {
    Invoke-Command -VMName $dcVMName -Credential $DefaultCredentials -ScriptBlock {
        param($timeZone)
        $ErrorActionPreference = 'Stop'
        $WarningPreference = 'SilentlyContinue'
        $VerbosePreference = 'SilentlyContinue'
        $ProgressPreference = 'SilentlyContinue'

        # Set the time zone
        Set-TimeZone -Name $timeZone -ErrorAction Stop -WarningAction SilentlyContinue | Out-Null
    } -ArgumentList $timeZone -ErrorAction Stop -WarningAction SilentlyContinue -Verbose:$false | Out-Null

    Write-Message "Time zone set to '$timeZone' for VM '$dcVMName'." -Type "Success"
} catch {
    Write-Message "Failed to set time zone for VM '$dcVMName'. Error: $_" -Type "Error"
    exit 1
}

# Step 6: Promote the DC VM to a Domain Controller
$currentStep++
Update-ProgressBar -CurrentStep $currentStep -TotalSteps $totalSteps -StatusMessage "Promoting to Domain Controller..."
Write-Message "Promoting VM '$dcVMName' to a Domain Controller..." -Type "Info"
try {
    Invoke-Command -VMName $dcVMName -Credential $DefaultCredentials -ScriptBlock {
        param($domainName, $netBIOSName, $defaultPwd)
        $ErrorActionPreference = 'Stop'
        $WarningPreference = 'SilentlyContinue'
        $VerbosePreference = 'SilentlyContinue'
        $ProgressPreference = 'SilentlyContinue'

        # Install Active Directory Domain Services
        Install-WindowsFeature -Name AD-Domain-Services -IncludeManagementTools -ErrorAction Stop | Out-Null

        # Import the ADDSDeployment module after installing the feature
        Import-Module ADDSDeployment -ErrorAction Stop | Out-Null

        # Secure password for DSRM
        $SecureDSRMPassword = ConvertTo-SecureString $defaultPwd -AsPlainText -Force

        # Promote to Domain Controller
        Install-ADDSForest `
            -DomainName $domainName `
            -DomainNetbiosName $netBIOSName `
            -SafeModeAdministratorPassword $SecureDSRMPassword `
            -InstallDns `
            -Force:$true `
            -Confirm:$false `
            -ErrorAction Stop | Out-Null
    } -ArgumentList $domainName, $netBIOSName, $defaultPwd -ErrorAction Stop -WarningAction SilentlyContinue -Verbose:$false | Out-Null

    Write-Message "Domain Controller promotion initiated for VM '$dcVMName'." -Type "Success"

    # Wait for DC promotion to complete
    Write-Message "Waiting for Domain Controller promotion to complete..." -Type "Info"
    Start-SleepWithProgress -Seconds $SleepDomain -Activity "Waiting for DC promotion" -Status "Waiting for VM to restart and apply domain changes" # 360 Seconds (6 Minutes)
} catch {
    Write-Message "Failed to promote VM '$dcVMName' to a Domain Controller. Error: $_" -Type "Error"
    exit 1
}

# Step 7: Update credentials to use the domain Administrator account
$currentStep++
Update-ProgressBar -CurrentStep $currentStep -TotalSteps $totalSteps -StatusMessage "Updating credentials..."
Write-Message "Updating credentials to use the domain Administrator account..." -Type "Info"
try {
    $domainAdminUser = "$netBIOSName\$defaultUser"
    $DomainAdminCredentials = New-Object System.Management.Automation.PSCredential ($domainAdminUser, $DefaultSecuredPassword)
    Write-Message "Credentials updated successfully." -Type "Success"
} catch {
    Write-Message "Failed to update credentials. Error: $_" -Type "Error"
    exit 1
}

# Step 8: Configure DNS Forwarder and Time Server
$currentStep++
Update-ProgressBar -CurrentStep $currentStep -TotalSteps $totalSteps -StatusMessage "Configuring DNS forwarder..."
Write-Message "Configuring DNS forwarder on VM '$dcVMName'..." -Type "Info"
try {
    Invoke-Command -VMName $dcVMName -Credential $DomainAdminCredentials -ScriptBlock {
        param($dnsForwarder)
        $ErrorActionPreference = 'Stop'
        $WarningPreference = 'SilentlyContinue'
        $VerbosePreference = 'SilentlyContinue'
        $ProgressPreference = 'SilentlyContinue'

        # Import DNS Server module
        Import-Module DNSServer -ErrorAction Stop -WarningAction SilentlyContinue | Out-Null

        # Add DNS forwarder
        Add-DnsServerForwarder -IPAddress $dnsForwarder -ErrorAction Stop -WarningAction SilentlyContinue | Out-Null

        # Configure time synchronization
        w32tm /config /manualpeerlist:europe.pool.ntp.org /syncfromflags:manual /reliable:yes /update | Out-Null
        Restart-Service w32time -Force | Out-Null
        w32tm /resync | Out-Null

    } -ArgumentList $dnsForwarder -ErrorAction Stop -WarningAction SilentlyContinue -Verbose:$false | Out-Null

    Write-Message "DNS forwarder to $dnsForwarder added successfully on VM '$dcVMName'." -Type "Success"
} catch {
    Write-Message "Failed to configure DNS forwarder on VM '$dcVMName'. Error: $_" -Type "Error"
    exit 1
}

# Step 9: Install Windows Updates
$currentStep++
Update-ProgressBar -CurrentStep $currentStep -TotalSteps $totalSteps -StatusMessage "Installing Windows Updates..."
Write-Message "Installing Windows Updates on VM '$dcVMName'..." -Type "Info"
try {
    Invoke-Command -VMName $dcVMName -Credential $DomainAdminCredentials -ScriptBlock {
        $ErrorActionPreference = 'Stop'
        $WarningPreference = 'SilentlyContinue'
        $VerbosePreference = 'SilentlyContinue'
        $ProgressPreference = 'Continue'

        # Import the PSWindowsUpdate module
        Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201 -Force -ErrorAction Stop -WarningAction SilentlyContinue | Out-Null
        Install-Module PSWindowsUpdate -Force -ErrorAction Stop -WarningAction SilentlyContinue | Out-Null
        Import-Module PSWindowsUpdate -ErrorAction Stop -WarningAction SilentlyContinue | Out-Null

        # Install available updates
        Install-WindowsUpdate -MicrosoftUpdate -AcceptAll -AutoReboot -IgnoreReboot -ErrorAction Stop -WarningAction SilentlyContinue | Out-Null
    } -ErrorAction Stop -WarningAction SilentlyContinue -Verbose:$false | Out-Null

    Write-Message "Windows Updates installation initiated on VM '$dcVMName'." -Type "Success"

    # Wait for the DC VM to restart after updates
    Write-Message "Waiting for the Domain Controller to restart after updates..." -Type "Info"
    Start-SleepWithProgress -Seconds $SleepUpdates -Activity "Waiting for VM to restart" -Status "Waiting for VM to restart and apply updates" # 240 Seconds (4 Minutes)
} catch {
    Write-Message "Failed to install Windows Updates on VM '$dcVMName'. Error: $_" -Type "Error"
    exit 1
}

# Step 10: Create Organizational Units (OUs)
$currentStep++
Update-ProgressBar -CurrentStep $currentStep -TotalSteps $totalSteps -StatusMessage "Creating Organizational Units..."
Write-Message "Creating Organizational Units (OUs) in Active Directory on VM '$dcVMName'..." -Type "Info"
try {
    # Wait until AD is ready
    Wait-UntilADReady -VMName $dcVMName -Timeout 600 # 10 minutes

    # Proceed to create OUs
    Invoke-Command -VMName $dcVMName -Credential $DomainAdminCredentials -ScriptBlock {
        param($netBIOSName, $domainName)
        $ErrorActionPreference = 'Stop'
        $WarningPreference = 'SilentlyContinue'
        $VerbosePreference = 'SilentlyContinue'
        $ProgressPreference = 'SilentlyContinue'

        try {
            # Import Active Directory module
            Import-Module ActiveDirectory -ErrorAction Stop -WarningAction SilentlyContinue | Out-Null

            # Get the current domain
            $domainDN = (Get-ADDomain).DistinguishedName

            # Define the root OU path
            $rootOU = "OU=_LAB,$domainDN"

            # Create the root OU "_LAB" (if it doesn't exist)
            if (-not (Get-ADOrganizationalUnit -Filter { Name -eq "_LAB" } -SearchBase $domainDN -ErrorAction SilentlyContinue )) {
                New-ADOrganizationalUnit -Name "_LAB" -Path $domainDN -ErrorAction Stop | Out-Null
                Write-Host "Created root OU '_LAB'."
            }

            # Create sub-OUs for Users
            $userOUs = @("Users", "Administrative", "Technical", "Financial", "Workers")
            foreach ($ou in $userOUs) {
                if ($ou -eq "Users") {
                    $path = $rootOU
                } else {
                    $path = "OU=Users,$rootOU"
                }

                if (-not (Get-ADOrganizationalUnit -Filter { Name -eq $ou } -SearchBase $path -ErrorAction SilentlyContinue )) {
                    New-ADOrganizationalUnit -Name $ou -Path $path -ErrorAction Stop | Out-Null
                    Write-Host "Created OU '$ou' under '$path'."
                }
            }

            # Create sub-OUs for Servers
            $serverOUs = @("Servers", "Windows", "Linux", "HCI")
            foreach ($ou in $serverOUs) {
                if ($ou -eq "Servers") {
                    $path = $rootOU
                } else {
                    $path = "OU=Servers,$rootOU"
                }

                if (-not (Get-ADOrganizationalUnit -Filter { Name -eq $ou } -SearchBase $path -ErrorAction SilentlyContinue )) {
                    New-ADOrganizationalUnit -Name $ou -Path $path -ErrorAction Stop | Out-Null
                    Write-Host "Created OU '$ou' under '$path'."
                }
            }

            # Create sub-OUs for Groups
            $groupOUs = @("Groups", "Security", "Distribution")
            foreach ($ou in $groupOUs) {
                if ($ou -eq "Groups") {
                    $path = $rootOU
                } else {
                    $path = "OU=Groups,$rootOU"
                }

                if (-not (Get-ADOrganizationalUnit -Filter { Name -eq $ou } -SearchBase $path -ErrorAction SilentlyContinue )) {
                    New-ADOrganizationalUnit -Name $ou -Path $path -ErrorAction Stop | Out-Null
                    Write-Host "Created OU '$ou' under '$path'."
                }
            }

            # Create sub-OUs for Computers
            $computerOUs = @("Computers", "Desktops", "Laptops", "AVD")
            foreach ($ou in $computerOUs) {
                if ($ou -eq "Computers") {
                    $path = $rootOU
                } else {
                    $path = "OU=Computers,$rootOU"
                }

                if (-not (Get-ADOrganizationalUnit -Filter { Name -eq $ou } -SearchBase $path -ErrorAction SilentlyContinue )) {
                    New-ADOrganizationalUnit -Name $ou -Path $path -ErrorAction Stop | Out-Null
                    Write-Host "Created OU '$ou' under '$path'."
                }
            }
        } catch {
            Write-Error "An error occurred while creating OUs: $_"
            throw $_
        }
    } -ArgumentList $netBIOSName, $domainName -ErrorAction Stop -WarningAction SilentlyContinue -Verbose:$false | Out-Null

    Write-Message "Organizational Units (OUs) created successfully in Active Directory." -Type "Success"
} catch {
    Write-Message "Failed to create Organizational Units (OUs) in Active Directory. Error: $_" -Type "Error"
    exit 1
}

# Step 11: Install Azure Local AD Artifacts
$currentStep++
Update-ProgressBar -CurrentStep $currentStep -TotalSteps $totalSteps -StatusMessage "Installing Azure Local AD Artifacts..."
Write-Message "Installing Azure Local AD Artifacts Pre-Creation Tool and creating AD objects..." -Type "Info"
try {
    Invoke-Command -VMName $dcVMName -Credential $DomainAdminCredentials -ScriptBlock {
        param($setupUser, $setupPwd)
        $ErrorActionPreference = 'Stop'
        $WarningPreference = 'SilentlyContinue'
        $VerbosePreference = 'SilentlyContinue'
        $ProgressPreference = 'SilentlyContinue'

        # Suppress informational messages
        $InformationPreference = 'SilentlyContinue'

        # Import Active Directory module
        Import-Module ActiveDirectory -ErrorAction Stop -WarningAction SilentlyContinue | Out-Null

        # Suppress confirmation prompts
        $ConfirmPreferenceBackup = $ConfirmPreference
        $ConfirmPreference = 'None'

        try {
            # Install the NuGet package provider if not already installed
            if (-not (Get-PackageProvider -Name NuGet -ErrorAction SilentlyContinue)) {
                Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201 -Force -ErrorAction Stop -WarningAction SilentlyContinue | Out-Null
            }

            # Install the AsHciADArtifactsPreCreationTool module from PSGallery
            if (-not (Get-Module -ListAvailable -Name AsHciADArtifactsPreCreationTool)) {
                Install-Module AsHciADArtifactsPreCreationTool -Repository PSGallery -Force -ErrorAction Stop -WarningAction SilentlyContinue | Out-Null
            }

            # Define the OU path for Azure Local
            $AsHciOUPath = "OU=HCI,OU=Servers,OU=_LAB," + (Get-ADDomain).DistinguishedName

            # Secure credentials for Azure Local user
            $SecurePassword = ConvertTo-SecureString $setupPwd -AsPlainText -Force
            $AzureStackLCMUserCredential = New-Object System.Management.Automation.PSCredential ($setupUser, $SecurePassword)

            # Create the AD objects and suppress all outputs
            New-HciAdObjectsPreCreation -AzureStackLCMUserCredential $AzureStackLCMUserCredential -AsHciOUName $AsHciOUPath -ErrorAction Stop -WarningAction SilentlyContinue | Out-Null
        } catch {
            throw $_
        } finally {
            # Restore the original ConfirmPreference
            $ConfirmPreference = $ConfirmPreferenceBackup
        }
    } -ArgumentList $setupUser, $setupPwd -ErrorAction Stop -WarningAction SilentlyContinue -Verbose:$false | Out-Null

    Write-Message "Azure Local AD objects created successfully." -Type "Success"
} catch {
    Write-Message "Failed to create Azure Local AD objects. Error: $_" -Type "Error"
    exit 1
}

# Step 12: Final Completion
$currentStep++
Update-ProgressBar -CurrentStep $currentStep -TotalSteps $totalSteps -StatusMessage "Finalizing..."
Write-Message "Domain Controller configuration completed successfully." -Type "Success"

# Complete the overall progress bar
$currentStep = $totalSteps
Update-ProgressBar -CurrentStep $currentStep -TotalSteps $totalSteps -StatusMessage "All tasks completed."

#endregion
```
<!-- 01DC:END -->

### 02_Cluster.ps1

<!-- 02CLUSTER:START -->
```powershell
# 02_Cluster.ps1
# Cluster Node Creation Script

<#
.SYNOPSIS
    Configures the cluster node VM, sets up network settings, installs required features, and registers the node with Azure Arc.

.DESCRIPTION
    This script performs the following tasks:
    - Sets up credentials and network configurations.
    - Removes the ISO from the node VM.
    - Renames the node VM.
    - Configures network adapters with static IP settings.
    - Installs required Windows features.
    - Registers the node with Azure Arc.

.NOTES
    - Designed by Cristian Schmitt Nieto. For more information and usage, visit: https://schmitt-nieto.com/blog/azure-stack-hci-demolab/
    - Run this script with administrative privileges.
    - Ensure the Execution Policy allows the script to run. To set the execution policy, you can run:
      Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
    - Updates:
        - 2024/11/28: Changing Module Versions and ISO for 2411
        - 2025/07/01: Update the scripts for version 2505
        - 2025/07/03: Update the scripts for version 2506
#>

#region Variables

# Credentials and User Configuration
$defaultUser = "Administrator"
$defaultPwd = "Start#1234"
$DefaultSecuredPassword = ConvertTo-SecureString $defaultPwd -AsPlainText -Force
$DefaultCredentials = New-Object System.Management.Automation.PSCredential ($defaultUser, $DefaultSecuredPassword)

$setupUser = "Setupuser"
$setupPwd = "dgemsc#utquMHDHp3M"

# Node Configuration
$nodeName = "NODE"
$NIC1 = "MGMT1"
$NIC2 = "MGMT2"
$nic1IP = "172.19.19.10"
$nic1GW = "172.19.19.1"
$nic1DNS = "172.19.19.2"

# Azure Configuration
$Location = "westeurope"
$Cloud = "AzureCloud"
$SubscriptionID = "000000-00000-000000-00000-0000000"  # Replace with your actual Subscription ID
$resourceGroupName = "YourResourceGroupName"  # Replace with your actual Resource Group Name

# Sleep durations in seconds
$SleepRestart = 60    # Sleep after VM restart
$SleepFeatures = 60   # Sleep after feature installation and restart
$SleepModules = 60    # Sleep after module installation

#endregion

#region Functions

# Function to Display Messages with Colors
function Write-Message {
    param (
        [string]$Message,
        [ValidateSet("Info", "Success", "Warning", "Error")]
        [string]$Type = "Info"
    )

    switch ($Type) {
        "Info"    { Write-Host $Message -ForegroundColor Cyan }
        "Success" { Write-Host $Message -ForegroundColor Green }
        "Warning" { Write-Host $Message -ForegroundColor Yellow }
        "Error"   { Write-Host $Message -ForegroundColor Red }
    }
}

# Function to Format MAC Addresses
function Format-MacAddress {
    param (
        [string]$mac
    )
    return $mac.Insert(2,"-").Insert(5,"-").Insert(8,"-").Insert(11,"-").Insert(14,"-").ToUpper()
}

# Function to Update Progress Bar (Main Progress)
function Update-ProgressBar {
    param (
        [int]$CurrentStep,
        [int]$TotalSteps,
        [string]$StatusMessage
    )

    $percent = [math]::Round(($CurrentStep / $TotalSteps) * 100)
    Write-Progress -Id 1 -Activity "Overall Progress" -Status $StatusMessage -PercentComplete $percent
}

# Function to Start Sleep with Progress Message and Additional Progress Bar (Subtask)
function Start-SleepWithProgress {
    param(
        [int]$Seconds,
        [string]$Activity = "Waiting",
        [string]$Status = "Please wait..."
    )

    Write-Message "$Activity : $Status" -Type "Info"

    for ($i = 1; $i -le $Seconds; $i++) {
        if ([Console]::KeyAvailable) {
            $key = [Console]::ReadKey($true)
            if ($key.Key -eq 'Spacebar') {
                Write-Message "Sleep skipped by user." -Type "Warning"
                break
            }
        }

        $percent = [math]::Round(($i / $Seconds) * 100)
        Write-Progress -Id 2 -Activity "Sleep Progress" -Status "$Activity : $i/$Seconds seconds elapsed... Use Spacebar to Break" -PercentComplete $percent
        Start-Sleep -Seconds 1
    }

    Write-Progress -Id 2 -Activity "Sleep Progress" -Completed
    Write-Message "$Activity : Completed." -Type "Success"
} 

#endregion

#region Script Execution

# Total number of steps for progress calculation
$totalSteps = 5
$currentStep = 0

# Step 1: Remove ISO from VM
$currentStep++
Update-ProgressBar -CurrentStep $currentStep -TotalSteps $totalSteps -StatusMessage "Removing ISO from VM..."
Write-Message "Removing ISO from VM '$nodeName'..." -Type "Info"
try {
    Get-VMDvdDrive -VMName $nodeName | Where-Object { $_.DvdMediaType -eq "ISO" } | Remove-VMDvdDrive -ErrorAction Stop -WarningAction SilentlyContinue | Out-Null
    Write-Message "ISO removed from VM '$nodeName'." -Type "Success"
} catch {
    Write-Message "Failed to remove ISO from VM '$nodeName'. Error: $_" -Type "Error"
    exit 1
}

# Step 2: Create setup user and rename the node
$currentStep++
Update-ProgressBar -CurrentStep $currentStep -TotalSteps $totalSteps -StatusMessage "Creating setup user and renaming VM..."
Write-Message "Creating setup user and renaming VM '$nodeName'..." -Type "Info"
try {
    Invoke-Command -VMName $nodeName -Credential $DefaultCredentials -ScriptBlock {
        param($setupUser, $setupPwd, $nodeName)
        $ErrorActionPreference = 'Stop'; $WarningPreference = 'SilentlyContinue'; $VerbosePreference = 'SilentlyContinue'; $ProgressPreference = 'SilentlyContinue'; $InformationPreference = 'SilentlyContinue'
        Try {
            New-LocalUser -Name $setupUser -Password (ConvertTo-SecureString $setupPwd -AsPlainText -Force) -FullName $setupUser -Description "Setup user" -ErrorAction Stop | Out-Null
            Write-Host "User $setupUser created." -ForegroundColor Green | Out-Null
            Add-LocalGroupMember -Group "Administrators" -Member $setupUser -ErrorAction Stop | Out-Null
            Write-Host "User $setupUser added to Administrators." -ForegroundColor Green | Out-Null
        } Catch {
            Write-Host "Error occurred: $_" -ForegroundColor Red | Out-Null; throw $_
        }
        Rename-Computer -NewName $nodeName -Force -ErrorAction Stop | Out-Null
        Restart-Computer -ErrorAction Stop -Force | Out-Null
    } -ArgumentList $setupUser, $setupPwd, $nodeName -ErrorAction Stop -WarningAction SilentlyContinue | Out-Null
    Write-Message "Setup user created and VM '$nodeName' is restarting..." -Type "Success"
    Start-SleepWithProgress -Seconds $SleepRestart -Activity "Restarting VM" -Status "Waiting for VM to restart"
} catch {
    Write-Message "Failed to create setup user or rename VM '$nodeName'. Error: $_" -Type "Error"
    exit 1
}

# Step 3: Retrieve and format MAC addresses of network adapters
$currentStep++
Update-ProgressBar -CurrentStep $currentStep -TotalSteps $totalSteps -StatusMessage "Retrieving and formatting MAC addresses..."
Write-Message "Retrieving and formatting MAC addresses for VM '$nodeName'..." -Type "Info"
try {
    $nodeMacNIC1 = Get-VMNetworkAdapter -VMName $nodeName -Name $NIC1 -ErrorAction Stop
    $nodeMacNIC1Address = Format-MacAddress $nodeMacNIC1.MacAddress
    $nodeMacNIC2 = Get-VMNetworkAdapter -VMName $nodeName -Name $NIC2 -ErrorAction Stop
    $nodeMacNIC2Address = Format-MacAddress $nodeMacNIC2.MacAddress
    Write-Message "MAC addresses formatted successfully." -Type "Success"
} catch {
    Write-Message "Failed to retrieve or format MAC addresses. Error: $_" -Type "Error"
    exit 1
}

# Step 4: Configure Network Settings
$currentStep++
Update-ProgressBar -CurrentStep $currentStep -TotalSteps $totalSteps -StatusMessage "Configuring network settings..."
Write-Message "Configuring network settings for VM '$nodeName'..." -Type "Info"
try {
    Invoke-Command -VMName $nodeName -Credential $DefaultCredentials -ScriptBlock {
        param($NIC1, $NIC2, $nodeMacNIC1Address, $nodeMacNIC2Address, $nic1IP, $nic1GW, $nic1DNS)
        $ErrorActionPreference = 'Stop'; $WarningPreference = 'SilentlyContinue'; $VerbosePreference = 'SilentlyContinue'; $ProgressPreference = 'SilentlyContinue'; $InformationPreference = 'SilentlyContinue'
        Get-NetAdapter -Physical | Where-Object { $_.MacAddress -eq $nodeMacNIC1Address } | Rename-NetAdapter -NewName $NIC1 -ErrorAction Stop | Out-Null
        Get-NetAdapter -Physical | Where-Object { $_.MacAddress -eq $nodeMacNIC2Address } | Rename-NetAdapter -NewName $NIC2 -ErrorAction Stop | Out-Null
        foreach ($nic in @($NIC1, $NIC2)) {
            Set-NetIPInterface -InterfaceAlias $nic -Dhcp Disabled -ErrorAction Stop | Out-Null
            Enable-NetAdapterRdma -Name $nic -ErrorAction Stop | Out-Null
        }
        New-NetIPAddress -InterfaceAlias $NIC1 -IPAddress $nic1IP -PrefixLength 24 -DefaultGateway $nic1GW -ErrorAction Stop | Out-Null
        Set-DnsClientServerAddress -InterfaceAlias $NIC1 -ServerAddresses $nic1DNS -ErrorAction Stop | Out-Null
        w32tm /config /manualpeerlist:$nic1DNS /syncfromflags:manual /update | Out-Null
        Restart-Service w32time -Force | Out-Null
        w32tm /resync | Out-Null
        Set-TimeZone -Id "UTC"
        Write-Host "Network settings configured." -ForegroundColor Green | Out-Null
        Restart-Computer -ErrorAction Stop | Out-Null
    } -ArgumentList $NIC1, $NIC2, $nodeMacNIC1Address, $nodeMacNIC2Address, $nic1IP, $nic1GW, $nic1DNS -ErrorAction Stop | Out-Null
    Write-Message "VM '$nodeName' is restarting..." -Type "Success"
    Start-SleepWithProgress -Seconds $SleepFeatures -Activity "Restarting VM" -Status "Waiting for VM to restart"
    Write-Message "Network settings configured successfully for VM '$nodeName'." -Type "Success"
} catch {
    Write-Message "Failed to configure network settings for VM '$nodeName'. Error: $_" -Type "Error"
    exit 1
}

# Step 5: Invoke Azure Local Arc Initialization on the node
$currentStep++
Update-ProgressBar -CurrentStep $currentStep -TotalSteps $totalSteps -StatusMessage "Registering node with Azure Arc..."
Write-Message "Registering VM '$nodeName' with Azure Arc..." -Type "Info"
try {
    Start-SleepWithProgress -Seconds $SleepModules -Activity "Waiting for PowerShell Modules" -Status "Preparing to register"
    Invoke-Command -VMName $nodeName -Credential $DefaultCredentials -ScriptBlock {
        param($Cloud, $Location, $SubscriptionID, $resourceGroupName)

        <# Install required modules
        $requiredModules = @("Az.Accounts")        
        foreach ($module in $requiredModules) {
            if (-not (Get-Module -Name $module -ListAvailable)) {
                Write-Host "Installing module: $module 4.0.2" -ForegroundColor Cyan
                Install-Module -Name $module -RequiredVersion 4.0.2 -Force -ErrorAction Stop | Out-Null
              } else {
                Write-Host "Module $module is already installed." -ForegroundColor Green
            }
        }
        #>
        # Connect and select resource group
        Start-Sleep -Seconds 2
        Connect-AzAccount -UseDeviceAuthentication -Subscription $SubscriptionID -ErrorAction Stop
        Start-Sleep -Seconds 1
        $TenantID = (Get-AzContext).Tenant.Id
        $SubscriptionID = (Get-AzContext).Subscription.Id
        $ARMToken = (Get-AzAccessToken).Token
        $AccountId = (Get-AzContext).Account.Id
        Start-Sleep -Seconds 10
        
        $task = Get-ScheduledTask -TaskName ImageCustomizationScheduledTask
        if ($task.State -eq 'Ready') {
            Start-ScheduledTask -InputObject $task
            Write-Host "ImageCustomizationScheduledTask was in 'Ready' state and has been started." -ForegroundColor Cyan
        } else {
            Write-Host "ImageCustomizationScheduledTask is not in 'Ready' state (current state: $($task.State)). Skipping start." -ForegroundColor Yellow
        }
        # Ensure the Azure Arc module is available
        Start-Sleep -Seconds 40
        # Invoke Arc initialization
        Invoke-AzStackHciArcInitialization -SubscriptionID $SubscriptionID `
                                           -ResourceGroup $resourceGroupName `
                                           -TenantID $TenantID `
                                           -Cloud $Cloud `
                                           -Region $Location `
                                           -ArmAccessToken $ARMToken `
                                           -AccountID $AccountId -ErrorAction Stop | Out-Null

        Write-Host "VM '$env:COMPUTERNAME' registered with Azure Arc successfully." -ForegroundColor Green
    } -ArgumentList $Cloud, $Location, $SubscriptionID, $resourceGroupName -ErrorAction Stop
} catch {
    Write-Message "Version 2506 it´s a false postive error message: Failed to register VM '$nodeName' with Azure Arc. Error: $_" -Type "Error"
    exit 1
}

# Complete the overall progress bar
Update-ProgressBar -CurrentStep $totalSteps -TotalSteps $totalSteps -StatusMessage "All tasks completed."
Write-Message "Cluster node configuration completed successfully." -Type "Success"

#endregion
```
<!-- 02CLUSTER:END -->

### 03_TroubleshootingExtensions.ps1

<!-- 03TROUBLESHOOTING:START -->
```powershell
# 03_TroubleshootingExtensions.ps1
# Troubleshooting Azure Connected Machine Extensions for ARC VMs

<#
.SYNOPSIS
    Troubleshoots and manages Azure Connected Machine extensions for ARC VMs.

.DESCRIPTION
    This script performs the following tasks:
    - Installs the Az.Compute and Az.StackHCI modules if not already installed.
    - Connects to Azure using device code authentication and allows the user to select a Subscription and Resource Group.
    - Retrieves ARC VMs from Azure using Az.StackHCI, filtering for ARC Machines with CloudMetadataProvider "AzSHCI".
    - Validates that required Azure Connected Machine extensions are installed.
    - Fixes any failed extensions by removing locks, deleting, and reinstalling them.
    - Adds any missing extensions based on a predefined list.

.NOTES
    - Based on Jaromir´s aproach: https://github.com/DellGEOS/AzureStackHOLs/tree/main/tips%26tricks/05-FixExtensions
    - Designed by Cristian Schmitt Nieto. For more information and usage, visit: https://schmitt-nieto.com/blog/azure-stack-hci-demolab/
    - Run this script with administrative privileges.
    - Ensure the Execution Policy allows the script to run. To set the execution policy, you can run:
      Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
#>

#region Variables

# Extension Settings
$Location = "westeurope"

$Settings = @{ 
    "CloudName" = "AzureCloud"; 
    "RegionName" = $Location; 
    "DeviceType" = "AzureEdge" 
}

$ExtensionList = @(
    @{ Name = "AzureEdgeTelemetryAndDiagnostics"; Publisher = "Microsoft.AzureStack.Observability"; MachineExtensionType = "TelemetryAndDiagnostics" },
    @{ Name = "AzureEdgeDeviceManagement"; Publisher = "Microsoft.Edge"; MachineExtensionType = "DeviceManagementExtension" },
    @{ Name = "AzureEdgeLifecycleManager"; Publisher = "Microsoft.AzureStack.Orchestration"; MachineExtensionType = "LcmController" },
    @{ Name = "AzureEdgeRemoteSupport"; Publisher = "Microsoft.AzureStack.Observability"; MachineExtensionType = "EdgeRemoteSupport" }
)

# Total number of steps for progress calculation
$totalSteps = 9
$currentStep = 0

#endregion

#region Functions

# Function to Display Messages with Colors
function Write-Message {
    param (
        [string]$Message,
        [ValidateSet("Info", "Success", "Warning", "Error")]
        [string]$Type = "Info"
    )

    switch ($Type) {
        "Info"    { Write-Host $Message -ForegroundColor Cyan }
        "Success" { Write-Host $Message -ForegroundColor Green }
        "Warning" { Write-Host $Message -ForegroundColor Yellow }
        "Error"   { Write-Host $Message -ForegroundColor Red }
    }

    # Optional: Log messages to a file
    # Uncomment and configure the following lines to enable logging
    # $LogFile = "C:\Path\To\Your\LogFile.txt"
    # Add-Content -Path $LogFile -Value "$((Get-Date).ToString('yyyy-MM-dd HH:mm:ss')) [$Type] $Message"
}

# Function to Update Progress Bar (Main Progress)
function Update-ProgressBar {
    param (
        [int]$CurrentStep,
        [int]$TotalSteps,
        [string]$StatusMessage
    )

    $percent = [math]::Round(($CurrentStep / $TotalSteps) * 100)
    Write-Progress -Id 1 -Activity "Overall Progress" -Status $StatusMessage -PercentComplete $percent
}

# Function to Install Az.Compute Module if Not Installed
function Install-AzComputeModule {
    if (-not (Get-Module -ListAvailable -Name Az.Compute)) {
        Write-Message "Az.Compute module not found. Installing..." -Type "Info"
        try {
            Install-Module -Name Az.Compute -Repository PSGallery -Force -AllowClobber -ErrorAction Stop
            Write-Message "Az.Compute module installed successfully." -Type "Success"
        } catch {
            Write-Message "Failed to install Az.Compute module. Error: $_" -Type "Error"
            exit 1
        }
    } else {
        Write-Message "Az.Compute module is already installed." -Type "Info"
    }
}

# Function to Install Az.StackHCI Module if Not Installed
function Install-AzStackHCIModule {
    if (-not (Get-Module -ListAvailable -Name Az.StackHCI)) {
        Write-Message "Az.StackHCI module not found. Installing..." -Type "Info"
        try {
            Install-Module -Name Az.StackHCI -Repository PSGallery -Force -AllowClobber -ErrorAction Stop
            Write-Message "Az.StackHCI module installed successfully." -Type "Success"
        } catch {
            Write-Message "Failed to install Az.StackHCI module. Error: $_" -Type "Error"
            exit 1
        }
    } else {
        Write-Message "Az.StackHCI module is already installed." -Type "Info"
    }
}

# Function to Allow Selection from a List
function Get-Option {
    param (
        [string]$cmd,
        [string]$filterproperty
    )

    $items = @("")
    $selection = $null
    $filteredItems = @()
    $i = 0
    try {
        $cmdOutput = Invoke-Expression -Command $cmd | Sort-Object $filterproperty
        foreach ($item in $cmdOutput) {
            $items += "{0}. {1}" -f $i, $item.$filterproperty
            $i++
        }
    } catch {
        Write-Message "Failed to execute command '$cmd'. Error: $_" -Type "Error"
        exit 1
    }

    $filteredItems += $items | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
    $filteredItems | Format-Wide { $_ } -Column 4 -Force | Out-Host

    do {
        $r = Read-Host "Select by number"
        if ($r -match '^\d+$' -and $r -lt $filteredItems.Count) {
            $selection = $filteredItems[$r] -split "\.\s" | Select-Object -Last 1
            Write-Host "Selecting $($filteredItems[$r])" -ForegroundColor Green
        } else {
            Write-Host "You must make a valid selection" -ForegroundColor Red
            $selection = $null
        }
    } until ($null -ne $selection)
    return $selection
}

# Function to Retrieve ARC VMs from Azure using Az.StackHCI
function Get-ARCVMsFromAzure {
    param(
        [string]$SubscriptionId,
        [string]$ResourceGroupName
    )

    try {
        # Retrieve all connected machines in the resource group
        $connectedMachines = Get-AzConnectedMachine -ResourceGroupName $ResourceGroupName -ErrorAction Stop

        if ($connectedMachines.Count -eq 0) {
            Write-Message "No connected machines found in resource group '$ResourceGroupName'." -Type "Warning"
            return @()
        }

        # Filter connected machines where CloudMetadataProvider is "AzSHCI"
        $ARCVMs = $connectedMachines | Where-Object { $_.CloudMetadataProvider -eq "AzSHCI" }

        if ($ARCVMs.Count -eq 0) {
            Write-Message "No ARC VMs (Machines with CloudMetadataProvider 'AzSHCI') found in resource group '$ResourceGroupName'." -Type "Warning"
        } else {
            Write-Message "Retrieved $($ARCVMs.Count) ARC VM(s) from Azure." -Type "Success"
        }

        return $ARCVMs
    } catch {
        Write-Message "Failed to retrieve ARC VMs from Azure. Error: $_" -Type "Error"
        exit 1
    }
}

# Function to Validate Installed Extensions
function Test-Extensions {
    param(
        [array]$ARCVMs,
        [string]$ResourceGroupName
    )

    $Extensions = @()
    foreach ($ARCVM in $ARCVMs) {
        try {
            $extensions = Get-AzConnectedMachineExtension -ResourceGroupName $ResourceGroupName -MachineName $ARCVM.Name -ErrorAction Stop
            $Extensions += $extensions
        } catch {
            Write-Message "Failed to retrieve extensions for ARC VM '$($ARCVM.Name)'. Error: $_" -Type "Error"
            exit 1
        }
    }

    return $Extensions
}

#endregion

#region Script Execution

# Step 1: Install Az.Compute Module
$currentStep++
Update-ProgressBar -CurrentStep $currentStep -TotalSteps $totalSteps -StatusMessage "Ensuring Az.Compute module is installed..."
Write-Message "Checking for Az.Compute module..." -Type "Info"
try {
    Install-AzComputeModule
} catch {
    Write-Message "An error occurred while ensuring Az.Compute module is installed. Error: $_" -Type "Error"
    exit 1
}

# Step 2: Install Az.StackHCI Module
$currentStep++
Update-ProgressBar -CurrentStep $currentStep -TotalSteps $totalSteps -StatusMessage "Ensuring Az.StackHCI module is installed..."
Write-Message "Checking for Az.StackHCI module..." -Type "Info"
try {
    Install-AzStackHCIModule
} catch {
    Write-Message "An error occurred while ensuring Az.StackHCI module is installed. Error: $_" -Type "Error"
    exit 1
}

# Step 3: Connect to Azure using Device Code Authentication
$currentStep++
Update-ProgressBar -CurrentStep $currentStep -TotalSteps $totalSteps -StatusMessage "Connecting to Azure using device code authentication..."
Write-Message "Connecting to Azure..." -Type "Info"
try {
    Connect-AzAccount -UseDeviceAuthentication -ErrorAction Stop
    Write-Message "Connected to Azure successfully." -Type "Success"
} catch {
    Write-Message "Failed to connect to Azure using device code authentication. Error: $_" -Type "Error"
    exit 1
}

# Step 4: Select Subscription
$currentStep++
Update-ProgressBar -CurrentStep $currentStep -TotalSteps $totalSteps -StatusMessage "Selecting Azure Subscription..."
Write-Message "Retrieving available Azure Subscriptions..." -Type "Info"
try {
    #$subscription = Get-Option "Get-AzSubscription" "Name"
    #Set-AzContext -SubscriptionName $subscription -ErrorAction Stop
    $selectedSubscription = Get-AzContext -ErrorAction Stop
    $SubscriptionId = $selectedSubscription.Subscription.Id
    Write-Message "Selected Subscription: $($selectedSubscription.Subscription.Name)" -Type "Success"
} catch {
    Write-Message "Failed to select or set Azure Subscription. Error: $_" -Type "Error"
    exit 1
}

# Step 5: Select Resource Group
$currentStep++
Update-ProgressBar -CurrentStep $currentStep -TotalSteps $totalSteps -StatusMessage "Selecting Resource Group..."
Write-Message "Retrieving available Resource Groups in Subscription '$($selectedSubscription.Subscription.Name)'..." -Type "Info"
try {
    $resourceGroup = Get-Option "Get-AzResourceGroup" "ResourceGroupName"
    $ResourceGroupName = $resourceGroup
    Write-Message "Selected Resource Group: $ResourceGroupName" -Type "Success"
} catch {
    Write-Message "Failed to select Resource Group. Error: $_" -Type "Error"
    exit 1
}

# Step 6: Retrieve ARC VMs from Azure
$currentStep++
Update-ProgressBar -CurrentStep $currentStep -TotalSteps $totalSteps -StatusMessage "Retrieving ARC VMs from Azure..."
Write-Message "Retrieving ARC VMs from Azure..." -Type "Info"
try {
    $ARCVMs = Get-ARCVMsFromAzure -SubscriptionId $SubscriptionId -ResourceGroupName $ResourceGroupName
    if ($ARCVMs.Count -eq 0) {
        Write-Message "No ARC VMs found. Exiting script." -Type "Error"
        exit 1
    }
} catch {
    Write-Message "An error occurred while retrieving ARC VMs. Error: $_" -Type "Error"
    exit 1
}

# Step 7: Select ARC VM
$currentStep++
Update-ProgressBar -CurrentStep $currentStep -TotalSteps $totalSteps -StatusMessage "Selecting ARC VM..."
Write-Message "Selecting an ARC VM..." -Type "Info"
try {
    # Prepare the list for selection
    $arcVmNames = $ARCVMs | Select-Object -ExpandProperty Name

    # Construct the command string for Get-Option
    # Create a temporary array to hold objects with Name property
    $tempList = @()
    foreach ($arcVm in $ARCVMs) {
        $tempList += [PSCustomObject]@{ Name = $arcVm.Name }
    }

    # Export the temporary list to a temporary file
    $tempList | Export-Clixml -Path "$env:TEMP\ARCVMList.xml"

    # Use Get-Option by importing the temporary list
    function Get-Option-FromList {
        param (
            [string]$filterproperty
        )
        $items = @("")
        $selection = $null
        $filteredItems = @()
        $i = 0
        $cmdOutput = Import-Clixml -Path "$env:TEMP\ARCVMList.xml" | Sort-Object $filterproperty
        foreach ($item in $cmdOutput) {
            $items += "{0}. {1}" -f $i, $item.$filterproperty
            $i++
        }
        $filteredItems += $items | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
        $filteredItems | Format-Wide { $_ } -Column 4 -Force | Out-Host

        do {
            $r = Read-Host "Select by number"
            if ($r -match '^\d+$' -and $r -lt $filteredItems.Count) {
                $selection = $filteredItems[$r] -split "\.\s" | Select-Object -Last 1
                Write-Host "Selecting $($filteredItems[$r])" -ForegroundColor Green
            } else {
                Write-Host "You must make a valid selection" -ForegroundColor Red
                $selection = $null
            }
        } until ($null -ne $selection)
        return $selection
    }

    # Allow user to select an ARC VM
    $selectedARCVMName = Get-Option-FromList "Name"

    # Find the selected ARC VM object
    $selectedARCVM = $ARCVMs | Where-Object { $_.Name -eq $selectedARCVMName }

    if (-not $selectedARCVM) {
        Write-Message "No ARC VM selected. Exiting script." -Type "Error"
        exit 1
    } else {
        Write-Message "Selected ARC VM: $($selectedARCVM.Name)" -Type "Success"
    }

    # Remove temporary XML file
    Remove-Item -Path "$env:TEMP\ARCVMList.xml" -Force -ErrorAction SilentlyContinue

} catch {
    Write-Message "An error occurred while selecting ARC VM. Error: $_" -Type "Error"
    exit 1
}

# Step 8: Validate Installed Extensions
$currentStep++
Update-ProgressBar -CurrentStep $currentStep -TotalSteps $totalSteps -StatusMessage "Validating installed extensions..."
Write-Message "Validating installed Azure Connected Machine extensions on ARC VM '$($selectedARCVM.Name)'..." -Type "Info"
try {
    $Extensions = Test-Extensions -ARCVMs @($selectedARCVM) -ResourceGroupName $ResourceGroupName
    Write-Message "Extension validation completed." -Type "Success"
} catch {
    Write-Message "An error occurred during extension validation. Error: $_" -Type "Error"
    exit 1
}

# Step 9: Fix Failed Extensions and Add Missing Extensions
$currentStep++
Update-ProgressBar -CurrentStep $currentStep -TotalSteps $totalSteps -StatusMessage "Fixing failed extensions and adding missing ones..."
Write-Message "Identifying and fixing failed extensions, then adding any missing extensions on ARC VM '$($selectedARCVM.Name)'..." -Type "Info"
try {
    # Fix failed extensions
    $FailedExtensions = $Extensions | Where-Object ProvisioningState -eq "Failed"

    if ($FailedExtensions.Count -eq 0) {
        Write-Message "No failed extensions found." -Type "Success"
    } else {
        foreach ($FailedExtension in $FailedExtensions) {
            $Server = $FailedExtension.MachineName
            Write-Message "Processing failed extension '$($FailedExtension.Name)' on server '$Server'..." -Type "Info"
            
            # Remove lock first
            $Locks = Get-AzResourceLock -ResourceGroupName $ResourceGroupName | Where-Object ResourceID -like "*HybridCompute/machines/$Server*"
            if ($Locks.Count -gt 0) {
                foreach ($lock in $Locks) {
                    Write-Message "Removing lock '$($lock.Name)' from server '$Server'..." -Type "Info"
                    Remove-AzResourceLock -LockId $lock.LockId -Force -ErrorAction Stop
                }
                Write-Message "Locks removed from server '$Server'." -Type "Success"
            }

            # Remove the failed extension
            Write-Message "Removing failed extension '$($FailedExtension.Name)' from server '$Server'..." -Type "Info"
            Remove-AzConnectedMachineExtension -Name $FailedExtension.Name -ResourceGroupName $FailedExtension.ResourceGroupName -MachineName $Server -ErrorAction Stop
            Write-Message "Failed extension '$($FailedExtension.Name)' removed from server '$Server'." -Type "Success"

            # Re-add the extension
            Write-Message "Reinstalling extension '$($FailedExtension.Name)' on server '$Server'..." -Type "Info"
            New-AzConnectedMachineExtension -Name $FailedExtension.Name `
                                            -ResourceGroupName $FailedExtension.ResourceGroupName `
                                            -MachineName $Server `
                                            -Location $FailedExtension.Location `
                                            -Publisher $FailedExtension.Publisher `
                                            -Settings $Settings `
                                            -ExtensionType $FailedExtension.MachineExtensionType `
                                            -ErrorAction Stop
            Write-Message "Extension '$($FailedExtension.Name)' reinstalled on server '$Server'." -Type "Success"
        }
    }

    # Add missing extensions
    Write-Message "Adding any missing Azure Connected Machine extensions..." -Type "Info"
    foreach ($Extension in $ExtensionList) {
        # Check if the extension is already installed on the ARC VM
        $isInstalled = $Extensions | Where-Object { $_.Name -eq $Extension.Name -and $_.MachineName -eq $selectedARCVM.Name }

        if (-not $isInstalled) {
            Write-Message "Installing missing extension '$($Extension.Name)' on server '$($selectedARCVM.Name)'..." -Type "Info"
            New-AzConnectedMachineExtension -Name $Extension.Name `
                                            -ResourceGroupName $ResourceGroupName `
                                            -MachineName $selectedARCVM.Name `
                                            -Location $Location `
                                            -Publisher $Extension.Publisher `
                                            -Settings $Settings `
                                            -ExtensionType $Extension.MachineExtensionType `
                                            -ErrorAction Stop
            Write-Message "Extension '$($Extension.Name)' installed successfully on server '$($selectedARCVM.Name)'." -Type "Success"
        } else {
            Write-Message "Extension '$($Extension.Name)' already installed on server '$($selectedARCVM.Name)'. Skipping." -Type "Info"
        }
    }
} catch {
    Write-Message "An error occurred while fixing failed extensions or adding missing ones. Error: $_" -Type "Error"
    exit 1
}

# Complete the overall progress bar
Update-ProgressBar -CurrentStep $totalSteps -TotalSteps $totalSteps -StatusMessage "All tasks completed."

# Final success message
Write-Message "Azure Connected Machine extensions troubleshooting completed successfully." -Type "Success"

#endregion
```
<!-- 03TROUBLESHOOTING:END -->

### 99_Offboarding.ps1

<!-- 99OFFBOARDING:START -->
```powershell
# Offboarding Script to Clean Up Configurations

<#
.SYNOPSIS
    Cleans up VM configurations, virtual switches, NAT settings, and associated folders.

.DESCRIPTION
    This script performs the following tasks:
    - Stops and removes specified VMs.
    - Deletes associated VHD files.
    - Removes HgsGuardian entries.
    - Deletes virtual switches and NAT configurations.
    - Removes designated folder structures.

.NOTES
    - Designed by Cristian Schmitt Nieto. For more information and usage, visit: https://schmitt-nieto.com/blog/azure-stack-hci-demolab/
    - Run this script with administrative privileges.
    - Ensure the Execution Policy allows the script to run. To set the execution policy, you can run:
      Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
#>

#region Variables

# Define VM Names
$HCIVMName = "NODE"
$DCVMName = "DC"

# Define Virtual Switch and NAT Configuration
$vSwitchName = "azurestackhci"
$vSwitchNIC = "vEthernet ($vSwitchName)"
$natName = "azurestackhci"

# Define Root Folder for VMs and Disks
$HCIRootFolder = "C:\HCI"
$HCIDiskFolder = Join-Path -Path $HCIRootFolder -ChildPath "Disk"

# Define Tasks for Progress Bar
$tasks = @(
    "Stopping and Removing HCI Node VM",
    "Stopping and Removing Domain Controller VM",
    "Removing NAT Configuration",
    "Removing IP Addresses from Virtual Switch Interface",
    "Removing Virtual Switch",
    "Removing Folder Structures"
)

$totalTasks = $tasks.Count
$currentTask = 0

#endregion

#region Functions

# Function to Display Messages with Colors
function Write-Message {
    param (
        [string]$Message,
        [ValidateSet("Info", "Success", "Warning", "Error")]
        [string]$Type = "Info"
    )

    switch ($Type) {
        "Info"    { Write-Host $Message -ForegroundColor Cyan }
        "Success" { Write-Host $Message -ForegroundColor Green }
        "Warning" { Write-Host $Message -ForegroundColor Yellow }
        "Error"   { Write-Host $Message -ForegroundColor Red }
    }
}

# Function to Remove VMs and Associated Resources
function Remove-VMResources {
    param (
        [string]$VMName,
        [string]$DiskFolder
    )

    # Suppress non-critical outputs within the function
    $ErrorActionPreference = 'Stop'
    $WarningPreference = 'SilentlyContinue'
    $VerbosePreference = 'SilentlyContinue'
    $ProgressPreference = 'SilentlyContinue'

    # Stop and remove the VM if it exists
    $vm = Get-VM -Name $VMName -ErrorAction SilentlyContinue
    if ($null -ne $vm) {
        if ($vm.State -in @('Running', 'Paused', 'Suspended')) {
            try {
                Stop-VM -Name $VMName -Force -ErrorAction Stop | Out-Null
                Write-Message "VM '$VMName' stopped." -Type "Success"
            } catch {
                Write-Message "Failed to stop VM '$VMName'. Error: $_" -Type "Error"
                return
            }
        }

        # Remove the VM
        try {
            Remove-VM -Name $VMName -Force -ErrorAction Stop | Out-Null
            Write-Message "VM '$VMName' removed." -Type "Success"
        } catch {
            Write-Message "Failed to remove VM '$VMName'. Error: $_" -Type "Error"
            return
        }

        # Remove VHD files
        $vhdFiles = Get-ChildItem -Path $DiskFolder -Filter "$VMName*.vhdx" -Recurse -ErrorAction SilentlyContinue
        foreach ($vhd in $vhdFiles) {
            try {
                Remove-Item -Path $vhd.FullName -Force -ErrorAction Stop | Out-Null
                Write-Message "VHD file '$($vhd.FullName)' deleted." -Type "Success"
            } catch {
                Write-Message "Failed to delete VHD file '$($vhd.FullName)'. Error: $_" -Type "Error"
            }
        }

        # Remove HgsGuardian if it exists
        try {
            Remove-HgsGuardian -Name $VMName -ErrorAction SilentlyContinue -WarningAction SilentlyContinue | Out-Null
            Write-Message "HgsGuardian '$VMName' removed." -Type "Success"
        } catch {
            Write-Message "Failed to remove HgsGuardian '$VMName'. Error: $_" -Type "Error"
        }
    } else {
        Write-Message "VM '$VMName' does not exist. Skipping removal." -Type "Warning"
    }

    # Reset preferences to default
    $ErrorActionPreference = 'Continue'
    $WarningPreference = 'Continue'
    $VerbosePreference = 'Continue'
    $ProgressPreference = 'Continue'
}

#endregion

#region Script Execution

foreach ($task in $tasks) {
    $currentTask++
    Write-Progress -Activity "Cleaning Up Configurations" -Status "$task..." -PercentComplete (($currentTask / $totalTasks) * 100)

    switch ($task) {
        "Stopping and Removing HCI Node VM" {
            Remove-VMResources -VMName $HCIVMName -DiskFolder $HCIDiskFolder
        }
        "Stopping and Removing Domain Controller VM" {
            Remove-VMResources -VMName $DCVMName -DiskFolder $HCIDiskFolder
        }
        "Removing NAT Configuration" {
            Write-Message "Removing NAT configuration '$natName'..." -Type "Info"
            try {
                Remove-NetNat -Name $natName -Confirm:$false -ErrorAction Stop | Out-Null
                Write-Message "NAT '$natName' removed." -Type "Success"
            } catch [System.Management.Automation.ItemNotFoundException] {
                Write-Message "NAT '$natName' does not exist. Skipping removal." -Type "Warning"
            } catch {
                Write-Message "Failed to remove NAT '$natName'. Error: $_" -Type "Error"
            }
        }
        "Removing IP Addresses from Virtual Switch Interface" {
            Write-Message "Removing IP addresses from interface '$vSwitchNIC'..." -Type "Info"
            try {
                $ipAddresses = Get-NetIPAddress -InterfaceAlias $vSwitchNIC -ErrorAction Stop
                foreach ($ip in $ipAddresses) {
                    try {
                        Remove-NetIPAddress -InterfaceAlias $vSwitchNIC -IPAddress $ip.IPAddress -Confirm:$false -ErrorAction Stop | Out-Null
                        Write-Message "IP address '$($ip.IPAddress)' removed from interface '$vSwitchNIC'." -Type "Success"
                    } catch {
                        Write-Message "Failed to remove IP address '$($ip.IPAddress)' from interface '$vSwitchNIC'. Error: $_" -Type "Error"
                    }
                }
            } catch [System.Management.Automation.ItemNotFoundException] {
                Write-Message "No IP addresses found on interface '$vSwitchNIC'. Skipping removal." -Type "Warning"
            } catch {
                Write-Message "Failed to retrieve IP addresses from interface '$vSwitchNIC'. Error: $_" -Type "Error"
            }
        }
        "Removing Virtual Switch" {
            Write-Message "Removing virtual switch '$vSwitchName'..." -Type "Info"
            try {
                Remove-VMSwitch -Name $vSwitchName -Force -ErrorAction Stop | Out-Null
                Write-Message "Virtual switch '$vSwitchName' removed." -Type "Success"
            } catch [System.Management.Automation.ItemNotFoundException] {
                Write-Message "Virtual switch '$vSwitchName' does not exist. Skipping removal." -Type "Warning"
            } catch {
                Write-Message "Failed to remove virtual switch '$vSwitchName'. Error: $_" -Type "Error"
            }
        }
        "Removing Folder Structures" {
            Write-Message "Removing folder structures at '$HCIRootFolder'..." -Type "Info"
            if (Test-Path -Path $HCIRootFolder) {
                try {
                    Remove-Item -Path $HCIRootFolder -Recurse -Force -ErrorAction Stop | Out-Null
                    Write-Message "Folder '$HCIRootFolder' and all its contents have been deleted." -Type "Success"
                } catch {
                    Write-Message "Failed to delete folder '$HCIRootFolder'. Error: $_" -Type "Error"
                }
            } else {
                Write-Message "Folder '$HCIRootFolder' does not exist. Skipping removal." -Type "Warning"
            }
        }
    }
}

# Complete the Progress Bar
Write-Progress -Activity "Cleaning Up Configurations" -Completed -Status "All tasks completed."

Write-Message "Cleanup completed successfully." -Type "Success"

#endregion
```
<!-- 99OFFBOARDING:END -->
