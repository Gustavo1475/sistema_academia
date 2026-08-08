import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Dumbbell, ShieldCheck, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGym } from "@/lib/gym-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GymFlow — Acesso ao sistema da academia" },
      {
        name: "description",
        content:
          "Entre no GymFlow para gerenciar alunos, fichas de treino e check-ins da sua academia.",
      },
      { property: "og:title", content: "GymFlow — Acesso ao sistema da academia" },
      {
        property: "og:description",
        content: "Gestão de alunos, fichas de treino e controle de acesso em um só painel.",
      },
    ],
  }),
  component: Login,
});

function Login() {
  const { entrar } = useGym();
  const navigate = useNavigate();
  const [papel, setPapel] = useState<"admin" | "aluno">("admin");
  const [email, setEmail] = useState("admin@gymflow.com");
  const [senha, setSenha] = useState("123456");
  const [erro, setErro] = useState("");

  function trocarPapel(novo: "admin" | "aluno") {
    setPapel(novo);
    setEmail(novo === "admin" ? "admin@gymflow.com" : "aluno@gymflow.com");
    setErro("");
  }

  function submeter(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !senha.trim()) {
      setErro("Informe e-mail e senha para continuar.");
      return;
    }
    entrar(papel);
    navigate({ to: papel === "admin" ? "/admin/alunos" : "/aluno" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm">
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
          className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-lg"
        >
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-secondary p-1">
            <button
              type="button"
              onClick={() => trocarPapel("admin")}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                papel === "admin"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ShieldCheck className="h-4 w-4" /> Admin
            </button>
            <button
              type="button"
              onClick={() => trocarPapel("aluno")}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                papel === "aluno"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="h-4 w-4" /> Aluno
            </button>
          </div>

          <div className="mt-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@gymflow.com"
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
            {erro ? <p className="text-sm text-destructive">{erro}</p> : null}
            <Button type="submit" className="w-full">
              <LogIn className="h-4 w-4" /> Entrar
            </Button>
          </div>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Demonstração: admin@gymflow.com ou aluno@gymflow.com — qualquer senha.
        </p>
      </div>
    </div>
  );
}
