"use client";

import { useRef, useState, useCallback } from "react";
import { gsap } from "@/lib/gsap";
import "@/styles/nav-orbit-desktop.css";

const NAV_ITEMS = [
  { label: "About us",       cx: 236.7, cy: 211.9 },
  { label: "Verticals",      cx: 198.8, cy: 256.0 },
  { label: "Work",           cx: 180.8, cy: 305.5 },
  { label: "Contact us",     cx: 180.1, cy: 354.9 },
  { label: "Life at exicon", cx: 197.0, cy: 405.6 },
  { label: "Careers",        cx: 231.8, cy: 448.9 },
];

const BRANDS = [
  { name: "consulting",      src: "/consulting.svg",      dot: "#a7a9ac", cx: 79.9,  cy: 117.7 },
  { name: "media-solutions", src: "/media-solutions.svg", dot: "#f58220", cx: 27.0,  cy: 203.5 },
  { name: "contimedia",      src: "/contimedia.svg",      dot: "#f69220", cx: 3.7,   cy: 289.2 },
  { name: "printle",         src: "/printle.svg",         dot: "#5e61a7", cx: 3.6,   cy: 375.1 },
];

export default function NavOrbitDesktop() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);

  const closeBrands = useCallback(() => {
    if (!svgRef.current) return;
    const b = svgRef.current.querySelectorAll("[data-brand-item]");
    gsap.to(b, { opacity: 0, duration: 0.25, stagger: 0.03 });
    setBrandsOpen(false);
  }, []);

  const showBrands = useCallback(() => {
    if (!svgRef.current) return;
    const b = svgRef.current.querySelectorAll("[data-brand-item]");
    gsap.to(b, { opacity: 1, duration: 0.4, stagger: 0.08, ease: "back.out(1.4)" });
    setBrandsOpen(true);
  }, []);

  const toggleMenu = useCallback(() => {
    if (!svgRef.current) return;
    const rings = svgRef.current.querySelectorAll("[data-ring]");
    const items = svgRef.current.querySelectorAll("[data-nav-item]");

    if (!menuOpen) {
      gsap.to(rings, { opacity: 1, duration: 0.6, stagger: 0.03, ease: "power2.out" });
      gsap.to(items, { opacity: 1, duration: 0.4, stagger: 0.06, ease: "back.out(1.3)", delay: 0.15 });
      setMenuOpen(true);
    } else {
      gsap.to(items, { opacity: 0, duration: 0.25, stagger: 0.03 });
      gsap.to(rings, { opacity: 0, duration: 0.4, delay: 0.1 });
      closeBrands();
      setMenuOpen(false);
    }
  }, [menuOpen, closeBrands]);

  const handleNavClick = useCallback((label: string) => {
    if (label === "Verticals") brandsOpen ? closeBrands() : showBrands();
  }, [brandsOpen, showBrands, closeBrands]);

  return (
    <div className="nav-orbit-desktop">
      <svg
        ref={svgRef}
        className="nav-orbit-desktop__svg"
        viewBox="0 0 664.53 664.87"
        overflow="visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g data-ring opacity="0">
          <path d="M332.26,663.87c-88.53,0-171.76-34.47-234.35-97.07C-31.3,437.58-31.3,227.32,97.91,98.09,160.52,35.48,243.75,1,332.27,1s171.74,34.48,234.35,97.09c129.22,129.23,129.22,339.49,0,468.71-62.59,62.6-145.82,97.07-234.35,97.07Z" fill="none" stroke="#404041" strokeWidth="2" strokeMiterlimit="10" />
          <path d="M332.26,621.45c-77.2,0-149.78-30.06-204.36-84.64-112.68-112.68-112.68-296.03,0-408.71,54.6-54.6,127.17-84.67,204.36-84.67s149.76,30.07,204.36,84.67c112.68,112.69,112.68,296.03,0,408.71-54.58,54.58-127.15,84.64-204.36,84.64Z" fill="none" stroke="#404041" strokeWidth="1.5" strokeMiterlimit="10" opacity=".35" />
          <path d="M332.26,587.64c-68.17,0-132.26-26.54-180.45-74.74-99.5-99.5-99.5-261.4,0-360.9,48.21-48.21,112.3-74.76,180.45-74.76s132.24,26.55,180.45,74.76c99.5,99.5,99.5,261.41,0,360.9-48.19,48.2-112.28,74.74-180.45,74.74Z" fill="none" stroke="#404041" strokeWidth="1.5" strokeMiterlimit="10" opacity=".35" />
          <path d="M332.26,558.66c-60.43,0-117.24-23.53-159.96-66.25-88.2-88.2-88.2-231.72,0-319.93,42.74-42.74,99.54-66.27,159.96-66.27s117.23,23.54,159.96,66.27c88.2,88.21,88.2,231.72,0,319.93-42.72,42.72-99.53,66.25-159.96,66.25Z" fill="none" stroke="#404041" strokeWidth="1.5" strokeMiterlimit="10" opacity=".35" />
          <path d="M332.26,529.68c-52.7,0-102.23-20.51-139.47-57.76-76.9-76.9-76.9-202.04,0-278.95,37.26-37.26,86.79-57.78,139.47-57.78s102.21,20.52,139.47,57.78c76.9,76.91,76.9,202.04,0,278.95-37.24,37.25-86.78,57.76-139.47,57.76Z" fill="none" stroke="#404041" strokeWidth="1.5" strokeMiterlimit="10" opacity=".35" />
          <path d="M332.26,505.53c-46.25,0-89.71-18-122.4-50.69-67.49-67.49-67.49-177.3,0-244.8,32.7-32.7,76.17-50.71,122.4-50.71s89.7,18.01,122.4,50.71c67.49,67.49,67.49,177.31,0,244.8-32.68,32.68-76.15,50.69-122.4,50.69Z" fill="none" stroke="#404041" strokeWidth="1.5" strokeMiterlimit="10" opacity=".35" />
          <path d="M332.26,486.21c-41.09,0-79.7-15.99-108.74-45.03-59.96-59.96-59.96-157.52,0-217.48,29.05-29.05,67.67-45.05,108.74-45.05s79.69,16,108.74,45.05c59.96,59.96,59.96,157.52,0,217.48-29.03,29.04-67.65,45.03-108.74,45.03Z" fill="none" stroke="#404041" strokeWidth="2" strokeMiterlimit="10" />
          <path d="M332.26,466.89c-35.93,0-69.69-13.98-95.08-39.37-52.43-52.43-52.43-137.73,0-190.16,25.4-25.4,59.17-39.39,95.08-39.39s69.68,13.99,95.08,39.39c52.43,52.43,52.43,137.73,0,190.16-25.38,25.39-59.15,39.37-95.08,39.37Z" fill="none" stroke="#404041" strokeWidth="1.5" strokeMiterlimit="10" opacity=".35" />
          <path d="M332.26,447.57c-30.77,0-59.68-11.97-81.42-33.71-44.89-44.89-44.89-117.94,0-162.84,21.75-21.75,50.67-33.73,81.42-33.73s59.67,11.98,81.42,33.73c44.89,44.9,44.89,117.95,0,162.84-21.73,21.74-50.65,33.71-81.42,33.71Z" fill="none" stroke="#404041" strokeWidth="1.5" strokeMiterlimit="10" opacity=".35" />
          <path d="M332.26,428.26c-25.61,0-49.67-9.96-67.76-28.05-37.36-37.36-37.36-98.16,0-135.52,18.1-18.1,42.17-28.07,67.76-28.07s49.66,9.97,67.76,28.07c37.36,37.36,37.36,98.16,0,135.52-18.08,18.09-42.15,28.05-67.76,28.05Z" fill="none" stroke="#404041" strokeWidth="1.5" strokeMiterlimit="10" opacity=".35" />
          <path d="M332.26,413.77c-21.74,0-42.17-8.45-57.51-23.8-31.71-31.71-31.71-83.32,0-115.03,15.37-15.36,35.79-23.83,57.52-23.83s42.15,8.46,57.51,23.83c31.71,31.72,31.71,83.32,0,115.03-15.35,15.35-35.77,23.8-57.52,23.8Z" fill="none" stroke="#404041" strokeWidth="1.5" strokeMiterlimit="10" opacity=".35" />
          <path d="M332.26,404.11c-19.16,0-37.16-7.45-50.69-20.97-27.95-27.95-27.95-73.42,0-101.37,13.54-13.54,31.54-21,50.69-21s37.15,7.46,50.69,21c27.95,27.95,27.95,73.42,0,101.37-13.52,13.53-31.52,20.97-50.69,20.97Z" fill="none" stroke="#404041" strokeWidth="1.5" strokeMiterlimit="10" opacity=".35" />
          <path d="M332.26,394.45c-16.58,0-32.16-6.44-43.86-18.14-24.18-24.18-24.18-63.53,0-87.71,11.72-11.72,27.29-18.17,43.86-18.17s32.14,6.45,43.86,18.17c24.18,24.18,24.18,63.53,0,87.71-11.7,11.7-27.27,18.14-43.86,18.14Z" fill="none" stroke="#404041" strokeWidth="1.5" strokeMiterlimit="10" opacity=".35" />
          <path d="M332.26,384.79c-14,0-27.15-5.44-37.03-15.31-20.42-20.42-20.42-53.64,0-74.05,9.89-9.89,23.04-15.34,37.03-15.34s27.14,5.45,37.03,15.34c20.42,20.42,20.42,53.64,0,74.05-9.88,9.88-23.02,15.31-37.03,15.31Z" fill="none" stroke="#404041" strokeWidth="1.5" strokeMiterlimit="10" opacity=".35" />
          <path d="M332.26,379.96c-12.17,0-24.34-4.63-33.61-13.9-18.53-18.53-18.53-48.69,0-67.22,8.98-8.98,20.91-13.92,33.61-13.92s24.63,4.94,33.61,13.92c18.53,18.53,18.53,48.69,0,67.22-9.27,9.27-21.44,13.9-33.61,13.9Z" fill="none" stroke="#c3884f" strokeWidth="0.22" strokeMiterlimit="10" />
        </g>

        {NAV_ITEMS.map((item) => (
          <g key={item.label} data-nav-item opacity="0" style={{ cursor: "pointer" }}
            onClick={() => handleNavClick(item.label)}>
            <circle cx={item.cx} cy={item.cy} r="4.5" fill="#c3884f" />
            <text x={item.cx - 12} y={item.cy + 6} textAnchor="end" fill="#a7a9ac"
              fontFamily="Bahnschrift, Segoe UI, sans-serif" fontWeight="300" fontSize="22">
              {item.label}
            </text>
          </g>
        ))}

        {BRANDS.map((brand) => (
          <g key={brand.name} data-brand-item opacity="0">
            <circle cx={brand.cx} cy={brand.cy} r="6" fill={brand.dot} />
            <foreignObject x={brand.cx - 170} y={brand.cy - 22} width="160" height="44" overflow="visible">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", width: "100%", height: "100%" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={brand.src} alt={brand.name} style={{ height: "36px", width: "auto" }} draggable={false} />
              </div>
            </foreignObject>
          </g>
        ))}
      </svg>

      <button data-nav-trigger className="nav-orbit-desktop__trigger" onClick={toggleMenu}
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}>
        <svg className="nav-orbit-desktop__trigger-svg" viewBox="0 0 55.25 130.51" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M55.25,112.78c-12.17,0-24.34-4.63-33.61-13.9C3.11,80.34,3.11,50.19,21.64,31.65c8.98-8.98,20.91-13.92,33.61-13.92s24.63,4.94,33.61,13.92c18.53,18.53,18.53,48.69,0,67.22-9.27,9.27-21.44,13.9-33.61,13.9Z" fill="#c3884f"/>
        </svg>
        <span className="nav-orbit-desktop__trigger-text">MENU</span>
      </button>
    </div>
  );
}
