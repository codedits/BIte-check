'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        router.push('/');
      } else {
        setErrorMessage(result.error);
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Image 
        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80" 
        alt="Assorted gourmet dishes" 
        fill 
        priority
        className="object-cover" 
        sizes="100vw" 
      />
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm [mask-image:linear-gradient(to_bottom,black,black,black,.6)]" />
      <div className="relative z-10 flex flex-col md:flex-row min-h-screen">
        <div className="flex-1 flex items-center justify-center p-10 hidden md:flex">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-md">
            <h1 className="text-6xl font-extrabold tracking-tight leading-[1.05]">
              <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 bg-clip-text text-transparent">BiteCheck</span>
            </h1>
            <p className="mt-6 text-lg text-gray-300 font-light leading-relaxed">
              Track flavors. Elevate taste. Join a community of passionate diners.
            </p>
            <div className="mt-8 h-px w-40 bg-gradient-to-r from-orange-400/0 via-orange-400/60 to-orange-400/0" />
          </motion.div>
        </div>
        <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md bg-white/10 border border-white/15 shadow-2xl rounded-2xl backdrop-blur-xl p-8 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-orange-500/20 to-fuchsia-600/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-gradient-to-tr from-pink-500/20 to-red-500/20 blur-3xl pointer-events-none" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white tracking-tight">Sign in</h2>
              <p className="mt-2 text-sm text-gray-300">Welcome back gourmand.</p>
              <form onSubmit={handleSubmit} className="mt-10 space-y-7">
                <div>
                  <label className="block text-xs font-semibold tracking-wide text-gray-300 mb-2 uppercase">Email</label>
                  <div className="relative group">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-400 transition-colors" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30 transition-all" placeholder="you@example.com" autoComplete="email" required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-wide text-gray-300 mb-2 uppercase">Password</label>
                  <div className="relative group">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-400 transition-colors" />
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30 transition-all" placeholder="••••••••" autoComplete="current-password" required />
                    <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-200 transition-colors">{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
                  </div>
                </div>
                {errorMessage && (<motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">{errorMessage}</motion.div>)}
                <motion.button whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }} type="submit" disabled={loading} className="relative w-full group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-orange-500 via-pink-500 to-red-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-orange-500/30 hover:shadow-pink-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-pink-500 transition disabled:opacity-50 disabled:cursor-not-allowed">
                  <span className="tracking-wide">{loading ? 'Signing in…' : 'Sign In'}</span>
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-400/0 via-white/10 to-red-400/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
                <div className="text-sm text-center text-gray-400">New here? <a href="/auth/signup" className="text-orange-400 hover:text-orange-300 font-medium">Create an account</a></div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
