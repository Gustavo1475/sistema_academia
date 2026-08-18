import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { CalendarDays, CreditCard, Clock, ShieldCheck } from "lucide-react";
import { GymLayout } from "@/components/GymLayout";
import { RequerSessao } from "@/components/RequerSessao";
import { FichaTreino } from "@/components/FichaTreino";
import { useGym } from "@/lib/gym-store";
import { iniciais } from "@/lib/gym-data";

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
  const { sessao, checkIns } = useGym();
  const alunoId = sessao?.papel === "aluno" ? sessao.alunoId : "";
  
  const [aluno, setAluno] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarAluno() {
      if (!alunoId) {
        setCarregando(false);
        return;
      }
      try {
        const res = await fetch("http://127.0.0.1:8000/api/v1/alunos");
        if (res.ok) {
          const dados = await res.json();
          const encontrado = dados.find((a: any) => String(a.id) === String(alunoId));
          if (encontrado) {
            setAluno(encontrado);
          } else if (sessao?.papel === "aluno") {
            setAluno({
              id: sessao.alunoId,
              nome: sessao.nome,
              email: sessao.email,
              plano: sessao.plano || "Mensal",
              status: "Ativo",
            });
          }
        }
      } catch (err) {
        console.error("Erro ao buscar dados do aluno:", err);
      } finally {
        setCarregando(false);
      }
    }

    carregarAluno();
  }, [alunoId, sessao]);

  const meus = checkIns.filter((c) => String(c.alunoId) === String(alunoId));
  const nomeAluno = aluno?.nome || (sessao?.papel === "aluno" ? sessao.nome : "Aluno");
  const emailAluno = aluno?.email || (sessao?.papel === "aluno" ? sessao.email : "");
  const planoAluno = aluno?.plano || "Mensal";
  const statusAluno = aluno?.status || "Ativo";
  const matricula = `GF-${1000 + Number(alunoId || 1)}`;

  return (
    <RequerSessao papel="aluno">
      <GymLayout titulo="Meu Painel" descricao="Plano, treinos e acessos">
        {carregando ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
            Carregando dados do aluno...
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-4">
                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-primary text-xl font-extrabold text-primary-foreground">
                  {iniciais(nomeAluno)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-lg font-bold">{nomeAluno}</p>
                  <p className="text-sm text-muted-foreground">
                    {matricula} · {emailAluno}
                  </p>
                </div>
                <span
                  className={`ml-auto rounded-full px-3 py-1.5 text-xs font-semibold ${
                    statusAluno === "Ativo"
                      ? "bg-success/15 text-success"
                      : "bg-destructive/15 text-destructive"
                  }`}
                >
                  {statusAluno === "Ativo" ? "Plano em dia" : "Plano Inativo / Pendente"}
                </span>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Cartao icone={CreditCard} label="Plano" valor={planoAluno} />
                <Cartao
                  icone={CalendarDays}
                  label="Válido até"
                  valor="28/02/2027"
                />
                <Cartao
                  icone={ShieldCheck}
                  label="Status Matrícula"
                  valor={statusAluno}
                />
              </div>
            </div>

            <div className="mt-6">
              <FichaTreino alunoId={String(alunoId || "1")} />
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" /> Meus check-ins recentes
              </h2>
              {meus.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">Nenhum check-in registrado hoje.</p>
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
        )}
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