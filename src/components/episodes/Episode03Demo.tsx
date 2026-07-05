"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

const entrants = [
  { name: "リスナーA", phone: "090-1234-****", pastWinner: false },
  { name: "リスナーB", phone: "090-5678-****", pastWinner: true },
  { name: "リスナーC", phone: "090-9012-****", pastWinner: false },
  { name: "リスナーA", phone: "090-1234-****", pastWinner: false },
];

const songs = [
  { title: "Summertime", artist: "Aメロ", lastPlayed: "3回前", duplicate: true },
  { title: "夜に駆ける", artist: "Bメロ", lastPlayed: "10回前", duplicate: false },
  { title: "ハルジオン", artist: "Cメロ", lastPlayed: "2回前", duplicate: true },
  { title: "群青", artist: "Dメロ", lastPlayed: "15回前", duplicate: false },
];

export function Episode03Demo() {
  const [activeTab, setActiveTab] = useState("entrants");

  return (
    <Card className="overflow-hidden border-border bg-card">
      <CardContent className="p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-fm-blue" />
          <h3 className="text-lg font-bold text-foreground">重複チェック・リマインドデモ</h3>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-2 bg-muted">
            <TabsTrigger value="entrants" className="data-[state=active]:bg-card data-[state=active]:text-fm-blue">
              当選者チェック
            </TabsTrigger>
            <TabsTrigger value="songs" className="data-[state=active]:bg-card data-[state=active]:text-fm-blue">
              選曲重複チェック
            </TabsTrigger>
          </TabsList>

          <TabsContent value="entrants">
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-foreground">名前</th>
                    <th className="px-4 py-2 text-left font-semibold text-foreground">電話番号</th>
                    <th className="px-4 py-2 text-left font-semibold text-foreground">判定</th>
                  </tr>
                </thead>
                <tbody>
                  {entrants.map((entrant, index) => {
                    const isDuplicate = entrants.findIndex(
                      (e, i) => i !== index && e.name === entrant.name && e.phone === entrant.phone
                    ) !== -1;
                    const hasIssue = isDuplicate || entrant.pastWinner;

                    return (
                      <tr key={index} className={hasIssue ? "bg-destructive/10" : ""}>
                        <td className="px-4 py-3 text-foreground">{entrant.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{entrant.phone}</td>
                        <td className="px-4 py-3">
                          {hasIssue ? (
                            <Badge className="bg-destructive text-white">
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              {isDuplicate ? "重複応募" : "過去当選者"}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-emerald-500 text-emerald-500">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              OK
                            </Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="songs">
            <div className="space-y-3">
              {songs.map((song, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between rounded-xl border p-4 ${
                    song.duplicate
                      ? "border-destructive/20 bg-destructive/10"
                      : "border-border bg-muted"
                  }`}
                >
                  <div>
                    <p className="font-bold text-foreground">{song.title}</p>
                    <p className="text-xs text-muted-foreground">{song.artist}</p>
                  </div>
                  <div className="text-right">
                    {song.duplicate ? (
                      <Badge className="bg-destructive text-white">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        {song.lastPlayed}に流した
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-emerald-500 text-emerald-500">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        OK
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
