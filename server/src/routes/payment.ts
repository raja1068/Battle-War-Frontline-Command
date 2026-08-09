import express from 'express';
import { PaymentService } from '../services/paymentService';
const router = express.Router();

router.post('/create-order', async (req: any, res) => {
  try {
    const { productId, amount, currency } = req.body;
    const result = await PaymentService.createOrder(req.userId, productId, amount, currency);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/verify', async (req: any, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    const result = await PaymentService.verifyPayment(orderId, paymentId, signature, req.userId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
