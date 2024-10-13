import React from 'react';

const PublicUrl = ({ url, onClose }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="bg-white p-4 shadow-lg rounded-lg max-w-xs w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Public Link</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          &times; {/* Close button */}
        </button>
      </div>
      <p className="text-sm text-gray-600 break-all mb-4">{url}</p>
      <button
        onClick={handleCopy}
        className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
      >
        Copy Link
      </button>
    </div>
  );
};

export default PublicUrl;
