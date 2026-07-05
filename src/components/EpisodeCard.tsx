"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Episode } from "@/types";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

const accentMeta: Record<
  Episode["accentColor"],
  { color: string; bg: string; glow: string }
> = {
  pink: { color: "#E91E8C", bg: "bg-fm-pink", glow: "shadow-fm-pink/25" },
  orange: { color: "#F7931E", bg: "bg-fm-orange", glow: "shadow-fm-orange/25" },
  blue: { color: "#00AEEF", bg: "bg-fm-blue", glow: "shadow-fm-blue/25" },
  green: { color: "#8DC63F", bg: "bg-fm-green", glow: "shadow-fm-green/25" },
};

interface EpisodeCardProps {
  episode: Episode;
}

export function EpisodeCard({ episode }: EpisodeCardProps) {
  const accent = accentMeta[episode.accentColor];

  return (
    <Link href={`/episodes/${episode.slug}`} className="group block">
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-white/10 bg-[#111] transition-all duration-500",
          "hover:-translate-y-2 hover:border-white/20 hover:shadow-2xl",
          accent.glow
        )}
      >
        {/* Animated top accent line */}
        <div
          className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
          style={{ backgroundColor: accent.color }}
        />

        <div className="relative aspect-video overflow-hidden">
          <Image
            src={episode.thumbnail}
            alt={episode.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* Big episode number */}
          <span className="absolute -left-1 -top-3 text-6xl font-black text-white/[0.07] sm:text-7xl">
            {String(episode.episodeNumber).padStart(2, "0")}
          </span>

          {/* Hover play button */}
          <div className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 group-hover:rotate-45">
            <ArrowUpRight className="h-5 w-5 text-white" />
          </div>

          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <Badge
              className={cn(
                "border-0 text-xs font-black text-white",
                accent.bg
              )}
            >
              EP{String(episode.episodeNumber).padStart(2, "0")}
            </Badge>
            <p className="mt-2 text-[10px] font-bold tracking-wider text-white/60">
              {episode.theme}
            </p>
            <h3 className="mt-1 text-base font-black leading-tight text-white transition-colors group-hover:text-white/90">
              {episode.title}
            </h3>
          </div>
        </div>

        {/* Description strip */}
        <div className="border-t border-white/10 p-4">
          <p className="line-clamp-2 text-xs leading-relaxed text-white/50">
            {episode.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
