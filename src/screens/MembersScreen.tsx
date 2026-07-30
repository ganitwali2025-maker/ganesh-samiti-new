import { useState } from 'react';
import { Search, Filter, Plus, UserCircle, Phone, MapPin } from 'lucide-react';
import { useCommitteeData } from '../hooks/useCommitteeData';
import { useNavigation } from '../context/NavigationContext';
import { PageHeader } from '../components/PageHeader';
import { MemberCard } from '../components/MemberCard';
import { AddMemberModal } from '../components/AddMemberModal';
import { Member } from '../types';

export function MembersScreen() {
  const { members, addMember } = useCommitteeData();
  const [searchTerm, setSearchTerm] = useState('');
  const { navigate } = useNavigation();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.phone.includes(searchTerm)
  );

  return (
    <div className="flex flex-col h-full bg-[#FFF8F2]">
      <PageHeader 
        title="सदस्य सूची" 
        subtitle="कुल सदस्य देखें एवं प्रबंधित करें" 
        rightAction={
          <button className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-sm active:scale-95 transition-transform border border-white/10">
            <Filter className="w-4 h-4 text-white" strokeWidth={2.5} />
          </button>
        }
      />

      <div className="p-5 flex-1 overflow-y-auto">
        {/* Search Bar */}
        <div className="relative mt-5 mb-6 shadow-[0_6px_18px_rgba(0,0,0,0.05)] rounded-[18px]">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-[#FF7A00]" />
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
        <div className="space-y-6 pb-20">
          {filteredMembers.map(member => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>

      {/* Floating Add Button */}
      <button 
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-[100px] right-5 w-14 h-14 bg-[#FF7A00] rounded-[20px] flex items-center justify-center text-white shadow-[0_8px_20px_rgb(255,122,0,0.4)] active:scale-95 transition-transform z-[40]"
      >
        <Plus className="w-6 h-6" />
      </button>

      <AddMemberModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addMember}
      />

    </div>
  );
}
