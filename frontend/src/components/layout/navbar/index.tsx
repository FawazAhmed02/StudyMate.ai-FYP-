import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { DesktopNavbar } from "./DesktopNavbar";
import { MobileNavbar } from "./MobileNavbar";
import { NavbarProps } from "./types";

export function Navbar({
  onFeaturesClick,
  onHowItWorksClick,
  onBenefitsClick,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isMobile]);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gradient-to-r from-[#F8F9FA] to-[#F0F2F5] text-white py-3 px-4 sticky top-0 z-50 shadow-sm"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto">
        <DesktopNavbar
          onFeaturesClick={onFeaturesClick}
          onHowItWorksClick={onHowItWorksClick}
          onBenefitsClick={onBenefitsClick}
        />
        <MobileNavbar
          isOpen={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
          onFeaturesClick={onFeaturesClick}
          onHowItWorksClick={onHowItWorksClick}
          onBenefitsClick={onBenefitsClick}
        />
      </div>
    </motion.nav>
  );
} 