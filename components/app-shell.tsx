"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { LanguageProvider } from "./language-provider";
import { ThemeProvider } from "./theme-provider";
import { CartProvider } from "./cart-provider";
import { SiteNav } from "./site-nav";
import { SiteFooter } from "./site-footer";
import { AdminNav } from "./admin-nav";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");
  const isAdminLogin = pathname === "/admin/login";

  if (isAdmin) {
    return (
      <div className="admin-shell">
        {!isAdminLogin && <AdminNav />}

        <main className="admin-page-content">
          {children}
        </main>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <ThemeProvider>
        <CartProvider>
          <SiteNav />

          <div className="page-content">
            {children}
          </div>

          <SiteFooter />
        </CartProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}