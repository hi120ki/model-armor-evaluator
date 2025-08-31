import { Header } from "./components/Header";
import { InputForm } from "./components/InputForm";
import { AIResponse } from "./components/AIResponse";
import { ResultsSection } from "./components/ResultsSection";
import { useTemplates } from "./hooks/useTemplates";
import { useEvaluation } from "./hooks/useEvaluation";

function App() {
  const { templates, templatesLoading, templatesError } = useTemplates();
  const {
    isProcessing,
    apiError,
    aiResponse,
    inputResults,
    outputResults,
    evaluatePrompt,
  } = useEvaluation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header templates={templates} templatesLoading={templatesLoading} />

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {templatesError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">{templatesError}</p>
          </div>
        )}

        <InputForm
          onSubmit={evaluatePrompt}
          isProcessing={isProcessing}
          apiError={apiError}
        />

        <AIResponse response={aiResponse} isLoading={isProcessing} />

        <ResultsSection
          inputResults={inputResults}
          outputResults={outputResults}
          isLoading={isProcessing}
        />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>Model Armor Evaluator - AI Safety & Security Testing Platform</p>
            <p className="mt-2">
              Powered by advanced security filters and real-time threat
              detection
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
