# GymFlow — Sistema de Gestão de Academia (protótipo de interface)

Aplicação React (TanStack Start) com tema escuro profissional, acentos em laranja neon (#ff6b1a / #ffb35c) sobre preto e cinza-carvão, sidebar de navegação e ícones Lucide. Todos os dados são de exemplo, em memória — nada é salvo ao recarregar.

## Login (simulado)

- Tela inicial `/` com formulário de acesso e alternância entre **Administrador** e **Aluno**.
- Credenciais de demonstração exibidas na própria tela (ex.: admin@gymflow.com / aluno@gymflow.com, qualquer senha).
- Admin entra no painel completo; Aluno entra em uma área própria.
- Botão de sair na sidebar.

## Área do Administrador

**1. Dashboard / Gestão de Alunos**
- 3 cards de métricas: Total de Alunos, Alunos Ativos, Check-ins Hoje.
- Tabela de alunos: Nome, CPF, E-mail, Plano (Mensal/Trimestral/Anual), Status (badge verde "Ativo" / vermelho "Inativo") e ações Editar e Inativar.
- Botão "+ Novo Aluno" abrindo modal com Nome Completo, CPF, E-mail, Data de Nascimento e Plano, com validação visual (campos obrigatórios, formato de CPF e e-mail, mensagens em vermelho abaixo do campo).
- Editar reaproveita o mesmo modal; Inativar alterna o status na hora.

**2. Fichas de Treino**
- Seletor de aluno no topo.
- Formulário para adicionar exercício: Nome, Grupo Muscular, Séries, Repetições, Carga (kg) e Descanso.
- Abas Treino A (Peito/Tríceps), Treino B (Costas/Bíceps), Treino C (Pernas/Ombros), cada uma com cards de exercício com ícone, dados em destaque e opção de remover.

**3. Check-in / Recepção**
- Campo de busca grande por CPF ou matrícula/ID + botão "Confirmar Check-in".
- Resultado com avatar (iniciais), nome, plano, validade e mensagem grande: "ACESSO LIBERADO" em verde ou "MATRÍCULA VENCIDA" em vermelho; erro amigável quando não encontrado.
- Lista dos check-ins do dia.

## Área do Aluno

- Card do plano: tipo, data de validade, dias restantes e badge de situação.
- Ficha de treino própria em abas A/B/C, somente leitura.
- Histórico recente de check-ins.

## Detalhes técnicos

- Rotas: `/` (login), `/admin/alunos`, `/admin/treinos`, `/admin/checkin`, `/aluno`; sessão simulada em contexto React, sem backend.
- Estado compartilhado em um `GymProvider` (alunos, treinos, check-ins) com dados iniciais de exemplo.
- Tokens de cor/raio definidos em `src/styles.css` (tema escuro por padrão); sem classes de cor fixas nos componentes.
- Componentes shadcn existentes (dialog, table, tabs, badge, input, select) e ícones `lucide-react`.
- Metadados de `head()` próprios em cada rota.
