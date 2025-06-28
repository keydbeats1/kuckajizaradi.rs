"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  Star,
  Users,
  TrendingUp,
  MessageCircle,
  Euro,
  Zap,
  Target,
  Award,
  Loader2,
  CreditCard,
  Bitcoin,
  Shield,
} from "lucide-react"
import { createAtlosPayment, generateOrderId } from "@/lib/atlos"

export default function LandingPageClient() {
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    phoneNumber: "",
    country: "",
    city: "",
    experience: "",
    username: "",
  })

  const offers = [
    {
      id: "tajne-tehnike",
      title: "Tajne Tehnike Prodaje",
      price: "14.97",
      description: "Osnove prodaje i komunikacije sa kreatorima",
      features: ["Osnovne tehnike prodaje", "Komunikacijske strategije", "Praktični primeri", "Live podrška"],
      icon: <Target className="w-8 h-8" />,
      color: "from-emerald-500 to-teal-600",
    },
    {
      id: "live-mentorship",
      title: "Live Mentorštip",
      price: "34.97",
      description: "Direktno mentorstvo i personalizovana pomoć",
      features: [
        "Sve iz osnovnog kursa",
        "Live sesije mentorstva",
        "Personalizovane strategije",
        "Direktan pristup mentoru",
        "Grupa za podršku",
      ],
      popular: true,
      icon: <Zap className="w-8 h-8" />,
      color: "from-orange-500 to-red-500",
    },
    {
      id: "zagarantovan-posao",
      title: "Zagarantovan Posao",
      price: "99.97",
      description: "Kompletna podrška do prvog posla",
      features: [
        "Sve iz prethodnih paketa",
        "Garantovan posao",
        "Individualno praćenje",
        "Pomoć pri pronalaženju klijenata",
        "Doživotna podrška",
        "Bonus materijali",
      ],
      icon: <Award className="w-8 h-8" />,
      color: "from-purple-500 to-pink-500",
    },
  ]

  const testimonials = [
    {
      name: "Marko S.",
      earnings: "€2,450",
      image: "/placeholder.svg?height=300&width=400",
      text: "Neverovatno! Za samo 2 meseca sam zaradio više nego na prethodnom poslu.",
    },
    {
      name: "Ana M.",
      earnings: "€1,890",
      image: "/placeholder.svg?height=300&width=400",
      text: "Kurs mi je promenio život. Sada radim od kuće i zarađujem odlično.",
    },
    {
      name: "Stefan P.",
      earnings: "€3,200",
      image: "/placeholder.svg?height=300&width=400",
      text: "Najbolja investicija koju sam napravio. Preporučujem svima!",
    },
  ]

  const faqs = [
    {
      question: "Šta tačno radim kada kupim kurs?",
      answer:
        "Učićete kako da komunicirate sa kreatorima sadržaja, gradite odnose i zarađujete kroz različite modele saradnje. Fokus je na praktičnim tehnikama koje odmah možete primeniti.",
    },
    {
      question: "Koliko vremena treba da počnem da zarađujem?",
      answer:
        "Većina naših studenata počinje da ostvaruje prve prihode već u prvom mesecu. Sve zavisi od vaše posvećenosti i primene naučenih tehnika.",
    },
    {
      question: "Da li je potrebno prethodno iskustvo?",
      answer:
        "Ne, kurs je dizajniran za početnike. Počinjemo od osnova i postupno gradimo vaše veštine do profesionalnog nivoa.",
    },
    {
      question: "Kako funkcioniše garancija za posao?",
      answer:
        "Uz premium paket, garantujemo da ćete pronaći prvi posao u roku od 7 dana i manje ili vraćamo novac. Pružamo individualnu podršku tokom celog procesa.",
    },
    {
      question: "Koje platforme koristimo za komunikaciju?",
      answer:
        "Radimo sa Discord i Telegram platformama, koje su najpopularnije među kreatorima. Učićete kako da efikasno koristite obe.",
    },
    {
      question: "Da li postoji podrška nakon kupovine?",
      answer:
        "Da! Svi paketi uključuju podršku, a premium paket ima doživotnu podršku. Tu smo da vam pomognemo na svakom koraku.",
    },
  ]

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedOffer) {
      alert("Molimo izaberite paket pre slanja forme.")
      return
    }

    // Validate required fields
    if (
      !formData.fullName ||
      !formData.age ||
      !formData.phoneNumber ||
      !formData.country ||
      !formData.city ||
      !formData.username
    ) {
      alert("Molimo popunite sva obavezna polja.")
      return
    }

    setIsProcessingPayment(true)

    try {
      const selectedOfferData = offers.find((offer) => offer.id === selectedOffer)
      if (!selectedOfferData) {
        throw new Error("Selected offer not found")
      }

      const orderId = generateOrderId()

      const paymentData = {
        amount: Number.parseFloat(selectedOfferData.price),
        currency: "EUR",
        orderId,
        customerEmail: `${formData.username}@temp.com`, // You might want to add email field
        customerName: formData.fullName,
        description: `Kuckaj&Zaradi - ${selectedOfferData.title}`,
      }

      const atlasResponse = await createAtlosPayment(paymentData)

      if (atlasResponse.success) {
        // Store order data for later reference
        localStorage.setItem(
          "orderData",
          JSON.stringify({
            orderId,
            formData,
            selectedOffer: selectedOfferData,
            atlasPaymentId: atlasResponse.paymentId,
          }),
        )

        // Redirect to Atlos payment page
        window.location.href = atlasResponse.paymentUrl
      } else {
        throw new Error("Failed to create payment")
      }
    } catch (error) {
      console.error("Payment creation failed:", error)
      alert("Došlo je do greške pri kreiranju plaćanja. Molimo pokušajte ponovo.")
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23ffffff fillOpacity=0.05%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-black mb-6 tracking-tight">
              Kuckaj
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">&amp;</span>
              Zaradi
            </h1>
            <p className="text-2xl md:text-3xl mb-8 text-gray-300 font-light max-w-4xl mx-auto leading-relaxed">
              Transformišite svoju komunikaciju u profitabilnu veštinu
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              Naučite kako da zarađujete komunicirajući sa kreatorima sadržaja kroz naše dokazane metode
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <Users className="w-12 h-12 mx-auto mb-4 text-orange-400" />
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-gray-300">Zadovoljnih studenata</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-green-400" />
              <div className="text-3xl font-bold mb-2">€800-2,000</div>
              <div className="text-gray-300">Prosečna mesečna zarada</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-blue-400" />
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-gray-300">Podrška i mentorstvo</div>
            </div>
          </div>

          <div className="text-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-12 py-4 text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Započni svoju transformaciju
            </Button>
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section className="py-24 px-4 bg-gray-50 overflow-visible" id="offers">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Izaberite svoj put do uspeha</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tri pažljivo dizajnirana paketa koji će vas odvesti od početnika do profesionalca
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16 pt-24 overflow-visible">
            {offers.map((offer, index) => (
              <Card
                key={offer.id}
                className={`relative cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                  selectedOffer === offer.id ? "ring-4 ring-orange-400 shadow-2xl scale-105" : ""
                } ${offer.popular ? "border-2 border-orange-400 shadow-xl" : "border border-gray-200"} bg-white rounded-3xl overflow-hidden`}
                onClick={() => setSelectedOffer(offer.id)}
              >
                {offer.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-20">
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 text-sm font-bold rounded-full shadow-xl border-4 border-white">
                      NAJPOPULARNIJI
                    </Badge>
                  </div>
                )}

                <div className={`h-2 bg-gradient-to-r ${offer.color}`}></div>

                <CardHeader className={`text-center ${offer.popular ? "pt-12 pb-8" : "pt-8 pb-6"}`}>
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${offer.color} flex items-center justify-center text-white`}
                  >
                    {offer.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{offer.title}</CardTitle>
                  <CardDescription className="text-gray-600 text-lg mb-6">{offer.description}</CardDescription>
                  <div className="flex items-center justify-center gap-2">
                    <Euro className="w-8 h-8 text-green-600" />
                    <span className="text-5xl font-black text-gray-900">{offer.price}</span>
                  </div>
                </CardHeader>

                <CardContent className={`${offer.popular ? "px-8 py-6" : "px-8"}`}>
                  <ul className="space-y-4">
                    {offer.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className={`${offer.popular ? "p-8 pt-8" : "p-8 pt-6"}`}>
                  <Button
                    className={`w-full py-4 text-lg font-bold rounded-2xl transition-all duration-300 ${
                      selectedOffer === offer.id
                        ? `bg-gradient-to-r ${offer.color} text-white shadow-lg`
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {selectedOffer === offer.id ? "✓ IZABRANO" : "IZABERI PAKET"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Registration Form */}
          <Card className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl border-0">
            <CardHeader className="text-center pb-8 pt-12">
              <CardTitle className="text-4xl font-bold text-gray-900 mb-4">Započnite svoju transformaciju</CardTitle>
              <CardDescription className="text-xl text-gray-600">
                Popunite formu i pristupite odabranom paketu već danas
              </CardDescription>
            </CardHeader>
            <CardContent className="px-12 pb-12">
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fullName" className="text-lg font-semibold text-gray-700 mb-2 block">
                      Ime i prezime *
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="h-14 text-lg rounded-xl border-2 border-gray-200 focus:border-orange-400"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="age" className="text-lg font-semibold text-gray-700 mb-2 block">
                      Godine *
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      className="h-14 text-lg rounded-xl border-2 border-gray-200 focus:border-orange-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phoneNumber" className="text-lg font-semibold text-gray-700 mb-2 block">
                    Broj telefona *
                  </Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    className="h-14 text-lg rounded-xl border-2 border-gray-200 focus:border-orange-400"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="country" className="text-lg font-semibold text-gray-700 mb-2 block">
                      Zemlja *
                    </Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      className="h-14 text-lg rounded-xl border-2 border-gray-200 focus:border-orange-400"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-lg font-semibold text-gray-700 mb-2 block">
                      Grad *
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className="h-14 text-lg rounded-xl border-2 border-gray-200 focus:border-orange-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="experience" className="text-lg font-semibold text-gray-700 mb-2 block">
                    Iskustvo u prodaji/chatter usluzi
                  </Label>
                  <Textarea
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => handleInputChange("experience", e.target.value)}
                    placeholder="Opišite vaše prethodno iskustvo (opciono)"
                    className="min-h-[120px] text-lg rounded-xl border-2 border-gray-200 focus:border-orange-400"
                  />
                </div>

                <div>
                  <Label htmlFor="username" className="text-lg font-semibold text-gray-700 mb-2 block">
                    Discord ili Telegram korisničko ime *
                  </Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    placeholder="@vase_korisnicko_ime"
                    className="h-14 text-lg rounded-xl border-2 border-gray-200 focus:border-orange-400"
                    required
                  />
                </div>

                {/* Payment Method Info */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Atlos - Sigurno plaćanje bez KYC
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span>Kartice</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bitcoin className="w-4 h-4" />
                      <span>Crypto</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Euro className="w-4 h-4" />
                      <span>USDT/USDC</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">
                    ✅ Bez KYC verifikacije • ✅ Non-custodial • ✅ Direktno u vaš wallet
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="w-full h-16 text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin mr-2" />
                      KREIRANJE PLAĆANJA...
                    </>
                  ) : (
                    "🚀 REGISTRUJ SE I POČNI ODMAH"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Priče o uspehu naših studenata</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ovo su stvarni rezultati ljudi koji su prošli kroz naše programe
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-white rounded-3xl shadow-xl border-0 overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <CardHeader className="p-0">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={`Testimonial od ${testimonial.name}`}
                    className="w-full h-64 object-cover"
                  />
                </CardHeader>
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-lg mb-6 italic">"{testimonial.text}"</p>
                  <div className="text-center">
                    <div className="font-bold text-xl text-gray-900 mb-2">{testimonial.name}</div>
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold text-lg">
                      <Euro className="w-5 h-5" />
                      {testimonial.earnings}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Često postavljana pitanja</h2>
            <p className="text-xl text-gray-600">Odgovori na najčešća pitanja o našim kursevima</p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white rounded-2xl border-0 shadow-lg overflow-hidden"
              >
                <AccordionTrigger className="text-left font-bold text-lg text-gray-900 px-8 py-6 hover:no-underline hover:bg-gray-50">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 text-lg px-8 pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">
            Kuckaj
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">&amp;</span>
            Zaradi
          </h3>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Transformišemo ambiciozne ljude u uspešne profesionalce kroz komunikaciju sa kreatorima sadržaja
          </p>
          <div className="flex justify-center items-center gap-4 text-gray-500">
            <span>© 2025 Kuckaj&amp;Zaradi</span>
            <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
            <span>Sva prava zadržana</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
