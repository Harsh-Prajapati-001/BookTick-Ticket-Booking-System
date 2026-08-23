import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  row: { type: String, required: true },
  number: { type: Number, required: true },
  category: { type: String, enum: ['PREMIUM', 'STANDARD'], required: true }
});

const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  layout: [seatSchema] // Static layout for the venue
}, { timestamps: true });

export default mongoose.model('Venue', venueSchema);
