import React from 'react';
import { Home as HomeIcon, Users, FileDown, FileUp, Plus } from 'lucide-react';

interface BottomNavProps {
  currentView: string;
  onChangeView: (view: string) => void;
  onOpenQuickAdd: () => void;
}

export function BottomNav({ currentView, onChangeView, onOpenQuickAdd }: BottomNavProps) {
  return (
    <div className="w-full bg-white border-t border-gray-100 z-50 px-2 pb-safe pt-2 flex-shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-end h-16 relative pb-1 max-w-md mx-auto px-2">
        <NavItem
          icon={<HomeIcon size={24} />}
          label="होम"
          isActive={currentView === 'home'}
          onClick={() => onChangeView('home')}
        />
        <NavItem
          icon={<Users size={24} />}
          label="सदस्य"
          isActive={currentView === 'members'}
          onClick={() => onChangeView('members')}
        />
        
        {/* Center + Button */}
        <div className="flex flex-col items-center justify-end w-20 h-full relative">
          <div className="absolute -top-12">
            <button
              onClick={onOpenQuickAdd}
              className="bg-[#3A1499] text-white rounded-full shadow-[0_4px_12px_rgba(75,32,181,0.4)] hover:bg-purple-900 active:bg-purple-950 transition-colors flex items-center justify-center h-16 w-16 border-4 border-white"
            >
              <Plus size={36} />
            </button>
          </div>
          <span className="text-[10px] font-medium tracking-wide text-gray-500 mt-auto pb-1">नया जोड़ें</span>
        </div>

        <NavItem
          icon={<FileDown size={24} />}
          label="जमा शीट"
          isActive={currentView === 'deposits'}
          onClick={() => onChangeView('deposits')}
        />
        <NavItem
          icon={<FileUp size={24} />}
          label="खर्च शीट"
          isActive={currentView === 'expenses'}
          onClick={() => onChangeView('expenses')}
        />
      </div>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-[4.5rem] h-14 rounded-2xl transition-colors ${
        isActive ? 'bg-purple-50 text-[#4B20B5]' : 'text-gray-500 hover:text-gray-900'
      }`}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-[10px] font-semibold tracking-wide">{label}</span>
    </button>
  );
}
