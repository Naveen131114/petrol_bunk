import mongoose from 'mongoose';

const subscriptionPlanSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  description: { type: String, maxlength: 500 },
  price: { type: Number, min: 0, required: true },
  durationDays: { type: Number, min: 1, required: true },
  branchLimit: { type: Number, min: 1, required: true },
  staffLimit: { type: Number, min: 0, required: true },
  features: [{ type: String, trim: true }],
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE', index: true },
}, { timestamps: true });

export const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
