'use client';
import {ReactNode,useEffect,useState} from 'react'; import {SiteNav} from './site-nav'; import {SiteFooter} from './site-footer';
export function AppShell({children}:{children:ReactNode}){const [lang,setLang]=useState<'ES'|'EN'>('ES'); useEffect(()=>{if(localStorage.getItem('andariegos-lang')==='EN')setLang('EN')},[]); function toggle(){const n=lang==='ES'?'EN':'ES';setLang(n);localStorage.setItem('andariegos-lang',n)} return <><SiteNav lang={lang} onLang={toggle}/><div className="page-content">{children}</div><SiteFooter/></>}
