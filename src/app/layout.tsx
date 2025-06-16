'use client'
import "./globals.css";
import React, { useState, useEffect, useRef } from 'react'
import { geistMono, geistSans } from "@/mock-data";
import DesktopAside from "@/components/desktopAside";
import MobileInto from "@/components/mobileBanner";
import AnimatedBackground from "@/components/background";
import Navbar from "@/components/drawer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gradient-to-b from-black to-gray-900 overflow-x-hidden`}>
        {/* Background Animation Layer */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 overflow-hidden">
            <AnimatedBackground mousePosition={mousePosition} />
          </div>
        </div>

        {/* Main Content Layer */}
        <div className="relative z-10">
          <Navbar />

          <main className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-8 pt-20">
              {/* Desktop Sidebar */}
              <aside className="hidden lg:block lg:col-span-5">
                <div className="sticky top-24">
                  <DesktopAside />
                </div>
              </aside>

              {/* Mobile Banner */}
              <div className="lg:hidden">
                <MobileInto />
              </div>

              {/* Main Content */}
              <div className="lg:col-span-7 min-h-[calc(100vh-6rem)]">
                <div className="pb-16 lg:pb-24">
                  {children}
                </div>
              </div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}