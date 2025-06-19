import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PrivacyPolicyModal from "../components/PrivacyPolicyModal";
import TermsOfServiceModal from "../components/TermsOfServiceModal";

const interviews = [
  {
    id: "john",
    name: "John Doe",
    role: "Sanitation Worker, City Dept",
    preview:
      "\"Every bag I lift tells a story of what's inside people's lives. Improper recycling turns my shift into a hunt for hazardous waste.\"",
    videoUrl: "https://www.youtube.com//embed/1nicf4RjU00",
  },
  {
    id: "mary",
    name: "Mary Smith",
    role: "Recycling Center Supervisor",
    preview:
      '"When recyclables are contaminated, our entire process grinds to a halt. It\'s a ripple effect that impacts us all."',
    videoUrl: "https://www.youtube.com//embed/1nicf4RjU00",
  },
  {
    id: "alex",
    name: "Alex Johnson",
    role: "Truck Driver, Waste Management",
    preview:
      '"Driving through neighborhoods, I see hope in bins correctly sorted. But wrong items slow us down and risk everyone’s safety."',
    videoUrl: "https://www.youtube.com//embed/1nicf4RjU00",
  },
  {
    id: "linda",
    name: "Linda Lee",
    role: "Sorting Facility Technician",
    preview:
      '"Every contaminant makes its way to the landfill, adding danger and cost. Our work is unseen but vital."',
    videoUrl: "https://www.youtube.com//embed/1nicf4RjU00",
  },
];

export default function InvisibleHeroes() {
  const [modalUrl, setModalUrl] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const openModal = (url) => {
    setModalUrl(url);
    setTimeout(() => setModalVisible(true), 10);
  };

  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => setModalUrl(null), 300);
  };

  const handleBrandClick = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="font-inter antialiased text-gray-900 bg-gradient-to-b from-[#f2f7f5] to-white min-h-screen flex flex-col">
      <Navbar />

      <header className="relative h-72 flex items-center justify-center mt-16 overflow-hidden">
        <div className="absolute inset-0 bg-[#d3f5ee]" />
        <div className="relative text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#205374] mb-2">
            Invisible Heroes
          </h1>
          <p className="text-base md:text-lg text-gray-700 max-w-xl mx-auto">
            Hear the voices behind the bins. Real stories that remind us why
            recycling matters.
          </p>
        </div>
      </header>

      <main className="flex-1 py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {interviews.map(({ id, name, role, preview, videoUrl }) => (
            <div
              key={id}
              className="bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col"
            >
              <div className="h-1 w-full bg-gradient-to-r from-[#205374] to-[#27a09e]"></div>
              <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-2xl md:text-3xl font-bold text-[#205374] mb-1">
                  {name}
                </h2>
                <p className="text-sm text-[#27a09e] mb-4 italic">{role}</p>
                <p className="text-gray-700 mb-6 flex-1">{preview}</p>
                <div className="mt-auto">
                  <button
                    onClick={() => openModal(videoUrl)}
                    className="inline-flex items-center text-[#7de393] hover:text-[#30ce88] font-semibold"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-5.197-3.034A1 1 0 008 9.054v5.892a1 1 0 001.555.832l5.197-3.034a1 1 0 000-1.664z"
                      />
                    </svg>
                    Watch Story
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {modalUrl && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 transition-opacity duration-300 ${
            modalVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`bg-white rounded-2xl overflow-hidden w-11/12 md:w-3/4 lg:w-1/2 transform transition-transform duration-300 ${
              modalVisible ? "scale-100" : "scale-95"
            }`}
          >
            <div className="relative pb-[56.25%]">
              <iframe
                src={modalUrl}
                title="Interview Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

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
