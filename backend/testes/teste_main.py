from fastapi.testclient import TestClient
from main import app

# Instancia o cliente de teste nativo do FastAPI
client = TestClient(app)

def test_listar_alunos_deve_retornar_200_e_lista():
    """Valida se a rota de listagem de alunos está ativa e responde com JSON válido."""
    response = client.get("/api/v1/alunos")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_autenticacao_com_credenciais_invalidas():
    """Valida se o endpoint de login recusa credenciais incorretas com erro 400 ou 401."""
    payload = {
        "email": "usuario_inexistente@gymflow.com",
        "senha": "senhaerrada123"
    }
    response = client.post("/api/v1/autenticacao", json=payload)
    # Deve rejeitar a autenticação
    assert response.status_code in [400, 401, 404]

def test_checkin_com_formato_invalido():
    """Valida se o endpoint de check-in trata dados ausentes ou mal formatados."""
    payload = {}  # Vazio
    response = client.post("/api/v1/checkin", json=payload)
    # Erro de validação do Pydantic (422) ou requisição inválida (400)
    assert response.status_code in [400, 422]