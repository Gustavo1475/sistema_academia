import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Dumbbell, ArrowLeft, CheckCircle2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/cadastro")({
  component: PaginaCadastro,
});

function PaginaCadastro() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [plano, setPlano] = useState("Mensal");

  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  function formatarCPF(valor: string) {
    const apenasDigitos = valor.replace(/\D/g, "").slice(0, 11);
    return apenasDigitos
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  async function submeter(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (!nome.trim() || !cpf.trim() || !email.trim() || !dataNascimento) {
      setErro("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setCarregando(true);

      const novoAluno = {
        nome: nome.trim(),
        cpf: cpf.trim(),
        email: email.trim().toLowerCase(),
        data_nascimento: dataNascimento,
        plano: plano,
        status: "Inativo",
      };

      const res = await fetch("http://127.0.0.1:8000/api/v1/alunos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoAluno),
      });

      if (!res.ok) {
        const erroApi = await res.json();
        throw new Error(erroApi.detail || "Erro ao realizar o pré-cadastro.");
      }

      setSucesso(true);
    } catch (err: any) {
      setErro(err.message || "Falha na conexão com o servidor.");
    } finally {
      setCarregando(false);
    }
  }

  if (sucesso) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/20 text-success">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Pré-cadastro Concluído!</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Seus dados foram registrados com sucesso. Dirija-se à recepção para efetivar sua matrícula.
            </p>
          </div>
          <Button onClick={() => navigate({ to: "/autenticacao" })} className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" /> Ir para o Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Dumbbell className="h-6 w-6" />
          </span>
          <span className="text-2xl font-extrabold tracking-tight">
            Gym<span className="text-primary">Flow</span>
          </span>
        </div>

        <p className="mt-2 text-center text-sm text-muted-foreground">
          Faça seu pré-cadastro como aluno
        </p>

        <form
          onSubmit={submeter}
          className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo</Label>
            <Input
              id="nome"
              placeholder="Ex: Carlos Eduardo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(formatarCPF(e.target.value))}
              maxLength={14}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu.email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nascimento">Data de Nascimento</Label>
            <Input
              id="nascimento"
              type="date"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="plano">Plano Pretendido</Label>
            <Select value={plano} onValueChange={setPlano}>
              <SelectTrigger id="plano">
                <SelectValue placeholder="Selecione um plano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mensal">Mensal</SelectItem>
                <SelectItem value="Trimestral">Trimestral</SelectItem>
                <SelectItem value="Semestral">Semestral</SelectItem>
                <SelectItem value="Anual">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {erro && (
            <div className="rounded-lg bg-destructive/15 p-3 text-xs font-semibold text-destructive">
              {erro}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={carregando}>
            <UserPlus className="mr-2 h-4 w-4" />
            {carregando ? "Cadastrando..." : "Concluir Pré-cadastro"}
          </Button>

          <div className="pt-3 text-center">
            <Link to="/autenticacao" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Já tem cadastro? Entrar no sistema
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}