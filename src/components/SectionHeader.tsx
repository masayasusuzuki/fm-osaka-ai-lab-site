"use client";

import { ReactNode } from "react";
import { FadeIn } from "@/components/FadeIn";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
  accent?: "pink" | "orange" | "blue" | "green";
  centered?: boolean;
  action?: ReactNode;
  className?: string;
}

const accentClasses = {
  pink: "text-fm-pink bg-fm-pink",
  orange: "text-fm-orange bg-fm-orange",
  blue: "text-fm-blue bg-fm-blue",
  green: "text-fm-green bg-fm-green",
};

export function SectionHeader({
  label,
  title,
  description,
  accent = "pink",
  centered = false,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <FadeIn className={cn(className)}>
      <div
        className={cn(
          "mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
          centered && "text-center"
        )}
      >
        <div className={cn(centered && "mx-auto")}>
          <div
            className={cn(
              "flex items-center gap-3",
              centered && "justify-center"
            )}
          >
            <span
              className={cn(
                "h-px w-6 rounded-full",
                accentClasses[accent].split(" ")[1]
              )}
            />
            <span
              className={cn(
                "text-xs font-black tracking-[0.2em] uppercase",
                accentClasses[accent].split(" ")[0]
              )}
            >
              {label}
            </span>
            <span
              className={cn(
                "h-px w-6 rounded-full",
                accentClasses[accent].split(" ")[1]
              )}
            />
          </div>
          <h2 className="mt-3 text-2xl font-black text-foreground sm:text-4xl">
            {title}
          </h2>
          {description && (
            <p
              className={cn(
                "mt-3 max-w-4xl text-muted-foreground",
                centered && "mx-auto"
              )}
            >
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </FadeIn>
  );
}
