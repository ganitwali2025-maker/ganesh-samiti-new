import { useState, useEffect } from 'react';
import { IndianRupee, X, User, Phone, MapPin } from 'lucide-react';
import { useChandaData } from '../hooks/useChandaData';
import { Chanda } from '../types';
import toast from 'react-hot-toast';

interface ChandaEditModalProps {
  chanda: Chanda;
  onClose: () => void;
}

export function ChandaEditModal({ chanda, onClose }: ChandaEditModalProps) {
  const { updateChanda } = useChandaData();
  
  const [donorName, setDonorName] = useState(chanda.donorName);
  const [mobileNumber, setMobileNumber] = useState(chanda.mobileNumber || '');
  const [address, setAddress] = useState(chanda.address || '');
  const [amount, setAmount] = useState(chanda.amount.toString());

  const handleSave = () => {
    const numAmount = Number(amount);
    
    if (!donorName.trim()) {
      toast.error('Donor name cannot be empty');
      return;
    }
    
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Invalid amount!');
      return;
    }

    if (chanda.paymentType === 'CREDIT' && numAmount < chanda.paidAmount) {
      toast.error(`Amount cannot be less than already paid amount (₹${chanda.paidAmount})`);
      return;
    }

    // Auto-update status if it was credit and new amount matches paid amount
    let newStatus = chanda.status;
    if (chanda.paymentType === 'CREDIT') {
       if (chanda.paidAmount >= numAmount) {
          newStatus = 'PAID';
       } else {
          newStatus = 'PENDING';
       }
    }

    // Auto-update paid amount if it was cash
    let newPaidAmount = chanda.paidAmount;
    if (chanda.paymentType === 'CASH') {
       newPaidAmount = numAmount;
    }

    updateChanda(chanda.id, {
      donorName,
      mobileNumber,
      address,
      amount: numAmount,
      paidAmount: newPaidAmount,
      status: newStatus
    });

    toast.success('Record Updated Successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl relative animate-in slide-in-from-bottom-8 duration-300">
        
        <div className="bg-blue-600 py-4 px-6 flex items-center justify-between">
          <h3 className="text-white font-bold text-[16px]">Edit Chanda Record</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white active:scale-90 transition-transform">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" /> Donor Name
            </label>
            <input 
              type="text" 
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-[14px] font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/30 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-blue-500" /> Total Amount
            </label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-[16px] font-extrabold text-blue-600 focus:ring-2 focus:ring-blue-500/30 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-500" /> Mobile Number
            </label>
            <input 
              type="tel" 
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-[14px] font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/30 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" /> Address
            </label>
            <input 
              type="text" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-[14px] font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/30 outline-none"
            />
          </div>

          <div className="pt-4">
            <button 
              onClick={handleSave}
              className="w-full bg-blue-600 text-white py-4 rounded-[20px] font-bold text-[15px] shadow-[0_8px_20px_rgba(37,99,235,0.3)] active:scale-[0.98] transition-transform"
            >
              Update Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
