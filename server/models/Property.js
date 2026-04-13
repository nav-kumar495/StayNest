import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  pricePerNight: { type: Number, required: true },
  location: { type: String, required: true },
  images: [{ type: String }],
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amenities: [{ type: String }],
}, { timestamps: true });

export default mongoose.model('Property', propertySchema);
