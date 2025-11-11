import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const StudentDashboard: React.FC = () => {
  const [activePage, setActivePage] = useState<string>("Dashboard");
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const studentData = localStorage.getItem("student");
    if (!studentData) {
      router.replace("/login");
      return;
    }
    try {
      const { name } = JSON.parse(studentData);
      setUsername(name);
      setLoading(false);
    } catch {
      localStorage.removeItem("student");
      router.replace("/login");
    }
  }, [router]);

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FA]">
      <Header username={username} />
      <div className="flex flex-1 flex-col md:flex-row">
        <Sidebar setActivePage={setActivePage} />
        <MainContent activePage={activePage} />
      </div>
    </div>
  );
};

export default StudentDashboard;
