# Multi-stage build - Frontend build stage
FROM node:22-alpine AS frontend-builder

# Set working directory for frontend
WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package.json frontend/package-lock.json* ./

# Install frontend dependencies
RUN npm install

# Copy frontend source code
COPY frontend/ ./

# Build frontend
RUN npm run build

# Go build stage
FROM golang:1.25-alpine AS go-builder

# Set working directory
WORKDIR /app

# Copy Go module files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build static binary with CGO disabled
# -ldflags="-s -w" reduces binary size by stripping debug info
RUN CGO_ENABLED=0 GOOS=linux go build \
    -ldflags="-s -w" \
    -o model-armor-evaluator \
    ./main.go

# Production stage - Distroless image
FROM gcr.io/distroless/static-debian12:nonroot

# Run as non-root user
USER nonroot:nonroot

# Copy binary from go-builder stage
COPY --from=go-builder --chown=nonroot:nonroot /app/model-armor-evaluator /model-armor-evaluator

# Copy templates.yaml configuration file
COPY --from=go-builder --chown=nonroot:nonroot /app/templates.yaml /templates.yaml

# Copy frontend build artifacts
COPY --from=frontend-builder --chown=nonroot:nonroot /app/frontend/dist /frontend/dist

# Set environment variables
ENV CONFIG_FILE=/templates.yaml
ENV PORT=8080

# Expose port
EXPOSE 8080

# Set entrypoint
ENTRYPOINT ["/model-armor-evaluator"]
