import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Wallet, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { useCommitteeData } from '../hooks/useCommitteeData';

export function DepositScreen() {
  const { goBack } = useNavigation();
  const { members, addTransaction } = useCommitteeData();
  const [amount, setAmount] = useState('');
  const [member, setMember] = useState('');
  const [category, setCategory] = useState('मासिक जमा');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDeposit = () => {
    if (amount && member) {
      addTransaction({
        memberId: member,
        amount: Number(amount),
        type: 'DEPOSIT',
        category: category,
        date: new Date().toISOString().split('T')[0],
        description: notes || `${category} (App)`,
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        goBack();
      }, 2000);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-[100dvh] bg-emerald-500 text-white">
        <CheckCircle2 className="w-24 h-24 mb-6 animate-bounce" />
        <h2 className="text-3xl font-extrabold mb-2">सफल! (Success)</h2>
        <p className="text-emerald-100 font-medium text-lg">₹{amount} जमा हो गए।</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#FFF8F1]">
      <PageHeader title="पैसा जमा" subtitle="नया जमा करें" />

      <div className="p-6 flex-1 overflow-y-auto">
        
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-50 mb-6">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-6 mx-auto">
            <Wallet className="w-8 h-8" />
          </div>
          
          <h3 className="text-center text-lg font-bold text-slate-800 mb-6">Deposit Details</h3>

          <div className="space-y-5">
            <div>
              <label className="text-[12px] font-bold text-slate-700 mb-1.5 block">सदस्य चुनें (Select Member)</label>
              <div className="relative">
                <select 
                  value={member}
                  onChange={(e) => setMember(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 text-slate-800 text-sm rounded-2xl pl-4 pr-11 py-4 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/50 transition-all font-medium appearance-none"
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

            <div>
              <label className="text-[12px] font-bold text-slate-700 mb-1.5 block">जमा का प्रकार (Category)</label>
              <div className="relative">
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 text-slate-800 text-sm rounded-2xl pl-4 pr-11 py-4 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/50 transition-all font-medium appearance-none"
                >
                  <option value="मासिक जमा">मासिक जमा (Monthly)</option>
                  <option value="वार्षिक जमा">वार्षिक जमा (Yearly)</option>
                  <option value="कार्यक्रम">कार्यक्रम (Event)</option>
                  <option value="अन्य">अन्य (Other)</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[12px] font-bold text-slate-700 mb-1.5 block">रकम (Amount ₹)</label>
              <input 
                type="number" 
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 text-slate-800 text-2xl font-bold rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/50 transition-all text-center"
              />
            </div>

            <div>
              <label className="text-[12px] font-bold text-slate-700 mb-1.5 block">नोट (Notes)</label>
              <input 
                type="text" 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="उदा. चंदा"
                className="w-full bg-slate-50 border border-slate-100 text-slate-800 text-sm rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/50 transition-all font-medium"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={handleDeposit}
          disabled={!amount || !member}
          className="w-full h-14 bg-theme-gradient text-white rounded-2xl font-bold text-[16px] shadow-[0_8px_20px_rgb(255,122,0,0.3)] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:active:scale-100"
        >
          Confirm Deposit
        </button>
      </div>
    </div>
  );
}
