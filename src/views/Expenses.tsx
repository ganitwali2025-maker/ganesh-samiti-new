import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store';
import { formatCurrency, formatDate } from '../utils';
import { Menu, Filter, Search, Calendar as CalendarIcon, Trash2, Edit, ChevronDown, Flame, MoreHorizontal } from 'lucide-react';
import { Kharcha } from '../types';
import { EditKharchaModal } from '../components/EditKharchaModal';

export function Expenses({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const { kharchas, deleteKharcha } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'POOJA' | 'GANESH_UTSAV' | 'OTHER'>('ALL');
  
  const [editingKharcha, setEditingKharcha] = useState<Kharcha | null>(null);

  const sortedKharchas = [...kharchas].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredKharchas = sortedKharchas.filter(kharcha => {
    const matchesSearch = kharcha.details.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          kharcha.note?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || kharcha.kharchaType === filterType || (!kharcha.kharchaType && filterType === 'OTHER');
    
    return matchesSearch && matchesType;
  });

  const totalAmount = filteredKharchas.reduce((sum, k) => sum + k.amount, 0);

  // Category Summaries based on filtered list (or all?) The prompt says "Category summary: All values must be calculated from actual saved transactions". 
  // Let's calculate from all sortedKharchas to always show the total breakdown at the bottom, even if filtered, or maybe filtered breakdown.
  // Actually, usually summary stays global or follows filter. Let's make it follow the filter for accuracy, or global for dashboard feel. Let's use global so they don't disappear when filtering.
  const poojaTotal = sortedKharchas.filter(k => k.kharchaType === 'POOJA').reduce((sum, k) => sum + k.amount, 0);
  const utsavTotal = sortedKharchas.filter(k => k.kharchaType === 'GANESH_UTSAV').reduce((sum, k) => sum + k.amount, 0);
  const otherTotal = sortedKharchas.filter(k => k.kharchaType === 'OTHER' || !k.kharchaType).reduce((sum, k) => sum + k.amount, 0);

  const handleDelete = (id: string) => {
    if (window.confirm("क्या आप यह खर्चा प्रविष्टि हटाना चाहते हैं?")) {
      deleteKharcha(id);
    }
  };

  const getKharchaTypeLabel = (type?: string) => {
    if (type === 'POOJA') return 'पूजा सामग्री';
    if (type === 'GANESH_UTSAV') return 'गणेश उत्सव खर्च';
    return 'अन्य खर्च';
  };
  
  const getKharchaTypeColor = (type?: string) => {
    if (type === 'POOJA') return 'bg-orange-100 text-orange-700 border-orange-200';
    if (type === 'GANESH_UTSAV') return 'bg-blue-100 text-blue-700 border-blue-200';
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
            <h1 className="text-xl font-bold tracking-wide">खर्चा शीट</h1>
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
            <FilterPill label="पूजा सामग्री" icon={<Flame size={14}/>} active={filterType === 'POOJA'} onClick={() => setFilterType('POOJA')} colorClass="text-orange-600" />
            <FilterPill label="गणेश उत्सव खर्च" icon={<span className="text-lg leading-none">🕉️</span>} active={filterType === 'GANESH_UTSAV'} onClick={() => setFilterType('GANESH_UTSAV')} colorClass="text-blue-600" />
            <FilterPill label="अन्य खर्च" icon={<MoreHorizontal size={14}/>} active={filterType === 'OTHER'} onClick={() => setFilterType('OTHER')} colorClass="text-purple-600" />
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3A1499] focus:border-transparent transition-all"
                placeholder="खर्च खोजें..."
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
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-36">
          {filteredKharchas.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm font-medium bg-white rounded-2xl border border-gray-100">
              <p>कोई खर्चा प्रविष्टि नहीं मिली।</p>
            </div>
          ) : (
            filteredKharchas.map((kharcha, index) => {
              return (
                <div key={kharcha.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
                  {/* Top row: Details & Actions */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        #{filteredKharchas.length - index}
                      </div>
                      <div>
                        <h3 className="font-bold text-[15px] text-gray-900 leading-tight">{kharcha.details}</h3>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">{formatDate(kharcha.date)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                       <button onClick={() => setEditingKharcha(kharcha)} className="p-1.5 text-gray-400 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit size={16} />
                       </button>
                       <button onClick={() => handleDelete(kharcha.id)} className="p-1.5 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                       </button>
                    </div>
                  </div>

                  {/* Middle row: Type & Amount */}
                  <div className="flex justify-between items-center bg-gray-50/50 p-2.5 rounded-xl border border-gray-50">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${getKharchaTypeColor(kharcha.kharchaType)}`}>
                      {getKharchaTypeLabel(kharcha.kharchaType)}
                    </span>
                    <span className="font-bold text-lg text-red-600">{formatCurrency(kharcha.amount)}</span>
                  </div>

                  {/* Bottom row: Mode & Note */}
                  <div className="flex justify-between items-center text-xs text-gray-500 font-medium px-1">
                    <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-md">
                      <span className="text-gray-700">{kharcha.mode === 'Cash' ? 'नकद' : kharcha.mode}</span>
                    </div>
                    {kharcha.note && (
                      <span className="truncate max-w-[150px] text-[11px] text-gray-400">"{kharcha.note}"</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {/* Sticky Summary Footer */}
        <div className="flex-shrink-0 bg-white shadow-[0_-4px_25px_rgba(0,0,0,0.06)] z-10 rounded-t-3xl border-t border-gray-100 overflow-hidden">
           <div className="px-5 py-4 flex justify-between items-center bg-gray-50/50 border-b border-gray-100">
             <div>
                <p className="text-[11px] font-bold text-gray-500 tracking-wide uppercase">कुल प्रविष्टि</p>
                <p className="text-xl font-black text-gray-900 leading-none mt-1">{filteredKharchas.length}</p>
             </div>
             <div className="text-right">
                <p className="text-[11px] font-bold text-gray-500 tracking-wide uppercase">कुल खर्च</p>
                <p className="text-2xl font-black text-red-600 leading-none mt-1">{formatCurrency(totalAmount)}</p>
             </div>
           </div>
           
           {/* Category breakdown */}
           <div className="grid grid-cols-3 divide-x divide-gray-100 bg-white">
              <div className="px-3 py-3 text-center">
                 <p className="text-[10px] font-bold text-orange-600 mb-1">पूजा सामग्री</p>
                 <p className="text-xs font-bold text-gray-900">{formatCurrency(poojaTotal)}</p>
              </div>
              <div className="px-3 py-3 text-center">
                 <p className="text-[10px] font-bold text-blue-600 mb-1">गणेश उत्सव</p>
                 <p className="text-xs font-bold text-gray-900">{formatCurrency(utsavTotal)}</p>
              </div>
              <div className="px-3 py-3 text-center">
                 <p className="text-[10px] font-bold text-purple-600 mb-1">अन्य खर्च</p>
                 <p className="text-xs font-bold text-gray-900">{formatCurrency(otherTotal)}</p>
              </div>
           </div>
        </div>

      </div>

      {/* Edit Modal */}
      {editingKharcha && (
        <EditKharchaModal 
          kharcha={editingKharcha} 
          isOpen={!!editingKharcha} 
          onClose={() => setEditingKharcha(null)} 
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
