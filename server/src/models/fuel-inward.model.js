import mongoose from 'mongoose';

const fuelInwardSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
  fuelType: { type: String, enum: ['PETROL', 'DIESEL'], required: true, index: true },
  date: { type: Date, required: true, index: true },
  litres: { type: Number, required: true, min: 0.001 },
  purchaseAmount: { type: Number, required: true, min: 0 },
  purchaseCostPerLitre: { type: Number, required: true, min: 0 },
  supplier: { type: String, trim: true, maxlength: 120 }, invoiceNumber: { type: String, trim: true, maxlength: 80 }, tankerNumber: { type: String, trim: true, maxlength: 40 }, notes: { type: String, trim: true, maxlength: 500 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
fuelInwardSchema.index({ businessId: 1, branchId: 1, fuelType: 1, date: -1 });
export const FuelInward = mongoose.model('FuelInward', fuelInwardSchema);
