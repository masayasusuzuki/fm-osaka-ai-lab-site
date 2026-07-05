"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, Shield, MessageCircle } from "lucide-react";

const character = {
  name: "AI DJ",
  tone: "明るく親しみやすい関西弁",
  topics: "音楽、ラジオ、大阪の話題",
  offLimits: "政治、宗教、個人情報",
};

const chatHistory = [
  { role: "host", text: "AI DJ、今日のテーマは「AIとラジオ」やで。どう思う？" },
  { role: "ai", text: "せやね！私、ラジオが大好きやから、毎日いろんな番組聞いて勉強してんねん。AIやからこそ、リスナーみんなの好きな話題をたくさん集められるんちゃう？" },
  { role: "host", text: "リスナーからの質問なんやけど、AIに仕事を奪われるんちゃうかっていう声があるんや。" },
  { role: "ai", text: "うーん、それは心配しなくてもええと思うで。私は繰り返し作業を手伝う存在。パーソナリティの面白さや温かさは、絶対に代われへんもん。一緒に良い番組作りたいな！" },
];

export function Episode04Demo() {
  const [showMore, setShowMore] = useState(false);

  return (
    <Card className="overflow-hidden border-border bg-card">
      <CardContent className="p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-2">
          <Bot className="h-5 w-5 text-fm-green" />
          <h3 className="text-lg font-bold text-foreground">AIゲスト対談デモ</h3>
        </div>

        <div className="mb-6 rounded-xl border border-border bg-muted p-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-foreground">{character.name}</h4>
            <Badge className="bg-fm-green text-white">AIキャラ</Badge>
          </div>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex gap-2">
              <dt className="font-medium text-muted-foreground">口調:</dt>
              <dd className="text-foreground">{character.tone}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-medium text-muted-foreground">話せるテーマ:</dt>
              <dd className="text-foreground">{character.topics}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-medium text-muted-foreground">話せないテーマ:</dt>
              <dd className="text-foreground">{character.offLimits}</dd>
            </div>
          </dl>
        </div>

        <div className="space-y-3">
          {chatHistory.slice(0, showMore ? undefined : 2).map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "host" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  message.role === "host"
                    ? "bg-foreground text-background rounded-br-none"
                    : "bg-fm-green/10 text-foreground rounded-bl-none border border-fm-green/20"
                }`}
              >
                {message.role === "ai" && (
                  <div className="mb-1 flex items-center gap-1 text-xs font-bold text-fm-green">
                    <Bot className="h-3 w-3" />
                    {character.name}
                  </div>
                )}
                {message.text}
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowMore(!showMore)}
          className="mt-4 text-fm-green hover:bg-fm-green/10"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          {showMore ? "折りたたむ" : "もっと見る"}
        </Button>

        <div className="mt-6 flex items-start gap-2 rounded-xl border border-fm-green/20 bg-fm-green/10 p-4">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-fm-green" />
          <div>
            <p className="text-sm font-bold text-foreground">セーフティ設定</p>
            <p className="mt-1 text-xs text-muted-foreground">
              話せないテーマは事前にフィルタリング。万が一不適切な発言があった場合は、
              スタッフが即座にカットできる体制を整えています。
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
