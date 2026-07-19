import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient, createManagementClient } from "microcms-js-sdk";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN!;
const apiKey = process.env.MICROCMS_API_KEY!;

const microcms = createClient({ serviceDomain, apiKey });
const management = createManagementClient({ serviceDomain, apiKey });

const article = {
  title:
    "【海外レポーターをAIが探す】情報収集をまるごと自動化！「AI Coaching Buddy」第2回",
  slug: "ai-coaching-buddy-ep02",
  excerpt:
    "FM大阪 iDoBuddyの「AI Coaching Buddy」第2回は、海外レポーター探しの情報収集をAIで自動化！ブログの自動巡回から候補者リストの作成まで、生放送でのデモの様子をお届けします。放送音声を元にAIが生成した記事です。",
  episodeSlug: "ep02",
  body: `<p>FM大阪の番組<strong>「iDoBuddy」</strong>のコーナー<strong>「AI Coaching Buddy」</strong>、第2回のテーマは<strong>「情報収集の業務効率化」</strong>。今回AIに挑戦してもらったのは、イドバタニュースでおなじみの<strong>海外レポーター（イドバタリポーター）探し</strong>です！</p>

<h2>レポーター探しは「人海戦術」だった</h2>
<p>イドバタニュースには、西オーストラリアや韓国、テキサスなど、海外在住のリポーターさんが登場し、現地の今を届けてくれます。番組としては「イドバタリポーターを全世界に広げたい！」という夢があるそう。</p>
<p>でも、その探し方はなんと人海戦術。海外に住んでいる方々のブログを1件ずつ読んで、「この人面白そう！」「あ、この人は連絡先を公開していない……」と確認する地道な作業なんです。現在ご出演いただいている方も、実はほぼ知り合いなんだとか。それでは全世界は網羅できませんよね。</p>

<h2>Webスクレイピング＋AIで候補リストを自動生成</h2>
<p>そこでINTENTIONさんが作ったのが、海外レポーター候補を自動で集めてくれるツール。仕組みはこうです。</p>
<ul>
<li><strong>Webスクレイピング</strong>：海外生活ブログのサイトを自動で巡回し、記事情報を取得</li>
<li><strong>更新チェック</strong>：記事の更新日時や頻度から、今も活動中の人をピックアップ</li>
<li><strong>AIが概要を生成</strong>：どんな記事を書いている人か、要約と「深掘りポイント」まで作成</li>
<li><strong>リスト化</strong>：地域・国別に、ブログ名・記事タイトル・投稿日時・連絡先の有無を整理</li>
</ul>
<p>人間なら1件ずつ全部読まないと分からなかったことを、AIがまとめて調べて分類してくれる。これは便利すぎます……！</p>

<h2>生放送で無茶振りデモ！</h2>
<p>放送では、完成した候補リストをスタジオでチェック。地域・国別にブログ名や記事タイトル、連絡先の有無、そしてAIが作った概要と深掘りポイントがずらりと並ぶリストに、「これ全部AIがやったんですか!?」と驚きの声が上がりました。</p>
<p>さらに「シンガポールの人は？」「台湾がいい！」「ドバイはどう？」「ハワイ行きましょう！」と、パーソナリティからの無茶振りが次々と飛び出し、その場で世界中のレポーター候補を探す操作を実演。イドバタリポーターが全世界に広がる未来が、ぐっと近づいた気がしました。</p>

<h2>人探しにも、推し活にも使える</h2>
<p>この仕組み、実はレポーター探し以外にも応用が利きます。旅行先の情報収集、仕事での人探し、推しのニュースだけを集めてくる「推し活」まで。ネット上にある膨大な情報を、AIがまとめて「こういうのがありますよ」と分かりやすく見せてくれるわけです。</p>

<h2>まとめ</h2>
<p>今回のツールで面白いのは、「この人が面白いかどうか」の最終判断はあえてAIにさせず、番組ディレクターの感性に残している点。AIに任せる部分と人間が判断する部分の線引きこそ、AI活用のいちばん大事なところなんです。候補リストはすでにかなり良いものができているそうなので、新しいイドバタリポーターの登場が楽しみですね。次回はどんな業務改善が飛び出すのか、来週もお聴き逃しなく！</p>`,
};

const thumbnailPath = path.resolve(
  process.cwd(),
  "public/images/blog/ai-coaching-buddy-ep02.png"
);

function compressImage(inputPath: string): string {
  const ext = path.extname(inputPath).toLowerCase();
  const outputPath = inputPath.replace(ext, "-compressed.jpg");
  try {
    execSync(
      `sips -s format jpeg -s formatOptions 80 "${inputPath}" --out "${outputPath}"`,
      { stdio: "ignore" }
    );
    return outputPath;
  } catch {
    return inputPath;
  }
}

async function uploadImage(filePath: string): Promise<string> {
  const compressedPath =
    fs.statSync(filePath).size > 1_000_000 ? compressImage(filePath) : filePath;
  const file = fs.readFileSync(compressedPath);
  const name = path.basename(compressedPath);
  const type = compressedPath.endsWith(".jpg") ? "image/jpeg" : "image/png";

  try {
    const res = await management.uploadMedia({
      data: new Blob([file], { type }),
      name,
    });
    return res.url;
  } finally {
    if (compressedPath !== filePath) {
      try {
        fs.unlinkSync(compressedPath);
      } catch {
        // ignore cleanup error
      }
    }
  }
}

async function main() {
  console.log("Uploading thumbnail to microCMS...");
  const thumbnailUrl = await uploadImage(thumbnailPath);
  console.log(`Thumbnail: ${thumbnailUrl}`);

  console.log("Creating article...");
  const res = await microcms.create({
    endpoint: "articles",
    content: {
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      body: article.body,
      thumbnail: thumbnailUrl,
      episodeSlug: article.episodeSlug,
      published: new Date().toISOString(),
    },
  });
  console.log(`Created: ${JSON.stringify(res)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
