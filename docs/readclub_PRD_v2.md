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
  │   │   └─ ProgressBar.tsx    # Shows % read
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
- Optionally show icons or markers where past AI conversations exist.

**Implementation Steps**  
1. **ReaderView**: Layout with (a) left sidebar or top nav, (b) main reading pane, (c) Dewey panel (initially hidden).  
2. **TextContent**: Render paragraphs with unique IDs or indexes (for conversation references).  
3. **ProgressBar**: Calculate reading progress based on scroll position vs. total text length.  
4. **Conversation Markers**: If the user has prior conversation data, place icons or highlights next to paragraphs.

**Testing**  
- **Test**: The reading page loads text from Supabase for the correct `bookId`.  
- **Test**: Scrolling updates the progress bar.  
- **Test**: For a known conversation in paragraph N, verify an icon appears next to that paragraph.

### 6.4 AI Assistant (Dewey)

**Requirements**  
- Appears as a collapsible pane or modal.  
- Displays the user's question and AI responses.  
- Allows actions: "Explain," "Discuss," "Quiz," "Recap," "Look up in book."

**Implementation Steps**  
1. **DeweyPanel**: A sidebar that can open/close; holds conversation messages.  
2. **ActionButtons**: The user can choose an action after highlighting text or from pre-labeled buttons.  
3. **ChatHistory**: Renders conversation messages from in-memory or Supabase.  
4. **Highlight-based Summons**: Listen for `mouseup` on the reading pane; if text is selected, show a small floating button (or automatically open Dewey with that text as context).

**Testing**  
- **Test**: Selecting text triggers the Dewey panel to open with the snippet in a quote block.  
- **Test**: Clicking "Explain" hits the correct Next.js API endpoint and returns an AI answer.  
- **Test**: "Quiz" generates a question/answer set or flashcards in the UI.

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
- Provide a standard interface for calling the chosen LLM (Anthropic, OpenAI, or Gemini).  
- Handle specialized requests: Q&A, summarization, "look up in book," quiz generation.

**Implementation Steps**  
1. **ai/index.ts**: Create a function `callLLM(params): Promise<string>` that standardizes the API call.  
2. **Request Shaping**: Prepend the selected text and book context.  
3. **API Route**: `pages/api/dewey/actions.ts` to handle different action types (`explain`, `quiz`, etc.) and call `callLLM()` accordingly.  
4. **Error Handling**: If the LLM fails or times out, show a user-friendly error message.

**Testing**  
- **Test**: Make a dummy request to the LLM (e.g., "Hello world") and confirm a response arrives.  
- **Test**: Summaries, quiz questions, or lookups produce appropriate results without error.  
- **Test**: Large text input triggers partial context trimming or chunking (avoid token overload).

---

## 7. Milestones & Roadmap

Below are expanded milestones with recommended testing steps at each stage. Each milestone should be **completed and tested** before moving to the next:

### **Milestone 1: Project Setup & Basic UI** ✓
1. **Tasks**  
   - Initialize a Next.js project with TypeScript.  
   - Set up basic routes: `/` (library), `/books/[bookId]` (reading screen).
   - Create component structure and implement basic UI.
   - Add placeholder content for development.
2. **Testing**  
   - **Smoke Test**: Run `npm run dev` and ensure the app opens with placeholder text.  
   - **Acceptance**: Confirm the directory structure matches the planned layout and no build errors occur.

### **Milestone 2: Text Selection & Basic Dewey Interaction**
1. **Tasks**  
   - Implement text selection in reading view.
   - Add floating action button for selected text.
   - Create collapsible Dewey panel with proper scroll behavior.
   - Add progress bar with scroll position tracking.
2. **Testing**  
   - **Test**: Text selection triggers floating action button.
   - **Test**: Dewey panel collapses/expands smoothly.
   - **Test**: Progress bar accurately reflects scroll position.

### **Milestone 3: Reading Experience Enhancement**
1. **Tasks**  
   - Add font size and line height controls.
   - Implement proper paragraph spacing and typography.
   - Add chapter navigation if applicable.
   - Optimize for mobile devices.
2. **Testing**  
   - **Test**: Reading controls work as expected.
   - **Test**: Layout remains stable across different screen sizes.
   - **Test**: Touch interactions work properly on mobile.

### **Milestone 4: Supabase Integration**
1. **Tasks**  
   - Set up Supabase project and schema.
   - Implement book fetching and storage.
   - Add user authentication (optional).
   - Store reading progress.
2. **Testing**  
   - **Test**: Books load from Supabase correctly.
   - **Test**: Reading progress persists between sessions.

### **Milestone 5: LLM Integration**
1. **Tasks**  
   - Choose and integrate LLM provider.
   - Implement conversation handling.
   - Add rate limiting and error handling.
   - Set up response caching if needed.
2. **Testing**  
   - **Test**: LLM responses are relevant and timely.
   - **Test**: Error states are handled gracefully.

### **Milestone 6: Conversation Persistence in Supabase**

1. **Tasks**  
   - Create `conversations` and `messages` tables in Supabase.  
   - If the user is signed in (optional auth step), store each new AI exchange.  
   - On reading page load, fetch and display conversation markers/stickies next to paragraphs.
2. **Testing**  
   - **Test**: The conversation data is inserted properly after each user→assistant exchange.  
   - **Test**: Refreshing the reading page loads the user's past messages.  
   - **Test**: Clicking on a sticky displays that conversation snippet in the Dewey panel.  
   - **Acceptance**: Authenticated users see their entire chat history consistently; anonymous users see ephemeral chat only.

### **Milestone 7: "Look Up in Book" & Recap Features**

1. **Tasks**  
   - Implement "Look Up in Book": search the entire text for references to a character or term.  
   - Provide a short snippet of each match and link the user directly to those paragraphs.  
   - Enhance "Recap" to summarize all text read up to the user's current progress location.
2. **Testing**  
   - **Test**: Searching for a character name in "Look Up in Book" returns correct references.  
   - **Test**: "Recap" only includes text up to the last read paragraph.  
   - **Acceptance**: The user can quickly jump to all prior mentions of a term and get a condensed summary of the preceding chapters.

### **Milestone 8: UI Polishing & Responsive Design**

1. **Tasks**  
   - Refine styling in `ReaderView`, ensure Dewey panel looks good on mobile (collapsible, full-screen overlay, etc.).  
   - Add "dark mode" toggle if desired.  
   - Add animations or transitions for panel open/close.
2. **Testing**  
   - **Test**: Check app layout on various devices (phone, tablet, desktop).  
   - **Test**: Switch to dark mode – text remains readable, icons remain visible.  
   - **Acceptance**: The reading experience feels smooth, with minimal layout shifting on different screen sizes.

### **Milestone 9: Performance, Error Handling, & Final QA**

1. **Tasks**  
   - Optimize large-book rendering (lazy load or chunking if necessary).  
   - Implement robust error handling around LLM calls (timeouts, rate-limit messages).  
   - Log any unhandled exceptions to your logging/monitoring system (Railway logs, etc.).  
2. **Testing**  
   - **Load Test**: Try loading a book with thousands of paragraphs. Check memory usage and scroll performance.  
   - **Rate Limit Test**: Exceed LLM call thresholds; confirm the user sees a graceful message.  
   - **Acceptance**: The app remains stable, with no major performance spikes or crashes during normal usage.

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
