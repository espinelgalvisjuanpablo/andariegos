"use client";

import { useMemo,useState } from "react";

export function AdminDateTimePicker({label,value,onChange}:{label:string;value:string;onChange:(v:string)=>void}){
 const [date,time]=value.split("T"); const base=new Date((date||new Date().toLocaleDateString("en-CA"))+"T12:00:00"); const [cursor,setCursor]=useState(new Date(base.getFullYear(),base.getMonth(),1));
 const year=cursor.getFullYear(),month=cursor.getMonth(); const offset=(new Date(year,month,1).getDay()+6)%7; const days=new Date(year,month+1,0).getDate();
 const cells=Array.from({length:42},(_,i)=>i-offset+1); const title=new Intl.DateTimeFormat("es-CO",{month:"long",year:"numeric"}).format(cursor);
 const times=useMemo(()=>Array.from({length:48},(_,i)=>String(Math.floor(i/2)).padStart(2,"0")+":"+(i%2?"30":"00")) ,[]);
 return <div className="admin-datetime-card"><div className="admin-datetime-label">{label}</div><div className="admin-calendar"><div className="admin-calendar-head"><button type="button" onClick={()=>setCursor(new Date(year,month-1,1))}>‹</button><strong>{title}</strong><button type="button" onClick={()=>setCursor(new Date(year,month+1,1))}>›</button></div><div className="admin-calendar-week">{["L","M","X","J","V","S","D"].map(x=><span key={x}>{x}</span>)}</div><div className="admin-calendar-grid">{cells.map((day,i)=>{const valid=day>0&&day<=days;const d=valid?new Date(year,month,day):null;const key=d?d.toLocaleDateString("en-CA"):"";return <button key={i} type="button" disabled={!valid} className={key===date?"selected":""} onClick={()=>valid&&onChange(key+"T"+(time||"12:00"))}>{valid?day:""}</button>})}</div></div><div className="admin-time-picker"><strong>{time||"12:00"}</strong><span>Selecciona una hora</span><div className="admin-time-options">{times.map(x=><button type="button" key={x} className={x===time?"selected":""} onClick={()=>onChange((date||new Date().toLocaleDateString("en-CA"))+"T"+x)}>{x}</button>)}</div></div></div>;
}
