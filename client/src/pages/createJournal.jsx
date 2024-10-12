import React, { useState, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import { Checkbox, Typography } from "@material-tailwind/react";

const CreateJournal = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: '',
      summary: '',
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
        // Assuming values.attachments is a FileList
        Array.from(values.attachments).forEach((file) => {
          formData.append('attachments[]', file);
        });

        // const response = await api.post('/journals', formData, {
        //   headers: {
        //     'Content-Type': 'multipart/form-data',
        //   },
        // });

        // if (response.status === 201 || response.status === 200) {
        //   setSubmitSuccess('Journal created successfully!');
        //   // Redirect to dashboard after short delay to show success message
        //   setTimeout(() => {
        //     navigate('/');
        //   }, 1500);
        // }
      } catch (error) {
        console.error("Error creating journal:", error);
        if (error.response && error.response.data && error.response.data.message) {
          setSubmitError(error.response.data.message);
        } else {
          setSubmitError("Failed to create journal. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
  });

  const handleFileChange = (e) => {
    formik.setFieldValue('attachments', e.target.files);
  };

  return (
    <div className="flex justify-center items-start p-5 min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl mt-24">
        <h2 className="text-center text-2xl font-bold mb-6 text-gray-800">
          Create New Journal
        </h2>
        {submitError && (
          <div className="text-red-500 text-center mb-4 text-sm">{submitError}</div>
        )}
        {submitSuccess && (
          <div className="text-green-500 text-center mb-4 text-sm">{submitSuccess}</div>
        )}
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2 text-gray-700 text-sm font-medium">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.title}
              placeholder="Enter journal title"
            />
            {formik.touched.title && formik.errors.title ? (
              <div className="text-red-500 text-xs mt-1">{formik.errors.title}</div>
            ) : null}
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-gray-700 text-sm font-medium">Content</label>
            <ReactQuill
              value={content}
              onChange={setContent}
              className="rounded-md border border-gray-300"
            />
          </div>
          <Checkbox
            label={ <Typography color="blue-gray" className="flex font-medium">View Later</Typography> } />
          <div className="mb-4">
            <label htmlFor="attachments" className="block mb-2 text-gray-700 text-sm font-medium">
              Attachments
            </label>
            <input
              id="attachments"
              name="attachments"
              type="file"
              multiple
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              onChange={handleFileChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md shadow hover:bg-green-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Journal'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateJournal;
