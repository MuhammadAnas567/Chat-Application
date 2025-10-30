import express from 'express';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/:conversationId', protect, async (req, res) => {
  const { conversationId } = req.params;
  const exists = await Conversation.findOne({ _id: conversationId, members: req.user._id });
  if (!exists) return res.status(403).json({ message: 'Not in conversation' });
  const msgs = await Message.find({ conversation: conversationId })
    .sort({ createdAt: 1 })
    .populate('sender', 'name email');
  res.json(msgs);
});

router.post('/', protect, async (req, res) => {
  const { conversationId, content } = req.body;
  const convo = await Conversation.findOne({ _id: conversationId, members: req.user._id });
  if (!convo) return res.status(403).json({ message: 'Not in conversation' });
  const msg = await Message.create({ conversation: conversationId, sender: req.user._id, content });
  convo.lastMessageAt = new Date();
  await convo.save();
  const populated = await msg.populate('sender', 'name email');
  req.io.to(conversationId.toString()).emit('message:created', { conversationId, message: populated });
  res.json(populated);
});

export default router;