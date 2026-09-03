# Tarefa 2: Design Técnico e Arquitetura - GymFlow

## 1. Escopo e Mapeamento de Usuários
- **Recepcionista / Administrador (Admin)**: Gestão de cadastros de alunos, planos de assinatura (Mensal, Trimestral, Anual), matrículas e autorização presencial de entrada.
- **Aluno (Usuário)**: Consulta de status de matrícula, visualização das rotinas de treino (A, B, C) e conferência de histórico de check-ins.

## 2. Visão Geral da Arquitetura
O sistema segue o modelo cliente-servidor desacoplado via API RESTful:
- **Frontend**: Single Page Application (SPA) construída com React, TypeScript, Vite e Tailwind CSS.
- **Backend**: API RESTful de alta performance desenvolvida com Python e FastAPI.
- **Camada de Dados**: Persistência relacional com SQLite gerenciada via SQLModel (unindo SQLAlchemy e Pydantic).

```text
sistema_academia/
├── backend/       # API FastAPI, Schemas Pydantic, Modelos ORM e SQLite
├── frontend/      # SPA React, TanStack Router, Tailwind CSS e Context Store
├── docs/          # Documentação técnica e entregas das etapas
└── .github/       # Workflows de CI/CD (GitHub Actions)