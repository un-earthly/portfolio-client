'use client'
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import NavIcon from "../icons/navicon";
import { useState } from "react";
import Drawer from "@/components/drawer";
import Hero from "@/components/hero";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen overflow-hidden`}
      >
        <section className="relative z-50 bg-black py-3">
          <div className="flex items-center justify-between px-10">
            <Link href="/">
              <p className="text-3xl text-white font-bold cursor-pointer">MD<span className="text-cyan-400">.</span></p>
            </Link>
            <div className="flex cursor-pointer flex-wrap items-center justify-between py-4 gap-4">
              <NavIcon handler={() => setMenuIsOpen(true)} />
            </div>
          </div>
          <div className={`absolute duration-300 top-0 ${!menuIsOpen ? "right-full " : "right-0"}`}>
            <Drawer handler={() => setMenuIsOpen(false)} />
          </div>
        </section>
        <div className=" bg-gradient-to-b  from-black to-gray-900 text-gray-300 ">

          {children}

        </div>

      </body>
    </html>
  );
}
