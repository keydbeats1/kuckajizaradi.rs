"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Mail, Users, ArrowLeft, Copy, CheckCircle } from "lucide-react"

export default function ContactForPayment() {
  const [orderData, setOrderData] = useState<any>(null)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    const storedOrderData = localStorage.getItem("orderData")
    if (storedOrderData) {
      setOrderData(JSON.parse(storedOrderData))
    }
  }, [])

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl border-0">
        <CardHeader className="text-center pb-8 pt-12">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-12 h-12 text-blue-600" />
          </div>
          <CardTitle className="text-4xl font-bold text-gray-900 mb-4">Kontaktirajte nas za plaćanje</CardTitle>
          <p className="text-xl text-gray-600">
            Vaša registracija je uspešno primljena! Kontaktirajte nas da završite proces plaćanja.
          </p>
        </CardHeader>

        <CardContent className="px-12 pb-12">
          {orderData && (
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Vaša registracija:</h3>
              <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                <div>
                  <strong>Paket:</strong> {orderData.selectedOffer?.title}
                </div>
                <div>
                  <strong>Cena:</strong> €{orderData.selectedOffer?.price}
                </div>
                <div>
                  <strong>Ime:</strong> {orderData.formData?.fullName}
                </div>
                <div>
                  <strong>Username:</strong> {orderData.formData?.username}
                </div>
                <div>
                  <strong>Zemlja:</strong> {orderData.formData?.country}
                </div>
                <div>
                  <strong>Grad:</strong> {orderData.formData?.city}
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Telegram Contact */}
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-blue-900">Telegram</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-blue-800 mb-4">Najbrži način komunikacije</p>
                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-lg">@kuckajizaradi</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard("@kuckajizaradi", "telegram")}
                      className="ml-2"
                    >
                      {copied === "telegram" ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <Button
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => window.open("https://t.me/kuckajizaradi", "_blank")}
                >
                  Otvori Telegram
                </Button>
              </CardContent>
            </Card>

            {/* Discord Contact */}
            <Card className="border-2 border-purple-200 bg-purple-50">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-purple-900">Discord</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-purple-800 mb-4">Pridružite se našoj zajednici</p>
                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-lg">kuckajizaradi</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard("kuckajizaradi", "discord")}
                      className="ml-2"
                    >
                      {copied === "discord" ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <Button
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                  onClick={() => window.open("https://discord.gg/kuckajizaradi", "_blank")}
                >
                  Otvori Discord
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Email Contact */}
          <Card className="border-2 border-green-200 bg-green-50 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-green-900 mb-2">Email kontakt</h4>
                  <div className="flex items-center justify-between bg-white rounded-lg p-3">
                    <span className="font-mono text-lg">info@kuckajizaradi.rs</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard("info@kuckajizaradi.rs", "email")}
                    >
                      {copied === "email" ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
            <h4 className="font-bold text-yellow-900 mb-3">📋 Sledeći koraci:</h4>
            <ul className="text-yellow-800 space-y-2">
              <li>1. Kontaktirajte nas preko Telegram-a ili Discord-a</li>
              <li>2. Podelite vaše korisničko ime i odabrani paket</li>
              <li>3. Dobićete instrukcije za plaćanje</li>
              <li>4. Nakon plaćanja, odmah dobijate pristup kursu</li>
              <li>5. Pridružujete se našoj privatnoj grupi</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Button
              className="flex-1 h-14 text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl"
              onClick={() => window.open("https://t.me/kuckajizaradi", "_blank")}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Kontaktiraj preko Telegram-a
            </Button>

            <Button
              variant="outline"
              className="h-14 px-6 text-lg font-bold border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 bg-transparent"
              onClick={() => (window.location.href = "/")}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Nazad
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
