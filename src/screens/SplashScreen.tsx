import { useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { motion } from 'motion/react';

export function SplashScreen() {
  const { navigate } = useNavigation();

  // Note: The NavigationContext actually handles the auto-transition for the splash screen, 
  // but we can add an extra effect here just in case or leave it to context.
  
  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-b from-[#FFF8F1] to-[#FF7A00]/10 h-[100dvh] w-full text-center relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 flex justify-center items-center opacity-[0.03] pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-[150%] h-[150%] text-[#FF7A00]">
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="2 2" />
          <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="1 3" />
        </svg>
      </div>

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="w-40 h-40 relative flex justify-center items-center mb-6">
           <img src="/logo.png" 
                alt="Lord Ganesha" 
                className="w-32 h-32 object-cover rounded-full shadow-2xl border-[4px] border-white relative z-10 bg-white" />
           <motion.div 
             animate={{ scale: [1, 1.2, 1] }}
             transition={{ repeat: Infinity, duration: 2 }}
             className="absolute inset-0 bg-yellow-400 rounded-full blur-3xl opacity-40" 
           />
        </div>
        
        <h1 className="text-4xl font-extrabold text-[#4A3B32] tracking-tight mb-2">गणेश समिति</h1>
        <div className="flex items-center gap-3 mb-12">
          <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-[#FF7A00]"></div>
          <p className="text-sm font-bold text-[#FF7A00] tracking-widest uppercase">एकता • सेवा • विकास</p>
          <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-[#FF7A00]"></div>
        </div>

        {/* Loading Spinner */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#FF7A00]/20 border-t-[#FF7A00] rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-500">लोड हो रहा है...</p>
        </div>
      </motion.div>
    </div>
  );
}
