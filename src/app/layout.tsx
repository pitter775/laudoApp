import type { Metadata } from "next";
import { Geist_Mono, Manrope } from "next/font/google";

import { DevHelperPanel } from "@/components/dev/dev-helper-panel";

import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans-app",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono-app",
  subsets: ["latin"],
});

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Laudoparts",
    template: "%s | Laudoparts",
  },
  applicationName: "Laudoparts",
  description:
    "Sistema Laudoparts para emissao, consulta e compartilhamento de laudos tecnicos com visual profissional.",
  icons: {
    icon: "/logo_icone.png",
    shortcut: "/logo_icone.png",
    apple: "/logo_icone.png",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Laudoparts",
    title: "Laudoparts",
    description:
      "Emita e acompanhe laudos tecnicos em um fluxo mais claro, organizado e profissional.",
    images: [
      {
        url: "/logo_icone.png",
        width: 512,
        height: 512,
        alt: "Icone Laudoparts",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Laudoparts",
    description:
      "Emita e acompanhe laudos tecnicos em um fluxo mais claro, organizado e profissional.",
    images: ["/logo_icone.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <html
      lang="pt-BR"
      className={`${manrope.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {isDev ? <DevHelperPanel /> : null}
      </body>
    </html>
  );
}
