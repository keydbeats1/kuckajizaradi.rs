interface AtlosPayment {
  amount: number
  currency: string
  orderId: string
  customerEmail?: string
  customerName?: string
  description?: string
  successUrl?: string
  cancelUrl?: string
  webhookUrl?: string
}

interface AtlosResponse {
  success: boolean
  paymentUrl: string
  paymentId: string
  orderId: string
}

export async function createAtlosPayment(paymentData: AtlosPayment): Promise<AtlosResponse> {
  const response = await fetch("/api/atlos/create-payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paymentData),
  })

  if (!response.ok) {
    throw new Error("Failed to create Atlos payment")
  }

  return response.json()
}

export function generateOrderId(): string {
  return `atlos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Atlos widget integration
export function initializeAtlosWidget(containerId: string, config: any) {
  // This would load the Atlos widget script
  const script = document.createElement("script")
  script.src = "https://widget.atlos.io/widget.js"
  script.onload = () => {
    // @ts-ignore
    if (window.AtlosWidget) {
      // @ts-ignore
      window.AtlosWidget.init({
        containerId,
        ...config,
      })
    }
  }
  document.head.appendChild(script)
}
