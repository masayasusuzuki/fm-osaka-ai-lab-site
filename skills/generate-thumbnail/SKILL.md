# FM OSAKA 記事サムネイル生成

FM大阪／iDoBuddy・イドバタニュースの記事サムネイルを、カラフルでポップなラジオ番組風ビジュアル（16:9）で生成する。

## 実行ファイル

- `skills/generate-thumbnail/generate-thumbnail.py`：サムネイル生成スクリプト
- `skills/generate-thumbnail/thumbnail-example.json`：入力 JSON のサンプル

## 必要なもの

- プロジェクトルートの `.env` に `OPENAI_API_KEY` が設定されていること
- Python 3 + `requests`, `Pillow`

## 入力 JSON の形式

```json
{
  "program_name": "iDoBuddy・イドバタニュース",
  "station_name": "FM大阪",
  "article_title": "記事タイトル",
  "main_keyword_1": "主題1",
  "main_keyword_2": "主題2",
  "sub_keywords": ["補助キーワード1", "補助キーワード2"],
  "broadcast_date": "2026年6月30日",
  "location": "ホーチミン",
  "summary_label": "サムネイル内に入れる極小ラベル。例：AI生成記事。長文は文字化けするので短く",
  "mood": "楽しい、明るい、にぎやか、ラジオ感、現地レポート感",
  "target_media": "Web記事サムネイル、番組サイト、SNS告知バナー"
}
```

- `slug` を省略した場合、`article_title` から自動生成する
- `output` を指定しない場合、`public/images/blog/<slug>.png` に保存する

## 使い方

```bash
cd /Users/suzukimotoyasu/Desktop/MASAYASU/work/INTENTION/client-projects/fm-osaka/showcase/site
python3 skills/generate-thumbnail/generate-thumbnail.py skills/generate-thumbnail/thumbnail-example.json
```

出力先を変更する場合：

```bash
python3 skills/generate-thumbnail/generate-thumbnail.py article.json -o public/images/blog/my-thumb.png
```

## 生成フロー

1. 入力 JSON から JSON プロンプトを組み立てる
2. OpenAI `gpt-image-1` で `1536x1024` を生成
3. 中央から 16:9（1536x864）にクロップ
4. `public/images/blog/<slug>.png` に保存
5. 必要に応じて `npm run build` でサイトを再ビルドする

## 記事ごとの使い方

1. 記事情報をもとに、新しい JSON ファイルを作成する
2. `main_keyword_1` / `main_keyword_2` に記事の主題を2つ入れる
3. `sub_keywords` に補足キーワードを3〜5個入れる
4. スクリプトを実行してサムネイルを生成する
5. 生成された画像を確認し、必要なら再生成する
