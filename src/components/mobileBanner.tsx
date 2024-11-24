import Image from "next/image";
import { motion } from 'framer-motion'
import { socialLinks } from "@/mock-data";
import Link from "next/link";


const MobileInto = () => <div className="w-11/12 mx-auto bg-gradient-to-br from-black/40 to-gray-900/60 border border-cyan-500/20 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg">
    <div className="p-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                {/* <div className="relative">
                    <Image
                        src="/pp.png"
                        height={50}
                        width={50}
                        className="rounded-full border-2 border-cyan-500 border-dashed"
                        alt="Profile"
                    />
                </div> */}
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

export default MobileInto;