"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { products,categories,formatCOP } from "@/lib/menu-data";
import { useCart } from "@/components/cart-provider";
import { useLanguage } from "@/components/language-provider";

const categoryImages:Record<string,string>={
  "Entradas":"/images/plato-premio.jpeg",
  "Pizzas":"/images/hamburguesa-hongos.jpeg",
  "Hamburguesas":"/images/hamburguesa-hongos.jpeg",
  "Arepas":"/images/plato-premio.jpeg",
  "Mazorcada":"/images/huerta.jpeg",
  "Cocina del Mundo":"/images/plato-premio.jpeg",
  "Postres":"/images/postre-01.jpeg"
};

export default function MenuPage(){
  const [query,setQuery]=useState(""); const [scrollProgress,setScrollProgress]=useState(0);
  const {cart,add,remove,count}=useCart(); const {lang}=useLanguage(); const en=lang==="EN";
  useEffect(()=>{const onScroll=()=>setScrollProgress(Math.min(1,window.scrollY/900));window.addEventListener("scroll",onScroll,{passive:true});return()=>window.removeEventListener("scroll",onScroll)},[]);
  const filtered=useMemo(()=>{const q=query.trim().toLowerCase();return q?products.filter(p=>`${p.name} ${p.description} ${p.ingredients} ${p.category}`.toLowerCase().includes(q)):products},[query]);
  return <main className="menu-page">
    <section className="menu-intro">
      <div className="menu-ingredient-rail" aria-hidden="true">
        <span className="carrot-whole">🥕</span><span className="carrot-slice slice-one">◯</span><span className="carrot-slice slice-two">◯</span><span className="carrot-slice slice-three">◯</span>
      </div>
      <p className="eyebrow">ANDARIEGOS · COCINA DE MUNDO</p><h1>{en?"Menu":"Menú"}</h1>
      <p>{en?"Search by dish or ingredient. Add what you like and keep moving.":"Busca por plato o ingrediente. Agrega lo que te guste y sigue."}</p>
      <div className="menu-tools"><label className="search-field"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={en?"Search dish or ingredient...":"Buscar plato o ingrediente..."}/></label><a className="cart-summary-link" href="/checkout"><span>🛒</span><b>{count}</b><small>{en?"YOUR CART":"TU CARRITO"}</small></a></div>
    </section>
    {categories.map(category=>{const items=filtered.filter(p=>p.category===category);if(!items.length)return null;const image=categoryImages[category];return <section className="menu-category" key={category}>
      <div className="category-heading"><div><span>{String(categories.indexOf(category)+1).padStart(2,"0")}</span><h2>{category}</h2></div>{image&&<div className="category-image"><Image src={image} alt="" fill sizes="110px"/></div>}<em>{items.length} {en?"dishes":"platos"}</em></div>
      <div className="product-list">{items.map(product=><article className="product-row" key={product.id}>
        <div className="product-info"><div className="product-title-line"><h3>{product.name}</h3><strong>{formatCOP(product.price)}</strong></div><p>{product.description}</p><small>{product.ingredients}</small></div>
        <div className="quantity-control">{cart[product.id]?<><button aria-label="Disminuir" onClick={()=>remove(product.id)}>−</button><b>{cart[product.id]}</b><button aria-label="Aumentar" onClick={()=>add(product.id)}>+</button></>:<button className="add-button" onClick={()=>add(product.id)}>{en?"ADD":"AGREGAR"}</button>}</div>
      </article>)}</div>
    </section>})}
    <div className="menu-scroll-note" style={{"--carrot-progress":scrollProgress} as React.CSSProperties}><span>🥕</span><small>{en?"A little kitchen movement as you browse.":"Un pequeño movimiento de cocina mientras recorres la carta."}</small></div>
  </main>;
}
