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
    "【新コーナー始動】放送中にAIがブログとSNS投稿を自動生成！「AI Coaching Buddy」第1回",
  slug: "ai-coaching-buddy-ep01",
  excerpt:
    "FM大阪 iDoBuddyに新コーナー「AI Coaching Buddy」が登場！第1回は、放送中の会話をその場でAIが文字起こしして、ブログ記事とXの投稿文を自動生成するデモをお届けしました。放送音声を元にAIが生成した記事です。",
  episodeSlug: "ep01",
  body: `<p>FM大阪の番組<strong>「iDoBuddy」</strong>に、新コーナー<strong>「AI Coaching Buddy」</strong>が誕生しました！企業向けのAI研修や業務改善のためのAI開発、そして社内でAIを使いこなせる人材の育成までを一貫して支援している<strong>株式会社INTENTION</strong>さんの全面協力のもと、iDoBuddyの業務にAIをどんどん導入していこうという企画なんです。7月の1ヶ月間、全4回でお届けします。</p>

<h2>第1回のテーマは「ブログをAIで自動生成」</h2>
<p>ラジオ番組にも、実はいろんな業務があります。その中でもブログの執筆は、1本書くのに1時間ほどかかってしまう悩みのタネだったそう。そこで第1回は、<strong>「放送の音声をAIに聞かせて、ブログを作れないか？」</strong>に挑戦しました。</p>

<h2>放送中の会話が、その場でXの投稿文に</h2>
<p>スタジオでは、コーナー冒頭からの会話をその場で録音してAIに渡し、Xの投稿文章を作ってもらうデモを実施。結果は……ほんの数十秒で完成！「もうできちゃったの!?」と驚きの声が上がりました。音声の内容をベースに、誤字脱字のない自然な文章がその場で出てくるスピード感、放送を聞き逃した方はradikoのタイムフリーでぜひ体感してみてください。</p>

<h2>コツは「1つのAIに全部やらせない」こと</h2>
<p>今回のポイントは、1つの業務を<strong>3つのAI</strong>に分けたことなんです。</p>
<ul>
<li><strong>文字起こしAI</strong>：放送音声をテキストに変換する</li>
<li><strong>要約AI</strong>：ダラダラした話し言葉を読みやすくまとめる</li>
<li><strong>画像生成AI</strong>：文章に合った画像を作る</li>
</ul>
<p>1つのAIにすべてを任せるより、役割を分けてあげた方が精度の高いものができあがります。実際に、先週のベトナム回の放送音声から作ったブログ記事には、バインミーやピックルボールの画像までしっかり入っていて、スタジオは「これ全部AIが!?」と大盛り上がりでした。</p>

<h2>議事録はAIに任せる時代へ</h2>
<p>「ラジオ以外の仕事でも使えるの？」という話題では、会議の議事録が例に挙がりました。人間が議事録を取ると、どうしてもその人の主観やバイアスが入ってしまうもの。</p>
<blockquote><p>作業的な業務はAIに任せて、人間は判断だけをする。そんな社会になったらいい。</p></blockquote>
<p>実際にINTENTIONさんの社内では、会議が終わった瞬間に文字起こしとまとめが自動で出てきて、その日のうちに次の戦略決めまで完結しているそうです。</p>

<h2>AI導入のコツは「ボトルネック」と「ゴールポスト」</h2>
<p>「AIを導入したけど、結局活用できていない」という会社も多いのではないでしょうか。流行りのツールの使い方ばかり追いかけるのではなく、<strong>会社のボトルネック（課題）をみんなで認識して、ゴールポスト（目指す姿）を握る</strong>ことが先決なんだそう。コアな部分さえ理解すれば、重要なところは5〜6時間ほどのコーチングでも身につくそうですよ。</p>

<h2>まとめ</h2>
<p>新コーナー第1回は、放送中の会話がその場でブログやSNS投稿に変わる瞬間をお届けしました。ちなみに、この記事もまさに放送音声からAIが生成したものなんです。次回は、また別の業務改善に挑戦します。iDoBuddyとAI Coaching Buddyのこれからに、ぜひご注目ください！</p>`,
};

const thumbnailPath = path.resolve(
  process.cwd(),
  "public/images/blog/ai-coaching-buddy-ep01.png"
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
