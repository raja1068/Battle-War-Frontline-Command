import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { sendVerificationEmail } from '../services/emailService';

export const register = async (req: Request, res: Response) => {
  const { email, password, displayName } = req.body;
  if (!email || !password || !displayName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ error: 'Email already in use' });

  const hash = await bcrypt.hash(password, 12);
  const user = new User({
    email,
    passwordHash: hash,
    displayName,
    coins: 100,
    premiumCurrency: 0
  });
  await user.save();

  // Send verification email (optional)
  // await sendVerificationEmail(email, user._id);

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
  res.status(201).json({ token, refreshToken, user: sanitizeUser(user) });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
  res.json({ token, refreshToken, user: sanitizeUser(user) });
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { userId: string };
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ error: 'User not found' });
    const newToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    res.json({ token: newToken });
  } catch {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

// Helper to remove passwordHash from user object
function sanitizeUser(user: any) {
  const obj = user.toObject();
  delete obj.passwordHash;
  return obj;
}
