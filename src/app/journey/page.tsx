import type { Metadata } from "next";
import JourneyContent from "@/components/Journey/JourneyContent";

export const metadata: Metadata = {
  title: "Journey — The Long Version",
  description:
    "The in-depth story behind MD Alamin's career: long-form write-ups of each role with TL;DRs, the real stories, what I built, and what I learned — from IshQool to Masleap, All Generation Tech, and Mediusware.",
  alternates: { canonical: "https://alamin-md.xyz/journey" },
  openGraph: {
    title: "Journey — The Long Version | MD Alamin",
    description:
      "Role-by-role deep dives: TL;DRs, the real stories behind the migrations and production work, and the lessons learned across 5+ years.",
    url: "https://alamin-md.xyz/journey",
  },
};

export default function JourneyPage() {
  return <JourneyContent />;
}
