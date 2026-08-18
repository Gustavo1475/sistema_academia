import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Dumbbell, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGym } from "@/lib/gym-store";

export const Route = createFileRoute("/autenticacao")({
  component: Login,
});

function Login() {
  const { entrar } = useGym();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  function submeter(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !senha.trim()) {
      setErro("Informe e-mail e senha para continuar.");
      return;
    }

    // Chama a nova lógica que descobre se é admin ou aluno pelo e-mail
    entrar(email);

    const eAdmin = email.toLowerCase().includes("admin");
    navigate({ to: eAdmin ? "/admin/alunos" : "/aluno" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao site
        </Link>
        <div className="flex items-center justify-center gap-2">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Dumbbell className="h-6 w-6" />
          </span>
          <span className="text-2xl font-extrabold tracking-tight">
            Gym<span className="text-primary">Flow</span>
          </span>
        </div>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          Gestão completa da sua academia
        </p>

        <form
          onSubmit={submeter}
          className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-lg space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@exemplo.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••"
            />
          </div>

          {erro ? <p className="text-xs font-semibold text-destructive">{erro}</p> : null}

          <Button type="submit" className="w-full">
            <LogIn className="h-4 w-4 mr-2" /> Entrar
          </Button>

          <div className="pt-4 border-t border-border text-center">
            <p className="text-xs text-muted-foreground mb-2">Ainda não tem uma conta?</p>
            <Link to="/cadastro">
              <Button type="button" variant="outline" className="w-full">
                <UserPlus className="h-4 w-4 mr-2" /> Criar Conta de Aluno
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}