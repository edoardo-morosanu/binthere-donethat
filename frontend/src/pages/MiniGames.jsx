import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PrivacyPolicyModal from "../components/PrivacyPolicyModal";
import TermsOfServiceModal from "../components/TermsOfServiceModal";

export default function MiniGames() {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const handleBrandClick = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="font-inter antialiased text-gray-900 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 bg-[#d3f5ee] text-center">
        <header className="py-12">
          <h1 className="text-4xl font-extrabold text-[#205374]">Mini Games</h1>
          <p className="mt-2 text-gray-700">
            Sharpen your recycling knowledge with fun, interactive games.
          </p>
        </header>

        <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
            <div className="bg-[#27a09e] p-6">
              <h2 className="text-2xl font-semibold text-white">
                Trash Catcher
              </h2>
            </div>
            <div className="flex-1 p-6 flex flex-col items-center">
              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-6">
                <p className="text-gray-500">Unity game preview placeholder</p>
              </div>
              <button
                className="bg-[#205374] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#1b4561] transition self-center mt-auto mb-4"
                onClick={() => alert("Unity game integration coming soon")}
              >
                Play Now
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
            <div className="bg-[#7de393] p-6">
              <h2 className="text-2xl font-semibold text-[#205374]">
                Flashcard Challenge
              </h2>
            </div>
            <div className="flex-1 p-6 flex flex-col items-center">
              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-6">
                <p className="text-gray-500">
                  Flashcard game preview placeholder
                </p>
              </div>
              <button
                className="bg-[#205374] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#1b4561] transition self-center mt-auto mb-4"
                onClick={() => alert("Flashcard game integration coming soon")}
              >
                Start Now
              </button>
            </div>
          </div>
        </section>
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
