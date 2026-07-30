import { Home, Users, BarChart3, User } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { useLanguage } from '../context/LanguageContext';

export function BottomNav() {
  const { currentScreen, navigate } = useNavigation();
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-2 pb-6 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto relative">
      <button 
        onClick={() => navigate('dashboard')}
        className={`flex flex-col items-center gap-1 w-16 ${currentScreen === 'dashboard' ? 'text-[#FF7A00]' : 'text-slate-400'}`}
      >
        <Home className={`w-6 h-6 ${currentScreen === 'dashboard' ? 'fill-current' : ''}`} strokeWidth={currentScreen === 'dashboard' ? 2 : 1.5} />
        <span className="text-[10px] font-semibold">{t('navHome')}</span>
      </button>
      
      <button 
        onClick={() => navigate('members')}
        className={`flex flex-col items-center gap-1 w-16 ${currentScreen === 'members' ? 'text-[#FF7A00]' : 'text-slate-400'}`}
      >
        <Users className={`w-6 h-6 ${currentScreen === 'members' ? 'fill-current' : ''}`} strokeWidth={currentScreen === 'members' ? 2 : 1.5} />
        <span className="text-[10px] font-semibold">{t('navMembers')}</span>
      </button>

      {/* Floating Action Button for Deposit */}
      <div className="relative -top-6">
         <button 
           onClick={() => navigate('deposit')}
           className="w-14 h-14 bg-gradient-to-br from-[#FF6B00] to-[#FF9F1A] rounded-full flex flex-col items-center justify-center text-white shadow-lg shadow-orange-500/30 active:scale-95 transition-transform border-4 border-[#FFF8F3]"
         >
           <span className="text-2xl font-light leading-none">+</span>
         </button>
      </div>

      <button 
        onClick={() => navigate('reports')}
        className={`flex flex-col items-center gap-1 w-16 ${currentScreen === 'reports' ? 'text-[#FF7A00]' : 'text-slate-400'}`}
      >
        <BarChart3 className={`w-6 h-6 ${currentScreen === 'reports' ? 'fill-current' : ''}`} strokeWidth={currentScreen === 'reports' ? 2 : 1.5} />
        <span className="text-[10px] font-semibold">{t('navReports')}</span>
      </button>

      <button 
        onClick={() => navigate('profile')}
        className={`flex flex-col items-center gap-1 w-16 ${currentScreen === 'profile' ? 'text-[#FF7A00]' : 'text-slate-400'}`}
      >
        <User className={`w-6 h-6 ${currentScreen === 'profile' ? 'fill-current' : ''}`} strokeWidth={currentScreen === 'profile' ? 2 : 1.5} />
        <span className="text-[10px] font-semibold">{t('navProfile')}</span>
      </button>
      </div>
    </div>
  );
}
