import { ProcessedResponse } from './types';

// Helper to simulate network delay
export const simulateDelay = () => 
  new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

// Mock responses for different action types
const mockResponses: Record<string, ProcessedResponse> = {
  explain: {
    type: 'explanation',
    content: {
      mainText: `This passage introduces a key theme of curiosity and its consequences. The protagonist's boredom with conventional reading material ("without pictures or conversations") leads to a moment of whimsy, which then escalates into a fantastical encounter.

The white rabbit serves as a catalyst, transforming an ordinary afternoon into something extraordinary. Note the careful way the text builds from mundane details (sitting by the bank, considering making a daisy-chain) to increasingly unusual elements (a talking rabbit, a waistcoat-pocket, a watch).

The author employs a technique of gradual escalation in the unusual elements, making the fantastic seem more plausible through the narrator's matter-of-fact acceptance.`,
      citations: [
        {
          text: "without pictures or conversations",
          location: 1
        },
        {
          text: "a White Rabbit with pink eyes ran close by her",
          location: 2
        }
      ]
    },
    metadata: {
      processingTime: 0.8,
      tokenCount: 156,
      contextUsed: true
    }
  },

  discuss: {
    type: 'discussion',
    content: {
      mainText: `Let's explore how this passage sets up the contrast between the mundane and the fantastic. What do you think about Alice's initial reaction to the rabbit? It's interesting that she finds nothing "very remarkable" about a talking rabbit at first, but only becomes curious when she sees it checking a watch.

This could lead us to consider:
1. How does the author use Alice's perspective to make the fantastic seem natural?
2. What does this tell us about children's ability to accept the extraordinary?
3. How does the pacing of the scene build up to Alice's decision to follow the rabbit?

What are your thoughts on how this opening establishes the tone for the story?`,
      citations: [
        {
          text: "There was nothing so very remarkable in that",
          location: 3
        }
      ]
    },
    metadata: {
      processingTime: 0.6,
      tokenCount: 142,
      contextUsed: true
    }
  },

  quiz: {
    type: 'quiz',
    content: {
      mainText: "Let's test your understanding of this passage:",
      questions: [
        {
          question: "What was Alice's initial complaint about her sister's book?",
          answer: "It had no pictures or conversations in it",
          type: "recall"
        },
        {
          question: "What two unusual items did the White Rabbit possess?",
          answer: "A waistcoat-pocket and a watch",
          type: "detail"
        },
        {
          question: "How does Alice's reaction to the talking rabbit differ from her reaction to the rabbit's possessions?",
          answer: "She found nothing remarkable about a talking rabbit but was surprised by it having a watch and waistcoat-pocket",
          type: "analysis"
        }
      ]
    },
    metadata: {
      processingTime: 0.7,
      tokenCount: 128,
      contextUsed: true
    }
  },

  recap: {
    type: 'recap',
    content: {
      mainText: `In this section, we've covered:

1. Alice's initial state of boredom with her sister's book
2. Her contemplation about making a daisy-chain
3. The appearance of the White Rabbit
4. The progression of unusual events:
   - The rabbit talking to itself
   - It wearing a waistcoat with a pocket
   - It taking out and checking a watch
5. Alice's decision to follow the rabbit

The scene progresses from ordinary boredom to extraordinary curiosity, setting up the adventure to come.`,
      references: [
        {
          type: "section_start",
          location: 1
        },
        {
          type: "section_end",
          location: 4
        }
      ]
    },
    metadata: {
      processingTime: 0.5,
      tokenCount: 112,
      contextUsed: true
    }
  },

  lookup: {
    type: 'lookup',
    content: {
      mainText: `The White Rabbit appears several times throughout the story. Here are the relevant references:

1. First appearance: Chapter 1, where it runs past Alice checking its watch
2. Later in Chapter 1: It disappears down the rabbit-hole
3. Chapter 2: Alice hears it muttering outside the hallway
4. Chapter 4: It returns looking for its gloves and fan

The rabbit serves as a recurring character that guides Alice through various parts of Wonderland.`,
      references: [
        {
          type: "character_reference",
          location: 2,
          context: "Initial appearance with watch"
        },
        {
          type: "character_reference",
          location: 4,
          context: "Entering rabbit-hole"
        }
      ]
    },
    metadata: {
      processingTime: 0.6,
      tokenCount: 98,
      contextUsed: true
    }
  }
};

// Function to get a mock response with simulated delay
export async function getMockResponse(
  action: keyof typeof mockResponses,
  selectedText: string
): Promise<ProcessedResponse> {
  await simulateDelay();
  
  // Return the mock response or a fallback error response
  return mockResponses[action] || {
    type: 'error',
    content: {
      mainText: 'Sorry, I encountered an error processing your request. Please try again.',
    },
    metadata: {
      processingTime: 0.1,
      tokenCount: 0,
      contextUsed: false
    }
  };
} 