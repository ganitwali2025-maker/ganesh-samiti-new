import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { useNavigation } from '../context/NavigationContext';
import { useChandaData } from '../hooks/useChandaData';
import { FileText, Search, User, IndianRupee, MapPin, Eye, Trash2, ShieldAlert, History, ArrowLeft } from 'lucide-react';
import { formatCurrency } from '../utils/format';
import { ChandaPaymentModal } from '../components/ChandaPaymentModal';
import { ChandaAuditLogModal } from '../components/ChandaAuditLogModal';
import toast from 'react-hot-toast';

export function ChandaRegisterScreen() {
  const { navigate } = useNavigation();
  const { chandas, deleteChanda } = useChandaData();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'CASH' | 'CREDIT' | 'PENDING'>('ALL');

  const [paymentModalData, setPaymentModalData] = useState<{ id: string, name: string, total: number, paid: number } | null>(null);
  const [auditLogId, setAuditLogId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this Chanda record?')) {
      deleteChanda(id);
      toast.success('Record Deleted Successfully');
    }
  };

  const filteredChandas = chandas.filter(c => {
    const matchesSearch = c.donorName.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    
    if (filterType === 'CASH') return c.paymentType === 'CASH';
    if (filterType === 'CREDIT') return c.paymentType === 'CREDIT';
    if (filterType === 'PENDING') return c.status === 'PENDING';
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-[#FFF8F1]">
      <div className="bg-theme-gradient pt-6 pb-6 px-4 rounded-b-[32px] shadow-sm flex items-center justify-between z-10 relative">
         <div className="flex items-center gap-3">
            <button 
               onClick={() => navigate('chanda')}
               className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm active:scale-95 transition-transform"
            >
               <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
               <h1 className="text-white text-[18px] font-extrabold tracking-wide">चंदा रजिस्टर (Register)</h1>
            </div>
         </div>
      </div>

      <div className="p-5 flex-1 overflow-y-auto pb-32">
        {/* Search */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400" />
          </div>
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="दानदाता का नाम खोजें..."
            className="w-full bg-white border border-slate-100 shadow-[0_4px_15px_rgb(0,0,0,0.03)] text-slate-800 text-[13px] rounded-2xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/30 font-medium"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
           {['ALL', 'CASH', 'CREDIT', 'PENDING'].map(f => (
             <button
               key={f}
               onClick={() => setFilterType(f as any)}
               className={`px-4 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${filterType === f ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200'}`}
             >
               {f === 'ALL' ? 'सभी (All)' : f === 'CASH' ? 'नकद (Cash)' : f === 'CREDIT' ? 'उधार (Credit)' : 'बकाया (Pending)'}
             </button>
           ))}
        </div>

        {/* List */}
        <div className="space-y-4">
          {filteredChandas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 opacity-50">
              <FileText className="w-12 h-12 text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-slate-500">कोई रिकॉर्ड नहीं मिला</p>
            </div>
          ) : (
            filteredChandas.map((c) => (
              <div key={c.id} className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-4">
                 <div className="flex justify-between items-start mb-3 border-b border-dashed border-slate-200 pb-3">
                    <div className="flex items-center gap-3">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center ${c.paymentType === 'CASH' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'}`}>
                         <User className="w-5 h-5" />
                       </div>
                       <div>
                          <h4 className="font-bold text-slate-800 text-[14px]">{c.donorName}</h4>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">{new Date(c.date).toLocaleDateString('en-IN')}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <span className="text-[15px] font-bold text-slate-800">{formatCurrency(c.amount)}</span>
                       <div className="mt-1">
                         <span className={`text-[9px] px-2 py-0.5 rounded-full inline-block font-bold ${c.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                           {c.paymentType === 'CASH' ? 'नकद' : (c.status === 'PAID' ? 'Paid' : 'Pending')}
                         </span>
                       </div>
                    </div>
                 </div>

                 {c.paymentType === 'CREDIT' && (
                   <div className="bg-slate-50 p-3 rounded-xl mb-3 flex justify-between items-center border border-slate-100">
                      <div>
                         <p className="text-[10px] font-bold text-slate-500">Paid Amount</p>
                         <p className="text-[13px] font-bold text-emerald-600">{formatCurrency(c.paidAmount)}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-bold text-slate-500">Remaining</p>
                         <p className="text-[13px] font-bold text-amber-600">{formatCurrency(c.amount - c.paidAmount)}</p>
                      </div>
                   </div>
                 )}

                 <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                       <button onClick={() => handleDelete(c.id)} className="w-8 h-8 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-500 active:scale-95 transition-transform">
                          <Trash2 className="w-4 h-4" />
                       </button>
                       <button onClick={() => setAuditLogId(c.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-bold text-[11px] active:scale-95 transition-transform">
                          <History className="w-3.5 h-3.5" />
                          <span>Audit</span>
                       </button>
                    </div>
                    
                    {c.status === 'PENDING' && c.paymentType === 'CREDIT' && (
                      <button 
                        onClick={() => setPaymentModalData({ id: c.id, name: c.donorName, total: c.amount, paid: c.paidAmount })}
                        className="bg-amber-500 text-white px-4 py-2 rounded-xl text-[11px] font-bold active:scale-95 transition-transform"
                      >
                        Receive Payment
                      </button>
                    )}
                 </div>
              </div>
            ))
          )}
        </div>
      </div>

      {paymentModalData && (
        <ChandaPaymentModal 
          chandaId={paymentModalData.id}
          donorName={paymentModalData.name}
          totalAmount={paymentModalData.total}
          paidAmount={paymentModalData.paid}
          onClose={() => setPaymentModalData(null)}
        />
      )}

      {auditLogId && (
        <ChandaAuditLogModal chandaId={auditLogId} onClose={() => setAuditLogId(null)} />
      )}
    </div>
  );
}
