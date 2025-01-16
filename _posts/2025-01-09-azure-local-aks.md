---
title: "Azure Local: AKS and SQL Managed instances" 
excerpt: "Discover how to deploy AKS and SQL Managed instances on Azure Local, including prerequisites, architecture, deployment steps and connectivity." 
date: 2025-01-09
categories:
  - Blog
tags:
  - Chronicloud Series
  - Azure Stack HCI
  - Azure Local
  - AKS

redirect_from:
  - /blog/azure-stack-hci-aks/
  - /blog/azure-local-aks/

header:
  teaser: "/assets/img/post/2025-01-09-azure-local-aks.webp"
  image: "/assets/img/post/2025-01-09-azure-local-aks.webp"
  og_image: "/assets/img/post/2025-01-09-azure-local-aks.webp"
  overlay_image: "/assets/img/post/2025-01-09-azure-local-aks.webp"
  overlay_filter: 0.5
  caption: "Photo credit: [**ChatGPT**](https://chatgpt.com)"

toc: true
toc_label: "Topics Overview" 
toc_icon: "list-ul"
---

## Introduction

Welcome back to another article in the Chronicloud Series. This time, we're shifting our focus from Azure Stack HCI to Azure Local 😜. As many of you may already know (and if not, now you do), the Azure Stack family has been rebranded to Azure Local. You can read more about this renaming in the following article: [New name for Azure Stack HCI](https://learn.microsoft.com/en-us/azure/azure-local/rename-to-azure-local).

Now, focusing on today's topic, due to the limited literature available, I want to explore the possibilities of implementing AKS (Azure Kubernetes Service) on Azure Local and highlight how it differs from implementations on Azure Public or Windows Server. I will discuss the creation and deployment process of AKS, and the advantages of implementing it on Azure Local compared to other options. Finally, I'll share insights on a service I've implemented multiple times in client infrastructures, which is gaining popularity over time: SQL Managed Instances. This PaaS offering provides the capability to utilize SQL at a competitive price while reducing the complexity of its management and deployment.

The article will be divided into the following sections:

- Brief Introduction to AKS: Possibilities and Differences.
- Use Cases and Benefits of AKS on Azure Local.
- Technical Architecture of the Solution (AKS on Azure Local).
- Deployment on Legacy Versions and Windows Server.
- Deployment on Azure Local.
- Installation of Arc Data Services and SQL Managed Instances.
- Conclusion and Recommendations.

## Brief Introduction to AKS: Possibilities and Differences

Kubernetes is an open-source platform designed to automate the deployment, scaling, and operation of containerized applications. Azure Kubernetes Service (AKS) is Microsoft's managed Kubernetes offering, simplifying the process of running Kubernetes by handling critical tasks like health monitoring and maintenance.

For those seeking foundational knowledge in AKS, John Savill's tutorials are highly recommended:

<iframe width="560" height="315" src="https://www.youtube.com/embed/c4nTKMU6fBU?si=ni19mYGZqOnDm_l-" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

AKS is available in several deployment models, each catering to specific use cases:

1. **AKS on Azure Public Cloud**:
   - **Use Cases**:
     - Ideal for applications requiring high scalability and global availability.
     - Suitable for organizations aiming to reduce on-premises infrastructure management.
   - **Cost Considerations**:
     - AKS itself is free; however, users pay for the underlying compute, storage, and networking resources.
     - Costs can vary widely based on resource consumption, typically ranging from a few hundred to several thousand dollars per month, depending on the scale and configuration.

2. **AKS on Windows Server (or Azure Stack HCI 22H2)**:
   - **Use Cases**:
     - Suitable for organizations with existing Windows Server infrastructure seeking to modernize applications using containers.
     - Ideal for scenarios requiring on-premises data processing due to latency or compliance needs.
   - **Cost Considerations**:
     - Requires licensing for Windows Server or Azure Stack HCI.
     - Additional costs include Azure Arc-enabled Kubernetes charges, approximately $0.80 per virtual core per day, after a 60-day free evaluation period. [Learn more](https://azure.microsoft.com/en-us/pricing/details/azure-stack/aks-hci/)

3. **AKS on Azure Local (Post-2402 Releases)**:
   - **Use Cases**:
     - Designed for edge locations, hybrid workloads or disconnected environments where Azure services need to run locally.
     - Suitable for industries like retail or manufacturing with specific compliance or latency requirements.
   - **Cost Considerations**:
     - Included in Azure Local Pricing, effective from January 2025.
![Meme AKS on Azure Local Pikachu](/assets/img/post/2025-01-09-azure-local-aks/meme-pikachu-aks.png){: style="border: 2px solid grey;"}

Regarding networking models, AKS offers different configurations across these platforms:

- **AKS on Azure Public Cloud**:
  - **Networking Models**:
    - **Kubenet**: A basic networking option suitable for smaller clusters, where each node receives an IP from the Azure Virtual Network subnet, and pods receive NATted IP addresses.
    - **Azure CNI (Container Networking Interface)**: Provides each pod with an IP address from the Azure Virtual Network subnet, facilitating direct communication with other resources in the virtual network.

- **AKS on Windows Server and Azure Stack HCI**:
  - **Networking Provisioning**:
    - Network infrastructure is provisioned using PowerShell scripts or through Windows Admin Center, allowing administrators to set up and manage networking components tailored to their environment. [Learn more](https://learn.microsoft.com/en-us/azure/aks/aksarc/overview)
    - These deployments utilize the organization's local network infrastructure, ensuring integration with existing on-premises resources and compliance with internal networking policies.

- **AKS on Azure Local**:
  - **Networking Considerations**:
    - Similar to AKS on Windows Server, with network provisioning managed through Azure Arc Resource Bridge, which facilitates connectivity between on-premises environments and Azure services, enabling hybrid capabilities. [Learn more](https://learn.microsoft.com/en-us/azure/aks/aksarc/aks-hci-network-system-requirements)
    - This setup also leverages the local network infrastructure, ensuring seamless integration with existing systems and adherence to organizational networking standards.

Having understood the various AKS deployment models, we will now delve deeper into AKS on Azure Local, analyzing its advantages and disadvantages to provide a comprehensive understanding of its suitability for different scenarios.

## Use Cases and Benefits of AKS on Azure Local

Azure Kubernetes Service (AKS) on Azure Local offers a robust platform for deploying and managing containerized applications in on-premises environments. This setup is particularly advantageous for scenarios requiring low-latency access to local data, integration with Azure Arc-enabled services, and the need to meet specific compliance or operational requirements.

### Use Cases

1. **Low-Latency Data Access**:
   - **Scenario**: Applications that demand real-time processing and swift data retrieval, such as financial trading platforms or industrial automation systems.
   - **Advantage**: Deploying AKS on Azure Local ensures that data remains on-premises, significantly reducing latency compared to cloud-based solutions.

2. **Data Residency and Compliance**:
   - **Scenario**: Industries like healthcare and finance, where data sovereignty and compliance with local regulations are critical.
   - **Advantage**: AKS on Azure Local allows organizations to keep sensitive data within their own data centers, ensuring compliance with regulatory standards.

3. **Integration with Azure Arc-enabled Data Services**:
   - **Scenario**: Organizations seeking to modernize their data infrastructure by leveraging managed services such as Azure Arc-enabled SQL Managed Instance and Azure Arc-enabled PostgreSQL.
   - **Advantage**: These services provide cloud-like capabilities, including automated updates and scalability, while data remains on-premises. Notably, Azure Arc-enabled SQL Managed Instance is now generally available, and Azure Arc-enabled PostgreSQL is available in preview.

4. **Hybrid Machine Learning Deployments**:
   - **Scenario**: Enterprises aiming to deploy machine learning models close to their data sources for training and inference, enhancing performance and data security.
   - **Advantage**: With Azure Arc-enabled Machine Learning, organizations can run Azure Machine Learning workloads on AKS clusters deployed on Azure Local, facilitating seamless integration between on-premises data and cloud-based machine learning services.

### Benefits

- **Cost Efficiency**:
  - As of January 2025, AKS enabled by Azure Arc is available at no extra charge on Azure Local with the 2402 release and later, reducing the total cost of ownership for on-premises Kubernetes deployments.

- **Unified Management**:
  - Azure Arc provides a consistent management layer across on-premises and cloud environments, simplifying operations and governance.

- **Scalability and Flexibility**:
  - AKS on Azure Local enables organizations to scale their applications seamlessly while maintaining control over their infrastructure.

- **Enhanced Security**:
  - By keeping data on-premises, organizations can implement stringent security measures tailored to their specific needs, reducing exposure to potential threats.

Implementing AKS on Azure Local empowers organizations to leverage the benefits of Kubernetes and Azure services while addressing specific operational requirements related to data locality, compliance, and performance.

## Technical Architecture of the Solution (AKS on Azure Local)

Let's delve into the technical architecture of Azure Kubernetes Service (AKS) on Azure Local. Understanding these components will provide you with a clearer picture of how to effectively deploy and manage your containerized applications within your own data center.
![Diagramm Azure Local by Azure Arc Jumpstart](/assets/img/post/2025-01-09-azure-local-aks/Diagramm01.png){: style="border: 2px solid grey;"}
*Diagram courtesy of [Azure Arc Jumpstart](https://azurearcjumpstart.com/).*
![Diagramm AKS on Azure Local by Microsoft Learn](/assets/img/post/2025-01-09-azure-local-aks/Diagramm02.png){: style="border: 2px solid grey;"}
*Diagram courtesy of [Microsoft Learn](https://learn.microsoft.com/en-us/azure/aks/aksarc/cluster-architecture).*

### Core Components

1. **Arc Resource Bridge**:
   - **Function**: This serves as the primary link between your on-premises environment and Azure, enabling the deployment and management of AKS clusters.
   - **Components**:
     - **AKS Arc Cluster Extensions**: These act as on-premises equivalents of Azure Resource Manager resource providers, facilitating the management of Kubernetes clusters via Azure.
     - **Custom Locations**: These represent your on-premises data centers within Azure, allowing them to be target locations for deploying Azure services.

2. **AKS Clusters**:
   - **Control Plane Nodes**:
     - **Function**: They maintain the desired state of the Kubernetes cluster and manage worker node pools.
     - **Components**:
       - **API Server**: Facilitates interactions with the Kubernetes API for management tools like Azure CLI, Azure Portal, or kubectl.
       - **etcd**: A distributed key-value store that holds the cluster's configuration and state data.
   - **Node Pools**:
     - **Function**: Groups of nodes with identical configurations designated for running containerized applications.
     - **Types**:
       - **Linux Node Pools**: Host Linux-based containers.
       - **Windows Node Pools**: Host Windows-based containers.

### Additional Architectural Considerations

- **Mixed-OS Deployments**:
  - AKS on Azure Local supports clusters with both Linux and Windows worker nodes, enabling the deployment of heterogeneous workloads. Kubernetes ensures that workloads are scheduled onto compatible nodes using mechanisms such as Node Selectors and Taints and Tolerations.

- **Lifecycle Management**:
  - Azure Arc integration allows for unified management of on-premises Kubernetes clusters using familiar Azure tools, including the Azure Portal, Azure CLI, and Azure Resource Manager templates. This integration streamlines operations such as provisioning, scaling, and updating clusters.

- **Cloud-Based Updates for Infrastructure Components**:
  - With Azure Local version 23H2, infrastructure components, including the operating system, software agents, Azure Arc infrastructure, and OEM drivers, receive unified monthly update packages. These updates are managed through the Azure Update Manager, ensuring that the on-premises environment remains current with the latest features and security enhancements.

- **Networking Architecture**:
  - AKS on Azure Local utilizes static logical networks to assign IP addresses to the underlying virtual machines of the AKS clusters. Administrators must create Arc VM logical networks post-installation to ensure proper network configuration and connectivity. 

- **High Availability and Resilience**:
  - The architecture is designed to distribute virtual machine data across multiple Cluster Shared Volumes (CSVs) by default, enhancing reliability and ensuring application continuity during potential CSV outages.

This comprehensive architecture enables you to leverage AKS on Azure Local effectively, providing a robust platform for deploying and managing containerized applications within your on-premises environment while maintaining seamless integration with Azure services.


## Deployment on Legacy Versions and Windows Server

Deploying Azure Kubernetes Service (AKS) on Windows Server or Azure Stack HCI 22H2 presents a distinct set of procedures and considerations compared to Azure Local. Drawing from my hands-on experience, here's what you need to know:

### Deployment Process

- **Installation Methods**:
  - **PowerShell**: You can set up AKS using PowerShell commands, which offers a scriptable approach for automation. 
  - **Windows Admin Center (WAC)**: Alternatively, WAC provides a graphical interface for deployment, which some may find more intuitive. 

- **Azure Arc Integration**:
  - Unlike Azure Local, these environments lack the Azure Arc Resource Bridge.
  - As a result, registering the AKS cluster with Azure Arc must be done post-deployment.
  - This limitation means you won't have the capability to adjust the number of cluster nodes directly through the Azure portal.
  - However, once connected to Azure Arc, you can deploy applications via GitOps or the Azure portal.

### Architectural Differences

- **Management Cluster**:
  - A separate management cluster is required to oversee the AKS deployment.

- **Load Balancers**:
  - Virtual machines are utilized to handle load balancing duties.
  - In contrast, Azure Local employs control planes with integrated load balancing, often using MetalLB.

- **Cluster Modifications**:
  - Any changes to the number or size of control planes or load balancers must be executed via PowerShell commands.

### Notable Limitations and Considerations

- **Stretched Clusters**:
  - Configurations with stretched clusters aren't supported in these environments. 

- **Data Distribution Across Cluster Shared Volumes (CSVs)**:
  - By default, workloads are distributed across CSVs using a round-robin method to enhance resilience. 
  - If desired, this automatic distribution can be disabled during setup. 

- **Azure Registration Regions**:
  - Currently, registration is limited to four regions: Australia East, East US, Southeast Asia, and West Europe.
  - This limitation pertains solely to metadata storage and doesn't impact service performance. 

- **IP Address Requirements**:
  - **AKS Host (Management Cluster)**:
    - Control Plane Node: 1 IP
    - Update Operations: 2 IPs
  - **Workload Cluster**:
    - Control Plane: 1 IP per node
    - Worker Node: 1 IP per node
    - Update Operations: 5 IPs
    - Load Balancer: 1 IP
  - **Cluster API Server**:
    - 1 IP per cluster
  - **Kubernetes Services**:
    - 1 IP per service

![Diagramm AKS on Azure Stack HCI 22H2](/assets/img/post/2025-01-09-azure-local-aks/diagramm03.svg){: style="border: 2px solid grey;"}

- **Networking Complexity**:
  - The networking setup can be intricate, especially when segregating the HCI cluster, management AKS cluster, and workload clusters.
  - Introducing multiple VLANs and proxy configurations can further complicate the setup. 

- **Proxy Server Support**:
  - Recent updates have introduced support for proxies with authentication, addressing a previous limitation. 

### Practical Resources

To assist with common operational tasks, I've compiled a GitHub repository featuring scripts for:

- Modifying NodePools
- Creating new Worker Clusters
- Generating Service Principal Tokens for Azure portal access

You can explore these resources here: [AKS Hybrid Scripts](https://github.com/schmittnieto/AKSHybrid/tree/main/Script/22H2)

Deploying AKS on Windows Server or Azure Stack HCI 22H2 requires careful planning and an understanding of these nuances to ensure a successful implementation.

## Deployment on Azure Local

The deployment process of AKS on Azure Local has been simplified to the bare minimum, making it significantly easier compared to previous versions like Azure Stack HCI or Windows Server. However, there are some key details worth noting as we go along. For instance, the load balancer, which used to be a separate VM in Azure Stack HCI (scaling only in odd numbers like 1/3/5 and with size limitations), is now handled by MetalLB within the control plane VM. This approach is not only more efficient but also requires fewer parameters, and the best part—you can manage it directly from the Azure Portal 😊.

### Getting Started

Since my main goal is to demonstrate a straightforward deployment of AKS on Azure Local and later test an application, let’s start with the prerequisites:

1. **Microsoft Entra ID Group**:
   To connect to the cluster from anywhere, you need to create a Microsoft Entra group and add yourself and other administrators as members. This group will grant cluster administrator access to the AKS Arc cluster. 
   - Skipping this step is possible by using a service barrier token, but to keep things simple, we’ll stick with the Entra group. (By the way, for those interested, there’s a script in my [GitHub repository](https://github.com/schmittnieto/AKSHybrid/tree/main/Script/23H2) to generate service barrier tokens for version 23H2).

2. **Logical Network**:
   If you followed my [Day 2 Operations guide](https://schmitt-nieto.com/blog/azure-stack-hci-day2/), you should already have a logical network set up. If not, you’ll need to define one with enough capacity for provisioning the AKS nodes and control plane. Remember, the control plane IP is provisioned **outside** the IP pool range.

3. **Hardware Resources**:
   As many of you already know, I run my setups on a laptop that barely has enough resources to keep things afloat. In my [Azure Local Lab](https://schmitt-nieto.com/blog/azure-stack-hci-demolab/), I’m sticking to a small cluster configuration:
   - **Node Pool**: 4 vCPUs and 8 GB of RAM (for one node 😑).
   - **Control Plane**: 2 vCPUs and 8 GB of RAM (also just one node 😑).
   If you’ve got more horsepower than my humble setup, feel free to expand your cluster configuration.

Tests with larger sizes have reported problems to me:
![AKS RAM Lack](/assets/img/post/2025-01-09-azure-local-aks/LowRam.png){: style="border: 2px solid grey;"}

### Deployment Process

There are several ways to deploy AKS on Azure Local—via Bicep, ARM templates, Azure CLI, or the Azure Portal. For this guide, I’ll stick with the Azure Portal since it’s the most straightforward and visually intuitive option.

1. **Create a Logical Network (if not already done)**:
   - Go to the Azure Portal and define a logical network with the necessary IP range.
![Creating logical network](/assets/img/post/2025-01-09-azure-local-aks/01.png){: style="border: 2px solid grey;"}
![logical network configuration](/assets/img/post/2025-01-09-azure-local-aks/02.png){: style="border: 2px solid grey;"}

2. **Use the Wizard to Create an AKS Cluster**:
   - Navigate to the Azure Local AKS wizard and provide the required parameters.
![Creating AKS on Azure local](/assets/img/post/2025-01-09-azure-local-aks/03.png){: style="border: 2px solid grey;"}

3. **Cluster Configuration**:
   - **Kubernetes Cluster Name**: Assign a meaningful name.
   - **Custom Location**: Select the predefined custom location.
   - **Kubernetes Version**: There are currently six versions available; I chose the default (1.28.9).
![AKS Cluster details](/assets/img/post/2025-01-09-azure-local-aks/04.png){: style="border: 2px solid grey;"}

4. **Primary Node Pool**:
   - Configure the node pool where applications will run:
     - **Node Count**: 1
     - **vCPUs**: 4
     - **Memory**: 16 GB
![Primary Node Pool](/assets/img/post/2025-01-09-azure-local-aks/05.png){: style="border: 2px solid grey;"}

5. **Control Plane**:
   - Assign resources to the control plane:
     - **vCPUs**: 2
     - **Memory**: 8 GB
![Control Plane](/assets/img/post/2025-01-09-azure-local-aks/06.png){: style="border: 2px solid grey;"}

6. **Access Configuration**:
   - Link the Entra ID group defined earlier to manage cluster access.
![AKS Access EntraID](/assets/img/post/2025-01-09-azure-local-aks/07.png){: style="border: 2px solid grey;"}

7. **Network Configuration**:
   - Ensure your logical network is selected, and verify that the control plane IP is outside the IP pool range.
   - If the IPs overlap, you’ll receive a validation error during setup.
   - We'll delve deeper into networking configurations shortly.
![AKS Network Configuration](/assets/img/post/2025-01-09-azure-local-aks/08.png){: style="border: 2px solid grey;"}

8. **Monitoring Setup**:
   - Enable monitoring options as per your requirements.
![AKS Monitoring 01](/assets/img/post/2025-01-09-azure-local-aks/09.png){: style="border: 2px solid grey;"}
![AKS Monitoring 02](/assets/img/post/2025-01-09-azure-local-aks/10.png){: style="border: 2px solid grey;"}

9. **Deployment**:
   - Once everything is configured, review the settings and hit **Deploy**.
![AKS Deployment](/assets/img/post/2025-01-09-azure-local-aks/11.png){: style="border: 2px solid grey;"}

By following these steps, you’ll have your AKS cluster up and running on Azure Local. 
![AKS Deployment Completed](/assets/img/post/2025-01-09-azure-local-aks/12.png){: style="border: 2px solid grey;"}

In the next sections, we’ll explore load balancing, application testing, and other advanced configurations. For now, let’s celebrate the simplicity of this deployment process!

## Networking Configuration for AKS on Azure Local

An AKS cluster without proper network configuration is of limited use, as it won't be able to expose services to your local network. To address this, we'll activate the networking extension in the following steps:

1. **Activate the Networking Extension**: Navigate to the Azure portal and enable the networking extension for your AKS cluster.

![AKS Networking Activation](/assets/img/post/2025-01-09-azure-local-aks/13.png){: style="border: 2px solid grey;"}

![AKS Networking Extension](/assets/img/post/2025-01-09-azure-local-aks/14.png){: style="border: 2px solid grey;"}

  *Note*: Ensure that the resource provider **Microsoft.HybridConnectivity** is registered in your Azure subscription. This step is crucial; attempting to activate the extension without this provider will result in an error.

2. **Configure External IP Addresses**: After activating the extension, go to the 'Networking' tab in your AKS cluster settings. Here, you can add external IP addresses that your applications will use upon deployment.

![AKS Creating Load Balancer - Step 1](/assets/img/post/2025-01-09-azure-local-aks/15.png){: style="border: 2px solid grey;"}

![AKS Creating Load Balancer - Step 2](/assets/img/post/2025-01-09-azure-local-aks/16.png){: style="border: 2px solid grey;"}

   In the example above, I've selected an IP range (172.19.19.120-172.19.19.124) for the Load Balancer to utilize. The accepted notation format is indicated in the information box.

   You also have the option to specify a service selector, allowing the IP range to be used exclusively by applications matching that selector.

   Additionally, configuring the Load Balancer to use BGP (Border Gateway Protocol) is possible. However, for this test workload, I'll opt for the simpler ARP (Address Resolution Protocol) method.

By completing these steps, your AKS cluster will be properly configured to expose services to your local network, paving the way for successful application deployment.

## Application Deployment

Whenever I’ve set up AKS (especially in Azure Stack PoCs) with clients, the first question I always get is: *What can we do with AKS?* My go-to answer has been, *if you consider that SQL Managed Instances run on AKS via Arc Data Controllers, the possibilities are virtually endless*. However, given the limited resources on my trusty laptop (Arc Data Controllers require at least 32 GB of memory to run smoothly), I can’t show you this particular workload today. Instead, I’ll walk you through the other demos I typically showcase.

### The Dog and Cat Counter Application

Yes, you heard that right. There’s a simple way to deploy a quick demonstration application, and it’s a crowd-pleaser. Here’s how you can get it running in no time:

1. Go to the **Namespaces** tab in your AKS cluster and click **+Add**.
![AKS Deploy App 1](/assets/img/post/2025-01-09-azure-local-aks/17.png){: style="border: 2px solid grey;"}
2. Select **Deploy a quickstart application to get up and running**.
![AKS Deploy App 2](/assets/img/post/2025-01-09-azure-local-aks/18.png){: style="border: 2px solid grey;"}
3. Choose **Create a basic web application**.
![AKS Deploy App 3](/assets/img/post/2025-01-09-azure-local-aks/19.png){: style="border: 2px solid grey;"}
4. Follow the tutorial by clicking **Next** on the three prompts.
![AKS Deploy App 4](/assets/img/post/2025-01-09-azure-local-aks/20.png){: style="border: 2px solid grey;"}
![AKS Deploy App 5](/assets/img/post/2025-01-09-azure-local-aks/21.png){: style="border: 2px solid grey;"}
![AKS Deploy App 6](/assets/img/post/2025-01-09-azure-local-aks/22.png){: style="border: 2px solid grey;"}
5. Click **Keep** to finalize the setup, and voilà—you now have a working dog-and-cat counter! 🎉
![AKS Deploy App 7](/assets/img/post/2025-01-09-azure-local-aks/23.png){: style="border: 2px solid grey;"}

To ensure everything is working:
- Check the IP assigned to the application.
![AKS Deploy App 8](/assets/img/post/2025-01-09-azure-local-aks/24.png){: style="border: 2px solid grey;"}
- Open it in your browser to test functionality.
![AKS Deploy App 9](/assets/img/post/2025-01-09-azure-local-aks/25.png){: style="border: 2px solid grey;"}

Unfortunately, as of now, there’s an issue where the application can’t fetch the image assets correctly. 
![AKS Deploy App 10](/assets/img/post/2025-01-09-azure-local-aks/26.png){: style="border: 2px solid grey;"}

While this might seem disappointing, it’s a fantastic opportunity to learn how AKS handles deployments behind the scenes.

### What’s Happening Under the Hood?

When deploying the dog-and-cat counter via the Azure Portal, the process involves more than meets the eye. Here’s what happens:
- As the admin user (me), send an API request to the AKS cluster through the Azure Portal.
- This request provisions the YAML template for the application within the cluster.

While this deployment is automated via the portal, it could also be done manually. Using the Azure CLI (`az aksarc`) to fetch credentials for your cluster ([reference](https://learn.microsoft.com/en-us/cli/azure/aksarc?view=azure-cli-latest#az-aksarc-get-credentials)), you could manage the cluster locally with `kubectl`. This approach opens up possibilities for GitOps, DevOps, and self-hosted agents—but that’s a topic for another post. 😅

### Deploying a More Complex Application: The AI-Generated Store

I’m not giving up that easily! To make up for the counter’s limitations, let’s deploy a more robust application—a demo store with AI-generated products. Here’s how you can do it:

1. **Create a New Namespace**:
   - Go to the **Namespaces** tab and click **+Add**.
   - Use the following YAML code to define your namespace:
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: store-namespace
```
   - Apply this namespace in the portal.


2. **Deploy the Store Application**:
   - In the same **Namespace** tab, click **+Add** to deploy the application.
   - Use this pre-configured YAML file for the deployment: [aks-store-all-in-one.yaml](https://github.com/Azure-Samples/aks-store-demo/blob/main/aks-store-all-in-one.yaml).
   - You can copy this code:
   
```yaml
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mongodb
  namespace: store-namespace
spec:
  serviceName: mongodb
  replicas: 1
  selector:
    matchLabels:
      app: mongodb
  template:
    metadata:
      labels:
        app: mongodb
    spec:
      nodeSelector:
        "kubernetes.io/os": linux
      containers:
      - name: mongodb
        image: mcr.microsoft.com/mirror/docker/library/mongo:4.2
        ports:
        - containerPort: 27017
          name: mongodb
        resources:
          requests:
            cpu: 5m
            memory: 75Mi
          limits:
            cpu: 25m
            memory: 1024Mi
        livenessProbe:
          exec:
            command:
            - mongosh
            - --eval
            - db.runCommand('ping').ok
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: mongodb
  namespace: store-namespace
spec:
  ports:
  - port: 27017
  selector:
    app: mongodb
  type: ClusterIP    
---
apiVersion: v1
data:
  rabbitmq_enabled_plugins: |
    [rabbitmq_management,rabbitmq_prometheus,rabbitmq_amqp1_0].
kind: ConfigMap
metadata:
  name: rabbitmq-enabled-plugins
  namespace: store-namespace
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: rabbitmq
  namespace: store-namespace
spec:
  serviceName: rabbitmq
  replicas: 1
  selector:
    matchLabels:
      app: rabbitmq
  template:
    metadata:
      labels:
        app: rabbitmq
    spec:
      nodeSelector:
        "kubernetes.io/os": linux
      containers:
      - name: rabbitmq
        image: mcr.microsoft.com/mirror/docker/library/rabbitmq:3.10-management-alpine
        ports:
        - containerPort: 5672
          name: rabbitmq-amqp
        - containerPort: 15672
          name: rabbitmq-http
        env:
        - name: RABBITMQ_DEFAULT_USER
          value: "username"
        - name: RABBITMQ_DEFAULT_PASS
          value: "password"
        resources:
          requests:
            cpu: 10m
            memory: 128Mi
          limits:
            cpu: 250m
            memory: 256Mi
        volumeMounts:
        - name: rabbitmq-enabled-plugins
          mountPath: /etc/rabbitmq/enabled_plugins
          subPath: enabled_plugins
      volumes:
      - name: rabbitmq-enabled-plugins
        configMap:
          name: rabbitmq-enabled-plugins
          items:
          - key: rabbitmq_enabled_plugins
            path: enabled_plugins
---
apiVersion: v1
kind: Service
metadata:
  name: rabbitmq
  namespace: store-namespace
spec:
  selector:
    app: rabbitmq
  ports:
    - name: rabbitmq-amqp
      port: 5672
      targetPort: 5672
    - name: rabbitmq-http
      port: 15672
      targetPort: 15672
  type: ClusterIP
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: order-service
  namespace: store-namespace
spec:
  replicas: 1
  selector:
    matchLabels:
      app: order-service
  template:
    metadata:
      labels:
        app: order-service
    spec:
      nodeSelector:
        "kubernetes.io/os": linux
      containers:
      - name: order-service
        image: ghcr.io/azure-samples/aks-store-demo/order-service:latest
        ports:
        - containerPort: 3000
        env:
        - name: ORDER_QUEUE_HOSTNAME
          value: "rabbitmq"
        - name: ORDER_QUEUE_PORT
          value: "5672"
        - name: ORDER_QUEUE_USERNAME
          value: "username"
        - name: ORDER_QUEUE_PASSWORD
          value: "password"
        - name: ORDER_QUEUE_NAME
          value: "orders"
        - name: FASTIFY_ADDRESS
          value: "0.0.0.0"
        resources:
          requests:
            cpu: 1m
            memory: 50Mi
          limits:
            cpu: 100m
            memory: 256Mi
        startupProbe:
          httpGet:
            path: /health
            port: 3000
          failureThreshold: 5
          initialDelaySeconds: 20
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          failureThreshold: 3
          initialDelaySeconds: 3
          periodSeconds: 5
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          failureThreshold: 5
          initialDelaySeconds: 3
          periodSeconds: 3
      initContainers:
      - name: wait-for-rabbitmq
        image: busybox
        command: ['sh', '-c', 'until nc -zv rabbitmq 5672; do echo waiting for rabbitmq; sleep 2; done;']
        resources:
          requests:
            cpu: 1m
            memory: 50Mi
          limits:
            cpu: 100m
            memory: 256Mi   
---
apiVersion: v1
kind: Service
metadata:
  name: order-service
  namespace: store-namespace
spec:
  type: ClusterIP
  ports:
  - name: http
    port: 3000
    targetPort: 3000
  selector:
    app: order-service
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: makeline-service
  namespace: store-namespace
spec:
  replicas: 1
  selector:
    matchLabels:
      app: makeline-service
  template:
    metadata:
      labels:
        app: makeline-service
    spec:
      nodeSelector:
        "kubernetes.io/os": linux
      containers:
      - name: makeline-service
        image: ghcr.io/azure-samples/aks-store-demo/makeline-service:latest
        ports:
        - containerPort: 3001
        env:
        - name: ORDER_QUEUE_URI
          value: "amqp://rabbitmq:5672"
        - name: ORDER_QUEUE_USERNAME
          value: "username"
        - name: ORDER_QUEUE_PASSWORD
          value: "password"
        - name: ORDER_QUEUE_NAME
          value: "orders"
        - name: ORDER_DB_URI
          value: "mongodb://mongodb:27017"
        - name: ORDER_DB_NAME
          value: "orderdb"
        - name: ORDER_DB_COLLECTION_NAME
          value: "orders"
        resources:
          requests:
            cpu: 1m
            memory: 6Mi
          limits:
            cpu: 5m
            memory: 20Mi
        startupProbe:
          httpGet:
            path: /health
            port: 3001
          failureThreshold: 10
          periodSeconds: 5
        readinessProbe:
          httpGet:
            path: /health
            port: 3001
          failureThreshold: 3
          initialDelaySeconds: 3
          periodSeconds: 5
        livenessProbe:
          httpGet:
            path: /health
            port: 3001
          failureThreshold: 5
          initialDelaySeconds: 3
          periodSeconds: 3
---
apiVersion: v1
kind: Service
metadata:
  name: makeline-service
  namespace: store-namespace
spec:
  type: ClusterIP
  ports:
  - name: http
    port: 3001
    targetPort: 3001
  selector:
    app: makeline-service
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: product-service
  namespace: store-namespace
spec:
  replicas: 1
  selector:
    matchLabels:
      app: product-service
  template:
    metadata:
      labels:
        app: product-service
    spec:
      nodeSelector:
        "kubernetes.io/os": linux
      containers:
      - name: product-service
        image: ghcr.io/azure-samples/aks-store-demo/product-service:latest
        ports:
        - containerPort: 3002
        env: 
        - name: AI_SERVICE_URL
          value: "http://ai-service:5001/"
        resources:
          requests:
            cpu: 1m
            memory: 1Mi
          limits:
            cpu: 2m
            memory: 10Mi
        readinessProbe:
          httpGet:
            path: /health
            port: 3002
          failureThreshold: 3
          initialDelaySeconds: 3
          periodSeconds: 5
        livenessProbe:
          httpGet:
            path: /health
            port: 3002
          failureThreshold: 5
          initialDelaySeconds: 3
          periodSeconds: 3
---
apiVersion: v1
kind: Service
metadata:
  name: product-service
  namespace: store-namespace
spec:
  type: ClusterIP
  ports:
  - name: http
    port: 3002
    targetPort: 3002
  selector:
    app: product-service
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: store-front
  namespace: store-namespace
spec:
  replicas: 1
  selector:
    matchLabels:
      app: store-front
  template:
    metadata:
      labels:
        app: store-front
    spec:
      nodeSelector:
        "kubernetes.io/os": linux
      containers:
      - name: store-front
        image: ghcr.io/azure-samples/aks-store-demo/store-front:latest
        ports:
        - containerPort: 8080
          name: store-front
        env: 
        - name: VUE_APP_ORDER_SERVICE_URL
          value: "http://order-service:3000/"
        - name: VUE_APP_PRODUCT_SERVICE_URL
          value: "http://product-service:3002/"
        resources:
          requests:
            cpu: 1m
            memory: 200Mi
          limits:
            cpu: 1000m
            memory: 512Mi
        startupProbe:
          httpGet:
            path: /health
            port: 8080
          failureThreshold: 3
          initialDelaySeconds: 5
          periodSeconds: 5
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          failureThreshold: 3
          initialDelaySeconds: 3
          periodSeconds: 3
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          failureThreshold: 5
          initialDelaySeconds: 3
          periodSeconds: 3
---
apiVersion: v1
kind: Service
metadata:
  name: store-front
  namespace: store-namespace
spec:
  ports:
  - port: 80
    targetPort: 8080
  selector:
    app: store-front
  type: LoadBalancer
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: store-admin
  namespace: store-namespace
spec:
  replicas: 1
  selector:
    matchLabels:
      app: store-admin
  template:
    metadata:
      labels:
        app: store-admin
    spec:
      nodeSelector:
        "kubernetes.io/os": linux
      containers:
      - name: store-admin
        image: ghcr.io/azure-samples/aks-store-demo/store-admin:latest
        ports:
        - containerPort: 8081
          name: store-admin
        env:
        - name: VUE_APP_PRODUCT_SERVICE_URL
          value: "http://product-service:3002/"
        - name: VUE_APP_MAKELINE_SERVICE_URL
          value: "http://makeline-service:3001/"
        resources:
          requests:
            cpu: 1m
            memory: 200Mi
          limits:
            cpu: 1000m
            memory: 512Mi
        startupProbe:
          httpGet:
            path: /health
            port: 8081
          failureThreshold: 3
          initialDelaySeconds: 5
          periodSeconds: 5
        readinessProbe:
          httpGet:
            path: /health
            port: 8081
          failureThreshold: 3
          initialDelaySeconds: 3
          periodSeconds: 5
        livenessProbe:
          httpGet:
            path: /health
            port: 8081
          failureThreshold: 5
          initialDelaySeconds: 3
          periodSeconds: 3
---
apiVersion: v1
kind: Service
metadata:
  name: store-admin
  namespace: store-namespace
spec:
  ports:
  - port: 80
    targetPort: 8081
  selector:
    app: store-admin
  type: LoadBalancer  
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: virtual-customer
  namespace: store-namespace
spec:
  replicas: 1
  selector:
    matchLabels:
      app: virtual-customer
  template:
    metadata:
      labels:
        app: virtual-customer
    spec:
      nodeSelector:
        "kubernetes.io/os": linux
      containers:
      - name: virtual-customer
        image: ghcr.io/azure-samples/aks-store-demo/virtual-customer:latest
        env:
        - name: ORDER_SERVICE_URL
          value: http://order-service:3000/
        - name: ORDERS_PER_HOUR
          value: "100"
        resources:
          requests:
            cpu: 1m
            memory: 1Mi
          limits:
            cpu: 1m
            memory: 7Mi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: virtual-worker
  namespace: store-namespace
spec:
  replicas: 1
  selector:
    matchLabels:
      app: virtual-worker
  template:
    metadata:
      labels:
        app: virtual-worker
    spec:
      nodeSelector:
        "kubernetes.io/os": linux
      containers:
      - name: virtual-worker
        image: ghcr.io/azure-samples/aks-store-demo/virtual-worker:latest
        env:
        - name: MAKELINE_SERVICE_URL
          value: http://makeline-service:3001
        - name: ORDERS_PER_HOUR
          value: "100"
        resources:
          requests:
            cpu: 1m
            memory: 1Mi
          limits:
            cpu: 1m
            memory: 7Mi

```

### Why This Application?

This application features:
- A **front-end** for users.
- A **separate admin panel** for managing products.

Once deployed, the store runs perfectly, allowing you to explore its functionality without hiccups. 🤗

![AKS Deploy App 11](/assets/img/post/2025-01-09-azure-local-aks/27.png){: style="border: 2px solid grey;"}
![AKS Deploy App 12](/assets/img/post/2025-01-09-azure-local-aks/28.png){: style="border: 2px solid grey;"}
![AKS Deploy App 13](/assets/img/post/2025-01-09-azure-local-aks/29.png){: style="border: 2px solid grey;"}

### Thoughts on Managing Applications in AKS

The ability to manage applications and AKS clusters through ClickOps (directly in the Azure Portal) is a game-changer. 
Whether you’re a fan of this approach or not, it’s undeniable that it simplifies the learning curve for newcomers. 
Coming from the 22H2 version, where configurations were far from straightforward, I truly appreciate the improvements in manageability—whether through code or the portal. 
These advancements make it easier to showcase AKS to clients and demonstrate its potential effectively.

## Installation of Arc Data Services and SQL Managed Instance

Before diving into the deployment of SQL Managed Instance (SQLmi), let me give you a quick introduction to the service for those unfamiliar:

Azure SQL Managed Instance is a scalable cloud database service that runs on the latest stable version of the Microsoft SQL Server database engine, with 99.99% built-in high availability. It offers close to 100% feature compatibility with SQL Server while providing PaaS capabilities. This enables you to focus on critical database administration and optimization tasks without worrying about underlying infrastructure.

In Azure Local, SQLmi leverages Azure Arc-enabled data services, seamlessly integrated into the deployment process via the Azure Portal.

### Pricing Overview

The pricing for SQLmi in Azure Local is as follows:

| Service | Price (1 vCore/Month) | Notes |
|---------|-----------------------|-------|
| **General Purpose Tier License Included** | PAYG: `$122.64`<br> 1 Year RI: `$113.00`<br>3 Year RI: `$93.01` | License included |
| **General Purpose Tier Azure Hybrid Benefit** | PAYG: `$49.64`<br>1 Year RI: `$40.00`<br>3 Year RI: `$20.01` | Requires existing SQL licenses |
| **Business Critical License Included** | PAYG: `$373.76`<br>1 Year RI: `$353.76`<br>3 Year RI: `$313.75` | License included |
| **Business Critical Azure Hybrid Benefit** | PAYG: `$100.01`<br>1 Year RI: `$80.01`<br>3 Year RI: `$40.00` | Requires existing SQL licenses |
| **PostgreSQL (Preview)** | Free | Preview phase |
| **Azure Machine Learning** | Free | No additional cost |

### Deployment Overview

To deploy SQLmi in Azure Local, the process involves the following steps:
1. **Set up Azure Arc-enabled data services**.
2. **Create a custom location** specifically for the data services.
3. **Deploy SQLmi** to the configured environment.

### Deployment Limitations

Unfortunately, deploying Arc Data Services requires a worker node of at least `Standard_D8s_v3`, which demands 8 vCPUs and 32 GB of RAM ([Link](https://learn.microsoft.com/en-us/azure/azure-arc/data/plan-azure-arc-data-services#deployment-requirements)). While vCPU requirements aren't a problem in my lab, the 32 GB memory requirement exceeds my laptop’s capacity, which only has 64 GB in total. As such, I can't perform a functional deployment but will demonstrate the process for educational purposes.

### Disclaimer: Separate AKS Clusters for SQLmi

For this demonstration, I’m using the same AKS cluster where I deployed the web applications earlier. However, I strongly recommend using a separate AKS cluster for SQLmi, especially since AKS itself incurs no additional cost on Azure Local. A dedicated SQLmi cluster provides better isolation and control. When creating this separate cluster, I usually include "SQLmi" in the name and assign it a distinct network configuration.

### Step-by-Step Deployment Process

#### 1. Prepare the Log Analytics Workspace (LAW)
To deploy the data controller, you'll need a Log Analytics Workspace (LAW) and its primary key. Select your LAW (e.g., `akshybrid-law`) and copy the primary key:
![Log Analytics Primary Key](/assets/img/post/2025-01-09-azure-local-aks/lawpk.png){: style="border: 2px solid grey;"}

#### 2. Deploy the Azure Arc Data Controller
- Navigate to the Azure Arc portal and select **Data Controllers**.
- Click **Create** and choose **Azure Arc-enabled Kubernetes cluster (Direct connectivity mode)**:
  ![Select Direct Connectivity Mode](/assets/img/post/2025-01-09-azure-local-aks/031.png){: style="border: 2px solid grey;"}

- Specify the resource group and give the data controller a name:
  ![Data Controller Details](/assets/img/post/2025-01-09-azure-local-aks/032.png){: style="border: 2px solid grey;"}

- Create a new custom location specific to the data services. This differs technically from the Azure Local custom location as it’s not used for VM deployments. Ensure the custom location name differs from the namespace to avoid redundancy errors:
  ![Create Custom Location](/assets/img/post/2025-01-09-azure-local-aks/033.png){: style="border: 2px solid grey;"}

- Choose the **azure-arc-aks-hci** Kubernetes configuration and provide credentials for metrics and logs:
  ![Kubernetes Configuration](/assets/img/post/2025-01-09-azure-local-aks/034.png){: style="border: 2px solid grey;"}

- Select the LAW and paste the primary key:
  ![Attach LAW](/assets/img/post/2025-01-09-azure-local-aks/035.png){: style="border: 2px solid grey;"}

- Add tags if necessary and proceed to deployment:
  ![Deploy Data Controller](/assets/img/post/2025-01-09-azure-local-aks/036.png){: style="border: 2px solid grey;"}

#### 3. Deploy SQL Managed Instance
- In the Azure Arc portal, navigate to **SQL Managed Instances** and click **Create**:
  ![Create SQL Managed Instance](/assets/img/post/2025-01-09-azure-local-aks/041.png){: style="border: 2px solid grey;"}

- Specify the subscription, resource group, and name. Select the custom location created earlier and ensure the load balancer uses the IP range configured during AKS networking setup:
  ![SQLmi Configuration](/assets/img/post/2025-01-09-azure-local-aks/042.png){: style="border: 2px solid grey;"}

- Select the service tier and size. For testing, you can opt for a **development-only** instance, which is free:
  ![SQLmi Cost Selection](/assets/img/post/2025-01-09-azure-local-aks/044.png){: style="border: 2px solid grey;}
  ![Development-Only Cost](/assets/img/post/2025-01-09-azure-local-aks/043.png){: style="border: 2px solid grey;"}

- Provide a username and password. Optionally, you can configure an AD connector if previously set up in the data controller. For simplicity, we’ll skip this:
  ![SQLmi Credentials](/assets/img/post/2025-01-09-azure-local-aks/045.png){: style="border: 2px solid grey;"}

- Review and complete the deployment:
  ![Deployment Ready](/assets/img/post/2025-01-09-azure-local-aks/046.png){: style="border: 2px solid grey;"}

### Conclusion related to SQLmi
As demonstrated, deploying SQL Managed Instance in Azure Local is a straightforward process, provided you meet the hardware requirements. Despite my lab limitations, I hope this walkthrough has shown how simple and effective it can be to leverage SQLmi and Arc Data Services on Azure Local.

## Conclusion

Throughout this article, we have explored the vast potential of Azure Local as a platform for deploying and managing both containerized applications with AKS and data services with SQL Managed Instances. The journey has taken us from understanding the basics of AKS to the intricacies of deployment on different environments, such as legacy systems, Azure Local, and Windows Server. 

### Key Takeaways

1. **Simplified Deployment with Azure Local**:
   Azure Local has made deploying AKS clusters remarkably straightforward compared to previous iterations like Azure Stack HCI. The introduction of integrated tools like the Azure Portal and Arc Resource Bridge has drastically reduced complexity, making Kubernetes more accessible to organizations of all sizes.

2. **Tailored Use Cases and Benefits**:
   Whether addressing low-latency requirements, compliance needs, or hybrid cloud scenarios, AKS on Azure Local stands out for its flexibility. Integration with Azure Arc-enabled services further enhances its capabilities, offering features like SQL Managed Instances and Azure Machine Learning for hybrid workloads.

3. **Improved Management and Scalability**:
   The ability to manage clusters and applications seamlessly through the Azure Portal simplifies operations for IT teams. Tools like GitOps and Azure CLI provide additional flexibility for advanced configurations, empowering organizations to scale their infrastructure as needed.

4. **Considerations for Optimal Use**:
   While Azure Local offers numerous advantages, it’s important to carefully consider resource requirements and design best practices for deployments. For instance:
   - Ensure adequate hardware resources for services like SQL Managed Instances that demand higher RAM or CPU.
   - Plan separate AKS clusters for distinct workloads to maintain isolation and performance.
   - Familiarize yourself with Azure Local's networking models and configurations to avoid potential setup challenges.

5. **Future-Proof Solutions**:
   Azure Local bridges the gap between on-premises and cloud environments, ensuring that organizations can adopt a hybrid strategy without compromising on performance or compliance. The inclusion of services like SQL Managed Instances at competitive pricing further solidifies its position as a future-ready solution.

### Final Thoughts

Azure Local represents a significant step forward in simplifying Kubernetes and data service deployments for hybrid environments. As someone who has experienced the complexities of Azure Stack HCI and older versions firsthand, the advancements introduced in Azure Local are both welcome and transformative. 

For those considering a foray into Kubernetes or modern data services, Azure Local offers an approachable yet powerful solution. With the tools, guidance, and real-world examples shared in this article, I hope you feel inspired and equipped to take the next steps in your Azure Local journey.

Thank you for following along, and I look forward to sharing more insights in future articles of the Chronicloud Series. Stay tuned!

### Links

``` text
https://schmitt-nieto.com/blog/azure-stack-hci-demolab/
https://schmitt-nieto.com/blog/azure-stack-hci-day2/
https://learn.microsoft.com/en-us/azure/architecture/example-scenario/hybrid/aks-baseline
https://learn.microsoft.com/en-us/azure/architecture/example-scenario/hybrid/aks-network
https://learn.microsoft.com/en-us/azure/aks/hybrid/system-requirements?tabs=allow-table#stretched-clusters-in-aks
https://techcommunity.microsoft.com/blog/azurestackblog/distributing-virtual-machines-across-multiple-cluster-shared-volumes-in-aks-on-a/2760713
https://techcommunity.microsoft.com/blog/azurestackblog/disable-automatic-distribution-of-data-across-csvs-on-aks-on-azure-stack-hci-and/3597392
https://learn.microsoft.com/en-us/azure/aks/hybrid/concepts-support
https://learn.microsoft.com/en-us/azure/aks/hybrid/set-proxy-settings#configure-an-aks-host-for-a-proxy-server-with-basic-authentication
https://azure.microsoft.com/en-us/pricing/details/kubernetes-service/
https://learn.microsoft.com/en-us/azure/aks/hybrid/azure-hybrid-benefit-22h2?tabs=powershell
https://learn.microsoft.com/en-us/azure/aks/hybrid/pricing
https://learn.microsoft.com/en-us/azure/azure-sql/managed-instance/sql-managed-instance-paas-overview?view=azuresql
https://learn.microsoft.com/en-us/azure/azure-arc/data/plan-azure-arc-data-services#deployment-requirements
https://azure.microsoft.com/en-us/pricing/details/azure-arc/data-services/
https://learn.microsoft.com/en-us/azure/aks/aksarc/aks-create-clusters-portal
https://learn.microsoft.com/en-us/azure/architecture/example-scenario/hybrid/aks-network
https://learn.microsoft.com/en-us/azure/aks/aksarc/cluster-architecture
```