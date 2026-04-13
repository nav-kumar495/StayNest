import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('SUCCESS: Connected to MongoDB Atlas');
    process.exit(0);
  })
  .catch((err) => {
    console.error('ERROR: Failed to connect to MongoDB Atlas', err);
    process.exit(1);
  });
