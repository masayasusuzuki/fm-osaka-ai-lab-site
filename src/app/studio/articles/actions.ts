"use server";

import { revalidatePath } from "next/cache";
import { getAllArticles, updateArticle, deleteArticle, type MicroCMSArticle } from "@/lib/microcms";
import type { MicroCMSQueries } from "microcms-js-sdk";

export async function getAllArticlesAction(
  queries?: MicroCMSQueries
): Promise<{ contents: MicroCMSArticle[]; error?: string }> {
  try {
    const res = await getAllArticles(queries);
    return { contents: res.contents };
  } catch (err) {
    console.error(err);
    return { contents: [], error: "記事の取得に失敗しました" };
  }
}

export async function toggleArticlePublished(
  id: string,
  currentPublished: string | null
): Promise<{ error?: string }> {
  try {
    const nextPublished = currentPublished ? null : new Date().toISOString();
    await updateArticle(id, {
      published: nextPublished,
    });
    revalidatePath("/studio/articles");
    revalidatePath("/blog");
    return {};
  } catch (err) {
    console.error(err);
    return { error: "公開状態の更新に失敗しました" };
  }
}

export async function removeArticle(id: string): Promise<{ error?: string }> {
  try {
    await deleteArticle(id);
    revalidatePath("/studio/articles");
    revalidatePath("/blog");
    return {};
  } catch (err) {
    console.error(err);
    return { error: "削除に失敗しました" };
  }
}
