"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "./language-provider";
import { useTheme } from "./theme-provider";
import { useCart } from "./cart-provider";

export function SiteNav(){
  const [open,setOpen]=useState(true);
  const pathname=usePathname();
  const {lang,toggle:toggleLang}=useLanguage();
  const {theme,toggle:toggleTheme}=useTheme();
  const {count}=useCart();

  const links=lang==="ES"
    ? [["/menu","MENÚ"],["/simijaca","SIMIJACÁ"],["/cuenta","MI CUENTA"]]
    : [["/menu","MENU"],["/simijaca","SIMIJACÁ"],["/cuenta","MY ACCOUNT"]];

  const goTop=()=>window.scrollTo({top:0,behavior:"smooth"});

  return <header className={`site-header ${open?"is-open":""}`}>
    <div className="nav-shell">
      <button className="brand-button" onClick={()=>setOpen(v=>!v)} aria-label={open?"Cerrar navegación":"Abrir navegación"} aria-expanded={open}>
        <img src="/images/logo-andariegos.png" alt="Andariegos Cocina de Mundo"/>
      </button>

      <div className={`nav-drawer ${open?"open":""}`}>
        <div className="nav-stroke stroke-top" aria-hidden="true"/>
        <nav className="main-nav" aria-label="Navegación principal">
          <Link href="/" className={pathname==="/"?"current":""} onClick={goTop}>ANDARIEGOS</Link>
          {links.map(([href,label])=><Link key={href} href={href} className={pathname===href?"current":""} onClick={goTop}>{label}</Link>)}
        </nav>
        <div className="nav-stroke stroke-bottom" aria-hidden="true"/>
      </div>

      <div className="nav-controls">
        <button className="lang-control" onClick={toggleLang} aria-label="Cambiar idioma"><span className={lang==="ES"?"active":""}>ES</span><i>/</i><span className={lang==="EN"?"active":""}>EN</span></button>
        <button className="theme-control" onClick={toggleTheme} aria-label="Cambiar entre Hoja y Madera"><span className={theme==="light"?"active":""}>🍃</span><span className={theme==="dark"?"active":""}>🪵</span></button>
        <Link className="cart-control" href="/checkout" onClick={goTop} aria-label={lang==="ES"?"Abrir carrito":"Open cart"}><span>🛒</span><b>{count}</b></Link>
      </div>
    </div>
  </header>;
}
