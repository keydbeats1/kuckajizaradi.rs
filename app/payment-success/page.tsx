"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, MessageCircle, Shield } from "lucide-react"

export default function PaymentSuccess() {
  const [orderData, setOrderData] = useState<any>(null)

  useEffect(() => {
    const storedOrderData = localStorage.getItem("orderData")
    if (storedOrderData) {
      setOrderData(JSON.parse(storedOrderData))
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl border-0">
        <CardHeader className="text-center pb-8 pt-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <CardTitle className="text-4xl font-bold text-gray-900 mb-4">Plaćanje uspešno!</CardTitle>
          <p className="text-xl text-gray-600">Hvala vam na kupovini! Vaš kurs će biti dostupan uskoro.</p>
        </CardHeader>

        <CardContent className="px-12 pb-12">
          {orderData && (
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Detalji narudžbine:</h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Kurs:</strong> {orderData.selectedOffer?.title}
                </p>
                <p>
                  <strong>Cena:</strong> €{orderData.selectedOffer?.price}
                </p>
                <p>
                  <strong>Ime:</strong> {orderData.formData?.fullName}
                </p>
                <p>
                  <strong>Username:</strong> {orderData.formData?.username}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <MessageCircle className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-bold text-blue-900 mb-2">Sledeći koraci:</h4>
                  <ul className="text-blue-800 space-y-1 text-sm">
                    <li>• Kontaktiraćemo vas u roku od 24 sata</li>
                    <li>• Dobićete pristup Discord/Telegram grupi</li>
                    <li>• Materijali kursa će biti poslati na vaš email</li>
                    <li>• Live sesije počinju odmah nakon pristupa</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h4 className="font-bold text-green-900 mb-2">Atlos plaćanje:</h4>
                  <p className="text-green-800 text-sm">
                    Vaše plaćanje je uspešno obrađeno preko Atlos platforme. Bez KYC, sigurno i anonimno!
                  </p>
                </div>
              </div>
            </div>

            <Button
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl"
              onClick={() => (window.location.href = "/")}
            >
              Povratak na početnu
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
