import { Home, Users, BarChart3, User } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

export function BottomNav() {
  const { currentScreen, navigate } = useNavigation();

  return (
    <div className="fixed bottom-6 left-6 right-6 bg-white/95 backdrop-blur-2xl rounded-[28px] shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-white/60 px-6 py-3 flex justify-between items-center z-50">
      <button 
        onClick={() => navigate('dashboard')}
        className={`flex flex-col items-center gap-1.5 transition-all ${currentScreen === 'dashboard' ? 'text-[#FF7A00] scale-110' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <Home className={`w-5 h-5 ${currentScreen === 'dashboard' ? 'fill-[#FF7A00]/20' : ''}`} />
        <span className="text-[9px] font-extrabold tracking-wide">होम</span>
      </button>

      <button 
        onClick={() => navigate('members')}
        className={`flex flex-col items-center gap-1.5 transition-all ${currentScreen === 'members' ? 'text-[#FF7A00] scale-110' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <Users className={`w-5 h-5 ${currentScreen === 'members' ? 'fill-[#FF7A00]/20' : ''}`} />
        <span className="text-[9px] font-extrabold tracking-wide">सदस्य</span>
      </button>

      <div className="relative -top-7">
        <button 
          onClick={() => navigate('deposit')}
          className="w-14 h-14 bg-gradient-to-tr from-[#FF7A00] to-[#FF9E40] rounded-full flex items-center justify-center text-white shadow-[0_12px_24px_rgba(255,122,0,0.4)] border-[4px] border-[#FFF8F1] active:scale-95 transition-transform"
        >
          <span className="text-3xl font-light mb-1">+</span>
        </button>
      </div>

      <button 
        onClick={() => navigate('reports')}
        className={`flex flex-col items-center gap-1.5 transition-all ${currentScreen === 'reports' ? 'text-[#FF7A00] scale-110' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <BarChart3 className={`w-5 h-5 ${currentScreen === 'reports' ? 'fill-[#FF7A00]/20' : ''}`} />
        <span className="text-[9px] font-extrabold tracking-wide">रिपोर्ट</span>
      </button>

      <button 
        onClick={() => navigate('profile')}
        className={`flex flex-col items-center gap-1.5 transition-all ${currentScreen === 'profile' ? 'text-[#FF7A00] scale-110' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <User className={`w-5 h-5 ${currentScreen === 'profile' ? 'fill-[#FF7A00]/20' : ''}`} />
        <span className="text-[9px] font-extrabold tracking-wide">प्रोफाइल</span>
      </button>
    </div>
  );
}
