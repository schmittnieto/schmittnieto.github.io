---
title: "Azure Stack HCI: Day2 operations"
excerpt: "Unlock the full potential of your Azure Stack HCI deployment with essential Day 2 operations. From configuring networks to managing VMs Images, monitoring, and security, this guide walks you through the steps to optimize your environment."
date: 2024-10-19
categories:
  - Blog
tags:
  - Chronicloud Series
  - Azure Stack HCI

header:
  teaser: "/assets/img/post/2024-10-19-azure-stack-hci-day2.webp"
  image: "/assets/img/post/2024-10-19-azure-stack-hci-day2.webp"
  og_image: "/assets/img/post/2024-10-19-azure-stack-hci-day2.webp"
  overlay_image: "/assets/img/post/2024-10-19-azure-stack-hci-day2.webp"
  overlay_filter: 0.5
  caption: "Photo credit: [**Flux**](https://flux1.ai/)"

toc: true
toc_label: "Topics Overview" 
toc_icon: "list-ul"
---

## Azure Stack HCI Day 2 Operations

Welcome back to the [Chronicloud Series](/blog/chronicloud-series/)! If you've been following along, you should now have a fully provisioned **Azure Stack HCI DemoLab**. In the previous article, [Azure Stack HCI DemoLab](/blog/azure-stack-hci-demolab/), we took you through the process of setting up Azure Stack HCI in a clean environment, highlighting the steps necessary to bring your infrastructure online. But provisioning is just the beginning!

Now that your HCI environment is up and running, it's time to explore the essential **Day 2 Operations**—the next steps that will bring your infrastructure to full functionality. These are the critical actions required after your deployment to ensure that your environment is secure, performant, and ready for production workloads. Whether you’re preparing to deploy virtual machines (VMs), Azure Virtual Desktop (AVD), or Kubernetes clusters, this guide will help you configure and activate all the necessary features.

In addition to setting up networking and management tools, we'll also cover the important task of **downloading and configuring VM images** required for VM workloads and AVD. These images are essential for deploying VMs and ensuring that Azure Stack HCI is ready to handle Windows Server workloads from the Azure Marketplace. 

Day 2 operations are about configuring and activating the capabilities you need to run a stable, secure, and performant infrastructure. You’ll learn how to:

- Understand the integration between Azure and your on-premises infrastructure through the **Azure Arc Resource Bridge**.
- Set up logical networks to support key workloads like **AKS (Azure Kubernetes Service)**, **AVD (Azure Virtual Desktop)**, and **VMs (virtual machines)**.
- Activate **Windows Admin Center (WAC)** to manage your HCI environment, while understanding its different versions and limitations.
- Enable monitoring, alerting, and other management tools to keep your system healthy.
- Download and manage **VM images** for your workloads, which will unlock the ability to deploy VMs and AVD.

Each of these steps is crucial for ensuring your Azure Stack HCI environment is fully integrated with Azure, optimized for workloads, and ready for production. Let’s get started by diving into what powers this integration: **Azure Arc Resource Bridge**.


## The Magic Behind Azure Stack HCI: Azure Arc Resource Bridge

Azure Stack HCI integrates seamlessly with Azure using the [Azure Arc Resource Bridge](https://learn.microsoft.com/en-us/azure/azure-arc/resource-bridge/overview). This bridge is essential in enabling your on-premises infrastructure to act like a cloud, hosting various Azure services and solutions in your private cloud environment.

### Key Components of the Arc Resource Bridge

The Azure Arc Resource Bridge is a multi-layered system that enables deep functionality for private clouds. It consists of:

1. **Base Layer**: This layer includes the resource bridge itself and the Arc agents responsible for managing communication between Azure and your infrastructure.
2. **Platform Layer**: This layer contains **custom locations** and **cluster extensions**. Custom locations define where Azure resources are deployed (for example, mapping a custom location to an Azure Stack HCI cluster), and cluster extensions represent Azure services running on-premises, such as Azure Arc VM management.
3. **Solution Layer**: The solution layer supports each service running on the Azure Arc resource bridge, such as different types of virtual machines (VMs).

### Services Supported by the Arc Resource Bridge

The Arc Resource Bridge hosts two primary objects:

- **Cluster Extension**: This includes services like **Azure Arc VM management**, **Azure Arc-enabled VMware**, and **Azure Arc-enabled System Center Virtual Machine Manager (SCVMM)**.
- **Custom Locations**: These define the targets for deployment. For instance, when you create a VM on Azure Stack HCI, the **custom location** will map to your HCI cluster.

One of the most powerful aspects of the Arc Resource Bridge is that it projects on-premises resources into Azure, allowing you to manage them from the cloud. However, keep in mind that issues with on-premises infrastructure (like the accidental deletion of the resource bridge) can affect your ability to manage these resources through Azure. Although your VMs will still run locally, Azure-based management will be disrupted.

### Azure Arc Resource Bridge Architecture

The **Azure Arc Resource Bridge** is a complex yet elegant system that makes hybrid cloud management a reality. Here’s an architectural diagram that showcases the flow of data and services between Azure and your on-premises infrastructure.
![Azure Arc Resource Bridge Architecture 01](/assets/img/post/2024-10-19-azure-stack-hci-demolab-day2/Arc-Resource-Bridge-architecture-overview01.png){: style="border: 2px solid grey;"}
![Azure Arc Resource Bridge Architecture 02](/assets/img/post/2024-10-19-azure-stack-hci-demolab-day2/Arc-Resource-Bridge-architecture-overview02.png){: style="border: 2px solid grey;"}
The diagrams demonstrate the relationship between the layers of the Arc Resource Bridge and the Azure services it supports. 
Special thanks to [Lior Kamrat](https://www.linkedin.com/in/liorkamrat/) for creating this detailed representation of the infrastructure in his insightful work. 

## Activating All Available Features in Azure Stack HCI

After provisioning Azure Stack HCI, you may notice that many features are not enabled by default. We'll walk through the activation process for these features to unlock the full potential of your HCI environment.

Here’s a look at the Azure Stack HCI environment immediately after deployment:

![Azure Stack HCI after provisioning 01](/assets/img/post/2024-10-19-azure-stack-hci-demolab-day2/azshci01.png){: style="border: 2px solid grey;"}
![Azure Stack HCI after provisioning 02](/assets/img/post/2024-10-19-azure-stack-hci-demolab-day2/azshci02.png){: style="border: 2px solid grey;"}

As you can see, most features need to be activated to fully utilize Azure Stack HCI’s capabilities. Let's go through each step.

### Creating a Logical Network

To start deploying services like AKS or VMs, you must first **create a logical network**. In the past, this required direct access to the cluster, but the process has become more straightforward in recent Azure Stack HCI versions. The Microsoft documentation on this topic is outdated; currently, instead of manually typing the name of the virtual switch (which in the past was obtained by directly accessing the cluster node and executing the following command `Get-VmSwitch -SwitchType External`), now, you select it from a **dropdown menu** 👌.

Here is a small guide on how to configure the logical network in our demolab: 
- First we will go to the Logical Network section and add our first lnet:
![Creating Logical Network 01](/assets/img/post/2024-10-19-azure-stack-hci-demolab-day2/lnet01.png){: style="border: 2px solid grey;"}
- We give a name to the lnet (which will appear later in Azure) and select the Virtual Switch using Dropdown:
![Creating Logical Network 02](/assets/img/post/2024-10-19-azure-stack-hci-demolab-day2/lnet02.png){: style="border: 2px solid grey;"}
- And finally we add all the necessary network data. If you have made use of Demolab you can use the same as me 😉
![Creating Logical Network 03](/assets/img/post/2024-10-19-azure-stack-hci-demolab-day2/lnet03.png){: style="border: 2px solid grey;"}

Once you've created your first **Logical Network (lnet)**, you can deploy an AKS 🤖. But we will leave this point for another article because several considerations must be taken into account.

![AKS deployment after lnet setup](/assets/img/post/2024-10-19-azure-stack-hci-demolab-day2/azshci03.png){: style="border: 2px solid grey;"}

However, keep in mind that **VMs** and **Azure Automanage for Windows Server** still cannot be deployed at this point, as they depend on custom **VM images**, which we will address later.

### Windows Admin Center (WAC)

Windows Admin Center (WAC) was a key management tool for Azure Stack HCI, providing a centralized interface to manage servers, clusters, and virtual machines. It streamlined tasks like monitoring, updating, and troubleshooting, making it an important tool for administrators. There are two main versions of WAC available for Azure Stack HCI: local and cloud-based, each with specific advantages.

#### Local WAC

Local WAC is the stable, fully functional version that runs on a dedicated management server or VM within your environment. It requires a connection to Active Directory and direct access to your Azure Stack HCI cluster. In previous versions of HCI, Local WAC was **crucial** for tasks like **firmware and hardware updates**, which relied heavily on **plugins**. These plugins were essential for managing hardware from specific OEM vendors, providing deep integration for updates and monitoring.

However, starting with Azure Stack HCI version **23H2**, the responsibility for managing **firmware and hardware updates** has largely shifted to the **Solution Builder Extensions (SBE)**. The goal moving forward is to manage everything from the Azure portal, or at least get as close to that as possible. I'll dive deeper into the specifics of this shift and how updates are handled in a future article focused on the **update process**.

#### Azure Arc-based WAC

Azure Arc-based WAC is currently in preview and built on **EntraID** (formerly Azure Active Directory). Unlike Local WAC, it doesn’t require an Active Directory connection or direct access to the cluster. Instead, it routes connections through Azure, which acts as an intermediary, similar to how **TeamViewer** works. This simplifies remote management by removing the need to open ports manually. Although the Arc-based version represents the future of hybrid cloud management, it's still in preview and can be unstable. The goal is to eventually manage everything via the Azure portal, and Arc-based WAC is a step toward that future, though it's not fully reliable yet.

More details on the Azure-based WAC can be found [here](https://learn.microsoft.com/en-us/windows-server/manage/windows-admin-center/azure/manage-arc-hybrid-machines).

Here is also a small guide on how to install and use the WAC extension in Azure:
- In the Settings > Windows Admin Center (Preview) section. We proceed to install the extension, the port from which arc will be able to contact the cluster will be configured. Important this port is not accessible from the internet (no Port Forwarding is required), this port is only accessible to Azure in a reverse connection. 
![Windows Admin Center Setup 01](/assets/img/post/2024-10-19-azure-stack-hci-demolab-day2/wac01.png){: style="border: 2px solid grey;"}
- After a few seconds you will be able to see how the extension is being installed (This process may take a few minutes and depending on when you perform it, it may be giving certain errors):
![Windows Admin Center Setup 02](/assets/img/post/2024-10-19-azure-stack-hci-demolab-day2/wac02.png){: style="border: 2px solid grey;"}
![Windows Admin Center Setup 03](/assets/img/post/2024-10-19-azure-stack-hci-demolab-day2/wac03.png){: style="border: 2px solid grey;"}
- To access the Windows Admin Center, the following RBAC permission "Windows Admin Center Administrator Login" is required (I usually grant them in the Resource Group of the Azure Stack HCI because I usually require this right in the other resources too):
![Windows Admin Center Setup 04](/assets/img/post/2024-10-19-azure-stack-hci-demolab-day2/wac04.png){: style="border: 2px solid grey;"}

After this process and provided that everything has gone as expected, you will be able to manage the WAC of the cluster through your EntraID user.
I was unable to install the WAC extension (0.37.0.0) during this week because I received the following error:  `RetrieveCertificate: Failed to retrieve certificate from key vault using app service`, even though I have the correct permissions and have successfully completed this process in the past. 

Keep in mind that manual modifications (via Powershell or WAC) should be as minimal as possible, but there are still problems when managing certain VMs which are not present in Azure like ARC Resource Bridge itself, which is why it does not hurt to have an alternative to manage these resources from remote. 

### Monitoring and Alerting with Azure Monitor Insights

Monitoring your Azure Stack HCI cluster is a key part of keeping everything running smoothly. Azure Monitor **Insights** is a feature that helps you do just that by giving you visibility into the health, performance, and usage of your cluster—all within the **Azure portal**. While it’s a powerful tool, keep in mind that **Insights isn’t real-time**. It can take up to 15 minutes to collect data, so there may be a delay between what's happening on your system and when it shows up in the portal.

#### Why Use Insights?

Insights offers several important benefits that make managing your HCI cluster easier:

- **Managed by Azure**: No need to worry about setting up databases or custom software—everything is handled in the Azure portal, so it’s always up to date.
- **Scalability**: Whether you’re monitoring one cluster or hundreds, Insights scales easily across different clusters and locations.
- **Customization**: You can tailor the monitoring views to suit your needs by changing thresholds, tweaking charts, or even adding new metrics to keep an eye on. All these changes can be saved and pinned to your **Azure dashboard** for quick access.

#### How to Enable Insights

Enabling Insights is straightforward:

1. Go to your **Azure Stack HCI cluster page** in the Azure portal.
2. Under the **Monitoring** tab, click on **Insights** and hit **Get Started**.
3. You'll need to set up a **Data Collection Rule (DCR)**, which defines what data gets collected. You can use the default DCR, which is usually enough, or create your own if you want to collect extra data like **Windows Event Logs**.

Here is a step by step guide on how I have configured insight in the cluster:

![Monitoring 01](/assets/img/post/2024-10-19-azure-stack-hci-demolab-day2/mon01.png){: style="border: 2px solid grey;"}
![Monitoring 02](/assets/img/post/2024-10-19-azure-stack-hci-demolab-day2/mon02.png){: style="border: 2px solid grey;"}
![Monitoring 03](/assets/img/post/2024-10-19-azure-stack-hci-demolab-day2/mon03.png){: style="border: 2px solid grey;"}
![Monitoring 04](/assets/img/post/2024-10-19-azure-stack-hci-demolab-day2/mon04.png){: style="border: 2px solid grey;"}
![Monitoring 05](/assets/img/post/2024-10-19-azure-stack-hci-demolab-day2/mon05.png){: style="border: 2px solid grey;"}
![Monitoring 06](/assets/img/post/2024-10-19-azure-stack-hci-demolab-day2/mon06.png){: style="border: 2px solid grey;"}
![Monitoring 07](/assets/img/post/2024-10-19-azure-stack-hci-demolab-day2/mon07.png){: style="border: 2px solid grey;"}

Once you set it up, Insights will begin collecting information about your cluster’s performance. You’ll start seeing data like CPU usage, memory availability, and network activity, but remember it can take up to 15 minutes before data appears.

Since I'm experimenting with the possibility of creating a Workbook that includes more information about the VMs, I have added the following XPaths to the Datacollection Rule created:
- `Microsoft-Windows-Hyper-V-VMMS-Operational!*[System[(EventID=16000 or EventID=16001 or EventID=16010 or EventID=16011 or EventID=16020 or EventID=16021)]]`
   - These Event IDs correspond to VM lifecycle events such as creation, deletion, starting, stopping, and state changes. Collecting these events will provide insights into the current VMs and their statuses.
- `Microsoft-Windows-Hyper-V-Worker-Admin!*[System[(EventID=18500 or EventID=18501 or EventID=18530 or EventID=18531 or EventID=18560 or EventID=18561)]]`
   - These events capture detailed information about the VM operations at the worker level, including health status and operational issues.

![Monitoring 08](/assets/img/post/2024-10-19-azure-stack-hci-demolab-day2/mon08.png){: style="border: 2px solid grey;"}

In the Workbook I will also add the current status of the extensions, because it does not seem to update automatically and it is not listed as “outdated” either:
![Monitoring 09](/assets/img/post/2024-10-19-azure-stack-hci-demolab-day2/mon09.png){: style="border: 2px solid grey;"}

#### What Does It Monitor?

Insights tracks several key metrics to give you a comprehensive view of how your cluster is doing:

- **Memory Availability**: Shows how much memory is available for processes.
- **Network Traffic**: Monitors how much data is being sent and received across your network adapters.
- **CPU Usage**: Tells you how much processor time is being used by your virtual machines and other services.
- **RDMA (Remote Direct Memory Access)**: Tracks data being sent and received over RDMA, which is important for optimizing network performance in HCI.

Insights also collects data from important **Windows Event Logs**, which helps identify issues with hardware, VMs, or storage components in your cluster.

For more information, you can check the official documentation on [Monitoring Azure Stack HCI](https://learn.microsoft.com/en-us/azure-stack/hci/manage/monitor-hci-single-23h2).

### Setting Up Alerts

Azure Stack HCI allows you to set up **alerts** that notify you when something goes wrong, such as high CPU usage or low memory. These alerts can be configured to trigger based on specific conditions, so you’re always aware of critical issues. One of the easiest ways to get started with alerts is by enabling **recommended alert rules**, which are predefined based on common metrics and thresholds.

#### Enabling Recommended Alerts

Recommended alerts are preconfigured to monitor important metrics like **CPU usage**, **available memory**, and **network traffic**. These alerts are based on Azure’s knowledge of important thresholds and common customer use cases. If you haven't set up any alert rules yet, Azure will provide a list of recommended alerts to get you started.

To enable these recommended alerts, follow these steps:

1. Go to your **Azure Stack HCI cluster resource page** in the Azure portal.
2. From the **Monitoring** section on the left pane, select **Alerts** and then click **View + set up**.
3. Review the list of recommended alerts. These will include default values for conditions, such as **CPU usage above 80%** or **memory dropping below 1 GB**.
4. You can adjust the severity of each alert (e.g., from "Informational" to "Error") and modify the thresholds if needed.
5. In the **Notify me by** section, make sure email notifications are enabled and provide your email address.
6. Choose whether to use an existing **action group** to handle alert responses, and toggle the alert rules on.
7. Finally, click **Save** to apply these alert rules to your cluster.

By enabling these rules, you'll be automatically notified when your cluster reaches critical performance levels.

#### Viewing and Managing Alerts

Once the alert rules are set up, you can view and manage them anytime from the **Alerts** section in your Azure Stack HCI resource page. Here, you can edit alert rules to fine-tune thresholds or change how notifications are handled. For example, if you find that an alert triggers too frequently, you can adjust the threshold value or severity level to better suit your needs.

#### Predefined Recommended Alerts for Azure Stack HCI

Here are some of the common recommended alert rules that you can enable for your Azure Stack HCI cluster:

| **Alert Name**             | **Performance Counter**                                          | **Unit**           | **Suggested Threshold**    |
|----------------------------|------------------------------------------------------------------|--------------------|----------------------------|
| Percentage CPU              | Hyper-V Hypervisor Logical Processor\\% Total Run Time           | Percentage         | Greater than 80             |
| Available Memory Bytes      | Memory\\Available Bytes                                          | GB                 | Less than 1 GB              |
| Volume Latency Read         | Cluster CSVFS\\Avg. sec/Read                                     | Milliseconds       | Greater than 500 ms         |
| Volume Latency Write        | Cluster CSVFS\\Avg. sec/Write                                    | Milliseconds       | Greater than 500 ms         |
| Network In Per Second       | Network Adapter\\Bytes Received/sec                              | GigaBytesPerSecond | Greater than 500 GB/sec     |
| Network Out Per Second      | Network Adapter\\Bytes Sent/sec                                  | GigaBytesPerSecond | Greater than 200 GB/sec     |

These alerts provide a good starting point for monitoring the health of your cluster, but you can always customize them based on your specific needs.

For more details on setting up alerts, check out the official guide on [Azure Stack HCI Recommended alert rules](https://learn.microsoft.com/en-us/azure-stack/hci/manage/set-up-recommended-alert-rules).


### Windows Defender Application Control (WDAC)

**Windows Defender Application Control (WDAC)** helps secure your **Azure Stack HCI** environment by controlling which apps and drivers can run. It’s a great tool to reduce security risks, but sometimes managing installations can be tricky—especially when dealing with unsigned or new applications. For example, installing the **Disaster Recovery agent** (currently in preview) can fail due to signature issues, which we'll address in future articles (Backup and Disaster Recovery).

#### WDAC Modes: Audit vs. Enforced

You can run WDAC in two modes:

- **Audit Mode**: Useful for testing. It lets you see what would be blocked without actually preventing apps from running.
- **Enforced Mode**: This is the default mode, where WDAC actively blocks anything not allowed.

Switching between modes can be done via **PowerShell** at cluster level. Here’s how to check and switch modes:

```powershell
Get-AsWdacPolicyMode
Enable-AsWdacPolicy -Mode Audit
Enable-AsWdacPolicy -Mode Enforced
```

In my **test environment**, I switched WDAC to **Audit Mode** to allow future testing, as shown in the image below:

![WDAC switched to Audit Mode](/assets/img/post/2024-10-19-azure-stack-hci-demolab-day2/wdac.png){: style="border: 2px solid grey;"}

For **production environments**, always ensure **Enforced Mode** is enabled for maximum security and in case you need to install any application on the nodes (for example Veeam) make sure that the provider offers you the necessary policies for WDAC.

More information can be found at the following link: [Azure Stack HCI 23H2 Manage WDAC](https://learn.microsoft.com/en-us/azure-stack/hci/manage/manage-wdac)

### BitLocker in Azure Stack HCI

**BitLocker** provides disk-level encryption to secure data at rest on your Azure Stack HCI clusters. It can encrypt both **OS volumes** and **data volumes**, offering an important layer of security for production environments handling sensitive information. 

In Azure Stack HCI version 23H2, you can manage BitLocker either via the **Azure portal** (to view settings) or through **PowerShell** (to enable or disable encryption). For example, you can check the current encryption status using the following PowerShell command:

```powershell
Get-ASBitLocker
```

To enable encryption, you can run:

```powershell
Enable-ASBitLocker -VolumeType <BootVolume | ClusterSharedVolume>
```

Keep in mind that enabling BitLocker on **ClusterSharedVolumes (CSV)** is disruptive, as it pauses VMs temporarily, so plan accordingly.

In our **Demolab**, I've disabled BitLocker to save space on the host (my laptop). This makes sense for testing environments, but in production, it’s recommended to keep BitLocker enabled for added security.

For a more detailed guide on BitLocker, including advanced scenarios like recovery keys and encryption settings, I recommend checking out [Jaromir’s](https://www.linkedin.com/in/jaromir-kaspar-1bb7887/) excellent [Bitlocker deep dive](https://github.com/DellGEOS/AzureStackHOLs/blob/main/lab-guides%2F07-BitlockerDeepDive%2Freadme.md).

### Creating VM Images for Azure Stack HCI

In **Azure Stack HCI**, creating and managing **VM images** is crucial for deploying virtual machines. One of the simplest ways I handle this is by downloading images directly from the **Azure Marketplace**. However, these images come in **VHD format** (not **VHDX**, which is the default for Hyper-V environments), so it's something to keep in mind.

There are three main methods I use to create VM images:

1. **From a Storage Account** (I won’t go into this here, but it’s a great option for automating image management).
2. **From a Local Share** (I'll cover this in the future when I have my VHDX conversion script ready).
3. **From the Azure Marketplace** (this is the process I'll explain now).

#### Creating a VM Image from Azure Marketplace

Here’s how I create a VM image using **Azure Marketplace** images in the **Azure portal**:

1. I navigate to my **Azure Stack HCI cluster resource**.
2. Then I go to **Resources > VM images** and select **+ Add VM Image**.
3. I choose **Add VM Image from Azure Marketplace**.
![VM Image Azure Stack HCI 01](/assets/img/post/2024-10-19-azure-stack-hci-demolab-day2/vmimage01.png){: style="border: 2px solid grey;"}
4. On the **Create an image** page, I fill in the required information:
   - **Subscription** and **Resource Group**.
   - **Custom Location**: This matches the location of my Azure Stack HCI cluster.
   - **Image to download**:I have chosen `Windows Server 2022 Datacenter: Azure Edition` to show all checks in green, but later I will also download `Windows 11 MultiSession + M365 Apps` for the Azure Virtual Desktops PoC.
   - **Storage Path**: I can either let Azure choose this automatically or manually specify a path with enough storage.
![VM Image Azure Stack HCI 02](/assets/img/post/2024-10-19-azure-stack-hci-demolab-day2/vmimage02.png){: style="border: 2px solid grey;"}
5. After clicking **Review + Create**, the image creation starts. Depending on the image size and network speed, it may take some time.
6. Once the image is downloaded, it shows up in the list as **Available**, and I can use it to deploy VMs.

For more details, you can always refer to the [official guide](https://learn.microsoft.com/en-us/azure-stack/hci/manage/virtual-machine-image-azure-marketplace).

#### Future Plans for Custom Images

Later on, I’ll provide a guide on creating custom VM images from **local shares**, especially for those using **VHDX**. I also plan to cover how to update Marketplace images and manage multiple versions efficiently.

For now, using the **Azure Marketplace** is the easiest way for me to get access to the latest, compatible VM images in my Azure Stack HCI environment.

## Conclusion

Now that we've walked through the essential **Day 2 Operations** for Azure Stack HCI, I hope you have a better understanding of how to configure, activate, and optimize the key features of your environment. From showing the operability from **Azure Arc Resource Bridge** and setting up **logical networks** to managing **Windows Admin Center**, **monitoring**, **alerts**, and even **VM images**, these are the building blocks that bring your Azure Stack HCI infrastructure to life.

As you’ve seen, many of the features require manual activation after the initial deployment, and it’s crucial to configure them correctly to ensure your environment is ready for production workloads. Whether you’re deploying **AVD**, **AKS**, or just managing virtual machines, each feature we’ve covered plays a significant role in making sure your system is secure, performant, and scalable.

In my demo lab, I’ve shown how to manage these configurations, but in a real production environment, you'll want to tailor these steps to meet your specific needs—especially when it comes to security features like **WDAC** and **BitLocker**.

Finally, after setting up everything correctly, your environment should look like this, with all services running and **green**:

![Final Setup 01](/assets/img/post/2024-10-19-azure-stack-hci-demolab-day2/final01.png){: style="border: 2px solid grey;"}

![Final Setup 02](/assets/img/post/2024-10-19-azure-stack-hci-demolab-day2/final02.png){: style="border: 2px solid grey;"}

As I create the scripts (VM Images VHDX convertion) and workbooks (for VMs Monitoring) for the **AzSHCI** repository (which you can follow [here](https://github.com/schmittnieto/AzSHCI)), I’ll be updating this article with the new content. Keep an eye out for upcoming articles, where I’ll cover exciting topics such as:

- Deploying and managing **VMs** on Azure Stack HCI directly from Azure
- Setting up and managing **Azure Virtual Desktop (AVD)** on Azure Stack HCI
- Deploying and managing **AKS (Azure Kubernetes Service)** on Azure Stack HCI

Stay tuned for these updates, and don’t hesitate to check the repository for the latest tools and resources!

Thanks for following along, and I look forward to hearing how your **Azure Stack HCI** journey is progressing!


