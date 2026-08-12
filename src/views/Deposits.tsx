import React, { useState } from 'react';
import { useAppStore } from '../store';
import { formatCurrency, formatDate } from '../utils';
import { Menu, Filter, Search, Calendar as CalendarIcon, Trash2, Edit, ChevronDown } from 'lucide-react';
import { Jama } from '../types';
import { EditJamaModal } from '../components/EditJamaModal';

export function Deposits({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const { jamas, members, deleteJama } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'MONTHLY' | 'DONATION' | 'GANESH_CHATURTHI'>('ALL');
  
  const [editingJama, setEditingJama] = useState<Jama | null>(null);

  const sortedJamas = [...jamas].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredJamas = sortedJamas.filter(jama => {
    const member = members.find(m => m.id === jama.memberId);
    const matchesSearch = member?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          jama.note?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || jama.jamaType === filterType || (!jama.jamaType && filterType === 'MONTHLY'); // Default to monthly if no type
    
    return matchesSearch && matchesType;
  });

  const totalAmount = filteredJamas.reduce((sum, j) => sum + j.amount, 0);

  const handleDelete = (id: string) => {
    if (window.confirm("क्या आप यह जमा प्रविष्टि हटाना चाहते हैं?")) {
      deleteJama(id);
    }
  };

  const getJamaTypeLabel = (type?: string) => {
    if (type === 'DONATION') return 'चंदा जमा';
    if (type === 'GANESH_CHATURTHI') return 'गणेश चतुर्थी';
    return 'मासिक जमा';
  };
  
  const getJamaTypeColor = (type?: string) => {
    if (type === 'DONATION') return 'bg-orange-100 text-orange-700 border-orange-200';
    if (type === 'GANESH_CHATURTHI') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    return 'bg-purple-100 text-purple-700 border-purple-200';
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 relative">
      {/* Purple Header */}
      <div className="flex-shrink-0 bg-[#3A1499] text-white pt-safe px-4 pb-4 shadow-sm z-10">
        <div className="flex justify-between items-center h-14 mt-2">
          <div className="flex items-center gap-3">
            <button className="p-1 -ml-1" onClick={onOpenSidebar}>
              <Menu size={28} />
            </button>
            <h1 className="text-xl font-bold tracking-wide">जमा शीट</h1>
          </div>
          <button className="flex items-center gap-1.5 text-sm bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20 transition-colors">
            <Filter size={16} />
            <span>फ़िल्टर</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Filters Area */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 space-y-3 z-0">
          
          {/* Pills */}
          <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-1">
            <FilterPill label="सभी" active={filterType === 'ALL'} onClick={() => setFilterType('ALL')} />
            <FilterPill label="मासिक जमा" icon={<CalendarIcon size={14}/>} active={filterType === 'MONTHLY'} onClick={() => setFilterType('MONTHLY')} colorClass="text-purple-700" />
            <FilterPill label="चंदा जमा" icon={<span className="text-lg leading-none">₹</span>} active={filterType === 'DONATION'} onClick={() => setFilterType('DONATION')} colorClass="text-orange-600" />
            <FilterPill label="गणेश चतुर्थी" icon={<span className="text-lg leading-none">🕉️</span>} active={filterType === 'GANESH_CHATURTHI'} onClick={() => setFilterType('GANESH_CHATURTHI')} colorClass="text-emerald-600" />
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3A1499] focus:border-transparent transition-all"
                placeholder="सदस्य खोजें..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-2 text-sm text-gray-600 font-medium active:bg-gray-100">
               <CalendarIcon size={16} />
               दिनांक
               <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* Transaction Cards List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-24">
          {filteredJamas.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm font-medium bg-white rounded-2xl border border-gray-100">
              <p>कोई जमा प्रविष्टि नहीं मिली।</p>
            </div>
          ) : (
            filteredJamas.map((jama, index) => {
              const member = members.find(m => m.id === jama.memberId);
              return (
                <div key={jama.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
                  {/* Top row: Name & Actions */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        #{filteredJamas.length - index}
                      </div>
                      <div>
                        <h3 className="font-bold text-[15px] text-gray-900 leading-tight">{member?.name || 'Unknown Member'}</h3>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">{formatDate(jama.date)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                       <button onClick={() => setEditingJama(jama)} className="p-1.5 text-gray-400 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit size={16} />
                       </button>
                       <button onClick={() => handleDelete(jama.id)} className="p-1.5 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                       </button>
                    </div>
                  </div>

                  {/* Middle row: Type & Amount */}
                  <div className="flex justify-between items-center bg-gray-50/50 p-2.5 rounded-xl border border-gray-50">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${getJamaTypeColor(jama.jamaType)}`}>
                      {getJamaTypeLabel(jama.jamaType)}
                    </span>
                    <span className="font-bold text-lg text-emerald-600">{formatCurrency(jama.amount)}</span>
                  </div>

                  {/* Bottom row: Mode & Note */}
                  <div className="flex justify-between items-center text-xs text-gray-500 font-medium px-1">
                    <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-md">
                      <span className="text-gray-700">{jama.mode === 'Cash' ? 'नकद' : jama.mode}</span>
                    </div>
                    {jama.note && (
                      <span className="truncate max-w-[150px] text-[11px] text-gray-400">"{jama.note}"</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {/* Sticky Summary Footer */}
        <div className="flex-shrink-0 bg-white border-t border-gray-200 px-5 py-4 flex justify-between items-center shadow-[0_-4px_15px_rgba(0,0,0,0.03)] z-10">
           <div>
              <p className="text-xs font-semibold text-gray-500">कुल प्रविष्टि</p>
              <p className="text-base font-bold text-gray-900">{filteredJamas.length}</p>
           </div>
           <div className="text-right">
              <p className="text-xs font-semibold text-gray-500">कुल राशि</p>
              <p className="text-xl font-black text-[#3A1499] leading-tight">{formatCurrency(totalAmount)}</p>
           </div>
        </div>

      </div>

      {/* Edit Modal */}
      {editingJama && (
        <EditJamaModal 
          jama={editingJama} 
          isOpen={!!editingJama} 
          onClose={() => setEditingJama(null)} 
        />
      )}
    </div>
  );
}

function FilterPill({ label, active, onClick, icon, colorClass }: { label: string, active: boolean, onClick: () => void, icon?: React.ReactNode, colorClass?: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
        active 
          ? 'border-[#3A1499] bg-purple-50 text-[#3A1499]' 
          : 'border-transparent bg-gray-100 text-gray-500 hover:bg-gray-200'
      }`}
    >
      {icon && <span className={active ? '' : colorClass}>{icon}</span>}
      {label}
    </button>
  );
}
