import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as sessionClient } from "@/lib/supabase/server";

const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SECRET_KEY!);

export async function POST(request:Request){
 const session=await sessionClient(); const {data:{user}}=await session.auth.getUser();
 if(!user)return NextResponse.json({error:"No autorizado."},{status:401});
 const form=await request.formData(); const file=form.get("file");
 if(!(file instanceof File))return NextResponse.json({error:"No se recibió una imagen."},{status:400});
 if(!file.type.startsWith("image/"))return NextResponse.json({error:"Solo se permiten imágenes."},{status:400});
 if(file.size>5*1024*1024)return NextResponse.json({error:"La imagen no puede superar 5 MB."},{status:400});
 const bucket="andariegos-media";
 const {data:buckets}=await db.storage.listBuckets();
 if(!buckets?.some(b=>b.name===bucket))await db.storage.createBucket(bucket,{public:true});
 const ext=file.name.split(".").pop()||"jpg"; const path=Date.now()+"-"+Math.random().toString(36).slice(2)+"."+ext;
 const {error}=await db.storage.from(bucket).upload(path,file,{contentType:file.type,upsert:false});
 if(error)return NextResponse.json({error:"No fue posible subir la imagen."},{status:500});
 const {data}=db.storage.from(bucket).getPublicUrl(path);
 return NextResponse.json({success:true,url:data.publicUrl});
}
