import { useState } from "react";
import { Copy, Check, MessageSquare } from "lucide-react";

interface AIResponseProps {
  response: string | null;
  isLoading: boolean;
}

export function AIResponse({ response, isLoading }: AIResponseProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (response) {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          AI Model Response
        </h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </section>
    );
  }

  if (!response) return null;

  const wordCount = response.split(/\s+/).length;
  const charCount = response.length;

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          AI Model Response
        </h2>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
          {response}
        </p>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>{wordCount} words</span>
        <span>•</span>
        <span>{charCount} characters</span>
      </div>
    </section>
  );
}
