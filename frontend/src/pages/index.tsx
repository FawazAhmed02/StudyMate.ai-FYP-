import React, { useRef } from "react";
import Head from "next/head";
import { Navbar } from "../components/layout/navbar";
import HeroSection from "../components/features/HeroSection";
import Footer from "../components/layout/footer";
import FeaturesSection from "../components/features/FeaturesSection";
import BenefitsSection from "../components/features/BenefitsSection";
import HowItWorksSection from "../components/features/HowItWorksSection";

const HomePage: React.FC = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Head>
        <title>StudyMate AI</title>
        <meta name="description" content="StudyMate AI helps you study smarter with personalized study materials, quizzes, and learning resources powered by artificial intelligence." />
        <meta property="og:title" content="StudyMate AI - Your AI Study Companion" />
        <meta property="og:description" content="Study smarter, not harder with AI-powered learning tools." />
        <meta property="og:type" content="website" />
      </Head>
      <div>
        <Navbar
          onFeaturesClick={() => scrollToSection(featuresRef)}
          onHowItWorksClick={() => scrollToSection(howItWorksRef)}
          onBenefitsClick={() => scrollToSection(benefitsRef)}
        />
        <section>
          <HeroSection />
        </section>
        <section ref={featuresRef}>
          <FeaturesSection />
        </section>
        <section ref={howItWorksRef}>
          <HowItWorksSection />
        </section>
        <section ref={benefitsRef}>
          <BenefitsSection />
        </section>
        <section>
          <Footer />
        </section>
      </div>
    </>
  );
};

export default HomePage;
