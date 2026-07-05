import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlogCard } from "@/components/BlogCard";
import { BannerCarousel } from "@/components/BannerCarousel";
import { NowPlayingCard } from "@/components/NowPlayingCard";
import { Hero } from "@/components/Hero";
import { ConceptSection } from "@/components/ConceptSection";
import { FeatureStrip } from "@/components/FeatureStrip";
import { StatsSection } from "@/components/StatsSection";
import { EpisodesSection } from "@/components/EpisodesSection";
import { SectionHeader } from "@/components/SectionHeader";
import { FadeIn } from "@/components/FadeIn";
import { banners, getEpisodeBySlug } from "@/lib/content";
import { getRecentBlogPostsAsync } from "@/lib/articles";

export default async function Home() {
  const recentPosts = await getRecentBlogPostsAsync(1);

  return (
    <div className="relative flex flex-col gap-16 pb-16 overflow-hidden">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 top-[800px] h-[500px] w-[500px] rounded-full bg-fm-pink/5 blur-3xl" />
        <div className="absolute -right-40 top-[1400px] h-[500px] w-[500px] rounded-full bg-fm-blue/5 blur-3xl" />
        <div className="absolute left-1/3 top-[2200px] h-[400px] w-[400px] rounded-full bg-fm-orange/5 blur-3xl" />
      </div>

      {/* Unified FV: hero image + now playing card share one container */}
      <section className="relative w-full bg-background pt-6 sm:pt-8">
        <div className="mx-auto max-w-[90rem] px-2 sm:px-4 lg:px-5">
          <Hero />
          <NowPlayingCard />
        </div>
      </section>

      {/* Concept */}
      <ConceptSection />

      {/* AI Pipeline */}
      <FeatureStrip />

      {/* Stats Dashboard */}
      <StatsSection />

      {/* Episodes */}
      <EpisodesSection />

      {/* Blog */}
      <section className="mx-auto w-full max-w-[90rem] px-2 sm:px-4 lg:px-5">
        <SectionHeader
          label="BLOG"
          title="最新記事"
          description="放送音声や企画内容をもとに AI が生成したブログ記事。SNS投稿文も併せて公開しています。"
          accent="blue"
          centered
        />

        <div className="mx-auto grid max-w-2xl gap-6">
          {recentPosts.map((post, index) => (
            <FadeIn key={post.id} delay={index * 0.1}>
              <BlogCard
                post={post}
                episode={getEpisodeBySlug(post.episodeSlug)}
              />
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div className="mt-8 flex justify-center">
            <Link
              href="/blog"
              className="flex items-center gap-1 text-sm font-bold text-foreground transition-colors hover:text-fm-blue"
            >
              すべて見る <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* Banner */}
      <section className="mx-auto w-full max-w-[90rem] px-2 sm:px-4 lg:px-5">
        <FadeIn>
          <BannerCarousel banners={banners} />
        </FadeIn>
      </section>
    </div>
  );
}
