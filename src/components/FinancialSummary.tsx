import React from 'react';
import { FinancialBreakdown } from '../types';
import { Wallet, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface FinancialSummaryProps {
  financials: FinancialBreakdown;
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({ financials }) => {
  if (!financials || !financials.items || financials.items.length === 0) {
    return null;
  }

  const shadyCount = financials.items.filter((item) => item.isHiddenOrShady).length;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Pocket Impact (Money Breakdown)
            </h3>
            <p className="text-[11px] text-slate-500">
              Every fee and fine print charge inside this document
            </p>
          </div>
        </div>

        {/* Total Due Banner */}
        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Total Demand
          </span>
          <span className="text-base font-extrabold text-slate-900 tabular-nums">
            {financials.totalDue}
          </span>
        </div>
      </div>

      {shadyCount > 0 && (
        <div className="mb-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center gap-2 text-xs text-amber-900">
          <AlertOctagon className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Attention:</strong> {shadyCount} {shadyCount === 1 ? 'charge looks' : 'charges look'} shady or non-standard!
          </span>
        </div>
      )}

      {/* Itemized Table */}
      <div className="divide-y divide-slate-100 border-t border-slate-100">
        {financials.items.map((item, idx) => (
          <div
            key={idx}
            className={`py-2.5 flex items-center justify-between gap-3 text-xs ${
              item.isHiddenOrShady ? 'bg-amber-50/40 -mx-2 px-2 rounded-lg' : ''
            }`}
          >
            <div className="flex items-start gap-2">
              {item.isHiddenOrShady ? (
                <span className="text-rose-600 font-bold shrink-0 mt-0.5">⚠️</span>
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-semibold text-slate-800 block">
                  {item.item}
                </span>
                {item.frequency && (
                  <span className="text-[11px] text-slate-500">
                    {item.frequency}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="font-bold text-slate-900 tabular-nums block">
                {item.amount}
              </span>
              {item.isHiddenOrShady && (
                <span className="text-[10px] font-bold text-rose-700 uppercase">
                  Shady / Disputed
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
