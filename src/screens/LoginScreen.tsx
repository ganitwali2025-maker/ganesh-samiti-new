import { useState, useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Info, User, MapPin } from 'lucide-react';

export function LoginScreen() {
  const { navigate } = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('dashboard');
    }, 2500);
  };

  return (
    <div className="flex flex-col min-h-[100dvh] w-full bg-[#FFF8F2] overflow-x-hidden overflow-y-auto relative scrollbar-hide">
      <AnimatePresence>
        {isLoading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-50 bg-gradient-to-br from-[#FF6A00] to-[#E65100] flex flex-col items-center justify-center overflow-hidden"
          >
             {/* Floating particles background */}
             <div className="absolute inset-0 pointer-events-none overflow-hidden">
               {[...Array(20)].map((_, i) => (
                 <motion.div
                   key={i}
                   className="absolute w-1.5 h-1.5 bg-white/40 rounded-full"
                   initial={{ 
                     x: Math.random() * window.innerWidth, 
                     y: window.innerHeight + 50 
                   }}
                   animate={{ 
                     y: -50,
                     x: `calc(${Math.random() * 100}vw - 20px)` 
                   }}
                   transition={{ 
                     duration: 3 + Math.random() * 4, 
                     repeat: Infinity,
                     ease: "linear",
                     delay: Math.random() * 2 
                   }}
                 />
               ))}
             </div>

             <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
                {/* Outer glowing ring */}
                <div className="relative flex items-center justify-center">
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-36 h-36 rounded-full border-4 border-white/20 border-t-white shadow-[0_0_40px_rgba(255,255,255,0.3)] absolute"
                  />
                  
                  <motion.div 
                    animate={{ scale: [0.95, 1.05, 0.95] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-28 h-28 bg-white rounded-full p-2 shadow-2xl z-20 flex items-center justify-center"
                  >
                     <img src="/logo.png" alt="Logo" className="w-full h-full rounded-full object-cover" />
                  </motion.div>
                </div>

               <motion.div 
                 animate={{ opacity: [0.6, 1, 0.6] }}
                 transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                 className="mt-12 flex flex-col items-center"
               >
                 <h2 className="text-white text-[20px] font-bold tracking-wider drop-shadow-md z-10 text-center">
                   डेटा तैयार किया जा रहा है...
                 </h2>
                 <div className="flex gap-2 mt-4">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                        className="w-2.5 h-2.5 bg-white rounded-full shadow-sm"
                      />
                    ))}
                 </div>
               </motion.div>
             </div>
          </motion.div>
        ) : (
          <motion.div 
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col h-full w-full relative z-10"
          >
             {/* Header */}
             <div className="relative bg-gradient-to-b from-[#FF6A00] to-[#FF8C00] rounded-b-[48px] pt-16 pb-12 px-6 flex flex-col items-center shadow-[0_15px_40px_rgba(255,106,0,0.2)] shrink-0">
                {/* Decorative glows */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

                <div className="w-[100px] h-[100px] bg-white rounded-full p-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.15)] mb-6 relative z-10 border-[3px] border-white">
                   <img src="/logo.png" alt="Logo" className="w-full h-full rounded-full object-cover" />
                </div>
                
                <h1 className="text-[38px] font-extrabold text-white tracking-wide drop-shadow-md mb-2 text-center" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  गणेश समिति
                </h1>
                
                <div className="flex items-center gap-3 mt-1">
                  <div className="h-[1px] w-10 bg-white/60"></div>
                  <p className="text-[14px] font-bold text-white tracking-widest uppercase opacity-95">
                    एकता • सेवा • विकास
                  </p>
                  <div className="h-[1px] w-10 bg-white/60"></div>
                </div>
             </div>

             {/* Body Art */}
             <div className="flex flex-col items-center justify-center px-6 relative w-full mt-8 shrink-0">
                <svg className="w-full max-w-[280px] h-[200px]" viewBox="0 0 300 250" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Sunburst */}
                  <g opacity="0.12">
                    {[...Array(16)].map((_, i) => (
                      <line key={i} x1="150" y1="160" x2={150 + Math.cos((i * 22.5 * Math.PI) / 180) * 140} y2={160 + Math.sin((i * 22.5 * Math.PI) / 180) * 140} stroke="#FF7A00" strokeWidth="4" strokeLinecap="round" />
                    ))}
                  </g>
                  
                  {/* Soft Sun Glow */}
                  <circle cx="150" cy="160" r="90" fill="url(#sunGlow)" opacity="0.8"/>
                  
                  {/* Om Symbol with 3D-like feel */}
                  <text x="150" y="200" fontFamily="sans-serif" fontSize="110" fill="url(#omGradient)" fontWeight="bold" textAnchor="middle" style={{ filter: 'drop-shadow(0px 8px 15px rgba(255,106,0,0.4))' }}>ॐ</text>

                  {/* Flag on top of Om */}
                  <path d="M150 90 L150 50 L190 65 L150 80" fill="#FF8C00"/>
                  <path d="M150 110 L150 50" stroke="#FF8C00" strokeWidth="3" strokeLinecap="round"/>
                  <circle cx="150" cy="50" r="4" fill="#FF6A00"/>

                  <defs>
                    <radialGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5">
                      <stop offset="0%" stopColor="#FFC899"/>
                      <stop offset="100%" stopColor="#FFF8F2" stopOpacity="0"/>
                    </radialGradient>
                    <linearGradient id="omGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FF8C00" />
                      <stop offset="100%" stopColor="#E65100" />
                    </linearGradient>
                  </defs>
                </svg>
             </div>

             {/* Welcome Text & Button */}
             <div className="px-6 pb-6 pt-2 flex flex-col items-center relative z-20 shrink-0">
                <h2 className="text-[26px] font-extrabold text-[#222222] mb-1.5 text-center drop-shadow-sm">
                  एक साथ, एक उद्देश्य
                </h2>
                <p className="text-[14px] font-semibold text-[#888888] mb-4 text-center">
                  समुदाय की प्रगति • समाज का विकास
                </p>

                <div className="flex items-center gap-1.5 mb-6 opacity-40">
                   <div className="w-10 h-[2px] bg-gradient-to-r from-transparent to-[#FF7A00]"></div>
                   <div className="w-1.5 h-1.5 rounded-full bg-[#FF7A00]"></div>
                   <div className="w-2 h-2 rounded-full bg-[#FF7A00]"></div>
                   <div className="w-1.5 h-1.5 rounded-full bg-[#FF7A00]"></div>
                   <div className="w-10 h-[2px] bg-gradient-to-l from-transparent to-[#FF7A00]"></div>
                </div>

                <button 
                  onClick={handleStart}
                  className="w-full h-[64px] bg-gradient-to-r from-[#FF6A00] to-[#FF8C00] rounded-[20px] flex items-center justify-center gap-4 active:scale-[0.98] transition-transform shadow-[0_18px_45px_rgba(255,106,0,0.35)] relative overflow-hidden group border border-[#FF9F40]"
                >
                   <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-b from-white/30 to-transparent pointer-events-none rounded-t-[20px]"></div>
                   <span className="text-white text-[20px] font-bold tracking-wide">शुरू करें</span>
                   <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md text-[#FF7A00] group-hover:scale-105 transition-transform">
                      <ChevronRight className="w-5 h-5 ml-0.5" strokeWidth={3.5} />
                   </div>
                </button>
             </div>

             {/* Info Cards Section */}
             <div className="px-6 pb-12 flex flex-col gap-4 shrink-0">


               {/* Grid Cards */}
               <div className="grid grid-cols-2 gap-3">
                 {/* Developer Card */}
                 <div className="bg-[#FFF5EC] border border-[#FDE0C9] rounded-[20px] p-4 flex gap-3 items-center">
                   <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#FF7A00] shrink-0">
                     <User className="w-5 h-5" strokeWidth={2} />
                   </div>
                   <div className="flex flex-col">
                     <span className="text-[10px] text-[#888888] font-bold">Developer</span>
                     <span className="text-[13px] text-[#FF7A00] font-bold leading-tight mt-0.5 mb-0.5">Lokesh Rajak</span>
                     <span className="text-[10px] text-[#888888] font-bold">Developer</span>
                   </div>
                 </div>

                 {/* Address Card */}
                 <div className="bg-[#FFF5EC] border border-[#FDE0C9] rounded-[20px] p-4 flex gap-3 items-center">
                   <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#FF7A00] shrink-0">
                     <MapPin className="w-5 h-5" strokeWidth={2} />
                   </div>
                   <div className="flex flex-col">
                     <span className="text-[10px] text-[#888888] font-bold">समिति पता</span>
                     <span className="text-[13px] text-[#FF7A00] font-bold leading-tight mt-0.5 mb-0.5">Nagargoan, Raipur</span>
                     <span className="text-[10px] text-[#FF7A00] font-bold">Dharsiwa (C.G.)</span>
                   </div>
                 </div>
               </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
