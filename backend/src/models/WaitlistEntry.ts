import mongoose from 'mongoose';

const waitlistEntrySchema = new mongoose.Schema({
  showId: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
  category: { type: String, enum: ['PREMIUM', 'STANDARD'], required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['WAITING', 'OFFERED', 'CLAIMED', 'EXPIRED'], default: 'WAITING' },
  joinedAt: { type: Date, default: Date.now },
  
  // Populated when offered
  offeredSeatId: { type: mongoose.Schema.Types.ObjectId, default: null },
  offerExpiresAt: { type: Date, default: null }
}, { timestamps: true });

// Index to efficiently query and sort by joinedAt for the FIFO queue behavior
waitlistEntrySchema.index({ showId: 1, category: 1, status: 1, joinedAt: 1 });
// Ensure one entry per customer per show/category
waitlistEntrySchema.index({ showId: 1, category: 1, customerId: 1 }, { unique: true });

export default mongoose.model('WaitlistEntry', waitlistEntrySchema);
