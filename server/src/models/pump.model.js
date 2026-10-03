import mongoose from 'mongoose';

const pumpSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 50 },
  fuelType: { type: String, enum: ['PETROL', 'DIESEL'], required: true, index: true },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
}, { timestamps: true });
pumpSchema.index({ businessId: 1, branchId: 1, name: 1 }, { unique: true });
export const Pump = mongoose.model('Pump', pumpSchema);
