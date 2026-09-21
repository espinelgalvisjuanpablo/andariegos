"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
export type Lang="ES"|"EN";
const LanguageContext=createContext<{lang:Lang;toggle:()=>void}>({lang:"ES",toggle:()=>{}});
export function LanguageProvider({children}:{children:ReactNode}) {
  const [lang,setLang]=useState<Lang>("ES");
  useEffect(()=>{if(localStorage.getItem("andariegos-lang")==="EN")setLang("EN")},[]);
  function toggle(){setLang(current=>{const next=current==="ES"?"EN":"ES";localStorage.setItem("andariegos-lang",next);return next})}
  return <LanguageContext.Provider value={{lang,toggle}}>{children}</LanguageContext.Provider>;
}
export const useLanguage=()=>useContext(LanguageContext);
