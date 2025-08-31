package server

import (
	"fmt"
	"log/slog"
	"net/http"
	"strings"

	"connectrpc.com/connect"
	"connectrpc.com/validate"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"

	"github.com/hi120ki/model-armor-evaluator/gen/evaluate/v1/v1connect"
	"github.com/hi120ki/model-armor-evaluator/internal/service/evaluate"
)

type Server struct {
	port            string
	evaluateHandler *evaluate.Handler
}

func NewServer(port string, evaluateHandler *evaluate.Handler) *Server {
	return &Server{
		port:            port,
		evaluateHandler: evaluateHandler,
	}
}

func (s *Server) Start() error {
	// Create gRPC server with validation interceptor
	validationInterceptor, err := validate.NewInterceptor()
	if err != nil {
		return fmt.Errorf("error creating validation interceptor: %w", err)
	}

	// Create HTTP server with gRPC-Web support and static file serving
	httpMux := http.NewServeMux()

	// Serve static assets from frontend build
	httpMux.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir("/frontend/dist/assets"))))

	// Handle gRPC service requests
	servicePath, serviceHandler := v1connect.NewEvaluateServiceHandler(
		s.evaluateHandler,
		connect.WithInterceptors(validationInterceptor),
	)
	httpMux.Handle(servicePath, serviceHandler)

	// Health check endpoint
	httpMux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		fmt.Fprint(w, `{"status":"ok","service":"model-armor-evaluator"}`)
	})

	// Serve frontend SPA - catch all routes that don't match API patterns
	httpMux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Don't serve frontend for API routes
		if strings.HasPrefix(r.URL.Path, "/evaluate") ||
			strings.HasPrefix(r.URL.Path, "/health") {
			http.NotFound(w, r)
			return
		}

		// Serve frontend index.html for all other routes (SPA routing)
		http.ServeFile(w, r, "/frontend/dist/index.html")
	})

	httpServer := &http.Server{
		Addr:    fmt.Sprintf(":%s", s.port),
		Handler: h2c.NewHandler(httpMux, &http2.Server{}),
	}

	slog.Info("Starting HTTP server with gRPC and frontend support",
		"port", s.port,
	)
	return httpServer.ListenAndServe()
}
