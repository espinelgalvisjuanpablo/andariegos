import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { createClient as sessionClient } from "@/lib/supabase/server";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

async function auth() {
  const session = await sessionClient();
  const {
    data: { user },
  } = await session.auth.getUser();
  return user;
}

export async function GET() {
  const user = await auth();
  if (!user) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const [{ data: products, error: productError }, { data: categories, error: categoryError }] =
    await Promise.all([
      db.from("products").select("*").order("sort_order", { ascending: true }),
      db.from("categories").select("*").order("sort_order", { ascending: true }),
    ]);

  if (productError || categoryError) {
    console.error("Admin menu load error:", productError || categoryError);
    return NextResponse.json(
      { error: "No fue posible cargar el menú." },
      { status: 500 }
    );
  }

  const categoryMap = new Map(
    (categories || []).map((category: any) => [String(category.id), category])
  );

  const enrichedProducts = (products || []).map((product: any) => ({
    ...product,
    categories: categoryMap.get(String(product.category_id)) || null,
  }));

  return NextResponse.json({
    products: enrichedProducts,
    categories: categories || [],
  });
}

export async function POST(request: Request) {
  const user = await auth();
  if (!user) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const body = await request.json();
  const demo = (await cookies()).get("andariegos_demo")?.value === "1";

  if (demo) {
    return NextResponse.json({ success: true, demo: true, product: body });
  }

  if (!body.name_es || !body.name_en || body.price_cop == null || !body.category_id) {
    return NextResponse.json(
      { error: "Completa nombre, precio y categoría." },
      { status: 400 }
    );
  }

  const slug =
    body.slug ||
    body.name_es
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const { data, error } = await db
    .from("products")
    .insert({
      category_id: body.category_id,
      slug,
      name_es: body.name_es,
      name_en: body.name_en,
      description_es: body.description_es || "",
      description_en: body.description_en || "",
      ingredients_es: body.ingredients_es || "",
      ingredients_en: body.ingredients_en || "",
      price_cop: Number(body.price_cop),
      image_url: body.image_url || null,
      status: body.status || "available",
      is_spicy: !!body.is_spicy,
      is_featured: !!body.is_featured,
      sort_order: Number(body.sort_order || 0),
    })
    .select("*")
    .single();

  if (error) {
    console.error("Admin menu insert error:", error);
    return NextResponse.json(
      { error: "No fue posible guardar el producto." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, product: data });
}

export async function PATCH(request: Request) {
  const user = await auth();
  if (!user) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const body = await request.json();
  const demo = (await cookies()).get("andariegos_demo")?.value === "1";

  if (demo) {
    return NextResponse.json({ success: true, demo: true, product: body });
  }

  if (!body.id) {
    return NextResponse.json({ error: "Falta el producto." }, { status: 400 });
  }

  const patch = { ...body };
  delete patch.id;
  delete patch.created_at;
  delete patch.updated_at;
  delete patch.categories;

  if (patch.price_cop != null) patch.price_cop = Number(patch.price_cop);

  const { data, error } = await db
    .from("products")
    .update(patch)
    .eq("id", body.id)
    .select("*")
    .single();

  if (error) {
    console.error("Admin menu update error:", error);
    return NextResponse.json(
      { error: "No fue posible actualizar el producto." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, product: data });
}
