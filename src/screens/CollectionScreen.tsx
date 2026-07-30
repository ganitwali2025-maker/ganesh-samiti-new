import { useState } from 'react';
import { TopAppBar } from '../components/TopAppBar';
import { useCommitteeData } from '../hooks/useCommitteeData';
import { Landmark, ArrowDownCircle, Search, Filter } from 'lucide-react';
import { formatCurrency } from '../utils/format';

export function CollectionScreen() {
  const { transactions, members } = useCommitteeData();
  const [activeTab, setActiveTab] = useState<'paid' | 'pending'>('paid');
  
  const deposits = transactions.filter(t => t.type === 'DEPOSIT');

  return (
    <div className="flex flex-col h-full bg-[#FFF8F1]">
      <TopAppBar 
        title="मासिक जमा (Collection)" 
        rightAction={
          <button className="w-8 h-8 rounded-full bg-[#FF7A00]/10 flex items-center justify-center text-[#FF7A00]">
            <Filter className="w-4 h-4" />
          </button>
        }
      />

      <div className="p-5 flex-1 overflow-y-auto">
        {/* Total Stats */}
        <div className="bg-emerald-50 rounded-[28px] p-5 flex items-center justify-between mb-6 shadow-sm border border-emerald-100">
          <div>
             <p className="text-[12px] font-bold text-emerald-600 mb-1">कुल प्राप्त राशि (Total Collected)</p>
             <h3 className="text-2xl font-extrabold text-emerald-500">₹1,25,600</h3>
          </div>
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
            <Landmark className="w-7 h-7 text-emerald-600" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white p-1 rounded-2xl mb-6 shadow-sm">
          <button 
            onClick={() => setActiveTab('paid')}
            className={`flex-1 py-3 text-[13px] font-bold rounded-xl transition-all ${activeTab === 'paid' ? 'bg-[#FF7A00] text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            प्राप्त (Paid)
          </button>
          <button 
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-3 text-[13px] font-bold rounded-xl transition-all ${activeTab === 'pending' ? 'bg-[#FF7A00] text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            बकाया (Pending)
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400" />
          </div>
          <input 
            type="text" 
            placeholder="सदस्य का नाम खोजें..."
            className="w-full bg-white border-0 shadow-sm text-slate-800 text-[13px] rounded-2xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/30 font-medium"
          />
        </div>

        {/* Collection List */}
        {activeTab === 'paid' ? (
          <div className="space-y-3 pb-20">
            {deposits.map(t => {
              const member = members.find(m => m.id === t.memberId);
              return (
                <div key={t.id} className="bg-white p-4 rounded-3xl shadow-[0_4px_15px_rgb(0,0,0,0.02)] border border-slate-50 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[16px] bg-emerald-50 flex items-center justify-center text-emerald-500">
                    <ArrowDownCircle className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 text-[14px]">{member ? member.name : 'Unknown'}</h4>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">{t.category} • {new Date(t.date).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[15px] font-bold text-emerald-500">{formatCurrency(t.amount)}</span>
                    <p className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1 font-bold">Paid</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 opacity-50">
            <Landmark className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-sm font-semibold text-slate-500">कोई बकाया नहीं (No pending)</p>
          </div>
        )}
      </div>
    </div>
  );
}
