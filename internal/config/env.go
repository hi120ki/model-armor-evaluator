package config

import (
	"log/slog"

	"github.com/kelseyhightower/envconfig"
)

type EnvConfig struct {
	Port          string `envconfig:"PORT" default:"8080"`
	Project       string `envconfig:"PROJECT"`
	Location      string `envconfig:"LOCATION" default:"us-central1"`
	TemplatesFile string `envconfig:"CONFIG_FILE" default:"templates.yaml"`
}

func LoadEnvConfig() (*EnvConfig, error) {
	var env EnvConfig
	if err := envconfig.Process("", &env); err != nil {
		slog.Error("error loading configuration",
			slog.String("error", err.Error()),
		)
		return nil, err
	}
	return &env, nil
}
