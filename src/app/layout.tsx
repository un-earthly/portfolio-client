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
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-gradient-to-b from-black to-gray-900 min-h-screen`}>
        {/* Background Animation Layer */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0">
            <AnimatedBackground mousePosition={mousePosition} />
          </div>
        </div>

        {/* Main Content Layer */}
        <div className="relative z-10 min-h-screen">
          <Navbar />

          <main className="mx-auto px-4 lg:px-8 ">
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
              <div className="lg:col-span-7 h-[calc(100vh-10rem)] overflow-y-auto">
                <div className="pb-16 lg:pb-24 w-full">
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