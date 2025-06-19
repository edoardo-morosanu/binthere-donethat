import React, { useState } from "react";
import ReactDOM from "react-dom";
import api from "../services/api";

function ProfileModal({ isOpen, onClose, user, onLogout, onUserUpdate }) {
  const [showPassword, setShowPassword] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [delLoading, setDelLoading] = useState(false);
  const [delError, setDelError] = useState("");
  const [manageOpen, setManageOpen] = useState(false);

  if (!isOpen) return null;

  const handlePwChange = (e) => {
    setPwForm({ ...pwForm, [e.target.name]: e.target.value });
  };

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    setPwLoading(true);
    setPwError("");
    setPwSuccess("");
    try {
      await api.put(
        "/auth/password",
        {
          currentPassword: pwForm.currentPassword,
          newPassword: pwForm.newPassword,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setPwSuccess("Password updated!");
      setPwForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setPwError(err.response?.data?.error || "Error updating password");
    } finally {
      setPwLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    setDelLoading(true);
    setDelError("");
    try {
      await api.delete("/auth/me", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      onLogout();
      onClose();
    } catch (err) {
      setDelError(err.response?.data?.error || "Error deleting account");
    } finally {
      setDelLoading(false);
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
        {/* User info and stats */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#e0f7f4] flex items-center justify-center text-3xl font-bold text-[#205374] mb-2">
            {user.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
          </div>
          <div className="font-bold text-2xl text-[#205374]">{user.username}</div>
          <div className="text-gray-500 text-sm mb-1">{user.email}</div>
          <div className="text-gray-400 text-xs mb-4">Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
          <div className="w-full flex flex-col items-center mb-2">
            <div className="text-lg text-[#205374] font-semibold mb-1">Items Recycled</div>
            <div className="text-5xl font-extrabold text-[#27a09e] drop-shadow-sm mb-2">{user.itemsSortedCount ?? 0}</div>
            <div className="text-xs text-gray-400">with Bin There, Done That</div>
          </div>
        </div>
        {/* Log out button */}
        <button
          className="w-full py-2 rounded-lg bg-gray-100 text-[#205374] font-semibold hover:bg-[#e0f7f4] transition-colors mb-4"
          onClick={() => {
            onLogout();
            onClose();
          }}
        >
          Log Out
        </button>
        {/* Collapsible account management */}
        <div className="border-t pt-4 mt-4">
          <button
            className="w-full flex items-center justify-between py-2 px-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-[#205374] font-semibold focus:outline-none"
            onClick={() => setManageOpen((v) => !v)}
            aria-expanded={manageOpen}
            aria-controls="account-manage-section"
          >
            <span>Account Management</span>
            <svg className={`w-5 h-5 ml-2 transition-transform ${manageOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
          {manageOpen && (
            <div id="account-manage-section" className="mt-4 space-y-4">
              <form className="space-y-3" onSubmit={handlePwSubmit}>
                <div className="font-semibold text-[#205374]">Change Password</div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="currentPassword"
                  placeholder="Current Password"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#27a09e] focus:outline-none"
                  value={pwForm.currentPassword}
                  onChange={handlePwChange}
                  required
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="New Password (min 6 chars)"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#27a09e] focus:outline-none"
                  value={pwForm.newPassword}
                  onChange={handlePwChange}
                  required
                  minLength={6}
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showPw"
                    checked={showPassword}
                    onChange={() => setShowPassword((v) => !v)}
                  />
                  <label htmlFor="showPw" className="text-sm text-gray-500">Show passwords</label>
                </div>
                {pwError && <div className="text-red-500 text-sm">{pwError}</div>}
                {pwSuccess && <div className="text-green-600 text-sm">{pwSuccess}</div>}
                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-[#205374] text-white font-semibold hover:bg-[#27a09e] transition-colors disabled:opacity-60"
                  disabled={pwLoading}
                >
                  {pwLoading ? "Updating..." : "Update Password"}
                </button>
              </form>
              <button
                className="w-full py-2 rounded-lg bg-red-100 text-red-600 font-semibold hover:bg-red-200 transition-colors disabled:opacity-60"
                onClick={handleDelete}
                disabled={delLoading}
              >
                {delLoading ? "Deleting..." : "Delete Account"}
              </button>
              {delError && <div className="text-red-500 text-sm mb-2">{delError}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}

export default ProfileModal; 