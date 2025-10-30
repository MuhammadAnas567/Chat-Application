import React, { createContext, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const s = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', { auth: { token } });
    setSocket(s);
    return () => { s.disconnect(); };
  }, []);
  const value = useMemo(() => ({ socket }), [socket]);
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}