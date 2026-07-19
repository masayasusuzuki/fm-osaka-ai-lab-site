import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import OpenAI from "openai";
import fs from "node:fs";

// Usage: tsx scripts/transcribe-audio.ts <input.mp3> <output.txt>
// 出力は [MM:SS.mmm --> MM:SS.mmm] テキスト 形式のタイムスタンプ付き文字起こし

function fmt(sec: number): string {
  const ms = Math.round(sec * 1000);
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const rem = ms % 1000;
  const pad = (n: number, w: number) => String(n).padStart(w, "0");
  return `${pad(m, 2)}:${pad(s, 2)}.${pad(rem, 3)}`;
}

async function main() {
  const [input, output] = process.argv.slice(2);
  if (!input || !output) {
    console.error("Usage: tsx scripts/transcribe-audio.ts <input.mp3> <output.txt>");
    process.exit(1);
  }

  const client = new OpenAI();
  console.log(`Transcribing: ${input}`);
  const res = await client.audio.transcriptions.create({
    file: fs.createReadStream(input),
    model: "whisper-1",
    language: "ja",
    response_format: "verbose_json",
    timestamp_granularities: ["segment"],
  });

  const segments = (res as unknown as { segments?: { start: number; end: number; text: string }[] }).segments ?? [];
  const body = segments
    .map((seg) => `[${fmt(seg.start)} --> ${fmt(seg.end)}] ${seg.text.trim()}`)
    .join("\n\n");

  fs.writeFileSync(output, body + "\n", "utf-8");
  console.log(`Wrote ${segments.length} segments to ${output}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
