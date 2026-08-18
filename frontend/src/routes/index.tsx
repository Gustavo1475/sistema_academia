import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Dumbbell,
  LogIn,
  Check,
  HeartPulse,
  Bike,
  Users,
  ShowerHead,
  Clock,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";
import heroImg from "@/assets/gym-hero.jpg";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GymFlow Academia — Estrutura completa e planos a partir de R$ 89,99" },
      {
        name: "description",
        content:
          "Conheça a estrutura da GymFlow: musculação, cardio, aulas coletivas e vestiários. Planos mensal, trimestral e anual com preços transparentes.",
      },
      {
        property: "og:title",
        content: "GymFlow Academia — Estrutura completa e planos a partir de R$ 89,99",
      },
      {
        property: "og:description",
        content:
          "Musculação, cardio, aulas coletivas e avaliação física. Escolha o plano mensal, trimestral ou anual.",
      },
    ],
  }),
  component: Home,
});

const estrutura = [
  {
    icon: Dumbbell,
    titulo: "Sala de musculação",
    texto: "1.200 m² com equipamentos de força, halteres até 60 kg e área de peso livre.",
  },
  {
    icon: Bike,
    titulo: "Área de cardio",
    texto: "Esteiras, bikes, elípticos e remos com monitoramento de frequência cardíaca.",
  },
  {
    icon: Users,
    titulo: "Aulas coletivas",
    texto: "Spinning, funcional, HIIT, dança e yoga em estúdios climatizados.",
  },
  {
    icon: HeartPulse,
    titulo: "Avaliação física",
    texto: "Bioimpedância e reavaliação a cada 90 dias com prescrição de treino.",
  },
  {
    icon: ShowerHead,
    titulo: "Vestiários completos",
    texto: "Armários, duchas quentes, secadores e área de descanso.",
  },
  {
    icon: Clock,
    titulo: "Horário estendido",
    texto: "Seg a sex das 5h às 23h · sábados 8h às 18h · domingos 8h às 14h.",
  },
];

const planos = [
  {
    nome: "Mensal",
    preco: "129,90",
    periodo: "/mês",
    resumo: "Flexibilidade total, sem fidelidade.",
    destaque: false,
    itens: [
      "Acesso livre à musculação e cardio",
      "Aulas coletivas incluídas",
      "Ficha de treino digital",
      "Cancele quando quiser",
    ],
  },
  {
    nome: "Trimestral",
    preco: "329,90",
    periodo: "/3 meses",
    resumo: "Equivale a R$ 109,97 por mês — economia de 15%.",
    destaque: true,
    itens: [
      "Tudo do plano Mensal",
      "1 avaliação física por trimestre",
      "Reprogramação de treino mensal",
      "Convite para 1 amigo por mês",
    ],
  },
  {
    nome: "Anual",
    preco: "1.079,90",
    periodo: "/12 meses",
    resumo: "Equivale a R$ 89,99 por mês — economia de 30%.",
    destaque: false,
    itens: [
      "Tudo do plano Trimestral",
      "Avaliação física a cada 90 dias",
      "Acompanhamento personalizado",
      "Camiseta oficial GymFlow",
    ],
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Dumbbell className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight">
              Gym<span className="text-primary">Flow</span>
            </span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
            <a href="#estrutura" className="transition-colors hover:text-foreground">
              Estrutura
            </a>
            <a href="#planos" className="transition-colors hover:text-foreground">
              Planos
            </a>
            <a href="#contato" className="transition-colors hover:text-foreground">
              Contato
            </a>
          </nav>
          <Button asChild size="sm">
            <Link to="/autenticacao">
              <LogIn className="h-4 w-4" /> Entrar
            </Link>
          </Button>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-border">
        <img
          src={heroImg}
          alt="Interior da academia GymFlow com equipamentos de musculação e iluminação laranja"
          width={1600}
          height={900}
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="relative mx-auto max-w-6xl px-5 py-24 sm:py-32">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Matrícula grátis neste mês
          </span>
          <h1 className="mt-5 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Treine em uma estrutura de <span className="text-primary">alto padrão</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            Musculação, cardio, aulas coletivas e acompanhamento profissional. Escolha entre os
            planos mensal, trimestral e anual e comece hoje.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href="#planos">Ver planos e preços</a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#estrutura">Conhecer a estrutura</a>
            </Button>
          </div>
        </div>
      </section>

      <section id="estrutura" className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-3xl font-bold tracking-tight">Nossa estrutura</h2>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Ambiente completo, climatizado e pensado para todos os níveis de treino.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {estrutura.map((item) => (
            <article
              key={item.titulo}
              className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary">
                <item.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{item.titulo}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.texto}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="planos" className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="text-3xl font-bold tracking-tight">Planos e preços</h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Sem taxa de matrícula. Todos os planos dão acesso completo à academia.
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {planos.map((p) => (
              <article
                key={p.nome}
                className={`relative flex flex-col rounded-2xl border bg-card p-7 ${
                  p.destaque ? "border-primary shadow-lg shadow-primary/10" : "border-border"
                }`}
              >
                {p.destaque ? (
                  <span className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                    Mais escolhido
                  </span>
                ) : null}
                <h3 className="text-xl font-bold">{p.nome}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.resumo}</p>
                <p className="mt-6 flex items-end gap-1">
                  <span className="text-sm text-muted-foreground">R$</span>
                  <span className="text-4xl font-extrabold tracking-tight">{p.preco}</span>
                  <span className="pb-1 text-sm text-muted-foreground">{p.periodo}</span>
                </p>
                <ul className="mt-6 flex-1 space-y-3 text-sm">
                  {p.itens.map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-muted-foreground">{i}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="mt-7 w-full"
                  variant={p.destaque ? "default" : "outline"}
                >
                  <Link to="/autenticacao">Quero o plano {p.nome}</Link>
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contato" className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-8 rounded-2xl border border-border bg-card p-8 sm:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Venha conhecer</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Agende uma visita e ganhe um dia de treino experimental.
            </p>
            <Button asChild className="mt-6">
              <Link to="/autenticacao">
                <LogIn className="h-4 w-4" /> Área do aluno
              </Link>
            </Button>
          </div>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-primary" />
              DF
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-primary" />
              (99) 99999-9999
            </li>
            <li className="flex items-start gap-3">
              <Clock className="mt-0.5 h-4 w-4 text-primary" />
              Seg a sex 5h–23h · sáb 8h–18h · dom 8h–14h
            </li>
          </ul>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} GymFlow Academia. Todos os direitos reservados.
      </footer>
    </div>
  );
}
