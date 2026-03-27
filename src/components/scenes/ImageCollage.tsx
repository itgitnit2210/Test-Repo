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

/* ── Data (36 items, cycling c1–c9.jpg) ── */
export const COLLAGE_ITEMS: CollageItem[] = Array.from({ length: 28 }, (_, i) => ({
  id: i + 1,
  src: `/images/c${(i % 9) + 1}.jpg`,
  alt: [
    "Healthcare campaign", "Brand identity", "Award recognition",
    "Patient education", "Event photography", "Green background",
    "Conference stage", "Main feature", "Brain visual",
    "Welcome screen", "Red cross", "73% stat",
    "LentiFlor", "Business meeting", "Sacumada",
    "Obesity campaign", "Small landscape", "Guitar player",
    "Neon portrait", "Product shot", "Viderance",
    "Small card", "Rifagut", "Square small",
    "Car campaign", "Landscape wide", "Anatomy diagram",
    "Medical doc", "Small square", "Untie campaign",
    "Small square", "Summit group", "Bottom landscape",
    "Bottom small", "Bottom wide", "Bottom landscape",
  ][i] || `Image ${i + 1}`,
  popup: {
    client: [
      "Dr. Reddy's", "Sun Pharma", "Cipla Ltd", "Abbott India",
      "Lupin", "Glenmark", "Biocon", "Zydus Lifesciences",
      "Torrent Pharma", "Alkem Labs", "Mankind Pharma", "Ipca Labs",
      "Ajanta Pharma", "Natco Pharma", "Laurus Labs", "Divi's Labs",
      "Aurobindo Pharma", "Cadila Healthcare", "Wockhardt", "Strides Pharma",
      "Eris Lifesciences", "JB Chemicals", "Suven Pharma", "Granules India",
      "Aarti Drugs", "Solara Active", "Shilpa Medicare", "Neuland Labs",
      "Syngene Intl", "Piramal Pharma", "Gland Pharma", "Alembic Pharma",
      "Dr. Reddy's", "Sun Pharma", "Cipla Ltd", "Abbott India",
    ][i],
    brand: [
      "Nise SP", "Volini Gel", "Cipladine", "Duphalac",
      "Sumo Cold", "Candid-B", "BioMAb", "Lipaglyn",
      "Chymoral Forte", "Clavam 625", "Manforce Plus", "Zerodol SP",
      "Azifast", "Velpatasvir", "Laurus Tabs", "Custom API",
      "Aurogra", "Reditux", "Proxyvon", "Strides OTC",
      "Glimisave", "Rantac", "Suvenca", "Granisetron",
      "Aarti Capsule", "Ranitidine", "Shilpa Oncology", "Levetiracetam",
      "Syngene Bio", "Piramal ICU", "Enoxaparin", "Azithral",
      "Omez DSR", "Pantodac", "Ciplox TZ", "Cremaffin",
    ][i],
    concept: [
      "Meet Super Serratio", "Pain-free Living", "Antiseptic Guard", "Gut Health First",
      "Cold Combat", "Skin Shield", "Targeted Therapy", "Lipid Control",
      "Inflammation Fighter", "Antibiotic Power", "Wellness Plus", "Joint Relief",
      "Fast Action", "Hepatitis Cure", "Tablet Innovation", "API Excellence",
      "Performance Boost", "Biosimilar Story", "Pain Management", "OTC Revolution",
      "Diabetes Care", "Acidity Relief", "Neural Support", "Nausea Control",
      "Capsule Design", "Stomach Care", "Oncology Hope", "Seizure Control",
      "Bio Research", "Critical Care", "Blood Thinner", "Infection Fighter",
      "Digestive Health", "Acid Control", "Dual Action", "Smooth Flow",
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
      "Rapid-action antibiotic campaign with speed-of-relief messaging, supported by pharmacokinetic data visualization.",
      "Hepatitis C cure campaign bringing hope through patient success stories, supported by government health programs.",
      "Innovative tablet-in-tablet technology story brought to life through 3D animations showing formulation protection.",
      "API manufacturing excellence showcase highlighting quality standards and global export capabilities.",
      "Performance enhancement campaign targeting men's health with sensitivity and medical credibility.",
      "Biosimilar launch campaign educating oncologists on bioequivalence data with KOL advocacy.",
      "Comprehensive pain management portfolio campaign with unified brand architecture across multiple products.",
      "OTC brand revolution campaign making prescription-quality products accessible over the counter.",
      "Diabetes management campaign combining glucose monitoring education with medication adherence programs.",
      "Acidity relief campaign using humor and relatable scenarios, achieving viral social media engagement.",
      "Neurological support campaign for epilepsy awareness, breaking stigma through patient advocacy stories.",
      "Post-chemotherapy nausea management campaign supporting patients with practical guidance and comfort tips.",
      "Capsule redesign project improving patient compliance through easier-to-swallow formulation.",
      "Stomach care campaign promoting proactive digestive health through seasonal awareness drives.",
      "Oncology hope campaign featuring survivor stories designed to support patients through their treatment journey.",
      "Seizure control campaign combining patient monitoring tools with caregiver education programs.",
      "Bio research capabilities showcase for international partners, highlighting state-of-the-art facilities.",
      "Critical care product campaign for ICU medications, targeting hospital formulary committees.",
      "Blood thinner campaign for surgical and cardiac care settings, featuring dosing calculators.",
      "Infection fighter campaign for respiratory antibiotics, using seasonal flu surge data for timely awareness.",
      "Digestive health portfolio campaign bringing together multiple brands under a unified therapeutic approach.",
      "Acid control innovation campaign highlighting modified-release technology with clinical comparison data.",
      "Dual-action antibiotic campaign targeting complex infections, using real-world case studies.",
      "Smooth digestive flow campaign using gentle creative direction to destigmatize constipation conversations.",
    ][i],
  },
}));

/* ── Layout positions (% of circle container) ── */
const LAYOUTS = [
  // ── Row 1 (upper) — 6 items ──
  { left: 8,  top: 23, width: 8,  height: 11, rotate: 1 },
  { left: 17, top: 24, width: 11, height: 9,  rotate: -0.6 },
  { left: 29, top: 23, width: 13, height: 9,  rotate: 0.3 },
  { left: 43, top: 22, width: 17, height: 13, rotate: -0.3 },
  { left: 61, top: 23, width: 14, height: 10, rotate: 0.5 },
  { left: 76, top: 23, width: 13, height: 11, rotate: -0.8 },
  // ── Row 2 (center-top) — 9 items ──
  { left: 2,  top: 36, width: 7,  height: 15, rotate: 0.6 },
  { left: 10, top: 36, width: 8,  height: 8,  rotate: -0.3 },
  { left: 10, top: 45, width: 9,  height: 7,  rotate: 0.4 },
  { left: 20, top: 35, width: 13, height: 13, rotate: -0.2 },
  { left: 34, top: 35, width: 19, height: 15, rotate: 0.15 },
  { left: 54, top: 36, width: 15, height: 9,  rotate: -0.5 },
  { left: 70, top: 36, width: 10, height: 7,  rotate: 0.4 },
  { left: 81, top: 35, width: 9,  height: 11, rotate: -1.2 },
  { left: 91, top: 36, width: 8,  height: 14, rotate: 0.8 },
  // ── Row 3 (center-bottom) — 7 items ──
  { left: 7,  top: 54, width: 8,  height: 8,  rotate: -0.4 },
  { left: 16, top: 53, width: 13, height: 7,  rotate: 0.3 },
  { left: 30, top: 54, width: 10, height: 7,  rotate: -0.3 },
  { left: 41, top: 53, width: 13, height: 7,  rotate: 0.5 },
  { left: 55, top: 54, width: 7,  height: 7,  rotate: -0.6 },
  { left: 63, top: 53, width: 15, height: 8,  rotate: 0.3 },
  { left: 79, top: 54, width: 12, height: 7,  rotate: -0.7 },
  // ── Row 4 (lower) — 6 items ──
  { left: 12, top: 64, width: 11, height: 11, rotate: 0.5 },
  { left: 24, top: 64, width: 11, height: 8,  rotate: -0.4 },
  { left: 36, top: 63, width: 7,  height: 8,  rotate: 0.3 },
  { left: 44, top: 62, width: 15, height: 12, rotate: -0.2 },
  { left: 60, top: 64, width: 8,  height: 7,  rotate: 0.4 },
  { left: 69, top: 63, width: 14, height: 10, rotate: -0.6 },
];

/* ── Popup ── */
function CollagePopup({ item, onClose }: { item: CollageItem | null; onClose: () => void }) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!item || !backdropRef.current || !cardRef.current || !contentRef.current) return;
    gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
    gsap.fromTo(cardRef.current, { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.4)", delay: 0.05 });
    gsap.fromTo(contentRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power2.out", delay: 0.2 });
  }, [item]);

  const handleClose = useCallback(() => {
    if (!backdropRef.current || !cardRef.current) { onClose(); return; }
    gsap.to(cardRef.current, { scale: 0.3, opacity: 0, duration: 0.25, ease: "power2.in" });
    gsap.to(backdropRef.current, { opacity: 0, duration: 0.3, ease: "power2.in", delay: 0.05, onComplete: onClose });
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
        background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)", cursor: "pointer",
        padding: "16px",
      }}
    >
      <div
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "min(90vw, min(90vh, 700px))",
          height: "min(90vw, min(90vh, 700px))",
          borderRadius: "50%", background: "#c3884f", overflow: "hidden",
          cursor: "default", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 20px 80px rgba(0,0,0,0.5)",
          /* GPU layer for smooth animation on all platforms */
          WebkitTransform: "translateZ(0)",
          willChange: "transform, opacity",
        }}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          aria-label="Close popup"
          style={{
            position: "absolute", top: "15%", right: "15%", zIndex: 10,
            width: "clamp(28px, 5vw, 36px)", height: "clamp(28px, 5vw, 36px)",
            borderRadius: "50%", border: "none",
            background: "rgba(0,0,0,0.5)", color: "#fff", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.2s, transform 0.2s",
            WebkitTapHighlightColor: "transparent",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.8)"; e.currentTarget.style.transform = "scale(1.1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.5)"; e.currentTarget.style.transform = "scale(1)"; }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        {/* Content — responsive: side-by-side on desktop, stacked on mobile */}
        <div ref={contentRef} className="collage-popup-content" style={{
          width: "70%", height: "56%",
          display: "flex", gap: "5%", alignItems: "center",
          /* On very small circles (<400px), stack vertically */
        }}>
          {/* Image */}
          <div className="collage-popup-image" style={{
            flex: "0 0 48%", height: "100%",
            borderRadius: "clamp(3px, 0.8vw, 6px)", overflow: "hidden", background: "#2a1f14",
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.src} alt={item.alt}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              draggable={false}
            />
          </div>
          {/* Text */}
          <div className="collage-popup-text" style={{
            flex: 1, display: "flex", flexDirection: "column",
            gap: "clamp(4px, 1vw, 10px)", overflow: "hidden",
            fontFamily: "'Bahnschrift', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
          }}>
            <div>
              <p style={{ margin: 0, fontSize: "clamp(10px, 1.6vw, 13px)", color: "rgba(0,0,0,0.5)", fontWeight: 400 }}>
                <strong style={{ color: "#000", fontWeight: 600 }}>Client:</strong> {item.popup.client}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: "clamp(10px, 1.6vw, 13px)", color: "rgba(0,0,0,0.5)", fontWeight: 400 }}>
                <strong style={{ color: "#000", fontWeight: 600 }}>Brand:</strong> {item.popup.brand}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: "clamp(10px, 1.6vw, 13px)", color: "rgba(0,0,0,0.5)", fontWeight: 400 }}>
                <strong style={{ color: "#000", fontWeight: 600 }}>Concept:</strong> {item.popup.concept}
              </p>
            </div>
            <div style={{ width: "clamp(24px, 4vw, 40px)", height: 1.5, background: "rgba(0,0,0,0.15)" }} />
            <p style={{
              margin: 0, fontSize: "clamp(9px, 1.4vw, 12px)", lineHeight: 1.55,
              color: "rgba(0,0,0,0.55)", fontWeight: 400,
              maxHeight: "clamp(60px, 15vw, 120px)", overflow: "hidden",
              /* Consistent text rendering Mac/Windows */
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
            } as React.CSSProperties}>
              {item.popup.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main collage component ── */
interface ImageCollageProps {
  className?: string;
}

export default function ImageCollage({ className }: ImageCollageProps) {
  const [popupItem, setPopupItem] = useState<CollageItem | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Gentle float animation — each image drifts slightly, staggered
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = container.querySelectorAll("[data-collage-item]");
    const tweens: gsap.core.Tween[] = [];

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    items.forEach((el, i) => {
      const dir = i % 2 === 0 ? 1 : -1;
      const yDrift = 2 + Math.random() * 3;    // 2–5px
      const xDrift = 1 + Math.random() * 2;    // 1–3px
      const dur = 2.5 + Math.random() * 2;     // 2.5–4.5s
      const delay = Math.random() * 2;          // random start offset

      tweens.push(
        gsap.to(el, {
          y: `+=${dir * yDrift}`,
          x: `+=${dir * xDrift}`,
          duration: dur,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay,
        })
      );
    });

    return () => { tweens.forEach((t) => t.kill()); };
  }, []);

  return (
    <div ref={containerRef} className={className} style={{
      position: "relative", width: "100%", height: "100%",
      borderRadius: "50%", overflow: "hidden",
      /* GPU compositing for smooth scroll animation */
      WebkitTransform: "translateZ(0)",
      willChange: "transform, opacity",
    }}>
      {COLLAGE_ITEMS.map((item, i) => {
        const layout = LAYOUTS[i];
        if (!layout) return null;

        return (
          <div
            key={item.id}
            data-collage-item
            onClick={() => setPopupItem(item)}
            style={{
              position: "absolute",
              left: `${layout.left}%`,
              top: `${layout.top}%`,
              width: `${layout.width}%`,
              height: `${layout.height}%`,
              borderRadius: 2,
              overflow: "hidden",
              cursor: "pointer",
              transform: `rotate(${layout.rotate}deg)`,
              boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
              opacity: 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.src}
              alt={item.alt}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }}
              draggable={false}
              loading="lazy"
            />
          </div>
        );
      })}

      <CollagePopup item={popupItem} onClose={() => setPopupItem(null)} />
    </div>
  );
}
