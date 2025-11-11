import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { steps } from "@/constants/homeData";

const StepCard: React.FC<{
  step: typeof steps[0];
}> = React.memo(({ step }) => (
  <motion.div
    className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col items-center space-y-4 transition-transform duration-300 hover:scale-105 relative"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-r from-[#4285F4] to-[#3367d6] rounded-full flex items-center justify-center">
      <span className="text-3xl font-bold text-white">{step.number}</span>
    </div>

    <Image
      src={step.image}
      alt={step.title}
      width={80}
      height={80}
      className="w-20 h-20"
      loading="lazy"
      quality={85}
    />
    <h3 className="text-2xl font-bold text-[#023047]">
      {step.title}
    </h3>
    <p className="text-gray-700 text-center">
      {step.description}
    </p>
  </motion.div>
));

const HowItWorksSection: React.FC = () => {
  return (
    <section className="relative bg-[#F8FAFB] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-[#4285F4] to-[#3367d6] bg-clip-text text-transparent text-center mb-8">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {steps.map((step) => (
            <StepCard key={step.number} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;