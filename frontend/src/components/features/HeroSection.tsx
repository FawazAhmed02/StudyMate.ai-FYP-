import React from "react";
import Image from "next/image";
import Link from "next/link";

const HeroSection: React.FC = () => {
  return (
    <div className="relative h-screen flex items-center justify-center bg-cover bg-center px-4 sm:px-6 lg:px-8 pt-[72px]">
      {/* Padding at the top for navbar */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/90 to-transparent"></div>
      <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center space-y-8 lg:space-y-0 lg:space-x-12">
        <div className="text-center lg:text-left lg:w-1/2 space-y-6 animate-fade-in">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight bg-gradient-to-r from-[#4285F4] to-[#3367d6] bg-clip-text text-transparent">
            AI-powered Study Assistant
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 leading-relaxed">
            Transform your study experience with automated notes, quizzes, and more.
          </p>
          <Link
            href="/register"
            className="inline-block mt-4 px-6 sm:px-8 py-3 sm:py-4 bg-[#4285F4] text-white font-semibold rounded-md hover:bg-[#3367d6] transform hover:-translate-y-0.5 transition-all shadow-sm hover:shadow-md"
          >
            Get Started Free
          </Link>
        </div>
        <div className="lg:w-1/2 flex justify-center items-center animate-slide-in">
          <Image
            src="/studyillustration.png"
            alt="StudyMate AI Assistant"
            width={400}
            height={300}
            className="drop-shadow-lg transition-transform duration-500 hover:scale-105 max-w-full"
            priority
            loading="eager"
            quality={90}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;