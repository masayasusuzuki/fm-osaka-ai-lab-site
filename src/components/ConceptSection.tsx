"use client";

import { motion } from "framer-motion";
import { Radio, Bot, Sparkles, Mic2 } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { siteDescription } from "@/lib/content";

const highlights = [
  {
    icon: Radio,
    title: "FM大阪 × AI",
    body: "番組「iDoBuddy」の中で、AIをラジオ制作の相棒として活用する実験を公開。",
    color: "text-fm-pink",
    glow: "shadow-fm-pink/20",
    bg: "bg-fm-pink/10",
    delay: 0.1,
  },
  {
    icon: Bot,
    title: "現場の業務に寄り添う",
    body: "音声からブログ生成、情報収集、重複チェック、AIゲスト対談。現場で役立つ4つのテーマ。",
    color: "text-fm-orange",
    glow: "shadow-fm-orange/20",
    bg: "bg-fm-orange/10",
    delay: 0.2,
  },
  {
    icon: Sparkles,
    title: "放送後すぐに成果を公開",
    body: "放送後の音声や企画内容から、AIがブログ・SNS投稿・サムネイルを生成。",
    color: "text-fm-blue",
    glow: "shadow-fm-blue/20",
    bg: "bg-fm-blue/10",
    delay: 0.3,
  },
];

export function ConceptSection() {
  return (
    <section className="mx-auto w-full max-w-[90rem] px-2 sm:px-4 lg:px-5">
      {/* Gradient border wrapper */}
      <div className="relative rounded-[2rem] p-[1px] sm:rounded-[2.5rem]">
        <motion.div
          className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-fm-pink/50 via-fm-orange/20 to-fm-blue/50 opacity-70 blur-sm sm:rounded-[2.5rem]"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative overflow-hidden rounded-[2rem] bg-[#0B0B0B] p-8 shadow-2xl sm:rounded-[2.5rem] sm:p-12 lg:p-16">
          {/* Animated ambient blobs */}
          <div className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-fm-pink/10 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-fm-blue/10 blur-[100px]" />

          {/* Subtle starfield dots */}
          <div className="pointer-events-none absolute inset-0 opacity-30">
            {[...Array(24)].map((_, i) => (
              <span
                key={i}
                className="absolute h-0.5 w-0.5 rounded-full bg-white"
                style={{
                  top: `${10 + (i * 37) % 80}%`,
                  left: `${5 + (i * 53) % 90}%`,
                  opacity: 0.2 + (i % 4) * 0.15,
                }}
              />
            ))}
          </div>

          <div className="relative grid items-center gap-14 lg:grid-cols-2">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-black tracking-widest text-fm-pink backdrop-blur-sm">
                  <Mic2 className="h-3.5 w-3.5" />
                  CONCEPT
                </span>
                <h2 className="mt-5 text-2xl font-black leading-snug tracking-tight sm:text-3xl lg:text-4xl">
                  ラジオの現場に、
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-fm-pink via-fm-orange to-fm-blue">
                    AIという新しい相棒
                  </span>
                  を。
                </h2>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="mt-5 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg"
              >
                {siteDescription}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="mt-6 flex flex-wrap items-center gap-3"
              >
                {["Experiment", "Automate", "Create"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white/70"
                  >
                    {tag}
                  </span>
                ))}

              </motion.div>
            </div>

            {/* Lottie animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mx-auto w-full max-w-[480px] sm:max-w-[580px]"
            >
              <DotLottieReact
                src="https://lottie.host/fbae816f-8ff1-4242-8cc0-cce4cf798193/bkkzb9VPqs.lottie"
                loop
                autoplay
                style={{ width: "100%", height: "auto" }}
              />
            </motion.div>
          </div>

          {/* Bottom highlight cards */}
          <div className="relative mt-14 grid gap-5 sm:grid-cols-3">
            {highlights.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: item.delay }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/25 hover:shadow-2xl"
              >
                {/* Top accent bar */}
                <div
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${
                    idx === 0
                      ? "from-fm-pink to-fm-orange"
                      : idx === 1
                        ? "from-fm-orange to-fm-green"
                        : "from-fm-blue to-fm-pink"
                  }`}
                />

                {/* Decorative glow blob */}
                <div
                  className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full ${item.bg} opacity-20 blur-3xl transition-opacity duration-300 group-hover:opacity-40`}
                />

                {/* Premium SVG decoration */}
                <div
                  className={`pointer-events-none absolute right-3 top-3 ${item.color} opacity-30 transition-all duration-500 group-hover:scale-105 group-hover:opacity-50`}
                >
                  {idx === 0 ? (
                    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="decoGrad1" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="currentColor" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
                        </linearGradient>
                      </defs>
                      <path d="M48 8 A 40 40 0 0 1 88 48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.25" />
                      <path d="M48 20 A 28 28 0 0 1 76 48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
                      <path d="M48 32 A 16 16 0 0 1 64 48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
                      <circle cx="48" cy="48" r="5" fill="currentColor" opacity="0.8" />
                      <rect x="22" y="58" width="52" height="32" rx="10" fill="url(#decoGrad1)" stroke="currentColor" strokeWidth="2" opacity="0.9" />
                      <circle cx="36" cy="74" r="7" fill="currentColor" opacity="0.35" />
                      <rect x="50" y="68" width="16" height="4" rx="2" fill="currentColor" opacity="0.35" />
                      <rect x="50" y="78" width="10" height="4" rx="2" fill="currentColor" opacity="0.35" />
                      <line x1="62" y1="58" x2="74" y2="34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
                      <circle cx="74" cy="34" r="4" fill="currentColor" opacity="0.8" />
                    </svg>
                  ) : idx === 1 ? (
                    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="decoGrad2" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="currentColor" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
                        </linearGradient>
                      </defs>
                      <path d="M16 48 C16 28 32 28 40 48 C48 68 64 68 64 48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.25" fill="none" />
                      <circle cx="18" cy="48" r="9" fill="url(#decoGrad2)" stroke="currentColor" strokeWidth="2" />
                      <circle cx="40" cy="48" r="9" fill="url(#decoGrad2)" stroke="currentColor" strokeWidth="2" />
                      <circle cx="62" cy="48" r="9" fill="url(#decoGrad2)" stroke="currentColor" strokeWidth="2" />
                      <circle cx="18" cy="48" r="3" fill="currentColor" opacity="0.6" />
                      <rect x="36" y="44" width="8" height="8" rx="2" fill="currentColor" opacity="0.6" />
                      <path d="M58 46 L62 42 L66 46 L62 50 Z" fill="currentColor" opacity="0.6" />
                      <circle cx="80" cy="28" r="6" stroke="currentColor" strokeWidth="2" opacity="0.35" />
                      <circle cx="80" cy="28" r="2.5" fill="currentColor" opacity="0.4" />
                      <line x1="72" y1="32" x2="66" y2="42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
                      <path d="M34 74 L46 74" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.2" />
                    </svg>
                  ) : (
                    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="decoGrad3" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="currentColor" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
                        </linearGradient>
                      </defs>
                      <path d="M12 72 C24 56 44 52 60 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.2" strokeDasharray="5 5" />
                      <path d="M32 68 L72 28 L54 76 L44 58 L32 68 Z" fill="url(#decoGrad3)" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                      <path d="M44 58 L72 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
                      <circle cx="72" cy="28" r="5" fill="currentColor" opacity="0.7" />
                      <path d="M16 32 L28 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.2" />
                      <path d="M10 48 L26 48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
                      <path d="M16 64 L28 64" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.2" />
                      <circle cx="82" cy="18" r="3" fill="currentColor" opacity="0.4" />
                      <circle cx="86" cy="42" r="2" fill="currentColor" opacity="0.3" />
                    </svg>
                  )}
                </div>

                {/* Icon */}
                <div
                  className={`relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${item.bg} shadow-lg ${item.glow} ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-110`}
                >
                  <item.icon className={`h-7 w-7 ${item.color}`} />
                </div>

                {/* Title */}
                <h3 className={`relative text-lg font-black ${item.color}`}>{item.title}</h3>

                {/* Body */}
                <p className="relative mt-2 text-sm leading-relaxed text-white/60">{item.body}</p>


              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
