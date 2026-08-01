import { useState } from 'react';
import { IndianRupee, X, WalletCards } from 'lucide-react';
import { useExpenseData } from '../hooks/useExpenseData';
import { formatCurrency } from '../utils/format';
import toast from 'react-hot-toast';

interface ExpensePaymentModalProps {
  expenseId: string;
  vendorName: string;
  totalAmount: number;
  paidAmount: number;
  onClose: () => void;
}

export function ExpensePaymentModal({ expenseId, vendorName, totalAmount, paidAmount, onClose }: ExpensePaymentModalProps) {
  const { payCredit } = useExpenseData();
  
  const remainingAmount = totalAmount - paidAmount;
  const [amount, setAmount] = useState(remainingAmount.toString());
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI' | 'BANK'>('CASH');
  const [remark, setRemark] = useState('');

  const handlePay = () => {
    const numAmount = Number(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Invalid amount!');
      return;
    }

    if (numAmount > remainingAmount) {
      toast.error(`Cannot pay more than remaining amount (${formatCurrency(remainingAmount)})`);
      return;
    }

    payCredit(expenseId, numAmount, paymentMethod, remark);
    toast.success('Payment Recorded Successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full sm:max-w-md rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl relative animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-8 duration-500">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-4 px-6 flex items-center justify-between shrink-0">
          <h3 className="text-white font-extrabold text-[16px]">Pay Credit</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white active:scale-90 transition-transform">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 bg-[#FAFAFA]">
          {/* Vendor Details */}
          <div className="bg-white rounded-[20px] p-4 border border-slate-100 shadow-sm flex flex-col gap-2">
            <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-2">
              <span className="text-[12px] font-bold text-slate-500">Vendor Name</span>
              <span className="text-[14px] font-extrabold text-slate-800">{vendorName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-bold text-slate-500">Total Bill</span>
              <span className="text-[14px] font-extrabold text-slate-800">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-bold text-slate-500">Already Paid</span>
              <span className="text-[14px] font-extrabold text-emerald-600">{formatCurrency(paidAmount)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-100 bg-orange-50 p-2 rounded-xl">
              <span className="text-[13px] font-bold text-orange-700">Remaining</span>
              <span className="text-[16px] font-extrabold text-orange-600">{formatCurrency(remainingAmount)}</span>
            </div>
          </div>

          {/* Amount to Pay */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-orange-500" /> Paying Amount
            </label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-[20px] font-extrabold text-orange-600 focus:ring-2 focus:ring-orange-500/30 outline-none shadow-sm"
              placeholder="0.00"
            />
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
             <label className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
               <WalletCards className="w-4 h-4 text-orange-500" /> Payment Method
             </label>
             <div className="grid grid-cols-3 gap-2">
               {(['CASH', 'UPI', 'BANK'] as const).map(type => (
                 <button
                   key={type}
                   onClick={() => setPaymentMethod(type)}
                   className={`py-3 rounded-2xl text-[13px] font-bold border transition-all ${
                     paymentMethod === type 
                       ? 'bg-orange-500 text-white border-orange-500 shadow-md' 
                       : 'bg-white text-slate-500 border-slate-200 hover:bg-orange-50'
                   }`}
                 >
                   {type}
                 </button>
               ))}
             </div>
          </div>

          {/* Remark */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700">Remark (Optional)</label>
            <input 
              type="text" 
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl p-3.5 text-[14px] font-bold text-slate-800 focus:ring-2 focus:ring-orange-500/30 outline-none shadow-sm"
              placeholder="Any note about this payment?"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
          <button 
            onClick={handlePay}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-[20px] font-bold text-[16px] shadow-[0_8px_20px_rgba(16,185,129,0.3)] active:scale-[0.98] transition-transform"
          >
            Confirm Payment
          </button>
        </div>

      </div>
    </div>
  );
}
