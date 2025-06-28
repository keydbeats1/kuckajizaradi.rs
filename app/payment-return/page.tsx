"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, ArrowLeft } from "lucide-react"

export default function PaymentReturn() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl border-0">
        <CardHeader className="text-center pb-8 pt-12">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-12 h-12 text-yellow-600" />
          </div>
          <CardTitle className="text-4xl font-bold text-gray-900 mb-4">Plaćanje u toku</CardTitle>
          <p className="text-xl text-gray-600">
            Vaše plaćanje se obrađuje. Molimo sačekajte potvrdu ili proverite status plaćanja.
          </p>
        </CardHeader>

        <CardContent className="px-12 pb-12">
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h4 className="font-bold text-yellow-900 mb-2">Šta se dešava:</h4>
              <ul className="text-yellow-800 space-y-1 text-sm">
                <li>• Vaše plaćanje se trenutno obrađuje</li>
                <li>• Proces može potrajati nekoliko minuta</li>
                <li>• Dobićete potvrdu kada se plaćanje završi</li>
                <li>• Možete zatvoriti ovu stranicu</li>
              </ul>
            </div>

            <Button
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl"
              onClick={() => (window.location.href = "/")}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Povratak na početnu
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
