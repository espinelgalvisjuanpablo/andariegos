"use client";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products, type Product } from "@/lib/menu-data";
type Cart=Record<string,number>;
type CartContextType={cart:Cart;count:number;total:number;items:{product:Product;quantity:number}[];add:(id:string)=>void;remove:(id:string)=>void;clear:()=>void;summaryText:string};
const CartContext=createContext<CartContextType|null>(null);
const STORAGE_KEY="andariegos-cart";
const UPDATED_KEY="andariegos-cart-updated";
const MAX_AGE=24*60*60*1000;

export function CartProvider({children}:{children:ReactNode}) {
  const [cart,setCart]=useState<Cart>({});
  const [hydrated,setHydrated]=useState(false);

  useEffect(()=>{
    try{
      const raw=localStorage.getItem(STORAGE_KEY);
      const stamp=Number(localStorage.getItem(UPDATED_KEY)||0);
      if(raw && stamp && Date.now()-stamp<MAX_AGE){
        const parsed=JSON.parse(raw);
        if(parsed && typeof parsed==="object") setCart(parsed);
      } else {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(UPDATED_KEY);
      }
    }catch{
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(UPDATED_KEY);
    }finally{setHydrated(true)}
  },[]);

  useEffect(()=>{
    if(!hydrated)return;
    try{
      if(Object.keys(cart).length){
        localStorage.setItem(STORAGE_KEY,JSON.stringify(cart));
        localStorage.setItem(UPDATED_KEY,String(Date.now()));
      }else{
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(UPDATED_KEY);
      }
    }catch{}
  },[cart,hydrated]);

  useEffect(()=>{
    if(!hydrated||!Object.keys(cart).length)return;
    const timer=window.setTimeout(()=>setCart({}),MAX_AGE);
    return()=>window.clearTimeout(timer);
  },[hydrated,cart]);

  const items=useMemo(()=>products.filter(p=>cart[p.id]).map(product=>({product,quantity:cart[product.id]})),[cart]);
  const count=items.reduce((s,i)=>s+i.quantity,0);
  const total=items.reduce((s,i)=>s+i.quantity*i.product.price,0);
  const summaryText=items.map(({product,quantity})=>`${quantity} x ${product.name}`).join("\n");
  const add=(id:string)=>setCart(c=>({...c,[id]:(c[id]??0)+1}));
  const remove=(id:string)=>setCart(c=>{const n={...c},q=(n[id]??0)-1;if(q<=0)delete n[id];else n[id]=q;return n});
  return <CartContext.Provider value={{cart,count,total,items,add,remove,clear:()=>setCart({}),summaryText}}>{children}</CartContext.Provider>;
}
export function useCart(){const c=useContext(CartContext);if(!c)throw new Error("useCart debe usarse dentro de CartProvider");return c;}
