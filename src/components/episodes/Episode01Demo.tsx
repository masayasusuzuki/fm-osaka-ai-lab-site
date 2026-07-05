"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Mic, FileText, Share2, ImageIcon } from "lucide-react";

const samples = [
  { id: "sample1", label: "オープニングトーク（3分）" },
  { id: "sample2", label: "ゲストインタビュー（5分）" },
  { id: "sample3", label: "リスナーメッセージ紹介（2分）" },
];

const generatedResults: Record<string, { blog: string; sns: string; thumbnail: string }> = {
  sample1: {
    blog: "今回の放送では、AI Coaching Buddy の始動にあたり、ラジオと AI がどう組み合わさるかを熱く語りました。AI コーチからは「AI は道具ではなく、制作の相棒になる」とのこと。リスナーの皆さんからも「具体的にどう役立つの？」という質問が寄せられました。",
    sns: "🎙️ AI Coaching Buddy 始動！ラジオ制作に AI を取り入れた 4 回の実験、今夜からスタートします。 #FM大阪 #AICoachingBuddy",
    thumbnail: "https://placehold.co/600x340/E91E8C/FFFFFF?text=Generated+Thumbnail",
  },
  sample2: {
    blog: "ゲストとしてお迎えした AI コーチ。INTENTION から FM大阪の制作現場に入る経緯や、これから試す 4 つのテーマについて詳しくお話しいただきました。特に「人間の編集判断は最後まで必要」という言葉が印象的でした。",
    sns: "🤖 ゲストは AI コーチ。AI がラジオ制作をどう変えるか、今夜徹底解説！ #FM大阪 #AI",
    thumbnail: "https://placehold.co/600x340/F7931E/FFFFFF?text=Interview+Thumbnail",
  },
  sample3: {
    blog: "リスナーから寄せられた「AI に仕事を奪われるんじゃ？」という質問に、AI コーチが答えてくれました。「AI は繰り返し作業を減らし、人間がクリエイティブな時間を増やすための道具」とのこと。安心して取り組みを見守っていただければと思います。",
    sns: "💬 リスナー質問「AIに仕事を奪われる？」→ AI コーチの回答は「繰り返し作業を減らして、人間のクリエイティブ時間を増やす」でした。 #FM大阪",
    thumbnail: "https://placehold.co/600x340/00AEEF/FFFFFF?text=Listener+Thumbnail",
  },
};

export function Episode01Demo() {
  const [selected, setSelected] = useState("sample1");
  const result = generatedResults[selected];

  return (
    <Card className="overflow-hidden border-border bg-card">
      <CardContent className="p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-2">
          <Mic className="h-5 w-5 text-fm-pink" />
          <h3 className="text-lg font-bold text-foreground">音声→ブログ生成デモ</h3>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {samples.map((sample) => (
            <Button
              key={sample.id}
              variant={selected === sample.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelected(sample.id)}
              className={
                selected === sample.id
                  ? "bg-fm-pink text-white hover:bg-fm-pink/90"
                  : "border-border text-foreground hover:bg-muted"
              }
            >
              {sample.label}
            </Button>
          ))}
        </div>

        <Tabs defaultValue="blog" className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-3 bg-muted">
            <TabsTrigger value="blog" className="data-[state=active]:bg-card data-[state=active]:text-fm-pink">
              <FileText className="mr-2 h-4 w-4" />
              ブログ
            </TabsTrigger>
            <TabsTrigger value="sns" className="data-[state=active]:bg-card data-[state=active]:text-fm-pink">
              <Share2 className="mr-2 h-4 w-4" />
              SNS
            </TabsTrigger>
            <TabsTrigger value="thumbnail" className="data-[state=active]:bg-card data-[state=active]:text-fm-pink">
              <ImageIcon className="mr-2 h-4 w-4" />
              サムネイル
            </TabsTrigger>
          </TabsList>
          <TabsContent value="blog">
            <div className="rounded-xl border border-border bg-muted p-4">
              <p className="text-sm leading-relaxed text-foreground">{result.blog}</p>
            </div>
          </TabsContent>
          <TabsContent value="sns">
            <div className="rounded-xl border border-border bg-muted p-4">
              <p className="text-sm leading-relaxed text-foreground">{result.sns}</p>
            </div>
          </TabsContent>
          <TabsContent value="thumbnail">
            <div className="rounded-xl border border-border bg-muted p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.thumbnail}
                alt="Generated thumbnail"
                className="w-full max-w-md rounded-lg"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
