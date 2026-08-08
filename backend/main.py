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