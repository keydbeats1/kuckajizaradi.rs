interface CryptomusInvoice {
  amount: string
  currency: string
  order_id: string
  url_return?: string
  url_success?: string
  url_callback?: string
  is_payment_multiple?: boolean
  lifetime?: number
  to_currency?: string
  subtract?: number
  accuracy_payment_percent?: number
  additional_data?: string
  currencies?: string[]
  except_currencies?: string[]
  course_source?: string
  from_referral_code?: string
  discount_percent?: number
  is_refresh?: boolean
}

interface CryptomusResponse {
  state: number
  result: {
    uuid: string
    order_id: string
    amount: string
    payment_amount: string
    payer_amount: string
    discount_percent: number
    currency: string
    payer_currency: string
    url: string
    expired_at: number
    status: string
    is_final: boolean
    additional_data: string
    created_at: string
    updated_at: string
  }
}

export async function createCryptomusInvoice(invoiceData: CryptomusInvoice): Promise<CryptomusResponse> {
  const response = await fetch("/api/cryptomus/create-invoice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(invoiceData),
  })

  if (!response.ok) {
    throw new Error("Failed to create Cryptomus invoice")
  }

  return response.json()
}

export function generateOrderId(): string {
  return `kz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
