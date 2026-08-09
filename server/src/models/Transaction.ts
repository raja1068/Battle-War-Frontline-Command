import mongoose, { Schema } from 'mongoose';

const TransactionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  provider: { type: String, enum: ['razorpay', 'skydo', 'apple', 'google'], required: true },
  providerOrderId: { type: String, unique: true },
  providerPaymentId: String,
  status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  metadata: Schema.Types.Mixed,
}, { timestamps: true });

export const Transaction = mongoose.model('Transaction', TransactionSchema);
