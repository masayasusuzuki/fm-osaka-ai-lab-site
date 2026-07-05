"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Radio } from "lucide-react";
import { EpisodeCard } from "@/components/EpisodeCard";
import { FadeIn } from "@/components/FadeIn";
import { episodes } from "@/lib/content";

export function EpisodesSection() {
  return (
    <section className="mx-auto w-full max-w-[90rem] px-2 sm:px-4 lg:px-5">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0B0B0B] p-6 shadow-2xl sm:p-10 lg:p-12">
        {/* Background glows */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-fm-pink/10 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-fm-blue/10 blur-[80px]" />

        {/* Header */}
        <div className="relative mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-fm-pink"
            >
              <Radio className="h-3.5 w-3.5" />
              EPISODES
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-2xl font-black tracking-tight text-white sm:text-4xl"
            >
              全4回の{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fm-pink to-fm-orange">
                AI実験
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-2 max-w-xl text-sm leading-relaxed text-white/50"
            >
              FM大阪の番組「iDoBuddy」内コーナー「AI Coaching Buddy」で取り組んだ、ラジオ制作にAIを取り入れた4つのテーマです。
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/episodes"
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-bold text-white transition-all hover:border-fm-pink hover:text-fm-pink"
            >
              すべて見る
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {episodes.map((episode, index) => (
            <FadeIn key={episode.id} delay={index * 0.1}>
              <EpisodeCard episode={episode} />
            </FadeIn>
          ))}
        </div>

        {/* Decorative footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="relative mt-8 flex items-center justify-center gap-3 text-[10px] font-black tracking-[0.25em] text-white/25"
        >
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-white/30" />
          AI × RADIO = NEW BUDDY
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-white/30" />
        </motion.div>
      </div>
    </section>
  );
}
