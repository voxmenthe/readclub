import { NextRequest } from 'next/server';
import { llmService } from '@/lib/ai/llm-service';
import { LLMRequest } from '@/lib/ai/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const llmRequest: LLMRequest = {
      action: body.action,
      selectedText: body.selectedText,
      question: body.question,
      bookContext: body.bookContext,
      conversationHistory: body.conversationHistory
    };

    const response = await llmService.processRequest(llmRequest);
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error processing LLM request:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
} 