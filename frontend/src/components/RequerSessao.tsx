import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useGym } from "@/lib/gym-store";

export function RequerSessao({
  papel,
  children,
}: {
  papel?: "admin" | "aluno";
  children: React.ReactNode;
}) {
  const { sessao } = useGym();
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessao) {
      navigate({ to: "/autenticacao" });
      return;
    }
    if (papel && sessao.papel !== papel) {
      navigate({ to: sessao.papel === "admin" ? "/admin/alunos" : "/aluno" });
    }
  }, [sessao, papel, navigate]);

  if (!sessao || (papel && sessao.papel !== papel)) {
    return null;
  }

  return <>{children}</>;
}