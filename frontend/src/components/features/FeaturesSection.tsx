import React, { useState, useMemo } from "react";
import Image from "next/image";
import { features } from "@/constants/homeData";

const FeatureButton: React.FC<{
  name: string;
  isSelected: boolean;
  onClick: () => void;
}> = React.memo(({ name, isSelected, onClick }) => (
  <button
    className={`w-[180px] h-[60px] flex items-center justify-center px-4 py-2 rounded-lg font-semibold text-center transition-all duration-300 ${
      isSelected
        ? "bg-gradient-to-r from-[#4285F4] to-[#3367d6] text-white shadow-lg"
        : "bg-white text-[#4285F4] border-2 border-[#4285F4] hover:bg-[#4285F4] hover:text-white"
    }`}
    onClick={onClick}
    aria-label={`Select feature: ${name}`}
  >
    {name}
  </button>
));

const FeaturesSection: React.FC = () => {
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(0);

  const selectedFeature = useMemo(() => features[selectedFeatureIndex], [selectedFeatureIndex]);

  return (
    <section className="relative bg-[#F8FAFB] py-16">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-extrabold bg-gradient-to-r from-[#4285F4] to-[#3367d6] bg-clip-text text-transparent">
            Explore Our Features
          </h2>
          <p className="text-lg text-gray-700 mt-4">
            Enhance your learning experience with powerful, AI-driven tools tailored for students.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {features.map((feature, index) => (
            <FeatureButton
              key={feature.name}
              name={feature.name}
              isSelected={selectedFeatureIndex === index}
              onClick={() => setSelectedFeatureIndex(index)}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col justify-center min-h-[300px]">
            <h3 className="text-3xl font-bold text-[#023047] mb-4">
              {selectedFeature.name}
            </h3>
            <p className="text-gray-700 text-lg">
              {selectedFeature.description}
            </p>
          </div>
          <div className="flex justify-center items-center bg-white rounded-2xl shadow-lg border border-gray-200 p-6 min-h-[300px]">
            <Image
              src={selectedFeature.image}
              alt={selectedFeature.name}
              width={500}
              height={350}
              className="rounded-lg shadow-md object-cover w-full max-h-[280px] transition-transform duration-300 hover:scale-105"
              loading="lazy"
              quality={85}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;