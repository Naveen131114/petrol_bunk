import mongoose from 'mongoose';
const stockReconciliationSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true, index: true }, branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true, index: true }, fuelType: { type: String, enum: ['PETROL', 'DIESEL'], required: true },
  periodStart: { type: Date, required: true }, periodEnd: { type: Date, required: true }, openingStock: { type: Number, required: true, min: 0 }, purchasedLitres: { type: Number, required: true, min: 0 }, soldLitres: { type: Number, required: true, min: 0 }, expectedClosingStock: { type: Number, required: true }, physicalClosingStock: { type: Number, required: true, min: 0 }, variance: { type: Number, required: true }, reason: { type: String, trim: true, maxlength: 500 }, createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
stockReconciliationSchema.index({ businessId: 1, branchId: 1, fuelType: 1, periodEnd: -1 });
export const StockReconciliation = mongoose.model('StockReconciliation', stockReconciliationSchema);
