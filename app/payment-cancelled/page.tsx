"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, ArrowLeft } from "lucide-react"

export default function PaymentCancelled() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl border-0">
        <CardHeader className="text-center pb-8 pt-12">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <CardTitle className="text-4xl font-bold text-gray-900 mb-4">Plaćanje otkazano</CardTitle>
          <p className="text-xl text-gray-600">
            Vaše plaćanje je otkazano. Možete pokušati ponovo kada budete spremni.
          </p>
        </CardHeader>

        <CardContent className="px-12 pb-12">
          <div className="space-y-4">
            <Button
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl"
              onClick={() => (window.location.href = "/#offers")}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Pokušaj ponovo
            </Button>

            <Button
              variant="outline"
              className="w-full h-14 text-lg font-bold border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 bg-transparent"
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
