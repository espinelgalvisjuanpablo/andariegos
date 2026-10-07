import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export async function GET() {
  const [
    { data: products, error: productError },
    { data: categories, error: categoryError },
    { data: stored, error: inventoryError },
  ] = await Promise.all([
    db
      .from("products")
      .select("*")
      .neq("status", "hidden")
      .order("sort_order", { ascending: true }),
    db
      .from("categories")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true }),
    db
      .from("site_settings")
      .select("value_json")
      .eq("key", "inventory")
      .maybeSingle(),
  ]);

  if (productError || categoryError || inventoryError) {
    console.error("Public menu load error:", {
      productError,
      categoryError,
      inventoryError,
    });

    return NextResponse.json(
      { error: "No fue posible cargar el menú." },
      { status: 500 }
    );
  }

  const inventory = Array.isArray(stored?.value_json) ? stored.value_json : [];
  const now = Date.now();

  const exhausted = new Set(
    inventory
      .filter(
        (item: any) =>
          Number(item.quantity) <= 0 &&
          (!item.soldout_until ||
            new Date(item.soldout_until).getTime() > now)
      )
      .map((item: any) => String(item.ingredient_id || item.id))
  );

  let finalProducts = products || [];

  if (exhausted.size) {
    const { data: links, error: linksError } = await db
      .from("product_ingredients")
      .select("product_id,ingredient_id");

    if (linksError) {
      console.error("Public menu ingredient link error:", linksError);
      return NextResponse.json(
        { error: "No fue posible cargar la disponibilidad del menú." },
        { status: 500 }
      );
    }

    const blocked = new Set(
      (links || [])
        .filter((link: any) => exhausted.has(String(link.ingredient_id)))
        .map((link: any) => String(link.product_id))
    );

    finalProducts = finalProducts.map((product: any) =>
      blocked.has(String(product.id))
        ? { ...product, status: "soldout" }
        : product
    );
  }

  return NextResponse.json(
    {
      products: finalProducts,
      categories: categories || [],
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
