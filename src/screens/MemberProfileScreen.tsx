import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ArrowLeft, Camera, Download, Share2, Edit, 
  Wallet, PiggyBank, Sparkles, TrendingUp,
  CheckCircle2, Clock, User
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
  const { goBack } = useNavigation();
  const { members, transactions } = useCommitteeData();
  const [viewerFileId, setViewerFileId] = React.useState<string | null>(null);

  const member = members.find(m => m.id === id);

  const memberTransactions = useMemo(() => 
    transactions.filter(t => t && typeof t === 'object' && t.memberId === id)
  , [transactions, id]);

  const stats = useMemo(() => {
    let totalCollection = 0;
    let ganeshChaturthi = 0;
    
    // Group monthly deposits
    const monthlyData: Record<string, number> = {};
    MONTHS.forEach(m => monthlyData[m] = 0);

    memberTransactions.forEach(t => {
      if (t.type === 'DEPOSIT') {
        totalCollection += t.amount;
        
        if (t.category === 'वार्षिक जमा' || (t.description && t.description.includes('गणेश चतुर्थी'))) {
          ganeshChaturthi += t.amount;
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
    const totalBalance = totalCollection; // As per instructions: Total Balance = Saving Account + Ganesh Chaturthi Amount
    const totalMonthlyDeposit = Object.values(monthlyData).reduce((a,b) => a+b, 0);

    return { totalCollection, ganeshChaturthi, savingBalance, totalBalance, monthlyData, totalMonthlyDeposit };
  }, [memberTransactions]);

  if (!member) {
    return (
      <div className="flex flex-col h-full bg-[#FFF8F1] items-center justify-center">
        <p className="text-slate-500">सदस्य नहीं मिला (Member not found)</p>
        <button onClick={goBack} className="mt-4 px-6 py-2 bg-theme-primary text-white rounded-full">Go Back</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] overflow-y-auto pb-8">
      
      {/* HEADER (90px) */}
      <div 
        className="h-[90px] shrink-0 rounded-b-[30px] px-5 flex items-center justify-between relative z-20 shadow-[0_4px_20px_rgba(248,78,2,0.2)]"
        style={{ background: 'linear-gradient(90deg, #F84E02 0%, #FF6508 30%, #FF7A0A 70%, #FF8C1A 100%)' }}
      >
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md active:scale-90 transition-transform border border-white/30">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-white text-lg font-bold tracking-wide drop-shadow-md">सदस्य प्रोफ़ाइल</h1>
        <div className="w-10 h-10 rounded-full bg-white p-1 shadow-sm">
          <img src="/logo.png" alt="Logo" className="w-full h-full object-cover rounded-full" />
        </div>
      </div>

      <div className="px-5 -mt-6 relative z-30 pb-4">
        {/* PROFILE CARD */}
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.08)] p-5 flex items-center gap-5">
          {/* LEFT: Photo */}
          <div className="relative shrink-0">
            <div 
              className="w-[90px] h-[90px] rounded-full border-[3px] border-white shadow-[0_8px_20px_rgba(248,78,2,0.15)] bg-slate-100 flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={() => {
                if (member.profilePhoto) {
                  setViewerFileId(member.profilePhoto);
                } else if (member.photo) {
                  setViewerFileId(member.photo); // fallback for old photo
                }
              }}
            >
              <StorageImage
                fileId={member.profilePhoto}
                fallbackBase64={member.photo}
                fallbackIcon={<User className="w-10 h-10 text-slate-300" />}
                className="w-full h-full object-cover"
                alt={member.name}
              />
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#FF6508] rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm active:scale-90 transition-transform">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* RIGHT: Details */}
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-[20px] font-extrabold text-slate-800 leading-tight mb-1">{member.name}</h2>
            <p className="text-[13px] font-bold text-[#FF6508] mb-3 bg-[#FF6508]/10 self-start px-2.5 py-0.5 rounded-md">{member.role || 'सदस्य'}</p>
            
            <div className="space-y-1.5">
              <div className="flex items-center text-[12px] text-slate-600 font-medium">
                <span className="w-14 text-slate-400">आयु</span>
                <span className="text-slate-800 font-semibold">{member.age || 'N/A'}</span>
              </div>
              <div className="flex items-center text-[12px] text-slate-600 font-medium">
                <span className="w-14 text-slate-400">मोबाइल</span>
                <span className="text-slate-800 font-semibold">{member.phone}</span>
              </div>
              <div className="flex items-start text-[12px] text-slate-600 font-medium">
                <span className="w-14 text-slate-400 mt-0.5">पता</span>
                <span className="text-slate-800 font-semibold flex-1 leading-snug">{member.address || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-6">
        {/* SUMMARY SECTION (2x2) */}
        <div className="grid grid-cols-2 gap-3">
          {/* Card 1 */}
          <div className="rounded-[20px] p-4 text-white shadow-[0_8px_24px_rgba(248,78,2,0.25)] relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #F84E02 0%, #FF8C1A 100%)' }}>
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/20 rounded-full blur-xl"></div>
            <Wallet className="w-5 h-5 text-white/80 mb-2" />
            <p className="text-[11px] font-medium opacity-90 mb-1">कुल जमा राशि</p>
            <p className="text-[18px] font-bold">{formatCurrency(stats.totalCollection)}</p>
          </div>
          {/* Card 2 */}
          <div className="rounded-[20px] p-4 text-white shadow-[0_8px_24px_rgba(16,185,129,0.25)] relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #059669 0%, #34D399 100%)' }}>
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/20 rounded-full blur-xl"></div>
            <PiggyBank className="w-5 h-5 text-white/80 mb-2" />
            <p className="text-[11px] font-medium opacity-90 mb-1">सेविंग अकाउंट बैलेंस</p>
            <p className="text-[18px] font-bold">{formatCurrency(stats.savingBalance)}</p>
          </div>
          {/* Card 3 */}
          <div className="rounded-[20px] p-4 text-white shadow-[0_8px_24px_rgba(139,92,246,0.25)] relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)' }}>
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/20 rounded-full blur-xl"></div>
            <Sparkles className="w-5 h-5 text-white/80 mb-2" />
            <p className="text-[11px] font-medium opacity-90 mb-1">गणेश चतुर्थी जमा</p>
            <p className="text-[18px] font-bold">{formatCurrency(stats.ganeshChaturthi)}</p>
          </div>
          {/* Card 4 */}
          <div className="rounded-[20px] p-4 text-white shadow-[0_8px_24px_rgba(59,130,246,0.25)] relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2563EB 0%, #60A5FA 100%)' }}>
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/20 rounded-full blur-xl"></div>
            <TrendingUp className="w-5 h-5 text-white/80 mb-2" />
            <p className="text-[11px] font-medium opacity-90 mb-1">कुल बैलेंस</p>
            <p className="text-[18px] font-bold">{formatCurrency(stats.totalBalance)}</p>
          </div>
        </div>

        {/* DOCUMENTS SECTION */}
        {(member.aadhaarPhoto || member.panPhoto) && (
          <div>
            <h3 className="text-[15px] font-bold text-slate-800 mb-3 ml-1">दस्तावेज़ (Documents)</h3>
            <div className="grid grid-cols-2 gap-3">
              {member.aadhaarPhoto && (
                <button 
                  onClick={() => setViewerFileId(member.aadhaarPhoto!)}
                  className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                    <Camera className="w-5 h-5" />
                  </div>
                  <span className="text-[12px] font-bold text-slate-600">Aadhaar Card</span>
                </button>
              )}
              {member.panPhoto && (
                <button 
                  onClick={() => setViewerFileId(member.panPhoto!)}
                  className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center">
                    <Camera className="w-5 h-5" />
                  </div>
                  <span className="text-[12px] font-bold text-slate-600">PAN Card</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* MONTHLY SAVING */}
        <div>
          <h3 className="text-[15px] font-bold text-slate-800 mb-3 ml-1">मासिक जमा राशि</h3>
          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-3 pb-2 -mx-5 px-5">
            {MONTHS.map((month, idx) => {
              const amount = stats.monthlyData[month];
              const isPaid = amount > 0;
              return (
                <div key={month} className="snap-start shrink-0 w-[100px] bg-white rounded-[20px] p-3 shadow-[0_4px_15px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col items-center justify-center text-center">
                  <p className="text-[12px] font-semibold text-slate-500 mb-1">{month}</p>
                  <p className={`text-[15px] font-bold ${isPaid ? 'text-[#059669]' : 'text-slate-300'}`}>
                    {isPaid ? formatCurrency(amount) : '₹0'}
                  </p>
                  <div className={`mt-2 w-5 h-5 rounded-full flex items-center justify-center ${isPaid ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-300'}`}>
                    {isPaid ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Total Yearly */}
          <div className="mt-3 bg-[#FF6508]/10 rounded-[16px] p-4 flex items-center justify-between border border-[#FF6508]/20">
            <span className="text-[13px] font-bold text-[#FF6508]">कुल वार्षिक जमा</span>
            <span className="text-[16px] font-extrabold text-[#FF6508]">{formatCurrency(stats.totalMonthlyDeposit)}</span>
          </div>
        </div>

        {/* GANESH CHATURTHI SAVING */}
        <div>
          <h3 className="text-[15px] font-bold text-slate-800 mb-3 ml-1">गणेश चतुर्थी निधि</h3>
          <div className="bg-white rounded-[24px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-[100px] -z-0"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-[13px] font-bold text-slate-500 mb-1">2026</p>
                <p className="text-[12px] text-slate-400 mb-1">जमा राशि</p>
                <p className="text-[24px] font-extrabold text-slate-800">{formatCurrency(stats.ganeshChaturthi)}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-400 mb-1">Status</span>
                {stats.ganeshChaturthi > 0 ? (
                  <div className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-bold">Paid</span>
                  </div>
                ) : (
                  <div className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-bold">Pending</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* TRANSACTION HISTORY */}
        <div>
          <h3 className="text-[15px] font-bold text-slate-800 mb-3 ml-1">हाल ही के लेन-देन</h3>
          <div className="bg-white rounded-[24px] p-2 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-50">
            {memberTransactions.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-6">कोई लेन-देन नहीं मिला (No transactions)</p>
            ) : (
              <div className="flex flex-col">
                {memberTransactions.slice().reverse().slice(0, 5).map((t, idx) => (
                  <div key={t.id} className={`flex items-center justify-between p-3 ${idx !== 0 ? 'border-t border-slate-100' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'DEPOSIT' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                        {t.type === 'DEPOSIT' ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 rotate-180" />}
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-slate-800">{t.category}</p>
                        <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                          {t.date && !isNaN(new Date(t.date).getTime()) 
                            ? new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                            : 'N/A'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-[14px] font-bold ${t.type === 'DEPOSIT' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {t.type === 'DEPOSIT' ? '+' : '-'}{formatCurrency(t.amount)}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1">Completed</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="flex flex-col gap-3 pt-2">
          <button className="w-full bg-white border border-slate-200 text-slate-700 font-bold text-[14px] rounded-2xl py-4 flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-sm">
            <Edit className="w-4 h-4" /> Edit Profile
          </button>
          <button className="w-full bg-white border border-slate-200 text-slate-700 font-bold text-[14px] rounded-2xl py-4 flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-sm">
            <Download className="w-4 h-4" /> Download Member Card
          </button>
          <button className="w-full bg-[#FF6508] text-white font-bold text-[14px] rounded-2xl py-4 flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-[0_8px_20px_rgba(248,78,2,0.3)] border border-[#FF6508]">
            <Share2 className="w-4 h-4" /> Share Member Card
          </button>
        </div>

      </div>

      {viewerFileId && (
        <FullScreenImageViewer 
          fileId={viewerFileId} 
          onClose={() => setViewerFileId(null)} 
          title="Document Preview"
        />
      )}
    </div>
  );
}
