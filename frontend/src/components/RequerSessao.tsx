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
  const { sessao, hidratado } = useGym();
  const navigate = useNavigate();

  useEffect(() => {
    // Só avalia os redirecionamentos após o estado ser recuperado no navegador
    if (!hidratado) return;

    if (!sessao) {
      navigate({ to: "/autenticacao" });
      return;
    }

    if (papel && sessao.papel !== papel) {
      navigate({ to: sessao.papel === "admin" ? "/admin/alunos" : "/aluno" });
    }
  }, [sessao, papel, hidratado, navigate]);

  // Enquanto estiver no SSR ou antes da hidratação no cliente,
  // renderiza um container neutro para bater 100% com o HTML inicial do servidor
  if (!hidratado) {
    return <div className="min-h-screen w-full bg-background" />;
  }

  if (!sessao || (papel && sessao.papel !== papel)) {
    return null;
  }

  return <>{children}</>;
}