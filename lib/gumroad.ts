interface GumroadProduct {
  id: string
  title: string
  price: string
  url: string
}

export const gumroadProducts: GumroadProduct[] = [
  {
    id: "tajne-tehnike",
    title: "Tajne Tehnike Prodaje",
    price: "14.97",
    url: "https://your-username.gumroad.com/l/tajne-tehnike", // You'll get this URL after creating products
  },
  {
    id: "live-mentorship",
    title: "Live Mentorštip",
    price: "34.97",
    url: "https://your-username.gumroad.com/l/live-mentorship",
  },
  {
    id: "zagarantovan-posao",
    title: "Zagarantovan Posao",
    price: "99.97",
    url: "https://your-username.gumroad.com/l/zagarantovan-posao",
  },
]

export function redirectToGumroad(productId: string, customerData: any) {
  const product = gumroadProducts.find((p) => p.id === productId)
  if (!product) return

  // Store customer data for later use
  localStorage.setItem("customerData", JSON.stringify(customerData))

  // Redirect to Gumroad checkout
  window.open(product.url, "_blank")
}
