import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ArrowLeft, Camera, Download, Share2, Edit, 
  Wallet, PiggyBank, Sparkles, TrendingUp,
  CheckCircle2, Clock, User, ChevronDown, FileText, Calendar
} from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { useCommitteeData } from '../hooks/useCommitteeData';
import { formatCurrency } from '../utils/format';
import { FullScreenImageViewer } from '../components/FullScreenImageViewer';
import { StorageImage } from '../components/StorageImage';

const MONTHS = [
  'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितम्बर', 
  'अक्टूबर', 'नवंबर', 'दिसंबर', 'जनवरी', 'फरवरी', 'मार्च'
];

export function MemberProfileScreen() {
  const { id } = useParams<{ id: string }>();
  const { goBack, navigate } = useNavigation();
  const { members, transactions } = useCommitteeData();
  const [viewerFileId, setViewerFileId] = useState<string | null>(null);
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);

  const member = members.find(m => m.id === id);

  const memberTransactions = useMemo(() => 
    transactions.filter(t => t && typeof t === 'object' && t.memberId === id)
  , [transactions, id]);

  const stats = useMemo(() => {
    let totalCollection = 0;
    let ganeshChaturthi = 0;
    let ganeshDepositDate = '';
    
    // Group monthly deposits
    const monthlyData: Record<string, number> = {};
    MONTHS.forEach(m => monthlyData[m] = 0);

    memberTransactions.forEach(t => {
      if (t.type === 'DEPOSIT') {
        totalCollection += t.amount;
        
        if (t.category === 'वार्षिक जमा' || (t.description && t.description.includes('गणेश चतुर्थी'))) {
          ganeshChaturthi += t.amount;
          ganeshDepositDate = t.date;
        } else if (t.category === 'मासिक जमा') {
          const date = new Date(t.date);
          const jsMonth = date.getMonth(); 
          if (!isNaN(jsMonth)) {
            const monthIndex = jsMonth >= 3 ? jsMonth - 3 : jsMonth + 9;
            const monthName = MONTHS[monthIndex];
            if (monthlyData[monthName] !== undefined) {
              monthlyData[monthName] += t.amount;
            }
          }
        }
      }
    });

    const savingBalance = totalCollection - ganeshChaturthi;
    const totalBalance = totalCollection; 
    const totalMonthlyDeposit = Object.values(monthlyData).reduce((a,b) => a+b, 0);

    let paidMonthsCount = 0;
    MONTHS.forEach(m => {
      if (monthlyData[m] > 0) paidMonthsCount++;
    });

    return { totalCollection, ganeshChaturthi, ganeshDepositDate, savingBalance, totalBalance, monthlyData, totalMonthlyDeposit, paidMonthsCount };
  }, [memberTransactions]);

  if (!member) {
    return (
      <div className="flex flex-col h-full bg-[#FAFAFA] items-center justify-center">
        <p className="text-slate-500">सदस्य नहीं मिला (Member not found)</p>
        <button onClick={goBack} className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-full">Go Back</button>
      </div>
    );
  }

  const yearlyTarget = 30000;
  const yearlyRemaining = Math.max(0, yearlyTarget - stats.totalMonthlyDeposit);

  return (
    <div className="flex flex-col h-[100dvh] bg-[#FAFAFA] overflow-y-auto pb-28 relative">
      
      {/* HEADER GRADIENT (Behind Profile Card) */}
      <div 
        className="h-[220px] shrink-0 px-5 pt-8 flex items-start justify-between relative z-10 rounded-b-[40px] shadow-[0_4px_30px_rgba(248,78,2,0.3)]"
        style={{ background: 'linear-gradient(135deg, #F84E02 0%, #FF6508 30%, #FF7A0A 70%, #FF8C1A 100%)' }}
      >
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md active:scale-90 transition-transform border border-white/30 z-20">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-white text-[18px] font-bold tracking-wide drop-shadow-md z-20 mt-2">Member Profile</h1>
        <div className="flex gap-3 z-20">
          <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md active:scale-90 transition-transform border border-white/30">
            <Share2 className="w-5 h-5 text-white" />
          </button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-48 h-48 bg-white/20 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      <div className="px-5 -mt-24 relative z-20">
        {/* FLOATING PROFILE CARD */}
        <div className="bg-white/90 backdrop-blur-xl border border-white rounded-[28px] shadow-[0_16px_40px_rgba(0,0,0,0.08)] p-6 flex flex-col items-center">
          
          <div className="relative -mt-16 mb-4">
            <div 
              className="w-[110px] h-[110px] rounded-full border-[4px] border-white shadow-[0_8px_25px_rgba(248,78,2,0.15)] bg-slate-50 flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={() => {
                if (member.profilePhoto) {
                  setViewerFileId(member.profilePhoto);
                } else if (member.photo) {
                  setViewerFileId(member.photo);
                }
              }}
            >
              <StorageImage
                fileId={member.profilePhoto}
                fallbackBase64={member.photo}
                fallbackIcon={<User className="w-12 h-12 text-slate-300" />}
                className="w-full h-full object-cover"
                alt={member.name}
              />
            </div>
            <button className="absolute bottom-1 right-1 w-8 h-8 bg-[#FF6508] rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm active:scale-90 transition-transform">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-[24px] font-extrabold text-slate-800 leading-tight mb-2 text-center">{member.name}</h2>
          
          <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
            <span className="text-[11px] font-extrabold text-[#FF6508] bg-[#FF6508]/10 px-3 py-1 rounded-full uppercase tracking-wider">{member.id.substring(0,6)}</span>
            <span className="text-[11px] font-extrabold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">{member.role || 'Member'}</span>
            <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Active
            </span>
          </div>
          
          <div className="w-full grid grid-cols-2 gap-4 border-t border-slate-100 pt-5">
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-slate-400 mb-0.5">Mobile Number</span>
              <span className="text-[13px] font-bold text-slate-700">{member.phone}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[11px] font-semibold text-slate-400 mb-0.5">Joining Date</span>
              <span className="text-[13px] font-bold text-slate-700">{member.joinedAt ? new Date(member.joinedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'N/A'}</span>
            </div>
            <div className="flex flex-col col-span-2">
              <span className="text-[11px] font-semibold text-slate-400 mb-0.5">Address</span>
              <span className="text-[13px] font-bold text-slate-700 leading-snug">{member.address || 'N/A'}</span>
            </div>
          </div>

        </div>
      </div>

      <div className="px-5 mt-6 space-y-6">
        
        {/* QUICK SUMMARY CARDS */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[24px] p-5 text-white shadow-[0_8px_24px_rgba(248,78,2,0.25)] relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #F84E02 0%, #FF8C1A 100%)' }}>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
            <Wallet className="w-6 h-6 text-white/90 mb-3" />
            <p className="text-[12px] font-medium opacity-90 mb-0.5">Total Deposit</p>
            <p className="text-[20px] font-extrabold">{formatCurrency(stats.totalCollection)}</p>
          </div>
          
          <div className="rounded-[24px] p-5 text-white shadow-[0_8px_24px_rgba(16,185,129,0.25)] relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #059669 0%, #34D399 100%)' }}>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
            <PiggyBank className="w-6 h-6 text-white/90 mb-3" />
            <p className="text-[12px] font-medium opacity-90 mb-0.5">Saving Balance</p>
            <p className="text-[20px] font-extrabold">{formatCurrency(stats.savingBalance)}</p>
          </div>
          
          <div className="rounded-[24px] p-5 text-white shadow-[0_8px_24px_rgba(139,92,246,0.25)] relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)' }}>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
            <Sparkles className="w-6 h-6 text-white/90 mb-3" />
            <p className="text-[12px] font-medium opacity-90 mb-0.5">Chaturthi Fund</p>
            <p className="text-[20px] font-extrabold">{formatCurrency(stats.ganeshChaturthi)}</p>
          </div>
          
          <div className="rounded-[24px] p-5 text-white shadow-[0_8px_24px_rgba(59,130,246,0.25)] relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2563EB 0%, #60A5FA 100%)' }}>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
            <TrendingUp className="w-6 h-6 text-white/90 mb-3" />
            <p className="text-[12px] font-medium opacity-90 mb-0.5">Total Collection</p>
            <p className="text-[20px] font-extrabold">{formatCurrency(stats.totalBalance)}</p>
          </div>
        </div>

        {/* MONTHLY SAVING LIST */}
        <div className="bg-white rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50">
           <div className="flex items-center justify-between mb-5">
             <h3 className="text-[16px] font-extrabold text-slate-800">Monthly Saving</h3>
             <span className="text-[12px] font-bold text-[#FF6508] bg-[#FF6508]/10 px-3 py-1 rounded-full">{stats.paidMonthsCount} / 12 Paid</span>
           </div>
           
           <div className="w-full h-2 bg-slate-100 rounded-full mb-5 overflow-hidden">
             <div 
               className="h-full bg-gradient-to-r from-[#F84E02] to-[#FF8C1A] rounded-full transition-all duration-1000"
               style={{ width: `${(stats.paidMonthsCount / 12) * 100}%` }}
             ></div>
           </div>

           <div className="grid grid-cols-2 gap-x-4 gap-y-3">
             {MONTHS.map((month) => {
               const amount = stats.monthlyData[month];
               const isPaid = amount > 0;
               return (
                 <div key={month} className="flex items-center justify-between p-2.5 rounded-2xl border border-slate-50 bg-slate-50/50">
                    <span className="text-[13px] font-bold text-slate-700">{month}</span>
                    {isPaid ? (
                      <div className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-extrabold uppercase tracking-wider">Paid</span>
                      </div>
                    ) : (
                      <div className="bg-rose-50 text-rose-500 px-2.5 py-1 rounded-lg flex items-center gap-1 border border-rose-100">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-extrabold uppercase tracking-wider">Pending</span>
                      </div>
                    )}
                 </div>
               );
             })}
           </div>
        </div>

        {/* YEARLY SAVING CARD */}
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[28px] p-6 text-white shadow-[0_12px_30px_rgba(99,102,241,0.3)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-bl-full pointer-events-none"></div>
          <h3 className="text-[16px] font-extrabold mb-5 relative z-10">Yearly Saving</h3>
          
          <div className="flex items-end justify-between relative z-10 mb-5 border-b border-white/20 pb-5">
            <div>
              <p className="text-[12px] font-medium text-indigo-100 mb-1">Deposited</p>
              <p className="text-[28px] font-black tracking-tight">{formatCurrency(stats.totalMonthlyDeposit)}</p>
            </div>
            <div className="text-right">
              <p className="text-[12px] font-medium text-indigo-100 mb-1">Target</p>
              <p className="text-[16px] font-bold">{formatCurrency(yearlyTarget)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between relative z-10">
            <span className="text-[13px] font-medium text-indigo-100">Remaining Amount</span>
            <span className="text-[15px] font-extrabold bg-white text-indigo-600 px-4 py-1.5 rounded-full shadow-sm">{formatCurrency(yearlyRemaining)}</span>
          </div>
        </div>

        {/* GANESH CHATURTHI FUND */}
        <div className="bg-white rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-[100px] pointer-events-none"></div>
          <h3 className="text-[16px] font-extrabold text-slate-800 mb-4 relative z-10">Ganesh Chaturthi Fund</h3>
          
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-[12px] text-slate-400 mb-1 font-medium">Total Amount</p>
              <p className="text-[24px] font-black text-slate-800">{formatCurrency(stats.ganeshChaturthi)}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[11px] text-slate-400 mb-1.5 font-medium">Status</span>
              {stats.ganeshChaturthi > 0 ? (
                <div className="bg-emerald-100 text-emerald-700 px-3.5 py-1.5 rounded-xl flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-[11px] font-extrabold uppercase tracking-wider">Paid</span>
                </div>
              ) : (
                <div className="bg-rose-50 text-rose-500 px-3.5 py-1.5 rounded-xl flex items-center gap-1 border border-rose-100">
                  <Clock className="w-4 h-4" />
                  <span className="text-[11px] font-extrabold uppercase tracking-wider">Pending</span>
                </div>
              )}
            </div>
          </div>
          {stats.ganeshDepositDate && (
             <div className="mt-4 pt-4 border-t border-slate-100 relative z-10">
               <p className="text-[12px] font-medium text-slate-500 flex items-center gap-2">
                 <Calendar className="w-4 h-4 text-slate-400" /> 
                 Last Deposit: <span className="font-bold text-slate-700">{new Date(stats.ganeshDepositDate).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric'})}</span>
               </p>
             </div>
          )}
        </div>

        {/* RECENT TRANSACTIONS */}
        <div className="bg-white rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50">
          <h3 className="text-[16px] font-extrabold text-slate-800 mb-5">Recent Transactions</h3>
          {memberTransactions.length === 0 ? (
            <div className="text-center py-6 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[13px] font-semibold text-slate-400">No transactions yet.</p>
            </div>
          ) : (
            <div className="relative border-l-[3px] border-slate-100 ml-4 space-y-6">
              {memberTransactions.slice().reverse().slice(0, 5).map((t) => (
                <div key={t.id} className="relative pl-6">
                  <div className={`absolute -left-[14px] top-1 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center ${t.type === 'DEPOSIT' ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[14px] font-bold text-slate-800">{t.category}</p>
                      <p className="text-[11px] font-semibold text-slate-400 mt-1">
                        {t.date && !isNaN(new Date(t.date).getTime()) 
                          ? new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                          : 'N/A'
                        }
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-[15px] font-black ${t.type === 'DEPOSIT' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {t.type === 'DEPOSIT' ? '+' : '-'}{formatCurrency(t.amount)}
                      </p>
                      <p className="text-[10px] font-extrabold text-slate-400 mt-1 uppercase tracking-wider">Completed</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MEMBER INFORMATION (COLLAPSIBLE) */}
        <div className="bg-white rounded-[28px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50 overflow-hidden mb-6">
          <button 
            onClick={() => setIsInfoExpanded(!isInfoExpanded)}
            className="w-full p-6 flex items-center justify-between bg-white active:bg-slate-50 transition-colors"
          >
            <h3 className="text-[16px] font-extrabold text-slate-800">Member Information</h3>
            <div className={`w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center transition-transform duration-300 ${isInfoExpanded ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-5 h-5 text-slate-400" />
            </div>
          </button>
          
          <div className={`px-6 overflow-hidden transition-all duration-300 ${isInfoExpanded ? 'max-h-[500px] pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
             <div className="grid grid-cols-2 gap-y-4 gap-x-2 pt-2 border-t border-slate-100">
               <div>
                 <span className="text-[11px] font-semibold text-slate-400 block mb-1">Father's Name</span>
                 <span className="text-[13px] font-bold text-slate-800">{member.fatherName || 'N/A'}</span>
               </div>
               <div>
                 <span className="text-[11px] font-semibold text-slate-400 block mb-1">Age</span>
                 <span className="text-[13px] font-bold text-slate-800">{member.age || 'N/A'}</span>
               </div>
               <div>
                 <span className="text-[11px] font-semibold text-slate-400 block mb-1">Blood Group</span>
                 <span className="text-[13px] font-bold text-slate-800">{member.bloodGroup || 'N/A'}</span>
               </div>
               <div>
                 <span className="text-[11px] font-semibold text-slate-400 block mb-1">Occupation</span>
                 <span className="text-[13px] font-bold text-slate-800">N/A</span> {/* Add occupation if available in type */}
               </div>
               <div className="col-span-2">
                 <span className="text-[11px] font-semibold text-slate-400 block mb-1">Aadhaar Number</span>
                 <span className="text-[13px] font-bold text-slate-800">{member.aadhaar || 'N/A'}</span>
               </div>
             </div>

             {/* Documents */}
             {(member.aadhaarPhoto || member.panPhoto) && (
               <div className="mt-5 pt-5 border-t border-slate-100">
                 <span className="text-[12px] font-bold text-slate-800 block mb-3">Documents</span>
                 <div className="flex gap-3">
                   {member.aadhaarPhoto && (
                     <button 
                       onClick={() => setViewerFileId(member.aadhaarPhoto!)}
                       className="flex-1 bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                     >
                       <FileText className="w-4 h-4 text-blue-500" />
                       <span className="text-[12px] font-bold text-slate-600">Aadhaar</span>
                     </button>
                   )}
                   {member.panPhoto && (
                     <button 
                       onClick={() => setViewerFileId(member.panPhoto!)}
                       className="flex-1 bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                     >
                       <FileText className="w-4 h-4 text-amber-500" />
                       <span className="text-[12px] font-bold text-slate-600">PAN</span>
                     </button>
                   )}
                 </div>
               </div>
             )}
          </div>
        </div>

      </div>

      {viewerFileId && (
        <FullScreenImageViewer 
          fileId={viewerFileId} 
          onClose={() => setViewerFileId(null)} 
          title="Document Preview"
        />
      )}

      {/* STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-slate-100 p-4 pb-6 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
         <div className="flex gap-2 max-w-md mx-auto">
           <button className="flex-1 bg-slate-50 border border-slate-200 text-slate-700 font-bold text-[11px] uppercase tracking-wider rounded-xl py-3.5 flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-transform">
             <Edit className="w-4 h-4 text-slate-500" />
             Edit
           </button>
           <button 
              onClick={() => navigate('deposit')}
              className="flex-[1.2] bg-gradient-to-r from-[#F84E02] to-[#FF8C1A] text-white font-bold text-[11px] uppercase tracking-wider rounded-xl py-3.5 flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-transform shadow-[0_8px_20px_rgba(248,78,2,0.3)]"
           >
             <PiggyBank className="w-4 h-4" />
             Deposit
           </button>
           <button className="flex-1 bg-slate-50 border border-slate-200 text-slate-700 font-bold text-[11px] uppercase tracking-wider rounded-xl py-3.5 flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-transform">
             <FileText className="w-4 h-4 text-slate-500" />
             Ledger
           </button>
           <button className="flex-1 bg-slate-50 border border-slate-200 text-slate-700 font-bold text-[11px] uppercase tracking-wider rounded-xl py-3.5 flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-transform">
             <Download className="w-4 h-4 text-slate-500" />
             Card
           </button>
         </div>
      </div>
      
    </div>
  );
}
