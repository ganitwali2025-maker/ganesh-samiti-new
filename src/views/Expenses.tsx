import React from 'react';
import { useAppStore } from '../store';
import { formatCurrency, formatDate } from '../utils';
import { ChevronLeft, Filter } from 'lucide-react';

export function Expenses() {
  const { kharchas } = useAppStore();

  const sortedKharchas = [...kharchas].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="pb-28 min-h-screen bg-gray-50 flex flex-col">
      {/* Purple Header */}
      <div className="bg-[#4B20B5] text-white pt-safe px-4 pb-4">
        <div className="flex justify-between items-center h-14 mt-2">
          <button className="p-2 -ml-2">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-semibold">खर्च शीट</h1>
          <button className="p-2 -mr-2">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-2 p-3 border-b border-gray-100 bg-gray-50 text-[10px] font-bold text-gray-700">
            <div className="col-span-1">तारीख</div>
            <div className="col-span-1">विवरण</div>
            <div className="col-span-1 text-right">राशि</div>
            <div className="col-span-1 text-center">विधि</div>
            <div className="col-span-1 text-center">नोट</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-50">
            {sortedKharchas.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-sm">
                <p>कोई खर्च नहीं मिला।</p>
              </div>
            ) : (
              sortedKharchas.map(kharcha => (
                <div key={kharcha.id} className="grid grid-cols-5 gap-2 p-3 text-[11px] items-center">
                  <div className="col-span-1 text-gray-500">{formatDate(kharcha.date)}</div>
                  <div className="col-span-1 font-medium text-gray-800 truncate">{kharcha.details}</div>
                  <div className="col-span-1 text-right font-semibold text-gray-900">{formatCurrency(kharcha.amount)}</div>
                  <div className="col-span-1 text-center text-gray-600">{kharcha.mode === 'Cash' ? 'नकद' : kharcha.mode}</div>
                  <div className="col-span-1 text-center text-gray-400 truncate">{kharcha.note || '-'}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
