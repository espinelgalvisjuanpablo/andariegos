import { ReactNode } from "react";
import { LanguageProvider } from "./language-provider";
import { ThemeProvider } from "./theme-provider";
import { CartProvider } from "./cart-provider";
import { SiteNav } from "./site-nav";
import { SiteFooter } from "./site-footer";
export function AppShell({children}:{children:ReactNode}){
  return <LanguageProvider><ThemeProvider><CartProvider><SiteNav/><div className="page-content">{children}</div><SiteFooter/></CartProvider></ThemeProvider></LanguageProvider>;
}
