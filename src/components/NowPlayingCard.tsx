"use client";

import { motion } from "framer-motion";
import { Radio, Play } from "lucide-react";

function Equalizer() {
  return (
    <div className="flex items-end gap-[3px] h-12">
      {[...Array(18)].map((_, i) => (
        <motion.span
          key={i}
          className="w-1 rounded-full bg-gradient-to-t from-fm-pink to-fm-blue"
          animate={{
            height: ["20%", "85%", "35%", "100%", "25%"],
          }}
          transition={{
            duration: 0.7 + ((i * 0.11) % 0.5),
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: i * 0.04,
          }}
        />
      ))}
    </div>
  );
}

function Vinyl() {
  return (
    <div className="relative h-20 w-20 shrink-0 animate-[spin_8s_linear_infinite]">
      {/* Outer disc */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neutral-700 via-neutral-900 to-black shadow-2xl" />
      {/* Grooves */}
      <div className="absolute inset-1 rounded-full border border-white/5" />
      <div className="absolute inset-3 rounded-full border border-white/5" />
      <div className="absolute inset-5 rounded-full border border-white/10 bg-gradient-to-br from-fm-pink/30 to-fm-blue/20" />
      {/* Label */}
      <div className="absolute inset-[2.2rem] rounded-full border-2 border-white/10 bg-background shadow-inner" />
      <div className="absolute inset-[2.55rem] rounded-full bg-fm-pink/80" />
    </div>
  );
}

export function NowPlayingCard() {
  return (
    <div className="relative w-full overflow-hidden bg-black p-6 text-white sm:p-8">
      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-fm-pink/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-fm-blue/20 blur-3xl" />

      {/* Subtle grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse at center, black, transparent 75%)",
        }}
      />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-5">
          <Vinyl />
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fm-pink" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-fm-pink" />
              </span>
              <span className="text-[10px] font-black tracking-[0.25em] text-fm-pink sm:text-xs">
                NOW ON AIR
              </span>
            </div>
            <h3 className="text-2xl font-black tracking-tight sm:text-3xl">
              AI Coaching Buddy
            </h3>
            <p className="mt-1 text-xs text-white/50 sm:text-sm">
              iDoBuddy・イドバタニュース内コーナー / 全4回
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-5 lg:justify-end">
          <Equalizer />
          <button className="group relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-[0_0_30px_-5px_rgba(233,30,140,0.5)] transition-transform hover:scale-110 active:scale-95">
            <Play className="ml-1 h-6 w-6 fill-current transition-transform group-hover:scale-110" />
          </button>
        </div>
      </div>

      {/* Animated progress / waveform strip */}
      <div className="relative mt-7 h-1.5 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-fm-pink via-fm-orange to-fm-blue"
          animate={{ x: ["-120%", "320%"] }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Bottom meta strip */}
      <div className="relative mt-4 flex items-center justify-between text-[10px] font-bold tracking-wider text-white/40">
        <span className="flex items-center gap-1.5">
          <Radio className="h-3 w-3" />
          FM OSAKA AI LAB
        </span>
        <span>LIVE STREAM</span>
      </div>
    </div>
  );
}
