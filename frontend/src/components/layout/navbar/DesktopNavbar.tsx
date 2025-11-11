import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navItems, authItems } from "./types";

interface DesktopNavbarProps {
  onFeaturesClick: () => void;
  onHowItWorksClick: () => void;
  onBenefitsClick: () => void;
}

export function DesktopNavbar({
  onFeaturesClick,
  onHowItWorksClick,
  onBenefitsClick,
}: DesktopNavbarProps) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <div className="hidden md:flex justify-between items-center w-full">
      <div className="flex items-center space-x-6">
        <div className="flex items-center">
          <Image
            src="/logo-dark-transparent.png"
            alt="StudyMate AI Logo"
            width={200}
            height={50}
            className="cursor-pointer"
            priority
          />
        </div>

        <div className="flex space-x-6 ml-4">
          {navItems.map((item) =>
            item.href ? (
              <Link
                key={item.label}
                href={item.href}
                className={`px-3 py-2 rounded-md transition duration-300 ease-in-out relative group ${
                  isActive(item.href)
                    ? "text-[#007BFF] font-semibold"
                    : "text-[#343A40] hover:text-[#0056b3]"
                }`}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#007BFF] rounded-full"></span>
                )}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0056b3] rounded-full transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ) : (
              <button
                key={item.label}
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
                }}
                className="px-3 py-2 rounded-md transition duration-300 ease-in-out text-[#343A40] hover:text-[#0056b3] relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0056b3] rounded-full transition-all duration-300 group-hover:w-full"></span>
              </button>
            )
          )}
        </div>
      </div>

      <div className="flex space-x-4">
        {authItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`${
              item.isPrimary
                ? "px-5 py-2 bg-[#4285F4] text-white font-semibold rounded-md hover:bg-[#3367d6] transform hover:-translate-y-0.5 transition-all shadow-sm hover:shadow-md"
                : "px-5 py-2 bg-transparent text-[#444] font-medium border border-[#DDD] rounded-md hover:bg-gray-50 hover:border-[#4285F4] hover:text-[#4285F4] transition-all"
            } transition duration-300 ease-in-out`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
