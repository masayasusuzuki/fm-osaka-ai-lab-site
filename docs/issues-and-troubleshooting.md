# FM OSAKA AI LAB - 問題対応・エラートラブルシューティング

このドキュメントは、FM OSAKA AI LAB サイトの開発・運用中に発生した問題、現在の課題、エラー対応方法を詳細にまとめたものです。

## 目次

1. [現在の主要な課題](#1-現在の主要な課題)
2. [発生済みのエラーと対応履歴](#2-発生済みのエラーと対応履歴)
3. [画像生成関連の問題](#3-画像生成関連の問題)
4. [microCMS 関連の問題](#4-microcms-関連の問題)
5. [Supabase Auth 関連の問題](#5-supabase-auth-関連の問題)
6. [Next.js / React 関連の問題](#6-nextjs--react-関連の問題)
7. [Vercel デプロイ時の注意点](#7-vercel-デプロイ時の注意点)
8. [未検証・未実装項目](#8-未検証未実装項目)
9. [確認チェックリスト](#9-確認チェックリスト)

---

## 1. 現在の主要な課題

### 1.1 記事作成時の画像生成が失敗する

**状態**: 解決済み（2026-07-06）

**現象**:
- `/studio/new` で音声→文字起こし→記事生成までは進む
- 「画像を生成（4枚）」を実行すると `画像生成に失敗しました` と表示される

**根本原因**:
- `gpt-image-2` は dall-e 系と異なり、レスポンスを **URL ではなく base64（`b64_json`）** で返す
- 旧コードは `res.data?.[0]?.url` のみを参照していたため、生成自体は成功していても常に undefined → `Thumbnail generation failed` エラーになっていた
- API キー・モデル権限・プロンプトに問題はなかった（実 API テストで確認済み）

**対応**:
- `b64_json` を Buffer にデコードし、生成直後にサーバー側で microCMS メディアへアップロードして公開 URL を返す方式に変更（`generateImageToMicroCMS`）
- base64 のままクライアントに返すと 1 枚あたり数 MB × 4 枚でペイロードが巨大化するため、サーバー側で完結させる設計にした
- 画像生成は並列禁止。サムネイル→本文画像 1→2→3 の順で 1 枚ずつ順次生成
- 保存時の再アップロードは不要になった（`saveArticleWithImages` は URL をそのまま保存）

### 1.1.2 記事生成モデルを DeepSeek に変更

**状態**: 対応済み（2026-07-06）

- 記事生成（文字起こし→記事）を OpenAI `gpt-4o` から **DeepSeek `deepseek-v4-flash`** に変更
- `deepseek-chat` / `deepseek-reasoner` は 2026-07-24 に廃止されるため、直接 `deepseek-v4-flash` を指定
- baseURL: `https://api.deepseek.com/v1`（OpenAI SDK 互換）。API キーは `.env.local` の `DEEPSEEK_API_KEY`
- 本文は 1500 文字以上（h2 見出し 5 つ以上・各セクション 300 文字以上・背景知識で肉付け）
- 文字起こし段階の誤認識リスクがあるため、**人名は記事に含めない**制約をプロンプトに追加（実テストで除外を確認済み）
- 文字起こし（Whisper）と画像生成（gpt-image-2）は引き続き OpenAI

### 1.2 ローカル開発サーバーの環境変数読み込み

**状態**: 対応済み

**現象**:
- `.env.local` は存在するのに、`/studio/articles` 開いたときに `parameter is required (check serviceDomain and apiKey)` エラー

**原因**:
- 開発サーバーを `.env.local` 作成後に再起動していなかった
- 再起動後も発生した場合は、`src/lib/microcms.ts` がクライアントコンポーネントから直接 import され、ブラウザ側で `process.env` が空になっていた

**対応**:
- `src/lib/microcms.ts` はサーバー専用にすべきで、クライアントコンポーネントからは Server Action 経由で利用
- `src/app/studio/articles/actions.ts` に `getAllArticlesAction` を追加し、一覧取得を Server Action 化

### 1.3 microCMS 画像アップロード先の誤り

**状態**: 対応済み

**現象**:
- `/api/v1/files` エンドポイントで 404 エラー
- 記事作成時の画像アップロードに失敗

**原因**:
- 一般のファイルアップロード用エンドポイントが存在しない、またはアクセス権がない

**対応**:
- microCMS 管理 API のメディアエンドポイントに変更
- `https://{serviceDomain}.microcms-management.io/api/v1/media`
- 同じ API キーで認証可能

---

## 2. 発生済みのエラーと対応履歴

### 2.1 `parameter is required (check serviceDomain and apiKey)`

**発生箇所**: `src/lib/microcms.ts:4`

**原因**:
- microCMS クライアントがブラウザ側で初期化され、環境変数が読み込めなかった

**対応**:
```ts
// src/app/studio/articles/actions.ts
"use server";
export async function getAllArticlesAction(queries?: MicroCMSQueries) {
  const res = await getAllArticles(queries);
  return { contents: res.contents };
}
```

### 2.2 `Body exceeded 1 MB limit` / `Request body exceeded 10MB`

**発生箇所**: `/studio/new` への音声ファイルアップロード時

**原因**:
- Server Actions のデフォルトボディサイズ制限が小さい

**対応**:
```ts
// next.config.ts
experimental: {
  serverActions: {
    bodySizeLimit: "25mb",
  },
}
```

### 2.3 `A tree hydrated but some attributes...`

**発生箇所**: `src/app/layout.tsx:30`

**原因**:
- ブラウザ拡張機能（TenShot など）が `<html>` タグに `data-scribe-recorder-ready` などの属性を追加
- React のハイドレーション結果とサーバー側の HTML が不一致になる

**対応**:
- 開発中の警告であり、サイトの動作に影響がない場合は無視可能
- 気になる場合は拡張機能を無効化

### 2.4 `Image with src ... has either width or height modified, but not the other`

**発生箇所**: `src/components/Header.tsx`

**原因**:
- `next/image` の `width`/`height` と CSS の `h-10 w-auto` が競合

**対応**:
```tsx
<Image
  src={LOGO_URL}
  alt="FM OSAKA"
  width={160}
  height={40}
  className="object-contain"
  style={{ width: "auto", height: "40px" }}
  priority
/>
```

### 2.5 `thumbnail has unexpected data type`

**発生箇所**: `/studio/new` 保存時

**原因**:
- microCMS API スキーマで `thumbnail` フィールドが `media` 型に設定されていた
- `null` や空文字列を渡したことで型不一致

**対応**:
- `thumbnail` に有効な画像 URL 文字列を渡す
- ない場合はフォールバック URL `/images/blog/thumb.png` を設定

### 2.6 `published` フィールドの型エラー

**発生箇所**: `src/app/studio/new/actions.ts`

**原因**:
- 下書き保存時に `published: undefined` を渡していた
- microCMS の型は `published: string | null`

**対応**:
```ts
published: article.published ? new Date().toISOString() : null,
```

---

## 3. 画像生成関連の問題

### 3.1 使用モデル

- **モデル**: `gpt-image-2`
- **サイズ**: `1536x1024`（16:9 に最も近い）
- **品質**: `high`

### 3.2 既知のリスク

1. **API キー/組織設定による利用可否**
   - すべての OpenAI API キーで `gpt-image-2` が使えるわけではない
   - 利用できない場合は `dall-e-3` への切り替えを検討

2. **日本語テキストの不安定性**
   - 画像内の日本語は文字化け・崩れやすい
   - サムネイルではタイトル文字を極力減らす設計

3. **コンテンツポリシー**
   - 人物、国旗、商標などに関する表現でブロックされる可能性
   - プロンプトで「正確なロゴ模倣は避ける」ことを明示

4. **コスト**
   - `gpt-image-2` `1536x1024` `high` は1枚あたり数セント〜数十セント
   - 記事1つあたり4枚生成 + 再生成でコストがかさむ

### 3.3 フォールバック案

`gpt-image-2` が使えない場合:
```ts
await openai.images.generate({
  model: "dall-e-3",
  prompt: "...",
  size: "1792x1024",
  n: 1,
  quality: "hd",
});
```

---

## 4. microCMS 関連の問題

### 4.1 API スキーマ

**エンドポイント**: `articles`

| フィールドID | 種類 | 必須 | 備考 |
|-------------|------|------|------|
| title | テキスト | 任意 | 記事タイトル |
| slug | テキスト | 任意 | URL用スラッグ |
| excerpt | テキストエリア | 任意 | リード文 |
| body | リッチエディタ | 任意 | 本文HTML |
| thumbnail | メディア | 任意 | サムネイルURL |
| episodeSlug | テキスト | 任意 | エピソードスラッグ |
| published | 日時 | 任意 | null で下書き |

### 4.2 画像アップロード

**正しいエンドポイント**:
```
POST https://{serviceDomain}.microcms-management.io/api/v1/media
Headers: X-MICROCMS-API-KEY: {apiKey}
Content-Type: multipart/form-data
```

**誤ったエンドポイント**:
```
POST https://{serviceDomain}.microcms.io/api/v1/files
→ 404 Not Found
```

### 4.3 注意点

- `published` に `undefined` を渡すとエラー
- `thumbnail` に `null` や空文字を渡すと `unexpected data type` エラー
- リッチエディタの本文内に `<img>` タグを埋め込んでも問題なく表示される

---

## 5. Supabase Auth 関連の問題

### 5.1 現在の実装

- 管理画面 (`/studio/*`) は Supabase Auth で保護
- メールアドレス・パスワード認証
- ユーザー作成は Supabase ダッシュボード側で事前に行う想定

### 5.2 Vercel デプロイ時の対応

**Supabase Auth → URL 設定に追加が必要**:
```
http://localhost:3000/studio/login
https://{your-vercel-domain}/studio/login
```

**サイト URL**:
```
https://{your-vercel-domain}
```

### 5.3 既知の問題

- `/studio/login` へのアクセスで 404 になったケースあり
  - 原因: 開発サーバー起動時のルーティング問題
  - 対応: サーバー再起動で解消

---

## 6. Next.js / React 関連の問題

### 6.1 Server Action のタイムアウト

**懸念**:
- Vercel Hobby プランの Serverless Function は最大 10秒
- 画像生成4枚 + ダウンロード + アップロードは10秒を超える可能性

**対策案**:
1. Pro プランにアップグレード
2. 画像生成とアップロードを非同期ジョブ化
3. 画像生成をクライアント側の API Route 化
4. 1枚ずつ生成・保存するフローに変更

### 6.2 クライアントコンポーネントからの microCMS 直接 import

**問題**:
- `"use client"` コンポーネントから `src/lib/microcms.ts` を import すると、ブラウザ側で API キーが空になる

**対応**:
- microCMS 操作は必ず Server Action または Server Component 経由で行う
- `src/lib/microcms.ts` に `"use server"` は付けられない（`microcms` クライアントオブジェクトをエクスポートしているため）

### 6.3 Hydration Mismatch

**原因**:
- ブラウザ拡張機能による HTML 改変
- `Math.random()` / `Date.now()` をクライアント側で使用

**対応**:
- クライアント側のランダム値は `useEffect` 内で使用
- サーバー/クライアントで分岐する場合は `useEffect` + `mounted` フラグを使用

---

## 7. Vercel デプロイ時の注意点

### 7.1 必要な環境変数

```bash
OPENAI_API_KEY=sk-...
MICROCMS_SERVICE_DOMAIN=fm-osaka-ai-lab
MICROCMS_API_KEY=...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 7.2 追加設定

- **microCMS IP 制限**: Vercel の IP を許可
- **Supabase Auth**: 本番ドメインを許可リストに追加
- **Server Actions**: `bodySizeLimit` は `next.config.ts` で設定済み

### 7.3 ビルド確認済み

```bash
npx next build
```

はローカルで通過済み。

---

## 8. 未検証・未実装項目

### 8.1 未検証

- [ ] 大きい音声ファイル（10MB以上）のアップロード
- [ ] `gpt-image-2` での実際の画像生成成功
- [ ] 画像生成後の microCMS アップロード成功
- [ ] 下書き保存から公開保存への切り替え
- [ ] Vercel へのデプロイ
- [ ] 本番環境での Supabase Auth ログイン

### 8.2 未実装・改善案

- [ ] 画像生成モデルの自動フォールバック（gpt-image-2 → dall-e-3）
- [ ] 画像生成失敗時のリトライ機能
- [ ] 生成画像の履歴管理
- [ ] 記事編集時の画像差し替え UI の改善
- [ ] 管理画面のダッシュボード充実化
- [ ] 音声アップロード前の圧縮処理

---

## 9. 確認チェックリスト

### ローカル開発時

- [ ] `.env.local` がプロジェクトルートに配置されている
- [ ] `npm run dev` 起動前に `.env.local` を作成・修正している
- [ ] 開発サーバー再起動後に `/studio/articles` が表示される
- [ ] `/studio/login` でログインできる
- [ ] 音声ファイルアップロードが成功する
- [ ] 記事生成が成功する
- [ ] 画像生成で具体的なエラーメッセージが表示される

### 本番デプロイ時

- [ ] Vercel に環境変数をすべて設定
- [ ] Supabase Auth に本番ドメインを登録
- [ ] microCMS の IP 制限を設定（必要に応じて）
- [ ] カスタムドメインを使用する場合は DNS 設定
- [ ] 管理用アカウントが Supabase に作成済み

---

## 付録：調査用コマンド

### 環境変数の確認
```bash
node -e "require('dotenv').config({path:'.env.local'}); console.log(process.env.MICROCMS_SERVICE_DOMAIN);"
```

### microCMS メディアアップロードの手動テスト
```bash
node -e "
require('dotenv').config({path:'.env.local'});
const fs = require('fs');
(async () => {
  const buffer = fs.readFileSync('path/to/image.png');
  const blob = new Blob([buffer], { type: 'image/png' });
  const form = new FormData();
  form.append('file', blob, 'image.png');
  const res = await fetch('https://fm-osaka-ai-lab.microcms-management.io/api/v1/media', {
    method: 'POST',
    headers: { 'X-MICROCMS-API-KEY': process.env.MICROCMS_API_KEY },
    body: form,
  });
  console.log(await res.json());
})();
"
```

### ビルドテスト
```bash
npx next build
```
