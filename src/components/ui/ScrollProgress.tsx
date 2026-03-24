"use client";

import { useRef, useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
      },
    });
    return () => st.kill();
  }, []);

  return (
    <div style={{ position:"fixed", top:0, left:0, right:0, height:3, zIndex:9999, pointerEvents:"none" }}>
      <div ref={barRef} style={{ width:"100%", height:"100%", background:"linear-gradient(90deg,#f69220,#c3884f)", transformOrigin:"left center", transform:"scaleX(0)" }} />
    </div>
  );
}
