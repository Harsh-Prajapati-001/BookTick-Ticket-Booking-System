import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  
  useEffect(() => {
    setEvents([
      { _id: '1', title: 'Oppenheimer (IMAX 70mm)', date: 'Oct 15, 2026', type: 'Movie' },
      { _id: '2', title: 'The Eras Tour', date: 'Nov 02, 2026', type: 'Concert' },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-parchment)] text-[var(--color-deep-lagoon)]">
      <header className="flex justify-between items-center px-8 py-6 max-w-[var(--page-max-width)] mx-auto">
        <h1 className="text-[24px] font-[600] tracking-[0.48px] text-[var(--color-deep-lagoon)]">BookTick</h1>
        <Link to="/login" className="px-[28px] py-[16px] bg-transparent border-[1.5px] border-[var(--color-deep-lagoon)] rounded-[var(--radius-buttons)] text-[16px] font-[500] hover:bg-[var(--color-deep-lagoon)] hover:text-[var(--color-parchment)] transition uppercase tracking-[0.32px]">Log in</Link>
      </header>
      
      {/* Hero band */}
      <section className="px-8 py-[var(--section-gap)] max-w-[var(--page-max-width)] mx-auto">
        <span className="inline-block bg-[var(--color-mint-wash)] rounded-[var(--radius-badges)] px-[16px] py-[8px] text-[14px] font-[500] text-[var(--color-deep-lagoon)] mb-6">New releases</span>
        <h2 className="text-[40px] md:text-[80px] leading-[1.1] tracking-[4px] md:tracking-[8px] font-[700]">
          Book the seat <br/>
          <span className="text-[var(--color-electric-iris)]">you actually want</span>
        </h2>
      </section>

      {/* Events band */}
      <main className="bg-[var(--color-mint-wash)] px-8 py-[var(--section-gap)]">
        <div className="max-w-[var(--page-max-width)] mx-auto">
          <h2 className="text-[40px] font-[600] tracking-[2.4px] mb-10">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((evt) => (
              <div key={evt._id} className="bg-[var(--color-parchment)] rounded-[var(--radius-cards)] p-[var(--card-padding)] border border-[var(--color-ink-black)]/40 shadow-[var(--shadow-sm)] flex flex-col">
                <span className="self-start text-[14px] font-[500] tracking-[0.28px] text-[var(--color-deep-lagoon)] bg-[var(--color-mint-wash)] px-4 py-2 rounded-[var(--radius-badges)] mb-6">
                  {evt.type}
                </span>
                <h3 className="text-[28px] font-[600] tracking-[1.68px] leading-[1.17] mb-3">{evt.title}</h3>
                <p className="text-[16px] font-[500] tracking-[0.32px] opacity-60 mb-10">{evt.date}</p>
                <Link to={`/show/${evt._id}`} className="mt-auto w-full text-center bg-[var(--color-electric-iris)] text-[var(--color-parchment)] py-[16px] rounded-[var(--radius-buttons)] text-[16px] font-[500] hover:opacity-90 transition">
                  View seats
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
