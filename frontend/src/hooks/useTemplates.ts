import { useState, useEffect } from "react";
import { evaluateClient } from "../api/client";
import type { Template } from "../types/api";

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [templatesError, setTemplatesError] = useState<string | null>(null);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setTemplatesLoading(true);
        setTemplatesError(null);
        const response = await evaluateClient.listTemplates({});
        setTemplates(response.templates);
      } catch (error) {
        console.error("Failed to load templates:", error);
        setTemplatesError(
          "Failed to load security templates. Please try again.",
        );
      } finally {
        setTemplatesLoading(false);
      }
    };

    loadTemplates();
  }, []);

  return { templates, templatesLoading, templatesError };
}
