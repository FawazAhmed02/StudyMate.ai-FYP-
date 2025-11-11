import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { benefits } from "@/constants/homeData";

const BenefitsSection = () => {
  const [activeBenefit, setActiveBenefit] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBenefit((prev) => (prev + 1) % benefits.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [benefits.length]);

  return (
    <div className="relative bg-[#F8FAFB] py-16 px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Section Header */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight text-center">
          Why Choose{" "}
          <span className="bg-gradient-to-r from-[#4285F4] to-[#3367d6] bg-clip-text text-transparent">
            Our Solution?
          </span>
        </h2>

        {/* Benefits Cards */}
        <div className="flex flex-col space-y-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.id}
              className={`relative p-6 rounded-2xl shadow-lg transition-all duration-500 ${
                activeBenefit === index
                  ? "bg-gradient-to-r from-[#EAF4FA] to-[#E8F0FE] scale-105"
                  : "bg-white"
              }`}
              initial={{ opacity: 0.8, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Vertical Progress Indicator */}
              <div className="absolute top-0 left-0 h-full w-2 bg-gray-300 rounded-l-lg overflow-hidden">
                {activeBenefit === index && (
                  <motion.div
                    className="absolute left-0 top-0 w-full bg-[#4285F4] rounded-l-lg"
                    initial={{ height: "0%" }}
                    animate={{ height: "100%" }}
                    transition={{ duration: 3, ease: "linear" }}
                  ></motion.div>
                )}
              </div>

              {/* Benefit Content */}
              <h3
                className={`text-lg md:text-xl font-bold ${
                  activeBenefit === index
                    ? "text-[#4285F4]"
                    : "text-gray-500"
                }`}
              >
                {benefit.title}
              </h3>
              {activeBenefit === index && (
                <p className="text-gray-700 text-base md:text-lg mt-2 leading-relaxed">
                  {benefit.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;