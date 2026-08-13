import { createContext, useContext, useMemo, useState, useEffect, type ReactNode } from "react";
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
  // 1. Busca a sessão salva no localStorage ao iniciar a aplicação
  const [sessao, setSessao] = useState<Sessao>(() => {
    try {
      const sessaoSalva = localStorage.getItem("gymflow_sessao");
      return sessaoSalva ? JSON.parse(sessaoSalva) : null;
    } catch {
      return null;
    }
  });

  const [alunos, setAlunos] = useState<Aluno[]>(alunosIniciais);
  const [exercicios, setExercicios] = useState<Exercicio[]>(exerciciosIniciais);
  const [checkIns, setCheckIns] = useState<CheckIn[]>(checkInsIniciais);

  // 2. Sempre que o estado de 'sessao' mudar, sincroniza com o localStorage
  useEffect(() => {
    if (sessao) {
      localStorage.setItem("gymflow_sessao", JSON.stringify(sessao));
    } else {
      localStorage.removeItem("gymflow_sessao");
    }
  }, [sessao]);

  const value = useMemo<GymContextValue>(
    () => ({
      sessao,
      entrar: (emailDigitado: string) => {
        const emailLimpo = emailDigitado.toLowerCase().trim();
  
        // Regra: Se o e-mail tiver "admin", entra como Admin. Senão, entra como Aluno.
        const eAdmin = emailLimpo.includes("admin");

        const novaSessao: Sessao = eAdmin
          ? { papel: "admin", nome: "Administrador" }
          : { papel: "aluno", nome: "Aluno", alunoId: "1" };

      setSessao(novaSessao);
      },
      sair: () => {
        setSessao(null);
      },
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