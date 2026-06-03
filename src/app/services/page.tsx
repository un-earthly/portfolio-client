import type { Metadata } from "next";
import React from 'react'

export const metadata: Metadata = {
  title: "Services",
  description:
    "MD Alamin offers full-stack development, UI/UX design, and technical consulting services. Building scalable web applications and providing strategic technology guidance.",
  alternates: { canonical: "https://alamin-md.xyz/services" },
  openGraph: {
    title: "Services | MD Alamin",
    description:
      "Full-stack development, UI/UX design, and technical consulting services.",
    url: "https://alamin-md.xyz/services",
  },
};

export default function page() {
    return (
        <div>page</div>
    )
}
