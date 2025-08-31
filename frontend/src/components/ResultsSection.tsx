import { Shield, User, Bot } from "lucide-react";
import { FilterResultCard } from "./FilterResultCard";
import type { EvaluationResult } from "../types/api";

interface ResultsSectionProps {
  inputResults: EvaluationResult[];
  outputResults: EvaluationResult[];
  isLoading: boolean;
}

export function ResultsSection({
  inputResults,
  outputResults,
  isLoading,
}: ResultsSectionProps) {
  if (isLoading) {
    return (
      <section className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Model Armor Analysis
          </h2>
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-gray-200 rounded-lg"></div>
            <div className="h-20 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </section>
    );
  }

  if (inputResults.length === 0 && outputResults.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Model Armor Analysis Results
        </h2>

        {inputResults.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-4 h-4" />
              Prompt Analysis Results
            </h3>
            <div className="space-y-3">
              {inputResults.map((result, index) => (
                <FilterResultCard key={`input-${index}`} result={result} />
              ))}
            </div>
          </div>
        )}

        {outputResults.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
              <Bot className="w-4 h-4" />
              Response Analysis Results
            </h3>
            <div className="space-y-3">
              {outputResults.map((result, index) => (
                <FilterResultCard key={`output-${index}`} result={result} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
