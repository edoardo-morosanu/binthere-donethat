import React from "react";
import ReactDOM from "react-dom";

function TermsOfServiceModal({ isOpen, onClose }) {
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
        <h2 className="text-2xl font-bold text-[#205374] mb-4">Terms of Service</h2>
        <div className="flex-1 overflow-y-auto w-full min-w-0 break-words text-gray-700 text-sm space-y-4 pr-2">
          <p><strong>Last updated: [19th June 2025]</strong></p>
          <p>These Terms of Service ("Terms") govern your use of Bin There, Done That ("we", "us", or "our"). By using our website and services, you agree to these Terms. If you do not agree, please do not use our services.</p>
          <h3 className="font-semibold mt-4">1. Use of Service</h3>
          <ul className="list-disc list-inside ml-4">
            <li>You must be at least 16 years old or have parental consent to use this service.</li>
            <li>You agree to provide accurate information and keep your account secure.</li>
            <li>You are responsible for all activity under your account.</li>
          </ul>
          <h3 className="font-semibold mt-4">2. User Content</h3>
          <ul className="list-disc list-inside ml-4">
            <li>You retain rights to content you upload, but grant us a license to use it for providing and improving the service.</li>
            <li>Do not upload unlawful, harmful, or infringing content.</li>
          </ul>
          <h3 className="font-semibold mt-4">3. Prohibited Conduct</h3>
          <ul className="list-disc list-inside ml-4">
            <li>No misuse, hacking, or disruption of the service.</li>
            <li>No unauthorized access to other users' data.</li>
          </ul>
          <h3 className="font-semibold mt-4">4. Account Termination</h3>
          <p>We may suspend or terminate accounts that violate these Terms or applicable law.</p>
          <h3 className="font-semibold mt-4">5. Disclaimer & Liability</h3>
          <p>Service is provided "as is" without warranties. We are not liable for damages except as required by Dutch law.</p>
          <h3 className="font-semibold mt-4">6. Changes to Terms</h3>
          <p>We may update these Terms. Continued use after changes means acceptance of the new Terms.</p>
          <h3 className="font-semibold mt-4">7. Governing Law</h3>
          <p>These Terms are governed by Dutch law. Disputes will be resolved by the courts of the Netherlands.</p>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}

export default TermsOfServiceModal; 