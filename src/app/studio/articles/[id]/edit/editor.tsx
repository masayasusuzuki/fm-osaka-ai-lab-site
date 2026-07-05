"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { episodes } from "@/lib/content";
import { updateArticleContent } from "../../actions";

interface EditableArticle {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  thumbnail: string;
  episodeSlug: string;
  published: string | null;
}

export function ArticleEditor({ article: initial }: { article: EditableArticle }) {
  const router = useRouter();
  const [article, setArticle] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPublished = !!article.published;

  const handleSave = async (publish: boolean) => {
    setLoading(true);
    setError(null);
    const result = await updateArticleContent(article.id, {
      title: article.title,
      excerpt: article.excerpt,
      body: article.body,
      thumbnail: article.thumbnail || undefined,
      episodeSlug: article.episodeSlug,
      // 公開: 既存の公開日時を維持、未公開なら今の日時。下書き: "" でクリア
      published: publish ? article.published || new Date().toISOString() : "",
    });
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.push("/studio/articles");
      router.refresh();
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 text-gray-900">
      <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/studio/articles"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-50"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> 記事一覧に戻る
          </Link>
          <h2 className="text-lg font-black tracking-wide text-gray-900">記事を編集</h2>
        </div>
        <Badge
          variant="outline"
          className={isPublished ? "border-fm-pink text-fm-pink" : "border-amber-500 text-amber-500"}
        >
          {isPublished ? "公開中" : "下書き"}
        </Badge>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-black tracking-wider text-gray-500">エピソード</label>
            <select
              value={article.episodeSlug}
              onChange={(e) => setArticle({ ...article, episodeSlug: e.target.value })}
              className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 focus:border-fm-pink/40 focus:outline-none"
            >
              {episodes.map((ep) => (
                <option key={ep.slug} value={ep.slug}>
                  EP{String(ep.episodeNumber).padStart(2, "0")}: {ep.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-black tracking-wider text-gray-500">タイトル</label>
            <input
              type="text"
              value={article.title}
              onChange={(e) => setArticle({ ...article, title: e.target.value })}
              className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 focus:border-fm-pink/40 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-black tracking-wider text-gray-500">リード文</label>
            <textarea
              value={article.excerpt}
              onChange={(e) => setArticle({ ...article, excerpt: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-900 focus:border-fm-pink/40 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-black tracking-wider text-gray-500">サムネイルURL</label>
            <input
              type="text"
              value={article.thumbnail}
              onChange={(e) => setArticle({ ...article, thumbnail: e.target.value })}
              className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 focus:border-fm-pink/40 focus:outline-none"
            />
            {article.thumbnail && (
              <div className="relative mt-3 aspect-[16/9] w-full max-w-md overflow-hidden rounded-xl border border-gray-200">
                <Image
                  src={article.thumbnail}
                  alt="thumbnail"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 448px"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 本文: プレビューをそのまま編集できる */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-black tracking-wider text-gray-500">本文</label>
          <Badge variant="outline" className="border-fm-pink text-fm-pink">
            クリックで直接編集できます
          </Badge>
        </div>
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => {
            const html = e.currentTarget.innerHTML;
            if (html !== article.body) {
              setArticle({ ...article, body: html });
            }
          }}
          className="prose prose-lg mt-4 max-w-none rounded-lg text-gray-800 outline-none transition-shadow focus:ring-2 focus:ring-fm-pink/40 prose-headings:font-black prose-headings:text-gray-900 prose-a:text-fm-pink hover:prose-a:text-fm-pink/80 prose-strong:text-gray-900 prose-li:marker:text-fm-pink prose-img:rounded-2xl prose-img:border prose-img:border-gray-200"
          dangerouslySetInnerHTML={{ __html: article.body }}
        />
      </div>

      {/* HTML 直接編集 */}
      <details className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <summary className="cursor-pointer text-xs font-black tracking-wider text-gray-500">
          本文（HTML）を直接編集する
        </summary>
        <textarea
          value={article.body}
          onChange={(e) => setArticle({ ...article, body: e.target.value })}
          rows={16}
          className="mt-4 w-full rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm leading-relaxed text-gray-900 focus:border-fm-pink/40 focus:outline-none"
        />
      </details>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleSave(false)}
          disabled={loading}
          className="flex h-12 items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 text-sm font-black text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          下書きとして保存
        </button>
        <button
          onClick={() => handleSave(true)}
          disabled={loading}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-fm-pink px-6 text-sm font-black text-white transition-transform hover:scale-[1.02] disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
          公開して保存
        </button>
      </div>
    </div>
  );
}
