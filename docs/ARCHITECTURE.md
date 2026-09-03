# 📐 Arquitetura & Especificação Técnica - GymFlow

## 1. Visão Geral da Arquitetura
O GymFlow foi concebido seguindo os princípios de separação de responsabilidades e desacoplamento entre cliente e servidor:
- **Backend**: API RESTful construída com FastAPI e SQLModel, integrando tipagem com validações Pydantic e persistência no SQLite.
- **Frontend**: Single Page Application (SPA) em React com TypeScript e TanStack Router, utilizando Tailwind CSS para os componentes visuais.
- **Gerenciamento de Estado**: Camada reativa via Context API (`GymProvider`) com persistência em `localStorage` e guarda contra hydration mismatch.

---

## 2. Endpoints da API REST (FastAPI)

| Método | Endpoint | Descrição | Permissão |
|---|---|---|---|
| `POST` | `/api/v1/autenticacao` | Login unificado (retorna perfil de admin ou aluno) | Público |
| `GET` | `/api/v1/alunos` | Lista todos os alunos cadastrados no SQLite | Administrador |
| `POST` | `/api/v1/alunos` | Realiza cadastro com hash seguro de senha | Público / Admin |
| `PUT` | `/api/v1/alunos/{id}` | Atualização cadastral com validação de duplicidade | Administrador |
| `DELETE` | `/api/v1/alunos/{id}` | Remoção física do registro de aluno | Administrador |
| `POST` | `/api/v1/checkin` | Validação e registro de entrada (bloqueia inativos) | Público / Totem |
| `GET` | `/api/v1/checkin/hoje` | Histórico de presenças confirmadas no dia | Administrador |

---

## 3. Modelo Relacional de Dados

- **Aluno**: `id`, `nome`, `cpf` (único), `email` (único), `senha_hash`, `data_nascimento`, `plano`, `status`.
- **Checkin**: `id`, `aluno_id` (chave estrangeira), `data_hora`, `liberado` (booleano).
- **Treino**: `id`, `aluno_id` (chave estrangeira), `identificador` (A, B, C), `grupo_muscular`.
- **Exercicio**: `id`, `treino_id` (chave estrangeira), `nome`, `series`, `repeticoes`, `carga_kg`, `descanso_segundos`.

---

## 4. Segurança e Boas Práticas
- **Hashing de Senhas**: As senhas nunca são salvas em texto puro; são processadas com o algoritmo Bcrypt/Argon2 via biblioteca `pwdlib`.
- **Validação Semântica de HTTP**: Erros de duplicidade retornam `400 Bad Request`, credenciais inválidas geram `401 Unauthorized`, bloqueios de acesso retornam `403 Forbidden` e recursos inexistentes `404 Not Found`.
- **Isomorfismo e SSR**: Tratamento de hidratação no React com controle de flag de montagem (`hidratado`) para evitar incompatibilidades de renderização do SSR.