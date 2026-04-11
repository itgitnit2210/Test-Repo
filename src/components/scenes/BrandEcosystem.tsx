"use client";

import { forwardRef } from "react";
import LogoSolid from "./LogoSolid";

/**
 * BrandEcosystem — Scene 10
 *
 * Concentric orbit rings with the Exicon logo at center
 * and 4 sub-brand logos positioned on the 4th ring.
 *
 * GSAP drives all animation from IntroScene's scroll timeline.
 * This component just renders the static structure.
 *
 * Brand logos referenced (already in /public):
 *   /consulting.svg
 *   /media-solutions.svg
 *   /contimedia.svg
 *   /printle.svg
 *   /tagline.svg
 */

const BRANDS = [
  { name: "consulting",      src: "/consulting.svg",      color: "#a7a9ac", angle: -40  },
  { name: "media-solutions", src: "/media-solutions.svg", color: "#f58220", angle: 30   },
  { name: "contimeda",       src: "/contimedia.svg",      color: "#f69220", angle: 155  },
  { name: "printle",         src: "/printle.svg",         color: "#5e61a7", angle: 210  },
];

const RINGS = [140, 190, 260, 340, 440];
const CX = 480;
const CY = 310;
const BRAND_RING = RINGS[3]; // 4th ring — radius 340

function polar(angleDeg: number, r: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

const BrandEcosystem = forwardRef<HTMLDivElement, { className?: string }>(
  ({ className }, ref) => (
    <div ref={ref} className={`brand-eco ${className ?? ""}`}>
      {/* ── SVG: rings + dots + connector lines ── */}
      <svg
        className="brand-eco__svg"
        viewBox="0 0 960 620"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {/* Concentric rings */}
        {RINGS.map((r, i) => {
          const isDashed = i === 1;
          const isOuterGlow = i === RINGS.length - 1;
          return (
            <circle
              key={`ring-${i}`}
              data-eco-ring
              cx={CX}
              cy={CY}
              r={r}
              fill="none"
              stroke="#404041"
              strokeWidth={i === 0 || i === 3 ? 1.6 : isOuterGlow ? 0.6 : 1.2}
              strokeDasharray={isDashed ? "4 8" : undefined}
              opacity={isOuterGlow ? 0.25 : isDashed ? 0.5 : 0.6}
            />
          );
        })}

        {/* Brand dots + connector lines on the 4th ring */}
        {BRANDS.map((b) => {
          const p = polar(b.angle, BRAND_RING);
          return (
            <g key={b.name} data-eco-brand>
              {/* Thin connector line from center */}
              <line
                x1={CX} y1={CY} x2={p.x} y2={p.y}
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

        {/* Center logo — same SVG coordinate space */}
        <g data-eco-logo>
          <g transform={`translate(${CX}, ${CY - 10}) scale(0.12)`}>
            <g transform="translate(-441.26, -250.77)">
              <path
                d="M631.04,0c-137.88,0-250.06,112.18-250.06,250.06,0,36.17-14.6,68.92-38.3,92.62-23.7,23.7-56.45,38.36-92.62,38.36-72.34,0-130.98-58.64-130.98-130.98s58.64-130.98,130.98-130.98c29.01,0,55.8,9.45,77.51,25.41l71.99-94.76C357.83,18.51,306.06,0,250.06,0,112.18,0,0,112.18,0,250.06s112.18,250.06,250.06,250.06c68.94,0,131.46-28.04,176.74-73.32,4.79-4.79,9.37-9.78,13.75-14.94,45.9,53.96,114.26,88.26,190.49,88.26,137.88,0,250.06-112.18,250.06-250.06S768.93,0,631.04,0ZM631.04,381.04c-72.34,0-130.98-58.64-130.98-130.98s58.64-130.98,130.98-130.98,130.98,58.64,130.98,130.98-58.64,130.98-130.98,130.98Z"
                fill="#fff"
              />
            </g>
          </g>
          {/* Tagline */}
          <text
            x={CX} y={CY + 30}
            textAnchor="middle"
            fill="#c3884f"
            fontSize="9"
            fontFamily="var(--font-body)"
            fontWeight="300"
            letterSpacing="3"
          >
            POWERED BY POSSIBILITIES
          </text>
        </g>
      </svg>

      {/* ── Brand logo images — positioned via CSS matching SVG coordinates ── */}
      {BRANDS.map((b) => {
        const p = polar(b.angle, BRAND_RING);
        // Convert SVG coords to % of viewBox
        const leftPct = (p.x / 960) * 100;
        const topPct  = (p.y / 620) * 100;
        // Place label outside the dot based on angle quadrant
        const isRight = b.angle > -90 && b.angle < 90;
        const isTop   = b.angle < 0 || b.angle > 180;

        return (
          <div
            key={b.name}
            data-eco-label
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

      {/* Bottom service tagline */}
      <div className="brand-eco__services" data-eco-services>
        Healthcare Consulting &bull; Media Solutions &bull; Events &bull; Exhibitions &bull; Conferences
      </div>
    </div>
  )
);

BrandEcosystem.displayName = "BrandEcosystem";
export default BrandEcosystem;
