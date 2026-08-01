import { useChandaData } from '../hooks/useChandaData';
import { PageHeader } from '../components/PageHeader';
import { useNavigation } from '../context/NavigationContext';
import { HandCoins, FileText, PlusCircle, ArrowUpRight, TrendingUp, AlertCircle, Calendar } from 'lucide-react';
import { formatCurrency } from '../utils/format';

export function ChandaDashboardScreen() {
  const { getChandaStats } = useChandaData();
  const { navigate } = useNavigation();
  const stats = getChandaStats();

  return (
    <div className="flex flex-col h-full bg-[#FFF8F1]">
      <PageHeader title="चंदा कलेक्शन" subtitle="स्वेच्छा अनुदान एवं चंदा" />

      <div className="flex-1 overflow-y-auto p-5 pb-32">
        {/* Total Collection Card */}
        <div className="bg-gradient-to-br from-[#FF5A5F] to-[#D12B30] rounded-[28px] p-6 text-white shadow-[0_8px_30px_rgba(255,90,95,0.3)] mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          
          <div className="flex justify-between items-start mb-2 relative z-10">
            <div>
              <p className="text-[13px] font-semibold opacity-90">कुल चंदा (Total Chanda)</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <HandCoins className="w-5 h-5 text-white" />
            </div>
          </div>
          <h2 className="text-[36px] font-extrabold tracking-wider mb-4 relative z-10">{formatCurrency(stats.totalChanda)}</h2>
          
          <div className="flex flex-col gap-3 relative z-10 border-t border-white/20 pt-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-300"></div>
                 <p className="text-[12px] opacity-90">नकद (Cash)</p>
              </div>
              <p className="text-[14px] font-bold">{formatCurrency(stats.cashCollection)}</p>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-amber-300"></div>
                 <p className="text-[12px] opacity-90">उधार (Credit)</p>
              </div>
              <p className="text-[14px] font-bold">{formatCurrency(stats.creditCollection)}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h3 className="text-[15px] font-bold text-slate-800 mb-4 px-1">त्वरित कार्य (Quick Actions)</h3>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button 
            onClick={() => navigate('chanda-entry')}
            className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform"
          >
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
              <PlusCircle className="w-6 h-6 text-[#FF5A5F]" />
            </div>
            <span className="text-[13px] font-bold text-slate-700">नया चंदा (New Entry)</span>
          </button>
          
          <button 
            onClick={() => navigate('chanda-register')}
            className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform"
          >
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-[13px] font-bold text-slate-700">चंदा रजिस्टर (Register)</span>
          </button>
        </div>

        {/* Timeline Stats */}
        <h3 className="text-[15px] font-bold text-slate-800 mb-4 px-1">आंकड़े (Statistics)</h3>
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-5 flex flex-col gap-5">
           <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                 </div>
                 <div>
                    <p className="text-[14px] font-bold text-slate-800">आज (Today)</p>
                 </div>
              </div>
              <p className="text-[16px] font-extrabold text-emerald-600">+{formatCurrency(stats.todayCollection)}</p>
           </div>
           
           <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-500" />
                 </div>
                 <div>
                    <p className="text-[14px] font-bold text-slate-800">इस महीने (This Month)</p>
                 </div>
              </div>
              <p className="text-[16px] font-extrabold text-blue-600">+{formatCurrency(stats.monthlyCollection)}</p>
           </div>

           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                 </div>
                 <div>
                    <p className="text-[14px] font-bold text-slate-800">बकाया चंदा (Outstanding)</p>
                 </div>
              </div>
              <p className="text-[16px] font-extrabold text-amber-600">{formatCurrency(stats.outstandingChanda)}</p>
           </div>
        </div>

      </div>
    </div>
  );
}
