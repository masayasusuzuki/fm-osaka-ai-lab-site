import { getAllArticles, getArticleBySlug, MicroCMSArticle } from "@/lib/microcms";
import { BlogPost, SnsPost } from "@/types";

export function toBlogPost(article: MicroCMSArticle): BlogPost {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    episodeSlug: article.episodeSlug || "ep01",
    excerpt: article.excerpt,
    body: article.body,
    thumbnail: article.thumbnail?.url || "/images/blog/thumb.png",
    snsPosts: [],
    publishedAt: article.published ?? article.createdAt,
  };
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await getAllArticles({ orders: "-published", limit: 100 });
    return res.contents
      .filter((article) => article.published)
      .map(toBlogPost);
  } catch {
    return [];
  }
}

export async function getBlogPostBySlugAsync(
  slug: string
): Promise<BlogPost | undefined> {
  try {
    const article = await getArticleBySlug(slug);
    return article && article.published ? toBlogPost(article) : undefined;
  } catch {
    return undefined;
  }
}

export async function getRecentBlogPostsAsync(
  limit: number = 3
): Promise<BlogPost[]> {
  const all = await getAllBlogPosts();
  return all.slice(0, limit);
}

export async function getBlogPostsByEpisodeAsync(
  episodeSlug: string
): Promise<BlogPost[]> {
  const all = await getAllBlogPosts();
  return all.filter((post) => post.episodeSlug === episodeSlug);
}
