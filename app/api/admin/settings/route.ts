import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as sessionClient } from "@/lib/supabase/server";

const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SECRET_KEY!);

export async function GET(){
 const session=await sessionClient(); const {data:{user}}=await session.auth.getUser();
 if(!user)return NextResponse.json({error:"No autorizado."},{status:401});
 const {data,error}=await db.from("site_settings").select("key,value_json").in("key",["delivery","whatsapp","reservations"]);
 if(error)return NextResponse.json({error:"No fue posible cargar la configuración."},{status:500});
 const settings=Object.fromEntries((data||[]).map(x=>[x.key,x.value_json]));
 return NextResponse.json({settings});
}
