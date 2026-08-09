import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  displayName: string;
  email: string;
  passwordHash: string;
  level: number;
  xp: number;
  coins: number;
  premiumCurrency: number;
  inventory: Array<{ itemId: string; type: string; quantity: number; equipped: boolean }>;
  equipped: Map<string, string>;
  campaignProgress: { chapter: number; mission: number; stars: number };
  achievements: string[];
  dailyLogin: { lastLogin: Date; streak: number; claimedDays: number[] };
  settings: any;
}

const UserSchema = new Schema<IUser>({
  displayName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  coins: { type: Number, default: 100 },
  premiumCurrency: { type: Number, default: 0 },
  inventory: [{
    itemId: { type: Schema.Types.ObjectId, ref: 'Item' },
    type: String,
    quantity: Number,
    equipped: Boolean
  }],
  equipped: { type: Map, of: String, default: {} },
  campaignProgress: {
    chapter: Number,
    mission: Number,
    stars: Number
  },
  achievements: [String],
  dailyLogin: {
    lastLogin: Date,
    streak: Number,
    claimedDays: [Number]
  },
  settings: { type: Schema.Types.Mixed, default: {} }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
