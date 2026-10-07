"use client";

import Link from "next/link";
import { useCallback,useEffect,useState } from "react";
import { AdminDateTimePicker } from "@/components/admin-date-time-picker";
import { getRestaurantSettings,type RestaurantSettings } from "@/lib/supabase/restaurant";
import { getRestaurantStatus,type RestaurantStatus } from "@/lib/supabase/restaurant-status";

type Reason="temporary"|"private_event"|"admin_decision"|"other";
const quick=[["/admin/clientes","RELACIÓN","Clientes","Entiende qué está pasando con tus clientes."],["/admin/pedidos","OPERACIÓN","Pedidos","Revisa las solicitudes recibidas y su información."],["/admin/reservas","MESA","Reservas","Consulta y gestiona las solicitudes de reserva."],["/admin/menu","CARTA","Menú","Productos, precios, ingredientes y disponibilidad."],["/admin/contenido","MARCA","Contenido","Historias, avisos, destacados y contenido de Simijaca."],["/admin/configuracion","SISTEMA","Configuración","Domicilios, pagos, WhatsApp y parámetros generales."]];
const reasons:{value:Reason;label:string}[]=[{value:"temporary",label:"Cierre temporal"},{value:"private_event",label:"Evento privado"},{value:"admin_decision",label:"Decisión del administrador"},{value:"other",label:"Otro"}];
function localValue(d:Date){const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,"0"),day=String(d.getDate()).padStart(2,"0"),h=String(d.getHours()).padStart(2,"0"),min=String(d.getMinutes()).padStart(2,"0");return `${y}-${m}-${day}T${h}:${min}`;}
function defaultStart(){return localValue(new Date())}
function defaultEnd(){const d=new Date();d.setHours(d.getHours()+2);return localValue(d)}
function endLabel(v:string|null){return v?new Intl.DateTimeFormat("es-CO",{timeZone:"America/Bogota",weekday:"long",day:"numeric",month:"long",hour:"numeric",minute:"2-digit",hour12:true}).format(new Date(v)):null}
function description(s:RestaurantStatus){if(s.reason==="temporary_open")return s.closureMessage||"Apertura excepcional activa.";if(s.reason==="temporary_closed"||s.reason==="special_closure")return s.closureMessage||s.closureReason||"Cerrado temporalmente. Agradecemos tu comprensión.";return s.openingTime?"Fuera del horario de servicio.":"Hoy no tenemos servicio."}

export default function AdminPage(){
 const [summary,setSummary]=useState<any>(null),[settings,setSettings]=useState<RestaurantSettings|null>(null),[status,setStatus]=useState<RestaurantStatus|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState(""),[modal,setModal]=useState<"open"|"close"|null>(null),[message,setMessage]=useState(""),[reason,setReason]=useState<Reason>("temporary"),[startsAt,setStartsAt]=useState(defaultStart()),[endsAt,setEndsAt]=useState(defaultEnd()),[saving,setSaving]=useState(false),[demo,setDemo]=useState(false);

 const load=useCallback(async()=>{
  try{
   setError("");
   const demoMode=localStorage.getItem("andariegos-demo")==="1";
   setDemo(demoMode);
   if(demoMode){
    const real=await getRestaurantSettings();
    if(!real)throw new Error("No existe la configuración del restaurante.");
    const stored=localStorage.getItem("andariegos-demo-restaurant");
    const demoSettings=stored?JSON.parse(stored) as RestaurantSettings:real;
    setSettings(demoSettings);setStatus(getRestaurantStatus(demoSettings));setLoading(false);return;
   }
   const r=await getRestaurantSettings();
   if(!r)throw new Error("No existe la configuración del restaurante.");
   setSettings(r);setStatus(getRestaurantStatus(r));
  }catch(e){console.error(e);setError("No fue posible cargar el estado del restaurante.")}finally{setLoading(false)}
 },[]);

 useEffect(()=>{load();fetch("/api/admin/summary").then(r=>r.json()).then(d=>setSummary(d));const i=window.setInterval(load,60000);return()=>window.clearInterval(i)},[load]);
 useEffect(()=>{if(!modal)return;const previous=document.body.style.overflow;document.body.style.overflow="hidden";const onKey=(e:KeyboardEvent)=>{if(e.key==="Escape"&&!saving)setModal(null)};window.addEventListener("keydown",onKey);return()=>{document.body.style.overflow=previous;window.removeEventListener("keydown",onKey)}},[modal,saving]);

 function openModal(type:"open"|"close"){setModal(type);setMessage("");setReason("temporary");setStartsAt(defaultStart());setEndsAt(defaultEnd());setError("")}
 async function save(){
  if(!startsAt||!endsAt)return;
  setSaving(true);setError("");
  try{
   const open=modal==="open";
   const payload={action:open?"open_exception":"close_exception",reason:open?undefined:reason,message:message.trim()||null,starts_at:new Date(startsAt).toISOString(),ends_at:new Date(endsAt).toISOString()};
   if(demo){
    const base=settings!;
    const next={...base,temporary_override:{active:true,mode:open?"open":"closed",message:message.trim()||null,starts_at:payload.starts_at,ends_at:payload.ends_at},special_closure:{active:false,reason:null,message:null,starts_at:null,ends_at:null}};
    localStorage.setItem("andariegos-demo-restaurant",JSON.stringify(next));setSettings(next);setStatus(getRestaurantStatus(next));setModal(null);return;
   }
   const r=await fetch("/api/admin/restaurant-status",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
   const d=await r.json();if(!r.ok)throw new Error(d.error||"No fue posible actualizar el estado.");
   setModal(null);await load();
  }catch(e){console.error(e);setError(e instanceof Error?e.message:"No fue posible actualizar el estado.")}finally{setSaving(false)}
 }
 async function clear(){
  setSaving(true);setError("");
  try{
   if(demo){
    const base=settings!;
    const next={...base,temporary_override:{active:false,mode: "open" as const,message:null,starts_at:null,ends_at:null}};
    localStorage.setItem("andariegos-demo-restaurant",JSON.stringify(next));setSettings(next);setStatus(getRestaurantStatus(next));return;
   }
   const r=await fetch("/api/admin/restaurant-status",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"clear_override"})});
   const d=await r.json();if(!r.ok)throw new Error(d.error||"No fue posible restablecer el horario.");await load();
  }catch(e){console.error(e);setError(e instanceof Error?e.message:"No fue posible restablecer el horario.")}finally{setSaving(false)}
 }

 if(loading)return <main className="admin-page"><section className="admin-head"><p className="eyebrow">ESCRITORIO DE ANDARIEGOS</p><h1>Inicio</h1><p>Cargando el estado del restaurante...</p></section></main>;
 if(!status||!settings)return <main className="admin-page"><section className="admin-head"><h1>Inicio</h1><p>No fue posible cargar la información del restaurante.</p>{error&&<p className="admin-login-error">{error}</p>}</section></main>;
 const exceptional=status.reason==="temporary_open"||status.reason==="temporary_closed";
 return <main className="admin-page">
  <section className="admin-head"><p className="eyebrow">ESCRITORIO DE ANDARIEGOS</p><div className="admin-title-row"><div><h1>Inicio</h1><p>Un espacio sencillo para administrar la operación digital de Andariegos.</p></div>{demo&&<span className="admin-demo-badge">ENTORNO DE PRUEBA · SIN CAMBIOS REALES</span>}</div></section>
  {error&&<div className="admin-dashboard-alert">{error}</div>}
  <section className="admin-section"><div className="admin-section-heading"><div><p className="eyebrow">OPERACIÓN</p><h2>Estado del restaurante</h2></div><span className="admin-section-note">ACTUALIZACIÓN AUTOMÁTICA</span></div>
   <article className={`admin-restaurant-status ${status.isOpen?"is-open":"is-closed"}`}><div className="admin-restaurant-status-main"><div className="admin-restaurant-status-indicator"><span/></div><div><p className="admin-restaurant-status-label">{status.isOpen?"ABIERTO":"CERRADO"}</p><h3>{status.dayName}</h3><p className="admin-restaurant-status-date">{status.dateLabel}</p><p className="admin-restaurant-status-time">{status.timeLabel}</p></div></div>
    <div className="admin-restaurant-status-info"><div><span>HORARIO DE HOY</span><strong>{status.openingTime&&status.closingTime?`${status.openingTime} — ${status.closingTime}`:"SIN SERVICIO"}</strong></div><div><span>{status.reason==="temporary_open"?"APERTURA EXCEPCIONAL":status.reason==="temporary_closed"?"CIERRE EXCEPCIONAL":"ESTADO"}</span><strong>{status.isOpen?(status.reason==="temporary_open"?description(status):"Servicio activo."):description(status)}</strong></div>{status.overrideEndsAt&&exceptional&&<div><span>{status.isOpen?"CIERRE DE LA EXCEPCIÓN":"REAPERTURA"}</span><strong>{endLabel(status.overrideEndsAt)}</strong></div>}</div>
    <div className="admin-restaurant-status-action">{exceptional?<button type="button" className="button button-primary" onClick={clear} disabled={saving}>{saving?"RESTABLECIENDO...":"RESTABLECER HORARIO"}</button>:status.isOpen?<button type="button" className="button button-primary" onClick={()=>openModal("close")} disabled={saving}>CERRAR EXCEPCIONALMENTE</button>:<button type="button" className="button button-primary" onClick={()=>openModal("open")} disabled={saving}>ABRIR EXCEPCIONALMENTE</button>}</div>
   </article>
  </section>
  <section className="admin-section"><div className="admin-section-heading"><div><p className="eyebrow">ADMINISTRACIÓN</p><h2>Accesos rápidos</h2></div></div><div className="admin-grid">{quick.map(([href,eyebrow,title,text])=><Link key={href} href={href} className="admin-card admin-card-link"><span>{eyebrow}</span><h2>{title}</h2><p>{text}</p><strong>ABRIR →</strong></Link>)}</div></section>
  {modal&&<div className="admin-modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget&&!saving)setModal(null)}}><section className="admin-modal admin-modal-modern" role="dialog" aria-modal="true">
   <div className="admin-modal-header"><div><p className="eyebrow">CONTROL DE OPERACIÓN</p><h2>{modal==="open"?"Abrir excepcionalmente":"Cerrar excepcionalmente"}</h2></div><button type="button" className="admin-modal-close" onClick={()=>!saving&&setModal(null)} aria-label="Cerrar">×</button></div>
   <p className="admin-modal-intro">{modal==="open"?"Esta apertura reemplaza temporalmente el horario normal. Al terminar el periodo, vuelve el horario habitual.":"Este cierre reemplaza temporalmente el horario normal. Al terminar el periodo, vuelve el horario habitual."}</p>
   {modal==="close"&&<div className="admin-modal-field"><label htmlFor="closure-reason">Motivo</label><select id="closure-reason" value={reason} onChange={e=>setReason(e.target.value as Reason)}>{reasons.map(x=><option key={x.value} value={x.value}>{x.label}</option>)}</select></div>}
   <div className="admin-modal-field"><label htmlFor="override-message">Mensaje para la web</label><textarea id="override-message" value={message} onChange={e=>setMessage(e.target.value)} placeholder={modal==="open"?"Ej. Hoy abrimos excepcionalmente por una ocasión especial.":"Ej. Hoy cerramos temporalmente. Agradecemos tu comprensión."} rows={3}/></div>
   <div className="admin-datetime-scroll"><AdminDateTimePicker label="Desde" value={startsAt} onChange={setStartsAt}/><AdminDateTimePicker label={modal==="open"?"Hasta · vuelve el horario normal":"Hasta · vuelve a abrir"} value={endsAt} onChange={setEndsAt}/></div>
   <p className="admin-modal-helper">La excepción siempre necesita una fecha y una hora de inicio y de finalización.</p>
   {error&&<p className="admin-modal-error">{error}</p>}
   <div className="admin-modal-actions"><button type="button" className="button button-secondary" onClick={()=>setModal(null)} disabled={saving}>CANCELAR</button><button type="button" className="button button-primary" onClick={save} disabled={saving}>{saving?"GUARDANDO...":modal==="open"?"CONFIRMAR APERTURA":"CONFIRMAR CIERRE"}</button></div>
  </section></div>}
 </main>;
}
