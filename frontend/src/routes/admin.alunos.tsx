import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
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

export const Route = createFileRoute("/admin/alunos")({
  head: () => ({
    meta: [
      { title: "Alunos — Painel do administrador GymFlow" },
      {
        name: "description",
        content: "Métricas da academia e cadastro completo de alunos: planos, status e edição.",
      },
    ],
  }),
  component: PaginaAlunos,
});

type Erros = Partial<Record<"nome" | "cpf" | "email" | "nascimento", string>>;

// Interface que bate exatamente com o modelo do FastAPI/SQLModel
interface AlunoAPI {
  id: number;
  nome: str;
  cpf: str;
  email: str;
  data_nascimento?: string;
  plano: string;
  status: string;
}

const vazio = {
  nome: "",
  cpf: "",
  email: "",
  nascimento: "",
  plano: "Mensal",
};

function PaginaAlunos() {
  const { checkIns } = useGym();
  
  // Estado para armazenar os alunos vindos do Banco SQLite/FastAPI
  const [alunos, setAlunos] = useState<AlunoAPI[]>([]);
  const [carregando, setCarregando] = useState(true);

  const [aberto, setAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [form, setForm] = useState(vazio);
  const [erros, setErros] = useState<Erros>({});

  // 1. Função para carregar alunos do Backend Python
  const carregarAlunos = async () => {
    try {
      setCarregando(true);
      const resposta = await fetch("http://127.0.0.1:8000/api/v1/alunos");
      if (resposta.ok) {
        const dados = await resposta.json();
        setAlunos(dados);
      }
    } catch (erro) {
      console.error("Erro ao buscar alunos do backend:", erro);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarAlunos();
  }, []);

  const ativos = useMemo(() => alunos.filter((a) => a.status === "Ativo").length, [alunos]);

  function abrirNovo() {
    setEditandoId(null);
    setForm(vazio);
    setErros({});
    setAberto(true);
  }

  function abrirEdicao(a: AlunoAPI) {
    setEditandoId(a.id);
    setForm({
      nome: a.nome,
      cpf: a.cpf,
      email: a.email,
      nascimento: a.data_nascimento || "",
      plano: a.plano,
    });
    setErros({});
    setAberto(true);
  }

  function validar(): boolean {
    const e: Erros = {};
    if (form.nome.trim().length < 3) e.nome = "Informe o nome completo (mín. 3 caracteres).";
    if (!form.cpf.trim()) e.cpf = "Informe o CPF.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "E-mail inválido.";
    setErros(e);
    return Object.keys(e).length === 0;
  }

async function submeter(ev: React.FormEvent) {
  ev.preventDefault();
  if (!validar()) return;

  // Garante que a data enviada seja validada ou enviada como null
  let dataFormatada = null;
  if (form.nascimento) {
    // Se a data vier no formato DD/MM/YYYY do campo de texto
    if (form.nascimento.includes("/")) {
      const [dia, mes, ano] = form.nascimento.split("/");
      dataFormatada = `${ano}-${mes}-${dia}`;
    } else {
      dataFormatada = form.nascimento; // Ja esta em YYYY-MM-DD do input date
    }
  }

  const payload = {
    nome: form.nome.trim(),
    cpf: form.cpf.trim(),
    email: form.email.trim(),
    data_nascimento: dataFormatada,
    plano: form.plano,
    status: "Ativo",
  };

  try {
    const resposta = await fetch("http://127.0.0.1:8000/api/v1/alunos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (resposta.ok) {
      alert("Aluno cadastrado com sucesso no SQLite!");
      setAberto(false);
      carregarAlunos(); // Atualiza a tabela na hora!
    } else {
      const erroServidor = await resposta.json();
      console.error("Erro retornado do Python:", erroServidor);
      alert("Erro do servidor: " + JSON.stringify(erroServidor.detail));
    }
  } catch (error) {
    console.error("Erro na conexao:", error);
  }
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
            <h2 className="min-w-0 truncate text-lg font-bold">Lista de alunos (Banco SQLite)</h2>
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
                {carregando ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      Buscando alunos no servidor Python...
                    </TableCell>
                  </TableRow>
                ) : alunos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      Nenhum aluno cadastrado no banco de dados.
                    </TableCell>
                  </TableRow>
                ) : (
                  alunos.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">
                        {a.nome}
                        <span className="block text-xs text-muted-foreground">ID: #{a.id}</span>
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
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Modal formulário */}
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
                  />
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
                  onValueChange={(v) => setForm({ ...form, plano: v })}
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
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAberto(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar no Banco</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </GymLayout>
    </RequerSessao>
  );
}