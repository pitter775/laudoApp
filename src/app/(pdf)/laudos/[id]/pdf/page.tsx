import { LaudoPdfPageShell } from "@/components/laudo/laudo-pdf-page-shell";

type LaudoPdfPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LaudoPdfPage({ params }: LaudoPdfPageProps) {
  const { id } = await params;

  return <LaudoPdfPageShell id={id} />;
}
