"use client";

import { useEffect,useState } from "react";

type Product={id:string;name_es:string;name_en:string;price_cop:number;status:string;image_url:string|null;is_featured:boolean};
const money=(n:number)=>new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(n);

export default function MenuAdminPage(){
 const [products,setProducts]=useState<Product[]>([]); const [loading,setLoading]=useState(true); const [q,setQ]=useState("");
 useEffect(()=>{fetch("/api/admin/menu").then(r=>r.json()).then(d=>setProducts(d.products||[])).finally(()=>setLoading(false))},[]);
 const list=products.filter(p=>(p.name_es+" "+p.name_en).toLowerCase().includes(q.toLowerCase()));
 return <main className="admin-page"><section className="admin-head"><p className="eyebrow">CARTA</p><h1>Menú</h1><p>Mantén lo que ofrecemos: productos, precios, imágenes y disponibilidad.</p></section><section className="admin-toolbar"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar producto…"/><button className="button button-primary" disabled>NUEVO PRODUCTO</button></section><section className="admin-table-card">{loading?<p className="admin-empty">Cargando menú…</p>:<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Producto</th><th>Precio</th><th>Estado</th><th>Destacado</th></tr></thead><tbody>{list.map(p=><tr key={p.id}><td><strong>{p.name_es}</strong><small>{p.name_en}</small></td><td>{money(p.price_cop)}</td><td><span className={"admin-status-chip "+p.status}>{p.status==="available"?"Disponible":p.status==="soldout"?"Agotado":p.status==="soon"?"Próximamente":"Oculto"}</span></td><td>{p.is_featured?"Sí":"—"}</td></tr>)}</tbody></table></div>}</section></main>;
}
