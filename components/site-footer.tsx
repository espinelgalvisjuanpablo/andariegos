"use client";
import Link from "next/link";
import { useEffect,useState } from "react";
type DayKey="monday"|"tuesday"|"wednesday"|"thursday"|"friday"|"saturday"|"sunday";type ScheduleDay={open:string;close:string};type Schedule=Record<DayKey,ScheduleDay|null>;type PublicStatus={isOpen:boolean;reason:string;openingTime:string|null;closingTime:string|null,message?:string|null};
const days:DayKey[]=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];const labels:Record<DayKey,string>={monday:"Lunes",tuesday:"Martes",wednesday:"Miércoles",thursday:"Jueves",friday:"Viernes",saturday:"Sábado",sunday:"Domingo"};
export function SiteFooter(){
 const [schedule,setSchedule]=useState<Schedule|null>(null),[status,setStatus]=useState<PublicStatus|null>(null),[wa,setWa]=useState<any>(null),[content,setContent]=useState<any>(null);
 useEffect(()=>{let active=true;Promise.all([fetch("/api/restaurant-status").then(r=>r.json()),fetch("/api/public/settings").then(r=>r.json())]).then(([a,b])=>{if(active){if(a.schedule){setSchedule(a.schedule);setStatus(a.status)}setWa(b.settings?.whatsapp||null);setContent(b.settings?.page_content||null)}}).catch(()=>{});return()=>{active=false}},[]);
 const waNumber=String(wa?.phone||"").replace(/\D/g,""),waMessage=encodeURIComponent(wa?.message||"Hola, quiero comunicarme con Andariegos.");
 const regularHours=schedule?[
   schedule.monday?"Lun · "+schedule.monday.open+" — "+schedule.monday.close:"Lun · Cerrado",
   schedule.tuesday?"Mar · "+schedule.tuesday.open+" — "+schedule.tuesday.close:"Mar · Cerrado",
   schedule.wednesday&&schedule.thursday&&schedule.friday&&schedule.saturday&&schedule.sunday&&
   schedule.wednesday.open===schedule.thursday.open&&schedule.wednesday.open===schedule.friday.open&&schedule.wednesday.open===schedule.saturday.open&&schedule.wednesday.open===schedule.sunday.open&&
   schedule.wednesday.close===schedule.thursday.close&&schedule.wednesday.close===schedule.friday.close&&schedule.wednesday.close===schedule.saturday.close&&schedule.wednesday.close===schedule.sunday.close
     ?"Mié–Dom · "+schedule.wednesday.open+" — "+schedule.wednesday.close
     :"Mié–Dom · 12:00 — 21:00"
 ].join("  ·  "):"Mié–Dom · 12:00 — 21:00";
 return <footer className="site-footer"><div><p className="footer-mark">ANDARIEGOS</p><p>Cocina de Mundo · Simijaca, Cundinamarca</p><p className="footer-soft">{content?.footer?.soft_es||"Te invitamos a comer, descubrir y quedarte un rato."}</p>{waNumber&&<a className="footer-whatsapp" href={`https://wa.me/${waNumber}?text=${waMessage}`} target="_blank" rel="noreferrer">{wa?.name||"WhatsApp"} ↗</a>}</div>
 <div className="footer-hours"><p className="footer-hours-title">HORARIOS</p>{status&&<p className={`footer-open-state ${status.isOpen?"is-open":"is-closed"}`}>{status.isOpen?"ABIERTO AHORA":"CERRADO AHORA"}</p>}<p className="footer-hours-compact">{regularHours}</p>{!status?.isOpen&&status?.message&&<p className="footer-soft">{status.message}</p>}</div>
 <nav className="footer-links"><Link href="/menu">Menú</Link><Link href="/simijaca">Simijaca</Link><Link href="/reservas">Reservas</Link><Link href="/politicas">Privacidad</Link></nav>
 <div className="footer-bottom"><span>También puedes encontrarnos por aquí</span><div><a href="https://maps.app.goo.gl/AJqofpreCyqbTJW98" target="_blank" rel="noreferrer">Google Maps ↗</a><a href="https://www.tripadvisor.com/" target="_blank" rel="noreferrer">Tripadvisor ↗</a></div></div></footer>;
}
