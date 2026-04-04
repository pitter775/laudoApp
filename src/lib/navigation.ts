export const appNavigation = [
  {
    href: "/laudos",
    label: "Meus Laudos",
    description: "Consulta e acompanhamento dos laudos emitidos.",
    disabled: false,
  },
  {
    href: "/laudos/novo",
    label: "Emitir Laudo",
    description: "Wizard de emissão em cinco etapas.",
    disabled: false,
  },
  {
    href: "/capacitacao",
    label: "Capacitação",
    description: "Área futura de treinamentos e materiais.",
    disabled: true,
  },
] as const;
