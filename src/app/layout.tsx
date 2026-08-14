import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Horizon International School | Every Child Ready to Rise",
  description:
    "Discover a joyful, future-ready education for ages 3–18 at Horizon International School in Gurugram. Explore learning, school life, campus tours, and admissions.",
  keywords: [
    "international school Gurugram",
    "school admissions 2026",
    "Early Years school",
    "Primary School",
    "Senior School",
    "future-ready education",
  ],
  openGraph: {
    title: "Horizon International School | Every Child Ready to Rise",
    description: "Curious minds, kind hearts, and bold futures for learners ages 3–18.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#08171d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
