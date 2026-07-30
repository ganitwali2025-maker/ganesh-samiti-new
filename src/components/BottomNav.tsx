import { Home, Users, BarChart3, User } from 'lucide-react';
import { Tab } from '../types';

interface BottomNavProps {
  currentTab: Tab;
  setCurrentTab: (tab: Tab) => void;
}

export function BottomNav({ currentTab, setCurrentTab }: BottomNavProps) {
  return (
    <div className="bg-[#FFF8F1] border-t border-[#FF7A00]/10 pb-safe pt-2 px-6 flex justify-between items-center fixed bottom-0 w-full inset-x-0 z-50">
      <button 
        onClick={() => setCurrentTab('dashboard')}
        className={`flex flex-col items-center gap-1 ${currentTab === 'dashboard' ? 'text-[#FF7A00]' : 'text-slate-400'}`}
      >
        <Home className={`w-6 h-6 ${currentTab === 'dashboard' ? 'fill-[#FF7A00]/20' : ''}`} />
        <span className="text-[10px] font-bold">होम</span>
      </button>

      <button 
        onClick={() => setCurrentTab('members')}
        className={`flex flex-col items-center gap-1 ${currentTab === 'members' ? 'text-[#FF7A00]' : 'text-slate-400'}`}
      >
        <Users className={`w-6 h-6 ${currentTab === 'members' ? 'fill-[#FF7A00]/20' : ''}`} />
        <span className="text-[10px] font-bold">सदस्य</span>
      </button>

      <div className="relative -top-6">
        <button className="w-14 h-14 bg-[#FF7A00] rounded-full flex items-center justify-center text-white shadow-[0_8px_20px_rgb(255,122,0,0.4)] border-4 border-[#FFF8F1] active:scale-95 transition-transform">
          <span className="text-3xl font-light mb-1">+</span>
        </button>
        <span className="text-[10px] font-bold text-slate-600 absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">जमा करें</span>
      </div>

      <button 
        onClick={() => setCurrentTab('transactions')}
        className={`flex flex-col items-center gap-1 ${currentTab === 'transactions' ? 'text-[#FF7A00]' : 'text-slate-400'}`}
      >
        <BarChart3 className={`w-6 h-6 ${currentTab === 'transactions' ? 'fill-[#FF7A00]/20' : ''}`} />
        <span className="text-[10px] font-bold">रिपोर्ट</span>
      </button>

      <button className="flex flex-col items-center gap-1 text-slate-400">
        <User className="w-6 h-6" />
        <span className="text-[10px] font-bold">प्रोफाइल</span>
      </button>
      
      {/* Bottom Home Indicator area for iOS style padding */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-800 rounded-full md:hidden"></div>
    </div>
  );
}
