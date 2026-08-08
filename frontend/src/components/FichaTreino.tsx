import type { ReactNode } from "react";
import { Dumbbell, Layers, Repeat, Timer, Weight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGym } from "@/lib/gym-store";
import { TREINOS } from "@/lib/gym-data";

export function FichaTreino({
  alunoId,
  acao,
}: {
  alunoId: string;
  acao?: (exercicioId: string) => ReactNode;
}) {
  const { exercicios } = useGym();
  const daFicha = exercicios.filter((e) => e.alunoId === alunoId);

  return (
    <div className="min-w-0 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <Tabs defaultValue="A">
        <TabsList className="w-full">
          {TREINOS.map((t) => (
            <TabsTrigger key={t.letra} value={t.letra} className="flex-1">
              Treino {t.letra}
            </TabsTrigger>
          ))}
        </TabsList>

        {TREINOS.map((t) => {
          const lista = daFicha.filter((e) => e.treino === t.letra);
          return (
            <TabsContent key={t.letra} value={t.letra} className="mt-5">
              <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                {t.titulo}
              </h3>
              {lista.length === 0 ? (
                <p className="mt-6 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                  Nenhum exercício cadastrado neste treino.
                </p>
              ) : (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {lista.map((e) => (
                    <div
                      key={e.id}
                      className="rounded-xl border border-border bg-secondary/40 p-4 transition-colors hover:border-primary/40"
                    >
                      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                            <Dumbbell className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-semibold">{e.nome}</p>
                            <p className="text-xs text-muted-foreground">{e.grupo}</p>
                          </div>
                        </div>
                        {acao ? acao(e.id) : null}
                      </div>
                      <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
                        <Info icone={Layers} label="Séries" valor={String(e.series)} />
                        <Info icone={Repeat} label="Reps" valor={e.repeticoes} />
                        <Info icone={Weight} label="Carga" valor={`${e.carga} kg`} />
                        <Info icone={Timer} label="Descanso" valor={e.descanso} />
                      </dl>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

function Info({
  icone: Icone,
  label,
  valor,
}: {
  icone: typeof Layers;
  label: string;
  valor: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-background/60 px-2.5 py-2">
      <Icone className="h-3.5 w-3.5 shrink-0 text-primary" />
      <div className="min-w-0">
        <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</dt>
        <dd className="truncate font-semibold">{valor}</dd>
      </div>
    </div>
  );
}
