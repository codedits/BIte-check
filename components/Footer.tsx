'use client';

import { motion } from 'framer-motion';
import { FaUtensils, FaTwitter, FaInstagram, FaFacebook, FaYoutube, FaHeart, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black/90 border-t border-gray-800/60">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <FaUtensils className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-bold text-orange-400">BiteCheck</h3>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed text-sm">
              Discover, rate, and share curated dining experiences.
            </p>
            <div className="flex space-x-3">
              <motion.a href="#" whileHover={{ y: -2 }} className="w-9 h-9 bg-gray-850 hover:bg-orange-500 rounded-md flex items-center justify-center transition-colors">
                <FaTwitter className="text-gray-400 hover:text-white text-sm" />
              </motion.a>
              <motion.a href="#" whileHover={{ y: -2 }} className="w-9 h-9 bg-gray-850 hover:bg-orange-500 rounded-md flex items-center justify-center transition-colors">
                <FaInstagram className="text-gray-400 hover:text-white text-sm" />
              </motion.a>
              <motion.a href="#" whileHover={{ y: -2 }} className="w-9 h-9 bg-gray-850 hover:bg-orange-500 rounded-md flex items-center justify-center transition-colors">
                <FaFacebook className="text-gray-400 hover:text-white text-sm" />
              </motion.a>
              <motion.a href="#" whileHover={{ y: -2 }} className="w-8 h-8 bg-gray-850 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors">
                <FaYoutube className="text-gray-400 hover:text-white text-xs" />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
                         <h4 className="text-sm font-semibold text-white mb-3">Quick Links</h4>
             <ul className="space-y-2 sm:space-y-3">
                             <li>
                 <Link href="/" className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm sm:text-base">
                   Home
                 </Link>
               </li>
               <li>
                 <a href="/explore" className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm sm:text-base">
                   Explore Restaurants
                 </a>
               </li>
               <li>
                 <a href="/profile" className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm sm:text-base">
                   My Profile
                 </a>
               </li>
               <li>
                 <a href="/auth/signin" className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm sm:text-base">
                   Sign In
                 </a>
               </li>
               <li>
                 <a href="/auth/signup" className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm sm:text-base">
                   Become a Critic
                 </a>
               </li>
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
                         <h4 className="text-sm font-semibold text-white mb-3">Categories</h4>
             <ul className="space-y-2 sm:space-y-3">
                             <li>
                 <a href="/explore?cuisine=french" className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm sm:text-base">
                   French Cuisine
                 </a>
               </li>
               <li>
                 <a href="/explore?cuisine=italian" className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm sm:text-base">
                   Italian Cuisine
                 </a>
               </li>
               <li>
                 <a href="/explore?cuisine=japanese" className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm sm:text-base">
                   Japanese Cuisine
                 </a>
               </li>
               <li>
                 <a href="/explore?cuisine=indian" className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm sm:text-base">
                   Indian Cuisine
                 </a>
               </li>
               <li>
                 <a href="/explore?cuisine=american" className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm sm:text-base">
                   American Cuisine
                 </a>
               </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
                         <h4 className="text-sm font-semibold text-white mb-3">Contact Us</h4>
             <div className="space-y-3 sm:space-y-4">
                             <div className="flex items-center gap-2 sm:gap-3">
                 <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                   <FaMapMarkerAlt className="text-orange-400 text-xs sm:text-sm" />
                 </div>
                 <span className="text-gray-400 text-xs sm:text-sm">
                   Culinary Street, Food City, FC 12345
                 </span>
               </div>
               <div className="flex items-center gap-2 sm:gap-3">
                 <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                   <FaPhone className="text-orange-400 text-xs sm:text-sm" />
                 </div>
                 <span className="text-gray-400 text-xs sm:text-sm">
                   +1 (555) 123-4567
                 </span>
               </div>
               <div className="flex items-center gap-2 sm:gap-3">
                 <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                   <FaEnvelope className="text-orange-400 text-xs sm:text-sm" />
                 </div>
                 <span className="text-gray-400 text-xs sm:text-sm">
                   hello@culinaryexplorer.com
                 </span>
               </div>
            </div>
          </motion.div>
        </div>

                 {/* Bottom Section */}
         <motion.div className="border-t border-gray-800 mt-6 pt-4">
           <div className="flex flex-col sm:flex-row justify-between items-center">
             <div className="text-gray-400 text-xs mb-3 sm:mb-0 text-center sm:text-left">© {currentYear} BiteCheck</div>
             <div className="flex items-center gap-3 text-xs">
               <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Privacy</a>
               <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Terms</a>
               <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Cookies</a>
             </div>
           </div>
           <div className="text-center mt-3">
             <p className="text-gray-500 text-xs">Made with <FaHeart className="inline text-red-500 text-[10px]" /> for food lovers</p>
           </div>
         </motion.div>
      </div>
    </footer>
  );
}
