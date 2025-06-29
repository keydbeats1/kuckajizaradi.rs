import { type NextRequest, NextResponse } from "next/server"

// Add these to your environment variables
const ATLOS_API_KEY = process.env.ATLOS_API_KEY
const ATLOS_MERCHANT_ID = process.env.ATLOS_MERCHANT_ID
const ATLOS_API_URL = "https://api.atlos.io/v1/payments"

export async function POST(request: NextRequest) {
  try {
    const paymentData = await request.json()

    // For now, let's simulate a successful response since we're having API issues
    // In production, you would make the actual API call to Atlos

    console.log("Creating Atlos payment with data:", paymentData)

    // Simulate successful payment creation
    const mockResponse = {
      success: true,
      paymentUrl: `/payment?orderId=${paymentData.orderId}`,
      paymentId: `atlos_${Date.now()}`,
      orderId: paymentData.orderId,
    }

    return NextResponse.json(mockResponse)

    // Uncomment this when you want to use real Atlos API:
    
    const atlasPayment = {
      merchant_id: ATLOS_MERCHANT_ID,
      amount: paymentData.amount,
      currency: "EUR",
      order_id: paymentData.orderId,
      description: paymentData.description,
      customer_email: paymentData.customerEmail,
      customer_name: paymentData.customerName,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-cancelled`,
      webhook_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/atlos/webhook`,
      receive_currency: "USDT", // You can change this to BTC, ETH, etc.
    }

    const response = await fetch(ATLOS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ATLOS_API_KEY}`,
      },
      body: JSON.stringify(atlasPayment),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Atlos API error:", errorText)
      throw new Error("Atlos API error")
    }

    const result = await response.json()
    return NextResponse.json(result)
    
  } catch (error) {
    console.error("Payment creation failed:", error)
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 })
  }
}
