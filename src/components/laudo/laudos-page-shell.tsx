import { ClipboardList, Plus } from "lucide-react";
import Link from "next/link";

import { LaudosList } from "@/components/laudo/laudos-list";
import { PageIntro } from "@/components/ui/page-intro";

export function LaudosPageShell() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <PageIntro
          eyebrow="Laudos"
          title="Gestao de laudos"
          description="Consulte, acompanhe e avance com mais controle sobre os laudos emitidos no sistema."
          icon={ClipboardList}
        />

        <Link
          href="/laudos/novo"
          className="premium-button inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
        >
          <Plus className="h-4 w-4" />
          Novo laudo
        </Link>
      </div>

      <LaudosList />
    </div>
  );
}
