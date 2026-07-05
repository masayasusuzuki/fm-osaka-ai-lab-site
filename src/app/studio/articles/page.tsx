"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MicroCMSArticle } from "@/lib/microcms";
import { getEpisodeBySlug } from "@/lib/content";
import { FileText, ExternalLink, Trash2, Pencil, Eye, Loader2 } from "lucide-react";
import { getAllArticlesAction, toggleArticlePublished, removeArticle } from "./actions";

export default function ArticlesPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<MicroCMSArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getAllArticlesAction({ orders: "-published", limit: 100 })
      .then((res) => {
        if (res.error) {
          setError(res.error);
        } else {
          setPosts(res.contents);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (post: MicroCMSArticle) => {
    const result = await toggleArticlePublished(post.id, post.published);
    if (result.error) {
      setError(result.error);
      return;
    }
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? { ...p, published: p.published ? null : new Date().toISOString() }
          : p
      )
    );
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("この記事を削除しますか？")) return;
    const result = await removeArticle(id);
    if (result.error) {
      setError(result.error);
      return;
    }
    setPosts((prev) => prev.filter((p) => p.id !== id));
    router.refresh();
  };

  return (
    <div className="space-y-6 text-gray-900">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black tracking-wide text-gray-900">記事一覧</h2>
        <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-bold text-gray-500">
          {posts.length} 件
        </span>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {loading && posts.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-fm-pink" />
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => {
              const episode = getEpisodeBySlug(post.episodeSlug);
              const isPublished = !!post.published;
              return (
                <div
                  key={post.id}
                  className="group flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all hover:border-gray-200 hover:bg-gray-100"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{post.title}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {episode?.title} · {post.published?.split("T")[0] ?? "未公開"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggle(post)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isPublished ? "bg-fm-pink" : "bg-gray-300"
                      }`}
                      title={isPublished ? "公開中" : "下書き"}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isPublished ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                    <span className="min-w-[3.5rem] text-xs font-bold text-gray-500">
                      {isPublished ? "公開中" : "非公開"}
                    </span>

                    <Link
                      href={`/studio/articles/${post.id}/edit`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
                      title="編集"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>

                    <Link
                      href={`/studio/articles/${post.id}/preview`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-fm-blue"
                      title="プレビュー"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>

                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-fm-pink"
                      title="サイトで表示"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>

                    <button
                      onClick={() => handleDelete(post.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                      title="削除"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
