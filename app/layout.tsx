import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://seu-usuario.github.io/klaro-capital/"),
  title: { default: "Klaro Capital | Clareza para investir", template: "%s | Klaro Capital" },
  description: "Educação financeira, planejamento patrimonial, calculadoras e organização local de investimentos com Klerton, CFP®.",
  applicationName: "Klaro Capital",
  keywords: ["educação financeira", "planejamento financeiro", "investimentos", "carteira", "calculadora financeira"],
  openGraph: { title: "Klaro Capital", description: "Clareza para investir. Estratégia para prosperar.", type: "website", locale: "pt_BR", images: [{ url: "/assets/social-card.svg", width: 1200, height: 630 }] },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg", apple: "/favicon.svg" },
  manifest: "/manifest.webmanifest",
  other: { "codex-preview": "development" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "WebSite", name: "Klaro Capital", inLanguage: "pt-BR", description: "Plataforma de educação e planejamento financeiro." },
    { "@type": "Person", name: "Klerton", honorificSuffix: "CFP®", description: "Profissional responsável pelo conteúdo educacional da Klaro Capital." }
  ]};
  return <html lang="pt-BR"><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />{children}</body></html>;
}
