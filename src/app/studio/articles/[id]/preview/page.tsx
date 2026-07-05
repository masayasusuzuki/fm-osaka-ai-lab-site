import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Radio, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getArticleById } from "@/lib/microcms";
import { toBlogPost } from "@/lib/articles";
import { getEpisodeBySlug } from "@/lib/content";

interface PreviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    notFound();
  }

  const post = toBlogPost(article);
  const episode = getEpisodeBySlug(post.episodeSlug);
  const isDraft = !article.published;

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-white">
      {/* Preview header */}
      <div className="sticky top-0 z-50 border-b border-white/10 bg-[#0A0A0A]/95 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/studio/articles"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-white/70 transition-colors hover:border-fm-pink hover:text-fm-pink"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              記事一覧に戻る
            </Link>
            <span className="text-xs font-bold text-white/40">|</span>
            <span className="text-xs font-bold text-white/70">{post.title}</span>
          </div>
          <div className="flex items-center gap-2">
            {isDraft ? (
              <Badge variant="outline" className="border-amber-500 text-amber-500">
                下書きプレビュー
              </Badge>
            ) : (
              <Badge variant="outline" className="border-fm-pink text-fm-pink">
                公開済みプレビュー
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Background glow */}
      <div className="pointer-events-none absolute -left-40 top-40 -z-10 h-[400px] w-[400px] rounded-full bg-fm-blue/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-[600px] -z-10 h-[400px] w-[400px] rounded-full bg-fm-pink/5 blur-3xl" />

      {/* Hero */}
      <section className="relative w-full overflow-hidden">
        <div className="relative mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-12">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1000px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
              <div className="flex flex-wrap items-center gap-3">
                {episode && (
                  <Badge className="bg-fm-pink text-white hover:bg-fm-pink/90">
                    EP{String(episode.episodeNumber).padStart(2, "0")}
                  </Badge>
                )}
                <Badge variant="outline" className="border-fm-orange text-fm-orange">
                  <Sparkles className="mr-1 h-3 w-3" />
                  AI生成記事
                </Badge>
              </div>
              <h1 className="mt-4 text-2xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/60">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {post.publishedAt}
                </span>
                <span className="flex items-center gap-1.5">
                  <Radio className="h-4 w-4" />
                  FM OSAKA AI LAB
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article body */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-12">
        <Card className="border-white/10 bg-[#0B0B0B] shadow-2xl">
          <CardContent className="p-6 sm:p-10">
            {/* Lead */}
            {post.excerpt && (
              <p className="text-lg font-medium leading-relaxed text-white/80">
                {post.excerpt}
              </p>
            )}

            {/* Divider */}
            <div className="my-8 flex items-center gap-4">
              <span className="h-px flex-1 bg-gradient-to-r from-fm-pink to-transparent" />
              <Sparkles className="h-4 w-4 text-fm-pink" />
              <span className="h-px flex-1 bg-gradient-to-l from-fm-blue to-transparent" />
            </div>

            {/* Body */}
            <div
              className="prose prose-lg prose-invert max-w-none text-white/80 prose-headings:font-black prose-headings:text-white prose-a:text-fm-pink hover:prose-a:text-fm-pink/80 prose-strong:text-white prose-blockquote:border-l-fm-pink prose-blockquote:bg-white/5 prose-blockquote:py-2 prose-blockquote:pl-6 prose-blockquote:pr-4 prose-blockquote:font-medium prose-blockquote:not-italic prose-li:marker:text-fm-pink"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />

            {/* AI note */}
            <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-fm-pink/10">
                  <Sparkles className="h-5 w-5 text-fm-pink" />
                </div>
                <div>
                  <p className="font-black text-white">AI Coaching Buddy からのメモ</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/50">
                    この記事は FM大阪の放送音声を Whisper で文字起こしし、生成 AI がブログ記事として再構成したものです。内容は企画のデモ用であり、最終的な表現は人間がチェック・調整しています。
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
