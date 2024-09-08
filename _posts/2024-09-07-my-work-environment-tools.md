---
title: "My Work Environment: Tools and Customizations"
date: 2024-09-07
excerpt: "Discover the essential tools and customizations I use daily, from package management with Winget to interactive PowerShell with Oh My Posh and PSReadLine, plus helpful AI support with ChatGPT."
categories:
  - Blog
tags:
  - Productivity
  - Tools
  - Customization

header:
  image: "https://schmitt-nieto.com/assets/img/post/2024-09-07-my-work-environment-tools.jpg"
  overlay_image: "https://schmitt-nieto.com/assets/img/post/2024-09-07-my-work-environment-tools.jpg"
  overlay_filter: 0.15  
  teaser: "https://schmitt-nieto.com/assets/img/post/2024-09-07-my-work-environment-tools.jpg"
  caption: "Photo credit: [**ChatGPT**](https://chatgpt.com)"
---

# Introduction

In this post, I want to share with you the tools and customizations that make up my daily work environment. As an Azure consultant and developer, having a well-organized and efficient setup is crucial. Here are some of the tools and customizations I use to streamline my workflow and boost productivity.

## Winget: The Ultimate Package Manager

Winget is my go-to package manager for Windows. It simplifies the process of installing, updating, and managing software packages. One of the best features of Winget is its customization options. By running the command `winget settings`, you can open the settings file and tweak it to fit your preferences. Here is my customized `settings.json` file:

```json
{
    "$schema": "https://aka.ms/winget-settings.schema.json",
    "visual": {
        "progressBar": "rainbow"
    },
    "source": {
        "autoUpdateIntervalInMinutes": 3
    },
    "uninstallBehavior": {
        "purgePortablePackage": true
    },
    "logging": {
        "level": "error"
    },
    "experimentalFeatures": {
        "configureSelfElevate": true,
        "configureExport": true,
        "configuration03": true,
        "directMSI": true
    }
}
```

Enabling autocomplete in Winget also enhances my productivity by reducing the amount of typing required for package commands.

## Pomodoro Logger: Tracking Projects and Tasks

To stay on top of my projects and tasks, I use Pomodoro Logger. This tool helps me break down my work into manageable intervals, ensuring that I stay focused and productive throughout the day. By tracking my time spent on various tasks, I can analyze my work patterns and make improvements where necessary.

## Azure CLI

Working with Azure requires a lot of command-line interaction, and Azure CLI is my tool of choice. It allows me to manage my Azure resources efficiently and automate various tasks.

## Oh My Posh: PowerShell Customization

Oh My Posh is a fantastic tool for customizing my PowerShell prompt. By following [Jon D. Jones's guide](https://www.jondjones.com/tactics/productivity/customise-your-powershell-prompt-like-a-boss/), I have configured a visually appealing and informative prompt that enhances my command-line experience. Jon's detailed walkthrough provided a great foundation for my setup.

## Autocomplete in PowerShell

One of the best features of my setup is the autocomplete functionality in PowerShell. By customizing my `$PROFILE`, I've enabled autocompletion for various commands, including PowerShell, Winget, and Azure CLI. Here's my `$PROFILE` setup:

```powershell
oh-my-posh --init --shell pwsh --config C:/Users/User/Dropbox/Computer/AppData/powershell.json | Invoke-Expression

if ($host.Name -eq 'ConsoleHost' -or $host.Name -eq 'Visual Studio Code Host' ) {

  Import-Module PSReadline
  Set-PSReadLineOption -EditMode Windows
  Set-PSReadLineOption -PredictionSource History

  Set-PSReadlineOption -Color @{
    "Command"          = [ConsoleColor]::Green
    "Parameter"        = [ConsoleColor]::Gray
    "Operator"         = [ConsoleColor]::Magenta
    "Variable"         = [ConsoleColor]::Yellow
    "String"           = [ConsoleColor]::Yellow
    "Number"           = [ConsoleColor]::Yellow
    "Type"             = [ConsoleColor]::Cyan
    "Comment"          = [ConsoleColor]::DarkCyan
    "InlinePrediction" = '#70A99F'
  }

  Set-PSReadLineKeyHandler -Function AcceptSuggestion -Key 'Ctrl+Spacebar'
  Set-PSReadLineKeyHandler -Key UpArrow -Function HistorySearchBackward
  Set-PSReadLineKeyHandler -Key DownArrow -Function HistorySearchForward 

  Set-PSReadLineKeyHandler -Key Ctrl+Shift+b `
                       -BriefDescription BuildCurrentDirectory `
                       -LongDescription "Build the current directory" `
                       -ScriptBlock {
    [Microsoft.PowerShell.PSConsoleReadLine]::RevertLine()
    [Microsoft.PowerShell.PSConsoleReadLine]::Insert("dotnet build")
    [Microsoft.PowerShell.PSConsoleReadLine]::AcceptLine()
  }
}

Import-Module -Name Terminal-Icons

Register-ArgumentCompleter -Native -CommandName az -ScriptBlock {
    param($commandName, $wordToComplete, $cursorPosition)
    $completion_file = New-TemporaryFile
    $env:ARGCOMPLETE_USE_TEMPFILES = 1
    $env:_ARGCOMPLETE_STDOUT_FILENAME = $completion_file
    $env:COMP_LINE = $wordToComplete
    $env:COMP_POINT = $cursorPosition
    $env:_ARGCOMPLETE = 1
    $env:_ARGCOMPLETE_SUPPRESS_SPACE = 0
    $env:_ARGCOMPLETE_IFS = "`n"
    $env:_ARGCOMPLETE_SHELL = 'powershell'
    az 2>&1 | Out-Null
    Get-Content $completion_file | Sort-Object | ForEach-Object {
        [System.Management.Automation.CompletionResult]::new($_, $_, "ParameterValue", $_)
    }
    Remove-Item $completion_file, Env:\_ARGCOMPLETE_STDOUT_FILENAME, Env:\ARGCOMPLETE_USE_TEMPFILES, Env:\COMP_LINE, Env:\COMP_POINT, Env:\_ARGCOMPLETE, Env:\_ARGCOMPLETE_SUPPRESS_SPACE, Env:\_ARGCOMPLETE_IFS, Env:\_ARGCOMPLETE_SHELL
}

Register-ArgumentCompleter -Native -CommandName winget -ScriptBlock {
    param($wordToComplete, $commandAst, $cursorPosition)
        [Console]::InputEncoding = [Console]::OutputEncoding = $OutputEncoding = [System.Text.Utf8Encoding]::new()
        $Local:word = $wordToComplete.Replace('"', '""')
        $Local:ast = $commandAst.ToString().Replace('"', '""')
        winget complete --word="$Local:word" --commandline "$Local:ast" --position $cursorPosition | ForEach-Object {
            [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterValue', $_)
        }
}

Set-PSReadlineKeyHandler -Key Tab -Function MenuComplete
```

## Terraform CLI

Terraform is a critical tool for managing infrastructure as code. It allows me to define and provision resources in Azure using a high-level configuration language. This approach ensures that my infrastructure is version-controlled and reproducible, making it easier to manage and scale.

## KeePass: Secure Password Management

Managing passwords securely is a top priority, and for that, I rely on KeePass. It stores all my passwords in an encrypted database, allowing me to access them easily while keeping them secure. KeePass also supports generating strong passwords, which is essential for maintaining good security practices.

## DeepL: Translation Made Easy

For translation tasks, I rely on DeepL. It's a powerful translation tool that delivers accurate and contextually appropriate translations. Whether I'm working on documentation or communicating with international clients, DeepL ensures that language is never a barrier.

## Spotify: The Perfect Work Companion

Last but not least, Spotify is my constant companion while working. With its vast library of music and podcasts, it helps me stay focused and motivated throughout the day. Whether I need some background music or a podcast to keep me engaged, Spotify has it all.

## ChatGPT: AI Assistant

Another essential tool I use daily is ChatGPT. As an AI assistant, ChatGPT helps me quickly find answers, generate ideas, and even write scripts or code snippets when needed. It speeds up the research process, provides alternative solutions to problems, and assists in breaking down complex topics.

# Conclusion

This is just a small list of tools which I use day by day, I will be modifying it by adding tools or customizations to them. 
In case you have tools that you want to share with the community, please don't hesitate to comment!