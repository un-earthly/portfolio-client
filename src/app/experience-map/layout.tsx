import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience Map",
  description:
    "An interactive 3D world map of MD Alamin's engineering journey — drive through projects, explore tech regions, and discover the story behind each build.",
  alternates: { canonical: "https://alamin-md.xyz/experience-map" },
  openGraph: {
    title: "Experience Map | MD Alamin",
    description:
      "Drive through a 3D world built from 5+ years of engineering projects. Each region represents a chapter of the journey.",
    url: "https://alamin-md.xyz/experience-map",
  },
};

export default function ExperienceMapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#000",
      }}
    >
      {children}
    </div>
  );
}
