import { headers } from "next/headers";
import { requireAdmin } from "@/lib/admin-auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = { title: "Admin — ISTIC Vote" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = headers().get("x-pathname") ?? "";

  if (!pathname.startsWith("/admin/login")) requireAdmin();
  if (pathname.startsWith("/admin/login")) return <>{children}</>;

  return (
    <div style={{ display: "flex", minHeight: "100dvh", background: "#F4F3F0", fontFamily: "var(--font-body)" }}>
      <AdminSidebar />
      {/* marginLeft géré via media query inline — 220px desktop, 0 mobile */}
      <main id="admin-main" style={{ flex: 1, padding: "32px 36px", minHeight: "100dvh", overflowX: "hidden", marginLeft: 220 }}>
        <style>{`
          @media (max-width: 767px) {
            #admin-main { margin-left: 0 !important; padding: 68px 16px 32px !important; }
          }
        `}</style>
        {children}
      </main>
    </div>
  );
}
