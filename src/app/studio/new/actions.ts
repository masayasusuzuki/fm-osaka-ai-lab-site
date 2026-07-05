"use server";

import OpenAI, { toFile } from "openai";
import { createArticle, updateArticle } from "@/lib/microcms";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/v1",
});

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err && typeof err.message === "string") {
    return err.message;
  }
  return JSON.stringify(err);
}

// 音声はブラウザから Supabase Storage に直接アップロードし、ここにはパスだけを渡す。
// Vercel のサーバーレス関数はリクエストボディ 4.5MB 制限があり、
// 音声ファイルを Server Action に直接 POST すると 413 (Content Too Large) になるため。
export async function transcribeAudio(storagePath: string): Promise<{ text: string; error?: string }> {
  const supabase = await createSupabaseServerClient();
  try {
    if (!storagePath) return { text: "", error: "音声ファイルが見つかりません" };

    // Supabase Storage から音声をダウンロード（ログイン中ユーザーのセッションで認可）
    const { data, error } = await supabase.storage.from("audio-uploads").download(storagePath);
    if (error || !data) {
      return { text: "", error: `音声の取得に失敗しました: ${error?.message ?? "unknown"}` };
    }

    const buffer = Buffer.from(await data.arrayBuffer());
    const filename = storagePath.split("/").pop() || "audio.mp3";
    const transcription = await openai.audio.transcriptions.create({
      file: await toFile(buffer, filename),
      model: "whisper-1",
      language: "ja",
    });

    return { text: transcription.text };
  } catch (err) {
    console.error(err);
    return { text: "", error: `文字起こしに失敗しました: ${getErrorMessage(err)}` };
  } finally {
    // 文字起こし後は音声を残さない（削除失敗しても本処理は止めない）
    try {
      if (storagePath) {
        await supabase.storage.from("audio-uploads").remove([storagePath]);
      }
    } catch {
      // noop
    }
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

【プロジェクト背景】
- この記事は「FM OSAKA AI LAB」という企画サイトに掲載される。放送音声から AI がブログ記事を自動生成する、FM大阪の公式な取り組み
- 番組は FM大阪の「iDoBuddy（イドバディ）」。その中のコーナー「イドバタニュース」の放送回をもとに記事を作る
- 読者はラジオリスナーと、番組をまだ知らない一般のWeb読者

【固有名詞の正式表記（文字起こしは音声認識のため誤記が多い。必ず以下の表記に修正すること）】
- 番組名: iDoBuddy（誤記例: 井戸バディ、イドバディー、火曜バディ）
- コーナー名: イドバタニュース（誤記例: 井戸畑ニュース、井戸端ニュース、リードバターニュース）
- 放送局: FM大阪（誤記例: FM OSAKA以外の表記ゆれ）
- その他の固有名詞（地名・料理名・スポーツ名など）も、一般的に正しい表記へ修正する（例: 「バイミー」「パインミー」→「バインミー」、「3万ドル」→「3万ドン」※ベトナムの通貨はドン）
- 誤記かどうか判断できない固有名詞は、文脈から最も自然な一般的表記を採用する

【文体・トーン（最重要）】
- ラジオ番組の公式ブログらしい、リスナーに語りかける親しみやすい文体で書くこと
- 「〜なんです」「〜ですよね」「〜してみてください」など、会話のような柔らかい語り口を使う
- 放送中の楽しい掛け合いの空気感・テンションをそのまま文章に残す。驚きやツッコミも適度に入れてよい（例:「え、パンって意味だったんですね！」）
- report調・論文調・ニュース記事調の堅い文章はNG。「〜である」「〜と言えるだろう」は使わない
- ただし砕けすぎず、番組公式サイトとして読みやすい品は保つ

【重要な制約】
- 人名（人物の名前）は絶対に記事に含めないこと。著名人、タレント、専門家など、すべての人名を除外する
- 固有名詞（会社名、施設名、地名）は OK だが、人の名前は削除すること
- 「〇〇さんが...」という表現は「リポーターさんが...」「現地では...」など一般的な表現に変更する

【本文の要件】
- 長さ: 必ず1500文字以上（HTMLタグを除いた本文テキストのみで1500文字以上）。これは絶対条件
- 構成: h2 見出しを5つ以上使い、各セクションは300文字以上書く
- 放送で触れられた話題について、一般的な背景知識・豆知識・文化的な文脈を補足して内容を膨らませる（例: 料理なら歴史や食べ方、スポーツならルーツや日本での広がり）
- HTML タグ（p, h2, ul, li, strong）を使って階層的に整形
- リスト（ul, li）を活用して情報を整理する
- 最後に「まとめ」のセクションを設ける
- 画像を挿入する箇所には <!-- IMAGE:n --> というコメントを入れる（n は 1, 2, 3）。見出しの後や段落の区切りに均等に配置

【その他の要件】
- タイトルは親しみやすく、番組の雰囲気が伝わるものにする
- リード文（excerpt）は2〜3行で内容を簡潔に紹介

【抽出情報】
- mainKeyword1: 記事で最も重要なキーワード（食べ物、場所、モノなど）
- mainKeyword2: 2番目に重要なキーワード（スポーツ、文化、トレンドなど）
- location: 記事に関係する地域（例：ホーチミン、大阪、ベトナム）
- broadcastDate: 放送日（不明な場合は "2026-07-06"）
- programName: 番組名（例：iDoBuddy・イドバタニュース）

出力は以下の JSON 形式のみで返してください：
{
  "title": "...",
  "excerpt": "...",
  "body": "<p>...</p><h2>...</h2><!-- IMAGE:1 --><p>...</p><h2>...</h2><!-- IMAGE:2 --><ul><li>...</li></ul><p>...</p><!-- IMAGE:3 --><p>...</p>",
  "mainKeyword1": "...",
  "mainKeyword2": "...",
  "location": "...",
  "broadcastDate": "2026-07-06",
  "programName": "iDoBuddy・イドバタニュース"
}

文字起こし：
${transcript}`;

    const completion = await deepseek.chat.completions.create({
      model: "deepseek-v4-flash",
      messages: [
        {
          role: "system",
          content:
            "あなたはFM大阪のラジオ番組の公式ブログを書くベテランのラジオ好きライターです。放送の楽しい空気感をそのまま文章にするのが得意で、リスナーに語りかけるような親しみやすい記事を書きます。堅い報道調は絶対に使いません。人名は絶対に含めないこと。",
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
      error: `記事生成に失敗しました: ${getErrorMessage(err)}`,
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

// gpt-image 系モデルは URL ではなく base64 (b64_json) で画像を返す。
// b64_json / url どちらの形式でも Buffer として取り出す。
async function extractImageBuffer(res: OpenAI.Images.ImagesResponse): Promise<Buffer | undefined> {
  const item = res.data?.[0];
  if (!item) return undefined;
  if (item.b64_json) return Buffer.from(item.b64_json, "base64");
  if (item.url) {
    const dl = await fetch(item.url);
    if (!dl.ok) throw new Error(`Failed to download image: ${dl.status}`);
    return Buffer.from(await dl.arrayBuffer());
  }
  return undefined;
}

// 画像を1枚生成して microCMS にアップロードし、公開URLを返す。
// base64 のままクライアントに返すとペイロードが巨大になるため、サーバー側で完結させる。
async function generateImageToMicroCMS(prompt: string, filename: string): Promise<string> {
  const res = await openai.images.generate({
    model: "gpt-image-2",
    prompt,
    size: "1536x1024",
    n: 1,
    quality: "high",
  });
  const buffer = await extractImageBuffer(res);
  if (!buffer) throw new Error("Image generation returned no data");
  return uploadBufferToMicroCMS(buffer, filename, "image/png");
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

// 画像生成プロンプト（=各画像に何が写っているかの説明文）を DeepSeek に渡し、
// 記事のどのブロックの後に各画像を置くべきかを判断させてマーカーを配置し直す。
// 画像自体を見る必要はない（プロンプトを解析すれば内容がわかる）ため、テキストモデルで完結する。
async function placeImageMarkers(body: string, imagePrompts: string[]): Promise<string> {
  try {
    // 既存マーカーを除去してからトップレベル要素に分割
    const cleanBody = body.replace(/<!--\s*IMAGE:\s*\d+\s*-->/g, "");
    const blocks = cleanBody.match(/<(p|h2|h3|ul|ol|blockquote)[^>]*>[\s\S]*?<\/\1>/g);
    if (!blocks || blocks.length < 3) return body;

    const blockList = blocks
      .map((b, i) => `[${i}] ${b.replace(/<[^>]+>/g, "").slice(0, 80)}`)
      .join("\n");
    const promptList = imagePrompts
      .map((p, i) => `画像${i + 1}: ${p}`)
      .join("\n");

    const completion = await deepseek.chat.completions.create({
      model: "deepseek-v4-flash",
      messages: [
        {
          role: "system",
          content: "あなたは記事レイアウトの専門家です。JSON のみで回答してください。",
        },
        {
          role: "user",
          content: `以下はブログ記事の構成ブロック一覧と、記事に挿入する3枚の画像の生成プロンプト（＝画像の内容説明）です。
各画像を、内容が最も合致するブロックの直後に配置してください。

【記事のブロック一覧】
${blockList}

【画像の内容（生成プロンプト）】
${promptList}

ルール:
- 同じブロックの直後に複数の画像を置かない
- 画像の内容とセクションの話題が一致する場所を選ぶ（例: 食べ物の画像は食べ物のセクションへ）
- 見出し（h2）の直後よりも、その話題を説明した段落の直後が望ましい

出力は以下の JSON のみ:
{"placements": [{"image": 1, "afterBlock": 数値}, {"image": 2, "afterBlock": 数値}, {"image": 3, "afterBlock": 数値}]}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const raw = completion.choices[0].message.content;
    if (!raw) return body;
    const parsed = JSON.parse(raw) as { placements: { image: number; afterBlock: number }[] };
    if (!parsed.placements || parsed.placements.length === 0) return body;

    // afterBlock の降順に挿入するとインデックスがずれない
    const result: string[] = [...blocks];
    const placements = [...parsed.placements].sort((a, b) => b.afterBlock - a.afterBlock);
    for (const p of placements) {
      const idx = Math.min(Math.max(0, p.afterBlock), result.length - 1);
      result.splice(idx + 1, 0, `<!-- IMAGE:${p.image} -->`);
    }
    return result.join("");
  } catch (err) {
    // 配置判断に失敗しても記事生成フローは止めない（元のマーカー位置のまま返す）
    console.error("placeImageMarkers failed:", err);
    return body;
  }
}

export async function generateImages(
  params: {
    title: string;
    mainKeyword1: string;
    mainKeyword2: string;
    location: string;
    broadcastDate: string;
    programName: string;
  },
  body: string
): Promise<GeneratedImages & { body?: string; error?: string }> {
  try {
    const thumbnailPrompt = buildThumbnailPrompt(params);
    const imagePrompts = [
      buildArticleImagePrompt(0, params),
      buildArticleImagePrompt(1, params),
      buildArticleImagePrompt(2, params),
    ];

    // 画像の配置判断（DeepSeek・テキストのみ）は画像生成と独立して先に実行できる
    const bodyWithMarkers = await placeImageMarkers(body, imagePrompts);

    // 画像生成は並列禁止。1枚ずつ順次生成し、都度 microCMS にアップロードして公開URLを返す
    const ts = Date.now();
    const thumbnailUrl = await generateImageToMicroCMS(thumbnailPrompt, `thumb-${ts}.png`);

    const articleImageUrls: string[] = [];
    for (let i = 0; i < imagePrompts.length; i++) {
      const url = await generateImageToMicroCMS(imagePrompts[i], `article-${i + 1}-${ts}.png`);
      articleImageUrls.push(url);
    }

    return {
      thumbnailUrl,
      articleImageUrls,
      body: bodyWithMarkers,
    };
  } catch (err) {
    console.error(err);
    return {
      thumbnailUrl: "",
      articleImageUrls: [],
      error: `画像生成に失敗しました: ${getErrorMessage(err)}`,
    };
  }
}

export async function regenerateImage(
  type: "thumbnail" | "article",
  index: number,
  params: {
    title: string;
    mainKeyword1: string;
    mainKeyword2: string;
    location: string;
    broadcastDate: string;
    programName: string;
  }
): Promise<{ url?: string; error?: string }> {
  try {
    const prompt = type === "thumbnail" ? buildThumbnailPrompt(params) : buildArticleImagePrompt(index, params);
    const filename = type === "thumbnail" ? `thumb-${Date.now()}.png` : `article-${index + 1}-${Date.now()}.png`;
    const url = await generateImageToMicroCMS(prompt, filename);
    return { url };
  } catch (err) {
    console.error(err);
    return { error: `画像生成に失敗しました: ${getErrorMessage(err)}` };
  }
}

function embedImagesInBody(body: string, imageUrls: string[]): string {
  // マーカー番号 n に対応する画像を入れる（配置判断で出現順が入れ替わっても正しい画像が入る）
  return body.replace(/<!--\s*IMAGE:\s*(\d+)\s*-->/g, (_, n) => {
    const url = imageUrls[Number(n) - 1] || "";
    if (!url) return "";
    // microCMS の画像変換で軽量配信（WebP・幅1600px上限）
    return `<figure class="my-8"><img src="${url}?fm=webp&q=75&w=1600" alt="" class="w-full rounded-2xl border border-white/10 shadow-lg" /></figure>`;
  });
}

// slug \u306f ASCII \u306e\u307f\u3067\u751f\u6210\u3059\u308b\u3002\u65e5\u672c\u8a9e\u3092\u542b\u3080 slug \u306f URL \u30a8\u30f3\u30b3\u30fc\u30c9\u306e\u90fd\u5408\u3067
// \u8a18\u4e8b\u8a73\u7d30\u30da\u30fc\u30b8\u306e\u691c\u7d22\u3068\u565b\u307f\u5408\u308f\u305a 404 \u306e\u539f\u56e0\u306b\u306a\u308b\u305f\u3081\u4f7f\u308f\u306a\u3044
function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base || "article"}-${Date.now().toString(36)}`;
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

    // published（日時型）に null を渡すと microCMS が 400 を返すため、
    // 公開時のみフィールドを含め、下書き時は省略する
    const content = {
      title: article.title,
      slug,
      excerpt: article.excerpt,
      body: bodyWithImages,
      thumbnail: article.thumbnailUrl || "/images/blog/thumb.png",
      episodeSlug: article.episodeSlug ?? "ep01",
      ...(article.published ? { published: new Date().toISOString() } : {}),
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
    return { error: `保存に失敗しました: ${getErrorMessage(err)}` };
  }
}

export async function saveArticleWithImages(
  article: GeneratedArticle & {
    published: boolean;
    episodeSlug?: string;
    id?: string;
  },
  tempImages: GeneratedImages
): Promise<{ slug?: string; error?: string }> {
  try {
    if (!article.title.trim()) {
      return { error: "タイトルを入力してください" };
    }

    // 画像は生成時点で microCMS にアップロード済み（公開URL）なので、そのまま保存する
    return saveArticle({
      ...article,
      published: article.published,
      episodeSlug: article.episodeSlug,
      id: article.id,
      thumbnailUrl: tempImages.thumbnailUrl,
      articleImageUrls: tempImages.articleImageUrls,
    });
  } catch (err) {
    console.error(err);
    return { error: `画像アップロードまたは保存に失敗しました: ${getErrorMessage(err)}` };
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
    return { error: `画像アップロードに失敗しました: ${getErrorMessage(err)}` };
  }
}
