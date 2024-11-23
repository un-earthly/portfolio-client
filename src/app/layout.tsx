'use client'
import "./globals.css";
import Link from "next/link";
import NavIcon from "../icons/navicon";
import Drawer from "@/components/drawer";
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Card } from "@/components/ui/card";
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { codeSnippets, geistMono, geistSans, socialLinks } from "@/mock-data";


const AnimatedBackground = ({ mousePosition }: any) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {codeSnippets.map((snippet, index) => (
        <motion.div
          key={index}
          className={`absolute ${snippet.color} text-opacity-20 text-6xl font-mono`}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 0.2,
            x: mousePosition.x * 0.02 + Math.random() * 100 - 50,
            y: mousePosition.y * 0.02 + Math.random() * 100 - 50,
            rotate: Math.random() * 360,
          }}
          transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        >
          {snippet.content}
        </motion.div>
      ))}
    </>
  );
};
const DesktopAside = () => <div className="w-full hidden lg:col-span-3 p-4 lg:p-8 lg:flex items-center justify-center flex-col text-center bg-gradient-to-br from-transparent to-gray-900/5 shadow-[rgba(0,0,0,0.1)_10px_5px_4px_0px] bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl">
  <div className="flex items-center justify-center">
    <Image
      src="/pp.png"
      height={200}
      width={200}
      className='border-cyan-500 border-2 rounded-full border-dashed w-32 h-32 md:w-48 md:h-48 lg:w-[200px] lg:h-[200px]'
      alt="dp"
    />
  </div>
  <div className="-space-y-4 mt-4">
    <motion.h1
      className="mb-6 text-3xl md:text-4xl lg:text-5xl font-bold text-gray-100"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <span className="text-cyan-500">.</span>ALAMIN
    </motion.h1>
    <motion.h2
      className="mb-6 text-xl md:text-2xl font-semibold text-gray-300"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      Software Developer
    </motion.h2>
  </div>
  <motion.p
    className="mb-6 text-sm text-gray-400"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.4 }}
  >
    Automating stuff with the magic of code.
  </motion.p>
  <motion.div
    className="grid grid-cols-2 gap-4 w-full max-w-md mb-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.3 }}
  >
    <Card className="py-4 text-center bg-cyan-950/10 border-cyan-500/80">
      <h3 className="text-2xl md:text-3xl font-bold text-cyan-300">3+</h3>
      <p className="text-xs md:text-sm text-gray-300">Years Experience</p>
    </Card>
    <Card className="py-4 text-center bg-cyan-950/10 border-cyan-500/80">
      <h3 className="text-2xl md:text-3xl font-bold text-cyan-500">20+</h3>
      <p className="text-xs md:text-sm text-gray-300">Projects</p>
    </Card>
  </motion.div>
  <motion.div
    className="flex justify-center space-x-4 mb-6"
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, delay: 0.6 }}
  >
    {socialLinks.map(e => {
      return (
        <Link href={e.href} target='_blank'>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 md:h-10 md:w-10 overflow-hidden border border-cyan-300 
                          before:absolute before:inset-0 before:bg-gradient-to-br before:from-cyan-950 before:to-cyan-800
                          after:absolute after:inset-0 after:bg-gradient-to-tl after:from-cyan-950 after:to-cyan-800 after:opacity-0
                          hover:after:opacity-100 hover:scale-110 before:transition-all after:transition-all before:duration-700 after:duration-700
                          before:ease-in-out after:ease-in-out hover:before:opacity-0 transform transition-transform duration-700 ease-in-out"
          >
            <e.icon className="h-4 z-50 w-4 md:h-5 md:w-5 font-black text-cyan-300" />
            <span className="sr-only">{e.label}</span>
          </Button>
        </Link>
      );
    })}
  </motion.div>
</div>

const MobileInto = () => <div className="w-11/12 mx-auto lg:hidden bg-gradient-to-br from-black/40 to-gray-900/60 border border-cyan-500/20 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg">
  <div className="p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Image
            src="/pp.png"
            height={50}
            width={50}
            className="rounded-full border-2 border-cyan-500 border-dashed"
            alt="Profile"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black" />
        </div>
        <div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg font-bold text-gray-100"
          >
            <span className="text-cyan-500">.</span>ALAMIN
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xs text-cyan-300/80"
          >
            Software Developer
          </motion.p>
        </div>
      </div>

      <div className="flex gap-3 items-center">
        <div className="text-center">
          <p className="text-lg font-bold text-cyan-300">3+</p>
          <p className="text-xs text-gray-400">Years</p>
        </div>
        <div className="h-8 w-px bg-cyan-500/20" />
        <div className="text-center">
          <p className="text-lg font-bold text-cyan-500">20+</p>
          <p className="text-xs text-gray-400">Projects</p>
        </div>
      </div>
    </div>

    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-3 text-sm text-gray-400 border-l-2 border-cyan-500/30 pl-3"
    >
      Automating stuff with the magic of code
    </motion.p>
  </div>

  <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

  <div className="p-4 flex items-center justify-center gap-4">
    {socialLinks.map((e, index) => (
      <Link key={index} href={e.href} target='_blank'>
        <div className="relative flex items-center justify-center w-8 h-8 bg-gradient-to-br from-cyan-950 to-cyan-800 rounded-md border border-cyan-300/30">
          <e.icon className="h-4 w-4 text-cyan-300" />
        </div>
      </Link>
    ))}
  </div>
</div>
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen !p-0`}
      >
        <section className="relative z-50 bg-black py-3">
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
            <div className="flex flex-col lg:grid lg:grid-cols-9 min-h-screen">
              <DesktopAside />
              <MobileInto />
              <main className="w-full lg:col-span-6 h-[calc(100vh-6rem)] overflow-y-auto lg:h-screen py-4 lg:py-10 px-4 lg:px-8">
                {children}
              </main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}