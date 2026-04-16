---
permalink: /azurelocal-calculator/
title: "Azure Local Calculator"
excerpt: "Interactive calculators for Azure Local covering storage sizing, pricing estimation and CPU planning (upcoming). Ideal for architecture design and cost evaluation."
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

These tools are intended to **supplement** the official [Microsoft Azure Local Sizer](https://azurelocalsolutions.azure.microsoft.com/#/sizer), which is currently still in **Preview**. The Sizer offers a helpful approximation of how the final solution might look once deployed, and this calculator set aims to provide deeper visibility into specific resource planning areas.

More insights on planning, sizing, and migration strategies will be shared in my upcoming blog post: **“Planning, Sizing and Migration for Azure Local”**.

## Azure Local Calculator

[**Azure Local Calculator**](https://github.com/schmittnieto/AzureLocal-Calculator) is a GitHub-based repository offering a collection of interactive calculators focused on the Azure Local with emphasis on **Storage**, **CPU** and **Pricing** estimations.

The source code for the calculators is available on GitHub, but the calculators themselves can be used interactively right here on this page.

The storage configuration used in the calculator is based on the *Express* mode. While I acknowledge that this is not the most efficient setup in terms of capacity optimization, it serves well as a first approximation to get a general understanding of the storage architecture.

If you aim to implement more advanced storage configurations, you will likely need to customize the deployment by manually configuring storage to suit your needs, and in those cases, you probably already have an Excel sheet from your vendor or internal team that provides more accurate figures than what this calculator is designed to offer.

### CPU

<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
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
    .cpu-card{border:1px solid #555;border-radius:8px;padding:12px;font-size:.88em}
    .cpu-card.match{border-color:#2e7d32}
    .cpu-card.tight{border-color:#cc7a00}
    .cpu-card.no-fit{border-color:#888;opacity:.65}
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
    <button class="btn btn-secondary" id="exportPdfBtn" style="display:none">Export to PDF</button>
  </div>

  <!-- Results -->
  <div id="resultBox" class="result-box" style="display:none"></div>

  <!-- CPU Recommendations -->
  <div id="cpuRecommendSection" class="card" style="display:none">
    <h3>CPU Recommendations</h3>
    <p style="font-size:.85em;margin:0 0 4px">Based on the minimum cores required per socket, these are common server CPUs that could fit your workload.</p>
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
      <a href="https://learn.microsoft.com/en-us/azure/azure-local/concepts/host-network-requirements" target="_blank">Azure Local system requirements</a>
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
    { name: "Intel Xeon Gold 6530",    vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 32, tdp: 270 },
    { name: "Intel Xeon Gold 6538Y+",  vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 32, tdp: 225 },
    { name: "Intel Xeon Gold 6548Y+",  vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 32, tdp: 250 },
    { name: "Intel Xeon Platinum 8558",vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 48, tdp: 330 },
    { name: "Intel Xeon Platinum 8568Y+",vendor:"Intel",gen: "5th Gen (Emerald Rapids)", cores: 48, tdp: 350 },
    { name: "Intel Xeon Platinum 8580",vendor: "Intel", gen: "5th Gen (Emerald Rapids)", cores: 60, tdp: 350 },
    { name: "Intel Xeon Platinum 8592+",vendor:"Intel", gen: "5th Gen (Emerald Rapids)", cores: 64, tdp: 350 },

    /* --- Intel Xeon 6 P-cores (Granite Rapids) --- */
    { name: "Intel Xeon 6952P",        vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids)", cores: 96,  tdp: 400 },
    { name: "Intel Xeon 6960P",        vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids)", cores: 72,  tdp: 500 },
    { name: "Intel Xeon 6980P",        vendor: "Intel", gen: "Xeon 6 P-core (Granite Rapids)", cores: 128, tdp: 500 },

    /* --- Intel Xeon 6 E-cores (Sierra Forest) --- */
    { name: "Intel Xeon 6756E",        vendor: "Intel", gen: "Xeon 6 E-core (Sierra Forest)",  cores: 128, tdp: 250 },
    { name: "Intel Xeon 6766E",        vendor: "Intel", gen: "Xeon 6 E-core (Sierra Forest)",  cores: 144, tdp: 250 },
    { name: "Intel Xeon 6780E",        vendor: "Intel", gen: "Xeon 6 E-core (Sierra Forest)",  cores: 144, tdp: 330 },

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
    { name: "AMD EPYC 9124",  vendor: "AMD", gen: "4th Gen (Genoa)", cores: 16, tdp: 200 },
    { name: "AMD EPYC 9174F", vendor: "AMD", gen: "4th Gen (Genoa)", cores: 16, tdp: 320 },
    { name: "AMD EPYC 9224",  vendor: "AMD", gen: "4th Gen (Genoa)", cores: 24, tdp: 200 },
    { name: "AMD EPYC 9334",  vendor: "AMD", gen: "4th Gen (Genoa)", cores: 32, tdp: 210 },
    { name: "AMD EPYC 9354",  vendor: "AMD", gen: "4th Gen (Genoa)", cores: 32, tdp: 280 },
    { name: "AMD EPYC 9454",  vendor: "AMD", gen: "4th Gen (Genoa)", cores: 48, tdp: 290 },
    { name: "AMD EPYC 9534",  vendor: "AMD", gen: "4th Gen (Genoa)", cores: 64, tdp: 280 },
    { name: "AMD EPYC 9554",  vendor: "AMD", gen: "4th Gen (Genoa)", cores: 64, tdp: 360 },
    { name: "AMD EPYC 9654",  vendor: "AMD", gen: "4th Gen (Genoa)", cores: 96, tdp: 360 },
    { name: "AMD EPYC 9754",  vendor: "AMD", gen: "4th Gen (Genoa)", cores: 128,tdp: 360 },

    /* --- AMD EPYC 5th Gen (Turin) --- */
    { name: "AMD EPYC 9175F", vendor: "AMD", gen: "5th Gen (Turin)", cores: 16,  tdp: 320 },
    { name: "AMD EPYC 9275F", vendor: "AMD", gen: "5th Gen (Turin)", cores: 24,  tdp: 320 },
    { name: "AMD EPYC 9555",  vendor: "AMD", gen: "5th Gen (Turin)", cores: 64,  tdp: 400 },
    { name: "AMD EPYC 9655",  vendor: "AMD", gen: "5th Gen (Turin)", cores: 96,  tdp: 400 },
    { name: "AMD EPYC 9755",  vendor: "AMD", gen: "5th Gen (Turin)", cores: 128, tdp: 500 },
    { name: "AMD EPYC 9965",  vendor: "AMD", gen: "5th Gen (Turin Dense)", cores: 192, tdp: 500 }
  ];

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
     ================================================================ */
  (function populateDropdown() {
    const sel = $("cpuSelect");
    const grouped = {};
    for (const cpu of cpuDatabase) {
      const key = cpu.vendor + " - " + cpu.gen;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(cpu);
    }
    for (const [group, cpus] of Object.entries(grouped)) {
      const og = document.createElement("optgroup");
      og.label = group;
      for (const cpu of cpus) {
        const opt = document.createElement("option");
        opt.value = cpu.name;
        opt.textContent = cpu.name + " (" + cpu.cores + " cores)";
        og.appendChild(opt);
      }
      sel.appendChild(og);
    }
    /* show info on change */
    sel.addEventListener("change", function () {
      const cpu = cpuDatabase.find(c => c.name === this.value);
      if (cpu) {
        $("cpuSelectInfo").innerHTML = cpu.cores + " cores/socket | " + cpu.gen + " | TDP " + cpu.tdp + "W";
      }
    });
    sel.dispatchEvent(new Event("change"));
  })();

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
  function calculate() {
    const c = readCommon();
    const nodes          = Math.max(num($("nodeCount")), 1);
    const haEnabled      = c.haCheckbox && nodes > 1;
    const workloadNodes  = haEnabled ? nodes - 1 : nodes;

    const coresNeededPerNode   = workloadNodes > 0 ? Math.ceil(c.workloadCores / workloadNodes) : c.workloadCores;
    const minCoresPerSocket    = Math.ceil((coresNeededPerNode + c.mgmtPerNode) / c.socketsPerNode);

    const physicalCoresPerNode   = minCoresPerSocket * c.socketsPerNode;
    const availableCoresPerNode  = Math.max(physicalCoresPerNode - c.mgmtPerNode, 0);
    const totalAvailableCores    = availableCoresPerNode * workloadNodes;
    const totalMgmtCores         = c.mgmtPerNode * nodes;
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
    if (fits) {
      html += '<span class="ok">The cluster has sufficient CPU capacity with ' + minCoresPerSocket + '+ core sockets.</span>';
    } else {
      html += '<span class="warning">Insufficient with ' + nodes + ' nodes. Need at least ' + minNodesTotal + ' nodes.</span>';
    }
    rb.innerHTML = html;

    buildCpuRecommendations(minCoresPerSocket);

    $("chartsSection").style.display = "block";
    drawCoreChart(c.workloadCores, totalMgmtCores, haCores, totalAvailableCores);
    drawNodeChart(nodes, physicalCoresPerNode, c.mgmtPerNode, availableCoresPerNode, c.workloadCores, workloadNodes, haEnabled);

    buildOverview({
      mode: "nodes",
      vms: c.vms, vcpusPerVm: c.vcpusPerVm, totalVCPUs: c.totalVCPUs, overcommit: c.overcommit, workloadCores: c.workloadCores,
      nodes, socketsPerNode: c.socketsPerNode, mgmtPerNode: c.mgmtPerNode, haEnabled, workloadNodes,
      minCoresPerSocket, physicalCoresPerNode, availableCoresPerNode,
      totalAvailableCores, totalMgmtCores, totalPhysicalCores, haCores,
      maxVCPUs, utilization, fits, minNodesTotal,
      cpuName: null
    });

    $("exportPdfBtn").style.display = "inline-block";
  }

  /* ================================================================
     MODE B: "I know my CPU - recommend Nodes"
     ================================================================ */
  function calculateByCpu() {
    const c = readCommon();
    const selectedName   = $("cpuSelect").value;
    const cpu            = cpuDatabase.find(p => p.name === selectedName);
    if (!cpu) return;

    const coresPerSocket        = cpu.cores;
    const physicalCoresPerNode  = coresPerSocket * c.socketsPerNode;
    const availableCoresPerNode = Math.max(physicalCoresPerNode - c.mgmtPerNode, 0);

    /* minimum workload nodes */
    const minWorkloadNodes = availableCoresPerNode > 0 ? Math.ceil(c.workloadCores / availableCoresPerNode) : 999;
    const haEnabled        = c.haCheckbox;
    const minNodes         = haEnabled ? minWorkloadNodes + 1 : minWorkloadNodes;
    const workloadNodes    = haEnabled ? minNodes - 1 : minNodes;

    const totalAvailableCores = availableCoresPerNode * workloadNodes;
    const totalMgmtCores      = c.mgmtPerNode * minNodes;
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
    html += '<strong>Minimum Nodes Required:</strong> <span class="ok">' + minNodes + " nodes</span>" + (haEnabled ? " (includes +1 for HA)" : "") + "<br>";
    html += "<strong>Max vCPUs Supported (" + minNodes + " nodes):</strong> " + maxVCPUs + " vCPUs<br>";
    html += "<strong>Core Utilization:</strong> " + utilization.toFixed(1) + "%";
    rb.innerHTML = html;

    /* hide CPU recommendation grid (not relevant in this mode) */
    $("cpuRecommendSection").style.display = "none";

    /* charts */
    $("chartsSection").style.display = "block";
    drawCoreChart(c.workloadCores, totalMgmtCores, haCores, totalAvailableCores);
    drawNodeChart(minNodes, physicalCoresPerNode, c.mgmtPerNode, availableCoresPerNode, c.workloadCores, workloadNodes, haEnabled);

    buildOverview({
      mode: "cpu",
      vms: c.vms, vcpusPerVm: c.vcpusPerVm, totalVCPUs: c.totalVCPUs, overcommit: c.overcommit, workloadCores: c.workloadCores,
      nodes: minNodes, socketsPerNode: c.socketsPerNode, mgmtPerNode: c.mgmtPerNode, haEnabled, workloadNodes,
      minCoresPerSocket: coresPerSocket, physicalCoresPerNode, availableCoresPerNode,
      totalAvailableCores, totalMgmtCores, totalPhysicalCores, haCores,
      maxVCPUs, utilization, fits: true, minNodesTotal: minNodes,
      cpuName: cpu.name
    });

    $("exportPdfBtn").style.display = "inline-block";
  }

  /* ================================================================
     CPU RECOMMENDATIONS
     ================================================================ */
  function buildCpuRecommendations(minCores) {
    $("cpuRecommendSection").style.display = "block";
    const grid = $("cpuGrid");

    /* sort: best fit first, then by cores ascending */
    const sorted = [...cpuDatabase].sort((a, b) => {
      const aFit = a.cores >= minCores ? 0 : 1;
      const bFit = b.cores >= minCores ? 0 : 1;
      if (aFit !== bFit) return aFit - bFit;
      return a.cores - b.cores;
    });

    let html = "";
    for (const cpu of sorted) {
      const ratio = cpu.cores / minCores;
      let cls, tag;
      if (ratio >= 1.2)      { cls = "match"; tag = '<span class="cpu-tag fit">Good Fit</span>'; }
      else if (ratio >= 1.0) { cls = "tight"; tag = '<span class="cpu-tag tight-tag">Tight Fit</span>'; }
      else                   { cls = "no-fit"; tag = '<span class="cpu-tag small">Too Small</span>'; }

      html += '<div class="cpu-card ' + cls + '">';
      html += '<div class="cpu-name">' + cpu.name + tag + '</div>';
      html += '<div class="cpu-detail">';
      html += cpu.cores + ' cores/socket | ' + cpu.gen + ' | TDP ' + cpu.tdp + 'W';
      html += '</div></div>';
    }
    grid.innerHTML = html;
  }

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
    if (d.cpuName) {
      row("Selected CPU", "User-selected", d.cpuName);
    }
    row("Nodes", d.mode === "cpu" ? "Calculated" : "User-defined", d.nodes + " total" + (d.haEnabled ? " (1 HA reserved)" : ""));
    row("Workload Nodes", d.haEnabled ? d.nodes + " - 1 HA" : d.nodes + " (no HA)", d.workloadNodes + " nodes");
    row("Sockets per Node", "User-defined", d.socketsPerNode + " socket(s)");
    row("Management Overhead per Node", "User-defined", d.mgmtPerNode + " cores");

    sec(d.mode === "cpu" ? "Node Sizing (for " + d.cpuName + ")" : "CPU Sizing");
    if (d.mode === "nodes") {
      row("Cores Needed per Node (workload + mgmt)", "ceil(" + d.workloadCores + " / " + d.workloadNodes + ") + " + d.mgmtPerNode, (d.availableCoresPerNode + d.mgmtPerNode) + " cores");
      row("Minimum Cores per Socket", (d.availableCoresPerNode + d.mgmtPerNode) + " / " + d.socketsPerNode + " socket(s)", d.minCoresPerSocket + " cores");
      total("Recommended Socket", d.minCoresPerSocket + "+ cores per socket");
    } else {
      row("Cores per Socket", d.cpuName, d.minCoresPerSocket + " cores");
      row("Available Cores per Node (for VMs)", d.physicalCoresPerNode + " - " + d.mgmtPerNode + " mgmt", d.availableCoresPerNode + " cores");
      row("Min Workload Nodes", "ceil(" + d.workloadCores + " / " + d.availableCoresPerNode + ")", d.workloadNodes + " nodes");
      total("Minimum Nodes Required", d.nodes + " nodes" + (d.haEnabled ? " (incl. +1 HA)" : ""));
    }

    sec("Cluster Capacity (" + d.nodes + " nodes, " + d.minCoresPerSocket + "-core sockets)");
    row("Physical Cores per Node", d.socketsPerNode + " x " + d.minCoresPerSocket + " cores", d.physicalCoresPerNode + " cores");
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
     CHARTS
     ================================================================ */
  function drawCoreChart(workload, mgmt, ha, available) {
    const unused   = Math.max(available - workload, 0);
    const overflow = Math.max(workload - available, 0);

    const labels = [], data = [], colors = [];
    labels.push("Workload Cores");   data.push(Math.min(workload, available)); colors.push("rgba(0,122,255,.75)");
    if (unused > 0)   { labels.push("Available (Unused)");       data.push(unused);   colors.push("rgba(52,199,89,.75)"); }
    if (overflow > 0) { labels.push("Overflow (Insufficient)");  data.push(overflow); colors.push("rgba(255,59,48,.75)"); }
    labels.push("Management Overhead"); data.push(mgmt); colors.push("rgba(175,175,175,.75)");
    if (ha > 0) { labels.push("HA Reserved (1 Node)"); data.push(ha); colors.push("rgba(90,200,250,.75)"); }

    const cfg = {
      type: "doughnut",
      data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 1 }] },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { title: { display: true, text: "Cluster Core Allocation", font: { size: 14 } }, legend: { position: "bottom", labels: { boxWidth: 12 } } }
      }
    };
    if (coreChart) coreChart.destroy();
    coreChart = new Chart($("coreChart").getContext("2d"), cfg);
  }

  function drawNodeChart(nodes, coresPerNode, mgmtPerNode, availPerNode, totalWorkloadCores, workloadNodes, haEnabled) {
    const labels = [], mgmtData = [], workloadData = [], freeData = [];
    const workloadPerNode = workloadNodes > 0 ? Math.ceil(totalWorkloadCores / workloadNodes) : 0;

    for (let i = 1; i <= nodes; i++) {
      labels.push("Node " + i);
      mgmtData.push(mgmtPerNode);
      const isHA = haEnabled && nodes > 1 && i === nodes;
      if (isHA) {
        workloadData.push(0);
        freeData.push(availPerNode);
      } else {
        const assigned = Math.min(workloadPerNode, availPerNode);
        workloadData.push(assigned);
        freeData.push(Math.max(availPerNode - assigned, 0));
      }
    }

    const cfg = {
      type: "bar",
      data: {
        labels,
        datasets: [
          { label: "Management", data: mgmtData, backgroundColor: "rgba(175,175,175,.75)", stack: "s" },
          { label: "VM Workload", data: workloadData, backgroundColor: "rgba(0,122,255,.75)", stack: "s" },
          { label: "Free", data: freeData, backgroundColor: "rgba(52,199,89,.75)", stack: "s" }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { title: { display: true, text: "Per-Node Core Distribution", font: { size: 14 } }, legend: { position: "bottom", labels: { boxWidth: 12 } } },
        scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true, title: { display: true, text: "Cores" } } }
      }
    };
    if (nodeChart) nodeChart.destroy();
    nodeChart = new Chart($("nodeChart").getContext("2d"), cfg);
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

  /* ---- events ---- */
  $("calcBtn").addEventListener("click", calculate);
  $("calcByCpuBtn").addEventListener("click", calculateByCpu);
  $("exportPdfBtn").addEventListener("click", exportPdf);
})();
</script>
</body>
</html>


### Storage Calculator

The storage calculator I designed is now outdated, as [Armin](https://www.linkedin.com/in/aoberneder/) has created a much better one. For this reason, I will not continue developing mine, and I recommend using Armin’s calculator for this purpose: [s2d-calculator.com](https://s2d-calculator.com/).
{: .notice--warning}

<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    #storageV2_calcRoot,
    #storageV2_calcRoot *{box-sizing:border-box}
    #storageV2_calcRoot{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;max-width:900px;margin:20px auto;padding:0 16px;text-align:center}
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
  <div class="card">
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
  <div class="card">
    <h3>Storage Resiliency</h3>
    <p style="font-size:.85em;color:inherit;margin:0 0 10px">Available options depend on your cluster size.</p>
    <div id="storageV2_resiliencyOptions" class="res-options"></div>
  </div>

  <!-- Actions -->
  <div class="btn-row">
    <button class="btn btn-primary" id="storageV2_calcBtn">Calculate</button>
    <button class="btn btn-secondary" id="storageV2_exportPdfBtn" style="display:none">Export to PDF</button>
  </div>

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
      <a href="https://learn.microsoft.com/en-us/azure-stack/hci/concepts/plan-volumes" target="_blank">official Microsoft documentation</a>
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
      <a href="https://learn.microsoft.com/en-us/azure-stack/hci/concepts/plan-volumes#reserve-capacity" target="_blank">Microsoft reserve capacity documentation</a>.
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
    { id: "dual-parity", name: "Dual Parity",      desc: "Erasure coding with 2 parity stripes for space efficiency", minNodes: 4, maxNodes: 0, failures: 2 }
  ];

  function getEfficiency(resId, nodes) {
    if (resId === "three-way")   return 1 / 3;
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
     CAPACITY CALCULATION (shared)
     ================================================================ */
  function calcCapacity(nodes, drivesPerNode, driveCap, resId) {
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
    var volumeOH          = infra1 + clusterPerf + extraReserve;
    var remainingForUser  = Math.max(netUsable - volumeOH, 0);
    var userPerNode       = nodes > 0 ? remainingForUser / nodes : 0;

    return {
      nodes: nodes, drivesPerNode: drivesPerNode, driveCap: driveCap, resId: resId,
      efficiency: efficiency, rawPerNode: rawPerNode, totalRaw: totalRaw,
      reserveCapacity: reserveCapacity, effective: effective,
      usableAfterRes: usableAfterRes, resiliencyOverhead: resiliencyOverhead,
      netUsable: netUsable, netUsableTiB: netUsableTiB, storageEff: storageEff,
      infra1: infra1, clusterPerf: clusterPerf, extraReserve: extraReserve,
      volumeOH: volumeOH, remainingForUser: remainingForUser, userPerNode: userPerNode
    };
  }

  /* Reverse: find minimum drivesPerNode to reach targetNetUsable */
  function calcReverse(nodes, driveCap, targetNetUsable, resId) {
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
    var d = calcCapacity(nodes, drivesPerNode, driveCap, resId);
    d.feasible = drivesPerNode <= MAX_DRIVES;
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
    if (activeMode === "A") calculateForward();
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
        '<div class="res-eff">Efficiency: ' + (eff * 100).toFixed(1) + '% | Tolerates: ' + r.failures + ' failure' + (r.failures > 1 ? 's' : '') + '</div>' +
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
    var d          = calcCapacity(nodes, driveCount, driveCap, selectedResiliency);

    var rb = $("storageV2_resultBox");
    rb.style.display = "block";
    var h = "";
    h += "<strong>Cluster:</strong> " + nodes + " node" + (nodes > 1 ? "s" : "") + (nodes === 1 ? " (Single Node)" : "") + "<br>";
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
    rb.innerHTML = h;

    $("storageV2_chartsSection").style.display  = "block";
    $("storageV2_compareSection").style.display = "none";
    drawCapacityChart(d.netUsable, d.resiliencyOverhead, d.reserveCapacity, INFRA_OVERHEAD);
    drawVolumesChart(d.infra1, d.clusterPerf, d.userPerNode, nodes);

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

    var rb = $("storageV2_resultBox");
    rb.style.display = "block";
    rb.innerHTML =
      "<strong>Target Effective Storage:</strong> " + fmtTB(targetStorage) + "<br>" +
      "<strong>Cluster:</strong> " + nodes + " node" + (nodes > 1 ? "s" : "") + "<br>" +
      "<strong>Resiliency:</strong> " + resiliencyLabel(selectedResiliency) + " (" + (getEfficiency(selectedResiliency, nodes) * 100).toFixed(1) + "% efficiency)";

    $("storageV2_chartsSection").style.display  = "none";
    $("storageV2_overviewSection").style.display = "none";
    $("storageV2_compareSection").style.display = "block";

    var results = sizes.map(function(sz) {
      return calcReverse(nodes, sz, targetStorage, selectedResiliency);
    });

    // Find minimum headroom among feasible results that meet the target (most efficient)
    var minHeadroom = Infinity;
    results.forEach(function(r) {
      if (r.feasible && r.netUsable >= targetStorage) {
        var h = r.netUsable - targetStorage;
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
      var headroom = r.netUsable - targetStorage;
      var isBest   = r.feasible && r.netUsable >= targetStorage && Math.abs(headroom - minHeadroom) < 0.001;
      var trClass  = !r.feasible ? ' class="infeasible"' : (isBest ? ' class="best"' : "");
      var drivesCell = r.feasible
        ? r.drivesPerNode
        : r.drivesPerNode + " *";
      var totalDrives = r.feasible ? (r.drivesPerNode * nodes) : "-";
      var usableCell  = r.netUsable >= targetStorage
        ? '<span style="color:#2e7d32;font-weight:600">' + fmtTB(r.netUsable) + "</span>"
        : '<span style="color:#cc3300">' + fmtTB(r.netUsable) + "</span>";
      var headroomCell = (r.feasible && r.netUsable >= targetStorage)
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
     CHARTS
     ================================================================ */
  function drawCapacityChart(usable, resiliency, reserve, infra) {
    var cfg = {
      type: "doughnut",
      data: {
        labels: ["Net Usable", "Resiliency Overhead", "Reserve Capacity", "Infrastructure"],
        datasets: [{ data: [usable, resiliency, reserve, infra], borderWidth: 1,
          backgroundColor: ["rgba(0,122,255,.75)","rgba(90,200,250,.75)","rgba(175,175,175,.75)","rgba(255,149,0,.75)"] }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: "Capacity Breakdown", font: { size: 14 } },
          legend: { position: "bottom", labels: { boxWidth: 12 } }
        }
      }
    };
    if (capChart) capChart.destroy();
    capChart = new Chart($("storageV2_capacityChart").getContext("2d"), cfg);
  }

  function drawVolumesChart(infra1, clusterPerf, userPerNode, nodes) {
    var labels = ["Infrastructure_1", "ClusterPerfHistory"];
    var data   = [infra1, clusterPerf];
    for (var i = 1; i <= nodes; i++) { labels.push("UserStorage_" + i); data.push(userPerNode); }
    var cfg = {
      type: "bar",
      data: { labels: labels, datasets: [{ label: "Volume Size (TB)", data: data, backgroundColor: "rgba(0,122,255,.75)" }] },
      options: {
        indexAxis: "y", responsive: true, maintainAspectRatio: false,
        plugins: { title: { display: true, text: "Volume Distribution", font: { size: 14 } }, legend: { display: false } },
        scales: { x: { title: { display: true, text: "TB" }, beginAtZero: true }, y: { ticks: { autoSkip: false, font: { size: 11 } } } }
      }
    };
    if (volChart) volChart.destroy();
    volChart = new Chart($("storageV2_volumesChart").getContext("2d"), cfg);
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
    for (var n = 1; n <= d.nodes; n++) {
      row("UserStorage_" + n, fmtTB(d.remainingForUser) + " / " + d.nodes + " nodes", fmtTB(d.userPerNode));
    }
    total("Total Volume Allocation", fmtTB(d.volumeOH + d.remainingForUser));

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
     INITIAL RENDER
     ================================================================ */
  updateResiliencyOptions();

})();
</script>
</body>
</html>


### Pricing Calculator

<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    #pricingV2_calcRoot,
    #pricingV2_calcRoot *{box-sizing:border-box}
    #pricingV2_calcRoot{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;max-width:900px;margin:20px auto;padding:0 16px;text-align:center}
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
        <label for="pricingV2_coresPerNode">Physical Cores per Node</label>
        <input type="number" id="pricingV2_coresPerNode" value="16" min="1" max="128" step="1">
      </div>
    </div>
    <div style="margin-top:12px">
      <div class="chk-row">
        <input type="checkbox" id="pricingV2_waiveHostFee">
        <label for="pricingV2_waiveHostFee">Waive Azure Local Host Fee (saves 10/core/month)</label>
      </div>
      <div class="chk-row">
        <input type="checkbox" id="pricingV2_waiveWindowsLicense">
        <label for="pricingV2_waiveWindowsLicense">Waive Windows Server License Fee (saves 23.30/core/month)</label>
      </div>
      <div class="chk-row">
        <input type="checkbox" id="pricingV2_customLicenseChk">
        <label for="pricingV2_customLicenseChk">Use Custom Windows License Pricing (per Node)</label>
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
  </div>

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
      <li><strong>License Price:</strong> Host fee (10/core), Windows Server fee (23.30/core) - or custom pricing: monthly + one-time cost per node.</li>
      <li><strong>Related Costs:</strong> Additional one-time and monthly costs for external services (e.g., Backup, security software).</li>
      <li><strong>Service Price:</strong> Azure Virtual Desktop (AVD) and SQL Managed Instance (SQLmi) usage costs (monthly).</li>
    </ul>
    <p>Actual costs may vary depending on vendor quotes, hardware configurations, and licensing agreements.</p>
    <p>
      <strong>Hybrid Benefit Disclaimer:</strong><br>
      The Azure Local Host fee (10/core) and Windows Server fee (23.30/core) can be waived if you qualify for Azure Hybrid Benefit under an Enterprise Agreement (EA) or a Cloud Solution Provider (CSP) subscription. MPSA or OEM + SA is not supported, and Hybrid Benefit is not defined for Open Value. Consult the
      <a href="https://www.microsoft.com/licensing/terms/productoffering/MicrosoftAzure/EAEAS" target="_blank">Microsoft Product Terms (EA/CSP)</a>,
      <a href="https://www.microsoft.com/licensing/terms/productoffering/WindowsServerStandardDatacenterEssentials/SS" target="_blank">Microsoft Product Terms for Windows Server</a>, and
      <a href="https://learn.microsoft.com/en-us/windows-server/get-started/azure-hybrid-benefit?tabs=azure-local#getting-azure-hybrid-benefit" target="_blank">Azure Hybrid Benefit for Windows Server</a>
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
      AVD costs are estimated at 0.01 per vCPU per hour. SQLmi pricing depends on tier, licensing model, and reservation term. These calculations are illustrative. For more info visit
      <a href="https://azure.microsoft.com/en-us/pricing/details/azure-arc/data-services/" target="_blank">Azure Arc Data Services Pricing</a>.
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

  /* ---- checkbox linking ---- */
  $("pricingV2_customLicenseChk").addEventListener("change", function () {
    $("pricingV2_waiveWindowsLicense").checked = this.checked;
    $("pricingV2_customLicenseContainer").style.display = this.checked ? "block" : "none";
  });
  $("pricingV2_waiveWindowsLicense").addEventListener("change", function () {
    $("pricingV2_customLicenseChk").checked = this.checked;
    $("pricingV2_customLicenseContainer").style.display = this.checked ? "block" : "none";
  });

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

  /* ================================================================
     MAIN CALCULATION
     ================================================================ */
  function calculate() {
    const nodes      = num($("pricingV2_nodes"));
    const nodeUnit   = num($("pricingV2_pricePerNode"));
    const switches   = num($("pricingV2_switches"));
    const switchUnit = num($("pricingV2_pricePerSwitch"));
    const nodesCost  = nodes * nodeUnit;
    const switchCost = switches * switchUnit;
    const hwCost     = nodesCost + switchCost;

    const coresPerNode = num($("pricingV2_coresPerNode"));
    const totalCores   = nodes * coresPerNode;
    const hostFee      = $("pricingV2_waiveHostFee").checked ? 0 : totalCores * 10;

    let winMonthly = 0, winOneTime = 0;
    if ($("pricingV2_customLicenseChk").checked) {
      winMonthly = num($("pricingV2_customWinMonthly")) * nodes;
      winOneTime = num($("pricingV2_customWinOneTime"))  * nodes;
    } else if (!$("pricingV2_waiveWindowsLicense").checked) {
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

    const avdVCPUs = num($("pricingV2_avdVCPUs"));
    const avdHours = num($("pricingV2_avdHours"));
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
    const yearlyTotal  = oneTimeTotal + monthlyTotal * 12;
    const threeYearTotal = oneTimeTotal + monthlyTotal * 36;

    /* ---- quick result ---- */
    const rb = $("pricingV2_resultBox");
    rb.style.display = "block";
    rb.innerHTML =
      "<strong>Total One-Time Cost:</strong> " + fmt(oneTimeTotal) + "<br>" +
      "<strong>Total Monthly Cost:</strong> " + fmt(monthlyTotal) + "<br>" +
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
      coresPerNode, totalCores,
      hostFeeWaived: $("pricingV2_waiveHostFee").checked,
      hostFee,
      winLicenseMode: $("pricingV2_customLicenseChk").checked ? "custom" : ($("pricingV2_waiveWindowsLicense").checked ? "waived" : "default"),
      winMonthly, winOneTime,
      backupOTC, backupMonth, logsOTC, logsMonth,
      installOTC, installMonth, partnerOTC, partnerMonth,
      otherOTC, otherMonth, thirdOneTime, thirdMonthly,
      avdVCPUs, avdHours, avdCost,
      sqlVcores, sqlHours, sqlTier, sqlLic, sqlTerm, sqlMonthlyRate, sqlHourlyRate, sqlCost,
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
    row("Nodes Cost", d.nodes + " nodes x " + fmt(d.nodeUnit) + "/node", fmt(d.nodesCost));
    row("Switches Cost", d.switches + " switches x " + fmt(d.switchUnit) + "/switch", fmt(d.switchCost));
    total("Total Hardware", fmt(d.hwCost));

    sec("Licensing");
    row("Total Physical Cores", d.nodes + " nodes x " + d.coresPerNode + " cores/node", d.totalCores + " cores");
    row("Azure Local Host Fee (monthly)", d.hostFeeWaived ? "Waived" : d.totalCores + " cores x " + c + "10/core", fmt(d.hostFee));

    if (d.winLicenseMode === "custom") {
      row("Windows License (monthly)", "Custom: " + fmt(d.winMonthly / d.nodes) + "/node x " + d.nodes + " nodes", fmt(d.winMonthly));
      row("Windows License (one-time)", "Custom: " + fmt(d.winOneTime / d.nodes) + "/node x " + d.nodes + " nodes", fmt(d.winOneTime));
    } else if (d.winLicenseMode === "waived") {
      row("Windows License (monthly)", "Waived", fmt(0));
    } else {
      row("Windows License (monthly)", d.totalCores + " cores x " + c + "23.30/core", fmt(d.winMonthly));
    }

    sec("Related / Third-Party");
    if (d.backupOTC || d.backupMonth)   { row("Backup (OTC)", "User-defined", fmt(d.backupOTC));   row("Backup (monthly)", "User-defined", fmt(d.backupMonth)); }
    if (d.logsOTC || d.logsMonth)       { row("Logs / Monitoring (OTC)", "User-defined", fmt(d.logsOTC));     row("Logs / Monitoring (monthly)", "User-defined", fmt(d.logsMonth)); }
    if (d.installOTC || d.installMonth) { row("Installation (OTC)", "User-defined", fmt(d.installOTC)); row("Installation (monthly)", "User-defined", fmt(d.installMonth)); }
    if (d.partnerOTC || d.partnerMonth) { row("External Partner Mgmt (OTC)", "User-defined", fmt(d.partnerOTC)); row("External Partner Mgmt (monthly)", "User-defined", fmt(d.partnerMonth)); }
    if (d.otherOTC || d.otherMonth)     { row("Other (OTC)", "User-defined", fmt(d.otherOTC));     row("Other (monthly)", "User-defined", fmt(d.otherMonth)); }
    total("Related Total (OTC)", fmt(d.thirdOneTime));
    total("Related Total (monthly)", fmt(d.thirdMonthly));

    sec("Azure Services (Monthly)");
    row("AVD Cost", d.avdVCPUs + " vCPUs x " + c + "0.01/vCPU/hr x " + d.avdHours + " hrs", fmt(d.avdCost));
    row("SQLmi Rate", d.sqlTier + " / " + d.sqlLic + " / " + d.sqlTerm, fmt(d.sqlMonthlyRate) + "/vCore/month");
    row("SQLmi Cost", d.sqlVcores + " vCores x " + c + d.sqlHourlyRate.toFixed(4) + "/hr x " + d.sqlHours + " hrs", fmt(d.sqlCost));

    sec("Totals");
    total("Total One-Time Cost", fmt(d.oneTimeTotal));
    total("Total Monthly Cost", fmt(d.monthlyTotal));
    total("Estimated 1-Year Total", fmt(d.yearlyTotal));
    total("Estimated 3-Year Total", fmt(d.threeYearTotal));

    rows.push("</tbody>");
    $("pricingV2_overviewTable").innerHTML = rows.join("");
  }

  /* ================================================================
     CHARTS
     ================================================================ */
  const chartOpts = (title, yLabel) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { title: { display: true, text: title, font: { size: 14 } }, legend: { display: false } },
    scales: { y: { beginAtZero: true, title: { display: true, text: yLabel } } }
  });

  function addDS(list, label, vals, color, stack) {
    if (vals.some(v => v > 0)) list.push({ label, data: vals, backgroundColor: color, stack });
  }
  function filterCategories(labels, datasets) {
    const keep = labels.map((_, i) => datasets.some(ds => ds.data[i] > 0));
    return {
      labels: labels.filter((_, i) => keep[i]),
      datasets: datasets.map(ds => ({ ...ds, data: ds.data.filter((_, i) => keep[i]) })).filter(ds => ds.data.some(v => v > 0))
    };
  }

  function drawTotalChart(oneT, monthT, yearT) {
    const cur = $("pricingV2_currencySelect").value;
    const cfg = {
      type: "bar",
      data: { labels: ["One-Time", "Monthly", "1-Year Est."], datasets: [{ data: [oneT, monthT, yearT], backgroundColor: ["rgba(0,122,255,.75)", "rgba(88,86,214,.75)", "rgba(52,199,89,.75)"] }] },
      options: chartOpts("Cost Summary", cur)
    };
    if (costChart) costChart.destroy();
    costChart = new Chart($("pricingV2_costChart").getContext("2d"), cfg);
  }

  function drawOneTimeChart(nodesCost, switchCost, winOneTime, thirdOneTime) {
    const cur = $("pricingV2_currencySelect").value;
    const base = ["Hardware", "Windows License", "Third-Party"];
    const raw = [];
    addDS(raw, "Nodes",       [nodesCost,  0,          0],           "rgba(0,122,255,.75)", "HW");
    addDS(raw, "Switches",    [switchCost, 0,          0],           "rgba(90,200,250,.75)","HW");
    addDS(raw, "Windows Lic.",[0,          winOneTime, 0],           "rgba(88,86,214,.75)", "WIN");
    addDS(raw, "Third-Party", [0,          0,          thirdOneTime],"rgba(175,175,175,.75)","3P");
    const { labels, datasets } = filterCategories(base, raw);
    const cfg = {
      type: "bar", data: { labels, datasets },
      options: { ...chartOpts("One-Time Breakdown", cur), plugins: { ...chartOpts("One-Time Breakdown", cur).plugins, legend: { position: "bottom", labels: { boxWidth: 12 } } }, scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true, title: { display: true, text: cur } } } }
    };
    if (oneTimeBreakdownChart) oneTimeBreakdownChart.destroy();
    oneTimeBreakdownChart = new Chart($("pricingV2_oneTimeBreakdownChart").getContext("2d"), cfg);
  }

  function drawMonthlyChart(host, win, avd, sql, third) {
    const cur = $("pricingV2_currencySelect").value;
    const base = ["Licensing", "AVD", "SQLmi", "Third-Party"];
    const raw = [];
    addDS(raw, "Host Fee",    [host, 0,   0,   0],    "rgba(0,122,255,.75)",  "LIC");
    addDS(raw, "Windows Lic.",[win,  0,   0,   0],    "rgba(90,200,250,.75)", "LIC");
    addDS(raw, "AVD",         [0,    avd, 0,   0],    "rgba(88,86,214,.75)",  "AVD");
    addDS(raw, "SQLmi",       [0,    0,   sql, 0],    "rgba(52,199,89,.75)",  "SQL");
    addDS(raw, "Third-Party", [0,    0,   0,   third],"rgba(175,175,175,.75)","3P");
    const { labels, datasets } = filterCategories(base, raw);
    const cfg = {
      type: "bar", data: { labels, datasets },
      options: { ...chartOpts("Monthly Breakdown", cur), plugins: { ...chartOpts("Monthly Breakdown", cur).plugins, legend: { position: "bottom", labels: { boxWidth: 12 } } }, scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true, title: { display: true, text: cur } } } }
    };
    if (costBreakdownChart) costBreakdownChart.destroy();
    costBreakdownChart = new Chart($("pricingV2_costBreakdownChart").getContext("2d"), cfg);
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

  /* ---- events ---- */
  $("pricingV2_calcBtn").addEventListener("click", calculate);
  $("pricingV2_exportPdfBtn").addEventListener("click", exportPdf);
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
> [LinkedIn – Cosmos Darwin](https://www.linkedin.com/in/cosmosd/)

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
