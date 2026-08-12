import React from 'react';
import { UserPlus, FileDown, FileUp, X } from 'lucide-react';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: 'addMember' | 'addJama' | 'addKharcha') => void;
}

export function QuickActionModal({ isOpen, onClose, onSelectAction }: QuickActionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4 max-w-md mx-auto" onClick={onClose}>
      <div 
        className="bg-white w-full rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-8 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">नया जोड़ें</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <ActionItem
            icon={<UserPlus size={28} className="text-emerald-600" />}
            label="सदस्य जोड़ें"
            bg="bg-emerald-50"
            onClick={() => {
              onSelectAction('addMember');
              onClose();
            }}
          />
          <ActionItem
            icon={<FileDown size={28} className="text-blue-600" />}
            label="पैसा जमा"
            bg="bg-blue-50"
            onClick={() => {
              onSelectAction('addJama');
              onClose();
            }}
          />
          <ActionItem
            icon={<FileUp size={28} className="text-orange-600" />}
            label="खर्चा जोड़ें"
            bg="bg-orange-50"
            onClick={() => {
              onSelectAction('addKharcha');
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}

function ActionItem({ icon, label, bg, onClick }: { icon: React.ReactNode; label: string; bg: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl hover:bg-gray-50 active:bg-gray-100 transition-colors border border-gray-100 shadow-sm gap-3"
    >
      <div className={`w-14 h-14 ${bg} rounded-full flex items-center justify-center`}>
        {icon}
      </div>
      <span className="text-xs font-semibold text-gray-800 text-center leading-tight">{label}</span>
    </button>
  );
}
