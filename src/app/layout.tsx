import type { Metadata } from "next";
import { Noto_Sans_JP, Geist_Mono, Archivo_Black } from "next/font/google";
import "./globals.css";

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 見出し・数字用のディスプレイフォント（ターンテーブルUIなど）
const archivoBlack = Archivo_Black({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FM OSAKA AI LAB",
  description:
    "FM大阪（株式会社エフエム大阪）の番組「iDoBuddy」内コーナー「AI Coaching Buddy」の取り組みを紹介するサイト。AIがラジオ制作・リスナー体験をどう変えていくかを発信します。",
  keywords: ["FM大阪", "AI", "ラジオ", "AI Coaching Buddy", "iDoBuddy"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${notoSansJp.variable} ${geistMono.variable} ${archivoBlack.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#030305] font-sans text-white">
        {children}
      </body>
    </html>
  );
}
