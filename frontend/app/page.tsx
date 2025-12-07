import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeatureSection from "./components/FeatureSection";
import Testimonials from "./components/Testimonials";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import PopularDestinations from "./components/PopularDestinations";
import TopTravelers from "./components/TopTravelers";
import WhyChooseUs from "./components/WhyChooseUs";
import TravelCategories from "./components/TravelCategories";
import SectionWrapper from "./components/SectionWrapper";

export default function Home() {
  return (
    <main className="min-h-screen bg-background overflow-hidden">
      <Navbar />
      {/* Hero has its own internal animations */}
      <Hero />

      <div className="space-y-20 pb-20">
        <SectionWrapper delay={0.1}>
          <WhyChooseUs />
        </SectionWrapper>

        <SectionWrapper delay={0.1}>
          <PopularDestinations />
        </SectionWrapper>

        <SectionWrapper delay={0.1}>
          <TravelCategories />
        </SectionWrapper>

        <SectionWrapper delay={0.1}>
          <FeatureSection />
        </SectionWrapper>

        <SectionWrapper delay={0.1}>
          <TopTravelers />
        </SectionWrapper>

        <SectionWrapper delay={0.1}>
          <Testimonials />
        </SectionWrapper>

        <SectionWrapper delay={0.1}>
          <CTA />
        </SectionWrapper>
      </div>

      <Footer />
    </main>
  );
}
