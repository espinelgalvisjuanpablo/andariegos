"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Image from "next/image";
import { useCart } from "@/components/cart-provider";
import { useLanguage } from "@/components/language-provider";
import { getCategories, getProducts } from "@/lib/supabase/menu";

type Category = {
  id: string;
  slug: string;
  name_es: string;
  name_en: string;
};

type Product = {
  id: string;
  slug: string;
  category_id: string;
  name_es: string;
  name_en: string;
  description_es: string | null;
  description_en: string | null;
  ingredients_es: string | null;
  ingredients_en: string | null;
  price_cop: number;
  image_url: string | null;
  status: "available" | "soon" | "soldout" | "hidden";
  is_spicy: boolean;
  is_featured: boolean;
  sort_order: number;
  categories?: {
    id: string;
    slug: string;
    name_es: string;
    name_en: string;
  } | null;
};

const categoryImages: Record<string, string> = {
  "entradas": "/images/plato-premio.jpeg",
  "pizzas": "/images/hamburguesa-hongos.jpeg",
  "hamburguesas": "/images/hamburguesa-hongos.jpeg",
  "arepas": "/images/plato-premio.jpeg",
  "mazorcada": "/images/huerta.jpeg",
  "cocina-del-mundo": "/images/plato-premio.jpeg",
  "postres-de-autor": "/images/postre-01.jpeg",
  "jugos": "/images/plato-premio.jpeg",
  "cocteles": "/images/plato-premio.jpeg",
  "cerveza": "/images/plato-premio.jpeg",
};

function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function MenuPage() {
  const [query, setQuery] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [restaurantStatus, setRestaurantStatus] = useState<{
    isOpen: boolean;
    reason: string;
    openingTime: string | null;
    closingTime: string | null;
    overrideEndsAt: string | null;
    message: string | null;
  } | null>(null);

  const { cart, add, remove, count } = useCart();
  const { lang } = useLanguage();
  const en = lang === "EN";

  useEffect(() => {
    const onScroll = () => {
      setScrollProgress(Math.min(1, window.scrollY / 900));
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    async function loadRestaurantStatus() {
      try {
        const response = await fetch("/api/restaurant-status", {
          cache: "no-store",
        });

        if (!response.ok) throw new Error("Status request failed");

        const data = await response.json();
        setRestaurantStatus(data.status ?? null);
      } catch (err) {
        console.error("Error loading restaurant status:", err);
      }
    }

    loadRestaurantStatus();

    const interval = window.setInterval(loadRestaurantStatus, 60000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    async function loadMenu() {
      try {
        setLoading(true);
        setError("");

        const [categoriesData, productsData] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);

        setCategories(categoriesData);
        setProducts(productsData);
      } catch (err) {
        console.error("Error loading menu:", err);
        setError(
          en
            ? "We couldn't load the menu. Please try again."
            : "No pudimos cargar el menú. Intenta nuevamente."
        );
      } finally {
        setLoading(false);
      }
    }

    loadMenu();
  }, [en]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return products;

    return products.filter((product) => {
      const searchable = [
        product.name_es,
        product.name_en,
        product.description_es,
        product.description_en,
        product.ingredients_es,
        product.ingredients_en,
        product.categories?.name_es,
        product.categories?.name_en,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(q);
    });
  }, [query, products]);

  const restaurantClosed = restaurantStatus?.isOpen === false;
  const exceptionalOpen = restaurantStatus?.reason === "temporary_open";
  const exceptionalClosed =
    restaurantStatus?.reason === "temporary_closed" ||
    restaurantStatus?.reason === "special_closure";

  const restaurantMessage = restaurantStatus?.message?.trim();

  return (
    <main className="menu-page">
      <section className="menu-intro">
        <div className="menu-ingredient-rail" aria-hidden="true">
          <span className="carrot-whole">🥕</span>
          <span className="carrot-slice slice-one">◯</span>
          <span className="carrot-slice slice-two">◯</span>
          <span className="carrot-slice slice-three">◯</span>
        </div>

        <p className="eyebrow">ANDARIEGOS · COCINA DE MUNDO</p>

        <h1>{en ? "Menu" : "Menú"}</h1>

        <p>
          {en
            ? "Search by dish or ingredient. Add what you like and keep moving."
            : "Busca por plato o ingrediente. Agrega lo que te guste y sigue."}
        </p>

        {restaurantStatus && (restaurantClosed || exceptionalOpen) && (
          <aside
            className={`restaurant-menu-notice ${restaurantClosed ? "is-closed" : "is-exceptional"}`}
            role="status"
          >
            <div>
              <span>
                {restaurantClosed
                  ? en
                    ? exceptionalClosed
                      ? "TEMPORARILY CLOSED"
                      : "CLOSED NOW"
                    : "CERRADO TEMPORALMENTE"
                  : en
                    ? "OPEN EXCEPTIONALLY"
                    : "ABIERTO EXCEPCIONALMENTE"}
              </span>

              <strong>
                {restaurantMessage ||
                  (restaurantClosed
                    ? en
                      ? "Orders are not available right now."
                      : "Los pedidos no están disponibles en este momento."
                    : en
                      ? "We are open outside our usual schedule today."
                      : "Hoy estamos abiertos fuera de nuestro horario habitual.")}
              </strong>

              {restaurantClosed &&
                restaurantStatus.openingTime &&
                restaurantStatus.closingTime && (
                  <small>
                    {en ? "Regular hours:" : "Horario habitual:"}{" "}
                    {restaurantStatus.openingTime} —{" "}
                    {restaurantStatus.closingTime}
                  </small>
                )}

              {restaurantStatus.overrideEndsAt && (
                <small>
                  {en ? "Until:" : "Hasta:"}{" "}
                  {new Intl.DateTimeFormat(en ? "en-US" : "es-CO", {
                    timeZone: "America/Bogota",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  }).format(new Date(restaurantStatus.overrideEndsAt))}
                </small>
              )}
            </div>
          </aside>
        )}

        <div className="menu-tools">
          <label className="search-field">
            <span>⌕</span>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                en
                  ? "Search dish or ingredient..."
                  : "Buscar plato o ingrediente..."
              }
            />
          </label>

          <a className="cart-summary-link" href="/checkout">
            <span>🛒</span>
            <b>{count}</b>
            <small>{en ? "YOUR CART" : "TU CARRITO"}</small>
          </a>
        </div>
      </section>

      {loading && (
        <section className="menu-loading">
          <p>{en ? "Loading menu..." : "Cargando menú..."}</p>
        </section>
      )}

      {!loading && error && (
        <section className="menu-loading">
          <p>{error}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
          >
            {en ? "Try again" : "Intentar nuevamente"}
          </button>
        </section>
      )}

      {!loading &&
        !error &&
        categories.map((category, index) => {
          const items = filtered.filter(
            (product) => product.category_id === category.id
          );

          if (!items.length) return null;

          const image = categoryImages[category.slug];

          return (
            <section className="menu-category" key={category.id}>
              <div className="category-heading">
                <div>
                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h2>
                    {en ? category.name_en : category.name_es}
                  </h2>
                </div>

                {image && (
                  <div className="category-image">
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="110px"
                    />
                  </div>
                )}

                <em>
                  {items.length}{" "}
                  {en
                    ? items.length === 1
                      ? "dish"
                      : "dishes"
                    : items.length === 1
                      ? "plato"
                      : "platos"}
                </em>
              </div>

              <div className="product-list">
                {items.map((product) => {
                  const isSoon = product.status === "soon";
                  const isSoldOut = product.status === "soldout";
                  const unavailable = isSoon || isSoldOut || restaurantClosed;

                  const name = en
                    ? product.name_en
                    : product.name_es;

                  const description = en
                    ? product.description_en
                    : product.description_es;

                  const ingredients = en
                    ? product.ingredients_en
                    : product.ingredients_es;

                  return (
                    <article
                      className={`product-row ${
                        unavailable ? "product-unavailable" : ""
                      }`}
                      key={product.id}
                    >
                      <div className="product-info">
                        <div className="product-title-line">
                          <h3>{name}</h3>

                          <strong>
                            {formatCOP(product.price_cop)}
                          </strong>
                        </div>

                        {description && <p>{description}</p>}

                        {ingredients && (
                          <small>{ingredients}</small>
                        )}

                        {product.is_spicy && (
                          <small className="product-spicy">
                            🌶️{" "}
                            {en ? "Spicy" : "Picante"}
                          </small>
                        )}

                        {isSoon && (
                          <small className="product-status">
                            {en
                              ? "Coming soon"
                              : "Próximamente disponible"}
                          </small>
                        )}

                        {isSoldOut && (
                          <small className="product-status">
                            {en ? "Sold out" : "Agotado"}
                          </small>
                        )}
                      </div>

                      <div className="quantity-control">
                        {unavailable ? (
                          <button
                            className="add-button"
                            type="button"
                            disabled
                          >
                            {restaurantClosed
                              ? en
                                ? "CLOSED"
                                : "CERRADO"
                              : isSoon
                                ? en
                                  ? "SOON"
                                  : "PRÓXIMAMENTE"
                                : en
                                  ? "SOLD OUT"
                                  : "AGOTADO"}
                          </button>
                        ) : cart[product.id] ? (
                          <>
                            <button
                              type="button"
                              aria-label={
                                en
                                  ? "Decrease quantity"
                                  : "Disminuir cantidad"
                              }
                              onClick={() => remove(product.id)}
                            >
                              −
                            </button>

                            <b>{cart[product.id]}</b>

                            <button
                              type="button"
                              aria-label={
                                en
                                  ? "Increase quantity"
                                  : "Aumentar cantidad"
                              }
                              onClick={() => add(product.id)}
                            >
                              +
                            </button>
                          </>
                        ) : (
                          <button
                            className="add-button"
                            type="button"
                            onClick={() => add(product.id)}
                          >
                            {en ? "ADD" : "AGREGAR"}
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}

      {!loading && !error && filtered.length === 0 && (
        <section className="menu-loading">
          <p>
            {en
              ? "No dishes match your search."
              : "No encontramos platos para esa búsqueda."}
          </p>
        </section>
      )}

      <div
        className="menu-scroll-note"
        style={
          {
            "--carrot-progress": scrollProgress,
          } as CSSProperties
        }
      >
        <span>🥕</span>

        <small>
          {en
            ? "A little kitchen movement as you browse."
            : "Un pequeño movimiento de cocina mientras recorres la carta."}
        </small>
      </div>
    </main>
  );
}