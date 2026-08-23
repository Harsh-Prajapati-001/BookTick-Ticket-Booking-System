import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  
  useEffect(() => {
    // Mock data for now until API is fully wired
    setEvents([
      { _id: '1', title: 'Oppenheimer (IMAX 70mm)', date: 'Oct 15, 2026', type: 'Movie' },
      { _id: '2', title: 'The Eras Tour', date: 'Nov 02, 2026', type: 'Concert' },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-background text-text p-8">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-primary tracking-wide">BookTick</h1>
        <Link to="/login" className="px-5 py-2 bg-surface border border-secondary/30 rounded hover:text-accent transition">Log In</Link>
      </header>
      
      <main className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 border-b border-secondary/20 pb-4">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((evt) => (
            <div key={evt._id} className="bg-surface p-6 rounded-xl shadow-lg border border-secondary/10 hover:border-accent/50 transition">
              <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent/10 px-2 py-1 rounded inline-block mb-3">
                {evt.type}
              </span>
              <h3 className="text-2xl font-bold mb-2 text-white">{evt.title}</h3>
              <p className="text-secondary mb-6">{evt.date}</p>
              <Link to={`/show/${evt._id}`} className="w-full block text-center bg-primary text-white py-3 rounded font-semibold hover:bg-opacity-90 transition">
                View Seat Map
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
