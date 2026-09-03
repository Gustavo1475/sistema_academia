---

### Tarefa 4 - Desenvolvimento do Frontend (`docs/TAREFA_4_FRONTEND.md`)

```markdown
# Tarefa 4: Desenvolvimento do Frontend - GymFlow

## 1. Tecnologias do Frontend
- **React + TypeScript + Vite**: Construção de componentes modulares fortemente tipados.
- **TanStack Router**: Roteamento baseado em arquivos com layouts protegidos por nível de acesso.
- **Context API (`GymProvider`)**: Gerenciamento de estado compartilhado com persistência em `localStorage`.
- **Tailwind CSS + Lucide React**: Identidade visual escura (*dark mode*), responsiva e moderna.

## 2. Telas Desenvolvidas
1. **Tela de Autenticação (`/autenticacao`)**: Formulário com redirecionamento baseado no papel retornado pela API (`admin` ou `aluno`).
2. **Tela de Pré-Cadastro (`/cadastro`)**: Registro de dados pessoais, plano e confirmação de senha com validação visual de erros.
3. **Painel do Administrador (`/admin/alunos`, `/admin/checkin`, `/admin/treinos`)**:
   - Dashboard de métricas e CRUD de alunos com modal de edição.
   - Totem de confirmação de check-in em tempo real.
   - Montagem de fichas de treino (A, B, C) com séries, reps e cargas.
4. **Painel do Aluno (`/aluno`)**: Visualização de status da matrícula, validade e ficha de treino prescrita.

## 3. Tratamento de Hidratação (SSR vs Client)
Para eliminar incompatibilidades de *Hydration Mismatch*, o componente guard `RequerSessao` utiliza a flag reativa `hidratado`, garantindo que o primeiro ciclo de renderização no cliente seja idêntico ao HTML gerado no servidor.