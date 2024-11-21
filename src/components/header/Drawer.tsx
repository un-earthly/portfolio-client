'use client'
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import CloseSVG from '../icons/close';
import { links } from '@/mock-data';

type Props = {
    handler: () => any
};
export default function Drawer({ handler }: Props) {
    const router = useRouter();
    const [currentPath, setCurrentPath] = useState('');

    useEffect(() => {
        setCurrentPath(router.pathname.split("/")[1]);
    }, [router.pathname]);
    return (
        <div className="bg-black h-screen w-screen flex items-center justify-center">
            <div className="px-4 py-6 text-center text-4xl font-bold ">
                {links.map(e => <Link passHref
                    href={e.href}
                    className={`block mt-8 py-2 cursor-pointer  hover:text-cyan-400 transition-colors duration-200 ease-in-out  ${currentPath === e.href ? "text-cyan-400 text-[2em]" : "text-outline"}`}
                >
                    {e.label}
                </Link>)}

            </div>
            <div onClick={handler} className="absolute top-0 right-0 rounded-full flex items-center justify-center cursor-pointer m-10 hover:bg-gray-50 duration-150 hover:text-red-400 border-2 border-transparent active:scale-90 hover:border-red-500 select-none">
                <CloseSVG />
            </div>
        </div>
    )
}
