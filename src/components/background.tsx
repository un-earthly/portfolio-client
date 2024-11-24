'use client'
import { codeSnippets } from "@/mock-data";
import { useEffect, useState } from "react";
import { motion } from 'framer-motion';

const AnimatedBackground = ({ mousePosition }: any) => {
    const [mounted, setMounted] = useState(false);
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });

    useEffect(() => {
        setMounted(true);

        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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

    const getFontSize = () => {
        if (windowSize.width < 640) return 'text-2xl'; // Mobile
        if (windowSize.width < 1024) return 'text-4xl'; // Tablet
        return 'text-6xl'; // Desktop
    };

    const getMovementRange = () => {
        if (windowSize.width < 640) return 0.01; // Smaller movement on mobile
        if (windowSize.width < 1024) return 0.015; // Medium movement on tablet
        return 0.02; // Full movement on desktop
    };

    const getInitialPosition = () => {
        // Ensure snippets don't spawn too close to edges on mobile
        const padding = windowSize.width < 640 ? 20 : 0;
        return {
            x: padding + Math.random() * (windowSize.width - 2 * padding),
            y: padding + Math.random() * (windowSize.height - 2 * padding),
        };
    };

    return (
        <>
            {codeSnippets.map((snippet, index) => {
                const position = getInitialPosition();
                return (
                    <motion.div
                        key={index}
                        className={`absolute font-mono ${getFontSize()}`}
                        style={{
                            left: position.x,
                            top: position.y,
                            color: getColor(snippet.color),
                            opacity: 0,
                        }}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: 0.2,
                            x: mousePosition.x * getMovementRange() + Math.random() * (windowSize.width * 0.1) - (windowSize.width * 0.05),
                            y: mousePosition.y * getMovementRange() + Math.random() * (windowSize.height * 0.1) - (windowSize.height * 0.05),
                            rotate: Math.random() * 360,
                        }}
                        transition={{
                            duration: windowSize.width < 640 ? 4 : 3, // Slower animations on mobile
                            repeat: Infinity,
                            repeatType: 'reverse'
                        }}
                    >
                        {snippet.content}
                    </motion.div>
                )
            }
            )}
        </>
    );
};

export default AnimatedBackground;