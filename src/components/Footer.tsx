import Link from "next/link";
import { ExternalLink, Radio } from "lucide-react";

const externalLinks = [
  { label: "FM大阪公式サイト", href: "https://www.fmosaka.net/" },
  { label: "FM大阪 X", href: "https://x.com/fmosaka" },
  { label: "FM大阪 YouTube", href: "https://www.youtube.com/fmosaka" },
];

export function Footer() {
  return (
    <footer className="relative w-full overflow-hidden border-t border-border bg-card text-foreground">
      <div className="absolute -left-20 top-0 h-40 w-40 rounded-full bg-fm-pink/10 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-40 w-40 rounded-full bg-fm-blue/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <div className="flex items-center gap-2">
              <Radio className="h-6 w-6 text-fm-pink" />
              <p className="text-lg font-black">FM OSAKA AI LAB</p>
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              FM大阪 × INTENTION
              <br />
              ラジオ制作にAIを取り入れた実験的取り組みを発信しています。
            </p>
          </div>

          <div>
            <p className="text-sm font-bold text-foreground">関連リンク</p>
            <ul className="mt-4 space-y-3">
              {externalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-fm-pink"
                  >
                    {link.label}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © 2026 FM大阪（株式会社エフエム大阪）. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Produced by INTENTION
          </p>
        </div>
      </div>
    </footer>
  );
}
