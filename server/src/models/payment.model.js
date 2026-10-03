import mongoose from 'mongoose';
const paymentSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true, index: true }, branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
  date: { type: Date, required: true, index: true }, amount: { type: Number, required: true, min: 0.01 }, method: { type: String, enum: ['CASH', 'UPI', 'CARD', 'BANK', 'OTHER'], required: true, index: true },
  bankAccountId: { type: mongoose.Schema.Types.ObjectId, ref: 'BankAccount' }, upiAccountId: { type: mongoose.Schema.Types.ObjectId, ref: 'UpiAccount' }, referenceNumber: { type: String, trim: true, maxlength: 100 }, createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
paymentSchema.index({ businessId: 1, branchId: 1, date: -1 });
export const Payment = mongoose.model('Payment', paymentSchema);
