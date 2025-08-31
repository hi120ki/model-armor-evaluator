// API Types for Model Armor Evaluator - Re-export protobuf generated types

// Import all types from the generated protobuf files
export type {
  Template,
  ListTemplatesRequest,
  ListTemplatesResponse,
  CompletionsRequest,
  CompletionsResponse,
  Result,
  FilterResult,
  RaiFilterTypeResult,
} from "../gen/evaluate/v1/main_pb";

// Import enums from the generated protobuf files
export {
  FilterMatchState,
  RaiFilterType,
  DetectionConfidenceLevel,
} from "../gen/evaluate/v1/main_pb";

// For backward compatibility, alias Result as EvaluationResult
export type { Result as EvaluationResult } from "../gen/evaluate/v1/main_pb";

export const AVAILABLE_MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.5-pro",
] as const;

export type AvailableModel = (typeof AVAILABLE_MODELS)[number];
