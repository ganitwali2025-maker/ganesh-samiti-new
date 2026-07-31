import { useState, useMemo } from 'react';
import { PageHeader } from '../components/PageHeader';
import { useCommitteeData } from '../hooks/useCommitteeData';
import { formatCurrency } from '../utils/format';
import { getMonthlySavingStatus, MonthlyStatus } from '../utils/monthlySavings';
import { Building2, Calendar, CheckCircle2, Clock, AlertTriangle, AlertCircle, X, Receipt, Users } from 'lucide-react';

export function MonthlySavingsScreen() {
  const { members, transactions } = useCommitteeData();
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'MEMBERS' | 'REPORT'>('DASHBOARD');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [ledgerOpen, setLedgerOpen] = useState(false);

  const currentDate = new Date();
  const currentMonthIndex = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  // Get saving statuses for all members
  const memberSavings = useMemo(() => {
    return members.map(m => {
      const memberDeposits = transactions.filter(t => t.type === 'DEPOSIT' && t.category === 'मासिक जमा' && t.memberId === m.id);
      const statuses = getMonthlySavingStatus(memberDeposits, currentDate);
      return { member: m, statuses };
    });
  }, [members, transactions, currentDate]);

  // Dashboard Stats
  const currentMonthStats = useMemo(() => {
    let paidCount = 0;
    let pendingCount = 0;
    let collectedAmount = 0;
    let pendingAmount = 0;

    memberSavings.forEach(({ statuses }) => {
      const currentMonth = statuses[currentMonthIndex];
      if (currentMonth.status === 'PAID') {
        paidCount++;
        collectedAmount += 500;
      } else if (currentMonth.status === 'PENDING') {
        pendingCount++;
        pendingAmount += 500;
      }
    });

    return { paidCount, pendingCount, collectedAmount, pendingAmount };
  }, [memberSavings, currentMonthIndex]);

  // Monthly Report Stats (All 12 Months)
  const monthlyReport = useMemo(() => {
    const report = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 0; i < 12; i++) {
      let pCount = 0;
      let pendCount = 0;
      memberSavings.forEach(({ statuses }) => {
        if (statuses[i].status === 'PAID') pCount++;
        if (statuses[i].status === 'PENDING') pendCount++;
      });
      report.push({
        monthName: months[i],
        dueDate: `15 ${months[i]}`,
        paidMembers: pCount,
        pendingMembers: pendCount,
        collected: pCount * 500,
        pending: pendCount * 500,
      });
    }
    return report;
  }, [memberSavings]);

  const totalMembers = members.length;
  const collectionPercentage = totalMembers > 0 ? Math.round((currentMonthStats.paidCount / totalMembers) * 100) : 0;

  // Auto Notification Logic
  let alertMode = null;
  if (currentDay >= 10 && currentDay < 15) alertMode = 'REMINDER';
  else if (currentDay === 15) alertMode = 'DUE_TODAY';
  else if (currentDay > 15) alertMode = 'OVERDUE';

  return (
    <div className="flex flex-col h-[100dvh] bg-[#FAFAFA] font-['Plus_Jakarta_Sans',sans-serif]">
      <PageHeader title="मासिक सेविंग" subtitle="Yearly Savings Module" />

      {/* AUTO NOTIFICATION BANNER */}
      {alertMode && (
        <div className="px-4 pt-4 shrink-0">
          <div className={`p-4 rounded-2xl flex items-start gap-3 shadow-sm border ${
            alertMode === 'REMINDER' ? 'bg-amber-50 border-amber-200 text-amber-800' :
            alertMode === 'DUE_TODAY' ? 'bg-orange-50 border-orange-200 text-orange-800' :
            'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {alertMode === 'REMINDER' && <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />}
            {alertMode === 'DUE_TODAY' && <Clock className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />}
            {alertMode === 'OVERDUE' && <AlertCircle className="w-5 h-5 text-rose-500 mt-0.5 shrink-0" />}
            
            <div>
              <h4 className="font-bold text-[13px] leading-tight mb-1">
                {alertMode === 'REMINDER' ? 'Upcoming Due Reminder' :
                 alertMode === 'DUE_TODAY' ? "Today is the 15th! Due Date!" : 
                 "Payment Overdue!"}
              </h4>
              <p className="text-[11px] font-medium opacity-80">
                {alertMode === 'REMINDER' ? 'Monthly savings are due on the 15th.' :
                 alertMode === 'DUE_TODAY' ? 'Please collect pending savings today.' : 
                 `${currentMonthStats.pendingCount} members have not paid their monthly savings.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TABS */}
      <div className="px-4 py-4 shrink-0">
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button 
            onClick={() => setActiveTab('DASHBOARD')}
            className={`flex-1 py-2.5 text-[12px] font-bold rounded-xl transition-all ${activeTab === 'DASHBOARD' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500'}`}
          >
            DASHBOARD
          </button>
          <button 
            onClick={() => setActiveTab('MEMBERS')}
            className={`flex-1 py-2.5 text-[12px] font-bold rounded-xl transition-all ${activeTab === 'MEMBERS' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500'}`}
          >
            MEMBERS
          </button>
          <button 
            onClick={() => setActiveTab('REPORT')}
            className={`flex-1 py-2.5 text-[12px] font-bold rounded-xl transition-all ${activeTab === 'REPORT' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500'}`}
          >
            REPORT
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-28">
        
        {/* DASHBOARD TAB */}
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-teal-500 to-emerald-400 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
               <div className="absolute right-[-10%] top-[-10%] w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
               <h3 className="text-[13px] font-bold opacity-90 uppercase tracking-wide mb-4">Current Month Status</h3>
               <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-[11px] opacity-80 mb-0.5">Collected Amount</p>
                    <p className="text-2xl font-black">{formatCurrency(currentMonthStats.collectedAmount)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] opacity-80 mb-0.5">Pending Amount</p>
                    <p className="text-2xl font-black text-rose-100">{formatCurrency(currentMonthStats.pendingAmount)}</p>
                  </div>
               </div>
               <div className="bg-black/10 rounded-2xl p-3 flex justify-between items-center backdrop-blur-sm">
                  <div className="text-center">
                    <p className="text-[10px] opacity-80">Total Members</p>
                    <p className="font-bold text-[14px]">{totalMembers}</p>
                  </div>
                  <div className="w-px h-6 bg-white/20"></div>
                  <div className="text-center">
                    <p className="text-[10px] opacity-80">Paid</p>
                    <p className="font-bold text-[14px]">{currentMonthStats.paidCount}</p>
                  </div>
                  <div className="w-px h-6 bg-white/20"></div>
                  <div className="text-center">
                    <p className="text-[10px] opacity-80">Pending</p>
                    <p className="font-bold text-[14px]">{currentMonthStats.pendingCount}</p>
                  </div>
               </div>
               <div className="mt-4 flex items-center gap-3">
                 <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                   <div className="h-full bg-white rounded-full" style={{ width: `${collectionPercentage}%` }}></div>
                 </div>
                 <span className="text-[11px] font-bold">{collectionPercentage}%</span>
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
                 <Users className="w-6 h-6 text-blue-500 mb-2" />
                 <p className="text-xl font-black text-slate-800">{totalMembers}</p>
                 <p className="text-[11px] font-bold text-slate-400">Total Members</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
                 <Clock className="w-6 h-6 text-orange-500 mb-2" />
                 <p className="text-xl font-black text-slate-800">{formatCurrency(currentMonthStats.pendingAmount)}</p>
                 <p className="text-[11px] font-bold text-slate-400">Today's Due</p>
              </div>
            </div>
          </div>
        )}

        {/* MEMBERS TAB */}
        {activeTab === 'MEMBERS' && (
          <div className="space-y-3">
            {memberSavings.map(({ member, statuses }) => {
              const currentStatus = statuses[currentMonthIndex];
              const paidMonths = statuses.filter(s => s.status === 'PAID').length;
              const pendingMonths = statuses.filter(s => s.status === 'PENDING').length;
              const lastPayment = [...statuses].reverse().find(s => s.paidDate !== null);
              
              let statusBadge = "bg-slate-100 text-slate-500";
              let statusIcon = <Clock className="w-3 h-3" />;
              if (currentStatus.status === 'PAID') {
                statusBadge = "bg-emerald-100 text-emerald-700";
                statusIcon = <CheckCircle2 className="w-3 h-3" />;
              } else if (currentStatus.status === 'PENDING') {
                statusBadge = "bg-rose-100 text-rose-700";
                statusIcon = <AlertCircle className="w-3 h-3" />;
              }

              return (
                <div key={member.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100" onClick={() => { setSelectedMember({ member, statuses }); setLedgerOpen(true); }}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-slate-800 text-[15px]">{member.name}</h4>
                      <p className="text-[11px] font-medium text-slate-400">Monthly Saving: ₹500</p>
                    </div>
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold ${statusBadge}`}>
                      {statusIcon} {currentStatus.status}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-2 text-[11px] font-medium text-slate-500 bg-slate-50 p-3 rounded-xl">
                    <div className="flex flex-col"><span className="text-[9px] uppercase text-slate-400">Due Date</span> <span className="font-bold text-slate-700">{currentStatus.dueDate}</span></div>
                    <div className="flex flex-col"><span className="text-[9px] uppercase text-slate-400">Pending Amount</span> <span className="font-bold text-rose-500">{currentStatus.status === 'PENDING' ? '₹500' : '₹0'}</span></div>
                    <div className="flex flex-col"><span className="text-[9px] uppercase text-slate-400">Paid Months</span> <span className="font-bold text-slate-700">{paidMonths} / 12</span></div>
                    <div className="flex flex-col"><span className="text-[9px] uppercase text-slate-400">Pending Months</span> <span className="font-bold text-rose-500">{pendingMonths}</span></div>
                  </div>
                  
                  <div className="mt-2 text-[10px] font-bold text-slate-400 flex items-center justify-between">
                    <span>Last Payment: {lastPayment ? lastPayment.paidDate : 'N/A'}</span>
                    <span className="text-teal-500">View Ledger &rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* REPORT TAB */}
        {activeTab === 'REPORT' && (
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 text-[15px] mb-2">Yearly Overview</h3>
            {monthlyReport.map((rep, idx) => (
              <div key={idx} className={`bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2 ${idx === currentMonthIndex ? 'ring-2 ring-teal-400' : ''}`}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] ${idx === currentMonthIndex ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-500'}`}>
                      {rep.monthName}
                    </div>
                    <div>
                      <p className="font-bold text-[13px] text-slate-700">Due: {rep.dueDate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[14px] text-emerald-600">{formatCurrency(rep.collected)}</p>
                    <p className="text-[10px] font-bold text-rose-500">{formatCurrency(rep.pending)} Pending</p>
                  </div>
                </div>
                <div className="flex gap-2 text-[11px] font-semibold">
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">Paid: {rep.paidMembers}</span>
                  <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded">Pending: {rep.pendingMembers}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* YEARLY LEDGER MODAL */}
      {ledgerOpen && selectedMember && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden flex flex-col max-h-[80vh] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-bold text-[16px] text-slate-800">{selectedMember.member.name}</h3>
                <p className="text-[11px] text-slate-500 font-medium">Yearly Savings Ledger</p>
              </div>
              <button onClick={() => { setLedgerOpen(false); setSelectedMember(null); }} className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm border border-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-4 flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] uppercase text-slate-400 border-b border-slate-100">
                    <th className="pb-2 font-bold">Month</th>
                    <th className="pb-2 font-bold">Due</th>
                    <th className="pb-2 font-bold text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedMember.statuses.map((s: MonthlyStatus, i: number) => {
                    let sColor = "text-slate-400";
                    let sBg = "bg-slate-50";
                    if (s.status === 'PAID') {
                      sColor = "text-emerald-600";
                      sBg = "bg-emerald-50";
                    } else if (s.status === 'PENDING') {
                      sColor = "text-rose-600";
                      sBg = "bg-rose-50";
                    }

                    return (
                      <tr key={i} className="border-b border-slate-50 last:border-0">
                        <td className="py-3">
                          <p className="font-bold text-[13px] text-slate-700">{s.monthName}</p>
                          {s.paidDate && <p className="text-[9px] text-slate-400 font-medium">Paid: {s.paidDate}</p>}
                        </td>
                        <td className="py-3 text-[11px] font-semibold text-slate-500">
                          {s.dueDate.split(' ')[0]} {s.monthName}
                        </td>
                        <td className="py-3 text-right">
                          <span className={`inline-block px-2 py-1 rounded-md text-[10px] font-bold ${sBg} ${sColor}`}>
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
              <p className="text-[12px] font-bold text-slate-500">Total Paid: <span className="text-emerald-600">{formatCurrency(selectedMember.statuses.filter((s: MonthlyStatus) => s.status === 'PAID').length * 500)}</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
