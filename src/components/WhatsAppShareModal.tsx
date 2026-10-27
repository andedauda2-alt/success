import React, { useState } from 'react';
import { Share2, MessageCircle, Copy, Check, X, ExternalLink } from 'lucide-react';

interface WhatsAppShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  documentTitle: string;
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  isOpen,
  onClose,
  message,
  documentTitle,
}) => {
  const [copied, setCopied] = useState(false);
  const [customPhone, setCustomPhone] = useState('');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `ExplainAm Breakdown: ${documentTitle}`,
          text: message,
          url: window.location.href,
        });
      } catch (err) {
        console.warn('Native share error or dismissed:', err);
      }
    } else {
      handleCopy();
    }
  };

  const getWhatsAppLink = () => {
    const encoded = encodeURIComponent(message);
    if (customPhone.trim()) {
      const cleanNumber = customPhone.replace(/[^0-9]/g, '');
      return `https://wa.me/${cleanNumber}?text=${encoded}`;
    }
    return `https://wa.me/?text=${encoded}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Share Breakdown with Family / Lawyer
              </h3>
              <p className="text-[11px] text-slate-500">
                Send to WhatsApp or copy formatted summary
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formatted Message Preview */}
        <div className="my-3 flex-1 overflow-y-auto">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
            WhatsApp Message Preview
          </label>
          <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto select-all">
            {message}
          </div>
        </div>

        {/* Direct Phone Input (Optional) */}
        <div className="mb-3">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Send directly to number (Optional)
          </label>
          <input
            type="tel"
            placeholder="e.g. 2348012345678 or leave empty to choose on WhatsApp"
            value={customPhone}
            onChange={(e) => setCustomPhone(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-11 bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Open in WhatsApp</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleNativeShare}
              type="button"
              className="h-10 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>System Share</span>
            </button>

            <button
              onClick={handleCopy}
              type="button"
              className="h-10 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
