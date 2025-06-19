import React from "react";
import { Link } from "react-router-dom";

export default function Footer({ onOpenPrivacyPolicy, onOpenTermsOfService, handleBrandClick }) {
  return (
    <footer className="py-6 bg-[#205374] text-[#d3f5ee]">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <Link
          to="/"
          onClick={handleBrandClick}
          className="text-[#d3f5ee] hover:text-[#7de393]"
        >
          © 2025 Bin There, Done That
        </Link>
        <div className="space-x-4 mt-4 md:mt-0">
          <button
            type="button"
            onClick={onOpenPrivacyPolicy}
            className="hover:text-[#7de393] bg-transparent border-none outline-none cursor-pointer text-inherit"
            style={{ background: "none", border: "none", padding: 0 }}
          >
            Privacy Policy
          </button>
          <button
            type="button"
            onClick={onOpenTermsOfService}
            className="hover:text-[#7de393] bg-transparent border-none outline-none cursor-pointer text-inherit"
            style={{ background: "none", border: "none", padding: 0 }}
          >
            Terms of Service
          </button>
        </div>
      </div>
    </footer>
  );
} 