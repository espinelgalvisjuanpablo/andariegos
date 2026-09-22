"use client";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products, type Product } from "@/lib/menu-data";
type Cart=Record<string,number>;
type CartContextType={cart:Cart;count:number;total:number;items:{product:Product;quantity:number}[];add:(id:string)=>void;remove:(id:string)=>void;clear:()=>void;summaryText:string};
const CartContext=createContext<CartContextType|null>(null);
export function CartProvider({children}:{children:ReactNode}) {
  const [cart,setCart]=useState<Cart>({});
  useEffect(()=>{try{const saved=localStorage.getItem("andariegos-cart");if(saved)setCart(JSON.parse(saved))}catch{}},[]);
  useEffect(()=>{try{if(Object.keys(cart).length) localStorage.setItem("andariegos-cart",JSON.stringify(cart));else localStorage.removeItem("andariegos-cart")}catch{}},[cart]);
  const items=useMemo(()=>products.filter(p=>cart[p.id]).map(product=>({product,quantity:cart[product.id]})),[cart]);
  const count=items.reduce((s,i)=>s+i.quantity,0);
  const total=items.reduce((s,i)=>s+i.quantity*i.product.price,0);
  const summaryText=items.map(({product,quantity})=>`${quantity} x ${product.name}`).join("\n");
  const add=(id:string)=>setCart(c=>({...c,[id]:(c[id]??0)+1}));
  const remove=(id:string)=>setCart(c=>{const n={...c},q=(n[id]??0)-1;if(q<=0)delete n[id];else n[id]=q;return n});
  return <CartContext.Provider value={{cart,count,total,items,add,remove,clear:()=>setCart({}),summaryText}}>{children}</CartContext.Provider>;
}
export function useCart(){const c=useContext(CartContext);if(!c)throw new Error("useCart debe usarse dentro de CartProvider");return c;}
