import React from "react";
import Hero from "../(components)/landing-sections/Hero";
import Features from "../(components)/landing-sections/Features";
import Testimonials from "../(components)/landing-sections/Testimonials";
import Cta from "../(components)/landing-sections/Cta";
import Faq from "../(components)/landing-sections/Faq";
import Footer from "../(components)/landing-sections/Footer";

export default function LandingPage() {
  return (
    <div className="flex-1">
      <Hero />
      <Features />
      <Testimonials />
      <Cta />
      <Faq />
      <Footer />
    </div>
  );
}
