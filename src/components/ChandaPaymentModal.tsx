import { useState } from 'react';
import { IndianRupee, X } from 'lucide-react';
import { useChandaData } from '../hooks/useChandaData';
import toast from 'react-hot-toast';

interface ChandaPaymentModalProps {
  chandaId: string;
  donorName: string;
  totalAmount: number;
  paidAmount: number;
  onClose: () => void;
}

export function ChandaPaymentModal({ chandaId, donorName, totalAmount, paidAmount, onClose }: ChandaPaymentModalProps) {
  const { receivePayment } = useChandaData();
  const pendingAmount = totalAmount - paidAmount;
  
  const [receiveAmount, setReceiveAmount] = useState<string>(pendingAmount.toString());
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI' | 'BANK'>('CASH');
  const [remark, setRemark] = useState('');

  const handleSave = () => {
    const num = Number(receiveAmount);
    if (isNaN(num) || num <= 0) {
      toast.error('Invalid amount!');
      return;
    }
    if (num > pendingAmount) {
      toast.error(`Cannot receive more than pending amount (₹${pendingAmount})`);
      return;
    }

    receivePayment(chandaId, num, paymentMethod, remark);
    toast.success('Payment Received!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl relative animate-in slide-in-from-bottom-8 duration-300">
        
        <div className="bg-amber-500 py-4 px-6 flex items-center justify-between">
          <h3 className="text-white font-bold text-[16px]">Receive Payment</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white active:scale-90 transition-transform">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
             <p className="text-[12px] font-bold text-slate-400 mb-1">Donor</p>
             <p className="text-[15px] font-bold text-slate-800">{donorName}</p>
          </div>

          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
             <div>
                <p className="text-[11px] font-bold text-slate-500">Previous Balance</p>
                <p className="text-[16px] font-extrabold text-amber-600">₹{pendingAmount}</p>
             </div>
             <div className="text-right">
                <p className="text-[11px] font-bold text-slate-500">Total Chanda</p>
                <p className="text-[14px] font-bold text-slate-800">₹{totalAmount}</p>
             </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-emerald-500" /> Receive Amount
            </label>
            <input 
              type="number" 
              value={receiveAmount}
              onChange={(e) => setReceiveAmount(e.target.value)}
              className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-[18px] font-extrabold text-emerald-600 focus:ring-2 focus:ring-emerald-500/30 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700">Payment Method</label>
            <div className="flex bg-slate-50 p-1.5 rounded-[18px]">
              {['CASH', 'UPI', 'BANK'].map((method) => (
                <button 
                  key={method}
                  onClick={() => setPaymentMethod(method as any)}
                  className={`flex-1 py-2 text-[11px] font-bold rounded-[14px] transition-all ${paymentMethod === method ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700">Remark</label>
            <input 
              type="text" 
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Any notes..."
              className="w-full bg-slate-50 border-0 rounded-xl p-3 text-[13px] text-slate-800 focus:ring-2 focus:ring-slate-500/30 outline-none"
            />
          </div>

          <button 
            onClick={handleSave}
            className="w-full bg-emerald-500 text-white py-4 rounded-[20px] font-bold text-[15px] shadow-[0_8px_20px_rgba(16,185,129,0.3)] active:scale-[0.98] transition-transform"
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
}
