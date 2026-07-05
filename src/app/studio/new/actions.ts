"use server";

import OpenAI from "openai";
import { createArticle, updateArticle } from "@/lib/microcms";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function transcribeAudio(formData: FormData): Promise<{ text: string; error?: string }> {
  try {
    const file = formData.get("audio") as File;
    if (!file) return { text: "", error: "音声ファイルが見つかりません" };

    const transcription = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
      language: "ja",
    });

    return { text: transcription.text };
  } catch (err) {
    console.error(err);
    return { text: "", error: "文字起こしに失敗しました" };
  }
}

export interface GeneratedArticle {
  title: string;
  excerpt: string;
  body: string;
  mainKeyword1: string;
  mainKeyword2: string;
  location: string;
  broadcastDate: string;
  programName: string;
}

export async function generateArticle(transcript: string): Promise<GeneratedArticle & { error?: string }> {
  try {
    const prompt = `以下はFM大阪のラジオ番組「iDoBuddy・イドバタニュース」の放送音声を文字起こししたものです。
この内容をもとに、Webサイトに掲載するブログ記事を作成してください。

要件：
- タイトルは親しみやすく、番組の雰囲気が伝わるものにする
- リード文（excerpt）は2〜3行で内容を簡潔に紹介
- 本文は HTML タグ（p, h2, ul, li, strong）を使って整形。長さは中程度（800〜1200文字程度）
- 画像を挿入する箇所には <!-- IMAGE:n --> というコメントを本文中に入れる（n は 1, 2, 3）。見出しの後や段落の区切りに均等に配置。

また、記事の視覚化に必要な情報も同時に抽出してください。
- mainKeyword1: 記事で最も重要なキーワード（食べ物、場所、モノなど）
- mainKeyword2: 2番目に重要なキーワード（スポーツ、文化、トレンドなど）
- location: 記事に関係する地域（例：ホーチミン、大阪、ベトナム）
- broadcastDate: 放送日（不明な場合は今日の日付 "2026-07-05"）
- programName: 番組名（例：iDoBuddy・イドバタニュース）

出力は以下の JSON 形式のみで返してください：
{
  "title": "...",
  "excerpt": "...",
  "body": "<p>...</p><!-- IMAGE:1 --><h2>...</h2><p>...</p><!-- IMAGE:2 -->...",
  "mainKeyword1": "...",
  "mainKeyword2": "...",
  "location": "...",
  "broadcastDate": "2026-07-05",
  "programName": "iDoBuddy・イドバタニュース"
}

文字起こし：
${transcript}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "あなたはFM大阪のラジオ番組ブログを書く優秀な編集者です。日本語で自然なWeb記事を作成してください。",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const raw = completion.choices[0].message.content;
    if (!raw) throw new Error("Empty response");

    const parsed = JSON.parse(raw) as GeneratedArticle;
    return parsed;
  } catch (err) {
    console.error(err);
    return {
      title: "",
      excerpt: "",
      body: "",
      mainKeyword1: "",
      mainKeyword2: "",
      location: "",
      broadcastDate: new Date().toISOString().split("T")[0],
      programName: "iDoBuddy・イドバタニュース",
      error: "記事生成に失敗しました",
    };
  }
}

export interface GeneratedImages {
  thumbnailUrl: string;
  articleImageUrls: string[];
}

function buildThumbnailPrompt(params: {
  title: string;
  mainKeyword1: string;
  mainKeyword2: string;
  location: string;
  broadcastDate: string;
  programName: string;
}): string {
  const { title, mainKeyword1, mainKeyword2, location, broadcastDate, programName } = params;
  return `Create a 16:9 colorful pop-art radio show article thumbnail for a Japanese FM radio website. Use a bright white background with vivid paint splashes, halftone dots, paper confetti, sticker badges, colorful ribbons, speech bubbles, radio icons, a retro yellow radio, microphone, ON AIR badge, music notes, and a lively Osaka FM radio energy. The design should feel like a fun, official FM Osaka / iDoBuddy news article thumbnail, not a serious newspaper graphic.

Place a large tilted white central card with bold black Japanese gothic typography. Main article title: ${title}. Make the most important keywords visually dominant: ${mainKeyword1} and ${mainKeyword2}. Add a small logo-like text in the top-left: ${programName} NEWS. Add a vivid pink ON AIR splash badge with the broadcast date: ${broadcastDate} ON AIR!. Add a colorful speech bubble that says: ${location} 現地リポート!. Add another sticker saying: 最新トレンドをお届け!

Use realistic cutout-style visual objects related to the topics: ${mainKeyword1} and ${mainKeyword2}. If the topic is food, show it as a large appetizing realistic object. If the topic is sport, show sports gear and a small action scene or court. Add a city skyline or local visual elements related to ${location} along the bottom. Add a retro yellow radio and microphone near the left side. Add local flag colors subtly in a top-right badge.

The composition should be dense, energetic, layered, commercial, crisp, readable, and suitable for a website hero thumbnail. Use vivid pink, electric blue, yellow, green, orange, cyan, black, and white. Prioritize readable Japanese text, especially the main title. Keep Japanese text minimal and accurate. Avoid dark mood, minimal design, unreadable text, broken characters, serious news style, or unrelated people.`;
}

function buildArticleImagePrompt(index: number, params: {
  title: string;
  mainKeyword1: string;
  mainKeyword2: string;
  location: string;
}): string {
  const { title, mainKeyword1, mainKeyword2, location } = params;
  const themes = [
    `A realistic, high-quality DSLR photograph of ${mainKeyword1} in ${location}. Bright studio lighting, vivid colors, clean composition, editorial photography style. No text, no logos, no people.`,
    `A realistic, high-quality DSLR photograph of ${mainKeyword2} scene in ${location}. Bright natural lighting, crisp details, lifestyle editorial style. No text, no logos, no close-up faces.`,
    `A realistic, high-quality DSLR photograph of a local street or atmosphere in ${location} related to "${title}". Warm lighting, cinematic depth of field, travel editorial style. No text, no logos.`,
  ];
  return themes[index] ?? themes[0];
}

async function downloadImageAsBuffer(url: string): Promise<{ buffer: Buffer; contentType: string }> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download image: ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  const contentType = res.headers.get("content-type") || "image/png";
  return { buffer: Buffer.from(arrayBuffer), contentType };
}

async function uploadBufferToMicroCMS(buffer: Buffer, filename: string, contentType: string): Promise<string> {
  const boundary = `----FormBoundary${Date.now()}`;
  const body = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: ${contentType}\r\n\r\n`),
    buffer,
    Buffer.from(`\r\n--${boundary}--\r\n`),
  ]);

  const res = await fetch(
    `https://${process.env.MICROCMS_SERVICE_DOMAIN}.microcms-management.io/api/v1/media`,
    {
      method: "POST",
      headers: {
        "X-MICROCMS-API-KEY": process.env.MICROCMS_API_KEY!,
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
      },
      body,
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`microCMS upload failed: ${text}`);
  }

  const data = (await res.json()) as { url: string };
  return data.url;
}

export async function generateAndUploadImages(params: {
  title: string;
  mainKeyword1: string;
  mainKeyword2: string;
  location: string;
  broadcastDate: string;
  programName: string;
}): Promise<GeneratedImages & { error?: string }> {
  try {
    const thumbnailPrompt = buildThumbnailPrompt(params);
    const imagePrompts = [
      buildArticleImagePrompt(0, params),
      buildArticleImagePrompt(1, params),
      buildArticleImagePrompt(2, params),
    ];

    const [thumbnailRes, ...articleImageRes] = await Promise.all([
      openai.images.generate({
        model: "gpt-image-2",
        prompt: thumbnailPrompt,
        size: "1536x1024",
        n: 1,
        quality: "high",
      }),
      ...imagePrompts.map((prompt) =>
        openai.images.generate({
          model: "gpt-image-2",
          prompt,
          size: "1536x1024",
          n: 1,
          quality: "high",
        })
      ),
    ]);

    const thumbnailTempUrl = thumbnailRes.data?.[0]?.url;
    const articleImageTempUrls = articleImageRes.map((res) => res.data?.[0]?.url).filter(Boolean) as string[];

    if (!thumbnailTempUrl) throw new Error("Thumbnail generation failed");
    if (articleImageTempUrls.length !== 3) throw new Error("Article image generation failed");

    const [thumbnailUrl, ...uploadedArticleUrls] = await Promise.all([
      downloadImageAsBuffer(thumbnailTempUrl).then(({ buffer, contentType }) =>
        uploadBufferToMicroCMS(buffer, `thumb-${Date.now()}.png`, contentType)
      ),
      ...articleImageTempUrls.map((url, i) =>
        downloadImageAsBuffer(url).then(({ buffer, contentType }) =>
          uploadBufferToMicroCMS(buffer, `article-${i + 1}-${Date.now()}.png`, contentType)
        )
      ),
    ]);

    return {
      thumbnailUrl,
      articleImageUrls: uploadedArticleUrls,
    };
  } catch (err) {
    console.error(err);
    return {
      thumbnailUrl: "",
      articleImageUrls: [],
      error: "画像生成・アップロードに失敗しました",
    };
  }
}

function embedImagesInBody(body: string, imageUrls: string[]): string {
  let index = 0;
  return body.replace(/<!--\s*IMAGE:\s*(\d+)\s*-->/g, () => {
    const url = imageUrls[index] || "";
    index++;
    if (!url) return "";
    return `<figure class="my-8"><img src="${url}" alt="" class="w-full rounded-2xl border border-white/10 shadow-lg" /></figure>`;
  });
}

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base}-${Date.now().toString(36)}`;
}

export async function saveArticle(
  article: GeneratedArticle & {
    published: boolean;
    episodeSlug?: string;
    id?: string;
    thumbnailUrl?: string;
    articleImageUrls?: string[];
  }
): Promise<{ slug?: string; error?: string }> {
  try {
    if (!article.title.trim()) {
      return { error: "タイトルを入力してください" };
    }

    const slug = generateSlug(article.title);
    const bodyWithImages = embedImagesInBody(article.body, article.articleImageUrls ?? []);

    const content = {
      title: article.title,
      slug,
      excerpt: article.excerpt,
      body: bodyWithImages,
      thumbnail: article.thumbnailUrl || "/images/blog/thumb.png",
      episodeSlug: article.episodeSlug ?? "ep01",
      published: article.published ? new Date().toISOString() : null,
    };

    if (article.published && !article.body.trim()) {
      return { error: "公開するには本文を入力してください" };
    }

    if (article.id) {
      await updateArticle(article.id, content);
      return { slug };
    }

    await createArticle(content);
    return { slug };
  } catch (err) {
    console.error(err);
    return { error: "保存に失敗しました" };
  }
}

export async function uploadImageToMicroCMS(formData: FormData): Promise<{ url?: string; error?: string }> {
  try {
    const file = formData.get("image") as File;
    if (!file) return { error: "画像ファイルが見つかりません" };

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadBufferToMicroCMS(buffer, file.name, file.type);
    return { url };
  } catch (err) {
    console.error(err);
    return { error: "画像アップロードに失敗しました" };
  }
}
