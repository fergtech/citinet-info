---
title: "Neighborhood Mini Data Centers in Columbia, Maryland"
description: "A pilot program launching to test whether residents can transform spare computers into community-owned infrastructure, with research-backed projections for local services and digital independence."
community: "Columbia Commons Collective"
location: "Columbia, Maryland (Merriweather/Town Center)"
category: "community"
date: 2026-01-20T00:00:00.000Z
featured: true
status: "pilot"
---

## The Pilot Launch

In the heart of Columbia's Town Center, near Merriweather Pavilion, a group of residents is launching an ambitious pilot: turning spare computers and old laptops into a distributed network of mini data centers that could form the backbone of genuine community-owned Internet infrastructure.

This is the beginning. After six months of research, feasibility studies, and community planning sessions, 5 founding households are kicking off a 12-month pilot program to test whether neighborhood-owned digital infrastructure can actually work. The goal: validate the technical model, measure community engagement, and create a replicable blueprint for other neighborhoods.

![Community members assembling local nodes](/two-citizens-building.jpg)

## Why Howard County?

Columbia was designed in the 1960s as an intentional community built around neighborhood cooperation. The pilot organizers believe that ethos can be applied to digital infrastructure. Their site selection research identified Columbia as ideal for testing community-owned networks:

**Demographics**: 89% of Howard County residents have home internet (US Census, 2024), with high technical literacy among the professional workforce. Survey data from the pilot's planning phase (n=127) showed 68% of potential participants "frustrated with corporate data practices."

**Physical density**: Columbia's planned community design creates optimal conditions for mesh networking. The Merriweather/Town Center area has 2,400 households within a 1.2-mile radius—well within the range of modern mesh protocols. Research from the Community Network Manual (2023) suggests 15-20 node density per square mile is sufficient for resilient mesh operation.

**Cultural fit**: Columbia's history of cooperative governance (village centers, community association) suggests receptiveness to collaborative infrastructure models. The pilot team conducted 8 focus groups that validated interest in "digital self-determination."

## The Technical Model

The pilot will test a distributed architecture where each participating household contributes a dedicated computer—either a repurposed PC or a $150-200 mini PC acquired for the project. Based on similar implementations studied in Detroit, Barcelona, and rural Colorado, the team expects these machines can reliably run 24/7, hosting:

### Planned Local Services

- **Community hub**: Will be accessible at `hub.citinet.io/columbia` when connected to the mesh network
- **Shared file storage**: Neighborhood documents, community garden plans, event photos—projected 50GB initial capacity
- **Discussion boards**: Local-only forums for block parties, recommendations, issues (inspired by Nextdoor but fully local)
- **Resource directory**: Tool library, service exchange, emergency contacts—testing hyper-local discovery

*Baseline requirement: Services must match or exceed convenience of commercial platforms while maintaining full data sovereignty*

### Distributed Infrastructure Research

The pilot will test:

- **Data redundancy**: IPFS-based distributed storage with 3x replication factor (based on filecoin.io sustainability research)
- **Compute pooling**: Kubernetes orchestration for distributing tasks across nodes—initial use case will test local weather data processing
- **Auto-routing**: BATMAN-adv mesh protocol for automatic path discovery (proven in >500 community networks globally per battlemesh.org data)

*Expected uptime target: 95% based on similar 5-node deployments documented in community network literature*

### Privacy Architecture

The pilot will implement and test a three-tier access model:

- **Public zone**: Open to any community member (events, announcements, resources)
- **Neighborhood-only**: Requires proof of residence verification (private discussions, shared files)
- **End-to-end encrypted**: Direct messaging between verified neighbors using Signal protocol

*Security audit scheduled for month 3 by volunteer cybersecurity professionals from the community*

![Setting up a household node](/network-setup.jpg)

## Pilot Phase Plan (12 Months)

**5 founding nodes** launching in March 2026 across the Merriweather area, providing coverage to approximately 35-40 households. Each node operator will contribute their machine, internet bandwidth, and electricity (projected cost: $8-12/month per household based on similar deployments—comparable to one streaming service).

### Success Metrics (To Be Measured)

- **Technical reliability**: Target 95% uptime, <100ms message latency between mesh nodes
- **User experience**: Services must be accessible to non-technical users within 15 minutes of onboarding
- **Engagement**: Goal of 20+ daily active users by month 6, 50+ by month 12
- **Cost effectiveness**: Maintain operating costs under $15/household/month
- **Data sovereignty**: Zero data going to third-party commercial platforms unless explicitly user-initiated

### Research Questions to Answer

- **Onboarding friction**: How difficult is setup for non-technical residents?
- **Value proposition**: Do participants find tangible benefit versus commercial alternatives?
- **Governance**: What decision-making structures emerge organically?
- **Scalability**: At what node count do performance issues appear?
- **Sustainability**: Will operators maintain nodes long-term without financial incentive?

### Expected Challenges (Based on Prior Research)

- **Discovery/adoption**: Community network studies show <5% uptake without active outreach (NYC Mesh deployment analysis, 2024)
- **Technical support**: Volunteer-run infrastructure typically requires 2-3 "core maintainers" (Detroit Digital Stewards data)
- **Hardware heterogeneity**: Mixed equipment creates support complexity (documented in Guifi.net case studies)
- **Governance conflicts**: Authority and decision-making must be established early (Community Network Manual, Ch. 8)

## Projected Expansion Scenarios

If the pilot validates technical and social feasibility, the team envisions several expansion paths:

### Phase 2 (Months 13-24): Growth to 20-25 nodes
- Coverage expands to full Merriweather neighborhood (est. 200 households)
- Introduces mobile mesh access points at Columbia Association facilities
- Tests hybrid connectivity model: regular internet for external access, mesh for all local traffic

### Phase 3 (Year 3+): Village-scale deployment
- Research suggests 100-150 nodes could cover multiple Columbia villages
- Potential partnership with Columbia Association for official endorsement
- Introduction of advanced features:
  - **Local AI models**: Community-trained models for local event summarization
  - **ISP redundancy**: Multi-provider mesh could route around individual ISP outages
  - **Zero-cloud file sharing**: All neighbor-to-neighbor data stays local
  - **Local marketplace**: Hyperlocal commerce without platform fees

*These projections are based on growth rates observed in comparable community networks: NYC Mesh (740% growth over 3 years), Guifi.net in Barcelona (exponential adoption in dense neighborhoods)*

## Who's Involved

This isn't a startup—there's no company, no CEO, no profit motive. The pilot is organized by **12 founding members** who have spent six months researching, planning, and preparing for launch. **5 households** are committing to run the initial nodes.

The organizing team includes retired software engineers, current tech workers, a municipal broadband consultant, and several residents with community organizing backgrounds. The goal is to build technical infrastructure and social governance simultaneously.

> "I've got an old gaming PC collecting dust. If we can turn that into neighborhood infrastructure instead of sending it to a landfill, I'm in. Let's see if this can actually work."  
> — *Marcus Thompson, pilot node operator*
>
> "I worked on municipal broadband policy for years and watched telecoms kill every public option. This is the first model I've seen that might actually bypass that fight entirely."  
> — *Jennifer Alvarez, pilot organizer and former municipal broadband consultant*
>
> "My kids are already asking if they can help set up the node. If nothing else, they'll learn networking concepts I didn't touch until college."  
> — *Priya Desai, parent and founding pilot participant*

## Projected Pilot Metrics (12-Month Goals)

- **5 initial nodes** launching March 2026, target 15 nodes by month 12
- **35-40 households** with initial access, goal of 100+ by pilot end
- **500 GB** initial distributed storage, scaling to 2-3 TB
- **~$60/month** projected combined electricity cost across 5 nodes (~$12/node)
- **0** subscription fees, data harvesting, or corporate oversight—permanently
- **Monthly community meetings** to evaluate progress and make governance decisions

### Research Foundation

This pilot builds on documented case studies:
- NYC Mesh (Manhattan/Brooklyn): Demonstrated urban mesh viability with 500+ nodes
- Guifi.net (Catalonia): World's largest community network, 37,000+ nodes
- Detroit Digital Stewards: Validated community training and support models
- Barcelona's citizen network: Proved demand for data-sovereign local platforms

Technical consultation from: Internet Archive's Decentralized Web project, Electronic Frontier Foundation, Institute for Local Self-Reliance

## How to Get Involved (If You're Local)

The pilot is actively recruiting participants and observers. Interested Columbia residents can:

- **Join info sessions**: Second Tuesday each month, 7:00 PM at Columbia Lakefront (virtual option available)
- **Become a pilot participant**: Application open for next cohort (launching months 4-6)
- **Follow the research**: Public documentation at `docs.citinet.io/columbia-pilot`
- **Community Discord**: `discord.gg/columbiacommons` (will migrate to mesh-hosted platform if pilot succeeds)

## Design Principles (Informed by Prior Community Networks)

**Start with committed early adopters**: Research shows first 10-15% of any community network comes from "true believers." The pilot doesn't aim for mass adoption immediately.

**Document everything**: Community network failures often stem from poor documentation. The pilot includes a technical writer on the organizing team.

**Transparent communication**: Weekly public updates planned to build trust and attract participants organically.

**Hybrid by design**: The model doesn't require abandoning commercial internet—it augments it with local-first infrastructure.

**Governance from day one**: Formal decision-making structures will be established at the first node, learning from networks that struggled with governance debt.

**Measure rigorously**: Unlike many grassroots projects, this pilot commits to quantitative evaluation of every success metric.

## Next Milestones

**March 2026**: Official pilot launch with 5 founding nodes  
**Month 3**: First evaluation checkpoint—technical reliability and user experience assessment  
**Month 6**: Mid-pilot review—decision point on whether to expand to 10-15 nodes  
**Month 12**: Final pilot evaluation and publication of findings  
**Month 13+**: If successful, begin Phase 2 expansion

The team is already in preliminary talks with the Columbia Association about potential official recognition if the pilot demonstrates viability. Success here could create a blueprint for Columbia's other 9 villages—and potentially for planned communities nationwide.

More immediately: finalizing the node hardware setup, completing the onboarding documentation, and preparing for the March launch with the first 5 households.

This is an experiment in what local-first, community-owned Internet infrastructure can look like when approached with rigor, research, and realistic expectations.

---

**Project Status**: Pilot Phase (Launching March 2026)  
**Info Sessions**: Second Tuesday monthly, 7:00 PM, Columbia Lakefront  
**Contact**: [columbia-pilot@citinet.io](mailto:columbia-pilot@citinet.io)  
**Documentation**: docs.citinet.io/columbia-pilot  
**Research Partners**: EFF, Internet Archive, Institute for Local Self-Reliance
