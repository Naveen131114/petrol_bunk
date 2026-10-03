import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true, unique: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true },
  planSnapshot: {
    name: String, price: Number, durationDays: Number, branchLimit: Number, staffLimit: Number, features: [String],
  },
  startsAt: { type: Date, required: true },
  endsAt: { type: Date, required: true, index: true },
  status: { type: String, enum: ['ACTIVE', 'EXPIRED', 'CANCELLED'], default: 'ACTIVE', index: true },
}, { timestamps: true });

export const Subscription = mongoose.model('Subscription', subscriptionSchema);
