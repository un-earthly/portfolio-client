import React from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CloseSVG from '../icons/close';

type Props = {
    handler: () => any
};
export default function Drawer({ handler }: Props) {
    const path = usePathname().split("/")[1]
    return (
        <div className="bg-black h-screen w-screen flex items-center justify-center">
            <div className="px-4 py-6 text-center text-4xl font-bold ">
                <Link passHref
                    href="/"
                    onClick={handler}
                >
                    <p
                        className={`block mt-8 py-2 cursor-pointer  hover:text-cyan-400 transition-colors duration-200 ease-in-out  ${path === "" ? "text-cyan-400 text-[2em]" : "text-outline"}`}
                    >
                        Home
                    </p>
                </Link>
                <Link
                    href="/portfolio"
                    passHref
                    onClick={handler}
                >
                    <p
                        className={`block mt-8 py-2 cursor-pointer  hover:text-cyan-400 transition-colors duration-200 ease-in-out  ${path === "portfolio" ? "text-cyan-400 text-[2em]" : "text-outline"}`}
                    >
                        Portfolio
                    </p>
                </Link>
                <Link
                    onClick={handler}
                    href="/about"
                    passHref>
                    <p
                        className={`block mt-8 py-2 cursor-pointer text-[2em] hover:text-cyan-400 transition-colors duration-200 ease-in-out  ${path === "about" ? "text-cyan-400 text-[2em]" : "text-outline"}`}>
                        About
                    </p>
                </Link>
                <Link
                    onClick={handler}
                    href="/contact"
                    passHref>
                    <p
                        className={`block mt-8 py-2 cursor-pointer  hover:text-cyan-400 transition-colors duration-200 ease-in-out  ${path === "contact" ? "text-cyan-400 text-[2em]" : "text-outline"}`}>
                        Contact
                    </p>
                </Link>
            </div>
            <div onClick={handler} className="absolute top-0 right-0 rounded-full flex items-center justify-center cursor-pointer m-10 hover:bg-gray-50 duration-150 hover:text-red-400 border-2 border-transparent active:scale-90 hover:border-red-500 select-none">
                <CloseSVG />
            </div>
        </div>
    )
}
