import React, { useState, useRef } from 'react';
import { SupportedLanguage, DocumentAnalysis } from './types';
import { SUPPORTED_LANGUAGES } from './utils/constants';
import { compressImage, CompressionResult } from './utils/imageCompressor';
import { Navbar } from './components/Navbar';
import { AudioVoiceNotePlayer } from './components/AudioVoiceNotePlayer';
import { WahalaClausesList } from './components/WahalaClausesList';
import { FinancialSummary } from './components/FinancialSummary';
import { FollowUpChat } from './components/FollowUpChat';
import { WhatsAppShareModal } from './components/WhatsAppShareModal';
import { SamplePicker } from './components/SamplePicker';
import { CameraCaptureModal } from './components/CameraCaptureModal';
import {
  Camera,
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Share2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  RotateCcw,
  Zap,
} from 'lucide-react';

export default function App() {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('pidgin');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active Document State
  const [documentAnalysis, setDocumentAnalysis] = useState<DocumentAnalysis | null>(null);
  const [documentImagePreview, setDocumentImagePreview] = useState<string | null>(null);
  const [compressionStats, setCompressionStats] = useState<{ originalKB: number; compressedKB: number; saved: number } | null>(null);
  const [voiceAudioUrl, setVoiceAudioUrl] = useState<string | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [checkedActions, setCheckedActions] = useState<Record<number, boolean>>({});

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const samplesSectionRef = useRef<HTMLDivElement | null>(null);

  const [activeSampleId, setActiveSampleId] = useState<string | null>(null);

  // Fetch Voice Audio from TTS endpoint
  const fetchAudioForScript = async (scriptText: string, lang: string) => {
    setIsLoadingAudio(true);
    setVoiceAudioUrl(null);
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: scriptText, language: lang }),
      });
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await response.json();
        if (data.audio) {
          setVoiceAudioUrl(data.audio);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch audio from server TTS:', err);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  // Analyze Document
  const handleAnalyze = async (payload: { image?: string; mimeType?: string; sampleId?: string; lang?: SupportedLanguage }) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    const targetLang = payload.lang || currentLanguage;

    try {
      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: payload.image,
          mimeType: payload.mimeType,
          sampleId: payload.sampleId,
          language: targetLang,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      let data: any = null;

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const rawText = await response.text();
        console.warn('Non-JSON response from server:', rawText.slice(0, 150));
        throw new Error('Network service is temporarily busy. Please tap Retry or choose a sample document.');
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyze document.');
      }

      const analysis: DocumentAnalysis = data.data;
      setDocumentAnalysis(analysis);
      setCheckedActions({});

      // Request TTS voice note
      if (analysis.voiceNoteScript) {
        fetchAudioForScript(analysis.voiceNoteScript, targetLang);
      }

      // Smooth scroll to analysis
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'Error analyzing document. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // On photo captured via Camera Modal or File
  const handleCapturedPhoto = (result: CompressionResult) => {
    setActiveSampleId(null);
    setDocumentImagePreview(result.base64);
    setCompressionStats({
      originalKB: result.originalSizeKB,
      compressedKB: result.compressedSizeKB,
      saved: result.savedPercentage,
    });
    handleAnalyze({
      image: result.base64,
      mimeType: result.mimeType,
    });
  };

  // Handle standard file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await compressImage(file);
      handleCapturedPhoto(result);
    } catch (err: any) {
      setErrorMessage('Could not process the selected image.');
    }
  };

  // Handle Sample selection
  const handleSelectSample = (sampleId: string) => {
    setActiveSampleId(sampleId);
    setDocumentImagePreview(null);
    setCompressionStats(null);
    handleAnalyze({ sampleId, lang: currentLanguage });
  };

  // Language Change: Re-analyze current document if one is loaded
  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setCurrentLanguage(newLang);
    if (documentAnalysis) {
      if (documentImagePreview) {
        handleAnalyze({ image: documentImagePreview, lang: newLang });
      } else {
        handleAnalyze({ sampleId: activeSampleId || 'sample_tenancy', lang: newLang });
      }
    }
  };

  const toggleActionStep = (stepNumber: number) => {
    setCheckedActions((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.id === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 sm:pb-12">
      {/* Top Navbar */}
      <Navbar
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        onNewScan={() => setIsCameraOpen(true)}
        onOpenSamples={() => samplesSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
      />

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-5 sm:pt-7">
        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs text-rose-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-500 hover:text-rose-700 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Loading Overlay State */}
        {isAnalyzing && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 text-center shadow-sm my-6">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
              <ShieldCheck className="w-6 h-6 text-emerald-600 absolute inset-0 m-auto" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              ExplainAm Dey Scan Document...
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
              Reading clauses, checking hidden fees, and translating to {currentLangObj.name}. E go soon finish!
            </p>
          </div>
        )}

        {/* STATE A: ACTIVE DOCUMENT ANALYSIS VIEW */}
        {!isAnalyzing && documentAnalysis && (
          <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-300">
            {/* Header / Document Overview Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <span>{documentAnalysis.documentType}</span>
                    <span aria-hidden="true">·</span>
                    <span>Language: {currentLangObj.nativeName}</span>
                    {compressionStats && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-700 font-medium">
                          Saved {compressionStats.saved}% data
                        </span>
                      </>
                    )}
                  </div>
                  <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                    {documentAnalysis.title}
                  </h1>
                </div>

                {/* Risk Level Badge & Score */}
                <div className="flex items-center gap-3 shrink-0">
                  <div
                    className={`px-3.5 py-1.5 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 ${
                      documentAnalysis.riskLevel === 'CRITICAL'
                        ? 'bg-rose-50 border-rose-200 text-rose-700'
                        : documentAnalysis.riskLevel === 'WARNING'
                        ? 'bg-amber-50 border-amber-200 text-amber-800'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>{documentAnalysis.riskLevel} WAHALA ({documentAnalysis.riskScore}/100)</span>
                  </div>

                  <button
                    onClick={() => setIsShareModalOpen(true)}
                    type="button"
                    className="min-h-[40px] px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                    title="Share breakdown on WhatsApp"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {/* Language Selector Tabs */}
              <div className="pt-3 pb-1 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mr-1 shrink-0">
                  Translate:
                </span>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => handleLanguageChange(lang.id)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                      currentLanguage === lang.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {lang.flag} {lang.name}
                  </button>
                ))}
              </div>

              {/* Summary Paragraph */}
              <div className="mt-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                {documentAnalysis.summary}
              </div>

              {/* Key Highlights */}
              {documentAnalysis.keyHighlights?.length > 0 && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {documentAnalysis.keyHighlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs text-slate-700 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Audio Voice Note Player Component */}
            <AudioVoiceNotePlayer
              scriptText={documentAnalysis.voiceNoteScript}
              language={currentLangObj.name}
              audioUrl={voiceAudioUrl}
              isLoadingAudio={isLoadingAudio}
              onRefreshAudio={() => fetchAudioForScript(documentAnalysis.voiceNoteScript, currentLanguage)}
            />

            {/* Wahala Clauses Radar */}
            <WahalaClausesList
              clauses={documentAnalysis.wahalaClauses}
              languageName={currentLangObj.name}
            />

            {/* Financial Breakdown (Pocket Impact) */}
            <FinancialSummary financials={documentAnalysis.financialBreakdown} />

            {/* Action Checklist (Wetin to do right now) */}
            {documentAnalysis.actionSteps?.length > 0 && (
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Wetin You Must Do Before You Sign / Pay
                </h3>
                <p className="text-[11px] text-slate-500 mb-3">
                  Check off each step as you complete or negotiate:
                </p>

                <div className="space-y-2">
                  {documentAnalysis.actionSteps.map((step) => {
                    const isChecked = !!checkedActions[step.stepNumber];
                    return (
                      <button
                        key={step.stepNumber}
                        onClick={() => toggleActionStep(step.stepNumber)}
                        type="button"
                        className={`w-full text-left p-3 rounded-xl border text-xs flex items-start gap-3 transition ${
                          isChecked
                            ? 'bg-emerald-50/40 border-emerald-200 text-slate-500 line-through'
                            : 'bg-white border-slate-200 text-slate-800 hover:border-emerald-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition ${
                            isChecked
                              ? 'bg-emerald-600 text-white'
                              : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="leading-relaxed font-medium">
                          {step.stepNumber}. {step.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Follow-Up Q&A with Voice / Speech Recognition */}
            <FollowUpChat
              documentAnalysis={documentAnalysis}
              language={currentLanguage}
            />

            {/* Reset / Scan Another button */}
            <div className="pt-2 flex justify-center">
              <button
                onClick={() => {
                  setDocumentAnalysis(null);
                  setDocumentImagePreview(null);
                  setVoiceAudioUrl(null);
                }}
                type="button"
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 py-2 px-4 rounded-xl hover:bg-slate-200 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Scan Another Document</span>
              </button>
            </div>
          </div>
        )}

        {/* STATE B: EMPTY / HERO LANDING STATE */}
        {!isAnalyzing && !documentAnalysis && (
          <div className="space-y-6">
            {/* Hero Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs text-center relative overflow-hidden">
              <div className="max-w-xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Naija AI for Everyday People</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  No let any agreement confuse you or empty your pocket.
                </h1>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
                  Snap a photo of that intimidating tenancy agreement, shady loan app terms, hospital bill, or school fee notice. ExplainAm explains it in simple Pidgin, Yoruba, Hausa, or Igbo, flags risky clauses, and reads it as a voice note.
                </p>

                {/* Main Action Triggers */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => setIsCameraOpen(true)}
                    type="button"
                    className="w-full sm:w-auto min-h-[48px] px-6 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Take Document Photo</span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    type="button"
                    className="w-full sm:w-auto min-h-[48px] px-6 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload from Phone / Files</span>
                  </button>
                </div>

                {/* Subtext info */}
                <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-center gap-2">
                  <span>📱 In-browser compression saves mobile data</span>
                  <span aria-hidden="true">·</span>
                  <span>🎙️ Voice note explanation</span>
                </div>
              </div>
            </div>

            {/* Hidden Input for direct file picking */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Nigerian Sample Scenarios Carousel */}
            <div ref={samplesSectionRef}>
              <SamplePicker
                onSelectSample={handleSelectSample}
                isLoading={isAnalyzing}
              />
            </div>

            {/* Value Proposition Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white rounded-2xl p-4 border border-slate-200">
                <span className="text-xl mb-2 block">🇳🇬</span>
                <h4 className="text-xs font-bold text-slate-900 mb-1">
                  Speaks Your Language
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Real Pidgin, Yoruba, Hausa, or Igbo. No complicated legal English.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200">
                <span className="text-xl mb-2 block">⚠️</span>
                <h4 className="text-xs font-bold text-slate-900 mb-1">
                  Wahala Radar
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Flags illegal 14-day evictions, contact-shaming loan apps, and non-refundable deposits.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200">
                <span className="text-xl mb-2 block">🎙️</span>
                <h4 className="text-xs font-bold text-slate-900 mb-1">
                  WhatsApp Voice Notes
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Listen to the voice note, then share straight to Mama or your family on WhatsApp.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Sticky Thumb Zone Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 sm:hidden px-4 py-2 flex items-center justify-between gap-2">
        <button
          onClick={() => setIsCameraOpen(true)}
          type="button"
          className="flex-1 min-h-[44px] bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Camera className="w-4 h-4" />
          <span>Snap Document</span>
        </button>

        {documentAnalysis && (
          <button
            onClick={() => setIsShareModalOpen(true)}
            type="button"
            className="min-h-[44px] min-w-[44px] px-3 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden xs:inline">Share</span>
          </button>
        )}
      </div>

      {/* Camera Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCaptureComplete={handleCapturedPhoto}
      />

      {/* WhatsApp Share Modal */}
      {documentAnalysis && (
        <WhatsAppShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          message={documentAnalysis.whatsAppShareMessage}
          documentTitle={documentAnalysis.title}
        />
      )}
    </div>
  );
}
