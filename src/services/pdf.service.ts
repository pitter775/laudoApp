const DEFAULT_VALIDITY_DAYS = 90;

function formatShortId(id: string, prefix: string) {
  return `${prefix}-${id.slice(0, 8).toUpperCase()}`;
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

export const pdfService = {
  formatDate(date: string | Date) {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  },
  buildNumeroLaudo(id: string) {
    return formatShortId(id, "LDT");
  },
  buildControle(id: string) {
    return formatShortId(id, "CTL");
  },
  buildValidade(date: string | Date, days = DEFAULT_VALIDITY_DAYS) {
    return this.formatDate(addDays(new Date(date), days));
  },
  buildQrUrl(id: string) {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_URL ?? "";

    return `${origin}/laudo/${id}`;
  },
};
