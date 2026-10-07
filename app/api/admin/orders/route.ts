import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as sessionClient } from "@/lib/supabase/server";

const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SECRET_KEY!);

export async function GET(){
 const session=await sessionClient(); const {data:{user}}=await session.auth.getUser();
 if(!user)return NextResponse.json({error:"No autorizado."},{status:401});
 const {data,error}=await db.from("orders").select("*,order_items(*)").order("created_at",{ascending:false}).limit(200);
 if(error)return NextResponse.json({error:"No fue posible cargar los pedidos."},{status:500});
 return NextResponse.json({orders:data||[]});
}
