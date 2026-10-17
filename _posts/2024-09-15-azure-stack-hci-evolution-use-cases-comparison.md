---
title: "Azure Local: Evolution, Use Cases and Comparison with Other Solutions"
excerpt: "Where Azure Local fits in 2026: datacenter virtualization and VMware exits, branch and industrial edge, sovereign disconnected clouds, multi-rack scale, virtual desktops and AI at the edge, compared with VMware, Nutanix, Proxmox, Hyper-V with System Center and OpenShift."
date: 2024-09-15
last_modified_at: 2026-10-17
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

I wrote the first version of this article before Azure Stack HCI was renamed to Azure Local ([link](https://learn.microsoft.com/en-us/azure/azure-local/rename-to-azure-local?view=azloc-24112&wt.mc_id=MVP_579217)) in November 2024, which is why the URL still carries the old name. If you find an error, I would appreciate a note in the comments or at blog@schmitt-nieto.com.
{: .notice--info}

## Azure Local: Evolution, Use Cases and Comparison with Other Solutions

**Last updated: October 2026 (Azure Local 2609).** I rebuilt the use cases around the scenarios I see in projects today. Azure Local started as a hyperconverged platform for virtual machines. In 2026 it also covers disconnected sovereign clouds, multi-rack datacenters, deployments on external SAN arrays, small edge devices that only run containers and AI workloads on GPUs. The comparison section now reflects VMware licensing under Broadcom, the general availability of AVD Hybrid on other hypervisors and OpenShift Virtualization.
{: .notice--warning}

This article is for IT professionals and decision makers who want to know where Azure Local fits and how it compares with the alternatives. It is **not a general introduction to Azure Local**. For what Azure Local is and how to deploy it, the [official Microsoft documentation](https://learn.microsoft.com/en-us/azure/azure-local/overview?wt.mc_id=MVP_579217) is the right starting point. Once you know Azure Local fits, my [Azure Local Calculator](/azurelocal-calculator/) helps with the sizing and the cost.

## A Short History of Azure Local

Azure Local comes from Hyper-V and Storage Spaces Direct, the virtualization and software-defined storage stack of Windows Server. Azure Stack HCI added Azure registration, billing and monitoring on top of that stack. With 23H2 Microsoft moved deployment, updates and VM management into the Azure portal through Azure Arc. In November 2024 the product was renamed to Azure Local.

The larger change happened in 2026. The hyperconverged cluster became one deployment type among several. Some of the new types no longer use Storage Spaces Direct. Multi-rack and small form factor do not even run Windows on the hosts.

## From HCI to a Family of Deployment Types

This table is the reason I rewrote the article. When a requirements document says "Azure Local" today, the deployment type behind it decides the hardware, the licensing model, the services you can run and how you size the solution. Microsoft counts four deployment types (hyperconverged, disaggregated, multi-rack and small form factor) and treats rack aware clusters and external SAN as variants of hyperconverged. Disconnected operations is a connectivity mode for hyperconverged and disaggregated deployments, but it changes the design so much that I list it as its own row.

| Deployment type or mode | Scale | What is different | Status |
|---|---|---|---|
| Hyperconverged | 1 to 16 machines | Storage Spaces Direct, switchless storage up to 3 machines | GA |
| Rack aware cluster | Up to 8 machines in two racks (up to 4+4) | Survives the loss of a full rack, 1 ms round trip or less between the racks, new deployments only | GA since 2601 |
| Hyperconverged with external SAN | 1 to 16 machines | Fibre Channel or iSCSI block storage next to Storage Spaces Direct | Fibre Channel GA since 2604, iSCSI GA since 2607 |
| Disaggregated | 1 to 64 machines | SAN only, compute and storage scale separately | GA since 2604 |
| Multi-rack | More than 100 machines, at least four racks | Fixed bill of materials, Azure Linux on the hosts, managed network fabric, connected only | Available from 2511 through your Microsoft account team |
| Disconnected operations | Workload clusters up to 64 machines plus a three-node management cluster | Local control plane with portal and Azure Resource Manager, no Azure connection needed | GA since 2602 |
| Small form factor | Single compact devices | Linux based, runs containers with AKS, K3s or Docker, no Azure Local VMs | Preview |

The services differ per type as well. Azure Virtual Desktop runs on hyperconverged and disaggregated deployments, but not on multi-rack, not on small form factor and not with disconnected operations. Multi-rack runs Azure Local VMs and AKS only. The licensing follows the type too: cloud-connected hyperconverged clusters pay the L1 host fee, external SAN, disaggregated and multi-rack pay the higher L2 fee and disconnected operations is licensed at L3. The [find your deployment type](https://learn.microsoft.com/en-us/azure/azure-local/plan/find-your-deployment-type?wt.mc_id=MVP_579217) page on Microsoft Learn walks through the same decision.

## Use Cases for Azure Local

I group the use cases by the problem the customer brings, because that problem decides the deployment type.

| Scenario | Typical deployment type | Key services |
|---|---|---|
| VMware exit and datacenter consolidation | Hyperconverged, external SAN or disaggregated | Azure Local VMs, Azure Migrate |
| Branch offices, retail and industrial sites | Single node or two to three node switchless, ruggedized catalog systems where there is no rack | Azure Local VMs, AKS, Azure IoT Operations |
| Sovereign and disconnected private cloud | Disconnected operations | Azure Local VMs, AKS, SQL Server, Microsoft 365 Local |
| Large datacenters and rack-level resilience | Rack aware, disaggregated, multi-rack | Azure Local VMs, AKS |
| Virtual desktops | Hyperconverged or disaggregated | Azure Virtual Desktop with Windows 11 multi-session |
| Kubernetes and AI at the edge | Hyperconverged with GPUs | AKS with full GPUs (DDA), Foundry Local, GPU partitioning for Azure Local VMs only |
| Legacy Windows workloads | Hyperconverged | Extended Security Updates, hotpatch, Trusted Launch |

### 1. Leaving VMware and Consolidating the Datacenter

This is the conversation I have most often since Broadcom changed the VMware licensing. The migration path has matured: [Azure Migrate](https://learn.microsoft.com/en-us/azure/azure-local/migrate/migrate-whats-new?wt.mc_id=MVP_579217) moves VMware VMs to Azure Local and is generally available since October 2025. Since September 2026 it can target SAN-backed storage and reuse existing Arc resources. Migration from Hyper-V to Azure Local is still in preview. Microsoft also warns that access to the VMware VDDK might be restricted and lists Carbonite, Commvault and Veeam as alternatives in its [migration options overview](https://learn.microsoft.com/en-us/azure/azure-local/migrate/migration-options-overview?wt.mc_id=MVP_579217).

The bigger change for these projects is storage. Many VMware estates run on a Fibre Channel array with years of depreciation left. Until 2026 Azure Local meant replacing that array with Storage Spaces Direct. Now you can keep it, either next to Storage Spaces Direct (hyperconverged with external SAN) or as the only storage (disaggregated). Supported arrays come from Dell PowerStore, Everpure FlashArray, Hitachi VSP, HPE Alletra MP, Lenovo and NetApp ONTAP, as listed in the [SAN requirements](https://learn.microsoft.com/en-us/azure/azure-local/concepts/san-requirements?wt.mc_id=MVP_579217). Keep in mind that these designs pay the L2 host fee, which is about twice the L1 fee per core.

One more date for customers who planned to stay on VMware inside Azure: Microsoft stops selling license-included Azure VMware Solution on 31 October 2026 and existing customers have to move by August 2027 ([The Register](https://www.theregister.com/virtualization/2026/08/20/microsoft-ends-one-of-the-last-ways-to-buy-vmware-without-big-bundles-1/5290044)).

### 2. Branch Offices, Retail and Industrial Sites

A single node or a two or three node cluster with switchless storage covers the classic branch office that needs a few VMs and some local resilience. It runs the same hyperconverged Azure Local as the datacenter, so the operations team manages the shops or plants with the same tools and update process.

Many of these sites have no rack and no server room: a store backroom, a cabinet on the shop floor, a container next to a production line. The [Azure Local solutions catalog](https://azurelocalsolutions.azure.microsoft.com/#/catalog) lists ruggedized systems for exactly these places next to the usual rack servers. The models change often, so I check the catalog for the current options instead of keeping a list.

For manufacturing, [Azure IoT Operations](https://learn.microsoft.com/en-us/azure/iot-operations/deploy-iot-ops/overview-deploy?wt.mc_id=MVP_579217) on AKS on Azure Local is generally available on hyperconverged deployments, validated from release 2607.

Microsoft is also previewing a [small form factor](https://learn.microsoft.com/en-us/azure/azure-local/small-form-factor/small-form-factor-installation?wt.mc_id=MVP_579217) deployment type: a Linux based Azure Local on compact devices that runs containers only, with zero-touch provisioning from Azure and no Azure Local VMs. It can become an option for sites that only run containers. As long as it is in preview, it does not go into a production design of mine.

### 3. Sovereign and Disconnected Private Cloud

This scenario did not exist when I wrote the first version of this article. [Disconnected operations](https://learn.microsoft.com/en-us/azure/azure-local/manage/disconnected-operations-overview?wt.mc_id=MVP_579217) became generally available with release 2602. A local control plane appliance brings the Azure portal, Azure Resource Manager, RBAC, Azure Policy, Key Vault and Azure Container Registry into the site, so the cluster runs without any connection to Azure. On top of it you run Azure Local VMs, Arc-enabled servers and AKS. AKS reached general availability for disconnected operations in 2609, including Windows node pools.

The entry requirements are strict. You need an eligible agreement (MOSA is not eligible), a Standard or higher support plan, Premier Solutions hardware and a business case that Microsoft approves. The control plane runs on a dedicated [three-node management cluster](https://learn.microsoft.com/en-us/azure/azure-local/manage/disconnected-operations-control-plane-appliance?wt.mc_id=MVP_579217) with 24 physical cores, 128 GB or 512 GB of memory and six or eight 2 TB data drives per node. No workloads are allowed on it. Workload clusters can grow to 64 machines since 2604.

Microsoft groups the workloads for this scenario under its Sovereign Private Cloud offering:

* [Microsoft 365 Local](https://learn.microsoft.com/en-us/azure/azure-sovereign-clouds/private/m365-local/microsoft-365-local-overview?wt.mc_id=MVP_579217) runs Exchange Server, SharePoint Server and Skype for Business Server on Azure Local, connected since December 2025 and disconnected since February 2026. It needs Premier Solutions hardware and a certified partner. Teams is not part of it.
* [SQL Server on Azure Local](https://www.microsoft.com/en-us/sql-server/blog/2026/09/28/sql-server-on-azure-local-is-now-generally-available/) is generally available since 28 September 2026, connected and disconnected.
* [GitHub Enterprise Local](https://learn.microsoft.com/en-us/azure/azure-sovereign-clouds/private/github-local/github-local-overview?wt.mc_id=MVP_579217) (preview) runs GitHub Enterprise Server as an appliance VM.
* [Foundry Local](https://learn.microsoft.com/en-us/azure/azure-sovereign-clouds/private/foundry-local/overview?wt.mc_id=MVP_579217) (preview) brings AI inference to the same environment, see use case 6.

Azure Virtual Desktop is not among the services of disconnected operations. If a sovereign customer needs virtual desktops, that part of the design has to stay connected.

### 4. Large Datacenters and Rack-Level Resilience

When I wrote my [Redundancy article](/blog/azure-local-redundancy/), rack aware clustering was a private preview. It is generally available since 2601. A [rack aware cluster](https://learn.microsoft.com/en-us/azure/azure-local/concepts/rack-aware-cluster-overview?wt.mc_id=MVP_579217) spreads up to eight machines over two racks or rooms with a round trip of 1 ms or less between them and survives the loss of a full rack. It is for new deployments only and does not support external SAN storage.

For scale, disaggregated deployments reach 64 machines with the storage on the SAN. Beyond that, [multi-rack](https://learn.microsoft.com/en-us/azure/azure-local/multi-rack/multi-rack-overview?wt.mc_id=MVP_579217) targets more than 100 machines and 8,000 cores. It is a prescriptive design: one aggregation rack with the network and SAN storage plus at least three compute racks, bought as a fixed bill of materials from a Microsoft hardware partner. The hosts run Azure Linux, the control plane sits in East US, Australia East or South Central US and the site connects to Azure through ExpressRoute. Multi-rack runs Azure Local VMs and AKS. SQL Server, Azure Virtual Desktop, Microsoft 365 Local, GitHub Enterprise Local, Foundry Local and Azure IoT Operations are not available on it.

### 5. Virtual Desktops with Azure Virtual Desktop and Windows 11 Multi-Session

Azure Local is still the only on-premises platform where Azure Virtual Desktop runs with **Windows 11 Enterprise multi-session**. Multi-session lets several users share one session host VM, which is what makes VDI at scale affordable.

In September 2026 Microsoft made [Azure Virtual Desktop Hybrid](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/microsoft-azure-virtual-desktop-hybrid-is-now-generally-available/4550523?wt.mc_id=MVP_579217) generally available. It runs session hosts on Arc-enabled servers on Hyper-V, VMware vSphere, Nutanix AHV or physical hardware. It does **not** support Windows multi-session, autoscale or Start VM on Connect. Every concurrent user on those platforms needs a dedicated VM or a Windows Server session host.

The pricing model is different as well. AVD Hybrid has a service fee of 10$ per user per month according to Microsoft's [AVD Hybrid pricing FAQ](https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/microsoft/bade/documents/products-and-services/en-us/azure/Azure-Virtual-Desktop-Hybrid-Per-user-per-month-pricing.pdf), on top of the usual per-user licenses (Microsoft 365 E3 or a comparable license for Windows, RDS CALs with Software Assurance or an RDS User Subscription for Windows Server). AVD on Azure Local is billed per session host vCPU instead, at $0.01 per vCPU per hour ([Azure Virtual Desktop pricing](https://azure.microsoft.com/en-us/pricing/details/virtual-desktop/?wt.mc_id=MVP_579217)). With multi-session and four medium users per vCPU, that comes to about $1.83 per user per month for the service fee, before the Azure Local host fee.

On Azure Local, AVD runs on hyperconverged and disaggregated deployments. I covered the setup in [Azure Virtual Desktop on Azure Local](/blog/azure-stack-hci-azure-virtual-desktop/) and the Entra-only variant in [AVD with Entra join on Azure Local](/blog/azure-local-avd-entra-join/).

### 6. Kubernetes and AI at the Edge

[AKS enabled by Azure Arc](https://learn.microsoft.com/en-us/azure/aks/aksarc/aks-whats-new-local?wt.mc_id=MVP_579217) runs Kubernetes 1.31 to 1.33 on Azure Local and is deployed and updated from the Azure portal or the Azure CLI. Windows Server 2019 node pools ended in March 2026. My [AKS article](/blog/azure-local-aks/) walks through a deployment.

GPU support moved from preview into production in 2026. [GPU acceleration](https://learn.microsoft.com/en-us/azure/azure-local/manage/gpu-preparation?wt.mc_id=MVP_579217#supported-gpu-models) for Azure Local VMs is generally available since 2604 with two ways to attach a GPU. Discrete device assignment (DDA) gives a whole GPU to one VM. GPU partitioning (GPU-P) splits one GPU into equal fractions for several VMs. Supported NVIDIA cards include the A2, A16, L4, L40S and RTX PRO 6000. Release 2608 added GPU management from Azure in preview.

For AI on Kubernetes there is a catch: AKS on Azure Local supports DDA only, because GPU partitions are not supported for AKS Arc yet. Every GPU worker node takes at least one full physical GPU. Microsoft also requires the same GPU model on all machines of the cluster. A small inference model that needs a fraction of a GPU still blocks a whole card. In practice the number of physical GPUs often decides how many AI workloads fit on AKS, so plan the GPU count per machine as carefully as cores and memory. If several small models have to share a GPU today, Azure Local VMs with GPU-P are the way to do it, with the model running outside of AKS.

The AI services on top of that are still in preview:

* **Foundry Local on Azure Local** runs as an Arc extension on Kubernetes on CPU or GPU and also works disconnected.
* **Agentic Retrieval in Foundry Local**, formerly Edge RAG, adds retrieval over local data and needs two GPUs for the embedding models.
* **KAITO** on AKS deploys open models with a Kubernetes operator.

I tested running language models on Azure Local in my [LLM on Azure Local article](/blog/azure-local-llm/).

### 7. Legacy Windows Workloads

Extended Security Updates were one of the strongest arguments for Azure Local. The rules changed on 1 April 2026. [ESUs on Azure Local](https://learn.microsoft.com/en-us/azure/azure-local/manage/azure-benefits-esu?wt.mc_id=MVP_579217) stay free only for products that left support before that date. Windows 10 version 22H2 and SQL Server 2014 are still covered, while the ESU period for Windows Server 2012 ended on 13 October 2026. AVD session hosts with Windows 10 22H2 also get their ESUs at no extra cost.

Windows Server 2016 is the case that matters now. It reaches end of support on 12 January 2027. Microsoft has not committed to free ESUs for it on Azure Local: the Azure Local ESU page lists it under the new standardized pricing, which charges the same list price wherever the machine runs. The price itself is not published yet. Through Azure Arc you can configure [Windows Server 2016 ESUs](https://learn.microsoft.com/en-us/azure/azure-arc/servers/prepare-extended-security-updates?wt.mc_id=MVP_579217) since 3 August 2026, with billing from 13 January 2027. If a business case for Azure Local counts on free ESUs for Windows Server 2016, take that line out and plan the upgrades or a budget for the ESUs.

The same trend applies to hotpatching. Windows Server 2022 and 2025 Datacenter: Azure Edition VMs on Azure Local install security updates without a restart. Since [Arc-enabled hotpatch](https://learn.microsoft.com/en-us/windows-server/get-started/hotpatch?wt.mc_id=MVP_579217) for Windows Server 2025 Standard and Datacenter is now free, hotpatch is no longer a reason to pick Azure Local on its own.

What remains is the security posture of the VMs: Trusted Launch with Secure Boot, vTPM and virtualization-based security is generally available and confidential VMs on AMD SEV-SNP are in preview since 2607.

## How Azure Local Got Here: Releases at a Glance

Azure Local ships a feature release every month. Each release is supported for six months. Outside that window Microsoft support only helps you update. The Arc resource bridge needs an update at least once a year. My [Lifecycle article](/blog/azure-local-lifecycle/) covers the update process.

| Release | What changed for the use cases |
|---|---|
| 21H2 and 22H2 | PowerShell based deployment, stretched clusters, full SCVMM support. Out of support. |
| 23H2 | Deployment from Azure, Arc VM management, AVD generally available, no SCVMM at first. The 23H2 OS (build 25398) reached end of support in April 2026. |
| 2408 to 2511 | Monthly cadence. System Center 2025 VMM supports Azure Local again from 2408.2. Limited connectivity updates from 2503. Multi-rack from 2511. |
| 2512 | Host OS moves to build 26100, aligned with Windows Server 2025. Cluster registration uses a system-assigned managed identity instead of a service principal. |
| 2601 | Rack aware clustering generally available. |
| 2602 | Disconnected operations generally available. |
| 2604 | Disaggregated deployments, Fibre Channel SAN and local identity with Azure Key Vault (no Active Directory) generally available. GPU DDA and GPU-P generally available. |
| 2607 | iSCSI SAN generally available. Confidential VMs in preview. |
| 2608 | GPU management and adding nodes from the Azure portal, both in preview. |
| 2609 | Backup of system secrets to Key Vault and local identity with internal DNS, both in preview. AKS generally available with disconnected operations. |

The source for this table is the [What's new in Azure Local](https://learn.microsoft.com/en-us/azure/azure-local/whats-new?wt.mc_id=MVP_579217) page.

## Comparison with Other Solutions

### VMware vSphere and vSAN

VMware is still technically strong: mature stretched clusters, a large hardware compatibility list and a deep third-party ecosystem. The problem my customers bring is licensing. Broadcom sells VMware Cloud Foundation as a per-core subscription with a minimum of 16 cores per CPU, VCF 9 requires regular compliance reporting and perpetual licenses are gone. Dell VxRail and the other vSAN appliances carry the same licensing question.

Azure Local is billed per physical core as well, but the host fee is lower. On cloud-connected hyperconverged clusters, Azure Hybrid Benefit waives it for Windows Server Datacenter licenses with Software Assurance. For a Microsoft-centric estate, that changes the cost discussion more than any feature comparison.

### Nutanix

Nutanix runs a mature platform that combines compute, storage, virtualization and management on its own hypervisor AHV and supports ESXi as well. Its management experience across private and public clouds and its independence from a single cloud vendor make it the strongest alternative for large enterprises that want to stay neutral.

Nutanix is also a partner in the Microsoft story. AHV is a supported platform for AVD Hybrid since September 2026, but with single-session hosts only. Windows 11 multi-session remains limited to Azure and Azure Local. Licensing costs for Nutanix are significant, so the decision usually comes down to vendor neutrality versus Azure integration.

### Proxmox VE

Proxmox VE grew fast after the Broadcom changes. It is an open-source platform on Debian with KVM for virtual machines, LXC for containers and ZFS or Ceph for storage, with optional support subscriptions. Proxmox VE 9.2 (May 2026) added a dynamic load balancer and Proxmox Datacenter Manager (1.0 in December 2025, 1.1 in May 2026) manages several clusters from one place.

For teams with Linux skills it is a credible VMware replacement in small and mid-size environments, with a low total cost. The gaps show up when the requirements go beyond virtual machines: there is no managed Kubernetes service, no AVD and no cloud control plane. You can Arc-enable the guest operating systems, but the platform itself stays outside Azure.

### Windows Server Hyper-V with System Center

Hyper-V on Windows Server 2025 with System Center 2025 remains a supported datacenter stack for organizations that are not ready for the cloud-first model of Azure Local. VMM manages Hyper-V clusters and Azure Local instances, Configuration Manager handles patching and baselines and Operations Manager covers monitoring. Regulated industries with established change processes still run this stack successfully.

Two things changed. Arc-enabled SCVMM retires in September 2029 and Microsoft recommends [Arc-enabled servers](https://learn.microsoft.com/en-us/azure/azure-arc/system-center-virtual-machine-manager/overview?wt.mc_id=MVP_579217) instead, so the Azure governance path for Hyper-V runs through the Connected Machine agent. And AVD Hybrid now supports Hyper-V hosts, with the same single-session limitation as on the other platforms. Native AKS and AVD with Windows 11 multi-session remain Azure Local only.

### Red Hat OpenShift

In the first version of this article I wrote that OpenShift does not address VM workloads. That is no longer true. [OpenShift Virtualization](https://www.redhat.com/en/technologies/cloud-computing/openshift/virtualization-engine), based on KubeVirt, runs virtual machines next to containers, the OpenShift Virtualization Engine subscription covers VM-only clusters per bare-metal node and the Migration Toolkit for Virtualization moves VMs from VMware.

That makes OpenShift a real alternative for organizations that are container-first and want VMs on the same Kubernetes platform. Azure Local fits better when the estate is Windows-heavy, when virtual desktops with multi-session are part of the plan or when the operations team wants to manage everything from the Azure portal. OpenShift clusters can still be connected to Azure as Arc-enabled Kubernetes.

## Azure Arc: A Unifying Management Plane

Azure Arc reaches beyond Azure Local and is often the first step of a migration. It brings the Azure control plane to:

- **Azure Local** instances, which are Arc-enabled from the deployment on
- **VMware vSphere** through Azure Arc-enabled VMware vSphere
- **Hyper-V** through Arc-enabled SCVMM until its retirement in September 2029 and through Arc-enabled servers after that
- **Any Windows or Linux machine**, physical or virtual, on Nutanix, Proxmox, AWS or GCP through the Connected Machine agent
- **Kubernetes clusters** such as OpenShift through Arc-enabled Kubernetes

With that in place you can apply Azure Policy, Microsoft Defender for Cloud, Azure Monitor and Azure Update Manager to the whole estate, whatever the hypervisor underneath.

This is the incremental path I recommend most often. Arc-enable the existing infrastructure first and get the governance in place, then move workloads to Azure Local when the hardware cycle or the licensing renewal makes the move worthwhile.

## Where Azure Local Stands Out

Compared with the alternatives above, these capabilities are unique to Azure Local or strongest there:

1. **Azure Virtual Desktop with Windows 11 multi-session on-premises.** AVD Hybrid brought session hosts to other hypervisors in 2026, without multi-session. For shared VDI at scale on your own hardware, Azure Local is the only option.
2. **VMs, Kubernetes and GPUs on one platform managed from Azure.** Azure Local VMs, AKS and GPU workloads share the same cluster, the same portal and the same update process. No other HCI platform offers AKS with this depth of Azure integration.
3. **A sovereign cloud with the Azure control plane on site.** Disconnected operations, Microsoft 365 Local and SQL Server on Azure Local give regulated and air-gapped sites the Azure tooling without the Azure connection.
4. **Azure-native operations and support.** Updates, policies, security baselines, billing and support tickets run through Azure, under one support agreement for the cloud and the on-premises layer.

## Conclusion

Azure Local in 2026 covers much more than the hyperconverged cluster I compared in 2024. The same product name now spans single edge devices, sovereign sites without an Azure connection, SAN-based datacenters and multi-rack deployments with hundreds of machines. The first decision in any project is the deployment type. The use cases above are how I map a customer's problem to one.

The market moved as well. Broadcom pushed many VMware customers to look around, Proxmox and OpenShift Virtualization became serious options and AVD Hybrid brought Azure management to other hypervisors. Each platform has its place: Proxmox for cost-sensitive Linux teams, OpenShift for container-first organizations, Nutanix for vendor neutrality and Hyper-V with System Center for Microsoft shops with established processes. Azure Local is the choice when you want the Azure operating model on your own hardware, especially with virtual desktops, Kubernetes, GPUs or sovereignty requirements in the plan.

Azure Arc keeps the path open for everyone else: govern the existing estate from Azure today and move workloads to Azure Local when it makes sense.

## Disclaimer

This article reflects my own project experience and my reading of the Microsoft documentation as of October 2026. Azure Local changes with every monthly release, so check the official documentation before you base a decision on it.

## Sources

- [What's new in Azure Local (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/azure-local/whats-new?wt.mc_id=MVP_579217)
- [Azure Local release information (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/azure-local/release-information-23h2?wt.mc_id=MVP_579217)
- [Find your Azure Local deployment type (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/azure-local/plan/find-your-deployment-type?wt.mc_id=MVP_579217)
- [Azure Local scalability and deployment types (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/azure-local/scalability-deployments?wt.mc_id=MVP_579217)
- [Disaggregated deployments of Azure Local (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/azure-local/overview/disaggregated-overview?wt.mc_id=MVP_579217)
- [Supported SAN solutions on Azure Local (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/azure-local/concepts/san-requirements?wt.mc_id=MVP_579217)
- [Rack aware clustering overview (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/azure-local/concepts/rack-aware-cluster-overview?wt.mc_id=MVP_579217)
- [Multi-rack deployments of Azure Local (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/azure-local/multi-rack/multi-rack-overview?wt.mc_id=MVP_579217)
- [Small form factor deployments of Azure Local (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/azure-local/small-form-factor/small-form-factor-installation?wt.mc_id=MVP_579217)
- [Disconnected operations for Azure Local (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/azure-local/manage/disconnected-operations-overview?wt.mc_id=MVP_579217)
- [Microsoft 365 Local (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/azure-sovereign-clouds/private/m365-local/microsoft-365-local-overview?wt.mc_id=MVP_579217)
- [SQL Server on Azure Local is now generally available (Microsoft SQL Server Blog)](https://www.microsoft.com/en-us/sql-server/blog/2026/09/28/sql-server-on-azure-local-is-now-generally-available/)
- [Azure Migrate for Azure Local: what's new (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/azure-local/migrate/migrate-whats-new?wt.mc_id=MVP_579217)
- [Extended Security Updates on Azure Local (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/azure-local/manage/azure-benefits-esu?wt.mc_id=MVP_579217)
- [Prepare to deliver Extended Security Updates through Azure Arc (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/azure-arc/servers/prepare-extended-security-updates?wt.mc_id=MVP_579217)
- [Hotpatch for Windows Server (Microsoft Learn)](https://learn.microsoft.com/en-us/windows-server/get-started/hotpatch?wt.mc_id=MVP_579217)
- [GPU preparation for Azure Local (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/azure-local/manage/gpu-preparation?wt.mc_id=MVP_579217)
- [AKS enabled by Azure Arc: what's new (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/aks/aksarc/aks-whats-new-local?wt.mc_id=MVP_579217)
- [Foundry Local on Azure Local (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/azure-sovereign-clouds/private/foundry-local/overview?wt.mc_id=MVP_579217)
- [Azure Virtual Desktop Hybrid is now generally available (Microsoft Tech Community)](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/microsoft-azure-virtual-desktop-hybrid-is-now-generally-available/4550523?wt.mc_id=MVP_579217)
- [Azure Virtual Desktop Hybrid overview (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/virtual-desktop/hybrid-overview?wt.mc_id=MVP_579217)
- [Azure Virtual Desktop pricing (Microsoft Azure)](https://azure.microsoft.com/en-us/pricing/details/virtual-desktop/?wt.mc_id=MVP_579217)
- [Azure Virtual Desktop Hybrid pricing and licensing FAQ (Microsoft, PDF)](https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/microsoft/bade/documents/products-and-services/en-us/azure/Azure-Virtual-Desktop-Hybrid-Per-user-per-month-pricing.pdf)
- [Arc-enabled System Center VMM overview (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/azure-arc/system-center-virtual-machine-manager/overview?wt.mc_id=MVP_579217)
- [Red Hat OpenShift Virtualization Engine (Red Hat)](https://www.redhat.com/en/technologies/cloud-computing/openshift/virtualization-engine)
- [Proxmox press releases (Proxmox)](https://www.proxmox.com/en/about/company-details/press-releases)
- [Microsoft ends license-included Azure VMware Solution (The Register)](https://www.theregister.com/virtualization/2026/08/20/microsoft-ends-one-of-the-last-ways-to-buy-vmware-without-big-bundles-1/5290044)
- [Awesome Azure Local (GitHub)](https://github.com/schmittnieto/awesome-azure-local)

*Thank you for reading. If you have questions about Azure Local or want to share how you decided between these platforms, leave a comment below.*
