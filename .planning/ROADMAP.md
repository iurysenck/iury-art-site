# Roadmap

## Phase 1: 3D Engine & Foundation
**Goal:** Initialize Three.js in the vanilla environment and render a full-screen canvas.
- [ ] 1.1 Add Three.js dependencies
- [ ] 1.2 Setup Three.js scene, camera, and renderer
- [ ] 1.3 Handle window resizing

## Phase 2: Particle System
**Goal:** Create the core particle mechanics.
- [ ] 2.1 Implement points/particles geometry
- [ ] 2.2 Create vertex/fragment shaders for particle transitions (optional/advanced) or simple particle manipulation
- [ ] 2.3 Develop transition logic (fullscreen burst/morph)

## Phase 3: Scroll Integration (Scrollytelling)
**Goal:** Drive the 3D animation timeline with user scroll.
- [ ] 3.1 Setup scroll listener / GSAP ScrollTrigger
- [ ] 3.2 Map scroll progress to particle animation progress

## Phase 4: 3D Gallery Elements
**Goal:** Display portfolio items in the 3D space.
- [ ] 4.1 Load portfolio images as textures
- [ ] 4.2 Position items in 3D space
- [ ] 4.3 Tie item visibility/movement to scroll
