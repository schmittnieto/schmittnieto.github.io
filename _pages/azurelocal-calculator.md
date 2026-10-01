---
permalink: /azurelocal-calculator/
title: "Azure Local Calculator"
excerpt: "Interactive calculators for Azure Local covering CPU planning with catalog node types, storage sizing with external SAN and pricing for L1, L2 and L3 including disconnected operations, with configuration import from ODIN. Ideal for architecture design and cost evaluation."
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

This page presents a set of web-based calculators built to estimate key metrics within an **Azure Local** environment. These tools are custom-made and designed for storage planning, infrastructure cost estimation and license impact assessment. 

While the calculators have been thoroughly tested, they are provided as-is and without any warranties. If you notice any inconsistencies or potential issues, I would greatly appreciate your feedback 🤗 feel free to get in touch!

These tools are intended to **supplement** the official [Microsoft Azure Local Sizer](https://azurelocalsolutions.azure.microsoft.com/#/sizer), which is currently still in **Preview**. The Sizer offers a helpful approximation of how the final solution might look once deployed. This calculator set aims to provide deeper visibility into specific resource planning areas.

More insights on planning, sizing and migration strategies will be shared in my upcoming blog post: **“Planning, Sizing and Migration for Azure Local”**.

## Azure Local Calculator

[**Azure Local Calculator**](https://github.com/schmittnieto/AzureLocal-Calculator) is a GitHub-based repository offering a collection of interactive calculators focused on the Azure Local with emphasis on **Storage**, **CPU** and **Pricing** estimations.

The source code for the calculators is available on GitHub, but the calculators themselves can be used interactively right here on this page.

The storage configuration used in the calculator is based on the *Express* mode. While I acknowledge that this is not the most efficient setup in terms of capacity optimization, it serves well as a first approximation to get a general understanding of the storage architecture.

If you aim to implement more advanced storage configurations, you will likely need to customize the deployment by manually configuring storage to suit your needs. In those cases you probably already have an Excel sheet from your vendor or internal team that provides more accurate figures than what this calculator is designed to offer.

### Interactive 3D Charts

The charts of all three calculators are 3D and built into each calculator, without external libraries. Hover or tap a slice or bar to see its value and share, click a legend entry to hide or show that part, drag to rotate the view and double-click to reset it. With the keyboard, focus a chart with Tab and read each value with the arrow keys. Every value is also listed in the legend or in the Full Overview table.

### Import from ODIN

All three calculators include an **Import from ODIN** button that loads a configuration exported from [ODIN for Azure Local](https://azure.github.io/odinforazurelocal/). Both the Sizer "Export JSON" file and the Designer "Export Configuration" file are supported, for every cluster type ODIN offers: Single Node, Hyperconverged, Rack Aware, Disaggregated Storage and Disconnected Operations. The file is read locally in your browser and is never uploaded. After the import, the calculator fills in the matching fields, recalculates and shows a summary of what was applied and what could not be mapped.

You only need to import once. The configuration is applied to all three calculators on this page at the same time and stays available until you close the browser tab, so reloading the page keeps your design.

| Calculator | Fields imported from ODIN |
|------------|---------------------------|
| CPU | Cluster type, total workload vCPUs including future growth (the fixed control plane appliance for an ALDO management cluster), vCPU to core ratio, node count, sockets, management overhead per node (the ODIN host core reservation) and the ODIN CPU as a selectable model |
| Storage | Deployment type, node count, capacity drives per node and drive size, resiliency (Simple, two-way, three-way or four-way mirror) and target effective storage from the workload total including future growth. Disaggregated designs get the SAN capacity plan with Fibre Channel or iSCSI |
| Pricing | Deployment model (L1, L2 or L3), node count, physical cores per node (the management cluster fields for an ALDO management cluster design), switch count and AVD vCPUs (not for L3) |

The switch count follows the ODIN Sizer network model: 2 ToR switches and 1 BMC switch per rack, 2 racks for Rack Aware, a single BMC switch for Single Node. Disaggregated Storage adds FC and spine switches on top. The Simple and Four-Way Mirror options only appear in the Storage Calculator when the imported design uses them.

Prices for nodes, switches and related costs are not part of ODIN exports and must be entered manually. Tiered ODIN layouts are imported as their capacity drives only. The Storage Calculator caps imports at 16 nodes (64 for disaggregated) and 24 drives per node. ODIN exports have no SAN vendor, so choose it after the import.
{: .notice--info}

### Disconnected Operations and External SAN

The calculators also cover the two deployment types that change the sizing the most: the dedicated management cluster of disconnected operations (ALDO) and external SAN storage.

| Calculator | Disconnected operations (ALDO) | External SAN |
|------------|--------------------------------|--------------|
| CPU | Cluster type for the management cluster: the fixed control plane appliance (24 vCPUs), at least 24 physical cores per node, a host reservation of at least 20% of the cores and 3 nodes for production. Only catalog systems with the Disconnected operations capability are offered | Disaggregated cluster type with up to 64 nodes and only the catalog systems that support this architecture |
| Storage | Checks the standard (6 drives) or datacenter (8 drives) configuration with drives of at least 2 TB and reserves the 2 TB infrastructure volume of disconnected operations | Hyperconverged with external SAN or disaggregated: supported arrays, Fibre Channel or iSCSI host requirements, one LUN per CSV and the physical array capacity after free space headroom and data reduction |
| Pricing | L3 adds the nodes and cores of the management cluster because they are billed too. AVD is not available with disconnected operations | Both SAN variants use the L2 host fee |

Microsoft does not publish the L3 price, so enter your quote in the Pricing Calculator. External SAN storage requires Azure Local 2604 or later. See [Supported SAN solutions on Azure Local](https://learn.microsoft.com/en-us/azure/azure-local/concepts/san-requirements?wt.mc_id=MVP_579217) and [Dedicated management cluster for disconnected operations](https://learn.microsoft.com/en-us/azure/azure-local/manage/disconnected-operations-control-plane-appliance?wt.mc_id=MVP_579217).
{: .notice--info}

### CPU

The CPU Calculator sizes the physical cores for a virtual workload in two directions: from a node count to a recommended CPU, or from a CPU model to the number of nodes you need.

- **Node Type**: the systems listed as "Current (2026 or later)" in the [Azure Local solutions catalog](https://azurelocalsolutions.azure.microsoft.com/#/catalog). Once you select one, the calculator only offers the CPU models that system can use (same generation, a cores per socket option the catalog lists and support for the selected sockets) and sizes the cluster with a real CPU instead of a theoretical core count.
- **CPU Recommendations**: the recommended CPU is highlighted. Click any other card, including a smaller one, to size the cluster with it. When the CPU is too small, the charts show the missing cores of each node.
- **Cluster Type**: hyperconverged, disaggregated with external SAN storage or the management cluster of disconnected operations.
- Results and charts recalculate when you change the node type, the CPU or any input.

<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    *{box-sizing:border-box}
    body{margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
    .container{margin:20px 0;text-align:center}
    h3{font-size:1.5em;margin-bottom:20px}

    .card{margin:20px 0;padding:0;text-align:left}
    .card h3{margin:0 0 20px;font-size:1.5em}

    .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px 20px}
    @media(max-width:700px){.form-grid{grid-template-columns:1fr}}
    .form-group{display:flex;flex-direction:column;min-width:0;max-width:100%}
    .form-group.full{grid-column:1/-1;width:100%;min-width:0;max-width:100%}

    .form-group label,
    label{display:block;margin-bottom:5px;font-weight:600}

    input[type=range]{width:100%;margin:10px 0}
    input[type=number],select{width:100%;padding:8px;border:1px solid #555;border-radius:8px;box-sizing:border-box;margin-top:5px}
    select{background:#444;color:#fff}
    input[type=range]{margin:10px 0}
    input[type=number]:focus,select:focus{outline:none}

    .chk-row{display:flex;align-items:flex-start;flex-wrap:wrap;gap:0.5rem;margin-bottom:10px;max-width:100%}
    .chk-row input[type=checkbox]{margin-right:8px;transform:scale(1.2)}
    .chk-row label{margin:0;font-weight:600;flex:1 1 14rem;min-width:0;overflow-wrap:anywhere}

    .btn-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:8px}
    .btn,button{background:#007aff;color:#fff;border:none;border-radius:8px;padding:10px 20px;font-size:1em;cursor:pointer;margin-top:20px}
    .btn:hover,button:hover{background:#005bb5}
    .btn-secondary{background:#555;color:#fff}
    .btn-secondary:hover{background:#3d3d3d}

    .mode-tab{background:#444;color:#fff;margin-top:0;border-radius:0}
    .mode-tab:hover{background:#555}
    .mode-tab.active,
    .mode-tab.active:hover{background:#007aff;color:#fff;font-weight:700}

    .result-box{
      margin-top:20px;
      text-align:left;
      font-size:.95em;
      line-height:1.7
    }
    .warning{color:#cc3300;font-weight:600}
    .ok{color:#2e7d32;font-weight:600}

    .charts-grid{display:grid;grid-template-columns:1fr;gap:16px;margin-top:20px}
    @media(min-width:900px){.charts-grid.two-col{grid-template-columns:1fr 1fr}}
    .chart-wrapper{position:relative;height:320px;text-align:center}
    .chart-wrapper canvas{background:#fff;border-radius:8px;width:100%!important;height:100%!important}

    .overview-table{width:100%;border-collapse:collapse;margin-top:15px;text-align:left;font-size:.9em}
    .overview-table th,.overview-table td{padding:8px 10px;border-bottom:1px solid #555}
    .overview-table th{font-weight:600}
    .overview-table td:last-child{text-align:right}
    .overview-table .section-header{font-weight:700}
    .overview-table .total-row{font-weight:700}
    .overview-table .formula{font-size:.86em;opacity:.8}

    .cpu-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px;margin-top:12px}
    .cpu-card{border:1px solid #555;border-radius:8px;padding:12px;font-size:.88em;cursor:pointer;transition:box-shadow .2s,border-color .2s,opacity .2s}
    .cpu-card:hover{box-shadow:0 2px 10px rgba(0,0,0,.25)}
    .cpu-card:focus{outline:none}
    .cpu-card:focus-visible{outline:2px solid #007aff;outline-offset:2px}
    .cpu-card.match{border-color:#2e7d32}
    .cpu-card.tight{border-color:#cc7a00}
    .cpu-card.no-fit{border-color:#888;opacity:.65}
    .cpu-card.recommended{border:2px solid #007aff;padding:11px;opacity:1;box-shadow:0 6px 22px rgba(0,122,255,.4)}
    .cpu-card.selected{border:2px solid #8e44ad;padding:11px;box-shadow:0 6px 22px rgba(142,68,173,.45)}
    .cpu-card.no-fit.selected{opacity:.85}
    .cpu-tag.rec-tag{background:#007aff;color:#fff}
    .cpu-tag.sel-tag{background:#8e44ad;color:#fff}
    .cpu-card .cpu-name{font-weight:700;font-size:.95em;margin-bottom:6px}
    .cpu-card .cpu-detail{line-height:1.5}
    .cpu-tag{display:inline-block;font-size:.72em;font-weight:700;padding:2px 8px;border-radius:4px;margin-left:6px;vertical-align:middle}
    .cpu-tag.fit{background:#2e7d32;color:#fff}
    .cpu-tag.tight-tag{background:#cc7a00;color:#fff}
    .cpu-tag.small{background:#888;color:#fff}

    .disclaimer{font-size:.8em;margin-top:20px;text-align:left;line-height:1.6}
    .disclaimer a{color:#007aff;text-decoration:none}
    .disclaimer a:hover{text-decoration:underline}

    @media print{
      .btn-row,.no-print{display:none!important}
      .card,.chart-wrapper{break-inside:avoid}
      .chart-wrapper{height:260px}
    }
  </style>
</head>
<body>
<div class="container" id="calcRoot">

  <!-- Section 1: Workloads -->
  <div class="card">
    <h3>Virtual Workloads</h3>
    <div class="form-grid">
      <div class="form-group">
        <label for="vmCount">Number of Virtual Machines</label>
        <input type="number" id="vmCount" value="10" min="1" max="10000" step="1">
      </div>
      <div class="form-group">
        <label for="vcpusPerVm">Average vCPUs per VM</label>
        <input type="number" id="vcpusPerVm" value="4" min="1" max="128" step="1">
      </div>
    </div>
  </div>

  <!-- Section 2: CPU Ratio and Overhead -->
  <div class="card">
    <h3>CPU Ratio and Overhead</h3>
    <div class="form-grid">
      <div class="form-group">
        <label for="overcommitRatio">vCPU : Physical Core Ratio (N:1)</label>
        <input type="number" id="overcommitRatio" value="4" min="1" max="16" step="1">
      </div>
      <div class="form-group">
        <label for="mgmtOverhead">Management Overhead per Node (cores)</label>
        <input type="number" id="mgmtOverhead" value="4" min="0" max="32" step="1">
      </div>
    </div>
  </div>

  <!-- Section 3: Cluster Settings + Calculation Mode -->
  <div class="card">
    <h3>Cluster Settings</h3>
    <div class="form-grid">
      <div class="form-group full">
        <label for="clusterType">Cluster Type</label>
        <select id="clusterType">
          <option value="standard" selected>Hyperconverged (Storage Spaces Direct)</option>
          <option value="disaggregated">Disaggregated (external SAN storage, up to 64 nodes)</option>
          <option value="aldo-mgmt">Disconnected operations (ALDO): management cluster</option>
        </select>
        <div id="clusterTypeInfo" style="font-size:.82em;margin-top:6px"></div>
      </div>
      <div class="form-group">
        <label for="nodeType">Node Type (Azure Local catalog)</label>
        <select id="nodeType"></select>
        <div id="nodeTypeInfo" style="font-size:.82em;margin-top:6px"></div>
      </div>
      <div class="form-group">
        <label for="socketsPerNode">CPU Sockets per Node</label>
        <select id="socketsPerNode">
          <option value="1">Single Socket (1)</option>
          <option value="2" selected>Dual Socket (2)</option>
        </select>
      </div>
      <div class="form-group full">
        <div class="chk-row">
          <input type="checkbox" id="haEnabled" checked>
          <label for="haEnabled">Reserve capacity for N+1 High Availability (one node failover)</label>
        </div>
      </div>
    </div>
  </div>

  <!-- Calculation Mode Selector -->
  <div class="card">
    <h3>Calculation Mode</h3>
    <p style="font-size:.85em;margin:0 0 12px">Choose your starting point: either specify how many nodes you have and get CPU recommendations, or select a CPU model and find out how many nodes you need.</p>

    <!-- Mode tabs -->
    <div style="display:flex;gap:0;margin-bottom:16px;border-radius:8px;overflow:hidden;border:1px solid #555">
      <button id="modeNodesBtn" class="mode-tab active" style="flex:1;padding:10px;border:none;cursor:pointer;font-weight:600;font-size:.9em;transition:background .2s">I know my Nodes - recommend CPU</button>
      <button id="modeCpuBtn" class="mode-tab" style="flex:1;padding:10px;border:none;border-left:1px solid #555;cursor:pointer;font-weight:600;font-size:.9em;transition:background .2s">I know my CPU - recommend Nodes</button>
    </div>

    <!-- Mode A: By Nodes -->
    <div id="modeNodesPanel">
      <div class="form-grid">
        <div class="form-group full">
          <label for="nodeCount">Number of Nodes</label>
          <input type="number" id="nodeCount" value="2" min="1" max="16" step="1">
        </div>
      </div>
      <div class="btn-row">
        <button class="btn btn-primary" id="calcBtn">Calculate CPU Requirements</button>
      </div>
    </div>

    <!-- Mode B: By CPU -->
    <div id="modeCpuPanel" style="display:none">
      <div class="form-grid">
        <div class="form-group full">
          <label for="cpuSelect">Select a CPU Model</label>
          <select id="cpuSelect"></select>
        </div>
      </div>
      <div id="cpuSelectInfo" style="font-size:.82em;margin-top:6px"></div>
      <div class="btn-row">
        <button class="btn btn-primary" id="calcByCpuBtn">Calculate Required Nodes</button>
      </div>
    </div>
  </div>

  <!-- Actions (shared) -->
  <div class="btn-row">
    <button class="btn btn-secondary" id="importOdinBtn">Import from ODIN</button>
    <button class="btn btn-secondary" id="exportPdfBtn" style="display:none">Export to PDF</button>
    <input type="file" id="odinFile" accept=".json,application/json" style="display:none">
  </div>

  <!-- ODIN import summary -->
  <div id="importBox" class="result-box" style="display:none"></div>

  <!-- Results -->
  <div id="resultBox" class="result-box" style="display:none"></div>

  <!-- CPU Recommendations -->
  <div id="cpuRecommendSection" class="card" style="display:none">
    <h3>CPU Recommendations</h3>
    <p id="cpuRecommendIntro" style="font-size:.85em;margin:0 0 4px">Based on the minimum cores required per socket, this is the smallest common server CPU of each generation that fits your workload. Select a node type to see every CPU model that system can use. The recommended CPU is highlighted; click another card to size the cluster with it.</p>
    <p style="font-size:.82em;margin:0 0 10px;font-weight:600">Important: CPU availability depends on your OEM/server platform. Always confirm with your hardware vendor before purchasing. Newer generations offer better IPC and efficiency, enabling higher vCPU:core ratios.</p>
    <div id="cpuGrid" class="cpu-grid"></div>
  </div>

  <!-- Charts -->
  <div id="chartsSection" style="display:none">
    <div class="charts-grid two-col">
      <div class="chart-wrapper"><canvas id="coreChart"></canvas></div>
      <div class="chart-wrapper"><canvas id="nodeChart"></canvas></div>
    </div>
  </div>

  <!-- Overview -->
  <div id="overviewSection" class="card" style="display:none">
    <h3>Full Overview</h3>
    <table class="overview-table" id="overviewTable"></table>
  </div>

  <!-- Disclaimers -->
  <div class="disclaimer">
    <p>
      <strong>vCPU to Physical Core Ratio Disclaimer:</strong><br>
      The vCPU to physical core ratio (overcommit ratio) determines how many virtual CPUs share a single physical core. A ratio of 1:1 means no overcommit (dedicated cores). Common ratios range from 2:1 to 8:1 depending on workload type. VDI workloads typically use 4:1 to 8:1, while database or latency-sensitive workloads should stay closer to 1:1 or 2:1. Higher ratios reduce hardware cost but may impact performance under load.
    </p>
    <p>
      <strong>Management Overhead Disclaimer:</strong><br>
      Each Azure Local node reserves CPU cores for the host OS, Azure Arc agents, Storage Spaces Direct, and cluster services. The default of 4 cores is a reasonable estimate, but actual overhead may vary based on enabled features (e.g., AKS-HCI, ARC Resource Bridge). Consult
      <a href="https://learn.microsoft.com/en-us/azure/azure-local/concepts/host-network-requirements?wt.mc_id=MVP_579217" target="_blank">Azure Local system requirements</a>
      for specifics.
    </p>
    <p>
      <strong>High Availability (N+1) Disclaimer:</strong><br>
      When N+1 HA is enabled, the calculator reserves one full node worth of capacity so workloads can failover if a single node goes down. This is the standard recommendation for production clusters. If your cluster has only 1 node, HA reservation is automatically disabled.
    </p>
    <p>
      <strong>CPU Recommendations Disclaimer:</strong><br>
      The CPU models listed are based on publicly available specifications and represent common server-grade processors. However, <strong>not all CPUs are available on all OEM platforms</strong>. Server vendors (Dell, HPE, Lenovo, Supermicro, etc.) each qualify a specific subset of processors for their platforms, and availability may vary by region, server model, and generation. <strong>Always verify CPU availability and compatibility directly with your OEM or hardware vendor before purchasing.</strong> Not all CPUs listed may be validated for Azure Local.
    </p>
    <p>
      <strong>Newer CPU Generations Disclaimer:</strong><br>
      Newer processor generations (e.g., Intel Xeon 6 Granite Rapids/Sierra Forest, AMD EPYC 5th Gen Turin) typically offer improved IPC (Instructions Per Clock), higher core counts, better power efficiency, and enhanced virtualization features compared to older generations. This means that with a newer CPU, you may safely use a higher vCPU-to-physical-core ratio (overcommit) while maintaining the same or better performance per VM. When planning new deployments, consider selecting the latest available generation to maximize density and efficiency. Always validate performance expectations with your workload profile and OEM recommendations.
    </p>
    <p>
      <strong>Cluster Type Disclaimer:</strong><br>
      Disaggregated clusters use external SAN storage instead of Storage Spaces Direct and support up to 64 nodes. A disconnected operations (ALDO) management cluster is a dedicated cluster that only hosts the local control plane appliance: production needs 3 nodes with at least 24 physical cores, 128 GB (standard) or 512 GB (datacenter) memory, 6 or 8 data drives of at least 2 TB and a 960 GB boot drive per node. The appliance size (24 vCPUs, 78 GB) and the 20% host core reservation follow the ODIN Sizer. Only catalog systems with the Disconnected operations capability are offered for it. See
      <a href="https://learn.microsoft.com/en-us/azure/azure-local/manage/disconnected-operations-control-plane-appliance?wt.mc_id=MVP_579217" target="_blank">dedicated management cluster for disconnected operations</a>.
    </p>
    <p>
      <strong>No Warranty:</strong><br>
      All information in this CPU Calculator is provided "as is" with no warranties, express or implied. It does not represent official Microsoft documentation. Always verify with your hardware vendor and Microsoft licensing team for accurate sizing and configuration.
    </p>
  </div>
</div>

<script>
(function () {
  "use strict";

  const $ = id => document.getElementById(id);
  const num = el => +(el.value) || 0;

  /* ================================================================
     CPU DATABASE
     Curated list of common server CPUs used in Azure Local deployments.
     cores = cores per socket, gen = generation label.
     ================================================================ */
  const cpuDatabase = [
    /* --- Intel Xeon 3rd Gen (Ice Lake) --- */
    { name: "Intel Xeon Silver 4310",  vendor: "Intel", gen: "3rd Gen (Ice Lake)",       cores: 12, tdp: 120 },
    { name: "Intel Xeon Silver 4314",  vendor: "Intel", gen: "3rd Gen (Ice Lake)",       cores: 16, tdp: 135 },
    { name: "Intel Xeon Silver 4316",  vendor: "Intel", gen: "3rd Gen (Ice Lake)",       cores: 20, tdp: 150 },
    { name: "Intel Xeon Gold 5317",    vendor: "Intel", gen: "3rd Gen (Ice Lake)",       cores: 12, tdp: 150 },
    { name: "Intel Xeon Gold 5318Y",   vendor: "Intel", gen: "3rd Gen (Ice Lake)",       cores: 24, tdp: 165 },
    { name: "Intel Xeon Gold 5320",    vendor: "Intel", gen: "3rd Gen (Ice Lake)",       cores: 26, tdp: 185 },
    { name: "Intel Xeon Gold 6326",    vendor: "Intel", gen: "3rd Gen (Ice Lake)",       cores: 16, tdp: 185 },
    { name: "Intel Xeon Gold 6330",    vendor: "Intel", gen: "3rd Gen (Ice Lake)",       cores: 28, tdp: 205 },
    { name: "Intel Xeon Gold 6338",    vendor: "Intel", gen: "3rd Gen (Ice Lake)",       cores: 32, tdp: 205 },
    { name: "Intel Xeon Gold 6348",    vendor: "Intel", gen: "3rd Gen (Ice Lake)",       cores: 28, tdp: 235 },
    { name: "Intel Xeon Gold 6354",    vendor: "Intel", gen: "3rd Gen (Ice Lake)",       cores: 36, tdp: 205 },
    { name: "Intel Xeon Platinum 8358",vendor: "Intel", gen: "3rd Gen (Ice Lake)",       cores: 32, tdp: 250 },
    { name: "Intel Xeon Platinum 8362",vendor: "Intel", gen: "3rd Gen (Ice Lake)",       cores: 32, tdp: 265 },
    { name: "Intel Xeon Platinum 8380",vendor: "Intel", gen: "3rd Gen (Ice Lake)",       cores: 40, tdp: 270 },

    /* --- Intel Xeon 4th Gen (Sapphire Rapids) --- */
    { name: "Intel Xeon Silver 4410Y", vendor: "Intel", gen: "4th Gen (Sapphire Rapids)",cores: 12, tdp: 150 },
    { name: "Intel Xeon Silver 4416+", vendor: "Intel", gen: "4th Gen (Sapphire Rapids)",cores: 20, tdp: 165 },
    { name: "Intel Xeon Gold 5416S",   vendor: "Intel", gen: "4th Gen (Sapphire Rapids)",cores: 16, tdp: 150 },
    { name: "Intel Xeon Gold 5418Y",   vendor: "Intel", gen: "4th Gen (Sapphire Rapids)",cores: 24, tdp: 185 },
    { name: "Intel Xeon Gold 5420+",   vendor: "Intel", gen: "4th Gen (Sapphire Rapids)",cores: 28, tdp: 205 },
    { name: "Intel Xeon Gold 6426Y",   vendor: "Intel", gen: "4th Gen (Sapphire Rapids)",cores: 16, tdp: 185 },
    { name: "Intel Xeon Gold 6430",    vendor: "Intel", gen: "4th Gen (Sapphire Rapids)",cores: 32, tdp: 270 },
    { name: "Intel Xeon Gold 6438Y+",  vendor: "Intel", gen: "4th Gen (Sapphire Rapids)",cores: 32, tdp: 205 },
    { name: "Intel Xeon Gold 6442Y",   vendor: "Intel", gen: "4th Gen (Sapphire Rapids)",cores: 24, tdp: 225 },
    { name: "Intel Xeon Gold 6448Y",   vendor: "Intel", gen: "4th Gen (Sapphire Rapids)",cores: 32, tdp: 225 },
    { name: "Intel Xeon Platinum 8460Y+",vendor:"Intel",gen: "4th Gen (Sapphire Rapids)",cores: 32, tdp: 300 },
    { name: "Intel Xeon Platinum 8468",vendor: "Intel", gen: "4th Gen (Sapphire Rapids)",cores: 48, tdp: 350 },
    { name: "Intel Xeon Platinum 8480+",vendor:"Intel", gen: "4th Gen (Sapphire Rapids)",cores: 56, tdp: 350 },
    { name: "Intel Xeon Platinum 8490H",vendor:"Intel", gen: "4th Gen (Sapphire Rapids)",cores: 60, tdp: 350 },

    /* --- Intel Xeon 5th Gen (Emerald Rapids) --- */
    { name: "Intel Xeon Bronze 3508U", vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 8, sockets: 1, base: 2.1, tdp: 125 },
    { name: "Intel Xeon Gold 5515+", vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 8, sockets: 2, base: 3.2, tdp: 165 },
    { name: "Intel Xeon Gold 6534", vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 8, sockets: 2, base: 3.9, tdp: 195 },
    { name: "Intel Xeon Silver 4509Y", vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 8, sockets: 2, base: 2.6, tdp: 125 },
    { name: "Intel Xeon Silver 4510", vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 12, sockets: 2, base: 2.4, tdp: 150 },
    { name: "Intel Xeon Silver 4510T", vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 12, sockets: 2, base: 2, tdp: 115 },
    { name: "Intel Xeon Gold 6526Y", vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 16, sockets: 2, base: 2.8, tdp: 195 },
    { name: "Intel Xeon Gold 6544Y", vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 16, sockets: 2, base: 3.6, tdp: 270 },
    { name: "Intel Xeon Silver 4514Y", vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 16, sockets: 2, base: 2, tdp: 150 },
    { name: "Intel Xeon Gold 6542Y", vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 24, sockets: 2, base: 2.9, tdp: 250 },
    { name: "Intel Xeon Silver 4516Y+", vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 24, sockets: 2, base: 2.2, tdp: 185 },
    { name: "Intel Xeon Gold 5512U", vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 28, sockets: 1, base: 2.1, tdp: 185 },
    { name: "Intel Xeon Gold 5520+", vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 28, sockets: 2, base: 2.2, tdp: 205 },
    { name: "Intel Xeon Gold 6530", vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 32, sockets: 2, base: 2.1, tdp: 270 },
    { name: "Intel Xeon Gold 6538N", vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 32, sockets: 2, base: 2.1, tdp: 205 },
    { name: "Intel Xeon Gold 6538Y+", vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 32, sockets: 2, base: 2.2, tdp: 225 },
    { name: "Intel Xeon Gold 6548N", vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 32, sockets: 2, base: 2.8, tdp: 250 },
    { name: "Intel Xeon Gold 6548Y+", vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 32, sockets: 2, base: 2.5, tdp: 250 },
    { name: "Intel Xeon Gold 6558Q", vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 32, sockets: 2, base: 3.2, tdp: 350 },
    { name: "Intel Xeon Platinum 8562Y+", vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 32, sockets: 2, base: 2.8, tdp: 300 },
    { name: "Intel Xeon Gold 6554S", vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 36, sockets: 2, base: 2.2, tdp: 270 },
    { name: "Intel Xeon Platinum 8558", vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 48, sockets: 2, base: 2.1, tdp: 330 },
    { name: "Intel Xeon Platinum 8558P", vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 48, sockets: 2, base: 2.7, tdp: 350 },
    { name: "Intel Xeon Platinum 8558U", vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 48, sockets: 1, base: 2, tdp: 300 },
    { name: "Intel Xeon Platinum 8568Y+", vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 48, sockets: 2, base: 2.3, tdp: 350 },
    { name: "Intel Xeon Platinum 8571N", vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 52, sockets: 1, base: 2.4, tdp: 350 },
    { name: "Intel Xeon Platinum 8570", vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 56, sockets: 2, base: 2.1, tdp: 350 },
    { name: "Intel Xeon Platinum 8580", vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 60, sockets: 2, base: 2, tdp: 350 },
    { name: "Intel Xeon Platinum 8581V", vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 60, sockets: 1, base: 2, tdp: 270 },
    { name: "Intel Xeon Platinum 8592+", vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 64, sockets: 2, base: 1.9, tdp: 350 },
    { name: "Intel Xeon Platinum 8592V", vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 64, sockets: 2, base: 2, tdp: 330 },
    { name: "Intel Xeon Platinum 8593Q", vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 64, sockets: 2, base: 2.2, tdp: 385 },

    /* --- Intel Xeon 6 P-cores 6500P/6700P (Granite Rapids-SP) --- */
    { name: "Intel Xeon 6 6507P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-SP)", cores: 8, sockets: 2, base: 3.5, tdp: 150 },
    { name: "Intel Xeon 6 6714P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-SP)", cores: 8, sockets: 8, base: 4, tdp: 165 },
    { name: "Intel Xeon 6 6505P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-SP)", cores: 12, sockets: 2, base: 2.2, tdp: 150 },
    { name: "Intel Xeon 6 6511P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-SP)", cores: 16, sockets: 1, base: 2.3, tdp: 150 },
    { name: "Intel Xeon 6 6515P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-SP)", cores: 16, sockets: 2, base: 2.3, tdp: 150 },
    { name: "Intel Xeon 6 6517P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-SP)", cores: 16, sockets: 2, base: 3.2, tdp: 190 },
    { name: "Intel Xeon 6 6724P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-SP)", cores: 16, sockets: 8, base: 3.6, tdp: 210 },
    { name: "Intel Xeon 6 6520P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-SP)", cores: 24, sockets: 2, base: 2.4, tdp: 210 },
    { name: "Intel Xeon 6 6521P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-SP)", cores: 24, sockets: 1, base: 2.6, tdp: 225 },
    { name: "Intel Xeon 6 6527P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-SP)", cores: 24, sockets: 2, base: 3, tdp: 250 },
    { name: "Intel Xeon 6 6728P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-SP)", cores: 24, sockets: 8, base: 2.7, tdp: 210 },
    { name: "Intel Xeon 6 6530P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-SP)", cores: 32, sockets: 2, base: 2.3, tdp: 225 },
    { name: "Intel Xeon 6 6730P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-SP)", cores: 32, sockets: 2, base: 2.5, tdp: 250 },
    { name: "Intel Xeon 6 6731P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-SP)", cores: 32, sockets: 1, base: 2.5, tdp: 245 },
    { name: "Intel Xeon 6 6732P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-SP)", cores: 32, sockets: 2, base: 3.8, tdp: 350 },
    { name: "Intel Xeon 6 6737P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-SP)", cores: 32, sockets: 2, base: 2.9, tdp: 270 },
    { name: "Intel Xeon 6 6738P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-SP)", cores: 32, sockets: 8, base: 2.9, tdp: 270 },
    { name: "Intel Xeon 6 6745P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-SP)", cores: 32, sockets: 2, base: 3.1, tdp: 300 },
    { name: "Intel Xeon 6 6736P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-SP)", cores: 36, sockets: 2, base: 2, tdp: 205 },
    { name: "Intel Xeon 6 6740P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-SP)", cores: 48, sockets: 2, base: 2.1, tdp: 270 },
    { name: "Intel Xeon 6 6741P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-SP)", cores: 48, sockets: 1, base: 2.5, tdp: 300 },
    { name: "Intel Xeon 6 6747P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-SP)", cores: 48, sockets: 2, base: 2.7, tdp: 350 },
    { name: "Intel Xeon 6 6748P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-SP)", cores: 48, sockets: 2, base: 2.5, tdp: 300 },
    { name: "Intel Xeon 6 6760P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-SP)", cores: 64, sockets: 2, base: 2.2, tdp: 330 },
    { name: "Intel Xeon 6 6761P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-SP)", cores: 64, sockets: 1, base: 2.5, tdp: 350 },
    { name: "Intel Xeon 6 6762P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-SP)", cores: 64, sockets: 2, base: 2.9, tdp: 350 },
    { name: "Intel Xeon 6 6767P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-SP)", cores: 64, sockets: 2, base: 2.4, tdp: 350 },
    { name: "Intel Xeon 6 6768P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-SP)", cores: 64, sockets: 8, base: 2.4, tdp: 330 },
    { name: "Intel Xeon 6 6774P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-SP)", cores: 64, sockets: 1, base: 2.5, tdp: 350 },
    { name: "Intel Xeon 6 6776P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-SP)", cores: 64, sockets: 2, base: 2.3, tdp: 350 },
    { name: "Intel Xeon 6 6781P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-SP)", cores: 80, sockets: 1, base: 2, tdp: 350 },
    { name: "Intel Xeon 6 6787P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-SP)", cores: 86, sockets: 2, base: 2, tdp: 350 },
    { name: "Intel Xeon 6 6788P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-SP)", cores: 86, sockets: 8, base: 2, tdp: 350 },

    /* --- Intel Xeon 6 P-cores 6900P (Granite Rapids-AP) --- */
    { name: "Intel Xeon 6 6944P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-AP)", cores: 72, sockets: 2, base: 1.8, tdp: 350 },
    { name: "Intel Xeon 6 6960P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-AP)", cores: 72, sockets: 2, base: 2.7, tdp: 500 },
    { name: "Intel Xeon 6 6962P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-AP)", cores: 72, sockets: 2, base: 2.7, tdp: 500 },
    { name: "Intel Xeon 6 6952P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-AP)", cores: 96, sockets: 2, base: 2.1, tdp: 400 },
    { name: "Intel Xeon 6 6972P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-AP)", cores: 96, sockets: 2, base: 2.4, tdp: 500 },
    { name: "Intel Xeon 6 6979P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-AP)", cores: 120, sockets: 2, base: 2.1, tdp: 500 },
    { name: "Intel Xeon 6 6980P", vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids-AP)", cores: 128, sockets: 2, base: 2, tdp: 500 },

    /* --- Intel Xeon 6 E-cores (Sierra Forest) --- */
    { name: "Intel Xeon 6 6710E", vendor: "Intel", gen: "Xeon 6 E-core (Sierra Forest)", cores: 64, sockets: 2, base: 2.4, tdp: 205 },
    { name: "Intel Xeon 6 6731E", vendor: "Intel", gen: "Xeon 6 E-core (Sierra Forest)", cores: 96, sockets: 1, base: 2.2, tdp: 250 },
    { name: "Intel Xeon 6 6740E", vendor: "Intel", gen: "Xeon 6 E-core (Sierra Forest)", cores: 96, sockets: 2, base: 2.4, tdp: 250 },
    { name: "Intel Xeon 6 6746E", vendor: "Intel", gen: "Xeon 6 E-core (Sierra Forest)", cores: 112, sockets: 2, base: 2, tdp: 250 },
    { name: "Intel Xeon 6 6756E", vendor: "Intel", gen: "Xeon 6 E-core (Sierra Forest)", cores: 128, sockets: 2, base: 1.8, tdp: 225 },
    { name: "Intel Xeon 6 6766E", vendor: "Intel", gen: "Xeon 6 E-core (Sierra Forest)", cores: 144, sockets: 2, base: 1.9, tdp: 250 },
    { name: "Intel Xeon 6 6780E", vendor: "Intel", gen: "Xeon 6 E-core (Sierra Forest)", cores: 144, sockets: 2, base: 2.2, tdp: 330 },

    /* --- Intel Xeon D-2700 (Ice Lake-D) --- */
    { name: "Intel Xeon D-2712T", vendor: "Intel", gen: "Xeon D-2700 (Ice Lake-D)", cores: 4, sockets: 1, base: 1.9, tdp: 65 },
    { name: "Intel Xeon D-2733NT", vendor: "Intel", gen: "Xeon D-2700 (Ice Lake-D)", cores: 8, sockets: 1, base: 2.1, tdp: 80 },
    { name: "Intel Xeon D-2738", vendor: "Intel", gen: "Xeon D-2700 (Ice Lake-D)", cores: 8, sockets: 1, base: 2.5, tdp: 88 },
    { name: "Intel Xeon D-2752NTE", vendor: "Intel", gen: "Xeon D-2700 (Ice Lake-D)", cores: 12, sockets: 1, base: 1.9, tdp: 84 },
    { name: "Intel Xeon D-2752TER", vendor: "Intel", gen: "Xeon D-2700 (Ice Lake-D)", cores: 12, sockets: 1, base: 1.8, tdp: 77 },
    { name: "Intel Xeon D-2753NT", vendor: "Intel", gen: "Xeon D-2700 (Ice Lake-D)", cores: 12, sockets: 1, base: 2, tdp: 87 },
    { name: "Intel Xeon D-2766NT", vendor: "Intel", gen: "Xeon D-2700 (Ice Lake-D)", cores: 14, sockets: 1, base: 2, tdp: 97 },
    { name: "Intel Xeon D-2775TE", vendor: "Intel", gen: "Xeon D-2700 (Ice Lake-D)", cores: 16, sockets: 1, base: 2, tdp: 100 },
    { name: "Intel Xeon D-2776NT", vendor: "Intel", gen: "Xeon D-2700 (Ice Lake-D)", cores: 16, sockets: 1, base: 2.1, tdp: 117 },
    { name: "Intel Xeon D-2779", vendor: "Intel", gen: "Xeon D-2700 (Ice Lake-D)", cores: 16, sockets: 1, base: 2.5, tdp: 126 },
    { name: "Intel Xeon D-2786NTE", vendor: "Intel", gen: "Xeon D-2700 (Ice Lake-D)", cores: 18, sockets: 1, base: 2.1, tdp: 118 },
    { name: "Intel Xeon D-2795NT", vendor: "Intel", gen: "Xeon D-2700 (Ice Lake-D)", cores: 20, sockets: 1, base: 2, tdp: 110 },
    { name: "Intel Xeon D-2796NT", vendor: "Intel", gen: "Xeon D-2700 (Ice Lake-D)", cores: 20, sockets: 1, base: 2, tdp: 120 },
    { name: "Intel Xeon D-2796TE", vendor: "Intel", gen: "Xeon D-2700 (Ice Lake-D)", cores: 20, sockets: 1, base: 2, tdp: 118 },
    { name: "Intel Xeon D-2798NT", vendor: "Intel", gen: "Xeon D-2700 (Ice Lake-D)", cores: 20, sockets: 1, base: 2.1, tdp: 125 },
    { name: "Intel Xeon D-2799", vendor: "Intel", gen: "Xeon D-2700 (Ice Lake-D)", cores: 20, sockets: 1, base: 2.4, tdp: 129 },

    /* --- AMD EPYC 3rd Gen (Milan) --- */
    { name: "AMD EPYC 7313",  vendor: "AMD", gen: "3rd Gen (Milan)", cores: 16, tdp: 155 },
    { name: "AMD EPYC 7413",  vendor: "AMD", gen: "3rd Gen (Milan)", cores: 24, tdp: 180 },
    { name: "AMD EPYC 7443",  vendor: "AMD", gen: "3rd Gen (Milan)", cores: 24, tdp: 200 },
    { name: "AMD EPYC 7453",  vendor: "AMD", gen: "3rd Gen (Milan)", cores: 28, tdp: 225 },
    { name: "AMD EPYC 7513",  vendor: "AMD", gen: "3rd Gen (Milan)", cores: 32, tdp: 200 },
    { name: "AMD EPYC 7543",  vendor: "AMD", gen: "3rd Gen (Milan)", cores: 32, tdp: 225 },
    { name: "AMD EPYC 7643",  vendor: "AMD", gen: "3rd Gen (Milan)", cores: 48, tdp: 225 },
    { name: "AMD EPYC 7713",  vendor: "AMD", gen: "3rd Gen (Milan)", cores: 64, tdp: 225 },
    { name: "AMD EPYC 7763",  vendor: "AMD", gen: "3rd Gen (Milan)", cores: 64, tdp: 280 },

    /* --- AMD EPYC 4th Gen (Genoa) --- */
    { name: "AMD EPYC 9124", vendor: "AMD", gen: "4th Gen (Genoa)", cores: 16, sockets: 2, base: 3, tdp: 200 },
    { name: "AMD EPYC 9174F", vendor: "AMD", gen: "4th Gen (Genoa)", cores: 16, sockets: 2, base: 4.1, tdp: 320 },
    { name: "AMD EPYC 9184X", vendor: "AMD", gen: "4th Gen (Genoa)", cores: 16, sockets: 2, base: 3.55, tdp: 320 },
    { name: "AMD EPYC 9224", vendor: "AMD", gen: "4th Gen (Genoa)", cores: 24, sockets: 2, base: 2.5, tdp: 200 },
    { name: "AMD EPYC 9254", vendor: "AMD", gen: "4th Gen (Genoa)", cores: 24, sockets: 2, base: 2.9, tdp: 220 },
    { name: "AMD EPYC 9274F", vendor: "AMD", gen: "4th Gen (Genoa)", cores: 24, sockets: 2, base: 4.05, tdp: 320 },
    { name: "AMD EPYC 9334", vendor: "AMD", gen: "4th Gen (Genoa)", cores: 32, sockets: 2, base: 2.7, tdp: 210 },
    { name: "AMD EPYC 9354", vendor: "AMD", gen: "4th Gen (Genoa)", cores: 32, sockets: 2, base: 3.25, tdp: 280 },
    { name: "AMD EPYC 9354P", vendor: "AMD", gen: "4th Gen (Genoa)", cores: 32, sockets: 1, base: 3.25, tdp: 280 },
    { name: "AMD EPYC 9374F", vendor: "AMD", gen: "4th Gen (Genoa)", cores: 32, sockets: 2, base: 3.85, tdp: 320 },
    { name: "AMD EPYC 9384X", vendor: "AMD", gen: "4th Gen (Genoa)", cores: 32, sockets: 2, base: 3.1, tdp: 320 },
    { name: "AMD EPYC 9454", vendor: "AMD", gen: "4th Gen (Genoa)", cores: 48, sockets: 2, base: 2.75, tdp: 290 },
    { name: "AMD EPYC 9454P", vendor: "AMD", gen: "4th Gen (Genoa)", cores: 48, sockets: 1, base: 2.75, tdp: 290 },
    { name: "AMD EPYC 9474F", vendor: "AMD", gen: "4th Gen (Genoa)", cores: 48, sockets: 2, base: 3.6, tdp: 360 },
    { name: "AMD EPYC 9534", vendor: "AMD", gen: "4th Gen (Genoa)", cores: 64, sockets: 2, base: 2.45, tdp: 280 },
    { name: "AMD EPYC 9554", vendor: "AMD", gen: "4th Gen (Genoa)", cores: 64, sockets: 2, base: 3.1, tdp: 360 },
    { name: "AMD EPYC 9554P", vendor: "AMD", gen: "4th Gen (Genoa)", cores: 64, sockets: 1, base: 3.1, tdp: 360 },
    { name: "AMD EPYC 9634", vendor: "AMD", gen: "4th Gen (Genoa)", cores: 84, sockets: 2, base: 2.25, tdp: 290 },
    { name: "AMD EPYC 9654", vendor: "AMD", gen: "4th Gen (Genoa)", cores: 96, sockets: 2, base: 2.4, tdp: 360 },
    { name: "AMD EPYC 9654P", vendor: "AMD", gen: "4th Gen (Genoa)", cores: 96, sockets: 1, base: 2.4, tdp: 360 },
    { name: "AMD EPYC 9684X", vendor: "AMD", gen: "4th Gen (Genoa)", cores: 96, sockets: 2, base: 2.55, tdp: 400 },

    /* --- AMD EPYC 4th Gen (Bergamo) --- */
    { name: "AMD EPYC 9734", vendor: "AMD", gen: "4th Gen (Bergamo)", cores: 112, sockets: 2, base: 2.2, tdp: 340 },
    { name: "AMD EPYC 9754", vendor: "AMD", gen: "4th Gen (Bergamo)", cores: 128, sockets: 2, base: 2.25, tdp: 360 },
    { name: "AMD EPYC 9754S", vendor: "AMD", gen: "4th Gen (Bergamo)", cores: 128, sockets: 2, base: 2.25, tdp: 360 },

    /* --- AMD EPYC 4th Gen (Siena) --- */
    { name: "AMD EPYC 8024P", vendor: "AMD", gen: "4th Gen (Siena)", cores: 8, sockets: 1, base: 2.4, tdp: 90 },
    { name: "AMD EPYC 8024PN", vendor: "AMD", gen: "4th Gen (Siena)", cores: 8, sockets: 1, base: 2.05, tdp: 80 },
    { name: "AMD EPYC 8124P", vendor: "AMD", gen: "4th Gen (Siena)", cores: 16, sockets: 1, base: 2.45, tdp: 125 },
    { name: "AMD EPYC 8124PN", vendor: "AMD", gen: "4th Gen (Siena)", cores: 16, sockets: 1, base: 2, tdp: 100 },
    { name: "AMD EPYC 8224P", vendor: "AMD", gen: "4th Gen (Siena)", cores: 24, sockets: 1, base: 2.55, tdp: 160 },
    { name: "AMD EPYC 8224PN", vendor: "AMD", gen: "4th Gen (Siena)", cores: 24, sockets: 1, base: 2, tdp: 120 },
    { name: "AMD EPYC 8324P", vendor: "AMD", gen: "4th Gen (Siena)", cores: 32, sockets: 1, base: 2.65, tdp: 180 },
    { name: "AMD EPYC 8324PN", vendor: "AMD", gen: "4th Gen (Siena)", cores: 32, sockets: 1, base: 2.05, tdp: 130 },
    { name: "AMD EPYC 8434P", vendor: "AMD", gen: "4th Gen (Siena)", cores: 48, sockets: 1, base: 2.5, tdp: 200 },
    { name: "AMD EPYC 8434PN", vendor: "AMD", gen: "4th Gen (Siena)", cores: 48, sockets: 1, base: 2, tdp: 155 },
    { name: "AMD EPYC 8534P", vendor: "AMD", gen: "4th Gen (Siena)", cores: 64, sockets: 1, base: 2.3, tdp: 200 },
    { name: "AMD EPYC 8534PN", vendor: "AMD", gen: "4th Gen (Siena)", cores: 64, sockets: 1, base: 2, tdp: 175 },

    /* --- AMD EPYC 5th Gen (Turin) --- */
    { name: "AMD EPYC 9015", vendor: "AMD", gen: "5th Gen (Turin)", cores: 8, sockets: 2, base: 3.6, tdp: 125 },
    { name: "AMD EPYC 9115", vendor: "AMD", gen: "5th Gen (Turin)", cores: 16, sockets: 2, base: 2.6, tdp: 125 },
    { name: "AMD EPYC 9135", vendor: "AMD", gen: "5th Gen (Turin)", cores: 16, sockets: 2, base: 3.65, tdp: 200 },
    { name: "AMD EPYC 9175F", vendor: "AMD", gen: "5th Gen (Turin)", cores: 16, sockets: 2, base: 4.2, tdp: 320 },
    { name: "AMD EPYC 9255", vendor: "AMD", gen: "5th Gen (Turin)", cores: 24, sockets: 2, base: 3.25, tdp: 200 },
    { name: "AMD EPYC 9275F", vendor: "AMD", gen: "5th Gen (Turin)", cores: 24, sockets: 2, base: 4.1, tdp: 320 },
    { name: "AMD EPYC 9335", vendor: "AMD", gen: "5th Gen (Turin)", cores: 32, sockets: 2, base: 3, tdp: 210 },
    { name: "AMD EPYC 9355", vendor: "AMD", gen: "5th Gen (Turin)", cores: 32, sockets: 2, base: 3.55, tdp: 280 },
    { name: "AMD EPYC 9355P", vendor: "AMD", gen: "5th Gen (Turin)", cores: 32, sockets: 1, base: 3.55, tdp: 280 },
    { name: "AMD EPYC 9375F", vendor: "AMD", gen: "5th Gen (Turin)", cores: 32, sockets: 2, base: 3.8, tdp: 320 },
    { name: "AMD EPYC 9365", vendor: "AMD", gen: "5th Gen (Turin)", cores: 36, sockets: 2, base: 3.4, tdp: 300 },
    { name: "AMD EPYC 9455", vendor: "AMD", gen: "5th Gen (Turin)", cores: 48, sockets: 2, base: 3.15, tdp: 300 },
    { name: "AMD EPYC 9455P", vendor: "AMD", gen: "5th Gen (Turin)", cores: 48, sockets: 1, base: 3.15, tdp: 300 },
    { name: "AMD EPYC 9475F", vendor: "AMD", gen: "5th Gen (Turin)", cores: 48, sockets: 2, base: 3.65, tdp: 400 },
    { name: "AMD EPYC 9535", vendor: "AMD", gen: "5th Gen (Turin)", cores: 64, sockets: 2, base: 2.4, tdp: 300 },
    { name: "AMD EPYC 9555", vendor: "AMD", gen: "5th Gen (Turin)", cores: 64, sockets: 2, base: 3.2, tdp: 360 },
    { name: "AMD EPYC 9555P", vendor: "AMD", gen: "5th Gen (Turin)", cores: 64, sockets: 1, base: 3.2, tdp: 360 },
    { name: "AMD EPYC 9575F", vendor: "AMD", gen: "5th Gen (Turin)", cores: 64, sockets: 2, base: 3.3, tdp: 400 },
    { name: "AMD EPYC 9565", vendor: "AMD", gen: "5th Gen (Turin)", cores: 72, sockets: 2, base: 3.15, tdp: 400 },
    { name: "AMD EPYC 9655", vendor: "AMD", gen: "5th Gen (Turin)", cores: 96, sockets: 2, base: 2.5, tdp: 400 },
    { name: "AMD EPYC 9655P", vendor: "AMD", gen: "5th Gen (Turin)", cores: 96, sockets: 1, base: 2.5, tdp: 400 },
    { name: "AMD EPYC 9755", vendor: "AMD", gen: "5th Gen (Turin)", cores: 128, sockets: 2, base: 2.7, tdp: 500 },

    /* --- AMD EPYC 5th Gen (Turin Dense) --- */
    { name: "AMD EPYC 9645", vendor: "AMD", gen: "5th Gen (Turin Dense)", cores: 96, sockets: 2, base: 2.3, tdp: 320 },
    { name: "AMD EPYC 9745", vendor: "AMD", gen: "5th Gen (Turin Dense)", cores: 128, sockets: 2, base: 2.4, tdp: 400 },
    { name: "AMD EPYC 9825", vendor: "AMD", gen: "5th Gen (Turin Dense)", cores: 144, sockets: 2, base: 2.2, tdp: 390 },
    { name: "AMD EPYC 9845", vendor: "AMD", gen: "5th Gen (Turin Dense)", cores: 160, sockets: 2, base: 2.1, tdp: 390 },
    { name: "AMD EPYC 9965", vendor: "AMD", gen: "5th Gen (Turin Dense)", cores: 192, sockets: 2, base: 2.25, tdp: 500 },

    /* --- AMD EPYC 5th Gen (Sorano) --- */
    { name: "AMD EPYC 8025P", vendor: "AMD", gen: "5th Gen (Sorano)", cores: 8, sockets: 1, base: 2.9, tdp: 95 },
    { name: "AMD EPYC 8125P", vendor: "AMD", gen: "5th Gen (Sorano)", cores: 16, sockets: 1, base: 2.65, tdp: 125 },
    { name: "AMD EPYC 8225P", vendor: "AMD", gen: "5th Gen (Sorano)", cores: 24, sockets: 1, base: 2.95, tdp: 160 },
    { name: "AMD EPYC 8325P", vendor: "AMD", gen: "5th Gen (Sorano)", cores: 32, sockets: 1, base: 2.7, tdp: 175 },
    { name: "AMD EPYC 8435P", vendor: "AMD", gen: "5th Gen (Sorano)", cores: 48, sockets: 1, base: 2.45, tdp: 200 },
    { name: "AMD EPYC 8535P", vendor: "AMD", gen: "5th Gen (Sorano)", cores: 64, sockets: 1, base: 2, tdp: 210 },
    { name: "AMD EPYC 8635P", vendor: "AMD", gen: "5th Gen (Sorano)", cores: 84, sockets: 1, base: 1.6, tdp: 225 }
  ];

  /* ================================================================
     AZURE LOCAL CATALOG NODE TYPES
     Systems listed as "Current (2026 or later)" in the Azure Local
     solutions catalog (https://azurelocalsolutions.azure.microsoft.com/#/catalog).
     The catalog publishes the CPU generation and the supported cores per
     socket of each system, not individual CPU models. "note" explains
     values that had to be inferred because the catalog entry was incomplete.
     ================================================================ */
  const CATALOG_DATE = "2026-10-01";
  const nodeTypes = [
    { vendor: "Armada", name: "Galleon - Cruiser", family: "Intel", model: "6th Gen Xeon Scalable", sockets: 2, cores: [8, 12, 16, 24, 32, 36, 48, 64, 80, 86], maxCores: 172, nodes: [1, 16], form: "Rack", arch: "Hyperconverged", aldo: true, note: "sockets inferred from maximum cores; core options taken from other systems with the same CPU generation" },
    { vendor: "Armada", name: "Galleon - Triton", family: "Intel", model: "6th Gen Xeon Scalable", sockets: 2, cores: [8, 12, 16, 24, 32, 36, 48, 64, 80, 86], maxCores: 172, nodes: [1, 16], form: "Rack", arch: "Hyperconverged", aldo: true, note: "sockets inferred from maximum cores; core options taken from other systems with the same CPU generation" },
    { vendor: "DataON", name: "DataON AZL-8208i Intel Xeon 6", family: "Intel", model: "6th Gen Xeon Scalable", sockets: 2, cores: [8, 16, 24, 32], maxCores: 128, nodes: [1, 64], form: "Rack", arch: "Disaggregated/Hyperconverged", aldo: true, note: "" },
    { vendor: "DataON", name: "DataON AZL-8224i Intel Xeon 6", family: "Intel", model: "6th Gen Xeon Scalable", sockets: 2, cores: [8, 16, 24, 32], maxCores: 128, nodes: [1, 64], form: "Rack", arch: "Disaggregated/Hyperconverged", aldo: true, note: "" },
    { vendor: "DataON", name: "DataON AZS-8112a 5th Gen AMD EPYC", family: "AMD", model: "5th Gen EPYC", sockets: 1, cores: [8, 16, 24, 32, 36, 48], maxCores: 48, nodes: [1, 16], form: "Rack", arch: "Hyperconverged", note: "core options above the system maximum (48 cores) removed" },
    { vendor: "Dell Technologies", name: "AX-4000r/z with AX-4510c", family: "Intel", model: "Xeon D 27xx", sockets: 1, cores: [8, 16, 20], maxCores: 20, nodes: [1, 16], form: "Rugged", arch: "Hyperconverged", aldo: true, note: "" },
    { vendor: "Dell Technologies", name: "AX-4000r/z with AX-4520c", family: "Intel", model: "Xeon D 27xx", sockets: 1, cores: [8, 16, 20], maxCores: 20, nodes: [1, 16], form: "Rugged", arch: "Hyperconverged", aldo: true, note: "" },
    { vendor: "Dell Technologies", name: "AX-660", family: "Intel", model: "5th Gen Xeon Scalable", sockets: 2, cores: [8, 12, 16, 20, 24, 28, 32, 40, 48, 52, 56, 60], maxCores: 120, nodes: [1, 16], form: "Rack", arch: "Hyperconverged", aldo: true, note: "core options above the system maximum (120 cores) removed" },
    { vendor: "Dell Technologies", name: "AX-670", family: "Intel", model: "6th Gen Xeon Scalable", sockets: 2, cores: [8, 12, 16, 24, 32, 36, 48, 64, 86], maxCores: 172, nodes: [1, 16], form: "Rack", arch: "Hyperconverged", aldo: true, note: "" },
    { vendor: "Dell Technologies", name: "AX-760", family: "Intel", model: "5th Gen Xeon Scalable", sockets: 2, cores: [8, 12, 16, 20, 24, 28, 32, 40, 48, 52, 56, 60, 64], maxCores: 128, nodes: [1, 16], form: "Rack", arch: "Hyperconverged", aldo: true, note: "" },
    { vendor: "Dell Technologies", name: "AX-770", family: "Intel", model: "6th Gen Xeon Scalable", sockets: 2, cores: [8, 12, 16, 24, 32, 36, 48, 64, 86], maxCores: 172, nodes: [1, 16], form: "Rack", arch: "Hyperconverged", aldo: true, note: "" },
    { vendor: "Dell Technologies", name: "PowerEdge R660, enabled with Dell Private Cloud", family: "Intel", model: "5th Gen Xeon Scalable", sockets: 2, cores: [8, 10, 12, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64], maxCores: 128, nodes: [1, 64], form: "Rack", arch: "Disaggregated", aldo: true, note: "sockets inferred from maximum cores; core options taken from other systems with the same CPU generation" },
    { vendor: "Dell Technologies", name: "PowerEdge R670, enabled with Dell Private Cloud", family: "Intel", model: "6th Gen Xeon Scalable", sockets: 2, cores: [8, 12, 16, 24, 32, 36, 48, 64, 80, 86], maxCores: 172, nodes: [1, 64], form: "Rack", arch: "Disaggregated", aldo: true, note: "sockets inferred from maximum cores; core options taken from other systems with the same CPU generation" },
    { vendor: "Dell Technologies", name: "PowerEdge R760, enabled with Dell Private Cloud", family: "Intel", model: "5th Gen Xeon Scalable", sockets: 2, cores: [8, 10, 12, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64], maxCores: 128, nodes: [1, 64], form: "Rack", arch: "Disaggregated", aldo: true, note: "sockets inferred from maximum cores; core options taken from other systems with the same CPU generation" },
    { vendor: "Dell Technologies", name: "PowerEdge R770, enabled with Dell Private Cloud", family: "Intel", model: "6th Gen Xeon Scalable", sockets: 2, cores: [8, 12, 16, 24, 32, 36, 48, 64, 80, 86], maxCores: 172, nodes: [1, 64], form: "Rack", arch: "Disaggregated", aldo: true, note: "sockets inferred from maximum cores; core options taken from other systems with the same CPU generation" },
    { vendor: "Hewlett Packard Enterprise", name: "HPE ProLiant Compute DL360 Gen12 Server Premier Solution", family: "Intel", model: "6th Gen Xeon Scalable", sockets: 2, cores: [8, 12, 16, 24, 32, 36, 48, 64, 86], maxCores: 172, nodes: [1, 64], form: "Rack", arch: "Disaggregated/Hyperconverged", aldo: true, note: "" },
    { vendor: "Hewlett Packard Enterprise", name: "HPE ProLiant Compute DL380 Gen12 Server Premier Solution", family: "Intel", model: "6th Gen Xeon Scalable", sockets: 2, cores: [8, 12, 16, 24, 32, 36, 48, 64, 86], maxCores: 172, nodes: [1, 64], form: "Rack", arch: "Disaggregated/Hyperconverged", aldo: true, note: "" },
    { vendor: "Hewlett Packard Enterprise", name: "HPE ProLiant DL145 Gen11 Server Premier Solution", family: "AMD", model: "5th Gen EPYC", sockets: 1, cores: [16, 24, 32, 48, 64, 84], maxCores: 84, nodes: [1, 16], form: "Rack", arch: "Hyperconverged", aldo: true, note: "" },
    { vendor: "Hewlett Packard Enterprise", name: "HPE ProLiant DL380 Gen11 Server Premier Solution for Azure Local", family: "Intel", model: "5th Gen Xeon Scalable", sockets: 2, cores: [8, 12, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64], maxCores: 128, nodes: [1, 64], form: "Rack", arch: "Disaggregated/Hyperconverged", aldo: true, note: "" },
    { vendor: "Hitachi", name: "Hitachi Advanced Server HA810 G6", family: "Intel", model: "6th Gen Xeon Scalable", sockets: 2, cores: [8, 12, 16, 24, 32, 36, 48, 64, 80, 86], maxCores: 172, nodes: [1, 64], form: "Rack", arch: "Disaggregated", note: "sockets inferred from maximum cores; core options taken from other systems with the same CPU generation" },
    { vendor: "Hitachi", name: "Hitachi Advanced Server HA820 G6", family: "Intel", model: "6th Gen Xeon Scalable", sockets: 2, cores: [8, 12, 16, 24, 32, 36, 48, 64, 80, 86], maxCores: 172, nodes: [1, 64], form: "Rack", arch: "Disaggregated", note: "sockets inferred from maximum cores; core options taken from other systems with the same CPU generation" },
    { vendor: "Lenovo", name: "ThinkAgile FX630 V4", family: "Intel", model: "6th Gen Xeon Scalable", sockets: 2, cores: [8, 12, 16, 24, 32, 36, 48, 64, 86], maxCores: 172, nodes: [1, 16], form: "Rack", arch: "Hyperconverged", aldo: true, note: "" },
    { vendor: "Lenovo", name: "ThinkAgile FX650 V4", family: "Intel", model: "6th Gen Xeon Scalable", sockets: 2, cores: [8, 12, 16, 24, 32, 36, 48, 64, 80, 86], maxCores: 172, nodes: [1, 16], form: "Rack", arch: "Hyperconverged", aldo: true, note: "" },
    { vendor: "Lenovo", name: "ThinkAgile MX455 V3 Edge PR", family: "AMD", model: "4th Gen EPYC", sockets: 1, cores: [8, 16, 24, 32, 48, 64], maxCores: 64, nodes: [1, 4], form: "Rack", arch: "Hyperconverged", aldo: true, note: "" },
    { vendor: "Lenovo", name: "ThinkAgile MX630 V3 CN Node", family: "Intel", model: "5th Gen Xeon Scalable", sockets: 2, cores: [8, 10, 12, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64], maxCores: 128, nodes: [1, 16], form: "Rack", arch: "Hyperconverged", note: "" },
    { vendor: "Lenovo", name: "ThinkAgile MX630 V3 Integrated System", family: "Intel", model: "5th Gen Xeon Scalable", sockets: 2, cores: [8, 10, 12, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64], maxCores: 128, nodes: [1, 16], form: "Rack", arch: "Hyperconverged", note: "" },
    { vendor: "Lenovo", name: "ThinkAgile MX630 V4", family: "Intel", model: "6th Gen Xeon Scalable", sockets: 2, cores: [8, 12, 16, 24, 32, 36, 48, 64, 86], maxCores: 172, nodes: [1, 64], form: "Rack", arch: "Disaggregated/Hyperconverged", aldo: true, note: "" },
    { vendor: "Lenovo", name: "ThinkAgile MX650 V3 CN Node", family: "Intel", model: "5th Gen Xeon Scalable", sockets: 2, cores: [8, 10, 12, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64], maxCores: 128, nodes: [1, 16], form: "Rack", arch: "Hyperconverged", note: "" },
    { vendor: "Lenovo", name: "ThinkAgile MX650 V3 Integrated System", family: "Intel", model: "5th Gen Xeon Scalable", sockets: 2, cores: [8, 10, 12, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64], maxCores: 128, nodes: [1, 16], form: "Rack", arch: "Hyperconverged", note: "" },
    { vendor: "Lenovo", name: "ThinkAgile MX650 V3 PR Node", family: "Intel", model: "5th Gen Xeon Scalable", sockets: 2, cores: [8, 10, 12, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64], maxCores: 128, nodes: [1, 16], form: "Rack", arch: "Hyperconverged", aldo: true, note: "" },
    { vendor: "Lenovo", name: "ThinkAgile MX650 V4", family: "Intel", model: "6th Gen Xeon Scalable", sockets: 2, cores: [8, 12, 16, 24, 32, 36, 48, 64, 80, 86], maxCores: 172, nodes: [1, 64], form: "Rack", arch: "Disaggregated/Hyperconverged", aldo: true, note: "" },
    { vendor: "Lenovo", name: "ThinkAgile MX650a V4", family: "Intel", model: "6th Gen Xeon Scalable", sockets: 2, cores: [8, 12, 16, 24, 32, 36, 48, 64, 80, 86], maxCores: 172, nodes: [1, 64], form: "Rack", arch: "Disaggregated/Hyperconverged", aldo: true, note: "" }
  ];

  /* cpuDatabase generations that belong to each catalog CPU generation. The Xeon 6
     catalog systems use the LGA 4710 platform (6500P/6700P and 6700E), not the 6900P. */
  const catalogGenerations = {
    "Intel 6th Gen Xeon Scalable": ["Xeon 6 P-core (Granite Rapids-SP)", "Xeon 6 E-core (Sierra Forest)"],
    "Intel 5th Gen Xeon Scalable": ["5th Gen (Emerald Rapids)"],
    "Intel Xeon D 27xx": ["Xeon D-2700 (Ice Lake-D)"],
    "AMD 5th Gen EPYC": ["5th Gen (Turin)", "5th Gen (Turin Dense)"],
    "AMD 4th Gen EPYC": ["4th Gen (Genoa)", "4th Gen (Bergamo)"]
  };
  /* Systems whose CPU socket is known from their core options: SP6 platforms use EPYC 8004 / 8005 */
  const nodeTypeGenerations = {
    "HPE ProLiant DL145 Gen11 Server Premier Solution": ["5th Gen (Sorano)"],
    "ThinkAgile MX455 V3 Edge PR": ["4th Gen (Siena)"]
  };
  const nodeCpuLabel = p => p.family + " " + p.model;
  const selectedNodeType = () => { const v = $("nodeType").value; return v === "" ? null : nodeTypes[+v]; };
  const cpuSockets = cpu => cpu.sockets || 2;
  const nodeGenerations = p => nodeTypeGenerations[p.name] || catalogGenerations[nodeCpuLabel(p)] || [];
  /* Real CPU models a node type can use: its CPU generation, one of its published
     cores-per-socket options and support for the selected number of sockets */
  const compatibleCpus = (p, sockets) => cpuDatabase
    .filter(c => nodeGenerations(p).includes(c.gen) && p.cores.includes(c.cores) && cpuSockets(c) >= sockets)
    .sort((a, b) => a.cores - b.cores || a.tdp - b.tdp || a.name.localeCompare(b.name));
  /* Catalog core options without any known model of the node type's generation */
  const unmatchedOptions = p => p.cores.filter(n => !cpuDatabase.some(c => nodeGenerations(p).includes(c.gen) && c.cores === n));
  /* Generations sold in the "Current (2026 or later)" catalog systems */
  const currentGenerations = new Set([].concat(...Object.values(catalogGenerations), ...Object.values(nodeTypeGenerations)));
  /* Recommended CPU of a card list: the smallest model with enough cores (current catalog
     generations first, lowest TDP on a tie), else the largest one */
  function recommendCpu(list, minCoresPerSocket) {
    const isCurrent = c => currentGenerations.has(c.gen) ? 0 : 1;
    const fit = list.filter(c => c.cores >= minCoresPerSocket)
      .sort((a, b) => isCurrent(a) - isCurrent(b) || a.cores - b.cores || a.tdp - b.tdp);
    if (fit.length) return fit[0];
    return list.slice().sort((a, b) => b.cores - a.cores || isCurrent(a) - isCurrent(b) || a.tdp - b.tdp)[0] || null;
  }
  /* CPU recommendation cards: with a node type its compatible models, without one the
     smallest fitting model of each generation (or the largest one) */
  function recommendationCandidates(p, sockets, minCoresPerSocket) {
    if (p) return compatibleCpus(p, sockets);
    return [...new Set(cpuDatabase.map(c => c.gen))].map(gen => {
      const list = cpuDatabase.filter(c => c.gen === gen && cpuSockets(c) >= sockets).sort((a, b) => a.cores - b.cores || a.tdp - b.tdp);
      return list.find(c => c.cores >= minCoresPerSocket) || list[list.length - 1];
    }).filter(Boolean);
  }
  /* CPU card the user clicked to size with instead of the recommended one */
  let chosenCpuName = null;
  const cpuSpecs = cpu => cpu.cores + " cores/socket | " + cpu.gen +
    (cpu.base ? " | " + cpu.base.toFixed(1) + " GHz" : "") + (cpu.tdp ? " | TDP " + cpu.tdp + "W" : "") +
    (cpuSockets(cpu) === 1 ? " | single socket only" : "");

  /* CPU imported from ODIN (not part of the recommendation list) */
  let importedCpu = null;
  const findCpu = name => (importedCpu && importedCpu.name === name) ? importedCpu : cpuDatabase.find(c => c.name === name);

  /* ---- chart instances ---- */
  let coreChart = null, nodeChart = null;

  /* ================================================================
     MODE SWITCHING
     ================================================================ */
  $("modeNodesBtn").addEventListener("click", function () {
    this.classList.add("active");
    $("modeCpuBtn").classList.remove("active");
    $("modeNodesPanel").style.display = "block";
    $("modeCpuPanel").style.display = "none";
  });
  $("modeCpuBtn").addEventListener("click", function () {
    this.classList.add("active");
    $("modeNodesBtn").classList.remove("active");
    $("modeCpuPanel").style.display = "block";
    $("modeNodesPanel").style.display = "none";
  });

  /* ================================================================
     POPULATE CPU DROPDOWN
     Without a node type: every CPU of the database. With a node type:
     the catalog core options of that system plus matching example models.
     ================================================================ */
  function fillCpuSelect() {
    const sel = $("cpuSelect"), prev = sel.value, p = selectedNodeType();
    const odin = sel.querySelector("optgroup[data-odin]");
    sel.innerHTML = "";
    if (odin) sel.appendChild(odin);
    const add = (label, items) => {
      if (!items.length) return;
      const og = document.createElement("optgroup");
      og.label = label;
      for (const [value, text] of items) {
        const opt = document.createElement("option");
        opt.value = value;
        opt.textContent = text;
        og.appendChild(opt);
      }
      sel.appendChild(og);
    };
    if (p) {
      const list = compatibleCpus(p, Math.max(num($("socketsPerNode")), 1));
      for (const n of [...new Set(list.map(c => c.cores))]) {
        add(n + " cores per socket", list.filter(c => c.cores === n).map(c =>
          [c.name, c.name + " (" + c.cores + " cores" + (c.base ? ", " + c.base.toFixed(1) + " GHz" : "") + ", " + c.tdp + " W)"]));
      }
    } else {
      const grouped = {};
      for (const cpu of cpuDatabase) {
        const key = cpu.vendor + " - " + cpu.gen;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push([cpu.name, cpu.name + " (" + cpu.cores + " cores)"]);
      }
      for (const [group, items] of Object.entries(grouped)) add(group, items);
    }
    if ([...sel.options].some(o => o.value === prev)) sel.value = prev;
    sel.dispatchEvent(new Event("change"));
  }

  /* show info on change */
  $("cpuSelect").addEventListener("change", function () {
    const cpu = findCpu(this.value);
    $("cpuSelectInfo").textContent = cpu ? cpuSpecs(cpu) : "";
  });

  /* ================================================================
     NODE TYPE (Azure Local catalog)
     ================================================================ */
  (function initNodeTypes() {
    const sel = $("nodeType");
    const any = document.createElement("option");
    any.value = "";
    any.textContent = "Any server (no catalog filter)";
    sel.appendChild(any);
    const vendors = {};
    nodeTypes.forEach((p, i) => { (vendors[p.vendor] = vendors[p.vendor] || []).push(i); });
    for (const vendor of Object.keys(vendors)) {
      const og = document.createElement("optgroup");
      og.label = vendor;
      for (const i of vendors[vendor]) {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = nodeTypes[i].name + " (" + nodeCpuLabel(nodeTypes[i]) + ")";
        og.appendChild(opt);
      }
      sel.appendChild(og);
    }
    sel.addEventListener("change", applyNodeType);
  })();

  /* Limits sockets and node count to the selected system and refreshes the CPU list */
  function applyNodeType() {
    const p = selectedNodeType(), sockets = $("socketsPerNode"), nodeCount = $("nodeCount");
    const dual = sockets.querySelector('option[value="2"]');
    dual.disabled = !!p && p.sockets < 2;
    /* a single-socket system forces 1 socket; restore 2 when the next system allows it again */
    if (dual.disabled) {
      if (sockets.value === "2") sockets.dataset.forced = "1";
      sockets.value = "1";
    } else if (sockets.dataset.forced) {
      sockets.value = "2";
      delete sockets.dataset.forced;
    }
    nodeCount.min = p ? p.nodes[0] : 1;
    nodeCount.max = Math.min(p ? p.nodes[1] : 64, clusterTypes[clusterType()].maxNodes);
    chosenCpuName = null;
    fillCpuSelect();
    updateNodeTypeInfo();
  }

  function updateNodeTypeInfo() {
    const p = selectedNodeType();
    if (!p) { $("nodeTypeInfo").textContent = ""; return; }
    const sockets = Math.max(num($("socketsPerNode")), 1);
    const list = compatibleCpus(p, sockets), missing = unmatchedOptions(p);
    $("nodeTypeInfo").textContent = [p.form + ", " + p.arch,
        p.nodes[0] + " to " + p.nodes[1] + " nodes",
        "up to " + p.sockets + " socket" + (p.sockets > 1 ? "s" : ""),
        nodeCpuLabel(p) + ": " + p.cores.join(", ") + " cores per socket",
        list.length + " compatible CPU model" + (list.length === 1 ? "" : "s") + " for " + sockets + " socket" + (sockets > 1 ? "s" : "") +
          " (" + [...new Set(list.map(c => c.gen))].join(", ") + ")"].join(" | ") +
      (missing.length ? ". No known " + nodeCpuLabel(p) + " model has " + missing.join(", ") + " cores, so these options are not used" : "") +
      (p.note ? ". Note: " + p.note : "") + ". Source: Azure Local catalog, " + CATALOG_DATE + ".";
  }

  /* the socket count changes which CPU models fit (single socket only models) */
  $("socketsPerNode").addEventListener("change", function () {
    if (selectedNodeType()) { fillCpuSelect(); updateNodeTypeInfo(); }
  });

  /* ================================================================
     CLUSTER TYPE
     Disconnected operations (ALDO) management cluster values: Microsoft Learn
     "Dedicated management cluster for disconnected operations" (3 nodes,
     24 physical cores per node, up to 16 machines) and the ODIN Sizer
     (control plane appliance IRVM1 with 24 vCPUs and 78 GB memory, host
     reservation of 20% of the physical cores with a minimum of 2).
     ================================================================ */
  const ALDO = { minCores: 24, nodes: 3, applianceVcpus: 24, applianceMemGB: 78, reservePct: 0.20, reserveMin: 2 };
  const clusterTypes = {
    standard:        { label: "Hyperconverged (Storage Spaces Direct)", arch: "Hyperconverged", maxNodes: 16 },
    disaggregated:   { label: "Disaggregated (external SAN storage)", arch: "Disaggregated", maxNodes: 64 },
    "aldo-mgmt":     { label: "Disconnected operations (ALDO) management cluster", arch: "Hyperconverged", maxNodes: 16 }
  };
  const clusterType = () => clusterTypes[$("clusterType").value] ? $("clusterType").value : "standard";
  const isAldo = () => clusterType() === "aldo-mgmt";
  /* catalog systems a cluster type can use: matching architecture, plus the catalog
     "Disconnected operations" solution capability for the ALDO management cluster */
  const nodeTypeAllowed = p => p.arch.split("/").includes(clusterTypes[clusterType()].arch) && (!isAldo() || !!p.aldo);
  /* host cores reserved per node: the user value, for ALDO at least 20% of the physical cores (min 2) */
  const hostReserve = (physical, mgmt) => isAldo() ? Math.max(mgmt, Math.ceil(ALDO.reservePct * physical), ALDO.reserveMin) : mgmt;
  /* smallest physical cores per node that leave the needed cores after the host reservation */
  function minPhysicalPerNode(needed, mgmt) {
    let p = needed + mgmt;
    while (p - hostReserve(p, mgmt) < needed) p++;
    return isAldo() ? Math.max(p, ALDO.minCores) : p;
  }

  function applyClusterType() {
    const aldo = isAldo(), nt = $("nodeType");
    /* the management cluster only runs the control plane appliance */
    for (const id of ["vmCount", "vcpusPerVm"]) {
      const el = $(id);
      if (aldo && !el.disabled) { el.dataset.userValue = el.value; el.disabled = true; }
      else if (!aldo && el.disabled) { el.value = el.dataset.userValue || el.value; el.disabled = false; delete el.dataset.userValue; }
    }
    if (aldo) { $("vmCount").value = 1; $("vcpusPerVm").value = ALDO.applianceVcpus; }

    for (const opt of nt.querySelectorAll("option")) {
      if (opt.value === "") continue;
      const ok = nodeTypeAllowed(nodeTypes[+opt.value]);
      opt.disabled = !ok;
      opt.title = ok ? "" : (isAldo() ? "No Disconnected operations capability in the Azure Local catalog" : "Not available as " + clusterTypes[clusterType()].arch + " in the Azure Local catalog");
    }
    if (selectedNodeType() && !nodeTypeAllowed(selectedNodeType())) nt.value = "";
    applyNodeType();
    if (+$("nodeCount").value > +$("nodeCount").max) $("nodeCount").value = $("nodeCount").max;

    const allowed = nodeTypes.filter(nodeTypeAllowed).length;
    $("clusterTypeInfo").textContent = {
      standard: "Storage Spaces Direct on the cluster nodes, 1 to 16 nodes.",
      disaggregated: "Compute nodes use external SAN storage (Fibre Channel or iSCSI) instead of Storage Spaces Direct, up to 64 nodes. " + allowed + " catalog systems support this architecture.",
      "aldo-mgmt": "Dedicated cluster that only hosts the disconnected operations control plane appliance (" + ALDO.applianceVcpus + " vCPUs, " + ALDO.applianceMemGB +
        " GB). Production needs " + ALDO.nodes + " nodes with " + ALDO.minCores + "+ physical cores each, and the host reserves at least 20% of the cores. Workloads run on separate clusters. " +
        allowed + " hyperconverged catalog systems have the Disconnected operations capability."
    }[clusterType()];
  }
  $("clusterType").addEventListener("change", () => {
    if (isAldo()) $("nodeCount").value = ALDO.nodes;
    applyClusterType();
  });

  /* result lines for the cluster type */
  function clusterTypeChecks(nodes, physicalPerNode, mgmtPerNode, userMgmt) {
    const t = clusterType();
    if (t === "standard") return "";
    let html = "<strong>Cluster Type:</strong> " + clusterTypes[t].label + "<br>";
    if (t === "disaggregated") {
      html += "<strong>Storage:</strong> external SAN (Fibre Channel or iSCSI), internal drives are boot drives only. Plan the SAN in the Storage Calculator.<br>";
      return html;
    }
    html += "<strong>Workload:</strong> disconnected operations control plane appliance (IRVM1, " + ALDO.applianceVcpus + " vCPUs, " + ALDO.applianceMemGB + " GB memory). Don't deploy other workloads on this cluster.<br>";
    html += "<strong>Host Reservation:</strong> " + mgmtPerNode + " cores per node (the larger of " + userMgmt + " cores and 20% of " + physicalPerNode + " physical cores, min " + ALDO.reserveMin + ")<br>";
    if (physicalPerNode < ALDO.minCores) {
      html += '<span class="warning">' + physicalPerNode + " physical cores per node is below the " + ALDO.minCores + " physical cores the management cluster requires.</span><br>";
    }
    if (nodes < ALDO.nodes) {
      html += '<span class="warning">Production management clusters need ' + ALDO.nodes + " nodes. Smaller management clusters are only for evaluation and proof of concept.</span><br>";
    }
    html += "<strong>Other Minimums per Node:</strong> 128 GB memory (standard, 100+ nodes managed) or 512 GB (datacenter, 1000+ nodes), 6 or 8 data drives of at least 2 TB (SSD/NVMe) and a 960 GB boot drive<br>";
    return html;
  }

  applyClusterType();
  fillCpuSelect();

  /* ================================================================
     SHARED: read common inputs
     ================================================================ */
  function readCommon() {
    const vms            = num($("vmCount"));
    const vcpusPerVm     = num($("vcpusPerVm"));
    const overcommit     = Math.max(num($("overcommitRatio")), 1);
    const mgmtPerNode    = num($("mgmtOverhead"));
    const socketsPerNode = Math.max(num($("socketsPerNode")), 1);
    const haCheckbox     = $("haEnabled").checked;
    const totalVCPUs     = vms * vcpusPerVm;
    const workloadCores  = Math.ceil(totalVCPUs / overcommit);
    return { vms, vcpusPerVm, overcommit, mgmtPerNode, socketsPerNode, haCheckbox, totalVCPUs, workloadCores };
  }

  /* ================================================================
     MODE A: "I know my Nodes - recommend CPU"
     ================================================================ */
  /* the mode of the last calculation, recalculated automatically on input changes */
  let lastRun = null;

  function calculate() {
    lastRun = "nodes";
    const c = readCommon();
    const nodes          = Math.max(num($("nodeCount")), 1);
    const haEnabled      = c.haCheckbox && nodes > 1;
    const workloadNodes  = haEnabled ? nodes - 1 : nodes;

    const coresNeededPerNode   = workloadNodes > 0 ? Math.ceil(c.workloadCores / workloadNodes) : c.workloadCores;
    const minPhysical          = minPhysicalPerNode(coresNeededPerNode, c.mgmtPerNode);
    const minCoresPerSocket    = Math.ceil(minPhysical / c.socketsPerNode);

    /* size with a real CPU: the card the user selected, else the recommended one */
    const nodeType = selectedNodeType();
    const candidates = recommendationCandidates(nodeType, c.socketsPerNode, minCoresPerSocket);
    const recommendedCpu = recommendCpu(candidates, minCoresPerSocket);
    let chosenCpu = chosenCpuName ? candidates.find(x => x.name === chosenCpuName) : null;
    if (chosenCpuName && !chosenCpu) {
      /* keep a selection that is still valid even when it is no longer one of the generation cards */
      const cpu = cpuDatabase.find(x => x.name === chosenCpuName);
      const valid = cpu && (nodeType ? compatibleCpus(nodeType, c.socketsPerNode).includes(cpu) : cpuSockets(cpu) >= c.socketsPerNode);
      if (valid) { chosenCpu = cpu; candidates.push(cpu); } else chosenCpuName = null;
    }
    if (chosenCpu === recommendedCpu) { chosenCpu = null; chosenCpuName = null; }
    const pickedCpu = chosenCpu || recommendedCpu;
    const coresPerSocket = pickedCpu ? pickedCpu.cores : minCoresPerSocket;

    const physicalCoresPerNode   = coresPerSocket * c.socketsPerNode;
    const mgmtPerNode            = hostReserve(physicalCoresPerNode, c.mgmtPerNode);
    const availableCoresPerNode  = Math.max(physicalCoresPerNode - mgmtPerNode, 0);
    const totalAvailableCores    = availableCoresPerNode * workloadNodes;
    const totalMgmtCores         = mgmtPerNode * nodes;
    const totalPhysicalCores     = physicalCoresPerNode * nodes;
    const haCores                = haEnabled ? physicalCoresPerNode : 0;
    const maxVCPUs               = totalAvailableCores * c.overcommit;

    const utilization = totalAvailableCores > 0
      ? Math.min((c.workloadCores / totalAvailableCores) * 100, 999) : 0;

    const fits = c.workloadCores <= totalAvailableCores;
    const minNodesForWorkload = availableCoresPerNode > 0 ? Math.ceil(c.workloadCores / availableCoresPerNode) : 999;
    const minNodesTotal = haEnabled ? minNodesForWorkload + 1 : minNodesForWorkload;

    /* result */
    const rb = $("resultBox");
    rb.style.display = "block";
    let html = '<strong>Mode:</strong> Given ' + nodes + ' nodes, recommend CPU<br>';
    html += "<strong>Total vCPUs Required:</strong> " + c.totalVCPUs + " vCPUs<br>";
    html += "<strong>Physical Cores Required:</strong> " + c.workloadCores + " cores (at " + c.overcommit + ":1 ratio)<br>";
    html += "<strong>Minimum Cores per Socket:</strong> " + minCoresPerSocket + " cores<br>";
    html += "<strong>Nodes for Workloads:</strong> " + workloadNodes + " of " + nodes + (haEnabled ? " (1 reserved for HA)" : "") + "<br>";
    html += "<strong>Max vCPUs Supported:</strong> " + maxVCPUs + " vCPUs<br>";
    html += clusterTypeChecks(nodes, physicalCoresPerNode, mgmtPerNode, c.mgmtPerNode);
    html += nodeTypeChecks(nodes);
    html += sizingCpuLines(minCoresPerSocket, recommendedCpu, chosenCpu);
    if (fits) {
      html += '<span class="ok">The cluster has sufficient CPU capacity with ' + (pickedCpu ? pickedCpu.name + " (" + coresPerSocket + " cores per socket)" : minCoresPerSocket + "+ core sockets") + '.</span>';
    } else {
      html += '<span class="warning">Insufficient with ' + nodes + ' nodes. Need at least ' + minNodesTotal + ' nodes.</span>';
    }
    rb.innerHTML = html;

    buildCpuRecommendations(minCoresPerSocket, candidates, recommendedCpu, chosenCpu);

    $("chartsSection").style.display = "block";
    drawCoreChart(c.workloadCores, totalMgmtCores, haCores, totalAvailableCores);
    drawNodeChart(nodes, physicalCoresPerNode, mgmtPerNode, availableCoresPerNode, c.workloadCores, workloadNodes, haEnabled);

    buildOverview({
      mode: "nodes",
      vms: c.vms, vcpusPerVm: c.vcpusPerVm, totalVCPUs: c.totalVCPUs, overcommit: c.overcommit, workloadCores: c.workloadCores,
      nodes, socketsPerNode: c.socketsPerNode, mgmtPerNode, userMgmt: c.mgmtPerNode, haEnabled, workloadNodes,
      coresNeededPerNode, minPhysical, minCoresPerSocket, coresPerSocket, physicalCoresPerNode, availableCoresPerNode,
      totalAvailableCores, totalMgmtCores, totalPhysicalCores, haCores,
      maxVCPUs, utilization, fits, minNodesTotal,
      cpuName: null, pickedCpu, recommendedCpu, chosenCpu
    });

    $("exportPdfBtn").style.display = "inline-block";
  }

  /* ================================================================
     MODE B: "I know my CPU - recommend Nodes"
     ================================================================ */
  function calculateByCpu() {
    lastRun = "cpu";
    const c = readCommon();
    const selectedName   = $("cpuSelect").value;
    const cpu            = findCpu(selectedName);
    if (!cpu) return;

    const coresPerSocket        = cpu.cores;
    const physicalCoresPerNode  = coresPerSocket * c.socketsPerNode;
    const mgmtPerNode           = hostReserve(physicalCoresPerNode, c.mgmtPerNode);
    const availableCoresPerNode = Math.max(physicalCoresPerNode - mgmtPerNode, 0);

    /* minimum workload nodes (the ALDO management cluster has at least 3 nodes) */
    const minWorkloadNodes = availableCoresPerNode > 0 ? Math.ceil(c.workloadCores / availableCoresPerNode) : 999;
    const haEnabled        = c.haCheckbox;
    const sizedNodes       = haEnabled ? minWorkloadNodes + 1 : minWorkloadNodes;
    const minNodes         = isAldo() ? Math.max(sizedNodes, ALDO.nodes) : sizedNodes;
    const workloadNodes    = haEnabled ? minNodes - 1 : minNodes;

    const totalAvailableCores = availableCoresPerNode * workloadNodes;
    const totalMgmtCores      = mgmtPerNode * minNodes;
    const totalPhysicalCores  = physicalCoresPerNode * minNodes;
    const haCores             = haEnabled ? physicalCoresPerNode : 0;
    const maxVCPUs            = totalAvailableCores * c.overcommit;

    const utilization = totalAvailableCores > 0
      ? Math.min((c.workloadCores / totalAvailableCores) * 100, 999) : 0;

    /* result */
    const rb = $("resultBox");
    rb.style.display = "block";
    let html = '<strong>Mode:</strong> Given ' + cpu.name + ', recommend nodes<br>';
    html += "<strong>Selected CPU:</strong> " + cpu.name + " (" + coresPerSocket + " cores/socket, " + cpu.gen + ")<br>";
    html += "<strong>Total vCPUs Required:</strong> " + c.totalVCPUs + " vCPUs<br>";
    html += "<strong>Physical Cores Required:</strong> " + c.workloadCores + " cores (at " + c.overcommit + ":1 ratio)<br>";
    html += "<strong>Physical Cores per Node:</strong> " + physicalCoresPerNode + " (" + c.socketsPerNode + " x " + coresPerSocket + " cores)<br>";
    html += "<strong>Available Cores per Node (for VMs):</strong> " + availableCoresPerNode + " cores<br>";
    html += '<strong>Minimum Nodes Required:</strong> <span class="ok">' + minNodes + " nodes</span>" +
      (minNodes > sizedNodes ? " (management cluster minimum, the appliance needs " + sizedNodes + ")" : haEnabled ? " (includes +1 for HA)" : "") + "<br>";
    html += "<strong>Max vCPUs Supported (" + minNodes + " nodes):</strong> " + maxVCPUs + " vCPUs<br>";
    html += "<strong>Core Utilization:</strong> " + utilization.toFixed(1) + "%<br>";
    html += clusterTypeChecks(minNodes, physicalCoresPerNode, mgmtPerNode, c.mgmtPerNode);
    html += nodeTypeChecks(minNodes);
    rb.innerHTML = html;

    /* hide CPU recommendation grid (not relevant in this mode) */
    $("cpuRecommendSection").style.display = "none";

    /* charts */
    $("chartsSection").style.display = "block";
    drawCoreChart(c.workloadCores, totalMgmtCores, haCores, totalAvailableCores);
    drawNodeChart(minNodes, physicalCoresPerNode, mgmtPerNode, availableCoresPerNode, c.workloadCores, workloadNodes, haEnabled);

    buildOverview({
      mode: "cpu",
      vms: c.vms, vcpusPerVm: c.vcpusPerVm, totalVCPUs: c.totalVCPUs, overcommit: c.overcommit, workloadCores: c.workloadCores,
      nodes: minNodes, sizedNodes, socketsPerNode: c.socketsPerNode, mgmtPerNode, userMgmt: c.mgmtPerNode, haEnabled, workloadNodes,
      minCoresPerSocket: coresPerSocket, coresPerSocket, physicalCoresPerNode, availableCoresPerNode,
      totalAvailableCores, totalMgmtCores, totalPhysicalCores, haCores,
      maxVCPUs, utilization, fits: true, minNodesTotal: minNodes,
      cpuName: cpu.name
    });

    $("exportPdfBtn").style.display = "inline-block";
  }

  /* ================================================================
     NODE TYPE CHECKS (result box lines)
     ================================================================ */
  function nodeTypeChecks(nodes) {
    const p = selectedNodeType();
    if (!p) return "";
    let html = "<strong>Node Type:</strong> " + p.vendor + " " + p.name + " (" + nodeCpuLabel(p) + ")<br>";
    if (nodes < p.nodes[0] || nodes > p.nodes[1]) {
      html += '<span class="warning">' + nodes + " nodes is outside the supported scale of this node type (" + p.nodes[0] + " to " + p.nodes[1] + " nodes).</span><br>";
    }
    return html;
  }

  /* Mode A: the recommended CPU and the CPU the cluster is sized with */
  function sizingCpuLines(minCoresPerSocket, recommended, chosen) {
    if (!recommended) return '<span class="warning">No known CPU model is compatible with this node type and socket count.</span><br>';
    const scope = selectedNodeType() ? "compatible model" : "current-generation model";
    let html = "<strong>Recommended CPU:</strong> " + recommended.name + " (" + cpuSpecs(recommended) + ")<br>";
    if (chosen) {
      html += "<strong>Selected CPU:</strong> " + chosen.name + " (" + cpuSpecs(chosen) + ")<br>";
      html += "<strong>Sized With:</strong> " + chosen.cores + " cores per socket, the CPU selected in CPU Recommendations<br>";
      if (chosen.cores < minCoresPerSocket) {
        html += '<span class="warning">The selected CPU has fewer than the ' + minCoresPerSocket + " cores per socket the workload needs. The charts show the missing cores.</span><br>";
      }
    } else if (recommended.cores >= minCoresPerSocket) {
      html += "<strong>Sized With:</strong> " + recommended.cores + " cores per socket, the smallest " + scope + " with " + minCoresPerSocket + "+ cores<br>";
    } else {
      html += '<span class="warning">No ' + (selectedNodeType() ? "compatible " : "") + "CPU has " + minCoresPerSocket + "+ cores per socket. Sized with the largest one, " + recommended.name + " (" + recommended.cores + " cores). Add nodes" + (selectedNodeType() ? " or choose another node type" : "") + ".</span><br>";
    }
    return html;
  }

  /* ================================================================
     CPU RECOMMENDATIONS
     ================================================================ */
  const defaultRecommendIntro = $("cpuRecommendIntro").textContent;

  function buildCpuRecommendations(minCores, candidates, recommended, chosen) {
    $("cpuRecommendSection").style.display = "block";
    const grid = $("cpuGrid"), p = selectedNodeType();

    /* with a node type the cards are the real CPU models that system can use */
    const sockets = Math.max(num($("socketsPerNode")), 1);
    $("cpuRecommendIntro").textContent = p
      ? "Based on the minimum cores required per socket, these are the CPU models " + p.name + " can use: " + nodeCpuLabel(p) +
        " models with a cores-per-socket option the Azure Local catalog lists for this system that support " + sockets + " socket" + (sockets > 1 ? "s" : "") +
        ". The recommended CPU is highlighted; click another card, including a smaller one, to size the cluster with it."
      : defaultRecommendIntro;

    /* sort: recommended first, then fitting models by cores and TDP ascending */
    const sorted = candidates.slice().sort((a, b) => {
      const aRec = a === recommended ? 0 : 1, bRec = b === recommended ? 0 : 1;
      if (aRec !== bRec) return aRec - bRec;
      const aFit = a.cores >= minCores ? 0 : 1;
      const bFit = b.cores >= minCores ? 0 : 1;
      if (aFit !== bFit) return aFit - bFit;
      return a.cores - b.cores || a.tdp - b.tdp;
    });

    let html = "";
    for (const cpu of sorted) {
      const ratio = cpu.cores / minCores;
      let cls, tag;
      if (ratio >= 1.2)      { cls = "match"; tag = '<span class="cpu-tag fit">Good Fit</span>'; }
      else if (ratio >= 1.0) { cls = "tight"; tag = '<span class="cpu-tag tight-tag">Tight Fit</span>'; }
      else                   { cls = "no-fit"; tag = '<span class="cpu-tag small">Too Small</span>'; }
      const isRec = cpu === recommended, isSel = cpu === chosen;
      if (isRec) { cls += " recommended"; tag += '<span class="cpu-tag rec-tag">Recommended</span>'; }
      if (isSel) { cls += " selected"; tag += '<span class="cpu-tag sel-tag">Selected</span>'; }

      html += '<div class="cpu-card ' + cls + '" data-cpu="' + cpu.name + '" role="button" tabindex="0" aria-pressed="' + (isSel || (isRec && !chosen)) + '"' +
        ' title="' + (isRec ? "Recommended CPU" : "Size the cluster with this CPU") + '">';
      html += '<div class="cpu-name">' + cpu.name + tag + '</div>';
      html += '<div class="cpu-detail">' + cpuSpecs(cpu) + '</div></div>';
    }
    grid.innerHTML = html;
  }

  /* clicking a card sizes the cluster with that CPU; clicking the recommended one goes back to it */
  function chooseCard(card) {
    if (!card) return;
    const name = card.dataset.cpu, hadFocus = card === document.activeElement;
    chosenCpuName = name;
    calculate();
    const again = $("cpuGrid").querySelector('[data-cpu="' + name + '"]');
    if (again && hadFocus) again.focus({ preventScroll: true });
  }
  $("cpuGrid").addEventListener("click", e => chooseCard(e.target.closest(".cpu-card")));
  $("cpuGrid").addEventListener("keydown", e => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const card = e.target.closest(".cpu-card");
    if (!card) return;
    e.preventDefault();
    chooseCard(card);
  });

  /* ================================================================
     OVERVIEW TABLE
     ================================================================ */
  function buildOverview(d) {
    $("overviewSection").style.display = "block";
    const rows = [];

    function sec(t) { rows.push('<tr class="section-header"><td colspan="3">' + t + '</td></tr>'); }
    function row(l, f, v) { rows.push('<tr><td>' + l + '</td><td class="formula">' + f + '</td><td>' + v + '</td></tr>'); }
    function total(l, v) { rows.push('<tr class="total-row"><td colspan="2">' + l + '</td><td>' + v + '</td></tr>'); }

    rows.push('<thead><tr><th>Item</th><th>Calculation</th><th>Value</th></tr></thead><tbody>');

    sec("Workload Requirements");
    row("Total vCPUs", d.vms + " VMs x " + d.vcpusPerVm + " vCPUs/VM", d.totalVCPUs + " vCPUs");
    row("Physical Cores Required", d.totalVCPUs + " vCPUs / " + d.overcommit + ":1 ratio", d.workloadCores + " cores");

    sec("Cluster Configuration");
    const nodeType = selectedNodeType();
    if (nodeType) {
      row("Node Type", "Azure Local catalog (" + CATALOG_DATE + ")", nodeType.vendor + " " + nodeType.name);
    }
    if (d.cpuName) {
      row("Selected CPU", "User-selected", d.cpuName);
    }
    row("Nodes", d.mode === "cpu" ? "Calculated" : "User-defined", d.nodes + " total" + (d.haEnabled ? " (1 HA reserved)" : ""));
    row("Workload Nodes", d.haEnabled ? d.nodes + " - 1 HA" : d.nodes + " (no HA)", d.workloadNodes + " nodes");
    row("Sockets per Node", "User-defined", d.socketsPerNode + " socket(s)");
    if (isAldo()) {
      row("Cluster Type", "Dedicated, runs only the control plane appliance", clusterTypes[clusterType()].label);
      row("Management Overhead per Node", "max(" + d.userMgmt + " user-defined, 20% of " + d.physicalCoresPerNode + " cores, " + ALDO.reserveMin + ")", d.mgmtPerNode + " cores");
    } else {
      if (clusterType() !== "standard") row("Cluster Type", "User-defined", clusterTypes[clusterType()].label);
      row("Management Overhead per Node", "User-defined", d.mgmtPerNode + " cores");
    }

    sec(d.mode === "cpu" ? "Node Sizing (for " + d.cpuName + ")" : "CPU Sizing");
    if (d.mode === "nodes") {
      const perNode = "ceil(" + d.workloadCores + " / " + d.workloadNodes + ")";
      if (isAldo()) {
        row("Physical Cores Needed per Node", "max(" + perNode + " + 20% host reservation, " + ALDO.minCores + " management cluster minimum)", d.minPhysical + " cores");
      } else {
        row("Physical Cores Needed per Node (workload + mgmt)", perNode + " + " + d.userMgmt, d.minPhysical + " cores");
      }
      row("Minimum Cores per Socket", d.minPhysical + " / " + d.socketsPerNode + " socket(s)", d.minCoresPerSocket + " cores");
      if (d.pickedCpu) {
        row("Recommended CPU", (nodeType ? "Smallest compatible model" : "Smallest current-generation model") + " with enough cores", d.recommendedCpu.name);
        if (d.chosenCpu) row("Selected CPU", "User-selected in CPU Recommendations", d.chosenCpu.name);
        total("Sized With", d.coresPerSocket + " cores per socket (" + d.pickedCpu.name + ")");
      } else {
        total("Recommended Socket", d.minCoresPerSocket + "+ cores per socket");
      }
    } else {
      row("Cores per Socket", d.cpuName, d.minCoresPerSocket + " cores");
      row("Available Cores per Node (for VMs)", d.physicalCoresPerNode + " - " + d.mgmtPerNode + " mgmt", d.availableCoresPerNode + " cores");
      row("Min Workload Nodes", "ceil(" + d.workloadCores + " / " + d.availableCoresPerNode + ")", (d.availableCoresPerNode > 0 ? Math.ceil(d.workloadCores / d.availableCoresPerNode) : 999) + " nodes");
      if (d.nodes > d.sizedNodes) row("Management Cluster Minimum", "Production management cluster", ALDO.nodes + " nodes");
      total("Minimum Nodes Required", d.nodes + " nodes" + (d.haEnabled ? " (incl. +1 HA)" : ""));
    }

    sec("Cluster Capacity (" + d.nodes + " nodes, " + d.coresPerSocket + "-core sockets)");
    row("Physical Cores per Node", d.socketsPerNode + " x " + d.coresPerSocket + " cores", d.physicalCoresPerNode + " cores");
    row("Available Cores per Node (for VMs)", d.physicalCoresPerNode + " - " + d.mgmtPerNode + " mgmt", d.availableCoresPerNode + " cores");
    row("Total Available Cores (cluster)", d.availableCoresPerNode + " x " + d.workloadNodes + " nodes", d.totalAvailableCores + " cores");
    row("Max vCPUs Supported", d.totalAvailableCores + " cores x " + d.overcommit + ":1", d.maxVCPUs + " vCPUs");
    if (d.haEnabled) {
      row("HA Reserved Cores (1 node)", d.physicalCoresPerNode + " cores", d.haCores + " cores");
    }
    row("Core Utilization", d.workloadCores + " / " + d.totalAvailableCores, d.utilization.toFixed(1) + "%");

    sec("Assessment");
    if (d.fits) {
      total("Status", '<span class="ok">Sufficient capacity</span>');
    } else {
      total("Status", '<span class="warning">Insufficient - need at least ' + d.minNodesTotal + ' nodes</span>');
    }

    rows.push("</tbody>");
    $("overviewTable").innerHTML = rows.join("");
  }

  /* ================================================================
     3D CHARTS
     Self-contained canvas renderer (no external libraries) for 3D donut
     and 3D bar charts: hover and keyboard tooltips, clickable legend,
     drag to rotate and double-click to reset the view.
     The same block is used in all three V2 calculators.
     ================================================================ */
  var C3D = {
    font: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
    surface: "#ffffff", ink: "#1f1f1e", ink2: "#52514e", muted: "#8a8984",
    grid: "#e6e5e1", floor: "#f3f2ef", critical: "#d03b3b"
  };
  /* Validated categorical slots (light mode, white surface) */
  var C3D_COLORS = {
    blue: "#2a78d6", orange: "#eb6834", aqua: "#1baf7a", yellow: "#eda100",
    magenta: "#e87ba4", green: "#008300", violet: "#4a3aa7"
  };

  /* f < 1 darkens, f > 1 mixes towards white */
  function c3dMix(hex, f) {
    var n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255];
    for (var i = 0; i < 3; i++) c[i] = Math.round(f <= 1 ? c[i] * f : c[i] + (255 - c[i]) * (f - 1));
    return "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")";
  }

  function c3dCompact(v) {
    var a = Math.abs(v);
    if (a >= 1e6) return +(v / 1e6).toFixed(a >= 1e7 ? 0 : 1) + "M";
    if (a >= 1e3) return +(v / 1e3).toFixed(a >= 1e4 ? 0 : 1) + "k";
    return String(+v.toFixed(a < 10 ? 2 : 0));
  }

  function c3dNiceScale(max, count) {
    if (!(max > 0)) return { max: 1, step: 0.25 };
    var raw = max / count, mag = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10)), n = raw / mag;
    var step = (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * mag;
    return { max: Math.ceil(max / step - 1e-9) * step, step: step };
  }

  function c3dInPoly(x, y, p) {
    var inside = false;
    for (var i = 0, j = p.length - 1; i < p.length; j = i++) {
      if ((p[i][1] > y) !== (p[j][1] > y) &&
          x < (p[j][0] - p[i][0]) * (y - p[i][1]) / (p[j][1] - p[i][1]) + p[i][0]) inside = !inside;
    }
    return inside;
  }

  function c3dPoly(ctx, p, fill, stroke, width) {
    ctx.beginPath();
    ctx.moveTo(p[0][0], p[0][1]);
    for (var i = 1; i < p.length; i++) ctx.lineTo(p[i][0], p[i][1]);
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width || 1; ctx.lineJoin = "round"; ctx.stroke(); }
  }

  function c3dRoundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function c3dFit(ctx, text, max) {
    text = String(text);
    if (ctx.measureText(text).width <= max) return text;
    while (text.length > 1 && ctx.measureText(text + "…").width > max) text = text.slice(0, -1);
    return text + "…";
  }

  /* cfg.type "donut": { title, slices: [{label, value, color}], format(v), center(total) -> {value, label, critical} }
     cfg.type "bar":   { title, categories: [], series: [{label, color, data: []}], horizontal, legend,
                         format(v), axisFormat(v) }  Bars are always stacked per category. */
  function Chart3D(canvas, cfg) {
    var self = this;
    this.canvas = canvas;
    this.cfg = cfg;
    this.ctx = canvas.getContext("2d");
    this.hidden = {};
    this.hover = null;
    this.focus = null;
    this.pointer = null;
    this.drag = null;
    this.marks = [];
    this.order = [];
    this.legendBoxes = [];
    this.view = this.defaultView();
    this.reduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    this.progress = this.reduced ? 1 : 0;
    canvas.tabIndex = 0;
    canvas.setAttribute("role", "img");
    canvas.style.touchAction = "pan-y";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.outlineOffset = "2px";
    this.on = {
      move: function(e) { self.onMove(e); },
      leave: function() { self.onLeave(); },
      down: function(e) { self.onDown(e); },
      up: function(e) { self.onUp(e); },
      dbl: function() { self.view = self.defaultView(); self.draw(); },
      key: function(e) { self.onKey(e); },
      blur: function() { self.focus = null; self.draw(); },
      resize: function() { self.resize(); }
    };
    canvas.addEventListener("pointermove", this.on.move);
    canvas.addEventListener("pointerleave", this.on.leave);
    canvas.addEventListener("pointerdown", this.on.down);
    window.addEventListener("pointerup", this.on.up);
    canvas.addEventListener("dblclick", this.on.dbl);
    canvas.addEventListener("keydown", this.on.key);
    canvas.addEventListener("blur", this.on.blur);
    window.addEventListener("resize", this.on.resize);
    if (window.ResizeObserver && canvas.parentNode) {
      this.observer = new ResizeObserver(this.on.resize);
      this.observer.observe(canvas.parentNode);
    }
    /* the print stylesheet changes the chart height: redraw at print size */
    this.print = window.matchMedia ? window.matchMedia("print") : null;
    if (this.print) {
      if (this.print.addEventListener) this.print.addEventListener("change", this.on.resize);
      else if (this.print.addListener) this.print.addListener(this.on.resize);
    }
    this.resize();
    if (!this.reduced) this.animate();
  }

  Chart3D.prototype.defaultView = function() {
    return this.cfg.type === "donut" ? { rot: -Math.PI / 2, tilt: 0.95 } : { angle: 0.75, depth: 1 };
  };

  Chart3D.prototype.destroy = function() {
    var c = this.canvas;
    c.removeEventListener("pointermove", this.on.move);
    c.removeEventListener("pointerleave", this.on.leave);
    c.removeEventListener("pointerdown", this.on.down);
    window.removeEventListener("pointerup", this.on.up);
    c.removeEventListener("dblclick", this.on.dbl);
    c.removeEventListener("keydown", this.on.key);
    c.removeEventListener("blur", this.on.blur);
    window.removeEventListener("resize", this.on.resize);
    if (this.observer) this.observer.disconnect();
    if (this.print) {
      if (this.print.removeEventListener) this.print.removeEventListener("change", this.on.resize);
      else if (this.print.removeListener) this.print.removeListener(this.on.resize);
    }
    if (this.raf) cancelAnimationFrame(this.raf);
    clearTimeout(this.fallback);
    c.style.cursor = "";
  };

  Chart3D.prototype.resize = function() {
    var box = this.canvas.parentNode, dpr = window.devicePixelRatio || 1;
    var w = box ? box.clientWidth : this.canvas.clientWidth, h = box ? box.clientHeight : this.canvas.clientHeight;
    if (!w || !h || (w === this.w && h === this.h && dpr === this.dpr)) return;
    this.w = w; this.h = h; this.dpr = dpr;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.draw();
  };

  Chart3D.prototype.animate = function() {
    var self = this, start = null;
    function step(t) {
      if (start === null) start = t;
      var k = Math.min((t - start) / 700, 1);
      self.progress = 1 - Math.pow(1 - k, 3);
      self.draw();
      self.raf = k < 1 ? requestAnimationFrame(step) : null;
    }
    this.raf = requestAnimationFrame(step);
    /* Background tabs pause animation frames; never leave a chart half drawn */
    this.fallback = setTimeout(function() {
      if (self.progress < 1) { if (self.raf) cancelAnimationFrame(self.raf); self.raf = null; self.progress = 1; self.draw(); }
    }, 1500);
  };

  Chart3D.prototype.items = function() {
    var cfg = this.cfg;
    return cfg.type === "donut" ? cfg.slices : cfg.series;
  };

  Chart3D.prototype.activeKey = function() {
    return this.drag && this.drag.moved ? null : (this.focus !== null ? this.focus : this.hover);
  };

  /* ---------------- frame ---------------- */
  Chart3D.prototype.draw = function() {
    if (!this.w) return;
    var ctx = this.ctx, cfg = this.cfg;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.fillStyle = C3D.surface;
    ctx.fillRect(0, 0, this.w, this.h);
    this.marks = [];
    this.order = [];

    ctx.font = "600 14px " + C3D.font;
    ctx.fillStyle = C3D.ink;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(c3dFit(ctx, cfg.title, this.w - 24), this.w / 2, 12);

    var legendH = this.layoutLegend();
    var area = { x: 12, y: 38, w: this.w - 24, h: this.h - 38 - legendH - 8 };
    this.area = area;
    if (cfg.type === "donut") this.drawDonut(area); else this.drawBars(area);
    this.drawLegend();
    this.drawHint();
    this.drawTooltip();
    this.updateAria();
  };

  Chart3D.prototype.empty = function(a, text) {
    var ctx = this.ctx;
    ctx.font = "13px " + C3D.font;
    ctx.fillStyle = C3D.muted;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, a.x + a.w / 2, a.y + a.h / 2);
  };

  /* ---------------- legend ---------------- */
  Chart3D.prototype.legendText = function(item) {
    return this.cfg.type === "donut" ? item.label + "  " + this.cfg.format(item.value) : item.label;
  };

  Chart3D.prototype.layoutLegend = function() {
    var ctx = this.ctx, self = this, items = this.items(), maxW = this.w - 24, rows = [[]], rowW = [0];
    this.legendBoxes = [];
    if (this.cfg.legend === false) return 0;
    ctx.font = "12px " + C3D.font;
    items.forEach(function(it, i) {
      if (self.cfg.type === "donut" && !(it.value > 0)) return;
      var text = c3dFit(ctx, self.legendText(it), maxW - 20), w = 16 + ctx.measureText(text).width;
      var r = rows.length - 1;
      if (rows[r].length && rowW[r] + 14 + w > maxW) { rows.push([]); rowW.push(0); r++; }
      rowW[r] += (rows[r].length ? 14 : 0) + w;
      rows[r].push({ i: i, text: text, w: w });
    });
    var y = this.h - 8 - rows.length * 20;
    rows.forEach(function(row, r) {
      var x = (self.w - rowW[r]) / 2;
      row.forEach(function(b) {
        self.legendBoxes.push({ i: b.i, text: b.text, x: x, y: y + r * 20, w: b.w, h: 20 });
        x += b.w + 14;
      });
    });
    return rows.length * 20 + 4;
  };

  Chart3D.prototype.drawLegend = function() {
    var ctx = this.ctx, self = this, items = this.items(), act = this.activeKey();
    ctx.font = "12px " + C3D.font;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    this.legendBoxes.forEach(function(b) {
      var it = items[b.i], off = self.hidden[b.i], cy = b.y + b.h / 2;
      var emph = act !== null && self.keyItem(act) === b.i;
      c3dRoundRect(ctx, b.x, cy - 5, 10, 10, 2);
      if (off) { ctx.strokeStyle = it.color; ctx.lineWidth = 1.5; ctx.stroke(); }
      else { ctx.fillStyle = it.color; ctx.fill(); }
      ctx.fillStyle = off ? C3D.muted : (emph ? C3D.ink : C3D.ink2);
      ctx.fillText(b.text, b.x + 16, cy);
      if (off) {
        ctx.fillRect(b.x + 16, cy, ctx.measureText(b.text).width, 1);
      }
    });
  };

  Chart3D.prototype.drawHint = function() {
    if (!this.pointer || this.activeKey() !== null || this.drag) return;
    var ctx = this.ctx, a = this.area;
    ctx.font = "10px " + C3D.font;
    ctx.fillStyle = C3D.muted;
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillText("Drag to rotate, double-click to reset", a.x + a.w, a.y + a.h + 6);
  };

  /* ---------------- donut ---------------- */
  Chart3D.prototype.drawDonut = function(a) {
    var cfg = this.cfg, ctx = this.ctx, self = this, v = this.view;
    var sinP = Math.sin(v.tilt), cosP = Math.cos(v.tilt), THICK = 0.24, INNER = 0.56;
    var R = Math.max(10, Math.min(a.w * 0.4, a.h * 0.9 / (2 * sinP + THICK * cosP)));
    var wall = THICK * R * cosP, r0 = R * INNER;
    var cx = a.x + a.w / 2, cy = a.y + (a.h - (2 * R * sinP + wall)) / 2 + R * sinP;
    var total = 0, pieces = [];
    cfg.slices.forEach(function(s, i) { if (!self.hidden[i] && s.value > 0) total += s.value; });

    /* soft ground shadow shaped as a ring, so the hole stays clean for the center label */
    ctx.save();
    ctx.translate(cx, cy + wall + 6);
    ctx.scale(1, Math.max(sinP, 0.2));
    var g = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 1.12);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(INNER * 0.85 / 1.12, "rgba(0,0,0,0)");
    g.addColorStop(0.82, "rgba(0,0,0,0.13)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, R * 1.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (!(total > 0)) { this.empty(a, "No values to display"); return; }

    var sweep = Math.PI * 2 * this.progress, start = v.rot, act = this.activeKey(), full = Math.PI * 2;
    cfg.slices.forEach(function(s, i) {
      if (self.hidden[i] || !(s.value > 0)) return;
      var span = s.value / total * sweep;
      pieces.push({ i: i, a0: start, a1: start + span });
      self.order.push("s" + i);
      start += span;
    });

    /* parts of [a0, a1] where sin() has the wanted sign: outer walls face the viewer in the
       front half (0..PI), inner walls in the back half (PI..2PI) */
    function visible(a0, a1, lo) {
      var out = [], k = Math.floor((a0 - lo - Math.PI) / full);
      for (; lo + k * full < a1; k++) {
        var s = Math.max(a0, lo + k * full), e = Math.min(a1, lo + Math.PI + k * full);
        if (e > s + 1e-4) out.push([s, e]);
      }
      return out;
    }

    function build(pc, lifted) {
      var mid = (pc.a0 + pc.a1) / 2, d = lifted ? R * 0.07 : 0, span = pc.a1 - pc.a0;
      var ox = Math.cos(mid) * d, oy = Math.sin(mid) * d * sinP - (lifted ? 4 : 0);
      var color = cfg.slices[pc.i].color, b = { color: color, cuts: [], inner: [], outer: [], top: [] };
      function P(ang, r, z) { return [cx + ox + r * Math.cos(ang), cy + oy + r * Math.sin(ang) * sinP + (1 - z) * wall]; }
      function arc(s, e, r, z, list, back) {
        var n = Math.max(2, Math.ceil((e - s) / (Math.PI / 90)));
        for (var j = 0; j <= n; j++) list.push(P(back ? e - (e - s) * j / n : s + (e - s) * j / n, r, z));
      }
      function wallPoly(s, e, r) { var p = []; arc(s, e, r, 1, p, false); arc(s, e, r, 0, p, true); return p; }
      if (pieces.length > 1 || span < full - 1e-6) {
        [pc.a0, pc.a1].forEach(function(ang) {
          b.cuts.push({ depth: Math.sin(ang), poly: [P(ang, r0, 1), P(ang, R, 1), P(ang, R, 0), P(ang, r0, 0)] });
        });
      }
      visible(pc.a0, pc.a1, Math.PI).forEach(function(iv) { b.inner.push(wallPoly(iv[0], iv[1], r0)); });
      visible(pc.a0, pc.a1, 0).forEach(function(iv) { b.outer.push(wallPoly(iv[0], iv[1], R)); });
      arc(pc.a0, pc.a1, R, 1, b.top, false);
      arc(pc.a0, pc.a1, r0, 1, b.top, true);
      /* one light from the front left: walls get a smooth horizontal gradient instead of facets */
      b.outerFill = ctx.createLinearGradient(cx - R, 0, cx + R, 0);
      b.outerFill.addColorStop(0, c3dMix(color, 0.9));
      b.outerFill.addColorStop(1, c3dMix(color, 0.6));
      b.innerFill = ctx.createLinearGradient(cx - r0, 0, cx + r0, 0);
      b.innerFill.addColorStop(0, c3dMix(color, 0.55));
      b.innerFill.addColorStop(1, c3dMix(color, 0.78));
      b.cutFill = c3dMix(color, 0.72);
      return b;
    }

    /* painter's order: cut faces (far first), inner back walls, outer front walls, tops */
    function paint(list) {
      var cuts = [];
      list.forEach(function(b) { b.cuts.forEach(function(c) { cuts.push({ c: c, b: b }); }); });
      cuts.sort(function(x, y) { return x.c.depth - y.c.depth; });
      cuts.forEach(function(x) { c3dPoly(ctx, x.c.poly, x.b.cutFill, x.b.cutFill, 0.5); });
      list.forEach(function(b) { b.inner.forEach(function(p) { c3dPoly(ctx, p, b.innerFill, null); }); });
      list.forEach(function(b) { b.outer.forEach(function(p) { c3dPoly(ctx, p, b.outerFill, null); }); });
      list.forEach(function(b) {
        c3dPoly(ctx, b.top, b.hot ? c3dMix(b.color, 1.14) : b.color, C3D.surface, 1.5);
        self.marks.push({ key: b.key, polys: [b.top].concat(b.outer, b.inner), cx: b.cx, cy: b.cy });
      });
    }

    var rest = [], hot = [];
    pieces.forEach(function(pc) {
      var key = "s" + pc.i, b = build(pc, key === act), mid = (pc.a0 + pc.a1) / 2;
      b.key = key;
      b.hot = key === act;
      b.cx = cx + Math.cos(mid) * (R + r0) / 2;
      b.cy = cy + Math.sin(mid) * (R + r0) / 2 * sinP;
      (b.hot ? hot : rest).push(b);
    });
    paint(rest);
    paint(hot);

    var c = cfg.center ? cfg.center(total) : null, room = 2 * r0 * sinP - wall, maxW = r0 * 1.6;
    if (c && room > 30 && r0 > 46) {
      var ty = cy + wall / 2, size = room > 54 ? 16 : 13;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      do { ctx.font = "600 " + size + "px " + C3D.font; } while (ctx.measureText(c.value).width > maxW && --size > 10);
      ctx.fillStyle = c.critical ? C3D.critical : C3D.ink;
      ctx.fillText(c3dFit(ctx, c.value, maxW), cx, ty - 8);
      ctx.font = "11px " + C3D.font;
      ctx.fillStyle = C3D.ink2;
      ctx.fillText(c3dFit(ctx, c.label, maxW), cx, ty + 9);
    }
  };

  /* ---------------- bars ---------------- */
  function c3dBox(ctx, x, y, w, h, dx, dy, color, hot) {
    var front = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
    var top = [[x, y], [x + w, y], [x + w + dx, y + dy], [x + dx, y + dy]];
    var side = [[x + w, y], [x + w + dx, y + dy], [x + w + dx, y + h + dy], [x + w, y + h]];
    var base = hot ? 1.12 : 1;
    c3dPoly(ctx, side, c3dMix(color, 0.7 * base), C3D.surface, 1);
    c3dPoly(ctx, top, c3dMix(color, 1.2 * base), C3D.surface, 1);
    c3dPoly(ctx, front, hot ? c3dMix(color, base) : color, C3D.surface, 1);
    return [front, top, side];
  }

  Chart3D.prototype.drawBars = function(a) {
    var cfg = this.cfg, ctx = this.ctx, self = this, horiz = !!cfg.horizontal, K = cfg.categories.length;
    var vis = [], totals = [], max = 0, act = this.activeKey(), p = this.progress;
    var fmtAxis = cfg.axisFormat || c3dCompact;
    cfg.series.forEach(function(s, i) { if (!self.hidden[i]) vis.push(i); });
    for (var k = 0; k < K; k++) {
      var t = 0;
      vis.forEach(function(i) { t += Math.max(cfg.series[i].data[k] || 0, 0); });
      totals.push(t);
      max = Math.max(max, t);
    }
    if (!K || !(max > 0)) { this.empty(a, "No values to display"); return; }
    var scale = c3dNiceScale(max, 4), ticks = [];
    for (var tv = 0; tv <= scale.max + scale.step / 2; tv += scale.step) ticks.push(tv);

    ctx.font = "11px " + C3D.font;
    var x0, x1, yt, yb, band, thick, d, dx, dy;
    if (!horiz) {
      var tickW = 0;
      ticks.forEach(function(t) { tickW = Math.max(tickW, ctx.measureText(fmtAxis(t)).width); });
      x0 = a.x + tickW + 8;
      band = (a.w - tickW - 8) / K;
      d = Math.min(16, band * 0.3) * this.view.depth;
      dx = d * Math.cos(this.view.angle); dy = -d * Math.sin(this.view.angle);
      x1 = a.x + a.w - dx - 4;
      yt = a.y + 16 - dy;
      yb = a.y + a.h - 20;
      band = (x1 - x0) / K;
      thick = Math.min(band * 0.58, 56);
    } else {
      var labW = 0;
      cfg.categories.forEach(function(c) { labW = Math.max(labW, ctx.measureText(c).width); });
      labW = Math.min(labW, a.w * 0.36);
      x0 = a.x + labW + 8;
      yt = a.y + 4;
      yb = a.y + a.h - 18;
      band = (yb - yt) / K;
      d = Math.min(14, band * 0.4) * this.view.depth;
      dx = d * Math.cos(this.view.angle); dy = -d * Math.sin(this.view.angle);
      yt -= dy;
      band = (yb - yt) / K;
      x1 = a.x + a.w - dx - 46;
      thick = Math.min(band * 0.62, 30);
    }
    function pos(v) { return horiz ? x0 + v / scale.max * (x1 - x0) : yb - v / scale.max * (yb - yt); }

    /* floor, back wall grid and value axis */
    ctx.textBaseline = "middle";
    if (!horiz) {
      c3dPoly(ctx, [[x0, yb], [x1, yb], [x1 + dx, yb + dy], [x0 + dx, yb + dy]], C3D.floor, null);
      ticks.forEach(function(t) {
        var y = pos(t);
        ctx.beginPath();
        ctx.moveTo(x0, y); ctx.lineTo(x0 + dx, y + dy); ctx.lineTo(x1 + dx, y + dy);
        ctx.strokeStyle = C3D.grid; ctx.lineWidth = 1; ctx.stroke();
        ctx.fillStyle = C3D.muted; ctx.textAlign = "right";
        ctx.fillText(fmtAxis(t), x0 - 6, y);
      });
    } else {
      c3dPoly(ctx, [[x0, yt], [x0, yb], [x0 + dx, yb + dy], [x0 + dx, yt + dy]], C3D.floor, null);
      ticks.forEach(function(t) {
        var x = pos(t);
        ctx.beginPath();
        ctx.moveTo(x, yb); ctx.lineTo(x + dx, yb + dy); ctx.lineTo(x + dx, yt + dy);
        ctx.strokeStyle = C3D.grid; ctx.lineWidth = 1; ctx.stroke();
        ctx.fillStyle = C3D.muted; ctx.textAlign = "center"; ctx.textBaseline = "top";
        ctx.fillText(fmtAxis(t), x, yb + 5);
      });
    }

    /* boxes: vertical left to right, horizontal bottom row first, so nearer faces paint last */
    var dim = act !== null;
    for (var n = 0; n < K; n++) {
      k = horiz ? K - 1 - n : n;
      var base = 0, cat = cfg.categories[k];
      var start = horiz ? yt + band * k + (band - thick) / 2 : x0 + band * k + (band - thick) / 2;
      vis.forEach(function(i) {
        var val = Math.max(cfg.series[i].data[k] || 0, 0);
        if (!(val > 0)) return;
        var key = i + ":" + k, hot = key === act, polys, v0 = pos(base * p), v1 = pos((base + val) * p);
        ctx.globalAlpha = dim && !hot ? 0.55 : 1;
        polys = horiz ? c3dBox(ctx, v0, start, v1 - v0, thick, dx, dy, cfg.series[i].color, hot)
                      : c3dBox(ctx, start, v1, thick, v0 - v1, dx, dy, cfg.series[i].color, hot);
        ctx.globalAlpha = 1;
        self.marks.push({ key: key, polys: polys,
                          cx: horiz ? (v0 + v1) / 2 : start + thick / 2, cy: horiz ? start + thick / 2 : (v0 + v1) / 2 });
        base += val;
      });
      /* selective direct label: the stack total at the end of each bar */
      ctx.fillStyle = C3D.ink2;
      ctx.font = "11px " + C3D.font;
      if (totals[k] > 0 && p === 1) {
        if (!horiz && band >= 40) {
          ctx.textAlign = "center"; ctx.textBaseline = "bottom";
          ctx.fillText(c3dFit(ctx, cfg.format(totals[k]), band + 8), start + thick / 2 + dx / 2, pos(totals[k]) + dy - 3);
        } else if (horiz && band >= 13) {
          ctx.textAlign = "left"; ctx.textBaseline = "middle";
          ctx.fillText(cfg.format(totals[k]), pos(totals[k]) + dx + 5, start + thick / 2 + dy / 2);
        }
      }
      /* category labels */
      ctx.fillStyle = C3D.ink2;
      if (!horiz) {
        var every = Math.ceil(34 / band);
        if (k % every === 0) {
          ctx.textAlign = "center"; ctx.textBaseline = "top";
          ctx.fillText(c3dFit(ctx, cat, band * every - 4), start + thick / 2, yb + 6);
        }
      } else if (band >= 11) {
        ctx.textAlign = "right"; ctx.textBaseline = "middle";
        ctx.fillText(c3dFit(ctx, cat, x0 - a.x - 8), x0 - 6, start + thick / 2);
      }
    }
    for (k = 0; k < K; k++) vis.forEach(function(i) { if ((cfg.series[i].data[k] || 0) > 0) self.order.push(i + ":" + k); });
  };

  /* ---------------- tooltip ---------------- */
  Chart3D.prototype.keyItem = function(key) {
    return key === null ? null : (key.charAt(0) === "s" ? +key.slice(1) : +key.split(":")[0]);
  };

  Chart3D.prototype.drawTooltip = function() {
    var key = this.activeKey(), cfg = this.cfg, ctx = this.ctx, self = this;
    if (key === null) return;
    var mark = this.marks.filter(function(m) { return m.key === key; })[0];
    if (!mark) return;
    var title = null, rows = [];
    if (cfg.type === "donut") {
      var total = 0, s = cfg.slices[this.keyItem(key)];
      cfg.slices.forEach(function(x, i) { if (!self.hidden[i] && x.value > 0) total += x.value; });
      rows.push({ color: s.color, value: cfg.format(s.value), label: s.label + " (" + (s.value / total * 100).toFixed(1) + "%)", on: true });
    } else {
      var k = +key.split(":")[1], si = this.keyItem(key), sum = 0, count = 0;
      title = cfg.categories[k];
      cfg.series.forEach(function(x, i) {
        var val = x.data[k] || 0;
        if (self.hidden[i] || !(val > 0)) return;
        rows.push({ color: x.color, value: cfg.format(val), label: x.label, on: i === si });
        sum += val; count++;
      });
      if (count > 1) rows.push({ color: null, value: cfg.format(sum), label: "Total", on: false });
    }
    var w = 0, lineH = 18, pad = 10;
    rows.forEach(function(r) {
      ctx.font = "600 12px " + C3D.font;
      r.vw = ctx.measureText(r.value).width;
      ctx.font = (r.on ? "600 " : "") + "12px " + C3D.font;
      w = Math.max(w, 18 + r.vw + 6 + ctx.measureText(r.label).width);
    });
    if (title) { ctx.font = "600 11px " + C3D.font; w = Math.max(w, ctx.measureText(title).width); }
    var h = rows.length * lineH + (title ? 18 : 0) + pad * 2 - 4;
    w = Math.min(w + pad * 2, this.w - 8);
    var px = this.pointer && this.hover === key && this.focus === null ? this.pointer.x : mark.cx;
    var py = this.pointer && this.hover === key && this.focus === null ? this.pointer.y : mark.cy;
    var x = px + 14, y = py - h - 10;
    if (x + w > this.w - 4) x = px - w - 14;
    if (x < 4) x = 4;
    if (y < 4) y = py + 16;
    if (y + h > this.h - 4) y = this.h - 4 - h;
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.16)";
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 4;
    c3dRoundRect(ctx, x, y, w, h, 8);
    ctx.fillStyle = C3D.surface;
    ctx.fill();
    ctx.restore();
    c3dRoundRect(ctx, x + 0.5, y + 0.5, w - 1, h - 1, 8);
    ctx.strokeStyle = C3D.grid;
    ctx.lineWidth = 1;
    ctx.stroke();
    var cy = y + pad + 4;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    if (title) {
      ctx.font = "600 11px " + C3D.font;
      ctx.fillStyle = C3D.muted;
      ctx.fillText(c3dFit(ctx, title, w - pad * 2), x + pad, cy);
      cy += 18;
    }
    rows.forEach(function(r) {
      if (r.color) {
        ctx.beginPath();
        ctx.moveTo(x + pad, cy); ctx.lineTo(x + pad + 12, cy);
        ctx.strokeStyle = r.color; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.stroke();
        ctx.lineCap = "butt";
      }
      ctx.font = "600 12px " + C3D.font;
      ctx.fillStyle = C3D.ink;
      ctx.fillText(r.value, x + pad + 18, cy);
      ctx.font = (r.on ? "600 " : "") + "12px " + C3D.font;
      ctx.fillStyle = r.on ? C3D.ink : C3D.ink2;
      ctx.fillText(c3dFit(ctx, r.label, w - pad * 2 - 24 - r.vw + 1), x + pad + 18 + r.vw + 6, cy);
      cy += lineH;
    });
  };

  Chart3D.prototype.updateAria = function() {
    var cfg = this.cfg, self = this, parts = [];
    if (cfg.type === "donut") {
      cfg.slices.forEach(function(s, i) { if (!self.hidden[i] && s.value > 0) parts.push(s.label + " " + cfg.format(s.value)); });
    } else {
      cfg.categories.forEach(function(c, k) {
        var vals = [];
        cfg.series.forEach(function(s, i) { if (!self.hidden[i] && (s.data[k] || 0) > 0) vals.push(s.label + " " + cfg.format(s.data[k])); });
        if (vals.length) parts.push(c + ": " + vals.join(", "));
      });
    }
    var label = cfg.title + ". " + parts.join("; ") + ". Use the arrow keys to read each value.";
    if (this.canvas.getAttribute("aria-label") !== label) this.canvas.setAttribute("aria-label", label);
  };

  /* ---------------- interaction ---------------- */
  Chart3D.prototype.at = function(e) {
    var r = this.canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (this.w / (r.width || 1)), y: (e.clientY - r.top) * (this.h / (r.height || 1)) };
  };

  Chart3D.prototype.hit = function(p) {
    for (var b = 0; b < this.legendBoxes.length; b++) {
      var lb = this.legendBoxes[b];
      if (p.x >= lb.x - 4 && p.x <= lb.x + lb.w + 4 && p.y >= lb.y && p.y <= lb.y + lb.h) return { legend: lb.i };
    }
    for (var m = this.marks.length - 1; m >= 0; m--) {
      for (var q = 0; q < this.marks[m].polys.length; q++) {
        if (c3dInPoly(p.x, p.y, this.marks[m].polys[q])) return { key: this.marks[m].key };
      }
    }
    return null;
  };

  Chart3D.prototype.onMove = function(e) {
    var p = this.at(e), v = this.view;
    this.pointer = p;
    if (this.drag) {
      var dxp = p.x - this.drag.x, dyp = p.y - this.drag.y;
      this.drag.x = p.x; this.drag.y = p.y;
      this.drag.dist += Math.abs(dxp) + Math.abs(dyp);
      if (this.drag.dist > 4) this.drag.moved = true;
      if (!this.drag.moved) return;
      if (this.cfg.type === "donut") {
        v.rot += dxp * 0.012;
        v.tilt = Math.min(1.35, Math.max(0.35, v.tilt - dyp * 0.008));
      } else {
        v.angle = Math.min(1.4, Math.max(0.12, v.angle - dxp * 0.01));
        v.depth = Math.min(2.2, Math.max(0.3, v.depth - dyp * 0.012));
      }
      this.draw();
      return;
    }
    var h = this.hit(p), key = h && h.key !== undefined ? h.key : null;
    this.canvas.style.cursor = h ? "pointer" : "grab";
    this.hover = key;
    this.draw();
  };

  Chart3D.prototype.onLeave = function() {
    if (this.drag) return;
    this.pointer = null;
    this.hover = null;
    this.canvas.style.cursor = "";
    this.draw();
  };

  Chart3D.prototype.onDown = function(e) {
    var p = this.at(e), h = this.hit(p);
    this.focus = null;
    if (h && h.legend !== undefined) {
      this.hidden[h.legend] = !this.hidden[h.legend];
      this.hover = null;
      this.draw();
      return;
    }
    this.drag = { x: p.x, y: p.y, dist: 0, moved: false, key: h ? h.key : null };
    if (e.pointerType === "mouse") this.canvas.style.cursor = h ? "pointer" : "grabbing";
  };

  Chart3D.prototype.onUp = function(e) {
    if (!this.drag) return;
    var d = this.drag;
    this.drag = null;
    /* a tap without dragging pins the tooltip (touch has no hover) */
    if (!d.moved && e && e.pointerType !== "mouse") this.hover = d.key;
    this.draw();
  };

  Chart3D.prototype.onKey = function(e) {
    var keys = this.order, i = keys.indexOf(this.focus);
    if (e.key === "ArrowRight" || e.key === "ArrowDown") i = i < 0 ? 0 : (i + 1) % keys.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") i = i <= 0 ? keys.length - 1 : i - 1;
    else if (e.key === "Home") i = 0;
    else if (e.key === "End") i = keys.length - 1;
    else if (e.key === "Escape") i = -1;
    else return;
    e.preventDefault();
    this.focus = i >= 0 && keys.length ? keys[i] : null;
    this.draw();
  };

  /* ================================================================
     CHARTS
     ================================================================ */
  const cores = v => (+v.toFixed(1)) + " cores";

  function drawCoreChart(workload, mgmt, ha, available) {
    const unused   = Math.max(available - workload, 0);
    const overflow = Math.max(workload - available, 0);

    if (coreChart) coreChart.destroy();
    coreChart = new Chart3D($("coreChart"), {
      type: "donut", title: "Cluster Core Allocation", format: cores,
      slices: [
        { label: "Workload Cores",       value: Math.min(workload, available), color: C3D_COLORS.blue },
        { label: "Management Overhead",  value: mgmt,   color: C3D_COLORS.orange },
        { label: "Available (Unused)",   value: unused, color: C3D_COLORS.aqua },
        { label: "HA Reserved (1 Node)", value: ha,     color: C3D_COLORS.violet }
      ],
      /* Overflow is demand above capacity, not a part of the cluster, so the center reports it */
      center: () => overflow > 0
        ? { value: "Short by " + overflow + " cores", label: "Insufficient capacity", critical: true }
        : { value: (available > 0 ? Math.round(workload / available * 100) : 0) + "%", label: "Core utilization" }
    });
  }

  function drawNodeChart(nodes, coresPerNode, mgmtPerNode, availPerNode, totalWorkloadCores, workloadNodes, haEnabled) {
    const labels = [], mgmtData = [], workloadData = [], freeData = [], missingData = [];
    const workloadPerNode = workloadNodes > 0 ? Math.ceil(totalWorkloadCores / workloadNodes) : 0;

    for (let i = 1; i <= nodes; i++) {
      const isHA = haEnabled && nodes > 1 && i === nodes;
      labels.push("Node " + i + (isHA ? " (HA)" : ""));
      mgmtData.push(mgmtPerNode);
      if (isHA) {
        workloadData.push(0);
        freeData.push(availPerNode);
        missingData.push(0);
      } else {
        const assigned = Math.min(workloadPerNode, availPerNode);
        workloadData.push(assigned);
        freeData.push(Math.max(availPerNode - assigned, 0));
        missingData.push(Math.max(workloadPerNode - availPerNode, 0));
      }
    }
    const series = [
      { label: "Management",  color: C3D_COLORS.orange, data: mgmtData },
      { label: "VM Workload", color: C3D_COLORS.blue,   data: workloadData },
      { label: "Free",        color: C3D_COLORS.aqua,   data: freeData }
    ];
    /* a CPU that is too small: the workload cores each node lacks, stacked above its capacity */
    if (missingData.some(v => v > 0)) series.push({ label: "Missing (short)", color: C3D.critical, data: missingData });

    if (nodeChart) nodeChart.destroy();
    nodeChart = new Chart3D($("nodeChart"), {
      type: "bar", title: "Per-Node Core Distribution", categories: labels,
      format: cores, axisFormat: v => String(+v.toFixed(1)),
      series
    });
  }

  /* ================================================================
     PDF EXPORT
     ================================================================ */
  function exportPdf() {
    const btn = $("exportPdfBtn");
    btn.textContent = "Generating...";
    btn.disabled = true;

    try {
      const root = $("calcRoot");

      /* Capture chart canvases to static images before cloning */
      const chartImages = {};
      root.querySelectorAll("canvas").forEach(c => {
        try { chartImages[c.id] = c.toDataURL("image/png"); } catch(e) {}
      });

      /* Clone the calculator root */
      const clone = root.cloneNode(true);

      /* Replace canvas elements with img snapshots */
      clone.querySelectorAll("canvas").forEach(c => {
        const img = document.createElement("img");
        img.src = chartImages[c.id] || "";
        img.style.cssText = "width:100%;height:100%;object-fit:contain;display:block";
        c.parentNode.replaceChild(img, c);
      });

      /* Hide buttons and no-print elements */
      clone.querySelectorAll(".btn-row,.no-print").forEach(el => {
        el.style.display = "none";
      });

      /* Extract inline styles from this document */
      let styles = "";
      for (let i = 0; i < document.styleSheets.length; i++) {
        try {
          const rules = document.styleSheets[i].cssRules || document.styleSheets[i].rules;
          for (let j = 0; j < rules.length; j++) styles += rules[j].cssText + "\n";
        } catch(e) {}
      }

      /* Open a dedicated print window */
      const win = window.open("", "_blank", "width=960,height=800");
      if (!win) {
        alert("Pop-up blocked. Allow pop-ups for this page and try again, or use Ctrl+P to print.");
        btn.textContent = "Export to PDF";
        btn.disabled = false;
        return;
      }

      win.document.write(
        "<!DOCTYPE html><html lang='en'><head>" +
        "<meta charset='UTF-8'>" +
        "<title>Azure Local CPU Calculator - Export</title>" +
        "<style>" + styles + "</style>" +
        "<style>body{margin:0;padding:16px}" +
        ".btn-row,.no-print{display:none!important}" +
        "@media print{.btn-row,.no-print{display:none!important}}</style>" +
        "</head><body>" + clone.outerHTML + "</body></html>"
      );
      win.document.close();
      setTimeout(() => { win.print(); }, 500);

    } catch(err) {
      console.error("Export failed:", err);
      alert("Export failed: " + (err.message || err) + "\nUse Ctrl+P / Cmd+P to print instead.");
    }

    btn.textContent = "Export to PDF";
    btn.disabled = false;
  }

  /* ================================================================
     ODIN IMPORT
     Reads a Sizer ("Export JSON") or Designer ("Export Configuration")
     file from ODIN for Azure Local and normalizes it.
     https://azure.github.io/odinforazurelocal/docs/json-schema/
     ================================================================ */
  var ODIN_CPU_GENERATIONS = {
    "xeon-4th": "Intel 4th Gen Xeon (Sapphire Rapids)",
    "xeon-5th": "Intel 5th Gen Xeon (Emerald Rapids)",
    "xeon-6": "Intel Xeon 6 (Granite Rapids / Sierra Forest)",
    "xeon-d-27xx": "Intel Xeon D-2700 (Ice Lake-D)",
    "epyc-4th": "AMD 4th Gen EPYC (Genoa)",
    "epyc-4th-c": "AMD 4th Gen EPYC (Bergamo)",
    "epyc-5th": "AMD 5th Gen EPYC (Turin)",
    "epyc-5th-c": "AMD 5th Gen EPYC (Turin Dense)"
  };
  var ODIN_AVD_PROFILES = {
    light:  { multi: [0.5, 2, 20], single: [2, 8, 32] },
    medium: { multi: [1, 4, 40],   single: [4, 16, 32] },
    heavy:  { multi: [1.5, 6, 60], single: [8, 32, 32] },
    power:  { multi: [2, 8, 80],   single: [8, 32, 80] },
    custom: { multi: [2, 8, 50],   single: [4, 16, 50] }
  };
  var ODIN_GHEL_TIERS = {
    "trial": [4, 32, 900], "up-to-1000": [8, 48, 900], "1000-to-3000": [16, 64, 1400],
    "3000-to-5000": [32, 128, 1900], "5000-to-8000": [48, 256, 3400], "8000-to-10000": [64, 512, 5400]
  };
  var ODIN_EDGERAG_LLM = { "external": [0, 0, 0], "foundry-minimum": [8, 32, 50], "foundry-production": [16, 64, 100] };

  function odinInt(v, def) { var n = parseInt(v, 10); return isFinite(n) ? n : def; }
  function odinNum(v, def) { var n = parseFloat(v); return isFinite(n) ? n : def; }
  function odinEsc(s) {
    return String(s).replace(/[&<>"']/g, function(c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* Mirrors calculateWorkloadRequirements() in ODIN sizer.js.
     Returns raw (pre-growth) vCPU, memory GB, storage GB and VM count. */
  function odinWorkloadReqs(w) {
    var v = 0, m = 0, s = 0, vms = 0;
    switch (w.type) {
      case "vm": {
        var count = Math.max(odinInt(w.count, 1), 1);
        v = odinNum(w.vcpus, 0) * count; m = odinNum(w.memory, 0) * count; s = odinNum(w.storage, 0) * count;
        vms = count;
        break;
      }
      case "aks": {
        var clusters = Math.max(odinInt(w.clusterCount, 1), 1);
        var cp = odinInt(w.controlPlaneNodes, 3), wk = odinInt(w.workerNodes, 3);
        v = (cp * odinNum(w.controlPlaneVcpus, 4) + wk * odinNum(w.workerVcpus, 8)) * clusters;
        m = (cp * odinNum(w.controlPlaneMemory, 8) + wk * odinNum(w.workerMemory, 16)) * clusters;
        s = (cp * 200 + wk * (200 + odinNum(w.workerStorage, 200))) * clusters;
        vms = (cp + wk) * clusters;
        break;
      }
      case "avd": {
        var users = Math.max(odinInt(w.userCount, 50), 0);
        var sType = w.sessionType === "single" ? "single" : "multi";
        var conc = sType === "single" ? 1 : odinNum(w.concurrency, 100) / 100;
        var concUsers = Math.ceil(users * conc);
        var p = (ODIN_AVD_PROFILES[w.profile] || ODIN_AVD_PROFILES.medium)[sType];
        var vpu = p[0], mpu = p[1], spu = p[2];
        if (w.profile === "custom") {
          vpu = odinNum(w.customVcpus, 2); mpu = odinNum(w.customMemory, 8); spu = odinNum(w.customStorage, 50);
        }
        v = Math.ceil(vpu * concUsers); m = mpu * concUsers; s = spu * users;
        if (w.fslogix) s += odinNum(w.fslogixSize, 30) * users;
        vms = sType === "single" ? concUsers : 1;
        break;
      }
      case "foundry": {
        var fw = Math.max(odinInt(w.workerNodes, 2), 1);
        var fv = 8, fm = 32;
        if (w.workerProfile === "minimum") { fv = 4; fm = 16; }
        else if (w.workerProfile === "custom") { fv = odinNum(w.customVcpus, 8); fm = odinNum(w.customMemory, 32); }
        v = 12 + fv * fw + 2; m = 24 + fm * fw + 4;
        s = 600 + 200 * fw + odinNum(w.modelCacheStorageGB, 100) * Math.max(odinInt(w.modelDeployments, 1), 1);
        vms = 3 + fw;
        break;
      }
      case "edgerag": {
        var emb = w.deploymentMode === "agentic" ? 0 : 2;
        var llm = ODIN_EDGERAG_LLM[w.llmEndpoint] || ODIN_EDGERAG_LLM["foundry-production"];
        v = 12 + 24 + emb * 8 + llm[0]; m = 24 + 96 + emb * 16 + llm[1];
        s = 600 + (3 + emb) * 200 + llm[2] + Math.ceil(odinNum(w.corpusGB, 100) * 1.5);
        vms = 6 + emb;
        break;
      }
      case "videoindexer": {
        var isMin = w.configuration === "minimum";
        v = 12 + (isMin ? 32 : 64); m = 24 + (isMin ? 64 : 256);
        s = 600 + (isMin ? 1 : 2) * 200 + (isMin ? 50 : 100);
        vms = 3 + (isMin ? 1 : 2);
        break;
      }
      case "ghel": {
        var t = ODIN_GHEL_TIERS[w.tier] || ODIN_GHEL_TIERS["up-to-1000"];
        var rep = (typeof w.replicas === "number" && w.replicas >= 0 && w.replicas <= 7) ? w.replicas : (w.ha ? 1 : 0);
        var mult = 1 + (w.actions ? 0.25 : 0) + (w.codeSecurity ? 0.25 : 0);
        vms = 1 + rep;
        v = Math.ceil(t[0] * mult) * vms; m = Math.ceil(t[1] * mult) * vms; s = t[2] * vms;
        break;
      }
    }
    return { vcpus: v, memory: m, storage: s, vms: vms };
  }

  /* Mirrors the ODIN Sizer network model (infrastructure power estimate):
     per rack 2 ToR + 1 BMC; rack-aware uses 2 racks; disaggregated adds
     2 FC switches per rack for FC SAN plus the spine switches; a single node
     only has a BMC switch. Designer ToR choices override the defaults. */
  function odinNetwork(clusterType, nodes, st) {
    var tor, bmc, fc = 0, spine = 0;
    var torChoice = st.torSwitchCount === "single" ? 1 : (st.torSwitchCount === "dual" ? 2 : null);
    if (clusterType === "disaggregated") {
      var racks = Math.max(odinInt(st.disaggRackCount, 2), 1);
      tor = racks * 2; bmc = racks;
      fc = (st.disaggStorageType || "fc_san") === "fc_san" ? racks * 2 : 0;
      spine = Math.max(odinInt(st.disaggSpineCount, 2), 0);
    } else if (clusterType === "rack-aware") {
      tor = 2 * (odinInt(st.rackAwareTorsPerRoom, 0) || 2); bmc = 2;
    } else if (nodes === 1) {
      tor = torChoice || 0; bmc = 1;
    } else {
      tor = torChoice || 2; bmc = 1;
    }
    var parts = [];
    if (tor) parts.push(tor + " ToR");
    parts.push(bmc + " BMC");
    if (fc) parts.push(fc + " FC");
    if (spine) parts.push(spine + " Spine");
    return { total: tor + bmc + fc + spine, detail: parts.join(" + ") };
  }

  /* Mirrors getHostCpuReservedCores() in ODIN sizer.js (cores per node). */
  function odinHostReservedCores(clusterType, totalCores) {
    if (clusterType === "aldo-mgmt") return Math.max(Math.ceil(0.20 * totalCores), 2);
    if (clusterType === "disaggregated") return Math.max(Math.ceil(0.10 * totalCores), 1);
    return Math.max(Math.ceil(0.10 * totalCores), 2);
  }

  function parseOdinConfig(text) {
    var json;
    try { json = JSON.parse(text); } catch (e) { throw new Error("The file is not valid JSON."); }
    if (!json || typeof json !== "object") throw new Error("The file is not a valid ODIN export.");

    var r = {
      source: null, nodes: null, clusterType: null, scenario: "connected", resiliency: null,
      cpu: null, vcpuRatio: null, growthPct: 0, growthYears: 1, growthFactor: 1,
      disks: null, workloadCount: 0, totals: null, avdVcpus: 0, vmEquivalents: 0, network: null, hostReservedCores: null
    };

    if (json.state && typeof json.state === "object") {
      /* Designer export: { version, exportedAt, state } */
      var st = json.state, hw = st.sizerHardware && typeof st.sizerHardware === "object" ? st.sizerHardware : null;
      r.source = "ODIN Designer";
      r.scenario = st.scenario || "connected";
      r.clusterType = st.architecture === "disaggregated" ? "disaggregated"
        : (st.clusterRole === "management" ? "aldo-mgmt"
        : (hw && hw.clusterType ? hw.clusterType
        : (st.scale === "rack_aware" ? "rack-aware" : "standard")));
      r.nodes = odinInt(st.nodes, null) || (hw ? odinInt(hw.nodeCount, null) : null);
      if (r.nodes === 1 && r.clusterType === "standard") r.clusterType = "single";
      r.network = odinNetwork(r.clusterType, r.nodes, st);
      if (hw) {
        r.resiliency = hw.resiliency || null;
        if (hw.cpu && odinInt(hw.cpu.coresPerSocket, 0) > 0) {
          r.cpu = {
            manufacturer: hw.cpu.manufacturer || "",
            generation: hw.cpu.generation || "Unknown",
            coresPerSocket: odinInt(hw.cpu.coresPerSocket, 0),
            sockets: odinInt(hw.cpu.sockets, 2)
          };
        }
        r.vcpuRatio = odinInt(hw.vcpuRatio, null);
        r.growthPct = odinInt(hw.futureGrowth, 0);
        var dc = hw.storage && hw.storage.diskConfig;
        if (dc && dc.capacity) {
          r.disks = {
            isTiered: !!dc.isTiered,
            capacityCount: odinInt(dc.capacity.count, 0),
            capacityTB: odinNum(dc.capacity.sizeGB, 0) / 1024,
            cacheCount: dc.cache ? odinInt(dc.cache.count, 0) : 0,
            cacheTB: dc.cache ? odinNum(dc.cache.sizeGB, 0) / 1024 : 0
          };
        }
        var sw = Array.isArray(st.sizerWorkloads) ? st.sizerWorkloads
          : (st.sizerWorkloads && typeof st.sizerWorkloads === "object" ? Object.keys(st.sizerWorkloads).map(function(k) { return st.sizerWorkloads[k]; }) : []);
        var t = { vcpus: 0, memory: 0, storage: 0 };
        sw.forEach(function(w) {
          if (!w || typeof w !== "object") return;
          t.vcpus += odinNum(w.totalVcpus, 0); t.memory += odinNum(w.totalMemoryGB, 0); t.storage += odinNum(w.totalStorageGB, 0);
          if (w.type === "avd") r.avdVcpus += odinNum(w.totalVcpus, 0);
          r.vmEquivalents += w.type === "vm" ? Math.max(odinInt(w.count, 1), 1) : 1;
        });
        r.workloadCount = sw.length;
        if (sw.length) r.totals = t;
      }
    } else {
      /* Sizer export: { _meta, data } or the bare data object */
      var d = json.data && typeof json.data === "object" ? json.data : json;
      if (!d.clusterType && !Array.isArray(d.workloads)) {
        throw new Error("This file is not an ODIN Sizer or Designer export.");
      }
      r.source = "ODIN Sizer";
      r.clusterType = d.clusterType || "standard";
      r.scenario = r.clusterType === "aldo-mgmt" ? "disconnected" : "connected";
      r.nodes = r.clusterType === "single" ? 1 : odinInt(d.nodeCount, null);
      r.resiliency = d.resiliency || null;
      if (odinInt(d.cpuCores, 0) > 0) {
        r.cpu = {
          manufacturer: d.cpuManufacturer || "",
          generation: d.importedProcessorName || ODIN_CPU_GENERATIONS[d.cpuGeneration] || d.cpuGeneration || "Unknown",
          coresPerSocket: odinInt(d.cpuCores, 0),
          sockets: odinInt(d.cpuSockets, 2)
        };
      }
      r.vcpuRatio = odinInt(d.vcpuRatio, null);
      r.growthPct = odinInt(d.futureGrowth, 0);
      r.growthYears = d.sizeFor5YrGrowth === true ? 5 : 1;
      var tiered = d.storageConfig === "mixed-flash" || d.storageConfig === "hybrid";
      if (tiered) {
        r.disks = {
          isTiered: true,
          capacityCount: odinInt(d.tieredCapacityDiskCount, 4), capacityTB: odinNum(d.tieredCapacityDiskSize, 3.84),
          cacheCount: odinInt(d.cacheDiskCount, 2), cacheTB: odinNum(d.cacheDiskSize, 1.92)
        };
      } else if (odinInt(d.capacityDiskCount, 0) > 0) {
        r.disks = { isTiered: false, capacityCount: odinInt(d.capacityDiskCount, 0), capacityTB: odinNum(d.capacityDiskSize, 0), cacheCount: 0, cacheTB: 0 };
      }
      r.network = odinNetwork(r.clusterType, r.nodes, {
        disaggRackCount: d.disaggRackCount, disaggSpineCount: d.disaggSpineCount, disaggStorageType: d.disaggStorageType
      });
      var wl = Array.isArray(d.workloads) ? d.workloads : [];
      var tt = { vcpus: 0, memory: 0, storage: 0 };
      wl.forEach(function(w) {
        if (!w || typeof w !== "object") return;
        var q = odinWorkloadReqs(w);
        tt.vcpus += q.vcpus; tt.memory += q.memory; tt.storage += q.storage;
        if (w.type === "avd") r.avdVcpus += q.vcpus;
        r.vmEquivalents += q.vms;
      });
      r.workloadCount = wl.length;
      if (wl.length) r.totals = tt;
    }

    r.growthFactor = Math.pow(1 + r.growthPct / 100, r.growthYears);
    if (!r.nodes || r.nodes < 1) r.nodes = null;
    if (r.cpu) r.hostReservedCores = odinHostReservedCores(r.clusterType, r.cpu.coresPerSocket * r.cpu.sockets);
    if (r.cpu && (!r.cpu.generation || r.cpu.generation === "Unknown")) {
      r.cpu.generation = r.cpu.manufacturer === "amd" ? "AMD CPU" : (r.cpu.manufacturer ? "Intel CPU" : "CPU");
    }
    return r;
  }

  /* Opens a file picker, parses the chosen ODIN file and hands it to onLoad
     together with the raw text (used to share the import). */
  function pickOdinFile(input, onLoad, onError) {
    input.value = "";
    input.onchange = function() {
      var file = input.files && input.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) { onError("The file is larger than 5 MB."); return; }
      var reader = new FileReader();
      reader.onload = function() {
        var text = String(reader.result), cfg;
        try { cfg = parseOdinConfig(text); }
        catch (e) { onError(e.message || String(e)); return; }
        onLoad(cfg, file.name, text);
      };
      reader.onerror = function() { onError("The file could not be read."); };
      reader.readAsText(file);
    };
    input.click();
  }

  function odinClusterLabel(t) {
    return { "single": "Single Node", "standard": "Hyperconverged", "rack-aware": "Rack Aware",
             "disaggregated": "Disaggregated Storage", "aldo-mgmt": "Disconnected Operations (Management)" }[t] || t || "Unknown";
  }

  /* Renders the import summary into the given box using the existing result-box style. */
  function showOdinSummary(box, cfg, fileName, applied, notes) {
    var h = "<strong>Imported from " + odinEsc(cfg.source) + ":</strong> " + odinEsc(fileName) + "<br>";
    h += "<strong>Cluster:</strong> " + odinEsc(odinClusterLabel(cfg.clusterType)) +
         (cfg.nodes ? ", " + cfg.nodes + " node" + (cfg.nodes > 1 ? "s" : "") : "") +
         (cfg.scenario === "disconnected" ? " (disconnected)" : "") + "<br>";
    applied.forEach(function(a) { h += "<strong>" + odinEsc(a[0]) + ":</strong> " + odinEsc(a[1]) + "<br>"; });
    notes.forEach(function(n) { h += '<span class="warning">' + odinEsc(n) + "</span><br>"; });
    box.innerHTML = h;
    box.style.display = "block";
  }

  /* Shares one ODIN import with every calculator: the others on the same
     page (or in other blog tabs) apply it right away, and it is kept for the
     browser session so the other calculator pages load it as well. */
  var ODIN_SHARE_KEY = "azureLocalCalculator.odinImport";
  var ODIN_SHARE_EVENT = "azurelocal-calculator-odin-import";
  var odinChannel = null;
  try { if (typeof BroadcastChannel === "function") odinChannel = new BroadcastChannel(ODIN_SHARE_EVENT); } catch (e) {}

  function shareOdinImport(text, fileName, sourceId) {
    var msg = { text: text, fileName: fileName, source: sourceId };
    try { sessionStorage.setItem(ODIN_SHARE_KEY, JSON.stringify(msg)); } catch (e) {}
    try {
      if (odinChannel) odinChannel.postMessage(msg);
      else window.dispatchEvent(new CustomEvent(ODIN_SHARE_EVENT, { detail: msg }));
    } catch (e) {}
  }

  /* Calls apply(cfg, label) for imports made in another calculator and, on
     page load, for the import stored earlier in this browser session. */
  function listenOdinImport(sourceId, apply) {
    function handle(msg, suffix) {
      if (!msg || typeof msg.text !== "string" || msg.source === sourceId) return;
      try { apply(parseOdinConfig(msg.text), String(msg.fileName || "ODIN export") + suffix); }
      catch (e) { if (window.console) console.warn("Shared ODIN import skipped:", e); }
    }
    if (odinChannel) odinChannel.addEventListener("message", function(ev) { handle(ev.data, " (shared from another calculator)"); });
    else window.addEventListener(ODIN_SHARE_EVENT, function(ev) { handle(ev.detail, " (shared from another calculator)"); });
    var saved = null;
    try { saved = JSON.parse(sessionStorage.getItem(ODIN_SHARE_KEY) || "null"); } catch (e) {}
    if (saved && typeof saved === "object") { saved.source = null; handle(saved, " (restored from this browser session)"); }
  }

  function applyOdinConfig(cfg, fileName) {
    const applied = [], notes = [];
    chosenCpuName = null;

    if (selectedNodeType()) {
      $("nodeType").value = "";
      applyNodeType();
      notes.push("The node type filter was cleared, because the ODIN design defines its own CPU.");
    }

    const odinType = clusterTypes[cfg.clusterType] ? cfg.clusterType : "standard";
    $("clusterType").value = odinType;
    applyClusterType();
    if (odinType !== "standard") applied.push(["Cluster Type", clusterTypes[odinType].label]);

    if (isAldo()) {
      notes.push("The management cluster workload is the fixed control plane appliance (" + ALDO.applianceVcpus + " vCPUs), so the ODIN workload totals were not applied.");
    } else if (cfg.totals && cfg.totals.vcpus > 0) {
      const total = Math.ceil(cfg.totals.vcpus * cfg.growthFactor);
      let vms = Math.max(cfg.vmEquivalents, 1);
      let perVm = Math.ceil(total / vms);
      if (perVm > 128) { vms = Math.ceil(total / 128); perVm = Math.ceil(total / vms); }
      vms = Math.ceil(total / perVm);
      $("vmCount").value = vms;
      $("vcpusPerVm").value = perVm;
      applied.push(["Workloads", vms + " VMs x " + perVm + " vCPUs (ODIN total: " + total + " vCPUs from " + cfg.workloadCount + " workload(s)" +
        (cfg.growthPct ? ", incl. " + cfg.growthPct + "% growth" + (cfg.growthYears > 1 ? " over " + cfg.growthYears + " years" : "") : "") + ")"]);
      if (vms * perVm !== total) notes.push("The vCPU total was rounded up to " + (vms * perVm) + " vCPUs to fit the VM x vCPU inputs.");
    } else {
      notes.push("The file has no workload data. The workload inputs were not changed.");
    }

    if (cfg.vcpuRatio) {
      $("overcommitRatio").value = cfg.vcpuRatio;
      applied.push(["vCPU : Physical Core Ratio", cfg.vcpuRatio + ":1"]);
    }
    if (cfg.nodes) {
      $("nodeCount").value = cfg.nodes;
      $("haEnabled").checked = true;
      applied.push(["Nodes", cfg.nodes + (cfg.nodes > 1 ? " (ODIN sizes with N+1)" : "")]);
    }

    if (cfg.cpu) {
      $("socketsPerNode").value = cfg.cpu.sockets === 1 ? "1" : "2";
      const gen = String(cfg.cpu.generation).replace(/[<>&"'®™]/g, "");
      importedCpu = {
        name: "ODIN: " + gen + " (" + cfg.cpu.coresPerSocket + " cores)",
        vendor: cfg.cpu.manufacturer === "amd" ? "AMD" : "Intel",
        gen: gen, cores: cfg.cpu.coresPerSocket, tdp: null
      };
      const sel = $("cpuSelect");
      let og = sel.querySelector("optgroup[data-odin]");
      if (!og) {
        og = document.createElement("optgroup");
        og.label = "Imported from ODIN";
        og.setAttribute("data-odin", "1");
        sel.insertBefore(og, sel.firstChild);
      }
      og.innerHTML = "";
      const opt = document.createElement("option");
      opt.value = importedCpu.name;
      opt.textContent = importedCpu.name;
      og.appendChild(opt);
      sel.value = importedCpu.name;
      sel.dispatchEvent(new Event("change"));
      applied.push(["CPU", cfg.cpu.sockets + " x " + gen + ", " + cfg.cpu.coresPerSocket + " cores/socket (selectable in CPU mode)"]);
    }
    if (cfg.hostReservedCores) {
      $("mgmtOverhead").value = cfg.hostReservedCores;
      applied.push(["Management Overhead per Node", cfg.hostReservedCores + " cores (ODIN host reservation)"]);
    }

    showOdinSummary($("importBox"), cfg, fileName, applied, notes);
    $("modeNodesBtn").click();
    if (cfg.nodes || (cfg.totals && cfg.totals.vcpus > 0)) calculate();
  }

  $("importOdinBtn").addEventListener("click", function () {
    pickOdinFile($("odinFile"), (cfg, fileName, text) => {
      applyOdinConfig(cfg, fileName);
      shareOdinImport(text, fileName, "cpu");
    }, msg => alert("ODIN import failed: " + msg));
  });

  /* ---- events ---- */
  $("calcBtn").addEventListener("click", calculate);
  $("calcByCpuBtn").addEventListener("click", calculateByCpu);
  $("exportPdfBtn").addEventListener("click", exportPdf);

  /* ---- automatic recalculation ----
     Choosing a CPU recalculates the required nodes and the charts. After a first
     calculation, any other input change recalculates the active mode, so results,
     recommendations and charts never show a stale node type or CPU. Only user
     events count (fillCpuSelect dispatches its own change events). */
  let recalcTimer = null;
  function onInputChange(e) {
    const t = e.target;
    if (!e.isTrusted || !t.id || t.id === "odinFile" || t.id === "nodeTypeInfo") return;
    const mode = t.id === "cpuSelect" ? "cpu" : lastRun;
    if (!mode) return;
    clearTimeout(recalcTimer);
    recalcTimer = setTimeout(() => { if (mode === "cpu") calculateByCpu(); else calculate(); }, 120);
  }
  $("calcRoot").addEventListener("change", onInputChange);
  $("calcRoot").addEventListener("input", onInputChange);
  listenOdinImport("cpu", applyOdinConfig);
})();
</script>
</body>
</html>


### Storage Calculator

For detailed Storage Spaces Direct sizing I recommend the dedicated tool [Armin](https://www.linkedin.com/in/aoberneder/) created: [s2d-calculator.com](https://s2d-calculator.com/). My original Storage Calculator is outdated. The version on this page is its redesign and adds the deployment types that a pure Storage Spaces Direct calculator does not cover.
{: .notice--warning}

The Storage Calculator estimates raw, effective and usable capacity, either from your drive layout or from a capacity target.

- **Deployment Type**: hyperconverged (Storage Spaces Direct), hyperconverged with external SAN, disaggregated (SAN only, up to 64 nodes) or the management cluster of disconnected operations.
- **External SAN**: the supported arrays from Dell, Everpure, Hitachi, HPE, Lenovo and NetApp with their MPIO registration, the Fibre Channel or iSCSI host requirements, the LUN layout (one LUN per CSV) and the physical capacity to buy after free space headroom and data reduction.
- **Disconnected operations**: checks the drive count and drive size of the management cluster and reserves its 2 TB infrastructure volume.

<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    #storageV2_calcRoot,
    #storageV2_calcRoot *{box-sizing:border-box}
    #storageV2_calcRoot{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;margin:20px 0;text-align:center}
    #storageV2_calcRoot h3{font-size:1.5em;margin-bottom:20px}

    #storageV2_calcRoot .card{margin:20px 0;padding:0;text-align:left}
    #storageV2_calcRoot .card h3{margin:0 0 20px;font-size:1.5em}

    #storageV2_calcRoot .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px 20px}
    @media(max-width:700px){#storageV2_calcRoot .form-grid{grid-template-columns:1fr}}
    #storageV2_calcRoot .form-group{display:flex;flex-direction:column;min-width:0;max-width:100%}
    #storageV2_calcRoot .form-group.full{grid-column:1/-1;width:100%;min-width:0;max-width:100%}
    #storageV2_calcRoot .form-group label,
    #storageV2_calcRoot label{display:block;margin-bottom:5px;font-weight:600}
    #storageV2_calcRoot .form-group input[type=number],
    #storageV2_calcRoot .form-group select{
      width:100%;
      padding:8px;
      border:1px solid #555;
      border-radius:8px;
      box-sizing:border-box;
      margin-top:5px
    }
    #storageV2_calcRoot .form-group select{background:#444;color:#fff}
    #storageV2_calcRoot .form-group input[type=number]:focus,
    #storageV2_calcRoot .form-group select:focus{outline:none}

    #storageV2_calcRoot .chk-row{display:flex;align-items:flex-start;flex-wrap:wrap;gap:0.5rem;margin-bottom:10px;max-width:100%}
    #storageV2_calcRoot .chk-row input[type=checkbox]{margin-right:8px;transform:scale(1.2)}
    #storageV2_calcRoot .chk-row label{margin:0;font-weight:600;flex:1 1 14rem;min-width:0;overflow-wrap:anywhere}

    #storageV2_calcRoot .btn-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:8px}
    #storageV2_calcRoot .btn,
    #storageV2_calcRoot button{background:#007aff;color:#fff;border:none;border-radius:8px;padding:10px 20px;font-size:1em;cursor:pointer;margin-top:20px}
    #storageV2_calcRoot .btn:hover,
    #storageV2_calcRoot button:hover{background:#005bb5}
    #storageV2_calcRoot .btn-secondary{background:#555;color:#fff}
    #storageV2_calcRoot .btn-secondary:hover{background:#3d3d3d}

    #storageV2_calcRoot .result-box{margin-top:20px;text-align:left;font-size:.95em;line-height:1.7}
    #storageV2_calcRoot .warning{color:#cc3300;font-weight:600}
    #storageV2_calcRoot .ok{color:#2e7d32;font-weight:600}

    #storageV2_calcRoot .charts-grid{display:grid;grid-template-columns:1fr;gap:16px;margin-top:20px}
    @media(min-width:700px){#storageV2_calcRoot .charts-grid.two-col{grid-template-columns:1fr 1fr}}
    #storageV2_calcRoot .chart-wrapper{position:relative;height:320px;text-align:center}
    #storageV2_calcRoot .chart-wrapper canvas{background:#fff;border-radius:8px;width:100%!important;height:100%!important}

    #storageV2_calcRoot .overview-table{width:100%;border-collapse:collapse;margin-top:15px;text-align:left;font-size:.9em}
    #storageV2_calcRoot .overview-table th,
    #storageV2_calcRoot .overview-table td{padding:8px 10px;border-bottom:1px solid #555}
    #storageV2_calcRoot .overview-table th{font-weight:600}
    #storageV2_calcRoot .overview-table td:last-child{text-align:right}
    #storageV2_calcRoot .overview-table .section-header{font-weight:700;color:#007aff}
    #storageV2_calcRoot .overview-table .total-row{font-weight:700}
    #storageV2_calcRoot .overview-table .formula{font-size:.86em;opacity:.8}

    #storageV2_calcRoot .res-options{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-top:8px}
    #storageV2_calcRoot .res-option{border:1px solid #555;border-radius:8px;padding:12px;cursor:pointer;transition:border-color .2s}
    #storageV2_calcRoot .res-option:hover:not(.disabled){border-color:#007aff}
    #storageV2_calcRoot .res-option.selected{border-color:#007aff}
    #storageV2_calcRoot .res-option.disabled{opacity:.4;cursor:not-allowed}
    #storageV2_calcRoot .res-option .res-name{font-weight:700;font-size:.9em;margin-bottom:4px}
    #storageV2_calcRoot .res-option .res-detail{font-size:.78em;line-height:1.4;opacity:.85}
    #storageV2_calcRoot .res-option .res-eff{font-size:.82em;font-weight:600;color:#007aff;margin-top:4px}

    #storageV2_calcRoot .mode-tabs{display:flex;border-radius:8px;overflow:hidden;border:1px solid #555;margin-bottom:16px}
    #storageV2_calcRoot .mode-tab{flex:1;padding:10px 12px;border:none;cursor:pointer;font-weight:600;font-size:.88em;background:#444;color:#fff;margin-top:0;border-radius:0}
    #storageV2_calcRoot .mode-tab:hover{background:#555}
    #storageV2_calcRoot .mode-tab.active{background:#007aff;color:#fff}
    #storageV2_calcRoot .mode-tab:not(:last-child){border-right:1px solid #555}

    #storageV2_calcRoot .size-options{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;margin-top:8px}
    #storageV2_calcRoot .size-opt{display:flex;align-items:center;gap:8px;padding:8px 10px;border:1px solid #555;border-radius:8px;cursor:pointer;transition:border-color .2s;user-select:none}
    #storageV2_calcRoot .size-opt.checked{border-color:#007aff}
    #storageV2_calcRoot .size-opt input[type=checkbox]{width:16px;height:16px;accent-color:#007aff;cursor:pointer;flex-shrink:0}
    #storageV2_calcRoot .size-opt span{font-size:.88em;font-weight:500}

    #storageV2_calcRoot .compare-table{width:100%;border-collapse:collapse;font-size:.88em;margin-top:4px}
    #storageV2_calcRoot .compare-table th,
    #storageV2_calcRoot .compare-table td{padding:8px 10px;text-align:right;border-bottom:1px solid #555}
    #storageV2_calcRoot .compare-table th:first-child,
    #storageV2_calcRoot .compare-table td:first-child{text-align:left}
    #storageV2_calcRoot .compare-table th{font-weight:600}
    #storageV2_calcRoot .compare-table .infeasible{opacity:.5}
    #storageV2_calcRoot .compare-table .best td{color:#2e7d32;font-weight:700}

    #storageV2_calcRoot .disclaimer{font-size:.8em;margin-top:20px;text-align:left;line-height:1.6}
    #storageV2_calcRoot .disclaimer a{color:#007aff;text-decoration:none}
    #storageV2_calcRoot .disclaimer a:hover{text-decoration:underline}

    @media print{
      #storageV2_calcRoot .btn-row,#storageV2_calcRoot .no-print{display:none!important}
      #storageV2_calcRoot .card,#storageV2_calcRoot .chart-wrapper{break-inside:avoid}
      #storageV2_calcRoot .chart-wrapper{height:260px}
    }
  </style>
</head>
<body>
<div class="container" id="storageV2_calcRoot">

  <!-- Card 1: Cluster Configuration -->
  <div class="card">
    <h3>Cluster Configuration</h3>
    <div class="form-grid">
      <div class="form-group full">
        <label for="storageV2_deployType">Deployment Type</label>
        <select id="storageV2_deployType">
          <option value="s2d" selected>Hyperconverged (Storage Spaces Direct)</option>
          <option value="hybrid">Hyperconverged with external SAN (Storage Spaces Direct + SAN)</option>
          <option value="disaggregated">Disaggregated (external SAN only, up to 64 nodes)</option>
          <option value="aldo-mgmt">Disconnected operations (ALDO): management cluster</option>
        </select>
        <div id="storageV2_deployInfo" style="font-size:.82em;margin-top:6px"></div>
      </div>
      <div class="form-group full" id="storageV2_aldoProfileGroup" style="display:none">
        <label for="storageV2_aldoProfile">Management Cluster Configuration</label>
        <select id="storageV2_aldoProfile">
          <option value="standard" selected>Standard: 128 GB memory, 6 data drives of at least 2 TB per node (100+ nodes managed)</option>
          <option value="datacenter">Datacenter: 512 GB memory, 8 data drives of at least 2 TB per node (1000+ nodes managed)</option>
        </select>
      </div>
      <div class="form-group full">
        <div class="chk-row">
          <input type="checkbox" id="storageV2_singleNode">
          <label for="storageV2_singleNode">Single Node Cluster</label>
        </div>
      </div>
      <div class="form-group" id="storageV2_nodeCountGroup">
        <label for="storageV2_nodeCount">Number of Nodes</label>
        <select id="storageV2_nodeCount"></select>
      </div>
    </div>
  </div>

  <!-- Card 2: Calculation Mode -->
  <div class="card" id="storageV2_modeCard">
    <h3>Calculation Mode</h3>
    <p style="font-size:.85em;color:inherit;margin:0 0 12px">Choose your starting point: specify your drives to calculate effective storage, or set a storage target to find the required drives.</p>

    <div class="mode-tabs">
      <button class="mode-tab active" id="storageV2_modeABtn">I know my drives - calculate storage</button>
      <button class="mode-tab" id="storageV2_modeBBtn">I have a storage target - calculate drives</button>
    </div>

    <!-- Mode A: Drive Configuration -->
    <div id="storageV2_modeAPanel">
      <div class="form-grid">
        <div class="form-group">
          <label for="storageV2_ffCount">NVMe Drives per Node</label>
          <input type="number" id="storageV2_ffCount" value="4" min="1" max="24" step="1">
        </div>
        <div class="form-group">
          <label for="storageV2_ffCapacity">NVMe Drive Capacity</label>
          <select id="storageV2_ffCapacity">
            <option value="0.96">0.96 TB (960 GB)</option>
            <option value="1.92" selected>1.92 TB</option>
            <option value="3.84">3.84 TB</option>
            <option value="7.68">7.68 TB</option>
            <option value="15.36">15.36 TB</option>
            <option value="30.72">30.72 TB</option>
            <option value="custom">Custom...</option>
          </select>
        </div>
        <div class="form-group full" id="storageV2_ffCapacityCustomGroup" style="display:none">
          <label for="storageV2_ffCapacityCustom">Custom Drive Capacity (TB)</label>
          <input type="number" id="storageV2_ffCapacityCustom" value="1.92" min="0.01" max="61.44" step="0.01">
        </div>
      </div>
    </div>

    <!-- Mode B: Target Storage -->
    <div id="storageV2_modeBPanel" style="display:none">
      <div class="form-grid">
        <div class="form-group full">
          <label for="storageV2_targetStorage">Target Effective Storage (TB)</label>
          <input type="number" id="storageV2_targetStorage" value="20" min="0.1" step="0.1">
        </div>
      </div>
      <p style="font-size:.85em;font-weight:600;color:inherit;margin:14px 0 4px">NVMe Drive Sizes to Evaluate</p>
      <div class="size-options" id="storageV2_driveSizeOptions"></div>
      <div style="display:flex;align-items:center;gap:10px;margin-top:10px;flex-wrap:wrap">
        <label for="storageV2_customDriveSize" style="font-size:.85em;font-weight:600;color:inherit">Custom size (TB):</label>
        <input type="number" id="storageV2_customDriveSize" placeholder="e.g. 3.84" min="0.01" step="0.01"
          style="width:130px;padding:8px 10px;border:1px solid #555;border-radius:8px;font-size:.9em">
      </div>
    </div>
  </div>

  <!-- Card 3: Storage Resiliency -->
  <div class="card" id="storageV2_resCard">
    <h3>Storage Resiliency</h3>
    <p style="font-size:.85em;color:inherit;margin:0 0 10px">Available options depend on your cluster size.</p>
    <div id="storageV2_resiliencyOptions" class="res-options"></div>
  </div>

  <!-- Card 4: External SAN (hybrid and disaggregated deployments) -->
  <div class="card" id="storageV2_sanCard" style="display:none">
    <h3>External SAN Storage</h3>
    <p style="font-size:.85em;color:inherit;margin:0 0 12px">Block storage presented to all nodes over Fibre Channel or iSCSI and used as NTFS Cluster Shared Volumes. Requires Azure Local 2604 or later and a supported array.</p>
    <div class="form-grid">
      <div class="form-group">
        <label for="storageV2_sanVendor">SAN Vendor</label>
        <select id="storageV2_sanVendor"></select>
      </div>
      <div class="form-group">
        <label for="storageV2_sanProtocol">Connectivity</label>
        <select id="storageV2_sanProtocol">
          <option value="fc" selected>Fibre Channel (FC)</option>
          <option value="iscsi">iSCSI (over TCP/IP)</option>
        </select>
      </div>
      <div class="form-group full" id="storageV2_sanVendorInfo" style="font-size:.82em;line-height:1.5"></div>
      <div class="form-group">
        <label for="storageV2_sanCapacity">Workload Capacity on the SAN (TB)</label>
        <input type="number" id="storageV2_sanCapacity" value="20" min="0.1" step="0.1">
      </div>
      <div class="form-group">
        <label for="storageV2_sanVolumes">SAN Volumes (one LUN per CSV)</label>
        <input type="number" id="storageV2_sanVolumes" value="4" min="1" max="64" step="1">
      </div>
      <div class="form-group">
        <label for="storageV2_sanDrr">Expected Array Data Reduction (N:1)</label>
        <input type="number" id="storageV2_sanDrr" value="1" min="1" max="10" step="0.1">
      </div>
      <div class="form-group">
        <label for="storageV2_sanHeadroom">Free Space Headroom on the Array (%)</label>
        <input type="number" id="storageV2_sanHeadroom" value="20" min="0" max="50" step="1">
      </div>
    </div>
  </div>

  <!-- Actions -->
  <div class="btn-row">
    <button class="btn btn-primary" id="storageV2_calcBtn">Calculate</button>
    <button class="btn btn-secondary" id="storageV2_exportPdfBtn" style="display:none">Export to PDF</button>
    <button class="btn btn-secondary" id="storageV2_importOdinBtn">Import from ODIN</button>
    <input type="file" id="storageV2_odinFile" accept=".json,application/json" style="display:none">
  </div>

  <!-- ODIN import summary -->
  <div id="storageV2_importBox" class="result-box" style="display:none"></div>

  <!-- Results -->
  <div id="storageV2_resultBox" class="result-box" style="display:none"></div>

  <!-- Charts (Mode A) -->
  <div id="storageV2_chartsSection" style="display:none">
    <div class="charts-grid two-col">
      <div class="chart-wrapper"><canvas id="storageV2_capacityChart"></canvas></div>
      <div class="chart-wrapper"><canvas id="storageV2_volumesChart"></canvas></div>
    </div>
  </div>

  <!-- Comparison Table (Mode B) -->
  <div id="storageV2_compareSection" class="card" style="display:none">
    <h3>Drive Size Comparison</h3>
    <p style="font-size:.82em;color:inherit;margin:0 0 8px">Minimum drives per node required to meet or exceed the target for each drive size. Rows marked with * require more than 24 drives per node and are not feasible in standard servers.</p>
    <table class="compare-table" id="storageV2_compareTable"></table>
  </div>

  <!-- Overview (Mode A) -->
  <div id="storageV2_overviewSection" class="card" style="display:none">
    <h3>Full Overview</h3>
    <table class="overview-table" id="storageV2_overviewTable"></table>
  </div>

  <!-- Disclaimers -->
  <div class="disclaimer">
    <p>
      <strong>Storage Spaces Direct (S2D) Disclaimer:</strong><br>
      This calculator estimates storage capacity for Storage Spaces Direct deployments on Azure Local using Full-Flash NVMe configurations. Calculations are based on current best practices and deployment guidelines. Actual results may vary depending on firmware, driver versions, and workload patterns. Always refer to the
      <a href="https://learn.microsoft.com/en-us/azure-stack/hci/concepts/plan-volumes?wt.mc_id=MVP_579217" target="_blank">official Microsoft documentation</a>
      for the most up-to-date information.
    </p>
    <p>
      <strong>Redundancy Disclaimer:</strong><br>
      When using 1 or 2 nodes, S2D employs Two-Way Mirror redundancy, which stores 2 copies of data. With 3+ nodes, Three-Way Mirror becomes available, storing 3 copies across different fault domains. Dual Parity requires 4+ nodes and uses erasure coding with 2 parity stripes. For a single-node configuration, a local mirror is used across drives within the same node.
    </p>
    <p>
      <strong>Dual Parity Warning:</strong><br>
      Dual Parity deviates from the standard Azure Local recommended configuration. It provides better storage efficiency than mirroring but with significantly lower write performance and higher rebuild times after a failure. It is only suitable for specific use cases (e.g., cold or archival data workloads) and should only be used if you fully understand the implications. The standard recommendation for Azure Local production deployments is Three-Way Mirror.
    </p>
    <p>
      <strong>Reserved Capacity Disclaimer:</strong><br>
      For multi-node configurations, the calculator reserves capacity equivalent to one capacity drive per node to ensure sufficient unallocated space for automatic repairs after a drive failure. For single-node clusters, no reserved capacity is applied. Actual reserve behavior may differ based on
      <a href="https://learn.microsoft.com/en-us/azure-stack/hci/concepts/plan-volumes?wt.mc_id=MVP_579217#reserve-capacity" target="_blank">Microsoft reserve capacity documentation</a>.
    </p>
    <p>
      <strong>Infrastructure Overhead:</strong><br>
      Approximately 300 GB is reserved for infrastructure volumes including Infrastructure_1 (ARC Resource Bridge and AKS images, ~250 GB), ClusterPerformanceHistory (~20 GB), and additional system overhead (~7 GB). These values are approximate and may change based on deployment specifics.
    </p>
    <p>
      <strong>Volume Distribution Disclaimer:</strong><br>
      During cloud deployment, the assignment of volumes within the storage pool (SU1_Pool) is automated. The remaining usable capacity after infrastructure volumes is divided equally among UserStorage volumes (one per node). These values are approximate and subject to change.
    </p>
    <p>
      <strong>Dual Parity Efficiency:</strong><br>
      Dual parity efficiency depends on the number of fault domains (nodes). With N nodes, the efficiency is calculated as (N-2)/N, up to a maximum of 6 data columns + 2 parity columns (75% efficiency at 8+ nodes). Dual parity provides better storage efficiency than mirrors but with lower write performance.
    </p>
    <p>
      <strong>External SAN Disclaimer:</strong><br>
      Azure Local 2604 or later can use Fibre Channel or iSCSI block storage from supported arrays (Dell PowerStore, Everpure FlashArray, Hitachi VSP, HPE Alletra MP 10000, Lenovo ThinkSystem DS/DM/DG and NetApp ONTAP) next to Storage Spaces Direct (hyperconverged with external storage) or instead of it (disaggregated). SAN-backed CSVs must be NTFS, ReFS isn't supported for them in this preview, and each LUN backs a single CSV. The data reduction and free space headroom are planning assumptions, so size the array with your storage vendor. Infrastructure volume sizes on the SAN follow the ODIN Sizer. See
      <a href="https://learn.microsoft.com/en-us/azure/azure-local/concepts/san-requirements?wt.mc_id=MVP_579217" target="_blank">supported SAN solutions</a> and
      <a href="https://learn.microsoft.com/en-us/azure/azure-local/deploy/enable-external-storage?wt.mc_id=MVP_579217" target="_blank">enable external storage on Azure Local</a>.
    </p>
    <p>
      <strong>Disconnected Operations Disclaimer:</strong><br>
      The disconnected operations (ALDO) management cluster is a dedicated cluster for the local control plane. Production needs 3 nodes, each with 6 (standard) or 8 (datacenter) SSD/NVMe data drives of at least 2 TB and a 960 GB boot drive. The deployment creates a thinly provisioned 2 TB infrastructure volume, which this calculator reserves in full. See
      <a href="https://learn.microsoft.com/en-us/azure/azure-local/manage/disconnected-operations-control-plane-appliance?wt.mc_id=MVP_579217" target="_blank">dedicated management cluster for disconnected operations</a>.
    </p>
    <p>
      <strong>No Warranty:</strong><br>
      All information in this Storage Calculator is provided "as is" with no warranties, express or implied. It does not represent official Microsoft documentation. Always verify with your hardware vendor and Microsoft documentation for accurate sizing and configuration.
    </p>
  </div>
</div>

<script>
(function () {
  "use strict";

  var $ = function(id) { return document.getElementById(id); };
  var num = function(el) { return +(el.value) || 0; };

  var capChart = null, volChart = null;
  var selectedResiliency = "two-way";
  var selectedResiliencyByMode = { A: "two-way", B: "two-way" };
  var resiliencyUserSelectedByMode = { A: false, B: false };
  var activeMode = "A";

  var COMMON_SIZES  = [0.96, 1.92, 3.84, 7.68, 15.36, 30.72];
  var MAX_DRIVES    = 24;
  var INFRA_OVERHEAD = 0.30;

  /* ================================================================
     RESILIENCY DEFINITIONS
     ================================================================ */
  var resiliencyDefs = [
    { id: "two-way",     name: "Two-Way Mirror",   desc: "Stores 2 copies of data across different nodes/drives",     minNodes: 1, maxNodes: 0, failures: 1 },
    { id: "three-way",   name: "Three-Way Mirror", desc: "Stores 3 copies across 3 different fault domains",          minNodes: 3, maxNodes: 0, failures: 2 },
    { id: "dual-parity", name: "Dual Parity",      desc: "Erasure coding with 2 parity stripes for space efficiency", minNodes: 4, maxNodes: 0, failures: 2 },
    /* Only shown when an imported ODIN configuration uses them */
    { id: "four-way",    name: "Four-Way Mirror",  desc: "Rack aware clusters: 2 copies in each rack (rack-level nested mirror)", minNodes: 4, maxNodes: 0, tolerates: "1 rack + 1 node", importOnly: true },
    { id: "simple",      name: "Simple",           desc: "Single node only: 1 copy of data without fault tolerance", minNodes: 1, maxNodes: 1, tolerates: "no failures", importOnly: true }
  ];
  var odinResiliencyShown = {};

  function getEfficiency(resId, nodes) {
    if (resId === "three-way")   return 1 / 3;
    if (resId === "four-way")    return 0.25;
    if (resId === "simple")      return 1;
    if (resId === "dual-parity") return (Math.min(nodes, 8) - 2) / Math.min(nodes, 8);
    return 0.50; // two-way default
  }

  function isResAvailable(r, nodes) {
    return nodes >= r.minNodes && (r.maxNodes === 0 || nodes <= r.maxNodes);
  }

  function resiliencyLabel(id) {
    var r = resiliencyDefs.find(function(d) { return d.id === id; });
    return r ? r.name : id;
  }

  function getDefaultResiliency(nodes) {
    if (nodes >= 3 && isResAvailable(resiliencyDefs[1], nodes)) return "three-way";
    if (isResAvailable(resiliencyDefs[0], nodes)) return "two-way";
    return null;
  }

  /* ================================================================
     INIT
     ================================================================ */
  (function init() {
    // Node count dropdown
    var sel = $("storageV2_nodeCount");
    for (var i = 2; i <= 16; i++) {
      var opt = document.createElement("option");
      opt.value = i; opt.textContent = i;
      sel.appendChild(opt);
    }

    // Drive size checkboxes for Mode B
    var container = $("storageV2_driveSizeOptions");
    COMMON_SIZES.forEach(function(size) {
      var wrap = document.createElement("label");
      wrap.className = "size-opt checked";
      wrap.style.cssText = "border-color:#007aff";

      var chk = document.createElement("input");
      chk.type = "checkbox";
      chk.className = "storageV2-drive-size-chk";
      chk.value = size;
      chk.checked = true;
      chk.addEventListener("change", function() {
        if (this.checked) {
          wrap.classList.add("checked");
          wrap.style.borderColor = "#007aff";
        } else {
          wrap.classList.remove("checked");
          wrap.style.borderColor = "#555";
        }
      });

      var lbl = document.createElement("span");
      lbl.textContent = size + " TB";

      wrap.appendChild(chk);
      wrap.appendChild(lbl);
      container.appendChild(wrap);
    });

    updateResiliencyOptions();
  })();

  /* ================================================================
     HELPERS
     ================================================================ */
  function getNodes() {
    return $("storageV2_singleNode").checked ? 1 : (parseInt($("storageV2_nodeCount").value) || 2);
  }

  function fmtTB(v) { return v.toFixed(2) + " TB"; }

  function getDriveCapA() {
    var sel = $("storageV2_ffCapacity");
    if (sel.value === "custom") return Math.max(num($("storageV2_ffCapacityCustom")), 0.01);
    return parseFloat(sel.value) || 1.92;
  }

  /* ================================================================
     DEPLOYMENT TYPES
     External SAN: Microsoft Learn "Supported SAN solutions on Azure Local"
     and "Enable external storage on Azure Local" (Azure Local 2604 or later).
     ALDO management cluster: "Dedicated management cluster for disconnected
     operations" (3 nodes, 6 or 8 data drives of at least 2 TB per node) and
     "Deploy disconnected operations" (thin 2 TB infrastructure volume).
     SAN infrastructure volumes of a disaggregated instance: ODIN Sizer.
     ================================================================ */
  var deployTypes = {
    "s2d":           { label: "Hyperconverged (Storage Spaces Direct)", s2d: true,  san: false, maxNodes: 16 },
    "hybrid":        { label: "Hyperconverged with external SAN (Storage Spaces Direct + SAN)", s2d: true, san: true, maxNodes: 16 },
    "disaggregated": { label: "Disaggregated (external SAN only)", s2d: false, san: true,  maxNodes: 64 },
    "aldo-mgmt":     { label: "Disconnected operations (ALDO) management cluster", s2d: true, san: false, maxNodes: 16 }
  };
  var SAN_INFRA = [{ name: "Infrastructure_1", tb: 0.256 }, { name: "ClusterPerfHistory", tb: 0.020 }];
  var ALDO_INFRA_TB = 2, ALDO_MIN_DRIVE_TB = 2, ALDO_NODES = 3;
  var ALDO_PROFILES = { standard: { label: "Standard", drives: 6, memoryGB: 128 }, datacenter: { label: "Datacenter", drives: 8, memoryGB: 512 } };
  var sanVendors = [
    { name: "Dell", models: "PowerStore T and Q appliances running PowerStoreOS 3.0 or later",
      mpio: 'New-MSDSMSupportedHW -VendorId "DellEMC" -ProductId "PowerStore"', tuning: "Dell recommends MPIO overrides: retry count 3, custom path recovery every 10 s and a 30 s disk timeout." },
    { name: "Everpure", models: "FlashArray X, C, XL, E and RC20",
      mpio: 'New-MSDSMSupportedHW -VendorId "PURE" -ProductId "FlashArray"', tuning: "Everpure recommends MPIO overrides (custom path recovery every 20 s, PDO remove period 20 s, 60 s disk timeout) and removing the generic MSDSM wildcard entry." },
    { name: "Hitachi Vantara", models: "VSP One Block High End, 24, 26 and 28; VSP 5100, 5200, 5500 and 5600; VSP E590, E790, E990 and E1090; VSP F350, F370, F700 and F900; VSP G130, G350, G370, G700 and G900 (host and fabric details in the Hitachi Product Compatibility Guide)",
      mpio: 'mpclaim -r -i -d "HITACHI OPEN-V"', tuning: "The default MSDSM settings with the Round Robin policy work well." },
    { name: "HPE", models: "Alletra MP 10000",
      mpio: 'New-MSDSMSupportedHW -VendorId "3PARdata" -ProductId "VV"', tuning: "No MPIO tuning is needed when the host persona on the array is WINDOWS." },
    { name: "Lenovo", models: "ThinkSystem DS, DM and DG Series", mpio: "", tuning: "The Microsoft documentation lists no MSDSM registration for Lenovo, so follow the Lenovo guidance." },
    { name: "NetApp", models: "AFF, ASA and other ONTAP platforms configured for SAN, as validated end to end in the NetApp Interoperability Matrix Tool",
      mpio: 'New-MSDSMSupportedHW -VendorId "NETAPP" -ProductId "LUN C-Mode"', tuning: "No MPIO tuning is needed beyond the defaults." }
  ];

  function deployType() { var v = $("storageV2_deployType").value; return deployTypes[v] ? v : "s2d"; }
  function isAldo() { return deployType() === "aldo-mgmt"; }
  function aldoProfile() { return ALDO_PROFILES[$("storageV2_aldoProfile").value] || ALDO_PROFILES.standard; }
  function aldoExtraTB() { return isAldo() ? ALDO_INFRA_TB : 0; }

  function fillNodeCount(max) {
    var sel = $("storageV2_nodeCount"), prev = parseInt(sel.value, 10) || 2;
    sel.innerHTML = "";
    for (var i = 2; i <= max; i++) {
      var opt = document.createElement("option");
      opt.value = i; opt.textContent = i;
      sel.appendChild(opt);
    }
    sel.value = Math.min(prev, max);
  }

  function hideResults() {
    $("storageV2_resultBox").style.display       = "none";
    $("storageV2_chartsSection").style.display   = "none";
    $("storageV2_compareSection").style.display  = "none";
    $("storageV2_overviewSection").style.display = "none";
    $("storageV2_exportPdfBtn").style.display    = "none";
  }

  function applyDeployType() {
    var t = deployTypes[deployType()];
    $("storageV2_aldoProfileGroup").style.display = isAldo() ? "" : "none";
    $("storageV2_sanCard").style.display  = t.san ? "" : "none";
    $("storageV2_modeCard").style.display = t.s2d ? "" : "none";
    $("storageV2_resCard").style.display  = t.s2d ? "" : "none";
    fillNodeCount(t.maxNodes);
    $("storageV2_deployInfo").textContent = {
      "s2d": "Storage Spaces Direct pools the NVMe drives of all nodes (1 to 16 nodes).",
      "hybrid": "Storage Spaces Direct for the infrastructure and part of the workloads, plus SAN volumes for the rest. Both use the L2 host fee.",
      "disaggregated": "Compute nodes use only SAN storage. Storage Spaces Direct isn't used, the internal drives are boot drives and the array provides the resiliency. Up to 64 nodes, L2 host fee.",
      "aldo-mgmt": "Dedicated cluster that only hosts the disconnected operations control plane. Production needs " + ALDO_NODES + " nodes; deployment adds a thin " + ALDO_INFRA_TB + " TB infrastructure volume."
    }[deployType()];
    hideResults();
    updateResiliencyOptions();
    updateSanVendorInfo();
  }

  function updateSanVendorInfo() {
    var v = sanVendors[+$("storageV2_sanVendor").value] || sanVendors[0];
    var proto = $("storageV2_sanProtocol").value === "iscsi" ? "iSCSI" : "Fibre Channel";
    $("storageV2_sanVendorInfo").textContent = "Supported models: " + v.models + ". Both Fibre Channel and iSCSI are supported. " +
      (v.mpio ? "MPIO registration: " + v.mpio + ". " : "") + v.tuning + " Connectivity: " + proto + ".";
  }

  /* SAN capacity plan: LUN sizes, logical capacity with headroom and the physical capacity after data reduction */
  function sanPlan() {
    var disagg   = deployType() === "disaggregated";
    var workload = Math.max(num($("storageV2_sanCapacity")), 0);
    var volumes  = Math.min(Math.max(Math.round(num($("storageV2_sanVolumes"))), 1), 64);
    var drr      = Math.max(num($("storageV2_sanDrr")), 1);
    var headroom = Math.min(Math.max(num($("storageV2_sanHeadroom")), 0), 50) / 100;
    /* hybrid instances keep their infrastructure volumes on Storage Spaces Direct */
    var infra    = disagg ? SAN_INFRA : [];
    var infraTB  = infra.reduce(function(s, v) { return s + v.tb; }, 0);
    var provisioned = workload + infraTB;
    var logical  = provisioned / (1 - headroom);
    var vendor   = sanVendors[+$("storageV2_sanVendor").value] || sanVendors[0];
    return {
      disagg: disagg, workload: workload, volumes: volumes, perVolume: workload / volumes, drr: drr, headroom: headroom,
      infra: infra, infraTB: infraTB, provisioned: provisioned, logical: logical, free: logical - provisioned,
      physical: logical / drr, vendor: vendor, iscsi: $("storageV2_sanProtocol").value === "iscsi"
    };
  }

  function sanRequirementLines(p) {
    var h = [];
    if (p.iscsi) {
      h.push("<strong>Hosts (iSCSI):</strong> identical NICs on every node with catalog firmware and drivers, iSCSI Initiator service enabled, iSCSI NICs outside Network ATC with static IPs and no default gateway, consistent MTU on the whole path" +
        (p.disagg ? "" : ", and dedicated physical ports for iSCSI (vNICs aren't supported next to Storage Spaces Direct)"));
    } else {
      h.push("<strong>Hosts (Fibre Channel):</strong> Windows Server 2025 certified HBAs and drivers on every node, identical HBA configuration and zoning, dual fabrics for multipathing; zone the HBA WWNs only after the Azure Local deployment");
    }
    h.push("<strong>Volumes:</strong> present every LUN to all nodes with consistent LUN IDs, one LUN per CSV (not shared across clusters), GPT and NTFS with a 64 KB allocation unit (ReFS isn't supported for SAN-backed volumes in this preview), then add each CSV path as a storage path in the Azure portal");
    h.push("<strong>Multipath:</strong> MPIO is enabled by default from Azure Local 2604 (Round Robin); register the array with MSDSM and use an array with SCSI-3 Persistent Reservations");
    h.push("<strong>Licensing:</strong> external SAN storage uses the L2 host fee (20.10/core/month, or 10/core/month with an OEM license), without Azure Hybrid Benefit for the host fee");
    return h;
  }

  function sanResultHtml(p) {
    var h = "<strong>SAN Array:</strong> " + odinEsc(p.vendor.name) + " (" + (p.iscsi ? "iSCSI" : "Fibre Channel") + ")<br>";
    h += "<strong>Workload Volumes:</strong> " + p.volumes + " x " + fmtTB(p.perVolume) + " (" + fmtTB(p.workload) + ")<br>";
    if (p.infraTB > 0) h += "<strong>Infrastructure Volumes on the SAN:</strong> " + p.infra.map(function(v) { return v.name + " " + (v.tb * 1000).toFixed(0) + " GB"; }).join(", ") + "<br>";
    h += "<strong>Provisioned on the SAN:</strong> " + fmtTB(p.provisioned) + "<br>";
    h += "<strong>Capacity with " + (p.headroom * 100).toFixed(0) + "% Free Space:</strong> " + fmtTB(p.logical) + "<br>";
    h += '<strong>Physical Usable Capacity on the Array:</strong> <span class="ok">' + fmtTB(p.physical) + "</span>" + (p.drr > 1 ? " (at " + p.drr + ":1 data reduction)" : " (no data reduction assumed)") + "<br>";
    return h;
  }

  function sanOverviewRows(p, sec, row, total) {
    sec("External SAN (" + odinEsc(p.vendor.name) + ", " + (p.iscsi ? "iSCSI" : "Fibre Channel") + ")");
    row("Workload Volumes", p.volumes + " LUNs x " + fmtTB(p.perVolume), fmtTB(p.workload));
    p.infra.forEach(function(v) { row(v.name, "Infrastructure volume on the SAN", (v.tb * 1000).toFixed(0) + " GB"); });
    row("Provisioned on the SAN", "workload + infrastructure", fmtTB(p.provisioned));
    row("Free Space Headroom", fmtTB(p.provisioned) + " / (1 - " + (p.headroom * 100).toFixed(0) + "%)", fmtTB(p.logical));
    total("Physical Usable Capacity on the Array", fmtTB(p.physical) + (p.drr > 1 ? " (" + fmtTB(p.logical) + " / " + p.drr + ":1)" : ""));
  }

  /* ALDO management cluster checks for a drive layout */
  function aldoChecks(nodes, drives, driveCap) {
    var pr = aldoProfile(), h = "";
    h += "<strong>Cluster Type:</strong> " + deployTypes["aldo-mgmt"].label + " (" + pr.label + ": " + pr.drives + " data drives of at least " + ALDO_MIN_DRIVE_TB + " TB, " + pr.memoryGB + " GB memory per node)<br>";
    h += "<strong>Disconnected Operations Volume:</strong> " + ALDO_INFRA_TB + " TB thin infrastructure volume created during deployment, reserved from the user storage<br>";
    if (drives < pr.drives) h += '<span class="warning">' + drives + " data drives per node is below the " + pr.drives + " drives of the " + pr.label.toLowerCase() + " configuration.</span><br>";
    if (driveCap < ALDO_MIN_DRIVE_TB) h += '<span class="warning">' + fmtTB(driveCap) + " drives are below the " + ALDO_MIN_DRIVE_TB + " TB minimum drive size of the management cluster.</span><br>";
    if (nodes < ALDO_NODES) h += '<span class="warning">Production management clusters need ' + ALDO_NODES + " nodes. Smaller management clusters are only for evaluation and proof of concept.</span><br>";
    h += "<strong>Boot Drive:</strong> 960 GB SSD/NVMe per node (smaller boot drives need extra data drives for the appliance)<br>";
    return h;
  }

  /* SAN only: no Storage Spaces Direct */
  function calculateSan() {
    var nodes = getNodes(), p = sanPlan();
    var rb = $("storageV2_resultBox");
    rb.style.display = "block";
    var h = "<strong>Cluster:</strong> " + nodes + " node" + (nodes > 1 ? "s" : "") + ", " + deployTypes.disaggregated.label + "<br>";
    h += "<strong>Node Storage:</strong> boot drives only. Storage Spaces Direct isn't used and the array provides the resiliency.<br>";
    h += "<hr style='border:none;border-top:1px solid #555;margin:8px 0'>";
    h += sanResultHtml(p);
    h += "<hr style='border:none;border-top:1px solid #555;margin:8px 0'>";
    h += sanRequirementLines(p).join("<br>");
    rb.innerHTML = h;

    $("storageV2_chartsSection").style.display  = "block";
    $("storageV2_compareSection").style.display = "none";
    drawSanCapacityChart(p);
    drawSanVolumesChart(p);

    $("storageV2_overviewSection").style.display = "block";
    var rows = [];
    function sec(t)     { rows.push('<tr class="section-header"><td colspan="3">' + t + '</td></tr>'); }
    function row(l,f,v) { rows.push('<tr><td>' + l + '</td><td class="formula">' + f + '</td><td>' + v + '</td></tr>'); }
    function total(l,v) { rows.push('<tr class="total-row"><td colspan="2">' + l + '</td><td>' + v + '</td></tr>'); }
    rows.push('<thead><tr><th>Item</th><th>Calculation</th><th>Value</th></tr></thead><tbody>');
    sec("Cluster Configuration");
    row("Deployment Type", "User-defined", deployTypes.disaggregated.label);
    row("Number of Nodes", "User-defined", nodes);
    row("Node Storage", "No Storage Spaces Direct", "Boot drives only");
    sanOverviewRows(p, sec, row, total);
    rows.push("</tbody>");
    $("storageV2_overviewTable").innerHTML = rows.join("");
    $("storageV2_exportPdfBtn").style.display = "inline-block";
  }

  $("storageV2_deployType").addEventListener("change", function() {
    if (isAldo()) {
      $("storageV2_singleNode").checked = false;
      $("storageV2_nodeCountGroup").style.display = "";
      $("storageV2_nodeCount").value = ALDO_NODES;
    }
    applyDeployType();
  });
  sanVendors.forEach(function(v, i) {
    var opt = document.createElement("option");
    opt.value = i; opt.textContent = v.name;
    $("storageV2_sanVendor").appendChild(opt);
  });
  $("storageV2_aldoProfile").addEventListener("change", hideResults);
  $("storageV2_sanVendor").addEventListener("change", updateSanVendorInfo);
  $("storageV2_sanProtocol").addEventListener("change", updateSanVendorInfo);

  /* ================================================================
     CAPACITY CALCULATION (shared)
     ================================================================ */
  function calcCapacity(nodes, drivesPerNode, driveCap, resId, extraTB) {
    extraTB = extraTB || 0;
    var efficiency        = getEfficiency(resId, nodes);
    var rawPerNode        = drivesPerNode * driveCap;
    var totalRaw          = rawPerNode * nodes;
    var reserveCapacity   = nodes > 1 ? nodes * driveCap : 0;
    var effective         = Math.max(totalRaw - reserveCapacity, 0);
    var usableAfterRes    = effective * efficiency;
    var resiliencyOverhead = effective - usableAfterRes;
    var netUsable         = Math.max(usableAfterRes - INFRA_OVERHEAD, 0);
    var netUsableTiB      = netUsable * 0.909495;
    var storageEff        = totalRaw > 0 ? (netUsable / totalRaw * 100) : 0;
    var infra1            = 0.250;
    var clusterPerf       = 0.020;
    var extraReserve      = 0.007;
    /* extraTB: the disconnected operations infrastructure volume of an ALDO management cluster */
    var volumeOH          = infra1 + clusterPerf + extraReserve + extraTB;
    var remainingForUser  = Math.max(netUsable - volumeOH, 0);
    var userPerNode       = nodes > 0 ? remainingForUser / nodes : 0;

    return {
      nodes: nodes, drivesPerNode: drivesPerNode, driveCap: driveCap, resId: resId,
      efficiency: efficiency, rawPerNode: rawPerNode, totalRaw: totalRaw,
      reserveCapacity: reserveCapacity, effective: effective,
      usableAfterRes: usableAfterRes, resiliencyOverhead: resiliencyOverhead,
      netUsable: netUsable, netUsableTiB: netUsableTiB, storageEff: storageEff,
      infra1: infra1, clusterPerf: clusterPerf, extraReserve: extraReserve, aldoInfra: extraTB,
      volumeOH: volumeOH, remainingForUser: remainingForUser, userPerNode: userPerNode
    };
  }

  /* Reverse: find minimum drivesPerNode to reach targetNetUsable */
  function calcReverse(nodes, driveCap, targetNetUsable, resId, extraTB, minDrives) {
    extraTB = extraTB || 0;
    targetNetUsable += extraTB;
    var efficiency = getEfficiency(resId, nodes);
    var drivesPerNode;
    if (nodes === 1) {
      drivesPerNode = Math.ceil((targetNetUsable + INFRA_OVERHEAD) / (driveCap * efficiency));
      drivesPerNode = Math.max(drivesPerNode, 1);
    } else {
      var needed = (targetNetUsable + INFRA_OVERHEAD) / (driveCap * nodes * efficiency);
      drivesPerNode = Math.ceil(needed) + 1;
      drivesPerNode = Math.max(drivesPerNode, 2);
    }
    drivesPerNode = Math.max(drivesPerNode, minDrives || 0);
    var d = calcCapacity(nodes, drivesPerNode, driveCap, resId, extraTB);
    d.feasible = drivesPerNode <= MAX_DRIVES;
    /* user capacity after the extra volume, compared with the target */
    d.targetUsable = d.netUsable - extraTB;
    return d;
  }

  /* ================================================================
     EVENT LISTENERS
     ================================================================ */
  $("storageV2_singleNode").addEventListener("change", function() {
    $("storageV2_nodeCountGroup").style.display = this.checked ? "none" : "";
    updateResiliencyOptions();
  });

  $("storageV2_nodeCount").addEventListener("change", updateResiliencyOptions);

  $("storageV2_ffCapacity").addEventListener("change", function() {
    $("storageV2_ffCapacityCustomGroup").style.display = this.value === "custom" ? "" : "none";
  });

  function switchMode(mode) {
    activeMode = mode;
    selectedResiliency = selectedResiliencyByMode[mode] || selectedResiliency;
    $("storageV2_modeABtn").classList.toggle("active", mode === "A");
    $("storageV2_modeBBtn").classList.toggle("active", mode === "B");
    $("storageV2_modeAPanel").style.display = mode === "A" ? "" : "none";
    $("storageV2_modeBPanel").style.display = mode === "B" ? "" : "none";
    $("storageV2_resultBox").style.display       = "none";
    $("storageV2_chartsSection").style.display   = "none";
    $("storageV2_compareSection").style.display  = "none";
    $("storageV2_overviewSection").style.display = "none";
    $("storageV2_exportPdfBtn").style.display    = "none";
    updateResiliencyOptions();
  }

  $("storageV2_modeABtn").addEventListener("click", function() { switchMode("A"); });
  $("storageV2_modeBBtn").addEventListener("click", function() { switchMode("B"); });
  $("storageV2_calcBtn").addEventListener("click", function() {
    if (!deployTypes[deployType()].s2d) calculateSan();
    else if (activeMode === "A") calculateForward();
    else calculateReverse();
  });
  $("storageV2_exportPdfBtn").addEventListener("click", exportPdf);

  /* ================================================================
     RESILIENCY OPTIONS UI
     ================================================================ */
  function updateResiliencyOptions() {
    var nodes = getNodes();
    var container = $("storageV2_resiliencyOptions");
    container.innerHTML = "";

    var firstAvailable    = null;
    var currentStillValid = false;
    var preferredDefault  = getDefaultResiliency(nodes);

    selectedResiliency = selectedResiliencyByMode[activeMode] || selectedResiliency;

    resiliencyDefs.forEach(function(r) {
      if (r.importOnly && !odinResiliencyShown[r.id]) return;
      var available = isResAvailable(r, nodes);
      var eff = getEfficiency(r.id, nodes);

      var warning = r.id === "dual-parity"
        ? '<div style="font-size:.74em;color:#cc3300;font-weight:600;margin-top:6px">Not recommended for standard deployments. Deviates from the standard configuration, only use if you know what you are doing.</div>'
        : "";

      var div = document.createElement("div");
      div.className = "res-option"
        + (available ? "" : " disabled")
        + (selectedResiliency === r.id && available ? " selected" : "");
      div.innerHTML =
        '<div class="res-name">' + r.name + '</div>' +
        '<div class="res-detail">' + r.desc + '</div>' +
        '<div class="res-eff">Efficiency: ' + (eff * 100).toFixed(1) + '% | Tolerates: ' + (r.tolerates || r.failures + ' failure' + (r.failures > 1 ? 's' : '')) + '</div>' +
        warning;

      if (available) {
        if (!firstAvailable) firstAvailable = r.id;
        if (selectedResiliency === r.id) currentStillValid = true;
        (function(rid) {
          div.addEventListener("click", function() {
            resiliencyUserSelectedByMode[activeMode] = true;
            selectedResiliency = rid;
            selectedResiliencyByMode[activeMode] = rid;
            updateResiliencyOptions();
          });
        })(r.id);
      }
      container.appendChild(div);
    });

    if (!currentStillValid && (preferredDefault || firstAvailable)) {
      selectedResiliency = preferredDefault || firstAvailable;
      selectedResiliencyByMode[activeMode] = selectedResiliency;
      updateResiliencyOptions();
      return;
    }

    if (!resiliencyUserSelectedByMode[activeMode] && preferredDefault && selectedResiliency !== preferredDefault) {
      selectedResiliency = preferredDefault;
      selectedResiliencyByMode[activeMode] = selectedResiliency;
      updateResiliencyOptions();
    }
  }

  /* ================================================================
     MODE A: FORWARD CALCULATION
     ================================================================ */
  function calculateForward() {
    var nodes      = getNodes();
    var driveCap   = getDriveCapA();
    var driveCount = Math.max(num($("storageV2_ffCount")), 1);
    var d          = calcCapacity(nodes, driveCount, driveCap, selectedResiliency, aldoExtraTB());
    var san        = deployTypes[deployType()].san ? sanPlan() : null;
    d.san = san;

    var rb = $("storageV2_resultBox");
    rb.style.display = "block";
    var h = "";
    h += "<strong>Cluster:</strong> " + nodes + " node" + (nodes > 1 ? "s" : "") + (nodes === 1 ? " (Single Node)" : "") + "<br>";
    if (isAldo()) h += aldoChecks(nodes, driveCount, driveCap);
    if (san) h += "<strong>Deployment Type:</strong> " + deployTypes.hybrid.label + "<br>";
    h += "<strong>Storage:</strong> Full-Flash NVMe - " + driveCount + " x " + fmtTB(driveCap) + " per node<br>";
    h += "<strong>Resiliency:</strong> " + resiliencyLabel(selectedResiliency) + " (" + (d.efficiency * 100).toFixed(1) + "% efficiency)<br>";
    h += "<hr style='border:none;border-top:1px solid #555;margin:8px 0'>";
    h += "<strong>Total Raw per Node:</strong> " + fmtTB(d.rawPerNode) + "<br>";
    h += "<strong>Total Raw (Cluster):</strong> " + fmtTB(d.totalRaw) + "<br>";
    h += "<strong>Reserve Capacity:</strong> " + fmtTB(d.reserveCapacity) + "<br>";
    h += "<strong>Resiliency Overhead:</strong> " + fmtTB(d.resiliencyOverhead) + "<br>";
    h += "<strong>Infrastructure Overhead:</strong> " + fmtTB(INFRA_OVERHEAD) + "<br>";
    h += "<strong>Storage Efficiency:</strong> " + d.storageEff.toFixed(1) + "%<br>";
    h += '<strong>Net Usable Capacity:</strong> <span class="ok">' + fmtTB(d.netUsable) + " (" + d.netUsableTiB.toFixed(2) + " TiB)</span>";
    if (d.aldoInfra > 0) h += "<br><strong>User Storage after the Disconnected Operations Volume:</strong> " + fmtTB(d.remainingForUser);
    if (san) {
      h += "<hr style='border:none;border-top:1px solid #555;margin:8px 0'>" + sanResultHtml(san);
      h += "<strong>Workload Capacity (S2D user volumes + SAN):</strong> " + fmtTB(d.remainingForUser + san.workload) + "<br>";
      h += sanRequirementLines(san).join("<br>");
    }
    rb.innerHTML = h;

    $("storageV2_chartsSection").style.display  = "block";
    $("storageV2_compareSection").style.display = "none";
    drawCapacityChart(d.netUsable, d.resiliencyOverhead, d.reserveCapacity, INFRA_OVERHEAD);
    drawVolumesChart(d.infra1, d.clusterPerf, d.userPerNode, nodes, d.aldoInfra, san);

    buildOverview(d);
    $("storageV2_exportPdfBtn").style.display = "inline-block";
  }

  /* ================================================================
     MODE B: REVERSE CALCULATION
     ================================================================ */
  function calculateReverse() {
    var nodes         = getNodes();
    var targetStorage = Math.max(num($("storageV2_targetStorage")), 0.1);

    var sizes = [];
    $("storageV2_calcRoot").querySelectorAll(".storageV2-drive-size-chk").forEach(function(chk) {
      if (chk.checked) sizes.push(parseFloat(chk.value));
    });
    var custom = num($("storageV2_customDriveSize"));
    if (custom > 0 && sizes.indexOf(custom) === -1) sizes.push(custom);
    sizes.sort(function(a, b) { return a - b; });

    if (sizes.length === 0) {
      alert("Please select at least one NVMe drive size to evaluate.");
      return;
    }

    var aldo = isAldo(), san = deployTypes[deployType()].san ? sanPlan() : null;
    var rb = $("storageV2_resultBox");
    rb.style.display = "block";
    rb.innerHTML =
      "<strong>Target Effective Storage:</strong> " + fmtTB(targetStorage) + "<br>" +
      "<strong>Cluster:</strong> " + nodes + " node" + (nodes > 1 ? "s" : "") + "<br>" +
      (aldo ? aldoChecks(nodes, aldoProfile().drives, ALDO_MIN_DRIVE_TB) +
        "<strong>Drive Sizes:</strong> at least " + aldoProfile().drives + " drives per node; sizes below " + ALDO_MIN_DRIVE_TB + " TB are marked as not feasible<br>" : "") +
      "<strong>Resiliency:</strong> " + resiliencyLabel(selectedResiliency) + " (" + (getEfficiency(selectedResiliency, nodes) * 100).toFixed(1) + "% efficiency)" +
      (san ? "<hr style='border:none;border-top:1px solid #555;margin:8px 0'><strong>Deployment Type:</strong> " + deployTypes.hybrid.label + "<br>" +
        sanResultHtml(san) + sanRequirementLines(san).join("<br>") : "");

    $("storageV2_chartsSection").style.display  = "none";
    $("storageV2_overviewSection").style.display = "none";
    $("storageV2_compareSection").style.display = "block";

    var results = sizes.map(function(sz) {
      var r = calcReverse(nodes, sz, targetStorage, selectedResiliency, aldoExtraTB(), aldo ? aldoProfile().drives : 0);
      if (aldo && sz < ALDO_MIN_DRIVE_TB) r.feasible = false;
      return r;
    });

    // Find minimum headroom among feasible results that meet the target (most efficient)
    var minHeadroom = Infinity;
    results.forEach(function(r) {
      if (r.feasible && r.targetUsable >= targetStorage) {
        var h = r.targetUsable - targetStorage;
        if (h < minHeadroom) minHeadroom = h;
      }
    });

    var rows = [];
    rows.push(
      "<thead><tr>" +
      "<th>NVMe Size</th><th>Drives / Node</th><th>Total Drives</th>" +
      "<th>Raw / Node</th><th>Total Raw</th><th>Net Usable</th><th>Headroom</th>" +
      "</tr></thead><tbody>"
    );

    results.forEach(function(r) {
      var headroom = r.targetUsable - targetStorage;
      var isBest   = r.feasible && r.targetUsable >= targetStorage && Math.abs(headroom - minHeadroom) < 0.001;
      var trClass  = !r.feasible ? ' class="infeasible"' : (isBest ? ' class="best"' : "");
      var drivesCell = r.feasible
        ? r.drivesPerNode
        : r.drivesPerNode + " *";
      var totalDrives = r.feasible ? (r.drivesPerNode * nodes) : "-";
      var usableCell  = r.targetUsable >= targetStorage
        ? '<span style="color:#2e7d32;font-weight:600">' + fmtTB(r.targetUsable) + "</span>"
        : '<span style="color:#cc3300">' + fmtTB(r.targetUsable) + "</span>";
      var headroomCell = (r.feasible && r.targetUsable >= targetStorage)
        ? "+" + fmtTB(headroom)
        : "n/a";

      rows.push(
        "<tr" + trClass + ">" +
        "<td>" + r.driveCap + " TB</td>" +
        "<td>" + drivesCell + "</td>" +
        "<td>" + totalDrives + "</td>" +
        "<td>" + fmtTB(r.rawPerNode) + "</td>" +
        "<td>" + fmtTB(r.totalRaw) + "</td>" +
        "<td>" + usableCell + "</td>" +
        "<td>" + headroomCell + "</td>" +
        "</tr>"
      );
    });

    rows.push("</tbody>");
    $("storageV2_compareTable").innerHTML = rows.join("");
    $("storageV2_exportPdfBtn").style.display = "inline-block";
  }

  /* ================================================================
     3D CHARTS
     Self-contained canvas renderer (no external libraries) for 3D donut
     and 3D bar charts: hover and keyboard tooltips, clickable legend,
     drag to rotate and double-click to reset the view.
     The same block is used in all three V2 calculators.
     ================================================================ */
  var C3D = {
    font: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
    surface: "#ffffff", ink: "#1f1f1e", ink2: "#52514e", muted: "#8a8984",
    grid: "#e6e5e1", floor: "#f3f2ef", critical: "#d03b3b"
  };
  /* Validated categorical slots (light mode, white surface) */
  var C3D_COLORS = {
    blue: "#2a78d6", orange: "#eb6834", aqua: "#1baf7a", yellow: "#eda100",
    magenta: "#e87ba4", green: "#008300", violet: "#4a3aa7"
  };

  /* f < 1 darkens, f > 1 mixes towards white */
  function c3dMix(hex, f) {
    var n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255];
    for (var i = 0; i < 3; i++) c[i] = Math.round(f <= 1 ? c[i] * f : c[i] + (255 - c[i]) * (f - 1));
    return "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")";
  }

  function c3dCompact(v) {
    var a = Math.abs(v);
    if (a >= 1e6) return +(v / 1e6).toFixed(a >= 1e7 ? 0 : 1) + "M";
    if (a >= 1e3) return +(v / 1e3).toFixed(a >= 1e4 ? 0 : 1) + "k";
    return String(+v.toFixed(a < 10 ? 2 : 0));
  }

  function c3dNiceScale(max, count) {
    if (!(max > 0)) return { max: 1, step: 0.25 };
    var raw = max / count, mag = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10)), n = raw / mag;
    var step = (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * mag;
    return { max: Math.ceil(max / step - 1e-9) * step, step: step };
  }

  function c3dInPoly(x, y, p) {
    var inside = false;
    for (var i = 0, j = p.length - 1; i < p.length; j = i++) {
      if ((p[i][1] > y) !== (p[j][1] > y) &&
          x < (p[j][0] - p[i][0]) * (y - p[i][1]) / (p[j][1] - p[i][1]) + p[i][0]) inside = !inside;
    }
    return inside;
  }

  function c3dPoly(ctx, p, fill, stroke, width) {
    ctx.beginPath();
    ctx.moveTo(p[0][0], p[0][1]);
    for (var i = 1; i < p.length; i++) ctx.lineTo(p[i][0], p[i][1]);
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width || 1; ctx.lineJoin = "round"; ctx.stroke(); }
  }

  function c3dRoundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function c3dFit(ctx, text, max) {
    text = String(text);
    if (ctx.measureText(text).width <= max) return text;
    while (text.length > 1 && ctx.measureText(text + "…").width > max) text = text.slice(0, -1);
    return text + "…";
  }

  /* cfg.type "donut": { title, slices: [{label, value, color}], format(v), center(total) -> {value, label, critical} }
     cfg.type "bar":   { title, categories: [], series: [{label, color, data: []}], horizontal, legend,
                         format(v), axisFormat(v) }  Bars are always stacked per category. */
  function Chart3D(canvas, cfg) {
    var self = this;
    this.canvas = canvas;
    this.cfg = cfg;
    this.ctx = canvas.getContext("2d");
    this.hidden = {};
    this.hover = null;
    this.focus = null;
    this.pointer = null;
    this.drag = null;
    this.marks = [];
    this.order = [];
    this.legendBoxes = [];
    this.view = this.defaultView();
    this.reduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    this.progress = this.reduced ? 1 : 0;
    canvas.tabIndex = 0;
    canvas.setAttribute("role", "img");
    canvas.style.touchAction = "pan-y";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.outlineOffset = "2px";
    this.on = {
      move: function(e) { self.onMove(e); },
      leave: function() { self.onLeave(); },
      down: function(e) { self.onDown(e); },
      up: function(e) { self.onUp(e); },
      dbl: function() { self.view = self.defaultView(); self.draw(); },
      key: function(e) { self.onKey(e); },
      blur: function() { self.focus = null; self.draw(); },
      resize: function() { self.resize(); }
    };
    canvas.addEventListener("pointermove", this.on.move);
    canvas.addEventListener("pointerleave", this.on.leave);
    canvas.addEventListener("pointerdown", this.on.down);
    window.addEventListener("pointerup", this.on.up);
    canvas.addEventListener("dblclick", this.on.dbl);
    canvas.addEventListener("keydown", this.on.key);
    canvas.addEventListener("blur", this.on.blur);
    window.addEventListener("resize", this.on.resize);
    if (window.ResizeObserver && canvas.parentNode) {
      this.observer = new ResizeObserver(this.on.resize);
      this.observer.observe(canvas.parentNode);
    }
    /* the print stylesheet changes the chart height: redraw at print size */
    this.print = window.matchMedia ? window.matchMedia("print") : null;
    if (this.print) {
      if (this.print.addEventListener) this.print.addEventListener("change", this.on.resize);
      else if (this.print.addListener) this.print.addListener(this.on.resize);
    }
    this.resize();
    if (!this.reduced) this.animate();
  }

  Chart3D.prototype.defaultView = function() {
    return this.cfg.type === "donut" ? { rot: -Math.PI / 2, tilt: 0.95 } : { angle: 0.75, depth: 1 };
  };

  Chart3D.prototype.destroy = function() {
    var c = this.canvas;
    c.removeEventListener("pointermove", this.on.move);
    c.removeEventListener("pointerleave", this.on.leave);
    c.removeEventListener("pointerdown", this.on.down);
    window.removeEventListener("pointerup", this.on.up);
    c.removeEventListener("dblclick", this.on.dbl);
    c.removeEventListener("keydown", this.on.key);
    c.removeEventListener("blur", this.on.blur);
    window.removeEventListener("resize", this.on.resize);
    if (this.observer) this.observer.disconnect();
    if (this.print) {
      if (this.print.removeEventListener) this.print.removeEventListener("change", this.on.resize);
      else if (this.print.removeListener) this.print.removeListener(this.on.resize);
    }
    if (this.raf) cancelAnimationFrame(this.raf);
    clearTimeout(this.fallback);
    c.style.cursor = "";
  };

  Chart3D.prototype.resize = function() {
    var box = this.canvas.parentNode, dpr = window.devicePixelRatio || 1;
    var w = box ? box.clientWidth : this.canvas.clientWidth, h = box ? box.clientHeight : this.canvas.clientHeight;
    if (!w || !h || (w === this.w && h === this.h && dpr === this.dpr)) return;
    this.w = w; this.h = h; this.dpr = dpr;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.draw();
  };

  Chart3D.prototype.animate = function() {
    var self = this, start = null;
    function step(t) {
      if (start === null) start = t;
      var k = Math.min((t - start) / 700, 1);
      self.progress = 1 - Math.pow(1 - k, 3);
      self.draw();
      self.raf = k < 1 ? requestAnimationFrame(step) : null;
    }
    this.raf = requestAnimationFrame(step);
    /* Background tabs pause animation frames; never leave a chart half drawn */
    this.fallback = setTimeout(function() {
      if (self.progress < 1) { if (self.raf) cancelAnimationFrame(self.raf); self.raf = null; self.progress = 1; self.draw(); }
    }, 1500);
  };

  Chart3D.prototype.items = function() {
    var cfg = this.cfg;
    return cfg.type === "donut" ? cfg.slices : cfg.series;
  };

  Chart3D.prototype.activeKey = function() {
    return this.drag && this.drag.moved ? null : (this.focus !== null ? this.focus : this.hover);
  };

  /* ---------------- frame ---------------- */
  Chart3D.prototype.draw = function() {
    if (!this.w) return;
    var ctx = this.ctx, cfg = this.cfg;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.fillStyle = C3D.surface;
    ctx.fillRect(0, 0, this.w, this.h);
    this.marks = [];
    this.order = [];

    ctx.font = "600 14px " + C3D.font;
    ctx.fillStyle = C3D.ink;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(c3dFit(ctx, cfg.title, this.w - 24), this.w / 2, 12);

    var legendH = this.layoutLegend();
    var area = { x: 12, y: 38, w: this.w - 24, h: this.h - 38 - legendH - 8 };
    this.area = area;
    if (cfg.type === "donut") this.drawDonut(area); else this.drawBars(area);
    this.drawLegend();
    this.drawHint();
    this.drawTooltip();
    this.updateAria();
  };

  Chart3D.prototype.empty = function(a, text) {
    var ctx = this.ctx;
    ctx.font = "13px " + C3D.font;
    ctx.fillStyle = C3D.muted;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, a.x + a.w / 2, a.y + a.h / 2);
  };

  /* ---------------- legend ---------------- */
  Chart3D.prototype.legendText = function(item) {
    return this.cfg.type === "donut" ? item.label + "  " + this.cfg.format(item.value) : item.label;
  };

  Chart3D.prototype.layoutLegend = function() {
    var ctx = this.ctx, self = this, items = this.items(), maxW = this.w - 24, rows = [[]], rowW = [0];
    this.legendBoxes = [];
    if (this.cfg.legend === false) return 0;
    ctx.font = "12px " + C3D.font;
    items.forEach(function(it, i) {
      if (self.cfg.type === "donut" && !(it.value > 0)) return;
      var text = c3dFit(ctx, self.legendText(it), maxW - 20), w = 16 + ctx.measureText(text).width;
      var r = rows.length - 1;
      if (rows[r].length && rowW[r] + 14 + w > maxW) { rows.push([]); rowW.push(0); r++; }
      rowW[r] += (rows[r].length ? 14 : 0) + w;
      rows[r].push({ i: i, text: text, w: w });
    });
    var y = this.h - 8 - rows.length * 20;
    rows.forEach(function(row, r) {
      var x = (self.w - rowW[r]) / 2;
      row.forEach(function(b) {
        self.legendBoxes.push({ i: b.i, text: b.text, x: x, y: y + r * 20, w: b.w, h: 20 });
        x += b.w + 14;
      });
    });
    return rows.length * 20 + 4;
  };

  Chart3D.prototype.drawLegend = function() {
    var ctx = this.ctx, self = this, items = this.items(), act = this.activeKey();
    ctx.font = "12px " + C3D.font;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    this.legendBoxes.forEach(function(b) {
      var it = items[b.i], off = self.hidden[b.i], cy = b.y + b.h / 2;
      var emph = act !== null && self.keyItem(act) === b.i;
      c3dRoundRect(ctx, b.x, cy - 5, 10, 10, 2);
      if (off) { ctx.strokeStyle = it.color; ctx.lineWidth = 1.5; ctx.stroke(); }
      else { ctx.fillStyle = it.color; ctx.fill(); }
      ctx.fillStyle = off ? C3D.muted : (emph ? C3D.ink : C3D.ink2);
      ctx.fillText(b.text, b.x + 16, cy);
      if (off) {
        ctx.fillRect(b.x + 16, cy, ctx.measureText(b.text).width, 1);
      }
    });
  };

  Chart3D.prototype.drawHint = function() {
    if (!this.pointer || this.activeKey() !== null || this.drag) return;
    var ctx = this.ctx, a = this.area;
    ctx.font = "10px " + C3D.font;
    ctx.fillStyle = C3D.muted;
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillText("Drag to rotate, double-click to reset", a.x + a.w, a.y + a.h + 6);
  };

  /* ---------------- donut ---------------- */
  Chart3D.prototype.drawDonut = function(a) {
    var cfg = this.cfg, ctx = this.ctx, self = this, v = this.view;
    var sinP = Math.sin(v.tilt), cosP = Math.cos(v.tilt), THICK = 0.24, INNER = 0.56;
    var R = Math.max(10, Math.min(a.w * 0.4, a.h * 0.9 / (2 * sinP + THICK * cosP)));
    var wall = THICK * R * cosP, r0 = R * INNER;
    var cx = a.x + a.w / 2, cy = a.y + (a.h - (2 * R * sinP + wall)) / 2 + R * sinP;
    var total = 0, pieces = [];
    cfg.slices.forEach(function(s, i) { if (!self.hidden[i] && s.value > 0) total += s.value; });

    /* soft ground shadow shaped as a ring, so the hole stays clean for the center label */
    ctx.save();
    ctx.translate(cx, cy + wall + 6);
    ctx.scale(1, Math.max(sinP, 0.2));
    var g = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 1.12);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(INNER * 0.85 / 1.12, "rgba(0,0,0,0)");
    g.addColorStop(0.82, "rgba(0,0,0,0.13)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, R * 1.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (!(total > 0)) { this.empty(a, "No values to display"); return; }

    var sweep = Math.PI * 2 * this.progress, start = v.rot, act = this.activeKey(), full = Math.PI * 2;
    cfg.slices.forEach(function(s, i) {
      if (self.hidden[i] || !(s.value > 0)) return;
      var span = s.value / total * sweep;
      pieces.push({ i: i, a0: start, a1: start + span });
      self.order.push("s" + i);
      start += span;
    });

    /* parts of [a0, a1] where sin() has the wanted sign: outer walls face the viewer in the
       front half (0..PI), inner walls in the back half (PI..2PI) */
    function visible(a0, a1, lo) {
      var out = [], k = Math.floor((a0 - lo - Math.PI) / full);
      for (; lo + k * full < a1; k++) {
        var s = Math.max(a0, lo + k * full), e = Math.min(a1, lo + Math.PI + k * full);
        if (e > s + 1e-4) out.push([s, e]);
      }
      return out;
    }

    function build(pc, lifted) {
      var mid = (pc.a0 + pc.a1) / 2, d = lifted ? R * 0.07 : 0, span = pc.a1 - pc.a0;
      var ox = Math.cos(mid) * d, oy = Math.sin(mid) * d * sinP - (lifted ? 4 : 0);
      var color = cfg.slices[pc.i].color, b = { color: color, cuts: [], inner: [], outer: [], top: [] };
      function P(ang, r, z) { return [cx + ox + r * Math.cos(ang), cy + oy + r * Math.sin(ang) * sinP + (1 - z) * wall]; }
      function arc(s, e, r, z, list, back) {
        var n = Math.max(2, Math.ceil((e - s) / (Math.PI / 90)));
        for (var j = 0; j <= n; j++) list.push(P(back ? e - (e - s) * j / n : s + (e - s) * j / n, r, z));
      }
      function wallPoly(s, e, r) { var p = []; arc(s, e, r, 1, p, false); arc(s, e, r, 0, p, true); return p; }
      if (pieces.length > 1 || span < full - 1e-6) {
        [pc.a0, pc.a1].forEach(function(ang) {
          b.cuts.push({ depth: Math.sin(ang), poly: [P(ang, r0, 1), P(ang, R, 1), P(ang, R, 0), P(ang, r0, 0)] });
        });
      }
      visible(pc.a0, pc.a1, Math.PI).forEach(function(iv) { b.inner.push(wallPoly(iv[0], iv[1], r0)); });
      visible(pc.a0, pc.a1, 0).forEach(function(iv) { b.outer.push(wallPoly(iv[0], iv[1], R)); });
      arc(pc.a0, pc.a1, R, 1, b.top, false);
      arc(pc.a0, pc.a1, r0, 1, b.top, true);
      /* one light from the front left: walls get a smooth horizontal gradient instead of facets */
      b.outerFill = ctx.createLinearGradient(cx - R, 0, cx + R, 0);
      b.outerFill.addColorStop(0, c3dMix(color, 0.9));
      b.outerFill.addColorStop(1, c3dMix(color, 0.6));
      b.innerFill = ctx.createLinearGradient(cx - r0, 0, cx + r0, 0);
      b.innerFill.addColorStop(0, c3dMix(color, 0.55));
      b.innerFill.addColorStop(1, c3dMix(color, 0.78));
      b.cutFill = c3dMix(color, 0.72);
      return b;
    }

    /* painter's order: cut faces (far first), inner back walls, outer front walls, tops */
    function paint(list) {
      var cuts = [];
      list.forEach(function(b) { b.cuts.forEach(function(c) { cuts.push({ c: c, b: b }); }); });
      cuts.sort(function(x, y) { return x.c.depth - y.c.depth; });
      cuts.forEach(function(x) { c3dPoly(ctx, x.c.poly, x.b.cutFill, x.b.cutFill, 0.5); });
      list.forEach(function(b) { b.inner.forEach(function(p) { c3dPoly(ctx, p, b.innerFill, null); }); });
      list.forEach(function(b) { b.outer.forEach(function(p) { c3dPoly(ctx, p, b.outerFill, null); }); });
      list.forEach(function(b) {
        c3dPoly(ctx, b.top, b.hot ? c3dMix(b.color, 1.14) : b.color, C3D.surface, 1.5);
        self.marks.push({ key: b.key, polys: [b.top].concat(b.outer, b.inner), cx: b.cx, cy: b.cy });
      });
    }

    var rest = [], hot = [];
    pieces.forEach(function(pc) {
      var key = "s" + pc.i, b = build(pc, key === act), mid = (pc.a0 + pc.a1) / 2;
      b.key = key;
      b.hot = key === act;
      b.cx = cx + Math.cos(mid) * (R + r0) / 2;
      b.cy = cy + Math.sin(mid) * (R + r0) / 2 * sinP;
      (b.hot ? hot : rest).push(b);
    });
    paint(rest);
    paint(hot);

    var c = cfg.center ? cfg.center(total) : null, room = 2 * r0 * sinP - wall, maxW = r0 * 1.6;
    if (c && room > 30 && r0 > 46) {
      var ty = cy + wall / 2, size = room > 54 ? 16 : 13;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      do { ctx.font = "600 " + size + "px " + C3D.font; } while (ctx.measureText(c.value).width > maxW && --size > 10);
      ctx.fillStyle = c.critical ? C3D.critical : C3D.ink;
      ctx.fillText(c3dFit(ctx, c.value, maxW), cx, ty - 8);
      ctx.font = "11px " + C3D.font;
      ctx.fillStyle = C3D.ink2;
      ctx.fillText(c3dFit(ctx, c.label, maxW), cx, ty + 9);
    }
  };

  /* ---------------- bars ---------------- */
  function c3dBox(ctx, x, y, w, h, dx, dy, color, hot) {
    var front = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
    var top = [[x, y], [x + w, y], [x + w + dx, y + dy], [x + dx, y + dy]];
    var side = [[x + w, y], [x + w + dx, y + dy], [x + w + dx, y + h + dy], [x + w, y + h]];
    var base = hot ? 1.12 : 1;
    c3dPoly(ctx, side, c3dMix(color, 0.7 * base), C3D.surface, 1);
    c3dPoly(ctx, top, c3dMix(color, 1.2 * base), C3D.surface, 1);
    c3dPoly(ctx, front, hot ? c3dMix(color, base) : color, C3D.surface, 1);
    return [front, top, side];
  }

  Chart3D.prototype.drawBars = function(a) {
    var cfg = this.cfg, ctx = this.ctx, self = this, horiz = !!cfg.horizontal, K = cfg.categories.length;
    var vis = [], totals = [], max = 0, act = this.activeKey(), p = this.progress;
    var fmtAxis = cfg.axisFormat || c3dCompact;
    cfg.series.forEach(function(s, i) { if (!self.hidden[i]) vis.push(i); });
    for (var k = 0; k < K; k++) {
      var t = 0;
      vis.forEach(function(i) { t += Math.max(cfg.series[i].data[k] || 0, 0); });
      totals.push(t);
      max = Math.max(max, t);
    }
    if (!K || !(max > 0)) { this.empty(a, "No values to display"); return; }
    var scale = c3dNiceScale(max, 4), ticks = [];
    for (var tv = 0; tv <= scale.max + scale.step / 2; tv += scale.step) ticks.push(tv);

    ctx.font = "11px " + C3D.font;
    var x0, x1, yt, yb, band, thick, d, dx, dy;
    if (!horiz) {
      var tickW = 0;
      ticks.forEach(function(t) { tickW = Math.max(tickW, ctx.measureText(fmtAxis(t)).width); });
      x0 = a.x + tickW + 8;
      band = (a.w - tickW - 8) / K;
      d = Math.min(16, band * 0.3) * this.view.depth;
      dx = d * Math.cos(this.view.angle); dy = -d * Math.sin(this.view.angle);
      x1 = a.x + a.w - dx - 4;
      yt = a.y + 16 - dy;
      yb = a.y + a.h - 20;
      band = (x1 - x0) / K;
      thick = Math.min(band * 0.58, 56);
    } else {
      var labW = 0;
      cfg.categories.forEach(function(c) { labW = Math.max(labW, ctx.measureText(c).width); });
      labW = Math.min(labW, a.w * 0.36);
      x0 = a.x + labW + 8;
      yt = a.y + 4;
      yb = a.y + a.h - 18;
      band = (yb - yt) / K;
      d = Math.min(14, band * 0.4) * this.view.depth;
      dx = d * Math.cos(this.view.angle); dy = -d * Math.sin(this.view.angle);
      yt -= dy;
      band = (yb - yt) / K;
      x1 = a.x + a.w - dx - 46;
      thick = Math.min(band * 0.62, 30);
    }
    function pos(v) { return horiz ? x0 + v / scale.max * (x1 - x0) : yb - v / scale.max * (yb - yt); }

    /* floor, back wall grid and value axis */
    ctx.textBaseline = "middle";
    if (!horiz) {
      c3dPoly(ctx, [[x0, yb], [x1, yb], [x1 + dx, yb + dy], [x0 + dx, yb + dy]], C3D.floor, null);
      ticks.forEach(function(t) {
        var y = pos(t);
        ctx.beginPath();
        ctx.moveTo(x0, y); ctx.lineTo(x0 + dx, y + dy); ctx.lineTo(x1 + dx, y + dy);
        ctx.strokeStyle = C3D.grid; ctx.lineWidth = 1; ctx.stroke();
        ctx.fillStyle = C3D.muted; ctx.textAlign = "right";
        ctx.fillText(fmtAxis(t), x0 - 6, y);
      });
    } else {
      c3dPoly(ctx, [[x0, yt], [x0, yb], [x0 + dx, yb + dy], [x0 + dx, yt + dy]], C3D.floor, null);
      ticks.forEach(function(t) {
        var x = pos(t);
        ctx.beginPath();
        ctx.moveTo(x, yb); ctx.lineTo(x + dx, yb + dy); ctx.lineTo(x + dx, yt + dy);
        ctx.strokeStyle = C3D.grid; ctx.lineWidth = 1; ctx.stroke();
        ctx.fillStyle = C3D.muted; ctx.textAlign = "center"; ctx.textBaseline = "top";
        ctx.fillText(fmtAxis(t), x, yb + 5);
      });
    }

    /* boxes: vertical left to right, horizontal bottom row first, so nearer faces paint last */
    var dim = act !== null;
    for (var n = 0; n < K; n++) {
      k = horiz ? K - 1 - n : n;
      var base = 0, cat = cfg.categories[k];
      var start = horiz ? yt + band * k + (band - thick) / 2 : x0 + band * k + (band - thick) / 2;
      vis.forEach(function(i) {
        var val = Math.max(cfg.series[i].data[k] || 0, 0);
        if (!(val > 0)) return;
        var key = i + ":" + k, hot = key === act, polys, v0 = pos(base * p), v1 = pos((base + val) * p);
        ctx.globalAlpha = dim && !hot ? 0.55 : 1;
        polys = horiz ? c3dBox(ctx, v0, start, v1 - v0, thick, dx, dy, cfg.series[i].color, hot)
                      : c3dBox(ctx, start, v1, thick, v0 - v1, dx, dy, cfg.series[i].color, hot);
        ctx.globalAlpha = 1;
        self.marks.push({ key: key, polys: polys,
                          cx: horiz ? (v0 + v1) / 2 : start + thick / 2, cy: horiz ? start + thick / 2 : (v0 + v1) / 2 });
        base += val;
      });
      /* selective direct label: the stack total at the end of each bar */
      ctx.fillStyle = C3D.ink2;
      ctx.font = "11px " + C3D.font;
      if (totals[k] > 0 && p === 1) {
        if (!horiz && band >= 40) {
          ctx.textAlign = "center"; ctx.textBaseline = "bottom";
          ctx.fillText(c3dFit(ctx, cfg.format(totals[k]), band + 8), start + thick / 2 + dx / 2, pos(totals[k]) + dy - 3);
        } else if (horiz && band >= 13) {
          ctx.textAlign = "left"; ctx.textBaseline = "middle";
          ctx.fillText(cfg.format(totals[k]), pos(totals[k]) + dx + 5, start + thick / 2 + dy / 2);
        }
      }
      /* category labels */
      ctx.fillStyle = C3D.ink2;
      if (!horiz) {
        var every = Math.ceil(34 / band);
        if (k % every === 0) {
          ctx.textAlign = "center"; ctx.textBaseline = "top";
          ctx.fillText(c3dFit(ctx, cat, band * every - 4), start + thick / 2, yb + 6);
        }
      } else if (band >= 11) {
        ctx.textAlign = "right"; ctx.textBaseline = "middle";
        ctx.fillText(c3dFit(ctx, cat, x0 - a.x - 8), x0 - 6, start + thick / 2);
      }
    }
    for (k = 0; k < K; k++) vis.forEach(function(i) { if ((cfg.series[i].data[k] || 0) > 0) self.order.push(i + ":" + k); });
  };

  /* ---------------- tooltip ---------------- */
  Chart3D.prototype.keyItem = function(key) {
    return key === null ? null : (key.charAt(0) === "s" ? +key.slice(1) : +key.split(":")[0]);
  };

  Chart3D.prototype.drawTooltip = function() {
    var key = this.activeKey(), cfg = this.cfg, ctx = this.ctx, self = this;
    if (key === null) return;
    var mark = this.marks.filter(function(m) { return m.key === key; })[0];
    if (!mark) return;
    var title = null, rows = [];
    if (cfg.type === "donut") {
      var total = 0, s = cfg.slices[this.keyItem(key)];
      cfg.slices.forEach(function(x, i) { if (!self.hidden[i] && x.value > 0) total += x.value; });
      rows.push({ color: s.color, value: cfg.format(s.value), label: s.label + " (" + (s.value / total * 100).toFixed(1) + "%)", on: true });
    } else {
      var k = +key.split(":")[1], si = this.keyItem(key), sum = 0, count = 0;
      title = cfg.categories[k];
      cfg.series.forEach(function(x, i) {
        var val = x.data[k] || 0;
        if (self.hidden[i] || !(val > 0)) return;
        rows.push({ color: x.color, value: cfg.format(val), label: x.label, on: i === si });
        sum += val; count++;
      });
      if (count > 1) rows.push({ color: null, value: cfg.format(sum), label: "Total", on: false });
    }
    var w = 0, lineH = 18, pad = 10;
    rows.forEach(function(r) {
      ctx.font = "600 12px " + C3D.font;
      r.vw = ctx.measureText(r.value).width;
      ctx.font = (r.on ? "600 " : "") + "12px " + C3D.font;
      w = Math.max(w, 18 + r.vw + 6 + ctx.measureText(r.label).width);
    });
    if (title) { ctx.font = "600 11px " + C3D.font; w = Math.max(w, ctx.measureText(title).width); }
    var h = rows.length * lineH + (title ? 18 : 0) + pad * 2 - 4;
    w = Math.min(w + pad * 2, this.w - 8);
    var px = this.pointer && this.hover === key && this.focus === null ? this.pointer.x : mark.cx;
    var py = this.pointer && this.hover === key && this.focus === null ? this.pointer.y : mark.cy;
    var x = px + 14, y = py - h - 10;
    if (x + w > this.w - 4) x = px - w - 14;
    if (x < 4) x = 4;
    if (y < 4) y = py + 16;
    if (y + h > this.h - 4) y = this.h - 4 - h;
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.16)";
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 4;
    c3dRoundRect(ctx, x, y, w, h, 8);
    ctx.fillStyle = C3D.surface;
    ctx.fill();
    ctx.restore();
    c3dRoundRect(ctx, x + 0.5, y + 0.5, w - 1, h - 1, 8);
    ctx.strokeStyle = C3D.grid;
    ctx.lineWidth = 1;
    ctx.stroke();
    var cy = y + pad + 4;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    if (title) {
      ctx.font = "600 11px " + C3D.font;
      ctx.fillStyle = C3D.muted;
      ctx.fillText(c3dFit(ctx, title, w - pad * 2), x + pad, cy);
      cy += 18;
    }
    rows.forEach(function(r) {
      if (r.color) {
        ctx.beginPath();
        ctx.moveTo(x + pad, cy); ctx.lineTo(x + pad + 12, cy);
        ctx.strokeStyle = r.color; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.stroke();
        ctx.lineCap = "butt";
      }
      ctx.font = "600 12px " + C3D.font;
      ctx.fillStyle = C3D.ink;
      ctx.fillText(r.value, x + pad + 18, cy);
      ctx.font = (r.on ? "600 " : "") + "12px " + C3D.font;
      ctx.fillStyle = r.on ? C3D.ink : C3D.ink2;
      ctx.fillText(c3dFit(ctx, r.label, w - pad * 2 - 24 - r.vw + 1), x + pad + 18 + r.vw + 6, cy);
      cy += lineH;
    });
  };

  Chart3D.prototype.updateAria = function() {
    var cfg = this.cfg, self = this, parts = [];
    if (cfg.type === "donut") {
      cfg.slices.forEach(function(s, i) { if (!self.hidden[i] && s.value > 0) parts.push(s.label + " " + cfg.format(s.value)); });
    } else {
      cfg.categories.forEach(function(c, k) {
        var vals = [];
        cfg.series.forEach(function(s, i) { if (!self.hidden[i] && (s.data[k] || 0) > 0) vals.push(s.label + " " + cfg.format(s.data[k])); });
        if (vals.length) parts.push(c + ": " + vals.join(", "));
      });
    }
    var label = cfg.title + ". " + parts.join("; ") + ". Use the arrow keys to read each value.";
    if (this.canvas.getAttribute("aria-label") !== label) this.canvas.setAttribute("aria-label", label);
  };

  /* ---------------- interaction ---------------- */
  Chart3D.prototype.at = function(e) {
    var r = this.canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (this.w / (r.width || 1)), y: (e.clientY - r.top) * (this.h / (r.height || 1)) };
  };

  Chart3D.prototype.hit = function(p) {
    for (var b = 0; b < this.legendBoxes.length; b++) {
      var lb = this.legendBoxes[b];
      if (p.x >= lb.x - 4 && p.x <= lb.x + lb.w + 4 && p.y >= lb.y && p.y <= lb.y + lb.h) return { legend: lb.i };
    }
    for (var m = this.marks.length - 1; m >= 0; m--) {
      for (var q = 0; q < this.marks[m].polys.length; q++) {
        if (c3dInPoly(p.x, p.y, this.marks[m].polys[q])) return { key: this.marks[m].key };
      }
    }
    return null;
  };

  Chart3D.prototype.onMove = function(e) {
    var p = this.at(e), v = this.view;
    this.pointer = p;
    if (this.drag) {
      var dxp = p.x - this.drag.x, dyp = p.y - this.drag.y;
      this.drag.x = p.x; this.drag.y = p.y;
      this.drag.dist += Math.abs(dxp) + Math.abs(dyp);
      if (this.drag.dist > 4) this.drag.moved = true;
      if (!this.drag.moved) return;
      if (this.cfg.type === "donut") {
        v.rot += dxp * 0.012;
        v.tilt = Math.min(1.35, Math.max(0.35, v.tilt - dyp * 0.008));
      } else {
        v.angle = Math.min(1.4, Math.max(0.12, v.angle - dxp * 0.01));
        v.depth = Math.min(2.2, Math.max(0.3, v.depth - dyp * 0.012));
      }
      this.draw();
      return;
    }
    var h = this.hit(p), key = h && h.key !== undefined ? h.key : null;
    this.canvas.style.cursor = h ? "pointer" : "grab";
    this.hover = key;
    this.draw();
  };

  Chart3D.prototype.onLeave = function() {
    if (this.drag) return;
    this.pointer = null;
    this.hover = null;
    this.canvas.style.cursor = "";
    this.draw();
  };

  Chart3D.prototype.onDown = function(e) {
    var p = this.at(e), h = this.hit(p);
    this.focus = null;
    if (h && h.legend !== undefined) {
      this.hidden[h.legend] = !this.hidden[h.legend];
      this.hover = null;
      this.draw();
      return;
    }
    this.drag = { x: p.x, y: p.y, dist: 0, moved: false, key: h ? h.key : null };
    if (e.pointerType === "mouse") this.canvas.style.cursor = h ? "pointer" : "grabbing";
  };

  Chart3D.prototype.onUp = function(e) {
    if (!this.drag) return;
    var d = this.drag;
    this.drag = null;
    /* a tap without dragging pins the tooltip (touch has no hover) */
    if (!d.moved && e && e.pointerType !== "mouse") this.hover = d.key;
    this.draw();
  };

  Chart3D.prototype.onKey = function(e) {
    var keys = this.order, i = keys.indexOf(this.focus);
    if (e.key === "ArrowRight" || e.key === "ArrowDown") i = i < 0 ? 0 : (i + 1) % keys.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") i = i <= 0 ? keys.length - 1 : i - 1;
    else if (e.key === "Home") i = 0;
    else if (e.key === "End") i = keys.length - 1;
    else if (e.key === "Escape") i = -1;
    else return;
    e.preventDefault();
    this.focus = i >= 0 && keys.length ? keys[i] : null;
    this.draw();
  };

  /* ================================================================
     CHARTS
     ================================================================ */
  function drawCapacityChart(usable, resiliency, reserve, infra) {
    if (capChart) capChart.destroy();
    capChart = new Chart3D($("storageV2_capacityChart"), {
      type: "donut", title: "Capacity Breakdown", format: fmtTB,
      slices: [
        { label: "Net Usable",          value: usable,     color: C3D_COLORS.blue },
        { label: "Resiliency Overhead", value: resiliency, color: C3D_COLORS.orange },
        { label: "Reserve Capacity",    value: reserve,    color: C3D_COLORS.aqua },
        { label: "Infrastructure",      value: infra,      color: C3D_COLORS.yellow }
      ],
      center: function() { return { value: fmtTB(usable), label: "Net Usable" }; }
    });
  }

  function drawVolumesChart(infra1, clusterPerf, userPerNode, nodes, aldoInfra, san) {
    var labels = ["Infrastructure_1", "ClusterPerfHistory"], user = [0, 0], infra = [infra1, clusterPerf], sanData = [0, 0];
    if (aldoInfra > 0) { labels.push("DisconnectedOps (thin)"); user.push(0); infra.push(aldoInfra); sanData.push(0); }
    for (var i = 1; i <= nodes; i++) { labels.push("UserStorage_" + i); user.push(userPerNode); infra.push(0); sanData.push(0); }
    if (san) for (var j = 1; j <= san.volumes; j++) { labels.push("SAN_CSV_" + j); user.push(0); infra.push(0); sanData.push(san.perVolume); }
    var series = [
      { label: "User volumes",           color: C3D_COLORS.blue,   data: user },
      { label: "Infrastructure volumes", color: C3D_COLORS.orange, data: infra }
    ];
    if (san) series.push({ label: "SAN volumes", color: C3D_COLORS.violet, data: sanData });
    if (volChart) volChart.destroy();
    volChart = new Chart3D($("storageV2_volumesChart"), {
      type: "bar", horizontal: true, title: "Volume Distribution", categories: labels, format: fmtTB,
      axisFormat: function(v) { return c3dCompact(v) + " TB"; },
      series: series
    });
  }

  /* SAN only: capacity on the array and the LUNs of the instance */
  function drawSanCapacityChart(p) {
    if (capChart) capChart.destroy();
    capChart = new Chart3D($("storageV2_capacityChart"), {
      type: "donut", title: "SAN Capacity Plan", format: fmtTB,
      slices: [
        { label: "Workload Volumes",       value: p.workload, color: C3D_COLORS.blue },
        { label: "Free Space Headroom",    value: p.free,     color: C3D_COLORS.aqua },
        { label: "Infrastructure Volumes", value: p.infraTB,  color: C3D_COLORS.yellow }
      ],
      center: function() { return { value: fmtTB(p.physical), label: p.drr > 1 ? "Physical (" + p.drr + ":1)" : "Usable on the array" }; }
    });
  }

  function drawSanVolumesChart(p) {
    var labels = [], user = [], infra = [];
    p.infra.forEach(function(v) { labels.push(v.name); user.push(0); infra.push(v.tb); });
    for (var i = 1; i <= p.volumes; i++) { labels.push("SAN_CSV_" + i); user.push(p.perVolume); infra.push(0); }
    if (volChart) volChart.destroy();
    volChart = new Chart3D($("storageV2_volumesChart"), {
      type: "bar", horizontal: true, title: "SAN Volumes (one LUN per CSV)", categories: labels, format: fmtTB,
      axisFormat: function(v) { return c3dCompact(v) + " TB"; },
      series: [
        { label: "Workload volumes",       color: C3D_COLORS.blue,   data: user },
        { label: "Infrastructure volumes", color: C3D_COLORS.orange, data: infra }
      ]
    });
  }

  /* ================================================================
     OVERVIEW TABLE (Mode A)
     ================================================================ */
  function buildOverview(d) {
    $("storageV2_overviewSection").style.display = "block";
    var rows = [];
    function sec(t)     { rows.push('<tr class="section-header"><td colspan="3">' + t + '</td></tr>'); }
    function row(l,f,v) { rows.push('<tr><td>' + l + '</td><td class="formula">' + f + '</td><td>' + v + '</td></tr>'); }
    function total(l,v) { rows.push('<tr class="total-row"><td colspan="2">' + l + '</td><td>' + v + '</td></tr>'); }

    rows.push('<thead><tr><th>Item</th><th>Calculation</th><th>Value</th></tr></thead><tbody>');

    sec("Cluster Configuration");
    row("Cluster Type", "", d.nodes === 1 ? "Single Node" : "Multi-Node");
    if (deployType() !== "s2d") row("Deployment Type", "User-defined", deployTypes[deployType()].label);
    row("Number of Nodes", "User-defined", d.nodes);
    row("Storage", "Full-Flash NVMe", d.drivesPerNode + " drives x " + fmtTB(d.driveCap) + " per node");
    row("Resiliency", resiliencyLabel(d.resId), (d.efficiency * 100).toFixed(1) + "% efficiency");

    sec("Capacity Calculation");
    row("Raw per Node", d.drivesPerNode + " drives x " + fmtTB(d.driveCap), fmtTB(d.rawPerNode));
    row("Total Raw (Cluster)", fmtTB(d.rawPerNode) + " x " + d.nodes + " nodes", fmtTB(d.totalRaw));
    if (d.nodes > 1) {
      row("Reserve Capacity", d.nodes + " nodes x " + fmtTB(d.driveCap) + " (1 drive/node)", fmtTB(d.reserveCapacity));
    } else {
      row("Reserve Capacity", "Single node - no reserve", "0.00 TB");
    }
    row("Effective Capacity", fmtTB(d.totalRaw) + " - " + fmtTB(d.reserveCapacity), fmtTB(d.effective));
    row("Resiliency Overhead", fmtTB(d.effective) + " x (1 - " + (d.efficiency * 100).toFixed(1) + "%)", fmtTB(d.resiliencyOverhead));
    row("Usable after Resiliency", fmtTB(d.effective) + " x " + (d.efficiency * 100).toFixed(1) + "%", fmtTB(d.usableAfterRes));
    row("Infrastructure Overhead", "ARC RB + AKS + Cluster services", fmtTB(INFRA_OVERHEAD));
    total("Net Usable Capacity", fmtTB(d.netUsable) + " (" + d.netUsableTiB.toFixed(2) + " TiB)");
    row("Storage Efficiency", fmtTB(d.netUsable) + " / " + fmtTB(d.totalRaw), d.storageEff.toFixed(1) + "%");

    sec("Volume Distribution (estimated)");
    row("Infrastructure_1", "ARC Resource Bridge + AKS images", (d.infra1 * 1000).toFixed(0) + " GB");
    row("ClusterPerformanceHistory", "Cluster statistics", (d.clusterPerf * 1000).toFixed(0) + " GB");
    row("Extra Reserved", "System overhead", (d.extraReserve * 1000).toFixed(0) + " GB");
    if (d.aldoInfra > 0) row("Disconnected Operations Infrastructure", "Thin volume created during deployment", fmtTB(d.aldoInfra));
    for (var n = 1; n <= d.nodes; n++) {
      row("UserStorage_" + n, fmtTB(d.remainingForUser) + " / " + d.nodes + " nodes", fmtTB(d.userPerNode));
    }
    total("Total Volume Allocation", fmtTB(d.volumeOH + d.remainingForUser));
    if (d.san) {
      sanOverviewRows(d.san, sec, row, total);
      total("Workload Capacity (S2D user volumes + SAN)", fmtTB(d.remainingForUser + d.san.workload));
    }

    rows.push("</tbody>");
    $("storageV2_overviewTable").innerHTML = rows.join("");
  }

  /* ================================================================
     PDF EXPORT
     ================================================================ */
  function exportPdf() {
    var btn = $("storageV2_exportPdfBtn");
    btn.textContent = "Generating...";
    btn.disabled = true;

    try {
      var root = $("storageV2_calcRoot");
      var chartImages = {};
      root.querySelectorAll("canvas").forEach(function(c) {
        try { chartImages[c.id] = c.toDataURL("image/png"); } catch(e) {}
      });

      var clone = root.cloneNode(true);
      clone.querySelectorAll("canvas").forEach(function(c) {
        var img = document.createElement("img");
        img.src = chartImages[c.id] || "";
        img.style.cssText = "width:100%;height:100%;object-fit:contain;display:block";
        c.parentNode.replaceChild(img, c);
      });
      clone.querySelectorAll(".btn-row,.no-print").forEach(function(el) {
        el.style.display = "none";
      });

      var styles = "";
      for (var i = 0; i < document.styleSheets.length; i++) {
        try {
          var rules = document.styleSheets[i].cssRules || document.styleSheets[i].rules;
          for (var j = 0; j < rules.length; j++) styles += rules[j].cssText + "\n";
        } catch(e) {}
      }

      var win = window.open("", "_blank", "width=960,height=800");
      if (!win) {
        alert("Pop-up blocked. Allow pop-ups for this page and try again, or use Ctrl+P to print.");
        btn.textContent = "Export to PDF";
        btn.disabled = false;
        return;
      }

      win.document.write(
        "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'>" +
        "<title>Azure Local Storage Calculator - Export</title>" +
        "<style>" + styles + "</style>" +
        "<style>body{margin:0;padding:16px}.btn-row,.no-print{display:none!important}" +
        "@media print{.btn-row,.no-print{display:none!important}}</style>" +
        "</head><body>" + clone.outerHTML + "</body></html>"
      );
      win.document.close();
      setTimeout(function() { win.print(); }, 500);

    } catch(err) {
      console.error("Export failed:", err);
      alert("Export failed: " + (err.message || err) + "\nUse Ctrl+P / Cmd+P to print instead.");
    }

    btn.textContent = "Export to PDF";
    btn.disabled = false;
  }

  /* ================================================================
     ODIN IMPORT
     Reads a Sizer ("Export JSON") or Designer ("Export Configuration")
     file from ODIN for Azure Local and normalizes it.
     https://azure.github.io/odinforazurelocal/docs/json-schema/
     ================================================================ */
  var ODIN_CPU_GENERATIONS = {
    "xeon-4th": "Intel 4th Gen Xeon (Sapphire Rapids)",
    "xeon-5th": "Intel 5th Gen Xeon (Emerald Rapids)",
    "xeon-6": "Intel Xeon 6 (Granite Rapids / Sierra Forest)",
    "xeon-d-27xx": "Intel Xeon D-2700 (Ice Lake-D)",
    "epyc-4th": "AMD 4th Gen EPYC (Genoa)",
    "epyc-4th-c": "AMD 4th Gen EPYC (Bergamo)",
    "epyc-5th": "AMD 5th Gen EPYC (Turin)",
    "epyc-5th-c": "AMD 5th Gen EPYC (Turin Dense)"
  };
  var ODIN_AVD_PROFILES = {
    light:  { multi: [0.5, 2, 20], single: [2, 8, 32] },
    medium: { multi: [1, 4, 40],   single: [4, 16, 32] },
    heavy:  { multi: [1.5, 6, 60], single: [8, 32, 32] },
    power:  { multi: [2, 8, 80],   single: [8, 32, 80] },
    custom: { multi: [2, 8, 50],   single: [4, 16, 50] }
  };
  var ODIN_GHEL_TIERS = {
    "trial": [4, 32, 900], "up-to-1000": [8, 48, 900], "1000-to-3000": [16, 64, 1400],
    "3000-to-5000": [32, 128, 1900], "5000-to-8000": [48, 256, 3400], "8000-to-10000": [64, 512, 5400]
  };
  var ODIN_EDGERAG_LLM = { "external": [0, 0, 0], "foundry-minimum": [8, 32, 50], "foundry-production": [16, 64, 100] };

  function odinInt(v, def) { var n = parseInt(v, 10); return isFinite(n) ? n : def; }
  function odinNum(v, def) { var n = parseFloat(v); return isFinite(n) ? n : def; }
  function odinEsc(s) {
    return String(s).replace(/[&<>"']/g, function(c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* Mirrors calculateWorkloadRequirements() in ODIN sizer.js.
     Returns raw (pre-growth) vCPU, memory GB, storage GB and VM count. */
  function odinWorkloadReqs(w) {
    var v = 0, m = 0, s = 0, vms = 0;
    switch (w.type) {
      case "vm": {
        var count = Math.max(odinInt(w.count, 1), 1);
        v = odinNum(w.vcpus, 0) * count; m = odinNum(w.memory, 0) * count; s = odinNum(w.storage, 0) * count;
        vms = count;
        break;
      }
      case "aks": {
        var clusters = Math.max(odinInt(w.clusterCount, 1), 1);
        var cp = odinInt(w.controlPlaneNodes, 3), wk = odinInt(w.workerNodes, 3);
        v = (cp * odinNum(w.controlPlaneVcpus, 4) + wk * odinNum(w.workerVcpus, 8)) * clusters;
        m = (cp * odinNum(w.controlPlaneMemory, 8) + wk * odinNum(w.workerMemory, 16)) * clusters;
        s = (cp * 200 + wk * (200 + odinNum(w.workerStorage, 200))) * clusters;
        vms = (cp + wk) * clusters;
        break;
      }
      case "avd": {
        var users = Math.max(odinInt(w.userCount, 50), 0);
        var sType = w.sessionType === "single" ? "single" : "multi";
        var conc = sType === "single" ? 1 : odinNum(w.concurrency, 100) / 100;
        var concUsers = Math.ceil(users * conc);
        var p = (ODIN_AVD_PROFILES[w.profile] || ODIN_AVD_PROFILES.medium)[sType];
        var vpu = p[0], mpu = p[1], spu = p[2];
        if (w.profile === "custom") {
          vpu = odinNum(w.customVcpus, 2); mpu = odinNum(w.customMemory, 8); spu = odinNum(w.customStorage, 50);
        }
        v = Math.ceil(vpu * concUsers); m = mpu * concUsers; s = spu * users;
        if (w.fslogix) s += odinNum(w.fslogixSize, 30) * users;
        vms = sType === "single" ? concUsers : 1;
        break;
      }
      case "foundry": {
        var fw = Math.max(odinInt(w.workerNodes, 2), 1);
        var fv = 8, fm = 32;
        if (w.workerProfile === "minimum") { fv = 4; fm = 16; }
        else if (w.workerProfile === "custom") { fv = odinNum(w.customVcpus, 8); fm = odinNum(w.customMemory, 32); }
        v = 12 + fv * fw + 2; m = 24 + fm * fw + 4;
        s = 600 + 200 * fw + odinNum(w.modelCacheStorageGB, 100) * Math.max(odinInt(w.modelDeployments, 1), 1);
        vms = 3 + fw;
        break;
      }
      case "edgerag": {
        var emb = w.deploymentMode === "agentic" ? 0 : 2;
        var llm = ODIN_EDGERAG_LLM[w.llmEndpoint] || ODIN_EDGERAG_LLM["foundry-production"];
        v = 12 + 24 + emb * 8 + llm[0]; m = 24 + 96 + emb * 16 + llm[1];
        s = 600 + (3 + emb) * 200 + llm[2] + Math.ceil(odinNum(w.corpusGB, 100) * 1.5);
        vms = 6 + emb;
        break;
      }
      case "videoindexer": {
        var isMin = w.configuration === "minimum";
        v = 12 + (isMin ? 32 : 64); m = 24 + (isMin ? 64 : 256);
        s = 600 + (isMin ? 1 : 2) * 200 + (isMin ? 50 : 100);
        vms = 3 + (isMin ? 1 : 2);
        break;
      }
      case "ghel": {
        var t = ODIN_GHEL_TIERS[w.tier] || ODIN_GHEL_TIERS["up-to-1000"];
        var rep = (typeof w.replicas === "number" && w.replicas >= 0 && w.replicas <= 7) ? w.replicas : (w.ha ? 1 : 0);
        var mult = 1 + (w.actions ? 0.25 : 0) + (w.codeSecurity ? 0.25 : 0);
        vms = 1 + rep;
        v = Math.ceil(t[0] * mult) * vms; m = Math.ceil(t[1] * mult) * vms; s = t[2] * vms;
        break;
      }
    }
    return { vcpus: v, memory: m, storage: s, vms: vms };
  }

  /* Mirrors the ODIN Sizer network model (infrastructure power estimate):
     per rack 2 ToR + 1 BMC; rack-aware uses 2 racks; disaggregated adds
     2 FC switches per rack for FC SAN plus the spine switches; a single node
     only has a BMC switch. Designer ToR choices override the defaults. */
  function odinNetwork(clusterType, nodes, st) {
    var tor, bmc, fc = 0, spine = 0;
    var torChoice = st.torSwitchCount === "single" ? 1 : (st.torSwitchCount === "dual" ? 2 : null);
    if (clusterType === "disaggregated") {
      var racks = Math.max(odinInt(st.disaggRackCount, 2), 1);
      tor = racks * 2; bmc = racks;
      fc = (st.disaggStorageType || "fc_san") === "fc_san" ? racks * 2 : 0;
      spine = Math.max(odinInt(st.disaggSpineCount, 2), 0);
    } else if (clusterType === "rack-aware") {
      tor = 2 * (odinInt(st.rackAwareTorsPerRoom, 0) || 2); bmc = 2;
    } else if (nodes === 1) {
      tor = torChoice || 0; bmc = 1;
    } else {
      tor = torChoice || 2; bmc = 1;
    }
    var parts = [];
    if (tor) parts.push(tor + " ToR");
    parts.push(bmc + " BMC");
    if (fc) parts.push(fc + " FC");
    if (spine) parts.push(spine + " Spine");
    return { total: tor + bmc + fc + spine, detail: parts.join(" + ") };
  }

  /* Mirrors getHostCpuReservedCores() in ODIN sizer.js (cores per node). */
  function odinHostReservedCores(clusterType, totalCores) {
    if (clusterType === "aldo-mgmt") return Math.max(Math.ceil(0.20 * totalCores), 2);
    if (clusterType === "disaggregated") return Math.max(Math.ceil(0.10 * totalCores), 1);
    return Math.max(Math.ceil(0.10 * totalCores), 2);
  }

  function parseOdinConfig(text) {
    var json;
    try { json = JSON.parse(text); } catch (e) { throw new Error("The file is not valid JSON."); }
    if (!json || typeof json !== "object") throw new Error("The file is not a valid ODIN export.");

    var r = {
      source: null, nodes: null, clusterType: null, scenario: "connected", resiliency: null,
      cpu: null, vcpuRatio: null, growthPct: 0, growthYears: 1, growthFactor: 1,
      disks: null, workloadCount: 0, totals: null, avdVcpus: 0, vmEquivalents: 0, network: null, hostReservedCores: null
    };

    if (json.state && typeof json.state === "object") {
      /* Designer export: { version, exportedAt, state } */
      var st = json.state, hw = st.sizerHardware && typeof st.sizerHardware === "object" ? st.sizerHardware : null;
      r.source = "ODIN Designer";
      r.scenario = st.scenario || "connected";
      r.clusterType = st.architecture === "disaggregated" ? "disaggregated"
        : (st.clusterRole === "management" ? "aldo-mgmt"
        : (hw && hw.clusterType ? hw.clusterType
        : (st.scale === "rack_aware" ? "rack-aware" : "standard")));
      r.nodes = odinInt(st.nodes, null) || (hw ? odinInt(hw.nodeCount, null) : null);
      if (r.nodes === 1 && r.clusterType === "standard") r.clusterType = "single";
      r.network = odinNetwork(r.clusterType, r.nodes, st);
      if (hw) {
        r.resiliency = hw.resiliency || null;
        if (hw.cpu && odinInt(hw.cpu.coresPerSocket, 0) > 0) {
          r.cpu = {
            manufacturer: hw.cpu.manufacturer || "",
            generation: hw.cpu.generation || "Unknown",
            coresPerSocket: odinInt(hw.cpu.coresPerSocket, 0),
            sockets: odinInt(hw.cpu.sockets, 2)
          };
        }
        r.vcpuRatio = odinInt(hw.vcpuRatio, null);
        r.growthPct = odinInt(hw.futureGrowth, 0);
        var dc = hw.storage && hw.storage.diskConfig;
        if (dc && dc.capacity) {
          r.disks = {
            isTiered: !!dc.isTiered,
            capacityCount: odinInt(dc.capacity.count, 0),
            capacityTB: odinNum(dc.capacity.sizeGB, 0) / 1024,
            cacheCount: dc.cache ? odinInt(dc.cache.count, 0) : 0,
            cacheTB: dc.cache ? odinNum(dc.cache.sizeGB, 0) / 1024 : 0
          };
        }
        var sw = Array.isArray(st.sizerWorkloads) ? st.sizerWorkloads
          : (st.sizerWorkloads && typeof st.sizerWorkloads === "object" ? Object.keys(st.sizerWorkloads).map(function(k) { return st.sizerWorkloads[k]; }) : []);
        var t = { vcpus: 0, memory: 0, storage: 0 };
        sw.forEach(function(w) {
          if (!w || typeof w !== "object") return;
          t.vcpus += odinNum(w.totalVcpus, 0); t.memory += odinNum(w.totalMemoryGB, 0); t.storage += odinNum(w.totalStorageGB, 0);
          if (w.type === "avd") r.avdVcpus += odinNum(w.totalVcpus, 0);
          r.vmEquivalents += w.type === "vm" ? Math.max(odinInt(w.count, 1), 1) : 1;
        });
        r.workloadCount = sw.length;
        if (sw.length) r.totals = t;
      }
    } else {
      /* Sizer export: { _meta, data } or the bare data object */
      var d = json.data && typeof json.data === "object" ? json.data : json;
      if (!d.clusterType && !Array.isArray(d.workloads)) {
        throw new Error("This file is not an ODIN Sizer or Designer export.");
      }
      r.source = "ODIN Sizer";
      r.clusterType = d.clusterType || "standard";
      r.scenario = r.clusterType === "aldo-mgmt" ? "disconnected" : "connected";
      r.nodes = r.clusterType === "single" ? 1 : odinInt(d.nodeCount, null);
      r.resiliency = d.resiliency || null;
      if (odinInt(d.cpuCores, 0) > 0) {
        r.cpu = {
          manufacturer: d.cpuManufacturer || "",
          generation: d.importedProcessorName || ODIN_CPU_GENERATIONS[d.cpuGeneration] || d.cpuGeneration || "Unknown",
          coresPerSocket: odinInt(d.cpuCores, 0),
          sockets: odinInt(d.cpuSockets, 2)
        };
      }
      r.vcpuRatio = odinInt(d.vcpuRatio, null);
      r.growthPct = odinInt(d.futureGrowth, 0);
      r.growthYears = d.sizeFor5YrGrowth === true ? 5 : 1;
      var tiered = d.storageConfig === "mixed-flash" || d.storageConfig === "hybrid";
      if (tiered) {
        r.disks = {
          isTiered: true,
          capacityCount: odinInt(d.tieredCapacityDiskCount, 4), capacityTB: odinNum(d.tieredCapacityDiskSize, 3.84),
          cacheCount: odinInt(d.cacheDiskCount, 2), cacheTB: odinNum(d.cacheDiskSize, 1.92)
        };
      } else if (odinInt(d.capacityDiskCount, 0) > 0) {
        r.disks = { isTiered: false, capacityCount: odinInt(d.capacityDiskCount, 0), capacityTB: odinNum(d.capacityDiskSize, 0), cacheCount: 0, cacheTB: 0 };
      }
      r.network = odinNetwork(r.clusterType, r.nodes, {
        disaggRackCount: d.disaggRackCount, disaggSpineCount: d.disaggSpineCount, disaggStorageType: d.disaggStorageType
      });
      var wl = Array.isArray(d.workloads) ? d.workloads : [];
      var tt = { vcpus: 0, memory: 0, storage: 0 };
      wl.forEach(function(w) {
        if (!w || typeof w !== "object") return;
        var q = odinWorkloadReqs(w);
        tt.vcpus += q.vcpus; tt.memory += q.memory; tt.storage += q.storage;
        if (w.type === "avd") r.avdVcpus += q.vcpus;
        r.vmEquivalents += q.vms;
      });
      r.workloadCount = wl.length;
      if (wl.length) r.totals = tt;
    }

    r.growthFactor = Math.pow(1 + r.growthPct / 100, r.growthYears);
    if (!r.nodes || r.nodes < 1) r.nodes = null;
    if (r.cpu) r.hostReservedCores = odinHostReservedCores(r.clusterType, r.cpu.coresPerSocket * r.cpu.sockets);
    if (r.cpu && (!r.cpu.generation || r.cpu.generation === "Unknown")) {
      r.cpu.generation = r.cpu.manufacturer === "amd" ? "AMD CPU" : (r.cpu.manufacturer ? "Intel CPU" : "CPU");
    }
    return r;
  }

  /* Opens a file picker, parses the chosen ODIN file and hands it to onLoad
     together with the raw text (used to share the import). */
  function pickOdinFile(input, onLoad, onError) {
    input.value = "";
    input.onchange = function() {
      var file = input.files && input.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) { onError("The file is larger than 5 MB."); return; }
      var reader = new FileReader();
      reader.onload = function() {
        var text = String(reader.result), cfg;
        try { cfg = parseOdinConfig(text); }
        catch (e) { onError(e.message || String(e)); return; }
        onLoad(cfg, file.name, text);
      };
      reader.onerror = function() { onError("The file could not be read."); };
      reader.readAsText(file);
    };
    input.click();
  }

  function odinClusterLabel(t) {
    return { "single": "Single Node", "standard": "Hyperconverged", "rack-aware": "Rack Aware",
             "disaggregated": "Disaggregated Storage", "aldo-mgmt": "Disconnected Operations (Management)" }[t] || t || "Unknown";
  }

  /* Renders the import summary into the given box using the existing result-box style. */
  function showOdinSummary(box, cfg, fileName, applied, notes) {
    var h = "<strong>Imported from " + odinEsc(cfg.source) + ":</strong> " + odinEsc(fileName) + "<br>";
    h += "<strong>Cluster:</strong> " + odinEsc(odinClusterLabel(cfg.clusterType)) +
         (cfg.nodes ? ", " + cfg.nodes + " node" + (cfg.nodes > 1 ? "s" : "") : "") +
         (cfg.scenario === "disconnected" ? " (disconnected)" : "") + "<br>";
    applied.forEach(function(a) { h += "<strong>" + odinEsc(a[0]) + ":</strong> " + odinEsc(a[1]) + "<br>"; });
    notes.forEach(function(n) { h += '<span class="warning">' + odinEsc(n) + "</span><br>"; });
    box.innerHTML = h;
    box.style.display = "block";
  }

  /* Shares one ODIN import with every calculator: the others on the same
     page (or in other blog tabs) apply it right away, and it is kept for the
     browser session so the other calculator pages load it as well. */
  var ODIN_SHARE_KEY = "azureLocalCalculator.odinImport";
  var ODIN_SHARE_EVENT = "azurelocal-calculator-odin-import";
  var odinChannel = null;
  try { if (typeof BroadcastChannel === "function") odinChannel = new BroadcastChannel(ODIN_SHARE_EVENT); } catch (e) {}

  function shareOdinImport(text, fileName, sourceId) {
    var msg = { text: text, fileName: fileName, source: sourceId };
    try { sessionStorage.setItem(ODIN_SHARE_KEY, JSON.stringify(msg)); } catch (e) {}
    try {
      if (odinChannel) odinChannel.postMessage(msg);
      else window.dispatchEvent(new CustomEvent(ODIN_SHARE_EVENT, { detail: msg }));
    } catch (e) {}
  }

  /* Calls apply(cfg, label) for imports made in another calculator and, on
     page load, for the import stored earlier in this browser session. */
  function listenOdinImport(sourceId, apply) {
    function handle(msg, suffix) {
      if (!msg || typeof msg.text !== "string" || msg.source === sourceId) return;
      try { apply(parseOdinConfig(msg.text), String(msg.fileName || "ODIN export") + suffix); }
      catch (e) { if (window.console) console.warn("Shared ODIN import skipped:", e); }
    }
    if (odinChannel) odinChannel.addEventListener("message", function(ev) { handle(ev.data, " (shared from another calculator)"); });
    else window.addEventListener(ODIN_SHARE_EVENT, function(ev) { handle(ev.detail, " (shared from another calculator)"); });
    var saved = null;
    try { saved = JSON.parse(sessionStorage.getItem(ODIN_SHARE_KEY) || "null"); } catch (e) {}
    if (saved && typeof saved === "object") { saved.source = null; handle(saved, " (restored from this browser session)"); }
  }

  function applyOdinConfig(cfg, fileName) {
    var applied = [], notes = [];
    odinResiliencyShown = {};

    var odinDeploy = cfg.clusterType === "disaggregated" ? "disaggregated" : cfg.clusterType === "aldo-mgmt" ? "aldo-mgmt" : "s2d";
    $("storageV2_deployType").value = odinDeploy;
    applyDeployType();
    if (odinDeploy !== "s2d") applied.push(["Deployment Type", deployTypes[odinDeploy].label]);
    var maxNodes = deployTypes[odinDeploy].maxNodes;

    if (cfg.nodes) {
      var single = cfg.nodes === 1;
      $("storageV2_singleNode").checked = single;
      $("storageV2_nodeCountGroup").style.display = single ? "none" : "";
      if (!single) {
        $("storageV2_nodeCount").value = Math.min(Math.max(cfg.nodes, 2), maxNodes);
        if (cfg.nodes > maxNodes) notes.push("ODIN uses " + cfg.nodes + " nodes. This deployment type supports up to " + maxNodes + " nodes, so " + maxNodes + " was applied.");
      }
      applied.push(["Nodes", single ? "Single Node" : String(Math.min(cfg.nodes, maxNodes))]);
    }
    if (odinDeploy === "disaggregated") {
      /* the ODIN network model only adds FC switches for Fibre Channel SANs */
      var fc = !(cfg.network && cfg.network.detail) || /FC/.test(cfg.network.detail);
      $("storageV2_sanProtocol").value = fc ? "fc" : "iscsi";
      updateSanVendorInfo();
      applied.push(["SAN Connectivity", fc ? "Fibre Channel" : "iSCSI"]);
      notes.push("Disaggregated Storage uses an external SAN. The internal drives are boot drives, so the SAN capacity plan is shown instead of Storage Spaces Direct results. Choose the SAN vendor in the External SAN Storage section.");
    }

    if (odinDeploy !== "disaggregated" && cfg.disks && cfg.disks.capacityCount > 0 && cfg.disks.capacityTB > 0) {
      var count = Math.min(cfg.disks.capacityCount, MAX_DRIVES);
      var size = Math.round(cfg.disks.capacityTB * 100) / 100;
      $("storageV2_ffCount").value = count;
      var match = COMMON_SIZES.filter(function(s) { return Math.abs(s - size) < 0.005; })[0];
      $("storageV2_ffCapacity").value = match ? String(match) : "custom";
      $("storageV2_ffCapacityCustomGroup").style.display = match ? "none" : "";
      if (!match) $("storageV2_ffCapacityCustom").value = size;
      applied.push(["Drives per Node", count + " x " + size + " TB"]);
      if (cfg.disks.capacityCount > MAX_DRIVES) {
        notes.push("ODIN uses " + cfg.disks.capacityCount + " capacity drives per node. This calculator supports up to " + MAX_DRIVES + ", so " + MAX_DRIVES + " were applied.");
      }
      if (cfg.disks.isTiered) {
        notes.push("ODIN uses a tiered layout. The " + cfg.disks.cacheCount + " cache drive(s) per node were ignored because this calculator models full-flash capacity drives only.");
      }
    }

    var resMap = { "simple": "simple", "2way": "two-way", "3way": "three-way", "4way": "four-way" };
    var resId = resMap[cfg.resiliency];
    if (resId) {
      if (resId === "simple" || resId === "four-way") odinResiliencyShown[resId] = true;
      selectedResiliencyByMode.A = selectedResiliencyByMode.B = resId;
      resiliencyUserSelectedByMode.A = resiliencyUserSelectedByMode.B = true;
      applied.push(["Resiliency", resiliencyLabel(resId)]);
    } else if (cfg.resiliency && cfg.resiliency !== "external") {
      notes.push("ODIN resiliency '" + cfg.resiliency + "' is not available in this calculator. The default resiliency was kept.");
    }

    var targetTB = cfg.totals ? Math.round(cfg.totals.storage * cfg.growthFactor / 1000 * 100) / 100 : 0;
    if (targetTB > 0) {
      $(odinDeploy === "disaggregated" ? "storageV2_sanCapacity" : "storageV2_targetStorage").value = targetTB;
      applied.push([odinDeploy === "disaggregated" ? "Workload Capacity on the SAN" : "Target Effective Storage", targetTB + " TB (" + cfg.workloadCount + " workload(s)" +
        (cfg.growthPct ? ", incl. " + cfg.growthPct + "% growth" + (cfg.growthYears > 1 ? " over " + cfg.growthYears + " years" : "") : "") + ")"]);
    }

    var hasDrives = applied.some(function(a) { return a[0] === "Drives per Node"; });
    if (odinDeploy === "disaggregated") {
      switchMode("A");
      showOdinSummary($("storageV2_importBox"), cfg, fileName, applied, notes);
      $("storageV2_calcBtn").click();
      return;
    }
    if (!hasDrives && targetTB <= 0) notes.push("The file has no drive or workload storage data. Only the cluster settings were applied.");
    switchMode(hasDrives || targetTB <= 0 ? "A" : "B");
    showOdinSummary($("storageV2_importBox"), cfg, fileName, applied, notes);
    if (hasDrives || targetTB > 0) $("storageV2_calcBtn").click();
  }

  $("storageV2_importOdinBtn").addEventListener("click", function() {
    pickOdinFile($("storageV2_odinFile"), function(cfg, fileName, text) {
      applyOdinConfig(cfg, fileName);
      shareOdinImport(text, fileName, "storage");
    }, function(msg) { alert("ODIN import failed: " + msg); });
  });

  /* ================================================================
     INITIAL RENDER
     ================================================================ */
  applyDeployType();
  listenOdinImport("storage", applyOdinConfig);

})();
</script>
</body>
</html>


### Pricing Calculator

The Pricing Calculator estimates the one-time and monthly cost of an Azure Local deployment, including hardware, licensing, related costs and Azure Local services.

- **Deployment models**: L1 hyperconverged without external storage, L2 disaggregated with SAN storage, L2 hyperconverged with external storage, L2 with an OEM license and L3 disconnected operations. Azure Hybrid Benefit for the host fee is only available for L1.
- **L3**: Microsoft does not publish the host fee, so enter your quote. The calculator adds the nodes and cores of the management cluster because disconnected operations bill them too. AVD is not available with disconnected operations.
- **Licensing and services**: the free 60-day trial, the Windows Server subscription or custom Windows licensing, AVD and SQL Managed Instance.

<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    #pricingV2_calcRoot,
    #pricingV2_calcRoot *{box-sizing:border-box}
    #pricingV2_calcRoot{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;margin:20px 0;text-align:center}
    #pricingV2_calcRoot h3{font-size:1.5em;margin-bottom:20px}

    #pricingV2_calcRoot .card{margin:20px 0;padding:0;text-align:left}
    #pricingV2_calcRoot .card h3{margin:0 0 20px;font-size:1.5em}

    #pricingV2_calcRoot .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px 20px}
    @media(max-width:700px){#pricingV2_calcRoot .form-grid{grid-template-columns:1fr}}
    #pricingV2_calcRoot .form-group{display:flex;flex-direction:column;min-width:0;max-width:100%}
    #pricingV2_calcRoot .form-group.full{grid-column:1/-1;width:100%;min-width:0;max-width:100%}
    #pricingV2_calcRoot .form-group label,
    #pricingV2_calcRoot .currency-bar label,
    #pricingV2_calcRoot label{display:block;margin-bottom:5px;font-weight:600}
    #pricingV2_calcRoot .form-group input[type=number],
    #pricingV2_calcRoot .form-group select,
    #pricingV2_calcRoot .currency-bar select{
      padding:8px;
      border:1px solid #555;
      border-radius:8px;
      box-sizing:border-box;
      margin-top:5px
    }
    #pricingV2_calcRoot .form-group input[type=number],
    #pricingV2_calcRoot .form-group select{width:100%}
    #pricingV2_calcRoot .form-group select,
    #pricingV2_calcRoot .currency-bar select{background:#444;color:#fff}
    #pricingV2_calcRoot .form-group input[type=number]:focus,
    #pricingV2_calcRoot .form-group select:focus,
    #pricingV2_calcRoot .currency-bar select:focus{outline:none}

    #pricingV2_calcRoot .chk-row{display:flex;align-items:flex-start;flex-wrap:wrap;gap:0.5rem;margin-bottom:10px;max-width:100%}
    #pricingV2_calcRoot .chk-row input[type=checkbox]{margin-right:8px;transform:scale(1.2)}
    #pricingV2_calcRoot .chk-row label{margin:0;font-weight:600;flex:1 1 14rem;min-width:0;overflow-wrap:anywhere}

    #pricingV2_calcRoot .currency-bar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:20px 0;text-align:left}
    #pricingV2_calcRoot .currency-bar select{width:auto;min-width:110px}

    #pricingV2_calcRoot .btn-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:8px}
    #pricingV2_calcRoot .btn,
    #pricingV2_calcRoot button{background:#007aff;color:#fff;border:none;border-radius:8px;padding:10px 20px;font-size:1em;cursor:pointer;margin-top:20px}
    #pricingV2_calcRoot .btn:hover,
    #pricingV2_calcRoot button:hover{background:#005bb5}
    #pricingV2_calcRoot .btn-secondary{background:#555;color:#fff}
    #pricingV2_calcRoot .btn-secondary:hover{background:#3d3d3d}

    #pricingV2_calcRoot .result-box{margin-top:20px;text-align:left;font-size:.95em;line-height:1.7}

    #pricingV2_calcRoot .charts-grid{display:grid;grid-template-columns:1fr;gap:16px;margin-top:20px}
    @media(min-width:700px){#pricingV2_calcRoot .charts-grid.two-col{grid-template-columns:1fr 1fr}}
    #pricingV2_calcRoot .chart-wrapper{position:relative;height:320px;text-align:center}
    #pricingV2_calcRoot .chart-wrapper canvas{background:#fff;border-radius:8px;width:100%!important;height:100%!important}

    #pricingV2_calcRoot .overview-table{width:100%;border-collapse:collapse;margin-top:15px;text-align:left;font-size:.9em}
    #pricingV2_calcRoot .overview-table th,
    #pricingV2_calcRoot .overview-table td{padding:8px 10px;border-bottom:1px solid #555}
    #pricingV2_calcRoot .overview-table th{font-weight:600}
    #pricingV2_calcRoot .overview-table td:last-child{text-align:right}
    #pricingV2_calcRoot .overview-table .section-header{font-weight:700;color:#007aff}
    #pricingV2_calcRoot .overview-table .total-row{font-weight:700}
    #pricingV2_calcRoot .overview-table .formula{font-size:.86em;opacity:.8}

    #pricingV2_calcRoot .disclaimer{font-size:.8em;margin-top:20px;text-align:left;line-height:1.6}
    #pricingV2_calcRoot .disclaimer a{color:#007aff;text-decoration:none}
    #pricingV2_calcRoot .warning{color:#cc3300;font-weight:600}
    #pricingV2_calcRoot .disclaimer a:hover{text-decoration:underline}

    @media print{
      #pricingV2_calcRoot .btn-row,#pricingV2_calcRoot .no-print{display:none!important}
      #pricingV2_calcRoot .card,#pricingV2_calcRoot .chart-wrapper{break-inside:avoid}
      #pricingV2_calcRoot .chart-wrapper{height:260px}
    }
  </style>
</head>
<body>
<div class="container" id="pricingV2_calcRoot">

  <!-- Currency -->
  <div class="currency-bar">
    <label for="pricingV2_currencySelect">Currency:</label>
    <select id="pricingV2_currencySelect">
      <option value="EUR" selected>EUR</option>
      <option value="USD">USD</option>
      <option value="GBP">GBP</option>
      <option value="CHF">CHF</option>
    </select>
  </div>

  <!-- Section 1: Infrastructure -->
  <div class="card">
    <h3>Infrastructure Price</h3>
    <div class="form-grid">
      <div class="form-group">
        <label for="pricingV2_nodes">Number of Nodes</label>
        <input type="number" id="pricingV2_nodes" value="1" min="1" max="16" step="1">
      </div>
      <div class="form-group">
        <label for="pricingV2_pricePerNode">Price per Node</label>
        <input type="number" id="pricingV2_pricePerNode" value="50000" min="0" step="100">
      </div>
      <div class="form-group">
        <label for="pricingV2_switches">Number of Switches</label>
        <input type="number" id="pricingV2_switches" value="0" min="0" max="8" step="1">
      </div>
      <div class="form-group">
        <label for="pricingV2_pricePerSwitch">Price per Switch</label>
        <input type="number" id="pricingV2_pricePerSwitch" value="20000" min="0" step="100">
      </div>
    </div>
  </div>

  <!-- Section 2: Licensing -->
  <div class="card">
    <h3>License Price</h3>
    <div class="form-grid">
      <div class="form-group full">
        <label for="pricingV2_deploymentModel">Azure Local Deployment Model</label>
        <select id="pricingV2_deploymentModel">
          <option value="l1">L1: Hyperconverged without external storage (10/core/month)</option>
          <option value="l2-disagg">L2: Disaggregated with SAN storage (20.10/core/month)</option>
          <option value="l2">L2: Hyperconverged with external storage (20.10/core/month)</option>
          <option value="l2-oem">L2: OEM license with external storage (10/core/month)</option>
          <option value="l3">L3: Disconnected operations (user-provided rate)</option>
        </select>
      </div>
      <div class="form-group full" id="pricingV2_l3RateContainer" style="display:none">
        <label for="pricingV2_l3HostRate">L3 Host Fee per Physical Core / Month</label>
        <input type="number" id="pricingV2_l3HostRate" placeholder="Enter a planning rate or account-specific quote" min="0.01" step="0.01">
      </div>
      <div class="form-group" id="pricingV2_l3MgmtNodesGroup" style="display:none">
        <label for="pricingV2_l3MgmtNodes">ALDO Management Cluster Nodes</label>
        <input type="number" id="pricingV2_l3MgmtNodes" value="3" min="0" max="16" step="1">
      </div>
      <div class="form-group" id="pricingV2_l3MgmtCoresGroup" style="display:none">
        <label for="pricingV2_l3MgmtCores">Physical Cores per Management Node</label>
        <input type="number" id="pricingV2_l3MgmtCores" value="24" min="1" max="384" step="1">
      </div>
      <div class="form-group full" id="pricingV2_l3MgmtPriceGroup" style="display:none">
        <label for="pricingV2_l3MgmtNodePrice">Price per Management Node</label>
        <input type="number" id="pricingV2_l3MgmtNodePrice" value="50000" min="0" step="100">
        <div style="font-size:.82em;margin-top:6px">Disconnected operations bill the physical cores of the workload clusters and of the dedicated management cluster that runs the local control plane. Production management clusters have 3 nodes with at least 24 physical cores each. Set 0 nodes if the management cluster is already billed.</div>
      </div>
      <div class="form-group full">
        <label for="pricingV2_coresPerNode">Physical Cores per Node</label>
        <input type="number" id="pricingV2_coresPerNode" value="16" min="1" max="128" step="1">
      </div>
    </div>
    <div style="margin-top:12px">
      <div class="chk-row">
        <input type="checkbox" id="pricingV2_waiveHostFee">
        <label for="pricingV2_waiveHostFee">Apply Azure Hybrid Benefit to the L1 Host Fee (saves 10/core/month)</label>
      </div>
      <p id="pricingV2_ahbNote" class="warning" style="display:none;font-size:.82em;margin:0 0 10px"></p>
      <div class="chk-row">
        <input type="checkbox" id="pricingV2_waiveWindowsLicense">
        <label for="pricingV2_waiveWindowsLicense">Waive Windows Server License Fee (saves 23.30/core/month)</label>
      </div>
      <div class="chk-row">
        <input type="checkbox" id="pricingV2_customLicenseChk">
        <label for="pricingV2_customLicenseChk">Use Custom Windows License Pricing (per Node)</label>
      </div>
      <div class="chk-row">
        <input type="checkbox" id="pricingV2_applyTrial" checked>
        <label for="pricingV2_applyTrial">Apply the Free 60-Day Trial to Term Estimates</label>
      </div>
    </div>
    <div id="pricingV2_customLicenseContainer" style="display:none;margin-top:12px">
      <div class="form-grid">
        <div class="form-group">
          <label for="pricingV2_customWinMonthly">Windows Datacenter License (monthly/node)</label>
          <input type="number" id="pricingV2_customWinMonthly" placeholder="e.g., 500" step="0.1" min="0">
        </div>
        <div class="form-group">
          <label for="pricingV2_customWinOneTime">One-Time Datacenter License (per node)</label>
          <input type="number" id="pricingV2_customWinOneTime" placeholder="e.g., 3000" step="100" min="0">
        </div>
      </div>
    </div>
  </div>

  <!-- Section 3: Related Costs (broken down) -->
  <div class="card">
    <h3>Related Licenses / Costs</h3>
    <p style="font-size:.82em;color:inherit;margin:0 0 12px">Enter the relevant costs for each category. Leave blank or 0 for items that do not apply.</p>

    <!-- Backup -->
    <div style="margin-bottom:14px">
      <label style="font-size:.9em;font-weight:700;color:#007aff;display:block;margin-bottom:6px">Backup</label>
      <div class="form-grid">
        <div class="form-group">
        <label for="pricingV2_backupOTC">One-Time Cost (OTC)</label>
        <input type="number" id="pricingV2_backupOTC" placeholder="e.g., 5000" step="100" min="0">
        </div>
        <div class="form-group">
        <label for="pricingV2_backupMonthly">Monthly Cost</label>
        <input type="number" id="pricingV2_backupMonthly" placeholder="e.g., 200" step="10" min="0">
        </div>
      </div>
    </div>

    <!-- Logs / Monitoring -->
    <div style="margin-bottom:14px">
      <label style="font-size:.9em;font-weight:700;color:#007aff;display:block;margin-bottom:6px">Logs / Monitoring</label>
      <div class="form-grid">
        <div class="form-group">
          <label for="pricingV2_logsOTC">One-Time Cost (OTC)</label>
          <input type="number" id="pricingV2_logsOTC" placeholder="e.g., 2000" step="100" min="0">
        </div>
        <div class="form-group">
          <label for="pricingV2_logsMonthly">Monthly Cost</label>
          <input type="number" id="pricingV2_logsMonthly" placeholder="e.g., 150" step="10" min="0">
        </div>
      </div>
    </div>

    <!-- Installation -->
    <div style="margin-bottom:14px">
      <label style="font-size:.9em;font-weight:700;color:#007aff;display:block;margin-bottom:6px">Installation</label>
      <div class="form-grid">
        <div class="form-group">
          <label for="pricingV2_installOTC">One-Time Cost (OTC)</label>
          <input type="number" id="pricingV2_installOTC" placeholder="e.g., 10000" step="100" min="0">
        </div>
        <div class="form-group">
          <label for="pricingV2_installMonthly">Monthly Cost</label>
          <input type="number" id="pricingV2_installMonthly" placeholder="e.g., 0" step="10" min="0">
        </div>
      </div>
    </div>

    <!-- External Partner Management -->
    <div style="margin-bottom:14px">
      <label style="font-size:.9em;font-weight:700;color:#007aff;display:block;margin-bottom:6px">External Partner Management</label>
      <div class="form-grid">
        <div class="form-group">
          <label for="pricingV2_partnerOTC">One-Time Cost (OTC)</label>
          <input type="number" id="pricingV2_partnerOTC" placeholder="e.g., 3000" step="100" min="0">
        </div>
        <div class="form-group">
          <label for="pricingV2_partnerMonthly">Monthly Cost</label>
          <input type="number" id="pricingV2_partnerMonthly" placeholder="e.g., 500" step="10" min="0">
        </div>
      </div>
    </div>

    <!-- Other -->
    <div>
      <label style="font-size:.9em;font-weight:700;color:#007aff;display:block;margin-bottom:6px">Other</label>
      <div class="form-grid">
        <div class="form-group">
          <label for="pricingV2_otherOTC">One-Time Cost (OTC)</label>
          <input type="number" id="pricingV2_otherOTC" placeholder="e.g., 1000" step="100" min="0">
        </div>
        <div class="form-group">
          <label for="pricingV2_otherMonthly">Monthly Cost</label>
          <input type="number" id="pricingV2_otherMonthly" placeholder="e.g., 100" step="10" min="0">
        </div>
      </div>
    </div>
  </div>

  <!-- Section 4: Azure Services -->
  <div class="card">
    <h3>Azure Local Services Price</h3>
    <div class="form-grid">
      <div class="form-group">
        <label for="pricingV2_avdVCPUs">AVD vCPUs</label>
        <input type="number" id="pricingV2_avdVCPUs" placeholder="e.g., 32" step="1" min="0">
      </div>
      <div class="form-group">
        <label for="pricingV2_avdHours">AVD Usage Hours / Month</label>
        <input type="number" id="pricingV2_avdHours" value="280" min="1" max="730" step="1">
      </div>
      <p id="pricingV2_avdNote" class="warning form-group full" style="display:none;font-size:.82em;margin:0">Azure Virtual Desktop isn't available with disconnected operations (L3), so no AVD cost is included.</p>
      <div class="form-group">
        <label for="pricingV2_sqlVcores">SQL Managed Instance vCores</label>
        <input type="number" id="pricingV2_sqlVcores" placeholder="e.g., 4" step="1" min="0">
      </div>
      <div class="form-group">
        <label for="pricingV2_sqlHours">SQLmi Usage Hours / Month</label>
        <input type="number" id="pricingV2_sqlHours" value="730" min="1" max="730" step="1">
      </div>
      <div class="form-group">
        <label for="pricingV2_sqlTier">SQLmi Tier</label>
        <select id="pricingV2_sqlTier">
          <option value="General Purpose">General Purpose</option>
          <option value="Business Critical">Business Critical</option>
        </select>
      </div>
      <div class="form-group">
        <label for="pricingV2_sqlLicensing">SQLmi Licensing Model</label>
        <select id="pricingV2_sqlLicensing">
          <option value="License Included">License Included</option>
          <option value="Azure Hybrid Benefit">Azure Hybrid Benefit</option>
        </select>
      </div>
      <div class="form-group full">
        <label for="pricingV2_sqlTerm">Reservation Term</label>
        <select id="pricingV2_sqlTerm">
          <option value="PAYG">PAYG</option>
          <option value="1 Year RI">1 Year RI</option>
          <option value="3 Year RI">3 Year RI</option>
        </select>
      </div>
    </div>
  </div>

  <!-- Actions -->
  <div class="btn-row">
    <button class="btn btn-primary" id="pricingV2_calcBtn">Calculate Pricing</button>
    <button class="btn btn-secondary" id="pricingV2_exportPdfBtn" style="display:none">Export to PDF</button>
    <button class="btn btn-secondary" id="pricingV2_importOdinBtn">Import from ODIN</button>
    <input type="file" id="pricingV2_odinFile" accept=".json,application/json" style="display:none">
  </div>

  <!-- ODIN import summary -->
  <div id="pricingV2_importBox" class="result-box" style="display:none"></div>

  <!-- Results -->
  <div id="pricingV2_resultBox" class="result-box" style="display:none"></div>

  <!-- Charts -->
  <div id="pricingV2_chartsSection" style="display:none">
    <div class="charts-grid">
      <div class="chart-wrapper"><canvas id="pricingV2_costChart"></canvas></div>
    </div>
    <div class="charts-grid two-col">
      <div class="chart-wrapper"><canvas id="pricingV2_oneTimeBreakdownChart"></canvas></div>
      <div class="chart-wrapper"><canvas id="pricingV2_costBreakdownChart"></canvas></div>
    </div>
  </div>

  <!-- Overview -->
  <div id="pricingV2_overviewSection" class="card" style="display:none">
    <h3>Full Overview</h3>
    <table class="overview-table" id="pricingV2_overviewTable"></table>
  </div>

  <!-- Disclaimers -->
  <div class="disclaimer">
    <p>
      <strong>Disclaimer for Pricing Calculator:</strong><br>
      This <em>Pricing Calculator</em> is provided for informational purposes only and includes:
    </p>
    <ul>
      <li><strong>Infrastructure Price:</strong> Node and switch costs (one-time).</li>
      <li><strong>License Price:</strong> L1 host fee (10/core), L2 host fee for disaggregated or external storage (20.10/core), L2 OEM host fee (10/core), user-provided L3 host fee, Windows Server fee (23.30/core) or custom Windows pricing.</li>
      <li><strong>Related Costs:</strong> Additional one-time and monthly costs for external services (e.g., Backup, security software).</li>
      <li><strong>Service Price:</strong> Azure Virtual Desktop (AVD) and SQL Managed Instance (SQLmi) usage costs (monthly).</li>
    </ul>
    <p>Actual costs may vary depending on vendor quotes, hardware configurations, and licensing agreements.</p>
    <p>
      <strong>Azure Local Deployment Model Disclaimer:</strong><br>
      L1 applies to cloud-connected hyperconverged deployments without external storage. L2 applies to disaggregated deployments with SAN storage (up to 64 machines) and to hyperconverged deployments with external storage. Both use the 20.10/core/month host fee. An Azure Local OEM license with external storage uses the listed 10/core/month special rate. L3 applies to disconnected operations with a locally hosted control plane. Microsoft does not publish an L3 host fee, so the calculator requires a user-provided planning rate or account-specific quote. L3 is licensed per physical core on an annual capacity term, billed monthly, and includes the cores of the dedicated management cluster that runs the control plane, so the calculator adds the management cluster nodes and cores (3 nodes with 24 cores by default) and applies no trial to the L3 host fee. Azure Hybrid Benefit can't waive the L3 host fee, but it can still cover Windows Server VMs. Azure Local host fees and the Windows Server subscription have a free trial for the first 60 days after registration. See the
      <a href="https://azure.microsoft.com/en-us/pricing/details/azure-local/?wt.mc_id=MVP_579217#pricing" target="_blank">Azure Local pricing page</a>,
      <a href="https://learn.microsoft.com/en-us/azure/azure-local/overview/disaggregated-overview?view=azloc-2606&wt.mc_id=MVP_579217" target="_blank">disaggregated deployment overview</a> and
      <a href="https://learn.microsoft.com/en-us/azure/azure-local/manage/disconnected-operations-overview?view=azloc-2606&wt.mc_id=MVP_579217" target="_blank">disconnected operations overview</a>.
      Fixed Azure rates are treated as values in the selected calculator currency. Currency selection does not perform foreign exchange conversion.
    </p>
    <p>
      <strong>Hybrid Benefit Disclaimer:</strong><br>
      Azure Hybrid Benefit can waive the Azure Local host fee only for L1 cloud-connected hyperconverged deployments without external storage. It does not waive the L2 host fee, including disaggregated deployments with SAN storage, or the L3 host fee. Eligible customers can exchange Windows Server Datacenter core licenses with active Software Assurance through Enterprise Agreement or CSP to waive the L1 host fee and Windows Server subscription. Consult the
      <a href="https://www.microsoft.com/licensing/terms/productoffering/MicrosoftAzure/EAEAS" target="_blank">Microsoft Product Terms (EA/CSP)</a>,
      <a href="https://www.microsoft.com/licensing/terms/productoffering/WindowsServerStandardDatacenterEssentials/SS" target="_blank">Microsoft Product Terms for Windows Server</a>, and
      <a href="https://learn.microsoft.com/en-us/windows-server/get-started/azure-hybrid-benefit?tabs=azure-local&wt.mc_id=MVP_579217#getting-azure-hybrid-benefit" target="_blank">Azure Hybrid Benefit for Windows Server</a>
      for specifics. Product Terms override general documentation.
    </p>
    <p>
      <strong>Windows Server License Disclaimer:</strong><br>
      By default, a Windows Server guest fee of 23.30/core/month is applied unless waived or supplemented by custom pricing. Confirm eligibility and final costs with your licensing provider.
    </p>
    <p>
      <strong>Related Costs Disclaimer:</strong><br>
      The Related Licenses / Costs section is broken down into Backup, Logs/Monitoring, Installation, External Partner Management, and Other. Each category supports both one-time (OTC) and monthly costs. These values are illustrative; actual costs depend on vendor quotes and service agreements.
    </p>
    <p>
      <strong>AVD and SQLmi Disclaimer:</strong><br>
      AVD costs are estimated at 0.01 per vCPU per hour. AVD isn't among the services of disconnected operations, so it is excluded for L3. SQLmi pricing depends on tier, licensing model, and reservation term. These calculations are illustrative. For more info visit
      <a href="https://azure.microsoft.com/en-us/pricing/details/azure-arc/data-services/?wt.mc_id=MVP_579217" target="_blank">Azure Arc Data Services Pricing</a>.
      Always refer to official Microsoft documentation for up-to-date pricing.
    </p>
    <p>
      <strong>No Warranty:</strong><br>
      All information is provided "as is" with no warranties, express or implied. It does not represent official Microsoft documentation. Verify your specific agreements, product terms, and quotes for accurate pricing.
    </p>
  </div>
</div>

<script>
(function () {
  "use strict";

  const $ = id => document.getElementById(id);

  /* ---- currency ---- */
  const currencySymbols = { EUR: "\u20ac", USD: "$", GBP: "\u00a3", CHF: "CHF " };
  function sym() { return currencySymbols[$("pricingV2_currencySelect").value] || ""; }
  function fmt(n) { return sym() + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

  /* ---- deployment model ---- */
  const deploymentModels = {
    l1: { label: "L1: Hyperconverged without external storage", rate: 10 },
    "l2-disagg": { label: "L2: Disaggregated with SAN storage", rate: 20.10 },
    l2: { label: "L2: Hyperconverged with external storage", rate: 20.10 },
    "l2-oem": { label: "L2: OEM license with external storage", rate: 10 },
    l3: { label: "L3: Disconnected operations", rate: null }
  };

  function updateDeploymentFields() {
    const model = $("pricingV2_deploymentModel").value;
    const isL1 = model === "l1";
    const isL2 = model === "l2" || model === "l2-disagg" || model === "l2-oem";
    const hostWaiver = $("pricingV2_waiveHostFee");
    const nodes = $("pricingV2_nodes");

    $("pricingV2_l3RateContainer").style.display = model === "l3" ? "flex" : "none";
    for (const id of ["pricingV2_l3MgmtNodesGroup", "pricingV2_l3MgmtCoresGroup", "pricingV2_l3MgmtPriceGroup"]) {
      $(id).style.display = model === "l3" ? "flex" : "none";
    }
    /* AVD isn't a supported service of disconnected operations */
    $("pricingV2_avdVCPUs").disabled = $("pricingV2_avdHours").disabled = model === "l3";
    $("pricingV2_avdNote").style.display = model === "l3" ? "block" : "none";
    hostWaiver.disabled = !isL1;
    if (!isL1) hostWaiver.checked = false;
    const ahbNote = $("pricingV2_ahbNote");
    ahbNote.textContent = isL1 ? "" : "Azure Hybrid Benefit is not available for " + deploymentModels[model].label + ". The host fee always applies.";
    ahbNote.style.display = isL1 ? "none" : "block";

    nodes.max = isL2 ? "64" : "16";
    if (+nodes.value > +nodes.max) nodes.value = nodes.max;
  }

  /* ---- checkbox linking ---- */
  $("pricingV2_customLicenseChk").addEventListener("change", function () {
    $("pricingV2_waiveWindowsLicense").checked = this.checked;
    $("pricingV2_customLicenseContainer").style.display = this.checked ? "block" : "none";
  });
  $("pricingV2_waiveWindowsLicense").addEventListener("change", function () {
    if (!this.checked) {
      $("pricingV2_customLicenseChk").checked = false;
      $("pricingV2_customLicenseContainer").style.display = "none";
    }
  });
  $("pricingV2_deploymentModel").addEventListener("change", updateDeploymentFields);

  /* ---- SQL price lookup (per vCore / month) ---- */
  const sqlPrices = {
    "General Purpose": {
      "License Included":     { "PAYG": 116.73, "1 Year RI": 107.55, "3 Year RI": 88.52 },
      "Azure Hybrid Benefit": { "PAYG": 47.25,  "1 Year RI": 38.07,  "3 Year RI": 19.04 }
    },
    "Business Critical": {
      "License Included":     { "PAYG": 355.74, "1 Year RI": 336.70, "3 Year RI": 298.63 },
      "Azure Hybrid Benefit": { "PAYG": 95.19,  "1 Year RI": 76.15,  "3 Year RI": 38.07 }
    }
  };

  /* ---- chart instances ---- */
  let costChart = null, oneTimeBreakdownChart = null, costBreakdownChart = null;

  const num = el => +(el.value) || 0;
  updateDeploymentFields();

  /* ================================================================
     MAIN CALCULATION
     ================================================================ */
  function calculate() {
    const nodes      = num($("pricingV2_nodes"));
    const nodeUnit   = num($("pricingV2_pricePerNode"));
    const switches   = num($("pricingV2_switches"));
    const switchUnit = num($("pricingV2_pricePerSwitch"));
    const deploymentModel = $("pricingV2_deploymentModel").value;
    const deployment = deploymentModels[deploymentModel];
    /* L3: the dedicated ALDO management cluster is bought and billed as well */
    const isL3 = deploymentModel === "l3";
    const mgmtNodes     = isL3 ? Math.max(Math.round(num($("pricingV2_l3MgmtNodes"))), 0) : 0;
    const mgmtCoresNode = isL3 ? num($("pricingV2_l3MgmtCores")) : 0;
    const mgmtNodeUnit  = num($("pricingV2_l3MgmtNodePrice"));
    const mgmtCores     = mgmtNodes * mgmtCoresNode;
    const mgmtNodesCost = mgmtNodes * mgmtNodeUnit;

    const nodesCost  = nodes * nodeUnit + mgmtNodesCost;
    const switchCost = switches * switchUnit;
    const hwCost     = nodesCost + switchCost;

    const coresPerNode = num($("pricingV2_coresPerNode"));
    const totalCores   = nodes * coresPerNode;
    const billedCores  = totalCores + mgmtCores;
    const l3RateInput = $("pricingV2_l3HostRate");
    const hostRate = deploymentModel === "l3" ? num(l3RateInput) : deployment.rate;
    if (deploymentModel === "l3" && hostRate <= 0) {
      alert("Enter an L3 host fee per physical core per month before calculating.");
      l3RateInput.focus();
      return;
    }
    const hostFeeWaived = deploymentModel === "l1" && $("pricingV2_waiveHostFee").checked;
    const hostFee = hostFeeWaived ? 0 : billedCores * hostRate;

    let winMonthly = 0, winOneTime = 0;
    let winLicenseMode = "default";
    if ($("pricingV2_customLicenseChk").checked) {
      winLicenseMode = "custom";
      winMonthly = num($("pricingV2_customWinMonthly")) * nodes;
      winOneTime = num($("pricingV2_customWinOneTime"))  * nodes;
    } else if ($("pricingV2_waiveWindowsLicense").checked) {
      winLicenseMode = "waived";
    } else {
      winMonthly = totalCores * 23.30;
    }

    /* related costs (broken down) */
    const backupOTC    = num($("pricingV2_backupOTC"));
    const backupMonth  = num($("pricingV2_backupMonthly"));
    const logsOTC      = num($("pricingV2_logsOTC"));
    const logsMonth    = num($("pricingV2_logsMonthly"));
    const installOTC   = num($("pricingV2_installOTC"));
    const installMonth = num($("pricingV2_installMonthly"));
    const partnerOTC   = num($("pricingV2_partnerOTC"));
    const partnerMonth = num($("pricingV2_partnerMonthly"));
    const otherOTC     = num($("pricingV2_otherOTC"));
    const otherMonth   = num($("pricingV2_otherMonthly"));

    const thirdOneTime = backupOTC + logsOTC + installOTC + partnerOTC + otherOTC;
    const thirdMonthly = backupMonth + logsMonth + installMonth + partnerMonth + otherMonth;

    const avdVCPUs = isL3 ? 0 : num($("pricingV2_avdVCPUs"));
    const avdHours = isL3 ? 0 : num($("pricingV2_avdHours"));
    const avdCost  = avdVCPUs * 0.01 * avdHours;

    const sqlVcores = num($("pricingV2_sqlVcores"));
    const sqlHours  = num($("pricingV2_sqlHours"));
    const sqlTier   = $("pricingV2_sqlTier").value;
    const sqlLic    = $("pricingV2_sqlLicensing").value;
    const sqlTerm   = $("pricingV2_sqlTerm").value;
    const sqlMonthlyRate = sqlPrices[sqlTier][sqlLic][sqlTerm];
    const sqlHourlyRate  = sqlMonthlyRate / 730;
    const sqlCost        = sqlVcores * sqlHourlyRate * sqlHours;

    const oneTimeTotal = hwCost + winOneTime + thirdOneTime;
    const monthlyTotal = hostFee + winMonthly + thirdMonthly + avdCost + sqlCost;
    const trialApplied = $("pricingV2_applyTrial").checked;
    /* disconnected operations are billed on an annual capacity term, so the trial covers no L3 host fee */
    const trialEligibleMonthly = (isL3 ? 0 : hostFee) + (winLicenseMode === "default" ? winMonthly : 0);
    const trialSavings = trialApplied ? trialEligibleMonthly * 2 : 0;
    const yearlyTotal  = oneTimeTotal + monthlyTotal * 12 - trialSavings;
    const threeYearTotal = oneTimeTotal + monthlyTotal * 36 - trialSavings;

    /* ---- quick result ---- */
    const rb = $("pricingV2_resultBox");
    rb.style.display = "block";
    rb.innerHTML =
      "<strong>Total One-Time Cost:</strong> " + fmt(oneTimeTotal) + "<br>" +
      "<strong>Recurring Monthly Cost After Trial:</strong> " + fmt(monthlyTotal) + "<br>" +
      "<strong>Estimated 1-Year Total:</strong> " + fmt(yearlyTotal) + "<br>" +
      "<strong>Estimated 3-Year Total:</strong> " + fmt(threeYearTotal);

    /* ---- charts ---- */
    $("pricingV2_chartsSection").style.display = "block";
    drawTotalChart(oneTimeTotal, monthlyTotal, yearlyTotal);
    drawOneTimeChart(nodesCost, switchCost, winOneTime, thirdOneTime);
    drawMonthlyChart(hostFee, winMonthly, avdCost, sqlCost, thirdMonthly);

    /* ---- overview ---- */
    buildOverview({
      nodes, nodeUnit, nodesCost,
      switches, switchUnit, switchCost, hwCost,
      coresPerNode, totalCores, billedCores,
      mgmtNodes, mgmtCoresNode, mgmtCores, mgmtNodeUnit, mgmtNodesCost,
      deploymentModel, deploymentLabel: deployment.label, hostRate,
      hostFeeWaived, hostFee,
      winLicenseMode,
      winMonthly, winOneTime,
      backupOTC, backupMonth, logsOTC, logsMonth,
      installOTC, installMonth, partnerOTC, partnerMonth,
      otherOTC, otherMonth, thirdOneTime, thirdMonthly,
      avdVCPUs, avdHours, avdCost,
      sqlVcores, sqlHours, sqlTier, sqlLic, sqlTerm, sqlMonthlyRate, sqlHourlyRate, sqlCost,
      trialApplied, trialEligibleMonthly, trialSavings,
      oneTimeTotal, monthlyTotal, yearlyTotal, threeYearTotal
    });

    $("pricingV2_exportPdfBtn").style.display = "inline-block";
  }

  /* ================================================================
     OVERVIEW TABLE
     ================================================================ */
  function buildOverview(d) {
    $("pricingV2_overviewSection").style.display = "block";
    const c = sym();
    const rows = [];

    function sec(title) { rows.push('<tr class="section-header"><td colspan="3">' + title + "</td></tr>"); }
    function row(label, formula, value) {
      rows.push("<tr><td>" + label + '</td><td class="formula">' + formula + "</td><td>" + value + "</td></tr>");
    }
    function total(label, value) {
      rows.push('<tr class="total-row"><td colspan="2">' + label + "</td><td>" + value + "</td></tr>");
    }

    rows.push("<thead><tr><th>Item</th><th>Calculation</th><th>Amount</th></tr></thead><tbody>");

    sec("Infrastructure (One-Time)");
    row("Nodes Cost", d.nodes + " nodes x " + fmt(d.nodeUnit) + "/node", fmt(d.nodesCost - d.mgmtNodesCost));
    if (d.mgmtNodes > 0) row("ALDO Management Cluster Nodes", d.mgmtNodes + " nodes x " + fmt(d.mgmtNodeUnit) + "/node", fmt(d.mgmtNodesCost));
    row("Switches Cost", d.switches + " switches x " + fmt(d.switchUnit) + "/switch", fmt(d.switchCost));
    total("Total Hardware", fmt(d.hwCost));

    sec("Licensing");
    row("Azure Local Deployment Model", d.deploymentLabel, d.deploymentModel.toUpperCase());
    row("Total Physical Cores", d.nodes + " nodes x " + d.coresPerNode + " cores/node", d.totalCores + " cores");
    if (d.mgmtCores > 0) {
      row("ALDO Management Cluster Cores", d.mgmtNodes + " nodes x " + d.mgmtCoresNode + " cores/node (control plane)", d.mgmtCores + " cores");
      row("Billed Physical Cores", d.totalCores + " workload + " + d.mgmtCores + " management", d.billedCores + " cores");
    }
    row("Azure Local Host Rate", d.deploymentModel === "l3" ? "User-provided rate" : "Published rate", fmt(d.hostRate) + "/core/month");
    row("Azure Local Host Fee (monthly)", d.hostFeeWaived ? "Waived through Azure Hybrid Benefit" : d.billedCores + " cores x " + fmt(d.hostRate) + "/core" + (d.deploymentModel === "l1" ? "" : " (no Azure Hybrid Benefit)"), fmt(d.hostFee));

    if (d.winLicenseMode === "custom") {
      row("Windows License (monthly)", "Custom: " + fmt(d.winMonthly / d.nodes) + "/node x " + d.nodes + " nodes", fmt(d.winMonthly));
      row("Windows License (one-time)", "Custom: " + fmt(d.winOneTime / d.nodes) + "/node x " + d.nodes + " nodes", fmt(d.winOneTime));
    } else if (d.winLicenseMode === "waived") {
      row("Windows License (monthly)", "Waived", fmt(0));
    } else {
      row("Windows License (monthly)", d.totalCores + " cores x " + c + "23.30/core", fmt(d.winMonthly));
    }

    row("Free 60-Day Trial", !d.trialApplied ? "Not applied" : d.deploymentModel === "l3" ? "Windows subscription only (L3 is billed on an annual capacity term)" : "Applied to eligible host and Windows subscription fees", d.trialSavings > 0 ? "-" + fmt(d.trialSavings) : fmt(0));

    sec("Related / Third-Party");
    if (d.backupOTC || d.backupMonth)   { row("Backup (OTC)", "User-defined", fmt(d.backupOTC));   row("Backup (monthly)", "User-defined", fmt(d.backupMonth)); }
    if (d.logsOTC || d.logsMonth)       { row("Logs / Monitoring (OTC)", "User-defined", fmt(d.logsOTC));     row("Logs / Monitoring (monthly)", "User-defined", fmt(d.logsMonth)); }
    if (d.installOTC || d.installMonth) { row("Installation (OTC)", "User-defined", fmt(d.installOTC)); row("Installation (monthly)", "User-defined", fmt(d.installMonth)); }
    if (d.partnerOTC || d.partnerMonth) { row("External Partner Mgmt (OTC)", "User-defined", fmt(d.partnerOTC)); row("External Partner Mgmt (monthly)", "User-defined", fmt(d.partnerMonth)); }
    if (d.otherOTC || d.otherMonth)     { row("Other (OTC)", "User-defined", fmt(d.otherOTC));     row("Other (monthly)", "User-defined", fmt(d.otherMonth)); }
    total("Related Total (OTC)", fmt(d.thirdOneTime));
    total("Related Total (monthly)", fmt(d.thirdMonthly));

    sec("Azure Services (Monthly)");
    row("AVD Cost", d.deploymentModel === "l3" ? "Not available with disconnected operations" : d.avdVCPUs + " vCPUs x " + c + "0.01/vCPU/hr x " + d.avdHours + " hrs", fmt(d.avdCost));
    row("SQLmi Rate", d.sqlTier + " / " + d.sqlLic + " / " + d.sqlTerm, fmt(d.sqlMonthlyRate) + "/vCore/month");
    row("SQLmi Cost", d.sqlVcores + " vCores x " + c + d.sqlHourlyRate.toFixed(4) + "/hr x " + d.sqlHours + " hrs", fmt(d.sqlCost));

    sec("Totals");
    total("Total One-Time Cost", fmt(d.oneTimeTotal));
    total("Recurring Monthly Cost After Trial", fmt(d.monthlyTotal));
    total("Estimated 1-Year Total", fmt(d.yearlyTotal));
    total("Estimated 3-Year Total", fmt(d.threeYearTotal));

    rows.push("</tbody>");
    $("pricingV2_overviewTable").innerHTML = rows.join("");
  }

  /* ================================================================
     3D CHARTS
     Self-contained canvas renderer (no external libraries) for 3D donut
     and 3D bar charts: hover and keyboard tooltips, clickable legend,
     drag to rotate and double-click to reset the view.
     The same block is used in all three V2 calculators.
     ================================================================ */
  var C3D = {
    font: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
    surface: "#ffffff", ink: "#1f1f1e", ink2: "#52514e", muted: "#8a8984",
    grid: "#e6e5e1", floor: "#f3f2ef", critical: "#d03b3b"
  };
  /* Validated categorical slots (light mode, white surface) */
  var C3D_COLORS = {
    blue: "#2a78d6", orange: "#eb6834", aqua: "#1baf7a", yellow: "#eda100",
    magenta: "#e87ba4", green: "#008300", violet: "#4a3aa7"
  };

  /* f < 1 darkens, f > 1 mixes towards white */
  function c3dMix(hex, f) {
    var n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255];
    for (var i = 0; i < 3; i++) c[i] = Math.round(f <= 1 ? c[i] * f : c[i] + (255 - c[i]) * (f - 1));
    return "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")";
  }

  function c3dCompact(v) {
    var a = Math.abs(v);
    if (a >= 1e6) return +(v / 1e6).toFixed(a >= 1e7 ? 0 : 1) + "M";
    if (a >= 1e3) return +(v / 1e3).toFixed(a >= 1e4 ? 0 : 1) + "k";
    return String(+v.toFixed(a < 10 ? 2 : 0));
  }

  function c3dNiceScale(max, count) {
    if (!(max > 0)) return { max: 1, step: 0.25 };
    var raw = max / count, mag = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10)), n = raw / mag;
    var step = (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * mag;
    return { max: Math.ceil(max / step - 1e-9) * step, step: step };
  }

  function c3dInPoly(x, y, p) {
    var inside = false;
    for (var i = 0, j = p.length - 1; i < p.length; j = i++) {
      if ((p[i][1] > y) !== (p[j][1] > y) &&
          x < (p[j][0] - p[i][0]) * (y - p[i][1]) / (p[j][1] - p[i][1]) + p[i][0]) inside = !inside;
    }
    return inside;
  }

  function c3dPoly(ctx, p, fill, stroke, width) {
    ctx.beginPath();
    ctx.moveTo(p[0][0], p[0][1]);
    for (var i = 1; i < p.length; i++) ctx.lineTo(p[i][0], p[i][1]);
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width || 1; ctx.lineJoin = "round"; ctx.stroke(); }
  }

  function c3dRoundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function c3dFit(ctx, text, max) {
    text = String(text);
    if (ctx.measureText(text).width <= max) return text;
    while (text.length > 1 && ctx.measureText(text + "…").width > max) text = text.slice(0, -1);
    return text + "…";
  }

  /* cfg.type "donut": { title, slices: [{label, value, color}], format(v), center(total) -> {value, label, critical} }
     cfg.type "bar":   { title, categories: [], series: [{label, color, data: []}], horizontal, legend,
                         format(v), axisFormat(v) }  Bars are always stacked per category. */
  function Chart3D(canvas, cfg) {
    var self = this;
    this.canvas = canvas;
    this.cfg = cfg;
    this.ctx = canvas.getContext("2d");
    this.hidden = {};
    this.hover = null;
    this.focus = null;
    this.pointer = null;
    this.drag = null;
    this.marks = [];
    this.order = [];
    this.legendBoxes = [];
    this.view = this.defaultView();
    this.reduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    this.progress = this.reduced ? 1 : 0;
    canvas.tabIndex = 0;
    canvas.setAttribute("role", "img");
    canvas.style.touchAction = "pan-y";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.outlineOffset = "2px";
    this.on = {
      move: function(e) { self.onMove(e); },
      leave: function() { self.onLeave(); },
      down: function(e) { self.onDown(e); },
      up: function(e) { self.onUp(e); },
      dbl: function() { self.view = self.defaultView(); self.draw(); },
      key: function(e) { self.onKey(e); },
      blur: function() { self.focus = null; self.draw(); },
      resize: function() { self.resize(); }
    };
    canvas.addEventListener("pointermove", this.on.move);
    canvas.addEventListener("pointerleave", this.on.leave);
    canvas.addEventListener("pointerdown", this.on.down);
    window.addEventListener("pointerup", this.on.up);
    canvas.addEventListener("dblclick", this.on.dbl);
    canvas.addEventListener("keydown", this.on.key);
    canvas.addEventListener("blur", this.on.blur);
    window.addEventListener("resize", this.on.resize);
    if (window.ResizeObserver && canvas.parentNode) {
      this.observer = new ResizeObserver(this.on.resize);
      this.observer.observe(canvas.parentNode);
    }
    /* the print stylesheet changes the chart height: redraw at print size */
    this.print = window.matchMedia ? window.matchMedia("print") : null;
    if (this.print) {
      if (this.print.addEventListener) this.print.addEventListener("change", this.on.resize);
      else if (this.print.addListener) this.print.addListener(this.on.resize);
    }
    this.resize();
    if (!this.reduced) this.animate();
  }

  Chart3D.prototype.defaultView = function() {
    return this.cfg.type === "donut" ? { rot: -Math.PI / 2, tilt: 0.95 } : { angle: 0.75, depth: 1 };
  };

  Chart3D.prototype.destroy = function() {
    var c = this.canvas;
    c.removeEventListener("pointermove", this.on.move);
    c.removeEventListener("pointerleave", this.on.leave);
    c.removeEventListener("pointerdown", this.on.down);
    window.removeEventListener("pointerup", this.on.up);
    c.removeEventListener("dblclick", this.on.dbl);
    c.removeEventListener("keydown", this.on.key);
    c.removeEventListener("blur", this.on.blur);
    window.removeEventListener("resize", this.on.resize);
    if (this.observer) this.observer.disconnect();
    if (this.print) {
      if (this.print.removeEventListener) this.print.removeEventListener("change", this.on.resize);
      else if (this.print.removeListener) this.print.removeListener(this.on.resize);
    }
    if (this.raf) cancelAnimationFrame(this.raf);
    clearTimeout(this.fallback);
    c.style.cursor = "";
  };

  Chart3D.prototype.resize = function() {
    var box = this.canvas.parentNode, dpr = window.devicePixelRatio || 1;
    var w = box ? box.clientWidth : this.canvas.clientWidth, h = box ? box.clientHeight : this.canvas.clientHeight;
    if (!w || !h || (w === this.w && h === this.h && dpr === this.dpr)) return;
    this.w = w; this.h = h; this.dpr = dpr;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.draw();
  };

  Chart3D.prototype.animate = function() {
    var self = this, start = null;
    function step(t) {
      if (start === null) start = t;
      var k = Math.min((t - start) / 700, 1);
      self.progress = 1 - Math.pow(1 - k, 3);
      self.draw();
      self.raf = k < 1 ? requestAnimationFrame(step) : null;
    }
    this.raf = requestAnimationFrame(step);
    /* Background tabs pause animation frames; never leave a chart half drawn */
    this.fallback = setTimeout(function() {
      if (self.progress < 1) { if (self.raf) cancelAnimationFrame(self.raf); self.raf = null; self.progress = 1; self.draw(); }
    }, 1500);
  };

  Chart3D.prototype.items = function() {
    var cfg = this.cfg;
    return cfg.type === "donut" ? cfg.slices : cfg.series;
  };

  Chart3D.prototype.activeKey = function() {
    return this.drag && this.drag.moved ? null : (this.focus !== null ? this.focus : this.hover);
  };

  /* ---------------- frame ---------------- */
  Chart3D.prototype.draw = function() {
    if (!this.w) return;
    var ctx = this.ctx, cfg = this.cfg;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.fillStyle = C3D.surface;
    ctx.fillRect(0, 0, this.w, this.h);
    this.marks = [];
    this.order = [];

    ctx.font = "600 14px " + C3D.font;
    ctx.fillStyle = C3D.ink;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(c3dFit(ctx, cfg.title, this.w - 24), this.w / 2, 12);

    var legendH = this.layoutLegend();
    var area = { x: 12, y: 38, w: this.w - 24, h: this.h - 38 - legendH - 8 };
    this.area = area;
    if (cfg.type === "donut") this.drawDonut(area); else this.drawBars(area);
    this.drawLegend();
    this.drawHint();
    this.drawTooltip();
    this.updateAria();
  };

  Chart3D.prototype.empty = function(a, text) {
    var ctx = this.ctx;
    ctx.font = "13px " + C3D.font;
    ctx.fillStyle = C3D.muted;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, a.x + a.w / 2, a.y + a.h / 2);
  };

  /* ---------------- legend ---------------- */
  Chart3D.prototype.legendText = function(item) {
    return this.cfg.type === "donut" ? item.label + "  " + this.cfg.format(item.value) : item.label;
  };

  Chart3D.prototype.layoutLegend = function() {
    var ctx = this.ctx, self = this, items = this.items(), maxW = this.w - 24, rows = [[]], rowW = [0];
    this.legendBoxes = [];
    if (this.cfg.legend === false) return 0;
    ctx.font = "12px " + C3D.font;
    items.forEach(function(it, i) {
      if (self.cfg.type === "donut" && !(it.value > 0)) return;
      var text = c3dFit(ctx, self.legendText(it), maxW - 20), w = 16 + ctx.measureText(text).width;
      var r = rows.length - 1;
      if (rows[r].length && rowW[r] + 14 + w > maxW) { rows.push([]); rowW.push(0); r++; }
      rowW[r] += (rows[r].length ? 14 : 0) + w;
      rows[r].push({ i: i, text: text, w: w });
    });
    var y = this.h - 8 - rows.length * 20;
    rows.forEach(function(row, r) {
      var x = (self.w - rowW[r]) / 2;
      row.forEach(function(b) {
        self.legendBoxes.push({ i: b.i, text: b.text, x: x, y: y + r * 20, w: b.w, h: 20 });
        x += b.w + 14;
      });
    });
    return rows.length * 20 + 4;
  };

  Chart3D.prototype.drawLegend = function() {
    var ctx = this.ctx, self = this, items = this.items(), act = this.activeKey();
    ctx.font = "12px " + C3D.font;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    this.legendBoxes.forEach(function(b) {
      var it = items[b.i], off = self.hidden[b.i], cy = b.y + b.h / 2;
      var emph = act !== null && self.keyItem(act) === b.i;
      c3dRoundRect(ctx, b.x, cy - 5, 10, 10, 2);
      if (off) { ctx.strokeStyle = it.color; ctx.lineWidth = 1.5; ctx.stroke(); }
      else { ctx.fillStyle = it.color; ctx.fill(); }
      ctx.fillStyle = off ? C3D.muted : (emph ? C3D.ink : C3D.ink2);
      ctx.fillText(b.text, b.x + 16, cy);
      if (off) {
        ctx.fillRect(b.x + 16, cy, ctx.measureText(b.text).width, 1);
      }
    });
  };

  Chart3D.prototype.drawHint = function() {
    if (!this.pointer || this.activeKey() !== null || this.drag) return;
    var ctx = this.ctx, a = this.area;
    ctx.font = "10px " + C3D.font;
    ctx.fillStyle = C3D.muted;
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillText("Drag to rotate, double-click to reset", a.x + a.w, a.y + a.h + 6);
  };

  /* ---------------- donut ---------------- */
  Chart3D.prototype.drawDonut = function(a) {
    var cfg = this.cfg, ctx = this.ctx, self = this, v = this.view;
    var sinP = Math.sin(v.tilt), cosP = Math.cos(v.tilt), THICK = 0.24, INNER = 0.56;
    var R = Math.max(10, Math.min(a.w * 0.4, a.h * 0.9 / (2 * sinP + THICK * cosP)));
    var wall = THICK * R * cosP, r0 = R * INNER;
    var cx = a.x + a.w / 2, cy = a.y + (a.h - (2 * R * sinP + wall)) / 2 + R * sinP;
    var total = 0, pieces = [];
    cfg.slices.forEach(function(s, i) { if (!self.hidden[i] && s.value > 0) total += s.value; });

    /* soft ground shadow shaped as a ring, so the hole stays clean for the center label */
    ctx.save();
    ctx.translate(cx, cy + wall + 6);
    ctx.scale(1, Math.max(sinP, 0.2));
    var g = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 1.12);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(INNER * 0.85 / 1.12, "rgba(0,0,0,0)");
    g.addColorStop(0.82, "rgba(0,0,0,0.13)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, R * 1.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (!(total > 0)) { this.empty(a, "No values to display"); return; }

    var sweep = Math.PI * 2 * this.progress, start = v.rot, act = this.activeKey(), full = Math.PI * 2;
    cfg.slices.forEach(function(s, i) {
      if (self.hidden[i] || !(s.value > 0)) return;
      var span = s.value / total * sweep;
      pieces.push({ i: i, a0: start, a1: start + span });
      self.order.push("s" + i);
      start += span;
    });

    /* parts of [a0, a1] where sin() has the wanted sign: outer walls face the viewer in the
       front half (0..PI), inner walls in the back half (PI..2PI) */
    function visible(a0, a1, lo) {
      var out = [], k = Math.floor((a0 - lo - Math.PI) / full);
      for (; lo + k * full < a1; k++) {
        var s = Math.max(a0, lo + k * full), e = Math.min(a1, lo + Math.PI + k * full);
        if (e > s + 1e-4) out.push([s, e]);
      }
      return out;
    }

    function build(pc, lifted) {
      var mid = (pc.a0 + pc.a1) / 2, d = lifted ? R * 0.07 : 0, span = pc.a1 - pc.a0;
      var ox = Math.cos(mid) * d, oy = Math.sin(mid) * d * sinP - (lifted ? 4 : 0);
      var color = cfg.slices[pc.i].color, b = { color: color, cuts: [], inner: [], outer: [], top: [] };
      function P(ang, r, z) { return [cx + ox + r * Math.cos(ang), cy + oy + r * Math.sin(ang) * sinP + (1 - z) * wall]; }
      function arc(s, e, r, z, list, back) {
        var n = Math.max(2, Math.ceil((e - s) / (Math.PI / 90)));
        for (var j = 0; j <= n; j++) list.push(P(back ? e - (e - s) * j / n : s + (e - s) * j / n, r, z));
      }
      function wallPoly(s, e, r) { var p = []; arc(s, e, r, 1, p, false); arc(s, e, r, 0, p, true); return p; }
      if (pieces.length > 1 || span < full - 1e-6) {
        [pc.a0, pc.a1].forEach(function(ang) {
          b.cuts.push({ depth: Math.sin(ang), poly: [P(ang, r0, 1), P(ang, R, 1), P(ang, R, 0), P(ang, r0, 0)] });
        });
      }
      visible(pc.a0, pc.a1, Math.PI).forEach(function(iv) { b.inner.push(wallPoly(iv[0], iv[1], r0)); });
      visible(pc.a0, pc.a1, 0).forEach(function(iv) { b.outer.push(wallPoly(iv[0], iv[1], R)); });
      arc(pc.a0, pc.a1, R, 1, b.top, false);
      arc(pc.a0, pc.a1, r0, 1, b.top, true);
      /* one light from the front left: walls get a smooth horizontal gradient instead of facets */
      b.outerFill = ctx.createLinearGradient(cx - R, 0, cx + R, 0);
      b.outerFill.addColorStop(0, c3dMix(color, 0.9));
      b.outerFill.addColorStop(1, c3dMix(color, 0.6));
      b.innerFill = ctx.createLinearGradient(cx - r0, 0, cx + r0, 0);
      b.innerFill.addColorStop(0, c3dMix(color, 0.55));
      b.innerFill.addColorStop(1, c3dMix(color, 0.78));
      b.cutFill = c3dMix(color, 0.72);
      return b;
    }

    /* painter's order: cut faces (far first), inner back walls, outer front walls, tops */
    function paint(list) {
      var cuts = [];
      list.forEach(function(b) { b.cuts.forEach(function(c) { cuts.push({ c: c, b: b }); }); });
      cuts.sort(function(x, y) { return x.c.depth - y.c.depth; });
      cuts.forEach(function(x) { c3dPoly(ctx, x.c.poly, x.b.cutFill, x.b.cutFill, 0.5); });
      list.forEach(function(b) { b.inner.forEach(function(p) { c3dPoly(ctx, p, b.innerFill, null); }); });
      list.forEach(function(b) { b.outer.forEach(function(p) { c3dPoly(ctx, p, b.outerFill, null); }); });
      list.forEach(function(b) {
        c3dPoly(ctx, b.top, b.hot ? c3dMix(b.color, 1.14) : b.color, C3D.surface, 1.5);
        self.marks.push({ key: b.key, polys: [b.top].concat(b.outer, b.inner), cx: b.cx, cy: b.cy });
      });
    }

    var rest = [], hot = [];
    pieces.forEach(function(pc) {
      var key = "s" + pc.i, b = build(pc, key === act), mid = (pc.a0 + pc.a1) / 2;
      b.key = key;
      b.hot = key === act;
      b.cx = cx + Math.cos(mid) * (R + r0) / 2;
      b.cy = cy + Math.sin(mid) * (R + r0) / 2 * sinP;
      (b.hot ? hot : rest).push(b);
    });
    paint(rest);
    paint(hot);

    var c = cfg.center ? cfg.center(total) : null, room = 2 * r0 * sinP - wall, maxW = r0 * 1.6;
    if (c && room > 30 && r0 > 46) {
      var ty = cy + wall / 2, size = room > 54 ? 16 : 13;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      do { ctx.font = "600 " + size + "px " + C3D.font; } while (ctx.measureText(c.value).width > maxW && --size > 10);
      ctx.fillStyle = c.critical ? C3D.critical : C3D.ink;
      ctx.fillText(c3dFit(ctx, c.value, maxW), cx, ty - 8);
      ctx.font = "11px " + C3D.font;
      ctx.fillStyle = C3D.ink2;
      ctx.fillText(c3dFit(ctx, c.label, maxW), cx, ty + 9);
    }
  };

  /* ---------------- bars ---------------- */
  function c3dBox(ctx, x, y, w, h, dx, dy, color, hot) {
    var front = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
    var top = [[x, y], [x + w, y], [x + w + dx, y + dy], [x + dx, y + dy]];
    var side = [[x + w, y], [x + w + dx, y + dy], [x + w + dx, y + h + dy], [x + w, y + h]];
    var base = hot ? 1.12 : 1;
    c3dPoly(ctx, side, c3dMix(color, 0.7 * base), C3D.surface, 1);
    c3dPoly(ctx, top, c3dMix(color, 1.2 * base), C3D.surface, 1);
    c3dPoly(ctx, front, hot ? c3dMix(color, base) : color, C3D.surface, 1);
    return [front, top, side];
  }

  Chart3D.prototype.drawBars = function(a) {
    var cfg = this.cfg, ctx = this.ctx, self = this, horiz = !!cfg.horizontal, K = cfg.categories.length;
    var vis = [], totals = [], max = 0, act = this.activeKey(), p = this.progress;
    var fmtAxis = cfg.axisFormat || c3dCompact;
    cfg.series.forEach(function(s, i) { if (!self.hidden[i]) vis.push(i); });
    for (var k = 0; k < K; k++) {
      var t = 0;
      vis.forEach(function(i) { t += Math.max(cfg.series[i].data[k] || 0, 0); });
      totals.push(t);
      max = Math.max(max, t);
    }
    if (!K || !(max > 0)) { this.empty(a, "No values to display"); return; }
    var scale = c3dNiceScale(max, 4), ticks = [];
    for (var tv = 0; tv <= scale.max + scale.step / 2; tv += scale.step) ticks.push(tv);

    ctx.font = "11px " + C3D.font;
    var x0, x1, yt, yb, band, thick, d, dx, dy;
    if (!horiz) {
      var tickW = 0;
      ticks.forEach(function(t) { tickW = Math.max(tickW, ctx.measureText(fmtAxis(t)).width); });
      x0 = a.x + tickW + 8;
      band = (a.w - tickW - 8) / K;
      d = Math.min(16, band * 0.3) * this.view.depth;
      dx = d * Math.cos(this.view.angle); dy = -d * Math.sin(this.view.angle);
      x1 = a.x + a.w - dx - 4;
      yt = a.y + 16 - dy;
      yb = a.y + a.h - 20;
      band = (x1 - x0) / K;
      thick = Math.min(band * 0.58, 56);
    } else {
      var labW = 0;
      cfg.categories.forEach(function(c) { labW = Math.max(labW, ctx.measureText(c).width); });
      labW = Math.min(labW, a.w * 0.36);
      x0 = a.x + labW + 8;
      yt = a.y + 4;
      yb = a.y + a.h - 18;
      band = (yb - yt) / K;
      d = Math.min(14, band * 0.4) * this.view.depth;
      dx = d * Math.cos(this.view.angle); dy = -d * Math.sin(this.view.angle);
      yt -= dy;
      band = (yb - yt) / K;
      x1 = a.x + a.w - dx - 46;
      thick = Math.min(band * 0.62, 30);
    }
    function pos(v) { return horiz ? x0 + v / scale.max * (x1 - x0) : yb - v / scale.max * (yb - yt); }

    /* floor, back wall grid and value axis */
    ctx.textBaseline = "middle";
    if (!horiz) {
      c3dPoly(ctx, [[x0, yb], [x1, yb], [x1 + dx, yb + dy], [x0 + dx, yb + dy]], C3D.floor, null);
      ticks.forEach(function(t) {
        var y = pos(t);
        ctx.beginPath();
        ctx.moveTo(x0, y); ctx.lineTo(x0 + dx, y + dy); ctx.lineTo(x1 + dx, y + dy);
        ctx.strokeStyle = C3D.grid; ctx.lineWidth = 1; ctx.stroke();
        ctx.fillStyle = C3D.muted; ctx.textAlign = "right";
        ctx.fillText(fmtAxis(t), x0 - 6, y);
      });
    } else {
      c3dPoly(ctx, [[x0, yt], [x0, yb], [x0 + dx, yb + dy], [x0 + dx, yt + dy]], C3D.floor, null);
      ticks.forEach(function(t) {
        var x = pos(t);
        ctx.beginPath();
        ctx.moveTo(x, yb); ctx.lineTo(x + dx, yb + dy); ctx.lineTo(x + dx, yt + dy);
        ctx.strokeStyle = C3D.grid; ctx.lineWidth = 1; ctx.stroke();
        ctx.fillStyle = C3D.muted; ctx.textAlign = "center"; ctx.textBaseline = "top";
        ctx.fillText(fmtAxis(t), x, yb + 5);
      });
    }

    /* boxes: vertical left to right, horizontal bottom row first, so nearer faces paint last */
    var dim = act !== null;
    for (var n = 0; n < K; n++) {
      k = horiz ? K - 1 - n : n;
      var base = 0, cat = cfg.categories[k];
      var start = horiz ? yt + band * k + (band - thick) / 2 : x0 + band * k + (band - thick) / 2;
      vis.forEach(function(i) {
        var val = Math.max(cfg.series[i].data[k] || 0, 0);
        if (!(val > 0)) return;
        var key = i + ":" + k, hot = key === act, polys, v0 = pos(base * p), v1 = pos((base + val) * p);
        ctx.globalAlpha = dim && !hot ? 0.55 : 1;
        polys = horiz ? c3dBox(ctx, v0, start, v1 - v0, thick, dx, dy, cfg.series[i].color, hot)
                      : c3dBox(ctx, start, v1, thick, v0 - v1, dx, dy, cfg.series[i].color, hot);
        ctx.globalAlpha = 1;
        self.marks.push({ key: key, polys: polys,
                          cx: horiz ? (v0 + v1) / 2 : start + thick / 2, cy: horiz ? start + thick / 2 : (v0 + v1) / 2 });
        base += val;
      });
      /* selective direct label: the stack total at the end of each bar */
      ctx.fillStyle = C3D.ink2;
      ctx.font = "11px " + C3D.font;
      if (totals[k] > 0 && p === 1) {
        if (!horiz && band >= 40) {
          ctx.textAlign = "center"; ctx.textBaseline = "bottom";
          ctx.fillText(c3dFit(ctx, cfg.format(totals[k]), band + 8), start + thick / 2 + dx / 2, pos(totals[k]) + dy - 3);
        } else if (horiz && band >= 13) {
          ctx.textAlign = "left"; ctx.textBaseline = "middle";
          ctx.fillText(cfg.format(totals[k]), pos(totals[k]) + dx + 5, start + thick / 2 + dy / 2);
        }
      }
      /* category labels */
      ctx.fillStyle = C3D.ink2;
      if (!horiz) {
        var every = Math.ceil(34 / band);
        if (k % every === 0) {
          ctx.textAlign = "center"; ctx.textBaseline = "top";
          ctx.fillText(c3dFit(ctx, cat, band * every - 4), start + thick / 2, yb + 6);
        }
      } else if (band >= 11) {
        ctx.textAlign = "right"; ctx.textBaseline = "middle";
        ctx.fillText(c3dFit(ctx, cat, x0 - a.x - 8), x0 - 6, start + thick / 2);
      }
    }
    for (k = 0; k < K; k++) vis.forEach(function(i) { if ((cfg.series[i].data[k] || 0) > 0) self.order.push(i + ":" + k); });
  };

  /* ---------------- tooltip ---------------- */
  Chart3D.prototype.keyItem = function(key) {
    return key === null ? null : (key.charAt(0) === "s" ? +key.slice(1) : +key.split(":")[0]);
  };

  Chart3D.prototype.drawTooltip = function() {
    var key = this.activeKey(), cfg = this.cfg, ctx = this.ctx, self = this;
    if (key === null) return;
    var mark = this.marks.filter(function(m) { return m.key === key; })[0];
    if (!mark) return;
    var title = null, rows = [];
    if (cfg.type === "donut") {
      var total = 0, s = cfg.slices[this.keyItem(key)];
      cfg.slices.forEach(function(x, i) { if (!self.hidden[i] && x.value > 0) total += x.value; });
      rows.push({ color: s.color, value: cfg.format(s.value), label: s.label + " (" + (s.value / total * 100).toFixed(1) + "%)", on: true });
    } else {
      var k = +key.split(":")[1], si = this.keyItem(key), sum = 0, count = 0;
      title = cfg.categories[k];
      cfg.series.forEach(function(x, i) {
        var val = x.data[k] || 0;
        if (self.hidden[i] || !(val > 0)) return;
        rows.push({ color: x.color, value: cfg.format(val), label: x.label, on: i === si });
        sum += val; count++;
      });
      if (count > 1) rows.push({ color: null, value: cfg.format(sum), label: "Total", on: false });
    }
    var w = 0, lineH = 18, pad = 10;
    rows.forEach(function(r) {
      ctx.font = "600 12px " + C3D.font;
      r.vw = ctx.measureText(r.value).width;
      ctx.font = (r.on ? "600 " : "") + "12px " + C3D.font;
      w = Math.max(w, 18 + r.vw + 6 + ctx.measureText(r.label).width);
    });
    if (title) { ctx.font = "600 11px " + C3D.font; w = Math.max(w, ctx.measureText(title).width); }
    var h = rows.length * lineH + (title ? 18 : 0) + pad * 2 - 4;
    w = Math.min(w + pad * 2, this.w - 8);
    var px = this.pointer && this.hover === key && this.focus === null ? this.pointer.x : mark.cx;
    var py = this.pointer && this.hover === key && this.focus === null ? this.pointer.y : mark.cy;
    var x = px + 14, y = py - h - 10;
    if (x + w > this.w - 4) x = px - w - 14;
    if (x < 4) x = 4;
    if (y < 4) y = py + 16;
    if (y + h > this.h - 4) y = this.h - 4 - h;
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.16)";
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 4;
    c3dRoundRect(ctx, x, y, w, h, 8);
    ctx.fillStyle = C3D.surface;
    ctx.fill();
    ctx.restore();
    c3dRoundRect(ctx, x + 0.5, y + 0.5, w - 1, h - 1, 8);
    ctx.strokeStyle = C3D.grid;
    ctx.lineWidth = 1;
    ctx.stroke();
    var cy = y + pad + 4;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    if (title) {
      ctx.font = "600 11px " + C3D.font;
      ctx.fillStyle = C3D.muted;
      ctx.fillText(c3dFit(ctx, title, w - pad * 2), x + pad, cy);
      cy += 18;
    }
    rows.forEach(function(r) {
      if (r.color) {
        ctx.beginPath();
        ctx.moveTo(x + pad, cy); ctx.lineTo(x + pad + 12, cy);
        ctx.strokeStyle = r.color; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.stroke();
        ctx.lineCap = "butt";
      }
      ctx.font = "600 12px " + C3D.font;
      ctx.fillStyle = C3D.ink;
      ctx.fillText(r.value, x + pad + 18, cy);
      ctx.font = (r.on ? "600 " : "") + "12px " + C3D.font;
      ctx.fillStyle = r.on ? C3D.ink : C3D.ink2;
      ctx.fillText(c3dFit(ctx, r.label, w - pad * 2 - 24 - r.vw + 1), x + pad + 18 + r.vw + 6, cy);
      cy += lineH;
    });
  };

  Chart3D.prototype.updateAria = function() {
    var cfg = this.cfg, self = this, parts = [];
    if (cfg.type === "donut") {
      cfg.slices.forEach(function(s, i) { if (!self.hidden[i] && s.value > 0) parts.push(s.label + " " + cfg.format(s.value)); });
    } else {
      cfg.categories.forEach(function(c, k) {
        var vals = [];
        cfg.series.forEach(function(s, i) { if (!self.hidden[i] && (s.data[k] || 0) > 0) vals.push(s.label + " " + cfg.format(s.data[k])); });
        if (vals.length) parts.push(c + ": " + vals.join(", "));
      });
    }
    var label = cfg.title + ". " + parts.join("; ") + ". Use the arrow keys to read each value.";
    if (this.canvas.getAttribute("aria-label") !== label) this.canvas.setAttribute("aria-label", label);
  };

  /* ---------------- interaction ---------------- */
  Chart3D.prototype.at = function(e) {
    var r = this.canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (this.w / (r.width || 1)), y: (e.clientY - r.top) * (this.h / (r.height || 1)) };
  };

  Chart3D.prototype.hit = function(p) {
    for (var b = 0; b < this.legendBoxes.length; b++) {
      var lb = this.legendBoxes[b];
      if (p.x >= lb.x - 4 && p.x <= lb.x + lb.w + 4 && p.y >= lb.y && p.y <= lb.y + lb.h) return { legend: lb.i };
    }
    for (var m = this.marks.length - 1; m >= 0; m--) {
      for (var q = 0; q < this.marks[m].polys.length; q++) {
        if (c3dInPoly(p.x, p.y, this.marks[m].polys[q])) return { key: this.marks[m].key };
      }
    }
    return null;
  };

  Chart3D.prototype.onMove = function(e) {
    var p = this.at(e), v = this.view;
    this.pointer = p;
    if (this.drag) {
      var dxp = p.x - this.drag.x, dyp = p.y - this.drag.y;
      this.drag.x = p.x; this.drag.y = p.y;
      this.drag.dist += Math.abs(dxp) + Math.abs(dyp);
      if (this.drag.dist > 4) this.drag.moved = true;
      if (!this.drag.moved) return;
      if (this.cfg.type === "donut") {
        v.rot += dxp * 0.012;
        v.tilt = Math.min(1.35, Math.max(0.35, v.tilt - dyp * 0.008));
      } else {
        v.angle = Math.min(1.4, Math.max(0.12, v.angle - dxp * 0.01));
        v.depth = Math.min(2.2, Math.max(0.3, v.depth - dyp * 0.012));
      }
      this.draw();
      return;
    }
    var h = this.hit(p), key = h && h.key !== undefined ? h.key : null;
    this.canvas.style.cursor = h ? "pointer" : "grab";
    this.hover = key;
    this.draw();
  };

  Chart3D.prototype.onLeave = function() {
    if (this.drag) return;
    this.pointer = null;
    this.hover = null;
    this.canvas.style.cursor = "";
    this.draw();
  };

  Chart3D.prototype.onDown = function(e) {
    var p = this.at(e), h = this.hit(p);
    this.focus = null;
    if (h && h.legend !== undefined) {
      this.hidden[h.legend] = !this.hidden[h.legend];
      this.hover = null;
      this.draw();
      return;
    }
    this.drag = { x: p.x, y: p.y, dist: 0, moved: false, key: h ? h.key : null };
    if (e.pointerType === "mouse") this.canvas.style.cursor = h ? "pointer" : "grabbing";
  };

  Chart3D.prototype.onUp = function(e) {
    if (!this.drag) return;
    var d = this.drag;
    this.drag = null;
    /* a tap without dragging pins the tooltip (touch has no hover) */
    if (!d.moved && e && e.pointerType !== "mouse") this.hover = d.key;
    this.draw();
  };

  Chart3D.prototype.onKey = function(e) {
    var keys = this.order, i = keys.indexOf(this.focus);
    if (e.key === "ArrowRight" || e.key === "ArrowDown") i = i < 0 ? 0 : (i + 1) % keys.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") i = i <= 0 ? keys.length - 1 : i - 1;
    else if (e.key === "Home") i = 0;
    else if (e.key === "End") i = keys.length - 1;
    else if (e.key === "Escape") i = -1;
    else return;
    e.preventDefault();
    this.focus = i >= 0 && keys.length ? keys[i] : null;
    this.draw();
  };

  /* ================================================================
     CHARTS
     Each cost entity keeps the same color in every chart.
     ================================================================ */
  const moneyAxis = v => sym() + c3dCompact(v);

  /* Drops categories and series without any value */
  function stackedChart(canvas, title, base, raw) {
    const keep = base.map((_, i) => raw.some(s => s.data[i] > 0));
    return new Chart3D(canvas, {
      type: "bar", title, format: fmt, axisFormat: moneyAxis,
      categories: base.filter((_, i) => keep[i]),
      series: raw.filter(s => s.data.some(v => v > 0)).map(s => ({ ...s, data: s.data.filter((_, i) => keep[i]) }))
    });
  }

  function drawTotalChart(oneT, monthT, yearT) {
    if (costChart) costChart.destroy();
    costChart = new Chart3D($("pricingV2_costChart"), {
      type: "bar", title: "Cost Summary", legend: false, format: fmt, axisFormat: moneyAxis,
      categories: ["One-Time", "Monthly After Trial", "1-Year Est."],
      series: [{ label: "Cost", color: C3D_COLORS.blue, data: [oneT, monthT, yearT] }]
    });
  }

  function drawOneTimeChart(nodesCost, switchCost, winOneTime, thirdOneTime) {
    if (oneTimeBreakdownChart) oneTimeBreakdownChart.destroy();
    oneTimeBreakdownChart = stackedChart($("pricingV2_oneTimeBreakdownChart"), "One-Time Breakdown", ["Hardware", "Windows License", "Third-Party"], [
      { label: "Nodes",        color: C3D_COLORS.blue,   data: [nodesCost,  0,          0] },
      { label: "Switches",     color: C3D_COLORS.orange, data: [switchCost, 0,          0] },
      { label: "Third-Party",  color: C3D_COLORS.violet, data: [0,          0,          thirdOneTime] },
      { label: "Windows Lic.", color: C3D_COLORS.yellow, data: [0,          winOneTime, 0] }
    ]);
  }

  function drawMonthlyChart(host, win, avd, sql, third) {
    if (costBreakdownChart) costBreakdownChart.destroy();
    costBreakdownChart = stackedChart($("pricingV2_costBreakdownChart"), "Monthly Breakdown", ["Licensing", "AVD", "SQLmi", "Third-Party"], [
      { label: "Host Fee",     color: C3D_COLORS.aqua,    data: [host, 0,   0,   0] },
      { label: "Windows Lic.", color: C3D_COLORS.yellow,  data: [win,  0,   0,   0] },
      { label: "AVD",          color: C3D_COLORS.magenta, data: [0,    avd, 0,   0] },
      { label: "SQLmi",        color: C3D_COLORS.green,   data: [0,    0,   sql, 0] },
      { label: "Third-Party",  color: C3D_COLORS.violet,  data: [0,    0,   0,   third] }
    ]);
  }

  /* ================================================================
     PDF EXPORT
     ================================================================ */
  function exportPdf() {
    const btn = $("pricingV2_exportPdfBtn");
    btn.textContent = "Generating...";
    btn.disabled = true;

    try {
      const root = $("pricingV2_calcRoot");

      /* Capture chart canvases to static images before cloning */
      const chartImages = {};
      root.querySelectorAll("canvas").forEach(c => {
        try { chartImages[c.id] = c.toDataURL("image/png"); } catch(e) {}
      });

      /* Clone the calculator root */
      const clone = root.cloneNode(true);

      /* Replace canvas elements with img snapshots */
      clone.querySelectorAll("canvas").forEach(c => {
        const img = document.createElement("img");
        img.src = chartImages[c.id] || "";
        img.style.cssText = "width:100%;height:100%;object-fit:contain;display:block";
        c.parentNode.replaceChild(img, c);
      });

      /* Hide buttons and no-print elements */
      clone.querySelectorAll(".btn-row,.no-print").forEach(el => {
        el.style.display = "none";
      });

      /* Extract inline styles from this document */
      let styles = "";
      for (let i = 0; i < document.styleSheets.length; i++) {
        try {
          const rules = document.styleSheets[i].cssRules || document.styleSheets[i].rules;
          for (let j = 0; j < rules.length; j++) styles += rules[j].cssText + "\n";
        } catch(e) {}
      }

      /* Open a dedicated print window */
      const win = window.open("", "_blank", "width=960,height=800");
      if (!win) {
        alert("Pop-up blocked. Allow pop-ups for this page and try again, or use Ctrl+P to print.");
        btn.textContent = "Export to PDF";
        btn.disabled = false;
        return;
      }

      win.document.write(
        "<!DOCTYPE html><html lang='en'><head>" +
        "<meta charset='UTF-8'>" +
        "<title>Azure Local Pricing Calculator - Export</title>" +
        "<style>" + styles + "</style>" +
        "<style>body{margin:0;padding:16px}" +
        ".btn-row,.no-print{display:none!important}" +
        "@media print{.btn-row,.no-print{display:none!important}}</style>" +
        "</head><body>" + clone.outerHTML + "</body></html>"
      );
      win.document.close();
      setTimeout(() => { win.print(); }, 500);

    } catch(err) {
      console.error("Export failed:", err);
      alert("Export failed: " + (err.message || err) + "\nUse Ctrl+P / Cmd+P to print instead.");
    }

    btn.textContent = "Export to PDF";
    btn.disabled = false;
  }

  /* ================================================================
     ODIN IMPORT
     Reads a Sizer ("Export JSON") or Designer ("Export Configuration")
     file from ODIN for Azure Local and normalizes it.
     https://azure.github.io/odinforazurelocal/docs/json-schema/
     ================================================================ */
  var ODIN_CPU_GENERATIONS = {
    "xeon-4th": "Intel 4th Gen Xeon (Sapphire Rapids)",
    "xeon-5th": "Intel 5th Gen Xeon (Emerald Rapids)",
    "xeon-6": "Intel Xeon 6 (Granite Rapids / Sierra Forest)",
    "xeon-d-27xx": "Intel Xeon D-2700 (Ice Lake-D)",
    "epyc-4th": "AMD 4th Gen EPYC (Genoa)",
    "epyc-4th-c": "AMD 4th Gen EPYC (Bergamo)",
    "epyc-5th": "AMD 5th Gen EPYC (Turin)",
    "epyc-5th-c": "AMD 5th Gen EPYC (Turin Dense)"
  };
  var ODIN_AVD_PROFILES = {
    light:  { multi: [0.5, 2, 20], single: [2, 8, 32] },
    medium: { multi: [1, 4, 40],   single: [4, 16, 32] },
    heavy:  { multi: [1.5, 6, 60], single: [8, 32, 32] },
    power:  { multi: [2, 8, 80],   single: [8, 32, 80] },
    custom: { multi: [2, 8, 50],   single: [4, 16, 50] }
  };
  var ODIN_GHEL_TIERS = {
    "trial": [4, 32, 900], "up-to-1000": [8, 48, 900], "1000-to-3000": [16, 64, 1400],
    "3000-to-5000": [32, 128, 1900], "5000-to-8000": [48, 256, 3400], "8000-to-10000": [64, 512, 5400]
  };
  var ODIN_EDGERAG_LLM = { "external": [0, 0, 0], "foundry-minimum": [8, 32, 50], "foundry-production": [16, 64, 100] };

  function odinInt(v, def) { var n = parseInt(v, 10); return isFinite(n) ? n : def; }
  function odinNum(v, def) { var n = parseFloat(v); return isFinite(n) ? n : def; }
  function odinEsc(s) {
    return String(s).replace(/[&<>"']/g, function(c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* Mirrors calculateWorkloadRequirements() in ODIN sizer.js.
     Returns raw (pre-growth) vCPU, memory GB, storage GB and VM count. */
  function odinWorkloadReqs(w) {
    var v = 0, m = 0, s = 0, vms = 0;
    switch (w.type) {
      case "vm": {
        var count = Math.max(odinInt(w.count, 1), 1);
        v = odinNum(w.vcpus, 0) * count; m = odinNum(w.memory, 0) * count; s = odinNum(w.storage, 0) * count;
        vms = count;
        break;
      }
      case "aks": {
        var clusters = Math.max(odinInt(w.clusterCount, 1), 1);
        var cp = odinInt(w.controlPlaneNodes, 3), wk = odinInt(w.workerNodes, 3);
        v = (cp * odinNum(w.controlPlaneVcpus, 4) + wk * odinNum(w.workerVcpus, 8)) * clusters;
        m = (cp * odinNum(w.controlPlaneMemory, 8) + wk * odinNum(w.workerMemory, 16)) * clusters;
        s = (cp * 200 + wk * (200 + odinNum(w.workerStorage, 200))) * clusters;
        vms = (cp + wk) * clusters;
        break;
      }
      case "avd": {
        var users = Math.max(odinInt(w.userCount, 50), 0);
        var sType = w.sessionType === "single" ? "single" : "multi";
        var conc = sType === "single" ? 1 : odinNum(w.concurrency, 100) / 100;
        var concUsers = Math.ceil(users * conc);
        var p = (ODIN_AVD_PROFILES[w.profile] || ODIN_AVD_PROFILES.medium)[sType];
        var vpu = p[0], mpu = p[1], spu = p[2];
        if (w.profile === "custom") {
          vpu = odinNum(w.customVcpus, 2); mpu = odinNum(w.customMemory, 8); spu = odinNum(w.customStorage, 50);
        }
        v = Math.ceil(vpu * concUsers); m = mpu * concUsers; s = spu * users;
        if (w.fslogix) s += odinNum(w.fslogixSize, 30) * users;
        vms = sType === "single" ? concUsers : 1;
        break;
      }
      case "foundry": {
        var fw = Math.max(odinInt(w.workerNodes, 2), 1);
        var fv = 8, fm = 32;
        if (w.workerProfile === "minimum") { fv = 4; fm = 16; }
        else if (w.workerProfile === "custom") { fv = odinNum(w.customVcpus, 8); fm = odinNum(w.customMemory, 32); }
        v = 12 + fv * fw + 2; m = 24 + fm * fw + 4;
        s = 600 + 200 * fw + odinNum(w.modelCacheStorageGB, 100) * Math.max(odinInt(w.modelDeployments, 1), 1);
        vms = 3 + fw;
        break;
      }
      case "edgerag": {
        var emb = w.deploymentMode === "agentic" ? 0 : 2;
        var llm = ODIN_EDGERAG_LLM[w.llmEndpoint] || ODIN_EDGERAG_LLM["foundry-production"];
        v = 12 + 24 + emb * 8 + llm[0]; m = 24 + 96 + emb * 16 + llm[1];
        s = 600 + (3 + emb) * 200 + llm[2] + Math.ceil(odinNum(w.corpusGB, 100) * 1.5);
        vms = 6 + emb;
        break;
      }
      case "videoindexer": {
        var isMin = w.configuration === "minimum";
        v = 12 + (isMin ? 32 : 64); m = 24 + (isMin ? 64 : 256);
        s = 600 + (isMin ? 1 : 2) * 200 + (isMin ? 50 : 100);
        vms = 3 + (isMin ? 1 : 2);
        break;
      }
      case "ghel": {
        var t = ODIN_GHEL_TIERS[w.tier] || ODIN_GHEL_TIERS["up-to-1000"];
        var rep = (typeof w.replicas === "number" && w.replicas >= 0 && w.replicas <= 7) ? w.replicas : (w.ha ? 1 : 0);
        var mult = 1 + (w.actions ? 0.25 : 0) + (w.codeSecurity ? 0.25 : 0);
        vms = 1 + rep;
        v = Math.ceil(t[0] * mult) * vms; m = Math.ceil(t[1] * mult) * vms; s = t[2] * vms;
        break;
      }
    }
    return { vcpus: v, memory: m, storage: s, vms: vms };
  }

  /* Mirrors the ODIN Sizer network model (infrastructure power estimate):
     per rack 2 ToR + 1 BMC; rack-aware uses 2 racks; disaggregated adds
     2 FC switches per rack for FC SAN plus the spine switches; a single node
     only has a BMC switch. Designer ToR choices override the defaults. */
  function odinNetwork(clusterType, nodes, st) {
    var tor, bmc, fc = 0, spine = 0;
    var torChoice = st.torSwitchCount === "single" ? 1 : (st.torSwitchCount === "dual" ? 2 : null);
    if (clusterType === "disaggregated") {
      var racks = Math.max(odinInt(st.disaggRackCount, 2), 1);
      tor = racks * 2; bmc = racks;
      fc = (st.disaggStorageType || "fc_san") === "fc_san" ? racks * 2 : 0;
      spine = Math.max(odinInt(st.disaggSpineCount, 2), 0);
    } else if (clusterType === "rack-aware") {
      tor = 2 * (odinInt(st.rackAwareTorsPerRoom, 0) || 2); bmc = 2;
    } else if (nodes === 1) {
      tor = torChoice || 0; bmc = 1;
    } else {
      tor = torChoice || 2; bmc = 1;
    }
    var parts = [];
    if (tor) parts.push(tor + " ToR");
    parts.push(bmc + " BMC");
    if (fc) parts.push(fc + " FC");
    if (spine) parts.push(spine + " Spine");
    return { total: tor + bmc + fc + spine, detail: parts.join(" + ") };
  }

  /* Mirrors getHostCpuReservedCores() in ODIN sizer.js (cores per node). */
  function odinHostReservedCores(clusterType, totalCores) {
    if (clusterType === "aldo-mgmt") return Math.max(Math.ceil(0.20 * totalCores), 2);
    if (clusterType === "disaggregated") return Math.max(Math.ceil(0.10 * totalCores), 1);
    return Math.max(Math.ceil(0.10 * totalCores), 2);
  }

  function parseOdinConfig(text) {
    var json;
    try { json = JSON.parse(text); } catch (e) { throw new Error("The file is not valid JSON."); }
    if (!json || typeof json !== "object") throw new Error("The file is not a valid ODIN export.");

    var r = {
      source: null, nodes: null, clusterType: null, scenario: "connected", resiliency: null,
      cpu: null, vcpuRatio: null, growthPct: 0, growthYears: 1, growthFactor: 1,
      disks: null, workloadCount: 0, totals: null, avdVcpus: 0, vmEquivalents: 0, network: null, hostReservedCores: null
    };

    if (json.state && typeof json.state === "object") {
      /* Designer export: { version, exportedAt, state } */
      var st = json.state, hw = st.sizerHardware && typeof st.sizerHardware === "object" ? st.sizerHardware : null;
      r.source = "ODIN Designer";
      r.scenario = st.scenario || "connected";
      r.clusterType = st.architecture === "disaggregated" ? "disaggregated"
        : (st.clusterRole === "management" ? "aldo-mgmt"
        : (hw && hw.clusterType ? hw.clusterType
        : (st.scale === "rack_aware" ? "rack-aware" : "standard")));
      r.nodes = odinInt(st.nodes, null) || (hw ? odinInt(hw.nodeCount, null) : null);
      if (r.nodes === 1 && r.clusterType === "standard") r.clusterType = "single";
      r.network = odinNetwork(r.clusterType, r.nodes, st);
      if (hw) {
        r.resiliency = hw.resiliency || null;
        if (hw.cpu && odinInt(hw.cpu.coresPerSocket, 0) > 0) {
          r.cpu = {
            manufacturer: hw.cpu.manufacturer || "",
            generation: hw.cpu.generation || "Unknown",
            coresPerSocket: odinInt(hw.cpu.coresPerSocket, 0),
            sockets: odinInt(hw.cpu.sockets, 2)
          };
        }
        r.vcpuRatio = odinInt(hw.vcpuRatio, null);
        r.growthPct = odinInt(hw.futureGrowth, 0);
        var dc = hw.storage && hw.storage.diskConfig;
        if (dc && dc.capacity) {
          r.disks = {
            isTiered: !!dc.isTiered,
            capacityCount: odinInt(dc.capacity.count, 0),
            capacityTB: odinNum(dc.capacity.sizeGB, 0) / 1024,
            cacheCount: dc.cache ? odinInt(dc.cache.count, 0) : 0,
            cacheTB: dc.cache ? odinNum(dc.cache.sizeGB, 0) / 1024 : 0
          };
        }
        var sw = Array.isArray(st.sizerWorkloads) ? st.sizerWorkloads
          : (st.sizerWorkloads && typeof st.sizerWorkloads === "object" ? Object.keys(st.sizerWorkloads).map(function(k) { return st.sizerWorkloads[k]; }) : []);
        var t = { vcpus: 0, memory: 0, storage: 0 };
        sw.forEach(function(w) {
          if (!w || typeof w !== "object") return;
          t.vcpus += odinNum(w.totalVcpus, 0); t.memory += odinNum(w.totalMemoryGB, 0); t.storage += odinNum(w.totalStorageGB, 0);
          if (w.type === "avd") r.avdVcpus += odinNum(w.totalVcpus, 0);
          r.vmEquivalents += w.type === "vm" ? Math.max(odinInt(w.count, 1), 1) : 1;
        });
        r.workloadCount = sw.length;
        if (sw.length) r.totals = t;
      }
    } else {
      /* Sizer export: { _meta, data } or the bare data object */
      var d = json.data && typeof json.data === "object" ? json.data : json;
      if (!d.clusterType && !Array.isArray(d.workloads)) {
        throw new Error("This file is not an ODIN Sizer or Designer export.");
      }
      r.source = "ODIN Sizer";
      r.clusterType = d.clusterType || "standard";
      r.scenario = r.clusterType === "aldo-mgmt" ? "disconnected" : "connected";
      r.nodes = r.clusterType === "single" ? 1 : odinInt(d.nodeCount, null);
      r.resiliency = d.resiliency || null;
      if (odinInt(d.cpuCores, 0) > 0) {
        r.cpu = {
          manufacturer: d.cpuManufacturer || "",
          generation: d.importedProcessorName || ODIN_CPU_GENERATIONS[d.cpuGeneration] || d.cpuGeneration || "Unknown",
          coresPerSocket: odinInt(d.cpuCores, 0),
          sockets: odinInt(d.cpuSockets, 2)
        };
      }
      r.vcpuRatio = odinInt(d.vcpuRatio, null);
      r.growthPct = odinInt(d.futureGrowth, 0);
      r.growthYears = d.sizeFor5YrGrowth === true ? 5 : 1;
      var tiered = d.storageConfig === "mixed-flash" || d.storageConfig === "hybrid";
      if (tiered) {
        r.disks = {
          isTiered: true,
          capacityCount: odinInt(d.tieredCapacityDiskCount, 4), capacityTB: odinNum(d.tieredCapacityDiskSize, 3.84),
          cacheCount: odinInt(d.cacheDiskCount, 2), cacheTB: odinNum(d.cacheDiskSize, 1.92)
        };
      } else if (odinInt(d.capacityDiskCount, 0) > 0) {
        r.disks = { isTiered: false, capacityCount: odinInt(d.capacityDiskCount, 0), capacityTB: odinNum(d.capacityDiskSize, 0), cacheCount: 0, cacheTB: 0 };
      }
      r.network = odinNetwork(r.clusterType, r.nodes, {
        disaggRackCount: d.disaggRackCount, disaggSpineCount: d.disaggSpineCount, disaggStorageType: d.disaggStorageType
      });
      var wl = Array.isArray(d.workloads) ? d.workloads : [];
      var tt = { vcpus: 0, memory: 0, storage: 0 };
      wl.forEach(function(w) {
        if (!w || typeof w !== "object") return;
        var q = odinWorkloadReqs(w);
        tt.vcpus += q.vcpus; tt.memory += q.memory; tt.storage += q.storage;
        if (w.type === "avd") r.avdVcpus += q.vcpus;
        r.vmEquivalents += q.vms;
      });
      r.workloadCount = wl.length;
      if (wl.length) r.totals = tt;
    }

    r.growthFactor = Math.pow(1 + r.growthPct / 100, r.growthYears);
    if (!r.nodes || r.nodes < 1) r.nodes = null;
    if (r.cpu) r.hostReservedCores = odinHostReservedCores(r.clusterType, r.cpu.coresPerSocket * r.cpu.sockets);
    if (r.cpu && (!r.cpu.generation || r.cpu.generation === "Unknown")) {
      r.cpu.generation = r.cpu.manufacturer === "amd" ? "AMD CPU" : (r.cpu.manufacturer ? "Intel CPU" : "CPU");
    }
    return r;
  }

  /* Opens a file picker, parses the chosen ODIN file and hands it to onLoad
     together with the raw text (used to share the import). */
  function pickOdinFile(input, onLoad, onError) {
    input.value = "";
    input.onchange = function() {
      var file = input.files && input.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) { onError("The file is larger than 5 MB."); return; }
      var reader = new FileReader();
      reader.onload = function() {
        var text = String(reader.result), cfg;
        try { cfg = parseOdinConfig(text); }
        catch (e) { onError(e.message || String(e)); return; }
        onLoad(cfg, file.name, text);
      };
      reader.onerror = function() { onError("The file could not be read."); };
      reader.readAsText(file);
    };
    input.click();
  }

  function odinClusterLabel(t) {
    return { "single": "Single Node", "standard": "Hyperconverged", "rack-aware": "Rack Aware",
             "disaggregated": "Disaggregated Storage", "aldo-mgmt": "Disconnected Operations (Management)" }[t] || t || "Unknown";
  }

  /* Renders the import summary into the given box using the existing result-box style. */
  function showOdinSummary(box, cfg, fileName, applied, notes) {
    var h = "<strong>Imported from " + odinEsc(cfg.source) + ":</strong> " + odinEsc(fileName) + "<br>";
    h += "<strong>Cluster:</strong> " + odinEsc(odinClusterLabel(cfg.clusterType)) +
         (cfg.nodes ? ", " + cfg.nodes + " node" + (cfg.nodes > 1 ? "s" : "") : "") +
         (cfg.scenario === "disconnected" ? " (disconnected)" : "") + "<br>";
    applied.forEach(function(a) { h += "<strong>" + odinEsc(a[0]) + ":</strong> " + odinEsc(a[1]) + "<br>"; });
    notes.forEach(function(n) { h += '<span class="warning">' + odinEsc(n) + "</span><br>"; });
    box.innerHTML = h;
    box.style.display = "block";
  }

  /* Shares one ODIN import with every calculator: the others on the same
     page (or in other blog tabs) apply it right away, and it is kept for the
     browser session so the other calculator pages load it as well. */
  var ODIN_SHARE_KEY = "azureLocalCalculator.odinImport";
  var ODIN_SHARE_EVENT = "azurelocal-calculator-odin-import";
  var odinChannel = null;
  try { if (typeof BroadcastChannel === "function") odinChannel = new BroadcastChannel(ODIN_SHARE_EVENT); } catch (e) {}

  function shareOdinImport(text, fileName, sourceId) {
    var msg = { text: text, fileName: fileName, source: sourceId };
    try { sessionStorage.setItem(ODIN_SHARE_KEY, JSON.stringify(msg)); } catch (e) {}
    try {
      if (odinChannel) odinChannel.postMessage(msg);
      else window.dispatchEvent(new CustomEvent(ODIN_SHARE_EVENT, { detail: msg }));
    } catch (e) {}
  }

  /* Calls apply(cfg, label) for imports made in another calculator and, on
     page load, for the import stored earlier in this browser session. */
  function listenOdinImport(sourceId, apply) {
    function handle(msg, suffix) {
      if (!msg || typeof msg.text !== "string" || msg.source === sourceId) return;
      try { apply(parseOdinConfig(msg.text), String(msg.fileName || "ODIN export") + suffix); }
      catch (e) { if (window.console) console.warn("Shared ODIN import skipped:", e); }
    }
    if (odinChannel) odinChannel.addEventListener("message", function(ev) { handle(ev.data, " (shared from another calculator)"); });
    else window.addEventListener(ODIN_SHARE_EVENT, function(ev) { handle(ev.detail, " (shared from another calculator)"); });
    var saved = null;
    try { saved = JSON.parse(sessionStorage.getItem(ODIN_SHARE_KEY) || "null"); } catch (e) {}
    if (saved && typeof saved === "object") { saved.source = null; handle(saved, " (restored from this browser session)"); }
  }

  function applyOdinConfig(cfg, fileName) {
    const applied = [], notes = [];

    let model = "l1";
    if (cfg.scenario === "disconnected" || cfg.clusterType === "aldo-mgmt") model = "l3";
    else if (cfg.clusterType === "disaggregated") model = "l2-disagg";
    $("pricingV2_deploymentModel").value = model;
    updateDeploymentFields();
    applied.push(["Deployment Model", deploymentModels[model].label]);

    /* an ALDO management cluster design describes the management cluster, not the workload clusters */
    const aldoMgmt = cfg.clusterType === "aldo-mgmt";
    if (cfg.nodes) {
      const nodes = $(aldoMgmt ? "pricingV2_l3MgmtNodes" : "pricingV2_nodes");
      nodes.value = Math.min(cfg.nodes, +nodes.max);
      if (cfg.nodes > +nodes.max) notes.push("ODIN uses " + cfg.nodes + " nodes. This deployment model supports up to " + nodes.max + " nodes, so " + nodes.max + " was applied.");
      applied.push([aldoMgmt ? "ALDO Management Cluster Nodes" : "Nodes", nodes.value]);
    }
    if (aldoMgmt) notes.push("The ODIN design is the disconnected operations management cluster. Enter the workload cluster nodes and cores that it manages, since both are billed.");
    if (cfg.cpu) {
      const cores = cfg.cpu.coresPerSocket * cfg.cpu.sockets;
      $(aldoMgmt ? "pricingV2_l3MgmtCores" : "pricingV2_coresPerNode").value = cores;
      applied.push([aldoMgmt ? "Physical Cores per Management Node" : "Physical Cores per Node", cores + " (" + cfg.cpu.sockets + " x " + cfg.cpu.coresPerSocket + " cores)"]);
    } else {
      notes.push("The file has no CPU data. Physical cores per node were not changed.");
    }
    if (cfg.network) {
      $("pricingV2_switches").value = cfg.network.total;
      applied.push(["Switches", cfg.network.total + " (" + cfg.network.detail + ", ODIN network model)"]);
    }
    if (cfg.avdVcpus > 0 && model === "l3") {
      notes.push("The ODIN design has " + Math.ceil(cfg.avdVcpus) + " AVD vCPUs, but Azure Virtual Desktop isn't available with disconnected operations, so no AVD cost was applied.");
    } else if (cfg.avdVcpus > 0) {
      $("pricingV2_avdVCPUs").value = Math.ceil(cfg.avdVcpus);
      applied.push(["AVD vCPUs", String(Math.ceil(cfg.avdVcpus))]);
    }

    const needsL3Rate = model === "l3" && !(+$("pricingV2_l3HostRate").value > 0);
    if (needsL3Rate) notes.push("Disconnected operations use the L3 model. Enter the L3 host fee and click Calculate Pricing.");
    notes.push("Node, switch and related costs are not part of ODIN exports. Review the prices before using the estimate.");

    showOdinSummary($("pricingV2_importBox"), cfg, fileName, applied, notes);
    if (!needsL3Rate) calculate();
  }

  $("pricingV2_importOdinBtn").addEventListener("click", function () {
    pickOdinFile($("pricingV2_odinFile"), (cfg, fileName, text) => {
      applyOdinConfig(cfg, fileName);
      shareOdinImport(text, fileName, "pricing");
    }, msg => alert("ODIN import failed: " + msg));
  });

  /* ---- events ---- */
  $("pricingV2_calcBtn").addEventListener("click", calculate);
  $("pricingV2_exportPdfBtn").addEventListener("click", exportPdf);
  listenOdinImport("pricing", applyOdinConfig);
})();
</script>
</body>
</html>


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
  Author of the calculators and blog.  
  [LinkedIn](https://www.linkedin.com/in/cristian-schmitt-nieto/)

## General Disclaimer

- **Unofficial:**  
  These calculators are community-built tools and do **not** represent official Microsoft products or documentation.

- **No Endorsement:**  
  They are provided as reference material only and do not imply endorsement of any architectural decision.

- **Provided “AS IS”:**  
  All code and tools are provided with no warranties, either express or implied.

- **No Standard Support:**  
  These tools are not covered by any Microsoft support program.

- **Use at Your Own Risk:**  
  It is your responsibility to validate and test the results for your specific environment.

- **Limitation of Liability:**  
  Neither the author(s) nor Microsoft will be liable for any damages resulting from the use of these tools, including (but not limited to) loss of business, profits or data.
