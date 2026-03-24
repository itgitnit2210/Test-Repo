"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import Particles from "./Particles";
import LogoOutline from "./LogoOutline";
import LogoSolid from "./LogoSolid";
import NavOrbit from "./NavOrbit";

const ICONS = [
  { name: "icon-beetle",       x:  6.5, y: 28.0, w: 28, h: 34 },
  { name: "icon-molecule",     x: 24.0, y: 12.0, w: 32, h: 38 },
  { name: "icon-infinity",     x: 16.5, y: 52.0, w: 36, h: 38 },
  { name: "icon-diamond",      x:  8.0, y: 78.0, w: 32, h: 32 },
  { name: "icon-atom",         x: 20.0, y: 85.0, w: 34, h: 34 },
  { name: "icon-paw",          x: 72.0, y: 10.0, w: 44, h: 24 },
  { name: "icon-lightbulb",    x: 88.0, y: 18.0, w: 33, h: 33 },
  { name: "icon-caterpillar",  x: 80.0, y: 72.0, w: 30, h: 32 },
  { name: "icon-search",       x: 91.0, y: 55.0, w: 28, h: 28 },
];

function getResponsiveValues() {
  const w = window.innerWidth;
  if (w <= 480) return { shiftX: -0.18, scale: 0.55 };
  if (w <= 768) return { shiftX: -0.22, scale: 0.52 };
  if (w <= 1024) return { shiftX: -0.28, scale: 0.50 };
  return { shiftX: -0.32, scale: 0.48 };
}

/**
 * Wait for an element to appear in the DOM.
 * NavOrbit renders null initially, then mounts Desktop or Mobile.
 * We need to wait for [data-nav-trigger] to exist before animating it.
 */
function waitForElement(parent: HTMLElement, selector: string, timeout = 3000): Promise<HTMLElement | null> {
  return new Promise((resolve) => {
    const el = parent.querySelector(selector) as HTMLElement;
    if (el) { resolve(el); return; }

    const observer = new MutationObserver(() => {
      const found = parent.querySelector(selector) as HTMLElement;
      if (found) { observer.disconnect(); resolve(found); }
    });
    observer.observe(parent, { childList: true, subtree: true });

    setTimeout(() => { observer.disconnect(); resolve(null); }, timeout);
  });
}

export default function IntroScene() {
  const sectionRef    = useRef<HTMLElement>(null);
  const outlineRef    = useRef<SVGSVGElement>(null);
  const solidRef      = useRef<SVGSVGElement>(null);
  const logoWrapRef   = useRef<HTMLDivElement>(null);
  const iconsRef      = useRef<HTMLDivElement>(null);
  const wordmarkRef   = useRef<HTMLDivElement>(null);
  const leftRef       = useRef<HTMLImageElement>(null);
  const rightRef      = useRef<HTMLImageElement>(null);
  const taglineRef    = useRef<HTMLImageElement>(null);
  const logoTargetRef = useRef<HTMLDivElement>(null);
  const shiftGroupRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);

  useIsomorphicLayoutEffect(() => {
    window.scrollTo(0, 0);
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    const section    = sectionRef.current;
    const outline    = outlineRef.current;
    const solid      = solidRef.current;
    const logoWrap   = logoWrapRef.current;
    const iconsDiv   = iconsRef.current;
    const wordmark   = wordmarkRef.current;
    const left       = leftRef.current;
    const right      = rightRef.current;
    const tagline    = taglineRef.current;
    const logoTarget = logoTargetRef.current;
    const shiftGroup = shiftGroupRef.current;
    if (!section || !outline || !solid || !logoWrap || !iconsDiv ||
        !wordmark || !left || !right || !tagline || !logoTarget ||
        !shiftGroup) return;

    const particlesWrap = section.querySelector(".intro__particles") as HTMLElement;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    gsap.set(solid, { opacity: 0 });
    gsap.set(outline, { opacity: 1 });
    gsap.set(wordmark, { visibility: "hidden" });
    gsap.set(left, { x: -100, opacity: 0 });
    gsap.set(right, { x: 100, opacity: 0 });
    gsap.set(tagline, { y: 30, opacity: 0 });

    setLoading(false);

    // PART A — AUTOPLAY
    const autoTl = gsap.timeline({ defaults: { ease: "power2.out" }, delay: reduced ? 0 : 0.3 });
    const iconEls = iconsDiv.querySelectorAll(".intro__icon");
    const rings = outline.querySelectorAll("[data-ring]");

    if (reduced) {
      gsap.set(iconEls, { opacity: 1, scale: 1 });
      gsap.set(rings, { strokeDashoffset: 0, stroke: "#c3884f" });
      gsap.set(solid, { opacity: 1 });
      gsap.set(outline, { opacity: 0 });
      // Wait for trigger then show it
      waitForElement(section, "[data-nav-trigger]").then((btn) => {
        if (btn) gsap.set(btn, { scale: 1 });
      });
    } else {
      autoTl.to(iconEls, { opacity: 1, scale: 1, duration: 0.7, stagger: { each: 0.1, from: "random" }, ease: "back.out(1.4)" }, 0.4);
      rings.forEach((r) => { const p = r as SVGPathElement; gsap.set(p, { strokeDasharray: p.getTotalLength(), strokeDashoffset: p.getTotalLength() }); });
      autoTl.to(rings, { strokeDashoffset: 0, duration: 3, stagger: 0.25, ease: "power2.inOut" }, 1);
      autoTl.to(rings, { stroke: "#c3884f", strokeWidth: 2, duration: 1, stagger: 0.12, ease: "power1.inOut" }, 3.8);
      autoTl.to(solid, { opacity: 1, duration: 1.5, ease: "power2.in" }, 4.0);
      autoTl.to(outline, { opacity: 0, duration: 1.2, ease: "power2.inOut" }, 5.5);

      // Wait for nav trigger to appear in DOM, then animate it
      waitForElement(section, "[data-nav-trigger]").then((triggerBtn) => {
        if (triggerBtn) {
          gsap.fromTo(triggerBtn,
            { scale: 0 },
            { scale: 1, duration: 0.5, ease: "back.out(1.7)", delay: Math.max(0, 5.0 - autoTl.time()) }
          );
        }
      });

      iconEls.forEach((icon, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        gsap.to(icon, { y: `+=${dir * (6 + Math.random() * 10)}`, x: `+=${dir * (3 + Math.random() * 6)}`, duration: 2.5 + Math.random() * 1.5, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 5 + i * 0.2 });
      });
    }

    // PART B — SCROLL
    if (reduced) {
      gsap.set(wordmark, { visibility: "visible" });
      gsap.set(left, { x: 0, opacity: 1 });
      gsap.set(right, { x: 0, opacity: 1 });
      gsap.set(tagline, { y: 0, opacity: 1 });
      return;
    }

    const scrollTl = gsap.timeline();

    scrollTl.to(logoWrap, {
      width: () => logoTarget.offsetWidth, height: () => logoTarget.offsetHeight,
      x: () => { const f = logoWrap.getBoundingClientRect(); const t = logoTarget.getBoundingClientRect(); return t.left - f.left + (t.width - f.width) / 2; },
      y: () => { const f = logoWrap.getBoundingClientRect(); const t = logoTarget.getBoundingClientRect(); return t.top - f.top + (t.height - f.height) / 2; },
      duration: 0.20, ease: "power2.inOut",
    }, 0);
    scrollTl.to(outline, { opacity: 0, duration: 0.05 }, 0);
    scrollTl.set(wordmark, { visibility: "visible" }, 0.06);
    scrollTl.to(left, { x: 0, opacity: 1, duration: 0.14, ease: "power2.out" }, 0.06);
    scrollTl.to(right, { x: 0, opacity: 1, duration: 0.14, ease: "power2.out" }, 0.08);
    scrollTl.to(tagline, { y: 0, opacity: 1, duration: 0.10, ease: "power2.out" }, 0.18);

    if (particlesWrap) scrollTl.to(particlesWrap, { opacity: 0, duration: 0.10, ease: "power2.in" }, 0.40);
    scrollTl.to(iconEls, { opacity: 0, duration: 0.08, stagger: 0.005 }, 0.40);

    scrollTl.to(shiftGroup, {
      x: () => {
        const { shiftX } = getResponsiveValues();
        return window.innerWidth * shiftX;
      },
      scale: () => getResponsiveValues().scale,
      transformOrigin: "center center",
      duration: 0.20,
      ease: "power2.inOut",
    }, 0.45);

    scrollTl.set({}, {}, 1.0);

    const st = ScrollTrigger.create({
      trigger: section, start: "top top", end: "+=400%",
      pin: true, pinSpacing: true, anticipatePin: 1,
      scrub: 1, animation: scrollTl,
    });

    document.fonts.ready.then(() => requestAnimationFrame(() => ScrollTrigger.refresh(true)));
    return () => { autoTl.kill(); st.kill(); scrollTl.kill(); };
  }, []);

  return (
    <section ref={sectionRef} className={`intro ${loading ? "intro--loading" : ""}`} aria-label="Exicon introduction">
      <div className="intro__particles"><Particles className="intro__particles-canvas" /></div>
      <div ref={iconsRef} className="intro__icons">
        {ICONS.map((icon) => (
          <div key={icon.name} className="intro__icon" style={{ left: `${icon.x}%`, top: `${icon.y}%`, width: icon.w, height: icon.h }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/icons/${icon.name}.svg`} alt="" width={icon.w} height={icon.h} loading="eager" />
          </div>
        ))}
      </div>
      <div ref={shiftGroupRef} className="intro__shift-group">
        <div className="intro__logo">
          <div ref={logoWrapRef} className="intro__logo-wrap">
            <LogoSolid ref={solidRef} /><LogoOutline ref={outlineRef} />
          </div>
        </div>
        <div ref={wordmarkRef} className="wordmark" style={{ visibility: "hidden" }}>
          <div className="wordmark__row">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={leftRef} src="/wordmark-left.svg" alt="" className="wordmark__left" draggable={false} />
            <div ref={logoTargetRef} className="wordmark__logo-target" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={rightRef} src="/wordmark-right.svg" alt="" className="wordmark__right" draggable={false} />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={taglineRef} src="/tagline.svg" alt="Powered by Possibilities" className="wordmark__tagline" draggable={false} />
        </div>
      </div>
      <NavOrbit />
      <div className="sr-only">Exicon Group — Powered by Possibilities.</div>
    </section>
  );
}
