"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { LayoutDashboard, Users, CreditCard, Settings, LogOut, Menu, X } from "lucide-react";

const navItems = [
  { href: "/admin",              label: "Dashboard",    icon: LayoutDashboard, exact: true },
  { href: "/admin/candidats",    label: "Candidats",    icon: Users,           exact: false },
  { href: "/admin/transactions", label: "Transactions", icon: CreditCard,      exact: false },
  { href: "/admin/parametres",   label: "Paramètres",   icon: Settings,        exact: false },
];

export default function AdminSidebar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Ferme le menu au changement de route sur mobile
  useEffect(() => { setOpen(false); }, [pathname]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const sidebarContent = (
    <aside style={{
      width: 220,
      background: "#1C0F0A",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      boxShadow: mobile ? "4px 0 40px rgba(0,0,0,.5)" : "4px 0 24px rgba(0,0,0,.25)",
    }}>
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(201,168,130,.12)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 900, color: "white", lineHeight: 1.1 }}>ISTIC Vote</div>
          <div style={{ fontSize: ".6rem", color: "#C9A882", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", marginTop: 3, opacity: .8 }}>Administration</div>
        </div>
        {mobile && (
          <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(201,168,130,.6)", padding: 4 }}>
            <X size={20} />
          </button>
        )}
      </div>

      <nav style={{ flex: 1, padding: "12px 0" }}>
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link key={href} href={href} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "11px 20px",
              color: isActive ? "#F0C040" : "rgba(201,168,130,.75)",
              background: isActive ? "rgba(240,192,64,.08)" : "transparent",
              borderRight: `3px solid ${isActive ? "#F0C040" : "transparent"}`,
              textDecoration: "none", fontSize: ".87rem", fontWeight: isActive ? 700 : 500,
              transition: "all .15s",
            }}>
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(201,168,130,.12)" }}>
        <div style={{ fontSize: ".7rem", color: "rgba(201,168,130,.4)", marginBottom: 10, letterSpacing: ".05em" }}>isticvote.online</div>
        <button onClick={handleLogout} style={{
          background: "none", border: "1px solid rgba(201,168,130,.2)", color: "rgba(201,168,130,.6)",
          borderRadius: "8px", padding: "9px 14px", cursor: "pointer", fontSize: ".82rem", width: "100%",
          fontFamily: "var(--font-body)", transition: "all .15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          <LogOut size={14} /> Déconnexion
        </button>
      </div>
    </aside>
  );

  if (mobile) {
    return (
      <>
        {/* Barre mobile top */}
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 52, background: "#1C0F0A", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", zIndex: 200, boxShadow: "0 2px 12px rgba(0,0,0,.3)" }}>
          <button onClick={() => setOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(201,168,130,.8)", padding: 4 }}>
            <Menu size={22} />
          </button>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 900, color: "white" }}>ISTIC Vote</div>
          <div style={{ width: 30 }} />
        </div>

        {/* Overlay */}
        {open && (
          <>
            <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 300 }} />
            <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: 220, zIndex: 301 }}>
              {sidebarContent}
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <div style={{ position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 100 }}>
      {sidebarContent}
    </div>
  );
}
