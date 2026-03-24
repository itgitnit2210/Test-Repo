"use client";

import { useState, useEffect } from "react";
import NavOrbitMobile from "./NavOrbitMobile";
import NavOrbitDesktop from "./NavOrbitDesktop";

export default function NavOrbit() {
  const [layout, setLayout] = useState<"mobile" | "desktop" | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 480px)");
    setLayout(mq.matches ? "mobile" : "desktop");
    const handler = (e: MediaQueryListEvent) => setLayout(e.matches ? "mobile" : "desktop");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Render nothing until we know which layout — prevents flash/swap
  if (!layout) return null;

  return layout === "mobile" ? <NavOrbitMobile /> : <NavOrbitDesktop />;
}
