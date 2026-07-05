import Link from "next/link";
import { getAllArticles } from "@/lib/microcms";
import { getEpisodeBySlug } from "@/lib/content";
import { PlusCircle, FileText, Eye, Clock } from "lucide-react";

export default async function DashboardPage() {
  const res = await getAllArticles({ orders: "-published", limit: 100 });
  const allArticles = res.contents;
  const publishedCount = allArticles.filter((p) => p.published).length;
  const draftCount = allArticles.filter((p) => !p.published).length;
  const thisMonthCount = allArticles.filter((p) => {
    if (!p.published) return false;
    const d = new Date(p.published);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const recentPosts = allArticles.slice(0, 5);

  return (
    <div className="space-y-8 text-gray-900">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <DashboardCard
          label="公開記事"
          value={publishedCount}
          icon={FileText}
          accent="text-fm-pink"
        />
        <DashboardCard
          label="下書き"
          value={draftCount}
          icon={Clock}
          accent="text-fm-orange"
        />
        <DashboardCard
          label="今月の生成数"
          value={thisMonthCount}
          icon={Eye}
          accent="text-fm-blue"
        />
      </div>

      {/* Quick actions */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-black tracking-wider text-gray-900">クイックアクション</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/studio/new"
            className="flex items-center gap-2 rounded-xl bg-fm-pink px-5 py-2.5 text-xs font-black text-white transition-transform hover:scale-105"
          >
            <PlusCircle className="h-4 w-4" />
            新規記事を作成
          </Link>
          <Link
            href="/studio/articles"
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-black text-gray-700 transition-colors hover:bg-gray-50"
          >
            <FileText className="h-4 w-4" />
            記事一覧
          </Link>
        </div>
      </div>

      {/* Recent articles */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-black tracking-wider text-gray-900">最近の記事</h2>
        <div className="mt-4 space-y-3">
          {recentPosts.map((post) => {
            const episode = getEpisodeBySlug(post.episodeSlug);
            return (
              <div
                key={post.id}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 transition-colors hover:bg-gray-100"
              >
                <div>
                  <p className="text-sm font-bold text-gray-900">{post.title}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {episode?.title} · {post.published?.split("T")[0] ?? "未公開"}
                  </p>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  className="text-xs font-bold text-fm-pink hover:underline"
                >
                  表示
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DashboardCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-black tracking-wider text-gray-400">{label}</p>
          <p className="mt-2 text-4xl font-black text-gray-900">{value}</p>
        </div>
        <div className={`rounded-xl bg-gray-50 p-3 ${accent}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
