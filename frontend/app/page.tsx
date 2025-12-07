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

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <WhyChooseUs />
      <PopularDestinations />
      <TravelCategories />
      <FeatureSection />
      <TopTravelers />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
