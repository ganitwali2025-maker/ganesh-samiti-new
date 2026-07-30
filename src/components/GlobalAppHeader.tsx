import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

const MandalaPattern = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={`absolute pointer-events-none opacity-[0.06] ${className}`} xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(100, 100)">
      <circle r="90" stroke="white" strokeWidth="0.5" fill="none" />
      <circle r="75" stroke="white" strokeWidth="0.5" fill="none" strokeDasharray="4 4" />
      <circle r="60" stroke="white" strokeWidth="0.5" fill="none" />
      <circle r="40" stroke="white" strokeWidth="0.5" fill="none" strokeDasharray="2 2" />
      {Array.from({ length: 16 }).map((_, i) => (
        <g key={i} transform={`rotate(${i * 22.5})`}>
          <path d="M 0 -60 C 15 -75, -15 -75, 0 -60" stroke="white" strokeWidth="0.5" fill="none" />
          <path d="M 0 -75 C 10 -85, -10 -85, 0 -75" stroke="white" strokeWidth="0.5" fill="none" />
          <circle cx="0" cy="-90" r="1.5" fill="white" />
          <path d="M 0 -40 L 5 -50 L 0 -60 L -5 -50 Z" stroke="white" strokeWidth="0.5" fill="none" />
        </g>
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <g key={`inner-${i}`} transform={`rotate(${i * 45})`}>
          <path d="M 0 -20 C 10 -30, -10 -30, 0 -20" stroke="white" strokeWidth="1" fill="none" />
          <circle cx="0" cy="-35" r="2" fill="white" />
        </g>
      ))}
    </g>
  </svg>
);

const TopOrnament = () => (
  <div className="flex items-center justify-center gap-1.5 mb-2 opacity-50 w-full px-8">
    <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-white"></div>
    <svg width="24" height="6" viewBox="0 0 24 6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="3" r="2.5" fill="none" stroke="white" strokeWidth="0.5"/>
      <circle cx="12" cy="3" r="1" fill="white"/>
      <circle cx="6" cy="3" r="1" fill="white"/>
      <circle cx="18" cy="3" r="1" fill="white"/>
    </svg>
    <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-white"></div>
  </div>
);

export function GlobalAppHeader() {
  const { openDrawer, navigate } = useNavigation();

  return (
    <div className="h-[120px] bg-theme-gradient rounded-b-[32px] shadow-[0_12px_24px_rgba(255,106,0,0.15)] px-5 pt-8 pb-4 flex items-center justify-between shrink-0 relative z-40 overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-3xl pointer-events-none animate-glow"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl pointer-events-none animate-glow-reverse"></div>
      
      {/* Mandalas */}
      <MandalaPattern className="-left-16 top-1/2 -translate-y-1/2 w-48 h-48" />
      <MandalaPattern className="-right-16 top-1/2 -translate-y-1/2 w-48 h-48" />

      {/* Left: Menu Button */}
      <button 
        onClick={openDrawer}
        className="w-11 h-11 rounded-full bg-white/15 backdrop-blur flex items-center justify-center text-white active:scale-95 transition-transform relative z-10"
      >
        <Menu className="w-6 h-6" strokeWidth={2.5} />
      </button>

      {/* Center: Title and Subtitle */}
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center w-[70%] text-center z-10 pt-1">
        <TopOrnament />
        <h2 className="text-[19px] font-bold text-white tracking-wide leading-tight drop-shadow-sm opacity-95 mb-0.5">
          जय बजरंग युवा गणेश उत्सव
        </h2>
        <h1 className="text-[19px] font-bold text-white tracking-wide leading-none drop-shadow-sm mb-2">
          गणेश समिति
        </h1>
        <div className="flex items-center justify-center gap-2 w-full opacity-90">
          <div className="w-6 h-[1px] bg-white/60"></div>
          <p className="text-[10px] font-medium text-white tracking-widest uppercase">
            एकता • सेवा • संस्कार • विकास
          </p>
          <div className="w-6 h-[1px] bg-white/60"></div>
        </div>
      </div>

      {/* Right: Notifications */}
      <button 
        onClick={() => navigate('notifications')}
        className="w-11 h-11 rounded-full bg-white/15 backdrop-blur flex items-center justify-center text-white active:scale-95 transition-transform relative z-10"
      >
        <Bell className="w-5 h-5" strokeWidth={2.5} />
        {/* Red Badge */}
        <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-theme-primary"></span>
      </button>
    </div>
  );
}
