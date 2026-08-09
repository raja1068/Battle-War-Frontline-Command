import express from 'express';
import crypto from 'crypto';
import { PaymentService } from '../services/paymentService';
import { Transaction } from '../models/Transaction';

const router = express.Router();

router.post('/razorpay', async (req, res) => {
  const signature = req.headers['x-razorpay-signature'] as string;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  // Verify webhook signature
  const body = JSON.stringify(req.body);
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex');
  if (expectedSignature !== signature) {
    return res.status(401).send('Invalid signature');
  }

  const event = req.body;
  if (event.event === 'payment.captured') {
    const orderId = event.payload.payment.entity.order_id;
    const transaction = await Transaction.findOne({ providerOrderId: orderId });
    if (!transaction || transaction.status === 'completed') {
      return res.status(200).send('OK');
    }
    await PaymentService.grantPurchase(transaction.userId, transaction.productId);
    transaction.status = 'completed';
    transaction.providerPaymentId = event.payload.payment.entity.id;
    await transaction.save();
  }
  res.status(200).send('OK');
});

export default router;
