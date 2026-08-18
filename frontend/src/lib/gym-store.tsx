import React, { createContext, useContext, useState, useEffect } from "react";
import { alunosIniciais, checkInsIniciais, exerciciosIniciais } from "./gym-data";

export type Sessao =
  | { papel: "admin"; nome: string; email?: string }
  | { papel: "aluno"; nome: string; alunoId: string; email: string; plano?: string }
  | null;

interface GymContextType {
  sessao: Sessao;
  alunos: typeof alunosIniciais;
  checkIns: typeof checkInsIniciais;
  exercicios: typeof exerciciosIniciais;
  entrarComoAdmin: () => void;
  entrarComoAluno: (aluno: { id: number | string; nome: string; email: string; plano?: string }) => void;
  sair: () => void;
}

const GymContext = createContext<GymContextType | undefined>(undefined);

export function GymProvider({ children }: { children: React.ReactNode }) {
  const [sessao, setSessao] = useState<Sessao>(() => {
    // Verificação segura para evitar quebra no SSR
    if (typeof window !== "undefined") {
      const salvo = localStorage.getItem("gymflow_sessao");
      return salvo ? JSON.parse(salvo) : null;
    }
    return null;
  });

  const [alunos] = useState(alunosIniciais);
  const [checkIns] = useState(checkInsIniciais);
  const [exercicios] = useState(exerciciosIniciais);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (sessao) {
        localStorage.setItem("gymflow_sessao", JSON.stringify(sessao));
      } else {
        localStorage.removeItem("gymflow_sessao");
      }
    }
  }, [sessao]);

  const entrarComoAdmin = () => {
    setSessao({
      papel: "admin",
      nome: "Administrador GymFlow",
      email: "admin@gymflow.com",
    });
  };

  const entrarComoAluno = (aluno: { id: number | string; nome: string; email: string; plano?: string }) => {
    setSessao({
      papel: "aluno",
      nome: aluno.nome,
      alunoId: String(aluno.id),
      email: aluno.email,
      plano: aluno.plano ?? "Mensal",
    });
  };

  const sair = () => {
    setSessao(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("gymflow_sessao");
    }
  };

  return (
    <GymContext.Provider
      value={{
        sessao,
        alunos,
        checkIns,
        exercicios,
        entrarComoAdmin,
        entrarComoAluno,
        sair,
      }}
    >
      {children}
    </GymContext.Provider>
  );
}

export function useGym() {
  const context = useContext(GymContext);
  if (!context) {
    throw new Error("useGym deve ser usado dentro de um GymProvider");
  }
  return context;
}