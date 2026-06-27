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
    "Senior Full Stack Developer with 5+ years of experience building enterprise-scale applications. Specialises in legacy system modernisation, BLE mesh architecture, and scalable web systems. Based in Dhaka, Bangladesh. Available for remote contracts.",
  keywords: [
    "MD Alamin",
    "Full Stack Developer Bangladesh",
    "Senior Software Engineer Dhaka",
    "Legacy System Modernisation",
    "React Next.js Developer",
    "Node.js NestJS Developer",
    "Remote Software Engineer",
    "BLE Mesh React Native",
    "TypeScript Developer",
    "Technical Leader",
  ],
  authors: [{ name: "MD Alamin", url: BASE_URL }],
  creator: "MD Alamin",
  publisher: "MD Alamin",
  alternates: {
    canonical: BASE_URL,
  },
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
        url: `${BASE_URL}/pp.png`,
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
    images: [`${BASE_URL}/pp.png`],
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
  // Replace with your token from Google Search Console → Settings → Ownership verification → HTML tag
  verification: {
    google: "PASTE_GOOGLE_VERIFICATION_TOKEN_HERE",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "MD Alamin",
  url: BASE_URL,
  image: `${BASE_URL}/pp.png`,
  jobTitle: "Senior Software Engineer",
  description:
    "Senior Full Stack Developer specialising in legacy system modernisation, BLE mesh mobile architecture, and scalable web systems. Based in Dhaka, Bangladesh. Available for remote contracts.",
  worksFor: {
    "@type": "Organization",
    name: "Mediusware",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Mirpur",
    addressRegion: "Dhaka",
    addressCountry: "BD",
  },
  sameAs: [
    "https://github.com/un-earthly",
    "https://www.linkedin.com/in/alamin-md/",
  ],
  email: "md.c.alamin00@gmail.com",
  availableLanguage: [
    { "@type": "Language", name: "English" },
    { "@type": "Language", name: "Bengali" },
  ],
  knowsAbout: [
    "React",
    "Next.js",
    "Node.js",
    "TypeScript",
    "NestJS",
    "Legacy System Modernisation",
    "BLE Mesh Networking",
    "Offline-First Architecture",
    "System Design",
    "AI Agent Systems",
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
