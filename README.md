# 🏋️‍♂️ GymFlow — Sistema de Gestão de Academias

O **GymFlow** é uma solução **Full-Stack** para gerenciamento de academias e alunos, desenvolvida com uma arquitetura desacoplada (**Client-Server**), **API REST** e persistência de dados em banco de dados relacional.

> 📚 **Documentação:** A documentação técnica detalhada, incluindo o mapeamento de usuários, diagramas, casos de uso e contratos da API, pode ser acessada no [Documento Oficial do Projeto (Google Docs)](https://docs.google.com/document/d/1BIHaE8xcrd_urtJv3H12z04mPflQdOO9nVEA5MpTJvY/edit?tab=t.0#heading=h.btaqsg8we4xd).

---

## 🛠️ Tecnologias Utilizadas

### Backend

- **Python 3.11+** com **FastAPI** (alta performance e documentação OpenAPI nativa).
- **SQLModel** (ORM combinando SQLAlchemy e Pydantic para validação e tipagem rigorosa).
- **SQLite** (banco relacional local para persistência de dados).
- **pwdlib / Bcrypt** (hashing unidirecional e seguro de senhas).
- **Uvicorn** (servidor ASGI).

### Frontend

- **React** com **TypeScript** e **Vite** (Single Page Application rápida e fortemente tipada).
- **TanStack Router** (gerenciamento de rotas e layout baseado em arquivos/árvore).
- **Tailwind CSS** + **Lucide React** (interface responsiva e moderna).

---

## 🚀 Como Executar o Projeto

Para executar a aplicação completa localmente, é necessário iniciar o **Backend** e o **Frontend** simultaneamente em dois terminais separados.

### 1. Clonar o Repositório

Primeiro, clone o projeto para sua máquina local:

```bash
git clone [https://github.com/Gustavo1475/sistema_academia.git](https://github.com/Gustavo1475/sistema_academia.git)
cd sistema_academia
```

> **Observação:** Substitua `SEU_USUARIO` pelo seu nome de usuário do GitHub.

---

### 2. 🐍 Executando o Backend

O backend utiliza **Python**, **FastAPI**, **SQLModel** e **Uvicorn**.

#### 2.1. Acessar a pasta do backend

```bash
cd backend
```

#### 2.2. Criar o ambiente virtual

```bash
python -m venv .venv
```

#### 2.3. Ativar o ambiente virtual

**Windows PowerShell:**

```powershell
.\.venv\Scripts\Activate.ps1
```

**Windows CMD:**

```cmd
.venv\Scripts\activate
```

#### 2.4. Instalar as dependências

```bash
pip install fastapi uvicorn sqlmodel
```

#### 2.5. Iniciar o servidor

```bash
uvicorn main:app --reload
```

Após iniciar, o backend estará disponível em:

* 🟢 **API:** http://127.0.0.1:8000
* 📄 **Swagger UI:** http://127.0.0.1:8000/docs
* 📚 **ReDoc:** http://127.0.0.1:8000/redoc

---

### 3. ⚛️ Executando o Frontend

Abra **um novo terminal**, mantendo o backend em execução.

#### 3.1. Acessar a pasta do frontend

```bash
cd frontend
```

#### 3.2. Instalar as dependências

Execute este comando apenas na primeira configuração do projeto ou quando as dependências forem alteradas:

```bash
npm install
```

#### 3.3. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

O Vite disponibilizará o frontend em um endereço semelhante a:

```text
http://localhost:5173
```

> ℹ️ **Observação:** A porta pode variar conforme a configuração do Vite. O endereço correto será exibido no terminal após a execução de `npm run dev`.

---

## 📌 Funcionalidades Principais

* [x] **Gestão completa de alunos (CRUD):** cadastrar, listar, editar e excluir alunos, com persistência no banco de dados SQLite (`gymflow.db`).
* [x] **Controle de acesso / Check-in:** busca de alunos por CPF ou ID de matrícula, com verificação do status do plano para liberação de acesso.
* [x] **Fichas de treino:** seleção dinâmica de alunos cadastrados para montagem, acompanhamento e remoção de exercícios nas fichas A, B e C.
* [x] **Persistência de sessão e papéis:** controle de autenticação e papéis de acesso, como Administrador e Aluno, mantidos por meio do `localStorage`.

---

## 📐 Estrutura da Tabela `Aluno`

| Campo             | Tipo      | Restrições / Descrição                           |
| ----------------- | --------- | ------------------------------------------------ |
| `id`              | `INTEGER` | Chave primária sintética com autoincremento      |
| `nome`            | `VARCHAR` | Nome completo do aluno                           |
| `cpf`             | `VARCHAR` | CPF do aluno (`unique=True`, `index=True`)       |
| `email`           | `VARCHAR` | E-mail para contato                              |
| `data_nascimento` | `DATE`    | Data de nascimento no formato `YYYY-MM-DD`       |
| `plano`           | `VARCHAR` | Modalidade do plano: Mensal, Trimestral ou Anual |
| `status`          | `VARCHAR` | Situação do aluno: Ativo, Inativo ou Pendente    |

---

## 💡 Fluxo de Negócio e Arquitetura

### Arquitetura Client-Server

O frontend desenvolvido em **React** opera de forma independente do backend e se comunica com a API Python por meio de requisições HTTP REST.

São utilizadas operações como:

* `GET` — consulta de dados;
* `POST` — criação de registros;
* `PUT` — atualização de registros;
* `DELETE` — exclusão de registros.

Os dados são enviados e recebidos utilizando o formato **JSON**.

### CORS

O backend possui configuração de **CORS (Cross-Origin Resource Sharing)** para permitir a comunicação entre o frontend e a API durante a execução da aplicação.

### Validação de Negócio no Check-in

Durante o processo de check-in, o sistema verifica os dados do aluno e seu status cadastral.

Alunos com cadastro **inativo** ou situação incompatível com as regras de acesso são impedidos de realizar o check-in.

---

## 📁 Estrutura Geral do Projeto

A estrutura esperada do projeto é semelhante à seguinte:

```text
sistema_academia/
├── backend/
│   ├── main.py              # API FastAPI, Schemas, Rotas e Modelos ORM
│   ├── gymflow.db           # Banco de dados SQLite persistente
│   └── requirements.txt     # Dependências Python
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes compartilhados e guards (RequerSessao)
│   │   ├── lib/             # Context API e Store de dados (gym-store.tsx)
│   │   └── routes/          # Telas (Admin, Aluno, Check-in, Cadastro, Login)
│   ├── package.json         # Dependências do ecossistema Node/React
│   └── vite.config.ts       # Configuração de build e plugins
├── docs/                    # Documentação técnica e modelagem
└── .github/workflows/       # Pipelines de CI/CD
```

> ⚠️ **Importante:** A pasta `node_modules/` e o ambiente virtual `.venv/` não devem ser versionados no Git. Recomenda-se adicioná-los ao `.gitignore`.

---

## 🔐 Variáveis de Ambiente e Dados Sensíveis

Não envie para o GitHub informações sensíveis, como:

* Senhas;
* Tokens de autenticação;
* Chaves de API;
* Credenciais de banco de dados;
* Arquivos `.env` contendo informações privadas.

Caso o projeto utilize variáveis de ambiente, mantenha um arquivo `.env.example` contendo apenas os nomes das variáveis necessárias, sem valores reais.

---

## 🧪 Verificação da Aplicação

Após iniciar o backend e o frontend:

1. Acesse o endereço exibido pelo Vite no terminal.
2. Verifique se a interface do GymFlow foi carregada corretamente.
3. Confirme se o frontend consegue se comunicar com a API.
4. Acesse a documentação Swagger em `http://127.0.0.1:8000/docs`.
5. Teste as principais operações de cadastro, edição, consulta e exclusão de alunos.
6. Teste o processo de check-in e a validação do status do aluno.

---

## 📚 Documentação do Projeto

A documentação técnica completa contém informações adicionais sobre:

* Mapeamento de usuários;
* Requisitos do sistema;
* Casos de uso;
* Arquitetura;
* Contratos da API;
* Regras de negócio.

📄 **Documento Oficial do Projeto:**
[Google Docs](https://docs.google.com/document/d/1UMbYm9IuDMg-JfmI-dK98ihlaXjQsHU-sXgMyeshqtA/edit?tab=t.0)

---

## 👥 Autores

Desenvolvido como projeto prático para a disciplina de **Tecnologia em Sistemas para Internet** do **Instituto Federal de Brasília (IFB)**.

---

## 📄 Licença

Este projeto foi desenvolvido para fins **acadêmicos e educacionais**.



---

### 📤 Para subir para o GitHub:

No terminal da raiz do seu projeto, basta executar:

```powershell
git add README.md
git commit -m "docs: adiciona README com instrucoes completas de execucao e arquitetura"
git push origin main

