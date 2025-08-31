# Model Armor Evaluator Project

## Project Overview

Go-based gRPC service that evaluates AI model prompts and responses using Google Cloud's Model Armor service. Acts as a proxy for content sanitization before and after AI model interactions.

## Architecture

### Technology Stack

- **Language**: Go 1.25.0
- **Framework**: Connect RPC (gRPC-Web compatible)
- **Main Services**:
  - Google Cloud Model Armor (content sanitization)
  - Google GenAI (AI model inference)
- **Protocol**: gRPC with protobuf definitions
- **Code Generation**: Buf CLI for Go and TypeScript

### Package Structure (Refactored)

The codebase follows a layered architecture organized under the `internal/` directory:

- **internal/config/**: Configuration management
  - Environment variables handling (`EnvConfig`)
  - YAML template configuration loading (`TemplatesConfig`)
- **internal/service/**: Business logic layer
  - **modelarmor/**: Google Cloud Model Armor client wrapper and service methods
  - **evaluate/**: gRPC service handlers for template listing and AI completions
- **internal/converter/**: Data transformation layer
  - Protobuf conversions between Google Cloud and internal types
- **internal/server/**: HTTP/gRPC server setup
  - Server initialization, routing, validation interceptors, static file serving
- **main.go**: Application entry point (64 lines, simplified)

### Service Flow

1. Accept user prompts + AI model config
2. Sanitize prompts via Model Armor templates
3. Generate AI responses via Google GenAI
4. Sanitize responses via Model Armor templates
5. Return AI response + sanitization results

### Request Flow Architecture

1. HTTP/gRPC requests → **server** package (routing and validation)
2. Service handlers in **evaluate** package process requests
3. **modelarmor** service sanitizes prompts/responses via Google Cloud API
4. **converter** package transforms between protobuf types
5. Responses flow back through the same layers

## Key Files

- `main.go`: Application entry point that coordinates service initialization
- `proto/evaluate/v1/main.proto`: Service definitions with RAI filter support
- `templates.yaml`: Model Armor template configurations
- `gen/`: Generated Go protobuf code
- `frontend/src/gen/`: Generated TypeScript protobuf code

## Development Commands

- `go run main.go`: Run server (port 8080)
- `make generate`: Generate code from protobuf files
- `./test.sh`: Run gRPC service integration tests
- `make setup`: Install buf CLI
- `go fmt ./...`: Format all Go code
- `go mod tidy`: Clean up module dependencies

## Service Initialization Order

The application follows this startup sequence:

1. Configure structured logging
2. Load environment configuration (`internal/config`)
3. Load template configuration from YAML
4. Initialize Model Armor service client
5. Create evaluate handler with all dependencies
6. Start HTTP/gRPC server

## Configuration

- **Environment Variables**: PROJECT, LOCATION, PORT, CONFIG_FILE
- **Supported Models**: gemini-2.5-flash-lite, gemini-2.5-flash, gemini-2.5-pro
- **Template Format**: `projects/{project}/locations/{location}/templates/{template}`
- **Default Port**: 8080
- **Logging**: Structured JSON logging via slog

## Testing

- **Integration Tests**: `test.sh` script tests both endpoints against running server
- **Unit Tests**: `go test ./...` for package-level testing
- **gRPC Testing**: Uses buf CLI for schema validation

## Recent Architectural Changes

- Refactored from single `main.go` (496 lines) to layered architecture
- Separated concerns into dedicated packages under `internal/`
- Improved testability and maintainability
- Clear dependency injection pattern
- Enhanced code organization and readability
