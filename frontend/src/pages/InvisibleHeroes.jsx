import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PrivacyPolicyModal from "../components/PrivacyPolicyModal";
import TermsOfServiceModal from "../components/TermsOfServiceModal";

const stories = [
  {
    id: "rajiv",
    name: "Rajiv Mehta",
    location: "Mumbai, India 🇮🇳",
    context: "Beach Cleanup Volunteer",
    preview:
      "I used to fish from the same beach I now clean every Sunday. Now it's mostly plastic, not fish, that we pull from the water.",
    theme: "Frontlines",
    imageUrl: "/images/heroes/mumbai.png",
    videoUrl: "https://www.youtube.com/embed/1nicf4RjU00",
  },
  {
    id: "fatima",
    name: "Fatima Nouri",
    location: "Gaziantep, Turkey 🇹🇷",
    context: "Syrian Refugee Living Near Landfill",
    preview:
      "My children cough every night. The wind carries the smell of burning plastic into our home. No one sees it unless they live it.",
    theme: "Frontlines",
    imageUrl: "/images/heroes/turkey.png",
    videoUrl: "https://www.youtube.com/embed/1nicf4RjU00",
  },
  {
    id: "lars",
    name: "Lars de Vries",
    location: "Groningen, Netherlands 🇳🇱",
    context: "Student, Sustainability Advocate",
    preview:
      "I realized my recycling didn't matter unless I helped my flatmates recycle too. So I added signs, cleaned bins, and suddenly they joined in.",
    theme: "Everyday Impact",
    imageUrl: "/images/heroes/groningen.png",
    videoUrl: "https://www.youtube.com/embed/1nicf4RjU00",
  },
  {
    id: "ayu",
    name: "Ayu Lestari",
    location: "Bali, Indonesia 🇮🇩",
    context: "Coral Restoration Volunteer",
    preview:
      "Tourists come for the beaches, but we see the plastic that chokes our reefs. I plant coral and pick up trash so my children can swim here, too.",
    theme: "Global Crisis",
    imageUrl: "/images/heroes/bali.png",
    videoUrl: "https://www.youtube.com/embed/1nicf4RjU00",
  },
  {
    id: "miguel",
    name: "Miguel Torres",
    location: "Lima, Peru 🇵🇪",
    context: "Community Organizer",
    preview:
      "We started with five neighbors. Now, every Saturday, dozens join to clear the riverbanks. It's our city, our responsibility.",
    theme: "Global Crisis",
    imageUrl: "/images/heroes/peru.png",
    videoUrl: "https://www.youtube.com/embed/1nicf4RjU00",
  },
  {
    id: "sophia",
    name: "Sophia Müller",
    location: "Hamburg, Germany 🇩🇪",
    context: "Zero Waste Blogger",
    preview:
      "My followers think I'm extreme, but every jar of trash I avoid is one less in the North Sea. Change starts with one habit at a time.",
    theme: "Everyday Impact",
    imageUrl: "/images/heroes/seatrash.png",
    videoUrl: "https://www.youtube.com/embed/1nicf4RjU00",
  },
];

const themes = ["All", "Frontlines", "Everyday Impact", "Global Crisis"];

export default function InvisibleHeroes() {
  const [modalUrl, setModalUrl] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("All");
  const [comingSoonOpen, setComingSoonOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const openModal = (url) => {
    // setModalUrl(url);
    // setTimeout(() => setModalVisible(true), 10);
    setComingSoonOpen(true);
  };

  const closeModal = () => {
    // setModalVisible(false);
    // setTimeout(() => setModalUrl(null), 300);
    setComingSoonOpen(false);
  };

  const handleBrandClick = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredStories =
    selectedTheme === "All"
      ? stories
      : stories.filter((story) => story.theme === selectedTheme);

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
            Every effort counts. From sorting waste at home to cleaning beaches abroad, meet the people fighting back against a world drowning in trash.
          </p>
        </div>
      </header>

      <main className="flex-1 py-12 px-6">
        <div className="max-w-5xl mx-auto mb-8 flex flex-wrap gap-3 justify-center">
          {themes.map((theme) => (
            <button
              key={theme}
              onClick={() => setSelectedTheme(theme)}
              className={`px-4 py-2 rounded-full border font-semibold transition-colors duration-200 text-sm md:text-base
                ${selectedTheme === theme
                  ? "bg-[#27a09e] text-white border-[#27a09e]"
                  : "bg-white text-[#27a09e] border-[#27a09e] hover:bg-[#e6f7f6]"}
              `}
            >
              {theme}
            </button>
          ))}
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {filteredStories.map(({ id, name, location, context, preview, imageUrl, videoUrl }) => (
            <div
              key={id}
              className="bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col group relative"
            >
              <div className="h-1 w-full bg-gradient-to-r from-[#205374] to-[#27a09e]"></div>
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={imageUrl}
                  alt={context}
                  className="object-cover w-full h-full transition-opacity duration-300 group-hover:opacity-70"
                />
                {/* Optionally, overlay a dramatic image or effect on hover */}
                {/* <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> */}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#27a09e] text-xs font-semibold bg-[#e6f7f6] rounded px-2 py-1">{location}</span>
                  <span className="text-gray-500 text-xs">{context}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#205374] mb-1">
                  {name}
                </h2>
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

        {/* Contact Form Section */}
        <section className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-3xl shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-[#205374] mb-2 text-center">Do you have a story that could make an impact?</h2>
          <p className="text-gray-700 mb-6 text-center">We'd love to hear from you. If you or someone you know is making a difference or has been affected by the global waste crisis, please reach out to us below.</p>
          <form
            className="flex flex-col gap-4"
            onSubmit={e => {
              e.preventDefault();
              const form = e.target;
              const data = {
                name: form.name.value,
                email: form.email.value,
                message: form.message.value,
              };
              // For now, just log the data
              console.log('Contact form submitted:', data);
              form.reset();
              alert('Thank you for reaching out!');
            }}
          >
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#27a09e]"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#27a09e]"
            />
            <textarea
              name="message"
              placeholder="Share your story..."
              required
              rows={4}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#27a09e]"
            />
            <button
              type="submit"
              className="bg-[#27a09e] text-white font-semibold rounded-lg px-6 py-2 hover:bg-[#205374] transition-colors"
            >
              Send Message
            </button>
          </form>
        </section>
      </main>

      {comingSoonOpen && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 transition-opacity duration-300 opacity-100`}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden w-11/12 md:w-3/4 lg:w-1/2 p-8 flex flex-col items-center relative"
          >
            <span className="text-3xl mb-4 text-[#27a09e] font-bold">Coming Soon!</span>
            <p className="text-gray-700 text-lg mb-6 text-center">Video stories are on their way. Stay tuned to meet more Invisible Heroes from around the world.</p>
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
