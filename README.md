# 🏋️‍♂️ GymFlow — Sistema de Gestão de Academias

O **GymFlow** é uma solução Full-Stack para gerenciamento de academias e alunos, desenvolvida com uma arquitetura desacoplada (Client-Server), API REST e persistência de dados em banco de dados relacional.

---

## 🛠️ Tecnologias Utilizadas

### **Backend**
- **Linguagem:** Python 3.11+
- **Framework Web:** [FastAPI](https://fastapi.tiangolo.com/)
- **ORM / Modelagem:** [SQLModel](https://sqlmodel.tiangolo.com/) (Pydantic + SQLAlchemy)
- **Banco de Dados:** SQLite (`gymflow.db`)
- **Servidor ASGI:** Uvicorn

### **Frontend**
- **Biblioteca/Framework:** [React](https://react.dev/) + TypeScript
- **Roteamento:** [TanStack Router](https://tanstack.com/router)
- **Estilização & UI:** Tailwind CSS + Shadcn UI
- **Ícones:** Lucide React
- **Build Tool:** Vite

---

## 🚀 Como Rodar o Projeto

Para executar a aplicação completa na sua máquina, é necessário rodar o **Backend** e o **Frontend** simultaneamente em dois terminais separados.

---

### 🐍 1. Executando o Backend (FastAPI + Python)

1. Abra o terminal e navegue até a pasta do backend:
   ```bash
   cd backend

2. Crie e ative o ambiente virtual (venv):
   python -m venv .venv
.\.venv\Scripts\Activate.ps1

3. Instale as dependências necessárias:
  pip install fastapi uvicorn sqlmodel

4. Inicie o servidor da API Python:
   uvicorn main:app --reload
   🟢 Backend rodando em: http://127.0.0.1:8000
   📄 Documentação interativa (Swagger UI): http://127.0.0.1:8000/docs

⚛️ 2. Executando o Frontend (React + Vite)
Em um novo terminal, navegue até a pasta do frontend:
Bash: cd frontend

Instale as dependências do projeto (somente se for a primeira vez):
  Bash: npm install
  
Inicie o servidor de desenvolvimento:
  Bash: npm run dev
  🌐 Frontend rodando em: http://localhost:8080 (ou http://localhost:5173)

📌 Funcionalidades Principais
[x] Gestão Completa de Alunos (CRUD): Cadastrar, listar, editar e excluir alunos salvos diretamente no banco de dados SQLite (gymflow.db).

[x] Controle de Acesso / Check-in: Busca em tempo real de alunos por CPF ou ID de Matrícula, com verificação do status do plano (Ativo vs Inativo) para liberação de acesso.

[x] Fichas de Treino: Seleção dinâmica de alunos cadastrados no banco para montagem, acompanhamento e remoção de exercícios nas fichas A, B e C.

[x] Persistência de Sessão & Papéis: Controle de autenticação e papéis de acesso (Administrador e Aluno) mantidos via localStorage.

📐 Estrutura da Tabela no Banco de Dados (aluno)
Campo	Tipo	Restrições / Descrição
id	INTEGER	Chave Primária Sintética (Autoincremento)
nome	VARCHAR	Nome completo do aluno
cpf	VARCHAR	CPF do aluno (unique=True, index=True)
email	VARCHAR	E-mail para contato
data_nascimento	DATE	Data de nascimento em formato YYYY-MM-DD
plano	VARCHAR	Modalidade do plano (Mensal, Trimestral, Anual)
status	VARCHAR	Situação do aluno (Ativo, Inativo, Pendente)
💡 Fluxo de Negócio & Arquitetura
Client-Server Desacoplado: O frontend em React opera de forma totalmente independente, comunicando-se com o backend Python através de requisições HTTP REST (GET, POST, PUT, DELETE) com payload JSON.

CORS Configurado: Permite requisições seguras entre a aplicação web (porta 8080) e o servidor FastAPI (porta 8000).

Validação de Negócio no Check-in: O sistema bloqueia a entrada de alunos inadimplentes ou com cadastros inativos.

👥 Autores
Desenvolvido como projeto prático para a disciplina de Tecnologia em Sistemas para Internet do Instituto Federal de Brasília (IFB).


---

### 📤 Para subir para o GitHub:

No terminal da raiz do seu projeto, basta executar:

```powershell
git add README.md
git commit -m "docs: adiciona README com instrucoes completas de execucao e arquitetura"
git push origin main

