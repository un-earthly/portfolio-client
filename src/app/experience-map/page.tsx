"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function WorldLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black gap-4">
      <div className="w-40 h-px bg-linear-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
      <p className="text-cyan-400 text-xs tracking-[0.3em] uppercase font-mono">
        Initialising world
      </p>
      <div className="w-40 h-px bg-linear-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
    </div>
  );
}

const HUD = dynamic(
  () => import("@/components/ExperienceMap/HUD"),
  { ssr: false, loading: () => <WorldLoader /> }
);

export default function ExperienceMapPage() {
  return (
    <>
      <HUD />
      <Link
        href="/"
        className="fixed top-4 left-4 z-50 flex items-center gap-1.5 text-[10px] font-mono text-cyan-400/70 hover:text-cyan-300 transition-colors tracking-widest uppercase pointer-events-auto"
      >
        <ArrowLeft size={12} />
        Exit map
      </Link>
    </>
  );
}
