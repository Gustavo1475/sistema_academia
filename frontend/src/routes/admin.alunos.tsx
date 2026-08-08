import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Users, UserCheck, CalendarCheck, Plus, Pencil, Ban, CheckCircle2 } from "lucide-react";
import { GymLayout } from "@/components/GymLayout";
import { RequerSessao } from "@/components/RequerSessao";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGym } from "@/lib/gym-store";
import { formatarData, type Aluno, type Plano } from "@/lib/gym-data";

export const Route = createFileRoute("/admin/alunos")({
  head: () => ({
    meta: [
      { title: "Alunos — Painel do administrador GymFlow" },
      {
        name: "description",
        content: "Métricas da academia e cadastro completo de alunos: planos, status e edição.",
      },
      { property: "og:title", content: "Alunos — Painel do administrador GymFlow" },
      {
        property: "og:description",
        content: "Acompanhe total de alunos, ativos e check-ins do dia no GymFlow.",
      },
    ],
  }),
  component: PaginaAlunos,
});

type Erros = Partial<Record<"nome" | "cpf" | "email" | "nascimento", string>>;

const vazio = {
  nome: "",
  cpf: "",
  email: "",
  nascimento: "",
  plano: "Mensal" as Plano,
};

function PaginaAlunos() {
  const { alunos, checkIns, salvarAluno, alternarStatus } = useGym();
  const [aberto, setAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState(vazio);
  const [erros, setErros] = useState<Erros>({});

  const ativos = useMemo(() => alunos.filter((a) => a.status === "Ativo").length, [alunos]);

  function abrirNovo() {
    setEditandoId(null);
    setForm(vazio);
    setErros({});
    setAberto(true);
  }

  function abrirEdicao(a: Aluno) {
    setEditandoId(a.id);
    setForm({
      nome: a.nome,
      cpf: a.cpf,
      email: a.email,
      nascimento: a.nascimento,
      plano: a.plano,
    });
    setErros({});
    setAberto(true);
  }

  function validar(): boolean {
    const e: Erros = {};
    if (form.nome.trim().length < 3) e.nome = "Informe o nome completo (mín. 3 caracteres).";
    if (!/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(form.cpf.trim()))
      e.cpf = "CPF inválido. Use 000.000.000-00.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "E-mail inválido.";
    if (!form.nascimento) e.nascimento = "Informe a data de nascimento.";
    setErros(e);
    return Object.keys(e).length === 0;
  }

  function submeter(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validar()) return;
    const base = alunos.find((a) => a.id === editandoId);
    const id = editandoId ?? `a${Date.now()}`;
    salvarAluno({
      id,
      matricula: base?.matricula ?? `GF-${1000 + alunos.length + 1}`,
      nome: form.nome.trim(),
      cpf: form.cpf.trim(),
      email: form.email.trim(),
      nascimento: form.nascimento,
      plano: form.plano,
      status: base?.status ?? "Ativo",
      validade: base?.validade ?? "2027-01-31",
    });
    setAberto(false);
  }

  const metricas = [
    { label: "Total de Alunos", valor: alunos.length, icone: Users },
    { label: "Alunos Ativos", valor: ativos, icone: UserCheck },
    { label: "Check-ins Hoje", valor: checkIns.length, icone: CalendarCheck },
  ];

  return (
    <RequerSessao papel="admin">
      <GymLayout titulo="Dashboard de Alunos" descricao="Visão geral e gestão de matrículas">
        <div className="grid gap-4 sm:grid-cols-3">
          {metricas.map((m) => (
            <div
              key={m.label}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/40"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{m.label}</p>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
                  <m.icone className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-3 text-3xl font-extrabold">{m.valor}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-card shadow-sm">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border p-5">
            <h2 className="min-w-0 truncate text-lg font-bold">Lista de alunos</h2>
            <Button onClick={abrirNovo}>
              <Plus className="h-4 w-4" /> Novo Aluno
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alunos.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">
                      {a.nome}
                      <span className="block text-xs text-muted-foreground">{a.matricula}</span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{a.cpf}</TableCell>
                    <TableCell className="text-muted-foreground">{a.email}</TableCell>
                    <TableCell>{a.plano}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                          a.status === "Ativo"
                            ? "bg-success/15 text-success"
                            : "bg-destructive/15 text-destructive"
                        }`}
                      >
                        {a.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => abrirEdicao(a)}>
                          <Pencil className="h-3.5 w-3.5" /> Editar
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => alternarStatus(a.id)}>
                          {a.status === "Ativo" ? (
                            <>
                              <Ban className="h-3.5 w-3.5" /> Inativar
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5" /> Ativar
                            </>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <Dialog open={aberto} onOpenChange={setAberto}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editandoId ? "Editar aluno" : "Novo aluno"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={submeter} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome completo</Label>
                <Input
                  id="nome"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  aria-invalid={!!erros.nome}
                />
                {erros.nome ? <p className="text-xs text-destructive">{erros.nome}</p> : null}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    placeholder="000.000.000-00"
                    value={form.cpf}
                    onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                    aria-invalid={!!erros.cpf}
                  />
                  {erros.cpf ? <p className="text-xs text-destructive">{erros.cpf}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nascimento">Data de nascimento</Label>
                  <Input
                    id="nascimento"
                    type="date"
                    value={form.nascimento}
                    onChange={(e) => setForm({ ...form, nascimento: e.target.value })}
                    aria-invalid={!!erros.nascimento}
                  />
                  {erros.nascimento ? (
                    <p className="text-xs text-destructive">{erros.nascimento}</p>
                  ) : null}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  aria-invalid={!!erros.email}
                />
                {erros.email ? <p className="text-xs text-destructive">{erros.email}</p> : null}
              </div>
              <div className="space-y-2">
                <Label>Plano</Label>
                <Select
                  value={form.plano}
                  onValueChange={(v) => setForm({ ...form, plano: v as Plano })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mensal">Mensal</SelectItem>
                    <SelectItem value="Trimestral">Trimestral</SelectItem>
                    <SelectItem value="Anual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {editandoId ? (
                <p className="text-xs text-muted-foreground">
                  Validade atual:{" "}
                  {formatarData(alunos.find((a) => a.id === editandoId)?.validade ?? "")}
                </p>
              ) : null}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAberto(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </GymLayout>
    </RequerSessao>
  );
}
