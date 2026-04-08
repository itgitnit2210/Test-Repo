"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/* ── Types ── */
export interface CollageItem {
  id: number;
  src: string;
  alt: string;
  popup: {
    client: string;
    brand: string;
    concept: string;
    description: string;
  };
}

/* ── Data (12 items total) ── */
export const COLLAGE_ITEMS: CollageItem[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  src: `/images/c${(i % 9) + 1}.jpg`,
  alt: [
    "Healthcare campaign", "Brand identity", "Award recognition",
    "Patient education", "Event photography", "Green background",
    "Conference stage", "Main feature", "Brain visual",
    "Welcome screen", "Red cross", "73% stat",
  ][i] || `Image ${i + 1}`,
  popup: {
    client: [
      "Dr. Reddy's", "Sun Pharma", "Cipla Ltd", "Abbott India",
      "Lupin", "Glenmark", "Biocon", "Zydus Lifesciences",
      "Torrent Pharma", "Alkem Labs", "Mankind Pharma", "Ipca Labs",
    ][i],
    brand: [
      "Nise SP", "Volini Gel", "Cipladine", "Duphalac",
      "Sumo Cold", "Candid-B", "BioMAb", "Lipaglyn",
      "Chymoral Forte", "Clavam 625", "Manforce Plus", "Zerodol SP",
    ][i],
    concept: [
      "Meet Super Serratio", "Pain-free Living", "Antiseptic Guard", "Gut Health First",
      "Cold Combat", "Skin Shield", "Targeted Therapy", "Lipid Control",
      "Inflammation Fighter", "Antibiotic Power", "Wellness Plus", "Joint Relief",
    ][i],
    description: [
      "The objective was to take share from conventional pain/inflammation relief formulations. Drawing from gaming culture, we created the unstoppable force of SuperSerratio.",
      "A campaign highlighting the instant relief mechanism using dynamic motion graphics and athlete testimonials across digital and print channels.",
      "Comprehensive antiseptic awareness campaign for hospitals and clinics, reaching 500+ healthcare facilities with educational materials.",
      "Patient education initiative promoting gut health awareness through interactive workshops and digital content across India.",
      "Multi-platform cold and flu relief campaign combining traditional media with influencer partnerships, achieving 3x brand recall.",
      "Dermatology-focused campaign using before/after storytelling supported by dermatologist endorsements and clinical data visualization.",
      "Breakthrough targeted therapy campaign for oncology, using 3D medical animations to explain the mechanism of action.",
      "First-in-class lipid management drug launch with a comprehensive doctor education program across 15 Indian states.",
      "Anti-inflammatory brand relaunch with modernized packaging, updated visual identity, and a digital-first awareness campaign.",
      "Antibiotic stewardship campaign promoting responsible use, featuring interactive decision-support tools for physicians.",
      "Wellness supplement launch combining fitness influencer partnerships with pharmacy activation programs.",
      "Joint care campaign using patient journey storytelling and orthopedic surgeon partnerships to drive prescription conversion.",
    ][i],
  },
}));

/* ── Responsive grid config ── */
interface GridConfig {
  cols: number;
  rows: number;
  total: number;
  swapCount: number;
}

function getGridConfig(): GridConfig {
  if (typeof window === "undefined") return { cols: 4, rows: 3, total: 12, swapCount: 4 };
  const w = window.innerWidth;
  // ≤480px: 3×3 (9 items, 2 swaps)  |  >480px: 4×3 (12 items, 4 swaps)
  if (w <= 480) return { cols: 3, rows: 3, total: 9, swapCount: 2 };
  return { cols: 4, rows: 3, total: 12, swapCount: 4 };
}

const GAP = 0.5; // % gap between tiles

/* ── Wobble keyframes (injected once into <head>) ── */
const WOBBLE_KEYFRAMES = `
@keyframes collage-wb0{0%,100%{transform:translate(0,0) rotate(0deg)}33%{transform:translate(3px,-2px) rotate(0.4deg)}66%{transform:translate(-2px,3px) rotate(-0.3deg)}}
@keyframes collage-wb1{0%,100%{transform:translate(0,0) rotate(0deg)}33%{transform:translate(-3px,2px) rotate(-0.5deg)}66%{transform:translate(2px,-3px) rotate(0.3deg)}}
@keyframes collage-wb2{0%,100%{transform:translate(0,0) rotate(0deg)}33%{transform:translate(2px,3px) rotate(0.3deg)}66%{transform:translate(-3px,-2px) rotate(-0.4deg)}}
@keyframes collage-wb3{0%,100%{transform:translate(0,0) rotate(0deg)}33%{transform:translate(-2px,-3px) rotate(-0.3deg)}66%{transform:translate(3px,2px) rotate(0.5deg)}}
@keyframes collage-wb4{0%,100%{transform:translate(0,0) rotate(0deg)}33%{transform:translate(3px,2px) rotate(-0.4deg)}66%{transform:translate(-2px,-3px) rotate(0.3deg)}}
@keyframes collage-wb5{0%,100%{transform:translate(0,0) rotate(0deg)}33%{transform:translate(-3px,-2px) rotate(0.5deg)}66%{transform:translate(2px,3px) rotate(-0.3deg)}}
`;

const WOBBLE_DURATIONS = [3.8, 4.2, 3.5, 4.6, 3.3, 4.0];

/* ── Helpers ── */
function getNeighbors(slot: number, cols: number, rows: number): number[] {
  const col = slot % cols;
  const row = Math.floor(slot / cols);
  const n: number[] = [];
  if (col > 0) n.push(slot - 1);
  if (col < cols - 1) n.push(slot + 1);
  if (row > 0) n.push(slot - cols);
  if (row < rows - 1) n.push(slot + cols);
  return n;
}

function slotPos(slot: number, cols: number) {
  const cellW = 100 / cols;
  const cellH = 100 / 3; // rows always 3
  return {
    left: (slot % cols) * cellW,
    top: Math.floor(slot / cols) * cellH,
  };
}

/* ══════════════════════════════════════════════
   Popup — circular gold card
   Side-by-side ≥480px, stacked <480px
   ══════════════════════════════════════════════ */
function CollagePopup({ item, onClose }: { item: CollageItem | null; onClose: () => void }) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile for stacked layout
  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () => setIsMobile(window.innerWidth <= 480);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!item || !backdropRef.current || !cardRef.current || !contentRef.current) return;
    gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
    gsap.fromTo(cardRef.current,
      { scale: 0.3, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.4)", delay: 0.05 }
    );
    gsap.fromTo(contentRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: "power2.out", delay: 0.2 }
    );
  }, [item]);

  const handleClose = useCallback(() => {
    if (!backdropRef.current || !cardRef.current) { onClose(); return; }
    gsap.to(cardRef.current, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.in" });
    gsap.to(backdropRef.current, {
      opacity: 0, duration: 0.3, ease: "power2.in", delay: 0.05, onComplete: onClose,
    });
  }, [onClose]);

  useEffect(() => {
    if (!item) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [item, handleClose]);

  if (!item) return null;

  return (
    <div
      ref={backdropRef}
      onClick={handleClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        cursor: "pointer",
        padding: "16px",
      }}
    >
      <div
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          /* Flattened min() — clamp is universally supported */
          width: "clamp(260px, 85vmin, 700px)",
          height: "clamp(260px, 85vmin, 700px)",
          borderRadius: "50%",
          background: "#c3884f",
          overflow: "hidden",
          cursor: "default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 20px 80px rgba(0,0,0,0.5)",
          /* GPU compositing — consistent Mac + Windows + iOS + Android */
          transform: "translateZ(0)",
          WebkitTransform: "translateZ(0)",
          willChange: "transform, opacity",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        } as React.CSSProperties}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="Close popup"
          style={{
            position: "absolute", top: "18%", right: "18%", zIndex: 10,
            width: "clamp(28px, 5vw, 36px)", height: "clamp(28px, 5vw, 36px)",
            borderRadius: "50%", border: "none",
            background: "rgba(0,0,0,0.5)", color: "#fff", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.2s, transform 0.2s",
            WebkitTapHighlightColor: "transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(0,0,0,0.8)";
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(0,0,0,0.5)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        {/* Content — responsive: side-by-side ≥480, stacked <480 */}
        <div
          ref={contentRef}
          style={{
            width: isMobile ? "75%" : "72%",
            height: isMobile ? "65%" : "58%",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            gap: isMobile ? "8%" : "5%",
          }}
        >
          {/* Image */}
          <div
            style={{
              flex: isMobile ? "0 0 45%" : "0 0 46%",
              width: isMobile ? "100%" : "auto",
              height: isMobile ? "auto" : "100%",
              aspectRatio: isMobile ? "16 / 10" : "auto",
              borderRadius: "clamp(3px, 0.8vw, 6px)",
              overflow: "hidden",
              background: "#2a1f14",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.src}
              alt={item.alt}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              draggable={false}
            />
          </div>

          {/* Text */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "clamp(3px, 1vw, 10px)",
              overflow: "hidden",
              fontFamily: "var(--font-body, 'Bahnschrift'), 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
              /* Cross-platform text rendering */
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
              textRendering: "geometricPrecision",
            } as React.CSSProperties}
          >
            <div>
              <p style={{ margin: 0, fontSize: "clamp(9px, 1.6vw, 13px)", color: "rgba(0,0,0,0.5)", fontWeight: 400 }}>
                <strong style={{ color: "#000", fontWeight: 600 }}>Client:</strong> {item.popup.client}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: "clamp(9px, 1.6vw, 13px)", color: "rgba(0,0,0,0.5)", fontWeight: 400 }}>
                <strong style={{ color: "#000", fontWeight: 600 }}>Brand:</strong> {item.popup.brand}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: "clamp(9px, 1.6vw, 13px)", color: "rgba(0,0,0,0.5)", fontWeight: 400 }}>
                <strong style={{ color: "#000", fontWeight: 600 }}>Concept:</strong> {item.popup.concept}
              </p>
            </div>
            <div style={{ width: "clamp(20px, 4vw, 40px)", height: 1.5, background: "rgba(0,0,0,0.15)" }} />
            <p
              style={{
                margin: 0,
                fontSize: "clamp(8px, 1.3vw, 12px)",
                lineHeight: 1.55,
                color: "rgba(0,0,0,0.55)",
                fontWeight: 400,
                maxHeight: isMobile ? "clamp(40px, 12vw, 80px)" : "clamp(60px, 15vw, 120px)",
                overflow: "hidden",
              }}
            >
              {item.popup.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   Main collage — responsive grid + wobble + adjacent swaps
   ══════════════════════════════════════════════ */
interface ImageCollageProps {
  className?: string;
}

export default function ImageCollage({ className }: ImageCollageProps) {
  const [popupItem, setPopupItem] = useState<CollageItem | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tileAtSlotRef = useRef<number[]>([]);
  const busyRef = useRef<Set<number>>(new Set());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gridRef = useRef<GridConfig>(
    typeof window !== "undefined" ? getGridConfig() : { cols: 4, rows: 3, total: 12, swapCount: 4 }
  );

  // Track grid config — rebuild on resize across breakpoints
  const [grid, setGrid] = useState<GridConfig>(() =>
    typeof window !== "undefined" ? getGridConfig() : { cols: 4, rows: 3, total: 12, swapCount: 4 }
  );

  useEffect(() => {
    const update = () => {
      const next = getGridConfig();
      setGrid((prev) => {
        if (prev.cols === next.cols) return prev;
        return next;
      });
      gridRef.current = next;
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Inject wobble keyframes once (safe for HMR / StrictMode)
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById("collage-wobble-styles")) return;
    const style = document.createElement("style");
    style.id = "collage-wobble-styles";
    style.textContent = WOBBLE_KEYFRAMES;
    document.head.appendChild(style);
    return () => { style.remove(); };
  }, []);

  // Initialize / reinitialize slot mapping when grid config changes
  useEffect(() => {
    tileAtSlotRef.current = Array.from({ length: grid.total }, (_, i) => i);
    busyRef.current.clear();
    // Reset tile positions to their grid slots
    const cellW = 100 / grid.cols;
    const cellH = 100 / grid.rows;
    tileRefs.current.forEach((el, i) => {
      if (!el || i >= grid.total) return;
      const col = i % grid.cols;
      const row = Math.floor(i / grid.cols);
      el.style.left = `${col * cellW}%`;
      el.style.top = `${row * cellH}%`;
      el.style.width = `${cellW - GAP}%`;
      el.style.height = `${cellH - GAP}%`;
    });
  }, [grid]);

  // Adjacent swap interval — scales swap count by screen size
  useEffect(() => {
    const reduced = typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const doSwap = (sA: number, sB: number) => {
      const tileArr = tileRefs.current;
      const slotMap = tileAtSlotRef.current;
      const busy = busyRef.current;
      const g = gridRef.current;

      const tA = slotMap[sA];
      const tB = slotMap[sB];
      if (tA == null || tB == null) return;
      const elA = tileArr[tA];
      const elB = tileArr[tB];
      if (!elA || !elB) return;

      const pA = slotPos(sA, g.cols);
      const pB = slotPos(sB, g.cols);

      busy.add(sA);
      busy.add(sB);

      elA.style.zIndex = "3";
      elB.style.zIndex = "3";
      elA.style.left = `${pB.left}%`;
      elA.style.top = `${pB.top}%`;
      elB.style.left = `${pA.left}%`;
      elB.style.top = `${pA.top}%`;

      slotMap[sA] = tB;
      slotMap[sB] = tA;

      setTimeout(() => {
        elA.style.zIndex = "1";
        elB.style.zIndex = "1";
        busy.delete(sA);
        busy.delete(sB);
      }, 1100);
    };

    const runSwaps = () => {
      if (popupItem) return;

      const busy = busyRef.current;
      const g = gridRef.current;
      let swapped = 0;
      let attempts = 0;

      while (swapped < g.swapCount && attempts < 40) {
        attempts++;
        const sA = Math.floor(Math.random() * g.total);
        if (busy.has(sA)) continue;
        const nbrs = getNeighbors(sA, g.cols, g.rows).filter((s) => !busy.has(s));
        if (nbrs.length === 0) continue;
        const sB = nbrs[Math.floor(Math.random() * nbrs.length)];
        doSwap(sA, sB);
        swapped++;
      }
    };

    intervalRef.current = setInterval(runSwaps, 2000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [popupItem, grid]);

  const visibleItems = COLLAGE_ITEMS.slice(0, grid.total);
  const cellW = 100 / grid.cols;
  const cellH = 100 / grid.rows;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        overflow: "hidden",
        background: "#111",
        /* GPU compositing — all platforms */
        transform: "translateZ(0)",
        WebkitTransform: "translateZ(0)",
        willChange: "transform, opacity",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      } as React.CSSProperties}
    >
      {visibleItems.map((item, i) => {
        const col = i % grid.cols;
        const row = Math.floor(i / grid.cols);
        const wobbleIdx = i % WOBBLE_DURATIONS.length;

        return (
          <div
            key={item.id}
            ref={(el) => { tileRefs.current[i] = el; }}
            data-collage-item
            onClick={() => setPopupItem(item)}
            style={{
              position: "absolute",
              left: `${col * cellW}%`,
              top: `${row * cellH}%`,
              width: `${cellW - GAP}%`,
              height: `${cellH - GAP}%`,
              cursor: "pointer",
              zIndex: 1,
              transition: "left 1s cubic-bezier(0.25,0.46,0.45,0.94), top 1s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.3s",
              opacity: 0, /* GSAP stagger-in from IntroScene */
            }}
          >
            {/* Inner: wobble via CSS keyframes — separate layer from swap transitions */}
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 3,
                overflow: "hidden",
                animation: `collage-wb${wobbleIdx} ${WOBBLE_DURATIONS[wobbleIdx]}s ease-in-out infinite`,
                animationDelay: `${-i * 0.6}s`,
                /* GPU layer for wobble — prevents jank on Windows Chrome */
                willChange: "transform",
                transform: "translateZ(0)",
                WebkitTransform: "translateZ(0)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              } as React.CSSProperties}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.alt}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  pointerEvents: "none",
                  /* Prevent drag ghost on all platforms */
                  WebkitUserDrag: "none",
                  userSelect: "none",
                  WebkitUserSelect: "none",
                } as React.CSSProperties}
                draggable={false}
                loading="lazy"
              />
            </div>
          </div>
        );
      })}

      <CollagePopup item={popupItem} onClose={() => setPopupItem(null)} />
    </div>
  );
}
