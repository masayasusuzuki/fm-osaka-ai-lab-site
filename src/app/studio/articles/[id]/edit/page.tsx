import { notFound } from "next/navigation";
import { getArticleById } from "@/lib/microcms";
import { ArticleEditor } from "./editor";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPage({ params }: EditPageProps) {
  const { id } = await params;

  let article;
  try {
    article = await getArticleById(id);
  } catch {
    notFound();
  }
  if (!article) {
    notFound();
  }

  return (
    <ArticleEditor
      article={{
        id: article.id,
        title: article.title,
        excerpt: article.excerpt ?? "",
        body: article.body ?? "",
        thumbnail: article.thumbnail?.url ?? "",
        episodeSlug: article.episodeSlug || "ep01",
        published: article.published ?? null,
      }}
    />
  );
}
