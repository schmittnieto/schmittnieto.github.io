---
title: "Azure Local Troubleshooting: The Path From Error to Resolution"
date: 2026-09-05
published: true
excerpt: "Where to go when Azure Local fails: the support ticket that comes first, the Slack community, 218 public troubleshooting guides and self-service diagnostics."
categories:
  - Blog
tags:
  - Azure Local
  - Troubleshooting
  - Support
  - PowerShell

sticky: false

header:
  teaser: "/assets/img/post/2026-09-05-azure-local-troubleshooting.webp"
  image: "/assets/img/post/2026-09-05-azure-local-troubleshooting.webp"
  og_image: "/assets/img/post/2026-09-05-azure-local-troubleshooting.webp"
  overlay_image: "/assets/img/post/2026-09-05-azure-local-troubleshooting.webp"
  overlay_filter: 0.5

toc: true
toc_label: "Topics Overview"
toc_icon: "list-ul"

sidebar:
  nav: "Azurelocal"
---

## Introduction

Welcome to a new article on my blog. This one is special for me, not so much for the content as for the timing, because it is the first article I publish as a Microsoft MVP in Azure Hybrid & Migration. Troubleshooting feels like the right subject to start with, since most of what I know about Azure Local came from things going wrong and having to work out why.

Azure Local error messages have a particular talent for telling you that something failed without telling you what to do about it. A deployment stops at a validation task. An update hangs at a role you have never heard of. A node registers with Azure and then quietly stops reporting.

The information you need usually exists. It is spread across four different places. Knowing which one to reach for is most of the battle.

This article is the guide I wanted when I started working with Azure Local: where to look, in what order and what each channel is good for. It ends with a worked example that runs an update failure through the whole path.

## Rule Number One: Open the Support Ticket First

Start here, because the order matters more than people expect.

**If your Azure Local environment is broken, file the support ticket before you do anything else.** Not after you have exhausted your own ideas. Not after two days of searching. First.

This is not me being cautious. It is how the diagnostic pipeline is built:

- **Log collection is tied to a case.** The Microsoft documentation on [getting support for deployment issues](https://learn.microsoft.com/en-us/azure/azure-local/manage/get-support-for-deployment-issues?wt.mc_id=MVP_579217) states it plainly: file a support ticket before you start log collection. The logs you send land in a Microsoft data store that a support engineer can only reach when a case exists to authorize it. Collecting logs without a case means collecting logs nobody can read.
- **Diagnostic data expires.** On-demand log collections are retained for around 30 days. If you spend three weeks investigating alone and then open a case, the evidence from the day it broke may be gone.
- **Remote support needs a case.** Enabling remote assistance depends on a shared access signature that the support team provides. There is no way to set it up in advance.
- **A ticket costs you nothing while you keep working.** The case number sits open while you run your own diagnostics. If you find the answer yourself, close it.

The pattern to internalize is: **open the case, then troubleshoot in parallel.** The case is your safety net and the mechanism that makes your evidence usable. Everything else in this article runs alongside it.

You open the case through the [Azure support request flow](https://learn.microsoft.com/en-us/azure/azure-portal/supportability/how-to-create-azure-support-request?wt.mc_id=MVP_579217) in the portal. Microsoft documents which deployment problems get which treatment:

| Issue type | What to do |
| --- | --- |
| Active Directory preparation, OS installation, portal or template deployment experience | File a support ticket |
| Environment validation, initialization and registration, deployment validation, deployment failure | File a support ticket, then perform standalone log collection |

## The Four Channels

Here is the landscape, with what each one earns its place for:

| Channel | Best for | Speed |
| --- | --- | --- |
| **Support ticket** | Anything affecting production, anything needing your specific environment inspected | Hours to days. The only path to a fix for a product defect |
| **Slack community** | "Has anyone seen this", sanity checks, workarounds nobody has written up yet | Minutes to hours. The most active place |
| **Supportability repository** | A known error message with a documented mitigation | Immediate when a guide exists |
| **CSSTools diagnostics** | Finding the problem yourself and producing evidence for the case | Minutes |

The interesting part is that these are not competing options. A good troubleshooting session uses all four at once: the ticket is open, you are asking in Slack, you are searching the guides and you are running the diagnostics that end up attached to the case.

## Channel 1: The Support Ticket and Its Evidence

Opening the case is step one. Making it useful is step two. The difference is the evidence you attach.

### Log collection when the system is registered

If the environment is deployed, registered and the telemetry extension is healthy, [log collection](https://learn.microsoft.com/en-us/azure/azure-local/manage/collect-logs?wt.mc_id=MVP_579217) runs from any node. It needs the `AzureEdgeTelemetryAndDiagnostics` extension installed and the Azure Stack HCI Administrator role:

```powershell
# default: all nodes, previous hour
Send-DiagnosticData

# a specific window, keep it tight
Send-DiagnosticData -FromDate (Get-Date).AddHours(-2) -ToDate (Get-Date)

# only the roles that matter for the failure
Send-DiagnosticData -FilterByRole BareMetal, ECE -CollectSddc $false
```

Two practical constraints. Collections longer than 24 hours are not supported. A longer window also means a longer wait, so narrow the range to the failure. Only one collection can run at a time.

The output is the part to keep. It prints the identifiers support needs:

```output
The correlation Id is <Correlation-ID>. This is used to query for this log collection in the diagnostic pipeline.
Provide the below information to the customer support engineer working on your case.
AEORegion: eastus
AEODeviceARMResourceUri: /Subscriptions/.../clusters/<cluster-name>
AEOClusterNodeArcResourceUri: /subscriptions/.../machines/<node-name>
CorrelationId: <Correlation-ID>
```

**Paste that block into the case.** The correlation ID is how the engineer finds your logs. Without it they are searching a haystack.

Role filtering is worth learning, since it turns a huge upload into a targeted one. `ECE` covers deployment, update, add node and node replacement workflows. `URP` and `OSUpdateLogs` cover update services. `HostNetwork` covers Network ATC. `MOC_ARB` covers the resource bridge. `ArcAgent` covers the connected machine agent.

To review what you have already sent:

```powershell
Get-LogCollectionHistory
```

### Log collection when the system is not registered yet

Deployment and registration failures are the awkward case, because the observability components that power `Send-DiagnosticData` may not exist yet. That is what [standalone collection](https://learn.microsoft.com/en-us/azure/azure-local/manage/get-support-for-deployment-issues?wt.mc_id=MVP_579217) is for:

```powershell
Send-AzStackHciDiagnosticData -ResourceGroupName <ResourceGroupName> `
    -SubscriptionId <SubscriptionId> `
    -TenantId <TenantId> `
    -RegistrationWithDeviceCode `
    -DiagnosticLogPath <LogPath> `
    -RegistrationRegion <RegionName> `
    -Cloud <AzureCloud>
```

Device code, service principal and existing context authentication are all supported. Support will tell you which diagnostic data to copy across.

### When the network is the problem

If outbound connectivity is what broke, you can still collect locally and hand the logs over later:

```powershell
Send-DiagnosticData -SaveToPath <path-to-share> -ShareCredential $shareCredential

# once you have a path out
Send-DiagnosticData -NoLogCollection -SupplementaryLogs <path-to-share> -ShareCredential $shareCredential
```

### Remote support

For problems that resist description, support can connect directly. This is enabled by you, scoped and time limited. Microsoft support can only connect once a case exists. Note that [remote support](https://learn.microsoft.com/en-us/azure/azure-local/manage/get-remote-support?wt.mc_id=MVP_579217) uses a different cmdlet depending on where you are.

On a deployed system, from a remote PowerShell session to a node:

```powershell
Enable-RemoteSupport -AccessLevel Diagnostics -ExpireInMinutes 1440
```

Before deployment or registration, the Environment Checker path uses a shared access signature that the support team gives you:

```powershell
Enable-AzStackHciRemoteSupport -AccessLevel <AccessLevel> `
    -ExpireInMinutes <ExpirationTime> `
    -SasCredential <SasCredential> -PassThru
```

`AccessLevel` is `Diagnostics` for read only access or `DiagnosticsRepair` when the engineer needs to change something. Grant the smaller level first. The expiry is a real expiry, with a minimum of 60 minutes, a maximum of 20160 minutes and a default of 480 minutes when you leave it out.

Consent is reversible and auditable, which is worth knowing before you grant it:

```powershell
Get-RemoteSupportAccess -IncludeExpired
Get-RemoteSupportSessionHistory -FromDate <Date>
Disable-RemoteSupport
```

One quirk to expect on first use. Enabling remote support restarts WinRM twice to activate Just Enough Administration, which drops your own PowerShell session with an I/O operation aborted error. Wait a couple of minutes and run it again.

## Channel 2: The Slack Community

This is the channel most people do not know exists. It is where the fastest real answers live.

There is an active Azure Local community on Slack with Microsoft engineers, MVPs, OEM engineers and a lot of people running this in production. You can join through [aka.ms/azurelocal-slack](https://aka.ms/azurelocal-slack), which takes you to a short sign-up form.

What makes it valuable is coverage of the gap between "documented" and "known". When a build introduces a regression, Slack knows days or weeks before a troubleshooting guide is published. When an error message has a workaround nobody has written up, somebody there has hit it.

How to get a useful answer:

- Give the build number, the node count and whether it is production
- Paste the actual error text rather than a paraphrase
- Say what you already tried, including which guides you read
- Mention that you have a case open, since people will ask

What it does not replace: a support ticket. Slack has no access to your environment, no view of your logs and no ability to fix a product defect. Treat it as the fastest way to find out whether your problem is yours or everybody's.

## Channel 3: The Supportability Repository

[Azure/AzureLocal-Supportability](https://github.com/Azure/AzureLocal-Supportability) is a public repository of Azure Local troubleshooting guides. It is also badly underused. Its own description explains why it matters: this is the material Customer Support Services references when a ticket is created, plus the material Azure Local engineering references when responding to an incident.

The same guides your support engineer will open are readable by you, right now.

At the time of writing it holds 218 guides across 19 categories. The distribution tells you where Azure Local hurts:

| Category | Guides | Covers |
| --- | --- | --- |
| Environment Validator | 87 | Validation during deploy, update, scale out and upgrade |
| Update | 42 | Health checks, sideloading, Azure Update Manager, PowerShell |
| Networking | 26 | Arc gateway, outbound connectivity, top of rack configuration |
| Upgrade | 11 | 22H2 to 23H2 |
| Deployment | 9 | Prerequisites, AD, OS install, registration, Arc extensions |
| Solution Extension | 9 | Solution builder extensions |
| Observability | 7 | Insights, metrics, alerts |
| Templates | 7 | ARM and Bicep deployment templates |
| Storage | 5 | Storage Spaces Direct and volumes |
| Security | 4 | WDAC, BitLocker, secret rotation, syslog, Defender |
| Arc VMs | 3 | VM lifecycle, licensing, extensions, networking |

Environment Validator and Update together are more than half the content. If your problem is a validator failure or an update that will not proceed, the odds of a documented answer are good.

### How a guide is structured

Most follow the same shape, which makes them quick to scan:

1. **Overview** with the exact error text, so you can match your symptom
2. **Cause** explaining what is happening underneath
3. **Validation** with commands that confirm you have this problem rather than a lookalike
4. **Mitigation Steps** with the fix
5. A closing line telling you to contact Microsoft support when the mitigation does not work

That validation step is the part to respect. Guides for similar looking failures often differ in one detail. Applying the wrong mitigation makes the case harder.

### Searching it

The category README files are the index. GitHub code search across the repository is faster than browsing. Search the distinctive part of your error: a role name such as `MocArb`, a task name such as `EnsureArbVmResourceState` or an exit code. Guide file names are descriptive, so searching the repository file list often works too.

### Reporting something new

If your problem is not covered you can open an issue, within limits the repository states clearly. Reports must be reproducible outside your own system. Anything needing access to your environment or subscription gets redirected to a support ticket. Microsoft employees will not ask for subscription details on GitHub. Include the build, the node count, whether it is production, the region and the correlation ID from your log collection.

## Channel 4: Diagnostics You Can Run Yourself

The fourth channel is the one that changes how the other three go, because it turns "something is wrong" into a specific finding.

**Microsoft.AzLocal.CSSTools**, documented as the [Azure Local Support Diagnostic Tool](https://learn.microsoft.com/en-us/azure/azure-local/manage/support-tools?wt.mc_id=MVP_579217), is the PowerShell module Microsoft support uses. It is on the [PowerShell Gallery](https://www.powershellgallery.com/packages/Microsoft.AzLocal.CSSTools) and you can install it today.

### Setup

```powershell
Install-Module -Name Microsoft.AzLocal.CSSTools -Force
Import-Module -Name Microsoft.AzLocal.CSSTools -Force
```

Updating has a trap worth knowing. `Update-Module` does not change what is already loaded in your session:

```powershell
Update-Module -Name Microsoft.AzLocal.CSSTools
Remove-Module -Name Microsoft.AzLocal.CSSTools
Import-Module -Name Microsoft.AzLocal.CSSTools
```

Two prerequisites from the documentation: PowerShell remoting has to be configured, so run `Enable-PSRemoting` where needed. Every node should also carry the same module version. Remove existing PSSessions after an update so remote runspaces load the new version rather than the old one.

### Run the insights

This is the single most useful command in the whole article:

```powershell
Invoke-AzsSupportInsight -ComputerName (Get-ClusterNode).Name
```

It runs every analyzer across every node and writes a summary plus an HTML report. It is read only, so it is safe on production. The summary looks like this:

```output
================================================================================
 Azure Local Insights Summary
================================================================================
Time    : 2025-10-23 20:41:05
Report  : C:\Temp\Azs.Support\20251023160853\InsightReport
================================================================================
Summary:
Nodes           : {PREFIX}-N03, {PREFIX}-N04, {PREFIX}-N02, {PREFIX}-N01
Total Analyzers : 104 (Success: 103 | Warning: 1 | Failure: 0)
Total Rules     : 266 (Success: 260 | Warning: 2 | Failure: 0)
================================================================================

Node: {PREFIX}-N02
  Azure Local Services: [SUCCESS]  2 | [WARNING]  0 | [FAILURE]  0
  Host Compute:         [SUCCESS]  2 | [WARNING]  0 | [FAILURE]  0
  Host Network:         [SUCCESS]  4 | [WARNING]  0 | [FAILURE]  0
  Host Storage:         [SUCCESS] 15 | [WARNING]  1 | [FAILURE]  0
  Operating System:     [SUCCESS]  1 | [WARNING]  0 | [FAILURE]  0
  Support.AksArc:       [SUCCESS]  1 | [WARNING]  0 | [FAILURE]  0
================================================================================
```

Hundreds of rules, per node, with the one warning pointed at the node that owns it. That is a different starting position from reading event logs by hand.

You can narrow it to a component when you know where the problem lives:

```powershell
Invoke-AzsSupportInsight -Component HostStorage
Invoke-AzsSupportInsight -Component LifecycleOrchestration, HostNetwork
```

The eight components are `ControlPlaneOperations`, `HostCompute`, `HostNetwork`, `HostStorage`, `KnownIssues`, `LifecycleOrchestration`, `OperatingSystem` and `VirtualMachines`.

The `KnownIssues` component deserves attention. It checks for recognized problems that already have documented answers, which is the automated version of searching the supportability repository.

**Run this once on a healthy cluster and keep the report.** A baseline from a good day is worth a lot when you are trying to work out what changed.

### Remediations

Some findings come with a matching fix, shipped as signed scripts:

```powershell
Invoke-AzsSupportInsightRemediation -ScriptName "ClearTrustedHostsWildcard"
```

The rule: run a remediation when an insight names it, never before. These change system state on the local node. Current examples include clearing a WinRM TrustedHosts wildcard, resetting CredSSP configuration, removing incompatible Az CLI extensions that block updates, clearing failed ECE update action plans and unlocking Azure Local accounts.

A fourth family exists for high impact operations through `Invoke-AzsSupportScript`. The documentation is explicit that Microsoft CSS or engineering should direct their use. If you are reading those pages during an incident, that is the moment to lean on your open case.

### Build the data bundle

```powershell
New-AzsSupportDataBundle -Component <Component>
```

Press `CTRL+SPACE` after `-Component` to see the available collection sets. Attach the bundle and the insight report when you open the case and you have skipped a round trip.

## Where the Logs Live on Disk

Log collection ships evidence to Microsoft. When you want to read something yourself, on the node, right now, these are the folders worth knowing. Treat all of them as read only. Several are platform managed. Deleting them breaks monitoring or updates without fixing the cause.

### Deployment and lifecycle

| Path | What you find there |
| --- | --- |
| `C:\MASLogs` | LCM controller transcripts such as `Install-LCMController_<timestamp>.log`, deployment state in `AzStackHciEnvironmentProgress.json` and the ECE lite logs under `LCMECELitelogs\`. The place to start when deployment stops before the action plan runs |
| `C:\MASLogs\LCMECELitelogs\InitializeDeploymentService-<date>.log` | Whether LCM initialization finished. The last line reads `Action: Action plan 'InitializeDeploymentService' completed.` when it did. Initialization takes 15 to 20 minutes |
| `C:\CloudDeployment\Logs\CloudDeployment.*.log` | Action plan execution on the seed node. This is where the exception behind a one line portal error has its context |
| `C:\Users\lcmuser\.AzStackHci\` | Environment Checker output run interactively: `AzStackHciEnvironmentChecker.log`, `AzStackHciEnvironmentReport.json` and `FailedUrls.txt` for the connectivity checks |
| `C:\CloudContent\MASLogs\` | Environment Checker log and `AzStackHciEnvironmentCheckerReport.json` when validation runs from the deployment path, plus `ASSecurityOSConfigLogs` for the security baseline |
| `D:\CloudContent\MASLogs\SBELogs` | Text based solution builder extension logs from solution 10.2411.0.x onward, with `C:\CloudContent\MASLogs\SBELogs` used when there is no `D:` drive. Earlier builds wrote to `C:\SBELogs`, where the logs may be incomplete and the ETL versions have to be read instead |

### Platform and observability

| Path | What you find there |
| --- | --- |
| `C:\Observability` | Diagnostic data staged on every machine before upload. Microsoft documents this as the folder where diagnostics data can be viewed. `Download\UdiSessions` and `OEMDiagnostics` sit under it |
| `C:\GMACache\TelemetryCache\Tables\*.tsf` | The telemetry buffer. A `GMACache` that keeps growing means the node cannot upload to Azure, so restore outbound connectivity rather than deleting the cache |
| `C:\Packages\Plugins\Microsoft.AzureStack.Observability.TelemetryAndDiagnostics\` | Payload and logs for the telemetry and diagnostics extension. The sibling `Microsoft.AzureStack.Observability.EdgeRemoteSupport\` covers the remote support agent |
| `C:\ProgramData\AzureConnectedMachineAgent\Log` | Arc connected machine agent. Read it alongside `azcmagent show` when a node stops reporting to Azure |
| `C:\NugetStore`, `C:\Agents`, `C:\ImageComposition`, `C:\CloudContent` | Solution packages and update content rather than logs, though the version numbers in these paths tell you which build a component is running. Platform managed and rotated automatically, so leave them alone |

### Windows event logs

| Channel | Covers |
| --- | --- |
| `Microsoft-AzureStack-Hci/Admin` | The Azure Local platform channel, first stop for cluster level failures |
| `Microsoft-Windows-FailoverClustering/Operational` | Node membership, resource moves and cluster service events. The `/Diagnostic` channel goes deeper and can exceed 1 GB |
| `Microsoft-Windows-StorageSpaces-Driver/Operational` | Storage Spaces Direct, virtual disk and physical disk failures |
| `Microsoft-Windows-Networking-NetworkATC/Operational` | Network ATC intent application and drift |
| `Microsoft-Windows-Health/Operational` | Health service faults, which are what surface as cluster health alerts |
| `C:\Windows\System32\winevt\Logs\AzStackHciEnvironmentChecker.evtx` | Environment Checker history as an event log rather than a text file |

Reading a channel across the cluster:

```powershell
Invoke-Command -ComputerName (Get-ClusterNode).Name -ScriptBlock {
    Get-WinEvent -LogName 'Microsoft-AzureStack-Hci/Admin' -MaxEvents 50 -ErrorAction SilentlyContinue |
        Where-Object LevelDisplayName -in 'Error', 'Warning'
} | Sort-Object TimeCreated -Descending |
    Format-Table PSComputerName, TimeCreated, Id, LevelDisplayName -AutoSize
```

Crash data lands in `C:\Windows\MEMORY.DMP`, `C:\Windows\Minidump\`, `C:\Windows\LiveKernelReports\` and `%ProgramData%\Microsoft\Windows\WER\ReportQueue\`. Collect those before deleting anything when a case is open, since they are also the first thing people clear to free space on `C:`.

Two habits that pay off. When you run `Invoke-AzsSupportInsight`, the summary prints a `Report` line with the path to the HTML report it wrote, so copy that report off the node and attach it to the case before the folder gets cleaned up. And if you are in these folders because `C:` is full rather than because something failed, read the [system drive free space guide](https://github.com/Azure/AzureLocal-Supportability/blob/main/TSG/EnvironmentValidator/Troubleshooting-Test-SystemDrive-Free-Space.md) first, since it separates what is safe to reclaim from what has to stay.

## A Worked Example: An Update That Will Not Proceed

Putting it together. Your solution update fails partway through with a message naming a role.

1. **Open the support ticket.** Include the build, the node count, the error text and whether it is production. This takes five minutes and starts the clock.
2. **Collect logs for the failure window.** `Send-DiagnosticData -FromDate (Get-Date).AddHours(-3) -ToDate (Get-Date) -FilterByRole ECE, URP`. Paste the correlation ID block into the case.
3. **Run the insights.** `Invoke-AzsSupportInsight -Component LifecycleOrchestration, KnownIssues -ComputerName (Get-ClusterNode).Name`. Several analyzers exist specifically for update blockers such as registration state, incompatible Az CLI extensions and leftover CAU artifacts.
4. **Search the repository.** Take the distinctive part of the error, the role name or the task name, then search the Update and Environment Validator categories. With 129 guides between them the chances are real.
5. **Read the role's own log on the node.** The role name in the portal error maps to a folder on disk. For an update that means `C:\CloudDeployment\Logs\CloudDeployment.*.log` and `C:\MASLogs`, where the exception carries the context the portal message left out.
6. **Ask in Slack** while the above runs. Somebody may have hit it on the same build last week.
7. **Apply a mitigation only when a guide or an insight names it**, using the guide's validation step first.
8. **Report back to the case** either way. If you resolved it, say how. That is what turns your afternoon into somebody else's documented answer.

## Contributing Back

Here is the part I most want you to take away. **The repository accepts pull requests. The guide you needed and could not find is a guide you can write.**

When you spend two days working out why a deployment failed, you end up holding something valuable: the exact error text, the cause nobody documented and the fix that worked. Right now that knowledge lives in your head and maybe in a ticket nobody else can read. Spending another hour turning it into a guide means the next person matches the error, follows the validation step and is done in ten minutes.

I have done this twice, in the two shapes a contribution can take.

### A troubleshooting guide from a real deployment failure

A deployment of mine kept failing at environment validation on `AzStackHci_MOCStack_Network_Port`, with a JSON blob reporting that a mandatory MOCStack network port was disabled. The message names no endpoint, so there is nothing obvious to unblock.

The cause turned out to be specific enough to be worth writing down. The validator calls `Test-NetConnection` without an explicit target, which probes `internetbeacon.msedge.net` on TCP 80 and 443 to test generic internet reachability. If your perimeter firewall blocks it, validation fails and the deployment stops. The detail that makes this painful is that `internetbeacon.msedge.net` does not appear in the documented [Azure Local firewall requirements](https://learn.microsoft.com/en-us/azure/azure-local/concepts/firewall-requirements?wt.mc_id=MVP_579217), so a network team following the official endpoint list to the letter can still produce this failure.

So I wrote it up: the severity, the applicable scenario, the exact failure output to match against, what has to be allowed and why. It is now [Troubleshoot Network Test MOCStackNetworkPort](https://github.com/Azure/AzureLocal-Supportability/blob/main/TSG/EnvironmentValidator/Networking/Troubleshoot-Network-Test-MOCStackNetworkPort.md) in the Environment Validator category, [contributed in September 2025](https://github.com/Azure/AzureLocal-Supportability/commit/01aca6c4660d845476f20cb31c7f242a1ca832ca).

That is the whole point of the repository. My bad week became somebody else's ten minute fix. It keeps doing that for as long as the validator behaves this way.

### A documentation contribution

The second one is plumbing rather than a war story. The CSSTools module is useful and it was hard to see as a whole. More than seventy exported functions, eight insight components, a set of remediations and the support scripts lived across separate documentation folders, so answering "what can this thing do" meant opening a lot of pages and answering "what is the syntax" meant one page per command. I put together a consolidated command overview: everything in one place, grouped by family, condensed syntax with optional parameters in brackets, each entry linking to its detail page.

That one landed in [July 2026](https://github.com/Azure/AzureLocal-Supportability/commit/40e02059f25d3ce4445e525a0472d073375904c8) and you can read the result in the [command overview shipped with 1.2607.16.2249](https://github.com/Azure/AzureLocal-Supportability/blob/main/tools/CSSTools/1.2607.16.2249/README.md).

### What the bar looks like

Contributing is not a heavy process, though it is a real one. Guides follow templates, every command has to be production safe with state checked before it is changed, links must be public Microsoft links and each article carries metadata describing its validation depth on a scale from static review through to a full inject, detect, mitigate and revalidate loop exercised live. Keep customer identifiers out of anything you submit.

Start from an existing guide in the category that matches your problem and follow its shape. If you have solved an Azure Local problem the hard way, writing it down is worth more than you think.

## Conclusion

The short version, worth keeping somewhere findable:

1. **Open the support ticket first.** Log collection, remote support and any path to a product fix depend on it. Troubleshoot in parallel and close it if you win.
2. **Collect logs early and narrow.** Tight time window, filtered roles, then paste the correlation ID into the case.
3. **Run `Invoke-AzsSupportInsight` across the cluster.** Keep a healthy baseline so you have something to compare against.
4. **Search the supportability repository** for your exact error, respecting the validation step before applying a mitigation.
5. **Read the logs on the node** when the portal message is too thin, starting with `C:\MASLogs` and `C:\CloudDeployment\Logs` for anything lifecycle related.
6. **Ask in Slack** to find out whether it is your environment or the build.
7. **Write down what worked.**

Azure Local troubleshooting has a reputation for being opaque. A good part of that is people using one channel when four exist. The support tooling is public, the guides are public and the community is active. The only piece that has to come from you is opening the case early enough for the rest to be useful.

If you have a channel or a tool that has saved you, I would like to hear about it.
