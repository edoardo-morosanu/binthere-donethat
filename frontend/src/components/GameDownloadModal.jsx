import React from "react";
import ReactDOM from "react-dom";

function GameDownloadModal({ isOpen, onClose, gameInfo }) {
  if (!isOpen) return null;

  const handleDownload = () => {
    // This will now trigger a direct download of the ZIP file
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 min-h-screen flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto my-auto p-8 relative animate-fade-in-down overflow-y-auto max-h-full">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-[#205374] text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-[#205374] mb-2">
            {gameInfo.title}
          </h2>
          <p className="text-gray-600 text-lg">
            {gameInfo.subtitle}
          </p>
        </div>

        {/* Screenshots */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <img 
            src="/images/trashfalling.jpeg" 
            alt="Falling Trash Gameplay"
            className="rounded-lg w-full h-48 object-cover border-2 border-gray-200"
          />
          <img 
            src="/images/trashfallingstart.jpeg" 
            alt="Falling Trash Start Screen"
            className="rounded-lg w-full h-48 object-cover border-2 border-gray-200"
          />
        </div>

        {/* Game Information */}
        <div className="bg-[#f8f9fa] rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-[#205374] mb-4">About the Game</h3>
          <div className="space-y-3 text-gray-700">
            {gameInfo.description.map((item, index) => {
              const parts = item.split(/:\s*/);
              const title = parts.shift();
              const content = parts.join(': ');
              return (
                <p key={index}>
                  <strong className="text-gray-800">• {title}:</strong> {content}
                </p>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-[#205374] mb-2">System Requirements</h4>
            <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
              {gameInfo.systemRequirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="text-center mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* macOS Download */}
            <div>
              <a
                href="/downloads/FallingTrash_Mac.zip"
                download="FallingTrash_Mac.zip"
                className="inline-block w-full bg-[#0071e3] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#0077ed] transition-colors"
              >
                <span className="text-2xl mr-2"></span> Download for macOS
              </a>
              <div className="text-left text-gray-500 text-xs mt-2 p-2 bg-gray-50 rounded-md">
                <p className="font-bold mb-1">Instructions:</p>
                <ol className="list-decimal list-inside space-y-0.5">
                  <li>Unzip the file.</li>
                  <li>Move <code>TrashMac.app</code> to your Applications folder.</li>
                  <li>Right-click the app & select "Open".</li>
                </ol>
              </div>
            </div>

            {/* Windows Download */}
            <div>
              <a
                href="/downloads/FallingTrash_Windows_Placeholder.zip"
                download="FallingTrash_Windows_Placeholder.zip"
                className="inline-block w-full bg-[#00a4ef] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#1fbfff] transition-colors"
              >
                <span className="text-xl mr-2">⊞</span> Download for Windows
              </a>
              <div className="text-left text-gray-500 text-xs mt-2 p-2 bg-gray-50 rounded-md">
                <p className="font-bold mb-1">Instructions:</p>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>Unzip the file.</li>
                    <li>Run the <code>.exe</code> file to play.</li>
                    <li>(Placeholder download for now)</li>
                  </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}

export default GameDownloadModal; 