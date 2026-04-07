import "server-only";

import { queryPostgres } from "@/server/postgres/db";
import type { InternalAuthUser } from "@/types/internal-auth";

type PostgresUserRow = InternalAuthUser & {
  senha_hash: string;
  ativo: boolean;
};

export const postgresAuthRepository = {
  async findActiveUserByEmail(email: string) {
    const result = await queryPostgres<PostgresUserRow>(
      `
        select id, nome, email, senha_hash, ativo
        from usuarios
        where email = $1
          and ativo = true
        limit 1
      `,
      [email.trim().toLowerCase()],
    );

    return result.rows[0] ?? null;
  },
  async findActiveUserById(id: string) {
    const result = await queryPostgres<InternalAuthUser & { ativo: boolean }>(
      `
        select id, nome, email, ativo
        from usuarios
        where id = $1
          and ativo = true
        limit 1
      `,
      [id],
    );

    return result.rows[0] ?? null;
  },
};
