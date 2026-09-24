import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import { ChatWidget } from "@/components/chat/ChatWidget";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Agentes de IA, Automação e Chatbots para Empresas`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "automação IA",
    "chatbot WhatsApp",
    "agentes de IA",
    "automação comercial",
    "IA para empresas",
    "automação de atendimento",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Agentes de IA, Automação e Chatbots`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Agentes de IA, Automação e Chatbots`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} h-full`}>
      <body className="min-h-full flex flex-col overflow-x-hidden antialiased">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
