import { postgresAuthService } from "@/server/auth/postgres-auth.service";
import { isPostgresConfigured } from "@/server/postgres/db";
import { errorResponse, okResponse } from "@/server/http/responses";
import type { InternalLoginPayload } from "@/types/internal-auth";

export async function POST(request: Request) {
  if (!isPostgresConfigured()) {
    return errorResponse("PostgreSQL ainda nao configurado.", 503);
  }

  try {
    const body = (await request.json()) as Partial<InternalLoginPayload>;
    const email = body.email?.trim() ?? "";
    const password = body.password ?? "";

    if (!email || !password) {
      return errorResponse("Email e senha sao obrigatorios.", 400);
    }

    const session = await postgresAuthService.login({
      email,
      password,
    });

    return okResponse(session);
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Nao foi possivel autenticar.",
      401,
    );
  }
}
