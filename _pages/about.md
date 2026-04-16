---
permalink: /about/
title: "About"
subtitle: Welcome to My Azure Journey
classes:
  - wide
  - about-page
---

<style>
  .about-hero {
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .about-avatar {
    width: 160px;
    height: 160px;
    object-fit: cover;
    border-radius: 50%;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
  }

  .about-certifications {
    margin-top: 2rem;
  }

  .about-career-timeline {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    max-width: 52rem;
    margin: 1.75rem auto 0;
    padding-left: 2.25rem;
  }

  .about-career-timeline::before {
    content: "";
    position: absolute;
    top: 0.45rem;
    bottom: 0.45rem;
    left: 0.65rem;
    width: 2px;
    background: linear-gradient(180deg, rgba(96, 165, 250, 0.85) 0%, rgba(96, 165, 250, 0.18) 100%);
  }

  .about-career-card {
    position: relative;
    padding: 1.25rem 1.25rem 1.25rem 1.35rem;
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.03);
  }

  .about-career-card::before {
    content: "";
    position: absolute;
    top: 1.35rem;
    left: -1.96rem;
    width: 0.95rem;
    height: 0.95rem;
    border: 3px solid rgba(96, 165, 250, 0.95);
    border-radius: 50%;
    background: #0f172a;
    box-shadow: 0 0 0 6px rgba(96, 165, 250, 0.12);
  }

  .about-career-card h3 {
    margin-top: 0;
    margin-bottom: 0.2rem;
    font-size: 1.05rem;
  }

  .about-career-role {
    margin-bottom: 0.35rem;
    font-size: 0.98rem;
    font-weight: 700;
  }

  .about-career-period {
    display: inline-block;
    margin-bottom: 0.8rem;
    padding: 0.22rem 0.6rem;
    border-radius: 999px;
    background: rgba(96, 165, 250, 0.12);
    color: rgba(255, 255, 255, 0.72);
    font-size: 0.88rem;
    font-weight: 600;
  }

  .about-career-card p:last-child {
    margin-bottom: 0;
  }

  .about-certification-group {
    margin: 2rem 0;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.03);
  }

  .about-certification-group h3 {
    margin-top: 0;
    margin-bottom: 0.35rem;
  }

  .about-certification-group p {
    margin-top: 0;
    margin-bottom: 1.25rem;
  }

  .about-certification-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
  }

  .about-certification-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.85rem;
    min-height: 100%;
    padding: 1rem;
    text-decoration: none !important;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.04);
    transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
  }

  .about-certification-card:hover {
    transform: translateY(-3px);
    border-color: rgba(0, 123, 255, 0.55);
    background: rgba(255, 255, 255, 0.07);
  }

  .about-certification-card img {
    width: clamp(120px, 16vw, 160px);
    height: clamp(120px, 16vw, 160px);
    object-fit: contain;
    padding: 0.4rem;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.02);
  }

  .about-certification-card span {
    display: block;
    font-size: 0.95rem;
    font-weight: 600;
    line-height: 1.4;
    text-align: center;
  }

  html.light-theme .about-career-card,
  html.light-theme .about-certification-group {
    border-color: #d7dee6;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 14px 28px rgba(148, 163, 184, 0.12);
  }

  html.light-theme .about-career-timeline::before {
    background: linear-gradient(180deg, rgba(59, 130, 246, 0.9) 0%, rgba(59, 130, 246, 0.2) 100%);
  }

  html.light-theme .about-career-card::before {
    background: #ffffff;
    border-color: #3b82f6;
    box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.12);
  }

  html.light-theme .about-career-period,
  html.light-theme .about-certification-group p {
    color: #475569;
  }

  html.light-theme .about-career-period {
    background: rgba(59, 130, 246, 0.12);
  }

  html.light-theme .about-certification-card {
    border-color: #d7dee6;
    background: #f8fafc;
  }

  html.light-theme .about-certification-card:hover {
    background: #ffffff;
    border-color: #60a5fa;
  }

  html.light-theme .about-certification-card img {
    background: linear-gradient(180deg, #ffffff 0%, #f3f6fa 100%);
    box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.14);
  }

  @media (max-width: 540px) {
    .about-career-timeline {
      padding-left: 1.8rem;
    }

    .about-career-card::before {
      left: -1.52rem;
    }

    .about-career-card,
    .about-certification-group {
      padding: 1rem;
    }
  }
</style>

<div class="about-hero">
  <img src="/assets/img/avatar-csn.jpeg" alt="Cristian Schmitt Nieto" class="about-avatar" />
</div>

## Introduction

Hello! I'm **Cristian Schmitt Nieto**, an IT professional originally from Spain and now based in Germany. With more than a decade of experience, I currently work as a **Senior Consultant at adesso**. I enjoy building practical solutions that connect traditional on-premises infrastructure with modern cloud services, with a strong focus on **Azure Local**, **Hybrid Cloud**, and **Azure Virtual Desktop (AVD)**.

## Career Overview

I started in hands-on support and infrastructure roles, where I learned how production environments really behave under pressure. Over time, that foundation in Windows Server, networking, virtualization, and customer operations evolved into a clear specialization in **Azure**, **Azure Local**, **Azure Arc**, and **Azure Virtual Desktop**.

Today, my work sits at the intersection of hybrid architecture, delivery, automation, and customer enablement. I enjoy taking projects from assessment to go-live, translating complex technical dependencies into pragmatic roadmaps, and helping teams run secure, maintainable platforms after handover.

## Employer Journey

<div class="about-career-timeline">
  <section class="about-career-card">
    <h3>adesso SE</h3>
    <div class="about-career-role">Senior Consultant</div>
    <div class="about-career-period">Mar 2026 to Present</div>
    <p>I continue delivering the same kind of hybrid cloud and end-user computing work I was already leading before, now with a stronger focus on the German market. That includes Azure architecture, Azure Local, Azure Virtual Desktop, governance, automation, and structured customer delivery.</p>
  </section>
  <section class="about-career-card">
    <h3>Devoteam M Cloud</h3>
    <div class="about-career-role">Lead Consultant</div>
    <div class="about-career-period">Jul 2024 to Mar 2026</div>
    <p>I led international projects across Europe for mid-size and enterprise customers, covering discovery, design, implementation, validation, handover, and training. I also supported the evidence process behind Devoteam's Azure Virtual Desktop Specialization pass.</p>
  </section>
  <section class="about-career-card">
    <h3>Medialine Group</h3>
    <div class="about-career-role">Azure Consultant</div>
    <div class="about-career-period">Jul 2021 to Jun 2024</div>
    <p>This was the phase where I fully deepened my Azure specialization, delivering projects around Azure Virtual Desktop, Azure Stack HCI and later Azure Local, Azure Arc, landing zones, hybrid identity, and infrastructure automation.</p>
  </section>
  <section class="about-career-card">
    <h3>mits group GmbH</h3>
    <div class="about-career-role">IT Technician to IT Team Lead</div>
    <div class="about-career-period">Mar 2014 to Jun 2021</div>
    <p>I built my infrastructure foundation here, from support and systems administration to leading a small technical team. The work covered datacenter operations, Citrix, Hyper-V, firewalls, VPNs, Windows Server, Active Directory, and customer-facing project delivery.</p>
  </section>
</div>

## Current Focus

I mainly work on:

* **Hybrid Cloud Solutions:** Connecting Azure Local and on-premises platforms with public Azure services in a secure and operationally clean way.
* **Azure Virtual Desktop:** Designing, deploying, and optimizing end-user computing platforms for performance, governance, and scale.
* **Automation and Platform Delivery:** Using tools such as **PowerShell**, **Terraform**, **Bicep**, and **GitHub** to improve repeatability and reduce operational friction.

## Areas of Expertise

* **Hybrid Cloud:** Combining on-premises and cloud capabilities into one coherent platform.
* **Azure Infrastructure:** Working across Azure Local, Azure Virtual Desktop, and core public Azure services.
* **Client Solutions:** Translating technical options into practical roadmaps for cloud adoption and modernization.

## Certifications

Over the years, I have earned a combination of vendor certifications and community recognitions. I grouped them by issuing organization below so they are easier to browse on both desktop and mobile.

<div class="about-certifications">
  {% for issuer in site.data.certifications %}
    <section class="about-certification-group">
      <h3>{{ issuer.name }}</h3>
      <p>{{ issuer.description }} <strong>{{ issuer.credentials.size }}</strong> credentials.</p>
      <div class="about-certification-grid">
        {% for certification in issuer.credentials %}
          <a class="about-certification-card" href="{{ certification.url }}" target="_blank" rel="noopener noreferrer">
            <img src="{{ certification.image }}" alt="{{ certification.title }}" />
            <span>{{ certification.title }}</span>
          </a>
        {% endfor %}
      </div>
    </section>
  {% endfor %}
</div>

## Final Thoughts

This is a personal blog. The views and opinions expressed here are solely my own and do not represent those of any organization or individual with whom I may be associated, either professionally or personally. All solutions, scripts, and guidance are provided as-is without warranty, and their use is at the reader's own risk.

My journey in IT and cloud technologies continues to evolve, and I am glad to share it here. Whether you are just getting started or already deep into your own transformation journey, I hope these experiences and lessons help in some small but meaningful way.
