CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  email text NOT NULL UNIQUE,
  senha_hash text NOT NULL,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pecas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pecas_analises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  peca_id uuid NOT NULL REFERENCES public.pecas(id) ON DELETE CASCADE,
  nome text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.laudos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  dados_cliente jsonb NOT NULL DEFAULT '{}'::jsonb,
  dados_peca jsonb NOT NULL DEFAULT '{}'::jsonb,
  peca_id uuid NOT NULL REFERENCES public.pecas(id),
  status text NOT NULL CHECK (status IN ('APROVADO', 'REPROVADO')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.laudo_itens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  laudo_id uuid NOT NULL REFERENCES public.laudos(id) ON DELETE CASCADE,
  analise_id uuid NOT NULL REFERENCES public.pecas_analises(id),
  status text NOT NULL CHECK (status IN ('APROVADO', 'REPARAR', 'REPROVADO')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.laudo_anexos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  laudo_id uuid NOT NULL REFERENCES public.laudos(id) ON DELETE CASCADE,
  imagem_base64 text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON public.usuarios(email);
CREATE INDEX IF NOT EXISTS idx_pecas_nome ON public.pecas(nome);
CREATE INDEX IF NOT EXISTS idx_pecas_analises_peca_id ON public.pecas_analises(peca_id);
CREATE INDEX IF NOT EXISTS idx_laudos_user_id ON public.laudos(user_id);
CREATE INDEX IF NOT EXISTS idx_laudos_peca_id ON public.laudos(peca_id);
CREATE INDEX IF NOT EXISTS idx_laudo_itens_laudo_id ON public.laudo_itens(laudo_id);
CREATE INDEX IF NOT EXISTS idx_laudo_itens_analise_id ON public.laudo_itens(analise_id);
CREATE INDEX IF NOT EXISTS idx_laudo_anexos_laudo_id ON public.laudo_anexos(laudo_id);

ALTER TABLE public.usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pecas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pecas_analises DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.laudos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.laudo_itens DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.laudo_anexos DISABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated;

WITH pecas_seed(nome) AS (
  VALUES
    ('Motor'),
    ('Cambio'),
    ('Diferencial'),
    ('Bomba hidraulica'),
    ('Compressor'),
    ('Alternador'),
    ('Motor de partida'),
    ('Turbina')
)
INSERT INTO public.pecas (nome)
SELECT nome
FROM pecas_seed
ON CONFLICT (nome) DO NOTHING;

WITH analises_seed(peca_nome, analise_nome) AS (
  VALUES
    ('Motor', 'Inspecao visual externa'),
    ('Motor', 'Verificacao de trincas ou quebras'),
    ('Motor', 'Verificacao de vazamentos'),
    ('Motor', 'Estado de fixacoes e roscas'),
    ('Motor', 'Folgas anormais'),
    ('Motor', 'Condicao geral para reaproveitamento'),

    ('Cambio', 'Inspecao visual da carcaca'),
    ('Cambio', 'Verificacao de vazamentos'),
    ('Cambio', 'Estado dos encaixes e fixacoes'),
    ('Cambio', 'Folgas no eixo'),
    ('Cambio', 'Ruido ou travamento em giro manual'),
    ('Cambio', 'Condicao geral para reaproveitamento'),

    ('Diferencial', 'Inspecao visual da carcaca'),
    ('Diferencial', 'Verificacao de vazamentos'),
    ('Diferencial', 'Estado dos suportes'),
    ('Diferencial', 'Folga de coroa e pinhao'),
    ('Diferencial', 'Ruido ou travamento em giro manual'),
    ('Diferencial', 'Condicao geral para reaproveitamento'),

    ('Bomba hidraulica', 'Inspecao visual externa'),
    ('Bomba hidraulica', 'Verificacao de vazamentos'),
    ('Bomba hidraulica', 'Estado das conexoes'),
    ('Bomba hidraulica', 'Folga no eixo'),
    ('Bomba hidraulica', 'Ruido ou travamento em giro manual'),
    ('Bomba hidraulica', 'Condicao geral para reaproveitamento'),

    ('Compressor', 'Inspecao visual externa'),
    ('Compressor', 'Verificacao de vazamentos'),
    ('Compressor', 'Estado da polia ou acoplamento'),
    ('Compressor', 'Estado das conexoes'),
    ('Compressor', 'Ruido ou travamento em giro manual'),
    ('Compressor', 'Condicao geral para reaproveitamento'),

    ('Alternador', 'Inspecao visual externa'),
    ('Alternador', 'Estado da carcaca e suportes'),
    ('Alternador', 'Estado da polia'),
    ('Alternador', 'Estado dos conectores'),
    ('Alternador', 'Ruido ou travamento em giro manual'),
    ('Alternador', 'Condicao geral para reaproveitamento'),

    ('Motor de partida', 'Inspecao visual externa'),
    ('Motor de partida', 'Estado da carcaca e suportes'),
    ('Motor de partida', 'Estado do pinhao'),
    ('Motor de partida', 'Estado dos conectores'),
    ('Motor de partida', 'Ruido ou travamento em giro manual'),
    ('Motor de partida', 'Condicao geral para reaproveitamento'),

    ('Turbina', 'Inspecao visual externa'),
    ('Turbina', 'Verificacao de trincas ou quebras'),
    ('Turbina', 'Verificacao de vazamentos'),
    ('Turbina', 'Folga no eixo'),
    ('Turbina', 'Estado das conexoes'),
    ('Turbina', 'Condicao geral para reaproveitamento')
)
INSERT INTO public.pecas_analises (peca_id, nome)
SELECT p.id, a.analise_nome
FROM analises_seed a
JOIN public.pecas p ON p.nome = a.peca_nome
WHERE NOT EXISTS (
  SELECT 1
  FROM public.pecas_analises pa
  WHERE pa.peca_id = p.id
    AND pa.nome = a.analise_nome
);

INSERT INTO public.usuarios (
  nome,
  email,
  senha_hash,
  ativo
)
VALUES (
  'Administrador',
  'admin@laudoparts.com',
  'e86f78a8a3caf0b60d8e74e5942aa6d86dc150cd3c03338aef25b7d2d7e3acc7',
  true
)
ON CONFLICT (email)
DO UPDATE SET
  nome = excluded.nome,
  senha_hash = excluded.senha_hash,
  ativo = excluded.ativo;

CREATE OR REPLACE FUNCTION public.emitir_laudo(
  p_user_id uuid,
  p_dados_cliente jsonb,
  p_dados_peca jsonb,
  p_peca_id uuid,
  p_status text,
  p_itens jsonb,
  p_anexos jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_laudo_id uuid;
BEGIN
  INSERT INTO public.laudos (
    user_id,
    dados_cliente,
    dados_peca,
    peca_id,
    status
  )
  VALUES (
    p_user_id,
    COALESCE(p_dados_cliente, '{}'::jsonb),
    COALESCE(p_dados_peca, '{}'::jsonb),
    p_peca_id,
    p_status
  )
  RETURNING id INTO v_laudo_id;

  INSERT INTO public.laudo_itens (
    laudo_id,
    analise_id,
    status
  )
  SELECT
    v_laudo_id,
    (item->>'analise_id')::uuid,
    item->>'status'
  FROM jsonb_array_elements(COALESCE(p_itens, '[]'::jsonb)) AS item;

  INSERT INTO public.laudo_anexos (
    laudo_id,
    imagem_base64
  )
  SELECT
    v_laudo_id,
    anexo->>'imagem_base64'
  FROM jsonb_array_elements(COALESCE(p_anexos, '[]'::jsonb)) AS anexo
  WHERE COALESCE(anexo->>'imagem_base64', '') <> '';

  RETURN v_laudo_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.emitir_laudo(
  uuid,
  jsonb,
  jsonb,
  uuid,
  text,
  jsonb,
  jsonb
) TO anon, authenticated;
