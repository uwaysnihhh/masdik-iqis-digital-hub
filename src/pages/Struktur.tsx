import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DKMStructure } from "@/components/DKMStructure";

export default function Struktur() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 lg:pt-32 pb-16">
        <div className="container mx-auto px-4">
          <DKMStructure />
        </div>
      </main>

      <Footer />
    </div>
  );
}
