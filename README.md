<p align="center">
  <h1 align="center">💀 Atlas Oral-Maxillofacial</h1>
  <p align="center">
    <strong>An interactive anatomical atlas for studying orofacial muscles and their skeletal landmarks.</strong>
  </p>
  <p align="center">
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#project-structure">Project Structure</a> •
    <a href="#contributing">Contributing</a>
  </p>
</p>

---

## 📋 About

**Atlas Oral-Maxillofacial** is a web-based educational tool built for dentistry students and professionals who need a fast, interactive way to explore orofacial anatomy.

Traditional anatomical study relies on static textbook images that lack interactivity and immediate feedback. This atlas solves that by providing **hover-triggered visual data** — allowing users to intuitively navigate through 25+ facial muscles and instantly see their associated anatomical accidents (bony landmarks), all within a polished dark-mode interface designed for lecture halls and self-study alike.

---

## ✨ Features

- **Interactive Hover Engine** — Reveals highlighted anatomical structures by hovering over the muscle list, providing instant visual feedback on the skull model.
- **Dual Display Modes:**
  - **Standard Mode** — Overlays a highlighted muscle directly on the base skull image with smooth opacity transitions.
  - **Side-by-Side Mode** — Presents a comparative view of the isolated muscle alongside its corresponding skeletal landmark.
- **25+ Anatomical Entries** — Curated dataset covering key muscles of mastication, facial expression, suprahyoid and infrahyoid groups, and palate muscles.
- **Image Pre-loading** — All anatomical images are preloaded on mount with a fallback timeout, ensuring zero-lag interactions.
- **Responsive Layout** — Adapts seamlessly from desktop to mobile with a collapsible sidebar panel.
- **Academic Dark Mode** — Minimalist, professional interface with glassmorphism effects optimized for presentation and study environments.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js](https://nextjs.org/) 16 | React framework with App Router |
| [React](https://react.dev/) 19 | UI component library |
| [TypeScript](https://www.typescriptlang.org/) | Static typing and developer experience |
| [Tailwind CSS](https://tailwindcss.com/) 4 | Utility-first CSS framework |
| [Lucide React](https://lucide.dev/) | Icon library |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) **18+**
- A package manager: `npm`, `yarn`, `pnpm`, or `bun`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/gigio-mm/Atlas-Oral-and-Maxillofacial.git

# 2. Navigate into the project
cd Atlas-Oral-and-Maxillofacial/atlas-bucomaxilo

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server with hot reload |
| `npm run build` | Creates an optimized production build |
| `npm run start` | Serves the production build |
| `npm run lint` | Runs ESLint for code quality checks |

---

## 📁 Project Structure

```
atlas-bucomaxilo/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout with fonts & metadata
│   ├── page.tsx              # Home page entry point
│   └── globals.css           # Global styles
│
├── components/
│   └── AnatomyViewer.tsx     # Core atlas component — handles display
│                             # modes, hover state, and image stacking
│
├── constants/
│   └── muscleData.ts         # Typed muscle dataset with display mode
│                             # configuration and anatomical accident data
│
├── public/
│   └── images/               # Anatomical images (base skull, muscle
│                             # highlights, and landmark references)
│
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

### Key Files

- **`constants/muscleData.ts`** — The data layer. Defines a `Muscle` interface with two display modes (`standard` and `double`) and exports an array of 25 muscle entries, each mapped to image paths and anatomical accident descriptions.

- **`components/AnatomyViewer.tsx`** — The presentation layer. Manages the active muscle state, conditionally renders either an overlay view or a side-by-side comparison, and handles image pre-loading on mount.

---

## 🧑‍💻 Contributing

Contributions are welcome! Follow these steps to get started:

1. **Fork** the repository
2. **Create** a feature branch:
   ```bash
   git checkout -b feature/add-new-muscle
   ```
3. **Commit** your changes with a descriptive message:
   ```bash
   git commit -m "feat: add digastric muscle data and images"
   ```
4. **Push** to your fork:
   ```bash
   git push origin feature/add-new-muscle
   ```
5. **Open a Pull Request** with a clear description of your changes

### Adding New Muscles

To add a new anatomical entry, add an object to the `muscleData` array in `constants/muscleData.ts`:

```typescript
{
  id: 'new-muscle-id',
  name: 'Muscle Name',
  displayMode: 'standard', // or 'double'
  baseImage: '/images/base.png',
  highlightImage: '/images/highlight.png',
  anatomicalAccident: { title: 'Associated Landmark' },
}
```

Place the corresponding images in `public/images/` and ensure overlay images are pixel-aligned with the base skull image.

---

<p align="center">
  Developed with ☕ and 🧠 by <strong>Gigio</strong>
</p>
