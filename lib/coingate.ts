interface CoinGateOrder {
  order_id: string
  price_amount: number
  price_currency: string
  receive_currency: string
  title: string
  description: string
  callback_url?: string
  cancel_url?: string
  success_url?: string
  token?: string
  purchaser_email?: string
}

interface CoinGateResponse {
  id: number
  status: string
  price_amount: string
  price_currency: string
  receive_amount: string
  receive_currency: string
  created_at: string
  order_id: string
  payment_url: string
  token: string
}

export async function createCoinGateOrder(orderData: CoinGateOrder): Promise<CoinGateResponse> {
  // In production, this should be called from your backend API route
  // For demo purposes, we'll simulate the API call

  const response = await fetch("/api/coingate/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  })

  if (!response.ok) {
    throw new Error("Failed to create CoinGate order")
  }

  return response.json()
}

export function generateOrderId(): string {
  return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
