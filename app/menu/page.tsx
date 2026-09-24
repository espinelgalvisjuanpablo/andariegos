"use client";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Image from "next/image";
import { products,categories,formatCOP } from "@/lib/menu-data";
import { useCart } from "@/components/cart-provider";
import { useLanguage } from "@/components/language-provider";
const MenuIcon=({type}:{type:"cart"|"search"|"carrot"})=>{const common={viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round"};const art=type==="cart"?<><path d="M3 4h2l2 11h10l3-8H7"/><circle cx="9" cy="19" r="1.3"/><circle cx="18" cy="19" r="1.3"/></>:type==="search"?<><circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 5 5"/></>:<><path d="M7 5c4-3 9-2 11 1l-6 14-7-5Z"/><path d="M9 4C6 2 5 1 5 0M13 5c0-3 2-4 4-5M16 6c2-2 4-2 6-1"/></>;return <svg {...common} aria-hidden="true">{art}</svg>;};

const categoryImages:Record<string,string>={
  "Entradas":"/images/plato-premio.jpeg",
  "Hamburguesas":"/images/hamburguesa-hongos.jpeg",
  "Postres de autor":"/images/postre-01.jpeg"
};

export default function MenuPage(){
  const [query,setQuery]=useState(""); const [scrollProgress,setScrollProgress]=useState(0);
  const {cart,add,remove,count}=useCart(); const {lang}=useLanguage(); const en=lang==="EN";
  useEffect(()=>{const onScroll=()=>setScrollProgress(Math.min(1,window.scrollY/900));window.addEventListener("scroll",onScroll,{passive:true});return()=>window.removeEventListener("scroll",onScroll)},[]);
  const filtered=useMemo(()=>{const q=query.trim().toLowerCase();return q?products.filter(p=>`${p.name} ${p.description} ${p.ingredients} ${p.category}`.toLowerCase().includes(q)):products},[query]);
  return <main className="menu-page">
    <section className="menu-intro">
      <div className="menu-ingredient-rail" aria-hidden="true">
        <span className="carrot-whole" aria-hidden="true"><MenuIcon type="carrot"/></span><span className="carrot-slice slice-one" aria-hidden="true"/><span className="carrot-slice slice-two" aria-hidden="true"/><span className="carrot-slice slice-three" aria-hidden="true"/>
      </div>
      <p className="eyebrow">ANDARIEGOS · COCINA DE MUNDO</p><h1>{en?"Menu":"Menú"}</h1>
      <p>{en?"Search by dish or ingredient. Add what you like and keep moving.":"Busca por plato o ingrediente. Agrega lo que te guste y sigue."}</p>
      <div className="menu-tools"><label className="search-field"><span className="search-icon" aria-hidden="true"><MenuIcon type="search"/></span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={en?"Search dish or ingredient...":"Buscar plato o ingrediente..."}/></label><a className="cart-summary-link" href="/checkout"><span className="menu-cart-icon" aria-hidden="true"><MenuIcon type="cart"/></span><b>{count}</b><small>{en?"YOUR CART":"TU CARRITO"}</small></a></div>
    </section>
    {categories.map(category=>{const items=filtered.filter(p=>p.category===category);if(!items.length)return null;const image=categoryImages[category];return <section className="menu-category" key={category}>
      <div className="category-heading"><div><span>{String(categories.indexOf(category)+1).padStart(2,"0")}</span><h2>{category}</h2></div>{image&&<div className="category-image"><Image src={image} alt="" fill sizes="110px"/></div>}<em>{items.length} {en?"dishes":"platos"}</em></div>
      <div className="product-list">{items.map(product=><article className="product-row" key={product.id}>
        <div className="product-info"><div className="product-title-line"><h3>{product.name}</h3><strong>{formatCOP(product.price)}</strong></div><p>{product.description}</p><small>{product.ingredients}</small></div>
        <div className="quantity-control">{cart[product.id]?<><button aria-label="Disminuir" onClick={()=>remove(product.id)}>−</button><b>{cart[product.id]}</b><button aria-label="Aumentar" onClick={()=>add(product.id)}>+</button></>:<button className="add-button" onClick={()=>add(product.id)}>{en?"ADD":"AGREGAR"}</button>}</div>
      </article>)}</div>
    </section>})}
    <div className="menu-scroll-note" style={{"--carrot-progress":scrollProgress} as CSSProperties}><span className="carrot-mini" aria-hidden="true"><MenuIcon type="carrot"/></span><small>{en?"A little kitchen movement as you browse.":"Un pequeño movimiento de cocina mientras recorres la carta."}</small></div>
  </main>;
}
