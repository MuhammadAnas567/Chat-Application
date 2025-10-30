import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { pick } from '../utils/pick.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const q = (req.query.q || '').trim();
  const cond = q ? { name: { $regex: q, $options: 'i' } } : {};
  const users = await User.find(cond).select('_id name email').limit(20);
  res.json(users.filter(u => u._id.toString() !== req.user._id.toString()));
});

router.get('/me', protect, async (req, res) => {
  res.json(pick(req.user.toObject(), ['_id', 'name', 'email']));
});

export default router;