import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/SectionHeader";
import { FadeIn } from "@/components/FadeIn";
import { getBlogPostsByEpisodeAsync } from "@/lib/articles";
import { episodes, getEpisodeBySlug } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Episode01Requirements } from "@/components/episodes/Episode01Requirements";
import { Episode02Demo } from "@/components/episodes/Episode02Demo";
import { Episode03Demo } from "@/components/episodes/Episode03Demo";
import { Episode04Demo } from "@/components/episodes/Episode04Demo";
import { BlogCard } from "@/components/BlogCard";

interface EpisodePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return episodes.map((episode) => ({
    slug: episode.slug,
  }));
}

export async function generateMetadata({ params }: EpisodePageProps) {
  const { slug } = await params;
  const episode = getEpisodeBySlug(slug);
  if (!episode) return {};

  return {
    title: `EP${String(episode.episodeNumber).padStart(2, "0")}: ${episode.title} | FM OSAKA AI LAB`,
    description: episode.description,
  };
}

const accentClasses: Record<typeof episodes[number]["accentColor"], string> = {
  pink: "bg-fm-pink",
  orange: "bg-fm-orange",
  blue: "bg-fm-blue",
  green: "bg-fm-green",
};

const accentGlowClasses: Record<typeof episodes[number]["accentColor"], string> = {
  pink: "bg-fm-pink/20",
  orange: "bg-fm-orange/20",
  blue: "bg-fm-blue/20",
  green: "bg-fm-green/20",
};

export default async function EpisodePage({ params }: EpisodePageProps) {
  const { slug } = await params;
  const episode = getEpisodeBySlug(slug);

  if (!episode) {
    notFound();
  }

  const relatedPosts = await getBlogPostsByEpisodeAsync(slug);

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Background decoration */}
      <div className={cn(
        "pointer-events-none absolute -right-40 top-20 -z-10 h-[400px] w-[400px] rounded-full blur-3xl",
        accentGlowClasses[episode.accentColor]
      )} />

      <FadeIn>
        <div className="relative overflow-hidden rounded-3xl bg-card border border-border shadow-lg">
          <div
            className={cn(
              "absolute left-0 top-0 h-full w-2",
              accentClasses[episode.accentColor]
            )}
          />
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-foreground/5 blur-3xl" />
          <div className="grid gap-8 p-6 sm:grid-cols-2 sm:p-10">
            <div className="relative aspect-video overflow-hidden rounded-2xl shadow-lg">
              <Image
                src={episode.thumbnail}
                alt={episode.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="flex flex-col justify-center">
              <Badge
                className={cn(
                  "w-fit text-white",
                  accentClasses[episode.accentColor]
                )}
              >
                EP{String(episode.episodeNumber).padStart(2, "0")}
              </Badge>
              <p className="mt-3 text-sm font-bold text-muted-foreground">
                {episode.theme}
              </p>
              <h1 className="mt-2 text-2xl font-black text-foreground sm:text-4xl">
                {episode.title}
              </h1>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                {episode.description}
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="mt-10 rounded-3xl border border-border bg-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-foreground">企画詳細</h2>
          <p className="mt-4 whitespace-pre-line leading-relaxed text-muted-foreground">
            {episode.longDescription}
          </p>
        </div>
      </FadeIn>

      {/* EP01: 記事作成機能の要件定義解説（AI初学者向け） */}
      {episode.episodeNumber === 1 && (
        <FadeIn>
          <div className="mt-10">
            <Episode01Requirements />
          </div>
        </FadeIn>
      )}

      {/* EP01 のデモセクションは要件定義解説に置き換えたため表示しない */}
      {episode.episodeNumber !== 1 && (
        <FadeIn>
          <div className="mt-10">
            {episode.episodeNumber === 2 && <Episode02Demo />}
            {episode.episodeNumber === 3 && <Episode03Demo />}
            {episode.episodeNumber === 4 && <Episode04Demo />}
          </div>
        </FadeIn>
      )}

      {relatedPosts.length > 0 && (
        <section className="mt-16">
          <SectionHeader
            label="RELATED BLOG"
            title="関連ブログ記事"
            accent={episode.accentColor}
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((post, index) => (
              <FadeIn key={post.id} delay={index * 0.1}>
                <BlogCard post={post} episode={episode} />
              </FadeIn>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
