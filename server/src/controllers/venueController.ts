import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Venue from '../models/Venue';

export const createVenue = async (req: AuthRequest, res: Response) => {
  try {
    const { name, address } = req.body;
    const venue = await Venue.create({ name, address, adminId: req.user?.userId });
    res.status(201).json(venue);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const generateLayout = async (req: AuthRequest, res: Response) => {
  try {
    const { rows, seatsPerRow, premiumRows } = req.body;
    const venueId = req.params.id;
    
    const venue = await Venue.findById(venueId);
    if (!venue || venue.adminId.toString() !== req.user?.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const layout = [];
    const rowChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    for (let r = 0; r < rows; r++) {
      const rowName = r < 26 ? rowChars[r] : `R${r+1}`;
      const category = r < premiumRows ? 'PREMIUM' : 'STANDARD';
      
      for (let s = 1; s <= seatsPerRow; s++) {
        layout.push({ row: rowName, number: s, category });
      }
    }
    
    venue.layout = layout as any;
    await venue.save();
    
    res.json({ success: true, count: layout.length });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getVenues = async (req: AuthRequest, res: Response) => {
  try {
    const venues = await Venue.find();
    res.json(venues);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
