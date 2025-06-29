import { type NextRequest, NextResponse } from "next/server"

// Atlos API configuration
const ATLOS_API_KEY = process.env.ATLOS_API_KEY
const ATLOS_MERCHANT_ID = process.env.ATLOS_MERCHANT_ID
const ATLOS_API_URL = "https://api.atlos.io/v1/payments" // Update this with actual Atlos API endpoint

export async function POST(request: NextRequest) {
  try {
    const paymentData = await request.json()

    console.log("🚀 Creating Atlos payment with data:", paymentData)

    // Validate required environment variables
    if (!ATLOS_API_KEY || !ATLOS_MERCHANT_ID) {
      console.error("❌ Missing Atlos credentials")
      return NextResponse.json({ error: "Payment gateway not configured properly" }, { status: 500 })
    }

    // Prepare Atlos payment request
    const atlasPaymentRequest = {
      merchant_id: ATLOS_MERCHANT_ID,
      amount: paymentData.amount,
      currency: paymentData.currency || "EUR",
      order_id: paymentData.orderId,
      description: paymentData.description || `Payment for ${paymentData.orderId}`,

      // Customer information
      customer_email: paymentData.customerEmail,
      customer_name: paymentData.customerName,

      // URLs for redirects
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-cancelled`,
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/atlos/webhook`,

      // Payment method preferences
      payment_methods: paymentData.paymentMethod === "card" ? ["card"] : ["crypto"],

      // If crypto is selected, specify preferred currencies
      ...(paymentData.paymentMethod === "crypto" && {
        receive_currency: "USDT", // or BTC, ETH, etc.
        network: "TRC20", // for USDT
      }),

      // Additional metadata
      metadata: {
        customer_country: paymentData.customerCountry,
        customer_city: paymentData.customerCity,
        package_type: paymentData.packageType,
        timestamp: new Date().toISOString(),
      },
    }

    console.log("📤 Sending request to Atlos API:", atlasPaymentRequest)

    // Make request to Atlos API
    const response = await fetch(ATLOS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ATLOS_API_KEY}`,
        // Some APIs use different auth headers
        "X-API-Key": ATLOS_API_KEY,
        Accept: "application/json",
      },
      body: JSON.stringify(atlasPaymentRequest),
    })

    console.log("📥 Atlos API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Atlos API error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      })

      // Try to parse error response
      let errorMessage = "Payment creation failed"
      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData.message || errorData.error || errorMessage
      } catch {
        // If parsing fails, use the raw text
        errorMessage = errorText || errorMessage
      }

      return NextResponse.json(
        {
          error: "Failed to create payment",
          details: errorMessage,
          status: response.status,
        },
        { status: 500 },
      )
    }

    const result = await response.json()
    console.log("✅ Atlos API success response:", result)

    // Extract payment URL from response
    // The exact field name depends on Atlos API response structure
    const paymentUrl = result.payment_url || result.checkout_url || result.redirect_url || result.url

    if (!paymentUrl) {
      console.error("❌ No payment URL in Atlos response:", result)
      return NextResponse.json({ error: "Invalid payment response - no payment URL received" }, { status: 500 })
    }

    // Return successful response
    return NextResponse.json({
      success: true,
      paymentUrl: paymentUrl,
      paymentId: result.payment_id || result.id,
      orderId: paymentData.orderId,
      amount: paymentData.amount,
      currency: paymentData.currency || "EUR",
      expiresAt: result.expires_at || result.expiry,
      // Include any other useful data from Atlos response
      atlasResponse: result,
    })
  } catch (error) {
    console.error("💥 Payment creation failed:", error)

    return NextResponse.json(
      {
        error: "Payment creation failed",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

// Handle GET requests for API health check
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Atlos payment API endpoint is active",
    timestamp: new Date().toISOString(),
    configured: !!(ATLOS_API_KEY && ATLOS_MERCHANT_ID),
  })
}
