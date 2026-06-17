import type { Metadata } from "next";
import PortfolioGrid from "@/components/PortfolioGrid";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Explore MD Alamin's portfolio of projects — from enterprise system migrations and AI-powered mobile apps to edtech platforms and full-stack web applications.",
  alternates: { canonical: "https://alamin-md.xyz/portfolio" },
  openGraph: {
    title: "Portfolio | MD Alamin",
    description:
      "Enterprise migrations, AI integrations, LMS platforms, and more — browse MD Alamin's project portfolio.",
    url: "https://alamin-md.xyz/portfolio",
  },
};

export default function ProjectsPage() {
  return (
    <div className="w-full">
      <PortfolioGrid />
    </div>
  );
}
