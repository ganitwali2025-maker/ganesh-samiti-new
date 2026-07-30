import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

export function GlobalAppHeader() {
  const { openDrawer, navigate } = useNavigation();

  return (
    <div className="h-[120px] bg-gradient-to-b from-[#FF6A00] to-[#FF8A00] rounded-b-[32px] shadow-[0_12px_24px_rgba(255,106,0,0.15)] px-5 pt-8 pb-4 flex items-center justify-between shrink-0 relative z-40 overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

      {/* Left: Menu Button */}
      <button 
        onClick={openDrawer}
        className="w-11 h-11 rounded-full bg-white/15 backdrop-blur flex items-center justify-center text-white active:scale-95 transition-transform relative z-10"
      >
        <Menu className="w-6 h-6" strokeWidth={2.5} />
      </button>

      {/* Center: Logo and Title */}
      <div className="flex flex-col items-center justify-center relative z-10">
        <div className="w-10 h-10 bg-white rounded-full p-0.5 shadow-md mb-1 border border-white/50">
          <img src="/logo.png" alt="Logo" className="w-full h-full rounded-full object-cover" />
        </div>
        <h1 className="text-[18px] font-bold text-white tracking-wide leading-none mb-0.5 drop-shadow-sm">
          गणेश समिति
        </h1>
        <p className="text-[10px] font-medium text-white tracking-widest uppercase opacity-95">
          एकता • सेवा • विकास
        </p>
      </div>

      {/* Right: Notifications */}
      <button 
        onClick={() => navigate('notifications')}
        className="w-11 h-11 rounded-full bg-white/15 backdrop-blur flex items-center justify-center text-white active:scale-95 transition-transform relative z-10"
      >
        <Bell className="w-5 h-5" strokeWidth={2.5} />
        {/* Red Badge */}
        <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#FF7A00]"></span>
      </button>
    </div>
  );
}
