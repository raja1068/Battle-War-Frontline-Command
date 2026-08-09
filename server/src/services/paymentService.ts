import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Transaction } from '../models/Transaction';
import User from '../models/User';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export class PaymentService {
  static async createOrder(userId: string, productId: string, amount: number, currency: string) {
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency,
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    });
    const transaction = new Transaction({
      userId,
      productId,
      amount,
      currency,
      provider: 'razorpay',
      providerOrderId: order.id,
      status: 'pending',
    });
    await transaction.save();
    return { orderId: order.id, key: process.env.RAZORPAY_KEY_ID };
  }

  static async verifyPayment(orderId: string, paymentId: string, signature: string, userId: string) {
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(orderId + '|' + paymentId)
      .digest('hex');
    if (generatedSignature !== signature) {
      throw new Error('Invalid signature');
    }
    const transaction = await Transaction.findOne({ providerOrderId: orderId, userId });
    if (!transaction) throw new Error('Transaction not found');
    if (transaction.status === 'completed') return { alreadyProcessed: true };
    await this.grantPurchase(userId, transaction.productId);
    transaction.status = 'completed';
    transaction.providerPaymentId = paymentId;
    await transaction.save();
    return { success: true };
  }

  static async grantPurchase(userId: string, productId: string) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    // Map productId to rewards (example)
    if (productId.startsWith('battlecoins_')) {
      const amount = parseInt(productId.split('_')[1], 10);
      user.coins += amount;
    } else if (productId === 'starter_bundle') {
      user.coins += 500;
      user.premiumCurrency += 50;
      // Also add some starter items to inventory
      // ...
    }
    await user.save();
  }
}
