import Image from "next/image";
import { cn } from "@/lib/utils";

// 解説スライド（live-lectures のスライド生成パイプラインで作成し、microCMS に格納）
const SLIDE_URLS = {
  title: "https://images.microcms-assets.io/assets/c8b8e61e61564493aacf4db57409a73b/a082d51b40094024ac337df0610b2a92/ep01-req-slide-001.png",
  requirements: "https://images.microcms-assets.io/assets/c8b8e61e61564493aacf4db57409a73b/9c24efb585d247018e3ecd3348c28d5c/ep01-req-slide-002.png",
  aiTeam: "https://images.microcms-assets.io/assets/c8b8e61e61564493aacf4db57409a73b/6157719d38524d09948f4859c97ab27e/ep01-req-slide-003.png",
  steps: "https://images.microcms-assets.io/assets/c8b8e61e61564493aacf4db57409a73b/5dcb801a2a514d199057ba31d68b3475/ep01-req-slide-004.png",
  transcribe: "https://images.microcms-assets.io/assets/c8b8e61e61564493aacf4db57409a73b/bbfacac7dfd541e8a17a9b03373a7128/ep01-req-slide-005.png",
  rewrite: "https://images.microcms-assets.io/assets/c8b8e61e61564493aacf4db57409a73b/13f483019efd4eb1a16443487777ea01/ep01-req-slide-006.png",
  images: "https://images.microcms-assets.io/assets/c8b8e61e61564493aacf4db57409a73b/3c606f93ab2c48218aa2160bfcae5988/ep01-req-slide-007.png",
  rules: "https://images.microcms-assets.io/assets/c8b8e61e61564493aacf4db57409a73b/bc4c3e29f1bb4878bcf8956685e039e2/ep01-req-slide-008.png",
  summary: "https://images.microcms-assets.io/assets/c8b8e61e61564493aacf4db57409a73b/3f0f59d24f9e4891ab4602a989afa4fe/ep01-req-slide-009.png",
};

function SlideFigure({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-border shadow-xl">
      <Image src={src} alt={alt} width={1536} height={1024} className="h-auto w-full" />
    </figure>
  );
}

/* ────────────────────────────────────────────────────────────────
   EP01: 記事作成機能の要件定義を、非エンジニア・AI初学者向けに
   超丁寧に解説するハードコードのコンテンツ。
   ─────────────────────────────────────────────────────────────── */

interface StepItem {
  no: string;
  title: string;
  ai: string;
  color: string;
  what: string;
  why: string;
  slide?: string;
}

const steps: StepItem[] = [
  {
    no: "STEP 1",
    title: "音声ファイルをアップロード",
    ai: "AIは使いません",
    color: "#E91E8C",
    what: "放送済みのラジオ音声（MP3などのファイル）を、管理画面にドラッグ＆ドロップで入れます。",
    why: "すべての出発点は「放送そのもの」。特別な準備は何もいらず、放送で使った音声ファイルをそのまま使えるようにしています。",
  },
  {
    no: "STEP 2",
    title: "文字起こし（音声 → テキスト）",
    ai: "Whisper（ウィスパー）",
    color: "#F7931E",
    slide: SLIDE_URLS.transcribe,
    what: "AIが音声を聞いて、話した内容をぜんぶ文章にします。13分の放送なら1〜2分ほどで完了します。",
    why: "次のステップの「記事を書くAI」は音声を直接聞けません。だから最初に、音声を『AIが読める文章』に変換しておく必要があるんです。人間の耳の役割ですね。",
  },
  {
    no: "STEP 3",
    title: "ブログ記事に書き直す",
    ai: "DeepSeek（ディープシーク）",
    color: "#00AEEF",
    slide: SLIDE_URLS.rewrite,
    what: "文字起こしされた会話文を、AIが読みやすいブログ記事に書き直します。タイトル・リード文・見出し付きの本文が一度に作られます。",
    why: "ラジオの会話をそのまま文章にすると「えー」「そうですね」だらけで読みにくい。会話の内容を整理して、Webで読みやすい記事に再構成するのがこのステップです。",
  },
  {
    no: "STEP 4",
    title: "画像を生成（4枚）",
    ai: "gpt-image-2（OpenAIの画像生成AI）",
    color: "#8DC63F",
    slide: SLIDE_URLS.images,
    what: "記事の内容に合わせて、サムネイル1枚＋本文用の写真風画像3枚をAIが描きます。できた画像は自動でサーバーに保存されます。",
    why: "文字だけの記事より、画像がある記事のほうが圧倒的に読まれます。記事のキーワード（例：バインミー、ピックルボール）から「どんな画像を描くか」の指示文を自動で組み立てています。",
  },
  {
    no: "STEP 5",
    title: "プレビューで確認・編集",
    ai: "人間の出番です",
    color: "#E91E8C",
    what: "完成イメージそのままの画面で記事を確認。気になる部分はその場でクリックして直接書き直せます。",
    why: "AIの文章は「下書き」。最後に人間の目でチェックして、表現を整えてから世に出す。これがこの企画の大事なルールです。",
  },
  {
    no: "STEP 6",
    title: "保存・公開",
    ai: "AIは使いません",
    color: "#F7931E",
    what: "「下書き保存」か「公開する」を選ぶだけ。公開すると、このサイトのブログに記事がすぐ表示されます。",
    why: "放送が終わってから数分後には記事が公開できる。「放送のあとに、もっと多くの人へ」を実現する仕上げのステップです。",
  },
];

const rules = [
  {
    title: "人の名前は記事に載せない",
    body: "文字起こしAIは人名をよく聞き間違えます（実験では「イドバタ」が「井戸畑」になりました）。間違った名前を公開してしまう事故を防ぐため、「人名は記事に含めない」というルールをAIに最初から指示しています。出演者は「リポーターさん」のような呼び方に自動で置き換わります。",
  },
  {
    title: "番組の固有名詞リストをAIに渡しておく",
    body: "「iDoBuddy」「イドバタニュース」など、番組に関する正しい表記をあらかじめAIに教えています。文字起こしで多少間違っていても、記事にするときにAIが正しい表記へ直してくれます。",
  },
  {
    title: "記事は1500文字以上・見出し5つ以上",
    body: "「長く書いて」とだけ頼むとAIは短く済ませがちです。「1500文字以上」「見出しを5つ以上」「各セクション300文字以上」と具体的な数字で指示することで、読みごたえのある記事が安定して作られます。",
  },
  {
    title: "画像を入れる場所はAIが文脈で判断",
    body: "食べ物の写真はグルメの話の近くに、スポーツの写真はスポーツの話の近くに。それぞれの画像が「何の画像か」という説明文をAIに読ませて、記事のどの段落の後に置くべきかを判断させています。",
  },
  {
    title: "ラジオ番組らしい語り口で書く",
    body: "「〜である」のような堅い文章ではなく、「〜なんです」「〜ですよね」とリスナーに語りかける文体を指定。放送の楽しい空気感がそのまま記事に残るようにしています。",
  },
  {
    title: "画像は1枚ずつ順番に作る",
    body: "4枚の画像を同時に作らせると、AIのサーバーに負荷がかかって失敗しやすくなります。1枚できたら次の1枚、と順番に作ることで安定して動くようにしています。",
  },
];

const aiTeam = [
  {
    name: "Whisper",
    role: "耳の担当",
    company: "OpenAI",
    color: "#F7931E",
    desc: "音声を聞いて文章にする「文字起こし」専門のAI。日本語の聞き取りがとても得意です。",
  },
  {
    name: "DeepSeek",
    role: "書き手の担当",
    company: "DeepSeek",
    color: "#00AEEF",
    desc: "文章を書くのが得意なAI。会話の内容を整理してブログ記事に再構成します。文章生成のコストが安いのも採用理由です。",
  },
  {
    name: "gpt-image-2",
    role: "絵描きの担当",
    company: "OpenAI",
    color: "#8DC63F",
    desc: "文章で指示すると画像を描いてくれるAI。サムネイルや本文の写真風画像を担当します。",
  },
];

export function Episode01Requirements() {
  return (
    <div className="space-y-10">
      {/* イントロ */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-fm-pink/10 blur-3xl" />
        <p className="text-xs font-black tracking-[0.3em] text-fm-pink">HOW IT WORKS</p>
        <h2 className="mt-3 text-2xl font-black text-foreground sm:text-3xl">
          「音声を入れると記事ができる」仕組みを、ぜんぶ解説します
        </h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          このページで紹介している「番組音声からブログ記事を自動化」は、実際にこのサイトの管理画面で動いている本物の機能です。
          放送済みの音声ファイルを入れるだけで、文字起こし → 記事作成 → 画像生成 → 公開までが一つの流れで完了します。
          ここでは、AIにくわしくない方でもわかるように、その仕組みと「作る前に決めたルール（要件定義）」を丁寧に説明します。
        </p>
        <div className="mt-8">
          <SlideFigure src={SLIDE_URLS.title} alt="番組音声からブログ記事を自動化 - 解説スライド" />
        </div>
        <div className="mt-6 rounded-2xl border border-fm-blue/20 bg-fm-blue/5 p-5">
          <p className="text-sm font-black text-fm-blue">用語メモ：「要件定義」とは？</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            何かを作る前に「何ができればOKか」「どんなルールで動くべきか」を決めておくこと。
            料理でいうレシピ決めです。AIに仕事を任せるときは、この「事前の取り決め」の質が結果の質をそのまま決めます。
          </p>
        </div>
        <div className="mt-6">
          <SlideFigure src={SLIDE_URLS.requirements} alt="要件定義とは、作る前の取り決め - 解説スライド" />
        </div>
      </div>

      {/* AIチーム紹介 */}
      <div>
        <h3 className="text-xl font-black text-foreground">登場するAIは3人チーム</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          この機能では、1つのAIに全部を任せるのではなく、得意分野の違う3つのAIで分業しています。
          人間の職場と同じで、それぞれの得意なことに専念させたほうが、良い結果が出るからです。
        </p>
        <div className="mt-6">
          <SlideFigure src={SLIDE_URLS.aiTeam} alt="登場するAIは3人チーム - 解説スライド" />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {aiTeam.map((ai) => (
            <div
              key={ai.name}
              className="relative overflow-hidden rounded-2xl border border-border bg-card p-5"
            >
              <div
                className="absolute left-0 top-0 h-1 w-full"
                style={{ backgroundColor: ai.color }}
              />
              <p className="text-xs font-bold text-muted-foreground">{ai.company}</p>
              <p className="mt-1 text-lg font-black text-foreground">{ai.name}</p>
              <p className="mt-0.5 text-xs font-black" style={{ color: ai.color }}>
                {ai.role}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{ai.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 6ステップ */}
      <div>
        <h3 className="text-xl font-black text-foreground">全体の流れ：6つのステップ</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          管理画面の操作は、この6ステップを上から順に進むだけです。
          それぞれのステップで「何をしているのか」「なぜそれが必要なのか」まで見てみましょう。
        </p>
        <div className="mt-6">
          <SlideFigure src={SLIDE_URLS.steps} alt="全体の流れは6ステップ - 解説スライド" />
        </div>
        <div className="mt-6 space-y-4">
          {steps.map((step, i) => (
            <div
              key={step.no}
              className="relative overflow-hidden rounded-2xl border border-border bg-card p-6"
            >
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
                    step.ai.includes("使いません") || step.ai.includes("人間")
                      ? "border-border text-muted-foreground"
                      : "border-transparent text-white"
                  )}
                  style={
                    step.ai.includes("使いません") || step.ai.includes("人間")
                      ? undefined
                      : { backgroundColor: step.color }
                  }
                >
                  {step.ai}
                </span>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-foreground/[0.03] p-4">
                  <p className="text-xs font-black tracking-wider text-muted-foreground">
                    なにをする？
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/90">{step.what}</p>
                </div>
                <div className="rounded-xl bg-foreground/[0.03] p-4">
                  <p className="text-xs font-black tracking-wider text-muted-foreground">
                    なぜ必要？
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/90">{step.why}</p>
                </div>
              </div>
              {step.slide && (
                <div className="mt-4">
                  <SlideFigure src={step.slide} alt={step.title + " - 解説スライド"} />
                </div>
              )}
              {i < steps.length - 1 && (
                <div className="pointer-events-none absolute -bottom-[9px] left-1/2 z-10 h-4 w-4 -translate-x-1/2 rotate-45 border-b border-r border-border bg-card" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 要件定義で決めたルール */}
      <div>
        <h3 className="text-xl font-black text-foreground">
          作る前に決めた6つのルール（＝要件定義のキモ）
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          AIは指示したとおりにしか動きません。逆にいうと、
          <strong className="text-foreground">「事前にどんなルールを渡しておくか」がこの機能の品質を決めています。</strong>
          実際の開発で決めたルールを6つ紹介します。
        </p>
        <div className="mt-6">
          <SlideFigure src={SLIDE_URLS.rules} alt="作る前に決めた6つのルール - 解説スライド" />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {rules.map((rule, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-fm-pink text-xs font-black text-white">
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
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-fm-pink/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-fm-blue/20 blur-3xl" />
        <h3 className="relative text-xl font-black sm:text-2xl">
          AIが下書きし、人間が仕上げる。
        </h3>
        <p className="relative mt-4 max-w-3xl leading-relaxed text-white/80">
          この機能のいちばん大事な設計思想は「AIに全部任せない」ことです。
          文字起こし・記事の下書き・画像づくりといった時間のかかる作業はAIが数分で終わらせ、
          最後の確認と仕上げは必ず人間が行う。
          放送後すぐに、番組の空気感そのままの記事を届けられるのは、この役割分担があるからです。
        </p>
        <div className="relative mt-6">
          <SlideFigure src={SLIDE_URLS.summary} alt="AIが下書きし、人間が仕上げる - 解説スライド" />
        </div>
        <p className="relative mt-4 max-w-3xl text-sm leading-relaxed text-white/60">
          ※ この仕組みはすべて、実際にこのサイトの管理画面（Studio）で動いています。下のブログ記事は、実際にこの機能で作られたものです。
        </p>
      </div>
    </div>
  );
}
