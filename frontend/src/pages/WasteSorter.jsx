import React, { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { confirmDisposal } from "../services/api";
import apiClient from "../services/api";
import Footer from "../components/Footer";
import PrivacyPolicyModal from "../components/PrivacyPolicyModal";
import TermsOfServiceModal from "../components/TermsOfServiceModal";

export default function WasteSorter({ user, setUser }) {
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const handleTab = useCallback((tab) => setActiveTab(tab), []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setAnalysisResult(null);
    setConfirmed(false);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };  
  
  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError("");
    setAnalysisResult(null);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "multipart/form-data",
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await apiClient.post("/prediction/predict", formData, {
        headers,
      });
      
      const data = response.data;
      if (!data.success) {
        setError(data.message || "Prediction failed. Please try again.");
      } else if (!data.data || !data.data.detections || !data.data.detections.main_object) {
        setError(data.message || "No recognizable object found. Try another image.");
      } else {
        const main = data.data.detections.main_object;
        setAnalysisResult({
          item: main.class,
          suggestion: main.bin,
          confidence: main.confidence,
          alternatives: main.alternative_classifications || [],
          lowConfidence: data.data.lowConfidence || false,
          lowConfidenceMessage: data.data.lowConfidence ? data.message : undefined,
        });
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Prediction failed. Please try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setConfirmLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const res = await confirmDisposal(token);
        if (res.data && res.data.userItemsSortedCount !== undefined && setUser) {
          setUser((prev) => ({ ...prev, itemsSortedCount: res.data.userItemsSortedCount }));
        }
      }
      setConfirmed(true);
    } catch (err) {
      // Optionally show error
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleBrandClick = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
                    previewUrl ? (
                      <img
                        src={previewUrl}
                        alt={selectedFile.name}
                        className="max-h-60 max-w-full object-contain rounded shadow"
                      />
                    ) : (
                      <p className="text-gray-700">{selectedFile.name}</p>
                    )
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={!selectedFile || analysisResult || loading}
                  className={`w-full font-semibold py-3 rounded-lg transition mb-6 ${
                    selectedFile && !analysisResult && !loading
                      ? "bg-[#27a09e] text-white hover:bg-[#205374]"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  {loading ? "Analyzing..." : "Analyze Image"}
                </button>
                {error && (
                  <div className="w-full text-red-500 text-center mb-4">{error}</div>
                )}
                {analysisResult && (
                  <div className="w-full bg-[#d3f5ee] rounded-lg p-6 flex flex-col items-center">
                    {!confirmed ? (
                      <>
                        {analysisResult.lowConfidence && (
                          <div className="w-full mb-4 p-3 rounded-lg bg-yellow-100 border border-yellow-400 text-yellow-800 text-center font-semibold">
                            {analysisResult.lowConfidenceMessage || "Couldn't confidently classify this item. Please check the instructions and try again."}
                          </div>
                        )}
                        <h3 className="text-2xl font-bold text-[#205374] mb-4 flex items-center gap-2">
                          <svg xmlns='http://www.w3.org/2000/svg' className='h-7 w-7 text-[#27a09e]' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4' /></svg>
                          Result
                        </h3>
                        <div className="mb-2 text-lg text-gray-800 font-semibold">{analysisResult.item}</div>
                        <div className="mb-4 text-base text-[#27a09e] font-bold">{analysisResult.suggestion}</div>
                        <div className="mb-4">
                          <span className="inline-block bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full">Confidence: {(analysisResult.confidence * 100).toFixed(1)}%</span>
                        </div>
                        {analysisResult.alternatives && analysisResult.alternatives.length > 0 && (
                          <div className="mb-4 w-full">
                            <p className="text-gray-700 font-semibold mb-1">Alternatives:</p>
                            <ul className="list-disc list-inside text-gray-600 text-sm">
                              {analysisResult.alternatives.map((alt, idx) => (
                                <li key={idx}>{alt.class} ({(alt.probability * 100).toFixed(1)}%)</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <button
                          onClick={handleConfirm}
                          disabled={
                            confirmLoading ||
                            analysisResult.lowConfidence ||
                            !analysisResult.item
                          }
                          className={`bg-[#205374] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#184754] transition mt-2 ${
                            confirmLoading || analysisResult.lowConfidence || !analysisResult.item
                              ? "opacity-60 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {confirmLoading ? "Confirming..." : "I Have Disposed"}
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

      <Footer
        onOpenPrivacyPolicy={() => setPrivacyOpen(true)}
        onOpenTermsOfService={() => setTermsOpen(true)}
        handleBrandClick={handleBrandClick}
      />
      <PrivacyPolicyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <TermsOfServiceModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
    </div>
  );
}
