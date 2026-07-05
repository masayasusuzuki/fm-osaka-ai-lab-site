import { createClient } from "microcms-js-sdk";
import type { MicroCMSQueries } from "microcms-js-sdk";

export const microcms = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
});

export interface MicroCMSArticle {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  revisedAt: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  thumbnail?: {
    url: string;
    height: number;
    width: number;
  };
  published: string | null;
  episodeSlug: string;
}

export async function getAllArticles(queries?: MicroCMSQueries) {
  return microcms.getList<MicroCMSArticle>({
    endpoint: "articles",
    queries,
  });
}

export async function getArticleById(id: string, queries?: MicroCMSQueries) {
  return microcms.getListDetail<MicroCMSArticle>({
    endpoint: "articles",
    contentId: id,
    queries,
  });
}

export async function getArticleBySlug(slug: string) {
  const res = await microcms.getList<MicroCMSArticle>({
    endpoint: "articles",
    queries: {
      filters: `slug[equals]${slug}`,
      limit: 1,
    },
  });
  return res.contents[0] ?? null;
}

export type MicroCMSArticleInput = Omit<MicroCMSArticle, "thumbnail"> & {
  thumbnail?: string;
};

export async function createArticle(
  data: Omit<MicroCMSArticleInput, "id" | "createdAt" | "updatedAt" | "publishedAt" | "revisedAt">
) {
  return microcms.create({
    endpoint: "articles",
    content: data,
  });
}

export async function updateArticle(
  id: string,
  data: Partial<Omit<MicroCMSArticleInput, "id" | "createdAt" | "updatedAt" | "publishedAt" | "revisedAt">>
) {
  return microcms.update({
    endpoint: "articles",
    contentId: id,
    content: data,
  });
}

export async function deleteArticle(id: string) {
  return microcms.delete({
    endpoint: "articles",
    contentId: id,
  });
}
