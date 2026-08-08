export type Plano = "Mensal" | "Trimestral" | "Anual";
export type StatusAluno = "Ativo" | "Inativo";

export type Aluno = {
  id: string;
  matricula: string;
  nome: string;
  cpf: string;
  email: string;
  nascimento: string;
  plano: Plano;
  status: StatusAluno;
  validade: string; // ISO date
};

export type TreinoLetra = "A" | "B" | "C";

export type Exercicio = {
  id: string;
  alunoId: string;
  treino: TreinoLetra;
  nome: string;
  grupo: string;
  series: number;
  repeticoes: string;
  carga: number;
  descanso: string;
};

export type CheckIn = {
  id: string;
  alunoId: string;
  hora: string;
  liberado: boolean;
};

export const TREINOS: { letra: TreinoLetra; titulo: string }[] = [
  { letra: "A", titulo: "Treino A — Peito / Tríceps" },
  { letra: "B", titulo: "Treino B — Costas / Bíceps" },
  { letra: "C", titulo: "Treino C — Pernas / Ombros" },
];

export const GRUPOS = [
  "Peito",
  "Tríceps",
  "Costas",
  "Bíceps",
  "Pernas",
  "Ombros",
  "Abdômen",
  "Cardio",
];

export const alunosIniciais: Aluno[] = [
  {
    id: "1",
    matricula: "GF-1001",
    nome: "Marina Alves",
    cpf: "123.456.789-00",
    email: "marina.alves@email.com",
    nascimento: "1994-03-12",
    plano: "Anual",
    status: "Ativo",
    validade: "2027-02-28",
  },
  {
    id: "2",
    matricula: "GF-1002",
    nome: "Rafael Nogueira",
    cpf: "987.654.321-00",
    email: "rafael.nog@email.com",
    nascimento: "1989-11-02",
    plano: "Mensal",
    status: "Ativo",
    validade: "2026-09-05",
  },
  {
    id: "3",
    matricula: "GF-1003",
    nome: "Camila Torres",
    cpf: "456.789.123-00",
    email: "camila.torres@email.com",
    nascimento: "1998-07-24",
    plano: "Trimestral",
    status: "Inativo",
    validade: "2026-05-18",
  },
  {
    id: "4",
    matricula: "GF-1004",
    nome: "Bruno Carvalho",
    cpf: "321.654.987-00",
    email: "bruno.carv@email.com",
    nascimento: "1992-01-30",
    plano: "Anual",
    status: "Ativo",
    validade: "2026-12-10",
  },
  {
    id: "5",
    matricula: "GF-1005",
    nome: "Letícia Prado",
    cpf: "159.753.486-00",
    email: "leticia.prado@email.com",
    nascimento: "2000-09-16",
    plano: "Mensal",
    status: "Inativo",
    validade: "2026-06-01",
  },
];

export const exerciciosIniciais: Exercicio[] = [
  {
    id: "e1",
    alunoId: "1",
    treino: "A",
    nome: "Supino reto",
    grupo: "Peito",
    series: 4,
    repeticoes: "10",
    carga: 40,
    descanso: "60s",
  },
  {
    id: "e2",
    alunoId: "1",
    treino: "A",
    nome: "Tríceps corda",
    grupo: "Tríceps",
    series: 3,
    repeticoes: "12",
    carga: 25,
    descanso: "45s",
  },
  {
    id: "e3",
    alunoId: "1",
    treino: "B",
    nome: "Puxada frontal",
    grupo: "Costas",
    series: 4,
    repeticoes: "10",
    carga: 50,
    descanso: "60s",
  },
  {
    id: "e4",
    alunoId: "1",
    treino: "C",
    nome: "Agachamento livre",
    grupo: "Pernas",
    series: 4,
    repeticoes: "8",
    carga: 60,
    descanso: "90s",
  },
  {
    id: "e5",
    alunoId: "2",
    treino: "A",
    nome: "Crucifixo halteres",
    grupo: "Peito",
    series: 3,
    repeticoes: "12",
    carga: 14,
    descanso: "45s",
  },
  {
    id: "e6",
    alunoId: "2",
    treino: "C",
    nome: "Desenvolvimento militar",
    grupo: "Ombros",
    series: 4,
    repeticoes: "10",
    carga: 30,
    descanso: "60s",
  },
];

export const checkInsIniciais: CheckIn[] = [
  { id: "c1", alunoId: "1", hora: "07:12", liberado: true },
  { id: "c2", alunoId: "2", hora: "08:45", liberado: true },
  { id: "c3", alunoId: "4", hora: "09:30", liberado: true },
];

export function iniciais(nome: string) {
  return nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function formatarData(iso: string) {
  const [a, m, d] = iso.split("-");
  if (!a || !m || !d) return iso;
  return `${d}/${m}/${a}`;
}

export function diasRestantes(iso: string) {
  const alvo = new Date(`${iso}T00:00:00`).getTime();
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return Math.round((alvo - hoje.getTime()) / 86400000);
}
