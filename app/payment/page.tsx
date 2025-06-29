"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Bitcoin, Shield, CheckCircle, ArrowLeft, Loader2, AlertCircle } from "lucide-react"

export default function PaymentPage() {
  const [paymentData, setPaymentData] = useState<any>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStep, setPaymentStep] = useState<"select" | "details" | "processing" | "success">("select")
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cardForm, setCardForm] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  })

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
    setError(null)
  }

  const handleCardFormChange = (field: string, value: string) => {
    setCardForm((prev) => ({ ...prev, [field]: value }))
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  const handleCardPayment = async () => {
    setIsProcessing(true)
    setPaymentStep("processing")
    setError(null)

    try {
      console.log("🚀 Starting card payment process...")

      // Validate card form
      if (!cardForm.cardholderName || !cardForm.cardNumber || !cardForm.expiryDate || !cardForm.cvv) {
        throw new Error("Molimo popunite sva polja kartice")
      }

      // Create Atlos payment
      const response = await fetch("/api/atlos/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number.parseFloat(paymentData.selectedOffer.price),
          currency: "EUR",
          orderId: paymentData.orderId,
          customerEmail: paymentData.formData.email || `${paymentData.formData.username}@temp.com`,
          customerName: paymentData.formData.fullName,
          customerCountry: paymentData.formData.country,
          customerCity: paymentData.formData.city,
          description: `${paymentData.selectedOffer.title} - Kuckaj&Zaradi`,
          paymentMethod: "card",
          packageType: paymentData.selectedOffer.id,
          cardDetails: cardForm,
        }),
      })

      const result = await response.json()
      console.log("📥 Payment API response:", result)

      if (!response.ok) {
        throw new Error(result.details || result.error || "Failed to create payment")
      }

      if (result.success && result.paymentUrl) {
        console.log("✅ Redirecting to payment URL:", result.paymentUrl)
        // Redirect to Atlos payment page
        window.location.href = result.paymentUrl
      } else {
        throw new Error("No payment URL received from payment gateway")
      }
    } catch (error) {
      console.error("❌ Payment failed:", error)
      setError(error instanceof Error ? error.message : "Došlo je do greške prilikom plaćanja")
      setPaymentStep("details")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCryptoPayment = async () => {
    setIsProcessing(true)
    setPaymentStep("processing")
    setError(null)

    try {
      console.log("🚀 Starting crypto payment process...")

      const response = await fetch("/api/atlos/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number.parseFloat(paymentData.selectedOffer.price),
          currency: "EUR",
          orderId: paymentData.orderId,
          customerEmail: paymentData.formData.email || `${paymentData.formData.username}@temp.com`,
          customerName: paymentData.formData.fullName,
          customerCountry: paymentData.formData.country,
          customerCity: paymentData.formData.city,
          description: `${paymentData.selectedOffer.title} - Kuckaj&Zaradi`,
          paymentMethod: "crypto",
          packageType: paymentData.selectedOffer.id,
        }),
      })

      const result = await response.json()
      console.log("📥 Crypto payment API response:", result)

      if (!response.ok) {
        throw new Error(result.details || result.error || "Failed to create payment")
      }

      if (result.success && result.paymentUrl) {
        console.log("✅ Redirecting to crypto payment URL:", result.paymentUrl)
        window.location.href = result.paymentUrl
      } else {
        // Fallback to manual crypto payment
        setPaymentStep("success")
      }
    } catch (error) {
      console.error("❌ Crypto payment failed:", error)
      setError(error instanceof Error ? error.message : "Došlo je do greške prilikom plaćanja")
      setPaymentStep("details")
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
                {/* Error Display */}
                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <div>
                        <h4 className="font-bold text-red-900">Greška</h4>
                        <p className="text-red-800 text-sm">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

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

                {paymentStep === "details" && selectedPaymentMethod === "card" && (
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <Button variant="outline" size="sm" onClick={() => setPaymentStep("select")}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Nazad
                      </Button>
                      <h2 className="text-2xl font-bold text-gray-900">Plaćanje karticom</h2>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Shield className="w-6 h-6 text-blue-600" />
                          <h3 className="text-lg font-bold text-blue-900">Sigurno plaćanje</h3>
                        </div>
                        <ul className="text-blue-800 space-y-1 text-sm">
                          <li>✅ SSL enkripcija</li>
                          <li>✅ PCI DSS sertifikovano</li>
                          <li>✅ 3D Secure zaštićeno</li>
                          <li>✅ Podržane sve glavne kartice</li>
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardholderName" className="text-sm font-semibold text-gray-700">
                            Ime na kartici
                          </Label>
                          <Input
                            id="cardholderName"
                            value={cardForm.cardholderName}
                            onChange={(e) => handleCardFormChange("cardholderName", e.target.value)}
                            placeholder="Ime i prezime"
                            className="mt-1"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="cardNumber" className="text-sm font-semibold text-gray-700">
                            Broj kartice
                          </Label>
                          <Input
                            id="cardNumber"
                            value={cardForm.cardNumber}
                            onChange={(e) => handleCardFormChange("cardNumber", formatCardNumber(e.target.value))}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            className="mt-1"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiryDate" className="text-sm font-semibold text-gray-700">
                              Datum isteka
                            </Label>
                            <Input
                              id="expiryDate"
                              value={cardForm.expiryDate}
                              onChange={(e) => handleCardFormChange("expiryDate", formatExpiryDate(e.target.value))}
                              placeholder="MM/YY"
                              maxLength={5}
                              className="mt-1"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv" className="text-sm font-semibold text-gray-700">
                              CVV
                            </Label>
                            <Input
                              id="cvv"
                              value={cardForm.cvv}
                              onChange={(e) => handleCardFormChange("cvv", e.target.value.replace(/\D/g, ""))}
                              placeholder="123"
                              maxLength={4}
                              className="mt-1"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={handleCardPayment}
                        disabled={isProcessing}
                        className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            Kreiranje plaćanja...
                          </>
                        ) : (
                          `Plati €${paymentData.selectedOffer.price}`
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {paymentStep === "details" && selectedPaymentMethod === "crypto" && (
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <Button variant="outline" size="sm" onClick={() => setPaymentStep("select")}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Nazad
                      </Button>
                      <h2 className="text-2xl font-bold text-gray-900">Crypto plaćanje</h2>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Shield className="w-6 h-6 text-blue-600" />
                          <h3 className="text-lg font-bold text-blue-900">Sigurno i anonimno</h3>
                        </div>
                        <ul className="text-blue-800 space-y-1 text-sm">
                          <li>✅ Bez KYC verifikacije</li>
                          <li>✅ Non-custodial plaćanje</li>
                          <li>✅ Direktno u vaš wallet</li>
                          <li>✅ Podržane valute: BTC, USDT, USDC</li>
                        </ul>
                      </div>

                      <Button
                        onClick={handleCryptoPayment}
                        disabled={isProcessing}
                        className="w-full h-14 text-lg font-bold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            Kreiranje plaćanja...
                          </>
                        ) : (
                          "Nastavi sa crypto plaćanjem"
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {paymentStep === "processing" && (
                  <div className="text-center py-12">
                    <Loader2 className="w-16 h-16 animate-spin mx-auto mb-6 text-orange-500" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Kreiranje plaćanja...</h2>
                    <p className="text-gray-600">Molimo sačekajte dok pripravljamo vaše plaćanje</p>
                  </div>
                )}

                {paymentStep === "success" && (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 mx-auto mb-6 text-green-500" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Plaćanje kreiranje!</h2>
                    <p className="text-gray-600 mb-6">Bićete preusmeren na sigurnu stranicu za plaćanje.</p>
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
