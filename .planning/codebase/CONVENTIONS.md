---
focus: quality
date: 2026-04-30
---

# Coding Conventions

This document covers coding standards, naming conventions, and common patterns found in the project.

## Styling (CSS)

- **CSS Variables**: Extensive use of `:root` variables for consistent colors and theming (e.g., `--bg`, `--accent`, `--text`).
- **Naming Convention**: Uses a semantic, BEM-like or utility-based class naming convention (e.g., `.hero-title`, `.btn-primary`, `.dev-card`).
- **Responsiveness**: Favors fluid typography and spacing using `clamp()` functions and CSS grid/flexbox layouts instead of heavy reliance on discrete media queries.
- **Animations**: CSS `@keyframes` are used heavily for continuous scroll effects, glowing backgrounds, and floating animations.

## HTML

- **Semantics**: Uses standard HTML5 tags (`<nav>`, `<section>`).
- **Structure**: All styles are embedded in a `<style>` block within the `<head>` of the HTML files, rather than split into separate `.css` files.

## JavaScript

- **Minimalism**: Minimal use of JS, primarily for UI interactions like the custom cursor tracking. The JS is included at the bottom of the HTML body.
