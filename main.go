package main

import (
	"context"
	"log/slog"
	"os"

	"github.com/hi120ki/model-armor-evaluator/internal/config"
	"github.com/hi120ki/model-armor-evaluator/internal/server"
	"github.com/hi120ki/model-armor-evaluator/internal/service/evaluate"
	"github.com/hi120ki/model-armor-evaluator/internal/service/modelarmor"
)

func main() {
	// JSON structured logging
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}))
	slog.SetDefault(logger)

	// Load configuration from environment variables
	env, err := config.LoadEnvConfig()
	if err != nil {
		os.Exit(1)
	}

	// Load templates configuration from YAML file
	templatesConfig, err := config.LoadTemplatesConfig(env.TemplatesFile)
	if err != nil {
		os.Exit(1)
	}

	// Create Model Armor service
	modelArmorService, err := modelarmor.NewService(context.Background(), templatesConfig.Localtion)
	if err != nil {
		slog.Error("error creating Model Armor service",
			slog.String("error", err.Error()),
		)
		os.Exit(1)
	}
	defer modelArmorService.Close()

	// Create evaluate handler
	evaluateHandler, err := evaluate.NewHandler(
		env.Project,
		env.Location,
		templatesConfig,
		modelArmorService,
	)
	if err != nil {
		slog.Error("error creating evaluate handler",
			slog.String("error", err.Error()),
		)
		os.Exit(1)
	}

	// Create and start server
	srv := server.NewServer(env.Port, evaluateHandler)
	if err := srv.Start(); err != nil {
		slog.Error("Server failed to start", "error", err)
		os.Exit(1)
	}
}
