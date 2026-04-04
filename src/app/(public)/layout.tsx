import type { ReactNode } from "react";

import { AuthShell } from "@/components/layout/auth-shell";

type PublicLayoutProps = {
  children: ReactNode;
};

export default function PublicLayout({ children }: PublicLayoutProps) {
  return <AuthShell>{children}</AuthShell>;
}
