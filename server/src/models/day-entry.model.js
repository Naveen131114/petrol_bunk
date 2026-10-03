import mongoose from 'mongoose';

const dayEntrySchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
  pumpId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pump', required: true, index: true },
  fuelType: { type: String, enum: ['PETROL', 'DIESEL'], required: true, index: true },
  date: { type: Date, required: true, index: true },
  openingMeter: { type: Number, required: true, min: 0 }, closingMeter: { type: Number, required: true, min: 0 },
  soldLitres: { type: Number, required: true, min: 0 }, sellingPricePerLitre: { type: Number, min: 0 }, salesAmount: { type: Number, required: true, min: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
dayEntrySchema.index({ businessId: 1, pumpId: 1, date: 1 }, { unique: true });
dayEntrySchema.index({ businessId: 1, branchId: 1, fuelType: 1, date: -1 });
export const DayEntry = mongoose.model('DayEntry', dayEntrySchema);
