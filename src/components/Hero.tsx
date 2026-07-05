import Image from "next/image";

export function Hero() {
  return (
    <>
      {/* Desktop */}
      <div className="hidden sm:block">
        <Image
          src="/images/hero-desktop.png"
          alt="FM OSAKA AI LAB - ラジオの現場に、AIという新しい相棒を。"
          width={1920}
          height={819}
          className="h-auto w-full"
          priority
          sizes="(max-width: 1440px) 100vw, 1360px"
        />
      </div>

      {/* Mobile */}
      <div className="block sm:hidden">
        <Image
          src="/images/hero-mobile.png"
          alt="FM OSAKA AI LAB - ラジオの現場に、AIという新しい相棒を。"
          width={941}
          height={1672}
          className="h-auto w-full"
          priority
          sizes="100vw"
        />
      </div>
    </>
  );
}
