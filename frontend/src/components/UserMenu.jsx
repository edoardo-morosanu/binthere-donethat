import React, { useState, useEffect } from "react";
import AuthModal from "./AuthModal";
import ProfileModal from "./ProfileModal";
import PrivacyPolicyModal from "./PrivacyPolicyModal";
import TermsOfServiceModal from "./TermsOfServiceModal";
import api from "../services/api";

export default function UserMenu() {
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => {
          setUser(null);
          localStorage.removeItem("token");
        });
    }
  }, []);

  const handleAuthSuccess = (data) => {
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <>
      {user ? (
        <button
          className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-[#e0f7f4] hover:bg-[#27a09e] hover:text-white text-[#205374] font-semibold transition-colors focus:outline-none"
          onClick={() => setProfileOpen(true)}
        >
          <span className="w-8 h-8 rounded-full bg-[#27a09e] text-white flex items-center justify-center font-bold">
            {user.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
          </span>
          <span className="hidden md:inline">{user.username}</span>
        </button>
      ) : (
        <button
          className="px-4 py-2 rounded-lg bg-[#205374] text-white font-semibold hover:bg-[#27a09e] transition-colors focus:outline-none"
          onClick={() => setAuthOpen(true)}
        >
          Login / Register
        </button>
      )}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        onOpenPrivacyPolicy={() => setPrivacyOpen(true)}
        onOpenTermsOfService={() => setTermsOpen(true)}
      />
      {user && (
        <ProfileModal
          isOpen={profileOpen}
          onClose={() => setProfileOpen(false)}
          user={user}
          onLogout={handleLogout}
          onUserUpdate={setUser}
        />
      )}
      <PrivacyPolicyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <TermsOfServiceModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
    </>
  );
} 