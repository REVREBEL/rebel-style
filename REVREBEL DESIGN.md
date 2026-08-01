# REVREBEL DESIGN

---

## 1. Design-System Summary

REVREBEL’s visual system is an editorial, high-contrast identity built for a hospitality commercial-strategy brand. It combines a serious navy foundation with energetic teal, aqua, yellow, coral, red, and plum accents. Large condensed headlines create urgency and attitude, while a quieter sans-serif body face keeps dense strategic content readable.

The system is not organized like a generic marketing template. Its native shape is a **commercial operating engine**:

```text
Commercial Strategy
├── Revenue Strategy
├── Brand Activation
├── Optimized Distribution
└── Tech Integration
    ├── Solutions Groups
    ├── Individual Solutions
    ├── Strategy Stacks
    ├── Property Portfolios
    └── Resources / Articles
```

The page and component architecture repeatedly expresses this model through:

- Commercial pillars and solution categories
- Audits, processes, strategies, pricing, and systems
- Strategy-stack cards and service groupings
- Operational feature sets
- Category-aware article cards
- Metrics, views, likes, and resource metadata
- Navigation cards that explain—not merely link to—major service areas

This structure should continue to guide future page composition. Pages should feel like a connected system of strategic capabilities, not a sequence of interchangeable hero, features, testimonials, and CTA sections.

---

# 2. Visual Atmosphere

## Overall Mood

**Bold, analytical, rebellious, and editorial.**

REVREBEL balances two attitudes:

1. **Commercial authority**  
   Navy, disciplined grids, clear hierarchy, structured data, and operational language communicate expertise.

2. **Creative disruption**  
   Oversized condensed typography, saturated pairings, bracketed button labels, playful copy, and unconventional color combinations prevent the brand from feeling like a conventional consultancy.

The result should feel closer to an independent editorial studio or strategic intelligence platform than a traditional corporate hotel consultancy.

## Whitespace Philosophy

Whitespace is generous at the page and section level, but compact inside interactive controls and information-dense cards.

- Major sections use approximately `8rem` vertical padding.
- Desktop page gutters use `4rem`.
- Card padding ranges from `2rem–5rem`, depending on prominence.
- Headline line-height is deliberately tight, often below `1`.
- Body copy uses relaxed line-height, generally `1.5–1.7`.

This creates a useful tension:

- **Compressed typography** supplies energy.
- **Large spatial fields** provide clarity.
- **Dense cards** communicate substance.
- **Wide section breaks** prevent overload.

## Color Temperature

The palette is mostly cool and strategic, anchored by navy, teal, aqua, blue, and frost. Warm yellow, coral, and red are used as deliberate interruptions. Plum serves as the bridge between the cool and warm sides.

Recommended temperature balance:

- Use navy, white, frost, powder blue, and teal for the core interface.
- Use brighter colors as sectional identities, highlights, or strong component variants.
- Avoid using every accent color in the same composition.
- Pair colors intentionally rather than decorating with isolated accents.

---

# 3. Design Tokens

## Recommended Token Architecture

Webflow currently separates tokens into these collections:

```text
Core
Colors
Type
Space + Size
Buttons
Shades
Cards
Forms
```

For code components, expose a normalized REVREBEL token layer:

```css
:root {
  /* Foundations */
  --color-primary: #163666;
  --color-background: #ffffff;
  --color-surface: #fafafa;
  --color-foreground: #163666;

  /* Brand accents */
  --color-teal: #047c97;
  --color-cyan: #00a6b6;
  --color-aqua: #71c9c5;
  --color-powder: #b2d3de;
  --color-yellow: #faca78;
  --color-coral: #f37d59;
  --color-red: #e05047;
  --color-plum: #8e456a;
  --color-frost: #eff5f6;

  /* Neutrals */
  --color-grey-100: #ababab;
  --color-grey-500: #575757;
  --color-grey-800: #2e2e2e;

  /* Typography */
  --font-display: "Khand", sans-serif;
  --font-body: "General Sans", sans-serif;
  --font-ui: "Inter", sans-serif;
  --font-code: "Fira Code", monospace;
  --font-eyebrow: "Supreme Variable", sans-serif;

  /* Geometry */
  --radius-xs: 0.25rem;
  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-pill: 100rem;
}
```

The `--*` layer should remain stable even if variables are renamed inside Webflow. Components can then map Webflow site variables to these aliases with fallback values.

---

# 4. Color Palette

## Deduplicated Base Palette

The table below lists every distinct base color found in the primary palette and neutral system. Many additional Webflow variables are generated with `color-mix()` from these bases; those tonal ramps are documented separately rather than duplicated as standalone colors.

| Proposed token | Value | Functional role |
|---|---:|---|
| `--color-primary` | `#163666` | Primary brand navy; default text, buttons, borders, navigation, dark surfaces |
| `--color-teal` | `#047c97` | Brand Color 1; strategic secondary surface or emphasis |
| `--color-cyan` | `#00a6b6` | Brand Color 2; bright interactive or informational accent |
| `--color-aqua` | `#71c9c5` | Brand Color 3; softer accent, supporting surface, highlight |
| `--color-powder` | `#b2d3de` | Brand Color 4; muted inverse field and quiet panel |
| `--color-yellow` | `#faca78` | Brand Color 5; warm highlight and editorial contrast |
| `--color-coral` | `#f37d59` | Brand Color 6; active emphasis, warm CTA, hover accent |
| `--color-red` | `#e05047` | Brand Color 7; alert, urgency, assertive feature surface |
| `--color-plum` | `#8e456a` | Brand Color 8; expressive editorial field |
| `--color-frost` | `#eff5f6` | Brand Color 9; cool near-white background |
| `--color-grey-100` | `#ababab` | Disabled text, subtle borders, low-priority metadata |
| `--color-grey-500` | `#575757` | Secondary text and subdued UI |
| `--color-grey-800` | `#2e2e2e` | Dark neutral surface and high-contrast text |
| `--color-white` | `#ffffff` | Primary light surface and inverse text |
| `--color-light` | `#fafafa` | Soft white surface |
| `--color-grey-shade-1` | `#585858` | Dark neutral ramp |
| `--color-grey-shade-2` | `#4d4d4d` | Dark neutral ramp |
| `--color-grey-shade-3` | `#434343` | Dark neutral ramp |
| `--color-grey-shade-4` | `#383838` | Dark neutral ramp |
| `--color-grey-shade-5` | `#2c2c2c` | Dark neutral ramp |
| `--color-grey-shade-6` | `#292929` | Dark neutral ramp |
| `--color-grey-shade-7` | `#272727` | Dark neutral ramp |
| `--color-grey-shade-8` | `#252525` | Dark neutral ramp |

## Additional Transparency Values

| Proposed token | Value | Role |
|---|---:|---|
| `--shadow-button-dark` | `rgba(17, 41, 76, 0.31)` | Dark button shadow |
| `--divider-primary-muted` | `hsla(216.36, 63.87%, 30.39%, 0.49)` | Muted navy divider |
| `--border-grey-muted` | `rgba(171, 171, 171, 0.35)` | Grey card border |

## Tonal Ramp Rule

Webflow generates many shades with CSS `color-mix()` expressions using white or black at approximately:

```text
10%
20%
30%
40%
```

Maintain tonal variants algorithmically rather than hard-coding additional hex values:

```css
--primary-10-light: color-mix(in srgb, var(--color-primary), white 10%);
--primary-20-light: color-mix(in srgb, var(--color-primary), white 20%);
--primary-10-dark: color-mix(in srgb, var(--color-primary), black 10%);
--primary-20-dark: color-mix(in srgb, var(--color-primary), black 20%);
```

Use the same pattern for each brand color only when the component requires hover, active, border, or subdued-surface states.

## Functional Color Roles

### Foundations

```text
Canvas          White / Light / Frost
Primary ink     Navy
Inverse ink     White / Light / Powder
Quiet ink       Grey 500
Disabled ink    Grey 100
Dark neutral    Grey 800
```

### Semantic Roles

```text
Primary action     Navy
Informational      Teal / Cyan
Positive/active    Aqua or Cyan
Highlight          Yellow
Warm emphasis      Coral
Alert/error        Red
Editorial accent   Plum
Subtle panel       Frost / Powder
```

## Pairing Guidance

The implementation supports broad variant freedom, but pages should use disciplined pairings.

Preferred combinations:

- Navy + white
- Navy + powder blue
- Navy + yellow
- Navy + coral
- Teal + frost
- Plum + yellow
- Dark green-like fields + bright aqua/green accents
- Red + navy
- White + a single saturated accent

Avoid:

- Equal visual weight across four or more saturated colors
- Low-contrast accent-on-accent combinations
- Using warm and cool accents randomly within one card group
- Treating the nine brand colors as a rainbow sequence

---

# 5. Typography

## Font Families

| Role | Family | Usage |
|---|---|---|
| Display and headline | `Khand` | Hero headlines, card headings, buttons, tags, compact labels |
| Body and subheadline | `General Sans` | Paragraphs, long-form copy, descriptions |
| Base UI alternative | `Inter` | Utility UI, neutral system contexts |
| Eyebrow and small editorial label | `Supreme Variable` | Eyebrows, form copy, selected labels |
| Code and technical emphasis | `Fira Code` | Code, IDs, technical metadata |
| Blockquote | `Logic Monoscript` | Expressive quotations |
| Blockquote alternative | `Pacifico` | Optional expressive script |
| Logo | `Barlow` | Brand/logo-specific typography |
| Emoji | `Noto Emoji` | Emoji glyph support |

## Headline Behavior

REVREBEL headlines are visually compressed and dominant.

```css
font-family: var(--font-display);
font-weight: 700;
line-height: 0.8–0.95;
letter-spacing: -0.01em to -0.025em;
```

### Approximate Heading Scale Found in Webflow

| Level | Size range | Intended use |
|---|---:|---|
| Display / H0 | `4.5rem–6rem` | Hero and campaign statement |
| H1 | `5rem–7rem` | Primary page title |
| H2 | `4.5rem–6rem` | Major section headline |
| H3 | `4rem–5rem` | Strong subsection or feature title |
| H4 | `3.5rem–4rem` | Card-group or editorial heading |
| H5 | `2.5rem` | Secondary section heading |
| H6 | `2rem` | Compact card or content heading |

The system also includes responsive container-query values using `cqi`, ranging approximately from `1.147rem` through `9.277rem`. Use these only inside a defined container context; provide `clamp()` fallbacks for imported code components.

### Recommended Code-Component Scale

```css
--text-display-xl: clamp(4.5rem, 7vw, 7rem);
--text-display-lg: clamp(4rem, 6vw, 6rem);
--text-display-md: clamp(3.5rem, 5vw, 5rem);
--text-display-sm: clamp(2.5rem, 4vw, 4rem);
```

## Body Scale

| Token | Size range |
|---|---:|
| `body-xxs` | `0.8rem–0.85rem` |
| `body-xs` | `0.85rem–0.9rem` |
| `body-sm` | `0.9rem–0.95rem` |
| `body-base` | `0.95rem–1rem` |
| `body-md` | `1rem–1.25rem` |
| `body-lg` | `1.25rem–1.35rem` |
| `body-xl` | `1.45rem–1.5rem` |
| `body-xxl` | `2rem–3.25rem` |

Body conventions:

```css
font-family: var(--font-body);
line-height: 1.5–1.7;
letter-spacing: -0.0025em;
```

The default body line-height is approximately `1.55`.

## Eyebrows

```css
font-family: "Supreme Variable", sans-serif;
font-size: 1rem;
font-weight: 300;
letter-spacing: 0.1em;
line-height: 1;
text-transform: uppercase;
```

Eyebrows should identify categories or context, not repeat the headline.

## Blockquotes

```css
font-family: "Supreme Variable", sans-serif;
font-size: 2rem;
letter-spacing: 0.01em;
border-width: 3px;
background: transparent;
```

## Button and Tag Typography

Both buttons and tags use Khand to keep the interface aligned with the display identity.

```css
font-family: "Khand", sans-serif;
font-weight: 700;
line-height: 1;
```

Buttons use approximately `0.05em` tracking. Tag text remains compact and direct.

---

# 6. Spacing and Sizing

## Base Spacing Scale

| Token | Value |
|---|---:|
| `space-1` | `0.25rem` |
| `space-2` | `0.5rem` |
| `space-3` | `0.75rem` |
| `space-4` | `1rem` |
| `space-5` | `1.25rem` |
| `space-6` | `1.5rem` |
| `space-7` | `1.75rem` |
| `space-8` | `2rem` |
| `space-9` | `3rem` |
| `space-10` | `4rem` |
| `space-11` | `5rem` |
| `space-12` | `6rem` |
| `space-13` | `7rem` |
| `space-14` | `8rem` |

## Named Gap Scale

| Token | Value |
|---|---:|
| `gap-xxs` | `0.5rem` |
| `gap-xs` | `1rem` |
| `gap-sm` | `2rem` |
| `gap-md` | `3rem` |
| `gap-lg` | `4rem` |
| `gap-xl` | `5rem` |
| `gap-xxl` | `6rem` |

## Page Padding

| Mode | Horizontal | Vertical |
|---|---:|---:|
| Desktop / base | `4rem` | `3rem` |
| Tablet | `2rem` | inherits/reduces contextually |
| Mobile landscape | `2rem` | inherits/reduces contextually |
| Mobile portrait | `1rem` | inherits/reduces contextually |

## Section Rhythm

```css
--section-padding-block: 8rem;
```

Use the full `8rem` primarily for major storytelling transitions. Dense product, dashboard, or card-heavy pages may use `4rem–6rem`.

## Container Widths

| Token | Max width |
|---|---:|
| `container-xl` | `1600px` |
| `container-lg` | `1440px` |
| `container-md` | `1200px` |
| `container-sm` | `1000px` |

Additional max-width values found:

```text
1820px
1720px
1600px
1440px
1280px
1150px
900px
```

Use these as intentional content measures, not arbitrary one-off widths.

## Narrow Content Measures

```text
70rem
60rem
50rem
40rem
35rem
25rem
12rem
```

Recommended roles:

- `70rem`: long editorial introduction
- `50–60rem`: normal content column
- `35–40rem`: focused paragraph or form
- `25rem`: card content
- `12rem`: label or compact stat

## Radius Scale

| Token | Value |
|---|---:|
| `radius-xs` | `0.25rem` |
| `radius-sm` | `0.5rem` |
| `radius-md` | `0.75rem` |
| `radius-lg` | `1rem` |
| `radius-pill` | `100rem` |

REVREBEL generally favors modest geometry rather than heavily rounded “SaaS” styling. Buttons are nearly square; cards become more rounded at smaller screens.

## Icon Scale

```text
1rem
2rem
3rem
4rem
5rem
6rem
```

---

# 7. Responsive System

The `Space + Size` collection contains these modes:

```text
Base
Desktop [x1920]
Desktop [x1440]
Desktop [x1280]
Tablet [x768]
Mobile [L]
Mobile [P]
```

The `Cards` collection contains:

```text
Base
Tablet
Mobile [L]
Mobile [P]
```

## Responsive Principles

1. **Scale spatial fields before shrinking typography aggressively.**
2. **Preserve headline attitude**, but reduce forced line breaks on mobile.
3. **Cards become more compact and more rounded** at smaller sizes.
4. **Borders often reduce from 4–5px to 1–2px** on mobile.
5. **Desktop layouts may use multiple explicit width modes**, not only Webflow’s default desktop breakpoint.
6. **Use a 4rem → 2rem → 1rem gutter progression.**
7. **Stack operational card systems on narrow screens while preserving content order.**

Exact media-query boundaries other than the mode labels were not available through the headless audit. Code components should align to the named Webflow modes and verify final boundaries inside the Designer before publication.

---

# 8. Component Styles

## 8.1 Button

### Source Component

```text
Name: Button
Group: Buttons
Component ID: 10e0cbfe-db1a-7742-33d6-8e09461b7744
Instances found: 31
```

### Exposed Properties

```text
Button Visibility
Button Color
Button Size
Button ID
Button Text
Button Link
Icon Visibility
Icon Color Variants
Icon Size Variants
Icon Image
Icon Alt Text
```

The component composes independent size, color, and icon systems rather than maintaining a separate monolithic component for every combination.

### Base CSS Values

```css
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2, 0.5rem);

  font-family: "Khand", sans-serif;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.05em;

  padding: 1.25rem 1.15rem;
  border: 3px solid currentColor;
  border-radius: 2px;
  text-decoration: none;
}
```

Recommended defaults:

```css
.button {
  font-family: "Khand", sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.label,
.tag {
  font-family: "Khand", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.label--strong,
.tag--strong {
  font-weight: 700;
}
```


### Sizes

| Size | Font | Weight | Padding vertical | Padding horizontal | Border | Radius |
|---|---:|---:|---:|---:|---:|---:|
| Small | `0.85rem` | `400` | `0.9rem` | `0.85rem` | `2px` | `1.25px` |
| Base | `1rem` | `700` | `1.25rem` | `1.15rem` | `3px` | `2px` |
| Large | `1.15rem` | `400` | `1.5rem` | `2rem` | `3px` | `2.25px` |

### Color Variants

The current system supports:

```text
Primary
Primary Inverse
Primary Outline
Light
Light Outline
Dark
Dark Outline
Color 1–9
Color outlines and selected inverse variants
Alert
Alert Outline
Disabled
Transparent
```


### Button Color, Typography, and State Pattern

Buttons use the REVREBEL color-family token system. Each color family has four related values:

```css
--_colors---color-name--normal
--_colors---color-name--fade
--_colors---color-name--inverse
--_colors---color-name--inverse-fade
````

Button styling should always stay inside the selected color family. A `Color 8` button uses only the `Color 8` normal, fade, inverse, and inverse-fade tokens. It should not borrow shadows, outlines, text colors, or borders from another color family.

The button system has two separate state roles:

* **Shadow:** always uses a solid token. Never use a fade token for button shadows.
* **Outline / ring:** uses the fade token side of the active color relationship.

This distinction is important. The stacked hover and pressed shadow gives the button its physical offset. The outline/ring provides the softer visual edge around that offset state.

### Button Typography

Buttons should always use Khand so they stay connected to the REVREBEL display system.

```css
.c-button {
  font-family: var(--font-display);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1;
}
```

Button text should be uppercase and bold. This keeps calls to action clear, compact, and visually consistent across filled, outline, hover, and pressed states.

Labels and tags also use Khand, but they can use either semibold or bold depending on size and density.

```css
.c-label,
.c-tag {
  font-family: var(--font-display);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  line-height: 1;
}

.c-label.is-strong,
.c-tag.is-strong {
  font-weight: 700;
}
```

Use increased character spacing on labels and tags so the condensed Khand letterforms remain legible at smaller sizes.

---

## Button Token Relationship

### Filled Normal Button

A filled normal button uses the family’s `normal` token as the visible surface.

| Role           | Token                   |
| -------------- | ----------------------- |
| Text           | `inverse`               |
| Background     | `normal`                |
| Border         | `normal`                |
| Outline / ring | `inverse-fade`          |
| Hover shadow   | `normal`                |
| Pressed shadow | `normal`, shorter stack |

```css
.c-button[data-style="Filled"][data-color="Color 8"] {
  color: var(--_colors---color-8--inverse);
  background-color: var(--_colors---color-8--normal);
  border-color: var(--_colors---color-8--normal);

  --button-outline-color: var(--_colors---color-8--inverse-fade);
  --button-shadow-color: var(--_colors---color-8--normal);
}
```

### Filled Inverse Button

A filled inverse button flips the relationship. The family’s `inverse` token becomes the visible surface.

| Role           | Token                    |
| -------------- | ------------------------ |
| Text           | `normal`                 |
| Background     | `inverse`                |
| Border         | `inverse`                |
| Outline / ring | `fade`                   |
| Hover shadow   | `inverse`                |
| Pressed shadow | `inverse`, shorter stack |

```css
.c-button[data-style="Filled"][data-color="Color 8 Inverse"] {
  color: var(--_colors---color-8--normal);
  background-color: var(--_colors---color-8--inverse);
  border-color: var(--_colors---color-8--inverse);

  --button-outline-color: var(--_colors---color-8--fade);
  --button-shadow-color: var(--_colors---color-8--inverse);
}
```

### Outline Normal Button

An outline normal button uses an open surface. The family’s `normal` token becomes the visible text, border, and shadow color.

| Role           | Token                   |
| -------------- | ----------------------- |
| Text           | `normal`                |
| Background     | transparent             |
| Border         | `normal`                |
| Outline / ring | `fade`                  |
| Hover shadow   | `normal`                |
| Pressed shadow | `normal`, shorter stack |

```css
.c-button[data-style="Outline"][data-color="Color 8"] {
  color: var(--_colors---color-8--normal);
  background-color: transparent;
  border-color: var(--_colors---color-8--normal);

  --button-outline-color: var(--_colors---color-8--fade);
  --button-shadow-color: var(--_colors---color-8--normal);
}
```

### Outline Inverse Button

An outline inverse button keeps the surface open, but uses the family’s `inverse` token as the visible text, border, and shadow color.

| Role           | Token                    |
| -------------- | ------------------------ |
| Text           | `inverse`                |
| Background     | transparent              |
| Border         | `inverse`                |
| Outline / ring | `inverse-fade`           |
| Hover shadow   | `inverse`                |
| Pressed shadow | `inverse`, shorter stack |

```css
.c-button[data-style="Outline"][data-color="Color 8 Inverse"] {
  color: var(--_colors---color-8--inverse);
  background-color: transparent;
  border-color: var(--_colors---color-8--inverse);

  --button-outline-color: var(--_colors---color-8--inverse-fade);
  --button-shadow-color: var(--_colors---color-8--inverse);
}
```

---

## Hover and Pressed State Behavior

Hover and pressed states use the same token relationship. The difference is the depth of the stacked shadow.

* Hover uses the longer shadow stack.
* Pressed uses the shorter shadow stack.
* Both states use the same solid shadow token.
* Both states use the same outline/ring token.

```css
.c-button {
  --button-shadow-color: currentColor;
  --button-outline-color: currentColor;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  border-style: solid;
  border-width: 3px;

  text-decoration: none;
  transition-property: color, background-color, border-color, outline-color, box-shadow;
  transition-duration: 600ms;
  transition-timing-function: ease;
}
```

### Hover State

```css
.c-button:hover,
.c-button.is-hover-state {
  outline-style: solid;
  outline-width: 3px;
  outline-offset: -3px;
  outline-color: var(--button-outline-color);

  box-shadow:
    var(--button-shadow-color) 0.5px 0.5px 0,
    var(--button-shadow-color) 1px 1px 0,
    var(--button-shadow-color) 1.5px 1.5px 0,
    var(--button-shadow-color) 2px 2px 0,
    var(--button-shadow-color) 2.5px 2.5px 0,
    var(--button-shadow-color) 3px 3px 0,
    var(--button-shadow-color) 3.5px 3.5px 0,
    var(--button-shadow-color) 4px 4px 0,
    var(--button-shadow-color) 4.5px 4.5px 0,
    var(--button-shadow-color) 5px 5px 0,
    var(--button-shadow-color) 5.5px 5.5px 0,
    var(--button-shadow-color) 6px 6px 0,
    var(--button-shadow-color) 6.5px 6.5px 0,
    var(--button-shadow-color) 7px 7px 0,
    var(--button-shadow-color) 7.5px 7.5px 0,
    var(--button-shadow-color) 8px 8px 0,
    var(--button-shadow-color) 8.5px 8.5px 0;
}
```

### Pressed State

```css
.c-button:active,
.c-button.is-pressed-state {
  outline-style: solid;
  outline-width: 3px;
  outline-offset: -3px;
  outline-color: var(--button-outline-color);

  box-shadow:
    var(--button-shadow-color) 0.5px 0.5px 0,
    var(--button-shadow-color) 1px 1px 0,
    var(--button-shadow-color) 1.5px 1.5px 0,
    var(--button-shadow-color) 2px 2px 0,
    var(--button-shadow-color) 2.5px 2.5px 0,
    var(--button-shadow-color) 3px 3px 0,
    var(--button-shadow-color) 3.5px 3.5px 0,
    var(--button-shadow-color) 4px 4px 0,
    var(--button-shadow-color) 4.5px 4.5px 0;
}
```

Pressed states should feel like the button has moved closer to the page surface. Do not change the shadow color between hover and pressed. Only reduce the shadow depth.

---

## Complete Token Pattern Table

Using `Color 8` as the example:

| Button version  | Text              | Background        | Border            | Outline / ring         | Shadow            |
| --------------- | ----------------- | ----------------- | ----------------- | ---------------------- | ----------------- |
| Filled          | `color-8-inverse` | `color-8-normal`  | `color-8-normal`  | `color-8-inverse-fade` | `color-8-normal`  |
| Filled Inverse  | `color-8-normal`  | `color-8-inverse` | `color-8-inverse` | `color-8-fade`         | `color-8-inverse` |
| Outline         | `color-8-normal`  | transparent       | `color-8-normal`  | `color-8-fade`         | `color-8-normal`  |
| Outline Inverse | `color-8-inverse` | transparent       | `color-8-inverse` | `color-8-inverse-fade` | `color-8-inverse` |

---

## Documentation Rule

Button states should be documented as a relationship, not as a list of one-off color declarations.

The correct pattern is:

```text
Filled normal:
normal surface + inverse text + inverse-fade outline + normal shadow

Filled inverse:
inverse surface + normal text + fade outline + inverse shadow

Outline normal:
transparent surface + normal text/border + fade outline + normal shadow

Outline inverse:
transparent surface + inverse text/border + inverse-fade outline + inverse shadow
```

Shadows are always solid. Outlines use fade. Hover and pressed use the same color relationship, but pressed uses a shorter shadow stack.

```

This version matches the CSS relationship in your uploaded snippet, where button state helpers are controlled through `--button-shadow-color` and `--button-outline-color`, and the outline buttons assign the shadow to the solid family token while the outline color uses the family fade token. :contentReference[oaicite:0]{index=0}



### Label Convention

Many button defaults use bracketed language:

```text
[ Button ]
[ Icon Button ]
[ Get Started ]
```

This is part of the visual voice and should remain an intentional variant, not automatically applied to every action. Use bracketed labels for high-character brand moments; use plain labels for forms, account actions, and dense interfaces.

### Icon Rules

- Icons are optional.
- Icon size is controlled separately from button size.
- Custom images are supported.
- SVGs using `currentColor` are preferable because they inherit variant color.
- Preserve readable spacing when the icon is hidden; avoid empty wrappers.

### Interaction

Recommended transition:

```css
transition:
  background-color 160ms ease,
  color 160ms ease,
  border-color 160ms ease,
  transform 160ms ease;
```

Hover should invert, darken, or shift to an intentional tonal ramp. Avoid generic opacity-only hover states.

---

## 8.2 Tag + Icon

### Source Component

```text
Name: Tag +Icon
Group: UI + Elements
Component ID: a112d25b-e206-7eef-9414-3fc5954d284e
Instances found: 88
Description: Tag component with options to add an icon or make it clickable with hover state change.
```

### Exposed Properties

```text
Tag Visibility
Tag ID
Tag Text
Tag Clickable
Color
Tag Size
Icon Visibility
Icon
Icon Size Variants
Icon Alt Text
```

Default label:

```text
Mavericks 4 Life
```

### Base CSS Values

```css
.tag {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  gap: 0.35em;

  font-family: "Khand", sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1;

  padding: 0.15em 0.25em;
  border: 3px solid currentColor;
  border-radius: 0.35rem;
}
```

Tablet may reduce bottom padding to approximately `0.10em`.

### Sizes

```text
Extra Small
Small
Regular
Medium
```

### States

```text
None
Solid
Solid Clickable
Outline
Outline Clickable
```

### Colors

```text
Light
Clear
Dark
Base
Primary
Color 1–9
```

### Hover Behavior

The source tokens include a hover weight change from `700` toward `300`. Use this carefully: changing font weight can shift layout. For code components, consider preserving width with a fixed minimum or use color/background inversion as the primary feedback.

Recommended clickable behavior:

```css
.tag[data-clickable="true"]:hover {
  color: var(--tag-hover-foreground);
  background: var(--tag-hover-background);
  border-color: var(--tag-hover-border);
}
```

### Icon Rules

- Default icon visibility is off.
- Use inline SVG with `currentColor` whenever possible.
- Uploaded raster or fixed-color SVG images will not inherit tag color.
- Icon sizing remains independent from tag text sizing.
- Decorative icons should use an empty alt value; meaningful icons need descriptive alt text.

---

## 8.3 Cards

### General Card Language

Cards are structural and editorial rather than soft, floating containers.

Common traits:

- Strong border
- Clear fill/text color pairing
- Khand headline
- General Sans body
- Optional image or icon
- Underlined or compact text link
- Light/dark and color variants
- Responsive border and radius changes

### Base Card

| Mode | Padding | Border | Radius |
|---|---:|---:|---:|
| Desktop | `3rem` | `5px` | `0.25em` |
| Tablet | `2rem` | `5px` | `0.25em` |
| Mobile landscape | `2rem` | `1px` | `1rem` |
| Mobile portrait | `1.5rem` | `1px` | `1rem` |

### Small Card

| Mode | Padding | Border | Radius |
|---|---:|---:|---:|
| Desktop | `2rem` | `4px` | `0.3rem` |
| Tablet | `1rem` | `4px` | `0.2rem` |
| Mobile landscape | `1rem` | `2px` | `0.5rem` |
| Mobile portrait | `0.5rem` | `2px` | `0.5rem` |

### Large Card

| Mode | Padding |
|---|---:|
| Desktop | `5rem` |
| Tablet | `4rem` |
| Mobile landscape | `3rem` |
| Mobile portrait | `2rem` |

### Primary Card Components

#### Card Body

```text
Group: UI + Elements
Variants:
- Brand Color Primary
- Light
- Dark
```

#### Simple Card

```text
Instances: 9
Variants:
- Regular Card
- Flat Card
```

#### Navcard White

```text
Instances: 44
Variants:
- Light
- Dark
```

#### Navcard Color

```text
Instances: 44
```

#### Content Cards 2x3

This component exposes six domain-specific areas:

```text
Revenue Management
Optimized Distribution
Brand Positioning
Marketing Execution
Social Media Impact
Performance Analytics
```

Its default section headline is:

```text
Unify. Elevate. Accelerate. Win.
```

This is a strong example of the brand’s native content hierarchy: one strategic proposition followed by a matrix of commercial capabilities.

### Card Composition Rules

1. Start with the domain concept, not the visual format.
2. Keep card headings concise and operational.
3. Use icons to distinguish functions, not as decoration.
4. Equal-height behavior may use the existing `data-match-height` grouping pattern.
5. Let full-card links remain visibly interactive with meaningful hover states.
6. Do not force every card to include image, tag, paragraph, icon, and button.
7. Within a group, use consistent card anatomy and one controlled color logic.

---

## 8.4 Navigation

### Navigation Bar

```text
Name: Navigation Bar
Group: Nav + Footer
Instances found: 11
Variants:
- Light
- Dark
```

Configurable structure:

```text
Brand logo
Home
The Rebels
Dropdown menu 1 with four slots
Dropdown menu 2 with four slots
Pricing
Log in
Client Login
CTA/button slot
```

### Full-Page Navigation Content

The full-page navigation is content-rich. It explains the service architecture rather than presenting a simple link list.

#### Solutions

```text
Revenue Strategy
  Maximize topline and margin with data-backed strategy
  Maximize Your Topline

Brand Activation
  Create demand and drive bookings with targeted marketing
  Generate Demand

Optimized Distribution
  Amplify your presence, control your channels, increase conversions
  Connect Strategically

Tech Integration
  Deploy and align the systems that power your hotel
  Build Your Engine
```

#### Resources

```text
CTRLShift Blog
Travel Trends
Revenue Toolkits
Client Hub
```

Secondary links include:

```text
Partners
FAQ
Client Login
```

### Navigation Principles

- Treat navigation dropdowns as editorial preview panels.
- Use service descriptions to reduce ambiguity.
- Keep the four commercial pillars consistently named across navigation, pages, cards, and CMS.
- Maintain light and dark variants based on the page’s opening surface.
- Reserve the strongest button treatment for the primary commercial action.

---

## 8.5 Footer

```text
Name: Footer
Group: Nav + Footer
Instances found: 11
Variants:
- Light
- Outline Light
- Dark
- Outline Dark
```

The footer supports:

- Brand logo and tagline
- CTRLShift newsletter signup
- Privacy consent copy
- Contact details
- Office address
- Social links
- Policy links
- Cookie settings
- Copyright

The footer is therefore a conversion and trust surface, not only a sitemap.

---

## 8.6 Inputs and Forms

### Form Tokens

```css
.input {
  font-family: "Supreme Variable", sans-serif;
  font-size: 1rem;
  font-weight: 300;
  line-height: 1.5;

  padding: 1.75rem 1rem;
  border: 1px solid currentColor;
  border-radius: 0.25rem;
}

.input::placeholder {
  font-size: 0.85rem;
  font-weight: 300;
}
```

Form container:

```css
.form {
  padding: 2rem;
  padding-bottom: 1.5rem;
}
```

Variants:

```text
Light
Dark
```

### Form Principles

- Keep form typography quieter than display typography.
- Labels should remain persistent; placeholders should not substitute for labels.
- Use high-contrast focus states based on navy, cyan, or yellow.
- Do not use exaggerated card rounding around forms.
- Error states should use red with explanatory text, not color alone.
- Maintain generous input height for accessibility.

---

# 9. Domain-Specific Components

REVREBEL’s strongest design-system value comes from components that encode the business model.

## Commercial Pillar Components

The recurring top-level commercial model is:

```text
Revenue Strategy
Brand Activation
Optimized Distribution
Tech Integration
```

These names should be treated as controlled terminology.

## Revenue Audit Model

A recurring audit section is organized as:

```text
Process
Strategy
Pricing
Systems
```

This four-part framework should inform assessment pages, reports, and dashboard summaries.

## Revenue Management Operating Model

A detailed nine-card system includes:

```text
Strategic Revenue Support
Analytics & Benchmarking
Proactive Strategy in Action
Group Pricing + Analysis
Weekly Strategy Meetings
Channel Partner Engagement
Call Center Optimization
Connectivity & Rate Loading
Planning & Forecasting
```

This is the product’s native shape: a set of connected operating disciplines. Future pages should visualize relationships among these capabilities instead of flattening them into a generic feature grid.

## Strategy Stack

`strategy-stack-card` combines:

- Headline
- Solution category
- Frequency
- Overview paragraph
- Rich-text deliverable list
- Multiple tags
- Read-more action

This is effectively a product/service specification card and should be documented separately from marketing cards.

## Article and Resource System

Article cards support:

- Category
- Original publish date
- Category slug
- Category primary and inverse colors
- Headline
- Preview image
- Read-more link
- Views
- Likes
- Storage key
- Article slug

Category colors are dynamically supplied from CMS values. Preserve that model in code components:

```text
category-slug
category-primary-color
category-inverse-color
```

Do not hard-code article category colors inside card code when CMS values exist.

## Views and Likes

Engagement components use:

- Item/article slug
- Local storage key
- View count
- Like count
- Liked/unliked labels
- Active state
- Configurable icon and color variants

Because Webflow code components mount in isolated React roots, this state should remain in browser storage, URL state, external storage, or custom events rather than React Context shared across separate components.

---

# 10. Layout Principles

## Grid Strategy

The codebase supports both content-led and card-led grids.

Recommended grid patterns:

```css
/* Editorial split */
grid-template-columns: minmax(0, 1.1fr) minmax(20rem, 0.9fr);

/* Four commercial pillars */
grid-template-columns: repeat(4, minmax(0, 1fr));

/* Six capability cards */
grid-template-columns: repeat(3, minmax(0, 1fr));

/* Dense operational cards */
grid-template-columns: repeat(3, minmax(16rem, 1fr));
```

Responsive collapse:

```text
4 columns → 2 columns → 1 column
3 columns → 2 columns → 1 column
Editorial split → stacked
```

## Alignment

- Oversized headlines may align to the left edge of the main container.
- Paragraphs should use constrained measures rather than spanning the full grid.
- Tags, eyebrows, and metadata form compact horizontal clusters.
- Button groups should wrap, not compress.
- Card headings align consistently within a repeated system.
- Images can break the grid only when the section is intentionally editorial.

## Section Composition

Preferred page rhythm:

```text
Context / eyebrow
Large proposition
Focused explanation
System or framework
Operational proof
Relevant CTA
```

Avoid building pages around a fixed sequence of generic section templates. Let the service model, process, strategy stack, catalog, or operating framework determine the section order.

---

# 11. Component Architecture Principles

The Webflow project uses a compositional pattern:

```text
Public component
├── Variant wrapper
├── Size wrapper
├── Color wrapper
├── Inner component
├── Icon component
└── Content slots
```

Examples include:

```text
Button
├── button-variant
├── variants_button-colors
└── icon variants

Tag +Icon
├── variants_tag-states
├── variants_tag-color
├── variants_tag-font-size
└── inner_tag-icon

Navigation
├── Navigation Bar
├── inner navigation menus
├── Navcard White
└── Navcard Color
```

## Preserve

- Independent axes for size, color, state, and content
- Slots for substantial composition
- Meaningful defaults
- Clear property groups
- Visibility controls
- Semantic HTML heading choices
- Explicit alt-text props
- Controlled terminology

## Simplify

- Avoid exposing duplicate variant controls at several nested levels.
- Hide internal implementation components from normal authors.
- Consolidate obsolete “old,” “demo,” “test,” and duplicate variants.
- Prefer one canonical Button and one canonical Tag + Icon public API.
- Keep internal wrappers in a private/internal group.

---

# 12. Shadcn/UI and Webflow Code-Component Mapping

The installed shadcn configuration uses:

```text
Style: new-york
Base color: neutral
CSS variables: enabled
Icon library: Lucide
RSC: false
TypeScript: true
```

Do not allow shadcn’s default neutral aesthetic to overwrite REVREBEL. Map shadcn semantic tokens to REVREBEL tokens:

```css
:host {
  --background: var(--color-white, #ffffff);
  --foreground: var(--color-primary, #163666);

  --card: var(--color-light, #fafafa);
  --card-foreground: var(--color-primary, #163666);

  --popover: var(--color-white, #ffffff);
  --popover-foreground: var(--color-primary, #163666);

  --primary: var(--color-primary, #163666);
  --primary-foreground: var(--color-white, #ffffff);

  --secondary: var(--color-powder, #b2d3de);
  --secondary-foreground: var(--color-primary, #163666);

  --muted: var(--color-frost, #eff5f6);
  --muted-foreground: var(--color-grey-500, #575757);

  --accent: var(--color-cyan, #00a6b6);
  --accent-foreground: var(--color-primary, #163666);

  --destructive: var(--color-red, #e05047);
  --destructive-foreground: var(--color-white, #ffffff);

  --border: color-mix(in srgb, var(--color-primary, #163666), transparent 65%);
  --input: var(--border);
  --ring: var(--color-cyan, #00a6b6);

  --radius: 0.25rem;
}
```

## Shadow DOM Requirements

Webflow code components render in Shadow DOM. Therefore:

- Import component CSS directly into each `.webflow.tsx` entry.
- Reference site variables explicitly with `var(--token, fallback)`.
- Use `font-family: inherit` only when inheritance is intentional.
- Site classes do not cross the Shadow DOM boundary.
- Enable `applyTagSelectors: true` only when native Webflow tag styles should apply.
- Ensure Tailwind is processed and imported into each code-component bundle.
- Keep all interactive components accessible without relying on page-level JavaScript.

---

# 13. Suggested Public Component APIs

## Button

```ts
type RebelButtonProps = {
  text: string;
  href?: string;
  target?: "_self" | "_blank";
  visible?: boolean;
  size?: "small" | "base" | "large";
  variant?:
    | "primary"
    | "primary-inverse"
    | "primary-outline"
    | "light"
    | "light-outline"
    | "dark"
    | "dark-outline"
    | "teal"
    | "cyan"
    | "aqua"
    | "yellow"
    | "coral"
    | "red"
    | "plum"
    | "disabled"
    | "transparent";
  icon?: React.ReactNode;
  iconPosition?: "start" | "end";
  bracketed?: boolean;
};
```

## Tag + Icon

```ts
type RebelTagProps = {
  text: string;
  visible?: boolean;
  size?: "xs" | "sm" | "base" | "md";
  state?: "none" | "solid" | "solid-clickable" | "outline" | "outline-clickable";
  color?:
    | "light"
    | "clear"
    | "dark"
    | "primary"
    | "teal"
    | "cyan"
    | "aqua"
    | "powder"
    | "yellow"
    | "coral"
    | "red"
    | "plum"
    | "frost";
  icon?: React.ReactNode;
  href?: string;
};
```

---

# 14. Accessibility Rules

- Maintain WCAG-compliant text/background contrast for every color variant.
- Never encode category, status, or performance with color alone.
- Preserve focus-visible outlines on buttons, tags, links, and inputs.
- Avoid weight-only hover interactions when they cause layout shift.
- Keep touch targets at least approximately `44px`.
- Use true buttons for actions and anchors for navigation.
- Expose heading tags as controlled props, but do not let authors skip hierarchy arbitrarily.
- Decorative icons use empty alt text.
- Avoid all-caps body copy; reserve uppercase for short labels and eyebrows.
- Respect reduced-motion preferences.
- Do not use a saturated surface with another saturated text color without verified contrast.

---
=
# 17. Canonical Brand Rules

1. **Navy is the anchor.**  
   It should remain the default ink, interaction color, and authority signal.

2. **Color is structural.**  
   Accent colors identify sections, categories, or component families—not random decoration.

3. **Headlines carry attitude.**  
   Use Khand, tight line-height, short phrasing, and intentional line breaks.

4. **Body copy carries clarity.**  
   Use General Sans, restrained measures, and relaxed leading.

5. **Components explain the commercial system.**  
   Cards and navigation should communicate how REVREBEL works, not only where a link leads.

6. **The system is modular, not generic.**  
   Compose size, color, state, content, and icon layers without multiplying public components unnecessarily.

7. **Operational detail is part of the brand.**  
   Process, strategy, pricing, systems, forecasting, analytics, distribution, and execution should remain visible in the interface.

8. **Editorial energy should not reduce usability.**  
   Brackets, saturated colors, large type, and playful labels must remain readable, accessible, and purposeful.
