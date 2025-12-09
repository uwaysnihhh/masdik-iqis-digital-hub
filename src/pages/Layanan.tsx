import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BookingForm } from "@/components/BookingForm";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, FileText, Phone } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Isi Formulir",
    description: "Lengkapi formulir reservasi dengan data yang benar",
  },
  {
    icon: Clock,
    title: "Tunggu Konfirmasi",
    description: "Tim kami akan meninjau dan menghubungi Anda dalam 1x24 jam",
  },
  {
    icon: Phone,
    title: "Komunikasi",
    description: "Diskusikan detail kegiatan dengan pengurus masjid",
  },
  {
    icon: CheckCircle,
    title: "Konfirmasi",
    description: "Reservasi Anda telah dikonfirmasi dan dijadwalkan",
  },
];

export default function Layanan() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 lg:pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Layanan Reservasi
            </h1>
            <p className="text-muted-foreground">
              Ajukan penggunaan masjid untuk kegiatan Anda
            </p>
            <div className="h-1 w-24 mx-auto gradient-gold rounded-full mt-4" />
          </div>

          {/* Process Steps */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {steps.map((step, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto gradient-islamic rounded-xl flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="text-xs text-primary font-bold mb-2">
                    Langkah {index + 1}
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Booking Form */}
          <div className="max-w-2xl mx-auto">
            <BookingForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
