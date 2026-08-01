import { useState } from 'react';
import { IndianRupee, X, Tag, FileText, Camera, Building, Calendar, WalletCards } from 'lucide-react';
import { useExpenseData } from '../hooks/useExpenseData';
import { Expense } from '../types';
import toast from 'react-hot-toast';

interface ExpenseEditModalProps {
  expense: Expense;
  onClose: () => void;
}

export function ExpenseEditModal({ expense, onClose }: ExpenseEditModalProps) {
  const { updateExpense } = useExpenseData();
  
  const [date, setDate] = useState(expense.date);
  const [vendorName, setVendorName] = useState(expense.vendorName);
  const [description, setDescription] = useState(expense.description);
  const [amount, setAmount] = useState(expense.amount.toString());
  const [dueDate, setDueDate] = useState(expense.dueDate || '');

  const handleSave = () => {
    const numAmount = Number(amount);
    
    if (!description.trim()) {
      toast.error('Description is required');
      return;
    }
    
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Invalid amount!');
      return;
    }

    if (expense.paymentType === 'CREDIT' && numAmount < expense.paidAmount) {
      toast.error(`Amount cannot be less than already paid amount (₹${expense.paidAmount})`);
      return;
    }

    // Auto-update status if it was credit and new amount matches paid amount
    let newStatus = expense.status;
    if (expense.paymentType === 'CREDIT') {
       if (expense.paidAmount >= numAmount) {
          newStatus = 'PAID';
       } else {
          newStatus = 'PENDING';
       }
    }

    // Auto-update paid amount if it was not credit
    let newPaidAmount = expense.paidAmount;
    if (expense.paymentType !== 'CREDIT') {
       newPaidAmount = numAmount;
    }

    updateExpense(expense.id, {
      date,
      vendorName,
      description,
      amount: numAmount,
      paidAmount: newPaidAmount,
      status: newStatus,
      dueDate: expense.paymentType === 'CREDIT' ? dueDate : undefined
    });

    toast.success('Record Updated Successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl relative animate-in slide-in-from-bottom-8 duration-300">
        
        <div className="bg-orange-600 py-4 px-6 flex items-center justify-between">
          <h3 className="text-white font-bold text-[16px]">Edit Expense Record</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white active:scale-90 transition-transform">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500" /> Date
            </label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-[14px] font-bold text-slate-800 focus:ring-2 focus:ring-orange-500/30 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
              <Building className="w-4 h-4 text-orange-500" /> Vendor Name
            </label>
            <input 
              type="text" 
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-[14px] font-bold text-slate-800 focus:ring-2 focus:ring-orange-500/30 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-500" /> Description
            </label>
            <input 
              type="text" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-[14px] font-bold text-slate-800 focus:ring-2 focus:ring-orange-500/30 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-orange-500" /> Total Amount
            </label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-[16px] font-extrabold text-orange-600 focus:ring-2 focus:ring-orange-500/30 outline-none"
            />
          </div>

          {expense.paymentType === 'CREDIT' && (
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-500" /> Due Date
              </label>
              <input 
                type="date" 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-[14px] font-bold text-slate-800 focus:ring-2 focus:ring-orange-500/30 outline-none"
              />
            </div>
          )}

          <div className="pt-4">
            <button 
              onClick={handleSave}
              className="w-full bg-orange-600 text-white py-4 rounded-[20px] font-bold text-[15px] shadow-[0_8px_20px_rgba(234,88,12,0.3)] active:scale-[0.98] transition-transform"
            >
              Update Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
