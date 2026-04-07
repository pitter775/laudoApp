-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.laudo_anexos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  laudo_id uuid NOT NULL,
  imagem_base64 text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT laudo_anexos_pkey PRIMARY KEY (id),
  CONSTRAINT laudo_anexos_laudo_id_fkey FOREIGN KEY (laudo_id) REFERENCES public.laudos(id)
);
CREATE TABLE public.laudo_itens (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  laudo_id uuid NOT NULL,
  analise_id uuid NOT NULL,
  status text NOT NULL CHECK (status = ANY (ARRAY['APROVADO'::text, 'REPARAR'::text, 'REPROVADO'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT laudo_itens_pkey PRIMARY KEY (id),
  CONSTRAINT laudo_itens_laudo_id_fkey FOREIGN KEY (laudo_id) REFERENCES public.laudos(id),
  CONSTRAINT laudo_itens_analise_id_fkey FOREIGN KEY (analise_id) REFERENCES public.pecas_analises(id)
);
CREATE TABLE public.laudos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  dados_cliente jsonb NOT NULL DEFAULT '{}'::jsonb,
  dados_peca jsonb NOT NULL DEFAULT '{}'::jsonb,
  peca_id uuid NOT NULL,
  status text NOT NULL CHECK (status = ANY (ARRAY['APROVADO'::text, 'REPROVADO'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT laudos_pkey PRIMARY KEY (id),
  CONSTRAINT laudos_peca_id_fkey FOREIGN KEY (peca_id) REFERENCES public.pecas(id),
  CONSTRAINT laudos_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.usuarios(id)
);
CREATE TABLE public.pecas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nome text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT pecas_pkey PRIMARY KEY (id)
);
CREATE TABLE public.pecas_analises (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  peca_id uuid NOT NULL,
  nome text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT pecas_analises_pkey PRIMARY KEY (id),
  CONSTRAINT pecas_analises_peca_id_fkey FOREIGN KEY (peca_id) REFERENCES public.pecas(id)
);
CREATE TABLE public.usuarios (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  email text NOT NULL UNIQUE,
  senha_hash text NOT NULL,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT usuarios_pkey PRIMARY KEY (id)
);