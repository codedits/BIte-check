'use client';

import { motion } from 'framer-motion';
import { FaHome, FaCompass, FaUser, FaSignOutAlt } from 'react-icons/fa';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const navItems = [
    { href: '/', icon: FaHome, label: 'Home' },
    { href: '/explore', icon: FaCompass, label: 'Explore' },
    ...(isAuthenticated ? [{ href: '/profile', icon: FaUser, label: 'Profile' }] : []),
  ];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-gray-700/50 shadow-lg"
    >
      <div className="flex items-center justify-around py-4 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-300 ${
                isActive
                  ? 'bg-orange-500 text-white shadow-md scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-white/10 hover:scale-[1.02]'
              }`}
            >
              <Icon className={`text-lg ${isActive ? 'text-white drop-shadow-md' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}

        {isAuthenticated && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300"
          >
            <FaSignOutAlt className="text-lg" />
            <span className="text-xs font-semibold">Logout</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
