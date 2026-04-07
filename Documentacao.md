# Documentacao

## Visao geral

O projeto `laudos-app` e uma aplicacao web em `Next.js 16` para emissao, consulta e impressao de laudos tecnicos. O frontend usa `React 19`, `TypeScript` e `Tailwind CSS v4`. A persistencia fica no `Supabase`, usado como banco de dados acessado pelo client JS.

O fluxo principal do produto hoje e:

1. usuario faz login
2. acessa a area interna
3. emite um laudo por wizard
4. salva laudo, itens e anexos no banco
5. abre a visualizacao de PDF para impressao/download

## Stack e dependencias

```json
{
  "frontend": ["Next.js 16 App Router", "React 19", "TypeScript"],
  "estilo": ["Tailwind CSS v4", "Lucide Icons", "Radix Select"],
  "backend_as_a_service": ["Supabase"],
  "utilitarios": ["qrcode"]
}
```

Dependencias relevantes observadas:

- `@supabase/supabase-js`: acesso ao banco
- `pg`: conexao com PostgreSQL proprio na nova camada backend
- `qrcode`: gera QR Code no PDF
- `lucide-react`: icones da interface
- `@radix-ui/react-select`: componente select customizado

## Estrutura do projeto

```json
{
  "src/app": "rotas e layouts via App Router",
  "src/components": "shells de pagina, layout e componentes de UI",
  "src/services": "acesso a dados e regras de integracao",
  "src/types": "contratos TypeScript do dominio",
  "src/lib": "clientes, rotas, navegacao e constantes",
  "database": "schema de referencia e seed SQL"
}
```

Rotas principais:

- `/login`: autenticacao
- `/dashboard`: painel interno ainda em modo placeholder
- `/laudos`: listagem dos laudos do usuario
- `/laudos/novo`: wizard de emissao
- `/laudos/[id]/pdf`: visualizacao/impressao do laudo
- `/api/health`: status da nova API interna e da conexao PostgreSQL
- `/api/auth/login`: login da auth nova baseada em PostgreSQL
- `/api/auth/session`: leitura de sessao da auth nova
- `/api/auth/logout`: encerramento da sessao da auth nova

Organizacao de layout:

- `src/app/layout.tsx`: metadata global, fontes e helper de desenvolvimento
- `src/app/(public)`: paginas publicas com `AuthShell`
- `src/app/(app)`: area autenticada com `AppShell`
- `src/app/(pdf)`: rota isolada para impressao

## Dominio e modelo de dados

Tipos centrais em `src/types/laudo.ts`:

- `DadosCliente`: razao social, CNPJ, email, telefone
- `DadosPeca`: peca selecionada, modelo, identificacao e observacao
- `LaudoItemDraft`: checklist tecnico por analise
- `LaudoDetalhe` e `LaudoListItem`: leitura de laudos persistidos
- `EmitirLaudoPayload`: contrato enviado para persistencia

Schema de banco mapeado em `database/referenciabd.sql`:

```json
{
  "usuarios": "usuarios internos com senha hash",
  "pecas": "catalogo de tipos de peca",
  "pecas_analises": "checklist por tipo de peca",
  "laudos": "cabecalho do laudo",
  "laudo_itens": "resultado por analise",
  "laudo_anexos": "imagens em base64"
}
```

Aspectos importantes do modelo:

- `laudos.dados_cliente` e `laudos.dados_peca` sao `jsonb`
- status final do laudo e binario: `APROVADO` ou `REPROVADO`
- status de item aceita `APROVADO`, `REPARAR` e `REPROVADO`
- anexos sao armazenados como `imagem_base64` no banco

## Autenticacao

A autenticacao e propria e nao usa `Supabase Auth`.

Resumo tecnico:

- `auth.service.ts` consulta a tabela `usuarios`
- a senha digitada e convertida para `SHA-256` no navegador
- a sessao do usuario e salva em `localStorage`
- o `AppShell` revalida a sessao no carregamento e redireciona para `/login` se necessario
- mudancas de autenticacao sao propagadas por evento customizado e pelo evento `storage`

Chaves usadas no navegador:

```json
{
  "sessao": "laudoparts.session",
  "draft_wizard": "laudoparts:laudo-wizard-draft",
  "wizard_completed": "laudoparts:laudo-wizard-completed"
}
```

## Migracao gradual de backend

O projeto agora tem duas trilhas convivendo em paralelo:

```json
{
  "legado": "frontend consumindo Supabase diretamente pelos services atuais",
  "novo": "backend interno em Next.js via app/api com PostgreSQL proprio"
}
```

O que foi preparado nesta fase:

- infraestrutura de conexao PostgreSQL em `src/server/postgres/db.ts`
- auth nova em paralelo usando `usuarios` no PostgreSQL
- endpoints iniciais em `src/app/api/auth/*`
- endpoint tecnico `src/app/api/health/route.ts`
- nova camada client para API interna em `src/services/internal/*`

Importante:

- o fluxo atual com Supabase continua ativo
- nenhuma chamada antiga de `auth.service.ts` ou `laudos.service.ts` foi trocada
- a migracao da RPC `emitir_laudo` ainda nao foi executada

## Fluxo de emissao do laudo

O core do produto esta em `src/components/laudo/laudo-wizard-shell.tsx`.

Etapas do wizard:

1. cliente
2. peca
3. avaliacao
4. fotos
5. confirmacao

Regras principais:

- ao selecionar a peca, o app carrega as analises da tabela `pecas_analises`
- o wizard salva rascunho em `sessionStorage`
- o usuario so avanca com dados obrigatorios validos
- a avaliacao exige status em todos os itens
- o status final do laudo vira `REPROVADO` se qualquer item for `REPROVADO`
- se nao houver item `REPROVADO`, o laudo fecha como `APROVADO`
- fotos sao limitadas a 10 arquivos e convertidas para base64 no client

Persistencia:

- o envio final chama `laudosService.create`
- a criacao usa a RPC `emitir_laudo` no Supabase
- a RPC recebe usuario, dados do cliente, dados da peca, itens e anexos
- ao concluir, o app redireciona para `/laudos/{id}/pdf`

## Servicos

```json
{
  "auth.service.ts": "login, logout, sessao local e validacao",
  "pecas.service.ts": "lista pecas e analises por peca",
  "laudos.service.ts": "lista, detalha, cria e remove laudos do usuario",
  "storage.service.ts": "converte arquivos para base64",
  "pdf.service.ts": "numero do laudo, controle, validade e URL do QR"
}
```

Observacoes:

- `laudosService.listByUser()` filtra por `user_id` da sessao local
- `laudosService.getById()` recompõe nomes de analises e peca via consultas adicionais
- `laudosService.deleteAllByUser()` remove anexos, itens e depois laudos

## PDF e impressao

A area de PDF e client-side:

- carrega o laudo pelo id
- monta QR Code com `qrcode`
- dispara `window.print()` automaticamente apos carregar
- renderiza um template visual em `laudo-pdf-template.tsx`

Conteudo do documento:

- identificacao do laudo
- dados do cliente
- informacoes da peca
- checklist tecnico
- imagens anexadas
- QR Code e metadados de controle

## Estado atual do produto

Partes operacionais:

- login funcional com tabela propria
- area interna protegida
- emissao de laudo em wizard
- listagem de laudos do usuario
- exclusao em massa por usuario
- visualizacao/impressao em formato PDF

Partes ainda incompletas ou em evolucao:

- dashboard ainda e placeholder
- item de navegacao `Capacitacao` esta desabilitado
- existe dependencia forte do client para auth, upload e impressao
- o banco guarda imagens em base64, o que tende a crescer rapido

## Pontos tecnicos de atencao

- a maior parte da logica esta no frontend; nao ha camada backend propria
- sessao baseada em `localStorage` e simples, mas limitada para cenarios mais sensiveis
- anexos em base64 no banco aumentam custo de armazenamento e payload
- a criacao do laudo depende da RPC `emitir_laudo`, que e parte critica da integracao
- o projeto tem uma separacao razoavel entre `components`, `services`, `types` e `lib`

## Arquivos centrais para manutencao

- `src/components/laudo/laudo-wizard-shell.tsx`
- `src/components/laudo/laudos-list.tsx`
- `src/components/laudo/laudo-pdf-page-shell.tsx`
- `src/components/laudo/laudo-pdf-template.tsx`
- `src/services/auth.service.ts`
- `src/services/laudos.service.ts`
- `src/services/pecas.service.ts`
- `src/services/storage.service.ts`
- `src/types/laudo.ts`
- `database/referenciabd.sql`

## Como rodar

```bash
npm install
npm run dev
npm run lint
npm run build
```

Variaveis esperadas:

```json
{
  "NEXT_PUBLIC_SUPABASE_URL": "url do projeto Supabase",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY": "chave anon",
  "NEXT_PUBLIC_APP_URL": "url base da aplicacao",
  "DATABASE_URL": "string de conexao do PostgreSQL proprio",
  "POSTGRES_SSL": "use require se o provedor exigir SSL",
  "INTERNAL_AUTH_SECRET": "segredo da sessao da auth interna"
}
```
