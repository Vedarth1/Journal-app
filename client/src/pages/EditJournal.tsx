// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { Checkbox } from '@material-tailwind/react';
import { MdAttachFile, MdSave } from 'react-icons/md';

const EditJournal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { journal } = location.state || {}; // Get journal data from state
  const [content, setContent] = useState(journal?.content || '');
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const formik = useFormik({
    initialValues: {
      title: journal?.title || '',
      summary: journal?.summary || '',
      attachments: [],
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      summary: Yup.string().required('Summary is required'),
    }),
    onSubmit: async (values) => {
      setSubmitError('');
      setSubmitSuccess('');
      setLoading(true);

      try {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('summary', values.summary);
        formData.append('content', content);
        Array.from(values.attachments).forEach((file) => {
          formData.append('attachments[]', file);
        });

        // Make the POST/PUT request to update the journal
        const response = await fetch('http://127.0.0.1:3000/sharedjournals/update', {
          method: 'PUT', // Assuming a PUT request for updating
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to update journal');
        }

        // Handle successful response here
        setSubmitSuccess('Journal updated successfully!');
        setTimeout(() => {
          navigate('/user/dashboard'); // Redirect after successful update
        }, 1500);
      } catch (error) {
        setSubmitError('Failed to update journal. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleFileChange = (e) => {
    formik.setFieldValue('attachments', e.target.files);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-1/4 p-5 bg-gray-50 shadow-md">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search templates..."
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div className="space-y-4">
          <button className="w-full text-left">Your Stuff</button>
          <button className="w-full text-left">Brands</button>
          <button className="w-full text-left">Templates</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-8">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Edit Journal</h2>
        <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Journal Title
            </label>
            <input
              type="text"
              id="title"
              {...formik.getFieldProps('title')}
              className="mt-1 p-2 w-full border rounded-md"
            />
            {formik.touched.title && formik.errors.title ? (
              <p className="text-red-500 text-sm">{formik.errors.title}</p>
            ) : null}
          </div>

          <div className="mb-4">
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
              Journal Summary
            </label>
            <textarea
              id="summary"
              {...formik.getFieldProps('summary')}
              className="mt-1 p-2 w-full border rounded-md"
              rows={3}
            />
            {formik.touched.summary && formik.errors.summary ? (
              <p className="text-red-500 text-sm">{formik.errors.summary}</p>
            ) : null}
          </div>

          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Journal Content
            </label>
            <ReactQuill
              id="content"
              value={content}
              onChange={setContent}
              className="mt-1 border rounded-md"
              modules={{
                toolbar: [
                  [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                  ['bold', 'italic', 'underline'],
                  [{ 'align': [] }],
                  ['link', 'image'],
                ],
              }}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="attachments" className="block text-sm font-medium text-gray-700">
              Attachments
            </label>
            <input
              type="file"
              id="attachments"
              multiple
              onChange={handleFileChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 flex items-center"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Journal'}
              <MdSave className="ml-2" />
            </button>

            {submitSuccess && (
              <p className="text-green-500 text-sm">{submitSuccess}</p>
            )}

            {submitError && (
              <p className="text-red-500 text-sm">{submitError}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJournal;
