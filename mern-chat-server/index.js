import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import conversationRoutes from './routes/conversations.routes.js';
import messageRoutes from './routes/messages.routes.js';
import { setupSockets } from './sockets/index.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// Attach io later after server creation
const server = http.createServer(app);

// make io available in request handlers
const io = setupSockets(server, process.env.CLIENT_URL);
app.use((req, _res, next) => { req.io = io; next(); });

app.get('/', (_req, res) => res.send('MERN Chat API ✅'));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);

const PORT = process.env.PORT || 5000;
connectDB(process.env.MONGO_URI).then(() => {
  server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
});