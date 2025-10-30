import React, { useContext, useEffect, useState, useRef } from 'react';
import api from '../api/client';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { SocketContext } from '../context/SocketContext';
import { Search } from 'lucide-react';

export default function ChatWindow({ convo, currentUser, onSent }) {
  const [messages, setMessages] = useState([]);
  const [typingInfo, setTypingInfo] = useState(null);
  const { socket } = useContext(SocketContext);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!convo) return;
    api.get('/api/messages/' + convo._id).then(res => setMessages(res.data));
  }, [convo]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!socket || !convo) return;
    const onTyping = ({ conversationId, userId, isTyping }) => {
      if (conversationId !== convo._id || userId === currentUser._id) return;
      setTypingInfo(isTyping ? 'typing…' : null);
    };
    const onCreated = ({ conversationId, message }) => {
      if (conversationId !== convo._id) return;
      setMessages(prev => [...prev, message]);
    };
    socket.emit('join', { conversationId: convo._id });
    socket.on('typing', onTyping);
    socket.on('message:created', onCreated);
    return () => {
      socket.off('typing', onTyping);
      socket.off('message:created', onCreated);
    };
  }, [socket, convo, currentUser]);

  if (!convo) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="text-2xl font-bold text-gray-400 mb-2">Select a conversation</h2>
          <p className="text-gray-400">Choose a chat to start messaging</p>
        </div>
      </div>
    );
  }

  const otherUser = convo.type === 'dm' 
    ? convo.members.find(m => m._id !== currentUser._id)
    : null;

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {convo.type === 'group' ? (convo.name || 'Group Chat') : otherUser?.name || 'Chat'}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {convo.type === 'group' ? `${convo.members?.length || 0} members` : 'Active now'}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors duration-200">
              <Search size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-gray-50"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map(m => (
            <MessageBubble
              key={m._id || m.createdAt + Math.random()}
              mine={m.sender?._id === currentUser._id}
              text={m.content}
              time={m.createdAt || Date.now()}
              senderName={convo.type === 'group' && m.sender?.name}
            />
          ))
        )}
        {typingInfo && (
          <div className="flex items-center gap-2 text-gray-500 text-sm animate-fadeIn">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            <span>Someone is typing...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <MessageInput convo={convo} onSent={onSent} />
    </div>
  );
}