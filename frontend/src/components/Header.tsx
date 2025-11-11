import React from "react";
import { useRouter } from "next/router";

interface HeaderProps {
  username: string;
}

const Header: React.FC<HeaderProps> = ({ username }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("student");
    router.push("/login");
  };

  return (
    <header className="w-full px-8 py-2 flex items-center justify-between bg-white shadow-sm">
      <div className="flex items-center">
        <img
          src="/logo-dark-transparent.png"
          alt="StudyMate AI Logo"
          className="h-10 w-[160px] object-contain"
        />
      </div>
      <div className="flex items-center space-x-4">
        <span className="bg-[#F3F6FA] text-[#4285F4] font-semibold text-base px-4 py-1 rounded-md hidden md:inline">
          {username}
        </span>
        <img
          src="/user.png"
          alt="User Avatar"
          className="w-9 h-9 rounded-full object-cover border border-[#E0E7EF] bg-white"
        />
        <button
          onClick={handleLogout}
          className="px-5 py-2 bg-[#4285F4] text-white font-semibold rounded-md hover:bg-[#3367d6] transition-all shadow-sm"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
