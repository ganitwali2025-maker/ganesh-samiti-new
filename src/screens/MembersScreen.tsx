import { useState } from 'react';
import { TopAppBar } from '../components/TopAppBar';
import { Search, Filter, Plus, UserCircle, Phone, MapPin } from 'lucide-react';
import { useCommitteeData } from '../hooks/useCommitteeData';

export function MembersScreen() {
  const { members } = useCommitteeData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.phone.includes(searchTerm)
  );

  return (
    <div className="flex flex-col h-full bg-[#FFF8F1]">
      <TopAppBar 
        title="सदस्य सूची (Members)" 
        rightAction={
          <button className="w-8 h-8 rounded-full bg-[#FF7A00]/10 flex items-center justify-center text-[#FF7A00]">
            <Filter className="w-4 h-4" />
          </button>
        }
      />

      <div className="p-5 flex-1 overflow-y-auto">
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400" />
          </div>
          <input 
            type="text" 
            placeholder="नाम या मोबाइल नंबर से खोजें..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-0 shadow-sm text-slate-800 text-[13px] rounded-2xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/30 font-medium"
          />
        </div>

        {/* Member List */}
        <div className="space-y-3 pb-20">
          {filteredMembers.map(member => (
            <div key={member.id} className="bg-white p-4 rounded-3xl shadow-[0_4px_15px_rgb(0,0,0,0.02)] border border-slate-50 flex items-center gap-4 active:scale-[0.98] transition-transform">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF7A00]/20 to-[#FF7A00]/10 flex items-center justify-center text-[#FF7A00]">
                <UserCircle className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-[14px]">{member.name}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                    <Phone className="w-3 h-3" /> {member.phone}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                    <MapPin className="w-3 h-3" /> {member.address || 'N/A'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${member.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                  {member.status === 'ACTIVE' ? 'सक्रिय' : 'निष्क्रिय'}
                </span>
                <p className="text-[10px] text-slate-400 font-medium mt-1">ID: GM-{1000 + member.id}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Add Button */}
      <button className="absolute bottom-24 right-5 w-14 h-14 bg-[#FF7A00] rounded-[20px] flex items-center justify-center text-white shadow-[0_8px_20px_rgb(255,122,0,0.4)] active:scale-95 transition-transform z-10">
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
