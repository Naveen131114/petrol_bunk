import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  ownerName: { type: String, required: true, trim: true, maxlength: 100 },
  phone: { type: String, required: true, trim: true, maxlength: 20 },
  status: { type: String, enum: ['ACTIVE', 'SUSPENDED'], default: 'ACTIVE', index: true },
}, { timestamps: true });

export const Business = mongoose.model('Business', businessSchema);
