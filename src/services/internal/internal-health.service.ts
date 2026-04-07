import { internalApiClient } from "@/services/internal/api-client";

export type InternalHealthStatus = {
  api: string;
  postgres: string;
  serverTime?: string;
};

export const internalHealthService = {
  async getStatus() {
    return internalApiClient.get<InternalHealthStatus>("/api/health");
  },
};
