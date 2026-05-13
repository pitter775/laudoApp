CREATE TABLE IF NOT EXISTS mercado_livre_contratos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  store_name text NOT NULL,
  seller_id text NOT NULL,
  app_id text NOT NULL,
  connected_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_mercado_livre_contratos_user_id
  ON mercado_livre_contratos(user_id);
