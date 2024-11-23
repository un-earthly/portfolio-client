'use client'
import "./globals.css";
import Link from "next/link";
import NavIcon from "../icons/navicon";
import Drawer from "@/components/drawer";
import React, { useState, useEffect, useRef } from 'react'
import { geistMono, geistSans } from "@/mock-data";
import DesktopAside from "@/components/desktopAside";
import MobileInto from "@/components/mobileBanner";
import AnimatedBackground from "@/components/background";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

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

  const scrollToTop = () => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    setMenuIsOpen(false);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} !p-0`}>
        <div className="flex flex-col min-h-screen">
          <section className="sticky top-0 z-[9999] bg-black py-3">
            <div className="flex items-center justify-between px-4 md:px-10">
              <Link href="/" onClick={scrollToTop}>
                <p className="text-3xl text-white font-bold cursor-pointer">MD<span className="text-cyan-400">.</span></p>
              </Link>
              <div className="flex cursor-pointer flex-wrap items-center justify-between py-4 gap-4">
                <NavIcon handler={() => setMenuIsOpen(true)} />
              </div>
            </div>
            <div className={`fixed duration-300 top-0 ${!menuIsOpen ? "right-full" : "right-0"}`}>
              <Drawer handler={scrollToTop} />
            </div>
          </section>

          <div className="flex-1 bg-gradient-to-b from-black to-gray-900 text-gray-300">
            <div className="relative text-gray-400">
              <div className="overflow-hidden w-screen">
                <AnimatedBackground mousePosition={mousePosition} />
              </div>
              <div className="grid grid-cols-9 gap-4">
                <div className="col-span-3 hidden lg:block">
                  <DesktopAside />
                </div>
                <div className="col-span-9 lg:hidden">
                  <MobileInto />
                </div>
                <main className="lg:col-span-6 pb-20 h-[calc(100vh-1rem)] overflow-y-auto col-span-9">
                  <div
                    ref={contentRef}
                    className="px-4 lg:px-0 py-1"
                  >
                    {children}
                  </div>
                </main>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}