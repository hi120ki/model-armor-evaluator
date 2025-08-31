import { Shield, Activity } from "lucide-react";
import type { Template } from "../types/api";

interface HeaderProps {
  templates: Template[];
  templatesLoading: boolean;
}

export function Header({ templates, templatesLoading }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Model Armor Evaluator
          </h1>
        </div>

        <p className="text-lg text-gray-600 mb-4 leading-relaxed">
          Test AI model prompts and responses against comprehensive security
          filters. Detect prompt injection, harmful content, and security
          vulnerabilities in real-time.
        </p>

        <div className="flex items-center gap-2 text-sm">
          <Activity className="w-4 h-4 text-green-500" />
          <span className="text-gray-700">
            {templatesLoading
              ? "Loading templates..."
              : `${templates.length} active security templates`}
          </span>
        </div>
      </div>
    </header>
  );
}
