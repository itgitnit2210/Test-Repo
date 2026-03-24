"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import LogoSolid from "./LogoSolid";
import "@/styles/wordmark.css";

/**
 * WordmarkScene — Scene 3
 *
 * The logo-solid from the intro is already visible. On scroll:
 * 1. Logo scales down and slides into the gap between "exi" and "n"
 * 2. "exi" slides in from the left
 * 3. "n" slides in from the right
 * 4. Tagline fades up from below
 *
 * Layout: [exi] [logo-solid] [n]
 *              tagline
 *
 * File placement:
 *   /public/wordmark-left.svg   ← "exi" (white text + gold dot on i)
 *   /public/wordmark-right.svg  ← "n" (white text)
 *   /public/tagline.svg         ← "Powered by Possibilities" (gold text)
 *   /public/logo-solid.svg      ← reused from intro (the double-circle mark)
 */
export default function WordmarkScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const leftRef = useRef<HTMLImageElement>(null);
  const rightRef = useRef<HTMLImageElement>(null);
  const taglineRef = useRef<HTMLImageElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const logo = logoRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    const tagline = taglineRef.current;
    if (!section || !logo || !left || !right || !tagline) return;

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Initial states
    gsap.set(left, { x: -80, opacity: 0 });
    gsap.set(right, { x: 80, opacity: 0 });
    gsap.set(tagline, { y: 30, opacity: 0 });

    // Timeline scrubbed by scroll
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    if (reduced) {
      gsap.set(left, { x: 0, opacity: 1 });
      gsap.set(right, { x: 0, opacity: 1 });
      gsap.set(tagline, { y: 0, opacity: 1 });
      gsap.set(logo, { opacity: 1 });
      return;
    }

    // PHASE 1: "exi" slides in from left
    tl.to(left, { x: 0, opacity: 1, duration: 1 }, 0);

    // PHASE 2: "n" slides in from right
    tl.to(right, { x: 0, opacity: 1, duration: 1 }, 0.15);

    // PHASE 3: Logo fades in / settles (it's already the solid from intro)
    tl.to(logo, { opacity: 1, duration: 0.8 }, 0.3);

    // PHASE 4: Tagline fades up
    tl.to(tagline, { y: 0, opacity: 1, duration: 0.8 }, 0.6);

    // ScrollTrigger — scrub on scroll
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top 60%",
      end: "top 10%",
      scrub: 0.8,
      invalidateOnRefresh: true,
      animation: tl,
    });

    return () => {
      st.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="wordmark-scene"
      aria-label="Exicon wordmark"
    >
      <div className="wordmark-scene__inner">
        {/* The wordmark row: exi + logo + n */}
        <div className="wordmark-scene__row">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={leftRef}
            src="/wordmark-left.svg"
            alt=""
            className="wordmark-scene__left"
            draggable={false}
          />

          <div className="wordmark-scene__logo">
            <LogoSolid ref={logoRef} />
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={rightRef}
            src="/wordmark-right.svg"
            alt=""
            className="wordmark-scene__right"
            draggable={false}
          />
        </div>

        {/* Tagline below */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={taglineRef}
          src="/tagline.svg"
          alt="Powered by Possibilities"
          className="wordmark-scene__tagline"
          draggable={false}
        />
      </div>

      <div className="sr-only">
        Exicon — Powered by Possibilities
      </div>
    </section>
  );
}
