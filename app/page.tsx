"use client";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/components/language-provider";

const Doodle=({children,className=""}:{children:"tomato"|"carrot"|"leaf"|"botanical"|"route";className?:string})=>{
  const common={viewBox:"0 0 48 48",fill:"none",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"};
  const art=children==="tomato"?<><circle cx="25" cy="26" r="10"/><path d="M25 16c-1-5 2-8 6-10M25 18c-5-3-9-1-12 2M24 17c3-4 7-4 11-2"/></>:
    children==="carrot"?<><path d="M16 15c4-4 12-3 16 1l-8 25-10-6Z"/><path d="M18 12c-2-5 1-8 4-10M23 13c0-5 4-8 7-8M27 14c3-3 7-3 9-1"/></>:
    children==="leaf"?<><path d="M37 10C21 10 11 17 12 28c1 7 7 10 13 9 10-1 14-12 12-27Z"/><path d="M13 37c7-9 13-14 21-19"/></>:
    children==="route"?<><path d="M7 30c7-15 13 9 20-5 4-8 8-9 14-4"/><circle cx="8" cy="30" r="2"/><circle cx="40" cy="21" r="2"/></>:
    <><path d="M10 34c8-16 17-18 28-20"/><path d="M12 35c7 2 13 0 17-5"/><path d="M31 13c4 0 7 2 8 5"/></>;
  return <span className={`ingredient-doodle ${className}`} aria-hidden="true"><svg {...common}>{art}</svg></span>;
};

export default function Home(){
  const {lang}=useLanguage(); const en=lang==="EN";
  return <main>
    <section className="hero-home">
      <Doodle className="doodle-tomato">tomato</Doodle><Doodle className="doodle-carrot">carrot</Doodle><Doodle className="doodle-leaf">leaf</Doodle>
      <div className="hero-ornament hero-ornament-a"/><div className="hero-ornament hero-ornament-b"/>
      <div className="hero-copy">
        <p className="eyebrow">COCINA DE OTRO MUNDO</p><h1>Andariegos</h1>
        <p className="hero-lead">{en?"Cuisines from other worlds, to your world.":"Cocinas de otros mundos a tu mundo."}</p>
        <p className="hero-note">{en?"Author dishes, fresh ingredients and an invitation to sit down without rushing.":"Platos de autor, ingredientes frescos y una invitación a sentarte sin afán."}</p>
        <div className="hero-actions"><Link className="button button-primary" href="/menu">{en?"VIEW MENU":"VER MENÚ"}</Link><Link className="button" href="/checkout">{en?"ORDER DELIVERY":"PEDIR A DOMICILIO"}</Link></div>
      </div><p className="hero-signature">ARTESANAL · ARTÍSTICO · ELEGANTE</p>
    </section>

    <section className="section featured-section">
      <div className="section-heading"><div><p className="eyebrow">{en?"NOW AT ANDARIEGOS":"AHORA EN ANDARIEGOS"}</p><h2>{en?"Featured":"Destacados"}</h2></div><p>{en?"A place to highlight what is happening, what is worth trying or simply what the kitchen wants to share today.":"Un espacio para destacar lo que está pasando, lo que vale la pena probar o simplemente lo que la cocina quiere compartir hoy."}</p></div>
      <div className="featured-grid">
        <article className="feature-card feature-dark"><Doodle>botanical</Doodle><span>01</span><h3>{en?"A kitchen that travels":"Una cocina que viaja"}</h3><p>{en?"Colombia, Argentina, Peru and Simijacá meet at the same table.":"Colombia, Argentina, Perú y Simijacá se encuentran en una misma mesa."}</p><Link href="/menu">{en?"Explore the menu →":"Explorar el menú →"}</Link></article>
        <article className="feature-card feature-image">
          <Image src="/images/postre-01.jpeg" alt="Postre de autor de Andariegos" fill sizes="(max-width: 800px) 100vw, 33vw"/>
        </article>
        <article className="feature-card feature-paper"><Doodle>route</Doodle><span>PLAN</span><h3>{en?"Before or after eating":"Antes o después de comer"}</h3><p>{en?"If you came to Simijacá, there is still a town to discover.":"Si llegaste a Simijacá, todavía queda pueblo por descubrir."}</p><Link href="/simijaca">{en?"Discover Simijacá →":"Descubrir Simijacá →"}</Link></article>
      </div>
    </section>

    <section className="story-band"><div className="story-content"><p className="eyebrow">LA IDEA</p><h2>{en?"Some flavors were not born together. Good thing they met.":"Hay sabores que no nacieron juntos. Qué bueno que se encontraron."}</h2><p>{en?"International techniques and flavors meet local ingredients, memory and territory in Simijacá.":"Técnicas y sabores internacionales encuentran ingredientes, memoria y territorio en Simijacá."}</p></div><Doodle className="band-doodle">tomato</Doodle></section>

    <section className="image-story section"><div className="image-frame"><Image src="/images/hamburguesa-hongos.jpeg" alt="Hamburguesa de hongos de Andariegos" fill sizes="(max-width: 800px) 100vw, 50vw"/><span>COCINA DE MUNDO</span></div><div className="story-copy"><p className="eyebrow">{en?"THE TABLE":"LA MESA"}</p><h2>{en?"Different places. One table.":"Diferentes lugares. Una misma mesa."}</h2><p>{en?"The menu moves between familiar and unexpected: Colombian roots, techniques learned elsewhere and the freedom to put things together in a new way.":"La carta se mueve entre lo conocido y lo inesperado: raíces colombianas, técnicas aprendidas en otros lugares y la libertad de juntar las cosas de una manera nueva."}</p><Link className="text-link" href="/menu">{en?"See the menu →":"Ver la carta →"}</Link></div></section>

    <section className="huerta-band">
      <div className="huerta-copy"><p className="eyebrow">DE LA HUERTA A LA COCINA</p><h2>{en?"The fresh part also has a story.":"Lo fresco también cuenta una historia."}</h2><p>{en?"Andariegos has its own small garden: a direct relationship between earth, ingredient and kitchen.":"Andariegos tiene su propia pequeña huerta: un vínculo directo entre tierra, ingrediente y cocina."}</p></div>
      <div className="huerta-photo"><Image src="/images/huerta.jpeg" alt="Huerta de Andariegos" fill sizes="(max-width: 800px) 100vw, 50vw"/><span className="garden-mark" aria-hidden="true">leaf</span></div>
    </section>

    <section className="section memory-section"><div className="memory-layout"><div><p className="eyebrow">SIMIJACÁ</p><h2>{en?"Food can also be a way of remembering where we come from.":"La comida también puede ser una forma de recordar de dónde venimos."}</h2><p>{en?"That is why Andariegos does not stop at the plate. There is a territory, a town and a story behind it.":"Por eso Andariegos no se queda en el plato. Detrás hay un territorio, un pueblo y una historia."}</p><Link className="text-link" href="/simijaca">{en?"Go to Simijacá →":"Ir a Simijacá →"}</Link></div><div className="memory-card"><Image src="/images/masterchef-simijaca.jpeg" alt="Andariegos y Simijacá" fill sizes="(max-width: 800px) 100vw, 40vw"/></div></div></section>

    <section className="invitation-section"><Doodle>carrot</Doodle><p className="eyebrow">ANDARIEGOS</p><h2>{en?"We invite you to eat, discover and stay a while.":"Te invitamos a comer, descubrir y quedarte un rato."}</h2><div className="hero-actions"><Link className="button button-primary" href="/menu">{en?"VIEW MENU":"VER MENÚ"}</Link><Link className="button" href="/reservas">{en?"MAKE A RESERVATION":"RESERVAR MESA"}</Link></div></section>
  </main>;
}
