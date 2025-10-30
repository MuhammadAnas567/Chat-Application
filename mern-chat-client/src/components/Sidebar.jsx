import React, { useEffect, useState } from 'react';
import { Search, LogOut, Plus, MessageSquarePlus } from 'lucide-react';
import api from '../api/client';
import CreateGroupModal from './CreateGroupModal';

export default function Sidebar({ user, convos, onSelect, onRefresh, onLogout }) {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState('');
  const [activeConvo, setActiveConvo] = useState(null);

  useEffect(() => {
    const run = async () => {
      const { data } = await api.get('/api/users', { params: { q } });
      setUsers(data);
    };
    run();
  }, [q]);

  const startDM = async (u) => {
    try {
      const { data } = await api.post('/api/conversations', { type: 'dm', memberIds: [u._id] });
      onRefresh();
      setActiveConvo(data._id);
      onSelect(data);
    } catch (error) {
      console.error('Error starting DM:', error);
    }
  };

  const handleSelectConvo = (convo) => {
    setActiveConvo(convo._id);
    onSelect(convo);
  };

  const getConvoName = (c) => {
    return c.type === 'group' ? (c.name || 'Group') : c.members.find(m => m._id !== user._id)?.name || 'Chat';
  };

  return (
    <div className="w-80 flex flex-col bg-white border-r border-gray-100 h-full shadow-sm">
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-10px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
      `}</style>

      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-xs text-gray-600">Online</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>

        {/* Search and Create Group */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all duration-200"
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center flex-shrink-0"
            title="Create Group"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">
            💬 Conversations ({convos.length})
          </h3>
          <div className="space-y-2">
            {convos.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No conversations yet</p>
            ) : (
              convos.map(c => (
                <button
                  key={c._id}
                  onClick={() => handleSelectConvo(c)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 animate-slideIn ${
                    activeConvo === c._id
                      ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900 shadow-sm border border-blue-200'
                      : 'hover:bg-gray-50 text-gray-900 border border-transparent'
                  }`}
                >
                  <div className="font-semibold text-sm truncate">{getConvoName(c)}</div>
                  <div className="text-xs text-gray-500 mt-0.5 truncate">
                    {c.type === 'group' ? `${c.members?.length || 0} members` : 'Direct message'}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Start DM Section */}
        <div className="px-4 py-4 border-t border-gray-100">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2 flex items-center gap-1.5">
            <MessageSquarePlus size={14} /> Direct Messages
          </h3>
          <div className="space-y-2">
            {users.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                {q ? 'No users found' : 'Search users to start a chat'}
              </p>
            ) : (
              users.map(u => (
                <button
                  key={u._id}
                  onClick={() => startDM(u)}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200 animate-slideIn"
                >
                  <div className="font-medium text-gray-900 text-sm truncate">{u.name}</div>
                  <div className="text-xs text-gray-500 truncate">{u.email}</div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <CreateGroupModal
          onClose={() => setShowModal(false)}
          onCreated={(c) => {
            onRefresh();
            setActiveConvo(c._id);
            onSelect(c);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}