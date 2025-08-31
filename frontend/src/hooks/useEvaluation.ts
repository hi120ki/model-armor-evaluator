import { useState } from "react";
import { evaluateClient } from "../api/client";
import type { EvaluationResult, AvailableModel } from "../types/api";

export function useEvaluation() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [inputResults, setInputResults] = useState<EvaluationResult[]>([]);
  const [outputResults, setOutputResults] = useState<EvaluationResult[]>([]);

  const evaluatePrompt = async (input: string, model: AvailableModel) => {
    try {
      setIsProcessing(true);
      setApiError(null);
      setAiResponse(null);
      setInputResults([]);
      setOutputResults([]);

      const response = await evaluateClient.completions({
        input,
        model,
      });

      setAiResponse(response.output);
      setInputResults(response.userPromptResult);
      setOutputResults(response.modelResponseResult);
    } catch (error) {
      console.error("Evaluation failed:", error);
      setApiError(
        "Failed to evaluate prompt. Please check your connection and try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const clearResults = () => {
    setAiResponse(null);
    setInputResults([]);
    setOutputResults([]);
    setApiError(null);
  };

  return {
    isProcessing,
    apiError,
    aiResponse,
    inputResults,
    outputResults,
    evaluatePrompt,
    clearResults,
  };
}
