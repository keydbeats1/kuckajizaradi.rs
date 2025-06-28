import { type NextRequest, NextResponse } from "next/server"

// You'll need to add your CoinGate API credentials
const COINGATE_API_URL = "https://api.coingate.com/v2/orders"
const COINGATE_API_TOKEN = process.env.COINGATE_API_TOKEN // Add this to your .env

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    const coingateOrder = {
      order_id: orderData.order_id,
      price_amount: orderData.price_amount,
      price_currency: "EUR",
      receive_currency: "BTC", // You can change this to USDC, ETH, etc.
      title: orderData.title,
      description: orderData.description,
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/coingate/callback`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-cancelled`,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`,
      purchaser_email: orderData.purchaser_email,
    }

    const response = await fetch(COINGATE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Token ${COINGATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(coingateOrder),
    })

    if (!response.ok) {
      throw new Error("CoinGate API error")
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error("CoinGate order creation failed:", error)
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 })
  }
}
