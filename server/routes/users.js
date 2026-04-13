import express from 'express';
import User from '../models/User.js';
import Property from '../models/Property.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  try {
    const verified = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'secret123');
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

// Toggle favorite property
router.post('/favorites/:propertyId', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const propertyId = req.params.propertyId;
    const isFavorited = user.favorites.some(id => id.toString() === propertyId);

    if (isFavorited) {
      // Remove from favorites
      user.favorites = user.favorites.filter(id => id.toString() !== propertyId);
    } else {
      // Add to favorites
      user.favorites.push(propertyId);
    }
    await user.save();

    res.json({ message: 'Favorites updated', favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get user profile (including populated favorites)
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('favorites')
      .select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
