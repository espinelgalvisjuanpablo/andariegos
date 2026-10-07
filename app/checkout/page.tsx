"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { formatCOP } from "@/lib/menu-data";
import { useLanguage } from "@/components/language-provider";
import { createClient } from "@/lib/supabase/client";

type PaymentMethod = {
  id: string;
  slug: string;
  name_es: string;
  name_en: string;
  description_es: string | null;
  description_en: string | null;
};

type DeliveryType = "delivery" | "pickup";
type ScheduleType = "now" | "scheduled";

const DEFAULT_DELIVERY_FEE = 5000;
const DEFAULT_DELIVERY_RADIUS_KM = 5;
const DEFAULT_WHATSAPP_NUMBER = "573156771482";

export default function CheckoutPage() {
  const {
    items,
    total,
    add,
    remove,
    count,
    clear,
  } = useCart();

  const { lang } = useLanguage();
  const en = lang === "EN";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [address, setAddress] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [reference, setReference] = useState("");

  const [fulfillment, setFulfillment] =
    useState<DeliveryType>("delivery");

  const [payment, setPayment] = useState("");

  const [paymentMethods, setPaymentMethods] =
    useState<PaymentMethod[]>([]);

  const [loadingPaymentMethods, setLoadingPaymentMethods] =
    useState(true);

  const [cashAmount, setCashAmount] = useState("");

  const [schedule, setSchedule] =
    useState<ScheduleType>("now");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [error, setError] = useState("");

  const [sending, setSending] = useState(false);

  const [deliveryFeeSetting, setDeliveryFeeSetting] = useState(DEFAULT_DELIVERY_FEE);
  const [deliveryRadiusSetting, setDeliveryRadiusSetting] = useState(DEFAULT_DELIVERY_RADIUS_KM);
  const [whatsappNumber, setWhatsappNumber] = useState(DEFAULT_WHATSAPP_NUMBER);

  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    async function loadPaymentMethods() {
      try {
        const supabase = createClient();

        const {
          data,
          error: paymentError,
        } = await supabase
          .from("payment_methods")
          .select(
            "id, slug, name_es, name_en, description_es, description_en"
          )
          .eq("active", true)
          .order("sort_order", {
            ascending: true,
          });

        if (paymentError) {
          console.error(
            "Error loading payment methods:",
            paymentError
          );
          return;
        }

        const methods = data ?? [];

        setPaymentMethods(methods);
        setPayment("");
      } catch (paymentError) {
        console.error(
          "Unexpected payment methods error:",
          paymentError
        );
      } finally {
        setLoadingPaymentMethods(false);
      }
    }

    loadPaymentMethods();
  }, []);

  useEffect(() => {
    fetch("/api/public/settings")
      .then((r) => r.json())
      .then((data) => {
        const delivery = data.settings?.delivery || {};
        const whatsapp = data.settings?.whatsapp || {};
        setDeliveryFeeSetting(Number(delivery.fee_cop ?? DEFAULT_DELIVERY_FEE));
        setDeliveryRadiusSetting(Number(delivery.radius_km ?? DEFAULT_DELIVERY_RADIUS_KM));
        setWhatsappNumber(String(whatsapp.phone || DEFAULT_WHATSAPP_NUMBER).replace(/\\D/g, ""));
      })
      .catch(() => {});
  }, []);

  const selectedPaymentMethod = useMemo(() => {
    return (
      paymentMethods.find(
        (method) => method.slug === payment
      ) ?? null
    );
  }, [payment, paymentMethods]);

  const deliveryFee =
    fulfillment === "delivery" ? deliveryFeeSetting : 0;

  const finalTotal = total + deliveryFee;

  const itemSummary = useMemo(
    () =>
      items
        .map(
          ({ product, quantity }) =>
            `${quantity} x ${
              en ? product.name_en : product.name_es
            } — ${formatCOP(
              product.price_cop * quantity
            )}`
        )
        .join("\n"),
    [items, en]
  );

  function buildWhatsAppMessage(
    definitiveOrderNumber: string
  ) {
    const paymentName =
      selectedPaymentMethod
        ? en
          ? selectedPaymentMethod.name_en
          : selectedPaymentMethod.name_es
        : payment;

    const lines = [
      "ANDARIEGOS - COCINA DE MUNDO",
      "",
      `PEDIDO: ${definitiveOrderNumber}`,
      "------------------------------",
      "",
      en ? "PRODUCTS" : "PRODUCTOS",
      itemSummary,
      "",
      `${en ? "Subtotal" : "Subtotal"}: ${formatCOP(
        total
      )}`,
      fulfillment === "delivery"
        ? `${
            en ? "Delivery" : "Domicilio"
          }: ${formatCOP(DELIVERY_FEE)}`
        : en
        ? "Pickup: Restaurant"
        : "Recoger en el restaurante",
      `${
        en ? "ORDER TOTAL" : "TOTAL DEL PEDIDO"
      }: ${formatCOP(finalTotal)}`,
      "",
      en ? "CUSTOMER INFORMATION" : "DATOS DEL CLIENTE",
      `${en ? "Name" : "Nombre"}: ${name.trim()}`,
      `${en ? "Phone" : "Teléfono"}: ${phone.trim()}`,
      "",
      en ? "DELIVERY" : "ENTREGA",
      fulfillment === "delivery"
        ? `${en ? "Address" : "Dirección"}: ${address.trim()}`
        : en
        ? "Pickup: Restaurant"
        : "Modalidad: Recoger en restaurante",
      ...(fulfillment === "delivery" &&
      neighborhood.trim()
        ? [
            `${
              en ? "Neighborhood" : "Barrio"
            }: ${neighborhood.trim()}`,
          ]
        : []),
      ...(fulfillment === "delivery" &&
      reference.trim()
        ? [
            `${
              en ? "Reference" : "Referencia"
            }: ${reference.trim()}`,
          ]
        : []),
      "",
      `${en ? "Payment" : "Pago"}: ${paymentName}`,
      ...(payment === "cash" && cashAmount.trim()
        ? [
            `${
              en ? "Cash with" : "Paga con"
            }: ${cashAmount.trim()}`,
          ]
        : []),
      "",
      `${en ? "Timing" : "Entrega"}: ${
        schedule === "now"
          ? en
            ? "As soon as possible"
            : "Lo antes posible"
          : `${date} ${time}`
      }`,
      "",
      en
        ? "This is a request. Please confirm availability and payment instructions by WhatsApp."
        : "Esta es una solicitud. Por favor confirma disponibilidad e instrucciones de pago por WhatsApp.",
    ];

    return lines.join("\n");
  }

  async function handleSendOrder() {
    if (sending) return;

    setError("");

    if (!name.trim() || !phone.trim()) {
      setError(
        en
          ? "Please complete your name and phone number."
          : "Completa tu nombre y número de teléfono."
      );
      return;
    }

    if (!payment) {
      setError(
        en
          ? "Please choose a payment method."
          : "Selecciona un medio de pago."
      );
      return;
    }

    if (
      fulfillment === "delivery" &&
      (!address.trim() || !neighborhood.trim())
    ) {
      setError(
        en
          ? "Please complete your delivery address and neighborhood."
          : "Completa la dirección y el barrio para el domicilio."
      );
      return;
    }

    if (
      payment === "cash" &&
      !cashAmount.trim()
    ) {
      setError(
        en
          ? "Please indicate how much cash you will pay with."
          : "Indica con cuánto vas a pagar en efectivo."
      );
      return;
    }

    if (
      schedule === "scheduled" &&
      (!date || !time)
    ) {
      setError(
        en
          ? "Please choose the date and time."
          : "Elige la fecha y hora."
      );
      return;
    }

    if (!items.length) {
      setError(
        en
          ? "Your cart is empty."
          : "Tu carrito está vacío."
      );
      return;
    }

    if (!selectedPaymentMethod) {
      setError(
        en
          ? "The selected payment method is unavailable."
          : "El medio de pago seleccionado no está disponible."
      );
      return;
    }

    setSending(true);

    try {
      const response = await fetch(
        "/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_name: name.trim(),
            customer_phone: phone.trim(),

            delivery_type: fulfillment,

            address:
              fulfillment === "delivery"
                ? address.trim()
                : null,

            address_reference:
              fulfillment === "delivery"
                ? [
                    neighborhood.trim(),
                    reference.trim(),
                  ]
                    .filter(Boolean)
                    .join(" | ")
                : null,

            payment_method_id:
              selectedPaymentMethod.id,

            cash_change_for_cop:
              payment === "cash" &&
              cashAmount.trim()
                ? Number(
                    cashAmount.replace(/\D/g, "")
                  )
                : null,

            subtotal_cop: total,

            delivery_fee_cop:
              deliveryFee,

            total_cop: finalTotal,

            notes:
              schedule === "scheduled"
                ? `Pedido programado: ${date} ${time}`
                : null,

            items: items.map(
              ({ product, quantity }) => ({
                product_id: product.id,

                product_name_es:
                  product.name_es,

                product_name_en:
                  product.name_en,

                unit_price_cop:
                  product.price_cop,

                quantity,
              })
            ),
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error ||
            (en
              ? "Unable to register the order."
              : "No fue posible registrar el pedido.")
        );
      }

      const definitiveOrderNumber =
        `AND-${String(
          data.order_number
        ).padStart(4, "0")}`;

      setOrderNumber(
        definitiveOrderNumber
      );

      const whatsappMessage =
        buildWhatsAppMessage(
          definitiveOrderNumber
        );

      const whatsappUrl =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
          whatsappMessage
        )}`;

      window.open(
        whatsappUrl,
        "_blank",
        "noopener,noreferrer"
      );

      setSubmitted(true);

      clear();
    } catch (submitError) {
      console.error(
        "Error submitting order:",
        submitError
      );

      setError(
        submitError instanceof Error
          ? submitError.message
          : en
          ? "An unexpected error occurred."
          : "Ocurrió un error inesperado."
      );
    } finally {
      setSending(false);
    }
  }

  /*
   * ==========================================================
   * CONFIRMACIÓN FINAL
   * ==========================================================
   */

  if (submitted) {
    return (
      <main className="checkout-page checkout-success-page">
        <section className="checkout-success">
          <div className="checkout-success-decoration checkout-success-decoration-left" />
          <div className="checkout-success-decoration checkout-success-decoration-right" />

          <div className="checkout-success-inner">

            <div className="checkout-success-brand">
              <span className="checkout-success-brand-line" />
              <span>ANDARIEGOS</span>
              <span className="checkout-success-brand-line" />
            </div>

            <div className="checkout-success-mark">
              <span />
              <span />
              <span />
            </div>

            <p className="checkout-success-label">
              {en
                ? "ORDER SENT"
                : "SOLICITUD ENVIADA"}
            </p>

            <p className="checkout-success-intro">
              {en
                ? "Your request has reached Andariegos."
                : "Tu solicitud ya llegó a Andariegos."}
            </p>

            <div className="checkout-order-number">
              <span className="checkout-order-title">
                {en ? "ORDER" : "PEDIDO"}
              </span>

              <strong>
                {orderNumber}
              </strong>
            </div>

            <div className="checkout-success-rule">
              <span />
              <i />
              <span />
            </div>

            <p className="checkout-success-text">
              {en
                ? "We will contact you via WhatsApp to confirm availability and payment instructions."
                : "Te contactaremos por WhatsApp para confirmar disponibilidad e instrucciones de pago."}
            </p>

            <Link
              href="/"
              className="checkout-home-button"
            >
              <span>
                {en
                  ? "BACK TO HOME"
                  : "VOLVER AL INICIO"}
              </span>
              <b>↗</b>
            </Link>

            <p className="checkout-success-footer">
              {en
                ? "COCINA DE MUNDO · SIMIJACÁ"
                : "COCINA DE MUNDO · SIMIJACÁ"}
            </p>

          </div>
        </section>
      </main>
    );
  }

  if (!count) {
    return (
      <main className="checkout-page">
        <section className="checkout-shell">
          <div className="empty-checkout">
            <div className="empty-symbol">
              🍃
            </div>

            <h2>
              {en
                ? "Your cart is empty."
                : "Tu carrito está vacío."}
            </h2>

            <p>
              {en
                ? "Open the menu and add something good before checking out."
                : "Abre el menú y agrega algo rico antes de continuar."}
            </p>

            <Link
              className="button button-primary"
              href="/menu"
            >
              {en
                ? "GO TO MENU"
                : "IR AL MENÚ"}
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <section className="checkout-shell">

        <div className="checkout-heading">
          <p className="eyebrow">
            {en
              ? "YOUR ORDER"
              : "TU PEDIDO"}
          </p>

          <h1>
            {en
              ? "Ready when you are."
              : "Listo cuando tú estés."}
          </h1>

          <p>
            {en
              ? "Complete the request first; WhatsApp is the final handoff to Andariegos."
              : "Primero completa la solicitud; WhatsApp es el último paso para enviársela a Andariegos."}
          </p>
        </div>

        <div className="checkout-grid">

          <div className="order-card">

            <div className="order-card-head">
              <h2>
                {en
                  ? "Your selection"
                  : "Tu selección"}
              </h2>

              <button
                type="button"
                onClick={clear}
              >
                {en
                  ? "Clear"
                  : "Vaciar"}
              </button>
            </div>

            {items.map(
              ({
                product,
                quantity,
              }) => (
                <div
                  className="order-line"
                  key={product.id}
                >

                  <div>
                    <b>
                      {en
                        ? product.name_en
                        : product.name_es}
                    </b>

                    <small>
                      {en
                        ? product.description_en
                        : product.description_es}
                    </small>
                  </div>

                  <div className="order-qty">

                    <button
                      type="button"
                      onClick={() =>
                        remove(product.id)
                      }
                      aria-label={
                        en
                          ? "Remove one"
                          : "Quitar uno"
                      }
                    >
                      −
                    </button>

                    <b>{quantity}</b>

                    <button
                      type="button"
                      onClick={() =>
                        add(product.id)
                      }
                      aria-label={
                        en
                          ? "Add one"
                          : "Agregar uno"
                      }
                    >
                      +
                    </button>

                  </div>

                  <strong>
                    {formatCOP(
                      product.price_cop *
                        quantity
                    )}
                  </strong>

                </div>
              )
            )}

            <div className="order-total">
              <span>
                Subtotal
              </span>

              <b>
                {formatCOP(total)}
              </b>
            </div>

            <div className="order-total">
              <span>
                {en
                  ? "Delivery"
                  : "Domicilio"}
              </span>

              <b>
                {formatCOP(
                  deliveryFee
                )}
              </b>
            </div>

            <div className="order-total checkout-grand-total">
              <span>
                TOTAL
              </span>

              <b>
                {formatCOP(
                  finalTotal
                )}
              </b>
            </div>

          </div>

          <aside className="request-card checkout-form-card">

            <p className="eyebrow">
              {en
                ? "REQUEST DETAILS"
                : "DATOS DE LA SOLICITUD"}
            </p>

            <h2>
              {en
                ? "Before WhatsApp"
                : "Antes de WhatsApp"}
            </h2>

            <p>
              {en
                ? "These details travel with your order so the restaurant can review it."
                : "Estos datos viajan con tu pedido para que el restaurante pueda revisarlo."}
            </p>

            <div className="checkout-fields">

              <label>
                {en
                  ? "Name *"
                  : "Nombre *"}

                <input
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  placeholder={
                    en
                      ? "Your name"
                      : "Tu nombre"
                  }
                  autoComplete="name"
                />
              </label>

              <label>
                {en
                  ? "Phone *"
                  : "Teléfono *"}

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value
                    )
                  }
                  placeholder="300 000 0000"
                  autoComplete="tel"
                />
              </label>

              <div className="field-label">
                {en
                  ? "How do you receive it? *"
                  : "¿Cómo lo recibes? *"}
              </div>

              <div className="choice-row">

                <button
                  type="button"
                  className={
                    fulfillment ===
                    "delivery"
                      ? "choice active"
                      : "choice"
                  }
                  onClick={() =>
                    setFulfillment(
                      "delivery"
                    )
                  }
                >
                  {en
                    ? "Delivery"
                    : "Domicilio"}
                </button>

                <button
                  type="button"
                  className={
                    fulfillment ===
                    "pickup"
                      ? "choice active"
                      : "choice"
                  }
                  onClick={() =>
                    setFulfillment(
                      "pickup"
                    )
                  }
                >
                  {en
                    ? "Pickup"
                    : "Recoger"}
                </button>

              </div>

              {fulfillment ===
                "delivery" && (
                <div className="address-fields">

                  <label>
                    {en
                      ? "Address *"
                      : "Dirección *"}

                    <input
                      value={address}
                      onChange={(e) =>
                        setAddress(
                          e.target.value
                        )
                      }
                      placeholder={
                        en
                          ? "Street, number"
                          : "Calle, número"
                      }
                      autoComplete="street-address"
                    />
                  </label>

                  <label>
                    {en
                      ? "Neighborhood *"
                      : "Barrio *"}

                    <input
                      value={
                        neighborhood
                      }
                      onChange={(e) =>
                        setNeighborhood(
                          e.target.value
                        )
                      }
                      placeholder={
                        en
                          ? "Neighborhood"
                          : "Barrio"
                      }
                    />
                  </label>

                  <label>
                    {en
                      ? "Reference"
                      : "Referencia"}

                    <input
                      value={reference}
                      onChange={(e) =>
                        setReference(
                          e.target.value
                        )
                      }
                      placeholder={
                        en
                          ? "Gate, house, landmark..."
                          : "Portería, casa, punto de referencia..."
                      }
                    />
                  </label>

                </div>
              )}

              <div className="field-label">
                {en
                  ? "Payment method *"
                  : "Medio de pago *"}
              </div>

              {loadingPaymentMethods ? (
                <p>
                  {en
                    ? "Loading payment methods..."
                    : "Cargando métodos de pago..."}
                </p>
              ) : (
                <div className="choice-grid">

                  {paymentMethods.map(
                    (method) => (
                      <button
                        key={method.id}
                        type="button"
                        className={
                          payment ===
                          method.slug
                            ? "choice active"
                            : "choice"
                        }
                        onClick={() =>
                          setPayment(
                            method.slug
                          )
                        }
                      >
                        {en
                          ? method.name_en
                          : method.name_es}
                      </button>
                    )
                  )}

                </div>
              )}

              {selectedPaymentMethod && (
                <small className="selected-payment-description">
                  {en
                    ? selectedPaymentMethod.description_en
                    : selectedPaymentMethod.description_es}
                </small>
              )}

              {payment ===
                "cash" && (
                <label>
                  {en
                    ? "How much will you pay with? *"
                    : "¿Con cuánto vas a pagar? *"}

                  <input
                    inputMode="numeric"
                    value={
                      cashAmount
                    }
                    onChange={(e) =>
                      setCashAmount(
                        e.target.value
                      )
                    }
                    placeholder={
                      en
                        ? "$ 50,000"
                        : "$ 50.000"
                    }
                  />
                </label>
              )}

              <div className="field-label">
                {en
                  ? "When? *"
                  : "¿Cuándo? *"}
              </div>

              <div className="choice-row">

                <button
                  type="button"
                  className={
                    schedule ===
                    "now"
                      ? "choice active"
                      : "choice"
                  }
                  onClick={() =>
                    setSchedule(
                      "now"
                    )
                  }
                >
                  {en
                    ? "As soon as possible"
                    : "Lo antes posible"}
                </button>

                <button
                  type="button"
                  className={
                    schedule ===
                    "scheduled"
                      ? "choice active"
                      : "choice"
                  }
                  onClick={() =>
                    setSchedule(
                      "scheduled"
                    )
                  }
                >
                  {en
                    ? "Schedule"
                    : "Programar"}
                </button>

              </div>

              {schedule ===
                "scheduled" && (
                <div className="schedule-grid">

                  <label>
                    {en
                      ? "Date *"
                      : "Fecha *"}

                    <input
                      type="date"
                      value={date}
                      onChange={(e) =>
                        setDate(
                          e.target.value
                        )
                      }
                    />
                  </label>

                  <label>
                    {en
                      ? "Time *"
                      : "Hora *"}

                    <input
                      type="time"
                      value={time}
                      onChange={(e) =>
                        setTime(
                          e.target.value
                        )
                      }
                    />
                  </label>

                </div>
              )}

            </div>

            {error && (
              <p
                className="form-error"
                role="alert"
              >
                {error}
              </p>
            )}

            <div className="checkout-note">
              <b>
                {en
                  ? "Delivery"
                  : "Domicilios"}
              </b>

              <span>
                {en
                  ? `Own delivery service · provisional fee ${formatCOP(
                      deliveryFeeSetting
                    )} · radius ${deliveryRadiusSetting} km.`
                  : `Servicio propio · tarifa provisional ${formatCOP(
                      DELIVERY_FEE
                    )} · radio de ${DELIVERY_RADIUS_KM} km.`}
              </span>
            </div>

            <div className="checkout-note">
              <b>
                {en
                  ? "Payments"
                  : "Pagos"}
              </b>

              <span>
                {paymentMethods.length
                  ? paymentMethods
                      .map(
                        (method) =>
                          en
                            ? method.name_en
                            : method.name_es
                      )
                      .join(" · ")
                  : "Nequi · Daviplata · Bre-B / Llave · Efectivo"}
              </span>
            </div>

            <button
              type="button"
              className="button button-primary full-button checkout-submit"
              onClick={
                handleSendOrder
              }
              disabled={
                sending ||
                loadingPaymentMethods
              }
            >
              {sending
                ? en
                  ? "SENDING..."
                  : "ENVIANDO..."
                : en
                ? "SEND TO ANDARIEGOS"
                : "ENVIAR A ANDARIEGOS"}
            </button>

            <p className="microcopy">
              {en
                ? "This sends a request; Andariegos confirms availability and payment instructions in WhatsApp."
                : "Esto envía una solicitud; Andariegos confirma disponibilidad e instrucciones de pago en WhatsApp."}
            </p>

          </aside>

        </div>
      </section>
    </main>
  );
}