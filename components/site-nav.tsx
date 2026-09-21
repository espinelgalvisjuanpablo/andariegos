"use client";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "./language-provider";
import { useTheme } from "./theme-provider";
import { useCart } from "./cart-provider";

export function SiteNav(){
  const [open,setOpen]=useState(false);
  const {lang,toggle:toggleLang}=useLanguage();
  const {theme,toggle:toggleTheme}=useTheme();
  const {count}=useCart();
  const links=lang==="ES"
    ? [["/menu","MENÚ"],["/simijaca","SIMIJACÁ"],["/reservas","RESERVAS"],["/cuenta","MI CUENTA"]]
    : [["/menu","MENU"],["/simijaca","SIMIJACÁ"],["/reservas","RESERVATIONS"],["/cuenta","MY ACCOUNT"]];
  return <header className={`site-header ${open?"is-open":""}`}>
    <div className="nav-shell">
      <button className="brand-button" onClick={()=>setOpen(v=>!v)} aria-label={open?"Cerrar navegación":"Abrir navegación"} aria-expanded={open}>
        <img src="/images/logo-andariegos.png" alt="Andariegos Cocina de Mundo"/>
      </button>
      <div className={`nav-drawer ${open?"open":""}`}>
        <div className="nav-stroke stroke-top"/>
        <nav className="main-nav" aria-label="Navegación principal">
          <Link href="/" onClick={()=>setOpen(false)}>ANDARIEGOS</Link>
          {links.map(([href,label])=><Link key={href} href={href} onClick={()=>setOpen(false)}>{label}</Link>)}
        </nav>
        <div className="nav-stroke stroke-bottom"/>
      </div>
      <div className="nav-controls">
        <button className="lang-control" onClick={toggleLang} aria-label="Cambiar idioma"><span className={lang==="ES"?"active":""}>ES</span><i>/</i><span className={lang==="EN"?"active":""}>EN</span></button>
        <button className="theme-control" onClick={toggleTheme} aria-label="Cambiar entre Hoja y Madera"><span className={theme==="light"?"active":""}>🍃</span><span className={theme==="dark"?"active":""}>🪵</span></button>
        <Link className="cart-control" href="/checkout" aria-label="Abrir carrito"><span>🛒</span><b>{count}</b></Link>
      </div>
    </div>
  </header>;
}
