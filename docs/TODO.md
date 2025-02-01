# TODO List

## Next Milestone: Text Selection & Basic Dewey Interaction

### High Priority
1. **Text Selection & Question Input Implementation**
   - Add text selection event listeners to `TextContent`
   - Create question input component in Dewey panel that:
     - Pre-populates with selected text
     - Allows editing of both selected text and question
     - Has clear visual separation between text and question
     - Supports markdown formatting
   - Add keyboard shortcuts for common actions
   - Implement proper focus management

2. **LLM Integration Setup**
   - Create LLM service layer with dev/prod modes:
     - Set up configuration interface
     - Implement development mode with mock responses
     - Add production mode with Gemini integration
     - Create response processors for each action type
   - Add environment variable handling:
     - LLM API keys
     - Mode toggle (dev/prod)
     - Rate limiting settings
   - Implement error handling and retries
   - Add response caching where appropriate

3. **Dewey Panel Improvements**
   - Add collapse/expand functionality
   - Create question input component
   - Implement proper scroll behavior for chat history
   - Add loading states for LLM interactions
   - Style the question input area to match the screenshot
   - Add proper error states and messages

4. **Progress Bar Implementation**
   - Add scroll position tracking
   - Calculate and display reading progress
   - Save progress to localStorage

### Medium Priority
1. **LLM Response Processing**
   - Implement specialized processors for each action:
     - Explanation formatter
     - Discussion handler
     - Quiz generator
     - Recap processor
     - Look-up handler
   - Add markdown parsing and formatting
   - Implement citation extraction
   - Add response validation

2. **Context Management**
   - Implement conversation thread tracking
   - Add book context management
   - Create context window handling
   - Set up previous discussion references

3. **UI Polish**
   - Fix component import linter errors
   - Add proper loading states for book content
   - Implement error boundaries
   - Add proper transitions for panel open/close

4. **Reading Experience**
   - Add font size controls
   - Implement proper paragraph spacing
   - Add chapter navigation (if applicable)
   - Consider adding line height controls

### Low Priority
1. **Development Tools**
   - Create mock response generator
   - Add response override capability
   - Implement network delay simulation
   - Add debugging tools for LLM responses

2. **Testing Infrastructure**
   - Set up unit tests for LLM processors
   - Add integration tests with mock responses
   - Create error handling test suite
   - Implement context management tests

3. **Documentation**
   - Document LLM integration
   - Create response format specifications
   - Document dev/prod mode usage
   - Add troubleshooting guides

## Future Milestones
1. **Enhanced LLM Features**
   - Add response caching
   - Implement rate limiting
   - Add usage monitoring
   - Optimize token usage

2. **Supabase Integration**
   - Set up Supabase project
   - Create database schema
   - Implement real book fetching
   - Add user authentication

3. **Enhanced Features**
   - Add search functionality
   - Implement book filtering
   - Add user highlights/notes
   - Implement social features (if planned) 