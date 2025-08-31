# Web Frontend Specification - Model Armor Evaluator

## Overview

A web-based frontend for the Model Armor Evaluator service that allows users to test AI model prompts and view Model Armor detection results in real-time.

## Architecture

### Technology Stack

- **Frontend Framework**: React/Vue/Angular (TBD)
- **API Communication**: Connect RPC (gRPC-Web compatible)
- **Generated Types**: TypeScript protobuf bindings
- **Styling**: CSS Framework (TailwindCSS/Material UI/Bootstrap)

### Backend Integration

- **gRPC Service**: `evaluate.v1.EvaluateService`
- **Endpoints**:
  - `ListTemplates()` - Fetch available Model Armor templates
  - `Completions()` - Submit prompt and get AI response with Model Armor results
- **Generated Client**: Using `frontend/src/gen/evaluate/v1/main_connect.ts`

## UI Components & Layout

### 1. Header Section

- **Title**: "Model Armor Evaluator"
- **Subtitle**: Description of the service functionality
- **Template Status Indicator**: Show number of active templates

### 2. Input Form Section

#### Model Selection

- **Component Type**: Dropdown/Select
- **Options**:
  - "gemini-2.5-flash-lite"
  - "gemini-2.5-flash"
  - "gemini-2.5-pro"
- **Validation**: Required field
- **Default**: "gemini-2.5-flash-lite"

#### User Input Form

- **Component Type**: Textarea
- **Label**: "Enter your prompt"
- **Placeholder**: "Type your message here..."
- **Validation**:
  - Required (min 1 character)
  - Max 1000 characters
  - Character counter display
- **Features**:
  - Auto-resize textarea
  - Character count indicator
  - Validation error display

#### Submit Button

- **Text**: "Evaluate Prompt"
- **State**: Disabled during processing
- **Loading indicator**: Spinner/progress indicator

### 3. AI Response Section

#### LLM Output Display

- **Component Type**: Card/Panel
- **Title**: "AI Model Response"
- **Content**:
  - Model response text (max 4000 chars)
  - Copy-to-clipboard button
  - Word/character count
- **States**:
  - Loading state during API call
  - Error state for failed requests
  - Success state with response

### 4. Model Armor Results Section

#### Input Analysis Results

- **Title**: "Prompt Analysis Results"
- **Content**: Results from `user_prompt_result[]`
- **Display Format**: Multiple result cards (one per template)

#### Output Analysis Results

- **Title**: "Response Analysis Results"
- **Content**: Results from `model_response_result[]`
- **Display Format**: Multiple result cards (one per template)

### 5. Result Card Component Structure

Each result card should display:

#### Template Information

- **Template Name**: Extracted from full resource name
- **Template Description**: From templates.yaml
- **Template ID**: Full resource path (collapsible detail)

#### Overall Filter State

- **Status Badge**:
  - 🟢 NO_MATCH_FOUND (Safe)
  - 🔴 MATCH_FOUND (Detected)
  - ⚪ FILTER_MATCH_STATE_UNSPECIFIED (Unknown)

#### Detailed Filter Results

**General Filters** (`filter_results` map):

- **RAI Filter**: Responsible AI content detection
- **SDP Filter**: Sensitive Data Protection
- **PI & Jailbreak**: Prompt injection and jailbreak attempts
- **Malicious URI**: Dangerous link detection
- **CSAM Filter**: Child safety content detection
- **Virus Scan**: Malware detection

**RAI-Specific Results** (`rai_filter_type_results` map):

- **Sexually Explicit Content**
- **Hate Speech**
- **Harassment**
- **Dangerous Content**

Each filter displays:

- Filter name/type
- Match state (Safe/Detected/Unknown)
- Confidence level (Low/Medium/High) for RAI filters
- Color-coded status indicators

## Data Flow

### 1. Application Initialization

```
1. Load application →
2. Call ListTemplates() →
3. Store template data →
4. Render UI with available templates
```

### 2. User Interaction Flow

```
1. User selects model →
2. User enters prompt →
3. Form validation →
4. Submit enabled →
5. Call Completions() →
6. Display loading state →
7. Render results
```

### 3. API Response Processing

```
1. Receive CompletionsResponse →
2. Extract output text →
3. Process user_prompt_result[] →
4. Process model_response_result[] →
5. Render organized results
```

## State Management

### Application State

```typescript
interface AppState {
  // Templates
  templates: Template[];
  templatesLoading: boolean;
  templatesError: string | null;

  // Form
  selectedModel: string;
  userInput: string;
  formValid: boolean;

  // API
  isProcessing: boolean;
  apiError: string | null;

  // Results
  aiResponse: string | null;
  inputResults: Result[];
  outputResults: Result[];
}
```

## UI/UX Requirements

### Responsive Design

- Mobile-first approach
- Tablet and desktop layouts
- Collapsible sections for mobile

### Accessibility

- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader compatibility
- High contrast color scheme options

### Performance

- Lazy loading for large result sets
- Debounced input validation
- Optimistic UI updates
- Error boundary components

### User Experience

- Clear loading states
- Informative error messages
- Success/failure indicators
- Copy-to-clipboard functionality
- Collapsible detailed results
- Filter toggle (show only matches)

## Error Handling

### API Errors

- Network connectivity issues
- Server errors (5xx)
- Client errors (4xx)
- Validation errors
- Timeout handling

### User Input Errors

- Empty input validation
- Character limit exceeded
- Invalid model selection
- Form submission without required fields

### Display Errors

- Graceful error boundaries
- User-friendly error messages
- Retry mechanisms
- Fallback UI states

## Security Considerations

### Input Sanitization

- XSS prevention for displayed content
- Safe rendering of user input
- Content Security Policy (CSP)

### Data Handling

- No persistent storage of sensitive prompts
- Clear data on page refresh option
- Privacy-conscious result display

## Configuration

### Environment Variables

- API endpoint URL
- Environment mode (dev/prod)
- Feature flags
- Debug mode settings

### Build Configuration

- TypeScript strict mode
- Bundle optimization
- Code splitting
- Static asset optimization

## Testing Requirements

### Unit Tests

- Component rendering
- State management
- Validation logic
- Error handling

### Integration Tests

- API communication
- Form submission flow
- Result processing
- Error scenarios

### E2E Tests

- Complete user journey
- Cross-browser compatibility
- Mobile responsiveness
- Accessibility compliance

## Performance Metrics

### Core Web Vitals

- Largest Contentful Paint (LCP) < 2.5s
- First Input Delay (FID) < 100ms
- Cumulative Layout Shift (CLS) < 0.1

### Application Metrics

- Initial page load < 3s
- API response handling < 500ms
- Form validation < 100ms
- Result rendering < 1s
