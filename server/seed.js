import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import Property from './models/Property.js';
import User from './models/User.js';

dotenv.config();

const MOCK_PROPERTIES = [
  {
    title: 'Neon Oasis Penthouse',
    location: 'Cyber City, Neo Tokyo',
    pricePerNight: 350,
    images: ['/assets/prop1.png'],
    description: 'Experience extraordinary architectural homes with modern aesthetics. Perfect for your next premium stay.'
  },
  {
    title: 'Glass Forest Retreat',
    location: 'Emerald Woods, Oregon',
    pricePerNight: 280,
    images: ['/assets/prop2.png'],
    description: 'Experience extraordinary architectural homes with modern aesthetics. Perfect for your next premium stay.'
  },
  {
    title: 'Quantum Skyline Villa',
    location: 'Financial District, NY',
    pricePerNight: 520,
    images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    description: 'Experience extraordinary architectural homes with modern aesthetics. Perfect for your next premium stay.'
  },
  {
    title: 'Minimalist Desert Haven',
    location: 'Mojave Desert, California',
    pricePerNight: 310,
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    description: 'Experience extraordinary architectural homes with modern aesthetics. Perfect for your next premium stay.'
  },
  {
    title: 'Cliffside Infinity Edge',
    location: 'Amalfi Coast, Italy',
    pricePerNight: 850,
    images: ['https://images.unsplash.com/photo-1449844908441-8829872d2607?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    description: 'Experience extraordinary architectural homes with modern aesthetics. Perfect for your next premium stay.'
  },
  {
    title: 'The Obsidian Chalet',
    location: 'Swiss Alps, Switzerland',
    pricePerNight: 920,
    images: ['https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    description: 'Experience extraordinary architectural homes with modern aesthetics. Perfect for your next premium stay.'
  },
  {
    title: 'Floating Lotus Resort',
    location: 'Bali, Indonesia',
    pricePerNight: 450,
    images: ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    description: 'Experience extraordinary architectural homes with modern aesthetics. Perfect for your next premium stay.'
  },
  {
    title: 'Mid-Century Modern Escape',
    location: 'Palm Springs, California',
    pricePerNight: 290,
    images: ['https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    description: 'Experience extraordinary architectural homes with modern aesthetics. Perfect for your next premium stay.'
  }
];

const seedDB = async () => {
  try {
    console.log('Connecting to MongoDB Atlas at:', process.env.MONGO_URI.replace(/:([^:@]{3,})@/, ':***@'));
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected successfully.');

    // Clear existing data
    await User.deleteMany({});
    await Property.deleteMany({});
    console.log('Cleared existing data.');
    
    // Create Admin Host
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('staynest123', salt);
    
    const hostUser = new User({
      name: 'StayNest Admin',
      email: 'admin@staynest.com',
      password: hashedPassword,
      isHost: true
    });
    
    const savedHost = await hostUser.save();
    console.log('Created admin host user. (email: admin@staynest.com, pass: staynest123)');

    // Insert Properties
    const propertiesToInsert = MOCK_PROPERTIES.map(p => ({
      ...p,
      host: savedHost._id,
      amenities: ['WiFi', 'Air Conditioning', 'Pool', 'Kitchen']
    }));

    await Property.insertMany(propertiesToInsert);
    console.log(`Database successfully seeded with ${propertiesToInsert.length} properties!`);
    
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
