from typing import Optional
from datetime import date
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from database import criar_banco_e_tabelas, get_session
from models import Aluno, PlanoEnum, StatusAluno
from datetime import datetime, date

app = FastAPI(title="GymFlow API")

# --- CONFIGURAÇÃO DE CORS (Liberando localhost:8080 e localhost:5173) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    criar_banco_e_tabelas()

@app.get("/")
def home():
    return {"message": "API do GymFlow e Banco de Dados rodando com sucesso!"}

@app.get("/api/v1/alunos")
def listar_alunos(session: Session = Depends(get_session)):
    alunos = session.exec(select(Aluno)).all()
    return alunos

@app.post("/api/v1/alunos", response_model=Aluno)
def criar_aluno(aluno: Aluno, session: Session = Depends(get_session)):
    try:
        # Se data_nascimento veio como string, converte para objeto date do Python
        if isinstance(aluno.data_nascimento, str) and aluno.data_nascimento:
            aluno.data_nascimento = datetime.strptime(aluno.data_nascimento, "%Y-%m-%d").date()

        session.add(aluno)
        session.commit()
        session.refresh(aluno)
        return aluno
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=400, detail=f"Erro ao salvar aluno: {str(e)}")


@app.put("/api/v1/alunos/{aluno_id}", response_model=Aluno)
def atualizar_aluno(aluno_id: int, dados: Aluno, session: Session = Depends(get_session)):
    aluno_banco = session.get(Aluno, aluno_id)
    if not aluno_banco:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    
    # Atualiza os dados
    aluno_banco.nome = dados.nome
    aluno_banco.cpf = dados.cpf
    aluno_banco.email = dados.email
    aluno_banco.plano = dados.plano
    aluno_banco.status = dados.status
    
    if isinstance(dados.data_nascimento, str) and dados.data_nascimento:
        aluno_banco.data_nascimento = datetime.strptime(dados.data_nascimento, "%Y-%m-%d").date()
    elif dados.data_nascimento:
        aluno_banco.data_nascimento = dados.data_nascimento

    session.add(aluno_banco)
    session.commit()
    session.refresh(aluno_banco)
    return aluno_banco

# Adicione no final do backend/main.py

@app.delete("/api/v1/alunos/{aluno_id}")
def deletar_aluno(aluno_id: int, session: Session = Depends(get_session)):
    aluno = session.get(Aluno, aluno_id)
    if not aluno:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    
    session.delete(aluno)
    session.commit()
    return {"message": f"Aluno ID #{aluno_id} removido com sucesso"}