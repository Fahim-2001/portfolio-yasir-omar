# Workspace Rules: Md. Yasir Omar Fahim Portfolio

These rules apply to all tasks in this workspace. Detailed skill documentation is also maintained in [.agents/skills/portfolio-rules/SKILL.md](file:///.agents/skills/portfolio-rules/SKILL.md).

1. **Stack**: React + Vite (JavaScript only, no TypeScript), Tailwind CSS (latest stable with `@tailwindcss/vite`), React Router, `motion` (import from `"motion/react"`), `lucide-react`, `react-icons`, `@fontsource/inter`, `@fontsource/jetbrains-mono`, `three` + `@react-three/fiber` + `@react-three/drei` (versions matched to React in `package.json`).
2. **Single source of truth**: All portfolio content lives in `src/data/portfolio.js`. Never hardcode resume content in components.
3. **No invented content**: Never add jobs, projects, metrics, testimonials, clients, awards, certifications, years of experience, or links not present in `src/data/portfolio.js`. Use placeholders or hide elements and notify the user if data is missing.
4. **Design system**: Strictly monochrome (white #FFFFFF, neutral-50 #FAFAFA, neutral-100 #F4F4F5, neutral-200 #E4E4E7, neutral-400 #A1A1AA, neutral-500 #71717A, neutral-700 #3F3F46, neutral-800 #27272A, neutral-900 #18181B, black #0A0A0A). No colors anywhere (including hovers, links, focus, charts). Light theme default, dark theme inverted, using semantic CSS variables/tokens (`--bg`, `--surface`, `--border`, `--text`, `--text-muted`, `--accent`).
5. **Style**: Modern, minimal, editorial. Generous whitespace, large confident typography, thin 1px borders, subtle grain/grid textures, restrained motion. No color gradients, emojis, or stock illustrations. 3D objects follow the monochrome palette, use no external models/textures/HDRs, and never block scrolling.
6. **Folder structure**:
   ```text
   src/
     assets/
     three/
     components/
     sections/
     layout/
     data/portfolio.js
     hooks/
     styles/index.css
     App.jsx, main.jsx
   ```
7. **Quality bar**: Responsive (360px - 1920px), WCAG AA contrast, keyboard accessible, respects prefers-reduced-motion, zero console errors/warnings, Lighthouse 90+ across all categories.
8. **Workflow**: Always propose an implementation plan first and wait for user approval before making large changes. After each task, run dev server, test in browser, and report verification findings.
