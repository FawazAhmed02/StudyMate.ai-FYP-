import React, { useState } from "react";
import { API_ENDPOINTS } from "../../config/api";

const NoteGeneration: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [topic, setTopic] = useState<string>("");
  const [detailLevel, setDetailLevel] = useState<string>("slightly detailed");
  const [notes, setNotes] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleTopicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(event.target.value);
    setError(null);
  };

  const handleDetailLevelChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDetailLevel(event.target.value);
  };

  const handleGenerateNotes = async () => {
    const storedStudent = localStorage.getItem("student");
    const username = storedStudent ? JSON.parse(storedStudent).name : "guest";
    if (!file || !topic) {
      setError("Please upload a PDF file and specify a topic.");
      return;
    }

    setLoading(true);
    setError(null);
    setNotes(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("topic", topic);
    formData.append("detailLevel", detailLevel);
    formData.append("userId", username);

    try {
      const response = await fetch(API_ENDPOINTS.GENERATE_NOTES, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setNotes(data.notes);
      } else {
        setError(data.message || "Failed to generate notes.");
      }
    } catch (error) {
      console.error("Error generating notes:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatNotes = (notes: string) => {
    if (!notes) return null;

    const cleanNotes = notes
      .replace("PDF already indexed.\n", "")
      .replace(/Searching for topic '.*'...\n/, "")
      .replace("Generating notes with Gemini...\n\nGenerated Notes:\n\n", "");

    return cleanNotes.split("\n").map((line, index) => {
      if (line.trim().startsWith("*")) {
        const content = line.trim().substring(1).trim();
        return (
          <div key={index} className="flex items-start mb-3">
            <span className="mr-2 text-blue-600">•</span>
            <p className="text-gray-800">{content}</p>
          </div>
        );
      }

      if (line.includes("**")) {
        return (
          <p key={index} className="text-gray-800 mb-3">
            {line.split("**").map((part, i) =>
              i % 2 === 0 ? (
                part
              ) : (
                <strong key={i} className="font-semibold">
                  {part}
                </strong>
              )
            )}
          </p>
        );
      }

      if (line.trim()) {
        return (
          <p key={index} className="text-gray-800 mb-3 leading-relaxed">
            {line}
          </p>
        );
      }

      return <div key={index} className="h-2" />;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/2 bg-white shadow rounded-xl p-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Note Generation
          </h2>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 text-gray-800"
          />
          <input
            type="text"
            value={topic}
            onChange={handleTopicChange}
            placeholder="Enter chapter/topic name..."
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 text-gray-800"
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Detail Level
            </label>
            <select
              value={detailLevel}
              onChange={handleDetailLevelChange}
              className="w-full mt-1 border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none text-gray-800"
            >
              <option value="very detailed">Very Detailed</option>
              <option value="slightly detailed">Slightly Detailed</option>
              <option value="small overview">Small Overview</option>
            </select>
          </div>
          <button
            onClick={handleGenerateNotes}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-3 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition duration-200"
            disabled={loading}
          >
            {loading ? "Generating Notes..." : "Generate Notes"}
          </button>
          {error && (
            <div className="mt-4 p-4 bg-red-50 rounded-md">
              <p className="text-red-500">{error}</p>
            </div>
          )}
        </div>

        <div className="lg:w-3/4 bg-white shadow rounded-xl p-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Generated Notes
          </h3>
          <div className="overflow-y-auto max-h-[600px]">
            {notes ? (
              <div className="prose max-w-none">{formatNotes(notes)}</div>
            ) : (
              <div className="text-gray-500 italic">
                No notes generated yet. Upload a PDF and enter a topic to see
                the notes here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteGeneration;
