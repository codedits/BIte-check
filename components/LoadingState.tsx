"use client";
import { motion } from 'framer-motion';
import { FaRedo } from 'react-icons/fa';

interface StateProps {
  state: 'loading' | 'error' | 'empty';
  message?: string;
  onRetry?: () => void;
  children?: React.ReactNode; // optional custom loading skeleton
}

export default function LoadingState({ state, message, onRetry, children }: StateProps) {
  if (state === 'loading') {
    return children ? <>{children}</> : (
      <div className="py-20 flex items-center justify-center text-gray-400 text-sm">Loading...</div>
    );
  }
  if (state === 'empty') {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-center">
        <div className="text-white/70 text-sm">{message || 'Nothing here yet.'}</div>
        {onRetry && <button onClick={onRetry} className="glass-button text-xs px-4 py-2 bg-white text-black font-medium hover:bg-gray-100">Refresh</button>}
      </div>
    );
  }
  if (state === 'error') {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
        <div className="text-red-400 font-medium text-sm">{message || 'Failed to load data'}</div>
        {onRetry && (
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onRetry} className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-md font-semibold text-xs">
            <FaRedo className="text-xs" /> Retry
          </motion.button>
        )}
      </div>
    );
  }
  return null;
}
