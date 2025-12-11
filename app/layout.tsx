import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FootPredict AI - Analyses de matchs propulsées par l'IA",
  description: "Accédez à des prédictions ultra-précises basées sur des millions de données. L'intelligence artificielle qui analyse le football comme jamais auparavant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

