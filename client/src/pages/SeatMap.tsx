import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

type SeatStatus = 'AVAILABLE' | 'HELD' | 'BOOKED';

interface Seat {
  _id: string;
  row: string;
  number: number;
  category: string;
  status: SeatStatus;
}

export default function SeatMap() {
  const { id } = useParams();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  
  useEffect(() => {
    // Mock seat grid generation (to be replaced by API call to /api/shows/:id/seatmap)
    const mockSeats: Seat[] = [];
    const rows = ['A', 'B', 'C', 'D'];
    rows.forEach((r, rIdx) => {
      for(let i=1; i<=8; i++) {
        mockSeats.push({
          _id: `${r}-${i}`,
          row: r,
          number: i,
          category: rIdx < 2 ? 'PREMIUM' : 'STANDARD',
          status: Math.random() > 0.8 ? 'BOOKED' : Math.random() > 0.9 ? 'HELD' : 'AVAILABLE'
        });
      }
    });
    setSeats(mockSeats);
  }, [id]);

  const toggleSeat = (seatId: string, status: SeatStatus) => {
    if (status !== 'AVAILABLE') return;
    setSelectedSeats(prev => 
      prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
    );
  };

  const handleCheckout = () => {
    if (selectedSeats.length === 0) return;
    alert(`Holding seats: ${selectedSeats.join(', ')}\n\nInitiating atomic Compare-And-Swap (CAS) backend call...`);
    // Will call api.post(`/shows/${id}/hold`, { seatIds: selectedSeats })
  };

  return (
    <div className="min-h-screen bg-background text-text p-8 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-8 text-primary">Select Your Seats</h2>
      
      {/* Screen visual */}
      <div className="w-full max-w-2xl bg-secondary/20 h-12 rounded-t-3xl flex items-center justify-center mb-12 shadow-[0_10px_30px_rgba(59,130,246,0.1)]">
        <span className="text-secondary tracking-widest uppercase text-sm">Screen</span>
      </div>

      {/* Seat Grid */}
      <div className="grid grid-cols-8 gap-4 mb-12">
        {seats.map((seat) => {
          const isSelected = selectedSeats.includes(seat._id);
          let colorClass = 'bg-surface border-secondary/30 text-text hover:border-primary cursor-pointer';
          
          if (seat.status === 'BOOKED') colorClass = 'bg-secondary/20 border-secondary/10 text-secondary/30 cursor-not-allowed';
          if (seat.status === 'HELD') colorClass = 'bg-accent/20 border-accent/40 text-accent cursor-not-allowed';
          if (isSelected) colorClass = 'bg-primary border-primary text-white shadow-lg shadow-primary/30';

          return (
            <div 
              key={seat._id}
              onClick={() => toggleSeat(seat._id, seat.status)}
              className={`w-12 h-12 rounded-t-lg rounded-b flex items-center justify-center border-2 transition-all font-bold ${colorClass}`}
              title={`${seat.category} - ${seat.row}${seat.number}`}
            >
              {seat.row}{seat.number}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-6 mb-12">
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-surface border-2 border-secondary/30 rounded"></div> Available</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-primary rounded"></div> Selected</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-accent/20 border-2 border-accent/40 rounded"></div> Held</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-secondary/20 rounded"></div> Booked</div>
      </div>

      {/* Checkout Bar */}
      {selectedSeats.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-surface border-t border-secondary/20 p-6 flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <div>
            <p className="text-sm text-secondary">Selected</p>
            <p className="text-xl font-bold text-white">{selectedSeats.length} Seat(s)</p>
          </div>
          <button onClick={handleCheckout} className="bg-primary text-white px-8 py-3 rounded font-bold hover:bg-opacity-90 transition shadow-lg">
            Hold & Checkout
          </button>
        </div>
      )}
    </div>
  );
}
