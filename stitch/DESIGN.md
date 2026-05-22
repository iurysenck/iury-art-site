---
version: alpha
name: iury.art Design System
description: Visual rules and tokens for Iury Senck portfolio page.
colors:
  primary: "#ff3366"
  secondary: "#6366f1"
  neutral: "#ffffff"
  neutral-muted: "#666666"
  background: "#050505"
  background-secondary: "#0a0a0a"
  border: "#141414"
  card-bg: "#0d0d0d"
typography:
  h1:
    fontFamily: Syne
    fontSize: 96px
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: -0.04em
  h2:
    fontFamily: Syne
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.03em
  body:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: 4px
  md: 8px
  lg: 16px
  xl: 20px
  xxl: 24px
  full: 100px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
---

# iury.art Design System

## Overview
Design sistema para o portfólio iury.art. Estética minimalista e premium com tema escuro (dark mode), tipografia expressiva e interações 3D (Three.js). Foco em produções audiovisuais de alta qualidade.

## Colors
Paleta de cores de alto contraste e gradientes vibrantes sobre fundo escuro.
- **Primary (#ff3366):** Rosa vibrante para destaque e interações.
- **Secondary (#6366f1):** Violeta/indigo usado em gradientes e transições.
- **Neutral (#ffffff):** Branco para texto legível.
- **Neutral Muted (#666666):** Cinza para descrições secundárias.
- **Background (#050505):** Fundo principal escuro.
- **Background Secondary (#0a0a0a):** Fundo secundário.

## Typography
Uso de duas famílias tipográficas contrastantes:
- **Syne:** Tipografia para títulos de impacto, com peso extra bold e kerning fechado.
- **Space Grotesk:** Tipografia mono-espaçada/geométrica para corpo de texto, navegação e informações técnicas.

## Layout
- Grelhas de 12 colunas para o portfólio e layouts fluidos.
- Margens flexíveis baseadas na unidade base de 8px.
- Container central com largura máxima de 1400px.

## Elevation
Efeitos glassmorphic:
- Bordas translúcidas (`rgba(255, 255, 255, 0.08)`).
- Fundos de cartões semitransparentes (`rgba(255, 255, 255, 0.02)`).
- Efeito de profundidade com sobreposição de ruído sutil (Noise) e blur.

## Shapes
Formas arredondadas e fluidas:
- Cartões com cantos arredondados de 20px/24px.
- Botões e pílulas em formato cápsula (100px).
- Transições dinâmicas de partículas 3D.

## Components
Estilos para elementos interativos:
- **Botões (Buttons):** Cantos arredondados, preenchimento sólido (preto/branco) ou outline translúcido. Micro-animações de escala no hover.
- **Cartões de Portfolio (Portfolio Cards):** Overlays gradientes escuros com revelação de imagem no hover e cursor customizado.
- **Cursor Customizado (Custom Cursor):** Anel circular rosa e ponto central que reagem a elementos hover.

## Do's and Don'ts
### Do's
- Use sempre fontes Syne para títulos grandes e Space Grotesk para textos informativos.
- Mantenha o fundo escuro puro (#050505) para garantir contraste com as partículas 3D.
- Adicione transições suaves em todos os estados hover.

### Don'ts
- Não use sombras pesadas ou cores sólidas brilhantes fora da paleta definida.
- Não remova o cursor customizado em telas de desktop.
- Não altere a proporção das imagens de portfólio.
