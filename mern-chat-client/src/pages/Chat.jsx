import React, { useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';

export default function Chat() {
  const { user, logout } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [convos, setConvos] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const { data } = await api.get('/api/conversations');
      setConvos(data);
      if (!active && data[0]) setActive(data[0]);
    } catch (error) {
      console.error('Error refreshing conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('message:created', ({ conversationId }) => {
      if (active && active._id === conversationId) refresh();
    });
    return () => {
      socket.off('message:created');
    };
  }, [socket, active]);

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <style>{`
          @keyframes pulse-scale {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.7; }
          }
          .animate-pulse-scale { animation: pulse-scale 2s ease-in-out infinite; }
        `}</style>
        <div className="text-center">
          <div className="inline-block p-6 bg-white rounded-full shadow-lg mb-4">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Loading chats...</h3>
          <p className="text-gray-600 text-sm">Please wait while we fetch your conversations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>

      {/* Sidebar */}
      <div className="animate-fadeIn">
        <Sidebar
          user={user}
          convos={convos}
          onSelect={setActive}
          onRefresh={refresh}
          onLogout={logout}
        />
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden animate-fadeIn">
        <ChatWindow
          convo={active}
          currentUser={user}
          onSent={refresh}
        />
      </div>
    </div>
  );
}