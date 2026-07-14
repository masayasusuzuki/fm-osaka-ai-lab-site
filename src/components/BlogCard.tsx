"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { BlogPost, Episode } from "@/types";
import { cn } from "@/lib/utils";
import { Calendar, ArrowRight } from "lucide-react";

interface BlogCardProps {
  post: BlogPost;
  episode?: Episode;
  compact?: boolean;
}

export function BlogCard({ post, compact = false }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <Card
        className={cn(
          "overflow-hidden border-border bg-card transition-all duration-500 hover:-translate-y-2 hover:shadow-xl",
          compact && "hover:-translate-y-1"
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden",
            compact ? "aspect-[16/10]" : "aspect-[16/9]"
          )}
        >
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes={
              compact
                ? "(max-width: 768px) 100vw, 33vw"
                : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            }
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div
            className={cn(
              "absolute bottom-3 right-3 flex items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 shadow-lg transition-all duration-500 group-hover:opacity-100 group-hover:rotate-[-45deg]",
              compact ? "h-8 w-8" : "h-10 w-10"
            )}
          >
            <ArrowRight className={cn(compact ? "h-4 w-4" : "h-5 w-5")} />
          </div>
        </div>
        <CardContent className={cn(compact ? "p-4" : "p-5")}>
          <div className={cn("flex items-center gap-2", compact ? "mb-2" : "mb-3")}>
            <time
              className={cn(
                "flex items-center gap-1 text-muted-foreground",
                compact ? "text-[10px]" : "text-xs"
              )}
            >
              <Calendar className={cn(compact ? "h-2.5 w-2.5" : "h-3 w-3")} />
              {post.publishedAt}
            </time>
          </div>
          <h3
            className={cn(
              "font-bold leading-tight text-foreground transition-colors group-hover:text-fm-pink",
              compact ? "text-sm" : "text-base"
            )}
          >
            {post.title}
          </h3>
          <p
            className={cn(
              "line-clamp-2 text-muted-foreground",
              compact ? "mt-1 text-xs" : "mt-2 text-sm"
            )}
          >
            {post.excerpt}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
