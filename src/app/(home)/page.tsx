import { Cta } from "./_components/cta";
import { Features } from "./_components/features";
import { Footer } from "./_components/footer";
import { Header } from "./_components/header/header";
import { Hero } from "./_components/hero";

export default function HomePage() {
  return (
    <div className="min-h-svh flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
