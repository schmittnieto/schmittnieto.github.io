---
title: "GitHub Tools and Repositories that I use"
excerpt: "A personal overview of the GitHub tools and Repositories I frequently use as a consultant, sharing insights into various community-driven repositories."
date: 2024-12-01
last_modified_at: 2025-01-02
categories:
  - Blog
tags:
  - Tools
  - GitHub

header:
  teaser: "/assets/img/post/2024-12-01-github-tools.webp"
  image: "/assets/img/post/2024-12-01-github-tools.webp"
  og_image: "/assets/img/post/2024-12-01-github-tools.webp"
  overlay_image: "/assets/img/post/2024-12-01-github-tools.webp"
  overlay_filter: 0.5
  caption: "Photo credit: [**ChatGPT**](https://chatgpt.com)"

toc: true
toc_label: "Overview"
toc_icon: "list-ul"
---

## Introduction and Disclaimer

This article is a bit different from my previous ones—it's not a technical deep dive but rather a community-focused piece where I'd like to introduce some of the tools I use daily as a consultant. Most of these tools are community-driven or managed by individuals on GitHub. While there are exceptions, I won't include commercial tools that are paid and lack community versions.

There are areas and tools I'll cover more thoroughly in future posts, but the main goal of this blog entry is to present them in a basic way and show you their purpose. I'll also include "multi-link" entries—that is, collections of tools—as long as they are hosted on GitHub.

I've decided to separate the categories into **IAM (Identity Access Management)**, **UEM (Unified Endpoint Management) & Modern Work (M365 and related services)**, and **Azure & Microsoft**. The reason is purely organizational, so those looking for IAM or UEM tools don't have to sift through Azure tools and vice versa.

I haven't included blogs because the list would be infinite 😅, but if you want a list of some blogs I follow, most can be found on this page: [https://azurecrazy.com/azure-blogs/](https://azurecrazy.com/azure-blogs/).

I'm not responsible for any errors in the tools or their functionalities. My goal with this post is to show you the tools I've used at some point (or even use daily) and have them centralized.

The contact persons (along with their LinkedIn links) are not necessarily responsible for these repositories; they are mainly the people who created or introduced me to these repositories—that is, the people that I personally consider contributors. I'm sure I've forgotten to mention many of you; in that case, you can let me know, and I'll add the LinkedIn links—it's not a problem 😊.

I'll probably forget some tools, which I'll add over time, but if you want to add a tool that isn't listed (which I would greatly appreciate), you can do so via the following link: [Add Tool](https://github.com/schmittnieto/schmittnieto.github.io/issues/new?assignees=&labels=&projects=&template=add_tool.yml) or by sending an email to tools@schmitt-nieto.com with a brief description of the tool to add.

Regarding the order I've followed when organizing the repositories, I'll tell you in advance that it was totally random based on the order of my bookmarks 😂. If anyone needs to appear higher or lower, let me know, and I'll move it.

## IAM, UEM & Modern Work

In this section, I'll cover the tools I usually use when carrying out infrastructure inventories and implementing improvements in various areas (EntraID, Intune, Conditional Access, PIM...) and also include repositories related to Modern Work (M365).

- **ThomasKur/M365Documentation**
  - **GitHub**: [ThomasKur - M365Documentation](https://github.com/ThomasKur/M365Documentation)
  - **Type**: Automatic Microsoft 365 documentation to simplify the lives of admins and consultants.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/ThomasKur/M365Documentation?style=plastic)
  - **Note**: This is a comprehensive tool that uses GraphAPI to create documentation of the current state of the following elements: Intune, EntraID (Conditional Access...), CloudPrint, Information Protection, and Windows 365. Highly recommended when doing an inventory of the current state.
  - **LinkedIn**: [in/thomas-kurth-a86b7851](https://www.linkedin.com/in/thomas-kurth-a86b7851/)

- **microsoft/EntraExporter**
  - **GitHub**: [microsoft - EntraExporter](https://github.com/microsoft/EntraExporter)
  - **Type**: PowerShell module to export a local copy of an Entra (Azure AD) tenant configuration.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/microsoft/EntraExporter?style=plastic)
  - **Note**: In the past, I've made several configurations where, in Azure DevOps Pipelines, I exported the EntraID configuration. Remember, it's not a standard backup (since there's no EntraImporter 😜), but it helps a lot to get an idea of the state of the Entra tenant at a specific point in the past.
  - **LinkedIn**: [in/merill](https://www.linkedin.com/in/merill/)

- **Cloud-Architekt/AzurePrivilegedIAM**
  - **GitHub**: [Cloud-Architekt - AzurePrivilegedIAM](https://github.com/Cloud-Architekt/AzurePrivilegedIAM)
  - **Type**: Docs and samples for privileged identity and access management in Microsoft Azure and Microsoft Entra.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/Cloud-Architekt/AzurePrivilegedIAM?style=plastic)
  - **Note**: This repository also contains some scripts that are useful when conducting inventories on roles and their members in EntraID.
  - **LinkedIn**: [in/thomasnaunheim](https://www.linkedin.com/in/thomasnaunheim/)

- **12Knocksinna/Office365itpros**
  - **GitHub**: [12Knocksinna - Office365itpros](https://github.com/12Knocksinna/Office365itpros)
  - **Type**: PowerShell scripts to manage and modify M365.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/12Knocksinna/Office365itpros?style=plastic)
  - **Note**: This is the central repository of scripts published on [https://office365itpros.com/](https://office365itpros.com/)
  - **LinkedIn**: [in/tonyredmond](https://www.linkedin.com/in/tonyredmond/)

- **jasperbaes/Microsoft-Cloud-Group-Analyzer**
  - **GitHub**: [jasperbaes - Microsoft-Cloud-Group-Analyzer](https://github.com/jasperbaes/Microsoft-Cloud-Group-Analyzer)
  - **Type**: For Microsoft Cloud admins who struggle to keep track of where Entra ID groups are used, Group Analyzer is an open-source script that provides instant insights into what services/policies a given group or user is scoped to.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/jasperbaes/Microsoft-Cloud-Group-Analyzer?style=plastic)
  - **Note**: I tried it in the past, but the fact that it's dependent on Node.js and not a PowerShell module means I don't use it as much as I should. Still, it's highly recommended to take a look.
  - **LinkedIn**: [in/jasper-baes](https://www.linkedin.com/in/jasper-baes/)

- **KnudsenMorten/ClientInspectorV2**
  - **GitHub**: [KnudsenMorten - ClientInspectorV2](https://github.com/KnudsenMorten/ClientInspectorV2)
  - **Type**: ClientInspectorV2 - Unleashing the power of Azure Log Analytics, Azure Data Collection Rules, Log Ingestion API by doing client inventory with lots of great information.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/KnudsenMorten/ClientInspectorV2?style=plastic)
  - **Note**: In the past, I used this tool to carry out an inventory, and it pleasantly surprised me. Surely the same actions covered by this tool can be carried out natively through many Microsoft portals and services, but I really like Morten's approach as it simplifies the process.
  - **LinkedIn**: [in/mortenwaltorpknudsen](https://www.linkedin.com/in/mortenwaltorpknudsen/)

- **HarmVeenstra/Powershellisfun**
  - **GitHub**: [HarmVeenstra - Powershellisfun](https://github.com/HarmVeenstra/Powershellisfun)
  - **Type**: Repository containing a collection of scripts used on [https://powershellisfun.com/](https://powershellisfun.com/)
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/HarmVeenstra/Powershellisfun?style=plastic)
  - **Note**: This is a repository that could also be in the next list, but since I've mainly used it for activities related to Intune, I'll leave it here.
  - **LinkedIn**: [in/harmveenstra](https://www.linkedin.com/in/harmveenstra/)

- **ugurkocde/IntuneAssignmentChecker**
  - **GitHub**: [ugurkocde - IntuneAssignmentChecker](https://github.com/ugurkocde/IntuneAssignmentChecker)
  - **Type**: The Intune Assignment Checker script simplifies your life. It provides a detailed overview of assigned Intune Configuration Profiles, Compliance Policies, and Applications for users, groups, and devices.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/ugurkocde/IntuneAssignmentChecker?style=plastic)
  - **Note**: I've used this repository in the past, and although it doesn't generate a report as extensive as M365Documentation, it's a very simple script when it comes to scoping a user.
  - **LinkedIn**: [in/ugurkocde](https://www.linkedin.com/in/ugurkocde/)

- **AntoPorter/Intune-Remediations**
  - **GitHub**: [AntoPorter - Intune-Remediations](https://github.com/AntoPorter/Intune-Remediations)
  - **Type**: The Intune Remediations collection is a set of script packages designed to detect and fix common support issues on user endpoints.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/AntoPorter/Intune-Remediations?style=plastic)
  - **Note**: This is a repository that can't be missing from your collection if you have to manage Windows devices in Intune.
  - **LinkedIn**: [in/anthonyantoporter](https://www.linkedin.com/in/anthonyantoporter)

- **Micke-K/IntuneManagement**
  - **GitHub**: [Micke-K - IntuneManagement](https://github.com/Micke-K/IntuneManagement)
  - **Type**: Copy, export, import, delete, document, and compare policies and profiles in Intune and Azure with PowerShell script and WPF UI. Import ADMX files and registry settings with ADMX ingestion. View and edit PowerShell scripts.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/Micke-K/IntuneManagement?style=plastic)
  - **Note**: A good tool for backing up various configurations in Intune. Very intuitive and also has the ability to generate documentation.
  - **LinkedIn**: [in/mikael-karlsson-66154326](https://www.linkedin.com/in/mikael-karlsson-66154326/)

- **SkipToTheEndpoint/OpenIntuneBaseline**
  - **GitHub**: [SkipToTheEndpoint - OpenIntuneBaseline](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline)
  - **Type**: Community-driven baseline to accelerate Intune adoption and learning.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/SkipToTheEndpoint/OpenIntuneBaseline?style=plastic)
  - **Note**: Repository to enhance the security of Windows devices in Intune. If you work with Intune, this is a repository that can't be missing from your collection.
  - **LinkedIn**: [in/skiptotheendpoint](https://www.linkedin.com/in/skiptotheendpoint/)

- **pnp/script-samples**
  - **GitHub**: [pnp - script-samples](https://github.com/pnp/script-samples)
  - **Type**: A sample gallery of scripts to manage all things Microsoft 365.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/pnp/script-samples?style=plastic)
  - **Note**: A great collection of scripts for managing M365. The main focus is on SharePoint Online, so if you manage SPO in your day-to-day, take a look.
  - **LinkedIn**: [in/pkbullock](https://linkedin.com/in/pkbullock)

- **jasperbaes/Conditional-Access-Matrix**
  - **GitHub**: [jasperbaes - Conditional-Access-Matrix](https://github.com/jasperbaes/Conditional-Access-Matrix)
  - **Type**: A tool to know which Conditional Access policy applies to which user.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/jasperbaes/Conditional-Access-Matrix?style=plastic)
  - **Note**: This is one of the tools you can use to generate reports on conditional access. Since it requires Node.js, I personally don't use it as much as I could and prefer other solutions (like ConditionalAccessDocumentation or IdPowerToys) for this purpose.
  - **LinkedIn**: [in/jasper-baes](https://www.linkedin.com/in/jasper-baes/)

- **aollivierre/ConditionalAccess**
  - **GitHub**: [aollivierre - ConditionalAccess](https://github.com/aollivierre/ConditionalAccess)
  - **Type**: A comprehensive collection of Conditional Access (CA) policies and PowerShell management tools for Microsoft Entra ID (formerly Azure AD).
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/aollivierre/ConditionalAccess?style=plastic)
  - **Note**: This repository offers a well-rounded set of Conditional Access policies that aim to enhance organizational security without sacrificing usability. The included PowerShell tools make managing these policies efficient and straightforward. I recommend this repository for admins seeking robust CA configurations and streamlined management.
  - **LinkedIn**: [in/aollivierre](https://www.linkedin.com/in/aollivierre/)

- **Windows365Management/PSCloudPC**
  - **GitHub**: [Windows365Management - PSCloudPC](https://github.com/Windows365Management/PSCloudPC)
  - **Type**: Windows 365 Cloud PC Management PowerShell Module.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/Windows365Management/PSCloudPC?style=plastic)
  - **Note**: The perfect tool to manage Windows 365 from PowerShell. Although it may seem that there isn't much room for configuration in Windows 365, this tool allows you to manage all kinds of configurations (even Custom Images) using GraphAPI. As I said, if you use Windows 365, you're taking too long to check it out.
  - **LinkedIn**: [in/sdingemanse](https://www.linkedin.com/in/sdingemanse/)

- **j0eyv/ConditionalAccessBaseline**
  - **GitHub**: [j0eyv - ConditionalAccessBaseline](https://github.com/j0eyv/ConditionalAccessBaseline)
  - **Type**: This conditional access baseline is based on the Microsoft Conditional Access Baseline by Claus Jespersen. This one is slightly minimized and less difficult to understand but still protects almost everything you could wish for.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/j0eyv/ConditionalAccessBaseline?style=plastic)
  - **Note**: Like everything in life, you don't always have to create all Conditional Access policies from scratch, and this repository collects an approach I follow.
  - **LinkedIn**: [in/claus-jespersen-25b0422](https://www.linkedin.com/in/claus-jespersen-25b0422/)

- **NicklasAhlberg/RockMyPrinters**
  - **GitHub**: [NicklasAhlberg - RockMyPrinters](https://github.com/NicklasAhlberg/RockMyPrinters)
  - **Type**: Tool to move printers from Hybrid Azure AD to Azure AD Join.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/NicklasAhlberg/RockMyPrinters?style=plastic)
  - **Note**: Rock My Printers will save you a lot of time when it comes to moving away from those pesky GPOs to a more modern approach. Use Intune to install both drivers and printers; remember that we can still use a print server for the queues.
  - **LinkedIn**: [in/nicklasahlberg](https://www.linkedin.com/in/nicklasahlberg/)

- **merill/idPowerToys**
  - **GitHub**: [merill - idPowerToys](https://github.com/merill/idPowerToys)
  - **Type**: Repository for idPowerToys, an app for Entra admins.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/merill/idPowerToys?style=plastic)
  - **Note**: This is undoubtedly the perfect tool if you have to carry out an inventory of Conditional Access Policies, and best of all, the export is in PowerPoint!
  - **LinkedIn**: [in/merill](https://www.linkedin.com/in/merill/)

- **michaelmsonne/ ManagedIdentityPermissionManager**
  - **GitHub**: [michaelmsonne - ManagedIdentityPermissionManager](https://github.com/michaelmsonne/ManagedIdentityPermissionManager)
  - **Type**: Azure Managed Identity Permissions Tool, a new PowerShell tool that simplifies and streamlines the management of Managed Identity permissions in Azure (Entra ID).
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/michaelmsonne/ManagedIdentityPermissionManager?style=plastic)
  - **Note**: This tool facilitates and centralizes the management of permissions for managed identities.
  - **LinkedIn**: [in/michaelmsonne](https://www.linkedin.com/in/michaelmsonne)

- **admindroid-community/powershell-scripts**
  - **GitHub**: [admindroid-community - powershell-scripts](https://github.com/admindroid-community/powershell-scripts)
  - **Type**: Office 365 Reporting PowerShell Scripts.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/admindroid-community/powershell-scripts?style=plastic)
  - **Note**: Hundreds of scripts to manage O365—simple, straightforward, and effective.
  - **LinkedIn**: [in/kavya-a-6bab27279](https://www.linkedin.com/in/kavya-a-6bab27279/)

- **svrooij/WingetIntune**
  - **GitHub**: [svrooij - WingetIntune](https://github.com/svrooij/WingetIntune)
  - **Type**: Package any app from Winget to Intune - WinTuner.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/svrooij/WingetIntune?style=plastic)
  - **Note**: PowerShell script that creates Winget application packages for Intune.
  - **LinkedIn**: [in/stephanvanrooij](https://www.linkedin.com/in/stephanvanrooij)

- **IntuneAdmin/IntuneBaselines**
  - **GitHub**: [IntuneAdmin - IntuneBaselines](https://github.com/IntuneAdmin/IntuneBaselines)
  - **Type**: [Intunebaselines.com](http://intunebaselines.com) by Wolkenman.nl.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/IntuneAdmin/IntuneBaselines?style=plastic)
  - **Note**: In this repo, you will find Intune profiles in JSON format, which can be used in setting up your Modern Workplace. All policies were created in Microsoft Intune and exported to share with the community.
  - **LinkedIn**: [in/jan-mulder](https://www.linkedin.com/in/jan-mulder/)

- **merill/awesome-entra**
  - **GitHub**: [merill - awesome-entra](https://github.com/merill/awesome-entra)
  - **Type**: Awesome list of all things related to Microsoft Entra.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/merill/awesome-entra?style=plastic)
  - **Note**: A curated list of awesome Microsoft Entra tools, guides, and other resources.
  - **LinkedIn**: [in/merill](https://www.linkedin.com/in/merill/)

- **nicolonsky/ConditionalAccessDocumentation**
  - **GitHub**: [nicolonsky - ConditionalAccessDocumentation](https://github.com/nicolonsky/ConditionalAccessDocumentation)
  - **Type**: Azure AD Conditional Access Documentation with PowerShell.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/nicolonsky/ConditionalAccessDocumentation?style=plastic)
  - **Note**: This tool, along with IdPowerToys, is my favorite when it comes to documenting Conditional Access Policies. The report generated from this is in Excel 👌.
  - **LinkedIn**: [in/nicolasuter](https://www.linkedin.com/in/nicolasuter/)

- **canix1/PIMSCAN**
  - **GitHub**: [canix1 - PIMSCAN](https://github.com/canix1/PIMSCAN)
  - **Type**: Tool for creating reports on Entra ID Role Assignments.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/canix1/PIMSCAN?style=plastic)
  - **Note**: I haven't been able to use this tool yet, but I'm looking forward to playing with it—it looks great.
  - **LinkedIn**: [in/robin-granberg](https://www.linkedin.com/in/robin-granberg/)

- **lazywinadmin/PowerShell**
  - **GitHub**: [lazywinadmin - PowerShell](https://github.com/lazywinadmin/PowerShell)
  - **Type**: PowerShell functions and scripts (Azure, Active Directory, SCCM, SCSM, Exchange, O365, ...).
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/lazywinadmin/PowerShell?style=plastic)
  - **Note**: Collection of scripts I've used in the past.
  - **LinkedIn**: [in/fxcat](https://www.linkedin.com/in/fxcat/)

- **fabrisodotps1/M365PSProfile**
  - **GitHub**: [fabrisodotps1 - M365PSProfile](https://github.com/fabrisodotps1/M365PSProfile)
  - **Type**: M365PSProfile installs and keeps the PowerShell modules needed for Microsoft 365 management up to date. It provides a simple way to add it to the PowerShell profile.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/fabrisodotps1/M365PSProfile?style=plastic)
  - **Note**: A tool that will help you have the modules installed and updated; if you work with GraphAPI, you should take a look.
  - **LinkedIn**: [in/andres-bohren-4ba45293](https://www.linkedin.com/in/andres-bohren-4ba45293)

- **MG-Cloudflow/Intune-Toolkit**
  - **GitHub**: [MG-Cloudflow - Intune-Toolkit](https://github.com/MG-Cloudflow/Intune-Toolkit)
  - **Type**: The Intune-Toolkit offers a basic and user-friendly interface to connect to Microsoft Graph, manage policy assignments, and handle backup and restore operations.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/MG-Cloudflow/Intune-Toolkit?style=plastic)
  - **Note**: This tool is easy and intuitive to use. I’m currently testing it for backing up Intune configurations, and so far, it's been great.
  - **LinkedIn**: [in/maxime-guillemin-526618161](https://www.linkedin.com/in/maxime-guillemin-526618161/)


## Azure & Microsoft

In this section, I'll cover the tools I frequently use for Azure and Microsoft technologies. These tools assist in various tasks, from deploying labs to optimizing virtual desktops, and they're invaluable for consultants and administrators alike.

- **The-Virtual-Desktop-Team/Virtual-Desktop-Optimization-Tool**
  - **GitHub**: [The-Virtual-Desktop-Team - Virtual-Desktop-Optimization-Tool](https://github.com/The-Virtual-Desktop-Team/Virtual-Desktop-Optimization-Tool)
  - **Type**: The Virtual Desktop Optimization Tool (VDOT) is a set of text-based tools that apply settings to a Windows operating system to improve performance. Gains include faster startup, quicker logons, and better user-session usability.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/The-Virtual-Desktop-Team/Virtual-Desktop-Optimization-Tool?style=plastic)
  - **Note**: If you manage AVD environments, I recommend checking this out, along with **Win11Debloat** and **tiny11builder** (listed later).
  - **LinkedIn**: [in/timothy-muessig](https://www.linkedin.com/in/timothy-muessig/)

- **microsoft/MSLab**
  - **GitHub**: [microsoft - MSLab](https://github.com/microsoft/MSLab)
  - **Type**: Azure Local, Windows 10, and Windows Server rapid lab deployment scripts.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/microsoft/MSLab?style=plastic)
  - **Note**: If you want to implement Azure Local in a demo infrastructure, this is your repository. I have an article on my blog ([Azure Stack HCI DemoLab](/blog/azure-stack-hci-demolab/)) where I cover a similar but much simpler scenario. MSLab is a well-curated community project by Jaromir. If you work with MSLab, I highly recommend taking a look.
  - **LinkedIn**: [in/jaromir-kaspar-1bb7887](https://www.linkedin.com/in/jaromir-kaspar-1bb7887/)

- **lkarlslund/Adalanche**
  - **GitHub**: [lkarlslund - Adalanche](https://github.com/lkarlslund/Adalanche)
  - **Type**: Active Directory ACL Visualizer and Explorer.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/lkarlslund/Adalanche?style=plastic)
  - **Note**: Adalanche is an incredibly powerful tool for Active Directory environments, providing instant insights into permissions for users and groups. It helps visualize and explore who has the potential to take over accounts, machines, or even the entire domain, making it essential for identifying and addressing misconfigurations. If you work with AD, this tool is a must-try for understanding and securing your environment.
  - **LinkedIn**: [in/lkarlslund](https://www.linkedin.com/in/lkarlslund/)

- **MHaggis/PowerShell-Hunter**
  - **GitHub**: [MHaggis - PowerShell-Hunter](https://github.com/MHaggis/PowerShell-Hunter)
  - **Type**: A collection of PowerShell-based tools for threat hunting in Windows environments.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/MHaggis/PowerShell-Hunter?style=plastic)
  - **Note**: PowerShell-Hunter is an evolving project designed for defenders and security analysts. It leverages the native power of PowerShell to investigate and detect malicious activity in Windows environments. With its growing toolset, it provides a flexible and practical approach to uncovering potential threats, making it a valuable resource for enhancing security operations.
  - **LinkedIn**: [in/michaelahaag](https://www.linkedin.com/in/michaelahaag/)

- **DellGEOS/AzureStackHOLs**
  - **GitHub**: [DellGEOS - AzureStackHOLs](https://github.com/DellGEOS/AzureStackHOLs)
  - **Type**: Hands-on labs for Azure Local.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/DellGEOS/AzureStackHOLs?style=plastic)
  - **Note**: This repository is a variation of MSLab dedicated to Dell infrastructure. It's also managed by Jaromir and is a technical marvel.
  - **LinkedIn**: [in/jaromir-kaspar-1bb7887](https://www.linkedin.com/in/jaromir-kaspar-1bb7887/)

- **bfrankMS/AzureLocal_AzStackHCI**
  - **GitHub**: [bfrankMS - AzureLocal_AzStackHCI](https://github.com/bfrankMS/AzureLocal_AzStackHCI)
  - **Type**: Hands-on labs for Azure Local.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/bfrankMS/AzureLocal_AzStackHCI?style=plastic)
  - **Note**: A collection of scripts and scenarios related to Azure Local.
  - **LinkedIn**: [in/wolkenmacher](https://www.linkedin.com/in/wolkenmacher/)

- **GruberMarkus/Export-RecipientPermissions**
  - **GitHub**: [GruberMarkus - Export-RecipientPermissions](https://github.com/GruberMarkus/Export-RecipientPermissions)
  - **Type**: Document, filter, and compare Exchange permissions, including mailbox access rights, folder permissions, send as/on behalf, and more.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/GruberMarkus/Export-RecipientPermissions?style=plastic)
  - **Note**: If you work with Exchange Online, I recommend taking a look.
  - **LinkedIn**: [in/gruberma](https://www.linkedin.com/in/gruberma/)

- **microsoft/MicroHack**
  - **GitHub**: [microsoft - MicroHack](https://github.com/microsoft/MicroHack)
  - **Type**: Central repository for all MicroHacks from customers, partners, or Microsoft.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/microsoft/MicroHack?style=plastic)
  - **Note**: This repository covers various fields and sectors, worked on in Labs (MicroHacks). I had the pleasure of learning in this lab ([Hybrid Azure Arc Servers](https://github.com/microsoft/MicroHack/tree/main/03-Azure/01-03-Infrastructure/02_Hybrid_Azure_Arc_Servers)) guided by Alexander, and I loved the format.
  - **LinkedIn**: [in/alexanderortha](https://www.linkedin.com/in/alexanderortha/)

- **PrateekKumarSingh/AzViz**
  - **GitHub**: [PrateekKumarSingh - AzViz](https://github.com/PrateekKumarSingh/AzViz)
  - **Type**: Azure Visualizer aka 'AzViz' - A PowerShell module to automatically generate Azure resource topology diagrams.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/PrateekKumarSingh/AzViz?style=plastic)
  - **Note**: If you need to export an Azure infrastructure, this tool will help you visualize its dependencies.
  - **LinkedIn**: [in/prateekkumarsingh](https://www.linkedin.com/in/prateekkumarsingh)

- **maester365/maester**
  - **GitHub**: [maester365 - maester](https://github.com/maester365/maester)
  - **Type**: An open-source PowerShell-based test automation framework designed to help you monitor and maintain the security configuration of your Microsoft 365 environment.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/maester365/maester?style=plastic)
  - **Note**: A fundamental tool for conducting security analyses in EntraID and Azure. I highly recommend checking it out if you're responsible for managing Entra.
  - **LinkedIn**: [in/merill](https://www.linkedin.com/in/merill/)

- **dolevshor/azure-finops-guide**
  - **GitHub**: [dolevshor - azure-finops-guide](https://github.com/dolevshor/azure-finops-guide)
  - **Type**: Centralizes Azure FinOps information and tools to enable better understanding and optimization of cloud costs.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/dolevshor/azure-finops-guide?style=plastic)
  - **Note**: This guide helps you do more with less by identifying cost-saving opportunities, optimizing cloud efficiency, and gaining better control over cloud costs.
  - **LinkedIn**: [in/dolev-shor](https://www.linkedin.com/in/dolev-shor/)

- **Azure/ipam**
  - **GitHub**: [Azure - ipam](https://github.com/Azure/ipam)
  - **Type**: IP Address Management on Azure.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/Azure/ipam?style=plastic)
  - **Note**: Azure IPAM is a lightweight solution designed to help Azure customers manage their IP address space easily and effectively.
  - **LinkedIn**: [in/dcmattyg](https://www.linkedin.com/in/dcmattyg/)

- **scautomation/Azure-Inventory-Workbook**
  - **GitHub**: [scautomation - Azure-Inventory-Workbook](https://github.com/scautomation/Azure-Inventory-Workbook)
  - **Type**: Workbook to view all Azure resources provisioned from a central page.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/scautomation/Azure-Inventory-Workbook?style=plastic)
  - **Note**: I've used this workbook on several occasions to get a general overview of infrastructures, helping establish an initial plan when managing projects through general inventory.
  - **LinkedIn**: [in/scautomation](https://www.linkedin.com/in/scautomation/)

- **Azure/review-checklists**
  - **GitHub**: [Azure - review-checklists](https://github.com/Azure/review-checklists)
  - **Type**: An Excel sheet for planning various solutions (e.g., AVD, AKS, ALZ...).
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/Azure/review-checklists?style=plastic)
  - **Note**: This is undoubtedly one of the repositories I've downloaded the most throughout my career and one I recommend to everyone using Azure. It contains an Excel sheet detailing dependencies and advice for implementing a long list of solutions, most providing links and based on the Well-Architected Framework (WAF).
  - **LinkedIn**: [in/scautomation](https://www.linkedin.com/in/scautomation/)

- **weeyin83/Azure-Arc-Windows-Linux-Dashboard**
  - **GitHub**: [weeyin83 - Azure-Arc-Windows-Linux-Dashboard](https://github.com/weeyin83/Azure-Arc-Windows-Linux-Dashboard)
  - **Type**: An Azure dashboard to view various elements of Windows or Linux servers deployed with the Azure Arc agent.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/weeyin83/Azure-Arc-Windows-Linux-Dashboard?style=plastic)
  - **Note**: This is one of many dashboards I've integrated into my collection; it's worth a look if you use Azure Arc.
  - **LinkedIn**: [in/sazlean](https://www.linkedin.com/in/sazlean/)

- **Azure/avdaccelerator**
  - **GitHub**: [Azure - avdaccelerator](https://github.com/Azure/avdaccelerator)
  - **Type**: AVD Accelerator deployment automation to simplify the setup of Azure Virtual Desktop based on best practices.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/Azure/avdaccelerator?style=plastic)
  - **Note**: If you work with AVD, this repository is a must-have. In future articles, I might dedicate an entire post to this repository. For now, I can say that if you're trying to implement AVD through code, this repository offers all possible approaches.
  - **LinkedIn**: [in/dany-contreras-12a11a42](https://www.linkedin.com/in/dany-contreras-12a11a42/)

- **rcarboneras/Arc-GPODeployment**
  - **GitHub**: [rcarboneras - Arc-GPODeployment](https://github.com/rcarboneras/Arc-GPODeployment)
  - **Type**: Contains the necessary files to onboard non-Azure machines to Azure Arc automatically using a GPO.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/rcarboneras/Arc-GPODeployment?style=plastic)
  - **Note**: I recall using this repository with a client to carry out centralized and organized onboarding to Azure Arc.
  - **LinkedIn**: [in/ra%C3%BAl-carboneras-37609350](https://www.linkedin.com/in/ra%C3%BAl-carboneras-37609350/)

- **Raphire/Win11Debloat**
  - **GitHub**: [Raphire - Win11Debloat](https://github.com/Raphire/Win11Debloat)
  - **Type**: A simple PowerShell script to remove pre-installed apps from Windows, disable telemetry, remove Bing from Windows search, and perform other changes to improve your Windows experience.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/Raphire/Win11Debloat?style=plastic)
  - **Note**: I've used it repeatedly when creating golden images for AVD, for example.
  - **LinkedIn**: Not available

- **lukemurraynz/awesome-azure-architecture**
  - **GitHub**: [lukemurraynz - awesome-azure-architecture](https://github.com/lukemurraynz/awesome-azure-architecture)
  - **Type**: A curated list of awesome blogs, videos, tutorials, code, tools, and scripts related to designing and implementing solutions in Microsoft Azure.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/lukemurraynz/awesome-azure-architecture?style=plastic)
  - **Note**: This is one of the main link collectors I've used throughout my career—one of the most complete and well-structured. It even has its own (aka.ms) shortcut: [AwesomeAzureArchitecture](https://aka.ms/AwesomeAzureArchitecture)
  - **LinkedIn**: [in/ljmurray](https://www.linkedin.com/in/ljmurray/)

- **MarcelMeurer/WVD-Hydra**
  - **GitHub**: [MarcelMeurer - WVD-Hydra](https://github.com/MarcelMeurer/WVD-Hydra)
  - **Type**: "Hydra" is a solution to manage Azure Virtual Desktop for one or more tenants. It's a working solution that can be installed in any subscription.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/MarcelMeurer/WVD-Hydra?style=plastic)
  - **Note**: This tool has a community version (which can be used commercially) with a limitation of 6 session hosts per host pool. I've used it in the past, especially when managing images for AVD on Azure Stack HCI. Marcel is well-known in the AVD community and has developed other tools like [WVDAdmin](https://www.itprocloud.com/wvdadmin/), also used to manage AVD. Both tools are highly recommended, functional, and quite intuitive.
  - **LinkedIn**: [in/marcelmeurer](https://www.linkedin.com/in/marcelmeurer/)

- **microsoft/adaptive_cloud_community**
  - **GitHub**: [microsoft - adaptive_cloud_community](https://github.com/microsoft/adaptive_cloud_community)
  - **Type**: Public repository for hosting the Azure Adaptive Cloud Community content.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/microsoft/adaptive_cloud_community?style=plastic)
  - **Note**: This is the repository of the Adaptive Cloud community, where new features about hybrid, multicloud, and edge are presented monthly.
  - **LinkedIn**: [groups/14491439/](https://www.linkedin.com/groups/14491439/)

- **tomwechsler/Azure_Updates**
  - **GitHub**: [tomwechsler - Azure_Updates](https://github.com/tomwechsler/Azure_Updates)
  - **Type**: All the latest Azure updates centralized in one repository.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/tomwechsler/Azure_Updates?style=plastic)
  - **Note**: As an alternative to John's videos and in a well-organized way, this repository presents all the updates (headlines, not descriptions) regarding Azure services and their respective links.
  - **LinkedIn**: [in/tom-wechsler](https://www.linkedin.com/in/tom-wechsler/)

- **Azure/PSRule.Rules.Azure**
  - **GitHub**: [Azure - PSRule.Rules.Azure](https://github.com/Azure/PSRule.Rules.Azure)
  - **Type**: Rules to validate Azure resources and infrastructure as code (IaC) using PSRule.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/Azure/PSRule.Rules.Azure?style=plastic)
  - **Note**: A PowerShell module I've used in the past to analyze my code and ensure that the resources to be implemented comply with the Well-Architected Framework (WAF).
  - **LinkedIn**: [in/bernie-white](https://www.linkedin.com/in/bernie-white/)

- **Azure/AVDSessionHostReplacer**
  - **GitHub**: [Azure - AVDSessionHostReplacer](https://github.com/Azure/AVDSessionHostReplacer)
  - **Type**: Automates the deployment and replacement of session hosts in an Azure Virtual Desktop host pool.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/Azure/AVDSessionHostReplacer?style=plastic)
  - **Note**: In the past, I've used this tool several times, especially when updating AVD infrastructures through code managed in GitHub or Azure DevOps repositories. Considering the Session Host Update ([Session Host Update](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update)), it has been losing "importance," although I still find the SessionHostReplacer more functional.
  - **LinkedIn**: [in/almoselhy](https://www.linkedin.com/in/almoselhy/)

- **dolevshor/azure-orphan-resources**
  - **GitHub**: [dolevshor - azure-orphan-resources](https://github.com/dolevshor/azure-orphan-resources)
  - **Type**: Centralizes orphan resources in Azure environments.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/dolevshor/azure-orphan-resources?style=plastic)
  - **Note**: A simple and effective workbook for reducing costs in Azure, as it shows all resources without dependencies that are consuming resources without being used (e.g., unassigned Public IPs).
  - **LinkedIn**: [in/dolev-shor](https://www.linkedin.com/in/dolev-shor/)

- **microsoft/AzureDevOpsDemoGenerator**
  - **GitHub**: [microsoft - AzureDevOpsDemoGenerator](https://github.com/microsoft/AzureDevOpsDemoGenerator)
  - **Type**: Helps teams create projects on their Team Services account with pre-populated sample content.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/microsoft/AzureDevOpsDemoGenerator?style=plastic)
  - **Note**: A classic for generating project templates and quickly implementing them in new Azure DevOps projects. If you've worked with CAF (Cloud Adoption Framework), you've probably used this tool without realizing it.
  - **LinkedIn**: [in/akshay-hosur-21400bbb](https://www.linkedin.com/in/akshay-hosur-21400bbb/)

- **Azure/azqr**
  - **GitHub**: [Azure - azqr](https://github.com/Azure/azqr)
  - **Type**: Azure Quick Review (azqr) is a CLI tool specializing in analyzing Azure resources to ensure compliance with best practices.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/Azure/azqr?style=plastic)
  - **Note**: A mandatory tool when carrying out inventories and improvements of infrastructures/designs in Azure. I've used it very often and will continue to use it because it's very easy to handle, and the results are excellent.
  - **LinkedIn**: [in/carlosmendible](https://www.linkedin.com/in/carlosmendible/)

- **Azure/arc_jumpstart_docs**
  - **GitHub**: [Azure - arc_jumpstart_docs](https://github.com/Azure/arc_jumpstart_docs)
  - **Type**: Public repo for hosting the Arc Jumpstart docs.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/Azure/arc_jumpstart_docs?style=plastic)
  - **Note**: This repository is your go-to resource for in-depth guides, best practices, and detailed documentation related to Azure Arc.
  - **LinkedIn**: [in/liorkamrat](https://www.linkedin.com/in/liorkamrat/)

- **Azure/AzureLocal-Supportability**
  - **GitHub**: [Azure - AzureLocal-Supportability](https://github.com/Azure/AzureLocal-Supportability)
  - **Type**: Azure Local Supportability Forum for tracking troubleshooting guides and issues with Azure Local.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/Azure/AzureLocal-Supportability?style=plastic)
  - **Note**: Unfortunately, I follow this repository more than I should 🙈. Nevertheless, it's a good platform and process for tracking problems in Azure Local.
  - **LinkedIn**: [in/thomas-roettinger-6a8a716](https://www.linkedin.com/in/thomas-roettinger-6a8a716/)

- **microsoft/finops-toolkit**
  - **GitHub**: [microsoft - finops-toolkit](https://github.com/microsoft/finops-toolkit)
  - **Type**: Tools and resources to help you adopt and implement FinOps capabilities that automate and extend the Microsoft Cloud.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/microsoft/finops-toolkit?style=plastic)
  - **Note**: For me, the main tool when analyzing infrastructures to optimize costs. If you're interested in FinOps in Azure, this repository is mandatory.
  - **LinkedIn**: [in/flanakin](https://www.linkedin.com/in/flanakin/)

- **mspnp/AzureNamingTool**
  - **GitHub**: [mspnp - AzureNamingTool](https://github.com/mspnp/AzureNamingTool)
  - **Type**: A .NET 8 Blazor application with a RESTful API for configuring and generating Azure resource names.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/mspnp/AzureNamingTool?style=plastic)
  - **Note**: The Azure Naming Tool helps administrators define and manage their naming conventions, providing a simple interface for users to generate compliant names. Developed using a naming pattern based on Microsoft's best practices. [aka.ms/azurenamingtool](https://aka.ms/azurenamingtool)
  - **LinkedIn**: [in/bryansoltis](https://www.linkedin.com/in/bryansoltis/)

- **ntdevlabs/tiny11builder**
  - **GitHub**: [ntdevlabs - tiny11builder](https://github.com/ntdevlabs/tiny11builder)
  - **Type**: Scripts to build a trimmed-down Windows 11 image.
  - **Last Update**: ![Commits](https://img.shields.io/github/last-commit/ntdevlabs/tiny11builder?style=plastic)
  - **Note**: Like the **Win11Debloat** repo, this can be used to create optimized images for AVD. For me, a mandatory repository if you need golden images and aren't using Nerdio to manage the environment.
  - **LinkedIn**: [in/karl-wester-ebbinghaus-a41507153](https://www.linkedin.com/in/karl-wester-ebbinghaus-a41507153/)

## Conclusion

I hope this collection of GitHub tools and repositories has been helpful. These tools have significantly impacted my daily work as a consultant, simplifying tasks, enhancing productivity, and enabling me to deliver better solutions. From inventory management and security analysis to Azure optimization and virtual desktop deployment, there's a wealth of community-driven resources available.

Remember, most of these tools are open-source and maintained by passionate professionals in the community. I encourage you to explore them, contribute if you can, and share them with others who might find them useful.

If you think I've missed any tools or have suggestions for additions, please feel free to let me know via the following link: [Add a Tool](https://github.com/schmittnieto/schmittnieto.github.io/issues/new?assignees=&labels=&projects=&template=add_tool.yml) or send an email to tools@schmitt-nieto.com with a brief description.

Thanks for reading and have a nice day!

