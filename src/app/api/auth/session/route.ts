import { postgresAuthService } from "@/server/auth/postgres-auth.service";
import { isPostgresConfigured } from "@/server/postgres/db";
import { okResponse } from "@/server/http/responses";

export async function GET() {
  if (!isPostgresConfigured()) {
    return okResponse({
      session: null,
      postgresConfigured: false,
    });
  }

  const session = await postgresAuthService.getSession();

  return okResponse({
    session,
    postgresConfigured: true,
  });
}
