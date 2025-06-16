import Image from "next/image";
import { motion } from 'framer-motion'
import { socialLinks } from "@/mock-data";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

const MobileInto = () => {
    return (
        <div className="w-full space-y-6">
            {/* Profile Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-black/40 to-gray-900/60 border border-cyan-500/20 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg p-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-2xl font-bold text-gray-100"
                        >
                            MD<span className="text-cyan-500">.</span>ALAMIN
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-sm text-cyan-300/80"
                        >
                            Software Developer
                        </motion.p>
                    </div>

                    <div className="flex gap-4 items-center">
                        <Card className="py-2 px-4 text-center bg-cyan-950/10 border-cyan-500/80">
                            <p className="text-lg font-bold text-cyan-300">3+</p>
                            <p className="text-xs text-gray-400">Years</p>
                        </Card>
                        <Card className="py-2 px-4 text-center bg-cyan-950/10 border-cyan-500/80">
                            <p className="text-lg font-bold text-cyan-500">20+</p>
                            <p className="text-xs text-gray-400">Projects</p>
                        </Card>
                    </div>
                </div>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-sm text-gray-400 border-l-2 border-cyan-500/30 pl-3"
                >
                    Automating stuff with the magic of code
                </motion.p>
            </motion.div>

            {/* Social Links */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center gap-3"
            >
                {socialLinks.map((link, index) => (
                    <Link key={link.href} href={link.href} target='_blank'>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative h-9 w-9 overflow-hidden border border-cyan-300 
                                before:absolute before:inset-0 before:bg-gradient-to-br before:from-cyan-950 before:to-cyan-800
                                after:absolute after:inset-0 after:bg-gradient-to-tl after:from-cyan-950 after:to-cyan-800 after:opacity-0
                                hover:after:opacity-100 hover:scale-110 before:transition-all after:transition-all before:duration-700 after:duration-700
                                before:ease-in-out after:ease-in-out hover:before:opacity-0 transform transition-transform duration-700 ease-in-out"
                        >
                            <link.icon className="h-4 w-4 z-10 text-cyan-300" />
                            <span className="sr-only">{link.label}</span>
                        </Button>
                    </Link>
                ))}
            </motion.div>
        </div>
    );
}

export default MobileInto;