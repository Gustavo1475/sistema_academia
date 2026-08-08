import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ScanLine, CheckCircle2, XCircle, Clock } from "lucide-react";
import { GymLayout } from "@/components/GymLayout";
import { RequerSessao } from "@/components/RequerSessao";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGym } from "@/lib/gym-store";
import { formatarData, iniciais, type Aluno } from "@/lib/gym-data";

export const Route = createFileRoute("/admin/checkin")({
  head: () => ({
    meta: [
      { title: "Check-in — Controle de acesso GymFlow" },
      {
        name: "description",
        content: "Recepção da academia: busque por CPF ou matrícula e libere o acesso do aluno.",
      },
      { property: "og:title", content: "Check-in — Controle de acesso GymFlow" },
      {
        property: "og:description",
        content: "Confirme check-ins e verifique a situação do plano em segundos.",
      },
    ],
  }),
  component: PaginaCheckIn,
});

function PaginaCheckIn() {
  const { alunos, checkIns, registrarCheckIn } = useGym();
  const [busca, setBusca] = useState("");
  const [resultado, setResultado] = useState<{ aluno: Aluno; liberado: boolean } | null>(null);
  const [erro, setErro] = useState("");

  function confirmar(e: React.FormEvent) {
    e.preventDefault();
    const termo = busca.trim().toLowerCase();
    if (!termo) {
      setErro("Digite o CPF ou a matrícula do aluno.");
      setResultado(null);
      return;
    }
    const aluno = alunos.find(
      (a) =>
        a.cpf.replace(/\D/g, "") === termo.replace(/\D/g, "") ||
        a.matricula.toLowerCase() === termo ||
        a.id === termo,
    );
    if (!aluno) {
      setErro("Aluno não encontrado. Confira o CPF ou a matrícula.");
      setResultado(null);
      return;
    }
    setErro("");
    const liberado = aluno.status === "Ativo";
    setResultado({ aluno, liberado });
    registrarCheckIn(aluno.id, liberado);
  }

  return (
    <RequerSessao papel="admin">
      <GymLayout titulo="Check-in / Recepção" descricao="Controle de acesso à academia">
        <div className="mx-auto max-w-3xl">
          <form
            onSubmit={confirmar}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <label htmlFor="busca" className="text-sm font-semibold">
              CPF ou Matrícula
            </label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="busca"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="000.000.000-00 ou GF-1001"
                  className="h-14 pl-12 text-lg"
                />
              </div>
              <Button type="submit" className="h-14 px-6 text-base sm:w-auto">
                <ScanLine className="h-5 w-5" /> Confirmar Check-in
              </Button>
            </div>
            {erro ? <p className="mt-3 text-sm text-destructive">{erro}</p> : null}
          </form>

          {resultado ? (
            <div
              className={`mt-6 rounded-2xl border p-6 shadow-sm ${
                resultado.liberado
                  ? "border-success/40 bg-success/10"
                  : "border-destructive/40 bg-destructive/10"
              }`}
            >
              <div className="flex flex-wrap items-center gap-4">
                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-primary text-xl font-extrabold text-primary-foreground">
                  {iniciais(resultado.aluno.nome)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-lg font-bold">{resultado.aluno.nome}</p>
                  <p className="text-sm text-muted-foreground">
                    {resultado.aluno.matricula} · Plano {resultado.aluno.plano} · válido até{" "}
                    {formatarData(resultado.aluno.validade)}
                  </p>
                </div>
              </div>
              <p
                className={`mt-6 flex items-center gap-3 text-2xl font-extrabold tracking-tight sm:text-3xl ${
                  resultado.liberado ? "text-success" : "text-destructive"
                }`}
              >
                {resultado.liberado ? (
                  <CheckCircle2 className="h-8 w-8 shrink-0" />
                ) : (
                  <XCircle className="h-8 w-8 shrink-0" />
                )}
                {resultado.liberado ? "ACESSO LIBERADO" : "MATRÍCULA VENCIDA"}
              </p>
            </div>
          ) : null}

          <div className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" /> Check-ins de hoje
            </h2>
            <ul className="mt-4 divide-y divide-border">
              {checkIns.map((c) => {
                const aluno = alunos.find((a) => a.id === c.alunoId);
                return (
                  <li
                    key={c.id}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3"
                  >
                    <span className="min-w-0 truncate text-sm">{aluno?.nome ?? "—"}</span>
                    <span className="flex shrink-0 items-center gap-3 text-sm">
                      <span className="text-muted-foreground">{c.hora}</span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          c.liberado
                            ? "bg-success/15 text-success"
                            : "bg-destructive/15 text-destructive"
                        }`}
                      >
                        {c.liberado ? "Liberado" : "Bloqueado"}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </GymLayout>
    </RequerSessao>
  );
}
