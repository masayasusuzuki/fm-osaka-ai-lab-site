"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  transcribeAudio,
  generateArticle,
  generateAndUploadImages,
  saveArticle,
  GeneratedArticle,
  GeneratedImages,
} from "./actions";
import { episodes } from "@/lib/content";
import {
  Upload,
  Loader2,
  Wand2,
  Save,
  Eye,
  ArrowRight,
  ArrowLeft,
  FileAudio,
  ImageIcon,
  RefreshCw,
  Calendar,
  Radio,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type Step = "upload" | "transcribe" | "generate" | "images" | "preview" | "edit";

export default function NewArticlePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState("");
  const [article, setArticle] = useState<GeneratedArticle>({
    title: "",
    excerpt: "",
    body: "",
    mainKeyword1: "",
    mainKeyword2: "",
    location: "",
    broadcastDate: new Date().toISOString().split("T")[0],
    programName: "iDoBuddy・イドバタニュース",
  });
  const [generatedImages, setGeneratedImages] = useState<GeneratedImages>({
    thumbnailUrl: "",
    articleImageUrls: [],
  });
  const [episodeSlug, setEpisodeSlug] = useState("ep01");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type.startsWith("audio/")) {
      setFile(dropped);
      setError(null);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setError(null);
    }
  };

  const handleTranscribe = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("audio", file);
    const result = await transcribeAudio(formData);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setTranscript(result.text);
      setStep("generate");
    }
  };

  const handleGenerate = async () => {
    if (!transcript.trim()) return;
    setLoading(true);
    setError(null);
    const result = await generateArticle(transcript);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setArticle(result);
      setStep("images");
    }
  };

  const handleGenerateImages = async () => {
    setLoading(true);
    setError(null);
    const result = await generateAndUploadImages(article);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setGeneratedImages(result);
      setStep("preview");
    }
  };

  const handleSave = async (published: boolean) => {
    setLoading(true);
    setError(null);
    const result = await saveArticle({
      ...article,
      published,
      episodeSlug,
      thumbnailUrl: generatedImages.thumbnailUrl,
      articleImageUrls: generatedImages.articleImageUrls,
    });
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.push("/studio/articles");
    }
  };

  const stepLabels: { step: Step; label: string }[] = [
    { step: "upload", label: "1. アップロード" },
    { step: "transcribe", label: "2. 文字起こし" },
    { step: "generate", label: "3. 記事生成" },
    { step: "images", label: "4. 画像生成" },
    { step: "preview", label: "5. プレビュー" },
    { step: "edit", label: "6. 編集・保存" },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6 text-gray-900">
      {/* Stepper */}
      <div className="flex items-center gap-2">
        {stepLabels.map((item, index) => {
          const currentIndex = stepLabels.findIndex((s) => s.step === step);
          const done = index < currentIndex;
          const active = index === currentIndex;
          return (
            <div key={item.step} className="flex flex-1 items-center gap-2">
              <StepBadge active={active} done={done} label={item.label} />
              {index < stepLabels.length - 1 && (
                <div className={`h-[1px] flex-1 ${done ? "bg-fm-pink" : "bg-gray-200"}`} />
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {step === "upload" && (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-black tracking-wide text-gray-900">音声ファイルをアップロード</h2>
          <p className="mt-2 text-sm text-gray-500">
            MP3 / WAV / M4A 形式のラジオ音声をドラッグ＆ドロップしてください。
          </p>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-8 py-14 transition-colors hover:border-fm-pink/30 hover:bg-gray-100"
          >
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileSelect}
              className="hidden"
              id="audio-upload"
            />
            <label htmlFor="audio-upload" className="flex cursor-pointer flex-col items-center">
              {file ? (
                <>
                  <FileAudio className="h-10 w-10 text-fm-pink" />
                  <p className="mt-4 text-sm font-bold text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-gray-300" />
                  <p className="mt-4 text-sm font-bold text-gray-900">クリックまたはドラッグ＆ドロップ</p>
                  <p className="text-xs text-gray-500">対応形式: MP3, WAV, M4A</p>
                </>
              )}
            </label>
          </div>

          <button
            onClick={() => file && setStep("transcribe")}
            disabled={!file}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-fm-pink px-6 text-sm font-black text-white transition-transform hover:scale-[1.02] disabled:opacity-40"
          >
            次へ <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {step === "transcribe" && (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-black tracking-wide text-gray-900">文字起こし</h2>
          <p className="mt-2 text-sm text-gray-500">
            Whisper API を使って音声をテキストに変換します。
          </p>

          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <FileAudio className="h-5 w-5 text-fm-pink" />
              <span className="text-sm font-bold text-gray-900">{file?.name}</span>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setStep("upload")}
              className="flex h-12 items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 text-sm font-black text-gray-700 transition-colors hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" /> 戻る
            </button>
            <button
              onClick={handleTranscribe}
              disabled={loading}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-fm-pink px-6 text-sm font-black text-white transition-transform hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>
                <Wand2 className="h-4 w-4" /> 文字起こしを実行
              </>}
            </button>
          </div>
        </div>
      )}

      {step === "generate" && (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-black tracking-wide text-gray-900">文字起こし結果</h2>
          <p className="mt-2 text-sm text-gray-500">
            内容を確認・編集してから、記事を生成してください。
          </p>

          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="mt-6 h-64 w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-900 placeholder:text-gray-400 focus:border-fm-pink/40 focus:outline-none"
          />

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setStep("upload")}
              className="flex h-12 items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 text-sm font-black text-gray-700 transition-colors hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" /> 戻る
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading || !transcript.trim()}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-fm-pink px-6 text-sm font-black text-white transition-transform hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>
                <Wand2 className="h-4 w-4" /> 記事を生成
              </>}
            </button>
          </div>
        </div>
      )}

      {step === "images" && (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-black tracking-wide text-gray-900">画像を生成</h2>
          <p className="mt-2 text-sm text-gray-500">
            記事のサムネイルと本文用画像を AI で生成します。
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-black text-gray-500">タイトル</p>
              <p className="mt-1 text-sm font-bold text-gray-900">{article.title || "（未生成）"}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-black text-gray-500">キーワード</p>
              <p className="mt-1 text-sm font-bold text-gray-900">
                {article.mainKeyword1 || "-"} / {article.mainKeyword2 || "-"}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-black text-gray-500">地域</p>
              <p className="mt-1 text-sm font-bold text-gray-900">{article.location || "-"}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-black text-gray-500">放送日</p>
              <p className="mt-1 text-sm font-bold text-gray-900">{article.broadcastDate}</p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setStep("generate")}
              className="flex h-12 items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 text-sm font-black text-gray-700 transition-colors hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" /> 戻る
            </button>
            <button
              onClick={handleGenerateImages}
              disabled={loading}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-fm-pink px-6 text-sm font-black text-white transition-transform hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>
                <ImageIcon className="h-4 w-4" /> 画像を生成（4枚）
              </>}
            </button>
          </div>

          {loading && (
            <div className="mt-6 rounded-xl border border-fm-pink/20 bg-fm-pink/5 p-4">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-fm-pink" />
                <p className="text-sm font-bold text-gray-900">画像を生成・microCMSにアップロード中...</p>
              </div>
              <p className="mt-1 pl-8 text-xs text-gray-500">1枚あたり15〜30秒かかる場合があります</p>
            </div>
          )}
        </div>
      )}

      {step === "preview" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-black tracking-wide text-gray-900">プレビュー</h2>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-amber-500 text-amber-500">
                下書きプレビュー
              </Badge>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            {generatedImages.thumbnailUrl ? (
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={generatedImages.thumbnailUrl}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1000px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className="bg-fm-pink text-white hover:bg-fm-pink/90">
                      EP{String(episodes.find((e) => e.slug === episodeSlug)?.episodeNumber ?? 1).padStart(2, "0")}
                    </Badge>
                    <Badge variant="outline" className="border-fm-orange text-fm-orange">
                      <Sparkles className="mr-1 h-3 w-3" />
                      AI生成記事
                    </Badge>
                  </div>
                  <h1 className="mt-4 text-2xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                    {article.title}
                  </h1>
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/60">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {article.broadcastDate}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Radio className="h-4 w-4" />
                      FM OSAKA AI LAB
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex aspect-[16/9] items-center justify-center bg-gray-100 text-gray-400">
                サムネイル未生成
              </div>
            )}
          </div>

          <Card className="border-gray-200 bg-white shadow-2xl">
            <CardContent className="p-6 sm:p-10">
              {article.excerpt && (
                <p className="text-lg font-medium leading-relaxed text-gray-800">
                  {article.excerpt}
                </p>
              )}

              <div className="my-8 flex items-center gap-4">
                <span className="h-px flex-1 bg-gradient-to-r from-fm-pink to-transparent" />
                <Sparkles className="h-4 w-4 text-fm-pink" />
                <span className="h-px flex-1 bg-gradient-to-l from-fm-blue to-transparent" />
              </div>

              <div
                className="prose prose-lg max-w-none text-gray-800 prose-headings:font-black prose-headings:text-gray-900 prose-a:text-fm-pink hover:prose-a:text-fm-pink/80 prose-strong:text-gray-900 prose-blockquote:border-l-fm-pink prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:pl-6 prose-blockquote:pr-4 prose-blockquote:font-medium prose-blockquote:not-italic prose-li:marker:text-fm-pink prose-img:rounded-2xl prose-img:border prose-img:border-gray-200"
                dangerouslySetInnerHTML={{ __html: article.body.replace(/<!--\s*IMAGE:\s*\d+\s*-->/g, "") }}
              />

              <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-fm-pink/10">
                    <Sparkles className="h-5 w-5 text-fm-pink" />
                  </div>
                  <div>
                    <p className="font-black text-gray-900">AI Coaching Buddy からのメモ</p>
                    <p className="mt-1 text-sm leading-relaxed text-gray-500">
                      この記事は FM大阪の放送音声を Whisper で文字起こしし、生成 AI がブログ記事として再構成したものです。内容は企画のデモ用であり、最終的な表現は人間がチェック・調整しています。
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <button
              onClick={() => setStep("images")}
              className="flex h-12 items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 text-sm font-black text-gray-700 transition-colors hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" /> 戻る
            </button>
            <button
              onClick={() => setStep("edit")}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-fm-pink px-6 text-sm font-black text-white transition-transform hover:scale-[1.02]"
            >
              編集・保存へ進む <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {step === "edit" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-black tracking-wide text-gray-900">記事を編集</h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-xs font-black tracking-wider text-gray-500">エピソード</label>
                <select
                  value={episodeSlug}
                  onChange={(e) => setEpisodeSlug(e.target.value)}
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
                <label className="mb-2 block text-xs font-black tracking-wider text-gray-500">
                  本文（HTML）
                  <span className="ml-2 text-[10px] font-normal text-gray-400">&lt;!-- IMAGE:n --&gt; の位置に画像が挿入されます</span>
                </label>
                <textarea
                  value={article.body}
                  onChange={(e) => setArticle({ ...article, body: e.target.value })}
                  rows={12}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm leading-relaxed text-gray-900 focus:border-fm-pink/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black tracking-wider text-gray-500">サムネイルURL</label>
                <input
                  type="text"
                  value={generatedImages.thumbnailUrl}
                  onChange={(e) => setGeneratedImages({ ...generatedImages, thumbnailUrl: e.target.value })}
                  className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 focus:border-fm-pink/40 focus:outline-none"
                />
                {generatedImages.thumbnailUrl && (
                  <div className="relative mt-3 aspect-[16/9] w-full max-w-md overflow-hidden rounded-xl border border-gray-200">
                    <Image
                      src={generatedImages.thumbnailUrl}
                      alt="thumbnail"
                      fill
                      className="object-cover"
                      sizes="400px"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-xs font-black tracking-wider text-gray-500">本文画像URL（1枚ずつ改行）</label>
                <textarea
                  value={generatedImages.articleImageUrls.join("\n")}
                  onChange={(e) =>
                    setGeneratedImages({
                      ...generatedImages,
                      articleImageUrls: e.target.value.split("\n").filter(Boolean),
                    })
                  }
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm leading-relaxed text-gray-900 focus:border-fm-pink/40 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep("preview")}
              className="flex h-12 items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 text-sm font-black text-gray-700 transition-colors hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" /> 戻る
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={loading}
              className="flex h-12 items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 text-sm font-black text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              下書き保存
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={loading}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-fm-pink px-6 text-sm font-black text-white transition-transform hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
              公開する
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StepBadge({
  active,
  done,
  label,
}: {
  active: boolean;
  done: boolean;
  label: string;
}) {
  return (
    <span
      className={`whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-black tracking-wider ${
        done
          ? "bg-fm-pink/10 text-fm-pink"
          : active
            ? "bg-gray-100 text-gray-900"
            : "bg-gray-100 text-gray-400"
      }`}
    >
      {label}
    </span>
  );
}
