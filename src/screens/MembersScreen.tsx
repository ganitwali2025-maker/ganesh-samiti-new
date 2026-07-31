import { useState } from 'react';
import { Search, Filter, Plus, UserCircle, Phone, MapPin } from 'lucide-react';
import { useCommitteeData } from '../hooks/useCommitteeData';
import { useNavigation } from '../context/NavigationContext';
import { PageHeader } from '../components/PageHeader';
import { MemberCard } from '../components/MemberCard';
import { AddMemberModal } from '../components/AddMemberModal';
import { EditMemberModal } from '../components/EditMemberModal';
import { Member } from '../types';

export function MembersScreen() {
  const { members, addMember, updateMember, deleteMember } = useCommitteeData();
  const [searchTerm, setSearchTerm] = useState('');
  const { navigate } = useNavigation();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [actionMode, setActionMode] = useState<'edit' | 'delete' | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.phone.includes(searchTerm)
  );

  const handleSelect = (member: Member) => {
    if (actionMode === 'edit') {
      setMemberToEdit(member);
      setActionMode(null);
    } else if (actionMode === 'delete') {
      if (selectedIds.includes(member.id)) {
        setSelectedIds(selectedIds.filter(id => id !== member.id));
      } else {
        setSelectedIds([...selectedIds, member.id]);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FFF8F2]">
      <PageHeader 
        title="सदस्य सूची" 
        subtitle={actionMode === 'delete' ? `${selectedIds.length} सदस्य चुने गए` : "कुल सदस्य देखें एवं प्रबंधित करें"}
        rightAction={
          actionMode ? (
            <button 
              onClick={() => { setActionMode(null); setSelectedIds([]); }}
              className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold active:scale-95 transition-transform"
            >
              रद्द करें (Cancel)
            </button>
          ) : (
            <button className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-sm active:scale-95 transition-transform border border-white/10">
              <Filter className="w-4 h-4 text-white" strokeWidth={2.5} />
            </button>
          )
        }
      />

      <div className="p-5 flex-1 overflow-y-auto">
        {/* Search Bar */}
        <div className="relative mt-5 mb-6 shadow-[0_6px_18px_rgba(0,0,0,0.05)] rounded-[18px]">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-theme-primary" />
          </div>
          <input 
            type="text" 
            placeholder="सदस्य का नाम या मोबाइल नंबर खोजें..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-[56px] bg-[#FFFFFF] border border-[#ECECEC] text-[#1F2937] text-[14px] rounded-[18px] pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/50 font-medium transition-shadow placeholder:text-slate-400"
          />
        </div>

        {/* Member List */}
        <div className="space-y-6 pb-32">
          {filteredMembers.map(member => (
            <div key={member.id}>
              <MemberCard 
                member={member} 
                selectableMode={actionMode}
                isSelected={selectedIds.includes(member.id)}
                onSelect={handleSelect}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Button (FAB) Menu */}
      {!actionMode && (
        <div className="fixed bottom-[100px] right-5 z-[40] flex flex-col items-end gap-3">
          {/* Expanded Options */}
          {isFabOpen && (
            <div className="flex flex-col gap-3 animate-in slide-in-from-bottom-5 fade-in duration-200">
              <button 
                onClick={() => { setActionMode('delete'); setIsFabOpen(false); }}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] active:scale-95 transition-transform"
              >
                <span className="text-sm font-bold text-slate-700">हटाएं (Delete)</span>
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </div>
              </button>
              <button 
                onClick={() => { setActionMode('edit'); setIsFabOpen(false); }}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] active:scale-95 transition-transform"
              >
                <span className="text-sm font-bold text-slate-700">बदलें (Edit)</span>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                </div>
              </button>
              <button 
                onClick={() => { setActionMode(null); setIsAddModalOpen(true); setIsFabOpen(false); }}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] active:scale-95 transition-transform"
              >
                <span className="text-sm font-bold text-slate-700">नया जोड़ें (Add)</span>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-500">
                  <Plus className="w-5 h-5" />
                </div>
              </button>
            </div>
          )}

          {/* Main FAB */}
          <button 
            onClick={() => {
              if (isFabOpen) {
                setIsFabOpen(false);
              } else {
                setIsFabOpen(true);
                setActionMode(null);
                setSelectedIds([]);
              }
            }}
            className={`w-14 h-14 bg-theme-gradient rounded-[20px] flex items-center justify-center text-white shadow-[0_8px_20px_rgb(255,122,0,0.4)] active:scale-95 transition-all duration-300 ${isFabOpen ? 'rotate-45' : ''}`}
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Delete Action Bar */}
      {actionMode === 'delete' && selectedIds.length > 0 && (
        <div className="fixed bottom-[100px] left-5 right-5 z-[40] animate-in slide-in-from-bottom-5 fade-in duration-200">
          <button 
            onClick={() => {
              if (window.confirm(`क्या आप सच में ${selectedIds.length} सदस्य(यों) को हटाना चाहते हैं?`)) {
                selectedIds.forEach(id => deleteMember(id));
                setActionMode(null);
                setSelectedIds([]);
              }
            }}
            className="w-full h-[56px] bg-red-500 text-white text-[16px] font-bold rounded-[16px] shadow-[0_8px_20px_rgba(239,68,68,0.3)] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            {selectedIds.length} सदस्य हटाएं
          </button>
        </div>
      )}

      <AddMemberModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addMember}
      />

      <EditMemberModal 
        isOpen={!!memberToEdit}
        onClose={() => setMemberToEdit(null)}
        onEdit={updateMember}
        member={memberToEdit}
      />

    </div>
  );
}
