import { postgresAuthService } from "@/server/auth/postgres-auth.service";
import { okResponse } from "@/server/http/responses";

export async function POST() {
  await postgresAuthService.logout();

  return okResponse({
    loggedOut: true,
  });
}
