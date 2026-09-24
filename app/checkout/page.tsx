"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { formatCOP } from "@/lib/menu-data";
import { useLanguage } from "@/components/language-provider";

export default function CheckoutPage(){
  const {items,total,add,remove,count,clear}=useCart();
  const {lang}=useLanguage();
  const en=lang==="EN";
  const [name,setName]=useState("");
  const [phone,setPhone]=useState("");
  const [address,setAddress]=useState("");
  const [neighborhood,setNeighborhood]=useState("");
  const [reference,setReference]=useState("");
  const [fulfillment,setFulfillment]=useState<"delivery"|"pickup">("delivery");
  const [payment,setPayment]=useState<"nequi"|"daviplata"|"bre-b"|"cash"|"">("");
  const [cashAmount,setCashAmount]=useState("");
  const [schedule,setSchedule]=useState<"now"|"scheduled">("now");
  const [date,setDate]=useState("");
  const [time,setTime]=useState("");
  const [error,setError]=useState("");

  const itemSummary=useMemo(
    ()=>items.map(({product,quantity})=>`${quantity} x ${product.name} — ${formatCOP(product.price*quantity)}`).join("\n"),
    [items]
  );

  function buildWhatsApp(){
    if(!name.trim()||!phone.trim()||!payment||(fulfillment==="delivery"&&(!address.trim()||!neighborhood.trim()))){
      setError(en?"Please complete the required fields before sending.":"Completa los campos obligatorios antes de enviar.");
      return;
    }
    if(payment==="cash"&&!cashAmount.trim()){
      setError(en?"Tell Andariegos how much cash you will pay with.":"Indica con cuánto vas a pagar en efectivo.");
      return;
    }
    if(schedule==="scheduled"&&(!date||!time)){
      setError(en?"Choose the date and time for your order.":"Elige la fecha y hora de tu pedido.");
      return;
    }
    setError("");
    const lines=[
      en?"Hola Andariegos, quiero hacer este pedido:":"Hola Andariegos, quiero hacer este pedido:",
      "",
      itemSummary,
      "",
      `${en?"Total estimated":"Total estimado"}: ${formatCOP(total)}`,
      `${en?"Name":"Nombre"}: ${name.trim()}`,
      `${en?"Phone":"Teléfono"}: ${phone.trim()}`,
      `${en?"Service":"Modalidad"}: ${fulfillment==="delivery"?(en?"Delivery":"Domicilio"):(en?"Pickup":"Recoger en el restaurante")}`,
      ...(fulfillment==="delivery"?[
        `${en?"Address":"Dirección"}: ${address.trim()}`,
        `${en?"Neighborhood":"Barrio"}: ${neighborhood.trim()}`,
        ...(reference.trim()?[`${en?"Reference":"Referencia"}: ${reference.trim()}`]:[])
      ]:[]),
      `${en?"Payment":"Pago"}: ${payment==="nequi"?"Nequi":payment==="daviplata"?"Daviplata":payment==="bre-b"?"Bre-B / llave":"Efectivo"}`,
      ...(payment==="cash"?[`${en?"Cash with":"Paga con"}: ${cashAmount.trim()}`]:[]),
      `${en?"Timing":"Entrega"}: ${schedule==="now"?(en?"As soon as possible":"Lo antes posible"):`${date} ${time}`}`,
      "",
      en?"This is a request; please confirm availability and payment instructions by WhatsApp.":"Esta es una solicitud; por favor confirma disponibilidad e instrucciones de pago por WhatsApp."
    ];
    window.open(`https://wa.me/573242870766?text=${encodeURIComponent(lines.join("\n"))}`,"_blank","noopener,noreferrer");\n    clear();
  }

  return <main className="checkout-page"><section className="checkout-shell">
    <div className="checkout-heading"><p className="eyebrow">{en?"YOUR ORDER":"TU PEDIDO"}</p><h1>{en?"Ready when you are.":"Listo cuando tú estés."}</h1><p>{en?"Complete the request first; WhatsApp is the final handoff to Andariegos.":"Primero completa la solicitud; WhatsApp es el último paso para enviársela a Andariegos."}</p></div>

    {!count
      ? <div className="empty-checkout"><div className="empty-symbol empty-leaf" aria-hidden="true">leaf</div><h2>{en?"Your cart is empty.":"Tu carrito está vacío."}</h2><p>{en?"Open the menu and add something good before checking out.":"Abre el menú y agrega algo rico antes de continuar."}</p><Link className="button button-primary" href="/menu">{en?"GO TO MENU":"IR AL MENÚ"}</Link></div>
      : <div className="checkout-grid">
        <div className="order-card">
          <div className="order-card-head"><h2>{en?"Your selection":"Tu selección"}</h2><button type="button" onClick={clear}>{en?"Clear":"Vaciar"}</button></div>
          {items.map(({product,quantity})=><div className="order-line" key={product.id}><div><b>{product.name}</b><small>{product.description}</small></div><div className="order-qty"><button type="button" onClick={()=>remove(product.id)}>−</button><b>{quantity}</b><button type="button" onClick={()=>add(product.id)}>+</button></div><strong>{formatCOP(product.price*quantity)}</strong></div>)}
          <div className="order-total"><span>{en?"Estimated total":"Total estimado"}</span><b>{formatCOP(total)}</b></div>
        </div>

        <aside className="request-card checkout-form-card">
          <p className="eyebrow">{en?"REQUEST DETAILS":"DATOS DE LA SOLICITUD"}</p>
          <h2>{en?"Before WhatsApp":"Antes de WhatsApp"}</h2>
          <p>{en?"These details travel with your order so the restaurant can review it.":"Estos datos viajan con tu pedido para que el restaurante pueda revisarlo."}</p>

          <div className="checkout-fields">
            <label>{en?"Name *":"Nombre *"}<input value={name} onChange={e=>setName(e.target.value)} placeholder={en?"Your name":"Tu nombre"} /></label>
            <label>{en?"Phone *":"Teléfono *"}<input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="300 000 0000" /></label>

            <div className="field-label">{en?"How do you receive it? *":"¿Cómo lo recibes? *"}</div>
            <div className="choice-row"><button type="button" className={fulfillment==="delivery"?"choice active":"choice"} onClick={()=>setFulfillment("delivery")}>{en?"Delivery":"Domicilio"}</button><button type="button" className={fulfillment==="pickup"?"choice active":"choice"} onClick={()=>setFulfillment("pickup")}>{en?"Pickup":"Recoger"}</button></div>

            {fulfillment==="delivery"&&<div className="address-fields">
              <label>{en?"Address *":"Dirección *"}<input value={address} onChange={e=>setAddress(e.target.value)} placeholder={en?"Street, number":"Calle, número"} /></label>
              <label>{en?"Neighborhood *":"Barrio *"}<input value={neighborhood} onChange={e=>setNeighborhood(e.target.value)} placeholder={en?"Neighborhood":"Barrio"} /></label>
              <label>{en?"Reference":"Referencia"}<input value={reference} onChange={e=>setReference(e.target.value)} placeholder={en?"Gate, house, landmark...":"Portería, casa, punto de referencia..."} /></label>
            </div>}

            <div className="field-label">{en?"Payment method *":"Medio de pago *"}</div>
            <div className="choice-grid"><button type="button" className={payment==="nequi"?"choice active":"choice"} onClick={()=>setPayment("nequi")}>Nequi</button><button type="button" className={payment==="daviplata"?"choice active":"choice"} onClick={()=>setPayment("daviplata")}>Daviplata</button><button type="button" className={payment==="bre-b"?"choice active":"choice"} onClick={()=>setPayment("bre-b")}>Bre-B / llave</button><button type="button" className={payment==="cash"?"choice active":"choice"} onClick={()=>setPayment("cash")}>{en?"Cash":"Efectivo"}</button></div>

            {payment==="cash"&&<label>{en?"How much will you pay with? *":"¿Con cuánto vas a pagar? *"}<input inputMode="numeric" value={cashAmount} onChange={e=>setCashAmount(e.target.value)} placeholder="$ 50.000" /></label>}

            <div className="field-label">{en?"When? *":"¿Cuándo? *"}</div>
            <div className="choice-row"><button type="button" className={schedule==="now"?"choice active":"choice"} onClick={()=>setSchedule("now")}>{en?"As soon as possible":"Lo antes posible"}</button><button type="button" className={schedule==="scheduled"?"choice active":"choice"} onClick={()=>setSchedule("scheduled")}>{en?"Schedule":"Programar"}</button></div>
            {schedule==="scheduled"&&<div className="schedule-grid"><label>{en?"Date *":"Fecha *"}<input type="date" value={date} onChange={e=>setDate(e.target.value)} /></label><label>{en?"Time *":"Hora *"}<input type="time" value={time} onChange={e=>setTime(e.target.value)} /></label></div>}
          </div>

          {error&&<p className="form-error" role="alert">{error}</p>}
          <div className="checkout-note"><b>{en?"Delivery":"Domicilios"}</b><span>{en?"Own delivery service · provisional fee $5,000 · radius 5 km.":"Servicio propio · tarifa provisional $5.000 · radio de 5 km."}</span></div>
          <div className="checkout-note"><b>{en?"Payments":"Pagos"}</b><span>Nequi · Daviplata · Bre-B/llave · efectivo.</span></div>
          <button type="button" className="button button-primary full-button checkout-submit" onClick={buildWhatsApp}>{en?"SEND TO ANDARIEGOS":"ENVIAR A ANDARIEGOS"}</button>
          <p className="microcopy">{en?"This sends a request; Andariegos confirms availability and payment instructions in WhatsApp.":"Esto envía una solicitud; Andariegos confirma disponibilidad e instrucciones de pago por WhatsApp."}</p>
        </aside>
      </div>}
  </section></main>;
}
