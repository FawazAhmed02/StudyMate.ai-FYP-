import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaFileAlt,
  FaVideo,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

interface SidebarProps {
  setActivePage: (page: string) => void;
}

const navItems = [
  {
    label: "Dashboard",
    icon: <FaTachometerAlt size={22} />,
    page: "Dashboard",
  },
  {
    label: "Quiz Generation",
    icon: <FaFileAlt size={22} />,
    page: "Quiz Generation",
  },
  {
    label: "Notes Summarization",
    icon: <FaFileAlt size={22} />,
    page: "Notes Summarization",
  },
  {
    label: "Video Summarization",
    icon: <FaVideo size={22} />,
    page: "Video Summarization",
  },
];

const Sidebar: React.FC<SidebarProps> = ({ setActivePage }) => {
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    setActivePage(page);
  };

  const getButtonClass = (page: string) => {
    const isActive = currentPage === page;
    return `
      flex items-center w-full text-left px-4 py-3 my-1 rounded-r-2xl transition duration-200
      ${
        isActive
          ? "bg-white shadow text-[#22304A] font-bold"
          : "text-white font-medium hover:bg-[#E3F0FF] hover:text-[#22304A]"
      }
      group
    `;
  };

  const getIconClass = (page: string) => {
    const isActive = currentPage === page;
    return `
      mr-3
      ${isActive ? "text-[#22304A]" : "text-white group-hover:text-[#22304A]"}
      transition-colors duration-200
    `;
  };

  return (
    <aside
      className={`bg-[#22304A] text-white ${
        collapsed ? "w-16" : "w-56"
      } min-h-[88vh] py-6 px-2 flex flex-col rounded-r-3xl shadow-lg transition-all duration-300 m-4`}
    >
      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => (
          <button
            key={item.page}
            onClick={() => handlePageChange(item.page)}
            className={getButtonClass(item.page)}
          >
            <span className={getIconClass(item.page)}>{item.icon}</span>
            {!collapsed && (
              <span className="text-base tracking-wide">{item.label}</span>
            )}
          </button>
        ))}
      </nav>
      <div className="flex justify-end mt-6">
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="p-2 rounded-full bg-[#1A253A] hover:bg-[#E3F0FF] hover:text-[#22304A] text-white transition-all duration-200"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <FaChevronRight size={18} />
          ) : (
            <FaChevronLeft size={18} />
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
