"use client";
import { useMemo,useState } from "react";
import Image from "next/image";
import { products,categories,formatCOP } from "@/lib/menu-data";
import { useCart } from "@/components/cart-provider";
import { useLanguage } from "@/components/language-provider";
export default function MenuPage(){
  const [query,setQuery]=useState(""); const {cart,add,remove,count}=useCart(); const {lang}=useLanguage(); const en=lang==="EN";
  const filtered=useMemo(()=>{const q=query.trim().toLowerCase();return q?products.filter(p=>`${p.name} ${p.description} ${p.ingredients} ${p.category}`.toLowerCase().includes(q)):products},[query]);
  return <main className="menu-page"><section className="menu-intro"><p className="eyebrow">ANDARIEGOS</p><h1>{en?"Menu":"Menú"}</h1><p>{en?"Search by dish or ingredient. Add what you like and keep moving.":"Busca por plato o ingrediente. Agrega lo que te guste y sigue."}</p><div className="menu-tools"><label className="search-field"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={en?"Search dish or ingredient...":"Buscar plato o ingrediente..."}/></label><a className="cart-summary-link" href="/checkout"><span>🛒</span><b>{count}</b><small>{en?"YOUR CART":"TU CARRITO"}</small></a></div></section>
    {categories.map(category=>{const items=filtered.filter(p=>p.category===category);if(!items.length)return null;return <section className="menu-category" key={category}><div className="category-heading"><h2>{category}</h2><span>{items.length}</span></div><div className="product-list">{items.map(product=><article className="product-row" key={product.id}><div className="product-thumb">{product.image?<Image src={product.image} alt={product.name} fill sizes="100px"/>:<span>✦</span>}</div><div className="product-info"><div className="product-title-line"><h3>{product.name}</h3><strong>{formatCOP(product.price)}</strong></div><p>{product.description}</p><small>{product.ingredients}</small></div><div className="quantity-control">{cart[product.id]?<><button onClick={()=>remove(product.id)}>−</button><b>{cart[product.id]}</b><button onClick={()=>add(product.id)}>+</button></>:<button className="add-button" onClick={()=>add(product.id)}>{en?"ADD":"AGREGAR"}</button>}</div></article>)}</div></section>})}
  </main>;
}
