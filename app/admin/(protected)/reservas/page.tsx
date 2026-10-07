"use client";

import { useEffect,useState } from "react";

export default function ReservasPage(){
 const [rows,setRows]=useState<any[]>([]); const [loading,setLoading]=useState(true);
 useEffect(()=>{fetch("/api/admin/reservations").then(r=>r.json()).then(d=>setRows(d.reservations||[])).finally(()=>setLoading(false))},[]);
 return <main className="admin-page"><section className="admin-head"><p className="eyebrow">MESA</p><h1>Reservas</h1><p>Consulta las solicitudes. La confirmación y conversación continúan por WhatsApp.</p></section><section className="admin-table-card">{loading?<p className="admin-empty">Cargando solicitudes…</p>:rows.length===0?<p className="admin-empty">Todavía no hay solicitudes de reserva.</p>:<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Fecha</th><th>Hora</th><th>Personas</th><th>Solicitud</th><th>Recibida</th></tr></thead><tbody>{rows.map((r:any)=><tr key={r.id}><td>{r.reservation_date||r.date||"—"}</td><td>{r.reservation_time||r.time||"—"}</td><td>{r.party_size||r.guests||"—"}</td><td><strong>{r.customer_name||r.name||"—"}</strong><small>{r.customer_phone||r.phone||""}</small></td><td>{r.created_at?new Intl.DateTimeFormat("es-CO",{dateStyle:"medium",timeStyle:"short"}).format(new Date(r.created_at)):"—"}</td></tr>)}</tbody></table></div>}</section></main>;
}
