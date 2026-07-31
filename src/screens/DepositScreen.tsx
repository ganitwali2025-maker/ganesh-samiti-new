import { useState, useMemo } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Wallet, ChevronDown, CheckCircle2, Moon, PiggyBank, Sparkles, Receipt, Banknote, Smartphone, Landmark } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { useCommitteeData } from '../hooks/useCommitteeData';
import { formatCurrency } from '../utils/format';

export function DepositScreen() {
  const { goBack } = useNavigation();
  const { members, addTransaction } = useCommitteeData();
  
  const [member, setMember] = useState('');
  const [category, setCategory] = useState('मासिक जमा');
  const [notes, setNotes] = useState('');
  
  // Amounts
  const [ganeshAmount, setGaneshAmount] = useState('');
  const [chandaAmount, setChandaAmount] = useState('');
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [otherAmount, setOtherAmount] = useState('');
  
  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  
  const [isSuccess, setIsSuccess] = useState(false);

  const totalAmount = useMemo(() => {
    return (Number(ganeshAmount) || 0) + (Number(chandaAmount) || 0) + (Number(monthlyAmount) || 0) + (Number(otherAmount) || 0);
  }, [ganeshAmount, chandaAmount, monthlyAmount, otherAmount]);

  const handleDeposit = () => {
    if (totalAmount > 0 && member) {
      const date = new Date().toISOString().split('T')[0];
      const baseDesc = notes ? `${notes} via ${paymentMethod}` : `Deposit via ${paymentMethod}`;

      if (Number(ganeshAmount) > 0) {
        addTransaction({
          memberId: member,
          amount: Number(ganeshAmount),
          type: 'DEPOSIT',
          category: 'गणेश चतुर्थी जमा',
          date,
          description: baseDesc,
        });
      }
      if (Number(chandaAmount) > 0) {
        addTransaction({
          memberId: member,
          amount: Number(chandaAmount),
          type: 'DEPOSIT',
          category: 'चंदा राशि',
          date,
          description: baseDesc,
        });
      }
      if (Number(monthlyAmount) > 0) {
        addTransaction({
          memberId: member,
          amount: Number(monthlyAmount),
          type: 'DEPOSIT',
          category: 'मासिक जमा',
          date,
          description: baseDesc,
        });
      }
      if (Number(otherAmount) > 0) {
        addTransaction({
          memberId: member,
          amount: Number(otherAmount),
          type: 'DEPOSIT',
          category: category,
          date,
          description: baseDesc,
        });
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        goBack();
      }, 2000);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-[100dvh] bg-emerald-500 text-white relative z-50">
        <CheckCircle2 className="w-24 h-24 mb-6 animate-bounce" />
        <h2 className="text-3xl font-extrabold mb-2">सफल! (Success)</h2>
        <p className="text-emerald-100 font-medium text-lg">₹{totalAmount} जमा हो गए।</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] font-['Plus_Jakarta_Sans',sans-serif]">
      <PageHeader title="" subtitle="" />
      
      <div className="p-4 flex-1 overflow-y-auto pb-28">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-8 mt-2">
          <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-[#FF8A3D] to-[#FFB86C] flex items-center justify-center text-white shadow-lg shadow-orange-200 mb-4">
            <Wallet className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Deposit Details</h2>
          <p className="text-slate-500 font-medium mt-1">सदस्य की जमा जानकारी भरें</p>
        </div>

        <div className="space-y-6">
          {/* Member Select */}
          <div className="bg-white/70 backdrop-blur-xl p-5 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-white">
            <label className="text-[13px] font-bold text-slate-700 mb-2 block">सदस्य चुनें (Select Member)</label>
            <div className="relative">
              <select 
                value={member}
                onChange={(e) => setMember(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-800 text-[15px] rounded-2xl pl-4 pr-11 py-3.5 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all font-medium appearance-none shadow-sm"
              >
                <option value="" disabled>सदस्य चुनें...</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <ChevronDown className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Category Dropdown (For Other Amount) */}
          <div className="bg-white/70 backdrop-blur-xl p-5 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-white">
            <label className="text-[13px] font-bold text-slate-700 mb-2 block">जमा का प्रकार (Category for Other Amount)</label>
            <div className="relative">
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-800 text-[15px] rounded-2xl pl-4 pr-11 py-3.5 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all font-medium appearance-none shadow-sm"
              >
                <option value="मासिक जमा">मासिक जमा (Monthly Deposit)</option>
                <option value="गणेश चतुर्थी जमा">गणेश चतुर्थी जमा</option>
                <option value="चंदा राशि">चंदा राशि</option>
                <option value="विशेष योगदान">विशेष योगदान</option>
                <option value="Loan EMI">Loan EMI</option>
                <option value="Interest Deposit">Interest Deposit</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <ChevronDown className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Amount Cards */}
          <div className="bg-white/70 backdrop-blur-xl p-5 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-white space-y-4">
            <label className="text-[13px] font-bold text-slate-700 block mb-1">राशि विवरण (Amount Details)</label>
            
            {/* Card 1: Ganesh */}
            <div className="flex items-stretch bg-emerald-50/50 border border-emerald-100 rounded-[20px] overflow-hidden transition-all focus-within:ring-2 focus-within:ring-emerald-300">
               <div className="w-16 bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shrink-0 shadow-inner">
                  <Sparkles className="w-7 h-7 text-white drop-shadow-sm" />
               </div>
               <div className="flex-1 p-3.5 bg-white/40 backdrop-blur-sm">
                  <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide mb-1">गणेश चतुर्थी जमा राशि</p>
                  <div className="flex items-center">
                    <span className="text-xl font-bold text-emerald-600 mr-1">₹</span>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      value={ganeshAmount}
                      onChange={(e) => setGaneshAmount(e.target.value)}
                      className="w-full bg-transparent text-2xl font-bold text-slate-800 focus:outline-none placeholder-slate-300"
                    />
                  </div>
               </div>
            </div>

            {/* Card 2: Chanda */}
            <div className="flex items-stretch bg-blue-50/50 border border-blue-100 rounded-[20px] overflow-hidden transition-all focus-within:ring-2 focus-within:ring-blue-300">
               <div className="w-16 bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center shrink-0 shadow-inner">
                  <Moon className="w-7 h-7 text-white drop-shadow-sm" />
               </div>
               <div className="flex-1 p-3.5 bg-white/40 backdrop-blur-sm">
                  <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wide mb-1">चंदा राशि</p>
                  <div className="flex items-center">
                    <span className="text-xl font-bold text-blue-600 mr-1">₹</span>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      value={chandaAmount}
                      onChange={(e) => setChandaAmount(e.target.value)}
                      className="w-full bg-transparent text-2xl font-bold text-slate-800 focus:outline-none placeholder-slate-300"
                    />
                  </div>
               </div>
            </div>

            {/* Card 3: Monthly */}
            <div className="flex items-stretch bg-orange-50/50 border border-orange-100 rounded-[20px] overflow-hidden transition-all focus-within:ring-2 focus-within:ring-orange-300">
               <div className="w-16 bg-gradient-to-br from-[#FF8A3D] to-[#FFB86C] flex items-center justify-center shrink-0 shadow-inner">
                  <PiggyBank className="w-7 h-7 text-white drop-shadow-sm" />
               </div>
               <div className="flex-1 p-3.5 bg-white/40 backdrop-blur-sm">
                  <p className="text-[11px] font-bold text-orange-800 uppercase tracking-wide mb-1">मासिक जमा राशि</p>
                  <div className="flex items-center">
                    <span className="text-xl font-bold text-orange-600 mr-1">₹</span>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      value={monthlyAmount}
                      onChange={(e) => setMonthlyAmount(e.target.value)}
                      className="w-full bg-transparent text-2xl font-bold text-slate-800 focus:outline-none placeholder-slate-300"
                    />
                  </div>
               </div>
            </div>

            {/* Other Amount Input */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-[20px] px-4 py-3 focus-within:border-slate-400 transition-colors mt-2">
               <Receipt className="w-5 h-5 text-slate-400 mr-3" />
               <div className="flex-1">
                 <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">अन्य राशि (Other Amount)</p>
                 <div className="flex items-center mt-0.5">
                    <span className="text-lg font-bold text-slate-400 mr-1">₹</span>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      value={otherAmount}
                      onChange={(e) => setOtherAmount(e.target.value)}
                      className="w-full bg-transparent text-lg font-bold text-slate-800 focus:outline-none placeholder-slate-300"
                    />
                 </div>
               </div>
            </div>

          </div>

          {/* Deposit Summary Card */}
          <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
             <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-slate-500" />
                <h3 className="text-[13px] font-bold text-slate-700">कुल जमा राशि (Deposit Summary)</h3>
             </div>
             
             <div className="p-5 space-y-3">
                <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-600 font-medium">गणेश चतुर्थी</span>
                   <span className="font-bold text-slate-800">{formatCurrency(Number(ganeshAmount) || 0)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-600 font-medium">चंदा राशि</span>
                   <span className="font-bold text-slate-800">{formatCurrency(Number(chandaAmount) || 0)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-600 font-medium">मासिक जमा</span>
                   <span className="font-bold text-slate-800">{formatCurrency(Number(monthlyAmount) || 0)}</span>
                </div>
                {Number(otherAmount) > 0 && (
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-600 font-medium">{category}</span>
                     <span className="font-bold text-slate-800">{formatCurrency(Number(otherAmount) || 0)}</span>
                  </div>
                )}
                
                <div className="border-t border-dashed border-slate-200 my-3"></div>
                
                <div className="bg-orange-50 rounded-xl p-4 flex justify-between items-center">
                   <div className="flex items-center gap-2">
                     <Wallet className="w-5 h-5 text-orange-600" />
                     <span className="font-bold text-orange-800">कुल जमा</span>
                   </div>
                   <span className="text-xl font-black text-orange-600">{formatCurrency(totalAmount)}</span>
                </div>
             </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white/70 backdrop-blur-xl p-5 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-white">
            <label className="text-[13px] font-bold text-slate-700 mb-3 block">Payment Method</label>
            <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
              {[
                { id: 'Cash', icon: Banknote, label: 'Cash' },
                { id: 'UPI', icon: Smartphone, label: 'UPI' },
                { id: 'Bank', icon: Landmark, label: 'Bank' },
              ].map(method => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl transition-all duration-300 ${
                    paymentMethod === method.id 
                      ? 'bg-white shadow-sm text-orange-600 font-bold' 
                      : 'text-slate-500 font-medium hover:text-slate-700'
                  }`}
                >
                  <method.icon className={`w-5 h-5 ${paymentMethod === method.id ? 'text-orange-500' : 'text-slate-400'}`} />
                  <span className="text-[11px]">{method.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white/70 backdrop-blur-xl p-5 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-white">
            <label className="text-[13px] font-bold text-slate-700 mb-2 block">नोट (Notes)</label>
            <input 
              type="text" 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="उदाहरण: गणेश चतुर्थी योगदान, चंदा आदि..."
              className="w-full bg-white border border-slate-200 text-slate-800 text-[15px] rounded-2xl px-4 py-4 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all font-medium shadow-sm"
            />
          </div>
          
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 z-40">
        <button 
          onClick={handleDeposit}
          disabled={totalAmount <= 0 || !member}
          className="w-full h-14 bg-gradient-to-r from-[#FF8A3D] to-[#FFB86C] text-white rounded-[20px] font-bold text-[16px] shadow-[0_8px_20px_rgb(255,138,61,0.3)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
        >
          <Wallet className="w-5 h-5" />
          Confirm Deposit
        </button>
      </div>
    </div>
  );
}
