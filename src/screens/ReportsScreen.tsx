import { useState, useMemo } from 'react';
import { PageHeader } from '../components/PageHeader';
import { useCommitteeData } from '../hooks/useCommitteeData';
import { formatCurrency } from '../utils/format';
import { FullScreenImageViewer } from '../components/FullScreenImageViewer';
import { EditTransactionModal } from '../components/EditTransactionModal';
import { 
  BarChart3, Download, FileText, PieChart, Wallet, 
  ArrowUpCircle, ArrowDownCircle, Users, CreditCard, 
  Calendar, CheckCircle2, ChevronDown, Printer, Camera, Edit2, Trash2
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart as RechartsPie, Pie, Cell, Legend
} from 'recharts';

type ReportTab = 'SUMMARY' | 'DEPOSIT' | 'EXPENSE' | 'CREDIT' | 'HISTORY' | 'MEMBER' | 'MONTHLY';

export function ReportsScreen() {
  const { transactions, members, getStats, payCredit, deleteTransaction, updateTransaction } = useCommitteeData();
  const stats = getStats();
  const [activeTab, setActiveTab] = useState<ReportTab>('SUMMARY');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [viewerFileId, setViewerFileId] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);

  // Credit Pay Modal State
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedCreditId, setSelectedCreditId] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState<'CASH' | 'UPI' | 'BANK'>('CASH');
  const [payRemark, setPayRemark] = useState('');

  const tabs: { id: ReportTab, label: string }[] = [
    { id: 'SUMMARY', label: 'Summary' },
    { id: 'DEPOSIT', label: 'Deposits' },
    { id: 'EXPENSE', label: 'Expenses' },
    { id: 'CREDIT', label: 'Credits' },
    { id: 'HISTORY', label: 'Credit Paid' },
    { id: 'MEMBER', label: 'Member Ledger' },
    { id: 'MONTHLY', label: 'Monthly' },
  ];

  // Helper functions for CSV Export
  const downloadCSV = (filename: string, headers: string[], rows: any[][]) => {
    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  // --- DATA PROCESSING FOR CHARTS & TABLES ---
  
  const depositTransactions = useMemo(() => transactions.filter(t => t.type === 'DEPOSIT' || t.type === 'DEPOSIT_PAYMENT'), [transactions]);
  const expenseTransactions = useMemo(() => transactions.filter(t => t.type === 'EXPENSE'), [transactions]);
  
  const outstandingCredits = useMemo(() => {
    return expenseTransactions.filter(t => t.paymentMethod === 'CREDIT').map(t => {
      const remaining = t.amount - (t.paidAmount || 0);
      let status = 'UNPAID';
      if (remaining === 0) status = 'PAID';
      else if ((t.paidAmount || 0) > 0) status = 'PARTIAL';
      return { ...t, remaining, status };
    });
  }, [expenseTransactions]);

  const creditPaymentTransactions = useMemo(() => transactions.filter(t => t.type === 'CREDIT_PAYMENT'), [transactions]);

  // Chart Data
  const monthlyData = useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dataMap: Record<string, { name: string, deposit: number, expense: number }> = {};
    
    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthStr = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      if (!dataMap[monthStr]) {
        dataMap[monthStr] = { name: monthStr, deposit: 0, expense: 0 };
      }
      if (t.type === 'DEPOSIT' && t.paymentMethod !== 'CREDIT') dataMap[monthStr].deposit += t.amount;
      if (t.type === 'DEPOSIT_PAYMENT') dataMap[monthStr].deposit += t.amount;
      if (t.type === 'EXPENSE' && t.paymentMethod !== 'CREDIT') dataMap[monthStr].expense += t.amount;
      if (t.type === 'CREDIT_PAYMENT') dataMap[monthStr].expense += t.amount;
    });
    return Object.values(dataMap);
  }, [transactions]);

  const expenseCategoryData = useMemo(() => {
    const catMap: Record<string, number> = {};
    expenseTransactions.forEach(t => {
      catMap[t.category] = (catMap[t.category] || 0) + t.amount;
    });
    return Object.keys(catMap).map(k => ({ name: k, value: catMap[k] }));
  }, [expenseTransactions]);

  const COLORS = ['#FF8A3D', '#F43F5E', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'];

  const handlePayCreditSubmit = () => {
    if (selectedCreditId && Number(payAmount) > 0) {
      payCredit(selectedCreditId, Number(payAmount), payMethod, payRemark);
      setPayModalOpen(false);
      setPayAmount('');
      setPayRemark('');
      setSelectedCreditId('');
    }
  };

  const selectedCreditTx = outstandingCredits.find(t => t.id === selectedCreditId);

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] print:bg-white print:h-auto">
      {/* Header - Hidden on Print */}
      <div className="print:hidden">
        <PageHeader title="Financial Dashboard" subtitle="Ganesh Samiti Reports" />
      </div>

      {/* Tabs - Hidden on Print */}
      <div className="bg-white border-b border-slate-100 print:hidden overflow-x-auto scrollbar-hide">
         <div className="flex px-4 py-2 gap-2 w-max">
           {tabs.map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                 activeTab === tab.id 
                   ? 'bg-orange-100 text-orange-700' 
                   : 'text-slate-500 hover:bg-slate-50'
               }`}
             >
               {tab.label}
             </button>
           ))}
         </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto pb-24 print:p-0 print:overflow-visible">
        
        {/* SUMMARY TAB */}
        {activeTab === 'SUMMARY' && (
          <div className="space-y-6">
            <h2 className="text-xl font-extrabold text-slate-800 px-1 print:text-center">Top Financial Summary</h2>
            
            {/* 6 Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><ArrowDownCircle className="w-12 h-12 text-emerald-500"/></div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Total Deposit</p>
                <h3 className="text-lg font-black text-emerald-600 mt-1">{formatCurrency(stats.totalDeposit)}</h3>
              </div>
              <div className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><ArrowUpCircle className="w-12 h-12 text-rose-500"/></div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Total Expense</p>
                <h3 className="text-lg font-black text-rose-600 mt-1">{formatCurrency(stats.totalExpenses)}</h3>
              </div>
              <div className="bg-gradient-to-br from-[#FF8A3D] to-[#FFB86C] p-4 rounded-[24px] shadow-md border border-orange-200 relative overflow-hidden col-span-2 text-white">
                <div className="absolute top-0 right-0 p-4 opacity-20"><Wallet className="w-16 h-16"/></div>
                <p className="text-[12px] font-bold text-white/80 uppercase tracking-wide">Current Balance</p>
                <h3 className="text-3xl font-black mt-1">{formatCurrency(stats.currentBalance)}</h3>
                <p className="text-[10px] text-white/70 mt-2 font-medium">Available Cash & Bank Balance</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-[24px] shadow-sm border border-amber-100">
                <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">Outstanding Credit</p>
                <h3 className="text-lg font-black text-amber-600 mt-1">{formatCurrency(stats.outstandingCredit)}</h3>
              </div>
              <div className="bg-indigo-50 p-4 rounded-[24px] shadow-sm border border-indigo-100">
                <p className="text-[11px] font-bold text-indigo-700 uppercase tracking-wide">Credit Paid</p>
                <h3 className="text-lg font-black text-indigo-600 mt-1">{formatCurrency(stats.creditPaid)}</h3>
              </div>
              <div className="bg-blue-50 p-4 rounded-[24px] shadow-sm border border-blue-100 col-span-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[11px] font-bold text-blue-700 uppercase tracking-wide">Total Members</p>
                    <h3 className="text-xl font-black text-blue-600 mt-1">{stats.totalMembers}</h3>
                  </div>
                  <Users className="w-8 h-8 text-blue-300" />
                </div>
              </div>
            </div>

            {/* Analytics Charts */}
            <div className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100">
               <h3 className="text-[14px] font-bold text-slate-800 mb-4">Monthly Deposit vs Expense</h3>
               <div className="h-[250px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={monthlyData}>
                     <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                     <YAxis fontSize={10} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                     <Tooltip cursor={{fill: 'transparent'}} formatter={(value: number) => formatCurrency(value)} />
                     <Legend wrapperStyle={{fontSize: '11px', fontWeight: 'bold'}} />
                     <Bar dataKey="deposit" name="Deposit" fill="#10B981" radius={[4, 4, 0, 0]} />
                     <Bar dataKey="expense" name="Expense" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>

            <div className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100">
               <h3 className="text-[14px] font-bold text-slate-800 mb-4">Expense Categories</h3>
               <div className="h-[250px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <RechartsPie>
                     <Pie
                       data={expenseCategoryData}
                       cx="50%"
                       cy="50%"
                       innerRadius={60}
                       outerRadius={80}
                       paddingAngle={5}
                       dataKey="value"
                     >
                       {expenseCategoryData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <Tooltip formatter={(value: number) => formatCurrency(value)} />
                     <Legend wrapperStyle={{fontSize: '11px', fontWeight: 'bold'}} />
                   </RechartsPie>
                 </ResponsiveContainer>
               </div>
            </div>
            
            {/* Export Hub in Summary */}
            <div className="grid grid-cols-2 gap-3 pt-2 print:hidden">
               <button 
                 onClick={() => {
                   const headers = ['ID', 'Type', 'Category', 'Amount', 'Date', 'Description', 'Member/Vendor'];
                   const rows = transactions.map(t => [
                     t.id, t.type, t.category, t.amount, t.date, `"${t.description}"`, `"${t.vendorName || t.memberId || ''}"`
                   ]);
                   downloadCSV('All_Transactions.csv', headers, rows);
                 }}
                 className="bg-white border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-sm text-xs"
               >
                 <Download className="w-4 h-4 text-emerald-500" /> All Data CSV
               </button>
               <button 
                 onClick={handlePrint}
                 className="bg-slate-800 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-sm text-xs"
               >
                 <Printer className="w-4 h-4 text-slate-300" /> Print Report
               </button>
            </div>
          </div>
        )}

        {/* DEPOSIT REGISTER TAB */}
        {activeTab === 'DEPOSIT' && (
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-slate-800 px-1">Deposit Register</h2>
            <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-[12px]">
                   <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
                     <tr>
                       <th className="px-4 py-3 whitespace-nowrap">Date</th>
                       <th className="px-4 py-3 whitespace-nowrap">Member</th>
                       <th className="px-4 py-3 whitespace-nowrap">Category</th>
                       <th className="px-4 py-3 whitespace-nowrap text-right">Amount</th>
                       <th className="px-4 py-3 whitespace-nowrap">Method</th>
                       <th className="px-4 py-3 whitespace-nowrap">Docs</th>
                       <th className="px-4 py-3 whitespace-nowrap text-right print:hidden">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 font-medium">
                     {depositTransactions.map(t => {
                       const member = members.find(m => m.id === t.memberId);
                       const memberName = member ? member.name : t.donorName || 'Unknown';
                       return (
                         <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                           <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                             {t.date && !isNaN(new Date(t.date).getTime()) ? new Date(t.date).toLocaleDateString('en-IN') : 'N/A'}
                           </td>
                           <td className="px-4 py-3 whitespace-nowrap font-bold text-slate-800">{memberName}</td>
                           <td className="px-4 py-3 whitespace-nowrap text-emerald-600 bg-emerald-50/50 rounded-md inline-block mt-2 mb-2 ml-4 px-2 py-0.5">{t.category}</td>
                           <td className="px-4 py-3 whitespace-nowrap text-right font-bold text-slate-800">{formatCurrency(t.amount)}</td>
                           <td className="px-4 py-3 whitespace-nowrap text-slate-500">{t.description.split('via ')[1] || 'Cash'}</td>
                           <td className="px-4 py-3 whitespace-nowrap">
                             <div className="flex gap-1">
                               {t.receiptPhoto && (
                                 <button onClick={() => setViewerFileId(t.receiptPhoto!)} className="bg-slate-100 text-slate-500 p-1 rounded hover:bg-slate-200"><Camera className="w-3 h-3" /></button>
                               )}
                               {t.paymentScreenshot && (
                                 <button onClick={() => setViewerFileId(t.paymentScreenshot!)} className="bg-slate-100 text-slate-500 p-1 rounded hover:bg-slate-200"><Camera className="w-3 h-3" /></button>
                               )}
                             </div>
                           </td>
                           <td className="px-4 py-3 whitespace-nowrap text-right print:hidden">
                             <div className="flex justify-end gap-2">
                               <button onClick={() => setEditingTransaction(t)} className="text-blue-500 hover:text-blue-600 bg-blue-50 p-1.5 rounded-md transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                               <button onClick={() => { if(window.confirm('क्या आप इसे हटाना चाहते हैं?')) deleteTransaction(t.id); }} className="text-rose-500 hover:text-rose-600 bg-rose-50 p-1.5 rounded-md transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                             </div>
                           </td>
                         </tr>
                       )
                     })}
                     {depositTransactions.length === 0 && (
                       <tr><td colSpan={7} className="text-center py-6 text-slate-400">No deposits found.</td></tr>
                     )}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}

        {/* EXPENSE REGISTER TAB */}
        {activeTab === 'EXPENSE' && (
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-slate-800 px-1">Expense Register</h2>
            <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-[12px]">
                   <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
                     <tr>
                       <th className="px-4 py-3 whitespace-nowrap">Date</th>
                       <th className="px-4 py-3 whitespace-nowrap">Category</th>
                       <th className="px-4 py-3 whitespace-nowrap">Detail</th>
                       <th className="px-4 py-3 whitespace-nowrap text-right">Amount</th>
                       <th className="px-4 py-3 whitespace-nowrap text-center">Type</th>
                       <th className="px-4 py-3 whitespace-nowrap">Remark</th>
                       <th className="px-4 py-3 whitespace-nowrap">Docs</th>
                       <th className="px-4 py-3 whitespace-nowrap text-right print:hidden">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 font-medium">
                     {expenseTransactions.map(t => {
                       const descParts = t.description.split(' - ');
                       const mainDetail = t.vendorName ? `[${t.vendorName}] ${descParts[0]}` : descParts[0];
                       const remarkText = descParts.length > 1 ? descParts.slice(1).join(' - ') : '-';
                       
                       return (
                       <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                         <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                           {t.date && !isNaN(new Date(t.date).getTime()) ? new Date(t.date).toLocaleDateString('en-IN') : 'N/A'}
                         </td>
                         <td className="px-4 py-3 whitespace-nowrap text-slate-800 font-bold">{t.category}</td>
                         <td className="px-4 py-3 whitespace-nowrap text-slate-500 max-w-[120px] truncate" title={mainDetail}>{mainDetail}</td>
                         <td className="px-4 py-3 whitespace-nowrap text-right font-bold text-rose-600">{formatCurrency(t.amount)}</td>
                         <td className="px-4 py-3 whitespace-nowrap text-center">
                           {t.paymentMethod === 'CREDIT' ? (
                             <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold">CREDIT</span>
                           ) : (
                             <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">{t.paymentMethod || 'CASH'}</span>
                           )}
                         </td>
                         <td className="px-4 py-3 text-slate-500 whitespace-normal min-w-[150px] leading-snug">{remarkText}</td>
                         <td className="px-4 py-3 whitespace-nowrap">
                           <div className="flex gap-1">
                             {t.receiptPhoto && (
                               <button onClick={() => setViewerFileId(t.receiptPhoto!)} className="bg-slate-100 text-slate-500 p-1 rounded hover:bg-slate-200" title="View Receipt"><Camera className="w-3 h-3" /></button>
                             )}
                             {t.vendorPhoto && (
                               <button onClick={() => setViewerFileId(t.vendorPhoto!)} className="bg-slate-100 text-slate-500 p-1 rounded hover:bg-slate-200" title="View Vendor Photo"><Camera className="w-3 h-3" /></button>
                             )}
                           </div>
                         </td>
                         <td className="px-4 py-3 whitespace-nowrap text-right print:hidden">
                           <div className="flex justify-end gap-2">
                             <button onClick={() => setEditingTransaction(t)} className="text-blue-500 hover:text-blue-600 bg-blue-50 p-1.5 rounded-md transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                             <button onClick={() => { if(window.confirm('क्या आप इसे हटाना चाहते हैं?')) deleteTransaction(t.id); }} className="text-rose-500 hover:text-rose-600 bg-rose-50 p-1.5 rounded-md transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                           </div>
                         </td>
                       </tr>
                     )})}
                     {expenseTransactions.length === 0 && (
                       <tr><td colSpan={8} className="text-center py-6 text-slate-400">No expenses found.</td></tr>
                     )}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}

        {/* CREDIT REGISTER TAB */}
        {activeTab === 'CREDIT' && (
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-slate-800 px-1">Outstanding Credits</h2>
            
            {outstandingCredits.length === 0 ? (
               <div className="text-center py-10 bg-white rounded-3xl border border-slate-100">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                     <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-slate-700 font-bold">No Pending Credit</h3>
               </div>
            ) : (
               outstandingCredits.map(credit => (
                 <div key={credit.id} className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 relative overflow-hidden">
                   <div className={`absolute top-0 left-0 w-1.5 h-full ${credit.status === 'PAID' ? 'bg-emerald-500' : credit.status === 'PARTIAL' ? 'bg-amber-400' : 'bg-rose-500'}`}></div>
                   
                   <div className="flex justify-between items-start mb-3">
                     <div>
                       <h3 className="text-[16px] font-bold text-slate-800">{credit.vendorName}</h3>
                       <p className="text-[12px] font-medium text-slate-500">{credit.category} • Due: {credit.dueDate || 'N/A'}</p>
                     </div>
                     <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                       credit.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 
                       credit.status === 'PARTIAL' ? 'bg-amber-50 text-amber-600' : 
                       'bg-rose-50 text-rose-600'
                     }`}>
                       {credit.status}
                     </span>
                   </div>

                   <div className="grid grid-cols-2 gap-3 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">Total Udhar</p>
                        <p className="text-[14px] font-bold text-slate-700">{formatCurrency(credit.amount)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase mb-0.5">Paid Amount</p>
                        <p className="text-[14px] font-bold text-emerald-600">{formatCurrency(credit.paidAmount || 0)}</p>
                      </div>
                   </div>

                   <div className="flex justify-between items-center mt-2">
                     <div>
                       <p className="text-[11px] text-slate-500 font-bold">Remaining Balance</p>
                       <p className="text-[18px] font-black text-rose-500">{formatCurrency(credit.remaining)}</p>
                     </div>
                     {credit.status !== 'PAID' && (
                       <button 
                         onClick={() => {
                           setSelectedCreditId(credit.id);
                           setPayAmount(credit.remaining.toString());
                           setPayModalOpen(true);
                         }}
                         className="px-5 py-2.5 bg-slate-800 text-white text-[12px] font-bold rounded-xl active:scale-95 transition-transform shadow-md"
                       >
                         Pay Credit
                       </button>
                     )}
                   </div>
                 </div>
               ))
            )}
          </div>
        )}

        {/* CREDIT HISTORY TAB */}
        {activeTab === 'HISTORY' && (
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-slate-800 px-1">Credit Payment History</h2>
            <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-[12px]">
                   <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
                     <tr>
                       <th className="px-4 py-3 whitespace-nowrap">Date</th>
                       <th className="px-4 py-3 whitespace-nowrap">Description</th>
                       <th className="px-4 py-3 whitespace-nowrap">Method</th>
                       <th className="px-4 py-3 whitespace-nowrap text-right">Amount Paid</th>
                       <th className="px-4 py-3 whitespace-nowrap text-center">हटाएं</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 font-medium">
                     {creditPaymentTransactions.map(t => (
                       <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                         <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                           {t.date && !isNaN(new Date(t.date).getTime()) ? new Date(t.date).toLocaleDateString('en-IN') : 'N/A'}
                         </td>
                         <td className="px-4 py-3 whitespace-nowrap text-slate-800 font-bold max-w-[150px] truncate">{t.description}</td>
                         <td className="px-4 py-3 whitespace-nowrap text-slate-500">{t.paymentMethod || 'CASH'}</td>
                         <td className="px-4 py-3 whitespace-nowrap text-right font-bold text-indigo-600">{formatCurrency(t.amount)}</td>
                         <td className="px-4 py-3 text-center">
                           <button
                             onClick={() => { if(window.confirm('क्या आप इसे हटाना चाहते हैं?')) deleteTransaction(t.id); }}
                             className="p-2 text-white bg-rose-500 border border-rose-600 rounded-lg active:scale-90 transition-transform shadow-sm"
                             title="हटाएं"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                         </td>
                       </tr>
                     ))}
                     {creditPaymentTransactions.length === 0 && (
                       <tr><td colSpan={5} className="text-center py-6 text-slate-400">कोई credit payment नहीं मिली.</td></tr>
                     )}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}

        {/* MEMBER LEDGER TAB */}
        {activeTab === 'MEMBER' && (
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-slate-800 px-1">Member Ledger</h2>
            
            <div className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-100">
              <label className="text-[12px] font-bold text-slate-700 mb-2 block">Select Member to view Ledger</label>
              <div className="relative">
                <select 
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[14px] rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:border-orange-400 font-bold appearance-none"
                >
                  <option value="" disabled>Choose Member...</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            </div>

            {selectedMember && (
              <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden mt-4">
                 <div className="p-4 bg-orange-50 border-b border-orange-100 flex justify-between items-center">
                    <h3 className="font-bold text-orange-900">{members.find(m=>m.id===selectedMember)?.name}</h3>
                    <span className="bg-orange-200 text-orange-800 text-[10px] font-bold px-2 py-1 rounded">
                      Total: {formatCurrency(transactions.filter(t => t.memberId === selectedMember).reduce((s, t) => s + t.amount, 0))}
                    </span>
                 </div>
                 <div className="overflow-x-auto">
                   <table className="w-full text-left text-[12px]">
                     <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
                       <tr>
                         <th className="px-4 py-3 whitespace-nowrap">Date</th>
                         <th className="px-4 py-3 whitespace-nowrap">Category</th>
                         <th className="px-4 py-3 whitespace-nowrap text-right">Amount</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 font-medium">
                       {transactions.filter(t => t.memberId === selectedMember).map(t => (
                         <tr key={t.id} className="hover:bg-slate-50">
                           <td className="px-4 py-2 text-slate-600">
                             {t.date && !isNaN(new Date(t.date).getTime()) ? new Date(t.date).toLocaleDateString('en-IN') : 'N/A'}
                           </td>
                           <td className="px-4 py-2 text-slate-800 font-bold">{t.category}</td>
                           <td className="px-4 py-2 text-right font-bold text-emerald-600">{formatCurrency(t.amount)}</td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pay Credit Modal */}
      {payModalOpen && selectedCreditTx && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full sm:w-[400px] rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:fade-in duration-300">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">Pay Credit</h3>
                <button onClick={() => setPayModalOpen(false)} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                  <CheckCircle2 className="w-5 h-5 text-rose-500 rotate-45" />
                </button>
             </div>
             
             {/* Modal Content - Reused from ExpenseScreen logic */}
             <div className="space-y-5">
               <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex justify-between items-center">
                  <span className="text-sm font-bold text-amber-800">Pending</span>
                  <span className="text-lg font-black text-amber-600">{formatCurrency(selectedCreditTx.remaining)}</span>
               </div>

               <div>
                 <label className="text-[12px] font-bold text-slate-700 mb-2 block">Payment Amount</label>
                 <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                       <span className="font-bold text-slate-400">₹</span>
                    </div>
                    <input 
                      type="number"
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value)}
                      max={selectedCreditTx.remaining}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-lg rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 font-bold"
                    />
                 </div>
               </div>

               <div>
                 <label className="text-[12px] font-bold text-slate-700 mb-2 block">Payment Method</label>
                 <div className="flex gap-2">
                   {['CASH', 'UPI', 'BANK'].map(method => (
                     <button
                       key={method}
                       onClick={() => setPayMethod(method as any)}
                       className={`flex-1 py-2.5 rounded-xl text-[12px] font-bold transition-all border ${
                         payMethod === method ? 'bg-emerald-50 border-emerald-400 text-emerald-700' : 'bg-white border-slate-200 text-slate-500'
                       }`}
                     >
                       {method}
                     </button>
                   ))}
                 </div>
               </div>

               <div>
                 <label className="text-[12px] font-bold text-slate-700 mb-2 block">Remark (Optional)</label>
                 <input 
                   type="text"
                   value={payRemark}
                   onChange={(e) => setPayRemark(e.target.value)}
                   placeholder="e.g. Cleared full due"
                   className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-400 font-medium"
                 />
               </div>

               <button 
                 type="button"
                 onClick={handlePayCreditSubmit}
                 disabled={!payAmount || Number(payAmount) <= 0 || Number(payAmount) > selectedCreditTx.remaining}
                 className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold text-lg active:scale-95 transition-transform disabled:opacity-50 mt-2 flex justify-center items-center gap-2"
               >
                 Save and Pay (सेव और पे)
               </button>
             </div>
          </div>
        </div>
      )}

      {viewerFileId && (
        <FullScreenImageViewer 
          fileId={viewerFileId} 
          onClose={() => setViewerFileId(null)} 
          title="Document Viewer"
        />
      )}

      {editingTransaction && (
        <EditTransactionModal 
          transaction={editingTransaction} 
          onClose={() => setEditingTransaction(null)} 
          updateTransaction={updateTransaction}
        />
      )}
    </div>
  );
}
