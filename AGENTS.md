<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 【最重要・混同厳禁】「2種類のコンテンツ」を絶対に取り違えない

作業前に必ず `docs/requirements.md` の「§0」を読むこと。要点：

- **A. ブログ記事（「最新記事」「blog」）**＝ microCMS `articles` のデータ。`/blog`・トップの最新記事に出る。`episodeSlug` でエピソードに紐づく
- **B. エピソード解説（「解説記事」「全4回のAI実験の解説」）**＝ `src/components/episodes/EpisodeNNRequirements.tsx` のハードコード React コンポーネント。`/episodes/[slug]` に出る。**microCMS ではなくコード**。見本は `Episode01Requirements.tsx`・`Episode02Requirements.tsx`

## 判別ルール（機械的に適用する・2回事故ったので厳守）

| 指示に出た語 | 判定 |
|---|---|
| 「全4回のAI実験」「エピソード」「episodes」「EP0N の解説／の方」「解説記事」「Episode0NRequirements」 | **B** |
| 「ブログ」「最新記事」「blog」「microCMS」「Studio で」「記事をアップ／公開」 | **A** |
| 「記事」単独（上の限定語がない） | **判別不能 → 質問して確定** |

- **「記事」という語“だけ”で A/B を決めない**（A も B も「記事」と呼ばれる）。この短絡が事故の元
- **B を指す固有名詞（全4回のAI実験／EP0N／episodes）が一度でも出たら、それが確定情報。** 後から出た「記事」等の曖昧語で A に切り替えない
- **迷ったら、実装・構成の検討に入る前に「A か B か」だけを1問質問する。** 迷いを残して先に進まない（2026-07-20、これを破って構成案の選択肢提示まで進み叱責された）
- B を作るソースは要件定義 `tools/{ツール名}/requirements.md`（ep01=`fm-radio-blog`、ep02=`reporter-finder`、**ep03=`onair-song-checker2`** ※旧 `onair-song-checker` は削除済み）・要望メール `mail-logs/`・完成ツール本体（`tools/` 等）。想像で書かない
