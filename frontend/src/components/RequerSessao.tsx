import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useGym } from "@/lib/gym-store";

export function RequerSessao({
  papel,
  children,
}: {
  papel: "admin" | "aluno";
  children: ReactNode;
}) {
  const { sessao } = useGym();

  if (!sessao || sessao.papel !== papel) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-sm text-center">
          <h1 className="text-xl font-bold">Acesso restrito</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Entre como {papel === "admin" ? "administrador" : "aluno"} para ver esta área.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Ir para o login
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
