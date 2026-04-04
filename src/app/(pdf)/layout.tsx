import type { ReactNode } from "react";

type PdfLayoutProps = {
  children: ReactNode;
};

export default function PdfLayout({ children }: PdfLayoutProps) {
  return children;
}
