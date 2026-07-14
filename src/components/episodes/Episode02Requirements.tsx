import Image from "next/image";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   EP02: 「海外レポーター候補リサーチツール」（Streamlit + Python）の
   要件定義・仕組み・設計思想を、非エンジニア／AI初学者向けに
   超丁寧に解説するハードコードのコンテンツ。

   ソース:
   - 完成ツール本体: ../../../tools/reporter-finder/（app.py / src/*.py）
   - 要件定義: ../../../requirements-ep02-tool.md
   - 要望メール: ../../../mail-logs/2026-07-13_overseas-reporter-request.md

   ※ 解説スライド画像（EP01 と同じ live-lectures スライドパイプラインで作成予定）は
     用意でき次第、下の SLIDE_URLS に URL を追加すれば各所に表示される。
   ─────────────────────────────────────────────────────────────── */

// 解説スライド（live-lectures スライドパイプラインで生成し microCMS メディアに格納）
const SLIDE_URLS: Record<string, string> = {
  title: "https://images.microcms-assets.io/assets/c8b8e61e61564493aacf4db57409a73b/896d527c8d2543ecba859dfab1ac09f0/ep02-req-slide-001.png",
  request: "https://images.microcms-assets.io/assets/c8b8e61e61564493aacf4db57409a73b/dd7cbef03472484d86f6b80718a0a87d/ep02-req-slide-002.png",
  terms: "https://images.microcms-assets.io/assets/c8b8e61e61564493aacf4db57409a73b/61548c5fab894682b5ce0040e925875f/ep02-req-slide-003.png",
  parts: "https://images.microcms-assets.io/assets/c8b8e61e61564493aacf4db57409a73b/be2e2e51dc754ad3a1f7c7e6e97aa31e/ep02-req-slide-004.png",
  steps: "https://images.microcms-assets.io/assets/c8b8e61e61564493aacf4db57409a73b/853f5675f5df409cb13af94a6fd9c810/ep02-req-slide-005.png",
  contact: "https://images.microcms-assets.io/assets/c8b8e61e61564493aacf4db57409a73b/37b8b134f9f54bdf9da6a6a7f8e9f573/ep02-req-slide-006.png",
  catMatch: "https://images.microcms-assets.io/assets/c8b8e61e61564493aacf4db57409a73b/a7dd33a07f0e4a589a0303d818f24396/ep02-req-slide-007.png",
  rules: "https://images.microcms-assets.io/assets/c8b8e61e61564493aacf4db57409a73b/187cd07e4b054378a88ac5057d397bab/ep02-req-slide-008.png",
  summary: "https://images.microcms-assets.io/assets/c8b8e61e61564493aacf4db57409a73b/993ece2a43354cad86ba07c0dad59293/ep02-req-slide-009.png",
};

function SlideFigure({ slideKey, alt }: { slideKey: string; alt: string }) {
  const src = SLIDE_URLS[slideKey];
  if (!src) return null; // スライド未用意のうちは何も表示しない
  return (
    <figure className="overflow-hidden rounded-2xl border border-border shadow-xl">
      <Image
        src={src}
        alt={alt}
        width={2048}
        height={1152}
        className="h-auto w-full"
        sizes="(max-width: 1024px) 100vw, 1024px"
      />
    </figure>
  );
}

/* ── 用語メモ（専門用語をその場で説明する小箱） ───────────────── */
interface Term {
  word: string;
  reading?: string;
  body: string;
}

const terms: Term[] = [
  {
    word: "スクレイピング",
    body: "Webページを人の代わりにプログラムが開いて、必要な情報（記事タイトル・投稿日・リンクなど）を自動で抜き出す技術。今回は「海外生活ブログ村」というまとめサイトの新着記事ページから、記事の一覧を機械的に読み取っています。",
  },
  {
    word: "RSS（アールエスエス）",
    body: "ブログの「最新記事はこれですよ」という更新情報を、機械が読みやすい形でまとめて配っている仕組み。あるブログがRSSを持っていれば、そこを見るだけで最新記事を正確・軽量に取れます。ページの見た目を無理やり読むより安定するので、まずRSSを探します。",
  },
  {
    word: "LLM（大規模言語モデル）",
    body: "文章を理解して、要約したり質問に答えたりできるAIのこと。ChatGPT の仲間です。今回は Google の「Gemini（ジェミニ）」というLLMを使って、記事の要約や「聞いてみたいこと」の候補を作らせています。",
  },
  {
    word: "APIキー",
    body: "外部のAI（今回は Gemini）を使うための「合言葉」のような文字列。これがないとAIを呼び出せません。料金にも関わる大事な鍵なので、今回のツールは入力された鍵を保存せず、その場の処理にだけ使う設計にしています。",
  },
];

/* ── 道具の中身（3つの部品） ─────────────────────────────────── */
interface Part {
  name: string;
  role: string;
  tech: string;
  color: string;
  desc: string;
}

const parts: Part[] = [
  {
    name: "画面・土台",
    role: "人が操作する部分",
    tech: "Python + Streamlit",
    color: "#F7931E",
    desc: "「Streamlit（ストリームリット）」は、Python というプログラミング言語で、ボタンや表のある操作画面をかんたんに作れる道具。担当者がキーワードを選んで実行し、結果を表やカードで見られる画面はこれで作っています。",
  },
  {
    name: "収集・調査",
    role: "情報を集める部分",
    tech: "requests + BeautifulSoup",
    color: "#00AEEF",
    desc: "ブログ村のページを読みに行って中身を抜き出す（スクレイピングする）部品。さらに各ブログのRSSや連絡先も、この部品が探しに行きます。人が何十ページも手で開いていた作業の置き換えです。",
  },
  {
    name: "AI（要約・判定）",
    role: "考える部分",
    tech: "Gemini（LLM）",
    color: "#8DC63F",
    desc: "集めてきた記事をAIが読み、①2〜3行の要約 ②「聞いてみたいこと」候補 ③本当にその国の話か、を出します。ただし『面白いかどうか』の判定はさせません（後述の大事なルール）。",
  },
];

/* ── 全体の流れ（6ステップ） ─────────────────────────────────── */
interface StepItem {
  no: string;
  title: string;
  ai: string;
  color: string;
  what: string;
  why: string;
}

const steps: StepItem[] = [
  {
    no: "STEP 1",
    title: "新着記事の一覧を集める",
    ai: "スクレイピング",
    color: "#E91E8C",
    what: "選んだ国・地域（例：タイ、フランス）の「新着記事ページ」をプログラムが開き、ブログ名・投稿者・記事タイトル・投稿日時・リンクを一覧でごっそり取得します。",
    why: "候補さがしの出発点は「今どんな人が発信しているか」。人がキーワード検索して一覧を眺める作業を、まず機械にまとめてやらせます。1ページ目（最新20〜25件ほど）が対象です。",
  },
  {
    no: "STEP 2",
    title: "新しい記事だけに絞る",
    ai: "プログラムで自動",
    color: "#F7931E",
    what: "取得した記事のうち、指定した期間（初期設定は直近30日）より古いものを外します。日数は画面で変えられます。",
    why: "「今も活動している人」を探すのが目的だから。何年も前で止まっているブログを候補に入れても意味がありません。ここで“今動いている人”だけに絞り込みます。",
  },
  {
    no: "STEP 3",
    title: "本当のブログのURLを突き止める",
    ai: "プログラムで自動",
    color: "#00AEEF",
    what: "ブログ村のリンクは一度「中継用のURL」を経由します。そこから、そのブログ本体の実際のURLを取り出します。",
    why: "次のステップで「そのブログのRSSや連絡先」を調べるには、中継URLではなく本物のブログの住所が必要だからです。地味ですが欠かせない下ごしらえです。",
  },
  {
    no: "STEP 4",
    title: "ブログを詳しく調べる（RSSさがし）",
    ai: "プログラムで自動",
    color: "#8DC63F",
    what: "各ブログにRSS（更新情報のまとめ）があるかを探します。定番の場所を順番に当たり、見つかれば最新記事の情報を補強に使います。",
    why: "ブログはサービスごとに作りがバラバラ（Exblog・Ameba・はてな・WordPress等）。RSSがあれば中身を正確・軽量に読めるので、まずRSSを優先し、無ければページを直接読むという二段構えにしています。",
  },
  {
    no: "STEP 5",
    title: "連絡先をさがす",
    ai: "プログラムで自動",
    color: "#E91E8C",
    what: "記事ページとブログのトップから、メールアドレスやSNS（X・Instagram・note等）のリンクを探します。見つからなければ「なし」。",
    why: "依頼で「問い合わせ先もあると嬉しい」と言われた部分です。ただし“シェアボタン”や画像ファイル名など、本人の連絡先ではないものを間違って拾わないよう、細かい除外ルールを入れています。",
  },
  {
    no: "STEP 6",
    title: "AIが要約・深掘り・国チェックをする",
    ai: "Gemini（AI）",
    color: "#F7931E",
    what: "記事のタイトルと抜粋をAIに渡し、①2〜3行の要約 ②「ラジオで聞いてみたいこと」候補2〜3個 ③本当にその国・地域の話か（○/×/不明）を作らせます。",
    why: "人が一件ずつ記事を読んで要約する時間を、AIが肩代わりします。最後に国・地域別に並べ替え、画面の表・カードで見せ、CSVでも保存できます。ここでも“面白いかどうか”はAIに判定させません。",
  },
];

/* ── 作る前に決めたルール（要件定義のキモ） ──────────────────── */
const rules = [
  {
    title: "「面白いかどうか」はAIに決めさせない",
    body: "今回いちばん大事なルール。AIは要約と「聞いてみたいこと」候補を出すところまで。「この人は面白い／採用すべき」といった評価は一切させません。何を面白いと感じるかは番組スタッフ固有の感覚で、機械のルールにすると良い候補を取りこぼす危険があるからです。取捨選択は必ず人間が行います。",
  },
  {
    title: "アプローチの文面は自動で作らない",
    body: "「この人に送るメール文」をAIに書かせることもできますが、あえてやりません。実際の連絡は一人ひとり内容を変えて送っているため。ツールの役割は“候補と判断材料を並べるところ”までと線引きしています。",
  },
  {
    title: "「カテゴリ一致」は参考情報。自動で捨てない",
    body: "AIが「本当にその国の話か」を○×で示しますが、これはあくまで目印。×だからといってツールが勝手にリストから消すことはしません。AIの判定は100%ではないので、隠れた良い候補を機械的に切り捨てないための配慮です。判定理由もCSVに残します。",
  },
  {
    title: "APIキーは保存も送信もしない",
    body: "AI（Gemini）を使う合言葉（APIキー）は、画面で毎回入力する方式。どこかに保存したりサーバーへ送ったりせず、その場の処理にだけ使います。大事な鍵を安全に扱うための設計です。",
  },
  {
    title: "相手のサイトに迷惑をかけない",
    body: "短時間にアクセスを集中させない、つながらないときは少し待って数回だけ再挑戦する（リトライ）、といった配慮を入れています。便利さのために相手のサイトへ負担をかけないことは、この手のツールの最低限のマナーです。",
  },
  {
    title: "連絡先「なし」が多いのは“仕様”",
    body: "そもそも連絡先を公開しているブロガーは少数派です。だからリストは「なし」が多くなるのが普通で、これは不具合ではありません。ツールは“見つかれば拾う”ベストエフォート（できる範囲で最善を尽くす）の考え方で作っています。",
  },
];

export function Episode02Requirements() {
  return (
    <div className="space-y-10">
      {/* イントロ */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-fm-orange/10 blur-3xl" />
        <p className="text-xs font-black tracking-[0.3em] text-fm-orange">HOW IT WORKS</p>
        <h2 className="mt-3 text-2xl font-black text-foreground sm:text-3xl">
          「海外レポーター候補さがし」を、AIとプログラムで自動化する仕組み
        </h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          第2回のテーマは「情報収集の自動化」。番組コーナーに出てもらう
          <strong className="text-foreground">海外レポーターの候補さがし</strong>を、AIとプログラムでどこまでラクにできるかに挑戦しました。
          ここで紹介するのは、実際に動く<strong className="text-foreground">ツール（アプリ）</strong>です。担当者が国を選んでボタンを押すと、
          海外のブログから「今も活動していて、連絡先もありそうな人」の候補リストが自動でできあがります。
          専門用語が多く出てきますが、その都度かみくだいて説明するので、AIにくわしくない方も安心して読み進めてください。
        </p>
        <div className="mt-8">
          <SlideFigure slideKey="title" alt="海外レポーター候補さがしの自動化 - 解説スライド" />
        </div>
        <div className="mt-6 rounded-2xl border border-fm-blue/20 bg-fm-blue/5 p-5">
          <p className="text-sm font-black text-fm-blue">用語メモ：「要件定義」とは？</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            何かを作る前に「何ができればOKか」「どんなルールで動くべきか」を決めておくこと。料理でいうレシピ決めです。
            とくにAIに仕事を任せるときは、この“事前の取り決め”の質が、結果の質をそのまま決めます。第2回の裏側は、まさにこの取り決めのかたまりです。
          </p>
        </div>
      </div>

      {/* もともとの依頼 */}
      <div>
        <h3 className="text-xl font-black text-foreground">そもそもの「お願いごと」</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          スタートは、番組制作サイドからの「海外レポーターを探したい」という相談でした。整理すると、お願いはこうです。
        </p>
        <div className="mt-6">
          <SlideFigure slideKey="request" alt="そもそものお願いごと - 解説スライド" />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            { t: "どこから探す？", d: "海外在住ブロガーが集まる「海外生活ブログ村」というまとめサイトから。" },
            { t: "どんな人？", d: "直近1か月以内に更新していて、食やその国の“今の流行”を発信している人。" },
            { t: "あると嬉しい", d: "問い合わせ先（メール・SNSなど）も分かるとより良い。" },
            { t: "どう渡す？", d: "地域・国別に分けて、リストの形にまとめてほしい。" },
          ].map((x) => (
            <div key={x.t} className="rounded-2xl border border-border bg-card p-5">
              <p className="font-black text-foreground">{x.t}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{x.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl border border-fm-orange/20 bg-fm-orange/5 p-5">
          <p className="text-sm font-black text-fm-orange">これまでは、ぜんぶ手作業でした</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            これまでは、キーワードで検索し、記事を一つずつ読んで面白そうな人を探し、連絡先がないかを確かめる……という作業を人が地道に繰り返していました。
            とくに大変なのが連絡先さがし。<strong className="text-foreground">連絡先を公開している人がとても少なく、ここが一番の“詰まりどころ”（ボトルネック）</strong>でした。
            そこで、この「手間はかかるが頭は使わない部分」をツールに任せることにしたのです。
          </p>
        </div>
      </div>

      {/* 用語メモ集 */}
      <div>
        <h3 className="text-xl font-black text-foreground">先に、よく出る4つの言葉だけ</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          このあと何度も出てくる言葉を、先にやさしく押さえておきましょう。ここさえ分かれば、仕組みの話がぐっと読みやすくなります。
        </p>
        <div className="mt-6">
          <SlideFigure slideKey="terms" alt="よく出る4つの言葉 - 解説スライド" />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {terms.map((term) => (
            <div key={term.word} className="rounded-2xl border border-border bg-card p-5">
              <p className="font-black text-foreground">{term.word}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{term.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 道具の中身（3つの部品） */}
      <div>
        <h3 className="text-xl font-black text-foreground">この道具は「3つの部品」でできている</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          1つのAIに全部やらせるのではなく、役割の違う部品を組み合わせています。人間の職場と同じで、得意なことに専念させたほうが良い結果が出るからです。
        </p>
        <div className="mt-6">
          <SlideFigure slideKey="parts" alt="3つの部品 - 解説スライド" />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {parts.map((part) => (
            <div key={part.name} className="relative overflow-hidden rounded-2xl border border-border bg-card p-5">
              <div className="absolute left-0 top-0 h-1 w-full" style={{ backgroundColor: part.color }} />
              <p className="text-xs font-bold text-muted-foreground">{part.tech}</p>
              <p className="mt-1 text-lg font-black text-foreground">{part.name}</p>
              <p className="mt-0.5 text-xs font-black" style={{ color: part.color }}>
                {part.role}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{part.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 6ステップ */}
      <div>
        <h3 className="text-xl font-black text-foreground">全体の流れ：6つのステップ</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          ボタンを押してから候補リストができるまで、裏側ではこの6ステップが上から順に動いています。それぞれ「何をして」「なぜ必要か」を見てみましょう。
        </p>
        <div className="mt-6">
          <SlideFigure slideKey="steps" alt="全体の流れは6ステップ - 解説スライド" />
        </div>
        <div className="mt-6 space-y-4">
          {steps.map((step, i) => (
            <div key={step.no} className="relative overflow-hidden rounded-2xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="rounded-lg px-3 py-1 text-xs font-black tracking-wider text-white"
                  style={{ backgroundColor: step.color }}
                >
                  {step.no}
                </span>
                <h4 className="text-lg font-black text-foreground">{step.title}</h4>
                <span
                  className={cn(
                    "ml-auto rounded-full border px-3 py-1 text-[11px] font-bold",
                    step.ai.includes("プログラム")
                      ? "border-border text-muted-foreground"
                      : "border-transparent text-white"
                  )}
                  style={step.ai.includes("プログラム") ? undefined : { backgroundColor: step.color }}
                >
                  {step.ai}
                </span>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-foreground/[0.03] p-4">
                  <p className="text-xs font-black tracking-wider text-muted-foreground">なにをする？</p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/90">{step.what}</p>
                </div>
                <div className="rounded-xl bg-foreground/[0.03] p-4">
                  <p className="text-xs font-black tracking-wider text-muted-foreground">なぜ必要？</p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/90">{step.why}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="pointer-events-none absolute -bottom-[9px] left-1/2 z-10 h-4 w-4 -translate-x-1/2 rotate-45 border-b border-r border-border bg-card" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 連絡先さがしの工夫（STEP5 の補足スライド） */}
      <div>
        <SlideFigure slideKey="contact" alt="連絡先さがしの工夫 - 解説スライド" />
      </div>

      {/* 「カテゴリ一致」って何？ */}
      <div className="rounded-3xl border border-fm-blue/20 bg-fm-blue/5 p-6 sm:p-8">
        <h3 className="text-xl font-black text-foreground">ちょっと難しい話：「カテゴリ一致」って何？</h3>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          ブログ村の「ベトナム」「タイ」といった<strong className="text-foreground">分類（カテゴリ）は、記事の“棚”と実際の書き手の住んでいる国がズレることがあります</strong>。
          たとえば「ベトナムの棚」に、フィリピン在住の人の記事が混ざっていた、という実例がありました。棚だけを信じると、狙っていない国の人が候補に紛れ込みます。
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          そこで<strong className="text-foreground">AIが各記事の中身を読んで「本当にその国の話か」を○×で判定</strong>し、「カテゴリ一致」という目印として添えています。
          ただし<strong className="text-foreground">これは“参考”で、×でも自動で捨てません</strong>。AIの判定は完璧ではないので、隠れた良い候補を機械的に消さないための配慮です。画面では「一致だけ表示」に絞ることもできます。
        </p>
        <div className="mt-6">
          <SlideFigure slideKey="catMatch" alt="カテゴリ一致とは - 解説スライド" />
        </div>
      </div>

      {/* 要件定義で決めたルール */}
      <div>
        <h3 className="text-xl font-black text-foreground">作る前に決めた6つのルール（＝要件定義のキモ）</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          AIやプログラムは、指示したとおりにしか動きません。逆にいえば
          <strong className="text-foreground">「どんなルールで作るか」がこのツールの良し悪しを決めます。</strong>
          打ち合わせで実際に決めた、大事なルールを6つ紹介します。
        </p>
        <div className="mt-6">
          <SlideFigure slideKey="rules" alt="作る前に決めた6つのルール - 解説スライド" />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {rules.map((rule, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-fm-orange text-xs font-black text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="font-black leading-snug text-foreground">{rule.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{rule.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* まとめ */}
      <div className="relative overflow-hidden rounded-3xl bg-fm-dark p-6 text-white sm:p-10">
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-fm-orange/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-fm-blue/20 blur-3xl" />
        <h3 className="relative text-xl font-black sm:text-2xl">面倒な情報集めはAIに。大事な判断は人間に。</h3>
        <p className="relative mt-4 max-w-3xl leading-relaxed text-white/80">
          第2回のツールがやっているのは、あくまで<strong className="text-white">「候補さがしの“材料集め”」</strong>です。
          何十ページも巡回し、要約し、連絡先を探す──そんな時間のかかる作業をAIとプログラムが一気に片づけます。
          そして<strong className="text-white">「この人に声をかけたい」という最後の判断は、必ず人間が行う</strong>。
          AIは仕事を奪う道具ではなく、人が本当に大切な判断に集中するための“相棒”です。第1回の「1つのAIに全部やらせない」と、根っこは同じ考え方なんです。
        </p>
        <div className="relative mt-6">
          <SlideFigure slideKey="summary" alt="材料集めはAI、判断は人間 - 解説スライド" />
        </div>
        <p className="relative mt-4 max-w-3xl text-sm leading-relaxed text-white/60">
          ※ この仕組みは、実際に動く海外レポーター候補リサーチツール（Python + Streamlit 製）として作られています。
        </p>
      </div>
    </div>
  );
}
