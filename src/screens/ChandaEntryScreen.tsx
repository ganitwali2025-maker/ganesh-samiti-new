import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { useNavigation } from '../context/NavigationContext';
import { useChandaData } from '../hooks/useChandaData';
import { Calendar, User, Phone, MapPin, IndianRupee, Save, FileText, ArrowLeft } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export function ChandaEntryScreen() {
  const { navigate } = useNavigation();
  const { addChanda } = useChandaData();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [donorName, setDonorName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentType, setPaymentType] = useState<'CASH' | 'CREDIT'>('CASH');
  
  // Credit specific fields
  const [dueDate, setDueDate] = useState('');
  const [remark, setRemark] = useState('');

  const handleSave = () => {
    if (!date || !donorName || !amount) {
      toast.error('Date, Name, and Amount are required!');
      return;
    }

    if (paymentType === 'CREDIT' && !dueDate) {
      toast.error('Due Date is required for Credit payments!');
      return;
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error('Enter a valid amount!');
      return;
    }

    addChanda({
      date,
      donorName,
      mobileNumber,
      address,
      amount: numericAmount,
      paymentType,
      dueDate: paymentType === 'CREDIT' ? dueDate : undefined,
      paidAmount: paymentType === 'CASH' ? numericAmount : 0,
      status: paymentType === 'CASH' ? 'PAID' : 'PENDING',
      remark
    });

    toast.success('Chanda Saved Successfully!');
    setTimeout(() => navigate('chanda'), 1000);
  };

  return (
    <div className="flex flex-col h-full bg-[#FFF8F1]">
      <Toaster position="top-center" />
      <div className="bg-theme-gradient pt-6 pb-6 px-4 rounded-b-[32px] shadow-sm flex items-center justify-between z-10 relative">
         <div className="flex items-center gap-3">
            <button 
               onClick={() => navigate('chanda')}
               className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm active:scale-95 transition-transform"
            >
               <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
               <h1 className="text-white text-[18px] font-extrabold tracking-wide">नया चंदा (New Entry)</h1>
            </div>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-32">
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-5 space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-theme-primary" /> जमा दिनांक (Date) <span className="text-red-500">*</span>
            </label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-[14px] text-slate-800 focus:ring-2 focus:ring-theme-primary/30 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
              <User className="w-4 h-4 text-theme-primary" /> दानदाता का नाम (Donor Name) <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="नाम दर्ज करें..."
              className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-[14px] text-slate-800 focus:ring-2 focus:ring-theme-primary/30 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
              <Phone className="w-4 h-4 text-theme-primary" /> मोबाइल नंबर (Optional)
            </label>
            <input 
              type="tel" 
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="मोबाइल नंबर दर्ज करें..."
              className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-[14px] text-slate-800 focus:ring-2 focus:ring-theme-primary/30 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-theme-primary" /> पता (Address) (Optional)
            </label>
            <input 
              type="text" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="पता दर्ज करें..."
              className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-[14px] text-slate-800 focus:ring-2 focus:ring-theme-primary/30 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-theme-primary" /> चंदा राशि (Amount) <span className="text-red-500">*</span>
            </label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-[16px] font-bold text-theme-primary focus:ring-2 focus:ring-theme-primary/30 outline-none"
            />
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-[13px] font-bold text-slate-700 mb-2 block">भुगतान प्रकार (Payment Type)</label>
            <div className="flex bg-slate-50 p-1.5 rounded-[18px]">
              <button 
                onClick={() => setPaymentType('CASH')}
                className={`flex-1 py-3 text-[13px] font-bold rounded-[14px] transition-all ${paymentType === 'CASH' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
              >
                नकद (Cash)
              </button>
              <button 
                onClick={() => setPaymentType('CREDIT')}
                className={`flex-1 py-3 text-[13px] font-bold rounded-[14px] transition-all ${paymentType === 'CREDIT' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
              >
                उधार (Credit)
              </button>
            </div>
          </div>

          {paymentType === 'CREDIT' && (
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 space-y-4 mt-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-amber-800 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" /> भुगतान की देय तिथि (Due Date) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="date" 
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-white border-0 rounded-xl p-3 text-[13px] text-slate-800 focus:ring-2 focus:ring-amber-500/30 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-amber-800 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" /> रिमार्क (Remark)
                </label>
                <input 
                  type="text" 
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="e.g. ₹2,000 remaining, payment after 5 days."
                  className="w-full bg-white border-0 rounded-xl p-3 text-[13px] text-slate-800 focus:ring-2 focus:ring-amber-500/30 outline-none"
                />
              </div>
            </div>
          )}

          <div className="pt-6 pb-2">
            <button 
              onClick={handleSave}
              className="w-full bg-theme-gradient text-white py-4 rounded-[20px] font-bold text-[16px] shadow-[0_8px_20px_rgba(255,122,0,0.3)] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Chanda
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
