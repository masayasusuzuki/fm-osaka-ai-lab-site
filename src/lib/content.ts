import { Episode, BlogPost, Member, Banner } from "@/types";

export const siteName = "FM OSAKA AI LAB";
export const siteTagline = "ラジオとAIの新しい実験場";
export const siteDescription =
  "FM大阪の番組「iDoBuddy」内コーナー「AI Coaching Buddy」。放送音声からブログ生成、情報収集、重複チェック、AIゲスト対談まで、ラジオ制作にAIを取り入れた4回の取り組みを紹介します。";

export const episodes: Episode[] = [
  {
    id: "ep01",
    slug: "ep01",
    episodeNumber: 1,
    title: "番組音声からブログ記事を自動化",
    theme: "音声 → ブログ生成",
    description:
      "放送済みの番組音声を Whisper で文字起こしし、AI がブログ記事として再構成。放送後すぐに記事が公開される体験を実演します。",
    longDescription:
      "第1回では、放送済みの番組音声を入力として、ブログ記事を AI が自動生成するフローを実演します。Whisper（OpenAIの音声認識AI）で文字起こしを行い、Claude 等の生成AIに渡してブログ記事として再構成。放送後すぐにブログが上がる体験をリスナー・スタッフにお見せします。人間が手を入れる箇所（タイトル調整・写真選定等）も明示し、現実的な運用イメージを伝えます。",
    thumbnail: "https://placehold.co/800x450/E91E8C/FFFFFF/png?text=EP01",
    publishedAt: "2026-07-14",
    accentColor: "pink",
  },
  {
    id: "ep02",
    slug: "ep02",
    episodeNumber: 2,
    title: "情報収集系の業務効率化",
    theme: "AI 情報収集",
    description:
      "ニュース・トレンド・ネタ探しを AI エージェントが自動巡回。番組制作に役立つ情報を Slack へ通知する仕組みを紹介。",
    longDescription:
      "第2回では、番組制作に必要な情報収集（ニュース・トレンド・ネタ探し）を AI で自動化するフローを実演します。収集対象のソースを決め、AIエージェントが定期的に巡回。番組テーマに関連する情報を抽出し、Slack・メール・スプレッドシート等に通知します。「毎朝スタッフが自分でチェックしていた作業」がなくなるインパクトを実感していただきます。",
    thumbnail: "https://placehold.co/800x450/F7931E/FFFFFF/png?text=EP02",
    publishedAt: "2026-07-21",
    accentColor: "orange",
    locked: true,
  },
  {
    id: "ep03",
    slug: "ep03",
    episodeNumber: 3,
    title: "当選者・選曲の重複チェック、作業のリマインド",
    theme: "重複チェック・リマインド",
    description:
      "プレゼント当選者管理、楽曲の重複チェック、作業リマインドを AI で自動化。ヒューマンエラーを減らす実用例を紹介。",
    longDescription:
      "第3回では、プレゼント当選者管理・楽曲の重複チェック・作業リマインドの3つを AI で自動化するフローを実演します。応募データから重複応募・過去当選者を照合し、オンエアログと照らして選曲の被りをフラグ。さらに番組制作の定型タスクをスケジュールに応じて自動通知します。ヒューマンエラーが起きやすい確認作業を AI に任せる価値を伝えます。",
    thumbnail: "https://placehold.co/800x450/00AEEF/FFFFFF/png?text=EP03",
    publishedAt: "2026-07-28",
    accentColor: "blue",
    locked: true,
  },
  {
    id: "ep04",
    slug: "ep04",
    episodeNumber: 4,
    title: "AIと対談ラジオ形式",
    theme: "AI ゲスト対談",
    description:
      "AI を番組のゲストとして迎え、パーソナリティとリアルタイムで対談。キャラクター設計と安全設計の両方を見せます。",
    longDescription:
      "第4回では、AI を番組のゲストとして実際に出演させ、パーソナリティとリアルタイムで対談するコーナーを実演します。AIのキャラクター設定（名前・口調・話せるテーマ・話せないテーマ）を事前に定義し、返答をテキスト読み上げで音声化。AIの個性がコンテンツの面白さを決めること、そして「AIが暴走しない」安全設計を明示することがポイントです。",
    thumbnail: "https://placehold.co/800x450/8DC63F/FFFFFF/png?text=EP04",
    publishedAt: "2026-08-04",
    accentColor: "green",
    locked: true,
  },
];

export const blogPosts: BlogPost[] = [];

export const members: Member[] = [
  {
    id: "m01",
    name: "",
    role: "AIコーチ / パーソナリティ",
    affiliation: "INTENTION",
    image: "https://placehold.co/400x400/1A1A1A/FFFFFF/png?text=AI+Coach",
  },
  {
    id: "m02",
    name: "",
    role: "FM大阪担当",
    affiliation: "株式会社エフエム大阪",
    image: "https://placehold.co/400x400/E91E8C/FFFFFF/png?text=FM+Staff",
  },
  {
    id: "m03",
    name: "",
    role: "AIコーチング受講 / 出演",
    affiliation: "株式会社エフエム大阪",
    image: "https://placehold.co/400x400/00AEEF/FFFFFF/png?text=Cast",
  },
];

export const banners: Banner[] = [
  {
    id: "b01",
    title: "FM大阪公式サイト",
    image: "/images/banners/banner-official.png",
    linkUrl: "https://www.fmosaka.net/",
    order: 1,
  },
  {
    id: "b02",
    title: "FM大阪公式X",
    image: "/images/banners/banner-x.png",
    linkUrl: "https://x.com/fmosaka851",
    order: 2,
  },
  {
    id: "b03",
    title: "FM大阪公式YouTubeチャンネル",
    image: "/images/banners/banner-youtube.png",
    linkUrl: "https://www.youtube.com/channel/UC-BDgiEQMNQ5MRTAkbl6qlw",
    order: 3,
  },
];

export function getEpisodeBySlug(slug: string): Episode | undefined {
  return episodes.find((ep) => ep.slug === slug);
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostsByEpisode(episodeSlug: string): BlogPost[] {
  return blogPosts.filter((post) => post.episodeSlug === episodeSlug);
}

export function getRecentBlogPosts(limit: number = 3): BlogPost[] {
  return [...blogPosts]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, limit);
}
