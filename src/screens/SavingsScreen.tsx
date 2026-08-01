import { useState, useMemo } from 'react';
import { PageHeader } from '../components/PageHeader';
import { useCommitteeData } from '../hooks/useCommitteeData';
import { formatCurrency } from '../utils/format';
import { HandCoins, Plus, CheckCircle2, Clock, Wallet, AlertCircle, Phone, X, Landmark, Search, BarChart3, Receipt, TrendingUp } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

type Tab = 'REGISTER' | 'PENDING' | 'ANALYTICS';

export function SavingsScreen() {
  const { transactions, members, payDepositCredit } = useCommitteeData();
  const { navigate } = useNavigation();
  const [activeTab, setActiveTab] = useState<Tab>('REGISTER');
  const [searchQuery, setSearchQuery] = useState('');

  // Payment Modal State
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedCreditId, setSelectedCreditId] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState<'CASH' | 'UPI' | 'BANK'>('CASH');
  const [payRemark, setPayRemark] = useState('');

  const depositTx = useMemo(() => transactions.filter(t => t.type === 'DEPOSIT').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [transactions]);
  
  const creditChanda = depositTx.filter(t => t.paymentMethod === 'CREDIT').reduce((sum, t) => sum + t.amount, 0);
  const creditPaid = depositTx.filter(t => t.paymentMethod === 'CREDIT').reduce((sum, t) => sum + (t.paidAmount || 0), 0);
  const outstandingChanda = creditChanda - creditPaid;
  const cashCollection = depositTx.filter(t => t.paymentMethod !== 'CREDIT').reduce((sum, t) => sum + t.amount, 0) + creditPaid;
  const totalChanda = depositTx.reduce((sum, t) => sum + t.amount, 0);

  const outstandingDeposits = useMemo(() => {
    return depositTx.filter(t => t.paymentMethod === 'CREDIT').map(t => {
      const remaining = t.amount - (t.paidAmount || 0);
      let status = 'UNPAID';
      if (remaining === 0) status = 'PAID';
      else if ((t.paidAmount || 0) > 0) status = 'PARTIAL';
      
      const memberObj = members.find(m => m.id === t.memberId);
      const memberName = memberObj ? memberObj.name : t.donorName || 'Unknown';
      const phone = memberObj ? memberObj.phone : '';

      return { ...t, remaining, status, memberName, phone };
    });
  }, [depositTx, members]);

  const selectedCreditTx = outstandingDeposits.find(t => t.id === selectedCreditId);

  const handlePayDeposit = () => {
    if (selectedCreditId && Number(payAmount) > 0) {
      payDepositCredit(selectedCreditId, Number(payAmount), payMethod, payRemark);
      setPayModalOpen(false);
      setPayAmount('');
      setPayRemark('');
      setSelectedCreditId('');
    }
  };

  const filteredRegister = depositTx.filter(t => {
    const memberObj = members.find(m => m.id === t.memberId);
    const memberName = memberObj ? memberObj.name : t.donorName || 'Unknown';
    return memberName.toLowerCase().includes(searchQuery.toLowerCase()) || 
           t.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex flex-col h-[100dvh] bg-[#FAFAFA] font-['Plus_Jakarta_Sans',sans-serif]">
      <PageHeader title="चंदा प्रबंधन" subtitle="समिति का चंदा संग्रह एवं रिपोर्ट" />

      {/* TOP SUMMARY CARD */}
      <div className="px-4 pt-4 pb-2 shrink-0">
        <div className="bg-gradient-to-br from-[#FF5A5F] to-[#D12B30] rounded-[28px] p-5 text-white shadow-[0_8px_30px_rgba(255,90,95,0.3)] relative overflow-hidden">
          <div className="absolute right-[-10%] top-[-10%] w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <p className="text-[12px] font-bold opacity-90 uppercase tracking-wider mb-1">कुल चंदा (Total Chanda)</p>
              <h2 className="text-3xl font-black">{formatCurrency(totalChanda)}</h2>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <HandCoins className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 relative z-10">
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
               <div className="flex items-center gap-2 mb-1">
                 <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                 <p className="text-[11px] font-semibold opacity-90">Cash Collection</p>
               </div>
               <p className="text-[15px] font-bold">{formatCurrency(cashCollection)}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
               <div className="flex items-center gap-2 mb-1">
                 <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                 <p className="text-[11px] font-semibold opacity-90">Outstanding</p>
               </div>
               <p className="text-[15px] font-bold">{formatCurrency(outstandingChanda)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="px-4 py-2 shrink-0">
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button 
            onClick={() => setActiveTab('REGISTER')}
            className={`flex-1 py-2.5 text-[13px] font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'REGISTER' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'}`}
          >
            <Receipt className="w-4 h-4" /> Register
          </button>
          <button 
            onClick={() => setActiveTab('PENDING')}
            className={`flex-1 py-2.5 text-[13px] font-bold rounded-xl transition-all flex items-center justify-center gap-2 relative ${activeTab === 'PENDING' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'}`}
          >
            <Clock className="w-4 h-4" /> Pending
            {outstandingDeposits.filter(c => c.status !== 'PAID').length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('ANALYTICS')}
            className={`flex-1 py-2.5 text-[13px] font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'ANALYTICS' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'}`}
          >
            <BarChart3 className="w-4 h-4" /> Analytics
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-28">
        
        {/* REGISTER TAB */}
        {activeTab === 'REGISTER' && (
          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-slate-800 text-[16px]">Collection Register</h3>
              <button onClick={() => navigate('deposit')} className="text-[12px] font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> नया चंदा
              </button>
            </div>
            
            <div className="relative mb-4">
              <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by name or category..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-800 text-[14px] rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all font-medium"
              />
            </div>

            <div className="space-y-3">
              {filteredRegister.map(t => {
                const memberObj = members.find(m => m.id === t.memberId);
                const memberName = memberObj ? memberObj.name : t.donorName || 'Unknown';
                const phone = memberObj ? memberObj.phone : '';
                
                const isCredit = t.paymentMethod === 'CREDIT';
                let statusColor = 'bg-emerald-100 text-emerald-700';
                let statusText = 'Paid';
                
                if (isCredit) {
                  const remaining = t.amount - (t.paidAmount || 0);
                  if (remaining === 0) {
                    statusColor = 'bg-emerald-100 text-emerald-700';
                    statusText = 'Paid';
                  } else if ((t.paidAmount || 0) > 0) {
                    statusColor = 'bg-amber-100 text-amber-700';
                    statusText = 'Partial';
                  } else {
                    statusColor = 'bg-rose-100 text-rose-700';
                    statusText = 'Pending';
                  }
                }

                return (
                  <div key={t.id} className="bg-white p-4 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                          <span className="font-bold text-slate-600 text-[14px]">{memberName.charAt(0)}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-[14px] leading-tight">{memberName}</h4>
                          <p className="text-[11px] font-medium text-slate-400 mt-0.5">{new Date(t.date).toLocaleDateString('en-IN', {day: 'numeric', month: 'short', year: 'numeric'})}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-800 text-[15px]">{formatCurrency(t.amount)}</p>
                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase mt-1 ${statusColor}`}>
                          {statusText}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-50">
                      <span className="bg-slate-50 text-slate-500 px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1">
                        <Landmark className="w-3 h-3" /> {t.category}
                      </span>
                      {phone && (
                        <span className="bg-slate-50 text-slate-500 px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {phone}
                        </span>
                      )}
                      <span className="bg-slate-50 text-slate-500 px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1">
                        <Wallet className="w-3 h-3" /> {t.paymentMethod || 'CASH'}
                      </span>
                    </div>
                  </div>
                );
              })}
              {filteredRegister.length === 0 && (
                <div className="text-center py-10">
                  <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">कोई रिकॉर्ड नहीं मिला</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PENDING TAB */}
        {activeTab === 'PENDING' && (
          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-slate-800 text-[16px] mb-2">Pending Chanda List</h3>
            
            <div className="space-y-3">
              {outstandingDeposits.filter(c => c.status !== 'PAID').map(t => (
                <div key={t.id} className="bg-white p-4 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-800 text-[15px] leading-tight">{t.memberName}</h4>
                      <p className="text-[12px] font-medium text-slate-400 mt-1">{t.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-semibold text-slate-400 mb-0.5">बाकी राशि (Pending)</p>
                      <p className="font-black text-rose-500 text-[18px]">{formatCurrency(t.remaining)}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                     <div>
                       <p className="text-[10px] font-semibold text-slate-400">Total Chanda</p>
                       <p className="text-[12px] font-bold text-slate-700">{formatCurrency(t.amount)}</p>
                     </div>
                     <div className="h-6 w-px bg-slate-200"></div>
                     <div>
                       <p className="text-[10px] font-semibold text-slate-400">Paid Amount</p>
                       <p className="text-[12px] font-bold text-slate-700">{formatCurrency(t.paidAmount || 0)}</p>
                     </div>
                  </div>
                  
                  <button 
                    onClick={() => { setSelectedCreditId(t.id); setPayModalOpen(true); }}
                    className="w-full mt-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 h-11 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 transition-colors border border-emerald-100"
                  >
                    <Wallet className="w-4 h-4" /> Receive Payment
                  </button>
                </div>
              ))}
              {outstandingDeposits.filter(c => c.status !== 'PAID').length === 0 && (
                <div className="text-center py-10">
                  <CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">कोई उधार चंदा बाकी नहीं है।</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'ANALYTICS' && (
          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-slate-800 text-[16px] mb-2">Chanda Analytics</h3>
            
            <div className="bg-white p-5 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 mb-4">
              <h4 className="font-bold text-slate-700 text-[13px] mb-4">Collection Status</h4>
              <div className="flex items-end gap-2 h-32 mb-2">
                <div className="flex-1 bg-slate-50 rounded-t-xl relative flex flex-col justify-end group">
                  <div className="absolute -top-6 w-full text-center text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">{formatCurrency(cashCollection)}</div>
                  <div 
                    className="w-full bg-emerald-400 rounded-t-xl transition-all duration-1000" 
                    style={{ height: `${totalChanda > 0 ? (cashCollection / totalChanda) * 100 : 0}%` }}
                  ></div>
                </div>
                <div className="flex-1 bg-slate-50 rounded-t-xl relative flex flex-col justify-end group">
                  <div className="absolute -top-6 w-full text-center text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">{formatCurrency(outstandingChanda)}</div>
                  <div 
                    className="w-full bg-rose-400 rounded-t-xl transition-all duration-1000" 
                    style={{ height: `${totalChanda > 0 ? (outstandingChanda / totalChanda) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Cash In</p>
                  <p className="text-[12px] font-black text-emerald-600">{totalChanda > 0 ? Math.round((cashCollection / totalChanda) * 100) : 0}%</p>
                </div>
                <div className="flex-1 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Pending</p>
                  <p className="text-[12px] font-black text-rose-600">{totalChanda > 0 ? Math.round((outstandingChanda / totalChanda) * 100) : 0}%</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-5 rounded-3xl border border-orange-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h4 className="font-bold text-orange-800 text-[14px]">Great Progress!</h4>
                  <p className="text-[11px] font-medium text-orange-600">You have collected {formatCurrency(cashCollection)} so far.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RECEIVE PAYMENT MODAL */}
      {payModalOpen && selectedCreditTx && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex flex-col justify-end">
          <div className="bg-white rounded-t-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-slate-800">Receive Payment</h3>
              <button onClick={() => { setPayModalOpen(false); setSelectedCreditId(''); }} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-rose-50 rounded-2xl p-4 flex justify-between items-center border border-rose-100 mb-5">
              <div>
                <p className="text-rose-500 text-[12px] font-bold">Remaining Balance</p>
                <p className="text-rose-700 text-2xl font-black">{formatCurrency(selectedCreditTx.remaining)}</p>
              </div>
              <div className="text-right">
                <p className="text-rose-400 text-[11px] font-semibold">{selectedCreditTx.memberName}</p>
                <p className="text-rose-400 text-[11px] font-semibold">{selectedCreditTx.category}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[12px] font-bold text-slate-600 mb-2 block">Receive Amount (₹)</label>
                <input 
                  type="number" 
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder="Enter amount..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[16px] rounded-2xl px-4 py-3.5 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all font-bold"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-slate-600 mb-2 block">Payment Method</label>
                <div className="grid grid-cols-3 gap-3">
                  {['CASH', 'UPI', 'BANK'].map((method) => (
                    <button
                      key={method}
                      onClick={() => setPayMethod(method as 'CASH'|'UPI'|'BANK')}
                      className={`py-3 rounded-xl font-bold text-[13px] border transition-all ${
                        payMethod === method 
                          ? 'bg-orange-50 border-orange-200 text-orange-600' 
                          : 'bg-white border-slate-200 text-slate-500'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[12px] font-bold text-slate-600 mb-2 block">Remark (Optional)</label>
                <input 
                  type="text" 
                  value={payRemark}
                  onChange={(e) => setPayRemark(e.target.value)}
                  placeholder="E.g., Second installment..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[14px] rounded-2xl px-4 py-3.5 focus:outline-none focus:border-orange-400 transition-all font-medium"
                />
              </div>

              <div className="pt-2">
                <button 
                  onClick={handlePayDeposit}
                  disabled={!payAmount || Number(payAmount) <= 0 || Number(payAmount) > selectedCreditTx.remaining}
                  className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-[16px] shadow-[0_8px_20px_rgba(16,185,129,0.3)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
