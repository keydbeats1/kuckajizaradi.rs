import { type NextRequest, NextResponse } from "next/server"

// Atlos API configuration
const ATLOS_API_KEY = process.env.ATLOS_API_KEY
const ATLOS_MERCHANT_ID = process.env.ATLOS_MERCHANT_ID

// We need to find the correct Atlos API endpoint
// Let's try different possible endpoints
const POSSIBLE_ATLOS_ENDPOINTS = [
  "https://api.atlos.io/v1/payments",
  "https://api.atlos.io/payments",
  "https://atlos.io/api/v1/payments",
  "https://atlos.io/api/payments",
  "https://gateway.atlos.io/v1/payments",
  "https://pay.atlos.io/api/v1/payments",
]

export async function POST(request: NextRequest) {
  try {
    const paymentData = await request.json()

    console.log("🚀 Creating Atlos payment with data:", paymentData)
    console.log("🔑 Environment check:", {
      hasApiKey: !!ATLOS_API_KEY,
      hasMerchantId: !!ATLOS_MERCHANT_ID,
      apiKeyLength: ATLOS_API_KEY?.length || 0,
      merchantIdLength: ATLOS_MERCHANT_ID?.length || 0,
    })

    // Validate environment variables
    if (!ATLOS_API_KEY) {
      console.error("❌ Missing ATLOS_API_KEY environment variable")
      return NextResponse.json(
        {
          error: "ATLOS_API_KEY not configured",
          details: "Please set ATLOS_API_KEY in your environment variables",
        },
        { status: 500 },
      )
    }

    if (!ATLOS_MERCHANT_ID) {
      console.error("❌ Missing ATLOS_MERCHANT_ID environment variable")
      return NextResponse.json(
        {
          error: "ATLOS_MERCHANT_ID not configured",
          details: "Please set ATLOS_MERCHANT_ID in your environment variables",
        },
        { status: 500 },
      )
    }

    // Prepare Atlos payment request
    const atlasPaymentRequest = {
      merchant_id: ATLOS_MERCHANT_ID,
      amount: paymentData.amount,
      currency: paymentData.currency || "EUR",
      order_id: paymentData.orderId,
      description: paymentData.description || `Payment for ${paymentData.orderId}`,
      customer_email: paymentData.customerEmail,
      customer_name: paymentData.customerName,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-cancelled`,
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/atlos/webhook`,
      payment_methods: paymentData.paymentMethod === "card" ? ["card"] : ["crypto"],
      ...(paymentData.paymentMethod === "crypto" && {
        receive_currency: "USDT",
        network: "TRC20",
      }),
      metadata: {
        customer_country: paymentData.customerCountry,
        customer_city: paymentData.customerCity,
        package_type: paymentData.packageType,
        timestamp: new Date().toISOString(),
      },
    }

    console.log("📤 Sending request to Atlos API:", atlasPaymentRequest)

    // Try different API endpoints
    let lastError = null
    for (const endpoint of POSSIBLE_ATLOS_ENDPOINTS) {
      try {
        console.log(`🔄 Trying endpoint: ${endpoint}`)

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ATLOS_API_KEY}`,
            "X-API-Key": ATLOS_API_KEY,
            Accept: "application/json",
          },
          body: JSON.stringify(atlasPaymentRequest),
        })

        console.log(`📥 Response from ${endpoint}:`, response.status)

        if (response.ok) {
          const result = await response.json()
          console.log("✅ Atlos API success response:", result)

          const paymentUrl = result.payment_url || result.checkout_url || result.redirect_url || result.url

          if (!paymentUrl) {
            console.error("❌ No payment URL in Atlos response:", result)
            continue
          }

          return NextResponse.json({
            success: true,
            paymentUrl: paymentUrl,
            paymentId: result.payment_id || result.id,
            orderId: paymentData.orderId,
            amount: paymentData.amount,
            currency: paymentData.currency || "EUR",
            expiresAt: result.expires_at || result.expiry,
            atlasResponse: result,
          })
        } else {
          const errorText = await response.text()
          console.error(`❌ Error from ${endpoint}:`, {
            status: response.status,
            body: errorText,
          })
          lastError = { endpoint, status: response.status, error: errorText }
        }
      } catch (error) {
        console.error(`💥 Failed to connect to ${endpoint}:`, error)
        lastError = { endpoint, error: error instanceof Error ? error.message : "Unknown error" }
      }
    }

    // If we get here, all endpoints failed
    return NextResponse.json(
      {
        error: "All Atlos API endpoints failed",
        details: lastError,
        triedEndpoints: POSSIBLE_ATLOS_ENDPOINTS,
      },
      { status: 500 },
    )
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
    environment: {
      hasApiKey: !!ATLOS_API_KEY,
      hasMerchantId: !!ATLOS_MERCHANT_ID,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    },
  })
}
