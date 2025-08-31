# Protobuf Specifications - Model Armor Evaluator

## Service Definition

The Model Armor Evaluator exposes a gRPC service `EvaluateService` with two main endpoints:

### EvaluateService

**Package**: `evaluate.v1`
**Go Package**: `github.com/hi120ki/model-armor-evaluator/gen/evaluate/v1`

#### Methods

1. **ListTemplates**: Returns available Model Armor templates
   - Request: `ListTemplatesRequest` (empty)
   - Response: `ListTemplatesResponse` containing list of templates

2. **Completions**: Processes AI completions with Model Armor evaluation
   - Request: `CompletionsRequest` with user input and model selection
   - Response: `CompletionsResponse` with AI output and filter results

## Message Definitions

### ListTemplatesRequest

- Empty message (no parameters needed)

### ListTemplatesResponse

- `repeated Template templates = 1`

### Template

- `string name = 1` - Template name (1-200 chars, required)
- `string description = 2` - Template description (max 1000 chars)

### CompletionsRequest

- `string input = 1` - User prompt (1-1000 chars, required)
- `string model = 2` - AI model selection (enum validation):
  - "gemini-2.5-flash-lite"
  - "gemini-2.5-flash"
  - "gemini-2.5-pro"

### CompletionsResponse

- `string output = 1` - AI model response (max 4000 chars)
- `repeated Result user_prompt_result = 2` - Model Armor results for user input
- `repeated Result model_response_result = 3` - Model Armor results for AI output

### Result

- `Template template = 1` - Template used for evaluation
- `FilterMatchState filter_match_state = 2` - Overall match state
- `map<string, FilterResult> filter_results = 3` - Detailed filter results by type
- `map<string, RaiFilterTypeResult> rai_filter_type_results = 4` - RAI-specific results

## Enums and Types

### FilterMatchState

```proto
enum FilterMatchState {
  FILTER_MATCH_STATE_UNSPECIFIED = 0;
  NO_MATCH_FOUND = 1;
  MATCH_FOUND = 2;
}
```

### FilterResult (oneof)

Different filter types with their match states:

- `rai_filter_result` - Responsible AI filter
- `sdp_filter_result` - Sensitive Data Protection
- `pi_and_jailbreak_filter_result` - Prompt injection and Jailbreak
- `malicious_uri_filter_result` - Malicious URI detection
- `csam_filter_filter_result` - CSAM (Child Sexual Abuse Material)
- `virus_scan_filter_result` - Virus scanning

### RaiFilterTypeResult

- `RaiFilterType filter_type = 1` - Type of RAI filter
- `DetectionConfidenceLevel confidence_level = 2` - Detection confidence
- `FilterMatchState match_state = 3` - Match result (output only)

### RaiFilterType

```proto
enum RaiFilterType {
  RAI_FILTER_TYPE_UNSPECIFIED = 0;
  SEXUALLY_EXPLICIT = 2;
  HATE_SPEECH = 3;
  HARASSMENT = 6;
  DANGEROUS = 17;
}
```

### DetectionConfidenceLevel

```proto
enum DetectionConfidenceLevel {
  DETECTION_CONFIDENCE_LEVEL_UNSPECIFIED = 0;  // Same as LOW_AND_ABOVE
  LOW_AND_ABOVE = 1;     // Highest chance of false positive
  MEDIUM_AND_ABOVE = 2;  // Some chance of false positives
  HIGH = 3;              // Low chance of false positives
}
```

## Validation Rules

- Input validation using `buf/validate/validate.proto`
- String length constraints enforced on all text fields
- Model selection restricted to approved Gemini variants
- Template names must follow Google Cloud resource naming format:
  `projects/{project}/locations/{location}/templates/{template}`

## Integration Notes

- Based on Google Cloud Model Armor service proto definitions
- Uses Connect RPC for gRPC-Web compatibility
- Supports browser clients through HTTP/2
- All requests/responses validated using protobuf validation rules
