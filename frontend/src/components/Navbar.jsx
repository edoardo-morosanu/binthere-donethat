import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/sorter", label: "AI Waste Sorter" },
    { to: "/games", label: "Mini Games" },
    { to: "/heroes", label: "Invisible Heroes" },
  ];

  return (
    <nav className="fixed top-0 w-full z-10 bg-white bg-opacity-90 backdrop-blur-sm shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <img src="/logo.png" alt="Bin There, Done That" className="h-10" />
          <span className="text-xl font-bold text-[#205374]">
            Bin There, Done That
          </span>
        </Link>
        <div className="flex space-x-4">
          {links.map(({ to, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`relative flex items-center px-4 py-2 rounded-md transition-all focus:outline-none ${
                  active
                    ? "bg-[#27a09e] text-white"
                    : "text-gray-800 hover:bg-[#e0f7f4] hover:text-[#205374]"
                }`}
              >
                {label}
                {active && (
                  <span className="absolute inset-0 border-2 border-[#205374] rounded-md pointer-events-none" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
