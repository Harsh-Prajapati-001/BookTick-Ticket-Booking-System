import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

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
    alert(`Holding your seats for 10 minutes.`);
  };

  return (
    <div className="min-h-screen bg-[var(--color-parchment)] text-[var(--color-deep-lagoon)] pb-32">
      <header className="flex justify-between items-center px-8 py-6 max-w-[var(--page-max-width)] mx-auto">
        <Link to="/" className="text-[24px] font-[600] tracking-[0.48px] text-[var(--color-deep-lagoon)]">BookTick</Link>
        <Link to="/login" className="px-[28px] py-[16px] bg-transparent border-[1.5px] border-[var(--color-deep-lagoon)] rounded-[var(--radius-buttons)] text-[16px] font-[500] hover:bg-[var(--color-deep-lagoon)] hover:text-[var(--color-parchment)] transition uppercase tracking-[0.32px]">Log in</Link>
      </header>

      <section className="px-8 py-[40px] md:py-[var(--section-gap)] max-w-[var(--page-max-width)] mx-auto text-center">
        <h2 className="text-[48px] font-[600] tracking-[4.8px] mb-8 leading-[1.14]">Select Your Seats</h2>
      </section>

      <main className="bg-[var(--color-mint-wash)] px-8 py-[var(--section-gap)]">
        <div className="max-w-[800px] mx-auto flex flex-col items-center">
          
          {/* Screen visual */}
          <div className="w-full max-w-2xl bg-[var(--color-deep-lagoon)]/10 h-8 rounded-t-[24px] border-t border-x border-[var(--color-ink-black)]/20 flex items-center justify-center mb-16">
            <span className="text-[var(--color-deep-lagoon)] tracking-widest uppercase text-[14px] font-[500] opacity-60">Screen</span>
          </div>

          {/* Seat Grid */}
          <div className="overflow-x-auto w-full pb-8">
            <div className="inline-grid grid-cols-8 gap-2 min-w-max mx-auto">
              {seats.map((seat) => {
                const isSelected = selectedSeats.includes(seat._id);
                let btnClass = 'bg-[var(--color-parchment)] border-[var(--color-deep-lagoon)]/40 text-[var(--color-deep-lagoon)] hover:border-[var(--color-electric-iris)] cursor-pointer';
                let ariaAttr = {};
                let content: React.ReactNode = `${seat.row}${seat.number}`;
                
                if (seat.status === 'BOOKED') {
                  btnClass = 'bg-[var(--color-deep-lagoon)]/12 border-transparent text-transparent cursor-not-allowed';
                  ariaAttr = { 'aria-disabled': true };
                  content = (
                    <div className="w-full h-full opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, var(--color-deep-lagoon) 2px, var(--color-deep-lagoon) 4px)' }}></div>
                  );
                } else if (seat.status === 'HELD') {
                  btnClass = 'bg-[var(--color-mint-wash)] border-dashed border-[var(--color-deep-lagoon)] text-transparent cursor-not-allowed';
                  ariaAttr = { 'aria-label': 'Held by another user', 'aria-disabled': true };
                  content = <span className="text-[12px] opacity-60 text-[var(--color-deep-lagoon)]">⏱</span>;
                } else if (isSelected) {
                  btnClass = 'bg-[var(--color-electric-iris)] border-transparent text-[var(--color-parchment)]';
                  ariaAttr = { 'aria-pressed': true };
                  content = <span className="text-[16px]">✓</span>;
                }

                return (
                  <button 
                    key={seat._id}
                    onClick={() => toggleSeat(seat._id, seat.status)}
                    className={`w-12 h-12 rounded-[8px] border flex items-center justify-center transition-all font-[500] text-[14px] overflow-hidden ${btnClass}`}
                    title={`${seat.category} - ${seat.row}${seat.number}`}
                    {...ariaAttr}
                  >
                    {content}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-[14px] font-[500] bg-[var(--color-mint-wash)] px-4 py-2 rounded-[var(--radius-badges)] border border-[var(--color-ink-black)]/10">
              <div className="w-4 h-4 bg-[var(--color-parchment)] border border-[var(--color-deep-lagoon)]/40 rounded-[4px]"></div> Available
            </div>
            <div className="flex items-center gap-2 text-[14px] font-[500] bg-[var(--color-mint-wash)] px-4 py-2 rounded-[var(--radius-badges)] border border-[var(--color-ink-black)]/10">
              <div className="w-4 h-4 bg-[var(--color-electric-iris)] rounded-[4px] flex items-center justify-center text-white text-[10px]">✓</div> Selected
            </div>
            <div className="flex items-center gap-2 text-[14px] font-[500] bg-[var(--color-mint-wash)] px-4 py-2 rounded-[var(--radius-badges)] border border-[var(--color-ink-black)]/10">
              <div className="w-4 h-4 bg-[var(--color-mint-wash)] border border-dashed border-[var(--color-deep-lagoon)] rounded-[4px] flex items-center justify-center text-[8px] opacity-60">⏱</div> Held
            </div>
            <div className="flex items-center gap-2 text-[14px] font-[500] bg-[var(--color-mint-wash)] px-4 py-2 rounded-[var(--radius-badges)] border border-[var(--color-ink-black)]/10">
              <div className="w-4 h-4 bg-[var(--color-deep-lagoon)]/12 rounded-[4px]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, var(--color-deep-lagoon) 2px, var(--color-deep-lagoon) 4px)' }}></div> Booked
            </div>
          </div>
        </div>
      </main>

      {/* Checkout Bar */}
      {selectedSeats.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-[var(--color-parchment)] border-t border-[var(--color-ink-black)]/10 p-6 flex justify-between items-center shadow-[var(--shadow-sm)] z-50">
          <div className="max-w-[var(--page-max-width)] mx-auto w-full flex justify-between items-center px-4">
            <div>
              <p className="text-[14px] font-[500] text-[var(--color-deep-lagoon)] opacity-60 tracking-[0.28px]">Selected</p>
              <p className="text-[24px] font-[600] text-[var(--color-deep-lagoon)] tracking-[0.48px]">{selectedSeats.length} seat(s)</p>
            </div>
            <button onClick={handleCheckout} className="bg-[var(--color-electric-iris)] text-[var(--color-parchment)] px-[28px] py-[16px] rounded-[var(--radius-buttons)] font-[500] text-[16px] hover:opacity-90 transition">
              Hold & checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
