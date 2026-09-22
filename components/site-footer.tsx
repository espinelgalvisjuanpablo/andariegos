import Link from "next/link";
export function SiteFooter(){
  return <footer className="site-footer">
    <div><p className="footer-mark">ANDARIEGOS</p><p>Cocina de Mundo · Simijacá, Cundinamarca</p><p className="footer-soft">Te invitamos a comer, descubrir y quedarte un rato.</p></div>
    <nav className="footer-links"><Link href="/menu">Menú</Link><Link href="/simijaca">Simijacá</Link><Link href="/politicas">Privacidad</Link></nav>
    <div className="footer-bottom"><span>También puedes encontrarnos por aquí</span><div><a href="https://maps.app.goo.gl/AJqofpreCyqbTJW98" target="_blank" rel="noreferrer">Google Maps ↗</a><a href="https://www.tripadvisor.com/" target="_blank" rel="noreferrer">Tripadvisor ↗</a></div></div>
  </footer>;
}
