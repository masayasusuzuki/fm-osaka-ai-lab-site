"use client";

import { motion } from "framer-motion";
import { Mic, FileText, Hash, ImageIcon, Send, Sparkles } from "lucide-react";

const steps = [
  { icon: Mic, label: "音声をテキストに", desc: "Whisper 文字起こし", color: "#E91E8C" },
  { icon: FileText, label: "ブログ生成", desc: "AI 記事再構成", color: "#F7931E" },
  { icon: Hash, label: "SNS投稿案", desc: "各プラットフォーム向け", color: "#00AEEF" },
  { icon: ImageIcon, label: "サムネイル生成", desc: "視覚アセット作成", color: "#8DC63F" },
  { icon: Send, label: "共有・公開", desc: "サイト / SNS 展開", color: "#E91E8C" },
];

export function FeatureStrip() {
  return (
    <section className="mx-auto w-full max-w-[90rem] px-2 sm:px-4 lg:px-5">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0B0B0B] p-6 shadow-2xl sm:p-10 lg:p-14">
        {/* Background grid + glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-fm-pink/10 blur-[80px]" />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mb-10 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-fm-orange">
            <Sparkles className="h-3.5 w-3.5" />
            AI PIPELINE
          </span>
          <h3 className="mt-3 text-xl font-black text-foreground sm:text-3xl">
            放送後、AIがコンテンツを一気に生み出す流れ
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-white/40">
            音声をテキスト化して、ブログ・SNS・サムネイルを生成。最後に公開までワンストリーム。
          </p>
        </motion.div>

        {/* Pipeline */}
        <div className="relative">
          {/* SVG connecting line with moving particle */}
          <svg
            className="pointer-events-none absolute left-0 right-0 top-[2.75rem] hidden h-2 w-full sm:block"
            preserveAspectRatio="none"
            viewBox="0 0 1000 10"
          >
            <defs>
              <linearGradient id="pipeGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#E91E8C" />
                <stop offset="25%" stopColor="#F7931E" />
                <stop offset="50%" stopColor="#00AEEF" />
                <stop offset="75%" stopColor="#8DC63F" />
                <stop offset="100%" stopColor="#E91E8C" />
              </linearGradient>
            </defs>
            <rect x="0" y="3" width="1000" height="4" rx="2" fill="url(#pipeGrad)" opacity="0.25" />
            <motion.rect
              x="0"
              y="2"
              width="120"
              height="6"
              rx="3"
              fill="url(#pipeGrad)"
              animate={{ x: [-120, 1120] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
            />
          </svg>

          {/* Steps */}
          <div className="relative grid gap-6 sm:grid-cols-5">
            {steps.map((step, index) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative flex flex-col items-center text-center"
              >
                {/* Node */}
                <div className="relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-[#111] shadow-2xl"
                    style={{ boxShadow: `0 0 30px -8px ${step.color}40` }}
                  >
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${step.color}15` }}
                    >
                      <step.icon className="h-6 w-6" style={{ color: step.color }} />
                    </div>
                    {/* Ping ring */}
                    <span
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:animate-ping"
                      style={{ backgroundColor: `${step.color}20` }}
                    />
                  </motion.div>
                  <span
                    className="absolute -bottom-2 left-1/2 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border border-white/10 bg-[#111] text-[9px] font-black text-white/60"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Step card */}
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="mt-5 w-full rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm transition-colors group-hover:border-white/20 group-hover:bg-white/[0.06]"
                >
                  <p className="text-sm font-black text-foreground">{step.label}</p>
                  <p className="mt-1 text-[10px] font-bold tracking-wider text-white/40">{step.desc}</p>
                </motion.div>

                {/* Mobile connector */}
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 top-14 h-full w-px -translate-x-1/2 bg-gradient-to-b from-white/20 to-transparent sm:hidden" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Decorative footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="relative mt-10 flex items-center justify-center gap-2 text-xs font-black tracking-widest text-white/30"
        >
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-white/30" />
          STREAM TO EVERYWHERE
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-white/30" />
        </motion.div>
      </div>
    </section>
  );
}
