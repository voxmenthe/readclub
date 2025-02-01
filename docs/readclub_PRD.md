# Technical Product Requirements Document (PRD) for the "AI Reading Club"

## 1. Overview

**Product Name**: AI Reading Club (powered by "Dewey" – the AI reading companion)  
**Goal**: Provide an AI-enhanced reading experience that helps users read more effectively, stay engaged, and learn via inline Q&A, context-based summaries, quizzes/flashcards, and recaps of previously read chapters.

---

## 2. Key Features & Functional Requirements

1. **Library Screen**  
   - Display a list of available public-domain books (e.g., from Project Gutenberg).  
   - Show book metadata (title, author, genre), and allow searching/filtering.  
   - Upon selection, navigate to the Reading Screen.

2. **Reading Screen**  
   - Central reading pane with minimal clutter.  
   - The user can select text to get help from Dewey (the AI assistant).  
   - A collapsible AI assistant pane for Q&A, summaries, quizzes, and "look up in book."  
   - "Stickies" or icons in the margin to revisit past conversations.

3. **AI Assistant (Dewey)**  
   - Understand context from user selections and the broader book.  
   - Provide Q&A, quizzes/flashcards, recaps, and "look up in book" references.  
   - Maintain conversation history with user.

4. **User Profile & Reading Progress**  
   - Track reading location (percentage read).  
   - (Optional) Store user interactions if signed in (via Supabase).

---

## 3. Technical Architecture

1. **Frontend**  
   - **Next.js (React)**: for routing, server-side rendering, and page organization.  
   - **UI Library**: React + shadcn (Tailwind-based).  
   - **State Management**: React hooks and/or Next.js app directory features for data fetching.  

2. **Backend**  
   - **Database**: Supabase (PostgreSQL).  
   - **LLM Provider**: Integrate with Anthropic, OpenAI, or Google Gemini.  
   - **Deployment**: Hosted on Railway (or a similar service) to manage Next.js + Supabase.  

3. **Data Flow**  
   - The library screen fetches book metadata (titles, authors) from Supabase.  
   - The reading screen pulls full text from Supabase (or SSG/SSR in Next.js).  
   - When the user interacts with Dewey, requests go through a Next.js API route that calls an LLM API and returns a JSON response.  
   - Conversations may be stored in Supabase (for persistent user history) or in-memory (for anonymous/ephemeral sessions).

---

## 4. Data Flow & Sequence

1. **User opens the app** → Library Screen loads books from Supabase.  
2. **User selects a book** → Reading Screen fetches that book's text and renders it.  
3. **User highlights text** → The AI assistant panel can be shown to handle user requests (Q&A, quiz, etc.).  
4. **LLM call** → Next.js server sends the request to the LLM provider; returns an answer.  
5. **Conversation stored** → If the user is signed in, the interaction is stored in Supabase (book ID, conversation ID, text snippet).  
6. **User revisits old Q&A** → "Stickies" or markers link back to stored conversations.

---

## 5. Non-Functional Requirements

1. **Performance**: Quick load times for the library and reading text; LLM responses within ~2–3 seconds.  
2. **Scalability**: Design for many books, large amounts of text, multiple concurrent AI requests.  
3. **Security & Privacy**: LLM API keys in server environment variables; user data protected (row-level security in Supabase).  
4. **Reliability & Monitoring**: Use logs to monitor usage, handle errors gracefully.  
5. **Extensibility**: The codebase should easily allow new features like voice queries, advanced note-taking, etc.

---

## 6. Implementation Details by Feature

### 6.1 Project Structure

A recommended structure is:

```
src/
  ├─ components/
  │   ├─ library/
  │   │   ├─ BookList.tsx       # Renders list of books
  │   │   ├─ BookCard.tsx       # Individual book UI
  │   │   └─ SearchBar.tsx      # Search/filter input
  │   ├─ reader/
  │   │   ├─ ReaderView.tsx     # Main reading layout
  │   │   ├─ TextContent.tsx    # Displays paragraphs of the book
  │   │   ├─ ProgressBar.tsx    # Shows % read
  │   │   └─ MacroSummary.tsx   # Right-side document summary pane
  │   ├─ dewey/
  │   │   ├─ DeweyPanel.tsx     # AI assistant sidebar
  │   │   ├─ ChatHistory.tsx    # Conversation display
  │   │   └─ ActionButtons.tsx  # Buttons for Q&A, Recap, Quiz, etc.
  │   └─ layout/
  │       ├─ Header.tsx         # Main header / nav
  │       └─ BookLayout.tsx     # Shared layout for reading screen
  ├─ pages/
  │   ├─ index.tsx              # Library page
  │   ├─ books/
  │   │   └─ [bookId].tsx       # Reading page
  │   └─ api/
  │       └─ dewey/
  │           ├─ chat.ts        # AI conversation endpoint
  │           └─ actions.ts     # Quiz/Recap/Lookup endpoints
  └─ lib/
      ├─ supabase/              # Database client & query helpers
      └─ ai/                    # Integration with LLM providers
```

### 6.2 Library Screen

**Requirements**  
- Display a searchable/filterable list of books.  
- Show basic metadata (title, author, genre).  
- Let the user navigate to `/books/[bookId]` when a book is clicked.

**Implementation Steps**  
1. **BookList**: Fetch books from Supabase in `getServerSideProps` or Next.js app directory data fetching.  
2. **SearchBar**: Implement a debounced search (e.g., 300ms) to filter books.  
3. **BookCard**: Display book title, author, and optional comment/interaction counts.

**Testing**  
- **Test**: Confirm the page loads a list of books from Supabase.  
- **Test**: Searching for a known title returns the correct subset of books.  
- **Test**: Clicking a book navigates to the correct `bookId` route.

### 6.3 Reading Screen

**Requirements**  
- Present the selected book's text in an easy-to-read format.  
- Show reading progress.  
- Enable seamless text selection and question formulation:
  - Selected text automatically populates the question input area
  - Users can edit both the selected text and their question in one place
  - Clear visual distinction between selected text and question input
  - Support for keyboard shortcuts (e.g., Cmd/Ctrl+Enter to submit)
  - Automatic focus management for fluid interaction
- Display the most recent Q&A interaction prominently.
- Show a scrollable history of past questions and discussions.
- Provide a collapsible right-side pane showing a macro-level document summary.
- Optionally show icons or markers where past AI conversations exist.

**Implementation Steps**  
1. **ReaderView**: Layout with:
   - Left sidebar or top nav
   - Main reading pane
   - Integrated question input area
   - Dewey panel (initially hidden)
   - Collapsible macro summary pane on the right
2. **TextContent**: 
   - Render paragraphs with unique IDs or indexes
   - Handle text selection events
   - Manage selection state and coordinate with question input
3. **QuestionInput**:
   - Pre-populate with selected text
   - Allow seamless editing of both text and question
   - Provide clear visual separation between context and question
   - Support markdown formatting
   - Handle keyboard shortcuts
   - Manage focus states
4. **ProgressBar**: Calculate reading progress based on scroll position.
5. **Q&A Display**:
   - Show recent Q&A at the top
   - Provide scrollable history below
   - Make past questions clickable
6. **MacroSummaryPane**: Show document-wide context
7. **Conversation Markers**: Place icons next to paragraphs with prior conversations

**Testing**  
- **Test**: The reading page loads text from Supabase for the correct `bookId`.  
- **Test**: Scrolling updates the progress bar.  
- **Test**: Most recent Q&A is displayed prominently and correctly.
- **Test**: Past questions are accessible and clicking them shows the full conversation.
- **Test**: Macro summary pane can be collapsed/expanded and shows correct document-wide context.
- **Test**: For a known conversation in paragraph N, verify an icon appears next to that paragraph.

### 6.4 AI Assistant (Dewey Panel)

**Requirements**  
- Provide an integrated question formulation experience:
  - Seamlessly combine selected text and user questions
  - Allow editing of context and questions together
  - Support rich text formatting
  - Clear visual hierarchy between selected text and question
- Handle various AI interactions (explain, discuss, quiz, etc.)
- Show conversation history
- Support panel collapse/expand
- Provide clear loading and error states

**Implementation Steps**  
1. **DeweyPanel**: 
   - Collapsible sidebar with smooth transitions
   - Integrated question input area
   - Action buttons for different AI interactions
   - Conversation history display
2. **QuestionFormulation**:
   - Combined editor for selected text and questions
   - Clear visual separation between context and question
   - Markdown support for formatting
   - Keyboard shortcuts for common actions
3. **ActionButtons**: 
   - Primary actions (Explain, Discuss, Quiz, etc.)
   - Clear loading states
   - Error handling
4. **ChatHistory**: 
   - Render conversation messages
   - Support for rich text formatting
   - Clear visual hierarchy

### 6.5 Conversation Persistence

**Requirements**  
- If the user is logged in, store conversation snippets in Supabase's `conversations` table.  
- For anonymous sessions, store them in memory (cleared on refresh).

**Implementation Steps**  
1. **Database Models**:  
   ```ts
   interface Conversation {
     id: string
     userId?: string
     bookId: string
     location: number   // paragraph index or offset
     selectedText: string
     messages: ChatMessage[]
   }

   interface ChatMessage {
     role: 'user' | 'assistant'
     content: string
     timestamp: string
     action?: 'explain' | 'discuss' | 'quiz' | 'recap' | 'lookup'
   }
   ```
2. **Client-Side**:  
   - After AI response, post conversation data to Supabase if user is logged in.  
   - On reading page load, fetch prior `conversations` for that `bookId`.

**Testing**  
- **Test**: Start a conversation, refresh the page → Confirm the conversation reappears (if logged in).  
- **Test**: Anonymous user sees conversation only until refresh (stored in local state).

### 6.6 Supabase Integration

**Requirements**  
- Use Supabase for storing books, user data, conversation logs.  
- Potentially store large book texts in a text or `jsonb` column.

**Implementation Steps**  
1. **Supabase Client**: Initialize in `lib/supabase/index.ts` with the project URL/key from environment variables.  
2. **Queries**:  
   - `getBooks()`: fetch all or filter by search.  
   - `getBookById(bookId)`: retrieve a single book's text.  
   - `saveConversation()`: insert or update conversation record.  
3. **Row-Level Security**: If implementing user accounts, ensure only that user can view their conversation data.

**Testing**  
- **Test**: Insert a mock book, confirm it shows on the library screen.  
- **Test**: Insert a conversation log, confirm retrieval for the same user and book.

### 6.7 LLM Integration

**Requirements**  
- Provide a flexible interface for LLM integration with development/production modes:
  - Development mode: Use pre-defined responses for quick testing
  - Production mode: Use actual LLM calls with proper error handling
- Support different types of interactions:
  - Explain: Detailed explanation of selected text
  - Discuss: Open-ended discussion about themes, meaning, etc.
  - Quiz: Generate relevant questions about the content
  - Recap: Summarize previous content
  - Look Up: Find references to terms/characters in the book
- Maintain conversation context:
  - Track current conversation thread
  - Access broader book context when needed
  - Support reference to previous discussions
- Handle errors and rate limiting gracefully

**Implementation Steps**  
1. **LLM Service Layer**:
   ```typescript
   interface LLMConfig {
     mode: 'development' | 'production';
     model: 'gemini-pro' | 'gpt-4' | 'claude-3';
     apiKey?: string;
     maxTokens?: number;
     temperature?: number;
   }

   interface LLMRequest {
     action: 'explain' | 'discuss' | 'quiz' | 'recap' | 'lookup';
     selectedText: string;
     question?: string;
     bookContext?: {
       title: string;
       currentLocation: number;
       previousDiscussions?: Array<Discussion>;
     };
     conversationHistory?: Array<Message>;
   }
   ```

2. **Response Processing**:
   - Implement middleware for each action type
   - Format responses based on action (e.g., quiz format vs. explanation)
   - Add citations/references where applicable
   - Handle markdown formatting

3. **Development Mode**:
   - Create a set of realistic placeholder responses
   - Simulate network delays and errors
   - Allow override of specific responses for testing

4. **Production Mode**:
   - Implement proper error handling and retries
   - Add rate limiting and token counting
   - Cache common responses where appropriate
   - Log usage and errors for monitoring

5. **Context Management**:
   - Track conversation threads
   - Maintain book context in memory/storage
   - Implement context window management

**Testing**  
- Unit tests for each action type
- Integration tests with mock LLM responses
- Error handling and rate limit testing
- Context management testing
- Toggle between dev/prod modes testing

### 6.8 Response Processing

**Requirements**  
- Process raw LLM responses into structured formats:
  ```typescript
  interface ProcessedResponse {
    type: 'explanation' | 'discussion' | 'quiz' | 'recap' | 'lookup';
    content: {
      mainText: string;
      citations?: Array<Citation>;
      questions?: Array<QuizQuestion>;
      references?: Array<BookReference>;
    };
    metadata: {
      processingTime: number;
      tokenCount: number;
      contextUsed: boolean;
    };
  }
  ```

**Implementation Steps**  
1. **Response Processors**:
   - Create specialized processors for each action type
   - Implement markdown parsing and formatting
   - Add citation extraction and verification
   - Handle response validation

2. **Error Handling**:
   - Define clear error types and messages
   - Implement fallback responses
   - Add retry logic for recoverable errors

3. **Response Enhancement**:
   - Add relevant book citations
   - Cross-reference with previous discussions
   - Format for optimal display

---

## 7. Milestones & Roadmap

Below are the implementation milestones in order of priority. Each milestone should be **completed and tested** before moving to the next:

### **Milestone 1: Project Setup & Basic UI** ✓
1. **Tasks**  
   - Initialize Next.js project with TypeScript and Tailwind CSS
   - Set up project structure and documentation
   - Create basic component hierarchy
   - Implement placeholder UI for all major features
2. **Testing**  
   - **Smoke Test**: App runs without errors
   - **Visual Test**: All components render properly
   - **Navigation Test**: Routes work as expected

### **Milestone 2: Text Selection & Basic Dewey Interaction**
1. **Tasks**  
   - Add text selection handlers to reading view
   - Create floating action menu for selected text
   - Implement Dewey panel collapse/expand
   - Add scroll position tracking for progress bar
2. **Testing**  
   - **Selection Test**: Text selection works smoothly
   - **UI Test**: Action menu appears in correct position
   - **Progress Test**: Reading progress updates accurately

### **Milestone 3: Reading Experience Enhancement**
1. **Tasks**  
   - Add reading controls (font size, line height)
   - Implement proper typography and spacing
   - Add mobile-responsive layout
   - Implement proper touch handling
2. **Testing**  
   - **Control Test**: Reading controls work properly
   - **Mobile Test**: UI works on different screen sizes
   - **Touch Test**: Mobile interactions are smooth

### **Milestone 4: Supabase Integration**
1. **Tasks**  
   - Set up Supabase project
   - Create database schema
   - Implement book fetching and storage
   - Add reading progress persistence
2. **Testing**  
   - **Data Test**: Books load correctly
   - **State Test**: Reading progress persists
   - **Performance Test**: Loading times are acceptable

### **Milestone 5: LLM Integration**
1. **Tasks**  
   - Choose and integrate LLM provider
   - Implement conversation handling
   - Add response caching if needed
   - Set up error handling
2. **Testing**  
   - **Response Test**: LLM provides relevant answers
   - **Performance Test**: Response times are acceptable
   - **Error Test**: Failures are handled gracefully

### **Milestone 6: Enhanced Features**
1. **Tasks**  
   - Implement book search and filtering
   - Add user highlights and notes
   - Add conversation persistence
   - Implement "Look up in book" feature
2. **Testing**  
   - **Search Test**: Book finding works efficiently
   - **Storage Test**: User data persists correctly
   - **Feature Test**: All enhanced features work as expected

---

## 8. Risks & Considerations

1. **LLM Cost & Rate Limits**: Keep usage logs and implement caching if queries spike.  
2. **Accuracy / Hallucination**: Make it clear that AI answers may have errors.  
3. **Performance Over Large Text**: Consider streaming or chunking big books in the reading pane.  
4. **User Accounts vs. Anonymous**: Evaluate which features require sign-in (persistence, personal notes).  

---

## 9. Success Criteria

1. **User Engagement**: Users regularly highlight text, ask questions, generate quizzes, or request recaps.  
2. **Performance**: The library screen and reading screen load quickly, and LLM responses arrive under ~3 seconds.  
3. **Stability**: Minimal crashes or unhandled errors; robust logs for error diagnosis.  
4. **Positive Feedback**: Users find the reading + AI experience intuitive and helpful.
