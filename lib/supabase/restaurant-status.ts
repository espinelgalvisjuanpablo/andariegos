import type { RestaurantSchedule,RestaurantSettings,SpecialClosure,TemporaryOverride } from "./restaurant";

export type RestaurantStatus={isOpen:boolean;status:"open"|"closed";reason:"schedule"|"temporary_open"|"temporary_closed"|"special_closure"|"special_closure_not_started";dayName:string;dateLabel:string;timeLabel:string;openingTime:string|null;closingTime:string|null;closureReason:string|null;closureMessage:string|null;specialClosureEndsAt:string|null;overrideEndsAt:string|null};

const dayNames:Record<keyof RestaurantSchedule,string>={monday:"LUNES",tuesday:"MARTES",wednesday:"MIÉRCOLES",thursday:"JUEVES",friday:"VIERNES",saturday:"SÁBADO",sunday:"DOMINGO"};
const dayMap:Record<string,keyof RestaurantSchedule>={Sunday:"sunday",Monday:"monday",Tuesday:"tuesday",Wednesday:"wednesday",Thursday:"thursday",Friday:"friday",Saturday:"saturday"};

function parts(date:Date){const p=new Intl.DateTimeFormat("en-US",{timeZone:"America/Bogota",weekday:"long",hour:"2-digit",minute:"2-digit",hour12:false}).formatToParts(date);const g=(t:string)=>p.find(x=>x.type===t)?.value??"";return{weekday:g("weekday"),hour:Number(g("hour")),minute:Number(g("minute"))}}
function mins(h:number,m:number){return h*60+m}
function labelDate(d:Date){return new Intl.DateTimeFormat("es-CO",{timeZone:"America/Bogota",weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(d)}
function labelTime(d:Date){return new Intl.DateTimeFormat("es-CO",{timeZone:"America/Bogota",hour:"numeric",minute:"2-digit",hour12:true}).format(d)}
function closureLabel(r:SpecialClosure["reason"]){if(r==="temporary")return"CIERRE TEMPORAL";if(r==="private_event")return"EVENTO PRIVADO";if(r==="admin_decision")return"DECISIÓN DEL ADMINISTRADOR";if(r==="other")return"OTRO";return null}

export function getRestaurantStatus(settings:RestaurantSettings,now:Date=new Date()):RestaurantStatus{
 const p=parts(now),dayKey=dayMap[p.weekday],schedule=settings.schedule[dayKey],nowMin=mins(p.hour,p.minute),dateLabel=labelDate(now),timeLabel=labelTime(now);
 const override:TemporaryOverride|null=settings.temporary_override?.active?settings.temporary_override:null;
 if(override?.starts_at&&override.ends_at){const a=new Date(override.starts_at),b=new Date(override.ends_at);if(!Number.isNaN(a.getTime())&&!Number.isNaN(b.getTime())&&now>=a&&now<b){const open=override.mode==="open";return{isOpen:open,status:open?"open":"closed",reason:open?"temporary_open":"temporary_closed",dayName:dayNames[dayKey],dateLabel,timeLabel,openingTime:schedule?.open??null,closingTime:schedule?.close??null,closureReason:open?null:"CIERRE EXCEPCIONAL",closureMessage:override.message,specialClosureEndsAt:null,overrideEndsAt:override.ends_at}}}
 const sc=settings.special_closure;
 if(sc.active){const a=sc.starts_at?new Date(sc.starts_at):null,b=sc.ends_at?new Date(sc.ends_at):null;if(a&&b&&now<a){const normal=getRestaurantStatus({...settings,special_closure:{...sc,active:false}},now);return{...normal,reason:"special_closure_not_started",closureReason:closureLabel(sc.reason),closureMessage:sc.message,specialClosureEndsAt:sc.ends_at}}if(a&&b&&now>=a&&now<b)return{isOpen:false,status:"closed",reason:"special_closure",dayName:dayNames[dayKey],dateLabel,timeLabel,openingTime:schedule?.open??null,closingTime:schedule?.close??null,closureReason:closureLabel(sc.reason),closureMessage:sc.message,specialClosureEndsAt:sc.ends_at,overrideEndsAt:null}}
 if(!schedule)return{isOpen:false,status:"closed",reason:"schedule",dayName:dayNames[dayKey],dateLabel,timeLabel,openingTime:null,closingTime:null,closureReason:null,closureMessage:null,specialClosureEndsAt:null,overrideEndsAt:null};
 const [oh,om]=schedule.open.split(":").map(Number),[ch,cm]=schedule.close.split(":").map(Number),open=nowMin>=mins(oh,om)&&nowMin<mins(ch,cm);
 return{isOpen:open,status:open?"open":"closed",reason:"schedule",dayName:dayNames[dayKey],dateLabel,timeLabel,openingTime:schedule.open,closingTime:schedule.close,closureReason:null,closureMessage:null,specialClosureEndsAt:null,overrideEndsAt:null}
}
