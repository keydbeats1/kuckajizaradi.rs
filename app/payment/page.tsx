"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Bitcoin, Shield, CheckCircle, ArrowLeft, Loader2, Copy } from "lucide-react"

export default function PaymentPage() {
  const [paymentData, setPaymentData] = useState<any>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("crypto")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStep, setPaymentStep] = useState<"select" | "details" | "processing" | "success">("select")
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let paymentData = null
    const urlParams = new URLSearchParams(window.location.search)
    const urlData = urlParams.get("data")

    if (urlData) {
      try {
        const decodedData = atob(decodeURIComponent(urlData))
        paymentData = JSON.parse(decodedData)
      } catch (error) {
        console.error("Error parsing URL data:", error)
      }
    }

    if (!paymentData) {
      const storedData = localStorage.getItem("paymentData") || sessionStorage.getItem("paymentData")
      if (storedData) {
        try {
          paymentData = JSON.parse(storedData)
        } catch (error) {
          console.error("Error parsing storage data:", error)
        }
      }
    }

    if (paymentData) {
      setPaymentData(paymentData)
    }
    setLoading(false)
  }, [])

  const paymentMethods = [
    {
      id: "crypto",
      name: "Cryptocurrency",
      description: "Bitcoin, USDT, USDC - Bez KYC",
      icon: <Bitcoin className="w-8 h-8" />,
      color: "from-orange-500 to-yellow-500",
      popular: true,
    },
    {
      id: "card",
      name: "Kreditna/Debitna kartica",
      description: "Visa, Mastercard - Brzo i sigurno",
      icon: <CreditCard className="w-8 h-8" />,
      color: "from-blue-500 to-purple-500",
    },
  ]

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId)
    setPaymentStep("details")
  }

  const handleCardPayment = async () => {
    setIsProcessing(true)
    try {
      const res = await fetch("/api/atlos/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      })
      const data = await res.json()
      if (data?.paymentUrl) {
        window.location.href = data.paymentUrl
      } else {
        alert("Greška u kreiranju plaćanja.")
      }
    } catch (err) {
      console.error("Payment error", err)
      alert("Došlo je do greške.")
    } finally {
      setIsProcessing(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card><CardContent className="p-6 text-center">Nema podataka o plaćanju</CardContent></Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card><CardHeader><CardTitle>Vaša narudžbina</CardTitle></CardHeader>
            <CardContent>
              <p>{paymentData.selectedOffer.title}</p>
              <p className="text-green-600 font-bold text-xl">€{paymentData.selectedOffer.price}</p>
              <p className="mt-4 text-sm">Kupac: {paymentData.formData.fullName}</p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-8">
              {paymentStep === "select" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Izaberite način plaćanja</h2>
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`cursor-pointer border-2 rounded-xl p-6 ${selectedPaymentMethod === method.id ? "border-orange-400" : "border-gray-200"}`}
                        onClick={() => handlePaymentMethodSelect(method.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${method.color} flex items-center justify-center text-white`}>
                            {method.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold">{method.name}</h3>
                            <p className="text-sm text-gray-600">{method.description}</p>
                          </div>
                          <Button>{selectedPaymentMethod === method.id ? "Izabrano" : "Izaberi"}</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {paymentStep === "details" && selectedPaymentMethod === "card" && (
                <div>
                  <Button variant="outline" onClick={() => setPaymentStep("select")} className="mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Nazad
                  </Button>
                  <h2 className="text-2xl font-bold mb-4">Plaćanje karticom</h2>
                  <Button onClick={handleCardPayment} className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg h-12 rounded-xl">
                    Nastavi na plaćanje
                  </Button>
                </div>
              )}

              {paymentStep === "details" && selectedPaymentMethod === "crypto" && (
                <div>
                  <Button variant="outline" onClick={() => setPaymentStep("select")} className="mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Nazad
                  </Button>
                  <h2 className="text-2xl font-bold mb-4">Crypto plaćanje</h2>
                  <p>Iznos: €{paymentData.selectedOffer.price}</p>
                  <p>Wallet: TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE</p>
                  <p>Referenca: {paymentData.orderId}</p>
                  <Button onClick={handlePaymentSubmit} className="mt-4 w-full bg-orange-500 text-white h-12 rounded-xl">
                    Poslao sam plaćanje
                  </Button>
                </div>
              )}

              {paymentStep === "processing" && (
                <div className="text-center py-12">
                  <Loader2 className="w-16 h-16 animate-spin mx-auto mb-6 text-orange-500" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Obrađujemo vaše plaćanje...</h2>
                </div>
              )}

              {paymentStep === "success" && (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 mx-auto mb-6 text-green-500" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Plaćanje primljeno!</h2>
                  <p className="text-gray-600">Hvala! Bićete kontaktirani uskoro.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
