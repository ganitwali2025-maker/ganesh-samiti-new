import { LayoutDashboard, Users, ReceiptIndianRupee } from 'lucide-react';
import { Tab } from '../types';
import { cn } from '../utils/cn';

interface NavigationProps {
  currentTab: Tab;
  setCurrentTab: (tab: Tab) => void;
}

export function Navigation({ currentTab, setCurrentTab }: NavigationProps) {
  const navItems = [
    { id: 'dashboard' as Tab, label: 'डैशबोर्ड', icon: LayoutDashboard },
    { id: 'members' as Tab, label: 'सदस्य', icon: Users },
    { id: 'transactions' as Tab, label: 'लेन-देन', icon: ReceiptIndianRupee },
  ];

  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-indigo-900 text-white border-t border-indigo-800 z-50 flex justify-around pb-safe">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentTab(item.id)}
            className={cn(
              "flex flex-col items-center justify-center w-full py-3 px-2 text-xs font-medium transition-colors",
              currentTab === item.id ? "text-amber-400" : "text-indigo-200 hover:text-white"
            )}
          >
            <item.icon className={cn("w-6 h-6 mb-1", currentTab === item.id ? "text-amber-400" : "")} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col w-64 bg-indigo-900 text-white border-r border-indigo-800 h-full shrink-0">
        <div className="p-6 border-b border-indigo-800">
           <h1 className="text-2xl font-bold flex items-center gap-2 italic">
             <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center text-indigo-900 font-black">
               स
             </div>
             समिति ऐप
           </h1>
        </div>
        <div className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={cn(
                "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                currentTab === item.id 
                  ? "bg-indigo-800/50 border border-indigo-700/50 text-white" 
                  : "text-indigo-200 hover:bg-indigo-800/30 hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5", currentTab === item.id ? "text-amber-400" : "")} />
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
