"use client";

import { useEffect,useState } from "react";

export default function ContenidoPage(){
 const [items,setItems]=useState<any[]>([]); const [loading,setLoading]=useState(true);
 useEffect(()=>{fetch("/api/admin/content").then(r=>r.json()).then(d=>setItems(d.content?.highlights||[])).finally(()=>setLoading(false))},[]);
 return <main className="admin-page"><section className="admin-head"><p className="eyebrow">MARCA</p><h1>Contenido</h1><p>Historias, destacados y promociones para que más personas conozcan Andariegos y quieran visitarlo.</p></section><section className="admin-content-list"><div className="admin-section-heading"><div><p className="eyebrow">BIBLIOTECA</p><h2>Destacados</h2></div><span className="admin-section-note">{items.length} elementos</span></div>{loading?<p className="admin-empty">Cargando…</p>:items.length===0?<p className="admin-empty">Todavía no hay destacados. Puedes comenzar con un borrador.</p>:items.map((x:any)=><article key={x.id} className="admin-content-item"><div><span>{String(x.status||"draft").toUpperCase()}</span><h3>{x.title_es||"Sin título"}</h3><p>{x.description_es||"Sin descripción"}</p></div></article>)}<div className="admin-content-actions"><a className="button button-primary" href="/admin/contenido/editar">NUEVO DESTACADO</a></div></section></main>;
}
