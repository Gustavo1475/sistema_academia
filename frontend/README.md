# 🏋️‍♂️ GymFlow Studio — Sistema de Gestão de Academia

O **GymFlow Studio** é uma aplicação web completa para gestão de academias, integrando controle de alunos, criação e consulta de fichas de treino, validação de check-ins e autenticação com permissões distintas para **Administradores** e **Alunos**.

Este projeto faz parte da disciplina de Desenvolvimento Web e DevOps do **Instituto Federal de Brasília (IFB)**.

---

## 🎨 Interface e Experiência (Frontend)
A interface foi prototipada e construída em **React (TypeScript)** com **Tailwind CSS**, apresentando um visual moderno em *Dark Mode* com tons de cinza escuro e destaques em laranja neon.

### 📱 Módulos Principais:
* **Dashboard / Gestão de Alunos:** Cards com métricas em tempo real (Total de Alunos, Ativos, Check-ins), tabela de gerenciamento com suporte a ordenação/filtro e modal para cadastro/edição (CRUD).
* **Fichas de Treino:** Interface para instrutores criarem rotinas organizadas em abas (Treino A, B e C) com séries, repetições, carga e tempo de descanso.
* **Recepção & Check-in:** Sistema de controle de acesso rápido por CPF ou Matrícula com validação imediata do status da assinatura.
* **Autenticação Multi-perfil:** Acesso condicional diferenciando visões administrativas (gestão/CRUD) de visões de aluno (consulta de plano e treinos).

---

## 🛠️ Tech Stack (Tecnologias Utilizadas)

### **Frontend**
* **Framework:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
* **Linguagem:** TypeScript
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
* **Componentes & Ícones:** Shadcn/UI & Lucide React

### **Backend**
* **Linguagem:** Python 3.11+
* **Framework API:** [FastAPI](https://fastapi.tiangolo.com/) (ou Flask)
* **Validação de Dados:** Pydantic
* **Banco de Dados:** PostgreSQL / SQLite
* **Documentação de Rotas:** Swagger UI / OpenAPI (Gerada automaticamente em `/docs`)

### **DevOps & Infraestrutura**
* **Conteinerização:** Docker & Docker Compose
* **Versionamento & CI/CD:** Git, GitHub & GitHub Actions / GitLab CI

---

## 📂 Estrutura do Repositório

```text
sistema_academia/
├── backend/              # API REST em Python (FastAPI/Flask)
│   ├── app/              # Regras de negócio, rotas e modelos de dados
│   ├── requirements.txt  # Dependências do Python
│   └── Dockerfile        # Container do Backend
│
├── frontend/             # Interface do usuário (React/Vite/Tailwind)
│   ├── src/              # Componentes, rotas e estilos
│   ├── package.json      # Dependências do Node.js
│   └── Dockerfile        # Container do Frontend
│
├── docs/                 # Documentação técnica e contratos de API
└── docker-compose.yml    # Orquestração local do ambiente
