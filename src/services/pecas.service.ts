import { supabaseClient } from "@/lib/supabaseClient";
import type { Peca, PecaAnalise } from "@/types/laudo";

export const pecasService = {
  async listPecas(): Promise<Peca[]> {
    const { data, error } = await supabaseClient
      .from("pecas")
      .select("id, nome, created_at")
      .order("nome", { ascending: true });

    if (error) {
      throw error;
    }

    return data satisfies Peca[];
  },
  async listAnalisesByPeca(pecaId: string): Promise<PecaAnalise[]> {
    const { data, error } = await supabaseClient
      .from("pecas_analises")
      .select("id, peca_id, nome, created_at")
      .eq("peca_id", pecaId)
      .order("nome", { ascending: true });

    if (error) {
      throw error;
    }

    return data satisfies PecaAnalise[];
  },
};
