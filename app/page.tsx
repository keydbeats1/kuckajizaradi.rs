import type { Metadata } from "next"
import LandingPageClient from "./LandingPageClient"

// Add this metadata export
export const metadata: Metadata = {
  title: "Kuckaj&Zaradi",
}

export default function LandingPage() {
  return <LandingPageClient />
}
