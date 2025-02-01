// Configuration types
export interface LLMConfig {
  mode: 'development' | 'production';
  model: 'gemini-pro' | 'gemini-flash';
  apiKey?: string;
  maxTokens?: number;
  temperature?: number;
}

// Request types
export interface LLMRequest {
  action: 'explain' | 'discuss' | 'quiz' | 'recap' | 'lookup';
  selectedText: string;
  question?: string;
  bookContext?: BookContext;
  conversationHistory?: Message[];
}

export interface BookContext {
  title: string;
  currentLocation: number;
  previousDiscussions?: Discussion[];
}

// Response types
export interface ProcessedResponse {
  type: ResponseType;
  content: ResponseContent;
  metadata: ResponseMetadata;
}

export type ResponseType = 
  | 'explanation' 
  | 'discussion' 
  | 'quiz' 
  | 'recap' 
  | 'lookup'
  | 'error';

export interface ResponseContent {
  mainText: string;
  citations?: Citation[];
  questions?: QuizQuestion[];
  references?: BookReference[];
}

export interface ResponseMetadata {
  processingTime: number;
  tokenCount: number;
  contextUsed: boolean;
}

// Shared types
export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  action?: ResponseType;
}

export interface Discussion {
  id: string;
  location: number;
  selectedText: string;
  messages: Message[];
}

export interface Citation {
  text: string;
  location: number;
}

export interface QuizQuestion {
  question: string;
  answer: string;
  type: 'recall' | 'detail' | 'analysis';
}

export interface BookReference {
  type: 'section_start' | 'section_end' | 'character_reference' | 'theme_reference';
  location: number;
  context?: string;
} 