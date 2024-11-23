import Image from "next/image";
import { motion } from 'framer-motion'
import { Card } from "./ui/card";
import { socialLinks } from "@/mock-data";
import Link from "next/link";
import { Button } from "./ui/button";
const DesktopAside = () => <div className="w-full h-screen hidden p-4 lg:p-8 lg:flex items-center justify-center flex-col text-center bg-gradient-to-br from-transparent to-gray-900/5 shadow-[rgba(0,0,0,0.1)_10px_5px_4px_0px] bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl">
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


export default DesktopAside