import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

// 実際に動くツール（Streamlit Community Cloud にホスティング済み）
const TOOL_URL = "https://masayasusuzuki-fm-osaka-onair-song-checker-app-nde7lm.streamlit.app/";

function ToolButton({ onDark = false }: { onDark?: boolean }) {
  return (
    <a
      href={TOOL_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-sm font-black shadow-lg transition-all",
        onDark
          ? "bg-white text-fm-dark hover:bg-white/90"
          : "bg-fm-blue text-white hover:brightness-110"
      )}
    >
      実際のツールを触ってみる
      <ArrowUpRight className="h-4 w-4" />
    </a>
  );
}

/* ────────────────────────────────────────────────────────────────
   EP03: 「オンエア楽曲 重複チェックツール」（Streamlit + Python +
   Supabase）の要件定義・仕組み・設計思想を、非エンジニア／AI初学者
   向けに超丁寧に解説するハードコードのコンテンツ。

   ソース:
   - 完成ツール本体: ../../../tools/onair-song-checker2/（app.py / src/*.py）
   - 要件定義: ../../../tools/onair-song-checker2/requirements.md

   ※ 解説スライド画像（EP01/EP02 と同じ live-lectures スライドパイプラインで
     作成予定）は用意でき次第、下の SLIDE_URLS に URL を追加すれば各所に表示される。
   ─────────────────────────────────────────────────────────────── */

// 解説スライド（live-lectures スライドパイプラインで生成し microCMS メディアに格納）
const SLIDE_URLS: Record<string, string> = {
  title: "https://images.microcms-assets.io/assets/c8b8e61e61564493aacf4db57409a73b/cc8c404b31994a7c8a63db9640d803e6/ep03-req-slide-001.png",
  request: "https://images.microcms-assets.io/assets/c8b8e61e61564493aacf4db57409a73b/fe7e5c5fbb0141cb853ccd5aa9005c6a/ep03-req-slide-002.png",
  terms: "https://images.microcms-assets.io/assets/c8b8e61e61564493aacf4db57409a73b/e59e42f0151641e4aee1d6971423d975/ep03-req-slide-003.png",
  parts: "https://images.microcms-assets.io/assets/c8b8e61e61564493aacf4db57409a73b/97216ccd4b834a509d562e4fdf409802/ep03-req-slide-004.png",
  steps: "https://images.microcms-assets.io/assets/c8b8e61e61564493aacf4db57409a73b/d4cf8a036d714b3ebfd3ca5835a6ca89/ep03-req-slide-005.png",
  architecture: "https://images.microcms-assets.io/assets/c8b8e61e61564493aacf4db57409a73b/ceffd890153d4ac4af92d03a3cb126e5/ep03-req-slide-006.png",
  rules: "https://images.microcms-assets.io/assets/c8b8e61e61564493aacf4db57409a73b/be49c3c11a254ebfa23aa01947f173f4/ep03-req-slide-007.png",
  summary: "https://images.microcms-assets.io/assets/c8b8e61e61564493aacf4db57409a73b/a731242a28144f6a8e8f4cfb6d5687dc/ep03-req-slide-008.png",
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
  body: string;
}

const terms: Term[] = [
  {
    word: "クローラー / スクレイピング",
    body: "Webページを人の代わりにプログラムが自動で開いて、必要な情報を抜き出す技術が「スクレイピング」。それを定期的に巡回して集めるプログラムを「クローラー」と呼びます。今回は、FM大阪の楽曲オンエア情報が載っている「NOA（ノア）」というサイトから、過去にかかった曲を機械的に集めています。",
  },
  {
    word: "データベース",
    body: "集めた大量のデータをきちんと整理してためておく「専用の倉庫」。ノートに手書きするのと違い、何十万件あっても一瞬で検索・照合できます。今回は約11年分・およそ64万曲を、Supabase（スーパーベース）というクラウド上のデータベースにためています。",
  },
  {
    word: "表記ゆれ / 正規化",
    body: "同じ曲でも「Ｔｒｉｃｋｙ」と「Tricky」、「サカナクション」と「sakanaction」のように、書き方が違うことがあります。これを機械が『同じ』と判断できるよう、全部そろった形に整える下ごしらえが「正規化」です。これをサボると、同じ曲を別の曲と見なして被りを見逃します。",
  },
  {
    word: "あいまい検索（類似度）",
    body: "文字が完全に一致しなくても「どれくらい似ているか」を点数で測り、近いものを見つける技術。正規化だけでは吸収しきれない“ちょっと違う表記”の曲を拾うために使います。",
  },
  {
    word: "LLM（大規模言語モデル）／ Gemini",
    body: "文章を理解して判断できるAI（ChatGPT の仲間）。今回は Google の「Gemini（ジェミニ）」を、ルールでは吸収しきれない表記ゆれ（英語表記とカタカナ表記など）に対して『これは同じ曲？別の曲？』と最終的に見極めさせる場面だけで使います。使うかどうかは任意です。",
  },
];

/* ── 道具の中身（4つの部品） ─────────────────────────────────── */
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
    color: "#00AEEF",
    desc: "「Streamlit（ストリームリット）」は、Python というプログラミング言語で操作画面をかんたんに作れる道具。選曲リストのExcelを放り込み、ボタンを押すと結果が色分けで出る画面はこれで作っています。担当者はブラウザでURLを開くだけで使えます。",
  },
  {
    name: "履歴の倉庫",
    role: "データをためる部分",
    tech: "Supabase（データベース）",
    color: "#8DC63F",
    desc: "過去のオンエア履歴（約11年・64万曲）をためておくクラウドの倉庫。ここにデータがあるおかげで「この曲、過去にいつかけた？」を一瞬で照合できます。アプリ本体とは分けて置いてあり、誰がどこから開いても同じ最新データを見られます。",
  },
  {
    name: "情報あつめ",
    role: "履歴を集める部分",
    tech: "requests + BeautifulSoup",
    color: "#E91E8C",
    desc: "NOAサイトを読みに行って、日付ごとのオンエア曲（時刻・曲名・アーティスト）を抜き出す（スクレイピングする）部品。人が1日ずつ手で調べていた作業の置き換えです。相手サイトに負担をかけないよう、ゆっくり巡回します。",
  },
  {
    name: "照合エンジン＋AI",
    role: "被りを見つける部分",
    tech: "3段マッチング + Gemini",
    color: "#F7931E",
    desc: "選曲リストと履歴の倉庫を突き合わせて、被りを見つける頭脳。完全一致 → あいまい検索 → AI精査、の3段構えで、表記のゆれた曲も取りこぼしにくくしています（次章でくわしく）。",
  },
];

/* ── 全体の流れ（5ステップ） ─────────────────────────────────── */
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
    title: "履歴データベースを最新にする",
    ai: "クローラー",
    color: "#00AEEF",
    what: "「更新」ボタンを押すと、倉庫にたまっている最新の日付から今日までの“足りない分”だけを、NOAサイトから取りに行きます。放送前にこれを押すのが基本の使い方です。",
    why: "被りチェックは「最新のオンエアまで入っていること」が命だから。古いデータのままだと、数日前にかけた曲を見逃します。だから検証の前に、まず倉庫を最新にします。",
  },
  {
    no: "STEP 2",
    title: "選曲リスト（Excel）を読み込む",
    ai: "プログラムで自動",
    color: "#8DC63F",
    what: "番組フォーマットのExcelをドラッグ＆ドロップすると、その中から「今回かける曲」だけを自動で抜き出し、曲名とアーティストに分けて一覧にします。放送日もExcelから自動で読み取ります。",
    why: "Excelには曲以外の情報（ジングルや進行メモ）もたくさん入っています。そこから曲の行だけを正確に拾い出すのは、決まったルールで機械にやらせたほうが速くて確実です。",
  },
  {
    no: "STEP 3",
    title: "被りを照合する（3段構え）",
    ai: "照合エンジン + Gemini",
    color: "#F7931E",
    what: "抜き出した曲を1曲ずつ、履歴の倉庫と突き合わせます。①完全一致 → ②あいまい検索 → ③AI精査、の順で、表記のゆれも吸収しながら過去のオンエア日を探します。",
    why: "曲名の書き方はバラバラ（全角・半角・英語・カタカナ）。単純な一致だけでは同じ曲を見逃すので、だんだん賢い方法に切り替える3段構えにしています（次章でくわしく）。",
  },
  {
    no: "STEP 4",
    title: "結果を色分けで表示する",
    ai: "プログラムで自動",
    color: "#E91E8C",
    what: "曲ごとに🔴直近被り／🟡使用歴あり／🟢履歴なし／⚠️要確認、を色分けで表示。🔴には「いつかけたか」の日付も出ます。あわせて「DBは◯月◯日分まで」という倉庫の鮮度も必ず表示します。",
    why: "見た瞬間に判断できるように。とくに『倉庫がいつまでの分か』を必ず見せるのは、古いデータのまま“被りゼロ”と安心してしまう事故を防ぐためです。",
  },
  {
    no: "STEP 5",
    title: "必要ならCSVで書き出す",
    ai: "プログラムで自動",
    color: "#00AEEF",
    what: "判定結果の一覧を、Excelなどで開けるCSVファイルとして保存できます。",
    why: "画面で確認するだけでなく、記録として残したり、他のスタッフと共有したりできるように。最後の選曲判断はあくまで人間が行う、という前提の“材料”です。",
  },
];

/* ── 3段マッチングの中身 ─────────────────────────────────────── */
interface MatchStage {
  no: string;
  title: string;
  tech: string;
  color: string;
  body: string;
}

const matchStages: MatchStage[] = [
  {
    no: "第1段",
    title: "完全一致で照合",
    tech: "正規化 + 完全一致",
    color: "#00AEEF",
    body: "まず、曲名とアーティスト名を正規化（表記をそろえる下ごしらえ）してから、履歴の倉庫にピッタリ同じものがないか探します。速くて確実。大半の曲はここで判定できます。曲名だけでなくアーティストもセットで見るのは、同じ曲名の“別の曲”を間違って被り扱いしないためです。",
  },
  {
    no: "第2段",
    title: "あいまい検索で候補さがし",
    tech: "類似度スコア",
    color: "#8DC63F",
    body: "第1段で見つからなかった曲だけを対象に、『どれくらい似ているか』を点数で測って、近い候補を倉庫から拾います。英語表記とカタカナ表記のような大きく違うケースも、ここでローマ字に直して比べることで拾えるようにしています。",
  },
  {
    no: "第3段",
    title: "AIが“同じ曲か”を見極める",
    tech: "Gemini（任意）",
    color: "#F7931E",
    body: "第2段で見つけた“似ている候補”を、AI（Gemini）に『これは同じ曲か、別の曲か』と最終判断させます。ルールでは吸収しきれない表記ゆれを、文章を理解するAIの力で見極める段です。ただしAIの鍵（APIキー）を入れないときはこの段を飛ばし、候補を『⚠️要確認』として人に見せます。AIの判定も鵜呑みにせず、根拠を必ず併記します。",
  },
];

/* ── システム全体の地図（アーキテクチャ） ────────────────────── */
interface ArchNode {
  name: string;
  where: string;
  color: string;
  body: string;
}

const archNodes: ArchNode[] = [
  {
    name: "操作画面（アプリ）",
    where: "Streamlit Community Cloud",
    color: "#00AEEF",
    body: "担当者が触る画面そのもの。インターネット上に置いてあり、担当者は配られたURLをブラウザで開くだけ。自分のPCに何かをインストールする必要はありません。",
  },
  {
    name: "履歴の倉庫",
    where: "Supabase（クラウドDB）",
    color: "#8DC63F",
    body: "約11年・64万曲のオンエア履歴が入った倉庫。アプリとは“別の場所”に置いてあるのがポイント。だから誰がどこから開いても同じ最新データを見られ、担当者のPCを閉じてもデータは生き続けます。",
  },
  {
    name: "情報の取り込み口",
    where: "NOA サイト → クローラー",
    color: "#E91E8C",
    body: "最新のオンエア情報の出どころ。「更新」ボタンを押したときだけクローラーが動き、足りない日数分を取りに行って倉庫に足します。毎朝自動で動かす手もありましたが、“押したときだけ動く”シンプルな形を選びました。",
  },
];

/* ── 作る前に決めたルール（要件定義のキモ） ──────────────────── */
const rules = [
  {
    title: "最後の選曲判断は、必ず人間がする",
    body: "このツールがやるのは「この曲、最近かかっていますよ」という注意喚起まで。差し替えるかどうかはディレクターが決めます。何を大事にするかは番組ごとの判断で、機械に決めさせるものではないからです。第1回・第2回と同じ、いちばん大事な考え方です。",
  },
  {
    title: "倉庫の“鮮度”を必ず見せる",
    body: "結果画面に「DBは◯月◯日分まで」と必ず表示します。倉庫が古いまま『被りゼロ』と出ても、それは“最近の分が入っていないだけ”かもしれない。古いデータで安心してしまう事故を防ぐための、いちばん現実的な工夫です。",
  },
  {
    title: "「見落としゼロ」は保証しない、と正直に伝える",
    body: "生演奏やジングルなど、そもそもNOAに載らない曲は倉庫に入らず『履歴なし』と出ます。表記ゆれ対策も3段構えで頑張りますが、100%ではありません。できないことを正直に共有するのも、道具の信頼の一部です。",
  },
  {
    title: "曲名だけで判定しない",
    body: "世の中には同じ曲名の“別の曲”がたくさんあります。曲名だけで照合すると、無関係な曲を被りと誤検出してしまう。だから必ず曲名とアーティスト名をセットで突き合わせます。",
  },
  {
    title: "相手のサイトに迷惑をかけない",
    body: "情報を集めるとき、NOAサイトへは決められた間隔（数秒に1回）を空けてアクセスし、サイトが定めたルール（robots.txt）も守っています。便利さのために相手へ負担をかけないのは、この手のツールの最低限のマナーです。",
  },
  {
    title: "AIは任意。鍵は保存も送信もしない",
    body: "表記ゆれを見極めるAI（Gemini）は“使いたいときだけ”。その合言葉（APIキー）は画面で毎回入力する方式で、どこにも保存せずサーバーにも送りません。AIなしでも、候補を『要確認』として見せる形でちゃんと動きます。第2回と同じ設計思想です。",
  },
];

export function Episode03Requirements() {
  return (
    <div className="space-y-10">
      {/* イントロ */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-fm-blue/10 blur-3xl" />
        <p className="text-xs font-black tracking-[0.3em] text-fm-blue">HOW IT WORKS</p>
        <h2 className="mt-3 text-2xl font-black text-foreground sm:text-3xl">
          「選曲の被りチェック」を、11年分のデータとAIで一瞬にする仕組み
        </h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          第3回のテーマは「確認作業の自動化」。番組でかける曲が
          <strong className="text-foreground">最近すでにオンエアされていないか</strong>を、人の記憶に頼らずに一瞬でチェックするツールを作りました。
          ここで紹介するのは、実際に動く<strong className="text-foreground">アプリ</strong>です。選曲リストのExcelを放り込むと、
          過去<strong className="text-foreground">約11年・64万曲</strong>のオンエア履歴と自動で照らし合わせ、被っている曲を色分けで教えてくれます。
          専門用語が多く出てきますが、その都度かみくだいて説明するので、AIにくわしくない方も安心して読み進めてください。
        </p>
        <div className="mt-6">
          <ToolButton />
        </div>
        <div className="mt-8">
          <SlideFigure slideKey="title" alt="選曲の被りチェック自動化 - 解説スライド" />
        </div>
        <div className="mt-6 rounded-2xl border border-fm-orange/20 bg-fm-orange/5 p-5">
          <p className="text-sm font-black text-fm-orange">これまでは、記憶と手作業だのみでした</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            「この曲、最近かけたっけ？」を、これまではスタッフの記憶や手作業の確認に頼っていました。
            過去の使用日をきちんと調べようとすると、専用サイトで日付を1日ずつ探すしかなく、
            <strong className="text-foreground">事実上ほとんど調べられない</strong>のが実情でした。うっかり被りは、いつ起きてもおかしくなかったのです。
            そこで、この「手間はかかるが頭は使わない確認作業」を、まるごとツールに任せることにしました。
          </p>
        </div>
      </div>

      {/* 依頼の整理 */}
      <div>
        <h3 className="text-xl font-black text-foreground">そもそもの「お願いごと」</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          現場のルールはシンプルでした。整理すると、お願いはこうです。
        </p>
        <div className="mt-6">
          <SlideFigure slideKey="request" alt="そもそものお願いごと - 解説スライド" />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            { t: "何を防ぎたい？", d: "同じ曲を短い間隔でくり返しかけてしまう“被り”。" },
            { t: "現場ルールは？", d: "だいたい直近1週間で同じ曲がかかっていなければOK。" },
            { t: "あると嬉しい", d: "「過去にいつ使ったか」も分かると、判断の材料になる。" },
            { t: "どう使う？", d: "放送前に、その日の選曲リスト（Excel）でサッと確認したい。" },
          ].map((x) => (
            <div key={x.t} className="rounded-2xl border border-border bg-card p-5">
              <p className="font-black text-foreground">{x.t}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{x.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 用語メモ集 */}
      <div>
        <h3 className="text-xl font-black text-foreground">先に、よく出る5つの言葉だけ</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          このあと何度も出てくる言葉を、先にやさしく押さえておきましょう。ここさえ分かれば、仕組みの話がぐっと読みやすくなります。
        </p>
        <div className="mt-6">
          <SlideFigure slideKey="terms" alt="よく出る言葉 - 解説スライド" />
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

      {/* 道具の中身（4つの部品） */}
      <div>
        <h3 className="text-xl font-black text-foreground">この道具は「4つの部品」でできている</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          1つのAIに全部やらせるのではなく、役割の違う部品を組み合わせています。人間の職場と同じで、得意なことに専念させたほうが良い結果が出るからです。
        </p>
        <div className="mt-6">
          <SlideFigure slideKey="parts" alt="4つの部品 - 解説スライド" />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
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

      {/* 全体の流れ（5ステップ） */}
      <div>
        <h3 className="text-xl font-black text-foreground">全体の流れ：5つのステップ</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          放送前にツールを開いてから、結果が出るまで。裏側ではこの5ステップが上から順に動いています。それぞれ「何をして」「なぜ必要か」を見てみましょう。
        </p>
        <div className="mt-6">
          <SlideFigure slideKey="steps" alt="全体の流れは5ステップ - 解説スライド" />
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

      {/* 3段マッチングの深掘り */}
      <div className="rounded-3xl border border-fm-blue/20 bg-fm-blue/5 p-6 sm:p-8">
        <h3 className="text-xl font-black text-foreground">このツールの心臓部：なぜ「3段構え」で照合するのか</h3>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          曲名の書き方は本当にバラバラです。「Ｔｒｉｃｋｙ」と「Tricky」、「サカナクション」と「sakanaction」、
          「Official髭男dism」と「OFFICIAL HIGE DANDISM」。単純な文字くらべだけでは、同じ曲を“別の曲”と見なして被りを見逃します。
          そこで、<strong className="text-foreground">かんたんで速い方法から、賢いけれど手間のかかる方法へ、だんだん切り替える</strong>3段構えにしました。
        </p>
        <div className="mt-6 space-y-4">
          {matchStages.map((stage) => (
            <div key={stage.no} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="rounded-lg px-3 py-1 text-xs font-black tracking-wider text-white"
                  style={{ backgroundColor: stage.color }}
                >
                  {stage.no}
                </span>
                <h4 className="text-base font-black text-foreground">{stage.title}</h4>
                <span className="ml-auto text-xs font-bold text-muted-foreground">{stage.tech}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{stage.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-fm-orange/20 bg-fm-orange/5 p-5">
          <p className="text-sm font-black text-fm-orange">なぜ全部をAIにやらせないの？</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            AIは賢いですが、呼び出すたびに時間もお金もかかります。大半の曲は速くて無料の「完全一致」で判定できるのに、
            全部AIに回すのは無駄。<strong className="text-foreground">かんたんな方法で片づく曲はさっさと片づけ、本当に難しい曲だけAIに回す。</strong>
            この“適材適所”が、速さと正確さと安さを両立させるコツです。
          </p>
        </div>
      </div>

      {/* 判定の見方 */}
      <div>
        <h3 className="text-xl font-black text-foreground">結果はこう出る：5つのしるし</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          照合が終わると、曲ごとに次のしるしが付きます。ひと目で「どう対応すべきか」が分かるようにしています。
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            { mark: "🔴", t: "直近被り", d: "決めた期間（初期は直近7日）以内にかかっている。差し替えを検討。いつかけたかの日付も出ます。", c: "#E53935" },
            { mark: "🟡", t: "使用歴あり", d: "過去にかけたことはあるが、直近ではない。基本はそのままでOK。過去の使用日は判断材料に。", c: "#F7931E" },
            { mark: "🟢", t: "使用歴なし", d: "倉庫の中に記録がない。OK（ただしNOAに載らない曲もある点は前提として）。", c: "#8DC63F" },
            { mark: "⚠️", t: "要確認", d: "表記ちがいの“似た曲”が見つかった。同じ曲かどうかを人が最終確認する。", c: "#00AEEF" },
          ].map((x) => (
            <div key={x.t} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
              <span className="text-2xl leading-none">{x.mark}</span>
              <div>
                <p className="font-black" style={{ color: x.c }}>{x.t}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{x.d}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          このほか、曲名が書かれていない「リクエスト対応」などの枠は
          <strong className="text-foreground">➖ 抽出対象外</strong>として、照合できないことを正直に表示します。
          そして結果の上には必ず<strong className="text-foreground">「倉庫は◯月◯日分まで」</strong>という鮮度が出ます。
        </p>
      </div>

      {/* システム全体の地図（アーキテクチャ） */}
      <div>
        <h3 className="text-xl font-black text-foreground">システムの地図：どこで動いて、データはどこにあるか</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          このツールは「操作画面」「履歴の倉庫」「情報の取り込み口」の3つが、それぞれ別の場所で連携して動いています。
          少し技術的ですが、<strong className="text-foreground">“アプリ”と“データ”を分けて置く</strong>という考え方は、
          いろんなツールに共通する大事な設計です。
        </p>
        <div className="mt-6">
          <SlideFigure slideKey="architecture" alt="システムの地図 - 解説スライド" />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {archNodes.map((node) => (
            <div key={node.name} className="relative overflow-hidden rounded-2xl border border-border bg-card p-5">
              <div className="absolute left-0 top-0 h-1 w-full" style={{ backgroundColor: node.color }} />
              <p className="text-xs font-bold text-muted-foreground">{node.where}</p>
              <p className="mt-1 text-base font-black text-foreground">{node.name}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{node.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl border border-fm-blue/20 bg-fm-blue/5 p-5">
          <p className="text-sm font-black text-fm-blue">「アプリ」と「データ」を分けると、何がうれしい？</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            もしデータをアプリの中に閉じ込めると、担当者のPCでしか使えず、そのPCを閉じたら止まってしまいます。
            データを別の倉庫（クラウド）に置くことで、<strong className="text-foreground">誰がどこから開いても同じ最新データが見られ、24時間いつでも使える</strong>ようになります。
            今回のツールは、担当者は配られたURLを開くだけ。準備もインストールもいりません。
          </p>
        </div>
      </div>

      {/* 設計ルール */}
      <div>
        <h3 className="text-xl font-black text-foreground">作る前に決めた6つのルール（＝要件定義のキモ）</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          AIやプログラムは、指示したとおりにしか動きません。逆にいえば
          <strong className="text-foreground">「どんなルールで作るか」がこのツールの良し悪しを決めます。</strong>
          現場のことを考えて実際に決めた、大事なルールを6つ紹介します。
        </p>
        <div className="mt-6">
          <SlideFigure slideKey="rules" alt="作る前に決めた6つのルール - 解説スライド" />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {rules.map((rule, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-fm-blue text-xs font-black text-white">
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
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-fm-blue/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-fm-orange/20 blur-3xl" />
        <h3 className="relative text-xl font-black sm:text-2xl">うっかりの確認は機械に。最後の選曲は人間に。</h3>
        <p className="relative mt-4 max-w-3xl leading-relaxed text-white/80">
          第3回のツールがやっているのは、あくまで<strong className="text-white">「被っていないかの“確認作業”」</strong>です。
          11年分・64万曲の履歴と一瞬で照らし合わせ、人の記憶では追いきれない“うっかり被り”を拾い上げます。
          そして<strong className="text-white">「この曲でいく」という最後の判断は、必ず人間が行う</strong>。
          AIは仕事を奪う道具ではなく、人がミスなく、本当に大切な判断に集中するための“相棒”です。第1回・第2回と、根っこは同じ考え方なんです。
        </p>
        <div className="relative mt-6">
          <SlideFigure slideKey="summary" alt="確認は機械、選曲は人間 - 解説スライド" />
        </div>
        <div className="relative mt-6">
          <ToolButton onDark />
        </div>
        <p className="relative mt-4 max-w-3xl text-sm leading-relaxed text-white/60">
          ※ この仕組みは、実際に動くオンエア楽曲 重複チェックツール（Python + Streamlit + Supabase 製）として作られています。
        </p>
      </div>
    </div>
  );
}
