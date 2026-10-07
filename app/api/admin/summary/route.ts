import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as sessionClient } from "@/lib/supabase/server";

const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SECRET_KEY!);

export async function GET(){
 const s=await sessionClient(); const {data:{user}}=await s.auth.getUser(); if(!user)return NextResponse.json({error:"No autorizado."},{status:401});
 const [{data:orders},{data:reservations},{data:products}]=await Promise.all([
  db.from("orders").select("id,total_cop,created_at").order("created_at",{ascending:false}).limit(1000),
  db.from("reservations").select("id,created_at").order("created_at",{ascending:false}).limit(1000),
  db.from("products").select("id").neq("status","hidden")
 ]);
 const now=new Date(); const today=now.toLocaleDateString("en-CA"); const todays=(orders||[]).filter(o=>String(o.created_at).slice(0,10)===today).length;
 return NextResponse.json({todayOrders:todays,totalOrders:orders?.length||0,reservations:reservations?.length||0,products:products?.length||0});
}
