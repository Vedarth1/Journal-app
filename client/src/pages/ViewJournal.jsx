import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReceivedJournals from '../components/ReceivedJournals';
import PublicUrl from '../components/PublicUrl';
import { FaTrash, FaEdit } from 'react-icons/fa';

const ViewJournal = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [journal, setJournal] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [isPublic, setIsPublic] = useState(false);
  const [showReceivedJournals, setShowReceivedJournals] = useState(false);
  const [showPublicUrl, setShowPublicUrl] = useState(false);
  const publicUrl = journal?.public_url || '';

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchJournal = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/get/journal/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch journal");
        }

        const data = await response.json();
        setJournal(data);
        setIsPublic(data.visibility === 'public');

        // Fetch attachments after the journal is successfully fetched
        const attachmentsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/get/attachments/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!attachmentsResponse.ok) {
          throw new Error("Failed to fetch attachments");
        }

        const attachmentsData = await attachmentsResponse.json();
        setAttachments(attachmentsData); // Set attachments state
      } catch (error) {
        console.error("Error fetching journal:", error);
      }
    };

    fetchJournal();
  }, [id]); // Fetch journal when the component mounts or the ID changes

  const handleTogglePublic = () => {
    setIsPublic(!isPublic);
    // Optionally, send a request to update the journal visibility
  };

  const handleShareClick = () => {
    setShowReceivedJournals(true);
    setShowPublicUrl(false);
  };

  const handleGenerateLinkClick = () => {
    setShowPublicUrl(true);
    setShowReceivedJournals(false);
  };

  const handleClosePublicUrl = () => {
    setShowPublicUrl(false);
  };

  const handleDeleteJournal = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this journal?');
    if (confirmDelete) {
      try {
        const token = localStorage.getItem('token');
  
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/delete/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to delete journal");
        }
        navigate('/user/dashboard');
      } catch (error) {
        console.error("Error deleting journal:", error);
      }
    }
  };  

  const handleEditJournal = () => {
    navigate(`/user/edit-journal/${id}`, { state: { journal } });
  };

  if (!journal) {
    return <p>Loading journal...</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 relative">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-xl w-full relative">
        <div className="absolute top-4 right-4 flex space-x-4">
          <FaEdit
            className="text-blue-500 hover:text-blue-700 cursor-pointer"
            size={20}
            onClick={handleEditJournal}
          />
          <FaTrash
            className="text-red-500 hover:text-red-700 cursor-pointer"
            size={20}
            onClick={handleDeleteJournal}
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-blue-700 mb-4 text-center">{journal.title}</h1>

        {/* Attachments */}
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

        {/* Button options */}
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={handleTogglePublic}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            {isPublic ? 'Make it Private' : 'Make it Public'}
          </button>

          <button
            className={`py-2 px-4 rounded ${isPublic ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            disabled={!isPublic}
            onClick={handleShareClick}
          >
            Share Journal
          </button>

          <button
            className={`py-2 px-4 rounded ${isPublic ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            disabled={!isPublic}
            onClick={handleGenerateLinkClick}
          >
            Generate Public Link
          </button>
        </div>

        {/* Timestamps */}
        <div className="text-sm text-gray-700">
          <p>Created at: {new Date(journal.created_at).toLocaleString()}</p>
          <p>Updated at: {new Date(journal.updated_at).toLocaleString()}</p>
        </div>
      </div>

      {showReceivedJournals && (
        <div className="ml-8">
          <ReceivedJournals />
        </div>
      )}

      {showPublicUrl && (
        <div className="ml-8">
          <PublicUrl url={publicUrl} onClose={handleClosePublicUrl} />
        </div>
      )}
    </div>
  );
};

export default ViewJournal;
