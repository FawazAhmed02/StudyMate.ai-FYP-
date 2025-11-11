import React, { useState } from "react";
import { API_ENDPOINTS } from "../../config/api";

const VideoSummarization: React.FC = () => {
  const [videoLink, setVideoLink] = useState<string>("");
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoLink(event.target.value);
    setError(null);
  };

  const handleSummarize = async () => {
    if (!videoLink) {
      setError("Please enter a video link.");
      return;
    }

    setLoading(true);
    setError(null);
    setSummary(null);

    try {
      const response = await fetch(API_ENDPOINTS.VIDEO_SUMMARY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoUrl: videoLink }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const cleanSummary = data.summary.replace(/^\[.*\]\s*/gm, "");
        setSummary(cleanSummary);
      } else {
        setError(data.message || "Failed to summarize video.");
      }
    } catch (error) {
      console.error("Error summarizing video:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatSummary = (summary: string) => {
    if (!summary) return null;

    return summary.split("\n").map((line, index) => {
      // Handle bullet points
      if (line.trim().startsWith("*")) {
        const content = line.trim().substring(1).trim();
        return (
          <div key={index} className="flex items-start mb-3">
            <span className="mr-2 text-blue-600">•</span>
            <p className="text-gray-800">{content}</p>
          </div>
        );
      }

      // Handle bold text (wrapped in **)
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

      // Regular text
      if (line.trim()) {
        return (
          <p key={index} className="text-gray-800 mb-3 leading-relaxed">
            {line}
          </p>
        );
      }

      // Spacing for empty lines
      return <div key={index} className="h-2" />;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/2 bg-white shadow rounded-xl p-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Video Summarization
          </h2>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              YouTube Video URL
            </label>
            <input
              type="text"
              value={videoLink}
              onChange={handleLinkChange}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 text-gray-800"
            />
            <p className="text-sm text-gray-500 mt-1">
              Make sure the video has English captions available
            </p>
          </div>

          <button
            onClick={handleSummarize}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-3 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition duration-200"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Generating Summary...
              </span>
            ) : (
              "Generate Summary"
            )}
          </button>
          {error && (
            <div className="mt-4 p-4 bg-red-50 rounded-md">
              <p className="text-red-500">{error}</p>
            </div>
          )}
        </div>

        <div className="lg:w-3/4 bg-white shadow rounded-xl p-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Video Summary
          </h3>
          <div className="overflow-y-auto max-h-[600px]">
            {summary ? (
              <div className="prose max-w-none">{formatSummary(summary)}</div>
            ) : (
              <div className="text-gray-500 italic">
                No summary generated yet. Enter a YouTube URL and click generate
                to see the summary here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoSummarization;
