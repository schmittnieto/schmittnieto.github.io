---
permalink: /azl-storage-calculator/
title: "Azure Local Storage Calculator"
subtitle: "This is a calculator for Azure Local S2D, assuming you are using NVMe storage only"
---

<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>NVMe S2D Calculator</title>
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
    <h2>NVMe S2D Calculator</h2>
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
      <label for="capacity">Raw Capacity per Disk (TB)</label>
      <input type="number" id="capacity" placeholder="e.g., 3.5" step="0.1" min="0.1">
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
      <p><strong>Redundancy Disclaimer:</strong> When using 1 or 2 nodes, S2D employs two-way mirror redundancy. When using 3 or more nodes, three-way mirror redundancy is used. For a single-node configuration, no storage network is required (<em>Optional – this pattern doesn't require a storage network</em>). We assume that in this case a local mirror is used to avoid data loss in case of disk failure, though no definitive documentation has been found regarding this.</p>
      <p><strong>Reserved Capacity Disclaimer:</strong> The calculation now reserves capacity equivalent to one disk per node in the cluster (i.e. <em>Reserved Capacity = Number of Nodes × Capacity per Disk</em>). This ensures there is sufficient unallocated space for repairs after a disk failure.</p>
      <p><strong>NVMe & Performance:</strong> In Azure Local, NVMe drives are used as both cache and capacity. For optimal performance, RDMA must be employed. Increasing the number of NVMe drives per node enhances IOPS and throughput via parallelism, but it also requires proper RDMA network configuration to avoid potential bottlenecks.</p>
      <p><strong>Storage Configuration:</strong> Storage is configured in Azure Local using the <code>configurationMode</code> parameter (
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
      
      if (isNaN(nodes) || isNaN(disks) || isNaN(capacityPerDisk) || capacityPerDisk <= 0) {
        alert("Please enter valid values for all fields.");
        return;
      }
      
      // Total Raw Capacity calculation (in TB):
      var totalRaw = nodes * disks * capacityPerDisk;
      
      // Reserved capacity now equals one disk per node:
      var reserved = nodes * capacityPerDisk;
      
      // Effective Capacity available for volumes:
      var effective = totalRaw - reserved;
      
      // Redundancy: 2-way if 1-2 nodes, 3-way if 3+ nodes.
      var redundancyFactor = (nodes < 3) ? 2 : 3;
      
      // Usable Capacity: effective capacity divided by redundancy factor.
      var usable = effective / redundancyFactor;
      
      // Resiliency is the remainder of effective capacity after usable capacity.
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
