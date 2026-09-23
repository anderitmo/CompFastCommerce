---
name: Agile Commerce Engine
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#414754'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#727785'
  outline-variant: '#c1c6d6'
  surface-tint: '#005bc0'
  primary: '#0058bb'
  on-primary: '#ffffff'
  primary-container: '#1171e7'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#6a5f00'
  on-secondary: '#ffffff'
  secondary-container: '#fae100'
  on-secondary-container: '#6f6300'
  tertiary: '#545c72'
  on-tertiary: '#ffffff'
  tertiary-container: '#6c748b'
  on-tertiary-container: '#fefcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#004493'
  secondary-fixed: '#fde400'
  secondary-fixed-dim: '#dec800'
  on-secondary-fixed: '#201c00'
  on-secondary-fixed-variant: '#504700'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: 2.5rem
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '700'
    lineHeight: 2rem
  headline-lg:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
  headline-md:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.5rem
  body-lg:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.25rem
  body-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1rem
  label-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
  label-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
  data-mono:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: '500'
    lineHeight: 1rem
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-2xs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
  space-2xl: 2rem
  space-3xl: 3rem
---

## Brand & Style

The design system projects efficiency, operational clarity, and precision for high-velocity e-commerce operations. Built for merchant managers, inventory handlers, and marketing directors, it channels the agility of leading e-commerce marketplaces while maintaining the disciplined ergonomics required for complex back-office data management.

The design movement is **Modern Corporate & Functional Precision**:
- High-density data tables and uncluttered transactional flows prioritize zero cognitive friction.
- Strategic pops of energetic yellow serve as brand anchors and promotional beacons, balanced by deep, dependable blue for decisive state transitions and primary triggers.
- The interface emphasizes crisp structural boundaries, muted containment lines, and subtle tactile shifts over distracting decorative flourishes.

## Colors

The palette balances operational focus with energetic commerce accents.

- **Primary (`#3483FA` / `#2968C8` hover)**: Represents authority, reliability, and precision. Applied strictly to primary conversion points: saving entities, confirming CRUD operations, filter buttons, and directional pagination.
- **Secondary (`#FFE600`)**: The energetic brand beacon. Used tactically for spotlighting promotional badges, high-impact conversion metrics, campaign alerts, and active flash-deal indicators. Paired with dark slate typography (`#1E293B`) to maintain WCAG AAA compliance.
- **Surfaces & Canvas**:
  - Main Canvas: `#F8F9FC` (cool off-white that prevents screen glare during long shifts).
  - Cards & Data Grids: `#FFFFFF`.
  - Borders & Dividers: `#E2E8F0` for interior dividers; `#CBD5E1` for active interactive frames.
- **Typography Neutrals**:
  - Primary Content / Headings: `#0F172A` (deep ink) and `#1E293B` (slate dark).
  - Secondary Labels & Meta: `#64748B` (cool mid-slate).
  - Tertiary / Placeholders: `#94A3B8`.
- **Semantic Badges**:
  - Active / Paid: `#ECFDF5` surface with `#059669` label.
  - Expired / Cancelled: `#FEF2F2` surface with `#DC2626` label.
  - Draft / Pending: `#FFFBEB` surface with `#D97706` label.
  - Promotional / Featured: `#FEF9C3` surface with `#854D0E` label.

## Typography

The type scale relies entirely on Inter, calibrated specifically for high-information-density admin panels.

- **Tabular Figures**: All currency, stock volumes, SKU identifiers, order IDs, and percentage trends must enforce CSS `font-variant-numeric: tabular-nums;` to guarantee visual alignment in tables.
- **Hierarchy Rules**:
  - `headline-xl`: Main dashboard views and primary operational KPIs.
  - `headline-lg`: Top-level page headers (e.g., "Catálogo de Produtos", "Gestão de Cupons").
  - `headline-md`: Modal headers, slide-over drawer titles, and analytics sub-cards.
  - `body-md`: Standard table row text, input text, and descriptions.
  - `data-mono`: Applied to Supabase UUIDs, tracking codes, and SKU tokens.
- **Vertical Spacing**: Heading tags maintain tight line heights (`1.2` to `1.33`) to prevent layout inflation in data-dense pages.

## Layout & Spacing

The layout is structured around an asymmetrical administrative workbench: a fixed compact sidebar (`240px` expanded, `64px` collapsed) paired with a responsive fluid canvas.

- **Grid Architecture**:
  - Desktop (>1024px): 12-column grid with `1.5rem` gutters and `2rem` outer padding. Max container width: `1600px`.
  - Tablet (768px - 1023px): 8-column layout, sidebar compresses to drawer, `1rem` gutters.
  - Mobile (<768px): 4-column layout, single-column stacked viewports, sticky action footers.
- **Rhythm Rules**:
  - Table cell padding enforces compact vertical density (`space-sm` / `8px`) with comfortable horizontal tracking (`space-lg` / `16px`).
  - Form field groupings adhere to `space-xl` separation, while label-to-input gap is locked to `space-xs`.
  - Modal dialogues use `space-xl` body padding with a sticky `space-lg` footer for submit/cancel buttons.

## Elevation & Depth

Visual hierarchy uses a refined hybrid of **low-contrast structural borders** and **ambient micro-shadows**, ensuring cards remain grounded against the `#F8F9FC` backdrop without introducing visual clutter.

- **Level 0 (Flat Canvas)**: `#F8F9FC`, completely flat, containing foundational layout dividers.
- **Level 1 (Cards & Data Grids)**: Background `#FFFFFF`, perimeter border `1px solid #E2E8F0`, shadow: `0px 1px 2px 0px rgba(15, 23, 42, 0.04)`.
- **Level 2 (Hover States, Dropdowns & Popovers)**: `#FFFFFF`, border `1px solid #CBD5E1`, shadow: `0px 4px 6px -1px rgba(15, 23, 42, 0.08), 0px 2px 4px -2px rgba(15, 23, 42, 0.04)`.
- **Level 3 (CRUD Modals & Slide-over Drawers)**: `#FFFFFF`, shadow: `0px 20px 25px -5px rgba(15, 23, 42, 0.1), 0px 8px 10px -6px rgba(15, 23, 42, 0.04)`. Backdrop uses `rgba(15, 23, 42, 0.4)` with `backdrop-filter: blur(4px)`.
- **Focus Indicators**: No arbitrary offsets; interactive elements display a sharp `0 0 0 2px #FFFFFF, 0 0 0 4px #3483FA` focus ring.

## Shapes

The design system implements a **Soft (`1`)** roundedness profile to maintain a crisp, enterprise-grade aesthetic. 

- Form inputs, buttons, and badges leverage `0.25rem` (4px) to `0.375rem` (6px) corner radiuses.
- Content containers, charts, and CRUD table wrappers apply `0.5rem` (`rounded-lg` / 8px).
- Modals, slide-overs, and floating system banners apply `0.75rem` (`rounded-xl` / 12px).
- Badges and numerical pill counters apply full rounding (`9999px`) to distinguish categorical metadata from interactive rectangular controls.

## Components

### Buttons
- **Primary**: Background `#3483FA`, text `#FFFFFF`, font-weight 600, height 36px (compact) or 40px (standard). Hover: `#2968C8`. Active: `#1E5BB8`. Focus ring: 2px offset.
- **Secondary / Brand Attention**: Background `#FFE600`, text `#1E293B`, font-weight 600. Reserved for high-value actions like "Criar Promoção Relâmpago" or "Destacar Oferta".
- **Outline / Ghost**: Border `1px solid #CBD5E1`, text `#1E293B`, hover background `#F1F5F9`.
- **Destructive**: Background `#FEF2F2`, border `1px solid #FEE2E2`, text `#DC2626`. Hover: background `#DC2626`, text `#FFFFFF`.

### Dense Data Tables
- **Container**: Border `1px solid #E2E8F0`, header row background `#F8F9FC`, border-bottom `1px solid #CBD5E1`.
- **Header Cell**: `label-sm`, text `#64748B`, uppercase tracking, height 36px, vertical-align middle.
- **Body Row**: Height 44px (standard) or 36px (dense view). Hover: background `#F8FAFC`. Alternating stripes avoided; row boundaries signaled by `1px solid #F1F5F9`.
- **Actions Cell**: Right-aligned, quick-trigger icon buttons (Edit, Duplicate, Trash) reveal on row hover to minimize visual noise.

### Status Badges & Coupon Chips
- Inline pills with `padding: 2px 8px`, `border-radius: 9999px`, `label-sm` (0.75rem):
  - **Ativo**: Text `#059669`, background `#ECFDF5`, border `1px solid #A7F3D0`. Includes a 6px pulsing green dot for active coupons.
  - **Expirado / Inativo**: Text `#64748B`, background `#F1F5F9`, border `1px solid #E2E8F0`.
  - **Rascunho**: Text `#D97706`, background `#FFFBEB`, border `1px solid #FDE68A`.
  - **Esgotado**: Text `#DC2626`, background `#FEF2F2`, border `1px solid #FECACA`.

### Input Fields & Controls
- Height: 38px. Border: `1px solid #CBD5E1`, background: `#FFFFFF`, text: `#0F172A`.
- Placeholder: `#94A3B8`. Hover: `#94A3B8`.
- Focus: Border color `#3483FA`, with `box-shadow: 0 0 0 3px rgba(52, 131, 250, 0.15)`.
- Checkboxes: 16x16px, radius 3px, checked state `#3483FA` with white SVG checkmark.

### CRUD Modals & Slide-Over Drawers
- **Modal Dialog**: Centered, max-width `640px` (standard) or `896px` (complex multi-step product editor). Divided into three zones:
  - Header: Sticky top, height 56px, `headline-md` title with dismissive icon.
  - Content: Max-height 70vh, scrollable, inputs organized in 2-column grids with `space-md` gaps.
  - Footer: Sticky bottom, background `#F8FAFC`, border-top `1px solid #E2E8F0`, right-aligned Cancel (Ghost) and Save/Update (Primary Supabase commit) buttons.
- **Drawer**: Slips from right edge (`480px` wide) for rapid editing of localized properties (e.g., single category adjust, discount coupon quick-code generator).