import { useState, useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useSearchParams } from 'react-router-dom';
import { useExpenseData } from '../hooks/useExpenseData';
import { 
  ArrowLeft, Filter, Bell, Receipt, FileText, 
  Calendar, CheckCircle2, Clock, IndianRupee,
  Plus, Edit, Eye, Trash, Info
} from 'lucide-react';
import { formatCurrency } from '../utils/format';
import { ExpenseEntryModal } from '../components/ExpenseEntryModal';
import { ExpenseEditModal } from '../components/ExpenseEditModal';
import { ExpensePaymentModal } from '../components/ExpensePaymentModal';
import { ExpenseAuditLogModal } from '../components/ExpenseAuditLogModal';
import { Expense } from '../types';
import toast from 'react-hot-toast';
import { FullScreenImageViewer } from '../components/FullScreenImageViewer';
import { PageHeader } from '../components/PageHeader';

export function ExpenseScreen() {
  const { goBack } = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { expenses, deleteExpense, getExpenseStats } = useExpenseData();
  const stats = getExpenseStats();
  
  const [activeTab, setActiveTab] = useState<'REGISTER' | 'CREDIT_LIST'>('REGISTER');
  
  // Modals
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  
  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      setIsEntryModalOpen(true);
      setSearchParams(new URLSearchParams());
    }
  }, [searchParams, setSearchParams]);

  const [editExpense, setEditExpense] = useState<Expense | null>(null);
  const [payCreditExpense, setPayCreditExpense] = useState<Expense | null>(null);
  const [auditExpense, setAuditExpense] = useState<Expense | null>(null);
  const [viewerImageId, setViewerImageId] = useState<string | null>(null);

  const handleDelete = (expense: Expense) => {
    if (window.confirm(`Are you sure you want to delete Expense ${expense.expenseNo} for ${formatCurrency(expense.amount)}?`)) {
      deleteExpense(expense.id);
      toast.success('Expense Deleted Successfully');
    }
  };

  const outstandingCredits = expenses.filter(e => e.paymentType === 'CREDIT' && e.status !== 'PAID');

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] font-['Plus_Jakarta_Sans',sans-serif]">
      <PageHeader title="खर्च विवरण (Expenses)" subtitle="समिति के खर्च की जानकारी" />

      {/* Quick Action Tabs moved below */}

      {/* Main Content Area */}
      <div className="p-4 flex-1 overflow-y-auto pb-32">
        <div className="space-y-4">
          {/* Expense Stats Card Box (Chanda Theme Style) */}
          <div className="bg-gradient-to-br from-[#FF5A5F] to-[#D12B30] rounded-[28px] p-6 text-white shadow-[0_8px_30px_rgba(255,90,95,0.3)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            
            <div className="flex justify-between items-start mb-2 relative z-10">
              <div>
                <p className="text-[13px] font-extrabold opacity-95">कुल खर्च (Total Expense)</p>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Receipt className="w-5 h-5 text-white" />
              </div>
            </div>
            <h2 className="text-[36px] font-extrabold tracking-wider mb-4 relative z-10">{formatCurrency(stats.totalExpense)}</h2>
            
            <div className="flex flex-col gap-3 relative z-10 border-t border-white/20 pt-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-300"></div>
                  <p className="text-[12px] opacity-95 font-bold">नकद (Cash)</p>
                </div>
                <p className="text-[14px] font-extrabold">{formatCurrency(stats.totalPaid)}</p>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-300"></div>
                  <p className="text-[12px] opacity-95 font-bold">उधार (Credit)</p>
                </div>
                <p className="text-[14px] font-extrabold">{formatCurrency(stats.outstandingCredit)}</p>
              </div>
            </div>
          </div>

          {/* Quick Action Tabs moved here */}
          <div className="pt-2 shrink-0">
            <h3 className="text-[15px] font-extrabold text-slate-800 mb-4 px-1">त्वरित कार्य (Quick Actions)</h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setActiveTab('REGISTER')}
                className={`bg-white p-4 rounded-[24px] shadow-sm flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform ${
                  activeTab === 'REGISTER' ? 'border-2 border-orange-400' : 'border border-slate-100'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-orange-500" />
                </div>
                <span className={`text-[13px] font-extrabold ${activeTab === 'REGISTER' ? 'text-orange-600' : 'text-slate-800'}`}>खर्च रजिस्टर (Register)</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('CREDIT_LIST')}
                className={`bg-white p-4 rounded-[24px] shadow-sm flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform relative ${
                  activeTab === 'CREDIT_LIST' ? 'border-2 border-orange-400' : 'border border-slate-100'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-500" />
                </div>
                <span className={`text-[13px] font-extrabold ${activeTab === 'CREDIT_LIST' ? 'text-orange-600' : 'text-slate-800'}`}>उधार सूची (Pending)</span>
                
                {outstandingCredits.length > 0 && (
                  <span className="absolute top-2 right-2 w-6 h-6 bg-rose-500 text-white text-[11px] rounded-full flex items-center justify-center border-2 border-white font-bold shadow-sm">
                    {outstandingCredits.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'REGISTER' ? (
          <div className="space-y-4 mt-6">
             {/* Expense List */}
             {expenses.length === 0 ? (
               <div className="bg-white rounded-[24px] p-8 text-center border border-slate-100 shadow-sm mt-8">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Receipt className="w-8 h-8 text-slate-300" />
                 </div>
                 <p className="text-slate-500 font-medium text-[14px]">No expenses recorded yet.</p>
               </div>
             ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-extrabold text-slate-500 tracking-wider uppercase">
                          <th className="p-3 pl-4">Date</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Detail</th>
                          <th className="p-3 text-right">Amount</th>
                          <th className="p-3 text-center">Type</th>
                          <th className="p-3 text-center">Remark</th>
                          <th className="p-3 text-center">Docs</th>
                          <th className="p-3 pr-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {expenses.map((expense) => (
                           <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-3 pl-4 whitespace-nowrap text-[13px] font-semibold text-slate-600">
                                {new Date(expense.date).toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'})}
                              </td>
                              <td className="p-3 whitespace-nowrap text-[13px] font-bold text-slate-800">
                                {expense.category}
                              </td>
                              <td className="p-3 text-[13px] text-slate-800 min-w-[200px]">
                                <div>
                                  <span className="font-extrabold text-slate-400 text-[10px] mr-1">{expense.expenseNo}</span>
                                  <span className="font-bold">{expense.vendorName}</span>
                                </div>
                                {expense.description && (
                                  <p className="text-[11px] font-medium text-slate-500 mt-0.5 line-clamp-1">{expense.description}</p>
                                )}
                              </td>
                              <td className="p-3 text-right whitespace-nowrap font-extrabold text-[14px] text-slate-800">
                                {formatCurrency(expense.amount)}
                              </td>
                              <td className="p-3 text-center whitespace-nowrap">
                                <span className={`text-[10px] font-extrabold px-2 py-1 rounded-md uppercase tracking-wider ${
                                  expense.paymentType === 'CREDIT' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                }`}>
                                  {expense.paymentType}
                                </span>
                              </td>
                              <td className="p-3 text-center whitespace-nowrap">
                                {expense.paymentType === 'CREDIT' ? (
                                  <span className={`text-[10px] font-extrabold px-2 py-1 rounded-md uppercase tracking-wider ${
                                    expense.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                  }`}>
                                    {expense.status}
                                  </span>
                                ) : (
                                  <span className="text-slate-300 font-bold text-[12px]">-</span>
                                )}
                              </td>
                              <td className="p-3 text-center">
                                {expense.billPhoto ? (
                                  <button 
                                    onClick={() => setViewerImageId(expense.billPhoto!)}
                                    className="w-7 h-7 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center border border-blue-100 active:scale-90 mx-auto"
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <span className="text-slate-300 font-bold text-[12px]">-</span>
                                )}
                              </td>
                              <td className="p-3 pr-4 text-center whitespace-nowrap">
                                <div className="flex items-center justify-center gap-1.5">
                                   <button onClick={() => setAuditExpense(expense)} className="p-1.5 text-slate-400 hover:bg-slate-200 rounded-full active:scale-90 transition-transform">
                                     <Info className="w-4 h-4" />
                                   </button>
                                   <button onClick={() => setEditExpense(expense)} className="p-1.5 text-slate-400 hover:bg-slate-200 rounded-full active:scale-90 transition-transform">
                                     <Edit className="w-4 h-4" />
                                   </button>
                                   <button onClick={() => handleDelete(expense)} className="p-1.5 text-rose-400 hover:bg-rose-100 rounded-full active:scale-90 transition-transform">
                                     <Trash className="w-4 h-4" />
                                   </button>
                                </div>
                              </td>
                           </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
             )}
          </div>
        ) : (
          <div className="space-y-4">
             {/* Credit List View */}
             {outstandingCredits.length === 0 ? (
                <div className="bg-white rounded-[24px] p-8 text-center border border-slate-100 shadow-sm mt-4">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                     <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <p className="text-emerald-600 font-bold text-[16px] mb-1">All Clear!</p>
                  <p className="text-slate-500 font-medium text-[13px]">There are no pending credit expenses.</p>
                </div>
             ) : (
               <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mt-4">
                 <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                     <thead>
                       <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-extrabold text-slate-500 tracking-wider uppercase">
                         <th className="p-3 pl-4">Due Date</th>
                         <th className="p-3">Vendor</th>
                         <th className="p-3 text-right">Total</th>
                         <th className="p-3 text-right">Paid</th>
                         <th className="p-3 text-right">Remaining</th>
                         <th className="p-3 pr-4 text-center">Action</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                       {outstandingCredits.map((expense) => (
                          <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors">
                             <td className="p-3 pl-4 whitespace-nowrap text-[13px] font-semibold text-rose-500">
                               {expense.dueDate ? new Date(expense.dueDate).toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'}) : 'N/A'}
                             </td>
                             <td className="p-3 text-[13px] text-slate-800 min-w-[150px]">
                               <div>
                                 <span className="font-extrabold text-slate-400 text-[10px] mr-1">{expense.expenseNo}</span>
                                 <span className="font-bold">{expense.vendorName}</span>
                               </div>
                               <p className="text-[11px] font-medium text-slate-500 mt-0.5">{expense.category}</p>
                             </td>
                             <td className="p-3 text-right whitespace-nowrap font-bold text-[13px] text-slate-600">
                               {formatCurrency(expense.amount)}
                             </td>
                             <td className="p-3 text-right whitespace-nowrap font-bold text-[13px] text-emerald-600">
                               {formatCurrency(expense.paidAmount)}
                             </td>
                             <td className="p-3 text-right whitespace-nowrap font-extrabold text-[14px] text-rose-600">
                               {formatCurrency(expense.amount - expense.paidAmount)}
                             </td>
                             <td className="p-3 pr-4 text-center whitespace-nowrap">
                                <div className="flex items-center justify-center gap-2">
                                  <button 
                                    onClick={() => setPayCreditExpense(expense)}
                                    className="px-3 py-2 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-[10px] font-bold text-[12px] flex items-center justify-center gap-1.5 active:scale-[0.95] transition-transform"
                                  >
                                    <IndianRupee className="w-3.5 h-3.5" /> Pay
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(expense)}
                                    className="p-2 bg-rose-50 text-rose-500 border border-rose-200 rounded-[10px] active:scale-[0.95] transition-transform"
                                    title="Delete"
                                  >
                                    <Trash className="w-4 h-4" />
                                  </button>
                                </div>
                             </td>
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

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsEntryModalOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(249,115,22,0.4)] active:scale-90 transition-transform z-30"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Modals */}
      {isEntryModalOpen && (
        <ExpenseEntryModal onClose={() => setIsEntryModalOpen(false)} />
      )}
      
      {editExpense && (
        <ExpenseEditModal 
          expense={editExpense} 
          onClose={() => setEditExpense(null)} 
        />
      )}

      {payCreditExpense && (
        <ExpensePaymentModal 
          expenseId={payCreditExpense.id}
          vendorName={payCreditExpense.vendorName}
          totalAmount={payCreditExpense.amount}
          paidAmount={payCreditExpense.paidAmount}
          onClose={() => setPayCreditExpense(null)}
        />
      )}

      {auditExpense && (
        <ExpenseAuditLogModal
          expense={auditExpense}
          onClose={() => setAuditExpense(null)}
        />
      )}

      {viewerImageId && (
        <FullScreenImageViewer
          fileId={viewerImageId}
          onClose={() => setViewerImageId(null)}
        />
      )}
    </div>
  );
}
