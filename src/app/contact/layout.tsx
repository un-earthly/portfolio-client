import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with MD Alamin for freelance work, consulting, or collaboration opportunities. Available for full-stack development, technical consulting, and enterprise projects.",
  alternates: { canonical: "https://alamin-md.xyz/contact" },
  openGraph: {
    title: "Contact MD Alamin",
    description:
      "Available for freelance, consulting, and enterprise development projects.",
    url: "https://alamin-md.xyz/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
