export type SupportedLanguage = 'pidgin' | 'yoruba' | 'hausa' | 'igbo' | 'english';

export interface LanguageOption {
  id: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  tagline: string;
}

export interface WahalaClause {
  id: string;
  title: string;
  quote: string;
  riskLevel: 'CRITICAL' | 'WARNING' | 'CAUTION';
  explanation: string;
  betterAlternative: string;
  legalContext?: string;
}

export interface FinancialItem {
  item: string;
  amount: string;
  frequency?: string;
  isHiddenOrShady: boolean;
}

export interface FinancialBreakdown {
  totalDue: string;
  currency: string;
  items: FinancialItem[];
}

export interface ActionStep {
  stepNumber: number;
  text: string;
  priority: 'must_do_first' | 'important' | 'recommended';
  completed?: boolean;
}

export interface DocumentAnalysis {
  title: string;
  documentType: string;
  riskLevel: 'CRITICAL' | 'WARNING' | 'FAIR';
  riskScore: number;
  summary: string;
  keyHighlights: string[];
  wahalaClauses: WahalaClause[];
  financialBreakdown: FinancialBreakdown;
  actionSteps: ActionStep[];
  voiceNoteScript: string;
  whatsAppShareMessage: string;
}

export interface SampleDoc {
  id: string;
  title: string;
  category: string;
  description: string;
  issuer: string;
  date: string;
  mockRawText: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  spokenScript?: string;
}
