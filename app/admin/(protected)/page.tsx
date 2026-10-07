"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import {
  getRestaurantSettings,
  type RestaurantSettings,
} from "@/lib/supabase/restaurant";

import {
  getRestaurantStatus,
  type RestaurantStatus,
} from "@/lib/supabase/restaurant-status";

type ClosureReason =
  | "temporary"
  | "private_event"
  | "admin_decision"
  | "other";

const quickActions = [
  {
    href: "/admin/pedidos",
    eyebrow: "OPERACIÓN",
    title: "Pedidos",
    description:
      "Revisa las solicitudes recibidas y su información.",
  },
  {
    href: "/admin/reservas",
    eyebrow: "MESA",
    title: "Reservas",
    description:
      "Consulta y gestiona las solicitudes de reserva.",
  },
  {
    href: "/admin/menu",
    eyebrow: "CARTA",
    title: "Menú",
    description:
      "Productos, precios, ingredientes y disponibilidad.",
  },
  {
    href: "/admin/contenido",
    eyebrow: "MARCA",
    title: "Contenido",
    description:
      "Historias, avisos, destacados y contenido de Simijacá.",
  },
  {
    href: "/admin/configuracion",
    eyebrow: "SISTEMA",
    title: "Configuración",
    description:
      "Domicilios, pagos, WhatsApp y parámetros generales.",
  },
];

const reasonOptions: {
  value: ClosureReason;
  label: string;
}[] = [
  {
    value: "temporary",
    label: "Cierre temporal",
  },
  {
    value: "private_event",
    label: "Evento privado",
  },
  {
    value: "admin_decision",
    label: "Decisión del administrador",
  },
  {
    value: "other",
    label: "Otro",
  },
];

function getDefaultStart() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    now.getDate()
  ).padStart(2, "0");
  const hours = String(
    now.getHours()
  ).padStart(2, "0");
  const minutes = String(
    now.getMinutes()
  ).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function getDefaultEnd() {
  const now = new Date();

  now.setHours(
    now.getHours() + 2
  );

  const year = now.getFullYear();
  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    now.getDate()
  ).padStart(2, "0");
  const hours = String(
    now.getHours()
  ).padStart(2, "0");
  const minutes = String(
    now.getMinutes()
  ).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function getStatusLabel(
  status: RestaurantStatus
) {
  if (status.isOpen) {
    return "ABIERTO";
  }

  return "CERRADO";
}

function getClosureDescription(
  status: RestaurantStatus
) {
  if (
    status.reason ===
    "special_closure"
  ) {
    if (status.closureMessage) {
      return status.closureMessage;
    }

    return (
      status.closureReason ??
      "Cierre especial"
    );
  }

  if (!status.openingTime) {
    return "Hoy no tenemos servicio.";
  }

  if (
    status.closingTime &&
    status.timeLabel
  ) {
    return "Fuera del horario de servicio.";
  }

  return "Fuera del horario de servicio.";
}

export default function AdminPage() {
  const [settings, setSettings] =
    useState<RestaurantSettings | null>(
      null
    );

  const [status, setStatus] =
    useState<RestaurantStatus | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [selectedReason, setSelectedReason] =
    useState<ClosureReason>(
      "temporary"
    );

  const [message, setMessage] =
    useState("");

  const [startsAt, setStartsAt] =
    useState(getDefaultStart());

  const [endsAt, setEndsAt] =
    useState(getDefaultEnd());

  const [saving, setSaving] =
    useState(false);

  const loadRestaurant = useCallback(
    async () => {
      try {
        setError("");

        const restaurant =
          await getRestaurantSettings();

        if (!restaurant) {
          throw new Error(
            "No existe la configuración del restaurante."
          );
        }

        const restaurantStatus =
          getRestaurantStatus(
            restaurant
          );

        setSettings(restaurant);
        setStatus(
          restaurantStatus
        );
      } catch (loadError) {
        console.error(
          "Error loading restaurant:",
          loadError
        );

        setError(
          "No fue posible cargar el estado del restaurante."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadRestaurant();

    const interval =
      window.setInterval(() => {
        loadRestaurant();
      }, 60_000);

    return () =>
      window.clearInterval(
        interval
      );
  }, [loadRestaurant]);

  async function handleCloseRestaurant() {
    if (
      !selectedReason ||
      !startsAt ||
      !endsAt
    ) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response =
        await fetch(
          "/api/admin/restaurant-status",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              action: "close",
              reason: selectedReason,
              message,
              starts_at: new Date(
                startsAt
              ).toISOString(),
              ends_at: new Date(
                endsAt
              ).toISOString(),
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "No fue posible cerrar el restaurante."
        );
      }

      setModalOpen(false);
      setMessage("");

      await loadRestaurant();
    } catch (closeError) {
      console.error(
        "Error closing restaurant:",
        closeError
      );

      setError(
        closeError instanceof Error
          ? closeError.message
          : "No fue posible cerrar el restaurante."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleOpenRestaurant() {
    setSaving(true);
    setError("");

    try {
      const response =
        await fetch(
          "/api/admin/restaurant-status",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              action: "open",
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "No fue posible abrir el restaurante."
        );
      }

      await loadRestaurant();
    } catch (openError) {
      console.error(
        "Error opening restaurant:",
        openError
      );

      setError(
        openError instanceof Error
          ? openError.message
          : "No fue posible abrir el restaurante."
      );
    } finally {
      setSaving(false);
    }
  }

  function openCloseModal() {
    setStartsAt(
      getDefaultStart()
    );

    setEndsAt(
      getDefaultEnd()
    );

    setSelectedReason(
      "temporary"
    );

    setMessage("");

    setError("");

    setModalOpen(true);
  }

  if (loading) {
    return (
      <main className="admin-page">
        <section className="admin-head">
          <div>
            <p className="eyebrow">
              ESCRITORIO DE ANDARIEGOS
            </p>

            <h1>Inicio</h1>

            <p>
              Cargando el estado del
              restaurante...
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (!status || !settings) {
    return (
      <main className="admin-page">
        <section className="admin-head">
          <div>
            <p className="eyebrow">
              ESCRITORIO DE ANDARIEGOS
            </p>

            <h1>Inicio</h1>

            <p>
              No fue posible cargar la
              información del restaurante.
            </p>

            {error && (
              <p className="admin-login-error">
                {error}
              </p>
            )}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <section className="admin-head">
        <div>
          <p className="eyebrow">
            ESCRITORIO DE ANDARIEGOS
          </p>

          <h1>Inicio</h1>

          <p>
            Un espacio sencillo para
            administrar la operación
            digital de Andariegos.
          </p>
        </div>
      </section>

      {error && (
        <div className="admin-dashboard-alert">
          {error}
        </div>
      )}

      <section className="admin-section">
        <div className="admin-section-heading">
          <div>
            <p className="eyebrow">
              OPERACIÓN
            </p>

            <h2>
              Estado del restaurante
            </h2>
          </div>

          <span className="admin-section-note">
            ACTUALIZACIÓN AUTOMÁTICA
          </span>
        </div>

        <article
          className={`admin-restaurant-status ${
            status.isOpen
              ? "is-open"
              : "is-closed"
          }`}
        >
          <div className="admin-restaurant-status-main">
            <div className="admin-restaurant-status-indicator">
              <span />
            </div>

            <div>
              <p className="admin-restaurant-status-label">
                {getStatusLabel(status)}
              </p>

              <h3>
                {status.dayName}
              </h3>

              <p className="admin-restaurant-status-date">
                {status.dateLabel}
              </p>

              <p className="admin-restaurant-status-time">
                {status.timeLabel}
              </p>
            </div>
          </div>

          <div className="admin-restaurant-status-info">
            <div>
              <span>HORARIO DE HOY</span>

              <strong>
                {status.openingTime &&
                status.closingTime
                  ? `${status.openingTime} — ${status.closingTime}`
                  : "SIN SERVICIO"}
              </strong>
            </div>

            <div>
              <span>
                {status.isOpen
                  ? "ESTADO"
                  : status.reason ===
                    "special_closure"
                  ? status.closureReason ??
                    "CIERRE ESPECIAL"
                  : "INFORMACIÓN"}
              </span>

              <strong>
                {status.isOpen
                  ? "Servicio activo"
                  : getClosureDescription(
                      status
                    )}
              </strong>
            </div>

            {status.reason ===
              "special_closure" &&
              status.specialClosureEndsAt && (
                <div>
                  <span>
                    REAPERTURA PROGRAMADA
                  </span>

                  <strong>
                    {new Intl.DateTimeFormat(
                      "es-CO",
                      {
                        timeZone:
                          "America/Bogota",
                        weekday:
                          "long",
                        day: "numeric",
                        month: "long",
                        hour: "numeric",
                        minute:
                          "2-digit",
                        hour12: true,
                      }
                    ).format(
                      new Date(
                        status.specialClosureEndsAt
                      )
                    )}
                  </strong>
                </div>
              )}
          </div>

          <div className="admin-restaurant-status-action">
            {status.isOpen ? (
              <button
                type="button"
                className="button button-primary"
                onClick={
                  openCloseModal
                }
                disabled={saving}
              >
                CERRAR RESTAURANTE
              </button>
            ) : (
              <button
                type="button"
                className="button button-primary"
                onClick={
                  handleOpenRestaurant
                }
                disabled={saving}
              >
                {saving
                  ? "ABRIENDO..."
                  : "ABRIR RESTAURANTE"}
              </button>
            )}
          </div>
        </article>
      </section>

      <section className="admin-section">
        <div className="admin-section-heading">
          <div>
            <p className="eyebrow">
              ADMINISTRACIÓN
            </p>

            <h2>
              Accesos rápidos
            </h2>
          </div>
        </div>

        <div className="admin-grid">
          {quickActions.map(
            (action) => (
              <Link
                key={action.href}
                href={action.href}
                className="admin-card admin-card-link"
              >
                <span>
                  {action.eyebrow}
                </span>

                <h2>
                  {action.title}
                </h2>

                <p>
                  {action.description}
                </p>

                <strong>
                  ABRIR →
                </strong>
              </Link>
            )
          )}
        </div>
      </section>

      {modalOpen && (
        <div
          className="admin-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setModalOpen(false);
            }
          }}
        >
          <section
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="close-restaurant-title"
          >
            <div className="admin-modal-header">
              <div>
                <p className="eyebrow">
                  CONTROL DE OPERACIÓN
                </p>

                <h2 id="close-restaurant-title">
                  Cerrar restaurante
                </h2>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={() =>
                  setModalOpen(false)
                }
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            <p className="admin-modal-intro">
              Configura el cierre antes de
              confirmarlo. El horario semanal
              de Andariegos no será modificado.
            </p>

            <div className="admin-modal-field">
              <label htmlFor="closure-reason">
                Motivo
              </label>

              <select
                id="closure-reason"
                value={
                  selectedReason
                }
                onChange={(event) =>
                  setSelectedReason(
                    event.target
                      .value as ClosureReason
                  )
                }
              >
                {reasonOptions.map(
                  (option) => (
                    <option
                      key={
                        option.value
                      }
                      value={
                        option.value
                      }
                    >
                      {option.label}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="admin-modal-field">
              <label htmlFor="closure-message">
                Mensaje opcional
              </label>

              <textarea
                id="closure-message"
                value={message}
                onChange={(event) =>
                  setMessage(
                    event.target.value
                  )
                }
                placeholder="Ej. Hoy atendemos un evento privado."
                rows={3}
              />
            </div>

            <div className="admin-modal-grid">
              <div className="admin-modal-field">
                <label htmlFor="closure-start">
                  Inicio
                </label>

                <input
                  id="closure-start"
                  type="datetime-local"
                  value={startsAt}
                  onChange={(event) =>
                    setStartsAt(
                      event.target
                        .value
                    )
                  }
                />
              </div>

              <div className="admin-modal-field">
                <label htmlFor="closure-end">
                  Reapertura
                </label>

                <input
                  id="closure-end"
                  type="datetime-local"
                  value={endsAt}
                  onChange={(event) =>
                    setEndsAt(
                      event.target
                        .value
                    )
                  }
                />
              </div>
            </div>

            {error && (
              <p className="admin-modal-error">
                {error}
              </p>
            )}

            <div className="admin-modal-actions">
              <button
                type="button"
                className="button button-secondary"
                onClick={() =>
                  setModalOpen(false)
                }
                disabled={saving}
              >
                CANCELAR
              </button>

              <button
                type="button"
                className="button button-primary"
                onClick={
                  handleCloseRestaurant
                }
                disabled={saving}
              >
                {saving
                  ? "GUARDANDO..."
                  : "CONFIRMAR CIERRE"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}