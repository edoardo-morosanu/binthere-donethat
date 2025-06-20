import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import CountUp from "../components/Countup";
import PrivacyPolicyModal from "../components/PrivacyPolicyModal";
import TermsOfServiceModal from "../components/TermsOfServiceModal";
import Footer from "../components/Footer";

export default function HomePage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const handleScroll = useCallback((e) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute("href").substring(1);
    const section = document.getElementById(targetId);
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  const handleBrandClick = useCallback((e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="font-inter antialiased text-gray-900">
      <Navbar />

      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/environment.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-[#205374]/60 to-[#27a09e]/60"></div>
        <div className="relative text-center px-4 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
            Turn the Tide on Waste
          </h1>
          <p className="text-lg md:text-xl text-white mb-8">
            Empower yourself with tools to recycle smart and protect our planet.
          </p>
          <a
            href="#features"
            onClick={handleScroll}
            className="inline-block bg-[#7de393] hover:bg-[#30ce88] text-[#205374] font-semibold py-3 px-8 rounded-full shadow-lg transition"
          >
            Get Started
          </a>
        </div>
      </header>

      <section id="features" className="pt-32 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid gap-8 grid-cols-1 md:grid-cols-3">
          <Link
            to="/sorter"
            className="block p-8 bg-[#d3f5ee] rounded-2xl shadow-lg transform hover:-translate-y-2 hover:shadow-2xl transition group"
          >
            <h3 className="text-2xl font-semibold text-[#205374] mb-3 group-hover:text-[#27a09e]">
              AI Waste Sorter
            </h3>
            <p className="text-gray-700 group-hover:text-gray-800">
              Upload an image and let our AI tell you how to recycle it.
            </p>
            <span className="mt-4 inline-block text-[#27a09e] font-semibold group-hover:text-[#205374]">
              Try It →
            </span>
          </Link>

          <Link
            to="/games"
            className="block p-8 bg-[#d3f5ee] rounded-2xl shadow-lg transform hover:-translate-y-2 hover:shadow-2xl transition group"
          >
            <h3 className="text-2xl font-semibold text-[#205374] mb-3 group-hover:text-[#27a09e]">
              Learn Recycling
            </h3>
            <p className="text-gray-700">
              Educate yourself with our interactive mini-games.
            </p>
            <span className="mt-4 inline-block text-[#27a09e] font-semibold group-hover:text-[#205374]">
              Try It →
            </span>
          </Link>

          <Link
            to="/heroes"
            className="block p-8 bg-[#d3f5ee] rounded-2xl shadow-lg transform hover:-translate-y-2 hover:shadow-2xl transition group"
          >
            <h3 className="text-2xl font-semibold text-[#205374] mb-3 group-hover:text-[#27a09e]">
              Invisible Heroes
            </h3>
            <p className="text-gray-700">
              Discover global voices, ordinary people and changemakers, fighting back against a world drowning in waste.
            </p>
            <span className="mt-4 inline-block text-[#27a09e] font-semibold group-hover:text-[#205374]">
              Try It →
            </span>
          </Link>
        </div>
      </section>

      <section
        id="about"
        className="py-16 bg-gradient-to-r from-[#27a09e] to-[#7de393] text-white"
      >
        <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-4xl font-bold">Why It Matters</h2>
          <p className="text-lg">
            Each year, millions of tons of recyclable materials end up in
            landfills. Recycling reduces pollution, conserves resources, and
            combats climate change.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white bg-opacity-20 rounded-lg">
              <div className="text-3xl font-bold">
                <CountUp
                  from={0}
                  to={8}
                  separator=","
                  direction="up"
                  duration={2}
                  className="text-white"
                />
                M+
              </div>
              <div className="mt-2">Tons of plastic in oceans</div>
            </div>
            <div className="p-6 bg-white bg-opacity-20 rounded-lg">
              <div className="text-3xl font-bold">
                <CountUp
                  from={0}
                  to={1500000000}
                  separator=","
                  direction="up"
                  duration={2}
                  className="text-white"
                />
              </div>
              <div className="mt-2">Tons landfilled annually</div>
            </div>
            <div className="p-6 bg-white bg-opacity-20 rounded-lg">
              <div className="text-3xl font-bold">
                <CountUp
                  from={0}
                  to={30}
                  separator=","
                  direction="up"
                  duration={2}
                  className="text-white"
                />
                %
              </div>
              <div className="mt-2">CO₂ reduction via recycling</div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-[#205374] mb-4">
            Do you have a story or feedback? Reach out to us!
          </h2>
          <p className="text-gray-700 mb-6">
            We'd love to hear from you. Share your story, feedback, or questions below.
          </p>
          <form
            className="flex flex-col gap-4 items-center"
            style={{ maxWidth: 500, margin: '0 auto' }}
            onSubmit={e => {
              e.preventDefault();
              const form = e.target;
              const data = {
                name: form.name.value,
                email: form.email.value,
                message: form.message.value,
              };
              console.log('Homepage contact form submitted:', data);
              form.reset();
              alert('Thank you for reaching out!');
            }}
          >
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#27a09e]"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#27a09e]"
            />
            <textarea
              name="message"
              placeholder="Your message..."
              required
              rows={4}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#27a09e]"
            />
            <button
              type="submit"
              className="bg-[#205374] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#1b4561] transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

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
