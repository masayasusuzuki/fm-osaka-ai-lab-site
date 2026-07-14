<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 【最重要・混同厳禁】「2種類のコンテンツ」を絶対に取り違えない

作業前に必ず `docs/requirements.md` の「§0」を読むこと。要点：

- **A. ブログ記事（「最新記事」「blog」）**＝ microCMS `articles` のデータ。`/blog`・トップの最新記事に出る。`episodeSlug` でエピソードに紐づく
- **B. エピソード解説（「解説記事」「全4回のAI実験の解説」）**＝ `src/components/episodes/EpisodeNNRequirements.tsx` のハードコード React コンポーネント。`/episodes/[slug]` に出る。**microCMS ではなくコード**。見本は `Episode01Requirements.tsx`

「解説記事」と言われたら原則 **B**。B の指示で A（microCMS ブログ）を作らない。**少しでも迷ったらどちらか質問してから着手する。** B を作り込むソースは要件定義 `requirements-epNN-tool.md`・要望メール `mail-logs/`・完成ツール本体（`tools/` 等）。
