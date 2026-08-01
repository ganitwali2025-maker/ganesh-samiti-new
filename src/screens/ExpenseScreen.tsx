import { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
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

export function ExpenseScreen() {
  const { goBack } = useNavigation();
  const { expenses, deleteExpense, getExpenseStats } = useExpenseData();
  const stats = getExpenseStats();
  
  const [activeTab, setActiveTab] = useState<'REGISTER' | 'CREDIT_LIST'>('REGISTER');
  
  // Modals
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
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
      {/* Custom Header matching the premium orange banking design */}
      <div className="bg-gradient-to-br from-[#FF8A3D] to-[#F57C00] rounded-b-[32px] pt-12 pb-6 px-6 text-white shadow-lg relative z-20 shrink-0">
         <div className="flex justify-between items-center mb-4">
            <button onClick={goBack} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm active:scale-95 transition-transform">
               <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-3">
               <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Filter className="w-5 h-5" />
               </button>
               <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#FF8A3D]"></span>
               </button>
            </div>
         </div>
         <div className="text-center">
            <h1 className="text-[22px] font-extrabold tracking-wide mb-1">खर्च विवरण (Expenses)</h1>
            <p className="text-white/80 text-[13px] font-medium">समिति के खर्च की जानकारी</p>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex px-6 pt-6 gap-4 shrink-0">
        <button 
          onClick={() => setActiveTab('REGISTER')}
          className={`flex-1 py-3 text-[13px] font-bold rounded-2xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'REGISTER' 
              ? 'bg-orange-100 text-orange-700 shadow-sm border border-orange-200' 
              : 'bg-white text-slate-500 border border-slate-200'
          }`}
        >
          <Receipt className="w-4 h-4" /> Expense Register
        </button>
        <button 
          onClick={() => setActiveTab('CREDIT_LIST')}
          className={`flex-1 py-3 text-[13px] font-bold rounded-2xl transition-all relative flex items-center justify-center gap-2 ${
            activeTab === 'CREDIT_LIST' 
              ? 'bg-orange-100 text-orange-700 shadow-sm border border-orange-200' 
              : 'bg-white text-slate-500 border border-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" /> Credit List
          {outstandingCredits.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center border-2 border-[#FAFAFA] font-bold shadow-sm">
              {outstandingCredits.length}
            </span>
          )}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="p-4 flex-1 overflow-y-auto pb-32">
        {activeTab === 'REGISTER' ? (
          <div className="space-y-4">
             {/* Expense Stats Card Box (Chanda Theme Style) */}
             <div className="bg-gradient-to-br from-[#FF5A5F] to-[#D12B30] rounded-[28px] p-6 text-white shadow-[0_8px_30px_rgba(255,90,95,0.3)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                
                <div className="flex justify-between items-start mb-2 relative z-10">
                  <div>
                    <p className="text-[13px] font-semibold opacity-90">कुल खर्च (Total Expense)</p>
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
                       <p className="text-[12px] opacity-90">नकद (Cash Paid)</p>
                    </div>
                    <p className="text-[14px] font-bold">{formatCurrency(stats.totalPaid)}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-amber-300"></div>
                       <p className="text-[12px] opacity-90">बाकी उधार (Pending Credit)</p>
                    </div>
                    <p className="text-[14px] font-bold">{formatCurrency(stats.outstandingCredit)}</p>
                  </div>
                </div>
             </div>

             {/* Expense List */}
             {expenses.length === 0 ? (
               <div className="bg-white rounded-[24px] p-8 text-center border border-slate-100 shadow-sm mt-8">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Receipt className="w-8 h-8 text-slate-300" />
                 </div>
                 <p className="text-slate-500 font-medium text-[14px]">No expenses recorded yet.</p>
               </div>
             ) : (
               <div className="space-y-3">
                 {expenses.map((expense) => (
                   <div key={expense.id} className="bg-white rounded-[20px] p-4 border border-slate-100 shadow-sm relative overflow-hidden group">
                     {expense.status === 'PENDING' && (
                       <div className="absolute top-0 right-0 w-2 h-full bg-rose-500"></div>
                     )}
                     
                     <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                             <Receipt className="w-5 h-5 text-slate-400" />
                           </div>
                           <div>
                             <p className="text-[10px] font-extrabold text-slate-400 mb-0.5">{expense.expenseNo} • {new Date(expense.date).toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'})}</p>
                             <h4 className="text-[14px] font-bold text-slate-800 line-clamp-1">{expense.vendorName}</h4>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[16px] font-extrabold text-slate-800">{formatCurrency(expense.amount)}</p>
                           <p className="text-[10px] font-bold text-slate-500 mt-0.5 bg-slate-100 px-2 py-0.5 rounded-full inline-block">{expense.category}</p>
                        </div>
                     </div>

                     <p className="text-[13px] font-medium text-slate-600 mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 line-clamp-2">
                       {expense.description}
                     </p>

                     <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                           <span className={`text-[10px] font-extrabold px-2 py-1 rounded-md uppercase tracking-wider ${
                             expense.paymentType === 'CREDIT' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                           }`}>
                             {expense.paymentType}
                           </span>
                           {expense.paymentType === 'CREDIT' && (
                             <span className={`text-[10px] font-extrabold px-2 py-1 rounded-md uppercase tracking-wider ${
                               expense.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                             }`}>
                               {expense.status}
                             </span>
                           )}
                           {expense.billPhoto && (
                             <button 
                               onClick={() => setViewerImageId(expense.billPhoto!)}
                               className="w-6 h-6 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center border border-blue-100 active:scale-90"
                             >
                               <FileText className="w-3 h-3" />
                             </button>
                           )}
                        </div>

                        <div className="flex items-center gap-1.5">
                           <button onClick={() => setAuditExpense(expense)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full active:scale-90 transition-transform">
                             <Info className="w-4 h-4" />
                           </button>
                           <button onClick={() => setEditExpense(expense)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full active:scale-90 transition-transform">
                             <Edit className="w-4 h-4" />
                           </button>
                           <button onClick={() => handleDelete(expense)} className="p-2 text-rose-400 hover:bg-rose-50 rounded-full active:scale-90 transition-transform">
                             <Trash className="w-4 h-4" />
                           </button>
                        </div>
                     </div>

                   </div>
                 ))}
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
               <div className="space-y-3">
                 {outstandingCredits.map(expense => (
                   <div key={expense.id} className="bg-white rounded-[20px] p-4 border border-rose-100 shadow-sm relative overflow-hidden">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-[10px] font-extrabold text-rose-400 uppercase tracking-wider mb-1">Due Date: {expense.dueDate ? new Date(expense.dueDate).toLocaleDateString() : 'N/A'}</p>
                          <h4 className="text-[15px] font-bold text-slate-800">{expense.vendorName}</h4>
                          <p className="text-[12px] font-medium text-slate-500 mt-0.5">{expense.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[18px] font-extrabold text-rose-600">{formatCurrency(expense.amount - expense.paidAmount)}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-0.5">Remaining out of {formatCurrency(expense.amount)}</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => setPayCreditExpense(expense)}
                        className="w-full mt-2 py-3 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-[14px] font-bold text-[13px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                      >
                        <IndianRupee className="w-4 h-4" /> Pay Credit
                      </button>
                   </div>
                 ))}
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
