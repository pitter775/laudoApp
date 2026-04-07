CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  email text NOT NULL UNIQUE,
  senha_hash text NOT NULL,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pecas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pecas_analises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  peca_id uuid NOT NULL REFERENCES pecas(id) ON DELETE CASCADE,
  nome text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS laudos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  dados_cliente jsonb NOT NULL DEFAULT '{}'::jsonb,
  dados_peca jsonb NOT NULL DEFAULT '{}'::jsonb,
  peca_id uuid NOT NULL REFERENCES pecas(id),
  status text NOT NULL CHECK (status IN ('APROVADO', 'REPROVADO')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS laudo_itens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  laudo_id uuid NOT NULL REFERENCES laudos(id) ON DELETE CASCADE,
  analise_id uuid NOT NULL REFERENCES pecas_analises(id),
  status text NOT NULL CHECK (status IN ('APROVADO', 'REPARAR', 'REPROVADO')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS laudo_anexos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  laudo_id uuid NOT NULL REFERENCES laudos(id) ON DELETE CASCADE,
  imagem_base64 text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_pecas_nome ON pecas(nome);
CREATE INDEX IF NOT EXISTS idx_pecas_analises_peca_id ON pecas_analises(peca_id);
CREATE INDEX IF NOT EXISTS idx_laudos_user_id ON laudos(user_id);
CREATE INDEX IF NOT EXISTS idx_laudos_peca_id ON laudos(peca_id);
CREATE INDEX IF NOT EXISTS idx_laudo_itens_laudo_id ON laudo_itens(laudo_id);
CREATE INDEX IF NOT EXISTS idx_laudo_itens_analise_id ON laudo_itens(analise_id);
CREATE INDEX IF NOT EXISTS idx_laudo_anexos_laudo_id ON laudo_anexos(laudo_id);
