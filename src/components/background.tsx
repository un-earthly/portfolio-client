'use client'
import { codeSnippets } from "@/mock-data";
import { useEffect, useState } from "react";
import { motion } from 'framer-motion'


export const AnimatedBackground = ({ mousePosition }: any) => {
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