import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as sessionClient } from "@/lib/supabase/server";

const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SECRET_KEY!);

export async function GET(){
 const s=await sessionClient(); const {data:{user}}=await s.auth.getUser(); if(!user)return NextResponse.json({error:"No autorizado."},{status:401});
 const {data,error}=await db.from("reservations").select("*").order("created_at",{ascending:false}).limit(200);
 if(error)return NextResponse.json({error:"No fue posible cargar las solicitudes."},{status:500});
 return NextResponse.json({reservations:data||[]});
}
