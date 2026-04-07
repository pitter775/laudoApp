# PostgreSQL proprio

Esta pasta prepara a migracao gradual do projeto para um banco PostgreSQL fora do Supabase.
O schema inicial foi alinhado ao desenho atual de `database/referenciabd.sql` para manter compatibilidade de dominio durante a transicao.

## Objetivo desta fase

- criar schema paralelo
- habilitar auth propria via `app/api`
- manter Supabase ativo no fluxo atual

## Arquivos

- `001_initial_schema.sql`: tabelas iniciais do novo backend
- `RPC_MIGRATION_NOTES.md`: observacoes sobre a futura migracao da RPC `emitir_laudo`

## Como aplicar

```bash
psql "$DATABASE_URL" -f database/postgres/001_initial_schema.sql
```
