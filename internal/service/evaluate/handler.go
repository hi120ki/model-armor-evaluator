package evaluate

import (
	"context"
	"fmt"
	"log/slog"

	"connectrpc.com/connect"
	"google.golang.org/genai"

	pb "github.com/hi120ki/model-armor-evaluator/gen/evaluate/v1"
	"github.com/hi120ki/model-armor-evaluator/internal/config"
	"github.com/hi120ki/model-armor-evaluator/internal/converter"
	"github.com/hi120ki/model-armor-evaluator/internal/service/modelarmor"
)

type Handler struct {
	templates         *config.TemplatesConfig
	modelArmorService *modelarmor.Service
	genAIClient       *genai.Client
}

func NewHandler(project, location string, templates *config.TemplatesConfig, modelArmorService *modelarmor.Service) (*Handler, error) {
	// Create GenAI client once during initialization
	client, err := genai.NewClient(context.Background(), &genai.ClientConfig{
		Project:  project,
		Location: location,
		Backend:  genai.BackendVertexAI,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create GenAI client: %w", err)
	}

	return &Handler{
		templates:         templates,
		modelArmorService: modelArmorService,
		genAIClient:       client,
	}, nil
}

func (h *Handler) ListTemplates(
	ctx context.Context,
	req *connect.Request[pb.ListTemplatesRequest],
) (*connect.Response[pb.ListTemplatesResponse], error) {
	var templates []*pb.Template

	for _, template := range h.templates.Templates {
		templates = append(templates, &pb.Template{
			Name:        template.Name,
			Description: template.Description,
		})
	}

	response := &pb.ListTemplatesResponse{
		Templates: templates,
	}

	return connect.NewResponse(response), nil
}

func (h *Handler) Completions(
	ctx context.Context,
	req *connect.Request[pb.CompletionsRequest],
) (*connect.Response[pb.CompletionsResponse], error) {
	response := &pb.CompletionsResponse{}

	for _, template := range h.templates.Templates {
		// Sanitize user prompt before sending to AI model
		sanitizationResult, err := h.modelArmorService.SanitizeUserPrompt(ctx, template.Name, req.Msg.Input)
		if err != nil {
			slog.Error("failed to sanitize user prompt", "error", err)
			return nil, connect.NewError(connect.CodeInternal, fmt.Errorf("failed to sanitize user prompt: %w", err))
		}
		slog.Info("User prompt sanitization result",
			"template_name", template.Name,
			"filter_match_state", sanitizationResult.FilterMatchState,
			"filter_results", sanitizationResult.FilterResults,
		)
		result := &pb.Result{
			Template: &pb.Template{
				Name:        template.Name,
				Description: template.Description,
			},
			FilterMatchState:     converter.ConvertFilterResult(sanitizationResult.FilterMatchState),
			FilterResults:        converter.ConvertFilterResults(sanitizationResult.FilterResults),
			RaiFilterTypeResults: converter.ConvertRaiFilterTypeResults(sanitizationResult),
		}
		response.UserPromptResult = append(response.UserPromptResult, result)
	}

	// Use pre-initialized GenAI client
	resp, err := h.genAIClient.Models.GenerateContent(ctx,
		req.Msg.Model,
		genai.Text(req.Msg.Input),
		nil,
	)
	if err != nil {
		slog.Error("failed to generate content", "error", err)
		return nil, connect.NewError(connect.CodeInternal, fmt.Errorf("failed to generate content: %w", err))
	}

	for _, template := range h.templates.Templates {
		// Sanitize model response after receiving from AI model
		modelSanitizationResult, err := h.modelArmorService.SanitizeModelResponse(ctx, template.Name, req.Msg.Input, resp.Text())
		if err != nil {
			slog.Error("failed to sanitize model response", "error", err)
			return nil, connect.NewError(connect.CodeInternal, fmt.Errorf("failed to sanitize model response: %w", err))
		}
		slog.Info("Model response sanitization result",
			"template_name", template.Name,
			"filter_match_state", modelSanitizationResult.FilterMatchState,
			"filter_results", modelSanitizationResult.FilterResults,
		)
		result := &pb.Result{
			Template: &pb.Template{
				Name:        template.Name,
				Description: template.Description,
			},
			FilterMatchState:     converter.ConvertFilterResult(modelSanitizationResult.FilterMatchState),
			FilterResults:        converter.ConvertFilterResults(modelSanitizationResult.FilterResults),
			RaiFilterTypeResults: converter.ConvertRaiFilterTypeResults(modelSanitizationResult),
		}
		response.ModelResponseResult = append(response.ModelResponseResult, result)
	}

	response.Output = resp.Text()

	return connect.NewResponse(response), nil
}
