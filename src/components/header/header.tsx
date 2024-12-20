import Link from "next/link";
import React, { useState } from "react";
import NavIcon from "../icons/navicon";
import Drawer from "./Drawer";
import Image from "next/image";

const Header = () => {
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
  return (
    <section className="relative z-50 bg-black py-3">
      <div className="flex items-center justify-between px-10">
        <Link href="/">
          {/* <p className="text-3xl text-white font-bold cursor-pointer">MD<span className="text-cyan-400">.</span></p> */}
          <Image src='/logo_md.png' alt="logo" height={100} width={100} />
        </Link>
        <div className="flex cursor-pointer flex-wrap items-center justify-between py-4 gap-4">
          <NavIcon handler={() => setMenuIsOpen(true)} />
        </div>
      </div>
      <div className={`absolute duration-300 top-0 ${!menuIsOpen ? "right-full " : "right-0"}`}>
        <Drawer handler={() => setMenuIsOpen(false)} />
      </div>
    </section>
  );
};

export default Header;