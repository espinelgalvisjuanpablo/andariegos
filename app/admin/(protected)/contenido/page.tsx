"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const templates = [
  {
    title_es: "Una mesa para quedarse",
    title_en: "A table worth staying for",
    description_es: "Una invitación a conocer Andariegos, comer sin afán y descubrir Simijaca.",
    description_en: "An invitation to discover Andariegos, eat without rushing and discover Simijaca.",
  },
  {
    title_es: "Cocinas de otros mundos",
    title_en: "Cuisines from other worlds",
    description_es: "Historias, platos de autor e ingredientes que traen otros lugares hasta nuestra mesa.",
    description_en: "Stories, signature dishes and ingredients that bring other places to our table.",
  },
  {
    title_es: "Ven a descubrir Simijaca",
    title_en: "Come discover Simijaca",
    description_es: "Una escapada de sabor para quienes quieren conocer el municipio y quedarse un rato.",
    description_en: "A flavorful escape for people who want to discover the town and stay awhile.",
  },
];

export default function ContenidoPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const response = await fetch("/api/admin/content", { cache: "no-store" });
      const data = await response.json();
      setItems(data.content?.highlights || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    const next = items.filter((item) => item.id !== id);
    const response = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ highlights: next }),
    });

    if (response.ok) setItems(next);
  }

  return (
    <main className="admin-page">
      <section className="admin-head">
        <p className="eyebrow">MARCA</p>
        <h1>Contenido</h1>
        <p>
          Historias, destacados y promociones para que más personas conozcan
          Andariegos y quieran visitarlo.
        </p>
      </section>

      <section className="admin-content-list">
        <div className="admin-section-heading">
          <div>
            <p className="eyebrow">BIBLIOTECA</p>
            <h2>Destacados</h2>
          </div>
          <Link className="button button-primary" href="/admin/contenido/editar">
            NUEVO DESTACADO
          </Link>
        </div>

        {loading ? (
          <p className="admin-empty">Cargando…</p>
        ) : items.length === 0 ? (
          <p className="admin-empty">
            Todavía no hay destacados. Empieza con una historia, una promoción
            o una invitación a conocer Simijaca.
          </p>
        ) : (
          items.map((item: any) => (
            <article key={item.id} className="admin-content-item admin-content-item-rich">
              {item.image_url ? (
                <img src={item.image_url} alt="" />
              ) : (
                <div className="admin-content-placeholder">SIN IMAGEN</div>
              )}

              <div>
                <span>{String(item.status || "draft").toUpperCase()}</span>
                <h3>{item.title_es || "Sin título"}</h3>
                <p>{item.description_es || "Sin descripción"}</p>

                {item.publish_at && (
                  <small>
                    Publicación:{" "}
                    {new Intl.DateTimeFormat("es-CO", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(item.publish_at))}
                  </small>
                )}

                <div className="admin-content-item-actions">
                  <Link
                    className="admin-inline-button"
                    href={`/admin/contenido/editar?id=${encodeURIComponent(item.id)}`}
                  >
                    EDITAR
                  </Link>
                  <button
                    className="admin-inline-button danger"
                    onClick={() => remove(item.id)}
                  >
                    ELIMINAR
                  </button>
                </div>
              </div>
            </article>
          ))
        )}

        <section className="admin-config-card admin-content-templates">
          <div className="admin-section-heading">
            <div>
              <p className="eyebrow">IDEAS</p>
              <h2>Borradores para empezar</h2>
              <p>
                Son propuestas editables; no se publican hasta que las guardes
                como contenido.
              </p>
            </div>
          </div>

          <div className="admin-template-grid">
            {templates.map((template, index) => (
              <article key={index}>
                <span>BORRADOR</span>
                <h3>{template.title_es}</h3>
                <p>{template.description_es}</p>
                <Link
                  className="button"
                  href={`/admin/contenido/editar?draft=${index}`}
                >
                  USAR BORRADOR
                </Link>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
