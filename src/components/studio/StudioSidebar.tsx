"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Settings,
  LogOut,
  Radio,
} from "lucide-react";

const navItems = [
  { href: "/studio/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/studio/new", label: "New Article", icon: PlusCircle },
  { href: "/studio/articles", label: "Articles", icon: FileText },
  { href: "/studio/settings", label: "Settings", icon: Settings },
];

export function StudioSidebar({ email }: { email?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/studio/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-fm-pink/10">
          <Radio className="h-5 w-5 text-fm-pink" />
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-black tracking-[0.25em] text-fm-pink">
            FM OSAKA
          </span>
          <span className="text-sm font-black tracking-[0.1em] text-gray-900">
            AI LAB
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6">
        <div className="mb-4 px-3 text-[10px] font-black tracking-[0.15em] text-gray-400">
          WORKSPACE
        </div>
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold tracking-wide transition-all",
                  active
                    ? "bg-fm-pink/10 text-fm-pink"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "text-fm-pink" : "text-gray-400 group-hover:text-gray-600")} />
                {item.label}
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-fm-pink" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User */}
      <div className="border-t border-gray-200 p-4">
        <div className="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
          <p className="text-[10px] font-bold tracking-wider text-gray-400">
            SIGNED IN
          </p>
          <p className="mt-1 truncate text-xs font-medium text-gray-700">
            {email || "studio@fmosaka.ai"}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-black tracking-wider text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
        >
          <LogOut className="h-4 w-4" />
          SIGN OUT
        </button>
      </div>
    </aside>
  );
}
