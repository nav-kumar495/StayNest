import express from 'express';
import Review from '../models/Review.js';
import Property from '../models/Property.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

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

// Add a review
router.post('/', verifyToken, async (req, res) => {
  try {
    const { propertyId, rating, comment } = req.body;
    
    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    
    const review = new Review({
      property: propertyId,
      user: req.user.userId,
      rating,
      comment
    });
    
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get reviews for a property
router.get('/property/:id', async (req, res) => {
  try {
    const reviews = await Review.find({ property: req.params.id })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
