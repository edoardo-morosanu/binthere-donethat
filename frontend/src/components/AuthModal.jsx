import React, { useState } from "react";
import ReactDOM from "react-dom";
import api from "../services/api";

function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "login") {
        const res = await api.post("/auth/login", {
          email: form.email,
          password: form.password,
        });
        onAuthSuccess(res.data);
        onClose();
      } else {
        const res = await api.post("/auth/register", {
          username: form.username,
          email: form.email,
          password: form.password,
        });
        onAuthSuccess(res.data);
        onClose();
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 min-h-screen flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto my-auto p-8 relative animate-fade-in-down overflow-y-auto max-h-screen">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-[#205374] text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 rounded-l-lg font-semibold transition-colors ${
              mode === "login"
                ? "bg-[#27a09e] text-white"
                : "bg-gray-100 text-[#205374] hover:bg-[#e0f7f4]"
            }`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 rounded-r-lg font-semibold transition-colors ${
              mode === "register"
                ? "bg-[#27a09e] text-white"
                : "bg-gray-100 text-[#205374] hover:bg-[#e0f7f4]"
            }`}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === "register" && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#27a09e] focus:outline-none"
              value={form.username}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#27a09e] focus:outline-none"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#27a09e] focus:outline-none"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-[#205374] text-white font-semibold hover:bg-[#27a09e] transition-colors disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (mode === "login" ? "Logging in..." : "Registering...") : mode === "login" ? "Login" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}

export default AuthModal; 