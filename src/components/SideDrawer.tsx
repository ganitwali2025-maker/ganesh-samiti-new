import { useNavigation, ScreenName } from '../context/NavigationContext';
import { 
  X, Home, Users, Landmark, Wallet, Receipt, Target, 
  PiggyBank, Building2, BarChart3, Calendar, Megaphone, Settings, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function SideDrawer() {
  const { isDrawerOpen, closeDrawer, navigate, currentScreen } = useNavigation();

  const menuItems: { icon: any; label: string; route: ScreenName }[] = [
    { icon: Home, label: 'Dashboard', route: 'dashboard' },
    { icon: Users, label: 'Members', route: 'members' },
    { icon: Landmark, label: 'Monthly Collection', route: 'collection' },
    { icon: Wallet, label: 'Deposit', route: 'deposit' },
    { icon: Receipt, label: 'Expense', route: 'expense' },
    { icon: Target, label: 'Budget', route: 'budget' },
    { icon: PiggyBank, label: 'Savings', route: 'savings' },
    { icon: BarChart3, label: 'Reports', route: 'reports' },
    { icon: Building2, label: 'Bank Details', route: 'bank' },
    { icon: Calendar, label: 'Events', route: 'events' },
    { icon: Megaphone, label: 'Notice', route: 'notice' },
    { icon: Settings, label: 'Settings', route: 'settings' },
  ];

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="absolute inset-0 bg-black/40 z-[100]"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-y-0 left-0 w-[80%] max-w-[320px] bg-[#FFF8F1] z-[101] shadow-2xl flex flex-col"
          >
            {/* Drawer Header */}
            <div className="p-6 bg-gradient-to-br from-[#FF7A00] to-orange-400 relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 opacity-20">
                <svg viewBox="0 0 100 100" className="w-40 h-40 fill-white"><circle cx="50" cy="50" r="50"/></svg>
              </div>
              <button 
                onClick={closeDrawer}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 mt-2 p-1">
                 <img src="https://images.unsplash.com/photo-1579737920194-6725ea6198f7?q=80&w=256&auto=format&fit=crop" 
                      alt="Logo" className="w-full h-full rounded-full object-cover" />
              </div>
              <h2 className="text-xl font-bold text-white">गणेश समिति</h2>
              <p className="text-orange-100 text-sm font-medium">एकता • सेवा • विकास</p>
            </div>

            {/* Drawer Items */}
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
              {menuItems.map((item, index) => {
                const isActive = currentScreen === item.route;
                return (
                  <button
                    key={index}
                    onClick={() => navigate(item.route)}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-colors ${
                      isActive 
                        ? 'bg-[#FF7A00]/10 text-[#FF7A00]' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <item.icon className={`w-[22px] h-[22px] ${isActive ? 'text-[#FF7A00]' : 'text-slate-400'}`} />
                    <span className="font-semibold text-[15px]">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Logout */}
            <div className="p-4 border-t border-[#FF7A00]/10">
              <button 
                onClick={() => navigate('login')}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-rose-500 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-[22px] h-[22px]" />
                <span className="font-semibold text-[15px]">Logout</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
