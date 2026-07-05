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

const articleDir = path.resolve(process.cwd(), "public/images/blog");

const legacyArticle = {
  title: "ベトナム発グルメ「バインミー」と話題のスポーツ「ピックルボール」",
  slug: "vietnam-banhmi-pickleball",
  excerpt:
    "ホーチミン在住のイドバタリポーターが、現地で大人気のバインミーとピックルボールの最新トレンドを届けてくれました。放送音声を元に AI が生成した記事です。",
  body: `<p>FM大阪の番組<strong>「iDoBuddy・イドバタニュース」</strong>の国際コーナーでは、世界各地に住むリポーターからその土地の最新情報をお届けしています。今回はベトナム・ホーチミンから、現地で話題のグルメとスポーツをレポートします。</p>
<figure class="my-8"><img src="__SAIGON_STREET__" alt="ホーチミンの夕暮れ時の街並み" class="w-full rounded-2xl border border-white/10" /><figcaption class="mt-2 text-center text-xs text-white/40">ホーチミンの街角。バインミーの屋台とバイクが行き交う夕暮れ</figcaption></figure>

<h2>ベトナムの今：暑さと夕立の rhythm</h2>
<p>ホーチミンは年中暑い印象がありますが、5月から梅雨入りし、最近は毎日午後に約2時間ほどのスコールが訪れるそう。雨が降ったあとは少しムワッとしますが、日が暮れると涼しく過ごしやすい時間帯もあるとのこと。大阪との時差は2時間。正午の生放送が始まる頃、現地は朝10時です。</p>

<h2>世界を席巻するベトナム発サンドイッチ「バインミー」</h2>
<p>日本でもおなじみになりつつあるベトナム料理。その中でも今、世界的人気を集めているのが<strong>「バインミー」</strong>です。</p>

<h3>バインミーって何？</h3>
<p>「バインミー」はベトナム語で<strong>「パン」</strong>を意味します。20cmほどの短いフランスパンを縦に切り、具材をたっぷり挟んだサンドイッチ。フランス統治時代の影響を受けながら、ベトナム流にアレンジされた食文化の象徴です。</p>

<h3>定番の具材</h3>
<ul>
<li><strong>ベトナム風ポークハム</strong>：豚肉のハム。日本のものより少し油分が多めで、しっとりとした食感。</li>
<li><strong>パテ</strong>：フランスの影響を感じる濃厚な味わい。</li>
<li><strong>野菜</strong>：キュウリ、パクチー、生野菜、ネギ。</li>
<li><strong>調味料</strong>：マヨネーズ風ソースと、大豆ベースの醤油。</li>
</ul>
<p>現地ではパクチーを嫌う人はほとんどいないそう。日本のように好き嫌いが分かれることもなく、日常の野菜として親しまれているんです。</p>

<h3>アレンジも自由自在</h3>
<p>具材が野菜主体なので、お店によって中身がガラリと変わります。定番のハムやパテの他にも、<strong>さつま揚げ（チャーカー）</strong>を入れたり、目玉焼きを追加したり。パクチー抜きやハム大盛など、サブウェイのようにカスタマイズできるお店も多いです。</p>
<blockquote>
<p>「1個約3万ドン（約180円）」。現地では驚きのコスパで、朝・昼・夜問わず食べられています。</p>
</blockquote>
<figure class="my-8"><img src="__BANHMI__" alt="バインミーのクローズアップ" class="w-full rounded-2xl border border-white/10" /><figcaption class="mt-2 text-center text-xs text-white/40">具材がたっぷり詰まったバインミー</figcaption></figure>

<h2>ベトナム中が夢中のスポーツ「ピックルボール」</h2>
<p>続いてのトピックはスポーツ。ベトナムではサッカーやバドミントンが人気ですが、最近急成長している新しいスポーツが<strong>「ピックルボール」</strong>です。</p>

<h3>ピックルボールのルール</h3>
<p>テニス・バドミントン・卓球を合わせたようなスポーツ。コートはバドミントンぐらいの広さで、ネットはテニスぐらいの高さ。ラケットは卓球のラケットのような平らな板で、大きめのプラスチック製ボールを打ち合います。</p>
<ul>
<li>ボールがあまり飛ばないので、初心者でもラリーが続きやすい。</li>
<li>1対1のシングルス、2対2のダブルスが可能。</li>
<li>年齢や体力に関係なく誰でも楽しめる「ユニバーサルスポーツ」として注目。</li>
</ul>

<h3>ベトナムで爆発的ブーム</h3>
<p>ホーチミンの街中では、空いている土地にピックルボールコートが次々と登場。大会や賞金付きのイベントも開催されるほどの人気ぶりです。アメリカでも広がっており、将来的にはオリンピック種目になる可能性も？</p>
<figure class="my-8"><img src="__PICKLEBALL__" alt="ホーチミンでピックルボールを楽しむ人々" class="w-full rounded-2xl border border-white/10" /><figcaption class="mt-2 text-center text-xs text-white/40">ホーチミンのコートで盛り上がるピックルボール</figcaption></figure>

<blockquote>
<p>ピックルボールをして、バインミーを食べて、ベトナムビールを飲む。現地の新しい過ごし方です。</p>
</blockquote>

<h2>まとめ</h2>
<p>今回の放送では、ベトナムの日常生活に根付いた<strong>バインミー</strong>と、誰でも始められる新スポーツ<strong>ピックルボール</strong>を紹介しました。どちらも「気軽に楽しめる」という点で共通しており、現地の活気ある文化を感じさせてくれます。</p>
<p>来週も別の国からリアルタイムの情報が届きます。お楽しみに。</p>`,
  episodeSlug: "ep01",
};

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

function getImageSize(filePath: string): { width: number; height: number } {
  const output = execSync(`file "${filePath}"`).toString();
  const match = output.match(/(\d{3,})\s*x\s*(\d{3,})(?:,|$)/);
  if (!match) throw new Error(`Could not determine image size: ${output}`);
  return { width: parseInt(match[1], 10), height: parseInt(match[2], 10) };
}

async function uploadImage(filePath: string): Promise<{ url: string; width: number; height: number }> {
  const compressedPath = fs.statSync(filePath).size > 1_000_000 ? compressImage(filePath) : filePath;
  const file = fs.readFileSync(compressedPath);
  const name = path.basename(compressedPath);
  const type = compressedPath.endsWith(".jpg") ? "image/jpeg" : "image/png";
  const { width, height } = getImageSize(compressedPath);

  try {
    const res = await management.uploadMedia({
      data: new Blob([file], { type }),
      name,
    });

    if (compressedPath !== filePath) {
      try {
        fs.unlinkSync(compressedPath);
      } catch {
        // ignore cleanup error
      }
    }

    return { url: res.url, width, height };
  } catch (err) {
    if (compressedPath !== filePath) {
      try {
        fs.unlinkSync(compressedPath);
      } catch {
        // ignore cleanup error
      }
    }
    throw err;
  }
}

async function main() {
  console.log("Uploading images to microCMS...");
  const thumb = await uploadImage(path.join(articleDir, "thumb.png"));
  const saigon = await uploadImage(path.join(articleDir, "saigon-street.png"));
  const banhmi = await uploadImage(path.join(articleDir, "banhmi.png"));
  const pickleball = await uploadImage(path.join(articleDir, "pickleball.png"));

  const body = legacyArticle.body
    .replace("__SAIGON_STREET__", saigon.url)
    .replace("__BANHMI__", banhmi.url)
    .replace("__PICKLEBALL__", pickleball.url);

  console.log("Creating article...");
  await microcms.create({
    endpoint: "articles",
    content: {
      title: legacyArticle.title,
      slug: legacyArticle.slug,
      excerpt: legacyArticle.excerpt,
      body,
      thumbnail: thumb.url,
      episodeSlug: legacyArticle.episodeSlug,
      published: new Date().toISOString(),
    },
  });

  console.log("Migration completed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
