'use client'
import { codeSnippets } from "@/mock-data";
import { useEffect, useState } from "react";
import { motion } from 'framer-motion'

const AnimatedBackground = ({ mousePosition }: any) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const getColor = (colorClass: string) => {
        switch (colorClass) {
            case 'text-green-400':
                return '#4ADE80';
            case 'text-blue-400':
                return '#60A5FA';
            case 'text-yellow-400':
                return '#FACC15';
            case 'text-pink-400':
                return '#F472B6';
            case 'text-purple-400':
                return '#C084FC';
            default:
                return '#FFFFFF';
        }
    };

    return (
        <>
            {codeSnippets.map((snippet, index) => (
                <motion.div
                    key={index}
                    className="absolute text-6xl font-mono"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        color: getColor(snippet.color),
                        opacity: 0,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: 0.2,
                        x: mousePosition.x * 0.02 + Math.random() * 100 - 50,
                        y: mousePosition.y * 0.02 + Math.random() * 100 - 50,
                        rotate: Math.random() * 360,
                    }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
                >
                    {snippet.content}
                </motion.div>
            ))}
        </>
    );
};

export default AnimatedBackground;