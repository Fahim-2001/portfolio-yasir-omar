# Md. Yasir Omar Fahim — Software Engineer Portfolio

A modern, minimal, editorial personal portfolio website engineered for **Md. Yasir Omar Fahim**, Software Engineer. Built with **React 19**, **Vite**, **Tailwind CSS**, **Motion**, and an interactive monochrome **Three.js** 3D core.

Strictly adheres to a monochrome design system (whites, greys, and blacks only) with full dark mode support, fluid typography, WCAG AA contrast compliance, keyboard accessibility, and a single source of truth for all content.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework & Bundler** | [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) | High-performance client runtime and lightning-fast HMR |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`) | Semantic CSS tokens and modern utility classes |
| **Routing** | [React Router v7](https://reactrouter.com/) | Client-side SPA routing with custom 404 fallback |
| **Animations** | [Motion](https://motion.dev/) (`motion/react`) | Scroll-driven reveals, horizontal pinned track, smooth springs |
| **3D Graphics** | [Three.js](https://threejs.org/) + Fiber + Drei | Procedural interactive icosahedron tech core and particle orbits |
| **Icons** | [Lucide React](https://lucide.dev/) + [React Icons](https://react-icons.github.io/react-icons/) | Minimal UI glyphs, SimpleIcons for dev tools, Fa6 for brands |
| **Typography** | `@fontsource/inter` & `@fontsource/jetbrains-mono` | Editorial sans-serif paired with technical monospace accents |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Local Development

1. **Clone or navigate into the repository**:
   ```bash
   git clone <your-repo-url>
   cd portfolio-yasir-omar
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```
   Outputs an optimized, minified bundle to `dist/` with isolated vendor and 3D lazy chunks.

5. **Preview production build locally**:
   ```bash
   npm run preview
   ```
   Serves `dist/` at [http://localhost:4173](http://localhost:4173).

---

## 📝 How to Edit Content (Single Source of Truth)

All personal information, work history, education, skills, and links live strictly in one file:

👉 **[`src/data/portfolio.js`](src/data/portfolio.js)**

> [!IMPORTANT]
> **Never edit component files to change your personal or resume content.**
> Components dynamically import `portfolioData` from `src/data/portfolio.js`. Updating this single file instantly updates all sections (Hero, About, Experience, Projects, Skills, Achievements, Education, Contact, and Footer).

### Key Data Sections in `src/data/portfolio.js`:

```javascript
const portfolioData = {
  profile: {
    name: "Md. Yasir Omar Fahim",
    shortName: "Fahim",
    role: "Software Engineer",
    tagline: "I build web applications...",
    location: null,                       // e.g., "Dhaka, Bangladesh"
    photo: null,                          // e.g., "/profile.jpg"
    resumeUrl: "/Resume_Md_Yasir_Omar_Fahim.pdf",
    email: "mdyasirofficial2001@gmail.com",
    phone: "+8801639607507",
    showPhone: false,                     // Set to true to display phone in Contact section
    socials: [
      { label: "GitHub", url: "https://github.com/Fahim-2001" },
      { label: "LinkedIn", url: "https://linkedin.com/in/fahim2001" },
    ],
  },
  
  about: [ ... ],                         // Paragraphs for the About narrative
  highlights: [ ... ],                    // 4 stat cards (e.g., "350+", "20+")
  experience: [ ... ],                    // Timeline jobs with company, dates, bullets, tech
  projects: [ ... ],                      // Featured project cards with stack and bullets
  skills: [ ... ],                        // Technical groups (Languages, Tools, Cloud, etc.)
  competitiveProgramming: { ... },        // Problem solving summary and platform ratings
  education: [ ... ],                     // Degree, institution, CGPA, graduation, courses
  languages: [ ... ],                     // Languages with proficiency level
};
```

---

## 🖼️ Adding Photos & Project Images

All static media assets live in the `/public` directory and are referenced with root-relative paths (`/filename.ext`).

### 1. Profile Photo (About Section)
1. Add your photo to `public/profile.jpg` (or `.png`).
2. Open `src/data/portfolio.js` and set:
   ```javascript
   photo: "/profile.jpg",
   ```
*(If left as `null`, the About section gracefully hides the photo frame).*

### 2. Project Screenshots (Projects Section)
1. Place your screenshots in `public/` (e.g. `public/TradeFlow.png` and `public/Zyxark.png`).
2. Open `src/data/portfolio.js` and update the `image` field:
   ```javascript
   {
     title: "TradeFlow",
     ...
     image: "/TradeFlow.png",
   }
   ```
*(If `image` is `null`, an interactive abstract skeleton wireframe is rendered automatically).*

### 3. Resume PDF
- The resume is located at `public/Resume_Md_Yasir_Omar_Fahim.pdf`.
- When you have a new version of your resume, simply overwrite this file with the same filename. All "Download Resume" buttons on the website will serve the updated PDF immediately.

### 4. Open Graph Social Card (SEO)
- Replace `public/og-image.png` with your custom 1200×630px social banner for Twitter, LinkedIn, and Discord link previews.

---

## 🌐 Changing Your Production Domain

When deploying under your custom domain (e.g. `https://yasiromarfahim.dev` or `https://fahim.com`), update these 3 files:

1. **[`index.html`](index.html)**:
   - Canonical tag (`<link rel="canonical" href="https://your-domain.com/" />`)
   - Open Graph URL (`<meta property="og:url" content="https://your-domain.com/" />`)
   - Twitter URL (`<meta name="twitter:url" content="https://your-domain.com/" />`)
   - JSON-LD Person schema (`"url": "https://your-domain.com"`)
2. **[`public/robots.txt`](public/robots.txt)**:
   - Update `Sitemap: https://your-domain.com/sitemap.xml`
3. **[`public/sitemap.xml`](public/sitemap.xml)**:
   - Update `<loc>https://your-domain.com/</loc>`

---

## ☁️ Deployment Guides

### Option 1: AWS Amplify Hosting (Recommended)

This repository includes turnkey support for AWS Amplify:
- `amplify.yml`: Preconfigured build pipeline (`npm ci`, `npm run build`, artifact `dist`).

#### Step-by-Step AWS Amplify Setup:
1. Push your code to your GitHub / GitLab repository.
2. In the **AWS Management Console**, open **AWS Amplify**.
3. Click **Deploy an app** > Select **GitHub** > Authorize and select your repo branch.
4. Amplify will automatically detect the build settings from [`amplify.yml`](amplify.yml). Click **Next** > **Save and deploy**.

#### ⚠️ Critical Step: SPA Client-Side Routing Rewrite Rule
Because this is a single-page app (SPA) with React Router, you must configure a rewrite rule so direct visits to deep or unknown routes load `index.html` instead of giving a 404:

1. In the Amplify console, navigate to your app.
2. On the left navigation menu, click **App settings** > **Rewrites and redirects**.
3. Click **Edit**, then **Add rule** (or update the default rule):
   - **Source address**: `</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json|pdf)$)([^.]+$)/>`
   - **Target address**: `/index.html`
   - **Type**: `200 (Rewrite)`
4. Click **Save**.

---

### Option 2: Vercel

The repository includes a pre-configured [`vercel.json`](vercel.json):
```bash
npx vercel
```
Or connect your GitHub repository in the Vercel dashboard. The build command `npm run build` and output directory `dist` are auto-detected.

---

### Option 3: Netlify / Cloudflare Pages

The repository includes [`public/_redirects`](public/_redirects) with:
```text
/*    /index.html   200
```
This automatically handles SPA routing and 404 pages out of the box. Set your build command to `npm run build` and publish directory to `dist`.

---

## 🎨 Design Principles & Quality Bar

- **Strictly Monochrome**: No saturated colors or accent hues anywhere. Every element uses neutral semantic tokens (`--bg`, `--surface`, `--border`, `--text`, `--text-muted`, `--accent`).
- **Editorial Typography**: Large, confident typography balanced with generous whitespace.
- **Accessible (WCAG AA)**: Fully keyboard navigable, visible focus rings, aria labels on all interactive items, and contrast ratios exceeding 7.5:1 in both light and dark themes.
- **Reduced Motion**: All animations (Motion springs, counters, and Three.js 3D canvas) respect `prefers-reduced-motion: reduce`.

---

## 📄 License

Personal portfolio codebase of **Md. Yasir Omar Fahim**. All rights reserved.
