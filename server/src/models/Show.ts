import mongoose from 'mongoose';

const priceSchema = new mongoose.Schema({
  category: { type: String, enum: ['PREMIUM', 'STANDARD'], required: true },
  price: { type: Number, required: true }
});

const showSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  prices: [priceSchema]
}, { timestamps: true });

export default mongoose.model('Show', showSchema);
