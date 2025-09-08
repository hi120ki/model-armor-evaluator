package modelarmor

import (
	"context"
	"fmt"

	modelarmor "cloud.google.com/go/modelarmor/apiv1"
	modelarmorpb "cloud.google.com/go/modelarmor/apiv1/modelarmorpb"
	"google.golang.org/api/option"
)

type Service struct {
	client   *modelarmor.Client
	location string
}

func NewService(ctx context.Context, location string) (*Service, error) {
	// Create options for Model Armor client with location-specific endpoint
	opts := option.WithEndpoint(fmt.Sprintf("modelarmor.%s.rep.googleapis.com:443", location))

	client, err := modelarmor.NewClient(ctx, opts)
	if err != nil {
		return nil, fmt.Errorf("failed to create Model Armor client for location %s: %w", location, err)
	}

	return &Service{
		client:   client,
		location: location,
	}, nil
}

// SanitizeUserPrompt sanitizes user prompt using Model Armor
func (s *Service) SanitizeUserPrompt(ctx context.Context, templateName, userPrompt string) (*modelarmorpb.SanitizationResult, error) {
	// Initialize request argument(s)
	userPromptData := &modelarmorpb.DataItem{
		DataItem: &modelarmorpb.DataItem_Text{
			Text: userPrompt,
		},
	}

	// Prepare request for sanitizing user prompt with proper template name format
	req := &modelarmorpb.SanitizeUserPromptRequest{
		Name:           templateName,
		UserPromptData: userPromptData,
		MultiLanguageDetectionMetadata: &modelarmorpb.MultiLanguageDetectionMetadata{
			EnableMultiLanguageDetection: true,
		},
	}

	resp, err := s.client.SanitizeUserPrompt(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to sanitize user prompt for template %s: %w", templateName, err)
	}

	return resp.SanitizationResult, nil
}

// SanitizeModelResponse sanitizes model response using Model Armor
func (s *Service) SanitizeModelResponse(ctx context.Context, templateName, userPrompt, modelResponse string) (*modelarmorpb.SanitizationResult, error) {
	// Initialize request argument(s)
	modelResponseData := &modelarmorpb.DataItem{
		DataItem: &modelarmorpb.DataItem_Text{
			Text: modelResponse,
		},
	}

	// Prepare request for sanitizing model response with proper template name format
	req := &modelarmorpb.SanitizeModelResponseRequest{
		Name:              templateName,
		ModelResponseData: modelResponseData,
		UserPrompt:        userPrompt,
		MultiLanguageDetectionMetadata: &modelarmorpb.MultiLanguageDetectionMetadata{
			EnableMultiLanguageDetection: true,
		},
	}

	resp, err := s.client.SanitizeModelResponse(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to sanitize model response for template %s: %w", templateName, err)
	}

	return resp.SanitizationResult, nil
}

// Close closes the Model Armor client
func (s *Service) Close() error {
	return s.client.Close()
}
