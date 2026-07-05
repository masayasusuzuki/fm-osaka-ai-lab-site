"use client";

import { motion, useMotionValue, useTransform, useAnimationFrame } from "framer-motion";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  PointerEvent as ReactPointerEvent,
} from "react";
import {
  Radio,
  Zap,
  Infinity as InfinityIcon,
  Sparkles,
  Clock,
  Bot,
  Repeat,
  Play,
  Disc,
  Wifi,
  Activity,
} from "lucide-react";

const noiseSvg =
  'data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23n)"/%3E%3C/svg%3E';

/* ────────────────────────────────────────────────────────────────
   Animated audio bar
   ─────────────────────────────────────────────────────────────── */
function AnimatedBar({
  className,
  style,
  min = 10,
  max = 90,
  durationMin = 0.5,
  durationMax = 1.1,
  seed,
}: {
  className?: string;
  style?: React.CSSProperties;
  min?: number;
  max?: number;
  durationMin?: number;
  durationMax?: number;
  seed: number;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const keyframes = useMemo(() => {
    const rng = seededRandom(seed);
    return Array.from({ length: 6 }, () => `${(min + rng() * (max - min)).toFixed(2)}%`);
  }, [seed, min, max]);

  const duration = useMemo(() => {
    const rng = seededRandom(seed + 1000);
    return durationMin + rng() * (durationMax - durationMin);
  }, [seed, durationMin, durationMax]);

  if (!mounted) {
    return <div className={className} style={{ height: keyframes[0] }} />;
  }

  return (
    <motion.div
      className={className}
      style={{ willChange: "height", ...style }}
      initial={{ height: keyframes[0] }}
      animate={{ height: keyframes }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
        delay: seededRandom(seed + 2000)() * -duration,
      }}
    />
  );
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = Math.sin(s * 12.9898 + 78.233) * 43758.5453;
    return s - Math.floor(s);
  };
}

/* ────────────────────────────────────────────────────────────────
   Interactive Knob
   ─────────────────────────────────────────────────────────────── */
function InteractiveKnob({
  defaultValue = 50,
  accent,
  size = 44,
  label,
}: {
  defaultValue?: number;
  accent: string;
  size?: number;
  label?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromEvent = useCallback(
    (e: PointerEvent | ReactPointerEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const x = ("clientX" in e ? e.clientX : 0) - cx;
      const y = ("clientY" in e ? e.clientY : 0) - cy;
      let deg = (Math.atan2(y, x) * 180) / Math.PI + 90;
      if (deg < 0) deg += 360;
      // map 135..225 dead-zone to nearest end
      let v = ((deg - 135) / 270) * 100;
      if (deg > 135 && deg < 225) v = deg < 180 ? 0 : 100;
      v = Math.max(0, Math.min(100, v));
      setValue(v);
    },
    []
  );

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    (e.target as Element).setPointerCapture(e.pointerId);
    updateFromEvent(e);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragging.current) updateFromEvent(e);
  };
  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    (e.target as Element).releasePointerCapture(e.pointerId);
  };

  const rotation = -135 + (value / 100) * 270;
  const glow = `0 0 ${8 + value * 0.12}px ${accent}`;

  return (
    <div className="flex flex-col items-center gap-1.5 select-none">
      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="relative cursor-grab touch-none rounded-full border border-white/10 active:cursor-grabbing"
        style={{
          width: size,
          height: size,
          background:
            "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.16), rgba(0,0,0,0.45) 60%), linear-gradient(145deg, #1a1a22, #0d0d11)",
          boxShadow:
            "inset 0 3px 8px rgba(0,0,0,0.85), 0 2px 0 rgba(255,255,255,0.06), 0 8px 20px rgba(0,0,0,0.4)",
        }}
      >
        <svg className="absolute inset-0" viewBox="0 0 40 40" fill="none">
          <circle
            cx="20"
            cy="20"
            r="18"
            stroke="white"
            strokeOpacity="0.06"
            strokeWidth="2"
            strokeDasharray="2 4"
          />
        </svg>
        <div
          className="absolute left-1/2 top-1/2 h-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: size * 0.62,
            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
            transformOrigin: "center",
          }}
        >
          <div
            className="absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full"
            style={{ background: accent, boxShadow: glow }}
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(from 225deg, transparent 0deg, ${accent}22 ${(value / 100) * 270}deg, transparent ${
              (value / 100) * 270
            }deg)`,
          }}
        />
      </div>
      {label && (
        <span className="text-[8px] font-bold tracking-widest text-white/40">
          {label}
        </span>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Interactive Fader
   ─────────────────────────────────────────────────────────────── */
function InteractiveFader({ defaultValue = 66 }: { defaultValue?: number }) {
  const [value, setValue] = useState(defaultValue);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromEvent = useCallback((e: PointerEvent | ReactPointerEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const y = ("clientY" in e ? e.clientY : 0) - rect.top;
    const pct = Math.max(0, Math.min(100, (y / rect.height) * 100));
    setValue(100 - pct);
  }, []);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    (e.target as Element).setPointerCapture(e.pointerId);
    updateFromEvent(e);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragging.current) updateFromEvent(e);
  };
  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    (e.target as Element).releasePointerCapture(e.pointerId);
  };

  return (
    <div className="relative flex h-44 items-center justify-center py-2">
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="relative h-full w-2 cursor-pointer rounded-full bg-[#07070a] shadow-[inset_0_0_10px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.06)]"
      >
        <div
          className="pointer-events-none absolute inset-x-[-10px] opacity-35"
          style={{
            background:
              "repeating-linear-gradient(to bottom, transparent 0, transparent 12px, rgba(255,255,255,0.18) 13px, transparent 14px)",
          }}
        />
        <div
          className="absolute left-1/2 z-10 h-9 w-12 -translate-x-1/2 rounded-lg border border-white/20 bg-gradient-to-b from-[#2e2e38] to-[#141418] shadow-[0_0_22px_rgba(233,30,140,0.4),inset_0_1px_0_rgba(255,255,255,0.22)]"
          style={{ top: `${100 - value}%`, transform: "translate(-50%, -50%)" }}
        >
          <div className="absolute inset-x-2 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-fm-pink" />
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   VU Meter
   ─────────────────────────────────────────────────────────────── */
function VUMeter({ delay = false }: { delay?: boolean }) {
  return (
    <div className="relative h-full w-2 overflow-hidden rounded-full bg-[#07070a] shadow-[inset_0_0_6px_rgba(0,0,0,0.9)]">
      <motion.div
        initial={{ height: "20%" }}
        animate={{ height: ["20%", "85%", "45%", "95%", "30%"] }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          repeatType: "reverse",
          delay: delay ? 0.2 : 0,
        }}
        className="absolute bottom-0 left-0 right-0 rounded-full"
        style={{
          background:
            "linear-gradient(to top, #39B54A 0%, #FFD400 55%, #E91E8C 85%, #fff 100%)",
          boxShadow: "0 0 10px rgba(233,30,140,0.45)",
        }}
      />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   DJ Channel Strip (left mixer column)
   ─────────────────────────────────────────────────────────────── */
function MixerStrip() {
  return (
    <div
      className="hidden flex-col rounded-[26px] border border-white/[0.09] p-3 lg:flex"
      style={{
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01)), rgba(12,13,18,0.92)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.09), inset 0 -1px 0 rgba(0,0,0,0.7), 0 28px 90px rgba(0,0,0,0.5)",
      }}
    >
      <div className="flex items-center justify-center rounded-xl border border-fm-pink/25 bg-fm-pink/10 py-2">
        <span className="text-[10px] font-black tracking-[0.18em] text-fm-pink [text-shadow:0_0_12px_rgba(233,30,140,0.5)]">
          ON AIR
        </span>
      </div>

      <div className="mt-4 flex flex-1 flex-col items-center gap-4">
        <InteractiveKnob label="HI" defaultValue={72} accent="#E91E8C" />
        <InteractiveKnob label="MID" defaultValue={55} accent="#E91E8C" />
        <InteractiveKnob label="LOW" defaultValue={68} accent="#E91E8C" />
      </div>

      <div className="my-3 flex flex-col items-center gap-1.5 border-y border-white/5 py-3">
        <InteractiveKnob label="GAIN" defaultValue={80} accent="#00AEEF" size={36} />
      </div>

      <InteractiveFader defaultValue={66} />

      <div className="mt-3 flex flex-col gap-2">
        <button className="rounded-xl border border-white/10 bg-white/[0.05] py-2.5 text-[10px] font-black tracking-[0.15em] text-white/70 transition hover:bg-white/10">
          CUE
        </button>
        <button className="flex h-11 items-center justify-center rounded-xl bg-fm-pink text-black shadow-[0_0_24px_-4px_rgba(233,30,140,0.55)] transition-transform hover:scale-105">
          <Play className="ml-0.5 h-4 w-4 fill-current" />
        </button>
      </div>

      <div className="mt-3 flex h-20 justify-center gap-1.5 rounded-xl bg-black/40 p-2">
        <VUMeter />
        <VUMeter delay />
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Main display / turntable card
   ─────────────────────────────────────────────────────────────── */
function EpisodesPanel() {
  const rotation = useMotionValue(0);
  const autoRotate = useMotionValue(0);

  useAnimationFrame((_, delta) => {
    autoRotate.set(autoRotate.get() + delta * 0.045);
  });

  const rotate = useTransform(() => (rotation.get() + autoRotate.get()) % 360);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative flex min-h-[440px] flex-col justify-between overflow-hidden rounded-[28px] border border-white/[0.09] p-6 sm:p-8"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.015)), rgba(11,12,17,0.88)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.09), 0 0 0 1px rgba(255,0,140,0.12), 0 32px 100px rgba(255,0,120,0.1)",
      }}
    >
      {/* Subtle grooves */}
      <div
        className="pointer-events-none absolute -left-24 -top-12 rounded-full"
        style={{
          width: 520,
          height: 520,
          background: `
            radial-gradient(circle, transparent 0 24%, rgba(255,255,255,0.05) 25%, transparent 26%),
            repeating-radial-gradient(
              circle,
              rgba(255,255,255,0.04) 0,
              rgba(255,255,255,0.04) 1px,
              transparent 2px,
              transparent 8px
            )
          `,
          opacity: 0.45,
          maskImage: "radial-gradient(circle, black 0 54%, transparent 68%)",
          WebkitMaskImage: "radial-gradient(circle, black 0 54%, transparent 68%)",
        }}
      />

      {/* Turntable (static rim + rotating vinyl + static sheen + tonearm) */}
      <div className="absolute right-[-60px] top-1/2 z-0 h-[340px] w-[340px] -translate-y-1/2 sm:right-[-20px] lg:h-[400px] lg:w-[400px]">
        {/* Metal platter rim (static, brushed metal) */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, #43434e, #17171d 20%, #4a4a56 40%, #131318 60%, #3d3d48 80%, #43434e)",
            boxShadow:
              "0 30px 90px rgba(0,0,0,0.65), inset 0 2px 5px rgba(255,255,255,0.28), inset 0 -5px 14px rgba(0,0,0,0.85)",
          }}
        />
        {/* Strobe dots on rim (static) */}
        <div className="absolute inset-0 rounded-full">
          {[...Array(36)].map((_, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-[5px] h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-white/50"
              style={{ transformOrigin: "50% calc(min(170px, 195px))", transform: `rotate(${i * 10}deg)` }}
            />
          ))}
        </div>

        {/* Rotating vinyl */}
        <motion.div
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          onDrag={(_, info) => rotation.set(rotation.get() + info.delta.x * 1.5)}
          className="pointer-events-auto absolute inset-[16px] cursor-grab rounded-full active:cursor-grabbing"
          style={{
            rotate,
            background: `
              repeating-radial-gradient(circle, rgba(255,255,255,0.085) 0, rgba(255,255,255,0.085) 1px, rgba(0,0,0,0.35) 2px, transparent 3px, transparent 5px),
              repeating-radial-gradient(circle, transparent 0, transparent 22px, rgba(255,255,255,0.05) 23px, transparent 24px, transparent 46px),
              radial-gradient(circle, #16161c 0 20%, #0b0b0f 60%, #101016 100%)
            `,
            boxShadow: "inset 0 0 60px rgba(0,0,0,0.9), 0 0 0 1px rgba(0,0,0,0.8)",
          }}
        >
          {/* Label（レコード盤面ラベル） */}
          <div
            className="absolute left-1/2 top-1/2 h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 38% 32%, rgba(255,255,255,0.22), transparent 45%), conic-gradient(from 40deg, #E91E8C, #B0176D 30%, #E91E8C 55%, #8f1258 80%, #E91E8C)",
              boxShadow: "inset 0 0 14px rgba(0,0,0,0.45), 0 0 0 2px rgba(0,0,0,0.6)",
            }}
          >
            {/* 円周テキスト */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
              <defs>
                <path id="labelArc" d="M 50,50 m -34,0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0" />
              </defs>
              <text className="fill-white/85 text-[8.5px] font-black tracking-[0.32em]">
                <textPath href="#labelArc">FM OSAKA • AI LAB • 851 •</textPath>
              </text>
            </svg>
            {/* スピンドル */}
            <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-[#e8e8ee] to-[#7a7a85] shadow-[0_0_6px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.8)]" />
          </div>
        </motion.div>

        {/* Static light sheen（回転しない光の反射 = リアルさの要） */}
        <div
          className="pointer-events-none absolute inset-[16px] rounded-full"
          style={{
            background:
              "conic-gradient(from 200deg, rgba(255,255,255,0.16) 0deg, transparent 45deg, transparent 150deg, rgba(255,255,255,0.07) 185deg, transparent 235deg, transparent 360deg)",
          }}
        />

      </div>

      {/* Glows */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-fm-pink/12 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-fm-blue/10 blur-[80px]" />

      {/* Sheen */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)",
        }}
      />

      {/* Header */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-[family-name:var(--font-display)] text-[12px] tracking-[0.26em] text-fm-pink [text-shadow:0_0_18px_rgba(255,42,163,0.45)]">
            EPISODES
          </span>
        </div>
        <div className="hidden items-center gap-4 rounded-lg border border-white/10 bg-black/30 px-4 py-1.5 font-mono text-[10px] font-bold tracking-wider text-white/50 sm:flex">
          <span>BPM 128</span>
          <span className="text-fm-pink">KEY 7A</span>
          <span>-04:12</span>
        </div>
      </div>

      {/* Main text */}
      <div className="relative z-10 mt-4">
        {/* ゴーストテキスト（アウトラインのみ） */}
        <span
          aria-hidden
          className="pointer-events-none absolute -top-10 left-16 select-none text-[120px] font-black italic leading-none tracking-tighter opacity-[0.06] sm:text-[150px]"
          style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.9)", color: "transparent" }}
        >
          LAB
        </span>
        <div className="flex items-end gap-3">
          <p
            className="font-[family-name:var(--font-display)] bg-gradient-to-br from-white via-white to-fm-pink bg-clip-text text-8xl italic leading-none tracking-tight text-transparent sm:text-9xl"
            style={{ filter: "drop-shadow(0 0 28px rgba(233,30,140,0.35))" }}
          >
            4
          </p>
          <span className="mb-2 inline-block -rotate-6 rounded-md bg-fm-pink px-2 py-0.5 text-[10px] font-black tracking-[0.2em] text-black shadow-[0_0_18px_rgba(233,30,140,0.6)]">
            EXPERIMENTS
          </span>
        </div>
        <p className="mt-2 text-2xl font-black tracking-[0.14em] text-white/95">
          回のAI実験
          <span className="ml-3 inline-block h-[3px] w-16 -translate-y-1 rounded-full bg-gradient-to-r from-fm-pink to-fm-blue align-middle" />
        </p>
        <p className="mt-3 max-w-md text-[14px] leading-[1.9] text-white/[0.7]">
          音声→ブログ生成、情報収集、重複チェック・リマインド、AIゲスト対談。ラジオ制作の現場にAIを組み込んだ4つのテーマ。
        </p>
      </div>

      {/* Waveform */}
      <div className="relative mt-6 hidden h-14 max-w-sm items-end gap-[3px] rounded-xl border border-white/10 bg-black/30 px-4 py-2 sm:flex">
        {[...Array(40)].map((_, i) => (
          <AnimatedBar
            key={i}
            seed={i}
            min={15}
            max={85}
            durationMin={0.4}
            durationMax={0.9}
            className="w-1 rounded-full bg-fm-pink/80"
            style={{ boxShadow: "0 0 8px rgba(233,30,140,0.35)" }}
          />
        ))}
        <div className="absolute left-[62%] top-0 h-full w-0.5 bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
      </div>

      {/* EP pads */}
      <div className="relative z-10 mt-6 flex flex-wrap gap-2">
        {["EP01", "EP02", "EP03", "EP04"].map((ep, i) => (
          <motion.span
            key={ep}
            whileHover={{ scale: 1.05 }}
            className={`rounded-xl border px-4 py-2 text-[11px] font-black tracking-wider transition-all ${
              i === 0
                ? "border-fm-pink bg-fm-pink/15 text-fm-pink shadow-[0_0_20px_-4px_rgba(233,30,140,0.45)]"
                : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/[0.08]"
            }`}
          >
            {ep}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Right rack units
   ─────────────────────────────────────────────────────────────── */
function ToolsCard() {
  const pads = [
    { icon: Bot, label: "AI", active: true },
    { icon: Repeat, label: "LOOP" },
    { icon: Clock, label: "TIME" },
    { icon: Sparkles, label: "FX" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
      whileHover={{ y: -3 }}
      className="group relative overflow-hidden rounded-[24px] border border-white/[0.09] p-5"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.055), rgba(255,255,255,0.01)), rgba(11,12,17,0.88)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.09), inset 0 -1px 0 rgba(0,0,0,0.65), 0 24px 80px rgba(0,0,0,0.42)",
      }}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-fm-orange/12 blur-[60px]" />

      <div className="pointer-events-none absolute right-3 top-3 flex h-16 flex-col-reverse gap-[2px]">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="w-1.5 rounded-full"
            style={{
              height: 4,
              background:
                i > 6
                  ? "rgba(233,30,140,0.6)"
                  : i > 3
                    ? "rgba(255,212,0,0.5)"
                    : "rgba(57,181,74,0.4)",
              boxShadow: i > 7 ? "0 0 8px rgba(233,30,140,0.5)" : undefined,
            }}
          />
        ))}
      </div>

      <div className="relative flex items-start justify-between">
        <span className="text-[10px] font-black tracking-[0.2em] text-white/40">AI LAB TOOLS</span>
      </div>

      <div className="relative mt-5">
        <p className="font-[family-name:var(--font-display)] text-4xl leading-none tracking-[0.02em] text-white">AI</p>
        <p className="font-[family-name:var(--font-display)] text-sm tracking-[0.24em] text-fm-orange">TOOLS</p>
      </div>

      <div className="relative mt-5 grid grid-cols-4 gap-2">
        {pads.map(({ icon: Icon, label, active }, i) => (
          <div
            key={i}
            className={`flex flex-col items-center gap-1.5 rounded-xl border py-2.5 transition-all ${
              active
                ? "border-fm-orange/40 bg-fm-orange/15 shadow-[0_0_16px_-4px_rgba(247,147,30,0.45)]"
                : "border-white/10 bg-white/5 hover:bg-white/[0.08]"
            }`}
          >
            <Icon className={`h-4 w-4 ${active ? "text-fm-orange" : "text-white/60"}`} />
            <span className={`text-[8px] font-bold tracking-wider ${active ? "text-fm-orange" : "text-white/50"}`}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <svg
        className="pointer-events-none absolute bottom-3 left-3 h-10 w-24 opacity-15"
        viewBox="0 0 96 32"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 16 Q 8 4, 16 16 T 32 16 T 48 16 T 64 16 T 80 16 T 96 16"
          stroke="#F7931E"
          strokeWidth="2"
        />
      </svg>
    </motion.div>
  );
}

function PossibilitiesCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
      whileHover={{ y: -3 }}
      className="group relative overflow-hidden rounded-[24px] border border-white/[0.09] p-5"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.055), rgba(255,255,255,0.01)), rgba(11,12,17,0.88)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.09), inset 0 -1px 0 rgba(0,0,0,0.65), 0 24px 80px rgba(0,0,0,0.42)",
      }}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-fm-blue/12 blur-[60px]" />

      <div className="pointer-events-none absolute right-3 top-3 flex gap-2">
        <InteractiveKnob defaultValue={62} accent="#00AEEF" size={30} />
        <InteractiveKnob defaultValue={38} accent="#00AEEF" size={30} />
      </div>

      <div className="relative flex items-start justify-between">
        <span className="text-[10px] font-black tracking-[0.2em] text-white/40">NEW VALUE</span>
      </div>

      <div className="relative mt-5">
        <p className="font-[family-name:var(--font-display)] text-2xl tracking-[0.08em] text-white">POSSIBILITIES</p>
        <p className="mt-2 text-[14px] leading-[1.9] text-white/[0.7]">
          リスナー・スタッフ双方に新しい価値を。
        </p>
      </div>

      <div className="pointer-events-none absolute -bottom-12 -right-12 opacity-20">
        <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
          <circle cx="80" cy="80" r="70" stroke="#00AEEF" strokeWidth="1" opacity="0.4" />
          <circle cx="80" cy="80" r="55" stroke="#00AEEF" strokeWidth="1" opacity="0.3" />
          <circle cx="80" cy="80" r="40" stroke="#00AEEF" strokeWidth="1" opacity="0.2" />
          <circle cx="80" cy="80" r="25" stroke="#00AEEF" strokeWidth="1" opacity="0.15" />
        </svg>
      </div>

      <div className="pointer-events-none absolute -bottom-4 -right-4 opacity-10 transition-transform duration-500 group-hover:scale-110">
        <InfinityIcon className="h-24 w-24 text-fm-blue" />
      </div>
    </motion.div>
  );
}

function AutomationCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.3 }}
      whileHover={{ y: -3 }}
      className="group relative overflow-hidden rounded-[24px] border border-white/[0.09] p-5"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.055), rgba(255,255,255,0.01)), rgba(11,12,17,0.88)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.09), inset 0 -1px 0 rgba(0,0,0,0.65), 0 24px 80px rgba(0,0,0,0.42)",
      }}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-fm-green/12 blur-[60px]" />

      <div className="relative flex items-start justify-between">
        <span className="text-[10px] font-black tracking-[0.2em] text-white/40">AUTOMATION</span>
      </div>

      <div className="relative mt-5 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="font-[family-name:var(--font-display)] text-4xl leading-none tracking-[0.02em] text-white">24h</p>
          <p className="font-[family-name:var(--font-display)] text-sm tracking-[0.24em] text-fm-green">AUTOMATION</p>
          <p className="mt-2 max-w-[200px] text-[13px] leading-[1.9] text-white/[0.7]">
            放送後すぐにブログ・SNS投稿・サムネイルを生成し、サイトへ公開。
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="relative h-16 w-16">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="15" stroke="white" strokeOpacity="0.1" strokeWidth="3" />
              <motion.circle
                cx="18"
                cy="18"
                r="15"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray="75 100"
                className="text-fm-green"
                initial={{ strokeDashoffset: 100 }}
                whileInView={{ strokeDashoffset: 25 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <line
                  key={deg}
                  x1="18"
                  y1="3"
                  x2="18"
                  y2="5"
                  stroke="white"
                  strokeOpacity="0.15"
                  strokeWidth="1"
                  transform={`rotate(${deg} 18 18)`}
                />
              ))}
            </svg>
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-black text-fm-green">
              75%
            </span>
          </div>
          <div className="h-1.5 w-20 rounded-full bg-white/10">
            <div className="h-full w-3/4 rounded-full bg-fm-green shadow-[0_0_10px_rgba(57,181,74,0.6)]" />
          </div>
          <span className="text-[9px] font-bold tracking-wider text-white/40">作業時間削減イメージ</span>
        </div>
      </div>

      <div className="relative mt-5 rounded-lg border border-white/10 bg-black/30 p-3">
        <div className="mb-2 flex justify-between text-[9px] font-bold tracking-wider text-white/40">
          <span>BROADCAST</span>
          <span>PUBLISH</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/10">
          <motion.div
            initial={{ width: "0%" }}
            whileInView={{ width: "82%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="h-full rounded-full bg-gradient-to-r from-fm-green via-fm-blue to-fm-pink"
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Bottom spectrum analyzer
   ─────────────────────────────────────────────────────────────── */
function WaveformStrip() {
  return (
    <div
      className="relative mt-5 flex h-[92px] items-end justify-between gap-[3px] overflow-hidden rounded-[24px] border border-white/[0.08] px-5 py-4"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01)), rgba(8,10,14,0.78)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 18px 50px rgba(0,0,0,0.35)",
      }}
    >
      <div className="pointer-events-none absolute left-4 top-3 flex items-center gap-2 text-[9px] font-black tracking-wider text-white/40">
        <Activity className="h-3 w-3 text-fm-pink" />
        <span>MASTER OUT</span>
      </div>
      <div className="pointer-events-none absolute right-4 top-3 flex items-center gap-2 text-[9px] font-black tracking-wider text-white/40">
        <Wifi className="h-3 w-3 text-fm-green" />
        <span>LIVE</span>
      </div>

      {[...Array(80)].map((_, i) => (
        <AnimatedBar
          key={i}
          seed={i + 500}
          min={12}
          max={100}
          durationMin={0.5}
          durationMax={1.2}
          className="w-[3px] rounded-full"
          style={{
            background: "linear-gradient(180deg, #8cff4a 0%, #00b7ff 55%, #ff1493 100%)",
            boxShadow: "0 0 10px rgba(0,180,255,0.45)",
          }}
        />
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Main section
   ─────────────────────────────────────────────────────────────── */
export function StatsSection() {
  return (
    <section className="mx-auto w-full max-w-[90rem] px-2 sm:px-4 lg:px-5">
      <div
        className="relative overflow-hidden rounded-[28px] border border-white/[0.08] p-3 shadow-2xl sm:p-4 lg:p-5"
        style={{
          background: `
            radial-gradient(circle at 18% 8%, rgba(255, 0, 140, 0.18), transparent 30%),
            radial-gradient(circle at 82% 85%, rgba(0, 180, 255, 0.12), transparent 32%),
            radial-gradient(circle at 50% 50%, rgba(247,147,30,0.04), transparent 55%),
            linear-gradient(135deg, #050509 0%, #0c0c12 45%, #040406 100%)
          `,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 40px 120px rgba(0,0,0,0.55)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{ backgroundImage: `url("${noiseSvg}")` }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative grid grid-cols-1 gap-3 lg:grid-cols-[110px_1.45fr_1fr]">
          <MixerStrip />
          <EpisodesPanel />
          <div className="grid grid-cols-1 gap-3">
            <ToolsCard />
            <PossibilitiesCard />
            <AutomationCard />
          </div>
        </div>

        <WaveformStrip />
      </div>
    </section>
  );
}
