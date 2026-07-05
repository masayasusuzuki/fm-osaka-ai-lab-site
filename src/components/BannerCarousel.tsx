"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Banner } from "@/types";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface BannerCarouselProps {
  banners: Banner[];
}

export function BannerCarousel({ banners }: BannerCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  useEffect(() => {
    if (!api) return;

    const timer = setInterval(() => {
      scrollNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [api, scrollNext]);

  return (
    <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
      <CarouselContent>
        {banners.map((banner) => (
          <CarouselItem key={banner.id}>
            <Link
              href={banner.linkUrl}
              target={banner.linkUrl.startsWith("http") ? "_blank" : undefined}
              rel={
                banner.linkUrl.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
              className="block overflow-hidden rounded-2xl"
            >
              <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl bg-muted">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 1024px"
                  priority
                />
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 hidden border-border bg-background/90 sm:flex" />
      <CarouselNext className="right-2 hidden border-border bg-background/90 sm:flex" />
    </Carousel>
  );
}
