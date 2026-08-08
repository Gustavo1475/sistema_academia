import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  alunosIniciais,
  checkInsIniciais,
  exerciciosIniciais,
  type Aluno,
  type CheckIn,
  type Exercicio,
} from "./gym-data";

export type Sessao =
  | { papel: "admin"; nome: string }
  | { papel: "aluno"; nome: string; alunoId: string }
  | null;

type GymContextValue = {
  sessao: Sessao;
  entrar: (papel: "admin" | "aluno") => void;
  sair: () => void;
  alunos: Aluno[];
  exercicios: Exercicio[];
  checkIns: CheckIn[];
  salvarAluno: (aluno: Aluno) => void;
  alternarStatus: (id: string) => void;
  adicionarExercicio: (ex: Exercicio) => void;
  removerExercicio: (id: string) => void;
  registrarCheckIn: (alunoId: string, liberado: boolean) => void;
};

const GymContext = createContext<GymContextValue | null>(null);

export function GymProvider({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<Sessao>(null);


  const [alunos, setAlunos] = useState<Aluno[]>(alunosIniciais);
  const [exercicios, setExercicios] = useState<Exercicio[]>(exerciciosIniciais);
  const [checkIns, setCheckIns] = useState<CheckIn[]>(checkInsIniciais);

  const value = useMemo<GymContextValue>(
    () => ({
      sessao,
      entrar: (papel) =>
        setSessao(
          papel === "admin"
            ? { papel: "admin", nome: "Administrador" }
            : { papel: "aluno", nome: alunosIniciais[0]!.nome, alunoId: alunosIniciais[0]!.id },
        ),
      sair: () => setSessao(null),
      alunos,
      exercicios,
      checkIns,
      salvarAluno: (aluno) =>
        setAlunos((prev) =>
          prev.some((a) => a.id === aluno.id)
            ? prev.map((a) => (a.id === aluno.id ? aluno : a))
            : [...prev, aluno],
        ),
      alternarStatus: (id) =>
        setAlunos((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, status: a.status === "Ativo" ? "Inativo" : "Ativo" } : a,
          ),
        ),
      adicionarExercicio: (ex) => setExercicios((prev) => [...prev, ex]),
      removerExercicio: (id) => setExercicios((prev) => prev.filter((e) => e.id !== id)),
      registrarCheckIn: (alunoId, liberado) =>
        setCheckIns((prev) => [
          {
            id: `c${Date.now()}`,
            alunoId,
            hora: new Date().toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            liberado,
          },
          ...prev,
        ]),
    }),
    [sessao, alunos, exercicios, checkIns],
  );

  return <GymContext.Provider value={value}>{children}</GymContext.Provider>;
}

export function useGym() {
  const ctx = useContext(GymContext);
  if (!ctx) throw new Error("useGym deve ser usado dentro de GymProvider");
  return ctx;
}
