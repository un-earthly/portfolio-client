'use client'
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import NavIcon from "../icons/navicon";
import Drawer from "@/components/drawer";
import { motion } from 'framer-motion'
import { FileUser, Github, Linkedin, Mail } from 'lucide-react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', updateMousePosition)
    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
    }
  }, [])

  const codeSnippets = [
    { color: 'text-green-400', content: '<div>' },
    { color: 'text-blue-400', content: 'const dev =' },
    { color: 'text-yellow-400', content: 'function()' },
    { color: 'text-pink-400', content: '=> {' },
    { color: 'text-purple-400', content: 'return (' },
  ]
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
          <div className="relative max-h-screen overflow-hidden text-gray-400" >
            {
              codeSnippets.map((snippet, index) => (
                <motion.div
                  key={index}
                  className={`absolute ${snippet.color} text-opacity-20 text-6xl font-mono`}
                  initial={{ opacity: 0 }
                  }
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

            <div className="relative grid lg:grid-cols-9 grid-cols-1 min-h-screen" >
              <div className=" space-y-8 col-span-3 p-8 flex items-center justify-center flex-col text-center bg-gradient-to-br from-transparent to-gray-900/5 shadow-[rgba(0,0,0,0.1)_10px_5px_4px_0px] bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl" >
                <div className="flex items-center justify-center">
                  <Image src="/pp.png" height={200} width={200} className='border-cyan-500 border-2 rounded-full border-dashed' alt="dp" />
                </div>
                <div className="-space-y-4">
                  <motion.h1
                    className="mb-6 text-5xl font-bold text-gray-100"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <span className="text-cyan-500">.</span>ALAMIN
                  </motion.h1>
                  < motion.h2
                    className="mb-6 text-2xl font-semibold text-gray-300"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    Software Developer
                  </motion.h2>
                </div>
                < motion.p
                  className="mb-8 text-sm text-gray-400"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Automating stuff with the magic of code.
                </motion.p>
                <motion.div
                  className="grid grid-cols-2 gap-4 w-full max-w-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <Card className="py-4 text-center bg-cyan-950/10 border-cyan-500/80">
                    <h3 className="text-3xl font-bold text-cyan-300">3+</h3>
                    <p className="text-sm text-gray-300">Years Experience</p>
                  </Card>
                  <Card className="py-4 text-center bg-cyan-950/10 border-cyan-500/80">
                    <h3 className="text-3xl font-bold text-cyan-500">20+</h3>
                    <p className="text-sm text-gray-300">Projects</p>
                  </Card>
                </motion.div>
                < motion.div
                  className="flex justify-center space-x-4 mb-8"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <Link href='https://github.com/un-earthly' target='_blank'>
                    <Button variant="outline" size="icon" >
                      <Github className="h-5 w-5 font-black text-black" />
                      <span className="sr-only" > GitHub </span>
                    </Button>
                  </Link>
                  <Link href="https://www.linkedin.com/in/alamin-md/" target='_blank'>
                    <Button variant="outline" size="icon" >
                      <Linkedin className="h-5 w-5 font-black text-black" />
                      <span className="sr-only" > LinkedIn </span>
                    </Button>
                  </Link>
                  <Link href="mailto:vijayalamin@gmail.com">
                    <Button variant="outline" size="icon" >
                      <Mail className="h-5 w-5 font-black text-black" />
                      <span className="sr-only" > Email </span>
                    </Button>
                  </Link>
                  <Link href="">
                    <Button variant="outline" size="icon" >
                      <FileUser className="h-5 w-5 font-black text-black" />
                      <span className="sr-only" > Email </span>
                    </Button>
                  </Link>
                </motion.div>

              </div>
              <main className="col-span-6 h-screen py-10 overflow-y-scroll">
                {children}
              </main>
            </div>

          </div>

        </div>

      </body>
    </html>
  );
}
