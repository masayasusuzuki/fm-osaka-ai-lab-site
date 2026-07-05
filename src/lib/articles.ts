import { getAllArticles, getArticleBySlug, MicroCMSArticle } from "@/lib/microcms";
import { BlogPost, SnsPost } from "@/types";

// 本文内の生 <img>（next/image を通らない）は microCMS の画像変換パラメータで軽量化する。
// 元の PNG は 2MB 超だが、WebP + 幅制限で数百KB になる。すでにパラメータ付きの URL は触らない
function optimizeBodyImages(body: string): string {
  return body.replace(
    /src="(https:\/\/images\.microcms-assets\.io\/[^"?]+)(\?[^"]*)?"/g,
    (_m, url: string, qs: string | undefined) =>
      qs ? `src="${url}${qs}"` : `src="${url}?fm=webp&q=75&w=1600"`
  );
}

export function toBlogPost(article: MicroCMSArticle): BlogPost {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    episodeSlug: article.episodeSlug || "ep01",
    excerpt: article.excerpt,
    body: optimizeBodyImages(article.body),
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
