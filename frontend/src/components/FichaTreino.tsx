import React, { useState } from "react";
import { Repeat, Weight, Timer, Dumbbell } from "lucide-react";
import { useGym, ExercicioLocal } from "@/lib/gym-store";

export interface FichaTreinoProps {
  alunoId?: string | number;
  exercicios?: ExercicioLocal[];
  treinoAtivo?: string;
  acao?: (id: string) => React.ReactNode;
}

export function FichaTreino({
  alunoId,
  exercicios: exerciciosProps,
  treinoAtivo: treinoProps,
  acao,
}: FichaTreinoProps) {
  const { exercicios: exerciciosStore } = useGym();
  const [abaInterna, setAbaInterna] = useState("A");

  // Se treinoAtivo não for passado por prop, usa o estado interno de abas (A, B, C)
  const treinoSelecionado = treinoProps ?? abaInterna;

  // Usa os exercícios passados via prop ou pega direto do store filtrando pelo alunoId
  const listaBase = exerciciosProps ?? exerciciosStore;
  const filtrados = listaBase.filter((e) => {
    const bateTreino = e.treino === treinoSelecionado;
    if (alunoId !== undefined && e.alunoId !== undefined) {
      return bateTreino && String(e.alunoId) === String(alunoId);
    }
    return bateTreino;
  });

  return (
    <div className="space-y-4">
      {/* Se não recebeu treinoAtivo fixo por prop, exibe as abas A, B e C */}
      {!treinoProps && (
        <div className="flex gap-2 rounded-lg bg-card/60 p-1 border border-border/40">
          {["A", "B", "C"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setAbaInterna(t)}
              className={`flex-1 rounded-md py-1.5 text-sm font-medium transition ${
                treinoSelecionado === t
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Treino {t}
            </button>
          ))}
        </div>
      )}

      {filtrados.length === 0 ? (
        <div className="rounded-xl border border-border/50 bg-card/40 p-8 text-center text-muted-foreground">
          Nenhum exercício cadastrado para o Treino {treinoSelecionado}.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtrados.map((e) => (
            <div
              key={String(e.id)}
              className="flex flex-col justify-between rounded-xl border border-border/60 bg-card p-4 transition hover:border-border"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Dumbbell className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{e.nome}</h4>
                    <p className="text-xs text-muted-foreground">{e.grupo || "Geral"}</p>
                  </div>
                </div>
                {acao ? acao(String(e.id)) : null}
              </div>

              <div className="mt-4 grid grid-cols-4 gap-2 rounded-lg bg-background/50 p-2 text-center text-xs">
                <Info icone={Repeat} label="Séries" valor={String(e.series)} />
                <Info icone={Repeat} label="Reps" valor={String(e.repeticoes)} />
                <Info icone={Weight} label="Carga" valor={`${e.cargaKg ?? 0} kg`} />
                <Info
                  icone={Timer}
                  label="Descanso"
                  valor={e.descanso ? String(e.descanso) : `${e.descansoSegundos ?? 60}s`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Info({
  icone: Icone,
  label,
  valor,
}: {
  icone: React.ComponentType<{ className?: string }>;
  label: string;
  valor: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-1 text-muted-foreground">
        <Icone className="h-3.5 w-3.5" />
        <span>{label}</span>
      </div>
      <span className="font-medium text-foreground">{valor}</span>
    </div>
  );
}