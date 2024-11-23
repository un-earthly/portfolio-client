'use client'
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import NavIcon from "../icons/navicon";
import Drawer from "@/components/drawer";
import { motion } from 'framer-motion'
import { FileUser, Github, Linkedin, Mail } from 'lucide-react'
import Image from 'next/image'
import { Card } from "@/components/ui/card";
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

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

const codeSnippets = [
  { color: 'text-green-400', content: '<div>' },
  { color: 'text-blue-400', content: 'const dev =' },
  { color: 'text-yellow-400', content: 'function()' },
  { color: 'text-pink-400', content: '=> {' },
  { color: 'text-purple-400', content: 'return (' },
];

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
              <div className="w-full hidden lg:col-span-3 p-4 lg:p-8 lg:flex items-center justify-center flex-col text-center bg-gradient-to-br from-transparent to-gray-900/5 shadow-[rgba(0,0,0,0.1)_10px_5px_4px_0px] bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl">
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
                  <Link href='https://github.com/un-earthly' target='_blank'>
                    <Button variant="outline" size="icon" className="h-8 w-8 md:h-10 md:w-10">
                      <Github className="h-4 w-4 md:h-5 md:w-5 font-black text-black" />
                      <span className="sr-only">GitHub</span>
                    </Button>
                  </Link>
                  <Link href="https://www.linkedin.com/in/alamin-md/" target='_blank'>
                    <Button variant="outline" size="icon" className="h-8 w-8 md:h-10 md:w-10">
                      <Linkedin className="h-4 w-4 md:h-5 md:w-5 font-black text-black" />
                      <span className="sr-only">LinkedIn</span>
                    </Button>
                  </Link>
                  <Link href="mailto:vijayalamin@gmail.com">
                    <Button variant="outline" size="icon" className="h-8 w-8 md:h-10 md:w-10">
                      <Mail className="h-4 w-4 md:h-5 md:w-5 font-black text-black" />
                      <span className="sr-only">Email</span>
                    </Button>
                  </Link>
                  <Link href="">
                    <Button variant="outline" size="icon" className="h-8 w-8 md:h-10 md:w-10">
                      <FileUser className="h-4 w-4 md:h-5 md:w-5 font-black text-black" />
                      <span className="sr-only">Resume</span>
                    </Button>
                  </Link>
                </motion.div>
              </div>
              <div className="w-full lg:hidden max-w-sm mx-auto bg-gradient-to-br from-transparent to-gray-900/5 border-cyan-500/20 shadow-lg backdrop-filter backdrop-blur-lg">
                <div className="p-4">

                  <div className="flex items-center space-x-4">
                    <Image
                      src="/pp.png"
                      height={60}
                      width={60}
                      className="rounded-full border-2 border-cyan-500 border-dashed"
                      alt="Profile"
                    />
                    <div>
                      <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-xl font-bold text-gray-100"
                      >
                        <span className="text-cyan-500">.</span>ALAMIN
                      </motion.h2>
                      <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-sm text-gray-400"
                      >
                        Software Developer
                      </motion.p>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-2 gap-2 my-3">
                    <div className="bg-cyan-950/10 border border-cyan-500/80 rounded-lg p-2 text-center">
                      <p className="text-lg font-bold text-cyan-300">3+</p>
                      <p className="text-xs text-gray-400">Years</p>
                    </div>
                    <div className="bg-cyan-950/10 border border-cyan-500/80 rounded-lg p-2 text-center">
                      <p className="text-lg font-bold text-cyan-500">20+</p>
                      <p className="text-xs text-gray-400">Projects</p>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center space-x-2 mt-3">
                    <Link href="https://github.com/un-earthly" target="_blank">
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Github className="h-4 w-4 font-black text-black" />
                        <span className="sr-only">GitHub</span>
                      </Button>
                    </Link>
                    <Link href="https://www.linkedin.com/in/alamin-md/" target="_blank">
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Linkedin className="h-4 w-4 font-black text-black" />
                        <span className="sr-only">LinkedIn</span>
                      </Button>
                    </Link>
                    <Link href="mailto:vijayalamin@gmail.com">
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Mail className="h-4 w-4 font-black text-black" />
                        <span className="sr-only">Email</span>
                      </Button>
                    </Link>
                    <Link href="">
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <FileUser className="h-4 w-4 font-black text-black" />
                        <span className="sr-only">Resume</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

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