"use client";

import { forwardRef } from "react";

/**
 * LogoSolid — exact paths from logo-solid.svg
 *
 * Alignment: logo-outline has viewBox "0 0 882.52 501.54" with paths offset by 0.71
 * (half of the 1.42 stroke-width). logo-solid has viewBox "0 0 881.1 500.12" with
 * paths starting at 0. To stack them perfectly, we use the OUTLINE's viewBox and
 * translate the solid by +0.71 in both axes.
 */
const LogoSolid = forwardRef<SVGSVGElement, { className?: string }>(
  ({ className }, ref) => (
    <svg
      ref={ref}
      className={className}
      viewBox="0 0 882.52 501.54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ opacity: 0 }}
    >
      <defs>
        <linearGradient
          id="exicon-logo-grad"
          x1="694.16"
          y1="359"
          x2="548.05"
          y2="278.82"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#fff" />
          <stop offset=".03" stopColor="#f6f6f6" />
          <stop offset=".4" stopColor="#8e8e8e" />
          <stop offset=".69" stopColor="#414141" />
          <stop offset=".9" stopColor="#121212" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
      </defs>

      <g transform="translate(0.71, 0.71)">
        {/* Main white fill */}
        <path
          data-solid="fill"
          d="M631.04,0c-137.88,0-250.06,112.18-250.06,250.06,0,36.17-14.6,68.92-38.3,92.62-23.7,23.7-56.45,38.36-92.62,38.36-72.34,0-130.98-58.64-130.98-130.98s58.64-130.98,130.98-130.98c29.01,0,55.8,9.45,77.51,25.41l71.99-94.76C357.83,18.51,306.06,0,250.06,0,112.18,0,0,112.18,0,250.06s112.18,250.06,250.06,250.06c68.94,0,131.46-28.04,176.74-73.32,4.79-4.79,9.37-9.78,13.75-14.94,45.9,53.96,114.26,88.26,190.49,88.26,137.88,0,250.06-112.18,250.06-250.06S768.93,0,631.04,0ZM631.04,381.04c-72.34,0-130.98-58.64-130.98-130.98s58.64-130.98,130.98-130.98,130.98,58.64,130.98,130.98-58.64,130.98-130.98,130.98Z"
          fill="#fff"
        />

        {/* Gradient overlay — the sweep effect */}
        <g style={{ opacity: 0.5 }}>
          <path
            data-solid="gradient"
            d="M762.03,250.06c0,72.34-58.64,130.98-130.98,130.98s-130.98-58.64-130.98-130.98c0,61.65-22.39,118.16-59.51,161.8,45.9,53.96,114.26,88.26,190.49,88.26,137.88,0,250.06-112.18,250.06-250.06h-119.08Z"
            fill="url(#exicon-logo-grad)"
            style={{ mixBlendMode: "multiply" }}
          />
        </g>
      </g>
    </svg>
  )
);

LogoSolid.displayName = "LogoSolid";
export default LogoSolid;
