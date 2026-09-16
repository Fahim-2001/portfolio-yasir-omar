---
name: portfolio-rules
description: >-
  Project rules, design system specifications, architecture, and workflow requirements
  for building and maintaining the personal portfolio website for Md. Yasir Omar Fahim.
  Must be followed for every task in this workspace.
---

# Portfolio Project Rules: Md. Yasir Omar Fahim

Follow these mandatory rules and specifications for all tasks in this workspace.

---

## 1. Technology Stack

- **Framework & Build**: React + Vite (JavaScript only, strictly no TypeScript).
- **Styling**: Tailwind CSS (latest stable version configured with the official `@tailwindcss/vite` plugin).
- **Routing**: React Router.
- **Animation**: `motion` package (imported strictly from `"motion/react"`).
- **Icons**:
  - UI icons: `lucide-react`.
  - Brand/social icons (GitHub, LinkedIn, CodeChef, Codeforces): `react-icons`.
- **Typography**:
  - Body: `@fontsource/inter`.
  - Monospace / Code accents: `@fontsource/jetbrains-mono`.
- **3D Graphics**:
  - `three`, `@react-three/fiber`, `@react-three/drei`.
  - Ensure fiber and drei versions match the React version installed in `package.json` (always inspect `package.json` before installing).

---

## 2. Single Source of Truth

- **Data File**: ALL portfolio content lives strictly in `src/data/portfolio.js`.
- Components must dynamically read from `src/data/portfolio.js`.
- Never hard-code resume or personal content inside React components.

---

## 3. No Invented Content

- Never fabricate, assume, or invent jobs, projects, metrics, testimonials, clients, awards, certifications, years of experience, or external links.
- Only render data explicitly present in `src/data/portfolio.js`.
- If data is missing or incomplete:
  - Render a clearly marked placeholder or gracefully hide that element.
  - Inform the user about the missing content.

---

## 4. Strictly Monochrome Design System

Strictly monochrome palette with white, black, and shades of black/grey. No other hues anywhere (including hover states, focus outlines, links, borders, backgrounds, or charts).

### Palette Tokens:
- `white`: `#FFFFFF`
- `neutral-50`: `#FAFAFA`
- `neutral-100`: `#F4F4F5`
- `neutral-200`: `#E4E4E7`
- `neutral-400`: `#A1A1AA`
- `neutral-500`: `#71717A`
- `neutral-700`: `#3F3F46`
- `neutral-800`: `#27272A`
- `neutral-900`: `#18181B`
- `black`: `#0A0A0A`

### Themes:
- **Light Theme (Default)**: Background `#FFFFFF`, Text `#0A0A0A`.
- **Dark Theme**: Background `#0A0A0A`, Text `#FFFFFF`.
- Use semantic CSS variables / Tailwind tokens: `--bg`, `--surface`, `--border`, `--text`, `--text-muted`, `--accent`.

---

## 5. Visual Style & 3D Guidelines

- **Aesthetic**: Modern, minimal, editorial design. Generous whitespace, confident typography, thin 1px borders, subtle grain or grid texture allowed, restrained motion.
- **Restrictions**:
  - No color gradients.
  - No emojis anywhere in the UI.
  - No stock illustrations.
- **3D Scenes**:
  - Must follow the exact same monochrome palette (materials, edges, lights, and glows must be white, grey, or black only).
  - No external 3D models, textures, or HDR environment files.
  - Must never block page scrolling or capture default touch/pointer scroll behavior.

---

## 6. Project Directory & File Structure

```text
src/
├── assets/
├── three/        # All 3D scene code
├── components/   # Shared UI (Button, Section, SectionHeading, Tag, Card, ThemeToggle, CustomCursor)
├── sections/     # Hero, About, Experience, Projects, Skills, Achievements, Education, Contact
├── layout/       # Navbar, Footer, Layout
├── data/
│   └── portfolio.js  # Single source of truth for all content
├── hooks/
├── styles/
│   └── index.css
├── App.jsx
└── main.jsx
```

---

## 7. Quality & Accessibility Bar

- **Responsiveness**: Fully responsive across screen widths from 360px to 1920px.
- **Accessibility**: WCAG AA contrast compliance and full keyboard navigability.
- **Motion**: Respects `prefers-reduced-motion` settings.
- **Cleanliness**: Zero console errors or warnings in runtime or build.
- **Performance**: Target 90+ score in all Google Lighthouse categories.

---

## 8. Development Workflow

1. Always provide an implementation plan first and wait for user approval before making large changes.
2. After each task:
   - Run the local dev server.
   - Inspect and verify the page in the browser.
   - Report back precisely what was verified.
3. Do not write application code without user request/approval.
