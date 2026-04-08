import type { Metadata, Viewport } from "next";
import ScrollProgress from "@/components/ui/ScrollProgress";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Exicon Group — Healthcare Consulting & Media Solutions",
  description: "Healthcare consulting, media solutions, events, exhibitions and conferences.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/heavitas.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/bahnschrift-light.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/bahnschrift-regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/bahnschrift-semibold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        {/*
          Force scroll to top on every page load / reload.
          This runs as inline script BEFORE React hydrates,
          so the browser never shows a mid-scroll state.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if('scrollRestoration' in history) history.scrollRestoration = 'manual';
              window.scrollTo(0, 0);
            `,
          }}
        />
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
