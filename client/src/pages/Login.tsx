import { useState } from 'react';
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
      // Save token (if not using httpOnly cookies, or just save user state)
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      window.location.href = '/';
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-text">
      <div className="bg-surface p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-primary mb-6 text-center">
          {isRegistering ? 'Create Account' : 'Welcome Back'}
        </h2>
        {error && <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-secondary mb-1">Email</label>
            <input 
              type="email" 
              className="w-full p-3 rounded bg-background border border-secondary/30 focus:border-accent outline-none text-text" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-secondary mb-1">Password</label>
            <input 
              type="password" 
              className="w-full p-3 rounded bg-background border border-secondary/30 focus:border-accent outline-none text-text" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="mt-4 w-full bg-primary text-white font-bold py-3 rounded hover:bg-opacity-90 transition">
            {isRegistering ? 'Sign Up' : 'Log In'}
          </button>
        </form>
        <p className="text-center text-secondary mt-6 cursor-pointer hover:text-accent" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
        </p>
      </div>
    </div>
  );
}
