import { createClient } from "@/lib/supabase/server";
import { StudioSidebar } from "@/components/studio/StudioSidebar";
import { StudioHeader } from "@/components/studio/StudioHeader";

export const metadata = {
  title: "Studio | FM OSAKA AI LAB",
  description: "FM OSAKA AI LAB 管理画面",
};

export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <StudioSidebar email={user?.email} />
      <div className="ml-64 flex min-h-screen flex-col">
        <StudioHeader />
        <main className="flex-1 p-8 text-gray-900">{children}</main>
      </div>
    </div>
  );
}
