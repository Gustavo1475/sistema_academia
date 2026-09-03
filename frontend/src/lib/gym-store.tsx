import React, { createContext, useContext, useState, useEffect } from "react";
import { alunosIniciais, checkInsIniciais, exerciciosIniciais } from "./gym-data";

export type Sessao =
  | { papel: "admin"; nome: string; email?: string }
  | { papel: "aluno"; nome: string; alunoId: string; email: string; plano?: string }
  | null;

export interface ExercicioLocal {
  id: string | number;
  alunoId?: string | number;
  nome: string;
  treino: string;
  series: number;
  repeticoes: number;
  cargaKg: number;
  descansoSegundos: number;
}

interface GymContextType {
  sessao: Sessao;
  hidratado: boolean;
  alunos: typeof alunosIniciais;
  checkIns: typeof checkInsIniciais;
  exercicios: ExercicioLocal[];
  entrarComoAdmin: () => void;
  entrarComoAluno: (aluno: { id: number | string; nome: string; email: string; plano?: string }) => void;
  sair: () => void;
  adicionarExercicio: (exercicio: Omit<ExercicioLocal, "id">) => void;
  removerExercicio: (id: string | number) => void;
}

const GymContext = createContext<GymContextType | undefined>(undefined);

export function GymProvider({ children }: { children: React.ReactNode }) {
  // Inicia com null para garantir que o HTML do SSR e o do primeiro render no cliente sejam idênticos
  const [sessao, setSessao] = useState<Sessao>(null);
  const [hidratado, setHidratado] = useState(false);

  const [alunos] = useState(alunosIniciais);
  const [checkIns] = useState(checkInsIniciais);
  const [exercicios, setExercicios] = useState<ExercicioLocal[]>(() => {
    return (exerciciosIniciais as any[]).map((ex, idx) => ({
      id: ex.id ?? String(idx + 1),
      alunoId: ex.alunoId ?? "1",
      nome: ex.nome ?? "Exercício",
      treino: ex.treino ?? "A",
      series: ex.series ?? 3,
      repeticoes: ex.repeticoes ?? ex.reps ?? 10,
      cargaKg: ex.cargaKg ?? ex.carga ?? 0,
      descansoSegundos: ex.descansoSegundos ?? ex.descanso ?? 60,
    }));
  });
  // Lê do localStorage somente no cliente após montar
  useEffect(() => {
    setHidratado(true);
    try {
      const salvo = localStorage.getItem("gymflow_sessao");
      if (salvo) {
        setSessao(JSON.parse(salvo));
      }

      const exerciciosSalvos = localStorage.getItem("gymflow_exercicios");
      if (exerciciosSalvos) {
        setExercicios(JSON.parse(exerciciosSalvos));
      }
    } catch {
      // Ignora erro de parse
    }
  }, []);

  // Salva alterações de sessão no localStorage
  useEffect(() => {
    if (!hidratado) return;
    if (sessao) {
      localStorage.setItem("gymflow_sessao", JSON.stringify(sessao));
    } else {
      localStorage.removeItem("gymflow_sessao");
    }
  }, [sessao, hidratado]);

  // Salva alterações de exercícios no localStorage
  useEffect(() => {
    if (!hidratado) return;
    localStorage.setItem("gymflow_exercicios", JSON.stringify(exercicios));
  }, [exercicios, hidratado]);

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

  const adicionarExercicio = (novo: Omit<ExercicioLocal, "id">) => {
    const item: ExercicioLocal = {
      ...novo,
      id: Date.now().toString(),
    };
    setExercicios((antigos) => [...antigos, item]);
  };

  const removerExercicio = (id: string | number) => {
    setExercicios((antigos) => antigos.filter((e) => String(e.id) !== String(id)));
  };

  return (
    <GymContext.Provider
      value={{
        sessao,
        hidratado,
        alunos,
        checkIns,
        exercicios,
        entrarComoAdmin,
        entrarComoAluno,
        sair,
        adicionarExercicio,
        removerExercicio,
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