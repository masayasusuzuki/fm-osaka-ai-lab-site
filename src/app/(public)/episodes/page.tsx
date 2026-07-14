import { EpisodeCard } from "@/components/EpisodeCard";
import { SectionHeader } from "@/components/SectionHeader";
import { FadeIn } from "@/components/FadeIn";
import { episodes } from "@/lib/content";

export const metadata = {
  title: "Episodes | FM OSAKA AI LAB",
  description:
    "FM大阪「AI Coaching Buddy」の全4回企画を紹介。音声からブログ生成、情報収集、重複チェック・リマインド、AIゲスト対談まで。",
};

export default function EpisodesPage() {
  return (
    <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-40 top-20 -z-10 h-[400px] w-[400px] rounded-full bg-fm-pink/5 blur-3xl" />

      <SectionHeader
        label="EPISODES"
        title="全4回のAI実験"
        description="FM大阪の番組「iDoBuddy」内コーナー「AI Coaching Buddy」で取り組んだ、ラジオ制作にAIを取り入れた4つのテーマです。"
        accent="pink"
        centered
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* 全4回の企画。ep00 はブログ用のプロローグ扱いなので一覧には出さない */}
        {episodes
          .filter((episode) => episode.episodeNumber >= 1)
          .map((episode, index) => (
            <FadeIn key={episode.id} delay={index * 0.1}>
              <EpisodeCard episode={episode} />
            </FadeIn>
          ))}
      </div>
    </div>
  );
}
