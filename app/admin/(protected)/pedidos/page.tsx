"use client";

import { useEffect,useState } from "react";

type Order={id:string;order_number:number;customer_name:string;customer_phone:string;delivery_type:string;address:string|null;payment_method_id:string;subtotal_cop:number;delivery_fee_cop:number;total_cop:number;notes:string|null;created_at:string;order_items?:{product_name_es:string;quantity:number;unit_price_cop:number}[]};

const money=(n:number)=>new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(n);
const date=(v:string)=>new Intl.DateTimeFormat("es-CO",{dateStyle:"medium",timeStyle:"short"}).format(new Date(v));

export default function PedidosPage(){
 const [orders,setOrders]=useState<Order[]>([]); const [q,setQ]=useState(""); const [loading,setLoading]=useState(true);
 useEffect(()=>{fetch("/api/admin/orders").then(r=>r.json()).then(d=>setOrders(d.orders||[])).finally(()=>setLoading(false))},[]);
 const filtered=orders.filter(o=>[o.customer_name,o.customer_phone,String(o.order_number)].join(" ").toLowerCase().includes(q.toLowerCase()));
 return <main className="admin-page">
  <section className="admin-head"><p className="eyebrow">OPERACIÓN</p><h1>Pedidos</h1><p>Consulta lo que llegó. La coordinación del pedido continúa por WhatsApp.</p></section>
  <section className="admin-toolbar"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar por nombre, celular o pedido…"/><span>{filtered.length} pedidos</span></section>
  <section className="admin-table-card">{loading?<p className="admin-empty">Cargando pedidos…</p>:filtered.length===0?<p className="admin-empty">No encontramos pedidos con esa búsqueda.</p>:<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Pedido</th><th>Cliente</th><th>Entrega</th><th>Total</th><th>Recibido</th></tr></thead><tbody>{filtered.map(o=><tr key={o.id}><td><strong>AND-{String(o.order_number).padStart(4,"0")}</strong></td><td><span className="admin-private-mask">{o.customer_name}</span><small>{o.customer_phone}</small></td><td>{o.delivery_type==="delivery"?"Domicilio":"Recoger"}</td><td><strong>{money(o.total_cop)}</strong></td><td>{date(o.created_at)}</td></tr>)}</tbody></table></div>}</section>
 </main>;
}
