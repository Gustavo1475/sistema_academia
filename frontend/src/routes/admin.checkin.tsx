import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { CheckCircle2, QrCode } from "lucide-react";
import { GymLayout } from "@/components/GymLayout";
import { RequerSessao } from "@/components/RequerSessao";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/checkin")({
  head: () => ({
    meta: [
      { title: "Check-in — Painel do administrador GymFlow" },
      { name: "description", content: "Controle de acesso à academia por CPF ou número de matrícula." },
    ],
  }),
  component: PaginaCheckIn,
});

interface AlunoAPI {
  id: number;
  nome: string;
  cpf: string;
  status: string;
}

interface ItemCheckIn {
  id: string;
  nome: string;
  hora: string;
  status: string;
}

function PaginaCheckIn() {
  const [alunos, setAlunos] = useState<AlunoAPI[]>([]);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");
  const [historico, setHistorico] = useState<ItemCheckIn[]>([]);

  // Carrega alunos reais do SQLite via API Python
  useEffect(() => {
    async function carregarAlunos() {
      try {
        const resposta = await fetch("http://127.0.0.1:8000/api/v1/alunos");
        if (resposta.ok) {
          const dados = await resposta.json();
          setAlunos(dados);
        }
      } catch (err) {
        console.error("Erro ao carregar alunos para check-in:", err);
      }
    }
    carregarAlunos();
  }, []);

  function realizarCheckin(ev: React.FormEvent) {
    ev.preventDefault();
    setErro("");

    const termo = busca.trim().replace(/\D/g, ""); // Remove pontos e traços
    if (!termo) {
      setErro("Informe o CPF ou ID de matrícula.");
      return;
    }

    // Busca o aluno real pelo CPF limpo ou pelo ID de matrícula
    const aluno = alunos.find(
      (a) => a.cpf.replace(/\D/g, "") === termo || a.id.toString() === termo
    );

    if (!aluno) {
      setErro("Aluno não encontrado no banco de dados. Confira o CPF ou a matrícula.");
      return;
    }

    if (aluno.status !== "Ativo") {
      setErro(`Acesso bloqueado: Matrícula do aluno está com status ${aluno.status}.`);
      return;
    }

    const agora = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    
    // Adiciona ao histórico do dia
    setHistorico((prev) => [
      { id: String(Date.now()), nome: aluno.nome, hora: agora, status: "Liberado" },
      ...prev,
    ]);

    setBusca("");
    alert(`CHECK-IN REALIZADO!\n\nAluno: ${aluno.nome}\nStatus: Acesso Liberado!`);
  }

  return (
    <RequerSessao papel="admin">
      <GymLayout titulo="Check-in / Recepção" descricao="Controle de acesso à academia">
        <div className="mx-auto max-w-xl space-y-6">
          <form
            onSubmit={realizarCheckin}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4"
          >
            <div>
              <label htmlFor="busca-cpf" className="block text-sm font-semibold mb-2">
                CPF ou Matrícula
              </label>
              <div className="flex gap-2">
                <Input
                  id="busca-cpf"
                  placeholder="Digite o CPF ou ID (Ex: 99999999999 ou 2)"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="bg-background"
                />
                <Button type="submit">
                  <QrCode className="h-4 w-4 mr-2" /> Confirmar Check-in
                </Button>
              </div>
              {erro && <p className="mt-2 text-xs font-semibold text-destructive">{erro}</p>}
            </div>
          </form>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
              Check-ins de Hoje
            </h3>

            {historico.length === 0 ? (
              <p className="text-center py-6 text-sm text-muted-foreground">
                Nenhum check-in realizado hoje ainda.
              </p>
            ) : (
              <div className="divide-y divide-border">
                {historico.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{item.nome}</p>
                      <p className="text-xs text-muted-foreground">{item.hora}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-success bg-success/15 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="h-3.5 w-3.5" /> {item.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </GymLayout>
    </RequerSessao>
  );
}