---

### Tarefa 3 - Desenvolvimento do Backend (`docs/TAREFA_3_BACKEND.md`)

```markdown
# Tarefa 3: Desenvolvimento do Backend - GymFlow

## 1. Tecnologias do Backend
- **Python 3.11+ / FastAPI**: Roteamento rápido, validação de tipos em tempo de execução e geração automática de documentação Swagger.
- **SQLModel**: Mapeamento objeto-relacional nativo integrando Pydantic e SQLAlchemy.
- **pwdlib / Bcrypt**: Hashing unidirecional seguro de senhas.
- **SQLite**: Banco de dados relacional integrado.

## 2. Modelo de Dados Relacional
O banco de dados contempla as seguintes entidades:
- **Aluno**: `id`, `nome`, `cpf` (único), `email` (único), `senha_hash`, `data_nascimento`, `plano` (Enum), `status` (Enum).
- **Checkin**: `id`, `aluno_id` (FK), `data_hora`, `liberado` (Boolean).
- **Treino**: `id`, `aluno_id` (FK), `identificador` (A, B, C), `grupo_muscular`.
- **Exercicio**: `id`, `treino_id` (FK), `nome`, `series`, `repeticoes`, `carga_kg`, `descanso_segundos`.

## 3. Validação e Tratamento de Exceções
- Tratamento explícito de duplicações de CPF e E-mail retornando `400 Bad Request`.
- Validação de complexidade de credenciais (mínimo de 6 dígitos).
- Erros de credenciais inválidas tratados com `401 Unauthorized`.
- Validação automática de Schemas via Pydantic (`422 Unprocessable Entity`).

## 4. Testes Automatizados da API (Pytest)
Implementação de testes de integração com `TestClient`:
```python
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_deve_retornar_lista_de_alunos_com_sucesso():
    response = client.get("/api/v1/alunos")
    assert response.status_code == 200
    assert isinstance(response.json(), list)