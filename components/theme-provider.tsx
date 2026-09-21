"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
type Theme = "light" | "dark";
const ThemeContext = createContext<{theme:Theme;toggle:()=>void}>({theme:"light",toggle:()=>{}});
export function ThemeProvider({children}:{children:ReactNode}) {
  const [theme,setTheme]=useState<Theme>("light");
  useEffect(()=>{const saved=localStorage.getItem("andariegos-theme");const next=saved==="dark"?"dark":"light";setTheme(next);document.documentElement.dataset.theme=next},[]);
  function toggle(){setTheme(current=>{const next=current==="light"?"dark":"light";document.documentElement.dataset.theme=next;localStorage.setItem("andariegos-theme",next);return next})}
  return <ThemeContext.Provider value={{theme,toggle}}>{children}</ThemeContext.Provider>;
}
export const useTheme=()=>useContext(ThemeContext);
