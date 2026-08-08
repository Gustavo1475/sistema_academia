# GymFlow Studio

Crie a interface de uma aplicação web completa de Gestão de Academia chamada "GymFlow".

 O sistema deve ser criado com linguagens html, css e js integradas

A aplicação deve ser moderna, limpa, responsiva, com tema escuro (Dark Mode profissional com tons de cinza escuro, preto e detalhes em verde esmeralda ou laranja neon) e conter navegação lateral (Sidebar) para alternar entre as 3 telas principais:

1. DASHBOARD / GESTÃO DE ALUNOS:

   - Resumo no topo com 3 cards de métricas (Total de Alunos, Alunos Ativos, Check-ins Hoje).

   - Tabela com lista de alunos contendo: Nome, CPF, E-mail, Plano (Mensal/Trimestral/Anual), Status (Badge verde "Ativo" ou vermelho "Inativo") e Botões de ação (Editar, Inativar).

   - Botão "+ Novo Aluno" que abre um Modal com formulário contendo os campos: Nome Completo, CPF, E-mail, Data de Nascimento e Escolha de Plano. Incluir validações visuais simples.

2. FICHAS DE TREINO (Visão do Instrutor / Aluno):

   - Seletor para escolher o Aluno.

   - Formulário para o instrutor adicionar novos exercícios (Nome do Exercício, Grupo Muscular, Séries, Repetições, Carga em kg e Descanso).

   - Exibição da ficha de treino atual dividida em abas (Treino A: Peito/Tríceps, Treino B: Costas/Bíceps, Treino C: Pernas/Ombros) usando Cards bem organizados com ícones.

3. CHECK-IN / CONTROLE DE ACESSO (Recepção):

   - Campo grande de busca por CPF ou Matrícula/ID do aluno.

   - Botão de "Confirmar Check-in".

   - Área de resultado exibindo a foto/avatar do aluno, status do plano (se está com o pagamento em dia) e uma mensagem grande em verde ("ACESSO LIBERADO") ou em vermelho ("MATRÍCULA VENCIDA").

4. LOGIN DE ADMINISTRADOR/ALUNO

   - Sistema de autenticação separando aluno do administrador

   - No perfil do aluno poderá consultar a validade do seu plano e treinos relacionados

   - O administrador verifica o painel da quantidade de alunos, CRUD para gerenciar os alunos

Utilize componentes visuais modernos (cards com sombras suaves, botões bem definidos, badges de status, inputs limpos e ícones da biblioteca Lucide React). O código deve ser em React funcional estruturado de forma limpa.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7471fc47-b5e1-45af-a056-eee6fb6d827e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
