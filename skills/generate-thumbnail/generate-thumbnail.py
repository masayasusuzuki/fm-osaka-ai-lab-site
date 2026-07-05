#!/usr/bin/env python3
"""
FM OSAKA AI LAB 記事サムネイル生成スクリプト

使い方:
  python3 scripts/generate-thumbnail.py scripts/thumbnail-example.json

入力 JSON の例は `thumbnail-example.json` を参照。
出力は public/images/blog/ 配下に <slug>.png として保存される。
"""

import argparse
import base64
import json
import re
import sys
from io import BytesIO
from pathlib import Path

import requests
from PIL import Image


def load_api_key() -> str:
    """プロジェクトルートの .env から OPENAI_API_KEY を読み込む。"""
    root = Path(__file__).resolve().parents[4]
    env_path = root / ".env"
    if not env_path.exists():
        raise FileNotFoundError(f".env not found at {env_path}")
    for line in env_path.read_text(encoding="utf-8").splitlines():
        if line.startswith("OPENAI_API_KEY="):
            return line.split("=", 1)[1].strip()
    raise ValueError("OPENAI_API_KEY not found in .env")


def slugify(text: str) -> str:
    s = re.sub(r"[^\w\s-]", "", text).strip().lower()
    return re.sub(r"[-\s]+", "-", s)


def build_json_prompt(article: dict) -> str:
    """記事情報から FM大阪／iDoBuddy 用 JSON プロンプトを組み立てる。"""
    program_name = article.get("program_name", "iDoBuddy・イドバタニュース")
    station_name = article.get("station_name", "FM大阪")
    article_title = article.get("article_title", article.get("title", ""))
    main_keyword_1 = article.get("main_keyword_1", "")
    main_keyword_2 = article.get("main_keyword_2", "")
    sub_keywords = article.get("sub_keywords", [])
    broadcast_date = article.get("broadcast_date", "")
    location = article.get("location", "")
    summary_label = article.get("summary_label", article.get("summary", "AI生成記事"))
    mood = article.get("mood", "楽しい、明るい、にぎやか、ラジオ感、現地レポート感")
    target_media = article.get("target_media", "Web記事サムネイル、番組サイト、SNS告知バナー")

    sub_keywords_text = ", ".join(sub_keywords) if sub_keywords else ""

    visual_direction = (
        f"中央に巨大な黒文字で『{main_keyword_1}と{main_keyword_2}』。"
        f"上部にピンクのリボンで『注目トピック』。"
        f"右側に大きなリアルな{main_keyword_1}。"
        f"左下に{main_keyword_2}のパドルとボール。"
        f"下部に{location}の街並み。"
        f"左上に{program_name}。"
        f"左中央に{broadcast_date} ON AIR! のピンクスプラッシュ。"
        f"右上に{location}現地リポートの吹き出し。"
    )

    important_objects = [
        f"リアルな{main_keyword_1}",
        f"{main_keyword_2}のパドル",
        f"{main_keyword_2}のボール",
        f"{location}の都市風景",
        "レトロラジオ",
        "マイク",
        "ON AIRバッジ",
        "カラフルなペイントスプラッシュ",
    ]

    api_prompt_filled = (
        "Create a 16:9 colorful pop-art radio show article thumbnail for a Japanese FM radio website. "
        "Use a bright white background with vivid paint splashes, halftone dots, paper confetti, sticker badges, colorful ribbons, speech bubbles, radio icons, a retro yellow radio, microphone, ON AIR badge, music notes, and a lively Osaka FM radio energy. "
        "The design should feel like a fun, official FM Osaka / iDoBuddy news article thumbnail, not a serious newspaper graphic. "
        "Place a large tilted white central card with bold black Japanese gothic typography. "
        f"Main article title: {article_title}. "
        f"Make the most important keywords visually dominant: {main_keyword_1} and {main_keyword_2}. "
        f"Add a small logo-like text in the top-left: {program_name} NEWS. "
        f"Add a vivid pink ON AIR splash badge with the broadcast date: {broadcast_date} ON AIR!. "
        f"Add a colorful speech bubble that says: {location} 現地リポート! "
        "Add another sticker saying: 最新トレンドをお届け! "
        f"Use realistic cutout-style visual objects related to the topics: {main_keyword_1} and {main_keyword_2}. "
        f"Add sub-topic keywords subtly: {sub_keywords_text}. "
        f"Add a city skyline or local visual elements related to {location} along the bottom. "
        f"Add a very small label near the bottom: {summary_label}. "
        f"The mood should be {mood}. The thumbnail is for {target_media}. "
        "The composition should be dense, energetic, layered, commercial, crisp, readable, and suitable for a website hero thumbnail. "
        "Use vivid pink, electric blue, yellow, green, orange, cyan, black, and white. "
        "Prioritize readable Japanese text, especially the main title. "
        "Avoid dark mood, minimal design, unreadable text, broken characters, serious news style, or unrelated people."
    )

    example_prompt_filled = api_prompt_filled + (
        f" On the right side, place a large realistic delicious {main_keyword_1} as a cutout object. "
        f"On the bottom-left, place a {main_keyword_2} paddle and ball with a label reading {main_keyword_2}. "
        f"Along the bottom, add a {location} city skyline and a small {main_keyword_2} scene with players. "
        "Add a retro yellow radio and microphone near the left side."
    )

    prompt_obj = {
        "prompt_name": "FM大阪・iDoBuddy記事サムネイル生成プロンプト",
        "purpose": "FM大阪／iDoBuddy・イドバタニュースの記事サムネイルを、カラフルでポップなラジオ番組風ビジュアルとして16:9で生成するための汎用プロンプト",
        "aspect_ratio": "16:9",
        "recommended_size": "1792x1024",
        "language": "ja",
        "input_variables": {
            "program_name": program_name,
            "station_name": station_name,
            "article_title": article_title,
            "main_keyword_1": main_keyword_1,
            "main_keyword_2": main_keyword_2,
            "sub_keywords": sub_keywords,
            "broadcast_date": broadcast_date,
            "location": location,
            "summary_label": summary_label,
            "mood": mood,
            "target_media": target_media,
        },
        "generation_prompt": {
            "role": "あなたは一流の広告アートディレクター、ラジオ番組のビジュアルデザイナー、日本語タイポグラフィ専門デザイナーです。",
            "task": "以下の入力情報をもとに、FM大阪のラジオ番組サイトに掲載される記事サムネイル画像を16:9で作成してください。参考トンマナは、カラフルでポップ、ラジオ番組感が強く、白背景にビビッドなペイントスプラッシュ、太い日本語見出し、紙吹雪、アイコン、吹き出し、番組ステッカー、都市シルエット、ラジオ機材、メインテーマの実写風オブジェクトを大胆に配置した高密度な広告ビジュアルです。",
            "core_visual_direction": {
                "overall_style": "FM大阪の公式サイト用サムネイルのような、明るく楽しいポップアート広告ビジュアル。ラジオ番組のにぎやかさ、情報番組のワクワク感、現地リポートの臨場感を融合させる。",
                "tone_and_manner": [
                    "白背景ベース",
                    "ビビッドカラー",
                    "ポップアート",
                    "ラジオ番組感",
                    "大阪のFM局らしい明るさ",
                    "遊び心",
                    "情報バラエティ感",
                    "若々しいWebメディア感",
                    "高密度だが読みやすい構図",
                    "サムネイルとして一瞬で内容が伝わる設計",
                ],
                "design_density": "情報量は多め。ただし中央のメインタイトルは最優先で読みやすく、周辺に補足要素を散らす。",
                "avoid_style": [
                    "暗い雰囲気",
                    "高級すぎるミニマルデザイン",
                    "ニュース番組のような硬いトーン",
                    "和風すぎる装飾",
                    "企業IR資料風",
                    "単調なフラットデザイン",
                    "AIっぽい抽象背景だけの画像",
                ],
            },
            "layout": {
                "canvas": "横長16:9。Web記事サムネイルとして使いやすい構図。",
                "safe_area": "重要なタイトル文字は中央70%以内に収め、上下左右の端に寄せすぎない。",
                "main_composition": "中央に大きな白い斜めカード、または白い紙パネルを配置。その上に記事タイトルを極太の黒文字で大きく載せる。カードは少し傾け、周囲にピンク、青、黄色、緑のブラシストロークや紙片を重ねる。",
                "visual_hierarchy": [
                    "1番目：記事の主題が一瞬でわかる巨大タイトル",
                    "2番目：主題を象徴する大きなビジュアルオブジェクト",
                    "3番目：放送日、番組名、現地リポートなどの補足情報",
                    "4番目：ラジオ感を出すアイコンや装飾",
                    "5番目：記事概要の短い説明文",
                ],
                "recommended_zones": {
                    "top_left": f"番組名またはロゴ風テキスト。例：{program_name} / NEWS",
                    "center": "記事タイトルを極太日本語で大きく配置",
                    "right": f"{main_keyword_1}を象徴する大きな実写風オブジェクト",
                    "bottom_left": f"{main_keyword_2}を象徴する大きな実写風オブジェクト、またはカテゴリラベル",
                    "bottom": "都市シルエット、放送日、記事概要の短文",
                    "top_right": "現地リポート、最新トレンド、注目トピックなどの吹き出し",
                    "background": "ペイントスプラッシュ、ハーフトーン、紙吹雪、音符、電波、マイク、ラジオ波、矢印",
                },
            },
            "typography": {
                "main_title": {
                    "language": "Japanese",
                    "style": "極太ゴシック体風。黒文字。白いカード上に配置。文字は大きく、多少斜めに配置して動きを出す。",
                    "treatment": f"重要語だけを巨大化する。例：{main_keyword_1}、{main_keyword_2}など。助詞や接続語は少し小さくする。",
                    "readability": "サムネイル縮小時でも読めるように、文字数が多い場合は2〜3行に分割する。",
                    "effects": [
                        "軽いドロップシャドウ",
                        "白フチまたは黒フチ",
                        "斜めの色帯",
                        "黄色やピンクのアンダーライン",
                    ],
                },
                "sub_labels": {
                    "style": "カラフルなステッカー風、吹き出し風、リボン風",
                    "examples": [
                        "ON AIR!",
                        "現地リポート!",
                        "最新トレンド!",
                        "AI生成記事",
                        "NEWS",
                        "RADIO TOPIC",
                    ],
                },
                "body_text": {
                    "style": "極小の黒文字。本文は入れすぎない。",
                    "rule": "概要文は最大1行。長文は禁止。",
                },
                "japanese_text_accuracy": {
                    "instruction": "日本語テキストは正確に表示する。文字化け、誤字、意味不明な漢字、崩れたカタカナを避ける。長文を画像内に入れすぎない。",
                    "fallback": "日本語生成が不安定な場合は、タイトルだけを大きく正確に表示し、概要文は短いラベルに置き換える。",
                },
            },
            "color_palette": {
                "base": ["white", "black"],
                "accent": ["vivid pink", "electric blue", "bright yellow", "fresh green", "orange", "cyan"],
                "usage": {
                    "white": "背景とメインカード",
                    "black": "メインタイトル",
                    "pink": "メインリボン、スプラッシュ、注目ラベル",
                    "blue": "情報帯、ラジオ系アイコン、スポーツ系ラベル",
                    "yellow": "注意喚起、楽しいアクセント、ボールや光",
                    "green": "現地感、食材、トレンドラベル",
                    "orange": "フード、温かさ、バナー",
                },
                "contrast_rule": "中央タイトルは必ず高コントラストにする。背景が派手でも文字が埋もれないように白カードを敷く。",
            },
            "required_motifs": {
                "radio_elements": [
                    "レトロな黄色いラジオ",
                    "マイク",
                    "ON AIRステッカー",
                    "音符",
                    "電波ライン",
                    "スピーカー",
                    "番組表アイコン",
                    "吹き出し",
                ],
                "media_elements": [
                    "NEWSラベル",
                    "通知ベル",
                    "記事カード",
                    "再生マーク",
                    "カレンダー",
                    "リクエスト風アイコン",
                ],
                "local_elements": [
                    f"{location}に関連する都市シルエット",
                    "現地の街並み",
                    "国旗カラーをさりげなく使用",
                    "観光地やランドマークを小さく背景に配置",
                ],
                "topic_elements": f"{main_keyword_1}と{main_keyword_2}を視覚的に象徴するオブジェクトを、それぞれ大きく配置する。",
            },
            "article_to_visual_mapping_rules": {
                "rule_1": f"article_title({article_title})から最も重要なキーワードを2〜3個抽出し、中央タイトルと周辺オブジェクトに反映する。",
                "rule_2": f"main_keyword_1({main_keyword_1})が食べ物なら、右側に大きく実写風フードビジュアルを配置する。",
                "rule_3": f"main_keyword_2({main_keyword_2})がスポーツなら、左下または下部にスポーツ道具・競技シーンを配置する。",
                "rule_4": f"location({location})がある場合は、下部に都市シルエットや現地の空気感を追加する。",
                "rule_5": f"broadcast_date({broadcast_date})はON AIRステッカーやカレンダー風バッジで表示する。",
                "rule_6": "summaryは1行の小さなラベルにする。長文は禁止。"
                "rule_7": f"番組名({program_name})は左上にロゴ風に配置し、FM大阪感・ラジオ局感を強める。",
                "rule_8": "すべての記事で同じテンプレート感を維持しつつ、主題オブジェクトとキーワードだけを差し替えられる設計にする。",
            },
            "specific_text_elements": {
                "top_left_logo_text": program_name,
                "main_title_text": article_title,
                "date_badge_text": f"{broadcast_date} ON AIR!",
                "location_badge_text": f"{location} 現地リポート!",
                "topic_badge_1": main_keyword_1,
                "topic_badge_2": main_keyword_2,
                "trend_badge": "最新トレンドをお届け!",
                "ai_badge": "放送音声を元に AI が生成した記事",
                "summary_text": summary_label,
            },
            "composition_example_for_current_article": {
                "article_title": article_title,
                "visual_direction": visual_direction,
                "important_objects": important_objects,
            },
            "rendering_quality": {
                "image_quality": "high resolution, crisp, commercial advertising quality",
                "object_quality": "main objects should look realistic but integrated into a pop-art graphic layout",
                "lighting": "bright studio lighting, clean highlights, vivid contrast",
                "texture": "paper cutout texture, halftone dots, ink splashes, sticker edges, glossy badges",
                "depth": "layered collage design with overlapping ribbons, cards, objects, icons, and city silhouettes",
            },
            "negative_prompt": {
                "do_not_include": [
                    "暗い背景",
                    "怖い雰囲気",
                    "シリアスな報道番組風",
                    "地味な企業資料風",
                    "文字が小さすぎるデザイン",
                    "読めない日本語",
                    "崩れた漢字",
                    "意味不明なカタカナ",
                    "日本語の長文・段落",
                    "過剰にリアルなニュース写真だけの構図",
                    "単色背景",
                    "無関係な人物の大写し",
                    "不自然な手",
                    "ホラー風",
                    "政治広告風",
                    "高級ブランド広告風",
                    "余白が多すぎるミニマルデザイン",
                    "FM大阪の公式ロゴを正確に模倣しすぎること",
                    "著作権ロゴの完全再現",
                    "低解像度",
                    "ぼやけた文字",
                    "過度なノイズ",
                    "歪んだ食品",
                    "スポーツ用品の形状破綻",
                ]
            },
            "final_instruction": "16:9の横長サムネイルとして、中央タイトルの可読性を最優先しながら、周囲に記事テーマを象徴するオブジェクト、ラジオ番組感のあるアイコン、カラフルなペイントスプラッシュ、都市シルエット、ON AIRバッジを高密度に配置してください。日本語テキストはタイトル、短い日付・場所ラベル、トレンドバッジのみに抑え、長文の説明文は入れないでください。楽しく、にぎやかで、FM大阪の番組サイトに掲載されても違和感のない、ポップでクリエイティブな記事サムネイルに仕上げてください。",
        },
        "api_prompt_template": {
            "prompt": api_prompt_filled,
            "negative_prompt": "dark background, horror mood, serious political news, corporate slide design, minimal layout, unreadable Japanese, broken kanji, gibberish text, tiny text, blurry typography, low resolution, distorted food, malformed sports equipment, excessive realism without graphic design, dull colors, empty composition, copyrighted exact logo replication, clutter that hides the title, long paragraphs of Japanese text",
        },
        "example_filled_prompt_for_current_article": {
            "program_name": program_name,
            "station_name": station_name,
            "article_title": article_title,
            "main_keyword_1": main_keyword_1,
            "main_keyword_2": main_keyword_2,
            "broadcast_date": broadcast_date,
            "location": location,
            "summary_label": summary_label,
            "prompt": example_prompt_filled,
        },
        "implementation_notes": {
            "for_api_use": [
                "article_titleが長い場合は、生成前にmain_keyword_1とmain_keyword_2を抽出して、画像内の大見出しは短くする。",
                "日本語の長文は崩れやすいため、画像内に入れる文章はタイトル、短いラベル、放送日のみに絞る方が安定する。",
                "本文概要は小さく入れてもよいが、画像生成AIでは誤字が出やすいので、後工程でHTMLやCanva、Figma、Photoshopで載せる運用も推奨。",
                "ロゴは完全再現ではなく、番組名をロゴ風に扱う。実在ロゴの精密再現は避ける。",
                "記事ジャンルがグルメ・スポーツ以外でも、main_keyword_1とmain_keyword_2を象徴するオブジェクトに差し替えれば同じテンプレートで使える。",
            ],
            "recommended_pipeline": {
                "step_1": "記事タイトル、概要、放送日、地域、キーワードを入力する。",
                "step_2": "キーワードを2〜3個に要約する。",
                "step_3": "画像生成AIには短いタイトルと主要オブジェクトを明示する。",
                "step_4": "日本語の正確性が必要な箇所は後からデザインツールで文字を差し替える。",
                "step_5": "最終的に16:9でトリミングし、中央タイトルがスマホ表示でも読めるか確認する。",
            },
        },
    }

    return json.dumps(prompt_obj, ensure_ascii=False, indent=2)


def generate_thumbnail(prompt: str) -> Image.Image:
    """OpenAI gpt-image-1 で画像を生成し、PIL Image を返す。"""
    api_key = load_api_key()
    resp = requests.post(
        "https://api.openai.com/v1/images/generations",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json={
            "model": "gpt-image-1",
            "prompt": prompt,
            "n": 1,
            "size": "1536x1024",
        },
        timeout=240,
    )
    resp.raise_for_status()
    data = resp.json()
    b64 = data["data"][0]["b64_json"]
    return Image.open(BytesIO(base64.b64decode(b64))).convert("RGBA")


def crop_to_16_9(img: Image.Image) -> Image.Image:
    """中央から16:9にクロップする。"""
    w, h = img.size
    target_h = int(w * 9 / 16)
    if target_h > h:
        target_w = int(h * 16 / 9)
        left = (w - target_w) // 2
        return img.crop((left, 0, left + target_w, h))
    top = (h - target_h) // 2
    return img.crop((0, top, w, top + target_h))


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate FM OSAKA article thumbnail")
    parser.add_argument("input", help="Path to article JSON file")
    parser.add_argument(
        "-o",
        "--output",
        help="Output PNG path (default: public/images/blog/<slug>.png)",
    )
    args = parser.parse_args()

    article_path = Path(args.input)
    article = json.loads(article_path.read_text(encoding="utf-8"))

    slug = article.get("slug") or slugify(article.get("article_title", article_path.stem))
    if args.output:
        output_path = Path(args.output)
    else:
        output_path = (
            Path(__file__).resolve().parent.parent
            / "public"
            / "images"
            / "blog"
            / f"{slug}.png"
        )
    output_path.parent.mkdir(parents=True, exist_ok=True)

    prompt = build_json_prompt(article)
    print(f"Generating thumbnail for: {article.get('article_title', slug)}")
    img = generate_thumbnail(prompt)
    img = crop_to_16_9(img)
    img.save(output_path, "PNG")
    print(f"Saved: {output_path} ({output_path.stat().st_size:,} bytes, {img.size})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
