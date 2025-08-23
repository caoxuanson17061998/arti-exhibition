import "./styles.css";
import AboutSection from "@components/Home/AboutSection";
import CTASection from "@components/Home/CTASection";
import FeaturedCategoriesSection from "@components/Home/FeaturedCategoriesSection";
// New components based on Figma design
import HeroSection from "@components/Home/HeroSection";
import ProductSection from "@components/Home/ProductSection";
import WhyChooseUsSection from "@components/Home/WhyChooseUsSection";
import {useState} from "react";

export function Home(): JSX.Element {
  return (
    <div className="w-full bg-white overflow-hidden">
      {/* Hero Section with video background */}
      <HeroSection />

      {/* About Section */}
      <AboutSection />

      {/* Featured Categories */}
      <FeaturedCategoriesSection />

      {/* Product Section with tabs */}
      <ProductSection />

      {/* Why Choose Us */}
      <WhyChooseUsSection />

      {/* Call to Action */}
      <CTASection />
    </div>
  );
}
