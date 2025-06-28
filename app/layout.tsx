import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Kuckaj&Zaradi",
  description:
    "Transformišite svoju komunikaciju u profitabilnu veštinu. Naučite kako da zarađujete komunicirajući sa kreatorima sadržaja.",
  keywords: "prodaja, marketing, kreatori sadržaja, zarada online, mentorstvo, Discord, Telegram",
  authors: [{ name: "Kuckaj&Zaradi" }],
  openGraph: {
    title: "Kuckaj&Zaradi - Transformišite komunikaciju u profit",
    description: "Naučite kako da zarađujete komunicirajući sa kreatorima sadržaja kroz naše dokazane metode.",
    url: "https://kuckajizaradi.rs",
    siteName: "Kuckaj&Zaradi",
    locale: "sr_RS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kuckaj&Zaradi - Transformišite komunikaciju u profit",
    description: "Naučite kako da zarađujete komunicirajući sa kreatorima sadržaja kroz naše dokazane metode.",
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="sr">
      <head>
        <title>Kuckaj&Zaradi</title>
      </head>
      <body>{children}</body>
    </html>
  )
}
