import React, { useState } from 'react';
import { useAppStore } from '../store';
import { generateId } from '../utils';
import { X, ChevronLeft } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function AddJamaModal({ isOpen, onClose }: Props) {
  const { members, addJama } = useAppStore();
  
  const [memberId, setMemberId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState<'Cash' | 'UPI' | 'Bank'>('Cash');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId || !date || !amount) return;

    addJama({
      id: generateId(),
      memberId,
      date,
      amount: Number(amount),
      mode,
      note
    });

    // Reset and close
    setMemberId(''); setAmount(''); setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] flex flex-col justify-end sm:justify-center items-center max-w-md mx-auto h-full">
      <div className="bg-white w-full h-full sm:h-auto sm:rounded-3xl shadow-2xl animate-in slide-in-from-bottom-full duration-300 flex flex-col">
        {/* Purple Header */}
        <div className="bg-[#4B20B5] text-white p-4 flex items-center justify-between sm:rounded-t-3xl shadow-sm z-10">
          <div className="flex items-center">
            <button onClick={onClose} className="p-2 -ml-2 mr-2">
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-lg font-semibold">पैसा जमा</h2>
          </div>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">सदस्य चुनें</label>
              <select required value={memberId} onChange={e => setMemberId(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4B20B5] focus:border-[#4B20B5] outline-none transition-all bg-white text-sm">
                <option value="" disabled>सदस्य चुनें</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">राशि दर्ज करें</label>
              <input required type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4B20B5] focus:border-[#4B20B5] outline-none transition-all text-sm" placeholder="₹" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">जमा की तारीख</label>
              <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4B20B5] focus:border-[#4B20B5] outline-none transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">भुगतान विधि</label>
              <select required value={mode} onChange={e => setMode(e.target.value as any)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4B20B5] focus:border-[#4B20B5] outline-none transition-all bg-white text-sm">
                <option value="Cash">नकद</option>
                <option value="UPI">UPI</option>
                <option value="Bank">बैंक</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">नोट (वैकल्पिक)</label>
              <textarea value={note} onChange={e => setNote(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4B20B5] focus:border-[#4B20B5] outline-none transition-all text-sm" placeholder="नोट लिखें..." rows={2}></textarea>
            </div>
            
            <div className="pt-2">
              <button type="submit" className="w-full bg-[#4B20B5] text-white font-semibold text-base py-3.5 rounded-xl hover:bg-purple-800 active:bg-purple-900 transition-colors shadow-[0_4px_12px_rgba(75,32,181,0.2)]">
                जमा करें
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
