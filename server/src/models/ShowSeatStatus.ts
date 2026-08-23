import mongoose from 'mongoose';

const showSeatStatusSchema = new mongoose.Schema({
  showId: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
  // Storing seat metadata directly here prevents massive joins and makes grid rendering O(1) per seat
  seatId: { type: mongoose.Schema.Types.ObjectId, required: true }, 
  row: { type: String, required: true },
  number: { type: Number, required: true },
  category: { type: String, enum: ['PREMIUM', 'STANDARD'], required: true },
  
  status: { type: String, enum: ['AVAILABLE', 'HELD', 'BOOKED'], default: 'AVAILABLE' },
  
  heldBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  expiresAt: { type: Date, default: null },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null }
}, { timestamps: true });

// CRITICAL: The unique compound index ensures there is only exactly one status doc per seat per show.
showSeatStatusSchema.index({ showId: 1, seatId: 1 }, { unique: true });

export default mongoose.model('ShowSeatStatus', showSeatStatusSchema);
