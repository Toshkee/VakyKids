import { isHolidayActive } from "@/config/site";
import { DedaMraz } from "@/components/DedaMraz";
import { Faq } from "@/components/Faq";
import { FilmAnatomy } from "@/components/FilmAnatomy";
import { Founder } from "@/components/Founder";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { NamePreview } from "@/components/NamePreview";
import { Packages } from "@/components/Packages";
import { ParallaxController } from "@/components/ParallaxController";
import { StickyWhatsApp } from "@/components/StickyWhatsApp";
import { StoryBuilder } from "@/components/StoryBuilder";
import { WhyUs } from "@/components/WhyUs";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        {isHolidayActive() && <DedaMraz />}
        <NamePreview />
        <FilmAnatomy />
        <HowItWorks />
        <Founder />
        <Packages />
        <StoryBuilder />
        <WhyUs />
        <Faq />
      </main>
      <Footer />
      <StickyWhatsApp />
      <ParallaxController />
    </>
  );
}
