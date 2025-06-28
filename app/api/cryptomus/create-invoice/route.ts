import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

// Add these to your environment variables
const CRYPTOMUS_MERCHANT_ID = process.env.CRYPTOMUS_MERCHANT_ID
const CRYPTOMUS_API_KEY = process.env.CRYPTOMUS_API_KEY
const CRYPTOMUS_API_URL = "https://api.cryptomus.com/v1/payment"

function generateSign(data: any, apiKey: string): string {
  const jsonString = JSON.stringify(data)
  const encoded = Buffer.from(jsonString).toString("base64")
  return crypto
    .createHash("md5")
    .update(encoded + apiKey)
    .digest("hex")
}

export async function POST(request: NextRequest) {
  try {
    const invoiceData = await request.json()

    const cryptomusData = {
      amount: invoiceData.amount,
      currency: "EUR",
      order_id: invoiceData.order_id,
      url_return: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-return`,
      url_success: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`,
      url_callback: `${process.env.NEXT_PUBLIC_BASE_URL}/api/cryptomus/webhook`,
      to_currency: "USDT", // You can change this to BTC, ETH, etc.
      lifetime: 3600, // 1 hour expiry
      additional_data: JSON.stringify(invoiceData.customerData),
    }

    const sign = generateSign(cryptomusData, CRYPTOMUS_API_KEY!)

    const response = await fetch(CRYPTOMUS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        merchant: CRYPTOMUS_MERCHANT_ID!,
        sign: sign,
      },
      body: JSON.stringify(cryptomusData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Cryptomus API error:", errorText)
      throw new Error("Cryptomus API error")
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Invoice creation failed:", error)
    return NextResponse.json({ error: "Failed to create payment invoice" }, { status: 500 })
  }
}
