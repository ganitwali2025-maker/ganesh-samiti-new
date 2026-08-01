import { useState, useRef } from 'react';
import { useCommitteeData } from '../hooks/useCommitteeData';
import { useChandaData } from '../hooks/useChandaData';
import { useExpenseData } from '../hooks/useExpenseData';
import { useNavigation } from '../context/NavigationContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Users, Landmark, Wallet, Receipt, Target, 
  Building2, BarChart3, Calendar, Megaphone,
  ArrowDownCircle, ArrowUpCircle, UserPlus, FileText,
  HandCoins, WalletCards, ArrowUpRight, ArrowDownRight, RefreshCw,
  Banknote, PlusCircle
} from 'lucide-react';
import { formatCurrency } from '../utils/format';
import { PageHeader } from './PageHeader';

export function Dashboard({ data }: { data: ReturnType<typeof useCommitteeData> }) {
  const { navigate, openDrawer } = useNavigation();
  const { t } = useLanguage();
  const stats = data.getStats();
  
  const chandaData = useChandaData();
  const chandaStats = chandaData.getChandaStats();

  const expenseData = useExpenseData();
  const expenseStats = expenseData.getExpenseStats();

  // Calculate today's collection dynamically
  const today = new Date().toISOString().split('T')[0];
  const todayCollection = data.transactions
    .filter(t => (t.type === 'DEPOSIT' || t.type === 'DEPOSIT_PAYMENT') && t.date === today)
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const todayChandaCollection = chandaData.chandas
    .filter(c => c.date === today && c.status === 'PAID')
    .reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  const totalTodayCollection = todayCollection + todayChandaCollection;

  // ✅ CORRECT Bank Balance formula:
  // Total physical money IN  = Deposits (cash only) + DEPOSIT_PAYMENT + Chanda received
  // Total physical money OUT = Expense cash paid + Expense credit paid (via payments)
  const totalDepositsIn = data.transactions
    .filter(t =>
      (t.type === 'DEPOSIT' && t.paymentMethod !== 'CREDIT') ||
      t.type === 'DEPOSIT_PAYMENT'
    )
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const totalBankBalance = Math.max(0,
    totalDepositsIn + chandaStats.totalReceived - expenseStats.totalPaid
  );

  // Total System Collection = all money that came in (including credit pending)
  const totalSystemCollection = stats.totalDeposit + chandaStats.totalReceived;

  const monthlyCollection = data.transactions
    .filter(t => t.type === 'DEPOSIT' && t.category === 'मासिक जमा')
    .reduce((sum, t) => sum + t.amount, 0);

  const yearlyCollection = data.transactions
    .filter(t => t.type === 'DEPOSIT' && t.category === 'वार्षिक जमा')
    .reduce((sum, t) => sum + t.amount, 0);

  const [activeCard, setActiveCard] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollPosition = carouselRef.current.scrollLeft;
      const cardWidth = carouselRef.current.offsetWidth;
      const newIndex = Math.round(scrollPosition / cardWidth);
      if (newIndex !== activeCard && newIndex >= 0 && newIndex < 5) {
        setActiveCard(newIndex);
      }
    }
  };

  return (
    <div className="flex flex-col relative pb-[100px] min-h-screen bg-[#FFF8F3]">
      {/* TOP DASHBOARD CAROUSEL */}
      <div className="pt-8 relative z-20">
         <div 
           ref={carouselRef}
           onScroll={handleScroll}
           className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 gap-4 pb-2"
           style={{ scrollBehavior: 'smooth' }}
         >
            {/* Card 1 (Green - Bank Balance) */}
            <div className="min-w-[92vw] snap-center bg-[linear-gradient(135deg,#0F9D58_0%,#18B96B_50%,#2ECC71_100%)] rounded-[30px] p-6 text-white shadow-[0_8px_32px_rgba(15,157,88,0.3),inset_0_1px_1px_rgba(255,255,255,0.5)] border border-white/20 relative overflow-hidden flex flex-col justify-between">
               <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
               <div className="absolute left-[-10%] top-[-10%] w-1/2 h-1/2 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
               <div className="absolute right-[-10px] bottom-[-10px] w-32 h-32 bg-[#0B8043]/50 rounded-full blur-2xl pointer-events-none"></div>
               
               <div>
                 <div className="flex justify-between items-start mb-2">
                   <p className="text-[14px] font-semibold opacity-90">{t('bankBalance')}</p>
                   <div className="w-9 h-7 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                     <Building2 className="w-4 h-4 text-white" />
                   </div>
                 </div>
                 <h3 className="text-[32px] font-bold tracking-wider mb-4">{formatCurrency(totalBankBalance)}</h3>
               </div>

               <div className="mt-auto relative z-10 flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-white/20 pb-3">
                    <p className="text-[12px] font-medium opacity-90">{t('todayCollection')}</p>
                    <p className="text-[14px] font-bold">+{formatCurrency(totalTodayCollection)}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[12px] font-medium opacity-90">{t('todayExpense')}</p>
                    <p className="text-[14px] font-bold">-{formatCurrency(expenseStats.todayExpense || 0)}</p>
                  </div>
               </div>
            </div>

            {/* Card 2 (Purple - Total Collection) */}
            <div className="min-w-[92vw] snap-center bg-[linear-gradient(135deg,#5B2EFF_0%,#6F42FF_50%,#7B52FF_100%)] rounded-[30px] p-6 text-white shadow-[0_8px_32px_rgba(91,46,255,0.3),inset_0_1px_1px_rgba(255,255,255,0.5)] border border-white/20 relative overflow-hidden flex flex-col justify-between">
               <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
               <div className="absolute left-[-10%] top-[-10%] w-1/2 h-1/2 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
               <div className="absolute right-[-20px] bottom-[-20px] w-32 h-32 bg-[#4A24E8]/50 rounded-full blur-2xl pointer-events-none"></div>
               
               <div>
                 <div className="flex justify-between items-start mb-2">
                   <p className="text-[14px] font-semibold opacity-90">{t('totalCollection')}</p>
                   <div className="w-9 h-7 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                     <WalletCards className="w-4 h-4 text-white" />
                   </div>
                 </div>
                 <h3 className="text-[32px] font-bold tracking-wider mb-1">{formatCurrency(totalSystemCollection)}</h3>

                 <div className="flex items-center justify-between mt-2 mb-6">
                    <p className="text-[12px] font-medium opacity-90">{t('appName')}</p>
                    <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                       <span className="text-[10px] font-semibold">{t('thisMonth')}</span>
                       <ArrowUpRight className="w-3 h-3" />
                    </div>
                 </div>
               </div>

               <div className="flex justify-between items-center gap-2 border-t border-white/20 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                       <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] opacity-80 font-medium">{t('totalMembers')}</p>
                      <p className="text-[14px] font-bold">{data.members.length}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                       <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] opacity-80 font-medium">{t('avgDeposit')}</p>
                      <p className="text-[14px] font-bold">{formatCurrency(data.members.length > 0 ? stats.totalDeposit / data.members.length : 0)}</p>
                    </div>
                  </div>
               </div>
            </div>

            {/* Card 3 (Collection Breakdown - Blue) */}
            <div className="min-w-[92vw] snap-center bg-[linear-gradient(135deg,#1E3A8A_0%,#3B82F6_50%,#60A5FA_100%)] rounded-[30px] p-6 text-white shadow-[0_8px_32px_rgba(59,130,246,0.3),inset_0_1px_1px_rgba(255,255,255,0.5)] border border-white/20 relative overflow-hidden flex flex-col justify-between">
               <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
               <div className="absolute right-[-10px] bottom-[-10px] w-24 h-24 bg-[#1E3A8A]/50 rounded-full blur-2xl pointer-events-none"></div>
               
               <div className="flex justify-between items-start mb-4 relative z-10">
                  <p className="text-[14px] font-semibold opacity-90">जमा विवरण (Collection Info)</p>
                  <div className="w-9 h-7 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                     <WalletCards className="w-4 h-4 text-white" />
                  </div>
               </div>

               <div className="flex flex-col gap-3 relative z-10">
                  <div className="flex justify-between items-center px-1">
                    <p className="text-[13px] font-medium opacity-90">मासिक जमा (Monthly)</p>
                    <p className="text-[18px] font-bold">{formatCurrency(monthlyCollection)}</p>
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <p className="text-[13px] font-medium opacity-90">वार्षिक जमा (Yearly)</p>
                    <p className="text-[18px] font-bold">{formatCurrency(yearlyCollection)}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 text-amber-200">
                    <p className="text-[13px] font-medium opacity-90">बाकी चंदा (Pending)</p>
                    <p className="text-[18px] font-bold">{formatCurrency(stats.outstandingDeposit + chandaStats.outstandingCredit)}</p>
                  </div>
               </div>

               <div className="mt-4 pt-4 border-t border-white/20 relative z-10">
                  <p className="text-[12px] opacity-80 font-medium mb-1">कुल जमा (Total Collection)</p>
                  <h3 className="text-[28px] font-bold tracking-wider">{formatCurrency(monthlyCollection + yearlyCollection)}</h3>
               </div>
            </div>

            {/* Card 4 (Pink/Red - Monthly Update) */}
            <div className="min-w-[92vw] snap-center bg-[linear-gradient(135deg,#D32F2F_0%,#E53935_50%,#FF6B6B_100%)] rounded-[30px] p-6 text-white shadow-[0_8px_32px_rgba(211,47,47,0.3),inset_0_1px_1px_rgba(255,255,255,0.5)] border border-white/20 relative overflow-hidden flex flex-col justify-between">
               <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
               <div className="absolute left-[-10%] top-[-10%] w-1/2 h-1/2 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
               <div className="absolute right-[-10px] bottom-[-10px] w-20 h-20 bg-[#B71C1C]/50 rounded-full blur-2xl pointer-events-none"></div>
               
               <div className="flex justify-between items-start mb-4 relative z-10">
                  <div>
                     <p className="text-[14px] font-semibold opacity-90">{t('monthlyUpdate')}</p>
                     <p className="text-[12px] font-bold mt-1 opacity-80">{t('july2025')}</p>
                  </div>
                  <div className="w-9 h-7 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                     <Calendar className="w-4 h-4 text-white" />
                  </div>
               </div>

               <div className="mt-auto relative z-10 flex flex-col gap-4">
                  <div className="flex justify-between items-center px-1">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><ArrowDownCircle className="w-4 h-4 text-white" /></div>
                       <p className="text-[12px] font-medium opacity-90">{t('monthlyDeposit')}</p>
                    </div>
                    <p className="text-[18px] font-bold">{formatCurrency(stats.totalDeposit)}</p>
                  </div>
                  
                  <div className="flex justify-between items-center px-1">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><ArrowUpCircle className="w-4 h-4 text-white" /></div>
                       <p className="text-[12px] font-medium opacity-90">{t('monthlyExpense')}</p>
                    </div>
                    <p className="text-[18px] font-bold">{formatCurrency(expenseStats.totalPaid)}</p>
                  </div>
               </div>
            </div>

            {/* Card 5 (Orange) */}
            <div className="min-w-[92vw] snap-center bg-theme-gradient rounded-[30px] p-6 text-white shadow-[0_8px_32px_rgba(255,106,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.5)] border border-white/20 relative overflow-hidden flex flex-col justify-between">
               <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
               <div className="absolute left-[-10%] top-[-10%] w-1/2 h-1/2 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
               <div className="absolute right-[-10px] bottom-[-10px] w-20 h-20 bg-[#E65100]/50 rounded-full blur-2xl pointer-events-none"></div>
               
               <div className="flex justify-between items-start mb-4 relative z-10">
                  <div>
                     <p className="text-[14px] font-semibold opacity-90">{t('loanInfo')}</p>
                  </div>
                  <div className="w-9 h-7 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                     <Banknote className="w-4 h-4 text-white" />
                  </div>
               </div>

               <div className="mt-auto relative z-10 flex flex-col gap-4">
                  <div className="flex justify-between items-center px-1">
                    <p className="text-[12px] font-medium opacity-90">{t('totalLoan')}</p>
                    <p className="text-[16px] font-bold">{formatCurrency(0)}</p>
                  </div>
                  
                  <div className="flex justify-between items-center px-2">
                    <p className="text-[12px] font-medium opacity-90">{t('pendingEmi')}</p>
                    <p className="text-[14px] font-bold">{formatCurrency(0)}</p>
                  </div>
                  
                  <div className="flex justify-between items-center px-2">
                    <p className="text-[12px] font-medium opacity-90">{t('interest')}</p>
                    <p className="text-[14px] font-bold">{formatCurrency(0)}</p>
                  </div>
               </div>
            </div>

         </div>

          {/* Carousel Dots */}
         <div className="flex justify-center gap-2 mt-4 mb-6">
            {[0, 1, 2, 3, 4].map((idx) => (
              <div 
                key={idx} 
                className={`h-2 rounded-full transition-all duration-300 ${activeCard === idx ? 'w-6 bg-theme-gradient' : 'w-2 bg-slate-200'}`}
              />
            ))}
         </div>
      </div>

      {/* 3. MENU GRID */}
      <div className="px-5 mt-8">
         <div className="grid grid-cols-5 gap-y-7 gap-x-2">
           {[
             { icon: Users, label: t('menuMembers'), color: 'text-theme-primary', bg: 'bg-orange-50', route: 'members' as const },
             { icon: Landmark, label: t('menuCollection'), color: 'text-[#2ECC71]', bg: 'bg-green-50', route: 'collection' as const },
             { icon: WalletCards, label: t('menuBank'), color: 'text-[#3B82F6]', bg: 'bg-blue-50', route: 'bank' as const },
             { icon: Receipt, label: t('menuExpense'), color: 'text-[#FF5FA2]', bg: 'bg-pink-50', route: 'expense' as const },
             { icon: HandCoins, label: 'चंदा (New)', color: 'text-[#FF5A5F]', bg: 'bg-red-50', route: 'chanda' as const },
             { icon: Target, label: t('menuBudget'), color: 'text-[#7357FF]', bg: 'bg-purple-50', route: 'budget' as const },
             { icon: Building2, label: 'सेविंग', color: 'text-[#20B2AA]', bg: 'bg-teal-50', route: 'monthly_savings' as const },
             { icon: BarChart3, label: t('menuReports'), color: 'text-[#2ECC71]', bg: 'bg-emerald-50', route: 'reports' as const },
             { icon: Calendar, label: t('menuEvents'), color: 'text-[#F59E0B]', bg: 'bg-amber-50', route: 'events' as const },
             { icon: Megaphone, label: t('menuNotice'), color: 'text-[#8B5CF6]', bg: 'bg-violet-50', route: 'notice' as const },
           ].map((item, i) => (
             <div key={i} onClick={() => navigate(item.route)} className="flex flex-col items-center gap-2 cursor-pointer active:scale-90 transition-transform">
               <div className={`w-13 h-13 rounded-[18px] ${item.bg} flex items-center justify-center p-3.5 shadow-sm border border-white`}>
                 <item.icon className={`w-6 h-6 ${item.color}`} strokeWidth={2.5} />
               </div>
               <span className="text-[11px] font-bold text-[#555555] tracking-wide mt-0.5">{item.label}</span>
             </div>
           ))}
         </div>
      </div>


      {/* 5. MAIN ACTIONS */}
      <div className="px-5 mt-8 mb-8">
         <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="text-[16px] font-bold text-[#333333] drop-shadow-sm">{t('mainActivities')}</h3>
         </div>
         <div className="grid grid-cols-4 gap-4">
            <div onClick={() => navigate('members?action=add')} className="flex flex-col items-center justify-center gap-2.5 cursor-pointer active:scale-95 transition-all">
               <div className="w-[60px] h-[60px] rounded-[20px] bg-green-50 border border-green-100 flex items-center justify-center shadow-sm">
                  <UserPlus className="w-7 h-7 text-[#2ECC71]" strokeWidth={2.5} />
               </div>
               <span className="text-[11px] font-bold text-[#555555] text-center">{t('addMember')}</span>
            </div>
            
            <div onClick={() => navigate('deposit')} className="flex flex-col items-center justify-center gap-2.5 cursor-pointer active:scale-95 transition-all">
               <div className="w-[60px] h-[60px] rounded-[20px] bg-blue-50 border border-blue-100 flex items-center justify-center shadow-sm">
                  <ArrowDownCircle className="w-7 h-7 text-[#3B82F6]" strokeWidth={2.5} />
               </div>
               <span className="text-[11px] font-bold text-[#555555] text-center">{t('addDeposit')}</span>
            </div>

            <div onClick={() => navigate('expense?action=add')} className="flex flex-col items-center justify-center gap-2.5 cursor-pointer active:scale-95 transition-all">
               <div className="w-[60px] h-[60px] rounded-[20px] bg-pink-50 border border-pink-100 flex items-center justify-center shadow-sm">
                  <ArrowUpCircle className="w-7 h-7 text-[#FF5FA2]" strokeWidth={2.5} />
               </div>
               <span className="text-[11px] font-bold text-[#555555] text-center">{t('addExpense')}</span>
            </div>

            <div onClick={() => navigate('reports')} className="flex flex-col items-center justify-center gap-2.5 cursor-pointer active:scale-95 transition-all">
               <div className="w-[60px] h-[60px] rounded-[20px] bg-purple-50 border border-purple-100 flex items-center justify-center shadow-sm">
                  <FileText className="w-7 h-7 text-[#7357FF]" strokeWidth={2.5} />
               </div>
               <span className="text-[11px] font-bold text-[#555555] text-center">{t('viewReports')}</span>
            </div>
         </div>
      </div>
      
    </div>
  );
}
