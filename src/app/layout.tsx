import "./globals.css";
import type { Metadata } from "next";
import { geistMono, geistSans } from "@/mock-data";
import SiteShell from "@/components/SiteShell";
import { Analytics } from "@vercel/analytics/next"
const BASE_URL = "https://alamin-md.xyz";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "MD Alamin | Senior Full Stack Developer & Technical Leader",
    template: "%s | MD Alamin",
  },
  description:
    "Senior Full Stack Developer with 5+ years of experience building enterprise-scale applications. Expert in React, Next.js, Node.js, TypeScript, and cloud architectures. Based in Dhaka, Bangladesh.",
  keywords: [
    "MD Alamin",
    "Full Stack Developer",
    "Senior Software Engineer",
    "React Developer",
    "Next.js Developer",
    "Node.js Developer",
    "TypeScript",
    "Bangladesh Developer",
    "Software Engineer Dhaka",
    "Technical Leader",
  ],
  authors: [{ name: "MD Alamin", url: BASE_URL }],
  creator: "MD Alamin",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "MD Alamin — Portfolio",
    title: "MD Alamin | Senior Full Stack Developer & Technical Leader",
    description:
      "Senior Full Stack Developer with 5+ years of experience building enterprise-scale applications. Expert in React, Next.js, Node.js, and cloud architectures.",
    images: [
      {
        url: "/pp.png",
        width: 1200,
        height: 630,
        alt: "MD Alamin — Senior Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MD Alamin | Senior Full Stack Developer",
    description:
      "Senior Full Stack Developer with 5+ years building enterprise-scale applications using React, Next.js, Node.js, and cloud technologies.",
    images: ["/pp.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "MD Alamin",
  url: BASE_URL,
  image: `${BASE_URL}/pp.png`,
  jobTitle: "Senior Full Stack Developer & Technical Leader",
  worksFor: {
    "@type": "Organization",
    name: "Mediusware",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dhaka",
    addressCountry: "BD",
  },
  sameAs: [
    "https://github.com/un-earthly",
    "https://www.linkedin.com/in/alamin-md/",
  ],
  email: "md.c.alamin00@gmail.com",
  knowsAbout: [
    "React",
    "Next.js",
    "Node.js",
    "TypeScript",
    "Full Stack Development",
    "System Architecture",
    "Cloud Computing",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-black text-white antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteShell>{children}</SiteShell>
        <Analytics />
      </body>
    </html>
  );
}
