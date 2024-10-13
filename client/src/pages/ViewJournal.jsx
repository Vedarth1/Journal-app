import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';

const ViewJournal = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [journal, setJournal] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [isPublic, setIsPublic] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showGenerateLinkModal, setShowGenerateLinkModal] = useState(false); // New state for generating link modal
  const [username, setUsername] = useState('');
  const [permission, setPermission] = useState('read'); // Default permission
  
  const publicUrl = `http://localhost:5173/public/journal/${journal?.public_url || ''}`;

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
  }, [id]);

  const handleTogglePublic = async () => {
    const token = localStorage.getItem('token');
    const newVisibility = isPublic ? 'private' : 'public';
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/journals/${id}/visibility/${newVisibility}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to update visibility');
      }
  
      setIsPublic(!isPublic);
    } catch (error) {
      console.error('Error updating visibility:', error);
    }
  };

  const handleGenerateLinkClick = () => {
    if (isPublic) {
      setShowGenerateLinkModal(true); // Open generate link modal
      setShowReceivedJournals(false);
    }
  };

  const handleCloseGenerateLinkModal = () => {
    setShowGenerateLinkModal(false);
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

  const handleReturnToDashboard = () => {
    navigate('/user/dashboard');
  };

  const handleShareJournal = async () => {
    const token = localStorage.getItem('token');
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/journals/${id}/share/${username}/${permission}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to share journal');
      }
      
      alert('Journal shared successfully');
      setShowShareModal(false);
    } catch (error) {
      console.error('Error sharing journal:', error);
      alert('Error sharing journal');
    }
  };

  const handleOpenShareModal = () => {
    setShowShareModal(true);
  };

  const handleCloseShareModal = () => {
    setShowShareModal(false);
    setUsername(''); // Reset input
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(publicUrl)
      .then(() => {
        alert('Link copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  if (!journal) {
    return <p>Loading journal...</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 relative">
        {/* Return to Dashboard Button */}
        <div className="absolute top-4 right-4">
          <button
            className="bg-gray-200 text-black hover:bg-gray-300 py-1 px-3 rounded-lg text-sm"
            onClick={handleReturnToDashboard}
          >
            Return to Dashboard
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg p-8 max-w-xl w-full relative">
          <div className="absolute top-4 right-4 flex space-x-4">
            {/* Edit and Delete Icons */}
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
                      <video controls className="w-32 h-32 rounded-lg">
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

          <p className="text-gray-600 mb-6">{journal.content}</p>

          {/* Buttons for Visibility, Sharing, and Public Link */}
          <div className="flex justify-center space-x-4 mb-4">
            <button
              onClick={handleTogglePublic}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              {isPublic ? 'Make it Private' : 'Make it Public'}
            </button>

            <button
              className={`py-2 px-4 rounded bg-blue-500 text-white hover:bg-blue-600`}
              onClick={handleOpenShareModal} // Open Share Modal
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

        {/* Public Link Modal */}
        {showGenerateLinkModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-96">
              <h2 className="text-lg font-semibold mb-4">Public Journal Link</h2>
              <p className="mb-4">{publicUrl}</p>
              <div className="flex justify-between">
                <button
                  onClick={copyLinkToClipboard}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Copy Link
                </button>
                <button
                  onClick={handleCloseGenerateLinkModal}
                  className="bg-gray-300 py-2 px-4 rounded hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-96">
              <h2 className="text-lg font-semibold mb-4">Share Journal</h2>
              <label className="block mb-2">Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border border-gray-300 p-2 w-full mb-4"
              />
              <label className="block mb-2">Permission:</label>
              <select
                value={permission}
                onChange={(e) => setPermission(e.target.value)}
                className="border border-gray-300 p-2 w-full mb-4"
              >
                <option value="read">Read Only</option>
                <option value="write">Write</option>
              </select>
              <div className="flex justify-between">
                <button
                  onClick={handleShareJournal}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Share
                </button>
                <button
                  onClick={handleCloseShareModal}
                  className="bg-gray-300 py-2 px-4 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default ViewJournal;
