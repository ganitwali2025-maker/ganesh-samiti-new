import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { useNavigation } from '../context/NavigationContext';
import { useChandaData } from '../hooks/useChandaData';
import { FileText, ArrowLeft, Download } from 'lucide-react';
import { formatCurrency } from '../utils/format';

export function ChandaReportsScreen() {
  const { navigate } = useNavigation();
  const { chandas, chandaPayments, getChandaStats } = useChandaData();
  const stats = getChandaStats();
  
  const [reportType, setReportType] = useState<'ALL' | 'CASH' | 'CREDIT' | 'PAYMENTS'>('ALL');

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
               <h1 className="text-white text-[18px] font-extrabold tracking-wide">चंदा रिपोर्ट्स (Reports)</h1>
            </div>
         </div>
      </div>

      <div className="p-5 flex-1 overflow-y-auto pb-32">
        <div className="grid grid-cols-2 gap-4 mb-6">
           <div className="bg-emerald-50 rounded-[20px] p-4 border border-emerald-100">
              <p className="text-[11px] font-bold text-emerald-600 mb-1">Cash Collection</p>
              <h3 className="text-[18px] font-extrabold text-emerald-500">{formatCurrency(stats.cashCollection)}</h3>
           </div>
           <div className="bg-amber-50 rounded-[20px] p-4 border border-amber-100">
              <p className="text-[11px] font-bold text-amber-600 mb-1">Outstanding</p>
              <h3 className="text-[18px] font-extrabold text-amber-500">{formatCurrency(stats.outstandingChanda)}</h3>
           </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
           {['ALL', 'CASH', 'CREDIT', 'PAYMENTS'].map(f => (
             <button
               key={f}
               onClick={() => setReportType(f as any)}
               className={`px-4 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${reportType === f ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200'}`}
             >
               {f === 'ALL' ? 'सम्पूर्ण चंदा' : f === 'CASH' ? 'नकद रिपोर्ट' : f === 'CREDIT' ? 'उधार रिपोर्ट' : 'भुगतान (Payments)'}
             </button>
           ))}
        </div>

        <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                       <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Date</th>
                       <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Donor Name</th>
                       <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Amount</th>
                       <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Type / Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {reportType !== 'PAYMENTS' ? (
                       chandas.filter(c => reportType === 'ALL' || c.paymentType === reportType).map(c => (
                          <tr key={c.id} className="hover:bg-slate-50/50">
                             <td className="px-4 py-3 text-[12px] font-semibold text-slate-600 whitespace-nowrap">{new Date(c.date).toLocaleDateString('en-IN')}</td>
                             <td className="px-4 py-3 text-[13px] font-bold text-slate-800 whitespace-nowrap">{c.donorName}</td>
                             <td className="px-4 py-3 text-[13px] font-bold text-slate-800 whitespace-nowrap">{formatCurrency(c.amount)}</td>
                             <td className="px-4 py-3 whitespace-nowrap">
                               <span className={`text-[10px] px-2 py-0.5 rounded-full inline-block font-bold ${c.paymentType === 'CASH' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                 {c.paymentType} {c.paymentType === 'CREDIT' && `(${c.status})`}
                               </span>
                             </td>
                          </tr>
                       ))
                    ) : (
                       chandaPayments.map(p => {
                          const donor = chandas.find(c => c.id === p.chandaId)?.donorName || 'Unknown';
                          return (
                             <tr key={p.id} className="hover:bg-slate-50/50">
                                <td className="px-4 py-3 text-[12px] font-semibold text-slate-600 whitespace-nowrap">{new Date(p.date).toLocaleDateString('en-IN')}</td>
                                <td className="px-4 py-3 text-[13px] font-bold text-slate-800 whitespace-nowrap">{donor}</td>
                                <td className="px-4 py-3 text-[13px] font-bold text-emerald-600 whitespace-nowrap">+{formatCurrency(p.amount)}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span className="text-[10px] px-2 py-0.5 rounded-full inline-block font-bold bg-blue-50 text-blue-600">
                                    {p.paymentMethod}
                                  </span>
                                </td>
                             </tr>
                          );
                       })
                    )}
                 </tbody>
              </table>
           </div>
        </div>

      </div>
    </div>
  );
}
