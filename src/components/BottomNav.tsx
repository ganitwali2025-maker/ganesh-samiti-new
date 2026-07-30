import { Home, Users, BarChart3, User } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

export function BottomNav() {
  const { currentScreen, navigate } = useNavigation();

  return (
    <div className="bg-[#FFF8F1] border-t border-[#FF7A00]/10 pb-safe pt-2 px-6 flex justify-between items-center fixed bottom-0 w-full inset-x-0 z-50">
      <button 
        onClick={() => navigate('dashboard')}
        className={`flex flex-col items-center gap-1 ${currentScreen === 'dashboard' ? 'text-[#FF7A00]' : 'text-slate-400'}`}
      >
        <Home className={`w-6 h-6 ${currentScreen === 'dashboard' ? 'fill-[#FF7A00]/20' : ''}`} />
        <span className="text-[10px] font-bold">होम</span>
      </button>

      <button 
        onClick={() => navigate('members')}
        className={`flex flex-col items-center gap-1 ${currentScreen === 'members' ? 'text-[#FF7A00]' : 'text-slate-400'}`}
      >
        <Users className={`w-6 h-6 ${currentScreen === 'members' ? 'fill-[#FF7A00]/20' : ''}`} />
        <span className="text-[10px] font-bold">सदस्य</span>
      </button>

      <div className="relative -top-6">
        <button 
          onClick={() => navigate('deposit')}
          className="w-14 h-14 bg-[#FF7A00] rounded-full flex items-center justify-center text-white shadow-[0_8px_20px_rgb(255,122,0,0.4)] border-4 border-[#FFF8F1] active:scale-95 transition-transform"
        >
          <span className="text-3xl font-light mb-1">+</span>
        </button>
        <span className="text-[10px] font-bold text-slate-600 absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">जमा करें</span>
      </div>

      <button 
        onClick={() => navigate('reports')}
        className={`flex flex-col items-center gap-1 ${currentScreen === 'reports' ? 'text-[#FF7A00]' : 'text-slate-400'}`}
      >
        <BarChart3 className={`w-6 h-6 ${currentScreen === 'reports' ? 'fill-[#FF7A00]/20' : ''}`} />
        <span className="text-[10px] font-bold">रिपोर्ट</span>
      </button>

      <button 
        onClick={() => navigate('profile')}
        className={`flex flex-col items-center gap-1 ${currentScreen === 'profile' ? 'text-[#FF7A00]' : 'text-slate-400'}`}
      >
        <User className={`w-6 h-6 ${currentScreen === 'profile' ? 'fill-[#FF7A00]/20' : ''}`} />
        <span className="text-[10px] font-bold">प्रोफाइल</span>
      </button>
      
      {/* Bottom Home Indicator area for iOS style padding */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-800 rounded-full md:hidden"></div>
    </div>
  );
}
