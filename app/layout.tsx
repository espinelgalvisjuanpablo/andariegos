import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
export const metadata:Metadata={title:"Andariegos — Cocina de Mundo",description:"Cocinas de otros mundos a tu mundo. Andariegos Cocina de Mundo en Simijacá, Cundinamarca."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body><AppShell>{children}</AppShell></body></html>}
