import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const EditJournal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [journal, setJournal] = useState(location.state?.journal || null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [viewLater, setViewLater] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [newAttachment, setNewAttachment] = useState(null);

  useEffect(() => {
    if (journal) {
      setTitle(journal.title);
      setContent(journal.content);
      setVisibility(journal.visibility);
      setViewLater(journal.view_later);
    }
  }, [journal]);

  useEffect(() => {
    const fetchAttachments = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/get/attachments/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch attachments");
        }

        const attachmentsData = await response.json();
        setAttachments(attachmentsData);
      } catch (error) {
        console.error("Error fetching attachments:", error);
      }
    };

    if (id) {
      fetchAttachments();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();

    formData.append('journal[title]', title);
    formData.append('journal[content]', content);
    formData.append('journal[visibility]', visibility);
    formData.append('journal[view_later]', viewLater);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/update/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update journal');
      }

      navigate(`/user/viewjournal/${id}`);
    } catch (error) {
      console.error('Error updating journal:', error);
    }
  };

  const handleAttachmentChange = (e) => {
    setNewAttachment(e.target.files[0]);
  };

  const handleAddAttachment = async () => {
    if (!newAttachment) return;

    const formData = new FormData();
    formData.append('journal_id', id )
    formData.append('attachments[]', newAttachment);

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/add/attachment`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add attachment");
      }

      // Refresh attachments after adding a new one
      const updatedAttachmentsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/get/attachments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedAttachmentsData = await updatedAttachmentsResponse.json();
      setAttachments(updatedAttachmentsData);
      setNewAttachment(null); // Reset the attachment input
    } catch (error) {
      console.error("Error adding attachment:", error);
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this attachment?');
    if (confirmDelete) {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/delete/attachments/${attachmentId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete attachment");
        }

        // Refresh attachments after deletion
        const updatedAttachmentsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/get/attachments/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const updatedAttachmentsData = await updatedAttachmentsResponse.json();
        setAttachments(updatedAttachmentsData);
      } catch (error) {
        console.error("Error deleting attachment:", error);
      }
    }
  };

  if (!journal) {
    return <p>Loading journal...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Edit Journal</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            rows="5"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="visibility" className="block text-sm font-medium text-gray-700">Visibility</label>
          <select
            id="visibility"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={viewLater}
              onChange={(e) => setViewLater(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-700">View Later</span>
          </label>
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Update Journal
          </button>
        </div>
      </form>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Attachments:</h3>
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
                <button
                  className="text-red-500 mt-2 hover:text-red-700"
                  onClick={() => handleDeleteAttachment(attachment.id)}
                >
                  Delete Attachment
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No attachments found for this journal.</p>
        )}
      </div>

      <div className="mt-6">
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleAttachmentChange}
          className="mb-2"
        />
        <button
          onClick={handleAddAttachment}
          className={`w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 ${!newAttachment ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!newAttachment}
        >
          Add Attachment
        </button>
      </div>
    </div>
  );
};

export default EditJournal;