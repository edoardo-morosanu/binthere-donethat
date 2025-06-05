import React, { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function WasteSorter() {
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const handleTab = useCallback((tab) => setActiveTab(tab), []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setAnalysisResult(null);
    setConfirmed(false);
  };

  const handleAnalyze = () => {
    if (!selectedFile) return;
    // Mock analysis result
    setAnalysisResult({
      item: "Plastic Bottle",
      suggestion: "Place in Recycling Bin",
    });
  };

  const handleConfirm = () => {
    setConfirmed(true);
  };

  return (
    <div className="font-inter antialiased text-gray-900 bg-gradient-to-b from-[#e3f2f1] to-white min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 px-6 pb-12 flex justify-center items-start">
        <div className="w-full max-w-md">
          <div className="flex rounded-t-2xl overflow-hidden shadow-lg bg-white my-4">
            <button
              onClick={() => handleTab("upload")}
              className={`flex-1 py-3 text-center font-semibold transition ${
                activeTab === "upload"
                  ? "bg-[#27a09e] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Upload
            </button>
            <button
              onClick={() => handleTab("instructions")}
              className={`flex-1 py-3 text-center font-semibold transition ${
                activeTab === "instructions"
                  ? "bg-[#27a09e] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Instructions
            </button>
          </div>

          <div className="bg-white rounded-b-2xl shadow-lg p-8">
            {activeTab === "upload" ? (
              <div className="flex flex-col items-center">
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-[#27a09e] hover:border-[#205374] transition mb-6 relative">
                  {!selectedFile ? (
                    <p className="text-gray-500">
                      Click or Drag &amp; Drop to upload
                    </p>
                  ) : (
                    <p className="text-gray-700">{selectedFile.name}</p>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={!selectedFile || analysisResult}
                  className={`w-full font-semibold py-3 rounded-lg transition mb-6 ${
                    selectedFile && !analysisResult
                      ? "bg-[#27a09e] text-white hover:bg-[#205374]"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  Analyze Image
                </button>
                {analysisResult && (
                  <div className="w-full bg-[#d3f5ee] rounded-lg p-6 flex flex-col items-center">
                    {!confirmed ? (
                      <>
                        <h3 className="text-xl font-semibold text-[#205374] mb-2">
                          Result:
                        </h3>
                        <p className="text-gray-800 mb-4">
                          Item: {analysisResult.item}
                        </p>
                        <p className="text-gray-800 mb-6">
                          Suggestion: {analysisResult.suggestion}
                        </p>
                        <button
                          onClick={handleConfirm}
                          className="bg-[#205374] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#184754] transition"
                        >
                          I Have Disposed
                        </button>
                      </>
                    ) : (
                      <p className="text-[#205374] font-semibold">
                        Thank you for your contribution!
                      </p>
                    )}
                  </div>
                )}
                {!analysisResult && (
                  <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                    <p>Analysis results will appear here</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-semibold text-[#205374] mb-4 text-center">
                  How to Use AI Waste Sorter
                </h2>
                <ul className="list-decimal list-inside space-y-4 text-gray-700">
                  <li>
                    <span className="font-semibold">Prepare Your Item:</span>{" "}
                    Ensure good lighting and a clear background for the image.
                  </li>
                  <li>
                    <span className="font-semibold">Upload a Photo:</span> Click
                    or drag your image into the upload area above.
                  </li>
                  <li>
                    <span className="font-semibold">Analyze:</span> Click
                    "Analyze Image" and wait for AI classification.
                  </li>
                  <li>
                    <span className="font-semibold">Review Suggestion:</span>{" "}
                    View the suggested bin category in the result panel.
                  </li>
                  <li>
                    <span className="font-semibold">Dispose Responsibly:</span>{" "}
                    Follow AI guidance to recycle correctly, then confirm
                    disposal.
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-6 bg-[#205374] text-[#d3f5ee] text-center">
        © 2025 Bin There, Done That
      </footer>
    </div>
  );
}
