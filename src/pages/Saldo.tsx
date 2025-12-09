import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SaldoSection } from "@/components/SaldoSection";

export default function Saldo() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 lg:pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Informasi Keuangan
            </h1>
            <p className="text-muted-foreground">
              Transparansi pengelolaan keuangan masjid
            </p>
            <div className="h-1 w-24 mx-auto gradient-gold rounded-full mt-4" />
          </div>

          <div className="max-w-4xl mx-auto">
            <SaldoSection />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
