import React from 'react';
import { Home as HomeIcon, Users, FileDown, FileUp, Plus } from 'lucide-react';

interface BottomNavProps {
  currentView: string;
  onChangeView: (view: string) => void;
  onOpenQuickAdd: () => void;
}

export function BottomNav({ currentView, onChangeView, onOpenQuickAdd }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 px-2 pb-safe pt-2 max-w-md mx-auto rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-end h-16 relative pb-1">
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
          <div className="absolute -top-10">
            <button
              onClick={onOpenQuickAdd}
              className="bg-[#4B20B5] text-white rounded-full p-3 shadow-[0_4px_12px_rgba(75,32,181,0.4)] hover:bg-purple-800 active:bg-purple-900 transition-colors flex items-center justify-center h-14 w-14"
            >
              <Plus size={32} />
            </button>
          </div>
          <span className="text-[10px] font-medium tracking-wide text-gray-500 mt-auto">नया जोड़ें</span>
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
      className={`flex flex-col items-center justify-end w-16 h-full transition-colors ${
        isActive ? 'text-[#4B20B5]' : 'text-gray-500 hover:text-gray-900'
      }`}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-[10px] font-medium tracking-wide">{label}</span>
    </button>
  );
}
