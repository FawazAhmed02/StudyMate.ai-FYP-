import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { navItems, authItems } from "./types";

interface MobileNavbarProps {
  isOpen: boolean;
  onToggle: () => void;
  onFeaturesClick: () => void;
  onHowItWorksClick: () => void;
  onBenefitsClick: () => void;
}

export function MobileNavbar({
  isOpen,
  onToggle,
  onFeaturesClick,
  onHowItWorksClick,
  onBenefitsClick,
}: MobileNavbarProps) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <div className="md:hidden w-full">
      <div className="flex justify-between items-center py-1">
        <div className="flex items-center">
          <Image
            src="/logo-dark-transparent.png"
            alt="StudyMate AI Logo"
            width={150}
            height={40}
            className="cursor-pointer"
            priority
          />
        </div>

        <button
          onClick={onToggle}
          className="flex items-center px-3 py-2 rounded-md text-[#343A40] border border-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#4285F4] hover:bg-gray-50 transition-all duration-150"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
        >
          <motion.svg
            className="fill-current h-5 w-5 text-[#343A40]"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            animate={isOpen ? "open" : "closed"}
            variants={{
              open: { rotate: 180 },
              closed: { rotate: 0 }
            }}
            transition={{ duration: 0.3 }}
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0zm0 6h20v2H0zm0 6h20v2H0z" />
          </motion.svg>
        </button>
      </div>

      {isOpen && (
        <motion.div
          id="mobile-menu"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-3 space-y-1 pt-2 pb-3 border-t border-gray-200 bg-white rounded-md shadow-md"
        >
          {navItems.map((item, index) => (
            item.href ? (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={item.href}
                  className={`block px-4 py-3 mx-2 my-1 rounded-md transition duration-300 ease-in-out ${
                    isActive(item.href) 
                      ? "text-[#4285F4] font-semibold bg-[#F0F7FF]" 
                      : "text-[#343A40] hover:bg-gray-50 hover:text-[#4285F4]"
                  }`}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  onClick={onToggle}
                >
                  {item.label}
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() => {
                    switch (item.label) {
                      case "Features":
                        onFeaturesClick();
                        break;
                      case "How it works":
                        onHowItWorksClick();
                        break;
                      case "Why Us?":
                        onBenefitsClick();
                        break;
                    }
                    onToggle();
                  }}
                  className="block w-full text-left px-4 py-3 mx-2 my-1 rounded-md transition duration-300 ease-in-out text-[#343A40] hover:bg-gray-50 hover:text-[#4285F4]"
                >
                  {item.label}
                </button>
              </motion.div>
            )
          ))}
          
          <div className="pt-2 mt-2 border-t border-gray-100">
            {authItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (navItems.length + index) * 0.05 }}
              >
                <Link
                  href={item.href}
                  className={`block mx-2 my-2 px-4 py-2 rounded-md ${
                    item.isPrimary
                      ? "bg-[#4285F4] text-white font-medium hover:bg-[#3367d6] shadow-sm"
                      : "bg-transparent text-[#444] border border-[#DDD] hover:bg-gray-50 hover:border-[#4285F4] hover:text-[#4285F4]"
                  } transition duration-300`}
                  onClick={onToggle}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
