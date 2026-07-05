"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { MobileNav } from "@/components/MobileNav";

const LOGO_URL = "https://images.microcms-assets.io/assets/c8b8e61e61564493aacf4db57409a73b/9613468e4c18416ea1464242bb7fb049/fmosaka_officialsite.png";

const navItems = [
  { href: "/", label: "HOME" },
  { href: "/episodes", label: "EPISODES" },
  { href: "/blog", label: "BLOG" },
  { href: "/about", label: "ABOUT" },
];

function LogoImage() {
  return (
    <div className="relative h-10 w-auto">
      <Image
        src={LOGO_URL}
        alt="FM OSAKA"
        width={160}
        height={40}
        className="h-10 w-auto object-contain"
        priority
      />
    </div>
  );
}

function VUMeter() {
  return (
    <div className="hidden h-9 flex-col-reverse justify-start gap-[2px] md:flex">
      {[...Array(12)].map((_, i) => (
        <span
          key={i}
          className={`h-[2px] w-5 rounded-full ${
            i < 7 ? "bg-fm-green" : i < 9 ? "bg-fm-orange" : "bg-fm-pink"
          }`}
          style={{
            opacity: 0.15 + (i * 0.07),
            animation: "equalizer 0.8s ease-in-out infinite alternate",
            animationDelay: `${i * 0.04}s`,
          }}
        />
      ))}
    </div>
  );
}

function OnAirBadge() {
  return (
    <Link
      href="/episodes"
      className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-fm-pink/30 bg-fm-pink/10 px-4 py-2 transition-all hover:bg-fm-pink/20"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fm-pink" />
        <span className="relative inline-flex h-full w-full rounded-full bg-fm-pink shadow-[0_0_8px_rgba(233,30,140,0.8)]" />
      </span>
      <span className="text-[10px] font-black tracking-[0.2em] text-fm-pink">
        ON AIR
      </span>
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAuthenticated(!!user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      setIsAuthenticated(event === "SIGNED_IN");
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#030305]/85 backdrop-blur-2xl">
      {/* Top gradient line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-fm-pink/40 to-transparent" />

      <div className="relative mx-auto flex h-16 max-w-[90rem] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Subtle noise overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Logo */}
        <Link href="/" className="group relative z-10 flex items-center">
          <LogoImage />
        </Link>

        {/* Navigation */}
        <nav className="relative z-10 hidden items-center gap-1 sm:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative px-4 py-2"
              >
                <span
                  className={cn(
                    "relative z-10 text-[11px] font-black tracking-[0.18em] transition-all duration-300",
                    isActive
                      ? "text-white"
                      : "text-white/45 group-hover:text-white"
                  )}
                >
                  {item.label}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute inset-x-3 bottom-0 h-[2px] rounded-full bg-gradient-to-r from-fm-pink to-fm-blue"
                    style={{ boxShadow: "0 0 12px rgba(233,30,140,0.5)" }}
                  />
                )}
                <span className="absolute inset-0 -z-10 scale-95 rounded-lg bg-white/0 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:bg-white/[0.04] group-hover:opacity-100" />
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="relative z-10 flex items-center gap-4">
          <VUMeter />
          <Link
            href={isAuthenticated ? "/studio/dashboard" : "/studio/login"}
            className="hidden rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[10px] font-black tracking-[0.15em] text-white/70 transition-all hover:border-fm-pink/30 hover:bg-fm-pink/10 hover:text-fm-pink sm:block"
          >
            STUDIO
          </Link>
          <OnAirBadge />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
