import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Dumbbell, LayoutDashboard, ClipboardList, ScanLine, LogOut, User } from "lucide-react";
import type { ReactNode } from "react";
import { useGym } from "@/lib/gym-store";
import { Button } from "@/components/ui/button";

const linksAdmin = [
  { to: "/admin/alunos", label: "Alunos", icon: LayoutDashboard },
  { to: "/admin/treinos", label: "Fichas de Treino", icon: ClipboardList },
  { to: "/admin/checkin", label: "Check-in", icon: ScanLine },
];

const linksAluno = [{ to: "/aluno", label: "Meu Painel", icon: User }];

export function GymLayout({
  titulo,
  descricao,
  children,
}: {
  titulo: string;
  descricao?: string;
  children: ReactNode;
}) {
  const { sessao, sair } = useGym();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const links = sessao?.papel === "aluno" ? linksAluno : linksAdmin;

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-sidebar p-5 md:flex">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Dumbbell className="h-5 w-5" />
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            Gym<span className="text-primary">Flow</span>
          </span>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {links.map((l) => {
            const ativo = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  ativo
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <l.icon className="h-4 w-4 shrink-0" />
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="rounded-xl border border-border bg-card p-3">
          <p className="truncate text-sm font-semibold">{sessao?.nome ?? "Visitante"}</p>
          <p className="text-xs text-muted-foreground">
            {sessao?.papel === "admin" ? "Administrador" : "Aluno"}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 w-full"
            onClick={() => {
              sair();
              navigate({ to: "/" });
            }}
          >
            <LogOut className="h-4 w-4" /> Sair
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border px-5 py-5 sm:px-8">
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold sm:text-2xl">{titulo}</h1>
            {descricao ? (
              <p className="mt-1 truncate text-sm text-muted-foreground">{descricao}</p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-2 md:hidden">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`grid h-9 w-9 place-items-center rounded-lg ${
                  pathname === l.to ? "bg-primary/15 text-primary" : "text-muted-foreground"
                }`}
                aria-label={l.label}
              >
                <l.icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </header>
        <main className="min-w-0 flex-1 px-5 py-6 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
