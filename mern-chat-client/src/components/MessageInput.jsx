import React, { useContext, useEffect, useRef, useState } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';
import api from '../api/client';
import { SocketContext } from '../context/SocketContext';

export default function MessageInput({ convo, onSent }) {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { socket } = useContext(SocketContext);
  const typingRef = useRef(false);
  const timeoutRef = useRef(null);
  const textareaRef = useRef(null);

  const sendTyping = (isTyping) => {
    if (!socket || !convo) return;
    socket.emit('typing', { conversationId: convo._id, isTyping });
  };

  const onChange = (e) => {
    setText(e.target.value);
    setIsTyping(true);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }

    if (!typingRef.current) {
      typingRef.current = true;
      sendTyping(true);
    }
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      typingRef.current = false;
      sendTyping(false);
    }, 1500);
  };

  const send = async () => {
    if (!text.trim()) return;
    try {
      await api.post('/api/messages', { conversationId: convo._id, content: text });
      setText('');
      setIsTyping(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      onSent?.();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="bg-white border-t border-gray-100 p-4 flex items-end gap-3">
      <style>{`
        textarea::-webkit-scrollbar {
          width: 6px;
        }
        textarea::-webkit-scrollbar-track {
          background: transparent;
        }
        textarea::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        textarea::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>

      {/* Attachment Button */}
      <button className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200 flex-shrink-0">
        <Paperclip size={18} />
      </button>

      {/* Text Input */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="Type a message... (Shift+Enter for new line)"
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 resize-none text-sm font-medium leading-relaxed"
          rows={1}
        />
      </div>

      {/* Emoji Button */}
      <button className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200 flex-shrink-0">
        <Smile size={18} />
      </button>

      {/* Send Button */}
      <button
        onClick={send}
        disabled={!text.trim()}
        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2.5 rounded-xl hover:shadow-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center flex-shrink-0"
      >
        <Send size={18} />
      </button>
    </div>
  );
}