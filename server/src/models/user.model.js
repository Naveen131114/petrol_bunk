import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', index: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
  phone: { type: String, trim: true, maxlength: 20 },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['SUPER_ADMIN', 'BUSINESS_OWNER', 'STAFF'], required: true, index: true },
  permission: { type: String, enum: ['CREATE_ONLY', 'EDIT_AND_CREATE', 'FULL_ACCESS'], default: 'CREATE_ONLY' },
  allowedBranchIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Branch' }],
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE', index: true },
}, { timestamps: true, toJSON: { transform: (_doc, ret) => { delete ret.passwordHash; return ret; } } });

userSchema.methods.verifyPassword = function verifyPassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.statics.hashPassword = (password) => bcrypt.hash(password, 12);

export const User = mongoose.model('User', userSchema);
