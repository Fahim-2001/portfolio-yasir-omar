# DESIGN.md — "Exploded View" Design System

The design system for the portfolio of **Md. Yasir Omar Fahim**, Software Engineer.
It extends the workspace rules in `AGENTS.md` and is implemented in
`src/styles/index.css`, `src/components/` and `src/three/`.

---

## 1. Concept

**Exploded View.** An engineering exploded-view drawing shows how parts fit together by
pulling them apart along one axis. The site works the same way: every surface has depth,
cards are stacks of plates that separate when touched, sections stand up out of the page as
they arrive, and annotations read like notes on a technical drawing.

- **Light theme** reads like drafting paper: white, fine dot and line grids, ink-black edges.
- **Dark theme** reads like a CAD viewport: near-black, hairline grey edges, white ink.
- **The hero** puts the engineer at the centre of the stack: a 3D avatar on an exploded
  pedestal, with the skills he works with orbiting as physical keycaps.
- **The background world** makes the metaphor literal: the page *is* an exploded stack.
  Behind every section, a fixed 3D scene ("The Stack", §9) spirals the camera down
  through one plate per section, from the cloud to silicon, as the page scrolls.

### Principles

1. **Monochrome, always.** Depth comes from offset, lighting and edges, never from hue.
2. **Depth is the language.** Plates, keycaps, extruded type and Z-separation say "3D UI"
   consistently, instead of one-off effects.
3. **Content is data.** Every word, number and link comes from `src/data/portfolio.js`.
4. **Motion explains structure.** Things move to show how they are built (assemble,
   separate, stand up), then settle. Nothing loops for attention except tiny status signals.
5. **Nothing blocks the reader.** 3D never captures scroll or touch; every effect has a
   reduced-motion and a no-WebGL path.

---

## 2. Color

### Palette (the only colors allowed)

| Token         | Hex       |
| :------------ | :-------- |
| `white`       | `#FFFFFF` |
| `neutral-50`  | `#FAFAFA` |
| `neutral-100` | `#F4F4F5` |
| `neutral-200` | `#E4E4E7` |
| `neutral-400` | `#A1A1AA` |
| `neutral-500` | `#71717A` |
| `neutral-700` | `#3F3F46` |
| `neutral-800` | `#27272A` |
| `neutral-900` | `#18181B` |
| `black`       | `#0A0A0A` |

Tailwind's default palette is **stripped** in `@theme` (`--color-*: initial`) and replaced
with exactly these values, so a colored utility such as `bg-blue-500` produces no CSS at all.

### Semantic tokens

| Token              | Light     | Dark      | Use                                           |
| :----------------- | :-------- | :-------- | :-------------------------------------------- |
| `--bg`             | `#FFFFFF` | `#0A0A0A` | Page background                               |
| `--surface`        | `#FAFAFA` | `#18181B` | Plate faces, panels                           |
| `--surface-subtle` | `#F4F4F5` | `#27272A` | Window chrome, inset areas                    |
| `--border`         | `#E4E4E7` | `#3F3F46` | Hairlines, plate edges                        |
| `--border-strong`  | `#A1A1AA` | `#71717A` | Hover edges, outline keycaps, leader lines    |
| `--text`           | `#0A0A0A` | `#FFFFFF` | Primary text, ink, primary keycaps            |
| `--text-muted`     | `#3F3F46` | `#A1A1AA` | Secondary text (10.4:1 light, 7.7:1 dark)     |
| `--accent`         | `#0A0A0A` | `#FFFFFF` | Same as text: emphasis is weight and depth    |

### Depth tokens

| Token              | Light       | Dark        | Use                                       |
| :----------------- | :---------- | :---------- | :---------------------------------------- |
| `--plate-ghost`    | `#F4F4F5`   | `#0A0A0A`   | First ghost plate behind a card           |
| `--plate-ghost-2`  | `#FFFFFF`   | `#0A0A0A`   | Second (dashed) ghost plate               |
| `--extrude`        | `#E4E4E7`   | `#27272A`   | Body of extruded numerals                 |
| `--extrude-edge`   | `#A1A1AA`   | `#71717A`   | Back edge of extruded numerals            |
| `--key-side`       | `#3F3F46`   | `#A1A1AA`   | Side of primary keycaps                   |
| `--key-side-soft`  | `#E4E4E7`   | `#27272A`   | Side of outline keycaps                   |
| `--glass`          | white 74 %  | black 70 %  | Raised navigation dock                    |

### Rules

- Hover, focus, links, charts and 3D materials use only the palette.
- **Exceptions, approved by the owner:** project screenshots (`projects[].image`), the hero
  avatar, and the brand glyphs on the orbiting skill keycaps (`BRAND_COLORS` in
  `src/components/brandIcons.js`; black/white brands fall back to the theme ink) are shown in
  their real colors. Nothing else is colored: UI chrome, keycap bodies, rings and the Skills
  section stay monochrome.
- Gradients appear only as **monochrome alpha masks and line primitives**: grid lines, edge
  fades and the cursor-following edge light. Never as visible color blends.

---

## 3. Typography

| Role                  | Font                 | Size                              | Weight | Tracking  |
| :-------------------- | :------------------- | :-------------------------------- | :----- | :-------- |
| Hero surname          | Inter                | `clamp(4.5rem, 15vw, 10.25rem)`   | 900    | `-0.045em`|
| Hero name lead        | Inter                | `clamp(2.1rem, 5.2vw, 4.25rem)`   | 900    | `-0.045em`|
| Section title (h2)    | Inter                | `clamp(2.4rem, 6.4vw, 5rem)`      | 900    | `-0.04em` |
| Section index numeral | Inter, outlined      | `clamp(4.5rem, 10vw, 8.5rem)`     | 900    | `-0.06em` |
| Project title (h3)    | Inter                | `clamp(2.25rem, 4.6vw, 3.75rem)`  | 900    | `-0.04em` |
| Card title (h3)       | Inter                | `1.25rem – 1.875rem`              | 700–900| `-0.02em` |
| Lead paragraph        | Inter                | `1.5rem – 1.85rem`                | 500    | `-0.02em` |
| Body                  | Inter                | `1rem – 1.125rem`                 | 400    | normal    |
| Labels and eyebrows   | JetBrains Mono       | `0.6875rem – 0.75rem`, uppercase  | 400–500| `0.2em`   |
| Metrics and counters  | JetBrains Mono       | up to `clamp(4rem, 10vw, 7.5rem)` | 600    | `-0.04em` |

- Comments-style labels (`// Quick Facts`, `// Direct Inbox`) are the system's voice for metadata.
- Numbers are always mono and `tabular-nums` when they change.

---

## 4. Layout

- **Container:** `max-w-6xl` (1152 px), gutters `px-5 sm:px-6 md:px-8`.
- **Sections:** `py-20 md:py-28 lg:py-36`, `scroll-mt-20` so anchors clear the dock.
- **Grid:** 12 columns from `lg`; content splits 7 / 5.
- **Range:** designed and tested for 360 px to 1920 px, with no horizontal page scroll.
- **Breakpoints in use:** `sm` 640, `md` 768, `lg` 1024 (desktop nav, Skills prism, project
  yaw), `min-[1400px]` (depth rail).

---

## 5. The depth system

### Plate (`Card`)

Every card is an exploded stack: a content **face** with one or two **ghost plates** behind it.

```
face            translate(0, 0)
ghost           translate(7px, 7px)          solid,  --plate-ghost
ghost--2        translate(14px, 14px)        dashed, --plate-ghost-2   (layers={2})
```

- **Hover / focus-within:** the face lifts `-3px, -3px` and its edge strengthens; ghosts drop
  further back, so the stack *separates*.
- **`tilt`:** follows the pointer (max 3–5°). The wrapper becomes `preserve-3d` and the ghosts
  move to `translateZ(-26px / -52px)`, so the plates separate in real perspective.
- **`spotlight`:** a 1 px edge light follows the pointer (`--mx`, `--my`).
- Tilt and spotlight are mouse and trackpad only, and off under reduced motion.

### Keycap (`Button`, `.key`)

Physical keys with an extruded side that press down.

| Variant   | Face          | Side                                      |
| :-------- | :------------ | :---------------------------------------- |
| `primary` | `--text`      | `--key-side`                              |
| `outline` | `--bg`        | `--key-side-soft` with `--border-strong`  |
| `ghost`   | transparent   | none                                      |

Depth: `4px` (`md`), `3px` (`sm`, `icon`). Hover raises 1 px and deepens the side by 1 px;
active presses down to a 1 px side. Sizes: `sm` 34 px, `md` 46 px, `icon` 40 × 40 px.

### Tag (`.tag`)

Low-profile keycaps for metadata: 1 px border, `2px` extruded bottom edge. `tag--lg` for
skill chips, `tag--strong` for emphasis (role, "Current", languages).

### Extruded type

- `.extrude`: 5 stacked 1 px text-shadows (highlights, CGPA, ratings).
- `.extrude-xl`: 12 layers (404 numeral).
- `.section-index`: outlined numeral (`--bg` face, 1.5 px `--text` stroke) with a 10-layer body.
- **Counters** in Problem Solving extrude from 0 to 12 px *while* they count up.
- **Exploded type:** the hero surname is solid with two outlined copies behind it, offset by
  `0.045em` and `0.09em`. The copies drift with the pointer (`--px`, `--py`) and separate as
  the hero scrolls away (`--explode`).

### Decorative text

Purely decorative text (section numerals, the footer wordmark) is drawn from `data-text`
through `::before` (`.ghost-text`) and marked `aria-hidden`, so it never enters the
accessibility tree or contrast audits.

### Z annotations

Sections are numbered as depths: the heading rule ends in `z-01 … z-07`, and the depth rail
(≥ 1400 px) lists the same indices as a fixed section index that doubles as scroll progress.

---

## 6. Textures

| Texture            | Where                         | Implementation                                     |
| :----------------- | :---------------------------- | :------------------------------------------------- |
| Film grain         | Whole page, behind content    | Fixed `feTurbulence` SVG, desaturated, opacity 5–7 %|
| Dot grid           | Hero ("drafting paper")       | 26 px radial dots, radial edge mask                |
| Line grid          | Panels, 3D floor              | 36 px hairlines / drei `<Grid>`                    |
| Perspective floor  | Contact, 404                  | CSS plane at `rotateX(74deg)` moving toward viewer |

The grain sits at `z-index: -1` and the background world at `-2`, so no wrapper may paint
a background over them (the layout wrapper is intentionally transparent; `body` carries
the background). The Contact floor carries `.world-fallback`: it fades out once the world draws its first
frame (`html.world-on`) and remains whenever the world cannot run. The hero dot grid always
stays, because the world begins at About.

---

## 7. Motion

| Token / pattern       | Value                                                      |
| :-------------------- | :--------------------------------------------------------- |
| `--ease-out-expo`     | `cubic-bezier(0.16, 1, 0.3, 1)`, the default for everything |
| `--ease-in-out`       | `cubic-bezier(0.65, 0, 0.35, 1)`, loops (rail pulse)        |
| Micro (keys, tags)    | 160–200 ms                                                 |
| Surfaces (plates)     | 550–600 ms                                                 |
| Reveals               | 700–900 ms, staggered 80–100 ms                            |

**Reveal variants** (`Reveal`): `rise` (fade up 28 px), `depth` (stands up from
`rotateX(18deg)`), `swing` (swings in around Y from the left edge). Section titles stand up from
`rotateX(55deg)`; the section numeral swings in from `rotateY(-60deg)`.

**Scroll-linked:** the background world's camera spiralling down the stack (§9); hero
orbit widening and surname explosion; project screens rising from `rotateX(28deg)`; the
experience rail filling; the Skills prism turning with a dwell on each face.

### Reduced motion

`<MotionConfig reducedMotion="user">` removes every transform animation app-wide (fades
remain), and the CSS reset collapses transitions and keyframes to 0.01 ms. In addition:

| Feature              | Reduced-motion behaviour                                      |
| :------------------- | :------------------------------------------------------------ |
| Hero 3D              | Renders on demand only: no orbit, intro, sway or parallax      |
| Background world     | No flight: the camera cuts to each section's still; no ambient motion; a frame only when the section changes |
| Pointer tilt, cursor | Disabled                                                      |
| Skills               | Flat snap carousel instead of the pinned prism                |
| Counters             | Final values immediately                                      |
| Rail pulse, floor    | Static                                                        |

---

## 8. Hero 3D scene (`src/three/`)

**Composition.** A full-color cutout of the avatar (`profile.avatar`) stands on a pedestal of
three plates separated by small gaps, an exploded pedestal with rotating tick marks. A dashed
drafting reticle sits behind the figure (deeper in Z, so it parallaxes). Two rings orbit the
figure at chest height:

| Ring  | Source                    | Radius | Tilt (x, z)    | Speed  | Keycap size |
| :---- | :------------------------ | :----- | :------------- | :----- | :---------- |
| Inner | `portfolio.orbit.inner`   | 1.9    | 0.30, 0.10     | +0.30  | 0.60        |
| Outer | `portfolio.orbit.outer`   | 2.7    | 0.38, −0.15    | −0.18  | 0.46        |

Only names that also appear in `skills`, an experience `tech` list or a project `stack` are
rendered, so the orbit can never show an invented skill. Under 540 px of canvas width only the
inner ring is shown.

**Keycaps.** Rounded boxes with an inverted-hull outline; the brand glyph is serialised from
`react-icons` to SVG and drawn into a canvas texture in its brand color (or the theme's ink for black/white brands). They counter
their ring's tilt so they always face the viewer. Each keycap has an invisible hit zone
40 % wider than its body (roughly 10 px on screen), so the label appears as the pointer
comes near; the label sits just below the keycap. Keycaps pass in front of and behind the
figure (the avatar writes depth).

**Interaction.**

- Pointer anywhere over the hero tilts the set (±0.28 rad) and the figure far less (×0.22).
- Hovering a keycap lifts it, shows its name in a `scene-chip` just below it, and pauses the
  orbit so the keycap stays under the pointer. The avatar's opaque pixels block hover, so
  keycaps passing behind the figure can't be hovered.
- Clicking a keycap scrolls to the Skills section.
- Scrolling the hero away widens both rings by up to 18 % and turns the set.
- On load the keycaps fly in from outside their orbits with a short stagger.

**Materials and light.** Unlit avatar (`meshBasicMaterial`, alpha-tested), standard materials
for plates and keycaps, ambient plus key and fill directional lights, no tone mapping (`flat`),
no environment maps. All colors come from `useTheme().colors` and switch with the theme.

**Performance and safety.**

- three.js, R3F and drei live in a lazy chunk mounted on `requestIdleCallback`.
- Rendering stops while the hero is off screen; DPR is capped at 1.75.
- Pointer events come from the hero section (`eventSource`); the canvas is
  `pointer-events: none`, so scroll and touch are never captured.
- Until the first frame, and permanently without WebGL, `OrbitFallback` draws the same
  composition as an SVG line drawing (not an LCP candidate).
- @react-three/fiber (up to 9.8.x) creates a `THREE.Clock`, which three r183+ reports as
  deprecated. That single message is filtered through three's official `setConsoleFunction`
  hook in `consoleFilter.js` (shared by both canvases); everything else is forwarded.

---

## 9. Background world: "The Stack" (`src/three/world/`)

**Concept: a descent from cloud to silicon.** A fixed, full-viewport scene sits behind the
whole page. Six plates hang on four dashed assembly rails above a drafting floor, one plate
per section; Contact is the floor itself. Each plate carries a small diorama of what its
section is about, and the plate labels repeat the page's own depth indices (`z-01 … z-07`).
Scrolling spirals the camera down the stack, 60° per section, so the page reads as one
continuous exploded view of a software system.

| Section      | Layer              | Diorama (data source)                                                          |
| :----------- | :----------------- | :----------------------------------------------------------------------------- |
| Hero         | —                  | Not shown: the hero belongs to the avatar and its dot grid. The camera frames the whole stack here, out of sight, and the world fades in on the dive to About |
| About        | z-01 Interface     | An exploded browser window: frame, layout, content and controls as 4 plates   |
| Experience   | z-02 Version control | A git graph: a branch per `experience` entry, a commit per bullet, merged when the role ended; a role that runs to "Present" keeps `HEAD` |
| Projects     | z-03 Deploy        | A container yard: a stack per `projects` entry, a container per `stack` item; settles as you arrive; gantry crane overhead |
| Skills       | z-04 Dependencies  | A dependency graph: root → a hub per `skills` group → a leaf per skill, with packets resolving outward |
| Achievements | z-05 Algorithms    | 14 bars bubble-sorting one swap at a time; a binary tree walked in order       |
| Education    | z-06 Foundations   | A processor: die, cache grid and core, 40 pins, traces carrying signals        |
| Contact      | z-07 Network       | Routes leaving the stack's footprint, packets streaming to the horizon, signal rings |

Counts that come from the data are never invented: nodes, commits and containers are the
lengths of the corresponding arrays in `portfolio.js`.

**Camera.** `scrollRig.js` turns scroll into a fractional section index. A section's waypoint
is reached when its centre meets the viewport centre or where an in-page link lands it; a
section taller than the viewport holds its waypoint while it fills the screen, so the camera
travels between sections and stands still while you read. `CameraRig.jsx` damps that index
(frame-rate independent) and samples the `WAYPOINTS` table in cylindrical coordinates
(angle, radius, height), so the path is a true spiral. Each waypoint also sets the field of
view, fog, a lens shift (`shift`, `rise`) that composes the diorama into the empty part of
that section's layout on wide screens, and `dim`, how far the world steps back behind text.

**Readability first.** The content always wins over the scene: the world is invisible over
the hero and fades in between the hero and About; each section dims it by 45–62 %
(a little less in dark mode, a little more on tall screens); and on screens ≥ 1024 px a
horizontal alpha mask keeps it at full strength only in the gutters, at half strength
behind the content column.

**Motion that explains structure.**

- On arrival the plates assemble from apart while the camera dollies in from further out.
- Scrolling fast pulls the plates apart along the rails (the gap follows scroll speed) and
  speeds up the packets; both settle when the page stops.
- Each diorama assembles (scales in) as the camera reaches its plate and packs away as it
  leaves, so only the section on screen has a subject behind its text.
- The plate under the camera takes stronger edges. Code glyphs (`{ }`, `</>`, `=>` …) drift
  in a ring between the camera and the stack and counter-rotate with the scroll: the
  world's foreground layer.
- Mouse and trackpad add a slight hand-held drift.

**Color.** Everything is monochrome and switches with the theme (`useTheme().colors.world`):
light reads as drafting paper (grey hairlines, ink packets), dark as a CAD viewport (white ink
on near-black). Fog fades to `--bg`. Materials are shared and recoloured in place.

**Performance and safety.**

- Its own lazy chunk (~11 kB gzipped on top of the shared three.js chunk). It mounts on the
  visitor's first interaction (or 5 s after load), in idle time, and compiles every shader
  before its first frame (`compileAsync` where `KHR_parallel_shader_compile` exists).
- Demand rendering: full rate while scrolling, during the opening and while the camera
  settles, half rate once the page is still. If frames run long the pixel ratio steps down
  (cap 1.5, 1.25 on touch) and recovers when there is headroom. Fewer instances below 768 px.
- Procedural geometry only (boxes, hairlines, points, canvas-drawn mono labels); no models,
  textures or HDRs.
- `aria-hidden`, `pointer-events: none`: it never captures scroll, touch or clicks.
- Reduced motion: no flight, no ambient motion; the camera cuts to the section on screen.
- No WebGL: nothing renders and the CSS fallbacks (§6) stay.

---

## 10. Section blueprints

| Section        | Treatment                                                                                   |
| :------------- | :------------------------------------------------------------------------------------------ |
| Navbar         | Floating dock that rises (glass and a plate edge) after scroll; active link is a keycap pill. Drawer below `lg`. |
| Hero           | Status chip; name with the exploded surname; tagline; keycap CTAs; 3D avatar and orbits; four highlight plates with extruded values. |
| About          | Editorial spread: lead paragraph left, supporting paragraphs and CTA right; Quick Facts as one spec row (wraps to 2 columns, then 1, on small screens). |
| Experience     | Rail that fills on scroll with a travelling pulse; dates left; tilting plates that swing in. |
| Projects       | Each screen is an exploded 3D object: rises off the floor, angles toward its copy, squares up on hover while its plates and stack chips separate. Screenshots in full color. |
| Skills         | Desktop: pinned hexagonal prism, five skill groups plus a call-to-action as faces, dwell on each, θ readout, hex caps, keyboard and button navigation. Touch and reduced motion: coverflow snap carousel. |
| Problem Solving| Extruding counters; rating plates with tilt and edge light.                                 |
| Education      | Degree plate with a CGPA and graduation spec row, numbered coursework; languages plate.     |
| Contact        | Email as the headline with a terminal caret; keycap actions; channel rows; perspective floor horizon. |
| Footer         | Name, year, back-to-top keycap; oversized outlined wordmark cropped by the page edge.       |
| 404            | Extruded numeral on a perspective floor.                                                    |

---

## 11. Cursor

A CAD reticle (ring with four ticks) trails the native cursor, which stays visible, with a live
`x 0000 y 0000` readout. It inverts what is beneath it (`mix-blend-difference` on the fixed
layer itself), grows over interactive elements, and becomes a solid `View ↗` bubble over
project screens. It is mouse and trackpad only, and off under reduced motion.

---

## 12. Accessibility

- **Contrast:** text `19.8:1` both themes; muted text `10.4:1` (light) and `7.7:1` (dark).
  `--border-strong` and lighter tones are for lines, never for body text.
- **Focus:** global `:focus-visible` outline, `2px solid var(--text)`, offset `3px`.
- **Keyboard:** skip link; the mobile drawer traps focus and closes on Escape; focusing
  anything on a Skills prism face turns the prism to that face; prev/next keys.
- **Semantics:** decorative layers are `aria-hidden` (the background world and its HUD
  included); the hero 3D canvas is a single `role="img"` with a data-driven description; counters expose their final value to screen readers; the
  copy-email action announces through a polite live region.
- **Reduced motion:** see §7.

---

## 13. Content rules

- All content comes from `src/data/portfolio.js` (`profile.avatar` and `orbit` included).
- Never add jobs, projects, metrics, links or skills that are not in the data file.
- UI microcopy that is not résumé content (labels, button text, captions) lives in components.
- Placeholders (`null`) hide their element: for example `profile.location`, `profile.photo`
  and competitive-programming profile URLs.

---

## 14. File map

```text
src/
  styles/index.css          tokens, @theme, plates, keycaps, tags, extrusion, textures, keyframes
  components/
    Button.jsx              keycap button
    Card.jsx                plate (tilt, layers, spotlight)
    Tag.jsx                 keycap chip
    SectionHeading.jsx      title block with z-index rule and extruded numeral
    Reveal.jsx              rise | depth | swing reveals
    DepthRail.jsx           fixed z-index section rail (≥ 1400 px)
    CustomCursor.jsx        reticle and coordinate readout
    PerspectiveFloor.jsx    CSS 3D horizon
    ThemeToggle.jsx         keycap theme switch
    brandIcons.js           skill name → monochrome brand glyph
  hooks/
    useMediaQuery.js        media queries, reduced motion, fine pointer
    usePointerTilt.js       spring tilt and edge-light coordinates
    useActiveSection.js     shared scroll-spy
    useTheme.js             theme toggle and 3D palette
  three/
    OrbitCanvas.jsx         idle-loaded wrapper, fallback cross-fade, error boundary
    OrbitCanvasInner.jsx    <Canvas>, event source, offscreen pause, parallax input
    OrbitScene.jsx          avatar, pedestal, reticle, orbit rings, keycaps, floor
    OrbitFallback.jsx       SVG line drawing of the scene
    WorldCanvas.jsx         background world: interaction/idle-loaded fixed layer, world-on flag
    WorldCanvasInner.jsx    <Canvas>, shader warm-up, frame pacing and resolution governor
    CanvasBoundary.jsx      error boundary shared by both canvases
    webgl.js                cached WebGL support probe
    consoleFilter.js        filters R3F's known THREE.Clock deprecation message
    world/
      waypoints.js          stack geometry, camera waypoints, layer table (no three import)
      scrollRig.js          scroll → section index, section anchors, shared rig state
      CameraRig.jsx         spiral camera, damping, lens shift, fog, dim, HUD readout
      WorldScene.jsx        composition of the world
      Tower.jsx             plates (assemble, explode, focus) and rails with packets
      Atmosphere.jsx        drafting floor, dust, cloud, code-glyph fragments
      materials.jsx         shared monochrome materials, recoloured per theme
      geometry.js, parts.jsx  procedural helpers, Slab and Label parts
      dioramas/             Interface, CommitGraph, ContainerYard, DependencyGraph,
                            Algorithms, SiliconDie, Network
  layout/                   Layout, Navbar (dock), Footer, navLinks
  sections/                 Hero, About, Experience, Projects, Skills, Achievements, Education, Contact
```

---

## 15. Do and don't

| Do                                                      | Don't                                                     |
| :------------------------------------------------------ | :-------------------------------------------------------- |
| Build depth with plates, keycaps, extrusion and Z       | Use drop shadows as the only sign of depth                |
| Use `--text-muted` for secondary text                   | Set body text in `--border-strong` or lighter             |
| Read every fact from `portfolio.js`                     | Hard-code résumé content in components                    |
| Gate tilt, cursor and 3D motion behind fine pointer and reduced-motion checks | Capture wheel, touch or drag on the 3D canvas |
| Mark decorative layers `aria-hidden`                    | Put decorative text in the accessibility tree             |
| Keep the monochrome palette, apart from the approved exceptions (§2) | Add hues in hovers, focus rings, charts or 3D materials |
