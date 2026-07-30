export * from './SplashScreen';
export * from './OnboardingScreen';
export * from './LoginScreen';
export * from './MembersScreen';
export * from './CollectionScreen';
export * from './DepositScreen';
export * from './ExpenseScreen';
export * from './BudgetScreen';
export * from './SavingsScreen';
export * from './BankScreen';
export * from './ReportsScreen';

import { TopAppBar } from '../components/TopAppBar';
import { useNavigation } from '../context/NavigationContext';
import { Calendar, Megaphone, User, Bell, Search as SearchIcon, Settings as SettingsIcon, LogOut, ChevronRight } from 'lucide-react';

export function EventsScreen() {
  return (
    <div className="flex flex-col h-full bg-[#FFF8F1]">
      <TopAppBar title="कार्यक्रम (Events)" />
      <div className="p-5 flex-1 overflow-y-auto">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-50 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FF7A00]/10 flex items-center justify-center text-[#FF7A00] mb-4">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg">Ganesh Chaturthi 2025</h3>
          <p className="text-sm text-slate-500 font-medium mt-1">27 August - 5 September</p>
          <div className="mt-4 flex gap-2">
            <span className="text-[10px] font-bold bg-[#FF7A00]/10 text-[#FF7A00] px-3 py-1.5 rounded-full">Upcoming</span>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full">10 Days</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NoticeScreen() {
  return (
    <div className="flex flex-col h-full bg-[#FFF8F1]">
      <TopAppBar title="सूचनाएं (Notice)" />
      <div className="p-5 flex-1 overflow-y-auto space-y-4">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-50">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-violet-50 flex flex-shrink-0 items-center justify-center text-violet-500 mt-1">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Meeting on Sunday</h4>
              <p className="text-[12px] text-slate-500 font-medium mt-1">All members are requested to attend the general body meeting this Sunday at 10 AM regarding budget planning.</p>
              <p className="text-[10px] text-slate-400 font-bold mt-3">2 Hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileScreen() {
  const { navigate } = useNavigation();
  return (
    <div className="flex flex-col h-full bg-[#FFF8F1]">
      <div className="p-6 pb-2 pt-12 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#FF7A00]/20 flex items-center justify-center text-[#FF7A00]">
          <User className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Admin User</h2>
          <p className="text-sm font-medium text-slate-500">+91 98765 43210</p>
        </div>
      </div>
      <div className="p-5 flex-1 overflow-y-auto space-y-2">
        <button onClick={() => navigate('settings')} className="w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-50 flex items-center justify-between active:scale-95 transition-transform">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600"><SettingsIcon className="w-5 h-5" /></div>
            <span className="font-bold text-slate-700 text-sm">Settings</span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </button>
        <button onClick={() => navigate('login')} className="w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-50 flex items-center justify-between active:scale-95 transition-transform mt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500"><LogOut className="w-5 h-5" /></div>
            <span className="font-bold text-rose-500 text-sm">Logout</span>
          </div>
        </button>
      </div>
    </div>
  );
}

export function NotificationsScreen() {
  return (
    <div className="flex flex-col h-full bg-[#FFF8F1]">
      <TopAppBar title="Notifications" />
      <div className="p-5 flex flex-col items-center justify-center flex-1 opacity-50">
        <Bell className="w-12 h-12 text-slate-300 mb-3" />
        <p className="text-sm font-semibold text-slate-500">No new notifications</p>
      </div>
    </div>
  );
}

export function SearchScreen() {
  return (
    <div className="flex flex-col h-full bg-[#FFF8F1]">
      <TopAppBar title="Search" />
      <div className="p-5 flex-1">
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="w-5 h-5 text-slate-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search anything..."
            className="w-full bg-white border-0 shadow-sm text-slate-800 text-[13px] rounded-2xl pl-11 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/30 font-medium"
          />
        </div>
      </div>
    </div>
  );
}

export function SettingsScreen() {
  return (
    <div className="flex flex-col h-full bg-[#FFF8F1]">
      <TopAppBar title="Settings" />
      <div className="p-5 flex-1 overflow-y-auto">
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-50">
            <h3 className="font-bold text-slate-800 text-sm mb-4">App Preferences</h3>
            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-[13px] font-medium text-slate-600">Dark Mode</span>
              <div className="w-10 h-6 bg-slate-200 rounded-full relative"><div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm"></div></div>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-[13px] font-medium text-slate-600">Language</span>
              <span className="text-[13px] font-bold text-[#FF7A00]">English / हिंदी</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
