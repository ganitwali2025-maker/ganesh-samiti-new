import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { Kharcha } from '../types';
import { ChevronLeft, Flame, MoreHorizontal, Tag, IndianRupee, CreditCard, CalendarDays, ClipboardEdit, Save, FileText } from 'lucide-react';

interface Props {
  kharcha: Kharcha;
  isOpen: boolean;
  onClose: () => void;
}

export function EditKharchaModal({ kharcha, isOpen, onClose }: Props) {
  const updateKharcha = useAppStore(state => state.updateKharcha);
  
  const [kharchaType, setKharchaType] = useState(kharcha.kharchaType || 'OTHER');
  const [details, setDetails] = useState(kharcha.details);
  const [date, setDate] = useState(kharcha.date);
  const [amount, setAmount] = useState(kharcha.amount.toString());
  const [mode, setMode] = useState(kharcha.mode);
  const [note, setNote] = useState(kharcha.note);

  useEffect(() => {
    setKharchaType(kharcha.kharchaType || 'OTHER');
    setDetails(kharcha.details);
    setDate(kharcha.date);
    setAmount(kharcha.amount.toString());
    setMode(kharcha.mode);
    setNote(kharcha.note);
  }, [kharcha, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details || !date || !amount || !kharchaType) return;

    updateKharcha(kharcha.id, {
      kharchaType: kharchaType as any,
      details,
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
            <h2 className="text-xl font-bold tracking-wide">खर्चा प्रविष्टि संपादित करें</h2>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 pb-safe">
          <div className="p-4 space-y-6">
            
            {/* Type Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Pooja */}
              <button 
                type="button"
                onClick={() => setKharchaType('POOJA')}
                className={`p-3 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                  kharchaType === 'POOJA' ? 'border-orange-500 bg-orange-50 shadow-sm' : 'border-gray-200 bg-white hover:border-orange-200'
                }`}
              >
                <div className="p-2 rounded-xl bg-orange-100 text-orange-600 flex-shrink-0">
                  <Flame size={24} />
                </div>
                <div className="text-left">
                  <h3 className={`font-bold text-sm ${kharchaType === 'POOJA' ? 'text-orange-900' : 'text-gray-800'}`}>पूजा सामग्री</h3>
                  <p className="text-[10px] text-gray-500 font-medium">पूजा से संबंधित खर्च</p>
                </div>
              </button>

              {/* Ganesh Utsav */}
              <button 
                type="button"
                onClick={() => setKharchaType('GANESH_UTSAV')}
                className={`p-3 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                  kharchaType === 'GANESH_UTSAV' ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 bg-white hover:border-blue-200'
                }`}
              >
                <div className="p-2 rounded-xl bg-blue-100 text-blue-600 flex-shrink-0 flex items-center justify-center overflow-hidden">
                   <img src="https://cdn-icons-png.flaticon.com/512/10008/10008169.png" alt="Ganesh" className="w-6 h-6 object-cover opacity-80" onError={(e) => { e.currentTarget.style.display='none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }} />
                   <span className="text-lg hidden">🕉️</span>
                </div>
                <div className="text-left">
                  <h3 className={`font-bold text-sm ${kharchaType === 'GANESH_UTSAV' ? 'text-blue-900' : 'text-gray-800'}`}>गणेश उत्सव खर्च</h3>
                  <p className="text-[10px] text-gray-500 font-medium">उत्सव से संबंधित खर्च</p>
                </div>
              </button>

              {/* Other */}
              <button 
                type="button"
                onClick={() => setKharchaType('OTHER')}
                className={`p-3 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                  kharchaType === 'OTHER' ? 'border-purple-500 bg-purple-50 shadow-sm' : 'border-gray-200 bg-white hover:border-purple-200'
                }`}
              >
                <div className="p-2 rounded-xl bg-purple-100 text-purple-700 flex-shrink-0">
                  <MoreHorizontal size={24} />
                </div>
                <div className="text-left">
                  <h3 className={`font-bold text-sm ${kharchaType === 'OTHER' ? 'text-purple-900' : 'text-gray-800'}`}>अन्य खर्च</h3>
                  <p className="text-[10px] text-gray-500 font-medium">अन्य सभी खर्च</p>
                </div>
              </button>
            </div>

            {/* Form Fields */}
            <form id="editKharchaForm" onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Kharcha Type Dropdown */}
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
                    <Tag size={16} className="text-[#3A1499]" />
                    खर्चा टाइप <span className="text-red-500">*</span>
                  </label>
                  <select required value={kharchaType} onChange={e => setKharchaType(e.target.value as any)} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#3A1499] focus:border-[#3A1499] focus:bg-white outline-none transition-all text-sm font-medium">
                    <option value="POOJA">पूजा सामग्री</option>
                    <option value="GANESH_UTSAV">गणेश उत्सव खर्च</option>
                    <option value="OTHER">अन्य खर्च</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
                    <FileText size={16} className="text-[#3A1499]" />
                    खर्च का विवरण <span className="text-red-500">*</span>
                  </label>
                  <input required type="text" value={details} onChange={e => setDetails(e.target.value)} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#3A1499] focus:border-[#3A1499] focus:bg-white outline-none transition-all text-sm font-medium" placeholder="जैसे: पूजा सामग्री खरीदी" />
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
                    खर्च की तारीख <span className="text-red-500">*</span>
                  </label>
                  <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#3A1499] focus:border-[#3A1499] focus:bg-white outline-none transition-all text-sm font-medium" />
                </div>

                {/* Note */}
                <div className="sm:col-span-2">
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
              <button type="submit" form="editKharchaForm" className="w-full bg-[#3A1499] text-white font-bold text-sm py-4 rounded-2xl hover:bg-purple-900 active:bg-purple-950 transition-colors shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2">
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
