---
name: Clarity Retail
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#6a5f00'
  on-secondary: '#ffffff'
  secondary-container: '#fae100'
  on-secondary-container: '#6f6300'
  tertiary: '#006242'
  on-tertiary: '#ffffff'
  tertiary-container: '#007d55'
  on-tertiary-container: '#bdffdb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#fde400'
  secondary-fixed-dim: '#dec800'
  on-secondary-fixed: '#201c00'
  on-secondary-fixed-variant: '#504700'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.005em
  label-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.375rem
  space-sm: 0.625rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

The design system is crafted specifically for independent shop owners, boutique managers, and non-technical retail operators who balance in-store operations with digital sales. The operational reality of these users demands immediate comprehension, zero cognitive clutter, and complete reassurance during mission-critical tasks like inventory updates, order fulfillment, and price adjustments.

The visual approach combines modern functional minimalism with warm, approachable retail utility:
- **Calm, High-Legibility Canvas:** Soft slate backgrounds paired with crisp white functional cards remove stark digital glare while keeping actionable elements distinct.
- **Friendly Confidence:** Crisp structural typography paired with an approachable, saturated yellow accent brings energy and human warmth without compromising administrative authority.
- **Low Cognitive Overhead:** Dense tables and complex spreadsheets are replaced with clean, highly structured list containers, generous click targets, explicit labels, and plain-language helpers that build confidence rather than intimidation.

## Colors

The palette balances accessible utilitarian structure with warm retail friendliness. Every color has an assigned operational duty to ensure clarity across rapid scanning.

- **Primary (`#2563eb`):** Trusted Cobalt Blue. Reserved for primary operational actions (e.g., "Save Product", "Ship Order"), active selection indicators, and focused form states. Delivers strict WCAG AAA compliance against white and light slate canvases.
- **Secondary (`#ffe600`):** Mercado Warm Yellow. An optimistic, high-visibility retail accent. Used selectively for critical banners, promotional/badge highlights, and secondary attention callouts. Always paired with `#0f172a` text for high-contrast legibility.
- **Tertiary (`#10b981`):** Emerald Green. Designates successful states, paid invoices, healthy stock levels, and completed deliveries.
- **Neutral (`#0f172a`):** Deep Slate Ink. The primary text color, delivering authoritative contrast without the harshness of pure `#000000`.

### Functional Status & Foundation Palette
- **Canvas Base:** `#f8fafc` (Soft cool slate)
- **Surface Cards:** `#ffffff` (Pure optical white)
- **Calm Borders:** `#e2e8f0` (Neutral light border for quiet containment)
- **Muted Text / Secondary Labels:** `#64748b`
- **Warning / Action Pending:** `#f59e0b` (Warm Amber for low stock or pending capture)
- **Neutral / Draft Status:** `#64748b` (Slate for inactive or draft records)
- **Destructive / Error:** `#ef4444` (Clear Red for cancellations, refunds, or validation errors)

## Typography

The design system relies entirely on **Inter** across all roles to ensure universal legibility, rock-solid numerical data rendering, and a crisp, modern tone.

- **Numerics & Tabular Data:** All financial stats, order IDs, inventory quantities, and currency amounts should employ tabular figures (`tnum`) to maintain clean optical alignment across lists and summary tables.
- **Generous Line Height:** Body and description tokens maintain open line-heights to support non-technical users reading long item descriptions or processing lists of shipping addresses.
- **Hierarchy Separation:** Clear visual distinction is established via weight jumping (regular `400` to semi-bold `600`) rather than extreme scale jumps, keeping screen layouts compact and orderly.

## Layout & Spacing

The layout model is built on an adaptive 12-column fluid grid system that prioritizes generous breathing room and uncluttered content density.

- **Desktop (1024px+):** 12 columns with 24px (`1.5rem`) gutters and a 32px (`2rem`) canvas margin. Administrative workspaces, metrics dashboards, and order queues sit inside centered maximum-width containers (max `1440px`), preventing content from stretching uncomfortably on ultra-wide screens.
- **Tablet (768px - 1023px):** 8 columns with 20px gutters and 24px margins. Sidebar navigation collapses to an intuitive accessible rail or off-canvas drawer.
- **Mobile (< 768px):** 4 columns with 16px (`1rem`) gutters and 16px (`1rem`) screen margins. Forms and item summaries stack vertically into single-column layouts for effortless one-handed thumb navigation in busy retail environments.
- **Spacing Rhythm:** Form fields and card internals prioritize `space-md` (16px) and `space-lg` (24px) padding to eliminate accidental taps and visual crowding.

## Elevation & Depth

Visual hierarchy is maintained through soft, calm boundaries and ultra-subtle ambient depth. Heavy, high-opacity drop shadows are eliminated in favor of clean separation and calm boundaries.

- **Flat Resting Surface (Level 0):** Background canvas sits at `#f8fafc`. Interactive cards, summary panels, and listing blocks rest directly on top with pure white `#ffffff` backgrounds and a uniform `1px solid #e2e8f0` calm border.
- **Soft Ambient Card Depth (Level 1):** Standard cards and interactive containers gain a subtle, natural lift using:
  `box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.03);`
  This delivers gentle depth while keeping the screen serene and clutter-free.
- **Floating Operational Layers (Level 2):** Modals, flyout menus, tooltips, and floating order bars use an expanded ambient elevation:
  `box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.06), 0 4px 6px -4px rgba(15, 23, 42, 0.03);`
  Paired with an `e2e8f0` stroke, this layer visibly floats above administrative data without aggressive dark shadows.

## Shapes

The design system incorporates a balanced, friendly geometric radius (`roundedness: 2`). This level softens institutional rigidity without feeling cartoonish, producing welcoming, click-friendly touch targets:

- **Base Components (Inputs, Buttons, Badges):** Feature an 8px (`0.5rem`) corner radius. This creates clean, modern touch surfaces that feel tactile and approachable.
- **Structural Containers (Cards, Modals, Tables):** Feature a 16px (`1rem`) corner radius, neatly framing related content clusters into distinct, digestible islands.
- **Pill Badges & Status Chips:** Fully rounded (`9999px`) to immediately signal categorical, non-actionable status metadata at a glance.

## Components

### Buttons
- **Primary:** Background `#2563eb`, text `#ffffff`, height `48px` (large target for easy tapping), horizontal padding `20px`, font `label-lg`. Hover: `#1d4ed8`. Focused: 3px outer ring in `rgba(37, 99, 235, 0.25)`.
- **Secondary / Accent:** Background `#ffe600`, text `#0f172a`, height `48px`, font `label-lg`, hover: `#f5dc00`. Ideal for quick promotional launches or high-priority store alerts.
- **Neutral Outlined:** Background `#ffffff`, border `1px solid #cbd5e1`, text `#0f172a`, hover: `#f8fafc`. Used for secondary actions (e.g., "Cancel", "Print Slip").

### Input Fields & Controls
- **Text & Select Inputs:** Minimum height `48px` with generous horizontal padding (`16px`). Background `#ffffff`, border `1.5px solid #cbd5e1`. Font `body-lg`. Placeholder text `#94a3b8`. Focus state switches border to `#2563eb` with a smooth 3px ambient focus ring.
- **Plain-Language Tooltips & Helper Text:** Positioned directly below inputs or beside labels via a prominent friendly info icon (`?`). Explanatory microcopy uses `body-sm` in `#64748b` (e.g., "This is the barcode printed on the box" instead of "SKU identifier").
- **Checkboxes & Radios:** Scaled up to `20px × 20px` for effortless selection. Border `2px solid #94a3b8`, filling with `#2563eb` and a crisp white tick mark upon selection.

### Status Chips & Badges
- **Fulfillment / Paid (Emerald):** Background `#ecfdf5`, border `#a7f3d0`, text `#065f46`.
- **Attention / Pending Stock (Amber):** Background `#fffbeb`, border `#fde68a`, text `#92400e`.
- **Draft / Inactive (Slate):** Background `#f1f5f9`, border `#e2e8f0`, text `#475569`.
- **Urgent / Out of Stock (Red):** Background `#fef2f2`, border `#fecaca`, text `#991b1b`.
- All badges use pill rounding (`rounded-full`), `label-sm`, and `padding: 4px 12px` with an optional leading 6px colored dot.

### Cards & Content Lists
- **Cards:** Background `#ffffff`, border `1px solid #e2e8f0`, radius `16px`, internal padding `24px` (`space-lg`). Content groups (e.g., "Customer Details", "Pricing") sit in self-contained cards rather than uninterrupted dense tables.
- **Interactive List Rows:** Spaced table rows with `16px` vertical padding, separated by soft horizontal rules (`#f1f5f9`). Alternating hover states shift row backgrounds to `#f8fafc` for effortless line-tracking across wide screens.

### Additional Retail Components
- **Inventory Stepper:** A connected quantity selector with large `44px × 44px` minus/plus buttons and a prominent center numeric field, allowing error-free stock adjustments directly from the mobile list view.
- **High-Visibility Action Banner:** Full-width light yellow container (`#fefce8`) with a warm yellow border (`#ffe600`) and dark slate text for critical store notifications (e.g., "Unfulfilled orders from weekend sale").