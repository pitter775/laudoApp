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

export const metadata: Metadata = {
  title: {
    default: "Laudoparts",
    template: "%s | Laudoparts",
  },
  description: "Base estrutural do sistema Laudoparts construida com Next.js App Router.",
  icons: {
    icon: "/logo_curto.png",
    shortcut: "/logo_curto.png",
    apple: "/logo_curto.png",
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
