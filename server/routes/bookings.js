import express from 'express';
import Booking from '../models/Booking.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify token (could be extracted to a shared middleware file later)
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

// Create a booking
router.post('/', verifyToken, async (req, res) => {
  try {
    const { property, checkIn, checkOut, totalPrice } = req.body;
    
    const booking = new Booking({
      property,
      guest: req.user.userId,
      checkIn,
      checkOut,
      totalPrice
    });

    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get user's bookings
router.get('/my', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ guest: req.user.userId }).populate('property');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
