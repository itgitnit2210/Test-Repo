"use client";

import { forwardRef } from "react";

/**
 * BrandEcosystem — Scene 10 + Scene 11 (Consulting detail)
 *
 * Scene 10: Concentric circular orbits (ellipses with rx===ry),
 *           Exicon logo at center, 4 sub-brand logos on 4th ring.
 *
 * Scene 11: GSAP morphs circles → tilted ellipses shifted left,
 *           fades out 3 brands, shows Consulting detail on right.
 *
 * All animation driven by GSAP from IntroScene's scroll timeline.
 * This component renders the static structure only.
 *
 * Brand logos in /public:
 *   /consulting.svg, /media-solutions.svg, /contimedia.svg, /printle.svg
 *   /main_logo.svg (center wordmark)
 */

const BRANDS = [
  { name: "consulting",      src: "/consulting.svg",      color: "#a7a9ac", angle: -40  },
  { name: "media-solutions", src: "/media-solutions.svg", color: "#f58220", angle: 30   },
  { name: "contimeda",       src: "/contimedia.svg",      color: "#f69220", angle: 155  },
  { name: "printle",         src: "/printle.svg",         color: "#5e61a7", angle: 210  },
];

const CONSULTING_SERVICES = [
  "Brand Strategy",
  "Technology Solutions",
  "PR",
  "Media",
  "Activation",
];

export const RINGS = [140, 190, 260, 340, 440];
export const ECO_CX = 480;
export const ECO_CY = 310;
const BRAND_RING = RINGS[3]; // 4th ring — radius 340

function polar(angleDeg: number, r: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: ECO_CX + r * Math.cos(rad), y: ECO_CY + r * Math.sin(rad) };
}

const BrandEcosystem = forwardRef<HTMLDivElement, { className?: string }>(
  ({ className }, ref) => (
    <div ref={ref} className={`brand-eco ${className ?? ""}`}>
      {/* ── SVG: orbits + dots + connector lines ── */}
      <svg
        className="brand-eco__svg"
        viewBox="0 0 960 620"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {/* Orbit group — GSAP will tilt this and shift cx/cy */}
        <g data-eco-orbit-group>
          {/* Concentric ellipses — start as circles (rx === ry) */}
          {RINGS.map((r, i) => {
            const isDashed = i === 1;
            const isOuterGlow = i === RINGS.length - 1;
            return (
              <ellipse
                key={`ring-${i}`}
                data-eco-ring
                data-ring-r={r}
                cx={ECO_CX}
                cy={ECO_CY}
                rx={r}
                ry={r}
                fill="none"
                stroke="#404041"
                strokeWidth={i === 0 || i === 3 ? 1.6 : isOuterGlow ? 0.6 : 1.2}
                strokeDasharray={isDashed ? "4 8" : undefined}
                opacity={isOuterGlow ? 0.25 : isDashed ? 0.5 : 0.6}
              />
            );
          })}
        </g>

        {/* Brand dots + connector lines on the 4th ring */}
        {BRANDS.map((b) => {
          const p = polar(b.angle, BRAND_RING);
          return (
            <g key={b.name} data-eco-brand data-brand-name={b.name}>
              {/* Thin connector line from center */}
              <line
                data-eco-connector
                x1={ECO_CX} y1={ECO_CY} x2={p.x} y2={p.y}
                stroke={b.color} strokeWidth={0.5} opacity={0.2}
              />
              {/* Outer glow ring */}
              <circle cx={p.x} cy={p.y} r={14} fill="none"
                stroke={b.color} strokeWidth={0.8} opacity={0.3}
              />
              {/* Dot */}
              <circle cx={p.x} cy={p.y} r={6} fill={b.color} data-eco-dot />
            </g>
          );
        })}

        {/* Center logo — uses /main_logo.svg */}
        <g data-eco-logo>
          <image
            href="/main_logo.svg"
            x={ECO_CX - 120}
            y={ECO_CY - 45}
            width={240}
            height={92}
          />
        </g>
      </svg>

      {/* ── Brand logo images — positioned via CSS matching SVG coordinates ── */}
      {BRANDS.map((b) => {
        const p = polar(b.angle, BRAND_RING);
        const leftPct = (p.x / 960) * 100;
        const topPct  = (p.y / 620) * 100;
        const isRight = b.angle > -90 && b.angle < 90;
        const isTop   = b.angle < 0 || b.angle > 180;

        return (
          <div
            key={b.name}
            data-eco-label
            data-label-name={b.name}
            className="brand-eco__label"
            style={{
              left: `${leftPct}%`,
              top: `${topPct}%`,
              transform: `translate(${isRight ? "18px" : "calc(-100% - 18px)"}, ${isTop ? "-100%" : "8px"})`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={b.src}
              alt={b.name}
              className="brand-eco__logo-img"
              draggable={false}
            />
          </div>
        );
      })}

      {/* ── Scene 11: Consulting detail — right side ── */}
      <div className="brand-eco__consulting" data-eco-consulting>
        {/* Consulting logo */}
        <div className="brand-eco__consulting-logo" data-eco-consulting-logo>
          {/* Gray dot — sits on the orbit visually */}
          <div className="brand-eco__consulting-dot" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/consulting.svg"
            alt="Exicon Consulting"
            className="brand-eco__consulting-img"
            draggable={false}
          />
        </div>

        {/* Service list */}
        <div className="brand-eco__services-list">
          {CONSULTING_SERVICES.map((service, i) => (
            <div key={service} data-eco-service className="brand-eco__service-item">
              <span className="brand-eco__service-text">{service}</span>
              {i < CONSULTING_SERVICES.length - 1 && (
                <svg className="brand-eco__service-line" height="1" aria-hidden="true">
                  <line
                    x1="0" y1="0.5" x2="100%" y2="0.5"
                    stroke="#565656" strokeWidth="1.5"
                    strokeDasharray="3.5 3.5" strokeLinecap="round"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
);

BrandEcosystem.displayName = "BrandEcosystem";
export default BrandEcosystem;
