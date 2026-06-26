"use client";
import { usePathname } from "next/navigation";
import MouseTracker from "@/components/MouseTracker";
import Navbar from "@/components/drawer";
import Footer from "@/components/footer";
import { MotionProvider } from "@/components/MotionProvider";

const BARE_ROUTES = ["/experience-map"];

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare = BARE_ROUTES.some((r) => pathname?.startsWith(r));

  if (bare) return <>{children}</>;

  return (
    <>
      <MouseTracker />
      <div className="sticky top-0 z-60 flex items-center justify-center gap-3 bg-cyan-500/10 border-b border-cyan-500/20 backdrop-blur-md px-4 py-2">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
        </span>
        <p className="text-xs font-medium text-cyan-300 tracking-wide">
          Available for new projects &amp; full-time roles
        </p>
        <a
          href="/contact"
          className="text-[10px] font-bold uppercase tracking-widest text-black bg-cyan-400 hover:bg-cyan-300 transition-colors px-3 py-0.5 rounded-full"
        >
          Let&apos;s Talk
        </a>
      </div>
      <MotionProvider>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </MotionProvider>
    </>
  );
}
