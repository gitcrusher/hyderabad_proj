---
name: Cyber Editorial
colors:
  surface: '#0f131d'
  surface-dim: '#0f131d'
  surface-bright: '#353944'
  surface-container-lowest: '#0a0e18'
  surface-container-low: '#171b26'
  surface-container: '#1c1f2a'
  surface-container-high: '#262a35'
  surface-container-highest: '#313540'
  on-surface: '#dfe2f1'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#dfe2f1'
  inverse-on-surface: '#2c303b'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#ffb690'
  on-secondary: '#552100'
  secondary-container: '#ec6a06'
  on-secondary-container: '#4a1c00'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#00885d'
  on-tertiary-container: '#000703'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#ffdbca'
  secondary-fixed-dim: '#ffb690'
  on-secondary-fixed: '#341100'
  on-secondary-fixed-variant: '#783200'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#0f131d'
  on-background: '#dfe2f1'
  surface-variant: '#313540'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 38px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: 0em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.04em
  label-md:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 3rem
  margin-sm: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style
The design system channels high-voltage campus culture through a cyber-editorial aesthetic—a collision of club culture, technical event management, and late-night digital immersion. Designed for university students, campus organizers, and institutional leads, the interface captures the urgency and kinetic buzz of live events. 

The aesthetic merges raw editorial typography with sleek dark-mode glassmorphism. Interfaces feel alive, atmospheric, and high-velocity. Deep obsidian backdrops establish low-glare depth, punctuated by concentrated bursts of luminescent neon accents to signal states, energy tiers, and live telemetry. Spatial layouts borrow from contemporary art book grids and club flyers, grounding aggressive energy within refined visual governance.

## Colors
The palette operates on stark contrast against deep obsidian canvases:

- **Primary (`#6366F1` - Electric Violet):** Anchors core actions, platform identity, navigation milestones, and focus states.
- **Secondary (`#F97316` - Neon Tangerine):** Drives peak urgency, featured ticket releases, high-priority notifications, and `Sold Out` or `Live` warning signals.
- **Tertiary (`#10B981` - Vivid Mint):** Denotes active registration, positive capacity metrics, financial settlement, and `Live` status indicators.
- **Neutral Canvas (`#0B0F19` deep void & `#111827` elevated surface):** Absorbs visual weight, allowing neon highlights to command cognitive priority without fatiguing the eye.

Subtle white opacities (`rgba(255, 255, 255, 0.05)` through `rgba(255, 255, 255, 0.15)`) govern architectural lines, card perimeters, and translucent background fills.

## Typography
The system enforces a dual-typeface structure:
- **Space Grotesk** commands display headers, status badges, timestamps, capacity meters, and metadata labels. Its geometric cuts and mechanical nuances introduce a futuristic print-flyer voice. All metadata tags and badge strings use uppercase tracking via `label-sm` and `label-md`.
- **Plus Jakarta Sans** powers all long-form copy, event descriptions, registration flows, and UI settings. Its generous x-height and clean humanist curves maintain pristine legibility under high-density, low-light viewing conditions.

## Layout & Spacing
The layout relies on a 12-column responsive fluid grid designed to support variable content densities:
- **Desktop (1024px+):** 12 columns, `1.5rem` gutters, `3rem` canvas margins. Asymmetrical column distribution pairs dense 4-column telemetry panels with open 8-column media streams.
- **Tablet (768px - 1023px):** 8 columns, `1.25rem` gutters, `2rem` margins. Side panels reflow beneath primary visual modules.
- **Mobile (< 768px):** 4 columns, `1rem` gutters, `1.25rem` margins. Single-column stacked flows prioritize chronological urgency, capacity pills, and sticky actions.

Vertical rhythms scale using the fixed spacer tokens (`space-xs` through `space-xl`), ensuring compact groupings for badge/detail clusters and expansive offsets between major narrative sections.

## Elevation & Depth
Depth is constructed through stacked luminosity and glass diffusion rather than conventional drop shadows:

1. **Base Layer (Canvas):** Pure `#0B0F19`, absorbing optical contrast.
2. **Surface Tier (Cards & Sheets):** Backdrop blur (`16px` to `24px`) coupled with fill `rgba(17, 24, 39, 0.7)` and a crisp structural stroke (`1px solid rgba(255, 255, 255, 0.08)`).
3. **Floating Overlay (Modals, Role Switcher, Persistent HUD):** Fill `rgba(17, 24, 39, 0.88)` with `28px` blur, bordered by `rgba(255, 255, 255, 0.15)`.
4. **Luminescent Glow:** High-priority cards (such as Live events) shed atmospheric, low-opacity ambient halos:
   - Primary Accent: `0 0 32px -8px rgba(99, 102, 241, 0.3)`
   - Live Warning/Action: `0 0 32px -8px rgba(249, 115, 22, 0.3)`
   - Mint Active: `0 0 28px -6px rgba(16, 185, 129, 0.35)`

## Shapes
The shape hierarchy emphasizes modern precision through calibrated radii:
- Standard containers, interactive inputs, and content panels employ an `8px` (`0.5rem`) radius.
- Structural showcase cards and floating modals scale up to `16px` (`1rem`).
- Micro-elements—specifically status tags, dynamic metrics, and the persistent Role Switcher—utilize pill forms (`9999px`) to offset rigid architectural layouts with fluid, touch-optimized ergonomics.

## Components

### Role Switcher
- An omnipresent, floating control fixed centrally at the bottom or top-right of the viewport.
- Uses a pill capsule housing segmented glass tabs: `Student`, `Organizer`, and `Admin`.
- Active segment is highlighted with a solid fill (`#6366F1`) or glass plate (`rgba(255, 255, 255, 0.15)`), shifting layout context instantly without route reloads.

### Event Cards (Glass System)
- Backed with `rgba(17, 24, 39, 0.65)` and `1px` translucent edge lines (`rgba(255, 255, 255, 0.08)`).
- Media headers host full-bleed imagery with bottom-edge gradient falls into obsidian.
- Live hover transitions step the border luminance to `rgba(255, 255, 255, 0.25)` and trigger faint accent edge halos.

### Glowing Status Badges
- Compact pill forms pairing a pulsing `6px` indicator beacon with uppercase Space Grotesk tracking (`label-sm`).
- **Draft:** Neutral slate outline, text `rgba(255, 255, 255, 0.5)`.
- **Published:** Electric Violet outline and text, subtle `#6366F1` background tint (`10%`).
- **Live:** Vivid Mint beacon with animated radial pulse, text `#10B981`, mint halo.
- **Sold Out:** Neon Tangerine glow, border `#F97316`, high-contrast warning badge.

### Capacity Meter & Tiers
- Slender progress bars (`4px` height) set within dark track channels.
- Fills shift dynamically from Vivid Mint (nominal) to Electric Violet (accelerating) to Neon Tangerine (critical > 90%).

### Interactive Buttons & Chips
- **Primary Buttons:** High-energy `#6366F1` fill, dark contrasting text or pure white with `0 0 20px rgba(99, 102, 241, 0.4)` glow on hover.
- **Secondary / Ghost Buttons:** Transparent canvas with `1px` frosted border (`rgba(255, 255, 255, 0.12)`), text brightening on hover.
- **Filter Chips:** Pill shapes in `rgba(255, 255, 255, 0.04)`; selected state locks to electric accents with illuminated outer rings.

### Inputs & Search Bars
- Recessed dark frames (`rgba(11, 15, 25, 0.8)`) with `1px` inset borders. Focus activates a crisp `#6366F1` perimeter and low-radius exterior aura.