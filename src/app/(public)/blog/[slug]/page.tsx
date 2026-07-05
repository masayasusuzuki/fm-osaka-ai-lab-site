import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Radio, Sparkles, ArrowRight, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/FadeIn";
import { getAllBlogPosts, getBlogPostBySlugAsync } from "@/lib/articles";
import { getEpisodeBySlug } from "@/lib/content";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Next.js の params は URL エンコードされたまま渡ってくるため、
// 日本語 slug を含む場合はデコードしてから microCMS を検索する
function decodeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export async function generateMetadata({ params }: BlogPageProps) {
  const { slug: rawSlug } = await params;
  const slug = decodeSlug(rawSlug);
  const post = await getBlogPostBySlugAsync(slug);
  if (!post) return {};

  return {
    title: `${post.title} | FM OSAKA AI LAB`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug: rawSlug } = await params;
  const slug = decodeSlug(rawSlug);
  const [post, allPosts] = await Promise.all([
    getBlogPostBySlugAsync(slug),
    getAllBlogPosts(),
  ]);

  if (!post) {
    notFound();
  }

  const episode = getEpisodeBySlug(post.episodeSlug);
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = allPosts[currentIndex - 1];
  const nextPost = allPosts[currentIndex + 1];

  return (
    <div className="relative">
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-40 top-40 -z-10 h-[400px] w-[400px] rounded-full bg-fm-blue/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-[600px] -z-10 h-[400px] w-[400px] rounded-full bg-fm-pink/5 blur-3xl" />

      {/* Hero */}
      <section className="relative w-full overflow-hidden">
        <div className="relative mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-12">
          <FadeIn>
            <Link
              href="/blog"
              className="group mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-black text-white/70 transition-all hover:border-fm-pink hover:text-fm-pink"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              記事一覧に戻る
            </Link>
          </FadeIn>

          <FadeIn delay={0.1}>
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
          </FadeIn>
        </div>
      </section>

      {/* Article body */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-12">
        <FadeIn delay={0.2}>
          <Card className="border-white/10 bg-[#0B0B0B] shadow-2xl">
            <CardContent className="p-6 sm:p-10">
              {/* Lead */}
              <p className="text-lg font-medium leading-relaxed text-white/80">
                {post.excerpt}
              </p>

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
        </FadeIn>

        {/* SNS posts */}
        {post.snsPosts.length > 0 && (
          <FadeIn delay={0.3}>
            <section className="mt-12">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-white/10" />
                <span className="text-xs font-black tracking-[0.2em] text-white/40">SNS POSTS</span>
                <span className="h-px flex-1 bg-white/10" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {post.snsPosts.map((sns, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden border-white/10 bg-[#0B0B0B]"
                  >
                    <CardContent className="p-5">
                      <div className="mb-3 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                          <User className="h-4 w-4 text-white/60" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">FM OSAKA AI LAB</p>
                          <p className="text-[10px] text-white/40">@{sns.platform.toLowerCase()}</p>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-white/80">{sns.text}</p>
                      <Badge
                        variant="outline"
                        className="mt-4 border-fm-blue text-fm-blue"
                      >
                        {sns.platform}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </FadeIn>
        )}

        {/* Prev / Next */}
        <FadeIn delay={0.4}>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {prevPost ? (
              <Link
                href={`/blog/${prevPost.slug}`}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:border-white/20 hover:bg-white/[0.06]"
              >
                <span className="text-[10px] font-black tracking-widest text-white/40">PREV</span>
                <p className="mt-2 font-bold text-white transition-colors group-hover:text-fm-pink">
                  {prevPost.title}
                </p>
              </Link>
            ) : (
              <div />
            )}
            {nextPost ? (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-right transition-all hover:border-white/20 hover:bg-white/[0.06]"
              >
                <span className="text-[10px] font-black tracking-widest text-white/40">NEXT</span>
                <p className="mt-2 font-bold text-white transition-colors group-hover:text-fm-pink">
                  {nextPost.title}
                </p>
                <ArrowRight className="ml-auto mt-2 h-4 w-4 text-white/40 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
