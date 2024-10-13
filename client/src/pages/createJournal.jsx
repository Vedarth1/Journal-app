// completed
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from '@material-tailwind/react';
import { MdAttachFile, MdSave, MdOutlineAddCircleOutline } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateJournal = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: '',
      attachments: [],
      viewLater: false,
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
    }),
    onSubmit: async (values) => {
      setSubmitError('');
      setSubmitSuccess('');
      setLoading(true);
    
      try {
        const formData = new FormData();
        formData.append('journal[title]', values.title);
        formData.append('journal[content]', content);
        formData.append('journal[view_later]', values.viewLater ? 'true' : 'false');
    
        Array.from(values.attachments).forEach((file) => {
          formData.append('attachments[]', file);
        });
    
        const token = localStorage.getItem('token');
    
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/create/journal`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData
        });
    
        if (!response.ok) {
          throw new Error('Failed to create journal');
        }
    
        setSubmitSuccess('Journal created successfully!');
        setTimeout(() => {
          navigate('/user/dashboard');
        }, 1500);
      } catch (error) {
        setSubmitError('Failed to create journal. Please try again.');
        toast.error("Server Side Error!", {
          position: "top-right",
        });
      } finally {
        setLoading(false);
      }
    }    
  });

  const handleFileChange = (e) => {
    formik.setFieldValue('attachments', e.target.files);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <ToastContainer />
      <div className="w-full max-w-xl p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Create New Journal</h2>

        {submitError && <div className="text-red-500 mb-4">{submitError}</div>}
        {submitSuccess && <div className="text-green-500 mb-4">{submitSuccess}</div>}

        <form onSubmit={formik.handleSubmit}>
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2 text-gray-700">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.title}
              placeholder="Enter journal title"
            />
            {formik.touched.title && formik.errors.title && (
              <div className="text-red-500 text-sm">{formik.errors.title}</div>
            )}
          </div>

          {/* Content */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Content</label>
            <ReactQuill value={content} onChange={setContent} className="border border-gray-300 rounded-md" />
          </div>

          {/* Checkbox */}
          <div className="mb-4 flex items-center">
            <Checkbox
              id="viewLater"
              onChange={() => formik.setFieldValue('viewLater', !formik.values.viewLater)}
              className="mr-2"
            />
            <label htmlFor="viewLater" className="font-medium text-gray-700">
              View Later
            </label>
          </div>

          {/* Attachments */}
          <div className="mb-4">
            <label htmlFor="attachments" className="block mb-2 text-gray-700">
              Attachments <MdAttachFile className="inline-block text-gray-600" />
            </label>
            <input
              id="attachments"
              name="attachments"
              type="file"
              multiple
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={handleFileChange}
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              disabled={loading}
            >
              {loading ? 'Saving...' : (
                <>
                  <MdSave className="mr-2" /> Save Journal
                </>
              )}
            </button>

            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center justify-center hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              onClick={() => formik.resetForm()}
            >
              <MdOutlineAddCircleOutline className="mr-2" /> New Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJournal;
