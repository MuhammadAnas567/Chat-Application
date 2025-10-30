import React, { useContext, useState } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext.jsx';
import { SocketProvider } from './context/SocketContext.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Chat from './pages/Chat.jsx';
import { LogIn, UserPlus, MessageSquare } from 'lucide-react';

function Gate() {
  const { user, loading } = useContext(AuthContext);
  const [mode, setMode] = React.useState('login');

  // Loading State
  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin { animation: spin 1s linear infinite; }
        `}</style>
        <div className="text-center">
          <div className="inline-block p-6 bg-white rounded-full shadow-xl mb-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">Setting up your session</p>
        </div>
      </div>
    );
  }

  // Authentication Gate (Login/Register)
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center p-4 relative overflow-hidden">
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-float { animation: float 3s ease-in-out infinite; }
          .animate-slide-in { animation: slideIn 0.6s ease-out; }
        `}</style>

        {/* Background Blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-float opacity-10"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-float opacity-10" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl animate-float opacity-10" style={{animationDelay: '4s'}}></div>

        <div className="relative z-10 w-full max-w-6xl">
          {/* Header Section */}
          <div className="text-center mb-12 animate-slide-in">
            <div className="inline-block p-4 bg-white/10 backdrop-blur-md rounded-2xl mb-4">
              <MessageSquare size={40} className="text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Chat Hub
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Connect with friends and colleagues. Fast, secure, and beautiful messaging experience.
            </p>
          </div>

          {/* Main Container */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Features */}
            <div className="hidden lg:block space-y-6 animate-slide-in" style={{animationDelay: '0.2s'}}>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/30 rounded-lg flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-200" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Secure & Private</h3>
                    <p className="text-blue-100 text-sm">End-to-end encrypted messaging for your privacy</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-500/30 rounded-lg flex-shrink-0">
                    <svg className="w-6 h-6 text-purple-200" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Real-time Sync</h3>
                    <p className="text-blue-100 text-sm">Instant message delivery across all devices</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-pink-500/30 rounded-lg flex-shrink-0">
                    <svg className="w-6 h-6 text-pink-200" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Group Chats</h3>
                    <p className="text-blue-100 text-sm">Create unlimited groups and collaborate together</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="animate-slide-in" style={{animationDelay: '0.4s'}}>
              {/* Tab Buttons */}
              <div className="flex gap-2 mb-6 p-1 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <button
                  onClick={() => setMode('login')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                    mode === 'login'
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <LogIn size={18} />
                  Login
                </button>
                <button
                  onClick={() => setMode('register')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                    mode === 'register'
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <UserPlus size={18} />
                  Register
                </button>
              </div>

              {/* Form Container */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 animate-slide-in">
                {mode === 'login' ? (
                  <>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                      <p className="text-white/70 text-sm">Sign in to your account to continue</p>
                    </div>
                    <Login />
                  </>
                ) : (
                  <>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                      <p className="text-white/70 text-sm">Join our community and start connecting</p>
                    </div>
                    <Register />
                  </>
                )}
              </div>

              {/* Trust Badge */}
              <div className="mt-6 flex items-center justify-center gap-4 text-white/60 text-xs">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1C5.9 1 1 5.9 1 12s4.9 11 11 11 11-4.9 11-11S18.1 1 12 1zm-2 16l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  SSL Secured
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1C5.9 1 1 5.9 1 12s4.9 11 11 11 11-4.9 11-11S18.1 1 12 1zm-2 16l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Privacy Protected
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chat Application
  return (
    <SocketProvider>
      <Chat />
    </SocketProvider>
  );
}

export default function App() {
  return <AuthProvider><Gate /></AuthProvider>;
}