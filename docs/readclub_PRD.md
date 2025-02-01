# Technical Product Requirements Document (PRD) for the "AI Reading Club" project

## 1. Overview
Product Name: AI Reading Club (powered by "Dewey" – the AI reading companion)
Goal: Provide an AI-enhanced reading experience that helps users read more effectively, stay engaged, and learn via features like inline Q&A, context-based summaries, quizzes/flashcards, and recaps of previously read chapters.

This PRD outlines the key technical components, architecture, and requirements based on:

The blog post describing the prototype, core functionality, and UI/UX goals.
Screenshots showing an interactive reading pane, AI assistant chat pane, and library management.
Additional library choices (React, shadcn) for streamlined frontend development.

## 2. Key Features & Functional Requirements

### Library Screen

Display a list of available books (seeded from a public domain source such as Project Gutenberg).
Show metadata (title, author, genre).
Allow users to search or filter by title/genre.
On selection, navigate to the reading screen for that book.

###  Reading Screen

Provide a clean, distraction-free layout to display book text.
Ensure minimal clutter so the reading experience is central.
Let users select text to summon the AI assistant (Dewey) for questions, clarifications, or quizzes.
Show a "Dewey" button that toggles the AI assistant pane on/off.
Support additional interactive features:
Recap: Summarize recent chapters or sections.
Look up in book: Retrieve references to previously mentioned terms or characters.
Quizzes: Generate flashcards or quizzes based on the selected text.
Review Past Discussions: Indicate where past interactions occurred (via "stickies" or icons) and let users revisit them.
AI Assistant (Dewey)

### Context Awareness:

Display explicit context from user-selected text.
Allow background retrieval from full text so the AI can enrich responses with broader context.

* Q&A: Answer questions about the reading, clarify sections, or provide expansions (interpretation, analysis, references).
* Quizzes/Flashcards: When requested, generate relevant questions or interactive flashcards on the highlighted text.
* Recap: Summarize what has been read so far to help users catch up after a pause.
* Look up in Book: Quickly retrieve references to a term or character from previously read text.
* Conversation History: store, display, and allow re-access to previous interactions either via markers next to paragraphs or in a dedicated reading history pane.

### User Profile & Reading Progress

Track reading progress (percentage read, last location).
Potentially store user's AI interactions for quick recall or re-display in the reading pane.
(Optional) Future expansions for user login, bookmarks, etc.

## 3. Technical Architecture

### 3.1 Frontend

Framework: Next.js (React)

Manages server-side rendering and static site generation for improved performance.
Simplifies routing between the library and reading screens.
UI Layer: React + shadcn

shadcn provides a set of design system components built on Tailwind CSS.
Helps maintain a consistent, aesthetic, and easily customizable UI (e.g., modals for the AI assistant, list components for the library).
React handles state management for reading progress, AI query results, etc.
Styling & Layout:

Tailwind CSS (used under the hood by shadcn).
The reading pane focuses on a typography-friendly style with minimal distractions (large text, adequate spacing, dark/light modes if desired).
Interactions & State Management:

React Hooks or a state library such as Redux (optional) or Next.js's built-in data fetching for server and client states.
Store conversation states, quiz questions, and reading progress in a local store or global context.
Maintain ephemeral states (e.g., currently highlighted text) in React component state.

### 3.2 Backend

Database & Storage: Supabase (PostgreSQL)

Tables:

- books: For storing metadata (title, author, genre) and content. Possibly store text in a text or jsonb field.
- users (if implementing authentication): Basic user profile, preferences, reading states.
- conversations: For saving user–AI interactions tied to each user/book location.

Supports row-level security, easy setup, and excellent documentation for quick iteration.

AI Provider Integration:

- Anthropic, Gemini, OpenAI:
  - Use one or more LLM endpoints to handle queries.
  - Provide specialized calls for summarization, Q&A, or knowledge retrieval.
  - Each provider can be called via the Next.js API routes on the server side:
    - Preprocess request (extract selected text, form context prompt).
Call the chosen LLM API with relevant parameters (e.g., temperature, max tokens).
Postprocess response for display in the UI (truncation, styling, etc.).
Deployment & DevOps: Railway

Used to host the Next.js application and Supabase instance or connect to a managed Supabase deployment.
Provides easy scaling and integrated logging.
railway up for quick deploy, with environment variables for LLM provider keys.

### 4. Data Flow & Sequence

#### User Launches App:

The Next.js server serves the landing page showing the Library Screen.
A GET request fetches the list of books from Supabase, displayed in a minimal shadcn-based list component.

#### User Selects Book:

Navigates via a Next.js route (e.g., /books/[bookId]) to the Reading Screen.
A GET request fetches the book's content from Supabase.
The reading UI displays the text in a scrollable container with "stickies" or icons for previous interactions.

#### User Interacts with Dewey:

On text highlight or "Dewey" button click, the app shifts focus to the AI assistant.
The user can:
Ask a question
Generate a quiz/flashcards
Request a recap or "look up in book"
A POST request is sent to the Next.js API route with:
Book ID, user ID (optional if not anonymous), selected text, last read location
Desired action (Q&A, Quiz, Summary, etc.), plus any previous conversation context
The server calls the appropriate LLM API.
The server returns a JSON payload with the AI's response.
The app displays the result in the assistant pane.

#### Storing Interactions:

For each AI exchange, store the text snippet, user question, and AI response in the conversations table (if user is signed in / if persistent history is required).
For local or anonymous usage, store session-based conversation in client state only.

#### Review Past Discussions:

The reading screen renders an icon or "sticky" next to paragraphs with stored conversations.
Clicking it fetches the conversation from the conversations table or local state.
The conversation is displayed either inline or in the AI assistant pane.

## 5. Non-Functional Requirements

### Performance & Scalability

Next.js and shadcn-based components must render quickly (especially for large text blocks).
On the server side, LLM calls must be optimized to avoid timeouts, with request concurrency handled by the provider's rate limits and the hosting environment.

### Security & Privacy

Users may remain anonymous, but any stored data should be protected if they create an account (e.g., row-level security in Supabase).
LLM keys are stored in environment variables (never exposed to the client).

### Reliability & Monitoring

Use Railway logs or your own logging solution to monitor request volume, error rates, performance bottlenecks.
Consider fallback or p99 timeouts for external LLM calls to handle slow responses.

### Extensibility

Clear separation of concerns in Next.js for library management, reading display, and AI integration.
The UI design in React + shadcn ensures components can be repurposed for new features (e.g., voice input, custom user quizzes).

## 6. Implementation Details by Feature

### Project Structure
```typescript
src/
  ├── components/
  │   ├── layout/
  │   │   ├── Header.tsx          # Top navigation bar
  │   │   └── BookLayout.tsx      # Reading screen layout wrapper
  │   ├── library/
  │   │   ├── BookList.tsx        # Main library view
  │   │   ├── BookCard.tsx        # Individual book entry
  │   │   └── SearchBar.tsx       # Library search/filter
  │   ├── reader/
  │   │   ├── ReaderView.tsx      # Main reading pane
  │   │   ├── TextContent.tsx     # Book text display
  │   │   └── ProgressBar.tsx     # Reading progress indicator
  │   └── dewey/
  │       ├── DeweyPanel.tsx      # AI assistant sidebar
  │       ├── ChatHistory.tsx     # Conversation display
  │       └── ActionButtons.tsx    # Explain/Discuss/Quiz buttons
  ├── pages/
  │   ├── index.tsx               # Library page
  │   ├── books/
  │   │   └── [bookId].tsx        # Reading page
  │   └── api/
  │       └── dewey/
  │           ├── chat.ts         # AI conversation endpoint
  │           └── actions.ts      # Special actions (quiz, recap, etc.)
  └── lib/
      ├── supabase/              # Database client & types
      └── ai/                    # AI provider integration
```

### Component Details

#### Library Screen
- Use `shadcn` list and card components for book display
- Each book entry shows:
  - Title (primary text)
  - Author & date (secondary text)
  - Genre tags (pill/badge components)
  - Comment count indicator (seen in screenshots as number with chat icon)
- Implement search with debounced input
- Support genre filtering via dropdown/tags

#### Reading Screen
- Three-panel layout:
  1. Left: Navigation/back button
  2. Center: Book content (main)
  3. Right: Dewey AI assistant (collapsible)
- Text display features:
  - Clean typography (large, readable font)
  - Proper paragraph spacing
  - Progress indicator (percentage) at bottom
  - Small chat icons in margins where previous discussions exist
- Selection handling:
  - Capture text selection events
  - Show floating action button or context menu
  - Send selected text to Dewey panel

#### Dewey AI Assistant
- Header with:
  - AI model selector (e.g., "Gemini 2.0 Flash")
  - Close/minimize buttons
  - Light/dark mode toggle
- Chat interface showing:
  - Selected text in quote block
  - AI responses in distinct styling
  - Action buttons:
  - Explain
  - Discuss
  - Quiz
  - Recap
  - Look Up in Book
- Error handling with user-friendly messages
- Loading states for AI responses

### Data Models

interface Book {
  id: string
  title: string
  author: string
  dates: string
  genres: string[]
  content: string
  commentCount: number
}

interface Conversation {
  id: string
  bookId: string
  location: number // paragraph index
  selectedText: string
  messages: ChatMessage[]
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  action?: 'explain' | 'discuss' | 'quiz' | 'recap' | 'lookup'
}

### Key Interactions

1. Text Selection Flow:
```typescript
// ReaderView.tsx
const handleTextSelection = () => {
  const selection = window.getSelection()
  if (selection && !selection.isCollapsed) {
    const text = selection.toString()
    setSelectedText(text)
    openDeweyPanel()
  }
}
```

2. AI Response Flow:
```typescript
// DeweyPanel.tsx
const handleAction = async (action: string) => {
  try {
    setLoading(true)
    const response = await fetch('/api/dewey/actions', {
      method: 'POST',
      body: JSON.stringify({
        action,
        selectedText,
        bookContext: currentBookData,
        conversationHistory
      })
    })
    const data = await response.json()
    addMessageToHistory(data)
  } catch (error) {
    showErrorMessage()
  } finally {
    setLoading(false)
  }
}
```

### State Management

Use React Context for:
- Current book data
- Reading progress
- Theme preferences
- Conversation history

Use local component state for:
- Text selection
- UI interactions
- Loading states

### Styling Approach

Use Tailwind CSS (via shadcn) with:
- Dark/light theme variables
- Responsive breakpoints for mobile
- Typography scale for reading view
- Consistent spacing system
- Animation utilities for transitions

This structure provides a solid foundation for the core features while maintaining flexibility for future enhancements. The junior team should focus on implementing these components incrementally, starting with the basic library view and reading interface before adding the AI integration.

## 7. Milestones & Roadmap

### Milestone 1: Basic Reading & Library

Next.js page for library (list of books).
Basic reading page for a single book's text.
Minimal styling with shadcn.
Milestone 2: AI Assistant Integration

Infrastructure to connect to chosen LLM (Gemini, Anthropic, OpenAI).
Display an assistant pane that can parse user selections and return answers.
Implement ephemeral conversation storage in memory (for anonymous usage).
Milestone 3: Persistence & Additional Features

Supabase integration for user profiles, conversation logs, reading progress.
Recap, quizzes, and "look up in book" features.
UI for "stickies" to revisit past conversations.
Milestone 4: Optimization & Enhancements

Mobile-friendly improvements (e.g., responsive AI assistant layout).
Potential voice input, timeline/character map (for fiction).
Integrate analytics or error reporting for debugging.

## 8. Risks & Considerations

LLM Cost & Rate Limits:
Must monitor usage carefully and implement caching or cost-limiting if usage spikes.
Hallucination & Accuracy:
The assistant might produce inaccuracies or "hallucinations." Provide disclaimers or highlight relevant references to mitigate confusion.
Performance Over Large Books:
Book texts can be quite large. Employ strategies such as streaming text to the client or chunking text in the database.

## 9. Success Criteria

User Engagement:

Users frequently highlight text to query the AI, ask for recaps, or generate quizzes.
Positive feedback on the frictionless reading experience.
Performance:

Quick load times for both library and reading screens.
AI responses are returned and displayed within a user-acceptable timeframe (e.g., under 2-3 seconds).
Stability:

Minimal downtime.
Proper logging, with robust error handling around LLM calls.


## Future Enhancements

