---
permalink: /azurelocal-calculator/
title: "Azure Local Calculator"
excerpt: "One interactive calculator for Azure Local that covers planning, CPU and storage sizing and pricing for every deployment type, from single node and rack aware clusters to disaggregated, disconnected operations, multi-rack and small form factor, with configuration import from ODIN and a 3D view of the solution."
redirect_from:
  - /azl-storage-calculator/
  - /azure-local-calculator/
toc: true
toc_label: "Topics Overview"
toc_icon: "list-ul"

sidebar:
  nav: "Azurelocal"

header:
  teaser: "/assets/img/AzureLocalCalculator.webp"
  image: "/assets/img/AzureLocalCalculator.webp"
  og_image: "/assets/img/AzureLocalCalculator.webp"
  overlay_image: "/assets/img/AzureLocalCalculator.webp"
  overlay_filter: 0.5
  caption: ""
---

## Introduction

This page presents a web-based calculator built to estimate key metrics within an **Azure Local** environment. It is custom-made and designed for deployment planning, CPU and storage sizing, infrastructure cost estimation and license impact assessment.

The calculator is provided as-is and without any warranties. Its results were checked against the V2 calculators, but if you notice any inconsistencies or potential issues, I would greatly appreciate your feedback 🤗 feel free to get in touch!

This tool is intended to **supplement** the official [Microsoft Azure Local Sizer](https://azurelocalsolutions.azure.microsoft.com/#/sizer) and [ODIN for Azure Local](https://azure.github.io/odinforazurelocal/). It aims to provide deeper visibility into specific resource planning areas and to bring planning, sizing and pricing together in one place.

## Azure Local Calculator V3

[**Azure Local Calculator**](https://github.com/schmittnieto/AzureLocal-Calculator) is a GitHub-based repository with the source code of the calculator. V3 replaces the three separate V2 calculators (CPU, Storage and Pricing) with a single one: you pick a deployment type once and the nodes, CPU, storage and cost follow from the same inputs.

The formulas, the CPU list, the catalog node types and the rates are the ones from the V2 calculators. Rules that the V2 calculators did not cover come from Microsoft Learn and carry a source number that points to the list at the end of the calculator.

### Deployment Types

| Deployment type | Planning checks | CPU sizing | Storage sizing | Cost |
|-----------------|-----------------|------------|----------------|------|
| Hyperconverged, 1 to 16 nodes (includes single node) | Yes | Yes | Storage Spaces Direct | L1 |
| Rack aware cluster (1+1 to 4+4) | Yes | Yes | Storage Spaces Direct with two-way or four-way mirror | L1 |
| Hyperconverged with external SAN | Yes | Yes | Storage Spaces Direct plus SAN | L2 or OEM license |
| Disaggregated, 1 to 64 nodes | Yes | Yes | SAN only | L2 or OEM license |
| Disconnected operations | Yes | Workload cluster and management cluster | Storage Spaces Direct for both | L3 with your rate |
| Multi-rack | Yes | No | No | L2 |
| Small form factor (preview) | Yes | No | No | Hardware only |

Multi-rack and small form factor are not sized. Microsoft sells multi-rack as a fixed bill of materials and small form factor runs on a short list of supported devices, so the calculator shows the planning facts and a cost estimate for them. Microsoft does not publish the L3 price, so enter your quote in the cost step.
{: .notice--info}

### How to Use It

- **Work out**: the three switches at the top (Compute, Storage and Cost) turn parts of the calculator off. With Compute off, step 2 becomes a small cluster size form, so you can run the storage or the cost part alone.
- **Deployment type**: sets the node limits, the storage model and the host fee, and lists the planning checks for that type.
- **Compute**: sizes the physical cores in two directions, from a node count to a recommended CPU or from a CPU model to the number of nodes you need. Select a node type from the [Azure Local solutions catalog](https://azurelocalsolutions.azure.microsoft.com/#/catalog) to only see the CPU models that system can use.
- **Storage**: start from your drives or from a capacity target. External SAN and the management cluster of disconnected operations have their own inputs. The Storage Spaces Direct model is based on the *Express* mode with full-flash drives. It is not the most efficient setup in terms of capacity, but it works well as a first approximation. For detailed Storage Spaces Direct sizing I recommend [s2d-calculator.com](https://s2d-calculator.com/) by [Armin](https://www.linkedin.com/in/aoberneder/).
- **Cost**: nodes and physical cores come from step 2. Rates are read in the selected currency, without exchange rate conversion.
- **Solution**: a 3D view of the hardware and 3D charts of the calculations. Drag to rotate a view, double-click to reset it and hover or tap a part to see its values. With the keyboard, focus a chart with Tab and read each value with the arrow keys.

Every result recalculates as you type. The notes and disclaimers of each step are collapsed under the step, and the full overview at the end lists every calculation.

### Import from ODIN

The **Import from ODIN** button loads a configuration exported from [ODIN for Azure Local](https://azure.github.io/odinforazurelocal/). Both the Sizer "Export JSON" file and the Designer "Export Configuration" file are supported, for every cluster type ODIN offers: Single Node, Hyperconverged, Rack Aware, Disaggregated Storage and Disconnected Operations. You can also drop the file onto the calculator. The file is read locally in your browser and is never uploaded.

One import fills in the whole calculator: deployment type, workload vCPUs including future growth, vCPU to core ratio, node count, CPU, host core reservation, capacity drives, resiliency, storage target, SAN connectivity, switch count and AVD vCPUs. A summary shows what was applied and what could not be mapped.

Prices for nodes, switches and related costs are not part of ODIN exports and must be entered manually. Tiered ODIN layouts are imported as their capacity drives only. ODIN exports have no SAN vendor, so choose it after the import.
{: .notice--info}

### Calculator

{% include azurelocal-calculator.html %}

## Contributors

- **Florian Hildesheim**  
  Contributed insights and reference values for the **Storage Calculator**.  
  [LinkedIn](https://www.linkedin.com/in/florian-hildesheim-757bb0273/)  

- **Karl Wester-Ebbinghaus**  
  Provided valuable feedback and data for the **Pricing Calculator** and early CPU modeling discussions.  
  [LinkedIn](https://www.linkedin.com/in/karl-wester-ebbinghaus-a41507153/)

> The **Storage Calculator** is inspired by Cosmos Darwin’s work on the S2D Calculator.  
> [LinkedIn: Cosmos Darwin](https://www.linkedin.com/in/cosmosd/)

- **Cristian Schmitt Nieto**  
  Author of the calculator and blog.  
  [LinkedIn](https://www.linkedin.com/in/cristian-schmitt-nieto/)

## General Disclaimer

- **Unofficial:**  
  This calculator is a community-built tool and does **not** represent official Microsoft products or documentation.

- **No Endorsement:**  
  It is provided as reference material only and does not imply endorsement of any architectural decision.

- **Provided “AS IS”:**  
  All code and tools are provided with no warranties, either express or implied.

- **No Standard Support:**  
  This tool is not covered by any Microsoft support program.

- **Use at Your Own Risk:**  
  It is your responsibility to validate and test the results for your specific environment.

- **Limitation of Liability:**  
  Neither the author(s) nor Microsoft will be liable for any damages resulting from the use of these tools, including (but not limited to) loss of business, profits or data.
