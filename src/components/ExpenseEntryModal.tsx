import { useState } from 'react';
import { IndianRupee, X, Tag, FileText, Camera, Building, Calendar, WalletCards } from 'lucide-react';
import { useExpenseData } from '../hooks/useExpenseData';
import toast from 'react-hot-toast';
import { ImageUploader } from './ImageUploader';

interface ExpenseEntryModalProps {
  onClose: () => void;
}

const CATEGORIES = [
  { id: 'मूर्ति', label: 'मूर्ति (Idol)', icon: '🛕' },
  { id: 'सजावट', label: 'सजावट (Decor)', icon: '🏵️' },
  { id: 'प्रसाद', label: 'प्रसाद (Food)', icon: '🍲' },
  { id: 'कार्यक्रम', label: 'कार्यक्रम (Event)', icon: '🎪' },
  { id: 'ध्वनि / लाइट', label: 'ध्वनि / लाइट (Sound/Light)', icon: '🔈' },
  { id: 'अन्य', label: 'अन्य (Other)', icon: '📦' }
];

export function ExpenseEntryModal({ onClose }: ExpenseEntryModalProps) {
  const { addExpense } = useExpenseData();
  
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [vendorName, setVendorName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentType, setPaymentType] = useState<'CASH' | 'CREDIT' | 'UPI' | 'BANK'>('CASH');
  const [dueDate, setDueDate] = useState('');
  const [remark, setRemark] = useState('');
  const [billPhoto, setBillPhoto] = useState('');

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

    if (paymentType === 'CREDIT' && !vendorName.trim()) {
      toast.error('Vendor Name is required for Credit Expense');
      return;
    }

    addExpense({
      date,
      vendorName: vendorName.trim() || 'General Expense',
      category,
      description,
      amount: numAmount,
      paymentType,
      dueDate: paymentType === 'CREDIT' ? dueDate : undefined,
      paidAmount: paymentType === 'CREDIT' ? 0 : numAmount,
      status: paymentType === 'CREDIT' ? 'PENDING' : 'PAID',
      remark,
      billPhoto,
      invoicePhoto: '',
      otherPhoto: ''
    });

    toast.success('Expense Added Successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full sm:max-w-lg rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl relative animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-8 duration-500 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-4 px-6 flex items-center justify-between shrink-0">
          <h3 className="text-white font-extrabold text-[18px]">नया खर्च (New Expense)</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white active:scale-90 transition-transform">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-5 bg-[#FAFAFA]">
          {/* Amount & Date */}
          <div className="flex gap-4">
             <div className="flex-1 space-y-1.5">
               <label className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
                 <IndianRupee className="w-4 h-4 text-orange-500" /> Amount
               </label>
               <input 
                 type="number" 
                 value={amount}
                 onChange={(e) => setAmount(e.target.value)}
                 className="w-full bg-white border border-slate-200 rounded-2xl p-3.5 text-[18px] font-extrabold text-orange-600 focus:ring-2 focus:ring-orange-500/30 outline-none shadow-sm"
                 placeholder="₹0.00"
               />
             </div>
             <div className="flex-1 space-y-1.5">
               <label className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
                 <Calendar className="w-4 h-4 text-orange-500" /> Date
               </label>
               <input 
                 type="date" 
                 value={date}
                 onChange={(e) => setDate(e.target.value)}
                 className="w-full bg-white border border-slate-200 rounded-2xl p-3.5 text-[14px] font-bold text-slate-800 focus:ring-2 focus:ring-orange-500/30 outline-none shadow-sm"
               />
             </div>
          </div>

          {/* Payment Type */}
          <div className="space-y-2">
             <label className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
               <WalletCards className="w-4 h-4 text-orange-500" /> Payment Type
             </label>
             <div className="grid grid-cols-4 gap-2">
               {(['CASH', 'UPI', 'BANK', 'CREDIT'] as const).map(type => (
                 <button
                   key={type}
                   onClick={() => setPaymentType(type)}
                   className={`py-3 rounded-2xl text-[12px] font-bold border transition-all ${
                     paymentType === type 
                       ? 'bg-orange-500 text-white border-orange-500 shadow-md' 
                       : 'bg-white text-slate-500 border-slate-200 hover:bg-orange-50'
                   }`}
                 >
                   {type}
                 </button>
               ))}
             </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
             <label className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
               <Tag className="w-4 h-4 text-orange-500" /> Category
             </label>
             <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x">
                {CATEGORIES.map((c) => (
                  <button 
                    key={c.id} 
                    onClick={() => setCategory(c.id)}
                    className={`whitespace-nowrap px-4 py-2.5 rounded-full text-[13px] font-bold snap-center transition-all flex items-center gap-2 border ${
                      category === c.id 
                        ? 'bg-orange-100 text-orange-700 border-orange-200 shadow-sm' 
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    <span>{c.icon}</span>
                    {c.label}
                  </button>
                ))}
             </div>
          </div>

          {/* Conditional Credit Fields */}
          {paymentType === 'CREDIT' && (
            <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
                  <Building className="w-4 h-4 text-orange-500" /> Vendor Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full bg-white border border-orange-200 rounded-xl p-3 text-[14px] font-bold text-slate-800 focus:ring-2 focus:ring-orange-500/30 outline-none"
                  placeholder="E.g., Sharma Tent House"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-500" /> Due Date (Optional)
                </label>
                <input 
                  type="date" 
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-white border border-orange-200 rounded-xl p-3 text-[14px] font-bold text-slate-800 focus:ring-2 focus:ring-orange-500/30 outline-none"
                />
              </div>
            </div>
          )}

          {(paymentType === 'CASH' || paymentType === 'UPI' || paymentType === 'BANK') && (
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
                <Building className="w-4 h-4 text-orange-500" /> Vendor Name (Optional)
              </label>
              <input 
                type="text" 
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3.5 text-[14px] font-bold text-slate-800 focus:ring-2 focus:ring-orange-500/30 outline-none"
                placeholder="E.g., Sharma Tent House"
              />
            </div>
          )}

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-500" /> Description <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl p-3.5 text-[14px] font-bold text-slate-800 focus:ring-2 focus:ring-orange-500/30 outline-none shadow-sm"
              placeholder="What was this expense for?"
            />
          </div>

          {/* Bill Photo */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
              <Camera className="w-4 h-4 text-orange-500" /> Bill / Receipt Photo (Optional)
            </label>
            <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm">
               <ImageUploader 
                 image={billPhoto}
                 onImageChange={setBillPhoto}
                 label="Upload Bill"
               />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
          <button 
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-[20px] font-bold text-[15px] shadow-[0_8px_20px_rgba(249,115,22,0.3)] active:scale-[0.98] transition-transform"
          >
            Save Expense
          </button>
        </div>

      </div>
    </div>
  );
}
