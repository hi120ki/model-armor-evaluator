import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Shield,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import type { EvaluationResult } from "../types/api";
import { FilterMatchState, DetectionConfidenceLevel } from "../types/api";

interface FilterResultCardProps {
  result: EvaluationResult;
}

export function FilterResultCard({ result }: FilterResultCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getTemplateName = (fullName?: string) => {
    if (!fullName) return "Unknown";
    const parts = fullName.split("/");
    return parts[parts.length - 1];
  };

  const getStateIcon = (state: FilterMatchState) => {
    switch (state) {
      case FilterMatchState.MATCH_FOUND:
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case FilterMatchState.NO_MATCH_FOUND:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Shield className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStateColor = (state: FilterMatchState) => {
    switch (state) {
      case FilterMatchState.MATCH_FOUND:
        return "bg-red-50 border-red-200 text-red-800";
      case FilterMatchState.NO_MATCH_FOUND:
        return "bg-green-50 border-green-200 text-green-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getStateText = (state: FilterMatchState) => {
    switch (state) {
      case FilterMatchState.MATCH_FOUND:
        return "Security Issue Detected";
      case FilterMatchState.NO_MATCH_FOUND:
        return "Safe";
      default:
        return "Unknown";
    }
  };

  const getConfidenceLevelText = (level: DetectionConfidenceLevel) => {
    switch (level) {
      case DetectionConfidenceLevel.LOW_AND_ABOVE:
        return "Low Confidence";
      case DetectionConfidenceLevel.MEDIUM_AND_ABOVE:
        return "Medium Confidence";
      case DetectionConfidenceLevel.HIGH:
        return "High Confidence";
      default:
        return "Unknown Confidence";
    }
  };

  const filterLabels = {
    csam: "CSAM Filter",
    malicious_uris: "Malicious URI",
    pi_and_jailbreak: "Prompt Injection & Jailbreak",
    rai: "RAI Filter",
    sdp: "Sensitive Data Protection",
    virus_scan: "Virus Scan",
  };

  const raiLabels = {
    dangerous: "Dangerous Content",
    harassment: "Harassment",
    hate_speech: "Hate Speech",
    sexually_explicit: "Sexually Explicit",
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
            <div>
              <h3 className="font-medium text-gray-900">
                {getTemplateName(result.template?.name)}
              </h3>
              <p className="text-sm text-gray-500">
                {result.template?.description ?? "No description"}
              </p>
            </div>
          </div>

          <div
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStateColor(
              result.filterMatchState,
            )}`}
          >
            {getStateIcon(result.filterMatchState)}
            {getStateText(result.filterMatchState)}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="mt-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                General Filters
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(result.filterResults).map(([key, value]) => {
                  if (!value || !value.filterResult) return null;
                  const state = value.filterResult.value as FilterMatchState;
                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between p-2 rounded bg-gray-50"
                    >
                      <span className="text-sm text-gray-700">
                        {filterLabels[key as keyof typeof filterLabels] || key}
                      </span>
                      <div className="flex items-center gap-1">
                        {getStateIcon(state)}
                        <span
                          className={`text-xs ${
                            state === FilterMatchState.MATCH_FOUND
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {state === FilterMatchState.MATCH_FOUND
                            ? "Detected"
                            : "Safe"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                RAI Content Filters
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(result.raiFilterTypeResults).map(
                  ([key, value]) => {
                    if (!value) return null;
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between p-2 rounded bg-gray-50"
                      >
                        <span className="text-sm text-gray-700">
                          {raiLabels[key as keyof typeof raiLabels] || key}
                        </span>
                        <div className="flex items-center gap-1">
                          {getStateIcon(value.matchState)}
                          <span
                            className={`text-xs ${
                              value.matchState === FilterMatchState.MATCH_FOUND
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {value.matchState === FilterMatchState.MATCH_FOUND
                              ? "Detected"
                              : "Safe"}
                          </span>
                          {value.confidenceLevel !== undefined &&
                            value.confidenceLevel !==
                              DetectionConfidenceLevel.UNSPECIFIED &&
                            value.matchState ===
                              FilterMatchState.MATCH_FOUND && (
                              <span className="text-xs text-gray-500 ml-1">
                                ({getConfidenceLevelText(value.confidenceLevel)}
                                )
                              </span>
                            )}
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Template: {result.template?.name ?? "Unknown"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
