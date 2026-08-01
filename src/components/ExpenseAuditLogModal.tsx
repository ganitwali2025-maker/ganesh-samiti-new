import { X, History, PlusCircle, Edit, Trash, Banknote, ShieldAlert } from 'lucide-react';
import { useExpenseData } from '../hooks/useExpenseData';
import { Expense } from '../types';

interface ExpenseAuditLogModalProps {
  expense: Expense;
  onClose: () => void;
}

export function ExpenseAuditLogModal({ expense, onClose }: ExpenseAuditLogModalProps) {
  const { auditLogs } = useExpenseData();
  
  const relatedLogs = auditLogs.filter(log => log.recordId === expense.id);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE': return <PlusCircle className="w-5 h-5 text-emerald-500" />;
      case 'UPDATE': return <Edit className="w-5 h-5 text-amber-500" />;
      case 'DELETE': return <Trash className="w-5 h-5 text-rose-500" />;
      case 'PAYMENT_MADE': return <Banknote className="w-5 h-5 text-blue-500" />;
      default: return <ShieldAlert className="w-5 h-5 text-slate-500" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'UPDATE': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'DELETE': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'PAYMENT_MADE': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl relative animate-in slide-in-from-bottom-8 duration-300 max-h-[85vh] flex flex-col">
        
        <div className="bg-slate-800 py-4 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-white">
             <History className="w-5 h-5" />
             <h3 className="font-bold text-[16px]">Audit Log (Activity)</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white active:scale-90 transition-transform">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-slate-50 border-b border-slate-200 shrink-0">
           <p className="text-[12px] font-bold text-slate-500">Record Info</p>
           <p className="text-[14px] font-extrabold text-slate-800">{expense.expenseNo} - {expense.vendorName}</p>
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {relatedLogs.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <History className="w-10 h-10 mx-auto mb-2 opacity-20" />
              <p className="text-[13px] font-medium">No activity found for this record.</p>
            </div>
          ) : (
            <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-6 py-2">
              {relatedLogs.map((log) => (
                <div key={log.id} className="relative">
                  <div className="absolute -left-[35px] top-0 bg-white rounded-full p-0.5">
                     <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shadow-sm">
                       {getActionIcon(log.action)}
                     </div>
                  </div>
                  <div className={`p-3 rounded-2xl border ${getActionColor(log.action)}`}>
                     <div className="flex justify-between items-start mb-1">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider opacity-80">{log.action}</span>
                        <span className="text-[10px] font-bold opacity-60">
                           {new Date(log.createdAt).toLocaleString('en-IN', {
                              day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                           })}
                        </span>
                     </div>
                     <p className="text-[13px] font-medium leading-snug">{log.changes}</p>
                     <p className="text-[10px] font-bold mt-2 opacity-60">By: {log.createdBy}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
