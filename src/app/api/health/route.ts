import { checkPostgresConnection, isPostgresConfigured } from "@/server/postgres/db";
import { errorResponse, okResponse } from "@/server/http/responses";

export async function GET() {
  if (!isPostgresConfigured()) {
    return okResponse({
      api: "online",
      postgres: "not-configured",
    });
  }

  try {
    const result = await checkPostgresConnection();

    return okResponse({
      api: "online",
      postgres: "connected",
      serverTime: result.now,
    });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Falha ao conectar no PostgreSQL.",
      500,
    );
  }
}
