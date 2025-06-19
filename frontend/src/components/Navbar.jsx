import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import UserMenu from "./UserMenu";

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

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
        {/* Desktop links */}
        <div className="hidden md:flex space-x-4 items-center">
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
          {/* User menu on desktop */}
          <UserMenu />
        </div>
        {/* Hamburger for mobile */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-[#205374] mb-1 transition-transform ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-[#205374] mb-1 transition-opacity ${menuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`block w-6 h-0.5 bg-[#205374] transition-transform ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>
      </div>
      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden bg-white bg-opacity-95 shadow-lg px-6 pt-2 pb-4 flex flex-col space-y-2 animate-fade-in-down">
          {links.map(({ to, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`relative px-4 py-2 rounded-md transition-all focus:outline-none ${
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
          {/* User menu on mobile */}
          <div className="pt-2 border-t border-gray-200 mt-2">
            <UserMenu />
          </div>
        </div>
      )}
    </nav>
  );
}
