"use client";

import { useEffect, useState } from "react";
import { getCategories, getProducts } from "@/lib/supabase/menu";

export default function TestSupabasePage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [categoriesData, productsData] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);

        setCategories(categoriesData);
        setProducts(productsData);
      } catch (err) {
        console.error(err);
        setError("Error cargando datos desde Supabase.");
      }
    }

    load();
  }, []);

  return (
    <main style={{ padding: 32 }}>
      <h1>Supabase test</h1>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      <h2>Categorías: {categories.length}</h2>

      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            {category.name_es} — {category.name_en}
          </li>
        ))}
      </ul>

      <h2>Productos: {products.length}</h2>

      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <strong>{product.name_es}</strong>
            {" — "}
            {product.name_en}
            {" — $"}
            {product.price_cop}
            {" — "}
            {product.categories?.name_es ?? "Sin categoría"}
          </li>
        ))}
      </ul>
    </main>
  );
}