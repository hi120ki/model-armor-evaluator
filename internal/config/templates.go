package config

import (
	"log/slog"
	"os"

	"github.com/goccy/go-yaml"
)

type TemplatesConfig struct {
	Localtion string `yaml:"localtion"`
	Templates []struct {
		Name        string `yaml:"name"`
		Description string `yaml:"description"`
	} `yaml:"templates"`
}

func LoadTemplatesConfig(filename string) (*TemplatesConfig, error) {
	var templatesConfig TemplatesConfig
	f, err := os.ReadFile(filename)
	if err != nil {
		slog.Error("error reading templates file",
			slog.String("error", err.Error()),
			slog.String("file", filename),
		)
		return nil, err
	}
	if err := yaml.Unmarshal(f, &templatesConfig); err != nil {
		slog.Error("error parsing templates file",
			slog.String("error", err.Error()),
			slog.String("file", filename),
		)
		return nil, err
	}
	slog.Info("Loaded templates configuration",
		"file", filename,
		"templates_count", len(templatesConfig.Templates),
	)
	return &templatesConfig, nil
}
