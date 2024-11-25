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
import Navbar from "@/components/drawer";

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
      <body className={`${geistSans.variable} ${geistMono.variable} overflow-hidden w-screen !p-0`}>
        <div className="grid grid-cols-12 bg-gradient-to-b from-black to-gray-900">
          <div className="overflow-hidden hidden lg:block w-screen">
            <AnimatedBackground mousePosition={mousePosition} />
          </div>
          <div className="col-span-12">
            <Navbar />
          </div>

          <div className="h-screen overflow-hidden col-span-12">
            <div className="grid grid-cols-12">
              <div className="col-span-5 hidden lg:block">
                <DesktopAside />
              </div>
              <div className="col-span-12 mt-20 lg:hidden block">
                <MobileInto />
              </div>
              <div className="lg:col-span-7 mt-5 lg:mt-20 pb-64 lg:pb-16 col-span-12 px-3 md:px-10 lg:px-0 overflow-y-scroll h-[95vh] text-gray-300">
                {children}
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}