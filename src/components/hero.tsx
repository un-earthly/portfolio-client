'use client'

import { motion } from 'framer-motion'
import React, { useState, useEffect } from 'react'
import { Button, } from "@/components/ui/button"
import { FileUser, Github, Linkedin, Mail } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
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

            <div className="relative flex items-center justify-center min-h-screen" >
                <div className="max-w-4xl p-8 text-center bg-gradient-to-br from-transparent to-gray-900/5 shadow-[rgba(0,0,0,0.1)_10px_5px_4px_0px] bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl" >
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
                    < motion.p
                        className="mb-8 text-xl text-gray-400"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        Crafting elegant solutions with React, Node.js, and TypeScript.
                        Passionate about clean code and innovative web experiences.
                    </motion.p>
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
            </div>
        </div>
    )
}