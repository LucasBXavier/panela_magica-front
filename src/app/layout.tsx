import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AppToaster from "@/components/ui/AppToaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Panela Mágica — Receitas",
  description: "Encontre receitas por nome, ingrediente ou categoria.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f9fafb",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <Script
          src="https://kit.fontawesome.com/5ba8568aec.js"
          strategy="beforeInteractive"
          crossOrigin="anonymous"
        />
        <SiteHeader />
        <div className="page">{children}</div>
        <SiteFooter />
        <AppToaster />
      </body>
    </html>
  );
}
