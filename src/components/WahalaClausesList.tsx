import React, { useState } from 'react';
import { WahalaClause } from '../types';
import { AlertTriangle, Copy, Check, Scale, ShieldAlert } from 'lucide-react';

interface WahalaClausesListProps {
  clauses: WahalaClause[];
  languageName: string;
}

export const WahalaClausesList: React.FC<WahalaClausesListProps> = ({
  clauses,
  languageName,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!clauses || clauses.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 text-center border border-slate-200">
        <div className="w-12 h-12 mx-auto bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-2">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-slate-800">No Critical Traps Found</h4>
        <p className="text-xs text-slate-500 mt-1">
          This document appears relatively standard, but always read carefully before signing.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Wahala Radar ({clauses.length} Risky Clauses Detected)
          </h3>
        </div>
        <span className="text-xs text-slate-500">
          Explained in {languageName}
        </span>
      </div>

      <div className="space-y-3">
        {clauses.map((clause, idx) => {
          const isCritical = clause.riskLevel === 'CRITICAL';
          const isWarning = clause.riskLevel === 'WARNING';

          const badgeStyles = isCritical
            ? 'text-rose-700 bg-rose-50 border-rose-200'
            : isWarning
            ? 'text-amber-800 bg-amber-50 border-amber-200'
            : 'text-slate-700 bg-slate-100 border-slate-200';

          return (
            <div
              key={clause.id || idx}
              className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all ${
                isCritical
                  ? 'border-rose-200 shadow-xs hover:border-rose-300'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Header with risk severity */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${badgeStyles}`}>
                    {clause.riskLevel}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">
                    {clause.title}
                  </h4>
                </div>
              </div>

              {/* Exact quote from document */}
              <div className="my-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 leading-relaxed">
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Original Document Clause
                </span>
                "{clause.quote}"
              </div>

              {/* Plain language explanation */}
              <div className="mt-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Why this is a trap (Plain Talk)
                </span>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {clause.explanation}
                </p>
              </div>

              {/* Counter-proposal to demand */}
              <div className="mt-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wide flex items-center gap-1.5">
                    <span>💡 Wetin you suppose demand instead</span>
                  </span>
                  <button
                    onClick={() => handleCopy(clause.id, clause.betterAlternative)}
                    type="button"
                    className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 py-0.5 px-1.5 rounded hover:bg-emerald-100 transition"
                    title="Copy this counter-proposal to send on WhatsApp"
                  >
                    {copiedId === clause.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy clause</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                  "{clause.betterAlternative}"
                </p>
              </div>

              {/* Legal Reference if available */}
              {clause.legalContext && (
                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Scale className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{clause.legalContext}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
