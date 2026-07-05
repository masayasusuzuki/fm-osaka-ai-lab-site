"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/studio/dashboard": "Dashboard",
  "/studio/new": "New Article",
  "/studio/articles": "Articles",
  "/studio/settings": "Settings",
};

export function StudioHeader() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "Studio";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/90 px-8 backdrop-blur">
      <div>
        <h1 className="text-lg font-black tracking-wide text-gray-900">{title}</h1>
        <p className="text-[10px] font-bold tracking-wider text-gray-400">
          FM OSAKA AI LAB / Studio
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-64 rounded-full border border-gray-200 bg-gray-50 pl-9 pr-4 text-xs text-gray-900 placeholder:text-gray-400 focus:border-fm-pink/40 focus:outline-none"
          />
        </div>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-fm-pink" />
        </button>
      </div>
    </header>
  );
}
