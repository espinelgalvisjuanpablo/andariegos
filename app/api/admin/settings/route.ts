import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { createClient as sessionClient } from "@/lib/supabase/server";

const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SECRET_KEY!);
const keys=["delivery","whatsapp","reservations","page_content"];
async function auth(){const s=await sessionClient();const {data:{user}}=await s.auth.getUser();return user}
async function readSettings(){const {data,error}=await db.from("site_settings").select("key,value_json").in("key",keys);if(error)throw error;return Object.fromEntries((data||[]).map(x=>[x.key,x.value_json]));}
export async function GET(){
 const u=await auth();if(!u)return NextResponse.json({error:"No autorizado."},{status:401});
 try{return NextResponse.json({settings:await readSettings()})}catch{return NextResponse.json({error:"No fue posible cargar la configuración."},{status:500})}
}
export async function POST(request:Request){
 const u=await auth();if(!u)return NextResponse.json({error:"No autorizado."},{status:401});
 const role=String(u.app_metadata?.role||u.user_metadata?.role||"admin").toLowerCase();
 if(!["owner","admin"].includes(role))return NextResponse.json({error:"No tienes permisos para cambiar esta configuración."},{status:403});
 const body=await request.json();
 const allowed=new Set(keys);
 const entries=Object.entries(body.settings||{}).filter(([key])=>allowed.has(key));
 if(!entries.length)return NextResponse.json({error:"No hay cambios para guardar."},{status:400});
 const cookieStore=await cookies();
 const demo=cookieStore.get("andariegos_demo")?.value==="1";
 if(demo)return NextResponse.json({success:true,demo:true,settings:await readSettings()});
 const {error}=await db.from("site_settings").upsert(entries.map(([key,value_json])=>({key,value_json})),{onConflict:"key"});
 if(error)return NextResponse.json({error:"No fue posible guardar los cambios."},{status:500});
 return NextResponse.json({success:true,settings:await readSettings()});
}
