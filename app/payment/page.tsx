"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Bitcoin, Shield, CheckCircle, ArrowLeft, Loader2, Copy, ExternalLink } from "lucide-react"

export default function PaymentPage() {
  const [paymentData, setPaymentData] = useState<any>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("crypto")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStep, setPaymentStep] = useState<"select" | "details" | "processing" | "success">("select")
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("Payment page loaded") // Debug log

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

  const handlePaymentSubmit = async () => {
    setIsProcessing(true)
    setPaymentStep("processing")

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    if (selectedPaymentMethod === "crypto") {
      // For crypto, show manual payment instructions
      setPaymentStep("success")
    } else {
      // For cards, you would integrate with actual payment processor
      setPaymentStep("success")
    }

    setIsProcessing(false)
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

                      <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="font-bold text-gray-900 mb-4">Instrukcije za plaćanje:</h4>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-semibold text-gray-700">Iznos za plaćanje:</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <Input value={`€${paymentData.selectedOffer.price}`} readOnly className="bg-white" />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(paymentData.selectedOffer.price)}
                              >
                                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-semibold text-gray-700">Wallet adresa (USDT TRC20):</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <Input
                                value="TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE"
                                readOnly
                                className="bg-white font-mono text-sm"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard("TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE")}
                              >
                                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-semibold text-gray-700">Referenca (obavezno):</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <Input value={paymentData.orderId} readOnly className="bg-white font-mono text-sm" />
                              <Button size="sm" variant="outline" onClick={() => copyToClipboard(paymentData.orderId)}>
                                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={handlePaymentSubmit}
                        className="w-full h-14 text-lg font-bold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl"
                      >
                        Poslao sam plaćanje
                      </Button>
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

                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
                      <h3 className="font-bold text-yellow-900 mb-2">Kontaktirajte nas za plaćanje karticom</h3>
                      <p className="text-yellow-800 text-sm">
                        Za plaćanje karticom, molimo kontaktirajte nas direktno preko Telegram-a ili Discord-a da vam
                        pošaljemo sigurnu payment link.
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        onClick={() => window.open("https://t.me/kuckajizaradi", "_blank")}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Telegram
                      </Button>
                      <Button
                        onClick={() => window.open("https://discord.gg/kuckajizaradi", "_blank")}
                        className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Discord
                      </Button>
                    </div>
                  </div>
                )}

                {paymentStep === "processing" && (
                  <div className="text-center py-12">
                    <Loader2 className="w-16 h-16 animate-spin mx-auto mb-6 text-orange-500" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Obrađujemo vaše plaćanje...</h2>
                    <p className="text-gray-600">Molimo sačekajte dok proveravamo transakciju</p>
                  </div>
                )}

                {paymentStep === "success" && (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 mx-auto mb-6 text-green-500" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Plaćanje primljeno!</h2>
                    <p className="text-gray-600 mb-6">
                      Hvala vam! Kontaktiraćemo vas u roku od 24 sata sa pristupom kursu.
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <h3 className="font-bold text-green-900 mb-2">Sledeći koraci:</h3>
                      <ul className="text-green-800 text-sm space-y-1">
                        <li>✅ Vaše plaćanje je zabeleženo</li>
                        <li>✅ Dobićete pristup Discord/Telegram grupi</li>
                        <li>✅ Materijali kursa će biti poslati na email</li>
                        <li>✅ Live sesije počinju odmah</li>
                      </ul>
                    </div>
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
