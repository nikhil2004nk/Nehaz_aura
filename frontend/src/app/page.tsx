import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhoIsThisFor from "@/components/WhoIsThisFor";
import About from "@/components/About";
import Classes from "@/components/Classes";
import Schedule from "@/components/Schedule";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import InstagramPromo from "@/components/InstagramPromo";
import InstagramFeedsContainer from "@/components/InstagramFeedsContainer";
import TeachersSection from "@/components/TeachersSection";
import LeadForm from "@/components/LeadForm";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <About />
        <WhoIsThisFor />
        <Classes />
        <TeachersSection />
        <Schedule />
        <Testimonials />
        <Pricing />
        <LeadForm />
        <FAQ />
        <InstagramPromo />
        <InstagramFeedsContainer />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
