import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isRegistering ? '/auth/register' : '/auth/login';
      const res = await api.post(endpoint, { 
        email, 
        password, 
        name: isRegistering ? email.split('@')[0] : undefined,
        role: 'CUSTOMER' 
      });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      window.location.href = '/';
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-parchment)] text-[var(--color-deep-lagoon)]">
      <header className="flex justify-between items-center px-8 py-6 max-w-[var(--page-max-width)] mx-auto">
        <Link to="/" className="text-[24px] font-[600] tracking-[0.48px] text-[var(--color-deep-lagoon)]">BookTick</Link>
      </header>

      <main className="flex items-center justify-center py-[var(--section-gap)] px-8">
        <div className="bg-[var(--color-parchment)] p-[var(--card-padding)] rounded-[var(--radius-cards)] border border-[var(--color-ink-black)]/40 shadow-[var(--shadow-sm)] w-full max-w-md">
          <h2 className="text-[40px] font-[600] tracking-[2.4px] mb-8 text-center leading-[1.15]">
            {isRegistering ? 'Make an account' : 'Log in to BookTick'}
          </h2>
          
          {error && (
            <div role="alert" className="bg-[#fffef0] border border-[#b3261e] text-[#b3261e] p-4 rounded-[var(--radius-inputs)] mb-6 text-[14px]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label htmlFor="email" className="block text-[14px] font-[500] tracking-[0.28px] opacity-60 mb-2">Email</label>
              <input 
                id="email"
                type="email" 
                className="w-full p-4 rounded-[var(--radius-inputs)] bg-[var(--color-parchment)] border border-[var(--color-deep-lagoon)]/30 focus:border-[var(--color-electric-iris)] outline-none text-[16px] font-[500]" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-[14px] font-[500] tracking-[0.28px] opacity-60 mb-2">Password</label>
              <input 
                id="password"
                type="password" 
                className="w-full p-4 rounded-[var(--radius-inputs)] bg-[var(--color-parchment)] border border-[var(--color-deep-lagoon)]/30 focus:border-[var(--color-electric-iris)] outline-none text-[16px] font-[500]" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="mt-2 w-full bg-[var(--color-electric-iris)] text-[var(--color-parchment)] py-[16px] rounded-[var(--radius-buttons)] text-[16px] font-[500] hover:opacity-90 transition">
              {isRegistering ? 'Sign up' : 'Log in'}
            </button>
          </form>

          <button 
            type="button"
            className="w-full text-center text-[16px] font-[500] opacity-60 mt-8 cursor-pointer hover:text-[var(--color-electric-iris)] hover:opacity-100 transition" 
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </main>
    </div>
  );
}
