import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, CreditCard, Clock, ShieldCheck } from "lucide-react";
import { GymLayout } from "@/components/GymLayout";
import { RequerSessao } from "@/components/RequerSessao";
import { FichaTreino } from "@/components/FichaTreino";
import { useGym } from "@/lib/gym-store";
import { diasRestantes, formatarData, iniciais } from "@/lib/gym-data";

export const Route = createFileRoute("/aluno")({
  head: () => ({
    meta: [
      { title: "Meu Painel — Área do aluno GymFlow" },
      {
        name: "description",
        content: "Consulte a validade do seu plano, sua ficha de treino e seus check-ins recentes.",
      },
      { property: "og:title", content: "Meu Painel — Área do aluno GymFlow" },
      {
        property: "og:description",
        content: "Plano, treinos A/B/C e histórico de acesso do aluno na academia.",
      },
    ],
  }),
  component: PaginaAluno,
});

function PaginaAluno() {
  const { sessao, alunos, checkIns } = useGym();
  const alunoId = sessao?.papel === "aluno" ? sessao.alunoId : "";
  const aluno = alunos.find((a) => a.id === alunoId);
  const dias = aluno ? diasRestantes(aluno.validade) : 0;
  const meus = checkIns.filter((c) => c.alunoId === alunoId);

  return (
    <RequerSessao papel="aluno">
      <GymLayout titulo="Meu Painel" descricao="Plano, treinos e acessos">
        {aluno ? (
          <>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-4">
                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-primary text-xl font-extrabold text-primary-foreground">
                  {iniciais(aluno.nome)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-lg font-bold">{aluno.nome}</p>
                  <p className="text-sm text-muted-foreground">
                    {aluno.matricula} · {aluno.email}
                  </p>
                </div>
                <span
                  className={`ml-auto rounded-full px-3 py-1.5 text-xs font-semibold ${
                    aluno.status === "Ativo"
                      ? "bg-success/15 text-success"
                      : "bg-destructive/15 text-destructive"
                  }`}
                >
                  {aluno.status === "Ativo" ? "Plano em dia" : "Plano vencido"}
                </span>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Cartao icone={CreditCard} label="Plano" valor={aluno.plano} />
                <Cartao
                  icone={CalendarDays}
                  label="Válido até"
                  valor={formatarData(aluno.validade)}
                />
                <Cartao
                  icone={ShieldCheck}
                  label="Dias restantes"
                  valor={dias > 0 ? `${dias} dias` : "Expirado"}
                />
              </div>
            </div>

            <div className="mt-6">
              <FichaTreino alunoId={aluno.id} />
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" /> Meus check-ins recentes
              </h2>
              {meus.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">Nenhum check-in registrado.</p>
              ) : (
                <ul className="mt-4 divide-y divide-border">
                  {meus.map((c) => (
                    <li key={c.id} className="flex items-center justify-between py-3 text-sm">
                      <span className="text-muted-foreground">Hoje, {c.hora}</span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          c.liberado
                            ? "bg-success/15 text-success"
                            : "bg-destructive/15 text-destructive"
                        }`}
                      >
                        {c.liberado ? "Liberado" : "Bloqueado"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        ) : null}
      </GymLayout>
    </RequerSessao>
  );
}

function Cartao({
  icone: Icone,
  label,
  valor,
}: {
  icone: typeof CreditCard;
  label: string;
  valor: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-4">
      <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
        <Icone className="h-3.5 w-3.5 text-primary" /> {label}
      </p>
      <p className="mt-2 text-xl font-bold">{valor}</p>
    </div>
  );
}
