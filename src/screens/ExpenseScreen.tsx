import { useState, useMemo } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useCommitteeData } from '../hooks/useCommitteeData';
import { ArrowLeft, Filter, Bell, Receipt, Calendar, FileText, Banknote, Smartphone, Landmark, Clock, RefreshCw, Plus, CheckCircle2, X } from 'lucide-react';
import { formatCurrency } from '../utils/format';

export function ExpenseScreen() {
  const { goBack } = useNavigation();
  const { addTransaction, transactions, payCredit } = useCommitteeData();
  
  // Form State
  const [category, setCategory] = useState('मूर्ति');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI' | 'BANK' | 'CREDIT'>('CASH');
  const [remark, setRemark] = useState('');
  
  // Credit specific state
  const [vendorName, setVendorName] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'NEW' | 'CREDIT_LIST'>('NEW');

  // Pay Credit Modal State
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedCreditId, setSelectedCreditId] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState<'CASH' | 'UPI' | 'BANK'>('CASH');
  const [payRemark, setPayRemark] = useState('');

  const categories = [
    { id: 'मूर्ति', label: 'मूर्ति (Idol)', icon: '🛕' },
    { id: 'सजावट', label: 'सजावट (Decor)', icon: '🏵️' },
    { id: 'प्रसाद', label: 'प्रसाद (Food)', icon: '🍲' },
    { id: 'अन्य', label: 'अन्य (Other)', icon: '📦' }
  ];

  const handleSave = () => {
    if (Number(amount) > 0 && category && description) {
      if (paymentMethod === 'CREDIT' && !vendorName) {
        alert('Please enter Vendor Name for credit expense.');
        return;
      }
      
      addTransaction({
        memberId: null,
        amount: Number(amount),
        type: 'EXPENSE',
        category,
        date,
        description: description + (remark ? ` - ${remark}` : ''),
        paymentMethod,
        vendorName: paymentMethod === 'CREDIT' ? vendorName : undefined,
        dueDate: paymentMethod === 'CREDIT' ? dueDate : undefined,
        paidAmount: 0,
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        resetForm();
      }, 2000);
    }
  };

  const resetForm = () => {
    setCategory('मूर्ति');
    setDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setAmount('');
    setPaymentMethod('CASH');
    setRemark('');
    setVendorName('');
    setDueDate('');
  };

  const handlePayCredit = () => {
    if (selectedCreditId && Number(payAmount) > 0) {
      payCredit(selectedCreditId, Number(payAmount), payMethod, payRemark);
      setPayModalOpen(false);
      setPayAmount('');
      setPayRemark('');
      setSelectedCreditId('');
    }
  };

  // Outstanding Credits Calculation
  const outstandingCredits = useMemo(() => {
    return transactions.filter(t => t.type === 'EXPENSE' && t.paymentMethod === 'CREDIT').map(t => {
      const remaining = t.amount - (t.paidAmount || 0);
      let status = 'UNPAID';
      if (remaining === 0) status = 'PAID';
      else if ((t.paidAmount || 0) > 0) status = 'PARTIAL';
      
      return { ...t, remaining, status };
    });
  }, [transactions]);

  const selectedCreditTx = outstandingCredits.find(t => t.id === selectedCreditId);

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-[100dvh] bg-rose-500 text-white relative z-50">
        <CheckCircle2 className="w-24 h-24 mb-6 animate-bounce" />
        <h2 className="text-3xl font-extrabold mb-2">सफल! (Success)</h2>
        <p className="text-rose-100 font-medium text-lg">₹{amount} खर्च दर्ज हो गया।</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Custom Header matching the screenshot */}
      <div className="bg-gradient-to-br from-[#FF8A3D] to-[#F57C00] rounded-b-[32px] pt-12 pb-6 px-6 text-white shadow-lg relative z-20">
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
            <h1 className="text-[22px] font-extrabold tracking-wide mb-1">खर्च विवरण</h1>
            <p className="text-white/80 text-[13px] font-medium">समिति के खर्च की जानकारी दर्ज करें</p>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex px-6 pt-6 gap-4">
        <button 
          onClick={() => setActiveTab('NEW')}
          className={`flex-1 py-3 text-sm font-bold rounded-2xl transition-all ${activeTab === 'NEW' ? 'bg-orange-100 text-orange-700 shadow-sm' : 'bg-white text-slate-500 border border-slate-100'}`}
        >
          नया खर्च (New Expense)
        </button>
        <button 
          onClick={() => setActiveTab('CREDIT_LIST')}
          className={`flex-1 py-3 text-sm font-bold rounded-2xl transition-all relative ${activeTab === 'CREDIT_LIST' ? 'bg-orange-100 text-orange-700 shadow-sm' : 'bg-white text-slate-500 border border-slate-100'}`}
        >
          उधार सूची (Credit List)
          {outstandingCredits.filter(c => c.status !== 'PAID').length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center">
              {outstandingCredits.filter(c => c.status !== 'PAID').length}
            </span>
          )}
        </button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto pb-28">
        
        {activeTab === 'NEW' ? (
          <div className="space-y-6">
            {/* Total Expense Highlight Card */}
            <div className="bg-rose-50/80 backdrop-blur-md rounded-[28px] p-5 shadow-sm border border-rose-100 flex justify-between items-center">
               <div>
                  <p className="text-[12px] font-bold text-rose-600 mb-1">कुल खर्च (Total Expense)</p>
                  <h2 className="text-3xl font-extrabold text-rose-600">₹{amount || '0.00'}</h2>
               </div>
               <div className="w-14 h-14 bg-rose-100/80 rounded-2xl flex items-center justify-center text-rose-500">
                  <Receipt className="w-7 h-7" />
               </div>
            </div>

            {/* Category Pills */}
            <div>
               <label className="text-[13px] font-bold text-slate-700 mb-3 block">खर्च का प्रकार (Category)</label>
               <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                  {categories.map((c) => (
                    <button 
                      key={c.id} 
                      onClick={() => setCategory(c.id)}
                      className={`whitespace-nowrap px-4 py-2.5 rounded-full text-[13px] font-bold snap-center transition-all flex items-center gap-2 ${
                        category === c.id 
                          ? 'bg-gradient-to-r from-[#FF8A3D] to-[#F57C00] text-white shadow-md' 
                          : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      <span>{c.icon}</span>
                      {c.label}
                    </button>
                  ))}
               </div>
            </div>

            {/* Date */}
            <div>
               <label className="text-[13px] font-bold text-slate-700 mb-2 block">खर्च दिनांक (Date)</label>
               <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <Calendar className="w-5 h-5 text-orange-500" />
                  </div>
                  <input 
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-800 text-[14px] rounded-[18px] pl-12 pr-4 py-3.5 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all font-bold shadow-sm"
                  />
               </div>
            </div>

            {/* Description */}
            <div>
               <label className="text-[13px] font-bold text-slate-700 mb-2 block">विवरण (Expense Description)</label>
               <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <FileText className="w-5 h-5 text-slate-400" />
                  </div>
                  <input 
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="खर्च का विवरण लिखें..."
                    className="w-full bg-white border border-slate-200 text-slate-800 text-[14px] rounded-[18px] pl-12 pr-4 py-3.5 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all font-medium shadow-sm"
                  />
               </div>
            </div>

            {/* Amount */}
            <div>
               <label className="text-[13px] font-bold text-slate-700 mb-2 block">राशि (Amount)</label>
               <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-[12px]">₹</div>
                  </div>
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-white border border-slate-200 text-slate-800 text-lg rounded-[18px] pl-12 pr-4 py-3 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all font-bold shadow-sm"
                  />
               </div>
            </div>

            {/* Payment Method Segmented Control */}
            <div>
              <label className="text-[13px] font-bold text-slate-700 mb-2 block">भुगतान का तरीका (Payment Method)</label>
              <div className="flex gap-2">
                {[
                  { id: 'CASH', icon: Banknote, label: 'नकद (Cash)' },
                  { id: 'CREDIT', icon: Clock, label: 'उधार (Credit)' },
                  { id: 'UPI', icon: Smartphone, label: 'UPI' },
                  { id: 'BANK', icon: Landmark, label: 'बैंक (Bank)' },
                ].map(method => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl transition-all duration-300 border ${
                      paymentMethod === method.id 
                        ? 'bg-orange-50 border-orange-400 text-orange-600 shadow-sm' 
                        : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <method.icon className={`w-5 h-5 ${paymentMethod === method.id ? 'text-orange-500' : 'text-slate-400'}`} />
                    <span className={`text-[10px] ${paymentMethod === method.id ? 'font-bold' : 'font-medium'}`}>{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Extra fields for Credit */}
            {paymentMethod === 'CREDIT' && (
              <div className="bg-orange-50/50 p-4 rounded-[20px] border border-orange-100 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <div>
                   <label className="text-[12px] font-bold text-orange-800 mb-2 block">वेंडर का नाम (Vendor Name)</label>
                   <input 
                     type="text"
                     value={vendorName}
                     onChange={(e) => setVendorName(e.target.value)}
                     placeholder="दुकानदार या वेंडर का नाम"
                     className="w-full bg-white border border-orange-200 text-slate-800 text-[14px] rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 font-medium"
                   />
                </div>
                <div>
                   <label className="text-[12px] font-bold text-orange-800 mb-2 block">देय तिथि (Due Date)</label>
                   <input 
                     type="date"
                     value={dueDate}
                     onChange={(e) => setDueDate(e.target.value)}
                     className="w-full bg-white border border-orange-200 text-slate-800 text-[14px] rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 font-medium"
                   />
                </div>
              </div>
            )}

            {/* Remark */}
            <div>
               <label className="text-[13px] font-bold text-slate-700 mb-2 block">रिमार्क (Remark)</label>
               <div className="bg-white border border-slate-200 rounded-[18px] p-4 shadow-sm focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100 transition-all">
                 <textarea 
                   rows={2}
                   value={remark}
                   onChange={(e) => setRemark(e.target.value)}
                   maxLength={200}
                   placeholder="कोई नोट या रिमार्क लिखें..."
                   className="w-full bg-transparent text-[14px] text-slate-800 focus:outline-none resize-none font-medium placeholder-slate-400"
                 />
                 <div className="text-right text-[10px] text-slate-400 font-bold mt-1">
                   {remark.length}/200
                 </div>
               </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-2">
               <button 
                 onClick={resetForm}
                 className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-[20px] font-bold text-[15px] flex items-center justify-center gap-2 active:scale-95 transition-transform"
               >
                 <RefreshCw className="w-5 h-5" />
                 रीसेट करें
               </button>
               <button 
                 onClick={handleSave}
                 disabled={!amount || !description || (paymentMethod === 'CREDIT' && !vendorName)}
                 className="flex-1 py-4 bg-gradient-to-r from-[#FF8A3D] to-[#F57C00] text-white rounded-[20px] font-bold text-[15px] flex items-center justify-center gap-2 shadow-[0_8px_20px_rgb(255,138,61,0.3)] active:scale-95 transition-transform disabled:opacity-50"
               >
                 <Receipt className="w-5 h-5" />
                 खर्च दर्ज करें
               </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Outstanding Credits List */}
            {outstandingCredits.length === 0 ? (
               <div className="text-center py-10 bg-white rounded-3xl border border-slate-100">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                     <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-slate-700 font-bold">कोई उधार बाकी नहीं (No Pending Credit)</h3>
                  <p className="text-slate-400 text-sm mt-1">सभी बिल चुका दिए गए हैं।</p>
               </div>
            ) : (
               outstandingCredits.map(credit => (
                 <div key={credit.id} className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 relative overflow-hidden">
                   <div className={`absolute top-0 left-0 w-1.5 h-full ${credit.status === 'PAID' ? 'bg-emerald-500' : credit.status === 'PARTIAL' ? 'bg-amber-400' : 'bg-rose-500'}`}></div>
                   
                   <div className="flex justify-between items-start mb-3">
                     <div>
                       <h3 className="text-[16px] font-bold text-slate-800">{credit.vendorName}</h3>
                       <p className="text-[12px] font-medium text-slate-500">{credit.category} • {credit.date}</p>
                     </div>
                     <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                       credit.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 
                       credit.status === 'PARTIAL' ? 'bg-amber-50 text-amber-600' : 
                       'bg-rose-50 text-rose-600'
                     }`}>
                       {credit.status === 'PAID' ? 'Paid ✅' : credit.status === 'PARTIAL' ? 'Partial' : 'Unpaid'}
                     </span>
                   </div>

                   <div className="grid grid-cols-2 gap-3 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">Total Udhar</p>
                        <p className="text-[14px] font-bold text-slate-700">{formatCurrency(credit.amount)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase mb-0.5">Paid Amount</p>
                        <p className="text-[14px] font-bold text-emerald-600">{formatCurrency(credit.paidAmount || 0)}</p>
                      </div>
                   </div>

                   <div className="flex justify-between items-center mt-2">
                     <div>
                       <p className="text-[11px] text-slate-500 font-bold">Remaining Balance</p>
                       <p className="text-[18px] font-black text-rose-500">{formatCurrency(credit.remaining)}</p>
                     </div>
                     {credit.status !== 'PAID' && (
                       <button 
                         onClick={() => {
                           setSelectedCreditId(credit.id);
                           setPayAmount(credit.remaining.toString());
                           setPayModalOpen(true);
                         }}
                         className="px-5 py-2.5 bg-slate-800 text-white text-[12px] font-bold rounded-xl active:scale-95 transition-transform shadow-md"
                       >
                         Pay Credit
                       </button>
                     )}
                   </div>
                 </div>
               ))
            )}
          </div>
        )}
      </div>

      {/* Pay Credit Modal */}
      {payModalOpen && selectedCreditTx && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full sm:w-[400px] rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:fade-in duration-300">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">Pay Credit</h3>
                <button onClick={() => setPayModalOpen(false)} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                  <X className="w-5 h-5" />
                </button>
             </div>

             <div className="space-y-5">
               <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 flex justify-between items-center">
                  <span className="text-sm font-bold text-rose-800">Previous Balance</span>
                  <span className="text-lg font-black text-rose-600">{formatCurrency(selectedCreditTx.remaining)}</span>
               </div>

               <div>
                 <label className="text-[12px] font-bold text-slate-700 mb-2 block">Payment Amount</label>
                 <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                       <span className="font-bold text-slate-400">₹</span>
                    </div>
                    <input 
                      type="number"
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value)}
                      max={selectedCreditTx.remaining}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-lg rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 font-bold"
                    />
                 </div>
               </div>
               
               <div className="flex justify-between items-center px-1">
                  <span className="text-sm font-bold text-slate-500">Remaining After Pay</span>
                  <span className="text-sm font-bold text-slate-800">
                    {formatCurrency(selectedCreditTx.remaining - (Number(payAmount) || 0))}
                  </span>
               </div>

               <div>
                 <label className="text-[12px] font-bold text-slate-700 mb-2 block">Payment Method</label>
                 <div className="flex gap-2">
                   {['CASH', 'UPI', 'BANK'].map(method => (
                     <button
                       key={method}
                       onClick={() => setPayMethod(method as any)}
                       className={`flex-1 py-2.5 rounded-xl text-[12px] font-bold transition-all border ${
                         payMethod === method ? 'bg-emerald-50 border-emerald-400 text-emerald-700' : 'bg-white border-slate-200 text-slate-500'
                       }`}
                     >
                       {method}
                     </button>
                   ))}
                 </div>
               </div>

               <div>
                 <label className="text-[12px] font-bold text-slate-700 mb-2 block">Remark (Optional)</label>
                 <input 
                   type="text"
                   value={payRemark}
                   onChange={(e) => setPayRemark(e.target.value)}
                   placeholder="e.g. Cleared full due"
                   className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-400 font-medium"
                 />
               </div>

               <button 
                 onClick={handlePayCredit}
                 disabled={!payAmount || Number(payAmount) <= 0 || Number(payAmount) > selectedCreditTx.remaining}
                 className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold text-lg active:scale-95 transition-transform disabled:opacity-50 mt-2"
               >
                 Confirm Payment
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
