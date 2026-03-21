# 💀 Atlas Bucomaxilo

## Overview
An interactive, web-based anatomical atlas designed for academic exploration of orofacial morphology. This tool provides dentistry students and professionals with a highly visual, zero-latency way to study facial muscles and their directly associated anatomical landmarks. 

Built with modern web technologies, it replaces static textbook images with dynamic, hover-triggered visual data.

## Features
* **Interactive Hover Engine:** Seamlessly reveals highlighted anatomical structures and technical data simply by hovering over the base skull image.
* **Dynamic Display Modes:**
  * *Standard Mode:* Uses precise delineation overlays to highlight specific structures directly on the skull.
  * *Double Mode:* Renders a side-by-side comparative view of the isolated muscle and its corresponding skeletal landmark.
* **Academic Precision:** Displays strictly curated data, instantly connecting muscles (e.g., Masseter, Temporal) to their specific anatomical accidents (e.g., Zygomatic Arch, Temporal Fossa).
* **Performance Optimized:** Implements image pre-loading and pure CSS/React state transitions to guarantee fluid interactions during live classroom presentations.

## Architecture
The project follows a clean, component-based architecture focusing on separation of concerns:
* **Data Layer (`/constants`):** Acts as an internal static database. It maps muscle IDs to their respective image paths, display modes, and technical anatomical descriptions.
* **Presentation Layer (`/components`):** The `AnatomyViewer` handles the complex state management of image stacking, z-index manipulation, and conditional rendering based on the active muscle's display mode.
* **Asset Management (`/public/images`):** Houses all perfectly aligned, high-resolution anatomical base images and overlays.

## Tech Stack
* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Icons:** Lucide React

## Getting Started

First, clone the repository and install the dependencies:

```bash
git clone [https://github.com/YOUR_USERNAME/atlas-bucomaxilo.git](https://github.com/YOUR_USERNAME/atlas-bucomaxilo.git)
cd atlas-bucomaxilo
npm install
```

Next, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment
This application is optimized for zero-config deployment on Vercel. 
Simply push your code to a GitHub repository, import it into Vercel, and the build will be configured automatically for Next.js.

## Contact
Developed with ☕ and 🧠 by Gigio
