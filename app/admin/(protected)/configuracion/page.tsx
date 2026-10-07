"use client";

import { useEffect,useState } from "react";

export default function ConfiguracionPage(){
 const [settings,setSettings]=useState<any>(null);
 useEffect(()=>{fetch("/api/admin/settings").then(r=>r.json()).then(d=>setSettings(d.settings||{}))},[]);
 const delivery=settings?.delivery||{}; const whatsapp=settings?.whatsapp||{}; const reservations=settings?.reservations||{};
 return <main className="admin-page"><section className="admin-head"><p className="eyebrow">SISTEMA</p><h1>Configuración</h1><p>Controla cómo funciona la plataforma sin tocar código.</p></section><div className="admin-config-grid"><article className="admin-config-card"><span>RESTAURANTE</span><h2>Horarios</h2><p>Horario normal y aperturas o cierres excepcionales.</p><a href="/admin">ABRIR CONTROL →</a></article><article className="admin-config-card"><span>DOMICILIOS</span><h2>{delivery.enabled===false?"Desactivados":"Activos"}</h2><p>{delivery.radius_km||5} km · {Number(delivery.fee_cop||5000).toLocaleString("es-CO")} COP</p></article><article className="admin-config-card"><span>WHATSAPP</span><h2>Recepción</h2><p>El número configurado recibe las solicitudes enviadas desde la web.</p><small>{whatsapp.phone||"No configurado"}</small></article><article className="admin-config-card"><span>RESERVAS</span><h2>{reservations.enabled===false?"Inactivas":"Activas"}</h2><p>Grupos grandes: {reservations.large_party_threshold||5}+ personas · cancelación: {reservations.cancellation_cutoff_hours||2} h</p></article></div><section className="admin-config-card admin-config-wide"><span>PÁGINA</span><h2>Textos generales</h2><p>Los textos de Home, mensajes globales y elementos editoriales forman parte del funcionamiento general de la plataforma.</p></section></main>;
}
