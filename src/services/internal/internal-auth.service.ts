import { internalApiClient } from "@/services/internal/api-client";
import type {
  InternalAuthSession,
  InternalLoginPayload,
} from "@/types/internal-auth";

export const internalAuthService = {
  async signIn(payload: InternalLoginPayload) {
    return internalApiClient.post<InternalAuthSession>("/api/auth/login", payload);
  },
  async signOut() {
    return internalApiClient.post<{ loggedOut: boolean }>("/api/auth/logout");
  },
  async getSession() {
    const result = await internalApiClient.get<{
      session: InternalAuthSession | null;
      postgresConfigured: boolean;
    }>("/api/auth/session");

    return result.session;
  },
};
