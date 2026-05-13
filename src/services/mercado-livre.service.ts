import type {
  MercadoLivreConnectionPayload,
  MercadoLivreContract,
} from "@/types/mercado-livre";
import { supabaseClient } from "@/lib/supabaseClient";

type MercadoLivreContractRecord = {
  id: string;
  user_id: string;
  store_name: string;
  seller_id: string;
  app_id: string;
  connected_at: string;
};

function mapContract(record: MercadoLivreContractRecord): MercadoLivreContract {
  return {
    id: record.id,
    userId: record.user_id,
    storeName: record.store_name,
    sellerId: record.seller_id,
    appId: record.app_id,
    connectedAt: record.connected_at,
  };
}

export const mercadoLivreService = {
  async getByUser(userId: string) {
    const { data, error } = await supabaseClient
      .from("mercado_livre_contratos")
      .select("id, user_id, store_name, seller_id, app_id, connected_at")
      .eq("user_id", userId)
      .maybeSingle<MercadoLivreContractRecord>();

    if (error) {
      throw error;
    }

    return data ? mapContract(data) : null;
  },

  async connect(payload: MercadoLivreConnectionPayload) {
    const { data, error } = await supabaseClient
      .from("mercado_livre_contratos")
      .upsert(
        {
          user_id: payload.userId,
          store_name: payload.storeName.trim(),
          seller_id: payload.sellerId.trim(),
          app_id: payload.appId.trim(),
        },
        { onConflict: "user_id" },
      )
      .select("id, user_id, store_name, seller_id, app_id, connected_at")
      .single<MercadoLivreContractRecord>();

    if (error) {
      throw error;
    }

    return mapContract(data);
  },

  async remove(userId: string) {
    const { count, error } = await supabaseClient
      .from("mercado_livre_contratos")
      .delete({ count: "exact" })
      .eq("user_id", userId);

    if (error) {
      throw error;
    }

    return count ?? 0;
  },
};
