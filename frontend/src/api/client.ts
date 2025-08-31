import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { EvaluateService } from "../gen/evaluate/v1/main_pb";

// API base URL
const baseUrl = "/";

// Create Connect transport
const transport = createConnectTransport({
  baseUrl,
  // Add headers and interceptors as needed
  interceptors: [],
});

// Create EvaluateService client
export const evaluateClient = createClient(EvaluateService, transport);
