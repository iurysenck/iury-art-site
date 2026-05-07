---
focus: concerns
date: 2026-04-30
---

# Codebase Concerns

This document tracks technical debt, known issues, and areas of concern that should be addressed.

## Technical Debt

- **Inline/Embedded Styles**: `index.html` is very large (over 80KB) and contains thousands of lines of CSS embedded directly in the `<head>`. This reduces maintainability, makes it hard to reuse styles across pages, and prevents browser stylesheet caching.
- **Code Duplication**: As multiple pages are created (like moving the `teste/` pages to production), having embedded CSS will inevitably lead to massive duplication and out-of-sync designs.
- **No Build Step**: Without a minifier or asset bundler, the site cannot easily leverage asset optimization or modular component structures.

## File Organization

- The `teste/` directory contains several large HTML files (`teste.html`, `landing-vhs-glitch.html`) which appear to be unorganized experiments. These might clutter the repository if not cleaned up or officially documented.

## Security

- No immediate security vulnerabilities were detected (it's a static site). No leaked secrets or API keys were found in the HTML source code.

## Performance

- Large, monolithic HTML files might experience a slightly delayed first-paint due to the browser needing to parse all the CSS in the head before rendering the `<body>`.
