# RPC emitir_laudo

## Estado atual

Hoje a criacao do laudo depende da RPC `emitir_laudo` chamada em `src/services/laudos.service.ts`.

Payload atual:

- `p_user_id`
- `p_dados_cliente`
- `p_dados_peca`
- `p_peca_id`
- `p_status`
- `p_itens`
- `p_anexos`

## Impacto na migracao

A futura migracao precisa reproduzir no backend Next.js a mesma operacao transacional:

1. criar registro em `laudos`
2. criar `laudo_itens`
3. criar `laudo_anexos`
4. retornar `id` do laudo

Dependencias de schema preservadas para a migracao:

- `laudos.peca_id -> pecas.id`
- `laudo_itens.analise_id -> pecas_analises.id`

## Nesta fase

- nenhuma chamada foi alterada
- nenhuma regra da RPC foi removida
- apenas a base do novo backend foi preparada
