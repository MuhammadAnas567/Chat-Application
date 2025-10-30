import React, { useEffect, useState } from 'react';
import { X, Search } from 'lucide-react';
import api from '../api/client';

export default function CreateGroupModal({ onClose, onCreated }) {
  const [q, setQ] = useState('');
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        const { data } = await api.get('/api/users', { params: { q } });
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    run();
  }, [q]);

  const toggle = (u) => {
    setSelected(prev => 
      prev.includes(u._id) 
        ? prev.filter(id => id !== u._id) 
        : [...prev, u._id]
    );
  };

  const create = async () => {
    if (!name.trim() || selected.length === 0) return;
    setLoading(true);
    try {
      const { data } = await api.post('/api/conversations', {
        type: 'group',
        name,
        memberIds: selected
      });
      onCreated(data);
    } catch (error) {
      console.error('Error creating group:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
      `}</style>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scaleIn max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="text-xl font-bold text-gray-900">Create New Group</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Group Name Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Group Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Project Team, Friends, etc."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-sm font-medium"
            />
          </div>

          {/* Search Members */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Add Members <span className="text-red-500">*</span>
            </label>
            <div className="relative mb-3">
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search members by name or email..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-sm"
              />
            </div>

            {/* Users List */}
            <div className="max-h-48 overflow-y-auto space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
              {users.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  {q ? 'No users found' : 'Type to search users'}
                </p>
              ) : (
                users.map(u => (
                  <label
                    key={u._id}
                    className="flex items-center gap-3 p-2.5 hover:bg-white rounded-lg cursor-pointer transition-colors duration-200"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(u._id)}
                      onChange={() => toggle(u)}
                      className="w-4 h-4 accent-blue-500 cursor-pointer rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm truncate">{u.name}</div>
                      <div className="text-xs text-gray-500 truncate">{u.email}</div>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Selected Count */}
          {selected.length > 0 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700 font-medium">
                ✓ {selected.length} member{selected.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={create}
            disabled={!name.trim() || selected.length === 0 || loading}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? 'Creating...' : 'Create Group'}
          </button>
        </div>
      </div>
    </div>
  );
}