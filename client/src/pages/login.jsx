// completed
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailPasswordSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = {
        email,
        password,
    };

    try {
        const response=await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        const data = await response.json();

        if (response.ok)
        {
            const {token}=data;
            localStorage.setItem('token', token);
            navigate('/user/dashboard');
        }
        else if(response.status===401)
        {
            toast.info("Wrong Credentials!", {
            position: "top-right"
            });
        }
        else
        {
            setError(data.message || 'Login failed. Please try again.');
            toast.error("Server Side Error!", {
                position: "top-right"
            });
        }
    } catch (error) {
      console.error('Email/Password Authentication Error:', error);
      setError('Failed to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-red-400 to-indigo-900">
        <ToastContainer/>
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Login to MindScribe App</h2>

            {error && <div className="text-red-500 text-center mb-4">{error}</div>}
            {loading && <div className="text-center mb-4 text-gray-600">Logging in...</div>}

            <form onSubmit={handleEmailPasswordSignIn}>
            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
                </label>
                <input
                type="email"
                id="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                />
            </div>

            <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
                </label>
                <input
                type="password"
                id="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
                disabled={loading}
            >
                {loading ? 'Logging in...' : 'Login'}
            </button>
            </form>

            <div className="text-center mt-4 text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-600 hover:underline font-bold">
                Sign Up
            </Link>
            </div>
        </div>
    </div>
  );
};

export default Login;
