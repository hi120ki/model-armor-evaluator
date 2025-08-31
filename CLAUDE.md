# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Go-based gRPC service that evaluates AI model prompts and responses using Google Cloud's Model Armor service. The service acts as a proxy that:

1. Accepts user prompts and AI model configurations
2. Sanitizes prompts using Model Armor templates before sending to AI models
3. Generates AI responses using Google GenAI models
4. Sanitizes model responses using Model Armor templates
5. Returns both the AI response and sanitization results

## Development Commands

### Build and Run

```bash
go run main.go                    # Run the server directly
make hello                        # Basic test command
```

### Code Generation

```bash
make setup                        # Install buf CLI for protobuf
make generate                     # Generate Go/TypeScript code from protobuf files
```

### Testing

```bash
./test.sh                         # Run gRPC service tests (requires server running)
go test ./...                     # Run Go tests
```

### Code Quality

```bash
pre-commit run --all-files        # Run all pre-commit hooks
go fmt ./...                      # Format Go code
go mod tidy                       # Clean up module dependencies
```

## Architecture

The codebase follows a layered architecture with clear separation of concerns organized under the `internal/` directory:

### Package Structure

- **internal/config/**: Configuration management (environment variables and YAML templates)
- **internal/service/**: Business logic layer
  - **modelarmor/**: Google Cloud Model Armor client wrapper
  - **evaluate/**: gRPC service handlers for template listing and AI completions
- **internal/converter/**: Data transformation layer (protobuf conversions between Google Cloud and internal types)
- **internal/server/**: HTTP/gRPC server setup, routing, and static file serving
- **main.go**: Application entry point that coordinates service initialization

### Request Flow

1. HTTP/gRPC requests → **server** package (routing and validation)
2. Service handlers in **evaluate** package process requests
3. **modelarmor** service sanitizes prompts/responses via Google Cloud API
4. **converter** package transforms between protobuf types
5. Responses flow back through the same layers

### Core Components

- **proto/evaluate/v1/main.proto**: gRPC service definition
- **templates.yaml**: Model Armor template configurations

### Generated Code Structure

- **gen/**: Go protobuf generated code
- **frontend/src/gen/**: TypeScript protobuf generated code

### Configuration

- **templates.yaml**: Model Armor template configurations (location and template definitions)
- **Environment variables**: PORT, PROJECT, LOCATION, CONFIG_FILE

### External Dependencies

- **Google Cloud Model Armor**: Content sanitization service
- **Google GenAI**: AI model inference service
- **Connect RPC**: gRPC-Web compatible HTTP/2 service framework
- **Buf**: Protobuf management and code generation

### Service Endpoints

- `ListTemplates`: Returns available Model Armor templates
- `Completions`: Processes user input through sanitization, AI generation, and response sanitization

## Key Development Notes

- Server runs on port 8080 by default (configurable via PORT env var)
- Uses structured JSON logging via slog
- Supports gRPC-Web for browser compatibility
- All requests/responses are validated using protobuf validation rules
- Pre-commit hooks enforce code quality across Go, Python, JS/TS, Terraform, and Markdown
- Template names must follow Google Cloud resource naming: `projects/{project}/locations/{location}/templates/{template}`

### Service Initialization Order

The application follows this startup sequence in main.go:

1. Configure structured logging
2. Load environment configuration (`internal/config`)
3. Load template configuration from YAML
4. Initialize Model Armor service client
5. Create evaluate handler with all dependencies
6. Start HTTP/gRPC server

### Testing

The `test.sh` script provides integration testing against a running server:

- Tests both `ListTemplates` and `Completions` endpoints
- Requires server to be running on localhost:8080
- Uses buf CLI for gRPC testing with schema validation

## Environment Setup

Required environment variables:

- `PROJECT`: Google Cloud project ID
- `LOCATION`: Google Cloud location (default: us-central1)
- `CONFIG_FILE`: Path to templates YAML file (default: templates.yaml)

Supported AI models (defined in protobuf):

- gemini-2.5-flash-lite
- gemini-2.5-flash
- gemini-2.5-pro
