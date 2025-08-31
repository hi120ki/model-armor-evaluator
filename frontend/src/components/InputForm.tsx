import React, { useState } from "react";
import { Send, Loader } from "lucide-react";
import { AVAILABLE_MODELS, type AvailableModel } from "../types/api";

interface InputFormProps {
  onSubmit: (input: string, model: AvailableModel) => void;
  isProcessing: boolean;
  apiError: string | null;
}

export function InputForm({
  onSubmit,
  isProcessing,
  apiError,
}: InputFormProps) {
  const [selectedModel, setSelectedModel] = useState<AvailableModel>(
    "gemini-2.5-flash-lite",
  );
  const [userInput, setUserInput] = useState("");
  const [inputError, setInputError] = useState("");

  const maxLength = 1000;
  const remainingChars = maxLength - userInput.length;

  const validateInput = (value: string) => {
    if (value.length === 0) {
      setInputError("Please enter a prompt to evaluate");
      return false;
    }
    if (value.length > maxLength) {
      setInputError(`Input exceeds maximum length of ${maxLength} characters`);
      return false;
    }
    setInputError("");
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setUserInput(value);
    if (value.length > 0) {
      validateInput(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateInput(userInput) && !isProcessing) {
      onSubmit(userInput, selectedModel);
    }
  };

  const isFormValid =
    userInput.length > 0 && remainingChars >= 0 && !inputError;

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Prompt Evaluation
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="model-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select AI Model
          </label>
          <select
            id="model-select"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value as AvailableModel)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            {AVAILABLE_MODELS.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="user-input"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Enter your prompt
          </label>
          <textarea
            id="user-input"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Type your message here..."
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              inputError
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500"
            }`}
            maxLength={maxLength}
          />

          <div className="flex justify-between items-center mt-2">
            <div className="text-sm">
              {inputError && <span className="text-red-600">{inputError}</span>}
            </div>
            <span
              className={`text-sm ${
                remainingChars < 50 ? "text-amber-600" : "text-gray-500"
              }`}
            >
              {remainingChars} characters remaining
            </span>
          </div>
        </div>

        {apiError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">{apiError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!isFormValid || isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Evaluating Prompt...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Evaluate Prompt
            </>
          )}
        </button>
      </form>
    </section>
  );
}
