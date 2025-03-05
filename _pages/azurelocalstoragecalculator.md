---
permalink: /azl-storage-calculator/
title: "Azure Local Storage Calculator"
subtitle: This is a calculator for Azure Local S2D, assuming you are using NVMe storage only
---

<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>NVM S2D Calculator</title>
  <!-- Load Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    /* Dark Mode styling for the calculator */
    body {
      background-color: #2e2e2e;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #f1f1f1;
    }
    .container {
      background: #2e2e2e;
      padding: 30px;
      max-width: 500px;
      width: 100%;
      text-align: center;
      margin: 20px auto;
      color: #f1f1f1;
    }
    /* Remove borders/shadows */
    .container {
      border-radius: 0;
      box-shadow: none;
    }
    h2 {
      font-size: 1.5em;
      margin-bottom: 20px;
      color: #f1f1f1;
    }
    .slider-container {
      margin: 20px 0;
      text-align: left;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 600;
      color: #f1f1f1;
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
      background-color: #444;
      color: #f1f1f1;
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
      background: #3e3e3e;
      border-radius: 8px;
      padding: 15px;
      margin-top: 20px;
      text-align: left;
      font-size: 0.95em;
      color: #f1f1f1;
    }
    .disclaimer {
      font-size: 0.8em;
      color: #ccc;
      margin-top: 20px;
      text-align: left;
    }
    #chartContainer {
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>NVM S2D Calculator</h2>
    <div class="slider-container">
      <label for="nodes">Number of Nodes (<span id="nodesValue">1</span>)</label>
      <input type="range" id="nodes" min="1" max="16" value="1" oninput="document.getElementById('nodesValue').innerText = this.value;">
    </div>
    <div class="slider-container">
      <label for="disks">Number of NVMe Disks per Node (<span id="disksValue">2</span>)</label>
      <input type="range" id="disks" min="2" max="24" value="2" oninput="document.getElementById('disksValue').innerText = this.value;">
    </div>
    <div class="slider-container">
      <label for="capacity">Raw Capacity per Disk (TB)</label>
      <input type="number" id="capacity" placeholder="e.g., 3.5" step="0.1" min="0.1">
    </div>
    <button onclick="calculateCapacity()">Calculate Capacity</button>
    <div id="result" class="result"></div>
    
    <div id="chartContainer">
      <canvas id="capacityChart"></canvas>
    </div>
    
    <div class="disclaimer">
      <p><strong>Redundancy Disclaimer:</strong> When using 1 or 2 nodes, S2D employs two-way mirror redundancy. When using 3 or more nodes, three-way mirror redundancy is used. For a single-node configuration, no storage network is required (<em>Optional – this pattern doesn't require a storage network</em>). We assume that in this case a local mirror is used to avoid data loss in case of disk failure, though no definitive documentation has been found regarding this.</p>
      <p><strong>Reserved Capacity Disclaimer:</strong> For multi-node configurations, the calculation reserves capacity equivalent to one drive across the entire cluster (i.e. <em>Reserved Capacity = Capacity per Disk</em>) to ensure there is sufficient unallocated space for repairs after a disk failure. For a single-node configuration, no reserved storage is applied.</p>
      <p><strong>NVMe & Performance:</strong> In Azure Local, NVMe drives are used as both cache and capacity. For optimal performance, RDMA must be employed. Increasing the number of NVMe drives per node enhances IOPS and throughput via parallelism—but it also requires proper RDMA network configuration to avoid potential bottlenecks.</p>
      <p><strong>Storage Configuration:</strong> Storage is configured in Azure Local using the <code>configurationMode</code> parameter (
        <a href="https://learn.microsoft.com/en-us/azure/templates/microsoft.azurestackhci/clusters/deploymentsettings?pivots=deployment-language-arm-template#storage-1" target="_blank">Documentation</a>
      ). By default, this mode is set to <em>Express</em> and storage is configured as per best practices based on the number of nodes in the cluster. Allowed values are <em>'Express'</em>, <em>'InfraOnly'</em>, and <em>'KeepStorage'</em>. However, the exact best practices cannot be verified, and therefore the calculator assumes the reserved capacity as described, as it is considered part of these best practices.</p>
    </div>
  </div>

  <script>
    let chart; // Global variable for Chart.js instance

    function calculateCapacity() {
      var nodes = parseFloat(document.getElementById("nodes").value);
      var disks = parseFloat(document.getElementById("disks").value);
      var capacityPerDisk = parseFloat(document.getElementById("capacity").value);
      
      if (isNaN(nodes) || isNaN(disks) || isNaN(capacityPerDisk) || capacityPerDisk <= 0) {
        alert("Please enter valid values for all fields.");
        return;
      }
      
      // Total Raw Capacity calculation:
      var totalRaw = nodes * disks * capacityPerDisk;
      
      // For a single-node configuration, no reserved capacity is applied.
      // For multi-node clusters, reserve capacity equals one disk's capacity across the entire cluster.
      var reserved = (nodes === 1) ? 0 : capacityPerDisk;
      
      // Effective Capacity available for volumes:
      var effective = totalRaw - reserved;
      
      // Redundancy: 2-way if 1-2 nodes, 3-way if 3+ nodes.
      var redundancyFactor = (nodes < 3) ? 2 : 3;
      
      // Usable Capacity: effective capacity divided by redundancy factor.
      var usable = effective / redundancyFactor;
      
      // Resiliency portion is the remaining effective capacity after accounting for usable capacity.
      var resiliency = effective - usable;
      
      var resultHtml = "<strong>Total Raw Capacity:</strong> " + totalRaw.toFixed(2) + " TB<br>" +
                       "<strong>Reserved Capacity:</strong> " + reserved.toFixed(2) + " TB<br>" +
                       "<strong>Effective Capacity:</strong> " + effective.toFixed(2) + " TB<br>" +
                       "<strong>Redundancy:</strong> " + ((redundancyFactor === 2) ? 'Two-Way Mirror' : 'Three-Way Mirror') + "<br>" +
                       "<strong>Usable Capacity:</strong> " + usable.toFixed(2) + " TB";
      
      document.getElementById("result").innerHTML = resultHtml;
      
      updateChart(totalRaw, usable, resiliency, reserved);
    }
    
    function updateChart(totalRaw, usable, resiliency, reserved) {
      // Create a single, stacked bar with:
      // - Usable Capacity (leftmost segment, light blue)
      // - Resiliency (middle segment, even lighter blue; represents effective capacity minus usable capacity)
      // - Reserved Capacity (rightmost segment, gray)
      // The sum of these segments equals the total raw capacity.
      const data = {
        labels: ['Capacity'],
        datasets: [
          {
            label: 'Usable Capacity',
            data: [usable],
            backgroundColor: 'rgba(128,191,255,0.9)', // light blue
            stack: 'combined',
            order: 1
          },
          {
            label: 'Resiliency',
            data: [resiliency],
            backgroundColor: 'rgba(179,209,255,0.9)', // even lighter blue
            stack: 'combined',
            order: 2
          },
          {
            label: 'Reserved Capacity',
            data: [reserved],
            backgroundColor: 'rgba(211,211,211,0.9)', // light gray
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
            legend: {
              position: 'bottom'
            }
          },
          scales: {
            x: {
              stacked: true,
              title: {
                display: true,
                text: 'Capacity (TB)'
              }
            },
            y: {
              stacked: true,
              ticks: {
                display: false
              }
            }
          }
        }
      };
      
      // If a chart exists, destroy it before creating a new one.
      if (chart) {
        chart.destroy();
      }
      const ctx = document.getElementById('capacityChart').getContext('2d');
      chart = new Chart(ctx, config);
    }
  </script>
</body>
</html>
