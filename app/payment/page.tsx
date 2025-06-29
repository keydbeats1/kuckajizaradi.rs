"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Bitcoin, Shield, CheckCircle, ArrowLeft, Loader2 } from "lucide-react"

// Declare Atlos global variable
declare global {
  interface Window {
    atlos: {
      Pay: (config: {
        merchantId: string
        orderId: string
        orderAmount: number
        onSuccess?: (result: any) => void
        onCancel?: () => void
        onError?: (error: any) => void
      }) => void
    }
  }
}

export default function PaymentPage() {
  const [paymentData, setPaymentData] = useState<any>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStep, setPaymentStep] = useState<"select" | "details" | "processing" | "success">("select")
  const [loading, setLoading] = useState(true)
  const [atlasLoaded, setAtlasLoaded] = useState(false)

  useEffect(() => {
    console.log("Payment page loaded")

    let paymentData = null

    // Method 1: Try to get data from URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const urlData = urlParams.get("data")

    if (urlData) {
      try {
        const decodedData = atob(decodeURIComponent(urlData))
        paymentData = JSON.parse(decodedData)
        console.log("✅ Payment data loaded from URL:", paymentData)
      } catch (error) {
        console.error("❌ Error parsing URL data:", error)
      }
    }

    // Method 2: Try localStorage
    if (!paymentData) {
      const storedData = localStorage.getItem("paymentData")
      if (storedData) {
        try {
          paymentData = JSON.parse(storedData)
          console.log("✅ Payment data loaded from localStorage:", paymentData)
        } catch (error) {
          console.error("❌ Error parsing localStorage data:", error)
        }
      }
    }

    // Method 3: Try sessionStorage
    if (!paymentData) {
      const sessionData = sessionStorage.getItem("paymentData")
      if (sessionData) {
        try {
          paymentData = JSON.parse(sessionData)
          console.log("✅ Payment data loaded from sessionStorage:", paymentData)
        } catch (error) {
          console.error("❌ Error parsing sessionStorage data:", error)
        }
      }
    }

    if (paymentData) {
      setPaymentData(paymentData)
    } else {
      console.warn("⚠️ No payment data found in any storage method")
    }

    setLoading(false)
  }, [])

  // Load Atlos script
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://atlos.io/packages/app/atlos.js"
    script.async = true
    script.onload = () => {
      console.log("✅ Atlos script loaded")
      setAtlasLoaded(true)
    }
    script.onerror = () => {
      console.error("❌ Failed to load Atlos script")
    }
    document.body.appendChild(script)

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  const paymentMethods = [
    {
      id: "card",
      name: "Kreditna/Debitna kartica",
      description: "Visa, Mastercard - Brzo i sigurno",
      icon: <CreditCard className="w-8 h-8" />,
      color: "from-blue-500 to-purple-500",
      popular: true,
    },
    {
      id: "crypto",
      name: "Cryptocurrency",
      description: "Bitcoin, USDT, USDC - Bez KYC",
      icon: <Bitcoin className="w-8 h-8" />,
      color: "from-orange-500 to-yellow-500",
    },
  ]

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId)
    setPaymentStep("details")
  }

  const handleAtlosPayment = () => {
    if (!atlasLoaded || !window.atlos) {
      alert("Atlos payment system is still loading. Please try again in a moment.")
      return
    }

    if (!paymentData) {
      alert("Payment data not found. Please go back and fill the form again.")
      return
    }

    setIsProcessing(true)
    setPaymentStep("processing")

    try {
      console.log("🚀 Starting Atlos payment...")

      // Use Atlos JavaScript widget
      window.atlos.Pay({
        merchantId: "RJNO27U9TT", // Your merchant ID from Atlos dashboard
        orderId: paymentData.orderId,
        orderAmount: Number.parseFloat(paymentData.selectedOffer.price),
        onSuccess: (result: any) => {
          console.log("✅ Payment successful:", result)
          setPaymentStep("success")
          setIsProcessing(false)

          // Store success data
          localStorage.setItem("paymentResult", JSON.stringify(result))

          // Redirect to success page after a short delay
          setTimeout(() => {
            window.location.href = "/payment-success"
          }, 2000)
        },
        onCancel: () => {
          console.log("❌ Payment cancelled by user")
          setIsProcessing(false)
          setPaymentStep("details")
        },
        onError: (error: any) => {
          console.error("💥 Payment error:", error)
          setIsProcessing(false)
          setPaymentStep("details")
          alert("Payment failed. Please try again.")
        },
      })
    } catch (error) {
      console.error("❌ Failed to start payment:", error)
      setIsProcessing(false)
      setPaymentStep("details")
      alert("Failed to start payment. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Učitavanje...</p>
        </div>
      </div>
    )
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600 mb-4">Nema podataka o plaćanju</p>
            <p className="text-sm text-gray-500 mb-4">Molimo vratite se i popunite formu ponovo.</p>
            <Button onClick={() => (window.location.href = "/")}>Povratak na početnu</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Završite plaćanje</h1>
          <p className="text-xl text-gray-600">Izaberite način plaćanja i završite kupovinu</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-white rounded-2xl shadow-lg border-0 sticky top-8">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-gray-900">Vaša narudžbina</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{paymentData.selectedOffer.title}</h3>
                      <p className="text-gray-600 text-sm">{paymentData.selectedOffer.description}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-2xl font-bold">
                      <span>Ukupno:</span>
                      <span className="text-green-600">€{paymentData.selectedOffer.price}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 text-sm">
                    <h4 className="font-semibold mb-2">Kupac:</h4>
                    <p>{paymentData.formData.fullName}</p>
                    <p>
                      {paymentData.formData.country}, {paymentData.formData.city}
                    </p>
                    <p>{paymentData.formData.username}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <Card className="bg-white rounded-2xl shadow-lg border-0">
              <CardContent className="p-8">
                {paymentStep === "select" && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Izaberite način plaćanja</h2>
                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className={`relative cursor-pointer border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-lg ${
                            selectedPaymentMethod === method.id
                              ? "border-orange-400 bg-orange-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => handlePaymentMethodSelect(method.id)}
                        >
                          {method.popular && (
                            <div className="absolute -top-2 left-4">
                              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                PREPORUČENO
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-4">
                            <div
                              className={`w-16 h-16 rounded-xl bg-gradient-to-r ${method.color} flex items-center justify-center text-white`}
                            >
                              {method.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900">{method.name}</h3>
                              <p className="text-gray-600">{method.description}</p>
                            </div>
                            <div className="text-right">
                              <Button
                                className={`${
                                  selectedPaymentMethod === method.id
                                    ? `bg-gradient-to-r ${method.color} text-white`
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                {selectedPaymentMethod === method.id ? "✓ IZABRANO" : "IZABERI"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {paymentStep === "details" && (
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <Button variant="outline" size="sm" onClick={() => setPaymentStep("select")}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Nazad
                      </Button>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedPaymentMethod === "card" ? "Plaćanje karticom" : "Crypto plaćanje"}
                      </h2>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Shield className="w-6 h-6 text-blue-600" />
                          <h3 className="text-lg font-bold text-blue-900">Atlos - Sigurno plaćanje</h3>
                        </div>
                        <ul className="text-blue-800 space-y-1 text-sm">
                          <li>✅ SSL enkripcija</li>
                          <li>✅ Bez KYC verifikacije</li>
                          <li>✅ Podržane sve glavne kartice i crypto</li>
                          <li>✅ Non-custodial plaćanje</li>
                        </ul>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="font-bold text-gray-900 mb-4">Detalji plaćanja:</h4>
                        <div className="space-y-2 text-gray-700">
                          <div className="flex justify-between">
                            <span>Paket:</span>
                            <span className="font-semibold">{paymentData.selectedOffer.title}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Iznos:</span>
                            <span className="font-semibold text-green-600">€{paymentData.selectedOffer.price}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Order ID:</span>
                            <span className="font-mono text-sm">{paymentData.orderId}</span>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={handleAtlosPayment}
                        disabled={isProcessing || !atlasLoaded}
                        className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            Otvara se Atlos plaćanje...
                          </>
                        ) : !atlasLoaded ? (
                          "Učitava se Atlos..."
                        ) : (
                          `Plati €${paymentData.selectedOffer.price} - Atlos`
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {paymentStep === "processing" && (
                  <div className="text-center py-12">
                    <Loader2 className="w-16 h-16 animate-spin mx-auto mb-6 text-orange-500" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Otvara se Atlos plaćanje...</h2>
                    <p className="text-gray-600">Atlos payment widget se učitava...</p>
                  </div>
                )}

                {paymentStep === "success" && (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 mx-auto mb-6 text-green-500" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Plaćanje uspešno!</h2>
                    <p className="text-gray-600 mb-6">Preusmeriće vas na stranicu potvrde...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
