import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';

const ViewSharedJournal = () => {
  const { id, permission } = useParams(); 
  const navigate = useNavigate();
  const [journal, setJournal] = useState(null);
  const [attachments, setAttachments] = useState([]);
  
  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchJournal = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/sharedjournal/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch journal");
        }

        const data = await response.json();
        setJournal(data);

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
  

  const handleEditJournal = () => {
    navigate(`/user/edit-sharedjournal/${permission}/${id}`, { state: { journal } });
  };

  const handleReturnToDashboard = () => {
    navigate('/user/dashboard');
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
            {/* Conditionally render the edit icon based on the permission */}
            {permission !== 'read' && (
              <FaEdit
                className="text-blue-500 hover:text-blue-700 cursor-pointer"
                size={20}
                onClick={handleEditJournal}
              />
            )}
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

          {/* Timestamps */}
          <div className="text-sm text-gray-700">
            <p>Created at: {new Date(journal.created_at).toLocaleString()}</p>
            <p>Updated at: {new Date(journal.updated_at).toLocaleString()}</p>
          </div>
        </div>
    </div>
  );
};

export default ViewSharedJournal;
