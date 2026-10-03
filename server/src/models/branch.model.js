import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  address: { type: String, trim: true, maxlength: 500 },
  phone: { type: String, trim: true, maxlength: 20 },
  email: { type: String, trim: true, lowercase: true },
  gstNumber: { type: String, trim: true, uppercase: true },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE', index: true },
}, { timestamps: true });

branchSchema.index({ businessId: 1, name: 1 }, { unique: true });
export const Branch = mongoose.model('Branch', branchSchema);
