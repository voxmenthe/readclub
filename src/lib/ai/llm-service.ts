import { LLMConfig, LLMRequest, ProcessedResponse } from './types';
import { getMockResponse } from './mock-responses';

class LLMService {
  private config: LLMConfig;
  
  constructor(config: LLMConfig) {
    this.config = config;
  }

  async processRequest(request: LLMRequest): Promise<ProcessedResponse> {
    try {
      if (this.config.mode === 'development') {
        return await getMockResponse(request.action, request.selectedText);
      }

      // TODO: Implement production mode with actual LLM calls
      throw new Error('Production mode not yet implemented');

    } catch (error) {
      console.error('Error in LLM service:', error);
      return {
        type: 'error',
        content: {
          mainText: 'Sorry, I encountered an error processing your request. Please try again.',
        },
        metadata: {
          processingTime: 0,
          tokenCount: 0,
          contextUsed: false
        }
      };
    }
  }

  // Helper method to update config
  updateConfig(newConfig: Partial<LLMConfig>) {
    this.config = { ...this.config, ...newConfig };
  }
}

// Create a singleton instance with default development config
const defaultConfig: LLMConfig = {
  mode: 'development',
  model: 'gemini-pro',
  temperature: 0.7,
  maxTokens: 1000
};

export const llmService = new LLMService(defaultConfig); 