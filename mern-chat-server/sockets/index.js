import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import Conversation from '../models/Conversation.js';

export function setupSockets(httpServer, corsOrigin) {
  const io = new Server(httpServer, {
    cors: { origin: corsOrigin, credentials: true }
  });

  const online = new Map(); // userId -> socketId

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) return next(new Error('No token'));
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = payload.id;
      return next();
    } catch (e) {
      return next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    online.set(userId, socket.id);
    io.emit('presence', { userId, online: true });

    socket.on('join', async ({ conversationId }) => {
      const isMember = await Conversation.exists({ _id: conversationId, members: userId });
      if (isMember) socket.join(conversationId.toString());
    });

    socket.on('typing', ({ conversationId, isTyping }) => {
      socket.to(conversationId.toString()).emit('typing', { conversationId, userId, isTyping });
    });

    socket.on('message:new', ({ conversationId, content }) => {
      // REST route handles persistence; this event is optional demo
      socket.to(conversationId.toString()).emit('message:created', { conversationId, message: { sender: { _id: userId }, content, createdAt: new Date() } });
    });

    socket.on('disconnect', () => {
      online.delete(userId);
      io.emit('presence', { userId, online: false });
    });
  });

  return io;
}