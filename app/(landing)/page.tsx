import React from "react";
import LandingHeader from "../(components)/LandingHeader";
import Hero from "../(components)/Hero-section/Hero";

export default function LandingPage() {
  return (
    <div className="flex-1">
      <LandingHeader />
      <Hero />
    </div>
  );
}
