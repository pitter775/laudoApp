import { supabaseClient } from "@/lib/supabaseClient";
import type {
  EmitirLaudoPayload,
  LaudoAnexoPersistido,
  LaudoDetalhe,
  LaudoListItem,
  LaudoItemPersistido,
  PecaAnalise,
} from "@/types/laudo";

export type CreateLaudoPayload = {
  userId: string;
  pecaId: string;
};

export const laudosService = {
  async listByUser(): Promise<LaudoListItem[]> {
    const { data, error } = await supabaseClient
      .from("laudos")
      .select("id, dados_cliente, dados_peca, status, created_at, pecas(nome)")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (
      data as Array<{
        id: string;
        dados_cliente: {
          razaoSocial?: string;
        };
        dados_peca: {
          modelo?: string;
        };
        status: LaudoListItem["status"];
        created_at: string;
        pecas?: { nome?: string } | { nome?: string }[] | null;
      }>
    ).map((laudo) => {
      const pecaRelation = Array.isArray(laudo.pecas)
        ? laudo.pecas[0]
        : laudo.pecas;

      return {
        id: laudo.id,
        clienteNome:
          laudo.dados_cliente?.razaoSocial?.trim() || "Cliente nao informado",
        pecaNome:
          pecaRelation?.nome?.trim() ||
          laudo.dados_peca?.modelo?.trim() ||
          "Peca nao identificada",
        status: laudo.status,
        createdAt: laudo.created_at,
      };
    });
  },
  async getById(id: string): Promise<LaudoDetalhe | null> {
    const { data, error } = await supabaseClient
      .from("laudos")
      .select(
        "id, dados_cliente, dados_peca, status, created_at, peca_id, laudo_itens(id, analise_id, status), laudo_anexos(id, imagem_base64)",
      )
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    const [pecaResult, analisesResult] = await Promise.all([
      supabaseClient
        .from("pecas")
        .select("id, nome")
        .eq("id", data.peca_id)
        .maybeSingle(),
      supabaseClient
        .from("pecas_analises")
        .select("id, peca_id, nome, created_at")
        .eq("peca_id", data.peca_id)
        .order("nome", { ascending: true }),
    ]);

    if (pecaResult.error) {
      throw pecaResult.error;
    }

    if (analisesResult.error) {
      throw analisesResult.error;
    }

    const analisesById = new Map(
      (analisesResult.data satisfies PecaAnalise[]).map((analise) => [
        analise.id,
        analise.nome,
      ]),
    );

    const itens = (
      data.laudo_itens as Array<{
        id: string;
        analise_id: string;
        status: LaudoItemPersistido["status"];
      }> | null
    )?.map((item) => ({
      id: item.id,
      analiseId: item.analise_id,
      nome: analisesById.get(item.analise_id) ?? "Analise nao identificada",
      status: item.status,
    })) satisfies LaudoItemPersistido[] | undefined;

    const anexos = (
      data.laudo_anexos as Array<{
        id: string;
        imagem_base64: string;
      }> | null
    )?.map((anexo) => ({
      id: anexo.id,
      imagemBase64: anexo.imagem_base64,
    })) satisfies LaudoAnexoPersistido[] | undefined;

    return {
      id: data.id,
      pecaId: data.peca_id,
      pecaNome: pecaResult.data?.nome ?? "Peca nao identificada",
      dadosCliente: data.dados_cliente,
      dadosPeca: data.dados_peca,
      status: data.status,
      createdAt: data.created_at,
      itens: itens ?? [],
      anexos: anexos ?? [],
    };
  },
  async create(payload: EmitirLaudoPayload) {
    const { data, error } = await supabaseClient.rpc("emitir_laudo", {
      p_user_id: payload.userId,
      p_dados_cliente: payload.dadosCliente,
      p_dados_peca: payload.dadosPeca,
      p_peca_id: payload.pecaId,
      p_status: payload.status,
      p_itens: payload.itens.map((item) => ({
        analise_id: item.analiseId,
        status: item.status,
      })),
      p_anexos: payload.anexos.map((anexo) => ({
        imagem_base64: anexo.imagemBase64,
      })),
    });

    if (error) {
      throw error;
    }

    return data as string;
  },
};
