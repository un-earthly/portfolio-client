import type { Metadata } from "next";
import React from "react";
import { projectsDetails } from "@/mock-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = projectsDetails.find((p) => p.id === id);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: project.title,
    description: project.subtitle,
    alternates: { canonical: `https://alamin-md.xyz/portfolio/${id}` },
    openGraph: {
      title: `${project.title} | MD Alamin`,
      description: project.subtitle,
      url: `https://alamin-md.xyz/portfolio/${id}`,
      images: project.thumbnail ? [{ url: project.thumbnail }] : [],
    },
  };
}

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
