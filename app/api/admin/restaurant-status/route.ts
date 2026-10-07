import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";

type Reason="temporary"|"private_event"|"admin_decision"|"other";
type Payload=
 | {action:"open_exception";message?:string;starts_at:string;ends_at:string}
 | {action:"close_exception";reason:Reason;message?:string;starts_at:string;ends_at:string}
 | {action:"clear_override"};

const admin=createSupabaseAdmin(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SECRET_KEY!);

export async function POST(request:Request){
 try{
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)return NextResponse.json({error:"No autorizado."},{status:401});
  const body=await request.json() as Payload;
  if(body.action!=="open_exception"&&body.action!=="close_exception"&&body.action!=="clear_override")return NextResponse.json({error:"Acción no válida."},{status:400});
  const {data:setting,error:readError}=await admin.from("site_settings").select("value_json").eq("key","restaurant").maybeSingle();
  if(readError)return NextResponse.json({error:"No fue posible leer la configuración del restaurante."},{status:500});
  if(!setting)return NextResponse.json({error:"No existe la configuración del restaurante."},{status:404});
  const current=(setting.value_json as Record<string,unknown>)??{};

  if(body.action==="clear_override"){
   const value={...current,temporary_override:{active:false,mode:"open",message:null,starts_at:null,ends_at:null}};
   const {error}=await admin.from("site_settings").update({value_json:value}).eq("key","restaurant");
   if(error)return NextResponse.json({error:"No fue posible restablecer el horario normal."},{status:500});
   return NextResponse.json({success:true,action:"clear_override"});
  }

  if(!body.starts_at||!body.ends_at)return NextResponse.json({error:"El inicio y el fin del periodo son obligatorios."},{status:400});
  const startsAt=new Date(body.starts_at),endsAt=new Date(body.ends_at);
  if(Number.isNaN(startsAt.getTime())||Number.isNaN(endsAt.getTime())||endsAt<=startsAt)return NextResponse.json({error:"El periodo indicado no es válido."},{status:400});

  const open=body.action==="open_exception";
  const value={
   ...current,
   temporary_override:{active:true,mode:open?"open":"closed",message:body.message?.trim()||null,starts_at:startsAt.toISOString(),ends_at:endsAt.toISOString()},
   special_closure:{active:false,reason:null,message:null,starts_at:null,ends_at:null}
  };
  const {error}=await admin.from("site_settings").update({value_json:value}).eq("key","restaurant");
  if(error)return NextResponse.json({error:open?"No fue posible programar la apertura excepcional.":"No fue posible programar el cierre excepcional."},{status:500});
  return NextResponse.json({success:true,action:body.action,temporary_override:value.temporary_override});
 }catch(error){
  console.error("Unexpected restaurant status error:",error);
  return NextResponse.json({error:"Ocurrió un error inesperado."},{status:500});
 }
}
