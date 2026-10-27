import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, DocumentAnalysis } from '../types';
import { Send, Mic, MicOff, MessageSquareText, Volume2, User, Bot } from 'lucide-react';

interface FollowUpChatProps {
  documentAnalysis: DocumentAnalysis;
  language: string;
}

export const FollowUpChat: React.FC<FollowUpChatProps> = ({
  documentAnalysis,
  language,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'yoruba' ? 'yo-NG' : language === 'hausa' ? 'ha-NG' : language === 'igbo' ? 'ig-NG' : 'en-NG';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuestion((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleMic = () => {
    if (!speechSupported || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Speech recognition start failed:', err);
      }
    }
  };

  const handleAsk = async (questionToAsk = inputQuestion) => {
    const query = questionToAsk.trim();
    if (!query || isSubmitting) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/ask-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          documentContext: {
            title: documentAnalysis.title,
            summary: documentAnalysis.summary,
            wahalaClauses: documentAnalysis.wahalaClauses,
            financialBreakdown: documentAnalysis.financialBreakdown,
          },
          language,
        }),
      });

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.answer || 'I am looking into this clause according to consumer law.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        spokenScript: data.spokenScript,
      };

      setMessages((prev) => [...prev, botMsg]);

      // Speak answer if speech synthesis is available
      if ('speechSynthesis' in window && data.spokenScript) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(data.spokenScript);
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error('Failed to ask question:', err);
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'assistant',
        text: 'Sorry, network issue encountered. Please try asking again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const sampleQuestions = [
    'Fit they throw me comot if I delay payment for 7 days?',
    'Is the landlord caution deposit refundable by law?',
    'Wetin be the true total money I must pay?',
    'What should I write down to reject this trap?',
  ];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <MessageSquareText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Ask Any Question About This Document
            </h3>
            <p className="text-[11px] text-slate-500">
              Speak or type in your language. Get straight legal and practical advice.
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Quick Questions */}
      {messages.length === 0 && (
        <div className="mb-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Suggested questions to ask:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {sampleQuestions.map((sq, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAsk(sq)}
                className="text-left text-xs bg-slate-50 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-200 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition"
              >
                "{sq}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message History */}
      {messages.length > 0 && (
        <div className="space-y-3 max-h-72 overflow-y-auto mb-3 pr-1">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2 text-xs ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.sender === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl p-3 ${
                  m.sender === 'user'
                    ? 'bg-slate-900 text-white'
                    : 'bg-emerald-50/70 border border-emerald-100 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className="text-[10px] opacity-70 font-bold uppercase">
                    {m.sender === 'user' ? 'You' : 'ExplainAm'}
                  </span>
                  <span className="text-[10px] opacity-60 tabular-nums">
                    {m.timestamp}
                  </span>
                </div>
                <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>

                {m.sender === 'assistant' && (
                  <button
                    onClick={() => speakText(m.spokenScript || m.text)}
                    type="button"
                    className="mt-2 text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 opacity-90 hover:opacity-100"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Play voice note</span>
                  </button>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>
      )}

      {/* Input Bar with Mic and Send */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk();
        }}
        className="flex items-center gap-2 pt-2 border-t border-slate-100"
      >
        {speechSupported && (
          <button
            type="button"
            onClick={toggleMic}
            aria-label={isListening ? 'Stop listening' : 'Start voice question'}
            className={`min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center transition ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title={isListening ? 'Listening... Tap to stop' : 'Tap to ask with voice'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        )}

        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          placeholder={isListening ? 'Listening to your voice...' : 'Ask e.g. "Fit landlord lock my door?"'}
          disabled={isSubmitting}
          className="flex-1 min-h-[44px] text-xs px-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <button
          type="submit"
          disabled={!inputQuestion.trim() || isSubmitting}
          aria-label="Send question"
          className="min-h-[44px] min-w-[44px] bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
};
