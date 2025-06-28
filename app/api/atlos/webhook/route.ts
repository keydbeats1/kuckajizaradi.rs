import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

function verifyAtlosWebhook(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto.createHmac("sha256", secret).update(payload).digest("hex")
  return `sha256=${expectedSignature}` === signature
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text()
    const signature = request.headers.get("x-atlos-signature")

    if (!signature || !verifyAtlosWebhook(payload, signature, process.env.ATLOS_WEBHOOK_SECRET!)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const webhookData = JSON.parse(payload)
    console.log("Atlos webhook received:", webhookData)

    // Atlos sends payment status updates via postback
    // Common statuses: "pending", "confirmed", "completed", "failed"

    if (webhookData.status === "completed" || webhookData.status === "confirmed") {
      // Payment successful
      console.log(`Payment successful for order: ${webhookData.order_id}`)
      console.log(`Amount: ${webhookData.amount} ${webhookData.currency}`)
      console.log(`Transaction hash: ${webhookData.tx_hash}`)

      // TODO: Add your business logic here:
      // 1. Save order to database
      // 2. Send course materials to customer
      // 3. Send confirmation email
      // 4. Add customer to Discord/Telegram
      // 5. Update customer records

      // You can access customer data from the order_id
      // or additional_data if you sent it during payment creation
    } else if (webhookData.status === "failed") {
      console.log(`Payment failed for order: ${webhookData.order_id}`)
      // Handle failed payment
    }

    return NextResponse.json({ status: "ok" })
  } catch (error) {
    console.error("Postback processing failed:", error)
    return NextResponse.json({ error: "Postback processing failed" }, { status: 500 })
  }
}
