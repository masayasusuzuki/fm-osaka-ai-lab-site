import Link from "next/link";
import { ExternalLink, Radio, Sparkles } from "lucide-react";
import { MemberCard } from "@/components/MemberCard";
import { SectionHeader } from "@/components/SectionHeader";
import { FadeIn } from "@/components/FadeIn";
import { members, siteDescription } from "@/lib/content";

export const metadata = {
  title: "About | FM OSAKA AI LAB",
  description:
    "FM OSAKA AI LAB の企画概要、出演者・関係者、FM大阪公式リンクを紹介します。",
};

const officialLinks = [
  {
    label: "FM大阪公式サイト",
    href: "https://www.fmosaka.net/",
  },
  {
    label: "FM大阪 X（旧Twitter）",
    href: "https://x.com/fmosaka",
  },
  {
    label: "FM大阪 YouTubeチャンネル",
    href: "https://www.youtube.com/fmosaka",
  },
];

export default function AboutPage() {
  return (
    <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-40 top-40 -z-10 h-[400px] w-[400px] rounded-full bg-fm-pink/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-[600px] -z-10 h-[400px] w-[400px] rounded-full bg-fm-blue/5 blur-3xl" />

      <SectionHeader
        label="ABOUT"
        title="企画概要"
        accent="pink"
        centered
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <FadeIn>
          <div className="relative h-full overflow-hidden rounded-3xl bg-card p-6 border border-border sm:p-8">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-fm-pink/10 blur-2xl" />
            <div className="relative flex items-center gap-2 text-foreground">
              <Radio className="h-5 w-5 text-fm-pink" />
              <h2 className="text-xl font-bold">FM OSAKA AI LAB とは</h2>
            </div>
            <p className="relative mt-4 leading-relaxed text-muted-foreground">
              {siteDescription}
            </p>
            <p className="relative mt-4 leading-relaxed text-muted-foreground">
              本サイトは、FM大阪のブランド・価値を最優先に設計されています。
              INTENTIONの自己顕示ではなく、「FM大阪 with
              AI」という取り組み自体が素晴らしいものになることを目指しています。
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="relative h-full overflow-hidden rounded-3xl bg-fm-dark p-6 text-white sm:p-8">
            <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-fm-orange/20 blur-2xl" />
            <div className="relative flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-fm-orange" />
              <h2 className="text-xl font-bold">AI Coaching Buddy</h2>
            </div>
            <p className="relative mt-4 leading-relaxed text-white/80">
              FM大阪の番組「iDoBuddy・イドバタニュース」内で展開される、
              INTENTIONがAIコーチとしてサポートする新コーナーです。
            </p>
            <ul className="relative mt-6 space-y-3">
              <li className="flex items-center gap-3 text-sm text-white/90">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fm-pink text-xs font-bold">
                  1
                </span>
                音声からブログ・SNS・サムネイルを自動生成
              </li>
              <li className="flex items-center gap-3 text-sm text-white/90">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fm-orange text-xs font-bold">
                  2
                </span>
                情報収集の自動化
              </li>
              <li className="flex items-center gap-3 text-sm text-white/90">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fm-blue text-xs font-bold">
                  3
                </span>
                重複チェック・リマインド
              </li>
              <li className="flex items-center gap-3 text-sm text-white/90">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fm-green text-xs font-bold">
                  4
                </span>
                AIゲスト対談
              </li>
            </ul>
          </div>
        </FadeIn>
      </div>

      <section className="mt-16">
        <SectionHeader
          label="MEMBERS"
          title="出演者・関係者"
          accent="green"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, index) => (
            <FadeIn key={member.id} delay={index * 0.1}>
              <MemberCard member={member} />
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <SectionHeader
          label="LINKS"
          title="関連リンク"
          accent="orange"
        />
        <FadeIn>
          <div className="rounded-3xl border border-border bg-card p-6">
            <ul className="space-y-3">
              {officialLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-foreground transition-colors hover:text-fm-pink"
                  >
                    {link.label}
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
