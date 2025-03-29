---
title: "Azure Stack HCI: Azure Virtual Desktop"
excerpt: "Discover how to deploy Azure Virtual Desktop on Azure Stack HCI, including prerequisites, architecture, deployment steps, and connectivity options."
date: 2024-11-17
last_modified_at: 2024-11-18
categories:
  - Blog
tags:
  - Chronicloud Series
  - Azure Stack HCI
  - Azure Local
  - Azure Virtual Desktop

sticky: false

redirect_from:
  - /blog/azure-stack-hci-azure-virtual-desktop/
  - /blog/azure-local-azure-virtual-desktop/

header:
  teaser: "/assets/img/post/2024-11-17-azure-stack-hci-avd.webp"
  image: "/assets/img/post/2024-11-17-azure-stack-hci-avd.webp"
  og_image: "/assets/img/post/2024-11-17-azure-stack-hci-avd.webp"
  overlay_image: "/assets/img/post/2024-11-17-azure-stack-hci-avd.webp"
  overlay_filter: 0.5
  caption: "Photo credit: [**Flux**](https://flux1.ai/)"

toc: true
toc_label: "Topics Overview" 
toc_icon: "list-ul"

sidebar:
  nav: "Azurelocal"
  
---

## Azure Virtual Desktop on Azure Stack HCI

Welcome back to the [Chronicloud Series](/blog/chronicloud-series/)! Continuing our journey with Azure Stack HCI, today we're diving into deploying **Azure Virtual Desktop (AVD) on Azure Stack HCI**. This article builds upon our previous ones, [Azure Stack HCI DemoLab](/blog/azure-stack-hci-demolab/), [Azure Stack HCI Day 2 Operations](/blog/azure-stack-hci-day2/), and [Azure Stack HCI VM Deployment](/blog/azure-stack-hci-vm-deployment/). If you've followed those, you're all set for what's next!

In this installment, we'll explore how to set up AVD on Azure Stack HCI. While we'll touch on the essentials here, I'm planning a more in-depth series on AVD early next year, where we'll unpack all the concepts and features extensively. Until now, I haven't seen many blogs detailing the technical steps for provisioning AVD on Azure Stack HCI, which inspired me to document the process for you.

So, let's get started!

## Prerequisites, Limitations, and Licenses

Before we dive in, it's important to understand some prerequisites and limitations of the solution as outlined [here](https://learn.microsoft.com/en-us/azure/virtual-desktop/azure-stack-hci-overview#limitations). I've combined them for clarity.

### Active Directory

- **Active Directory Domain Services Required**: Currently, only Active Directory Domain Services (AD DS) can be used to join Session Hosts. This means **Entra ID Only** isn't supported for this solution.
- **Synchronization with Tenant**: It's recommended to use an Active Directory that's synchronized with the Entra ID tenant where your Azure Stack HCI Cluster is registered.
- **Separate Domains Possible**: This doesn't necessarily mean the cluster and AVD have to be in the same AD DS. You can have an isolated AD for the cluster and use your company's usual AD for AVD, as long as they share the same Entra ID tenant.

### License Requirements for AVD

To use AVD on Azure Stack HCI, you'll need the same licenses required for AVD in Azure Public, as detailed [here](https://learn.microsoft.com/en-us/azure/virtual-desktop/licensing#eligible-licenses-to-use-azure-virtual-desktop). 

For AVD on Windows 10/11:

- Microsoft 365 E3, E5, A3, A5, F3, Business Premium, Student Use Benefit
- Windows Enterprise E3, E5
- Windows Education A3, A5
- Windows VDA per user

For Windows Server 2016/2019/2022/2025:

- Remote Desktop Services (RDS) Client Access License (CAL) with Software Assurance (per-user or per-device)
- RDS User Subscription Licenses

Additionally, there's a cost of **$0.01 per virtual core per hour** for each AVD Session Host. This detail is somewhat hidden but can be found [here](https://azure.microsoft.com/en-us/pricing/details/virtual-desktop/) under the "Pricing overview > Azure Virtual Desktop for Azure Stack HCI" section.

### Host Pools

Each host pool must only contain session hosts on Azure or on Azure Stack HCI. You can't mix session hosts on Azure and on Azure Stack HCI in the same host pool.

## Architecture

Let's take a look at the architecture that fits our DemoLab deployment.

### AVD Architecture in DemoLab

![DemoLab Architecture](/assets/img/post/2024-11-17-azure-stack-hci-avd/Architecture.png){: style="border: 2px solid grey;"}

In this architecture you can see on the left side the elements provided in the Host (my Dell XPS 15 9530 Laptop) and on the right side the elements that will be used/configured in Azure. 

- **VMs on the Host (Provisioned via AzSHCI DemoLab)**:
  - **DC**: A Domain Controller (Windows Server 2025) for both Azure Stack HCI and AVD.
  - **CLUSTER**: An Azure Stack HCI Cluster containing two VMs:
    - **VM1**: Synchronizes the domain with Entra ID.
    - **AVD1**: The Session Host, which we'll provision from the Azure Portal.

I did not want to complicate the architecture too much because of the loss of functionality. I do not exclude in the future when I start the AVD saga, to share my complete architecture diagram which is based on the [AVDAcelerator](https://github.com/Azure/avdaccelerator/tree/main/workload/docs/diagrams). 

## Connectivity

One of the advantages of AVD on Azure Stack HCI is the ability to make **direct connections** to Session Hosts. This reduces internet bandwidth usage and places Session Hosts closer to your on-premises applications, minimizing latency issues.

Referring back to the DemoLab architecture, client connectivity is achieved in two ways:

### Client Connection Sequence

*(Based on information from [Microsoft Docs](https://learn.microsoft.com/en-us/azure/virtual-desktop/network-connectivity#client-connection-sequence))*

1. The user subscribes to the Azure Virtual Desktop Workspace using a supported client.
2. Entra ID authenticates the user and returns a token to enumerate available resources.
3. The client passes the token to the Azure Virtual Desktop feed subscription service.
4. The service validates the token.
5. The service returns a list of available desktops and applications in the form of digitally signed connection configurations.
6. The client stores these configurations as a set of `.rdp` files.
7. When a user selects a resource, the client uses the associated `.rdp` file to establish a secure TLS 1.2 connection to an Azure Virtual Desktop gateway via Azure Front Door.
8. The gateway validates the request and asks the broker to orchestrate the connection.
9. The broker identifies the Session Host and uses a persistent communication channel to initiate the connection.
10. The Remote Desktop stack initiates a TLS 1.2 connection to the same gateway instance.
11. Once both client and Session Host are connected to the gateway, it relays data between them, establishing a reverse connect transport for the RDP connection.
12. The client then starts the RDP handshake.

### RDP Shortpath Connection Sequence

*(Based on information from [Microsoft Docs](https://learn.microsoft.com/en-us/azure/virtual-desktop/rdp-shortpath?tabs=managed-networks#connection-sequence))*

1. The Session Host sends its list of IPv4 (e.g., 172.19.19.101) and IPv6 addresses to the client.
2. The client initiates a background thread to establish a parallel UDP-based transport directly to one of the Session Host's IPs.
3. While probing, the client continues establishing the initial connection over the reverse connect transport.
4. If the client has a direct connection, it establishes a secure connection using TLS over reliable UDP.
5. After establishing RDP Shortpath, all Dynamic Virtual Channels (DVCs), including graphics, input, and device redirection, move to the new transport.
6. If direct UDP connectivity isn't possible due to firewall or network topology, the client continues with reverse connect transport.

## Deployment

As mentioned earlier, to proceed with the deployment, you should have:

- Provisioned the cluster ([Azure Stack HCI DemoLab](/blog/azure-stack-hci-demolab/)).
- Created logical networks and downloaded an image for AVD ([Azure Stack HCI Day 2 Operations](/blog/azure-stack-hci-day2)).
- Configured a VM ([Azure Stack HCI VM Deployment](/blog/azure-stack-hci-vm-deployment)) to act as Entra ID Connect to synchronize users for SSO.

### Preparing Active Directory

I am going to ask you to check if the network configuration of the domain controller is correct, because I just realized that in my domain controller the network profile shown was public. 
To avoid this you can perform the following configuration: 
- From a terminal as administrator run the following command: `sc config nlasvc depend=NSI/RpcSs/TcpIp/Dhcp/Eventlog/DNS/NTDS`
- Change the DNS settings of the network card to the local ip of the DC. 

Then, we'll create a new Organizational Unit (OU) specifically for AVD, where we'll include both users and Session Hosts.

- **Creating the OU**:
![Creating AVD OU](/assets/img/post/2024-11-17-azure-stack-hci-avd/OU.png){: style="border: 2px solid grey;"}

Next, we'll configure a new UPN Suffix that matches the domain in your Entra ID tenant.

- **Configuring UPN Suffix**:
  -  Go to Active Directory Domains and Trust and right-click to open the properties panel:
![Configuring UPN Suffix](/assets/img/post/2024-11-17-azure-stack-hci-avd/suffix01.png){: style="border: 2px solid grey;"}
  -  Enter the Suffix that is present in your EntraID domain:
![Configuring UPN Suffix](/assets/img/post/2024-11-17-azure-stack-hci-avd/suffix02.png){: style="border: 2px solid grey;"}

Finally, we'll create the user to login in AVD with the right Suffix (e.g., `avdhci@yourentraiddomain.com`).

![Configuring UPN Suffix](/assets/img/post/2024-11-17-azure-stack-hci-avd/ADUser01.png){: style="border: 2px solid grey;"}

### Configuring Entra ID Connect

To ensure seamless AVD functionality, the Active Directory user and the Entra ID user must be the same. We'll set up Entra ID Connect on our Windows Server 2022 VM.
- **Disclaimer**: I make use of a Demo tenant, which currently has another EntraID Connect synchronizing (with another AD Forest) but there is no problem because I am only going to synchronize one user and one Session Host from the azurestack.local domain, and these are not present in the other forests.

- **Installing Entra ID Connect**:

  - **Step 1**: Download and install Entra ID Connect from [here](https://www.microsoft.com/en-ie/download/details.aspx?id=47594&msockid=379bacaaa24e6e7217b1b85fa3316fbe).
  - **Configuration Steps**:
![Entra ID Connect Config 1](/assets/img/post/2024-11-17-azure-stack-hci-avd/aad01.png){: style="border: 2px solid grey;"}
![Entra ID Connect Config 2](/assets/img/post/2024-11-17-azure-stack-hci-avd/aad02.png){: style="border: 2px solid grey;"}
![Entra ID Connect Config 3](/assets/img/post/2024-11-17-azure-stack-hci-avd/aad03.png){: style="border: 2px solid grey;"}
![Entra ID Connect Config 4](/assets/img/post/2024-11-17-azure-stack-hci-avd/aad04.png){: style="border: 2px solid grey;"}
![Entra ID Connect Config 5](/assets/img/post/2024-11-17-azure-stack-hci-avd/aad05.png){: style="border: 2px solid grey;"}
![Entra ID Connect Config 6](/assets/img/post/2024-11-17-azure-stack-hci-avd/aad06.png){: style="border: 2px solid grey;"}
![Entra ID Connect Config 7](/assets/img/post/2024-11-17-azure-stack-hci-avd/aad07.png){: style="border: 2px solid grey;"}
![Entra ID Connect Config 8](/assets/img/post/2024-11-17-azure-stack-hci-avd/aad08.png){: style="border: 2px solid grey;"}
![Entra ID Connect Config 9](/assets/img/post/2024-11-17-azure-stack-hci-avd/aad09.png){: style="border: 2px solid grey;"}
![Entra ID Connect Config 10](/assets/img/post/2024-11-17-azure-stack-hci-avd/aad10.png){: style="border: 2px solid grey;"}
![Entra ID Connect Config 11](/assets/img/post/2024-11-17-azure-stack-hci-avd/aad11.png){: style="border: 2px solid grey;"}
![Entra ID Connect Config 12](/assets/img/post/2024-11-17-azure-stack-hci-avd/aad12.png){: style="border: 2px solid grey;"}
![Entra ID Connect Config 13](/assets/img/post/2024-11-17-azure-stack-hci-avd/aad13.png){: style="border: 2px solid grey;"}
![Entra ID Connect Config 14](/assets/img/post/2024-11-17-azure-stack-hci-avd/aad14.png){: style="border: 2px solid grey;"}
![Entra ID Connect Config 15](/assets/img/post/2024-11-17-azure-stack-hci-avd/aad15.png){: style="border: 2px solid grey;"}
 
  - **We will now proceed to configure the Hybrid Microsoft Entra ID Join**
![Entra ID Connect Config 16](/assets/img/post/2024-11-17-azure-stack-hci-avd/aad16.png){: style="border: 2px solid grey;"}
![Entra ID Connect Config 17](/assets/img/post/2024-11-17-azure-stack-hci-avd/aad17.png){: style="border: 2px solid grey;"}
![Entra ID Connect Config 18](/assets/img/post/2024-11-17-azure-stack-hci-avd/aad18.png){: style="border: 2px solid grey;"}    
![Entra ID Connect Config 19](/assets/img/post/2024-11-17-azure-stack-hci-avd/aad19.png){: style="border: 2px solid grey;"}  
![Entra ID Connect Config 20](/assets/img/post/2024-11-17-azure-stack-hci-avd/aad20.png){: style="border: 2px solid grey;"}  
![Entra ID Connect Config 21](/assets/img/post/2024-11-17-azure-stack-hci-avd/aad21.png){: style="border: 2px solid grey;"}  

- **Verifying User Synchronization**:
  - After setup, confirm that the user is synchronized. Cheking the user in EntraID:
![Synchronized User](/assets/img/post/2024-11-17-azure-stack-hci-avd/aaduser.png){: style="border: 2px solid grey;"}  

- **Assigning Licenses**:
  - Assign the necessary license to the user. While you might get by without one for testing, it's like driving without insurance ,  not advisable 😜

### Deploying AVD on Azure Stack HCI via Azure Portal

To keep things straightforward, we'll use the Azure Portal wizard for deployment.

- **Deployment Steps**:
![AVD Deployment 1](/assets/img/post/2024-11-17-azure-stack-hci-avd/avd01.png){: style="border: 2px solid grey;"}
![AVD Deployment 2](/assets/img/post/2024-11-17-azure-stack-hci-avd/avd02.png){: style="border: 2px solid grey;"}
![AVD Deployment 3](/assets/img/post/2024-11-17-azure-stack-hci-avd/avd03.png){: style="border: 2px solid grey;"}
![AVD Deployment 4](/assets/img/post/2024-11-17-azure-stack-hci-avd/avd04.png){: style="border: 2px solid grey;"}
![AVD Deployment 5](/assets/img/post/2024-11-17-azure-stack-hci-avd/avd05.png){: style="border: 2px solid grey;"}
![AVD Deployment 6](/assets/img/post/2024-11-17-azure-stack-hci-avd/avd06.png){: style="border: 2px solid grey;"}
![AVD Deployment 7](/assets/img/post/2024-11-17-azure-stack-hci-avd/avd07.png){: style="border: 2px solid grey;"}
- After approximately 15 minutes the Session Host will have been provisioned and will be accessible, but to access it with the user we configured we must assign the DAG (Desktop Application Group):
![AVD Deployment 8](/assets/img/post/2024-11-17-azure-stack-hci-avd/avd08.png){: style="border: 2px solid grey;"}
- Even though the Session Host shows errors related to Domain Trust, you can safely ignore them. They're likely due to the fact that I'm using an Active Directory on Windows Server 2025, which has repeatedly lost its network profile.
![AVD Deployment 11](/assets/img/post/2024-11-17-azure-stack-hci-avd/avd11.png){: style="border: 2px solid grey;"}


## Connecting to AVD

There are several ways to connect to AVD; I'll highlight two.

### Connection via Web Browser

This is the easiest access method, but keep in mind that all traffic will be encapsulated by the Gateway, potentially making the connection less efficient.

- **Accessing via Browser**:
  - Go to [Azure Virtual Desktop Web Client](https://client.wvd.microsoft.com/arm/webclient/).
  - After logging in, everything should work as expected.
![AVD Web Client](/assets/img/post/2024-11-17-azure-stack-hci-avd/avd15.png){: style="border: 2px solid grey;"}

### Connection via the AVD Client

Currently, there are two clients:

- **Remote Desktop App**:
  - The classic client, downloadable [here](https://learn.microsoft.com/en-us/azure/virtual-desktop/users/connect-remote-desktop-client?tabs=windows#download-and-install-the-remote-desktop-client-for-windows-msi).

- **Windows App**:
  - The newer, more polished client (my personal favorite), available [here](https://learn.microsoft.com/en-us/windows-app/whats-new?tabs=windows#latest-release).

After downloading and logging in with the appropriate user, you'll see the Session Host as configured.

- **Connectivity Test**
![AVD Deployment 9](/assets/img/post/2024-11-17-azure-stack-hci-avd/avd09.png){: style="border: 2px solid grey;"}
- But when checking the status of the connection, you can see that it is using WebSocket, i.e. it is not using RDP Shortpath:
![AVD Deployment 10](/assets/img/post/2024-11-17-azure-stack-hci-avd/avd10.png){: style="border: 2px solid grey;"}

## Configuring RDP Shortpath
In order for RDP Shortpath to function as desired, several modifications must be made:
  - We will download and configure the GPOs on the domain controller as shown in this guide ([RDP Shortpath GPO guide](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-rdp-shortpath?tabs=group-policy%2Cportal%2Cconnection-information#enable-the-rdp-shortpath-listener-for-rdp-shortpath-for-managed-networks)).  
  - The direct download of the GPOs can be done from [here](https://aka.ms/avdgpo)
  - After assigning them as shown in the following image, the firewall must be opened with port 3390 UDP inbound on the Session Host. 
![RDP Shortpath 1](/assets/img/post/2024-11-17-azure-stack-hci-avd/rdpsp01.png){: style="border: 2px solid grey;"}
  - Once the firewall and GPO have been configured (and the Session Host has been restarted), you can “force” the use of RDP Shortpath through the Hostpool network settings, although the default setting is Enabled.
![RDP Shortpath 2](/assets/img/post/2024-11-17-azure-stack-hci-avd/rdpsp02.png){: style="border: 2px solid grey;"}
  - When all the modifications have finally been carried out, you can see the considerable improvement in the connection:
![RDP Shortpath 3](/assets/img/post/2024-11-17-azure-stack-hci-avd/rdpsp03.png){: style="border: 2px solid grey;"}

This concludes our review of RDP Shortpath and the advantages it provides. 
An interesting comment from microsoft that goes unnoticed is that it is not recommended to use RDP Sortpath via TCP VPNs because it congests the TCP ([link to the warning](https://learn.microsoft.com/en-us/azure/virtual-desktop/rdp-shortpath?tabs=managed-networks#how-rdp-shortpath-works)).

If you're using other VPN types to connect to Azure, we recommend using a UDP-based VPN. While most TCP-based VPN solutions support nested UDP, they add inherited overhead of TCP congestion control, which slows down RDP performance.
{: .notice--info}

## Conclusion

Due to time constraints, I haven't gone into as much depth as I might have liked, otherwise, this article would be excessively long!

There are many topics, like **FSLogix** for profile management and **Multimedia Redirection**, that I haven't touched on but plan to expand upon in future articles when we delve deeper into AVD next year.

I also haven't discussed third-party tools like **Hydra** or **Nerdio**, which significantly simplify and efficiently manage Golden Image versioning (something I didn't cover here). I promise to thoroughly analyze each of these tools in future installments of the AVD series.

Because of the technical limitations of my DemoLab, I couldn't demonstrate the solution's fault tolerance. However, I can tell you that there is some downtime if a cluster node fails, and depending on your configuration, the default ResiliencyDefaultPeriod is 240 seconds (4 minutes).

All that said, I believe this article is both informative and comprehensive. If you need help with any of the points or topics discussed, feel free to reach out through the usual channels, LinkedIn, BlueSky, or right here on the blog.

Thank you all for your time, and happy computing!
