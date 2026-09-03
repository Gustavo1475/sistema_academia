from datetime import date, datetime
from enum import Enum
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Field, SQLModel, Session, create_engine, select, Relationship
from pwdlib import PasswordHash

# Configuração de Hash de Senha (bcrypt)
password_hash = PasswordHash.recommended()

# --- ENUMS ---
class StatusAluno(str, Enum):
    ATIVO = "Ativo"
    INATIVO = "Inativo"

class PlanoEnum(str, Enum):
    MENSAL = "Mensal"
    TRIMESTRAL = "Trimestral"
    ANUAL = "Anual"

class AlunoUpdate(SQLModel):
    nome: Optional[str] = None
    cpf: Optional[str] = None
    email: Optional[str] = None
    data_nascimento: Optional[date] = None
    plano: Optional[PlanoEnum] = None
    status: Optional[StatusAluno] = None

# --- TABELAS / MODELOS ---
class Aluno(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nome: str
    cpf: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)
    senha_hash: str = Field(default="")
    data_nascimento: Optional[date] = None
    plano: PlanoEnum = PlanoEnum.MENSAL
    status: StatusAluno = StatusAluno.ATIVO

    # Relacionamentos
    checkins: List["Checkin"] = Relationship(back_populates="aluno")
    treinos: List["Treino"] = Relationship(back_populates="aluno")

class Checkin(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    aluno_id: int = Field(foreign_key="aluno.id")
    data_hora: datetime = Field(default_factory=datetime.utcnow)
    liberado: bool = True

    aluno: Optional[Aluno] = Relationship(back_populates="checkins")

class Treino(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    aluno_id: int = Field(foreign_key="aluno.id")
    identificador: str = "A"  # Treino A, B ou C
    grupo_muscular: str      # Ex: "Peito / Tríceps"

    aluno: Optional[Aluno] = Relationship(back_populates="treinos")
    exercicios: List["Exercicio"] = Relationship(back_populates="treino")

class Exercicio(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    treino_id: int = Field(foreign_key="treino.id")
    nome: str                # Ex: "Supino Reto"
    series: int = 4
    repeticoes: int = 10
    carga_kg: float = 20.0
    descanso_segundos: int = 60

    treino: Optional[Treino] = Relationship(back_populates="exercicios")

# --- SCHEMAS DE ENTRADA (DTOs) ---
class AlunoCreate(SQLModel):
    nome: str
    cpf: str
    email: str
    senha: str
    data_nascimento: Optional[date] = None
    plano: PlanoEnum = PlanoEnum.MENSAL
    status: StatusAluno = StatusAluno.ATIVO

class LoginRequest(SQLModel):
    email: str
    senha: str

class CheckinRequest(SQLModel):
    termo: str  # CPF ou Matrícula/ID

# --- BANCO DE DADOS ---
sqlite_url = "sqlite:///./gymflow.db"
engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})

def get_session():
    with Session(engine) as session:
        yield session

# --- INICIALIZAÇÃO FASTAPI ---
app = FastAPI(title="GymFlow API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

# ==============================================================================
# ROTAS DA API
# ==============================================================================

# 1. LISTAR TODOS OS ALUNOS (Resolve o erro 405 Method Not Allowed do painel)
@app.get("/api/v1/alunos", response_model=List[Aluno])
def listar_alunos(session: Session = Depends(get_session)):
    alunos = session.exec(select(Aluno)).all()
    return alunos

# 2. PRÉ-CADASTRO / CRIAÇÃO DE ALUNO (Com Hash de Senha)
@app.post("/api/v1/alunos", response_model=Aluno, status_code=201)
def cadastrar_aluno(dados: AlunoCreate, session: Session = Depends(get_session)):
    cpf_limpo = dados.cpf.replace(".", "").replace("-", "").strip()
    if session.exec(select(Aluno).where(Aluno.cpf == cpf_limpo)).first():
        raise HTTPException(status_code=400, detail="CPF já cadastrado.")
    if session.exec(select(Aluno).where(Aluno.email == dados.email.lower().strip())).first():
        raise HTTPException(status_code=400, detail="E-mail já cadastrado.")
    
    if len(dados.senha) < 6:
        raise HTTPException(status_code=400, detail="A senha deve ter no mínimo 6 caracteres.")

    novo_aluno = Aluno(
        nome=dados.nome,
        cpf=cpf_limpo,
        email=dados.email.lower().strip(),
        senha_hash=password_hash.hash(dados.senha),
        data_nascimento=dados.data_nascimento,
        plano=dados.plano,
        status=dados.status
    )
    session.add(novo_aluno)
    session.commit()
    session.refresh(novo_aluno)
    return novo_aluno

# 3. EXCLUIR / REMOVER ALUNO
@app.delete("/api/v1/alunos/{aluno_id}", status_code=200)
def deletar_aluno(aluno_id: int, session: Session = Depends(get_session)):
    aluno = session.get(Aluno, aluno_id)
    if not aluno:
        raise HTTPException(status_code=404, detail="Aluno não encontrado.")
    session.delete(aluno)
    session.commit()
    return {"mensagem": "Aluno removido com sucesso."}

@app.put("/api/v1/alunos/{aluno_id}", response_model=Aluno)
def atualizar_aluno(aluno_id: int, dados: AlunoUpdate, session: Session = Depends(get_session)):
    aluno_db = session.get(Aluno, aluno_id)
    if not aluno_db:
        raise HTTPException(status_code=404, detail="Aluno não encontrado.")

    dados_dict = dados.model_dump(exclude_unset=True)

    # 1. Tratamento e validação de duplicidade de CPF
    if "cpf" in dados_dict and dados_dict["cpf"]:
        cpf_limpo = dados_dict["cpf"].replace(".", "").replace("-", "").strip()
        duplicado = session.exec(
            select(Aluno).where(Aluno.cpf == cpf_limpo, Aluno.id != aluno_id)
        ).first()
        if duplicado:
            raise HTTPException(status_code=400, detail="Este CPF já pertence a outro aluno.")
        dados_dict["cpf"] = cpf_limpo

    # 2. Tratamento e validação de duplicidade de E-mail
    if "email" in dados_dict and dados_dict["email"]:
        email_limpo = dados_dict["email"].lower().strip()
        duplicado_email = session.exec(
            select(Aluno).where(Aluno.email == email_limpo, Aluno.id != aluno_id)
        ).first()
        if duplicado_email:
            raise HTTPException(status_code=400, detail="Este e-mail já pertence a outro aluno.")
        dados_dict["email"] = email_limpo

    # 3. Conversão segura de data caso chegue como string
    if "data_nascimento" in dados_dict and isinstance(dados_dict["data_nascimento"], str):
        dados_dict["data_nascimento"] = datetime.strptime(dados_dict["data_nascimento"], "%Y-%m-%d").date()

    # 4. Aplica as alterações no modelo
    for chave, valor in dados_dict.items():
        setattr(aluno_db, chave, valor)

    session.add(aluno_db)
    session.commit()
    session.refresh(aluno_db)
    return aluno_db

# 4. AUTENTICAÇÃO / LOGIN
@app.post("/api/v1/autenticacao")
def login(dados: LoginRequest, session: Session = Depends(get_session)):
    email_limpo = dados.email.lower().strip()
    
    # Login administrativo
    if "admin" in email_limpo and dados.senha == "admin123":
        return {
            "papel": "admin",
            "nome": "Administrador GymFlow",
            "email": "admin@gymflow.com"
        }
        
    aluno = session.exec(select(Aluno).where(Aluno.email == email_limpo)).first()
    if not aluno:
        raise HTTPException(status_code=401, detail="Credenciais inválidas.")
        
    if not password_hash.verify(dados.senha, aluno.senha_hash):
        raise HTTPException(status_code=401, detail="Senha incorreta.")
        
    return {
        "papel": "aluno",
        "id": aluno.id,
        "nome": aluno.nome,
        "email": aluno.email,
        "plano": aluno.plano,
        "status": aluno.status
    }

# 5. REGISTRO DE CHECK-IN
@app.post("/api/v1/checkin")
def registrar_checkin(dados: CheckinRequest, session: Session = Depends(get_session)):
    termo = dados.termo.replace(".", "").replace("-", "").strip()
    
    aluno = session.exec(
        select(Aluno).where((Aluno.cpf == termo) | (Aluno.id == (int(termo) if termo.isdigit() else -1)))
    ).first()
    
    if not aluno:
        raise HTTPException(status_code=404, detail="Aluno não encontrado.")
        
    if aluno.status != StatusAluno.ATIVO:
        negado = Checkin(aluno_id=aluno.id, liberado=False)
        session.add(negado)
        session.commit()
        raise HTTPException(status_code=403, detail="Acesso bloqueado: Matrícula com status Inativo.")
        
    checkin_liberado = Checkin(aluno_id=aluno.id, liberado=True)
    session.add(checkin_liberado)
    session.commit()
    
    return {
        "mensagem": "Check-in realizado com sucesso!",
        "aluno": aluno.nome,
        "hora": datetime.now().strftime("%H:%M")
    }

# 6. HISTÓRICO DE CHECK-INS DO DIA
@app.get("/api/v1/checkin/hoje")
def checkins_hoje(session: Session = Depends(get_session)):
    hoje = datetime.utcnow().date()
    registros = session.exec(select(Checkin)).all()
    
    resultado = []
    for c in registros:
        if c.data_hora.date() == hoje and c.liberado:
            aluno = session.get(Aluno, c.aluno_id)
            resultado.append({
                "id": c.id,
                "aluno_nome": aluno.nome if aluno else "Desconhecido",
                "horario": c.data_hora.strftime("%H:%M")
            })
    return resultado
