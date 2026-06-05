import "./globals.css";
import type { Metadata } from "next";
import { geistMono, geistSans } from "@/mock-data";
import DesktopAside from "@/components/desktopAside";
import MobileInto from "@/components/mobileBanner";
import MouseTracker from "@/components/MouseTracker";
import Navbar from "@/components/drawer";

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
  email: "vijayalamin@gmail.com",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-linear-to-b from-black to-gray-900 h-screen`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <MouseTracker />

        <div className="relative z-10 h-screen overflow-hidden">
          <Navbar />

          <main className="mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-8 pt-20">
              <aside className="hidden lg:block lg:col-span-4">
                <div className="sticky top-24">
                  <DesktopAside />
                </div>
              </aside>

              <div className="lg:hidden">
                <MobileInto />
              </div>

              <div className="lg:col-span-8 lg:h-[calc(100vh-10rem)] h-[calc(100vh-20rem)] overflow-y-auto">
                <div className="pb-16 lg:pb-24 w-full">{children}</div>
              </div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
