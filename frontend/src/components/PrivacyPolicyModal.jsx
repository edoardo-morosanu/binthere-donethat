import React from "react";
import ReactDOM from "react-dom";

function PrivacyPolicyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-auto my-auto p-8 relative animate-fade-in-down flex flex-col max-h-[80vh] overflow-hidden">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-[#205374] text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-[#205374] mb-4">Privacy Policy</h2>
        <div className="flex-1 overflow-y-auto w-full min-w-0 break-words text-gray-700 text-sm space-y-4 pr-2">
          <p><strong>Last updated: [19th June 2025]</strong></p>
          <p>This Privacy Policy explains how Bin There, Done That ("we", "us", or "our") collects, uses, and protects your personal data in accordance with the General Data Protection Regulation (GDPR) and Dutch law.</p>
          <h3 className="font-semibold mt-4">1. Data We Collect</h3>
          <ul className="list-disc list-inside ml-4">
            <li><strong>Account Data:</strong> Username, email address, password (hashed).</li>
            <li><strong>Usage Data:</strong> Number of items sorted, actions within the app.</li>
            <li><strong>Technical Data:</strong> IP address, browser type, device information (for security and analytics).</li>
          </ul>
          <h3 className="font-semibold mt-4">2. How We Use Your Data</h3>
          <ul className="list-disc list-inside ml-4">
            <li>To provide and improve our services.</li>
            <li>To authenticate users and secure accounts.</li>
            <li>To track recycling activity and provide statistics.</li>
            <li>To comply with legal obligations.</li>
          </ul>
          <h3 className="font-semibold mt-4">3. Legal Basis</h3>
          <p>We process your data based on your consent (when you register), to fulfill our contract with you (providing the service), and to comply with legal obligations.</p>
          <h3 className="font-semibold mt-4">4. Data Sharing</h3>
          <p>We do not sell or rent your personal data. Data may be shared with service providers (e.g., hosting, analytics) under strict confidentiality and only as necessary to operate the service.</p>
          <h3 className="font-semibold mt-4">5. Data Retention</h3>
          <p>We retain your data as long as your account is active or as required by law. You may request deletion of your account and data at any time.</p>
          <h3 className="font-semibold mt-4">6. Your Rights</h3>
          <ul className="list-disc list-inside ml-4">
            <li>Access, correct, or delete your personal data.</li>
            <li>Withdraw consent at any time.</li>
            <li>Object to or restrict processing.</li>
            <li>Data portability (receive your data in a portable format).</li>
            <li>Lodge a complaint with the Dutch Data Protection Authority (Autoriteit Persoonsgegevens).</li>
          </ul>
          <h3 className="font-semibold mt-4">7. Security</h3>
          <p>We use industry-standard security measures (such as password hashing and JWT authentication) to protect your data.</p>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}

export default PrivacyPolicyModal; 