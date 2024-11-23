'use client'
import "./globals.css";
import Link from "next/link";
import NavIcon from "../icons/navicon";
import Drawer from "@/components/drawer";
import React, { useState, useEffect } from 'react'
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} !p-0`}
      >
        <section className="relative z-[9999] bg-black py-3">
          <div className="flex items-center justify-between px-4 md:px-10">
            <Link href="/">
              <p className="text-3xl text-white font-bold cursor-pointer">MD<span className="text-cyan-400">.</span></p>
            </Link>
            <div className="flex cursor-pointer flex-wrap items-center justify-between py-4 gap-4">
              <NavIcon handler={() => setMenuIsOpen(true)} />
            </div>
          </div>
          <div className={`absolute duration-300 top-0 ${!menuIsOpen ? "right-full" : "right-0"}`}>
            <Drawer handler={() => setMenuIsOpen(false)} />
          </div>
        </section>
        <div className="bg-gradient-to-b from-black to-gray-900 text-gray-300">
          <div className="relative overflow-hidden text-gray-400">
            <AnimatedBackground mousePosition={mousePosition} />
            <div className="grid grid-cols-9">
              <div className="col-span-3">
                <DesktopAside />
              </div>
              <div className="col-span-9 lg:hidden">
                <MobileInto />
              </div>
              <main className="lg:col-span-6 col-span-9 overflow-hidden">
                <div className="lg:h-screen h-[67vh] w-full overflow-y-scroll">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}