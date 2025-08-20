'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import CloudImage from '@/components/CloudImage';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const result = await signup(email, password);
      
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
  <div className="relative min-h-screen w-full overflow-hidden pt-15 md:pt-10">
      {/* Background (different food shot for signup) */}
      <CloudImage
        src="https://images.unsplash.com/photo-1496412705862-e0088f16f791?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Shared dining table with gourmet dishes"
        className="object-cover w-full h-full"
        loading="eager"
      />
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm [mask-image:linear-gradient(to_bottom,black,black,black,.6)]" />

      <div className="relative z-10 flex flex-col md:flex-row min-h-screen">
        {/* Brand / marketing panel */}
        <div className="flex-1 hidden md:flex items-center justify-center p-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-md">
            <h1 className="text-6xl font-extrabold tracking-tight leading-[1.05]">
              <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-500 bg-clip-text text-transparent">Join BiteCheck</span>
            </h1>
            <p className="mt-6 text-lg text-gray-300 font-light leading-relaxed">
              Create an account to craft reviews, track your taste profile and discover hidden culinary gems.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-gray-400">
              <li>• Help foodies Around the world</li>
              <li>• Be a food critic</li>
              <li>• Rate the food</li>
            </ul>
            <div className="mt-8 h-px w-48 bg-gradient-to-r from-orange-400/0 via-orange-400/60 to-orange-400/0" />
          </motion.div>
        </div>

        {/* Signup Card */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="w-full max-w-md bg-white/10 border border-white/15 shadow-2xl rounded-2xl backdrop-blur-xl p-8 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-orange-500/20 to-fuchsia-600/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-gradient-to-tr from-pink-500/20 to-red-500/20 blur-3xl pointer-events-none" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white tracking-tight">Create account</h2>
              <p className="mt-2 text-sm text-gray-300">Start your flavor journey.</p>

              <form onSubmit={handleSubmit} className="mt-10 space-y-7">
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold tracking-wide text-gray-300 mb-2 uppercase">Email</label>
                  <div className="relative group">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-400 transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30 transition-all"
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold tracking-wide text-gray-300 mb-2 uppercase">Password</label>
                  <div className="relative group">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-400 transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30 transition-all"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-200 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2">At least 6 characters.</p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold tracking-wide text-gray-300 mb-2 uppercase">Confirm Password</label>
                  <div className="relative group">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-400 transition-colors" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30 transition-all"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-200 transition-colors"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                    {errorMessage}
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  type="submit"
                  disabled={loading}
                  className="relative w-full group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-orange-500 via-pink-500 to-red-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-orange-500/30 hover:shadow-pink-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-pink-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{loading ? 'Creating…' : 'Create Account'}</span>
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-400/0 via-white/10 to-red-400/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>

                <div className="text-sm text-center text-gray-400">
                  Already have an account?{' '}
                  <a href="/auth/signin" className="text-orange-400 hover:text-orange-300 font-medium">Sign in</a>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
