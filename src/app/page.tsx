import { isHolidayActive } from "@/config/site";
import { BottomBar } from "@/components/BottomBar";
import { DedaMraz } from "@/components/DedaMraz";
import { Faq } from "@/components/Faq";
import { FilmAnatomy } from "@/components/FilmAnatomy";
import { Founder } from "@/components/Founder";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowStories } from "@/components/HowStories";
import { OrderWizard } from "@/components/OrderWizard";
import { Packages } from "@/components/Packages";
import { ParallaxController } from "@/components/ParallaxController";
import { StickyWhatsApp } from "@/components/StickyWhatsApp";
import { ToyWorld } from "@/components/toys/ToyWorld";
import { HeroProvider } from "@/lib/hero";

/* Name first: the hero asks for the child's name, and every section after it
   (holiday offer, tickets, order wizard) uses the same name. */
export default function Home() {
  return (
    <HeroProvider>
      <Header />
      <main>
        <Hero />
        {isHolidayActive() && <DedaMraz />}
        <FilmAnatomy />
        <HowStories />
        <Packages />
        <OrderWizard />
        <Founder />
        <Faq />
      </main>
      <Footer />
      <StickyWhatsApp />
      <BottomBar />
      <ParallaxController />
      <ToyWorld />
    </HeroProvider>
  );
}
