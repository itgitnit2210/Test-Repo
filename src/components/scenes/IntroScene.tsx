"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import Particles from "./Particles";
import LogoOutline from "./LogoOutline";
import LogoSolid from "./LogoSolid";
import NavOrbit from "./NavOrbit";
import ImageCollage from "./ImageCollage";


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
  const iDotRef       = useRef<HTMLDivElement>(null);
  const callIt1Ref    = useRef<HTMLDivElement>(null);
  const capRef        = useRef<HTMLDivElement>(null);
  const callIt2Ref    = useRef<HTMLDivElement>(null);
  const possRef       = useRef<HTMLDivElement>(null);
  const videoWrapRef  = useRef<HTMLDivElement>(null);
  const videoRef      = useRef<HTMLVideoElement>(null);
  const collageRef    = useRef<HTMLDivElement>(null);

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
    const iDot       = iDotRef.current;
    const callIt1    = callIt1Ref.current;
    const cap        = capRef.current;
    const callIt2    = callIt2Ref.current;
    const poss       = possRef.current;
    const videoWrap  = videoWrapRef.current;
    const video      = videoRef.current;
    const collage    = collageRef.current;
    if (!section || !outline || !solid || !logoWrap || !iconsDiv ||
        !wordmark || !left || !right || !tagline || !logoTarget ||
        !shiftGroup || !iDot || !callIt1 || !cap || !callIt2 || !poss ||
        !videoWrap || !video || !collage) return;

    const particlesWrap = section.querySelector(".intro__particles") as HTMLElement;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    gsap.set(solid, { opacity: 0 });
    gsap.set(outline, { opacity: 1 });
    gsap.set(wordmark, { visibility: "hidden" });
    gsap.set(left, { x: -100, opacity: 0 });
    gsap.set(right, { x: 100, opacity: 0 });
    gsap.set(tagline, { y: 30, opacity: 0 });
    gsap.set(iDot, { opacity: 0 });
    gsap.set([callIt1, cap, callIt2, poss], { opacity: 0 });
    gsap.set(videoWrap, { opacity: 0, scale: 0 });
    gsap.set(collage, { opacity: 0, scale: 0.5 });

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

    // ── Scenes 1–3: UNTOUCHED from your working code ──

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

    // ── Wordmark hold ──
    scrollTl.set({}, {}, 0.48);

    // ══════════════════════════════════════════════
    // Scene 4: i-dot zoom to centered circle + text reveal
    //
    // 0.48–0.53: fade out wordmark, show i-dot overlay
    // 0.48–0.72: dot drifts to center + scales to large circle
    // 0.72–0.78: "Call it" (top) fades in
    // 0.74–0.82: "capabilities" slides in from left
    // 0.80–0.86: "Call it" (bottom) fades in
    // 0.82–0.92: "possibilities" slides in from left
    // 0.92–1.00: hold
    // ══════════════════════════════════════════════

    // Dot ratios within wordmark-left.svg (viewBox 0 0 284.4 166.41)
    const DOT_CX = 268.02 / 284.4;
    const DOT_CY = 15.77 / 166.41;
    const DOT_W  = 32.24 / 284.4;
    const DOT_H  = 31.89 / 166.41;

    function getDotPos() {
      const lr = left!.getBoundingClientRect();
      const sr = section!.getBoundingClientRect();
      return {
        w: lr.width * DOT_W,
        h: lr.height * DOT_H,
        cx: lr.left + lr.width * DOT_CX - sr.left,
        cy: lr.top  + lr.height * DOT_CY - sr.top,
      };
    }

    // Oversample for crisp rendering
    const OVERSAMPLE = 10;

    // Target circle size: 55% of the smaller viewport dimension
    // so it never overflows on portrait (mobile) or landscape (desktop)
    const CIRCLE_RATIO = 0.55;

    // 4a. Snap i-dot overlay and show
    scrollTl.set(iDot, {
      width:    () => getDotPos().w * OVERSAMPLE,
      height:   () => getDotPos().h * OVERSAMPLE,
      left:     () => getDotPos().cx - (getDotPos().w * OVERSAMPLE) / 2,
      top:      () => getDotPos().cy - (getDotPos().h * OVERSAMPLE) / 2,
      xPercent: 0,
      yPercent: 0,
      scale:    1 / OVERSAMPLE,
      opacity:  1,
    }, 0.48);

    // 4b. Fade out wordmark + nav
    scrollTl.to(shiftGroup, { opacity: 0, duration: 0.05, ease: "power2.in" }, 0.48);

    waitForElement(section, "[data-nav-trigger]").then(() => {
      // Nav trigger stays visible — no fade out
    });

    // 4c. Drift to center
    scrollTl.to(iDot, {
      left: () => section.offsetWidth / 2,
      top: () => section.offsetHeight / 2,
      xPercent: -50,
      yPercent: -50,
      duration: 0.22,
      ease: "power2.inOut",
    }, 0.48);

    // 4d. Scale to the centered circle size (not full screen)
    scrollTl.to(iDot, {
      scale: () => {
        const dotSize = Math.max(iDot.offsetWidth, iDot.offsetHeight) / OVERSAMPLE || 30;
        // Use the smaller dimension so circle fits on portrait and landscape
        const smallerSide = Math.min(section.offsetWidth, section.offsetHeight);
        const targetSize = smallerSide * CIRCLE_RATIO;
        return (targetSize / dotSize) / OVERSAMPLE;
      },
      duration: 0.22,
      ease: "power3.in",
    }, 0.50);

    // ── Text animations (Scene 4 text in) ──

    // Set initial positions for text
    gsap.set(callIt1, { y: 20, opacity: 0 });
    gsap.set(cap,     { x: -60, opacity: 0 });
    gsap.set(callIt2, { y: -20, opacity: 0 });
    gsap.set(poss,    { x: -60, opacity: 0 });

    // "Call it" top — fade in
    scrollTl.to(callIt1, {
      y: 0, opacity: 1, duration: 0.04, ease: "power2.out",
    }, 0.58);

    // "capabilities" — slide in from left
    scrollTl.to(cap, {
      x: 0, opacity: 1, duration: 0.05, ease: "power2.out",
    }, 0.60);

    // "Call it" bottom — fade in
    scrollTl.to(callIt2, {
      y: 0, opacity: 1, duration: 0.04, ease: "power2.out",
    }, 0.64);

    // "possibilities" — slide in from left
    scrollTl.to(poss, {
      x: 0, opacity: 1, duration: 0.05, ease: "power2.out",
    }, 0.66);

    // ── Scene 4 hold ──
    scrollTl.set({}, {}, 0.74);

    // ══════════════════════════════════════════════
    // Scene 5: Text out → orange circle zooms bigger
    // 0.74–0.78: text fades/slides out
    // 0.76–0.84: circle scales up
    // 0.84–0.86: hold (big orange circle alone)
    // ══════════════════════════════════════════════

    // 5a. Text out
    scrollTl.to(callIt1, {
      y: -30, opacity: 0, duration: 0.04, ease: "power2.in",
    }, 0.74);

    scrollTl.to(cap, {
      x: -80, opacity: 0, duration: 0.05, ease: "power2.in",
    }, 0.74);

    scrollTl.to(callIt2, {
      y: 30, opacity: 0, duration: 0.04, ease: "power2.in",
    }, 0.76);

    scrollTl.to(poss, {
      x: -80, opacity: 0, duration: 0.05, ease: "power2.in",
    }, 0.76);

    // 5b. Orange circle zooms bigger
    scrollTl.to(iDot, {
      scale: () => {
        const dotSize = Math.max(iDot.offsetWidth, iDot.offsetHeight) / OVERSAMPLE || 30;
        const largerSide = Math.max(section.offsetWidth, section.offsetHeight);
        return (largerSide * 0.70 / dotSize) / OVERSAMPLE;
      },
      duration: 0.08,
      ease: "power2.inOut",
    }, 0.76);

    // ── Hold: big orange circle alone ──
    scrollTl.set({}, {}, 0.86);

    // ══════════════════════════════════════════════
    // Scene 6: Video zooms in slowly over the orange circle
    // 0.86–0.94: video scales from 0 to 1, covering the circle
    // 0.94–0.96: hold with video visible
    // ══════════════════════════════════════════════

    // 6a. Video zooms in slowly
    scrollTl.to(videoWrap, {
      opacity: 1,
      scale: 1,
      duration: 0.08,
      ease: "sine.inOut",
    }, 0.86);

    // 6b. Start video playback
    scrollTl.call(() => {
      video.play().catch(() => {});
    }, [], 0.88);

    // ── Hold: video playing ──
    scrollTl.set({}, {}, 0.96);

    // ══════════════════════════════════════════════
    // Scene 7: Video zooms out slowly, orange circle alone again
    // 0.96–1.04: video shrinks back to center smoothly
    // Then hold on orange circle
    // ══════════════════════════════════════════════

    // 7a. Video zooms out slowly
    scrollTl.to(videoWrap, {
      scale: 0,
      opacity: 0,
      duration: 0.08,
      ease: "sine.inOut",
    }, 0.96);

    // 7b. Pause video
    scrollTl.call(() => {
      video.pause();
    }, [], 1.03);

    // Hold at end (orange circle alone)
    scrollTl.set({}, {}, 1.1);

    // ══════════════════════════════════════════════
    // Scene 8: Image collage appears on the gold circle
    // 1.10–1.14: collage container fades/scales in
    // 1.14–1.28: individual images stagger in
    // 1.28–1.40: hold (collage visible, clickable)
    // ══════════════════════════════════════════════

    // 8a. Collage container scales up
    scrollTl.to(collage, {
      opacity: 1,
      scale: 1,
      duration: 0.04,
      ease: "power2.out",
    }, 1.10);

    // 8b. Stagger individual images in
    const collageItems = collage.querySelectorAll("[data-collage-item]");
    scrollTl.to(collageItems, {
      opacity: 1,
      duration: 0.02,
      stagger: 0.004,
      ease: "power2.out",
    }, 1.12);

    // 8c. Enable pointer events after images are in
    scrollTl.set(collage, { pointerEvents: "auto" }, 1.28);

    // Hold with collage visible
    scrollTl.set({}, {}, 1.40);

    const st = ScrollTrigger.create({
      trigger: section, start: "top top", end: "+=1300%",
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

      {/* i-dot overlay for Scene 4 — outside shiftGroup */}
      <div ref={iDotRef} className="intro__i-dot" aria-hidden="true">
        <svg viewBox="0 0 32.24 31.89" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,15.77c0,9.02,7.18,16.12,15.86,16.12,9.29,0,16.38-7.1,16.38-16.12S25.14,0,15.86,0C7.18,0,0,6.83,0,15.77h0Z" fill="#c3884f"/>
        </svg>
      </div>

      {/* Scene 4 text — positioned around the gold circle */}
      <div className="intro__scene4-text" aria-hidden="true">
        <div ref={callIt1Ref} className="scene4__call-it scene4__call-it--top">Call it</div>
        <div ref={capRef} className="scene4__big-text scene4__capabilities">capabilities</div>
        <div ref={callIt2Ref} className="scene4__call-it scene4__call-it--bottom">Call it</div>
        <div ref={possRef} className="scene4__big-text scene4__possibilities">possibilities</div>
      </div>

      {/* Video circle — zooms from center to cover the gold dot */}
      <div ref={videoWrapRef} className="intro__video-circle">
        <video
          ref={videoRef}
          src="/videos/intro-reel.mp4"
          muted
          loop
          playsInline
          preload="auto"
        />
      </div>

      {/* Scene 8: Image collage — overlays the gold circle */}
      <div ref={collageRef} className="intro__collage">
        <ImageCollage />
      </div>

      <NavOrbit />
      <div className="sr-only">Exicon Group — Powered by Possibilities.</div>
    </section>
  );
}
