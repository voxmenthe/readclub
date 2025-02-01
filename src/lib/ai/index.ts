export interface AIResponse {
  content: string;
  type: 'explanation' | 'discussion' | 'quiz' | 'recap' | 'lookup';
}

export async function callLLM(
  text: string,
  action: AIResponse['type'],
  bookContext?: string
): Promise<AIResponse> {
  // This will be implemented once we choose an LLM provider
  throw new Error('LLM integration not implemented yet');
}

export async function generateQuiz(text: string): Promise<AIResponse> {
  return callLLM(text, 'quiz');
}

export async function explainText(text: string): Promise<AIResponse> {
  return callLLM(text, 'explanation');
}

export async function discussText(text: string): Promise<AIResponse> {
  return callLLM(text, 'discussion');
}

export async function recapText(text: string): Promise<AIResponse> {
  return callLLM(text, 'recap');
}

export async function lookupInBook(query: string, bookText: string): Promise<AIResponse> {
  return callLLM(query, 'lookup', bookText);
}
