---
focus: tech
date: 2026-04-30
---

# Tech Stack

This document details the technologies, languages, and frameworks used in the codebase.

## Core Technologies

- **HTML5**: Used for semantic structure across the static pages.
- **CSS3**: Used for styling, heavily relying on CSS Custom Properties (`:root` variables) for theming (`--bg`, `--accent`, etc.), and complex animations like the custom cursor and noise overlays.
- **Vanilla JavaScript**: Used for basic interactivity (custom cursor tracking, floating elements) directly embedded in the HTML files.

## Frameworks & Libraries

- **None**: This is a pure vanilla static site. No frontend frameworks like React, Vue, or Angular are used. No utility CSS frameworks like Tailwind are used; all CSS is custom and inline/embedded.

## Assets & Fonts

- **Fonts**: Space Grotesk and Syne (loaded via Google Fonts).
- **Icons**: Lucide Icons (loaded via unpkg CDN).

## Infrastructure / Build

- **Build Tool**: None. The files are static and served directly as-is without any minification or bundling steps.
- **Hosting**: Standard static file serving.

## Configuration

- The project contains standard static site SEO configuration files like `robots.txt` and `sitemap.xml`.
- Also contains `cline_mcp_settings.json` for MCP tool configurations.
