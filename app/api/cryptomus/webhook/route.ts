import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

function verifyWebhook(data: any, signature: string, apiKey: string): boolean {
  const jsonString = JSON.stringify(data)
  const encoded = Buffer.from(jsonString).toString("base64")
  const expectedSign = crypto
    .createHash("md5")
    .update(encoded + apiKey)
    .digest("hex")
  return expectedSign === signature
}

export async function POST(request: NextRequest) {
  try {
    const webhookData = await request.json()
    const signature = request.headers.get("sign")

    if (!signature || !verifyWebhook(webhookData, signature, process.env.CRYPTOMUS_API_KEY!)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    console.log("Cryptomus webhook received:", webhookData)

    if (webhookData.status === "paid" || webhookData.status === "paid_over") {
      // Payment successful - implement your business logic here
      console.log(`Payment successful for order: ${webhookData.order_id}`)

      // TODO: Add your business logic:
      // 1. Save order to database
      // 2. Send course materials to customer
      // 3. Send confirmation email
      // 4. Add customer to Discord/Telegram
      // 5. Update customer records

      const customerData = JSON.parse(webhookData.additional_data || "{}")
      console.log("Customer data:", customerData)

      // Example: Send email notification
      // await sendCourseAccessEmail(customerData)
    }

    return NextResponse.json({ status: "ok" })
  } catch (error) {
    console.error("Webhook processing failed:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
