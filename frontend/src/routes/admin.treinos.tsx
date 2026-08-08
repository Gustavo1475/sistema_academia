import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Dumbbell, Plus, Trash2, Timer, Repeat, Weight, Layers } from "lucide-react";
import { GymLayout } from "@/components/GymLayout";
import { RequerSessao } from "@/components/RequerSessao";
import { FichaTreino } from "@/components/FichaTreino";
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
import { useGym } from "@/lib/gym-store";
import { GRUPOS, type TreinoLetra } from "@/lib/gym-data";

export const Route = createFileRoute("/admin/treinos")({
  head: () => ({
    meta: [
      { title: "Fichas de Treino — GymFlow" },
      {
        name: "description",
        content:
          "Monte fichas de treino A, B e C por aluno com séries, repetições, carga e descanso.",
      },
      { property: "og:title", content: "Fichas de Treino — GymFlow" },
      {
        property: "og:description",
        content: "Prescrição de exercícios por grupo muscular direto no painel do instrutor.",
      },
    ],
  }),
  component: PaginaTreinos,
});

const formVazio = {
  nome: "",
  grupo: "Peito",
  series: "3",
  repeticoes: "12",
  carga: "20",
  descanso: "60s",
  treino: "A" as TreinoLetra,
};

function PaginaTreinos() {
  const { alunos, adicionarExercicio, removerExercicio } = useGym();
  const [alunoId, setAlunoId] = useState(alunos[0]?.id ?? "");
  const [form, setForm] = useState(formVazio);
  const [erro, setErro] = useState("");

  function submeter(e: React.FormEvent) {
    e.preventDefault();
    if (!alunoId) return setErro("Selecione um aluno.");
    if (form.nome.trim().length < 3) return setErro("Informe o nome do exercício.");
    setErro("");
    adicionarExercicio({
      id: `e${Date.now()}`,
      alunoId,
      treino: form.treino,
      nome: form.nome.trim(),
      grupo: form.grupo,
      series: Number(form.series) || 1,
      repeticoes: form.repeticoes || "10",
      carga: Number(form.carga) || 0,
      descanso: form.descanso || "60s",
    });
    setForm({ ...formVazio, treino: form.treino, grupo: form.grupo });
  }

  return (
    <RequerSessao papel="admin">
      <GymLayout titulo="Fichas de Treino" descricao="Prescrição de exercícios por aluno">
        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="space-y-2">
              <Label>Aluno</Label>
              <Select value={alunoId} onValueChange={setAlunoId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o aluno" />
                </SelectTrigger>
                <SelectContent>
                  {alunos.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <form onSubmit={submeter} className="mt-6 space-y-4 border-t border-border pt-5">
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                <Plus className="h-4 w-4 text-primary" /> Novo exercício
              </h2>
              <div className="space-y-2">
                <Label htmlFor="ex-nome">Nome do exercício</Label>
                <Input
                  id="ex-nome"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  placeholder="Supino inclinado"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Grupo muscular</Label>
                  <Select value={form.grupo} onValueChange={(v) => setForm({ ...form, grupo: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GRUPOS.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Treino</Label>
                  <Select
                    value={form.treino}
                    onValueChange={(v) => setForm({ ...form, treino: v as TreinoLetra })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Treino A</SelectItem>
                      <SelectItem value="B">Treino B</SelectItem>
                      <SelectItem value="C">Treino C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ex-series">
                    <Layers className="h-3.5 w-3.5" /> Séries
                  </Label>
                  <Input
                    id="ex-series"
                    type="number"
                    min={1}
                    value={form.series}
                    onChange={(e) => setForm({ ...form, series: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ex-reps">
                    <Repeat className="h-3.5 w-3.5" /> Repetições
                  </Label>
                  <Input
                    id="ex-reps"
                    value={form.repeticoes}
                    onChange={(e) => setForm({ ...form, repeticoes: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ex-carga">
                    <Weight className="h-3.5 w-3.5" /> Carga (kg)
                  </Label>
                  <Input
                    id="ex-carga"
                    type="number"
                    min={0}
                    value={form.carga}
                    onChange={(e) => setForm({ ...form, carga: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ex-descanso">
                    <Timer className="h-3.5 w-3.5" /> Descanso
                  </Label>
                  <Input
                    id="ex-descanso"
                    value={form.descanso}
                    onChange={(e) => setForm({ ...form, descanso: e.target.value })}
                  />
                </div>
              </div>
              {erro ? <p className="text-xs text-destructive">{erro}</p> : null}
              <Button type="submit" className="w-full">
                <Dumbbell className="h-4 w-4" /> Adicionar à ficha
              </Button>
            </form>
          </div>

          <FichaTreino
            alunoId={alunoId}
            acao={(id) => (
              <Button variant="ghost" size="icon" onClick={() => removerExercicio(id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          />
        </div>
      </GymLayout>
    </RequerSessao>
  );
}
