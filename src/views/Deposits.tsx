import React from 'react';
import { useAppStore } from '../store';
import { formatCurrency, formatDate } from '../utils';
import { Menu, Filter } from 'lucide-react';

export function Deposits({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const { jamas, members } = useAppStore();

  const sortedJamas = [...jamas].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="h-full flex flex-col bg-gray-50 relative">
      {/* Purple Header */}
      <div className="flex-shrink-0 bg-[#4B20B5] text-white pt-safe px-4 pb-4">
        <div className="flex justify-between items-center h-14 mt-2">
          <button className="p-2 -ml-2" onClick={onOpenSidebar}>
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-semibold">जमा शीट</h1>
          <button className="p-2 -mr-2">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-4 py-4 overflow-hidden">
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          {/* Table Header */}
          <div className="flex-shrink-0 grid grid-cols-5 gap-2 p-3 border-b border-gray-100 bg-gray-50 text-[10px] font-bold text-gray-700">
            <div className="col-span-1">तारीख</div>
            <div className="col-span-1">सदस्य</div>
            <div className="col-span-1 text-right">राशि</div>
            <div className="col-span-1 text-center">विधि</div>
            <div className="col-span-1 text-center">नोट</div>
          </div>

          {/* Table Body */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50 pb-4">
            {sortedJamas.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-sm">
                <p>कोई जमा नहीं मिला।</p>
              </div>
            ) : (
              sortedJamas.map(jama => {
                const member = members.find(m => m.id === jama.memberId);
                return (
                  <div key={jama.id} className="grid grid-cols-5 gap-2 p-3 text-[11px] items-center">
                    <div className="col-span-1 text-gray-500">{formatDate(jama.date)}</div>
                    <div className="col-span-1 font-medium text-gray-800 truncate">{member?.name || 'Unknown'}</div>
                    <div className="col-span-1 text-right font-semibold text-gray-900">{formatCurrency(jama.amount)}</div>
                    <div className="col-span-1 text-center text-gray-600">{jama.mode === 'Cash' ? 'नकद' : jama.mode}</div>
                    <div className="col-span-1 text-center text-gray-400 truncate">{jama.note || '-'}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
