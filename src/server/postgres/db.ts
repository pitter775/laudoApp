import "server-only";

import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from "pg";

declare global {
  var __laudosPostgresPool__: Pool | undefined;
}

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL?.trim();

  if (!databaseUrl) {
    throw new Error("DATABASE_URL nao definida.");
  }

  return databaseUrl;
}

export function isPostgresConfigured() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

function createPool() {
  return new Pool({
    connectionString: getDatabaseUrl(),
    ssl:
      process.env.POSTGRES_SSL === "require"
        ? {
            rejectUnauthorized: false,
          }
        : undefined,
  });
}

export function getPostgresPool() {
  if (!global.__laudosPostgresPool__) {
    global.__laudosPostgresPool__ = createPool();
  }

  return global.__laudosPostgresPool__;
}

export async function queryPostgres<T extends QueryResultRow>(
  text: string,
  values: unknown[] = [],
) {
  const pool = getPostgresPool();
  return pool.query<T>(text, values);
}

export async function withPostgresTransaction<T>(
  callback: (
    client: PoolClient,
  ) => Promise<T>,
) {
  const pool = getPostgresPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function checkPostgresConnection() {
  const result = await queryPostgres<QueryResultRow>("select now() as now");
  return result.rows[0] as QueryResult<QueryResultRow>["rows"][number];
}
