"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/admin", label: "INICIO" },
  { href: "/admin/pedidos", label: "PEDIDOS" },
  { href: "/admin/reservas", label: "RESERVAS" },
  { href: "/admin/clientes", label: "CLIENTES" },
  { href: "/admin/menu", label: "MENÚ" },
  { href: "/admin/contenido", label: "CONTENIDO" },
  { href: "/admin/configuracion", label: "CONFIGURACIÓN" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [demo, setDemo] = useState(false);

  useEffect(() => { setDemo(localStorage.getItem("andariegos-demo") === "1"); }, []);

  function toggleDemo() {
    const next = !demo;
    setDemo(next);
    if (next) localStorage.setItem("andariegos-demo","1"); else localStorage.removeItem("andariegos-demo");
    router.push(next ? "/admin?demo=1" : "/admin");
  }

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <header className="admin-nav">
      <div className="admin-nav-inner">
        <Link href="/admin" className="admin-nav-brand">
          <img
            src="/images/logo-andariegos.png"
            alt="Andariegos"
            className="admin-nav-logo"
          />

          <span className="admin-nav-brand-copy">
            <strong>ANDARIEGOS</strong>
            <small>ESCRITORIO</small>
          </span>
        </Link>

        <nav
          className="admin-nav-links"
          aria-label="Navegación administrativa"
        >
          {links.map((link) => {
            const isCurrent =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={isCurrent ? "current" : ""}
                aria-current={isCurrent ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="admin-nav-actions">{demo && <span className="admin-demo-pill">MODO DEMO · PRUEBA</span>}<button type="button" className="admin-demo-toggle" onClick={toggleDemo}>{demo ? "SALIR DEL MODO DEMO" : "MODO DEMO"}</button>
          <Link href="/" className="admin-nav-public">
            VER WEB ↗
          </Link>

          <button
            type="button"
            className="admin-nav-logout"
            onClick={handleLogout}
          >
            SALIR
          </button>
        </div>
      </div>
    </header>
  );
}