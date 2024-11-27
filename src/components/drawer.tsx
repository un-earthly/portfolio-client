import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CloseSVG from '../icons/close';
import { links } from '@/mock-data';
import NavIcon from '@/icons/navicon';
import Image from 'next/image';

type Props = {
    handler: () => void;
};


function Drawer({ handler }: Props) {
    const path = usePathname().split("/")[1];

    return (
        <div className="fixed inset-0 bg-black min-h-screen w-screen flex items-center justify-center">
            <div className="relative w-full max-w-md px-4 py-6 text-center">
                <nav className="px-4 py-6 text-center text-4xl font-bold ">
                    {links.map(e => (
                        <Link
                            key={e.href}
                            href={e.href}
                            onClick={handler}
                            className={`block mt-8 py-2 cursor-pointer  hover:text-cyan-400 transition-colors duration-200 ease-in-out
                                ${path === e.href.replace("/", "")
                                    ? "text-cyan-400 text-[2em]"
                                    : "text-outline"}`}
                        >
                            {e.label}
                        </Link>
                    ))}
                </nav>
            </div>
            <button
                onClick={handler}
                className="absolute top-10 right-10 p-2 rounded-full hover:bg-gray-800 transition-colors duration-200"
                aria-label="Close menu"
            >
                <CloseSVG />
            </button>
        </div>
    );
}

export default function Navbar() {
    const [menuIsOpen, setMenuIsOpen] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setMenuIsOpen(false);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black">
            <div className="min-w-7xl mx-auto">
                <div className="flex items-center justify-between px-4 md:px-10 py-3">
                    <Link
                        href="/"
                        onClick={scrollToTop}
                        className="text-3xl text-white font-bold hover:opacity-80 transition-opacity duration-200"
                    >
                        {/* MD<span className="text-cyan-400">.</span> */}
                        <Image src='/logo_md.png' alt="logo" height={50} width={50} />
                    </Link>
                    <div className="hover:cursor-pointer">
                        <NavIcon handler={() => setMenuIsOpen(true)} />
                    </div>
                </div>
            </div>

            {menuIsOpen && (
                <div className="fixed inset-0 z-50">
                    <Drawer handler={scrollToTop} />
                </div>
            )}
        </header>
    );
}