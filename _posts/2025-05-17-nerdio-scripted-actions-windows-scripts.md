---
title: "Nerdio Scripted Actions: Windows Scripts"
excerpt: "Discover how to leverage Nerdio Scripted Actions with Windows Scripts to automate Azure Virtual Desktop deployments."
date: 2025-05-17
categories:
  - Blog
tags:
  - Azure Virtual Desktop
  - Nerdio
  - Scripted Actions
  - Windows Scripts
sticky: false

header:
  teaser: "/assets/img/post/2025-05-17-nerdio-scripted-actions-windows-scripts.webp"
  image: "/assets/img/post/2025-05-17-nerdio-scripted-actions-windows-scripts.webp"
  og_image: "/assets/img/post/2025-05-17-nerdio-scripted-actions-windows-scripts.webp"
  overlay_image: "/assets/img/post/2025-05-17-nerdio-scripted-actions-windows-scripts.webp"
  overlay_filter: 0.5
  caption: "Photo credit: [**ChatGPT**](https://chatgpt.com)"

toc: true
toc_label: "Topics Overview"
toc_icon: "list-ul"

---

## Introduction

Welcome to a new post! Today I’m diving into a topic I’ve discussed with countless colleagues in the Azure Virtual Desktop (AVD) community: **Nerdio Scripted Actions**, and in particular **Windows Scripts**. When I chat with fellow IT pros about how they handle AVD deployments, some lean on a variation of [AVD Accelerator](https://github.com/Azure/avdaccelerator), others use tools like [Nerdio](https://getnerdio.com/) or [Hydra](https://www.itprocloud.com/Hydra/), and many stick with native deployment and management.

Personally, I avoid debates about which option is “best”, since each has its own niche and use cases. What I can say with confidence is that the projects where I’ve used Nerdio have been incredibly easy to adapt for clients, thanks to its simplicity. One feature that both I and my clients rely on heavily is [Scripted Actions](https://nmehelp.getnerdio.com/hc/en-us/articles/26124327585421-Scripted-Actions-Overview), specifically [Windows Scripts](https://nmehelp.getnerdio.com/hc/en-us/articles/26124334667149-Scripted-Actions-for-Windows-Scripts), which let you automate repetitive tasks in a very straightforward way.

As more scenarios emerge that require AVD without a traditional Active Directory, using scripts to configure session hosts before they even boot up is on the rise, since applying those settings via Intune can take time. With that in mind, I created the GitHub repository “[nerdio-scripted-actions](https://github.com/schmittnieto/nerdio-scripted-actions),” where I’ll be hosting most of the scripts I develop. More on that later!

## How Scripted Actions Work

Scripted Actions in Nerdio Manager are PowerShell scripts that run either on Windows VMs (Windows Scripts) or as Azure Runbooks. They let you customize and automate tasks, like installing software, configuring settings, or performing maintenance, at various points in the VM lifecycle.

<a href="/assets/img/post/2025-05-17-nerdio-scripted-actions-windows-scripts/diagramm.png" target="_blank">
  <img src="/assets/img/post/2025-05-17-nerdio-scripted-actions-windows-scripts/diagramm.png" alt="Nerdio Scripted Actions" style="border: 2px solid grey;">
</a>

### Azure Runbooks in Nerdio

Azure Runbooks run your PowerShell scripts *outside* of a VM, leveraging Azure Automation. This is great for tasks that don’t require logging into each machine:

- Add data disks to VMs  
- Assign or unassign users to personal desktops  
- Change OS disk type of stopped VMs  
- Shrink FSLogix profiles  
- Enable hibernation or OS disk encryption  
- Set regional settings  
- Create NAT Gateways  
- Power on VMs for a specific window  
- Update Nerdio Manager or the AVD Agent  

### Windows Scripts in Nerdio

Windows Scripts run *inside* the VM via the Custom Script Extension. They’re perfect for installing apps, tweaking settings, or running any PowerShell code with admin rights, without interrupting user sessions.

<a href="/assets/img/post/2025-05-17-nerdio-scripted-actions-windows-scripts/diagramm-windows.png" target="_blank">
  <img src="/assets/img/post/2025-05-17-nerdio-scripted-actions-windows-scripts/diagramm-windows.png" alt="Nerdio Scripted Actions Windows Scripts" style="border: 2px solid grey;">
</a>

Out of the box, Nerdio provides many ready-to-use scripts, such as:

- Installing popular apps via Chocolatey (Chrome, 7zip, VSCode, Adobe Reader…)  
- Installing Microsoft 365, Teams, OneDrive  
- Enabling clipboard transfer or screen-capture protection  
- Applying Windows or AVD performance optimizations  
- Installing FSLogix or security agents (e.g., Sophos)  
- Granting local admin rights to users  
- Running Windows 10/11 updates  
- Restarting the AVD Agent or adjusting Sysprep settings  

## Where Can Scripted Actions Be Used?

Scripted Actions in Nerdio Manager can be applied at various stages of the VM lifecycle:

1. **Desktop Images (Golden Images)**  
   - **Purpose**: Customize and prepare your base images.  
   - **Use Cases**: Install or update applications, apply system optimizations, configure settings before sealing the image.  
   - **Application**: During the “Set as image” process, you can run scripts on the source VM or the clone VM.  
   - **Reference**: [Update a Desktop Image and Hosts](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125609569805-Update-a-Desktop-Image-and-Hosts)

2. **Host Pool VM Lifecycle Events**  
   - **Purpose**: Automate tasks during VM provisioning and management.  
   - **Use Cases**: Execute scripts when a VM is created, started, stopped, or deleted; install agents or configure settings during VM deployment.  
   - **Application**: Assign scripts to specific VM lifecycle events within a host pool.  
   - **Reference**: [Overview of Scripted Actions](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125616197901-Overview-of-Scripted-Actions)

3. **Re-imaging Hosts**  
   - **Purpose**: Apply updates or changes across existing session hosts.  
   - **Use Cases**: Re-apply configurations or software installations; ensure consistency across all hosts after updating the base image.  
   - **Application**: During the re-image process, scripts can execute to apply necessary changes.  
   - **Reference**: [Update a Desktop Image and Hosts](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125609569805-Update-a-Desktop-Image-and-Hosts)

4. **Manual Execution on Host Pools**  
   - **Purpose**: Perform ad-hoc tasks across multiple VMs.  
   - **Use Cases**: Run maintenance scripts; apply quick fixes or updates without full redeployment.  
   - **Application**: Use the “Run script” option within a host pool to execute scripts on selected VMs.  
   - **Reference**: [Overview of Scripted Actions](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125616197901-Overview-of-Scripted-Actions)

5. **Scheduled Tasks**  
   - **Purpose**: Automate recurring maintenance or updates.  
   - **Use Cases**: Schedule regular updates or clean-up tasks; automate routine maintenance scripts.  
   - **Application**: Configure scripts to run on a defined schedule within Nerdio Manager.  
   - **Reference**: [Keeping your Image Current with Windows Updates Automatically](https://nmmhelp.getnerdio.com/hc/en-us/community/posts/4416937676429-Tips-And-Tricks-Keeping-your-Image-Current-with-Windows-Updates-Automatically)

## Scripted Action Groups in Nerdio Manager

Scripted Action Groups let you combine multiple scripted actions (Windows Scripts or Azure Runbooks) into one reusable group. These groups simplify automation by allowing a set of scripts to execute in sequence during tasks like VM provisioning or image updates.

### Key Features

- **Sequential Execution**  
  Scripts within a group run one after another in the defined order, you can rearrange them with drag & drop.

- **Reusability**  
  Apply the same group to multiple scenarios to reduce manual effort and ensure consistency.

- **Tag Support**  
  Assign tags to groups for better organization and filtering.

### Limitations

- **Maximum of 20 Scripts per Group**  
- **No Nesting**: You cannot include one group inside another.  
- **Flat Execution**: The system treats each script individually; order matters.

## My Scripted Actions Repository

To help you get started with Nerdio Scripted Actions, I’ve curated a dedicated GitHub repo at [nerdio-scripted-actions](https://github.com/schmittnieto/nerdio-scripted-actions). Inside, you’ll find a growing collection of PowerShell scripts designed for everything from image customization to day-to-day host-pool tasks.

Nerdio maintains its own library under [NMW Scripted Actions](https://github.com/Get-Nerdio/NMW/tree/main/scripted-actions), many of which are drawn from Microsoft’s [RDS-Templates](https://github.com/Azure/RDS-Templates/tree/master/CustomImageTemplateScripts) project. To illustrate, here are two complementary scripts:

- **Install language packs.ps1** (Nerdio): [Install language packs.ps1](https://github.com/Get-Nerdio/NMW/blob/main/scripted-actions/custom-image-template-scripts/Install%20language%20packs.ps1)  
- **InstallLanguagePacks.ps1** (RDS-Templates): [InstallLanguagePacks.ps1](https://github.com/Azure/RDS-Templates/blob/master/CustomImageTemplateScripts/CustomImageTemplateScripts_2024-03-27/InstallLanguagePacks.ps1)  

The Nerdio script begins with a standardized header that defines metadata and user-input variables. For example:

```powershell
<#
  Author: Akash Chawla
  Source: https://github.com/Azure/RDS-Templates/tree/master/CustomImageTemplateScripts/CustomImageTemplateScripts_2024-03-27
#>

#description: Install language packs
#execution mode: Individual
#tags: Microsoft, Custom Image Template Scripts
<#variables:
{
  "LanguageList": {
    "Description": "Select any additional languages to be added",
    "DisplayName": "Languages"
  }
}
#>
```  

In the **variables** section, you define the fields that end users will interact with, here, a simple language picker:

<a href="/assets/img/post/2025-05-17-nerdio-scripted-actions-windows-scripts/variables.png" target="_blank">
  <img src="/assets/img/post/2025-05-17-nerdio-scripted-actions-windows-scripts/variables.png" alt="Nerdio Scripted Actions Variables" style="border: 2px solid grey;">
</a>  

By hosting these scripts in your own repo, you gain full control over versioning, customizations and integration with Nerdio’s “Script repositories” feature, making your AVD automation both transparent and repeatable.  

### Integrating the Repository in Nerdio

1. Go to **Settings > Environment > Integrations > Script repositories**:

   <a href="/assets/img/post/2025-05-17-nerdio-scripted-actions-windows-scripts/integration01.png" target="_blank">
     <img src="/assets/img/post/2025-05-17-nerdio-scripted-actions-windows-scripts/integration01.png" alt="Adding a custom repository to Scripted Actions 01" style="border: 2px solid grey;">
   </a>

2. Add the repository URL and select folders to sync:

   <a href="/assets/img/post/2025-05-17-nerdio-scripted-actions-windows-scripts/integration02.png" target="_blank">
     <img src="/assets/img/post/2025-05-17-nerdio-scripted-actions-windows-scripts/integration02.png" alt="Adding a custom repository to Scripted Actions 02" style="border: 2px solid grey;">
   </a>

3. Verify the scripts under **Scripted Actions > Windows Scripts > Filter By Source**:

   <a href="/assets/img/post/2025-05-17-nerdio-scripted-actions-windows-scripts/integration03.png" target="_blank">
     <img src="/assets/img/post/2025-05-17-nerdio-scripted-actions-windows-scripts/integration03.png" alt="Adding a custom repository to Scripted Actions 03" style="border: 2px solid grey;">
   </a>


### My Scripts

Currently, the repository shows three scripts, with three more in development. Here’s what you’ll find today:

- **Hide or Unhide Drives in File Explorer**  
  Hide one or more drives (e.g., “C,D,E”) from File Explorer to simplify the UI. Users can still access them, it just cleans up the view. You can also revert the change without re-entering drive letters.
   <a href="/assets/img/post/2025-05-17-nerdio-scripted-actions-windows-scripts/script01.png" target="_blank">
     <img src="/assets/img/post/2025-05-17-nerdio-scripted-actions-windows-scripts/script01.png" alt="Hide or Unhide Drives in File Explorer" style="border: 2px solid grey;">
   </a>

- **Disable Office Updates Task**  
  Prevent `SDXHelper.exe` from running in multi-user environments. This script disables, or re-enables, the Office update task on session hosts.
   <a href="/assets/img/post/2025-05-17-nerdio-scripted-actions-windows-scripts/script02.png" target="_blank">
     <img src="/assets/img/post/2025-05-17-nerdio-scripted-actions-windows-scripts/script02.png" alt="Disable Office Updates Task" style="border: 2px solid grey;">
   </a>

- **OneDrive Remote App Configuration**  
  Apply the settings required to run OneDrive in AVD Remote App pools ([Microsoft documentation](https://learn.microsoft.com/azure/virtual-desktop/onedrive-remoteapp)). This script also supports reverting the changes.
   <a href="/assets/img/post/2025-05-17-nerdio-scripted-actions-windows-scripts/script03.png" target="_blank">
     <img src="/assets/img/post/2025-05-17-nerdio-scripted-actions-windows-scripts/script03.png" alt="OneDrive Remote App Configuration" style="border: 2px solid grey;">
   </a>

### Running My Scripts Independently of Nerdio

If you need to test or apply these scripts on a Windows VM without connecting to Nerdio Manager, you can execute them directly. This method is handy for quick troubleshooting or one-off tasks:

1. **Download** the desired `.ps1` file from the GitHub repo to your local machine.  
2. **Open** PowerShell as an Administrator.  
3. **Bypass** the execution policy and run the script. For example, to hide drives “C” and “D”:

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force
.\HideDrives.ps1 -Action Hide -DrivesToHide "C,D"
```  

That’s it, your script will run immediately, just as it would within Nerdio’s framework.

### How to Collaborate

I’ll keep this repo updated as new requests and use cases come up. I’m also working on integrating my scripts into the official Nerdio repository via this [pull request](https://github.com/Get-Nerdio/NMW/pull/40). If you want to contribute:

- Open an **Issue** on the repo: [https://github.com/schmittnieto/nerdio-scripted-actions/issues](https://github.com/schmittnieto/nerdio-scripted-actions/issues)  
- Fork the repo and submit a **Pull Request** with your scripts  
- Not comfortable on GitHub? Feel free to reach out to me on LinkedIn and we can collaborate privately.

## Conclusion

Nerdio Scripted Actions, especially Windows Scripts, can significantly streamline your AVD deployments by automating everything from app installation to configuration tweaks. Whether you’re customizing golden images, automating host pool events, or running ad-hoc maintenance, these scripts give you the flexibility and control you need. I hope you find my repository helpful, and I’m eager to see what you build with it. Feel free to dive in, suggest enhancements, or share your own scripts!

**Links Used in This Article**

| Name                                     | URL                                                                                                   |
|------------------------------------------|-------------------------------------------------------------------------------------------------------|
| AVD Accelerator                          | https://github.com/Azure/avdaccelerator                                                                |
| Nerdio                                   | https://getnerdio.com/                                                                                |
| Hydra                                    | https://www.itprocloud.com/Hydra/                                                                      |
| Scripted Actions Overview                | https://nmehelp.getnerdio.com/hc/en-us/articles/26124327585421-Scripted-Actions-Overview               |
| Windows Scripts                          | https://nmehelp.getnerdio.com/hc/en-us/articles/26124334667149-Scripted-Actions-for-Windows-Scripts    |
| nerdio-scripted-actions                  | https://github.com/schmittnieto/nerdio-scripted-actions                                               |
| NMW Scripted Actions                     | https://github.com/Get-Nerdio/NMW/tree/main/scripted-actions                                           |
| Install language packs.ps1               | https://github.com/Get-Nerdio/NMW/blob/main/scripted-actions/custom-image-template-scripts/Install%20language%20packs.ps1 |
| RDS-Templates                            | https://github.com/Azure/RDS-Templates/tree/master/CustomImageTemplateScripts/CustomImageTemplateScripts_2024-03-27 |
| InstallLanguagePacks.ps1 (RDS-Templates) | https://github.com/Azure/RDS-Templates/blob/master/CustomImageTemplateScripts/CustomImageTemplateScripts_2024-03-27/InstallLanguagePacks.ps1 |
| Microsoft documentation                  | https://learn.microsoft.com/azure/virtual-desktop/onedrive-remoteapp                                    |
| Pull request                             | https://github.com/Get-Nerdio/NMW/pull/40                                                              |
| Issues                                   | https://github.com/schmittnieto/nerdio-scripted-actions/issues                                         |
