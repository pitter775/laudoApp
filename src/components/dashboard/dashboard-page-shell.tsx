import { Activity, ChartColumnBig, FileSpreadsheet, Zap } from "lucide-react";

import { PageIntro } from "@/components/ui/page-intro";
import { PlaceholderPanel } from "@/components/ui/placeholder-panel";

export function DashboardPageShell() {
  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="Painel"
        title="Visão geral da operação"
        description="Acompanhe laudos, retome fluxos e mantenha a rotina de emissão organizada em um único painel."
        icon={ChartColumnBig}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <PlaceholderPanel
          title="Laudos recentes"
          description="Espaço para consultar emissão, status e próximos passos de cada laudo."
          icon={FileSpreadsheet}
          items={[
            "Data de emissão",
            "Status aprovado ou reprovado",
            "Ações de visualização e PDF",
          ]}
        />
        <PlaceholderPanel
          title="Ações rápidas"
          description="Atalhos para iniciar um novo laudo ou retomar o que ficou em andamento."
          icon={Zap}
          items={["Novo laudo", "Continuar rascunho", "Atualizar listagem"]}
        />
        <PlaceholderPanel
          title="Indicadores"
          description="Área pronta para filtros, resumo da operação e leitura rápida do desempenho."
          icon={Activity}
          items={[
            "Filtros por período",
            "Busca por cliente",
            "Resumo de produtividade",
          ]}
        />
      </div>
    </div>
  );
}
