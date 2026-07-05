import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-lg font-black tracking-wide text-gray-900">設定</h2>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-black tracking-wider text-gray-900">アカウント情報</h3>
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-[11px] font-black tracking-wider text-gray-400">メールアドレス</label>
            <p className="mt-1 text-sm text-gray-700">{user?.email}</p>
          </div>
          <div>
            <label className="text-[11px] font-black tracking-wider text-gray-400">ユーザーID</label>
            <p className="mt-1 text-sm text-gray-700">{user?.id}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-black tracking-wider text-gray-900">microCMS 連携</h3>
        <p className="mt-2 text-xs leading-relaxed text-gray-500">
          記事データ、サムネイル、画像は microCMS に保存されます。
          コンテンツの管理は microCMS ダッシュボードで行ってください。
        </p>
      </div>
    </div>
  );
}
