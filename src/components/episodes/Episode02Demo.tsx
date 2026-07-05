"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Newspaper, Music, TrendingUp } from "lucide-react";

const sources = [
  { id: "news", label: "ニュースサイト", icon: Newspaper },
  { id: "trend", label: "トレンド/SNS", icon: TrendingUp },
  { id: "music", label: "音楽・芸能", icon: Music },
];

const results: Record<string, { title: string; summary: string; source: string; time: string }[]> = {
  news: [
    { title: "大阪府、新たな観光キャンペーン開始", summary: "夏の観光シーズンに向けて、大阪府が新キャンペーンを発表。", source: "読売新聞", time: "08:30" },
    { title: "関西の気象情報", summary: "週末は晴れて暑くなる見込み。", source: "気象庁", time: "07:00" },
  ],
  trend: [
    { title: "#AIラジオ", summary: "AI を使ったラジオ制作が話題に。", source: "X", time: "09:15" },
    { title: "#FM大阪", summary: "リスナーからの朝の投稿が増加中。", source: "Instagram", time: "08:45" },
  ],
  music: [
    { title: "Aメロ、新曲リリース", summary: "大阪出身アーティストの新曲が話題。", source: "音楽ナタリー", time: "10:00" },
    { title: "夏フェス情報まとめ", summary: "関西圏の夏フェスが続々発表。", source: "Billboard", time: "09:30" },
  ],
};

export function Episode02Demo() {
  const [selected, setSelected] = useState<keyof typeof results>("news");

  return (
    <Card className="overflow-hidden border-border bg-card">
      <CardContent className="p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-2">
          <Search className="h-5 w-5 text-fm-orange" />
          <h3 className="text-lg font-bold text-foreground">AI情報収集デモ</h3>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {sources.map((source) => (
            <Button
              key={source.id}
              variant={selected === source.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelected(source.id as keyof typeof results)}
              className={
                selected === source.id
                  ? "bg-fm-orange text-white hover:bg-fm-orange/90"
                  : "border-border text-foreground hover:bg-muted"
              }
            >
              <source.icon className="mr-2 h-4 w-4" />
              {source.label}
            </Button>
          ))}
        </div>

        <div className="space-y-3">
          {results[selected].map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-border bg-muted p-4 transition-colors hover:bg-card"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-foreground">{item.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{item.summary}</p>
                </div>
                <Badge variant="outline" className="shrink-0 border-fm-orange text-fm-orange">
                  {item.time}
                </Badge>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">出典: {item.source}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl bg-[#4A154B] p-4 text-white">
          <p className="text-xs font-bold text-white/70">Slack 通知（イメージ）</p>
          <p className="mt-2 text-sm">
            <span className="font-bold">AI Coaching Buddy</span> が朝の情報収集を完了しました。
            <br />
            今日のピックアップは {results[selected].length} 件です。
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
