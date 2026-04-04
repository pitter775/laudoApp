# laudos-app — CONTEXTO DO PROJETO

Documento base do projeto.  
Atualizar sempre que houver mudança relevante.

---

## 1. Info Geral

- Nome: laudos-app
- Caminho: C:\Projetos\laudos-app
- Stack: Next.js + React + TypeScript + Tailwind + Supabase
- Objetivo: emissão de laudos com wizard

---

## 2. Forma de Trabalho

- Sempre ler antes de alterar
- Não quebrar layout existente
- Separar UI de regra de negócio
- Código simples e fácil de migrar
- Evitar acoplamento com Supabase

Regras:

- Auth própria (usuarios)
- NÃO usar Supabase Auth
- Registrar decisões importantes aqui
- Visual padrão: premium (leve, clean)
- Cores: teal (primary) + roxo (secondary)

---

## 3. Estrutura

### Raiz

- src/
- .env.local
- database/

### Frontend

- src/app → rotas
- src/components → UI
- src/services → lógica
- src/types → tipos
- src/lib → util/config

### Arquivos importantes

- lib/supabaseClient.ts
- services/auth.service.ts
- services/laudos.service.ts
- services/pecas.service.ts
- services/storage.service.ts
- components/laudo/laudo-wizard-shell.tsx

---

## 4. Organização de Código

Criar arquivos em:

- UI → components
- lógica → services
- tipos → types
- util → lib
- SQL → database/seeder

Antes de alterar:

- ver quem usa
- entender responsabilidade
- evitar duplicação

---

## 5. Tecnologias

### Next.js
- App Router (src/app)

### React
- hooks + client-side

### TypeScript
- tipagem e contratos

### Tailwind
- visual rápido e consistente
- padrão premium sem libs externas

### Supabase
- usado só como banco
- fácil migrar depois

---

## 6. Arquitetura

- UI → components
- lógica → services
- tipos → types
- config → lib

---

## 7. Banco de Dados

Arquivo base (NÃO ALTERAR):

- database/referenciabd.sql

Alterações:

- criar em database/seeder

Tabelas:

- usuarios
- pecas
- pecas_analises
- laudos
- laudo_itens
- laudo_anexos

---

## 8. Autenticação

- tabela: usuarios
- sessão local
- sem Supabase Auth

Obs: melhorar depois

---

## 9. Wizard

Arquivo:

- laudo-wizard-shell.tsx

Etapas:

1. Cliente
2. Peça
3. Avaliação
4. Fotos
5. Confirmação

Regra final:

- se tiver REPROVADO → laudo = REPROVADO
- senão → APROVADO

---

## 10. Comandos

```bash
npm install
npm run dev
npm run lint
npm run build
```

---

## 11. Estado Atual

Já tem:

- Next configurado
- auth própria
- Supabase integrado
- wizard funcionando
- salvando laudo completo
- visual premium

Falta:

- tela "Meus Laudos"
- PDF do laudo
- melhorar auth
- ajustes de layout

---

## 12. Regra de Atualização

Atualizar este doc quando mudar:

- arquitetura
- banco
- auth
- estrutura
- regras
- fluxo
- integrações

Se impacta entendimento → atualizar