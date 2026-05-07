---
focus: arch
date: 2026-04-30
---

# Architecture

This document describes the high-level architecture and data flow of the application.

## Pattern

- **Static Single/Multi-page Application**: The site is a standard static website consisting of simple HTML files. There is no complex data layer, routing engine, or state management. Navigation is achieved via standard `<a>` tag links.

## Entry Points

- `index.html`: The primary entry point for the user. It contains the complete homepage structure including the navigation bar, hero section, about section, portfolio grid, and services layout.
- `teste/teste.html`: Secondary/experimental entry point.

## Layers

- **Presentation Layer**: HTML documents with embedded `<style>` tags. All styling and layout logic are self-contained within the HTML files themselves.
- **Interactivity Layer**: Minimal embedded `<script>` tags handling custom cursors, noise overlays, and scroll animations.

## Data Flow

- The content and data are completely static and hardcoded into the HTML markup. No external state or database is fetched at runtime.
