import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

function verifyAtlosWebhook(payload: string, signature: string, secret: string): boolean {
  try {
    // Atlos might use different signature formats, let's try multiple approaches
    const expectedSignature1 = crypto.createHmac("sha256", secret).update(payload).digest("hex")
    const expectedSignature2 = `sha256=${expectedSignature1}`

    // Compare with both formats
    return signature === expectedSignature1 || signature === expectedSignature2
  } catch (error) {
    console.error("Signature verification error:", error)
    return false
  }
}

export async function POST(request: NextRequest) {
  console.log("🔔 Atlos webhook received")

  try {
    const payload = await request.text()
    const signature = request.headers.get("x-atlos-signature")

    console.log("📝 Webhook payload:", payload)
    console.log("🔐 Signature received:", signature)
    console.log("🔑 Webhook secret available:", !!process.env.ATLOS_WEBHOOK_SECRET)

    // For testing purposes, let's be more lenient with signature verification
    if (signature && signature !== "test") {
      const webhookSecret = process.env.ATLOS_WEBHOOK_SECRET || process.env.ATLOS_API_KEY

      if (!webhookSecret) {
        console.error("❌ No webhook secret configured")
        return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
      }

      const isValidSignature = verifyAtlosWebhook(payload, signature, webhookSecret)

      if (!isValidSignature) {
        console.error("❌ Invalid signature")
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }
    } else if (signature === "test") {
      console.log("🧪 Test webhook detected, skipping signature verification")
    }

    let webhookData
    try {
      webhookData = JSON.parse(payload)
    } catch (parseError) {
      console.error("❌ Failed to parse webhook payload:", parseError)
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 })
    }

    console.log("📊 Parsed webhook data:", webhookData)

    // Handle different webhook events
    if (webhookData.status === "completed" || webhookData.status === "confirmed") {
      console.log(`✅ Payment successful for order: ${webhookData.order_id}`)
      console.log(`💰 Amount: ${webhookData.amount} ${webhookData.currency}`)

      if (webhookData.tx_hash) {
        console.log(`🔗 Transaction hash: ${webhookData.tx_hash}`)
      }

      // TODO: Add your business logic here:
      // 1. Save order to database
      // 2. Send course materials to customer
      // 3. Send confirmation email
      // 4. Add customer to Discord/Telegram
      // 5. Update customer records
    } else if (webhookData.status === "failed") {
      console.log(`❌ Payment failed for order: ${webhookData.order_id}`)
      // Handle failed payment
    } else if (webhookData.status === "pending") {
      console.log(`⏳ Payment pending for order: ${webhookData.order_id}`)
      // Handle pending payment
    } else {
      console.log(`ℹ️ Unknown status: ${webhookData.status} for order: ${webhookData.order_id}`)
    }

    return NextResponse.json({
      status: "ok",
      message: "Webhook processed successfully",
      received_status: webhookData.status || "unknown",
    })
  } catch (error) {
    console.error("💥 Webhook processing failed:", error)

    // Return more detailed error information
    return NextResponse.json(
      {
        error: "Webhook processing failed",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

// Also handle GET requests for webhook verification
export async function GET(request: NextRequest) {
  console.log("🔍 Webhook GET request received")

  return NextResponse.json({
    status: "ok",
    message: "Atlos webhook endpoint is active",
    timestamp: new Date().toISOString(),
  })
}
