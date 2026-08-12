import React, { useState } from 'react';
import { useAppStore } from '../store';
import { formatCurrency } from '../utils';
import { Search, ChevronLeft, Plus } from 'lucide-react';

export function Members({ onAddClick }: { onAddClick: () => void }) {
  const { members, jamas } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.mobile.includes(searchTerm)
  );

  return (
    <div className="pb-28 min-h-screen bg-gray-50 flex flex-col">
      {/* Purple Header */}
      <div className="bg-[#4B20B5] text-white pt-safe px-4 pb-4">
        <div className="flex justify-between items-center h-14 mt-2">
          <button className="p-2 -ml-2">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-semibold">सदस्य सूची</h1>
          <button className="p-2 -mr-2" onClick={onAddClick}>
            <Plus size={24} />
          </button>
        </div>
      </div>

      <div className="px-4 py-4 flex-1 flex flex-col">
        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 bg-white border border-gray-100 rounded-xl leading-5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4B20B5] focus:border-[#4B20B5] sm:text-sm shadow-sm"
            placeholder="सदस्य खोजें..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Member List */}
        <div className="flex-1 overflow-y-auto space-y-3 pb-2">
          {filteredMembers.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-sm">
              <p>कोई सदस्य नहीं मिला।</p>
            </div>
          ) : (
            filteredMembers.map((member, index) => {
              const memberJamas = jamas.filter(j => j.memberId === member.id);
              const totalMemberJama = memberJamas.reduce((acc, curr) => acc + curr.amount, 0);

              return (
                <div key={member.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#4B20B5] text-white flex items-center justify-center font-bold text-lg">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-[15px]">{member.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">सदस्य ID: {member.memberId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-600">{formatCurrency(totalMemberJama)}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">कुल जमा</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
