---
permalink: /azurelocal-calculator/
title: "Azure Local Calculator"
excerpt: "A comprehensive Azure Local Calculator covering Storage, CPU and Pricing estimation."
redirect_from:
  - /azl-storage-calculator/
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
  caption: "Photo credit: [ChatGPT](https://chatgpt.com)"
---

## Introduction

On this page, I plan to set up a series of calculators to be used in the Azure Local environment.

**Important Disclaimer:** These calculators are currently under active development and testing. Therefore, I cannot guarantee their accuracy, completeness, or the validity of their calculations until the testing phase concludes. The testing period is estimated to finish by the end of March or early April.  
{: .notice--danger}

Currently planned calculators include:

- Storage Calculator  
- CPU Calculator  
- Pricing Calculator  

Please treat the results from these calculators as indicative and preliminary until official confirmation after the testing period.

## Storage Calculator

<html lang="en">
<head>
  <meta charset="UTF-8">
  <!-- Load Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    /* Let the page background show through */
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    /* Container aligned to the left in the article flow */
    .container {
      margin: 20px 0;
      width: auto;
      text-align: center;
    }
    h2 {
      font-size: 1.5em;
      margin-bottom: 20px;
    }
    .slider-container {
      margin: 20px 0;
      text-align: left;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 600;
    }
    input[type=range] {
      width: 100%;
      margin: 10px 0;
    }
    input[type=number] {
      width: 100%;
      padding: 8px;
      border: 1px solid #555;
      border-radius: 8px;
      box-sizing: border-box;
      margin-top: 5px;
    }
    button {
      background-color: #007aff;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 10px 20px;
      font-size: 1em;
      cursor: pointer;
      margin-top: 20px;
    }
    button:hover {
      background-color: #005bb5;
    }
    .result {
      border-radius: 8px;
      padding: 15px;
      margin-top: 20px;
      text-align: left;
      font-size: 0.95em;
    }
    .disclaimer {
      font-size: 0.8em;
      margin-top: 20px;
      text-align: left;
    }
    #chartContainer, #volumesChartContainer {
      margin-top: 20px;
    }
    /* White background for chart canvases */
    #chartContainer canvas, #volumesChartContainer canvas {
      background-color: #fff;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <div class="container">
    
    <div class="slider-container">
      <label for="nodes">Number of Nodes (<span id="nodesValue">1</span>)</label>
      <input type="range" id="nodes" min="1" max="16" value="1" 
             oninput="document.getElementById('nodesValue').innerText = this.value;">
    </div>
    
    <div class="slider-container">
      <label for="disks">Number of NVMe Disks per Node (<span id="disksValue">2</span>)</label>
      <input type="range" id="disks" min="2" max="24" value="2" 
             oninput="document.getElementById('disksValue').innerText = this.value;">
    </div>
    
    <div class="slider-container">
      <label for="capacity">Specified Capacity per Disk (TB)</label>
      <input type="number" id="capacity" placeholder="e.g., 3.5" step="0.1" min="0.1">
    </div>
    
    <div class="slider-container">
      <label for="efficiency">Capacity Efficiency (%) (<span id="efficiencyValue">92</span>%)</label>
      <input type="range" id="efficiency" min="50" max="100" value="92" 
             oninput="document.getElementById('efficiencyValue').innerText = this.value;">
    </div>
    
    <button onclick="calculateCapacity()">Calculate Capacity</button>
    <div id="result" class="result"></div>
    
    <!-- Storage Capacity Chart (stacked) -->
    <div id="chartContainer">
      <canvas id="capacityChart"></canvas>
    </div>

    <!-- Volumes Chart: horizontal, one bar per volume -->
    <div id="volumesChartContainer">
      <canvas id="volumesChart"></canvas>
    </div>
    
    <div class="disclaimer">
      <p><strong>Redundancy Disclaimer:</strong> When using 1 or 2 nodes, S2D employs two-way mirror redundancy. When using 3 or more nodes, three-way mirror redundancy is used. For a single-node configuration, no storage network is required (
        <a href="https://learn.microsoft.com/en-us/azure/azure-local/plan/single-server-deployment?view=azloc-24112#storage-network-vlans" target="_blank"><em>Optional – this pattern doesn't require a storage network</em></a>
      ). We assume that in this case a local mirror is used to avoid data loss in case of disk failure.</p>
      <p><strong>Reserved Capacity Disclaimer:</strong> For multi-node configurations, the calculation reserves capacity equivalent to one disk per node (i.e. <em>Reserved Capacity = Number of Nodes × Capacity per Disk</em>) to ensure there is sufficient unallocated space for repairs after a disk failure. For a single-node configuration, no reserved capacity is applied.</p>
      <p><strong>NVMe & Performance Disclaimer:</strong> In Azure Local, NVMe drives are used as both cache and capacity. For optimal performance, RDMA must be used. Increasing the number of NVMe drives per node enhances IOPS and throughput via parallelism, but it also requires proper RDMA network configuration to avoid potential bottlenecks.</p>
      <p><strong>Capacity Efficiency Factor:</strong> The specified capacity of an NVMe is typically higher than the usable capacity due to OS overhead, overprovisioning, spare sectors, and recovery partitions. In this calculator, a capacity efficiency factor (default 92%) is applied to convert the specified capacity to usable capacity. This value can be increased to 100% if you wish to use the full specified capacity.</p>
      <p><strong>Storage Configuration Disclaimer:</strong> Storage is configured in Azure Local using the <code>configurationMode</code> parameter (
        <a href="https://learn.microsoft.com/en-us/azure/templates/microsoft.azurestackhci/clusters/deploymentsettings?pivots=deployment-language-arm-template#storage-1" target="_blank">Documentation</a>
      ). By default, this mode is set to <em>Express</em> and storage is configured as per best practices based on the number of nodes in the cluster. Allowed values are <em>'Express'</em>, <em>'InfraOnly'</em>, and <em>'KeepStorage'</em>. However, the exact best practices cannot be verified, and therefore the calculator assumes the reserved capacity as described.</p>
      <p><strong>Volume Assignment Disclaimer:</strong> During cloud deployment, the assignment of volumes within the storage pool (named SU1_Pool) is automated. This includes a fixed 250 GB (<em>Infrastructure_1</em>) volume for the ARC Resource Bridge and AKS images, a 20 GB (<em>ClusterPerformanceHistory</em>) volume for cluster statistics, and the remaining usable capacity (minus an extra 7 GB) is divided equally among <em>UserStorage</em> volumes (one per node). These values are approximate and subject to change based on deployment specifics.</p>
    </div>
  </div>

  <script>
    let chart, volumesChart; // Global variables for Chart.js instances

    function calculateCapacity() {
      var nodes = parseFloat(document.getElementById("nodes").value);
      var disks = parseFloat(document.getElementById("disks").value);
      var capacityPerDisk = parseFloat(document.getElementById("capacity").value);
      var efficiency = parseFloat(document.getElementById("efficiency").value) / 100;
      
      if (isNaN(nodes) || isNaN(disks) || isNaN(capacityPerDisk) || capacityPerDisk <= 0) {
        alert("Please enter valid values for all fields.");
        return;
      }
      
      // Total Raw Capacity calculation (in TB) using the efficiency factor:
      var totalRaw = nodes * disks * capacityPerDisk * efficiency;
      
      // For multi-node clusters, reserved capacity equals one disk per node.
      // For a single-node configuration, no reserved capacity is applied.
      var reserved = (nodes === 1) ? 0 : nodes * capacityPerDisk * efficiency;
      
      // Effective Capacity available for volumes:
      var effective = totalRaw - reserved;
      
      // Redundancy: 2-way if 1-2 nodes, 3-way if 3+ nodes.
      var redundancyFactor = (nodes < 3) ? 2 : 3;
      
      // Usable Capacity: effective capacity divided by redundancy factor.
      var usable = effective / redundancyFactor;
      
      // Resiliency is the remaining effective capacity after usable capacity.
      var resiliency = effective - usable;
      
      var resultHtml = "<strong>Total Raw Capacity:</strong> " + totalRaw.toFixed(2) + " TB<br>" +
                       "<strong>Reserved Capacity:</strong> " + reserved.toFixed(2) + " TB<br>" +
                       "<strong>Effective Capacity:</strong> " + effective.toFixed(2) + " TB<br>" +
                       "<strong>Redundancy:</strong> " + ((redundancyFactor === 2) ? 'Two-Way Mirror' : 'Three-Way Mirror') + "<br>" +
                       "<strong>Usable Capacity:</strong> " + usable.toFixed(2) + " TB";
      
      document.getElementById("result").innerHTML = resultHtml;
      
      updateChart(totalRaw, usable, resiliency, reserved);
      updateVolumesChart(usable, nodes);
    }
    
    function updateChart(totalRaw, usable, resiliency, reserved) {
      // Stacked bar chart for Storage Capacity
      const data = {
        labels: ['Capacity'],
        datasets: [
          {
            label: 'Usable Capacity',
            data: [usable],
            backgroundColor: 'rgba(128,191,255,0.9)',
            stack: 'combined',
            order: 1
          },
          {
            label: 'Resiliency',
            data: [resiliency],
            backgroundColor: 'rgba(179,209,255,0.9)',
            stack: 'combined',
            order: 2
          },
          {
            label: 'Reserved Capacity',
            data: [reserved],
            backgroundColor: 'rgba(211,211,211,0.9)',
            stack: 'combined',
            order: 3
          }
        ]
      };
      
      const config = {
        type: 'bar',
        data: data,
        options: {
          indexAxis: 'x',
          responsive: true,
          plugins: {
            legend: { position: 'bottom' }
          },
          scales: {
            x: {
              stacked: true,
              title: { display: true, text: 'Capacity (TB)' }
            },
            y: { stacked: true, ticks: { display: false } }
          }
        }
      };
      
      if (chart) { chart.destroy(); }
      const ctx = document.getElementById('capacityChart').getContext('2d');
      chart = new Chart(ctx, config);
    }
    
    function updateVolumesChart(usable, nodes) {
      // Fixed volumes (in TB)
      var infrastructure = 0.25;      // 250 GB
      var clusterPerformance = 0.02;    // 20 GB
      var extra = 0.007;                // 7 GB
      
      // Remaining usable capacity for UserStorage volumes:
      var remaining = usable - (infrastructure + clusterPerformance + extra);
      if (remaining < 0) remaining = 0;
      
      // Each node gets an equal share of the remaining capacity:
      var userStoragePerNode = remaining / nodes;
      
      // Prepare labels and data arrays:
      var labels = ['Infrastructure_1', 'ClusterPerformanceHistory'];
      var dataValues = [infrastructure, clusterPerformance];
      
      // Add a UserStorage volume for each node:
      for (var i = 1; i <= nodes; i++) {
        labels.push("UserStorage_" + i);
        dataValues.push(userStoragePerNode);
      }
      
      const data = {
        labels: labels,
        datasets: [
          {
            label: 'Volume Size (TB)',
            data: dataValues,
            backgroundColor: 'rgba(128,191,255,0.9)'
          }
        ]
      };
      
      const config = {
        type: 'bar',
        data: data,
        options: {
          indexAxis: 'y', // Horizontal bars
          responsive: true,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: {
              title: { display: true, text: 'Volume Size (TB)' }
            },
            y: {
              ticks: { autoSkip: false }
            }
          }
        }
      };
      
      if (volumesChart) { volumesChart.destroy(); }
      const ctx = document.getElementById('volumesChart').getContext('2d');
      volumesChart = new Chart(ctx, config);
    }
  </script>
</body>
</html>



## Pricing Calculator

<html lang="en">
<head>
  <meta charset="UTF-8">
  <!-- Load Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    /* Let the page background show through */
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    /* Container aligned to the left in the article flow */
    .container {
      margin: 20px 0;
      width: auto;
      text-align: center;
    }
    h3 {
      font-size: 1.5em;
      margin-bottom: 20px;
    }
    .slider-container {
      margin: 20px 0;
      text-align: left;
    }
    .checkbox-container {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    .checkbox-container input[type="checkbox"] {
      margin-right: 8px;
      transform: scale(1.2);
      vertical-align: middle;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 600;
    }
    input[type=range] {
      width: 100%;
      margin: 10px 0;
    }
    input[type=number],
    select {
      width: 100%;
      padding: 8px;
      border: 1px solid #555;
      border-radius: 8px;
      box-sizing: border-box;
      margin-top: 5px;
    }
    /* Dark grey background for dropdown with white text */
    select {
      background-color: #444;
      color: #fff;
    }
    button {
      background-color: #007aff;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 10px 20px;
      font-size: 1em;
      cursor: pointer;
      margin-top: 20px;
    }
    button:hover {
      background-color: #005bb5;
    }
    /* Results shown directly (plain text) */
    #result_price {
      margin-top: 20px;
      text-align: left;
      font-size: 0.95em;
    }
    .chart-container {
      margin-top: 20px;
      text-align: center;
      width: auto;
    }
    /* White background for chart canvases */
    #oneTimeBreakdownChart,
    #costChart,
    #costBreakdownChart {
      background-color: #fff;
      border-radius: 8px;
    }
    .disclaimer {
      font-size: 0.8em;
      margin-top: 20px;
      text-align: left;
    }
    .disclaimer a {
      color: #007aff;
      text-decoration: none;
    }
    .disclaimer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    
    <!-- Infrastructure Price Section -->
    <h3>Infrastructure Price</h3>
    <div class="slider-container">
      <label for="nodes_price">Number of Nodes (<span id="nodesValue_price">1</span>)</label>
      <input type="range" id="nodes_price" min="1" max="16" value="1"
             oninput="document.getElementById('nodesValue_price').innerText = this.value;">
    </div>
    <div class="slider-container">
      <label for="pricePerNode_price">Price per Node (EUR)</label>
      <input type="number" id="pricePerNode_price" placeholder="e.g., 15000" step="100" min="0">
    </div>
    <div class="slider-container">
      <label for="switches_price">Number of Switches (<span id="switchesValue_price">0</span>)</label>
      <input type="range" id="switches_price" min="0" max="8" value="0"
             oninput="document.getElementById('switchesValue_price').innerText = this.value;">
    </div>
    <div class="slider-container">
      <label for="pricePerSwitch_price">Price per Switch (EUR)</label>
      <input type="number" id="pricePerSwitch_price" placeholder="e.g., 5000" step="50" min="0">
    </div>
    
    <!-- License Price Section -->
    <h3>License Price</h3>
    <div class="slider-container">
      <label for="coresPerNode_price">Cores per Node (<span id="coresPerNodeValue_price">16</span>)</label>
      <input type="range" id="coresPerNode_price" min="1" max="64" value="16"
             oninput="document.getElementById('coresPerNodeValue_price').innerText = this.value;">
    </div>
    <div class="checkbox-container">
      <input type="checkbox" id="waiveHostFee_price">
      <label for="waiveHostFee_price">Waive Azure Local Host Fee (Saving €10/core)</label>
    </div>
    <div class="checkbox-container">
      <input type="checkbox" id="waiveWindowsLicense_price">
      <label for="waiveWindowsLicense_price">Waive Windows Server License Fee (Saving €23.30/core)</label>
    </div>
    <div class="checkbox-container">
      <input type="checkbox" id="customLicensePrice_price" onchange="linkCheckboxes()">
      <label for="customLicensePrice_price">Use Custom Windows License Pricing (per Node)</label>
    </div>
    <script>
      // Link the two checkboxes so that their states are always identical.
      function linkCheckboxes() {
        const waiveBox = document.getElementById("waiveWindowsLicense_price");
        const customBox = document.getElementById("customLicensePrice_price");
        waiveBox.checked = customBox.checked;
        toggleCustomLicenseFields_price();
      }
      document.getElementById("waiveWindowsLicense_price").addEventListener("change", function() {
        document.getElementById("customLicensePrice_price").checked = this.checked;
        toggleCustomLicenseFields_price();
      });
    </script>
    <div class="slider-container" id="customLicenseContainer_price" style="display: none;">
      <label for="customWindowsPricePerNode_price">Windows Server Datacenter License (EUR/month) per Node</label>
      <input type="number" id="customWindowsPricePerNode_price" placeholder="e.g., 500" step="0.1" min="0">
      
      <label for="oneTimeWindowsLicensePerNode_price">One-Time Datacenter License (EUR) per Node</label>
      <input type="number" id="oneTimeWindowsLicensePerNode_price" placeholder="e.g., 3000" step="100" min="0">
    </div>
    
    <!-- Third-Party Cost Section -->
    <h3>Third-Party Licenses/Cost</h3>
    <div class="slider-container">
      <label for="thirdPartyOneTime_price">One-Time Third-Party Cost (EUR)</label>
      <input type="number" id="thirdPartyOneTime_price" placeholder="e.g., 1000" step="100" min="0">
    </div>
    <div class="slider-container">
      <label for="thirdPartyMonthly_price">Monthly Third-Party Cost (EUR)</label>
      <input type="number" id="thirdPartyMonthly_price" placeholder="e.g., 50" step="10" min="0">
    </div>
    
    <!-- Service Price Section -->
    <h3>Service Price</h3>
    <div class="slider-container">
      <label for="avdVCPUs_price">AVD vCPUs</label>
      <input type="number" id="avdVCPUs_price" placeholder="e.g., 32" step="1" min="0">
    </div>
    <div class="slider-container">
      <label for="avdHours_price">AVD Usage Hours (<span id="avdHoursValue_price">280</span>)</label>
      <input type="range" id="avdHours_price" min="1" max="730" value="280"
             oninput="document.getElementById('avdHoursValue_price').innerText = this.value;">
    </div>
    <div class="slider-container">
      <label for="sqlVcores_price">SQL Managed Instance (SQLmi) vCores</label>
      <input type="number" id="sqlVcores_price" placeholder="e.g., 4" step="1" min="0">
    </div>
    <div class="slider-container">
      <label for="sqlHours_price">SQLmi Usage Hours (<span id="sqlHoursValue_price">280</span>)</label>
      <input type="range" id="sqlHours_price" min="1" max="730" value="280"
             oninput="document.getElementById('sqlHoursValue_price').innerText = this.value;">
    </div>
    <div class="slider-container">
      <label for="sqlTier_price">SQLmi Tier</label>
      <select id="sqlTier_price">
        <option value="General Purpose">General Purpose</option>
        <option value="Business Critical">Business Critical</option>
      </select>
    </div>
    <div class="slider-container">
      <label for="sqlLicensing_price">SQLmi Licensing Model</label>
      <select id="sqlLicensing_price">
        <option value="License Included">License Included</option>
        <option value="Azure Hybrid Benefit">Azure Hybrid Benefit</option>
      </select>
    </div>
    <div class="slider-container">
      <label for="sqlTerm_price">Reservation Term</label>
      <select id="sqlTerm_price">
        <option value="PAYG">PAYG</option>
        <option value="1 Year RI">1 Year RI</option>
        <option value="3 Year RI">3 Year RI</option>
      </select>
    </div>
    
    <button onclick="calculatePricing_price()">Calculate Pricing</button>
    
    <!-- Results: displayed directly (plain text) -->
    <div id="result_price"></div>
    
    <!-- Chart 1: Fixed vs. Variable Costs -->
    <div class="chart-container">
      <canvas id="costChart"></canvas>
    </div>
    
    <!-- Chart 2: Fixed Costs Breakdown -->
    <div class="chart-container">
      <canvas id="oneTimeBreakdownChart"></canvas>
    </div>
    
    <!-- Chart 3: Recurring Costs Breakdown (separate bars) -->
    <div class="chart-container">
      <canvas id="costBreakdownChart"></canvas>
    </div>
    
    <!-- Disclaimers -->
    <div class="disclaimer">
      <p>
        <strong>Disclaimer – Pricing Calculator:</strong><br>
        This <em>Pricing Calculator</em> is provided for informational purposes only and includes:
        <ul>
          <li><strong>Infrastructure Price:</strong> Node and switch costs (one‑time).</li>
          <li><strong>License Price:</strong> Host fee (€10/core), Windows Server fee (€23.30/core) – or, if using custom pricing, a monthly cost per node plus a one‑time cost per node for Datacenter licenses.</li>
          <li><strong>Third‑Party Costs:</strong> Additional one‑time and monthly costs for external services (e.g., Backup, security software, etc.).</li>
          <li><strong>Service Price:</strong> Azure Virtual Desktop (AVD) and SQL Managed Instance (SQLmi) usage costs (monthly).</li>
        </ul>
        Actual costs may vary depending on vendor quotes, hardware configurations, and licensing agreements.
      </p>
      <p>
        <strong>Hybrid Benefit Disclaimer:</strong><br>
        The Azure Local Host fee (€10/core) and Windows Server fee (€23.30/core) can be waived if you qualify for Azure Hybrid Benefit under an Enterprise Agreement (EA) or a Cloud Solution Provider (CSP) subscription. MPSA or OEM + SA is not supported, and Hybrid Benefit is not defined for Open Value. Consult the 
        <a href="https://www.microsoft.com/licensing/terms/productoffering/MicrosoftAzure/EAEAS" target="_blank">Microsoft Product Terms (EA/CSP)</a>, 
        <a href="https://www.microsoft.com/licensing/terms/productoffering/WindowsServerStandardDatacenterEssentials/SS" target="_blank">Microsoft Product Terms for Windows Server</a>, and 
        <a href="https://learn.microsoft.com/en-us/windows-server/get-started/azure-hybrid-benefit?tabs=azure-local#getting-azure-hybrid-benefit" target="_blank">Azure Hybrid Benefit for Windows Server</a>
        for specifics. Product Terms override general documentation.
      </p>
      <p>
        <strong>Windows Server License Disclaimer:</strong><br>
        By default, a Windows Server guest fee of €23.30/core/month is applied unless waived or supplemented by custom pricing. For custom pricing, you can enter a monthly cost per node plus a one‑time cost per node for Datacenter licenses. Confirm eligibility and final costs with your licensing provider.
      </p>
      <p>
        <strong>Third‑Party License Disclaimer:</strong><br>
        This calculator includes fields for additional one‑time and monthly third‑party costs (e.g., Backup, security software, etc.). These values are illustrative; actual third‑party costs depend on vendor quotes and licensing agreements.
      </p>
      <p>
        <strong>AVD and SQLmi Disclaimer:</strong><br>
        Azure Virtual Desktop (AVD) costs are estimated at €0.01 per vCPU per hour. SQL Managed Instance (SQLmi) pricing depends on tier (General Purpose or Business Critical), licensing model (License Included or Azure Hybrid Benefit), and reservation term (PAYG, 1 Year RI, or 3 Year RI). These calculations are illustrative. For more information on Azure Arc–enabled data services, please visit <a href="https://azure.microsoft.com/en-us/pricing/details/azure-arc/data-services/" target="_blank">Azure Arc Data Services Pricing</a>. Always refer to official Microsoft documentation for up-to-date pricing.
      </p>
      <p>
        <strong>No Warranty:</strong><br>
        All information in this Pricing Calculator is provided “as is” with no warranties, express or implied. It does not represent official Microsoft documentation. Always verify your specific agreements, product terms, and quotes for accurate pricing and licensing details.
      </p>
    </div>
  </div>
  
  <script>
    // SQL Managed Instance pricing data (per vCore/month in Euros)
    const sqlPrices = {
      "General Purpose": {
        "License Included": {
          "PAYG": 116.73,
          "1 Year RI": 107.55,
          "3 Year RI": 88.52
        },
        "Azure Hybrid Benefit": {
          "PAYG": 47.25,
          "1 Year RI": 38.07,
          "3 Year RI": 19.04
        }
      },
      "Business Critical": {
        "License Included": {
          "PAYG": 355.74,
          "1 Year RI": 336.70,
          "3 Year RI": 298.63
        },
        "Azure Hybrid Benefit": {
          "PAYG": 95.19,
          "1 Year RI": 76.15,
          "3 Year RI": 38.07
        }
      }
    };

    let costChart = null;           // Chart 1: Fixed vs. Variable Costs
    let oneTimeBreakdownChart = null; // Chart 2: Fixed Costs Breakdown
    let costBreakdownChart = null;    // Chart 3: Recurring Costs Breakdown

    function toggleCustomLicenseFields_price() {
      const customCheckbox = document.getElementById("customLicensePrice_price");
      const displayStyle = customCheckbox.checked ? "block" : "none";
      document.getElementById("customLicenseContainer_price").style.display = displayStyle;
    }
    
    // Link the two checkboxes so they always share the same state.
    function linkCheckboxes() {
      const waiveBox = document.getElementById("waiveWindowsLicense_price");
      const customBox = document.getElementById("customLicensePrice_price");
      waiveBox.checked = customBox.checked;
      toggleCustomLicenseFields_price();
    }
    document.getElementById("waiveWindowsLicense_price").addEventListener("change", function() {
      document.getElementById("customLicensePrice_price").checked = this.checked;
      toggleCustomLicenseFields_price();
    });
    document.getElementById("customLicensePrice_price").addEventListener("change", function() {
      document.getElementById("waiveWindowsLicense_price").checked = this.checked;
      toggleCustomLicenseFields_price();
    });
    
    function calculatePricing_price() {
      // 1) Infrastructure Price (One-Time)
      const nodes = parseFloat(document.getElementById("nodes_price").value);
      const pricePerNode = parseFloat(document.getElementById("pricePerNode_price").value) || 0;
      const switches = parseFloat(document.getElementById("switches_price").value);
      const pricePerSwitch = parseFloat(document.getElementById("pricePerSwitch_price").value) || 0;
      const hardwareCost = (nodes * pricePerNode) + (switches * pricePerSwitch);
      
      // 2) License Price
      const coresPerNode = parseFloat(document.getElementById("coresPerNode_price").value);
      const totalCores = nodes * coresPerNode;
      const waiveHostFee = document.getElementById("waiveHostFee_price").checked;
      const customLicensePriceChecked = document.getElementById("customLicensePrice_price").checked;
      
      const hostFee = waiveHostFee ? 0 : (totalCores * 10);
      
      let recurringWindowsLicense = 0;
      let oneTimeWindowsLicense = 0;
      if (customLicensePriceChecked) {
        const customWindowsPricePerNode = parseFloat(document.getElementById("customWindowsPricePerNode_price").value) || 0;
        const oneTimeWindowsLicensePerNode = parseFloat(document.getElementById("oneTimeWindowsLicensePerNode_price").value) || 0;
        recurringWindowsLicense = customWindowsPricePerNode * nodes;
        oneTimeWindowsLicense = oneTimeWindowsLicensePerNode * nodes;
      } else {
        recurringWindowsLicense = totalCores * 23.30;
        oneTimeWindowsLicense = 0;
      }
      
      const licensingCost = hostFee + recurringWindowsLicense;
      
      // 3) Third-Party Costs
      const thirdPartyOneTime = parseFloat(document.getElementById("thirdPartyOneTime_price").value) || 0;
      const thirdPartyMonthly = parseFloat(document.getElementById("thirdPartyMonthly_price").value) || 0;
      
      // 4) Service Price (Monthly)
      const avdVCPUs = parseFloat(document.getElementById("avdVCPUs_price").value) || 0;
      const avdHours = parseFloat(document.getElementById("avdHours_price").value);
      const avdCost = avdVCPUs * 0.01 * avdHours;
      
      const sqlVcores = parseFloat(document.getElementById("sqlVcores_price").value) || 0;
      const sqlHours = parseFloat(document.getElementById("sqlHours_price").value);
      const sqlTier = document.getElementById("sqlTier_price").value;
      const sqlLicensing = document.getElementById("sqlLicensing_price").value;
      const sqlTerm = document.getElementById("sqlTerm_price").value;
      const sqlRate = sqlPrices[sqlTier][sqlLicensing][sqlTerm];
      const sqlHourlyRate = sqlRate / 730;
      const sqlCost = sqlVcores * sqlHourlyRate * sqlHours;
      
      // 5) Totals
      const oneTimeTotal = hardwareCost + oneTimeWindowsLicense + thirdPartyOneTime;
      const recurringTotal = licensingCost + avdCost + sqlCost + thirdPartyMonthly;
      
      const resultHtml = 
        `<strong>One-Time Hardware Cost:</strong> €${hardwareCost.toFixed(2)}<br>` +
        `<strong>One-Time Windows License:</strong> €${oneTimeWindowsLicense.toFixed(2)}<br>` +
        `<strong>One-Time Third-Party Cost:</strong> €${thirdPartyOneTime.toFixed(2)}<br>` +
        `<strong>Total One-Time Cost:</strong> €${oneTimeTotal.toFixed(2)}<br><br>` +
        `<strong>Monthly Azure Local Host Fee:</strong> €${hostFee.toFixed(2)}<br>` +
        `<strong>Monthly Windows License:</strong> €${recurringWindowsLicense.toFixed(2)}<br>` +
        `<strong>Monthly Licensing Cost (Total):</strong> €${licensingCost.toFixed(2)}<br>` +
        `<strong>Monthly Third-Party Cost:</strong> €${thirdPartyMonthly.toFixed(2)}<br>` +
        `<strong>Monthly AVD Cost:</strong> €${avdCost.toFixed(2)}<br>` +
        `<strong>Monthly SQLmi Cost:</strong> €${sqlCost.toFixed(2)}<br>` +
        `<strong>Total Monthly Recurring Cost:</strong> €${recurringTotal.toFixed(2)}`;
      
      document.getElementById("result_price").innerHTML = resultHtml;
      
      updateCharts(oneTimeTotal, recurringTotal, hardwareCost, oneTimeWindowsLicense, thirdPartyOneTime, licensingCost, avdCost, sqlCost, thirdPartyMonthly);
    }
    
    function updateCharts(oneTimeTotal, recurringTotal, hardwareCost, oneTimeWindows, thirdPartyOneTime, licensingCost, avdCost, sqlCost, thirdPartyMonthly) {
      updateFixedVsVariableChart(oneTimeTotal, recurringTotal);
      updateOneTimeBreakdownChart(hardwareCost, oneTimeWindows, thirdPartyOneTime);
      updateRecurringBreakdownChart(licensingCost, avdCost, sqlCost, thirdPartyMonthly);
    }
    
    // Chart 1: Fixed vs. Variable Costs (Non-stacked, separate bars)
    function updateFixedVsVariableChart(fixedCost, variableCost) {
      const ctx = document.getElementById("costChart").getContext("2d");
      if (costChart) { costChart.destroy(); }
      
      costChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ["Fixed Costs", "Monthly Costs"],
          datasets: [
            {
              label: "Cost (€)",
              data: [fixedCost, variableCost],
              backgroundColor: ["rgba(128,191,255,0.9)", "rgba(211,211,211,0.9)"]
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                boxWidth: 0,
                generateLabels: function(chart) {
                  const original = Chart.defaults.plugins.legend.labels.generateLabels;
                  const labels = original(chart);
                  labels.forEach(label => { label.boxWidth = 0; });
                  return labels;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: "Euros (€)" }
            }
          },
          tooltips: {
            callbacks: {
              label: (context) => `€${context.parsed.y.toFixed(2)}`
            }
          }
        }
      });
    }
    
    // Chart 2: Fixed Costs Breakdown (Non-stacked, separate bars)
    function updateOneTimeBreakdownChart(hardwareCost, windowsCost, thirdPartyCost) {
      const ctx = document.getElementById("oneTimeBreakdownChart").getContext("2d");
      if (oneTimeBreakdownChart) { oneTimeBreakdownChart.destroy(); }
      
      const items = [
        { label: "Hardware", value: hardwareCost, backgroundColor: "rgba(128,191,255,0.9)" },
        { label: "Windows License", value: windowsCost, backgroundColor: "rgba(179,209,255,0.9)" },
        { label: "Third-Party", value: thirdPartyCost, backgroundColor: "rgba(150,150,150,0.9)" }
      ].filter(item => item.value > 0);
      
      const labels = items.map(item => item.label);
      const dataValues = items.map(item => item.value);
      const backgroundColors = items.map(item => item.backgroundColor);
      
      const data = {
        labels: labels,
        datasets: [
          {
            label: "Fixed Costs (€)",
            data: dataValues,
            backgroundColor: backgroundColors
          }
        ]
      };
      
      const config = {
        type: "bar",
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                boxWidth: 0,
                generateLabels: function(chart) {
                  const original = Chart.defaults.plugins.legend.labels.generateLabels;
                  const labels = original(chart);
                  labels.forEach(label => { label.boxWidth = 0; });
                  return labels;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: "Euros (€)" }
            }
          },
          tooltips: {
            callbacks: {
              label: (context) => `€${context.parsed.y.toFixed(2)}`
            }
          }
        }
      };
      
      oneTimeBreakdownChart = new Chart(ctx, config);
    }
    
    // Chart 3: Recurring Costs Breakdown (Separate bars for each element)
    function updateRecurringBreakdownChart(licensingCost, avdCost, sqlCost, thirdPartyMonthly) {
      const ctx2 = document.getElementById("costBreakdownChart").getContext("2d");
      if (costBreakdownChart) { costBreakdownChart.destroy(); }
      
      const items = [
        { label: "Licensing Cost", value: licensingCost, backgroundColor: "rgba(128,191,255,0.9)" },
        { label: "AVD Cost", value: avdCost, backgroundColor: "rgba(179,209,255,0.9)" },
        { label: "SQLmi Cost", value: sqlCost, backgroundColor: "rgba(211,211,211,0.9)" },
        { label: "3rd Party Cost", value: thirdPartyMonthly, backgroundColor: "rgba(150,150,150,0.9)" }
      ].filter(item => item.value > 0);
      
      const labels = items.map(item => item.label);
      const dataValues = items.map(item => item.value);
      const backgroundColors = items.map(item => item.backgroundColor);
      
      const data = {
        labels: labels,
        datasets: [
          {
            label: "Recurring Costs (€)",
            data: dataValues,
            backgroundColor: backgroundColors
          }
        ]
      };
      
      const config = {
        type: "bar",
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                boxWidth: 0,
                generateLabels: function(chart) {
                  const original = Chart.defaults.plugins.legend.labels.generateLabels;
                  const labels = original(chart);
                  labels.forEach(label => { label.boxWidth = 0; });
                  return labels;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: "Euros (€)" }
            }
          },
          tooltips: {
            callbacks: {
              label: (context) => `€${context.parsed.y.toFixed(2)}`
            }
          }
        }
      };
      
      costBreakdownChart = new Chart(ctx2, config);
    }
  </script>
</body>
</html>
