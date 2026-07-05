import Link from "next/link";
import { ExternalLink, Radio, Sparkles, Mic, Zap, Bot, ListChecks, Newspaper, ArrowRight } from "lucide-react";
import { MemberCard } from "@/components/MemberCard";
import { FadeIn } from "@/components/FadeIn";
import { members, siteDescription } from "@/lib/content";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "About | FM OSAKA AI LAB",
  description:
    "FM OSAKA AI LAB の企画概要、出演者・関係者、FM大阪公式リンクを紹介します。",
};

const officialLinks = [
  {
    label: "FM大阪公式サイト",
    href: "https://www.fmosaka.net/",
    color: "bg-fm-pink",
  },
  {
    label: "FM大阪 X（旧Twitter）",
    href: "https://x.com/fmosaka",
    color: "bg-fm-blue",
  },
  {
    label: "FM大阪 YouTubeチャンネル",
    href: "https://www.youtube.com/fmosaka",
    color: "bg-fm-orange",
  },
];

const experiments = [
  {
    no: "01",
    icon: Newspaper,
    title: "音声からブログ・SNS・サムネを自動生成",
    desc: "放送済みの音声が、放送直後にはもう記事に。",
    color: "#E91E8C",
    bg: "bg-fm-pink",
    rotate: "-rotate-2",
  },
  {
    no: "02",
    icon: Zap,
    title: "情報収集の自動化",
    desc: "ネタ探し・トレンドチェックはAIが毎朝巡回。",
    color: "#F7931E",
    bg: "bg-fm-orange",
    rotate: "rotate-1",
  },
  {
    no: "03",
    icon: ListChecks,
    title: "重複チェック・リマインド",
    desc: "当選者・選曲のダブりをAIが見張る。",
    color: "#00AEEF",
    bg: "bg-fm-blue",
    rotate: "-rotate-1",
  },
  {
    no: "04",
    icon: Bot,
    title: "AIゲスト対談",
    desc: "AIが番組ゲストとしてマイクの前に。",
    color: "#8DC63F",
    bg: "bg-fm-green",
    rotate: "rotate-2",
  },
];

const marqueeItems = [
  "FM OSAKA AI LAB",
  "AI × RADIO",
  "NEW BUDDY!",
  "iDoBuddy",
  "AI Coaching Buddy",
  "ON AIR",
];

function MarqueeStrip({ reverse = false }: { reverse?: boolean }) {
  const row = (
    <div className="flex shrink-0 items-center">
      {marqueeItems.map((item, i) => (
        <span key={i} className="flex items-center">
          <span
            className={
              "px-6 text-sm font-[family-name:var(--font-display)] tracking-[0.24em] " +
              (i % 2 === 0 ? "text-white" : "text-transparent")
            }
            style={i % 2 === 0 ? undefined : { WebkitTextStroke: "1px rgba(255,255,255,0.9)" }}
          >
            {item}
          </span>
          <span className="h-2 w-2 rounded-full bg-white/60" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="flex overflow-hidden bg-gradient-to-r from-fm-pink via-fm-orange to-fm-blue py-3">
      <div
        className="flex w-max"
        style={{
          animation: `marquee 24s linear infinite${reverse ? " reverse" : ""}`,
        }}
      >
        {row}
        {row}
      </div>
    </div>
  );
}

function Equalizer({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-end gap-1", className)}>
      {[0.9, 0.5, 1.1, 0.7, 1.3, 0.6, 1.0, 0.8, 1.2, 0.5, 0.9, 0.7].map((d, i) => (
        <span
          key={i}
          className="w-1.5 rounded-full"
          style={{
            height: `${16 + (i % 4) * 8}px`,
            backgroundColor: ["#E91E8C", "#F7931E", "#00AEEF", "#8DC63F"][i % 4],
            animation: `equalizer ${d}s ease-in-out infinite`,
            transformOrigin: "bottom",
          }}
        />
      ))}
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      {/* ===== Hero ===== */}
      <section className="relative pt-14 sm:pt-20">
        {/* Splash blobs */}
        <div className="pointer-events-none absolute -left-32 top-10 -z-10 h-[420px] w-[420px] rounded-full bg-fm-pink/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-40 -z-10 h-[380px] w-[380px] rounded-full bg-fm-blue/15 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-96 -z-10 h-[300px] w-[300px] rounded-full bg-fm-orange/10 blur-3xl" />

        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <FadeIn>
            <div className="relative">
              {/* Rotating badge */}
              <div
                className="absolute -top-4 right-2 hidden h-24 w-24 items-center justify-center sm:flex"
                style={{ animation: "spin-slow 14s linear infinite" }}
              >
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <defs>
                    <path id="circlePath" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                  </defs>
                  <text className="fill-fm-pink text-[11px] font-black tracking-[0.3em]">
                    <textPath href="#circlePath">ON AIR • AI LAB • ON AIR • AI LAB •</textPath>
                  </text>
                </svg>
              </div>

              <p className="flex items-center gap-3 text-xs tracking-[0.45em] text-fm-pink font-[family-name:var(--font-display)]">
                <Radio className="h-4 w-4" /> ABOUT US
              </p>
              <h1 className="mt-4 text-5xl font-black leading-[1.05] tracking-tight text-foreground sm:text-7xl lg:text-8xl">
                ラジオ
                <span className="bg-gradient-to-r from-fm-pink via-fm-orange to-fm-blue bg-clip-text text-transparent">
                  ×
                </span>
                AIの
                <br />
                <span className="relative inline-block">
                  実験場
                  <span className="absolute -right-8 -top-4 rotate-12 rounded-lg bg-fm-orange px-2 py-0.5 text-xs font-black tracking-widest text-black sm:-right-12 sm:text-sm">
                    LAB!
                  </span>
                </span>
                へようこそ。
              </h1>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <Equalizer />
                <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {siteDescription}
                </p>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Marquee */}
        <div className="mt-14 -rotate-1 scale-105">
          <MarqueeStrip />
        </div>
      </section>

      {/* ===== Concept ===== */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="grid items-stretch gap-6 lg:grid-cols-5">
          <FadeIn className="lg:col-span-3">
            <div className="relative h-full overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-10">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-fm-pink/10 blur-2xl" />
              <span className="absolute -right-2 -top-6 select-none text-[120px] leading-none text-foreground/[0.04] font-[family-name:var(--font-display)]">
                LAB
              </span>
              <div className="relative">
                <p className="text-xs font-black tracking-[0.4em] text-fm-pink font-[family-name:var(--font-display)]">CONCEPT</p>
                <h2 className="mt-4 text-2xl font-black leading-snug text-foreground sm:text-4xl">
                  ラジオの現場に、
                  <br />
                  <span className="bg-gradient-to-r from-fm-pink to-fm-orange bg-clip-text text-transparent">
                    AIという新しい相棒
                  </span>
                  を。
                </h2>
                <p className="mt-6 leading-relaxed text-muted-foreground">
                  放送された音声をもとに、ブログ・SNS・サムネイルまで自動生成。
                  FM大阪の番組づくりを、AIがもっと面白く、もっと自由にします。
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  本サイトは、FM大阪のブランド・価値を最優先に設計されています。
                  「FM大阪 with AI」という取り組み自体が素晴らしいものになることを目指しています。
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} className="lg:col-span-2">
            <div className="relative h-full overflow-hidden rounded-3xl bg-fm-dark p-8 text-white sm:p-10">
              <div className="absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-fm-orange/20 blur-2xl" />
              <div className="absolute right-6 top-6" style={{ animation: "float-y 4s ease-in-out infinite" }}>
                <div className="flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-[10px] font-black tracking-widest">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> ON AIR
                </div>
              </div>
              <div className="relative">
                <div className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-fm-orange" />
                  <p className="text-xs font-black tracking-[0.4em] text-fm-orange font-[family-name:var(--font-display)]">PROGRAM</p>
                </div>
                <h2 className="mt-4 text-2xl sm:text-3xl font-[family-name:var(--font-display)]">AI Coaching Buddy</h2>
                <p className="mt-4 text-sm leading-relaxed text-white/70">
                  FM大阪「iDoBuddy・イドバタニュース」内で展開される、INTENTIONがAIコーチとしてサポートする全4回の新コーナー。
                </p>
                <div className="mt-8 space-y-3">
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                    <span className="text-xs font-bold text-white/60">番組</span>
                    <span className="text-sm font-black">iDoBuddy・イドバタニュース</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                    <span className="text-xs font-bold text-white/60">実験</span>
                    <span className="text-sm font-black">全4回のAI実験</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== 4 Experiments ===== */}
      <section className="relative py-4">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <FadeIn>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-black tracking-[0.4em] text-fm-blue font-[family-name:var(--font-display)]">EXPERIMENTS</p>
                <h2 className="mt-3 text-3xl font-black text-foreground sm:text-5xl">
                  4つのAI実験
                  <span className="ml-3 inline-block -rotate-6 rounded-lg bg-fm-pink px-2 py-0.5 align-middle text-sm font-black text-white">
                    全4回
                  </span>
                </h2>
              </div>
              <Sparkles className="hidden h-10 w-10 text-fm-orange sm:block" />
            </div>
          </FadeIn>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {experiments.map((ex, i) => (
              <FadeIn key={ex.no} delay={i * 0.08}>
                <div
                  className={cn(
                    "group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl",
                    ex.rotate
                  )}
                >
                  <span
                    className="absolute -right-3 -top-6 select-none text-7xl font-black opacity-10 transition-opacity group-hover:opacity-25"
                    style={{ color: ex.color }}
                  >
                    {ex.no}
                  </span>
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl text-white transition-transform duration-300 group-hover:rotate-12",
                      ex.bg
                    )}
                  >
                    <ex.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-base font-black leading-snug text-foreground">
                    {ex.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{ex.desc}</p>
                  <div
                    className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                    style={{ backgroundColor: ex.color }}
                  />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Members ===== */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <FadeIn>
          <p className="text-xs font-black tracking-[0.4em] text-fm-green font-[family-name:var(--font-display)]">MEMBERS</p>
          <h2 className="mt-3 text-3xl font-black text-foreground sm:text-5xl">出演者・関係者</h2>
        </FadeIn>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, index) => (
            <FadeIn key={member.id} delay={index * 0.1}>
              <MemberCard member={member} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ===== Marquee (reverse) ===== */}
      <div className="rotate-1 scale-105">
        <MarqueeStrip reverse />
      </div>

      {/* ===== Links + CTA ===== */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-6 lg:grid-cols-2">
          <FadeIn>
            <div className="h-full rounded-3xl border border-border bg-card p-8 sm:p-10">
              <p className="text-xs font-black tracking-[0.4em] text-fm-orange font-[family-name:var(--font-display)]">LINKS</p>
              <h2 className="mt-3 text-2xl font-black text-foreground sm:text-3xl">関連リンク</h2>
              <div className="mt-8 flex flex-col gap-3">
                {officialLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "group flex items-center justify-between rounded-2xl px-6 py-4 text-sm font-black text-white transition-transform hover:scale-[1.02]",
                      link.color
                    )}
                  >
                    {link.label}
                    <ExternalLink className="h-4 w-4 transition-transform group-hover:rotate-12" />
                  </Link>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-fm-dark p-8 text-white sm:p-10">
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-fm-pink/20 blur-3xl" />
              <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-fm-blue/20 blur-3xl" />
              <div className="relative">
                <Equalizer />
                <h2 className="mt-6 text-2xl font-black leading-snug sm:text-3xl">
                  放送のあとに。
                  <br />
                  もっと多くの人へ。もっと深く。
                </h2>
              </div>
              <div className="relative mt-8 flex flex-wrap gap-3">
                <Link
                  href="/episodes"
                  className="group flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-black transition-transform hover:scale-105"
                >
                  エピソードを見る
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/blog"
                  className="group flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-black text-white transition-colors hover:border-fm-pink hover:text-fm-pink"
                >
                  ブログを読む
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
