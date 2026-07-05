import { BlogCard } from "@/components/BlogCard";
import { SectionHeader } from "@/components/SectionHeader";
import { FadeIn } from "@/components/FadeIn";
import { getAllBlogPosts } from "@/lib/articles";
import { getEpisodeBySlug } from "@/lib/content";

export const metadata = {
  title: "Blog | FM OSAKA AI LAB",
  description:
    "FM大阪「AI Coaching Buddy」で生成されたブログ記事一覧。放送後すぐに公開されるAI生成コンテンツをご覧いただけます。",
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 top-20 -z-10 h-[400px] w-[400px] rounded-full bg-fm-blue/5 blur-3xl" />

      <SectionHeader
        label="BLOG"
        title="生成ブログ記事"
        description="放送音声や企画内容をもとに AI が生成したブログ記事。SNS投稿文も併せて公開しています。"
        accent="blue"
        centered
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <FadeIn key={post.id} delay={index * 0.1}>
            <BlogCard post={post} episode={getEpisodeBySlug(post.episodeSlug)} />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
