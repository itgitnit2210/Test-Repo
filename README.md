# Exicon Group — Website v2

**Next.js 15 + GSAP 3.12** — autoplay intro animation, no Framer Motion.

## Quick Start

```bash
npm install
npm run dev
```

Add your font WOFF2 files to `/public/fonts/` (see Fonts section).

---

## Animation Timeline (Autoplay — no interaction needed)

```
0.0s ─── Page loads, black screen
0.3s ─── Particles begin fading in (canvas, 2.5s fade)
0.4s ─── Gold icons appear with random stagger (0.7s each, back.out ease)
1.0s ─── Logo OUTLINE begins drawing (strokeDashoffset → 0, 3s, staggered rings)
3.8s ─── Outline strokes turn gold (#c3884f)
4.0s ─── Logo SOLID fades in underneath outline (1.5s)
5.0s ─── Icons begin gentle floating loop (infinite yoyo)
5.5s ─── Outline fades out, leaving clean solid logo
```

Everything is a single GSAP timeline — deterministic, identical on Mac/Windows/iOS.

---

## Icon Map

Icons are the gold (#c3884f) decorative elements scattered around the logo.
Each has been extracted from the original Asset files and renamed:

| File | Original | What it depicts | Position (from 1920×1080) |
|------|----------|-----------------|---------------------------|
| `icon-paw.svg` | Asset_3.svg | Animal paw print | 61.8%, 26.9% |
| `icon-lightbulb.svg` | Asset_4.svg | Light bulb with rays | 79.4%, 24.1% |
| `icon-infinity.svg` | Asset_5.svg | Two interlocking circles | 33.3%, 49.8% |
| `icon-atom.svg` | Asset_6.svg | Atom with orbital paths | 37.8%, 72.9% |
| `icon-molecule.svg` | Asset_8.svg | Connected node network | 38.5%, 26.5% |
| `icon-caterpillar.svg` | Asset_9.svg | Spiral shell with dots | 68.1%, 64.5% |
| `icon-beetle.svg` | Asset_10.svg | Bug with antennae | 18.2%, 35.0% |
| `icon-diamond.svg` | Asset_11.svg | Geometric target shape | 22.4%, 72.2% |
| `icon-search.svg` | Asset_12.svg | Magnifying glass | 83.3%, 52.8% |

Icons are hidden on mobile (<768px) to keep the intro clean.

---

## Logo Alignment

Two SVG layers stack precisely on top of each other:

- **`LogoOutline`** — viewBox `0 0 882.52 501.54`, stroke-only (#404041, 1.42px)
- **`LogoSolid`** — viewBox `0 0 881.1 500.12`, white fill + gradient overlay

The solid paths are offset by 0.71px (half the outline stroke-width) because
Illustrator exported the outline with paths centered on the stroke, adding
0.71px to each edge. The `LogoSolid` component wraps its paths in
`<g transform="translate(0.71, 0.71)">` so both layers align pixel-perfectly.

---

## File Structure

```
exicon-v2/
├── public/
│   ├── fonts/                    # Self-hosted WOFF2 (required)
│   ├── icons/
│   │   ├── icon-paw.svg          # Gold decorative icons
│   │   ├── icon-lightbulb.svg
│   │   ├── icon-infinity.svg
│   │   ├── icon-atom.svg
│   │   ├── icon-molecule.svg
│   │   ├── icon-caterpillar.svg
│   │   ├── icon-beetle.svg
│   │   ├── icon-diamond.svg
│   │   └── icon-search.svg
│   ├── logo-outline.svg          # Reference (paths are in LogoOutline.tsx)
│   └── logo-solid.svg            # Reference (paths are in LogoSolid.tsx)
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout, fonts, metadata
│   │   └── page.tsx              # Composes scenes
│   ├── components/
│   │   ├── scenes/
│   │   │   ├── IntroScene.tsx    # Master timeline orchestrator
│   │   │   ├── Particles.tsx     # Canvas particle field
│   │   │   ├── LogoOutline.tsx   # Stroke-draw SVG (GSAP targets: data-ring)
│   │   │   └── LogoSolid.tsx     # Fill SVG (GSAP fades in)
│   │   └── ui/
│   │       └── ScrollProgress.tsx
│   ├── hooks/
│   │   └── useIsomorphicLayoutEffect.ts
│   ├── lib/
│   │   ├── gsap.ts              # Single GSAP registration
│   │   └── particleData.ts      # Dot positions from Asset_1
│   └── styles/
│       └── globals.css           # Fonts, variables, responsive, reset
├── package.json
├── tsconfig.json
└── next.config.js
```

---

## Cross-Platform Consistency

| What | Mac vs Windows | Fix Applied |
|------|----------------|-------------|
| Animation timing | Identical | GSAP = pure JS math, no CSS interpolation |
| SVG stroke drawing | Identical | `getTotalLength()` + `strokeDashoffset` |
| Gradient overlay | Identical | `mix-blend-mode: multiply` in solid SVG only (not animated by GSAP) |
| Particle rendering | Identical | Canvas 2D, not SVG DOM — no blend-mode Safari bug |
| Icon colors | Identical | Inline styles in SVG files, no CSS class collisions |
| Logo alignment | Identical | Both SVGs share viewBox, solid has 0.71px translate |
| Scrollbar shift | Fixed | `scrollbar-gutter: stable` on `:root` |
| Font rendering | Slight diff | macOS smoothing vs ClearType — cosmetic, unfixable |

---

## Responsive Behavior

| Breakpoint | Logo Width | Particles | Icons |
|------------|-----------|-----------|-------|
| >1024px (desktop) | 46vw (max 720px) | All ~125 | Visible |
| 768–1024px (tablet) | 55vw (max 480px) | 70 | Visible |
| <768px (mobile) | 72vw (max 340px) | 40 | Hidden |

---

## Fonts

Self-host in `/public/fonts/`. Bahnschrift does not exist on macOS/Linux/iOS.

| File | Weight |
|------|--------|
| `heavitas.woff2` | 700 (display) |
| `bahnschrift-light.woff2` | 300 |
| `bahnschrift-regular.woff2` | 400 |
| `bahnschrift-semibold.woff2` | 600 |

---

## Adding Future Scenes

Create a self-contained component per scene:

```tsx
"use client";
import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

export default function SceneN() {
  const ref = useRef<HTMLElement>(null);
  useIsomorphicLayoutEffect(() => {
    const tl = gsap.timeline();
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: "top 80%",
      onEnter: () => tl.play(),
    });
    // ... animations ...
    return () => { st.kill(); tl.kill(); };
  }, []);
  return <section ref={ref}>...</section>;
}
```

Add to `page.tsx` in scroll order below `<IntroScene />`.
