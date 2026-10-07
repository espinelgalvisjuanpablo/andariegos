"use client";

import Link from "next/link";
import { useEffect,useState } from "react";

type DayKey="monday"|"tuesday"|"wednesday"|"thursday"|"friday"|"saturday"|"sunday";
type ScheduleDay={open:string;close:string};
type Schedule=Record<DayKey,ScheduleDay|null>;
type PublicStatus={isOpen:boolean;reason:string;openingTime:string|null;closingTime:string|null};

const days:DayKey[]=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
const labels:Record<DayKey,string>={monday:"Lunes",tuesday:"Martes",wednesday:"Miércoles",thursday:"Jueves",friday:"Viernes",saturday:"Sábado",sunday:"Domingo"};

export function SiteFooter(){
 const [schedule,setSchedule]=useState<Schedule|null>(null);
 const [status,setStatus]=useState<PublicStatus|null>(null);

 useEffect(()=>{
  let active=true;
  fetch("/api/restaurant-status").then(r=>r.json()).then(data=>{
   if(active&&data.schedule){setSchedule(data.schedule);setStatus(data.status)}
  }).catch(()=>{});
  return()=>{active=false};
 },[]);

 return <footer className="site-footer">
  <div>
   <p className="footer-mark">ANDARIEGOS</p>
   <p>Cocina de Mundo · Simijaca, Cundinamarca</p>
   <p className="footer-soft">Te invitamos a comer, descubrir y quedarte un rato.</p>
  </div>

  <div className="footer-hours">
   <p className="footer-hours-title">HORARIOS</p>
   {status&&<p className={`footer-open-state ${status.isOpen?"is-open":"is-closed"}`}>{status.isOpen?"ABIERTO AHORA":"CERRADO AHORA"}</p>}
   {schedule&&<div className="footer-hours-list">{days.map(day=><div key={day}><span>{labels[day]}</span><strong>{schedule[day]?`${schedule[day]!.open} — ${schedule[day]!.close}`:"Cerrado"}</strong></div>)}</div>}
  </div>

  <nav className="footer-links"><Link href="/menu">Menú</Link><Link href="/simijaca">Simijaca</Link><Link href="/politicas">Privacidad</Link></nav>
  <div className="footer-bottom"><span>También puedes encontrarnos por aquí</span><div><a href="https://maps.app.goo.gl/AJqofpreCyqbTJW98" target="_blank" rel="noreferrer">Google Maps ↗</a><a href="https://www.tripadvisor.com/" target="_blank" rel="noreferrer">Tripadvisor ↗</a></div></div>
 </footer>;
}
