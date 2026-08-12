import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { Jama } from '../types';
import { ChevronLeft, Calendar, HandCoins, User, Tag, IndianRupee, CreditCard, CalendarDays, ClipboardEdit, Save } from 'lucide-react';

interface Props {
  jama: Jama;
  isOpen: boolean;
  onClose: () => void;
}

export function EditJamaModal({ jama, isOpen, onClose }: Props) {
  const { members, updateJama } = useAppStore();
  
  const [jamaType, setJamaType] = useState(jama.jamaType || 'MONTHLY');
  const [memberId, setMemberId] = useState(jama.memberId);
  const [date, setDate] = useState(jama.date);
  const [amount, setAmount] = useState(jama.amount.toString());
  const [mode, setMode] = useState(jama.mode);
  const [note, setNote] = useState(jama.note);

  useEffect(() => {
    setJamaType(jama.jamaType || 'MONTHLY');
    setMemberId(jama.memberId);
    setDate(jama.date);
    setAmount(jama.amount.toString());
    setMode(jama.mode);
    setNote(jama.note);
  }, [jama, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId || !date || !amount || !jamaType) return;

    updateJama(jama.id, {
      memberId,
      jamaType: jamaType as any,
      date,
      amount: Number(amount),
      mode,
      note
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[120] flex flex-col justify-end sm:justify-center items-center h-[100dvh]">
      <div className="bg-gray-50 w-full h-full sm:h-auto sm:max-w-2xl sm:rounded-3xl shadow-2xl animate-in slide-in-from-bottom-full duration-300 flex flex-col overflow-hidden">
        {/* Purple Header */}
        <div className="bg-[#3A1499] text-white p-4 flex items-center justify-between shadow-sm z-10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button type="button" onClick={onClose} className="p-1">
              <ChevronLeft size={28} />
            </button>
            <h2 className="text-xl font-bold tracking-wide">जमा प्रविष्टि संपादित करें</h2>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 pb-safe">
          <div className="p-4 space-y-6">
            
            {/* Type Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Monthly */}
              <button 
                type="button"
                onClick={() => setJamaType('MONTHLY')}
                className={`p-3 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                  jamaType === 'MONTHLY' ? 'border-purple-500 bg-purple-50 shadow-sm' : 'border-gray-200 bg-white hover:border-purple-200'
                }`}
              >
                <div className="p-2 rounded-xl bg-purple-100 text-purple-700 flex-shrink-0">
                  <Calendar size={24} />
                </div>
                <div className="text-left">
                  <h3 className={`font-bold text-sm ${jamaType === 'MONTHLY' ? 'text-purple-900' : 'text-gray-800'}`}>मासिक जमा</h3>
                  <p className="text-[10px] text-gray-500 font-medium">मासिक सदस्यता जमा</p>
                </div>
              </button>

              {/* Donation */}
              <button 
                type="button"
                onClick={() => setJamaType('DONATION')}
                className={`p-3 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                  jamaType === 'DONATION' ? 'border-orange-500 bg-orange-50 shadow-sm' : 'border-gray-200 bg-white hover:border-orange-200'
                }`}
              >
                <div className="p-2 rounded-xl bg-orange-100 text-orange-600 flex-shrink-0">
                  <HandCoins size={24} />
                </div>
                <div className="text-left">
                  <h3 className={`font-bold text-sm ${jamaType === 'DONATION' ? 'text-orange-900' : 'text-gray-800'}`}>चंदा जमा</h3>
                  <p className="text-[10px] text-gray-500 font-medium">सामान्य चंदा जमा</p>
                </div>
              </button>

              {/* Ganesh Chaturthi */}
              <button 
                type="button"
                onClick={() => setJamaType('GANESH_CHATURTHI')}
                className={`p-3 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                  jamaType === 'GANESH_CHATURTHI' ? 'border-emerald-500 bg-emerald-50 shadow-sm' : 'border-gray-200 bg-white hover:border-emerald-200'
                }`}
              >
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600 flex-shrink-0 flex items-center justify-center overflow-hidden">
                   <img src="https://cdn-icons-png.flaticon.com/512/10008/10008169.png" alt="Ganesh" className="w-6 h-6 object-cover opacity-80" onError={(e) => { e.currentTarget.style.display='none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }} />
                   <span className="text-lg hidden">🕉️</span>
                </div>
                <div className="text-left">
                  <h3 className={`font-bold text-sm ${jamaType === 'GANESH_CHATURTHI' ? 'text-emerald-900' : 'text-gray-800'}`}>गणेश चतुर्थी</h3>
                  <p className="text-[10px] text-gray-500 font-medium">गणेश चतुर्थी फंड जमा</p>
                </div>
              </button>
            </div>

            {/* Form Fields */}
            <form id="editJamaForm" onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Member */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
                    <User size={16} className="text-[#3A1499]" />
                    सदस्य चुनें <span className="text-red-500">*</span>
                  </label>
                  <select required value={memberId} onChange={e => setMemberId(e.target.value)} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#3A1499] focus:border-[#3A1499] focus:bg-white outline-none transition-all text-sm font-medium">
                    <option value="" disabled>सदस्य का नाम चुनें</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                {/* Jama Type */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
                    <Tag size={16} className="text-[#3A1499]" />
                    जमा टाइप <span className="text-red-500">*</span>
                  </label>
                  <select required value={jamaType} onChange={e => setJamaType(e.target.value as any)} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#3A1499] focus:border-[#3A1499] focus:bg-white outline-none transition-all text-sm font-medium">
                    <option value="MONTHLY">मासिक जमा</option>
                    <option value="DONATION">चंदा जमा</option>
                    <option value="GANESH_CHATURTHI">गणेश चतुर्थी के लिए जमा</option>
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
                    <IndianRupee size={16} className="text-[#3A1499]" />
                    राशि (₹) <span className="text-red-500">*</span>
                  </label>
                  <input required type="number" min="1" value={amount} onChange={e => setAmount(e.target.value)} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#3A1499] focus:border-[#3A1499] focus:bg-white outline-none transition-all text-sm font-bold" placeholder="राशि दर्ज करें" />
                </div>

                {/* Payment Mode */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
                    <CreditCard size={16} className="text-[#3A1499]" />
                    भुगतान माध्यम <span className="text-red-500">*</span>
                  </label>
                  <select required value={mode} onChange={e => setMode(e.target.value as any)} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#3A1499] focus:border-[#3A1499] focus:bg-white outline-none transition-all text-sm font-medium">
                    <option value="Cash">नकद</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank">बैंक ट्रांसफर</option>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
                    <CalendarDays size={16} className="text-[#3A1499]" />
                    जमा की तारीख <span className="text-red-500">*</span>
                  </label>
                  <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#3A1499] focus:border-[#3A1499] focus:bg-white outline-none transition-all text-sm font-medium" />
                </div>

                {/* Note */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
                    <ClipboardEdit size={16} className="text-[#3A1499]" />
                    नोट (वैकल्पिक)
                  </label>
                  <input type="text" value={note} onChange={e => setNote(e.target.value)} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#3A1499] focus:border-[#3A1499] focus:bg-white outline-none transition-all text-sm font-medium" placeholder="नोट लिखें..." />
                </div>
              </div>

            </form>
            
            {/* Actions */}
            <div className="flex gap-4 pt-2">
              <button type="submit" form="editJamaForm" className="w-full bg-[#3A1499] text-white font-bold text-sm py-4 rounded-2xl hover:bg-purple-900 active:bg-purple-950 transition-colors shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2">
                <Save size={18} />
                बदलाव सेव करें
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
