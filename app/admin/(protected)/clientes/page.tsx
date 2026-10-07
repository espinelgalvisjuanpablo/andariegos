"use client";

import { useEffect,useState } from "react";

export default function ClientesPage(){
 const [customers,setCustomers]=useState<any[]>([]); const [loading,setLoading]=useState(true);
 useEffect(()=>{fetch("/api/admin/customers").then(r=>r.json()).then(d=>setCustomers(d.customers||[])).finally(()=>setLoading(false))},[]);
 const orders=customers.reduce((n,c)=>n+Number(c.orders||0),0); const spend=customers.reduce((n,c)=>n+Number(c.total||0),0);
 const frequent=customers.slice().sort((a,b)=>Number(b.orders)-Number(a.orders))[0];
 return <main className="admin-page"><section className="admin-head"><p className="eyebrow">RELACIÓN</p><h1>Clientes</h1><p>Una vista rápida para entender qué está pasando con las personas que ya interactuaron con Andariegos.</p></section><div className="admin-summary-grid"><article className="admin-summary-card"><span>CLIENTES</span><strong>{customers.length}</strong><small>registros encontrados</small></article><article className="admin-summary-card"><span>PEDIDOS</span><strong>{orders}</strong><small>en el historial consultado</small></article><article className="admin-summary-card"><span>CONSUMO</span><strong>{spend.toLocaleString("es-CO")}</strong><small>COP acumulados</small></article><article className="admin-summary-card"><span>MÁS FRECUENTE</span><strong>{frequent?.orders||0}</strong><small>pedidos · podio principal</small></article></div><section className="admin-table-card">{loading?<p className="admin-empty">Cargando…</p>:<div className="admin-empty"><strong>Registro de clientes</strong><p>La siguiente capa añadirá búsqueda, máscara visual, ojo de revelado, exportación y anonimización con control de acceso.</p></div>}</section></main>;
}
