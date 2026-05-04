---
title: "Azure Local: Evolution, Use Cases, and Comparison with Other Solutions"
excerpt: "Discover Azure Local evolution, use cases and how it stacks up against VMware vSAN, Nutanix, Proxmox, Windows Server Hyper-V with System Center and other hyper-converged infrastructure solutions."
date: 2024-09-15
last_modified_at: 2026-05-04
categories:
  - Blog
tags:
  - Chronicloud Series
  - Azure Stack HCI
  - Azure Local

sticky: false

redirect_from:
  - /blog/azure-stack-hci-evolution-use-cases-comparison/
  - /blog/azure-local-evolution-use-cases-comparison/

header:
  teaser: "/assets/img/post/2024-09-15-azure-stack-hci.webp"
  image: "/assets/img/post/2024-09-15-azure-stack-hci.webp"
  og_image: "/assets/img/post/2024-09-15-azure-stack-hci.webp"
  overlay_image: "/assets/img/post/2024-09-15-azure-stack-hci.webp"
  overlay_filter: 0.5

toc: true
toc_label: "Topics Overview" 
toc_icon: "list-ul"

sidebar:
  nav: "Azurelocal"
  
---

This article was created before Azure Stack HCI was renamed to Azure Local ([link](https://learn.microsoft.com/en-us/azure/azure-local/rename-to-azure-local?view=azloc-24112)) in November 2024, which is why some references or hardcoded URLs may still point to Azure Stack HCI. However, the content has been updated accordingly, and if you find any errors, I would greatly appreciate it if you could report them either through the comment function or by emailing blog@schmitt-nieto.com
{: .notice--info}

## Azure Local: Evolution, Use Cases, and Comparison with Other Solutions

**Last updated: May 2026.** This article has been substantially revised to reflect the current state of Azure Local (now running on a monthly release cadence covering versions 2408 through 2512 and beyond) and to expand the competitive landscape. In addition to the original comparisons with VMware vSAN, Nutanix and Dell EMC VxRail, this update adds dedicated coverage of **Proxmox VE** as a growing open-source alternative, **Windows Server Hyper-V with System Center** (VMM, SCCM/ConfigMgr, SCOM) as a proven datacenter management stack and **Azure Arc** as a unifying management plane that can bridge Azure governance across heterogeneous on-premises infrastructure regardless of the underlying hypervisor.
{: .notice--warning}

This article is intended for IT professionals, system administrators and decision-makers looking to explore the potential of Azure Local for modernizing their on-premises infrastructure. Whether you're considering hybrid cloud solutions or comparing various hyper-converged infrastructure options, this post will provide valuable insights into the evolution, use cases and comparisons of Azure Local against other major solutions such as VMware vSAN, Nutanix, Dell EMC VxRail, Proxmox, Windows Server Hyper-V with System Center, OpenShift and other hyper-converged infrastructure solutions.

Note that **this article is not a general introduction to Azure Local**. If you are looking for a description of what Azure Local is, how it works or how to deploy it, the [official Microsoft documentation](https://learn.microsoft.com/en-us/azure/azure-local/overview) is the right starting point. The focus here is on **use cases and competitive comparisons**: where Azure Local fits, where it excels and how it stacks up against the alternatives available on the market today.

## History of Azure Local

Azure Local originated from Microsoft's Hyper-V technology, a longstanding virtualization solution integrated with Windows Server. As organizations sought hybrid cloud solutions, Microsoft integrated Hyper-V with Azure, enabling businesses to extend their on-premises environments seamlessly into the cloud.

Azure Local is a natural evolution of Hyper-V, designed to offer hybrid cloud functionality by allowing users to manage their on-premises infrastructure directly from Azure. Today, Azure Local enables comprehensive system management, including hardware monitoring and lifecycle management, all through Azure, providing a unified experience for both cloud and on-premises environments.

## Evolution of Azure Local

Initially, Azure Local focused on virtualizing workloads and providing software-defined storage. Over time, it has evolved to include services from Azure's ecosystem. Now, it supports not only traditional workloads but also cloud-native services. Azure Local currently enables:

- **Infrastructure Services**: Virtual machines (VMs) and networking managed natively from the Azure portal.
- **Azure Virtual Desktop (AVD)**: Including Windows 11 multisession, now in General Availability on-premises.
- **Azure Kubernetes Service (AKS)**: Enabled by Azure Arc, with NVIDIA GPU support and Kubernetes versions 1.31 through 1.33.
- **Platform Services**: Azure Data Controller, SQL Managed Instances, PostgreSQL Managed Instances and Machine Learning services.
- **Rack-Aware Clustering**: Define local availability zones based on physical racks in your datacenter, enhancing cluster resilience against rack-level failures. Generally Available and applicable to new deployments.
- **Managed Identity Authentication**: Azure Local clusters now use system-assigned managed identity (SMI) instead of service principals with self-signed certificates, significantly improving the security posture and eliminating certificate rotation overhead.
- **Local Identity with Azure Key Vault**: Starting with version 2604, Azure Local can be deployed without any Active Directory dependency. Using [local identity with Azure Key Vault](https://learn.microsoft.com/en-us/azure/azure-local/deploy/deployment-local-identity-with-key-vault?view=azloc-2604), the cluster authenticates entirely through Microsoft Entra ID, removing a long-standing requirement that forced organizations to maintain a domain controller on-premises.
- **Disaggregated Deployments**: Support for SAN-attached storage and disaggregated architectures is expanding, broadening the hardware configurations Azure Local can target.

These services allow organizations to run modern workloads and benefit from cloud innovation while still utilizing on-premises infrastructure. Azure Local now ships on a **monthly release cadence** (e.g., 2408, 2411, 2503, 2509, 2511, 2512), making it one of the most actively developed on-premises infrastructure platforms available.

## Use Cases for Azure Local

1. **Extended Security Updates (ESU) for Legacy Systems**

   Azure Local is an ideal solution for companies relying on legacy systems that are no longer supported. The platform includes Extended Security Updates (ESU) at no additional cost, allowing businesses to maintain critical security without incurring expensive licensing fees.

2. **Virtual Desktop Infrastructure (VDI) with AVD and Windows 11 Multisession**

   Azure Local is **the only on-premises platform** where **Azure Virtual Desktop (AVD) with Windows 11 multisession** can be deployed in General Availability. Windows 11 multisession allows multiple concurrent users to share a single Windows 11 VM, delivering the same cost-efficient VDI experience available in Azure but running on your own hardware. This is a licensed capability exclusive to Microsoft's AVD licensing model. Other platforms that support Arc-enabled AVD session hosts (such as Nutanix AHV or VMware vSphere) can use Windows 11 single session or Windows Server as session host OS, but **not Windows 11 multisession**. Without multisession, each concurrent user requires a dedicated VM, eliminating the cost efficiency that makes VDI at scale viable and losing key management benefits such as Intune-based endpoint management for Windows Server hosts. AVD on Azure Local is fully integrated with Azure management, policies and monitoring; it also includes health monitoring for session hosts visible directly in the Azure portal.

3. **Azure Kubernetes Service (AKS)**

   AKS on Azure Local, enabled by Azure Arc, has matured significantly. It supports Kubernetes versions 1.31 through 1.33 and includes **NVIDIA GPU support** (including the NVIDIA RTX PRO 6000 Blackwell Server Edition), enabling GPU-accelerated workloads such as AI inference and machine learning directly on-premises. Deployment is streamlined through the Azure portal and Azure CLI, eliminating the need for manual scripting and making it one of the most accessible and integrated paths to running Kubernetes on-premises. There is no comparable offering among the competing HCI platforms at an equivalent level of Azure integration depth.

4. **Workloads like Virtual Machines**

   Azure Local allows the native deployment and lifecycle management of virtual machines from the Azure portal, fully integrated with Azure Arc at no additional cost. This integration includes Azure Updates, Azure Policies and other Arc services, streamlining the management of on-premises workloads. Azure Local also supports **Windows Server 2025 Datacenter: Azure Edition** as a guest OS, enabling **Hotpatching via Azure Arc**, which applies security updates without requiring a reboot and reduces planned maintenance windows significantly.

5. **Arc-Managed Hybrid Infrastructure**

   Azure Arc is a first-class citizen in Azure Local; every cluster is Arc-enabled by default. This enables centralized governance, policy enforcement, Microsoft Defender for Cloud integration and Azure Monitor across on-premises workloads using the same tooling as Azure-native resources. For organizations managing a mixed environment (Azure Local alongside other hypervisors), Arc provides a consistent governance layer that extends beyond Azure Local itself.

## Comparison of Azure Local Versions

### Azure Local 21H2

- **Support**: No longer supported. This was the foundational release and has been surpassed by newer, more feature-rich versions.

### Azure Local 22H2

- **Stretch Cluster**: Supported, providing basic multi-site disaster recovery across two locations.
- **Deployment**: Largely manual, relying on PowerShell scripts.
- **AKS**: Complex, multi-script deployment.
- **AVD**: Available in Preview only.
- **SCVMM Support**: System Center Virtual Machine Manager (SCVMM) was fully supported.

### Azure Local 23H2

- **Support**: **No longer supported.** Upgrading to a later version was mandatory, not optional.
- **Cloud Deployment**: Introduced a cloud-first deployment model, significantly reducing setup complexity.
- **AVD GA**: Azure Virtual Desktop reached General Availability on-premises.
- **Enhanced Security**: The Supplemental Package is now included by default, hardening the infrastructure.
- **Improved VM Management**: Native Azure portal experience for VM deployment and lifecycle.
- **AKS Improvements**: More seamless AKS deployment with reduced manual scripting.
- **SCVMM**: Not supported in this release, which was a significant blocker for organizations that relied on it.

### Azure Local 24H2 and Monthly Releases (2408 through 2512+)

With the transition to 24H2 and a monthly release cadence, Azure Local has evolved rapidly and continuously:

- **SCVMM Support Returns**: System Center 2025 VMM supports Azure Local instances at versions 2408.2, 2411 or later, resolving the major upgrade blocker that kept some organizations on 22H2.
- **Managed Identity**: Cluster deployments now use system-assigned managed identity (SMI) instead of service principals, removing the need to manage certificate rotation.
- **Local Identity with Azure Key Vault** (from 2604): Deployments without any Active Directory dependency are now supported, using Microsoft Entra ID and Azure Key Vault for authentication.
- **OS Alignment**: From version 2512 onwards, Azure Local runs on OS version 26100.x, aligned with Windows Server 2025 drivers and compatibility requirements.
- **AKS Updates**: Kubernetes versions 1.31 through 1.33 are supported. NVIDIA GPU support includes the RTX PRO 6000 Blackwell Server Edition. KMS v1 is deprecated; plan cluster redeployments using KMS v2.
- **Rack-Aware Clustering**: Physical rack-based local availability zones for improved resilience. Generally Available for new deployments.
- **Limited Connectivity Updates** (from 2503): Ability to discover and import update packages with limited Azure connectivity, improving support for disconnected or partially connected environments.
- **Disaggregated Deployments** (planned for 2604): Expanded support for SAN-attached storage architectures, broadening the addressable deployment scenarios.

## Version Support and Transition Considerations

The monthly release cadence means organizations must keep clusters current; each feature build (e.g., 2408) is supported for approximately six months before requiring an update to a later build. Version 23H2 is no longer supported and migration to the 24H2 release train was mandatory. System Center 2025 has restored SCVMM support for Azure Local, resolving a major blocker for many organizations. The cloud-first deployment model remains a dependency, though the limited-connectivity update path introduced in 2503 has made partially isolated deployments more feasible; the Entra ID-only deployment option in 2604 removes the Active Directory requirement entirely for organizations that need it.

## Comparison with Other Solutions

### VMware vSAN

VMware vSAN remains technically strong, with mature disaster recovery capabilities including Stretch Clustering across multiple data centers and a deep ecosystem of certified hardware and third-party integrations. However, **Broadcom's acquisition of VMware** has fundamentally reshaped the market: core-pack licensing minimums (72-core packs for Enterprise), bundled ELA models, the discontinuation of perpetual licensing for many tiers and significant price increases have prompted a broad re-evaluation across the industry. Many mid-market and enterprise organizations are actively seeking alternatives for the first time in over a decade.

For organizations already in the Microsoft ecosystem, Azure Local offers comparable HCI capabilities (software-defined compute, storage and networking) with a more predictable Azure subscription cost model and native Azure integration at no additional license fee.

### Nutanix

Nutanix delivers a mature Enterprise Cloud Platform that converges compute, storage, virtualization and management into a unified software-defined layer. It supports multiple hypervisors (its own AHV, VMware ESXi and Microsoft Hyper-V) and excels at providing a consistent management experience across on-premises private cloud, hybrid cloud and multi-cloud environments. Its cloud-neutrality and multi-hypervisor flexibility make it particularly attractive for organizations that do not want to commit to a single vendor's stack.

In 2025, Nutanix and Microsoft deepened their partnership: **Nutanix AHV is now a supported infrastructure for Azure Arc-enabled AVD session hosts**, meaning organizations can run AVD on Nutanix hardware managed through the Azure portal. However, this integration supports Windows 11 single session and Windows Server session hosts but **not Windows 11 multisession**. Without multisession, every concurrent user requires a dedicated VM, which eliminates the cost efficiency of shared VDI at scale. Windows 11 multisession is exclusively available on Azure and Azure Local. This makes Nutanix simultaneously a competitor to Azure Local and, in certain hybrid scenarios, a complementary platform.

Licensing costs for Nutanix remain significant, but the platform's stability, operational maturity and cloud-neutrality make it the strongest alternative for large enterprises that prioritize vendor independence.

### Dell EMC VxRail

Dell EMC VxRail is a hyper-converged appliance built in close partnership with VMware, tightly integrated with VMware vSAN and VMware Cloud Foundation. It offers strong performance, validated hardware configurations and lifecycle management tooling through a fully integrated support model between Dell and (formerly) VMware.

As with VMware vSAN, Broadcom's licensing changes have increased costs and introduced long-term uncertainty for VxRail customers. For organizations standardizing on Azure and seeking to reduce operational silos, Azure Local offers a comparable on-premises HCI experience with strong hardware vendor support; Dell, HPE, Lenovo and others all offer Azure Local-validated nodes through the Azure Local Catalog.

### Proxmox VE

Proxmox VE has emerged as a prominent alternative in the post-Broadcom landscape. It is an open-source enterprise virtualization platform built on Debian Linux, combining **KVM** for full virtual machines and **LXC** for lightweight containers. It supports software-defined storage via ZFS and Ceph, flexible networking, a unified web-based management UI and a REST API. The core platform carries no mandatory licensing costs, with optional enterprise support subscriptions available from Proxmox Server Solutions.

Proxmox's strengths are compelling for many organizations: low total cost of ownership, freedom from vendor lock-in, a strong community and a rapid adoption wave driven by VMware refugees. Teams comfortable with Linux administration have found it a credible and cost-effective replacement for VMware in small to mid-size deployments.

However, Proxmox's limitations become apparent at enterprise scale and when modern cloud-native workloads are a requirement. It lacks native cloud integration, does not offer a first-class managed Kubernetes service and requires significant engineering effort to implement enterprise-grade HA, multi-site disaster recovery and storage replication at scale. There is no equivalent to AVD, AKS or Azure Arc on Proxmox; organizations that need those capabilities must layer multiple additional tools, each adding operational complexity.

### Windows Server Hyper-V with System Center

For organizations with a strong existing investment in the Microsoft ecosystem but not yet ready for Azure Local's cloud-first deployment model, **Windows Server Hyper-V combined with System Center** remains a fully viable, well-supported and compliant datacenter management stack:

- **System Center Virtual Machine Manager (VMM) 2025**: Manages VM lifecycle on Hyper-V clusters and Azure Local instances (versions 2408.2 and later), enabling provisioning, networking and storage management through a unified console. Starting from System Center 2025, **Azure Arc-enabled System Center VMM** extends Azure governance, policies and management capabilities to VMM-managed infrastructure.
- **System Center Configuration Manager (SCCM / ConfigMgr)**: Automates patching across VMs, Hyper-V hosts and endpoints; enforces configuration baselines; and keeps every virtual asset compliant and audit-ready. A well-understood toolchain in regulated industries.
- **System Center Operations Manager (SCOM)**: Monitors Hyper-V clusters, VM health and resource utilization, providing SLA dashboards and alerting for latency-sensitive workloads.

This stack is well-suited for regulated industries and large enterprises where established operational processes, deep compliance automation and proven change-control workflows are as important as cloud integration. With Arc-enabled SCVMM, organizations can adopt Azure governance incrementally, applying Azure Policies, Microsoft Defender for Cloud and Azure Monitor to their Hyper-V infrastructure without deploying Azure Local.

The main limitation compared to Azure Local is the absence of native AKS, AVD with Windows 11 multisession and the seamless Azure portal experience. As organizations modernize toward containers and cloud-native workloads, Azure Local provides a more direct path without requiring them to abandon the Microsoft ecosystem.

### OpenShift

OpenShift is a Kubernetes-based platform from Red Hat / IBM known for robust container orchestration, developer tooling, a strong operator framework and enterprise support. It excels in cloud-native and DevOps-oriented organizations and supports deployment across on-premises, hybrid and multi-cloud environments.

However, OpenShift is fundamentally a container platform and does not address traditional VM workloads, VDI or HCI-level infrastructure management. Azure Local's AKS integration provides a strong Kubernetes story alongside native VM workloads, AVD and Arc governance, making it a more comprehensive hybrid platform for organizations that need both containers and VMs on-premises within a single managed solution.

## Azure Arc: A Unifying Management Plane

Azure Arc deserves special mention as a strategic layer that transcends any individual infrastructure platform. Rather than being tied exclusively to Azure Local, Arc extends Azure's control plane to a broad range of on-premises and multi-cloud environments:

- **Azure Local clusters** (Arc-enabled by default at deployment)
- **VMware vSphere environments** via Azure Arc-enabled VMware vSphere
- **Nutanix AHV clusters** via Arc-enabled servers
- **Windows Server Hyper-V hosts** via Azure Arc-enabled System Center VMM
- **Physical Windows Server and Linux machines** via the Azure Connected Machine agent
- **Other cloud environments** (AWS, GCP) via Arc-enabled servers

This means organizations can adopt a hybrid governance strategy using Arc across their entire estate, applying Azure Policies, Microsoft Defender for Cloud, Azure Monitor and Azure Update Manager uniformly, regardless of whether workloads run on Azure Local, VMware, Nutanix, Hyper-V or bare metal.

A particularly relevant 2025 announcement is **AVD hybrid via Arc-enabled Servers**: session hosts can run on Arc-enabled infrastructure such as Hyper-V, Nutanix AHV, VMware vSphere or physical Windows Servers, with management through the Azure portal. Public preview is expected in the first half of 2026. It is important to note that **Windows 11 multisession is not supported in this scenario**: session hosts on non-Azure Local infrastructure can run Windows 11 single session or Windows Server, but the multisession capability (multiple concurrent users sharing a single VM) is exclusively available on Azure and Azure Local. Without it, each user requires a dedicated VM, negating the cost efficiency of shared VDI at scale.

This positions Azure Arc as a realistic **incremental migration path**: organizations can begin by Arc-enabling their existing infrastructure to gain immediate Azure governance benefits and then migrate specific workloads to Azure Local progressively when they are ready for the full cloud-first experience, without requiring a disruptive forklift migration.

## Competitive Advantages of Azure Local

When comparing Azure Local to the alternatives above, three capabilities stand out as unique or best-in-class for on-premises deployments:

1. **Azure Kubernetes Service (AKS) on-premises**: The simplest and most integrated path to enterprise Kubernetes on your own hardware. With NVIDIA GPU support (including the RTX PRO 6000 Blackwell Server Edition), native Azure lifecycle management, Kubernetes versions 1.31 through 1.33 and zero need for manual cluster bootstrapping scripts, AKS on Azure Local is the most accessible on-premises Kubernetes experience available. No competing HCI platform offers this level of Azure-native AKS integration.

2. **Azure Virtual Desktop (AVD) with Windows 11 Multisession**: Azure Local is the only on-premises platform where AVD with Windows 11 multisession is natively supported and generally available. Windows 11 multisession (allowing multiple concurrent users to share a single Windows 11 VM) is an exclusive Microsoft licensed capability and Azure Local is its on-premises home. All other Arc-enabled platforms that support AVD session hosts are limited to Windows 11 single session or Windows Server, both of which require one VM per concurrent user. This eliminates the cost efficiency that multisession provides and, in the case of Windows Server hosts, also removes Intune-based endpoint management. Azure Local is the only on-premises platform where the full multisession model is available, making it the only viable choice for cost-efficient shared VDI at scale without moving workloads to Azure.

3. **Native Azure Integration for Management and Support**: Azure Local is managed, monitored, billed and governed entirely through Azure. VM lifecycle, AKS, AVD, updates, policies, security baselines and support tickets are all handled through the Azure portal and Azure support channels, using the same tooling and processes as Azure-native resources. This eliminates the operational context-switching between on-premises management consoles and cloud portals and means that Microsoft's Azure support organization covers both the cloud and on-premises layers under a single agreement.

## Conclusion

Azure Local has matured into a comprehensive hybrid infrastructure platform that spans legacy workloads, modern cloud-native applications and everything in between. With its monthly release cadence, the platform now evolves faster than any previous version of Azure Stack HCI, continuously adding capabilities around AKS, AVD, Arc governance, GPU support and hardware flexibility.

The competitive landscape has shifted significantly since this article was first published. Broadcom's VMware acquisition has unsettled a large installed base, making alternatives like Nutanix, Proxmox, Windows Server Hyper-V and Azure Local more attractive than ever. Each has a distinct sweet spot: **Proxmox** for cost-sensitive Linux-native teams seeking vendor independence; **Windows Server Hyper-V + System Center** for compliance-heavy Microsoft shops with established operational processes; **Nutanix** for multi-cloud flexibility and a cloud-neutral stance; and **Azure Local** for organizations that want the deepest possible Azure integration on-premises without sacrificing cloud-native capability.

Azure Local's three key differentiators (**AKS**, **AVD with Windows 11 multisession** and **native Azure integration for management, governance and support**) make it the strongest choice for organizations that are already committed to Azure and want to extend that investment to on-premises infrastructure with full operational consistency.

Azure Arc further strengthens this position by enabling partial adoption: organizations can govern existing VMware, Nutanix, Hyper-V or bare-metal infrastructure through Arc today, gain immediate Azure governance benefits and migrate to Azure Local progressively as their workloads and readiness evolve.

## Disclaimer

The content of this article is based on my own experiences and understanding of Azure Local, gathered over time through practical implementations, industry knowledge and continuous learning. While I strive to provide accurate and up-to-date information, it's important to consult official Microsoft documentation or professional support for specific use cases and technical issues.

## Sources

- [Azure Local - What's New (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/azure-local/whats-new?view=azloc-2512)
- [Azure Local - Release Information (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/azure-local/release-information-23h2?view=azloc-24113)
- [Azure Local - Local Identity with Azure Key Vault (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/azure-local/deploy/deployment-local-identity-with-key-vault?view=azloc-2604)
- [AKS enabled by Azure Arc - What's New (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/aks/aksarc/aks-whats-new-local)
- [What's new in Azure Virtual Desktop (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Announcing new hybrid deployment options for Azure Virtual Desktop (Microsoft Tech Community)](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/announcing-new-hybrid-deployment-options-for-azure-virtual-desktop/4468781)
- [Azure Virtual Desktop Goes Fully Hybrid with Arc-Enabled Servers (InfoQ)](https://www.infoq.com/news/2025/11/azure-avd-fully-hybrid-arc/)
- [What is Azure Arc-enabled VMware vSphere (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/azure-arc/vmware-vsphere/overview)
- [What's new in System Center Virtual Machine Manager 2025 (Microsoft Learn)](https://learn.microsoft.com/en-us/system-center/vmm/whats-new-in-vmm?view=sc-vmm-2025)
- [Manage Azure Local instances in VMM (Microsoft Learn)](https://learn.microsoft.com/en-us/system-center/vmm/manage-azure-stack-hci?view=sc-vmm-2025)
- [Awesome Azure Local (GitHub)](https://github.com/schmittnieto/awesome-azure-local)

*Thank you for reading. If you have any questions or need assistance with Azure Local, feel free to reach out or leave a comment below.*
