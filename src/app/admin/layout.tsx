import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/auth/signin");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      {/* pt-14 on mobile for the fixed header bar, lg:pt-0 for desktop */}
      <main className="flex-1 pt-14 lg:pt-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
