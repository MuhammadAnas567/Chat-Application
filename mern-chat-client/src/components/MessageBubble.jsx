import React from 'react';

export default function MessageBubble({ mine, text, time, senderName }) {
  const formatTime = (t) => {
    const date = new Date(t);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
      <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl transition-all duration-300 hover:shadow-lg ${
        mine 
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none shadow-md' 
          : 'bg-white text-gray-900 rounded-bl-none shadow-sm border border-gray-100'
      }`}>
        {!mine && senderName && (
          <div className="text-xs font-semibold text-gray-500 mb-1">{senderName}</div>
        )}
        <div className="text-sm leading-relaxed break-words whitespace-pre-wrap">{text}</div>
        <div className={`text-xs mt-1.5 font-medium ${mine ? 'text-blue-100' : 'text-gray-400'}`}>
          {formatTime(time)}
        </div>
      </div>
    </div>
  );
}