import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingReference: { type: String, required: true, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  showId: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
  seatIds: [{ type: mongoose.Schema.Types.ObjectId, required: true }],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['CONFIRMED', 'CANCELLED'], default: 'CONFIRMED' },
  idempotencyKey: { type: String, unique: true, sparse: true }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
