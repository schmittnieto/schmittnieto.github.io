---
layout: post
title: "Creating My Azure Journey Blog: A Step-by-Step Guide"
date: 2024-07-12
categories: blog
thumbnail-img: /assets/img/blogpost01_01.webp
tags: [GitHub Pages, Jekyll]
excerpt: "In this article, I provide a thorough guide on creating a blog with GitHub Pages and Jekyll, detailing everything from initial setup to customizing themes and configuring your custom domain."
toc: true
---

# Introduction

In this article, I'll walk you through the process of creating a personal blog using GitHub Pages and Jekyll. Whether you're an IT enthusiast like me or just someone looking to start a blog, this guide will provide you with all the necessary steps to set up your site, choose and customize a theme, create content, and host it with a custom domain.

# Step 1: Setting Up the Environment

## Installing Jekyll and Ruby

First, I set up a development environment on an Ubuntu virtual machine. I needed to install Ruby and Jekyll to get started. Here’s how I did it:

```sh
sudo apt update
sudo apt install ruby-full build-essential zlib1g-dev
```

Then, I installed Jekyll:

```sh
gem install jekyll bundler
```
## Creating a New Jekyll Site

With Jekyll installed, I created a new site to kickstart the blog setup. This was pretty straightforward:

```sh
jekyll new myblog
cd myblog
```

# Step 2: Choosing and Configuring the Theme

## Selecting a Theme

I decided to use the **Beautiful Jekyll** theme for its clean design and rich features. The installation was simplified as it was automatically configured. Here’s how I set it up:

**Add the theme to the Gemfile:**
```sh
gem "beautiful-jekyll-theme", "6.0.1"
```

**Update `_config.yml`:**
```yaml
theme: "beautiful-jekyll-theme"
```

**Install the dependencies:**
```sh
bundle install
```


## Customizing the Theme

To make the blog feel more personal, I customized various elements like the `_config.yml` for site details, navigation bar links, and added a personal touch with some custom CSS.

# Step 3: Creating and Structuring Content

## Adding Pages and Posts

I created essential pages like `aboutme.md`. This page is all about introducing myself and my journey:

```markdown
---
layout: page
title: "About Me"
permalink: /about/
---

Hello, I'm **Cristian Schmitt Nieto**, an IT enthusiast and Azure consultant...
```

Then, I wrote my initial blog post to share my excitement about starting this journey:

```markdown
---
layout: post
title: "Welcome to My Azure Journey"
date: 2024-07-11
categories: blog
tags: [Azure, Cloud]
excerpt: "Join me as I share my journey and experiences in the world of Azure and IT."
---

# Welcome to My Azure Journey

Hello, I'm **Cristian Schmitt Nieto**, a Spanish IT enthusiast who moved to Germany...
```

## Implementing Tags

I structured my blog to categorize posts using tags. Each tag page was dynamically created using Jekyll collections, making it easier for readers to find content on specific topics.

# Step 4: Hosting with GitHub Pages

## Creating a GitHub Repository

I already had a repository named `schmittnieto.github.io` that I had set up about a year ago for testing GitHub Pages. I decided to recycle this repository for my blog. Here’s how I pushed my local site to GitHub:

```sh
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/schmittnieto/schmittnieto.github.io.git
git push -u origin main
```

## Configuring GitHub Pages

In the repository settings, I configured GitHub Pages to serve from the `main` branch. I also added a `CNAME` file to set up my custom domain:

```sh
echo "schmitt-nieto.com" > CNAME
git add CNAME
git commit -m "Add custom domain"
git push origin main
```

## Setting Up DNS

To point my custom domain to GitHub's servers, I added the following A records:

| Type | Name | Value           | TTL  |
|------|------|-----------------|------|
| A    | @    | 185.199.108.153 | 3600 |
| A    | @    | 185.199.109.153 | 3600 |
| A    | @    | 185.199.110.153 | 3600 |
| A    | @    | 185.199.111.153 | 3600 |

And a CNAME record for `www`:

| Type  | Name | Value                  | TTL  |
|-------|------|------------------------|------|
| CNAME | www  | schmittnieto.github.io | 3600 |

## Enabling HTTPS

Finally, I enabled HTTPS in the GitHub Pages settings to ensure secure access to my blog. 
This happens automatically when you check the HTTPS checkbox in Github Pages (on your Repository) and after verifying that the DNS has been configured correctly.
Github Pages uses LetsEncrypt to generate this certificate, without having to do nothing (at the user site) and at no cost.

# Step 5: Verifying Changes Locally

Each time I make modifications to the blog, I verify them locally by running the following command. This allows me to preview the changes in a local server before pushing them to GitHub:

```sh
bundle exec jekyll serve
```

# Conclusion

Building this blog has been an incredibly rewarding journey. It's amazing how tools like GitHub Pages and Jekyll can transform a simple idea into a fully functional blog. I hope this guide has provided you with valuable insights and inspiration to start your own blogging journey. Stay tuned for more posts where I'll dive deeper into Azure and share my ongoing IT adventures!

**Cristian Schmitt Nieto**
