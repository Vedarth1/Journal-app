import React from 'react';

const ViewJournal = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-xl w-full">
        <h1 className="text-2xl font-bold text-blue-700 mb-2 text-center">My Journey Through the Digital World</h1>
        <p className="text-center text-gray-600 mb-6">An exploration of the ever-evolving digital landscape and its impact on society.</p>

        <p className="text-gray-700 mb-6">
          The digital world has transformed the way we live, work, and communicate. From the rise of social media to the advancements in artificial intelligence, the impact is profound and far-reaching.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Highlights:</h3>
        <ul className="list-disc list-inside mb-6">
          <li>Evolution of Social Media Platforms</li>
          <li>Advancements in Artificial Intelligence</li>
          <li>Cybersecurity Challenges</li>
          <li>Future Trends in Technology</li>
        </ul>

        <p className="text-gray-700 mb-8">
          As we navigate this digital age, it's essential to understand the benefits and challenges that come with technological advancements.
        </p>

        <div className="flex justify-center">
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Generate Public Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewJournal;