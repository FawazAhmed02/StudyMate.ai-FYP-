import React from "react";
import Quiz from "./pages/Quiz";
import VideoSummarization from "./pages/VideoSummarization";
import NoteGeneration from "./pages/NoteGeneration";
import Dashboard from './pages/Dashboard';

interface MainContentProps {
  activePage: string;
}

const MainContent: React.FC<MainContentProps> = ({ activePage }) => {
  const renderContent = () => {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard />;
      case "Quiz Generation":
        return <Quiz />;
      case "Notes Summarization":
        return <NoteGeneration />;
      case "Video Summarization":
        return <VideoSummarization />;
      default:
        return (
          <h1 className="text-3xl font-bold text-[#22304A]">
            Welcome to your Dashboard
          </h1>
        );
    }
  };

  return (
    <main className="flex-1 p-6 bg-white m-4 rounded-lg shadow-md">
      <div className="max-w-4xl mx-auto">{renderContent()}</div>
    </main>
  );
};

export default MainContent;
