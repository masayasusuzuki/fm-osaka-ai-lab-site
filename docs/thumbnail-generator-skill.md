# FM大阪 AI LAB 記事サムネイル生成

FM大阪のラジオ番組「iDoBuddy・イドバタニュース」向け、ポップでクリエイティブな16:9記事サムネイルを生成するためのスキル。

## 用途

- Web記事のサムネイル（ヒーロー画像）
- SNSシェア用OGP画像
- 番組サイト内の記事一覧カード画像

## 推奨モデル・サイズ

- **モデル**: OpenAI `gpt-image-2`
- **サイズ**: `1536x1024`（16:9に最も近い比率）
- **枚数**: 1枚
- **quality**: `high`

## 入力パラメータ

| パラメータ | 説明 | 例 |
|-----------|------|-----|
| `title` | 記事タイトル | ベトナム発グルメ「バインミー」と話題のスポーツ「ピックルボール」 |
| `mainKeyword1` | 最も重要なキーワード | バインミー |
| `mainKeyword2` | 2番目に重要なキーワード | ピックルボール |
| `location` | 記事に関係する地域 | ホーチミン |
| `broadcastDate` | 放送日 | 2026年6月30日 |
| `programName` | 番組名 | iDoBuddy・イドバタニュース |

## プロンプトテンプレート

```text
Create a 16:9 colorful pop-art radio show article thumbnail for a Japanese FM radio website. Use a bright white background with vivid paint splashes, halftone dots, paper confetti, sticker badges, colorful ribbons, speech bubbles, radio icons, a retro yellow radio, microphone, ON AIR badge, music notes, and a lively Osaka FM radio energy. The design should feel like a fun, official FM Osaka / iDoBuddy news article thumbnail, not a serious newspaper graphic.

Place a large tilted white central card with bold black Japanese gothic typography. Main article title: {{title}}. Make the most important keywords visually dominant: {{mainKeyword1}} and {{mainKeyword2}}. Add a small logo-like text in the top-left: {{programName}} NEWS. Add a vivid pink ON AIR splash badge with the broadcast date: {{broadcastDate}} ON AIR!. Add a colorful speech bubble that says: {{location}} 現地リポート!. Add another sticker saying: 最新トレンドをお届け!

Use realistic cutout-style visual objects related to the topics: {{mainKeyword1}} and {{mainKeyword2}}. If the topic is food, show it as a large appetizing realistic object. If the topic is sport, show sports gear and a small action scene or court. Add a city skyline or local visual elements related to {{location}} along the bottom. Add a retro yellow radio and microphone near the left side. Add local flag colors subtly in a top-right badge.

The composition should be dense, energetic, layered, commercial, crisp, readable, and suitable for a website hero thumbnail. Use vivid pink, electric blue, yellow, green, orange, cyan, black, and white. Prioritize readable Japanese text, especially the main title. Keep Japanese text minimal and accurate. Avoid dark mood, minimal design, unreadable text, broken characters, serious news style, or unrelated people.
```

## デザイン仕様

### カラーパレット
- **ベース**: white, black
- **アクセント**: vivid pink, electric blue, bright yellow, fresh green, orange, cyan

### 必須モチーフ
- レトロな黄色いラジオ
- マイク
- ON AIR ステッカー
- 音符 / 電波ライン
- 番組名ロゴ風テキスト
- カラフルなペイントスプラッシュ
- 主題を象徴する実写風オブジェクト
- 地域に関連するシルエットや風景

### タイポグラフィ
- 中央タイトルは極太ゴシック風、黒文字
- タイトルは短く、サムネイル縮小時も読める文字数に
- 助詞や接続語は小さく
- 概要文は画像内に入れない（HTML側で表示）

## 実装時の注意点

1. **日本語の正確性**: 画像生成AIは日本語テキストを崩しやすい。タイトルは短く、必要に応じて後工程でCanva/Figma/Photoshopで差し替え。
2. **ロゴ表現**: FM大阪の公式ロゴを正確に模倣しない。あくまで「番組名 NEWS」というロゴ風テキスト。
3. **文字量**: タイトル、放送日、地域ラベル、キーワード程度に抑える。
4. **生成後**: 得られた一時URLはmicroCMS Files APIへアップロードし、永続URLを取得してから記事に保存する。

## ネガティブプロンプト

```text
dark background, horror mood, serious political news, corporate slide design, minimal layout, unreadable Japanese, broken kanji, gibberish text, tiny text, blurry typography, low resolution, distorted food, malformed sports equipment, excessive realism without graphic design, dull colors, empty composition, copyrighted exact logo replication, clutter that hides the title
```

## 使用例（TypeScript）

```ts
const result = await openai.images.generate({
  model: "gpt-image-2",
  prompt: buildThumbnailPrompt({
    title: "ベトナム発グルメ「バインミー」と話題のスポーツ「ピックルボール」",
    mainKeyword1: "バインミー",
    mainKeyword2: "ピックルボール",
    location: "ホーチミン",
    broadcastDate: "2026年6月30日",
    programName: "iDoBuddy・イドバタニュース",
  }),
  size: "1536x1024",
  n: 1,
  quality: "high",
});
```
