import React from 'react';
import { Home, Users, FileDown, FileUp, Settings, LogOut, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onChangeView: (view: string) => void;
}

export function Sidebar({ isOpen, onClose, currentView, onChangeView }: SidebarProps) {
  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[999] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 left-0 w-[80%] max-w-sm bg-white z-[1000] shadow-2xl flex flex-col transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="bg-[#4B20B5] text-white p-6 flex flex-col justify-end h-32 relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
          <h2 className="text-xl font-bold tracking-wide">GANESH SAMITI APP</h2>
          <p className="text-sm text-purple-200 mt-1">समिति का लेखा-जोखा</p>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-4">
          <MenuItem 
            icon={<Home size={22} />} 
            label="होम" 
            isActive={currentView === 'home'} 
            onClick={() => { onChangeView('home'); onClose(); }} 
          />
          <MenuItem 
            icon={<Users size={22} />} 
            label="सदस्य" 
            isActive={currentView === 'members'} 
            onClick={() => { onChangeView('members'); onClose(); }} 
          />
          <MenuItem 
            icon={<FileDown size={22} />} 
            label="जमा शीट" 
            isActive={currentView === 'deposits'} 
            onClick={() => { onChangeView('deposits'); onClose(); }} 
          />
          <MenuItem 
            icon={<FileUp size={22} />} 
            label="खर्चा शीट" 
            isActive={currentView === 'expenses'} 
            onClick={() => { onChangeView('expenses'); onClose(); }} 
          />

          <div className="my-4 border-t border-gray-100" />

          <MenuItem 
            icon={<Settings size={22} />} 
            label="सेटिंग्स" 
            isActive={false} 
            onClick={onClose} 
          />
          <MenuItem 
            icon={<LogOut size={22} />} 
            label="लॉगआउट" 
            isActive={false} 
            onClick={onClose} 
            textColor="text-red-600"
          />
        </div>
      </div>
    </>
  );
}

function MenuItem({ icon, label, isActive, onClick, textColor = 'text-gray-700' }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void, textColor?: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-3.5 transition-colors ${
        isActive ? 'bg-purple-50 text-[#4B20B5] font-semibold border-r-4 border-[#4B20B5]' : `hover:bg-gray-50 font-medium ${textColor}`
      }`}
    >
      <div className={`${isActive ? 'text-[#4B20B5]' : 'text-gray-400'}`}>
        {icon}
      </div>
      <span className="text-[15px]">{label}</span>
    </button>
  );
}
