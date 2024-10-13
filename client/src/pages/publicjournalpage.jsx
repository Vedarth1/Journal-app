import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PublicJournalPage = () => {
  const { public_url } = useParams(); 
  const [journal, setJournal] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [isPublic, setIsPublic] = useState(true); // State to check if journal is public
  const [loading, setLoading] = useState(true);  // Loading state

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/journals/public/${public_url}`);
  
        if (!response.ok) {
          throw new Error("Failed to fetch journal");
        }
  
        const data = await response.json();
        setJournal(data.journal);
        setAttachments(data.attachments);
        
        // Check if the journal's visibility is not public
        if (data.journal.visibility !== 'public') {
          setIsPublic(false);
        }
      } catch (error) {
        console.error("Error fetching journal:", error);
        setIsPublic(false);
      } finally {
        setLoading(false); // Stop loading after fetch is complete
      }
    };
  
    fetchJournal();
  }, [public_url]);

  if (loading) {
    return <p>Loading journal...</p>;
  }

  if (!isPublic) {
    return <p>This journal is no longer public.</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 relative">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-xl w-full relative">
        <h1 className="text-2xl font-bold text-blue-700 mb-4 text-center">{journal.title}</h1>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Attachments:</h3>
          {attachments.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {attachments.map(attachment => (
                <div key={attachment.id} className="flex flex-col items-center">
                  {attachment.url.endsWith('.jpg') || attachment.url.endsWith('.png') || attachment.url.endsWith('.jpeg') ? (
                    <img
                      src={attachment.url}
                      alt={`Attachment ${attachment.id}`}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  ) : attachment.url.endsWith('.mp4') || attachment.url.endsWith('.mov') ? (
                    <video
                      controls
                      className="w-32 h-32 rounded-lg"
                    >
                      <source src={attachment.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <p className="text-sm">Unsupported file type</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No attachments found for this journal.</p>
          )}
        </div>

        {/* Content */}
        <p className="text-gray-600 mb-6">{journal.content}</p>

        {/* Timestamps */}
        <div className="text-sm text-gray-700">
          <p>Created at: {new Date(journal.created_at).toLocaleString()}</p>
          <p>Updated at: {new Date(journal.updated_at).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default PublicJournalPage;
