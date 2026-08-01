import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, FileText, Tag, User } from 'lucide-react';
import { Transaction } from '../types';

interface EditTransactionModalProps {
  transaction: Transaction;
  onClose: () => void;
  updateTransaction: (id: string, updatedData: Partial<Transaction>) => void;
}

export function EditTransactionModal({ transaction, onClose, updateTransaction }: EditTransactionModalProps) {
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [date, setDate] = useState(transaction.date);
  const [description, setDescription] = useState(transaction.description || '');
  const [category, setCategory] = useState(transaction.category);
  const [paymentMethod, setPaymentMethod] = useState(transaction.paymentMethod);
  const [vendorName, setVendorName] = useState(transaction.vendorName || '');
  const [donorName, setDonorName] = useState(transaction.donorName || '');

  const isExpense = transaction.type === 'EXPENSE';
  const isDeposit = transaction.type === 'DEPOSIT';

  const expenseCategories = ['Tent & Light', 'Prasad & Bhog', 'Murti & Decoration', 'Baja & Sound', 'Visarjan', 'Other'];
  const depositCategories = ['मासिक चंदा (Monthly)', 'गणेश चतुर्थी चंदा', 'दान (Donation)', 'अन्य जमा (Other)'];
  const methods = isExpense ? ['CASH', 'UPI', 'BANK', 'CREDIT'] : ['CASH', 'UPI', 'BANK'];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    updateTransaction(transaction.id, {
      amount: Number(amount),
      date,
      description,
      category,
      paymentMethod: paymentMethod as any,
      ...(isExpense && paymentMethod === 'CREDIT' ? { vendorName } : {}),
      ...(isDeposit && transaction.memberId === null ? { donorName } : {})
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-[100] flex justify-center items-end sm:items-center backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full sm:w-[450px] rounded-t-[32px] sm:rounded-[32px] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:fade-in duration-300">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">लेन-देन संपादित करें (Edit)</h2>
          <button onClick={onClose} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 shadow-sm transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="overflow-y-auto p-6 space-y-5">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <DollarSign className="w-5 h-5 text-slate-400" />
              </div>
              <input 
                type="number" 
                value={amount} onChange={e => setAmount(e.target.value)}
                placeholder="राशि (Amount)"
                className="w-full h-[54px] bg-white border border-slate-200 text-slate-800 text-[15px] rounded-[16px] pl-12 pr-4 focus:outline-none focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] font-bold placeholder:font-medium"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Calendar className="w-5 h-5 text-slate-400" />
              </div>
              <input 
                type="date" 
                value={date} onChange={e => setDate(e.target.value)}
                className="w-full h-[54px] bg-white border border-slate-200 text-slate-800 text-[15px] rounded-[16px] pl-12 pr-4 focus:outline-none focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] font-bold"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute top-4 left-4 pointer-events-none">
                <Tag className="w-5 h-5 text-slate-400" />
              </div>
              <select 
                value={category} onChange={e => setCategory(e.target.value)}
                className="w-full h-[54px] bg-white border border-slate-200 text-slate-800 text-[15px] rounded-[16px] pl-12 pr-4 focus:outline-none focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] font-bold appearance-none"
              >
                {(isExpense ? expenseCategories : depositCategories).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
                {!isExpense && !depositCategories.includes(category) && !expenseCategories.includes(category) && (
                  <option value={category}>{category}</option>
                )}
              </select>
            </div>

            <div className="relative">
              <div className="absolute top-4 left-4 pointer-events-none">
                <FileText className="w-5 h-5 text-slate-400" />
              </div>
              <textarea 
                value={description} onChange={e => setDescription(e.target.value)}
                placeholder="विवरण (Description)"
                className="w-full h-[80px] py-4 bg-white border border-slate-200 text-slate-800 text-[15px] rounded-[16px] pl-12 pr-4 focus:outline-none focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] font-medium resize-none"
              />
            </div>

            {isDeposit && !transaction.memberId && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  value={donorName} onChange={e => setDonorName(e.target.value)}
                  placeholder="दानदाता का नाम (Donor Name)"
                  className="w-full h-[54px] bg-white border border-slate-200 text-slate-800 text-[15px] rounded-[16px] pl-12 pr-4 focus:outline-none focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] font-bold"
                />
              </div>
            )}

            {isExpense && paymentMethod === 'CREDIT' && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  value={vendorName} onChange={e => setVendorName(e.target.value)}
                  placeholder="दुकानदार का नाम (Vendor Name)"
                  className="w-full h-[54px] bg-white border border-slate-200 text-slate-800 text-[15px] rounded-[16px] pl-12 pr-4 focus:outline-none focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] font-bold"
                />
              </div>
            )}

            <div className="grid grid-cols-4 gap-2 pt-2">
              {methods.map(method => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method as any)}
                  className={`py-3 rounded-xl text-[12px] font-bold transition-all ${
                    paymentMethod === method 
                      ? 'bg-slate-800 text-white shadow-md scale-[1.02]' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full py-4 bg-[#FF6508] text-white rounded-[16px] font-bold text-[16px] shadow-[0_8px_20px_rgba(255,101,8,0.3)] active:scale-[0.98] transition-transform"
            >
              सेव करें (Save Changes)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
