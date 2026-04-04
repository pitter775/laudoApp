import { Activity, ChartColumnBig, FileSpreadsheet, Zap } from "lucide-react";

import { PageIntro } from "@/components/ui/page-intro";
import { PlaceholderPanel } from "@/components/ui/placeholder-panel";

export function DashboardPageShell() {
  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="Painel"
        title="Visao geral da operacao"
        description="Acompanhe laudos, retome fluxos e mantenha a rotina de emissao organizada em um unico painel."
        icon={ChartColumnBig}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <PlaceholderPanel
          title="Laudos recentes"
          description="Espaco para consultar emissao, status e proximos passos de cada laudo."
          icon={FileSpreadsheet}
          items={[
            "Data de emissao",
            "Status aprovado ou reprovado",
            "Acoes de visualizar e PDF",
          ]}
        />
        <PlaceholderPanel
          title="Acoes rapidas"
          description="Atalhos para iniciar um novo laudo ou retomar o que ficou em andamento."
          icon={Zap}
          items={["Novo laudo", "Continuar rascunho", "Atualizar listagem"]}
        />
        <PlaceholderPanel
          title="Indicadores"
          description="Area pronta para filtros, resumo da operacao e leitura rapida do desempenho."
          icon={Activity}
          items={[
            "Filtros por periodo",
            "Busca por cliente",
            "Resumo de produtividade",
          ]}
        />
      </div>
    </div>
  );
}
