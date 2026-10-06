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

  return (
    <LanguageProvider>
      <ThemeProvider>
        <CartProvider>
          {isAdmin ? <AdminNav /> : <SiteNav />}

          <div className={isAdmin ? "admin-page-content" : "page-content"}>
            {children}
          </div>

          {!isAdmin && <SiteFooter />}
        </CartProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}