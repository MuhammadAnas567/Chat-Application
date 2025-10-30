import express from 'express';
import Conversation from '../models/Conversation.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const convos = await Conversation.find({ members: req.user._id })
    .sort({ updatedAt: -1 })
    .populate('members', 'name email');
  res.json(convos);
});

router.post('/', protect, async (req, res) => {
  const { type, memberIds = [], name, adminIds = [] } = req.body;
  if (type === 'dm') {
    const other = memberIds.find(id => id !== req.user._id.toString());
    if (!other) return res.status(400).json({ message: 'DM requires another member' });
    let convo = await Conversation.findOne({ type: 'dm', members: { $all: [req.user._id, other], $size: 2 } });
    if (!convo) {
      convo = await Conversation.create({ type: 'dm', members: [req.user._id, other] });
    }
    return res.json(await convo.populate('members', 'name email'));
  } else if (type === 'group') {
    const members = Array.from(new Set([req.user._id.toString(), ...memberIds]));
    const admins = Array.from(new Set([req.user._id.toString(), ...adminIds]));
    const convo = await Conversation.create({ type: 'group', name: name || 'New Group', members, admins });
    return res.json(await convo.populate('members', 'name email'));
  }
  res.status(400).json({ message: 'Invalid type' });
});

router.patch('/:id', protect, async (req, res) => {
  const { name, memberIds } = req.body;
  const convo = await Conversation.findById(req.params.id);
  if (!convo) return res.status(404).json({ message: 'Not found' });
  if (name) convo.name = name;
  if (memberIds) convo.members = memberIds;
  await convo.save();
  res.json(await convo.populate('members', 'name email'));
});

export default router;