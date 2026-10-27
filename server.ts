import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Body parser for handling compressed images
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

import { SAMPLE_DOCUMENTS } from './src/data/samplePresets.ts';
import { SupportedLanguage } from './src/types.ts';

// Helper: prompt generation for document analysis
function getSystemPrompt(language: string) {
  const langInstructions: Record<string, string> = {
    pidgin: `You are ExplainAm, a street-smart, highly knowledgeable Nigerian legal and consumer rights advisor.
Explain the document in authentic, engaging, warm Nigerian Pidgin (e.g., "Wahala dey!", "Hold body first", "No gree for anybody", "Dem wan bill you", "E mean say").
Flag every shady trick, hidden cost, fine print clause, and illegal forfeiture.
Be crystal clear, comforting, and provide practical street-smart advice under Nigerian law (Lagos Tenancy Law, FCCPC consumer rules, CBN guidelines, CAMA, etc.).`,
    yoruba: `You are ExplainAm, explaining intimidating documents in clear, respectful, natural Yoruba mixed with everyday conversational clarity.
Clearly translate legal concepts into simple Yoruba terms so mothers, traders, and youths can understand every clause.
Highlight warnings (ikilọ pataki), costs (owó ti wọn fẹ gba), and hidden risks.`,
    hausa: `You are ExplainAm, explaining intimidating agreements and bills in clear, respectful, and simple Hausa.
Translate legal terms into clear everyday language that anyone can understand without a lawyer.
Clearly flag risks (gargadi da hatsari), payments (kudaden da ake bukata), and practical next steps.`,
    igbo: `You are ExplainAm, explaining complex documents in clear, natural, and accessible Igbo.
Explain the clauses, total money involved, and risky traps (ọnyà dị n'ime akwụkwọ a) clearly for ordinary people.`,
    english: `You are ExplainAm, a friendly, ultra-clear consumer advocate breaking down intimidating contracts into 8th-grade Simple English.
Zero legal jargon. Plain words, high-contrast risk badges, total financial tally, and practical counter-proposals.`
  };

  const selectedInstruction = langInstructions[language] || langInstructions.pidgin;

  return `${selectedInstruction}

IMPORTANT OUTPUT FORMAT:
You MUST return ONLY valid JSON matching this exact structure:
{
  "title": "Short title of document (e.g. Lagos Tenancy Agreement - Yaba)",
  "documentType": "Type (e.g. Tenancy Agreement, Loan Terms, Hospital Bill, School Notice, Government Demand)",
  "riskLevel": "CRITICAL" | "WARNING" | "FAIR",
  "riskScore": number (0 to 100, where 0 is completely safe, 50 is caution, 90+ is severe predatory trap),
  "summary": "2-3 clear sentences in the chosen language explaining what this document is actually about in simple human words",
  "keyHighlights": ["Point 1", "Point 2", "Point 3", "Point 4"],
  "wahalaClauses": [
    {
      "id": "wh-1",
      "title": "Short descriptive title of the risky clause in plain words",
      "quote": "Exact or relevant quote from the document text",
      "riskLevel": "CRITICAL" | "WARNING" | "CAUTION",
      "explanation": "Why this clause is dangerous for the user in the selected language",
      "betterAlternative": "What the user should ask for or write instead to protect themselves",
      "legalContext": "Relevant Nigerian law or consumer right (e.g. Lagos Tenancy Law 2011, FCCPC Digital Lending regulations)"
    }
  ],
  "financialBreakdown": {
    "totalDue": "Total money mentioned (e.g. N1,250,000)",
    "currency": "NGN (₦)",
    "items": [
      {
        "item": "Name of fee/charge",
        "amount": "Amount in Naira or specified currency",
        "frequency": "One-off / Monthly / Annual / Hidden",
        "isHiddenOrShady": boolean
      }
    ]
  },
  "actionSteps": [
    {
      "stepNumber": 1,
      "text": "Concrete practical step in the chosen language",
      "priority": "must_do_first" | "important" | "recommended"
    }
  ],
  "voiceNoteScript": "A conversational 40-70 word audio voice note script written specially to be spoken out loud like a WhatsApp voice message from a smart, protective brother or sister in Nigeria advising the user.",
  "whatsAppShareMessage": "A punchy, formatted WhatsApp message (with bullet points and emojis) ready to copy or share with family."
}`;
}

// Multi-model fallback for handling transient 503 high demand spikes
async function generateContentWithFallback(aiInstance: GoogleGenAI, params: {
  contents: any;
  config: any;
  preferredModel?: string;
}) {
  const models = [
    params.preferredModel || 'gemini-3.8-flash',
    'gemini-flash-latest',
    'gemini-3.1-flash-lite',
  ];

  let lastError: any = null;

  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    try {
      const response = await aiInstance.models.generateContent({
        model: model,
        contents: params.contents,
        config: params.config,
      });
      return { response, modelUsed: model };
    } catch (err: any) {
      lastError = err;
      const isTransient =
        err?.status === 503 ||
        err?.message?.includes('503') ||
        err?.message?.includes('high demand') ||
        err?.message?.includes('UNAVAILABLE') ||
        err?.message?.includes('RESOURCE_EXHAUSTED') ||
        err?.status === 429;

      console.warn(`Model ${model} attempt failed (${err?.status || err?.message}). Transient: ${isTransient}`);

      if (!isTransient || i === models.length - 1) {
        break;
      }

      // Small jitter backoff before fallback model
      await new Promise((res) => setTimeout(res, 600 * (i + 1)));
    }
  }

  throw lastError;
}

// 1. GET /api/samples - List realistic sample documents
app.get('/api/samples', (_req, res) => {
  res.json({ samples: SAMPLE_DOCUMENTS });
});

// 2. POST /api/analyze-document - Vision document analysis
app.post('/api/analyze-document', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  try {
    const { image, mimeType, language = 'pidgin', sampleId } = req.body;
    const langKey = (language || 'pidgin') as SupportedLanguage;

    // Check if user selected one of our pre-built samples
    if (sampleId) {
      const sample = SAMPLE_DOCUMENTS.find((s) => s.id === sampleId) || SAMPLE_DOCUMENTS[0];
      if (sample) {
        // Retrieve instant precomputed analysis for the requested language
        const preset = sample.presetAnalysis[langKey] || sample.presetAnalysis.pidgin || sample.presetAnalysis.english;
        if (preset) {
          return res.json({ success: true, data: preset, source: 'sample_preset' });
        }
      }
    }

    // Live uploaded/photographed document
    if (!image) {
      return res.status(200).json({
        success: false,
        error: 'Please provide a document photo or choose a sample document.'
      });
    }

    if (!apiKey) {
      const sample = SAMPLE_DOCUMENTS[0];
      const preset = sample.presetAnalysis[langKey] || sample.presetAnalysis.pidgin;
      return res.json({
        success: true,
        data: preset,
        source: 'demo_fallback',
        warning: 'Gemini API key not configured. Showing sample analysis.'
      });
    }

    // Clean base64 data
    const cleanBase64 = image.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');

    const imagePart = {
      inlineData: {
        mimeType: mimeType || 'image/jpeg',
        data: cleanBase64,
      },
    };

    const textPart = {
      text: `Carefully read this document photo. Transcribe all text, extract every fee, find hidden or risky terms (wahala clauses), and explain everything thoroughly for an everyday person in ${language}.`,
    };

    // 20-second timeout wrapper to prevent gateway 504 timeouts
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI request timed out. Please try again.')), 20000)
    );

    const generatePromise = generateContentWithFallback(ai, {
      preferredModel: 'gemini-3.8-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction: getSystemPrompt(language),
        responseMimeType: 'application/json',
      },
    });

    const { response, modelUsed } = await Promise.race([generatePromise, timeoutPromise]);

    const resultText = response.text;
    if (!resultText) {
      throw new Error('No response text received from Gemini');
    }

    let cleanJson = resultText.trim();
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    }

    const structuredData = JSON.parse(cleanJson);
    return res.json({ success: true, data: structuredData, source: `gemini-vision (${modelUsed})` });
  } catch (error: any) {
    console.error('Error analyzing document:', error);
    const isDemandSpike =
      error?.status === 503 ||
      error?.message?.includes('503') ||
      error?.message?.includes('high demand') ||
      error?.message?.includes('UNAVAILABLE') ||
      error?.message?.includes('timed out');

    // Always return HTTP 200 with JSON body to prevent Cloud Run proxy from replacing responses with HTML error pages
    if (isDemandSpike) {
      return res.status(200).json({
        success: false,
        isOverloaded: true,
        error: 'The AI model is experiencing a high-demand spike. Please tap Retry or choose a sample document.',
        details: error.toString()
      });
    }

    return res.status(200).json({
      success: false,
      error: error.message || 'Failed to analyze document. Please ensure the photo is clear and try again.',
      details: error.toString()
    });
  }
});

// 3. POST /api/tts - Voice note generation
app.post('/api/tts', async (req, res) => {
  try {
    const { text, language = 'pidgin' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    if (!apiKey) {
      return res.json({
        audio: null,
        fallbackToBrowserTts: true,
        text,
        message: 'No API key configured. Browser voice synthesis will play.'
      });
    }

    // Try Gemini TTS with gemini-3.8-flash-lite-tts
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: text,
                speechMetadata: {
                  style: 'Warm, clear, empathetic, authentic Nigerian advisor voice note',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        return res.json({
          audio: `data:audio/wav;base64,${base64Audio}`,
          format: 'wav',
          source: 'gemini-tts'
        });
      }
    } catch (ttsErr: any) {
      console.warn('Gemini TTS attempt failed, falling back to browser synthesis:', ttsErr.message);
    }

    // If Gemini TTS is busy or returns empty, fallback to client-side speech synthesis
    return res.json({
      audio: null,
      fallbackToBrowserTts: true,
      text,
      message: 'Falling back to client speech synthesis'
    });
  } catch (error: any) {
    console.error('TTS error:', error);
    return res.json({
      audio: null,
      fallbackToBrowserTts: true,
      text: req.body?.text || '',
      error: error.message
    });
  }
});

// 4. POST /api/ask-question - Follow-up Q&A
app.post('/api/ask-question', async (req, res) => {
  try {
    const { question, documentContext, language = 'pidgin', history = [] } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    if (!apiKey) {
      return res.json({
        answer: `[Demo Mode] For this question: "${question}", under Nigerian consumer protection and tenancy laws, you have the right to request full clarity and reject unlawful eviction or hidden fees. Please configure your GEMINI_API_KEY for live answers!`,
        spokenScript: `Regarding your question, by law dem no fit force you. Always ask for written agreement!`
      });
    }

    const contextPrompt = `
You are ExplainAm, answering a follow-up question from a Nigerian citizen about a document they uploaded.
Document Title: ${documentContext?.title || 'Unknown Document'}
Document Summary: ${documentContext?.summary || 'Not provided'}
Wahala Clauses Flagged: ${JSON.stringify(documentContext?.wahalaClauses || [])}
Financial Total: ${JSON.stringify(documentContext?.financialBreakdown || {})}

User's Question: "${question}"

Language Requirement: Answer in ${language} (authentic Nigerian Pidgin, Yoruba, Hausa, Igbo, or Simple English).
Tone: Empathetic, street-smart, actionable, protective of citizen rights under Nigerian law.
Keep your response concise (2-3 short paragraphs max).
Also provide a 30-word "spokenScript" for a voice note.

Respond in JSON format:
{
  "answer": "Clear, friendly, actionable answer in ${language}",
  "spokenScript": "Short 25-35 word voice note response"
}`;

    const { response } = await generateContentWithFallback(ai, {
      preferredModel: 'gemini-3.8-flash',
      contents: contextPrompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    let cleanAnswerText = (response.text || '').trim();
    if (cleanAnswerText.startsWith('```')) {
      cleanAnswerText = cleanAnswerText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    }

    const parsed = JSON.parse(cleanAnswerText || '{}');
    return res.json({
      success: true,
      answer: parsed.answer || response.text,
      spokenScript: parsed.spokenScript || parsed.answer
    });
  } catch (error: any) {
    console.error('Follow-up error:', error);
    const isDemandSpike =
      error?.status === 503 ||
      error?.message?.includes('503') ||
      error?.message?.includes('high demand') ||
      error?.message?.includes('UNAVAILABLE');

    return res.status(200).json({
      success: false,
      isOverloaded: isDemandSpike,
      answer: isDemandSpike
        ? 'The AI model is experiencing a high demand spike right now. Under standard law you are protected from arbitrary enforcement. Please try asking again in a few seconds.'
        : 'Failed to process question. Please try asking again.',
      spokenScript: 'The network is busy right now. Please ask again in a moment.'
    });
  }
});

// In development, hook up Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ExplainAm Server running on port ${PORT} [Mode: ${process.env.NODE_ENV || 'development'}]`);
  });
}

startServer();
