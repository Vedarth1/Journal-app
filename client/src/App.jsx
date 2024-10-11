import React from 'react';
import brandLogo from './assets/brand.svg';
import index from './assets/index.jpg';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-red-400 to-indigo-900">
      <nav className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <img src={brandLogo} alt="Journal App" className="h-8" />
          <span className="text-white text-2xl font-bold">Journal App</span>
        </div>
        <div className="flex space-x-4">
          <Link to='/signup' className="text-white">Signup</Link>
          <Link to='/login' className="text-white">Login</Link>
        </div>
      </nav>

      <main className="flex flex-col md:flex-row items-center justify-between mt-16 px-4 md:px-10 max-w-6xl mx-auto">
        <div className="w-full md:w-1/2 mb-8 md:mb-0">
          <img src={index} alt="index photo" className="w-full max-w-sm md:max-w-full rounded-lg shadow-lg mx-auto" />
        </div>

        <div className="w-full md:w-1/2 text-center md:text-left ml-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Welcome to Journal App!</h1>
          <p className="text-lg text-white mb-8">
            Organize your thoughts.<br />
            Satisfy your inner self.<br />
            Enjoy accomplishing your tasks everyday!
          </p>
          <Link to='/login' className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded">
            Start Now!
          </Link>
        </div>
      </main>
    </div>
  );
}

export default App;
