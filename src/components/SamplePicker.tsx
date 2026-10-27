import React from 'react';
import { FileText, ArrowRight, Home, CreditCard, Stethoscope, GraduationCap } from 'lucide-react';

interface SamplePickerProps {
  onSelectSample: (sampleId: string) => void;
  isLoading: boolean;
}

export const SAMPLE_DOCS_METADATA = [
  {
    id: 'sample_tenancy',
    title: 'Lagos Residential Tenancy Agreement',
    category: 'Tenancy & Housing',
    icon: Home,
    tag: '14-Day Eviction Clause & Non-refundable Caution',
    desc: '2-Bedroom flat agreement in Yaba requiring 2 years upfront rent, non-refundable deposit, and forcing tenant to fix roof.',
    color: 'emerald',
  },
  {
    id: 'sample_loan',
    title: 'FastCash 9ja Instant Mobile Loan Terms',
    category: 'Digital Loans & Fintech',
    icon: CreditCard,
    tag: '730% APR & Contact Shaming Threat',
    desc: 'Predatory loan app taking 20% upfront cut, 2% daily interest, and harvesting phone contacts to harass friends and family.',
    color: 'rose',
  },
  {
    id: 'sample_hospital',
    title: 'Private Specialist Emergency Bill',
    category: 'Healthcare & Hospital',
    icon: Stethoscope,
    tag: '₦350k Callout & Unitemized Consumables',
    desc: 'N1.08m bill for 2-day admission with surprise doctor discretion charges and withholding of clinical discharge note.',
    color: 'amber',
  },
  {
    id: 'sample_school',
    title: 'University Faculty Sundry Fees Circular',
    category: 'Education & Dues',
    icon: GraduationCap,
    tag: 'Cash at HOD Office & Admission Revocation',
    desc: 'State varsity circular demanding cash in departmental office and threatening to revoke matriculation number in 7 days.',
    color: 'indigo',
  },
];

export const SamplePicker: React.FC<SamplePickerProps> = ({
  onSelectSample,
  isLoading,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Try Ready-Made Nigerian Document Scenarios
            </h3>
            <p className="text-[11px] text-slate-500">
              No physical document on hand? Click any sample below to see instant ExplainAm analysis:
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {SAMPLE_DOCS_METADATA.map((sample) => {
          const Icon = sample.icon;
          return (
            <button
              key={sample.id}
              onClick={() => onSelectSample(sample.id)}
              disabled={isLoading}
              type="button"
              className="text-left p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition">
                      {sample.title}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition" />
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                  {sample.desc}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                <span className="font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                  {sample.tag}
                </span>
                <span className="text-slate-400 font-medium">1-Tap Test</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
