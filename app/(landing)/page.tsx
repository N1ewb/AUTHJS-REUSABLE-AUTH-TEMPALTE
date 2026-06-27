import React from "react";
import dynamic from "next/dynamic";
import Hero from "../(components)/landing-sections/Hero";

const Features = dynamic(() => import("../(components)/landing-sections/Features"));
const Testimonials = dynamic(() => import("../(components)/landing-sections/Testimonials"));
const Cta = dynamic(() => import("../(components)/landing-sections/Cta"));
const Faq = dynamic(() => import("../(components)/landing-sections/Faq"));
const Footer = dynamic(() => import("../(components)/landing-sections/Footer"));

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
