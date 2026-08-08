from datetime import date
from enum import Enum
from typing import Optional
from sqlmodel import Field, SQLModel

class StatusAluno(str, Enum):
    ATIVO = "Ativo"
    INATIVO = "Inativo"

class PlanoEnum(str, Enum):
    MENSAL = "Mensal"
    TRIMESTRAL = "Trimestral"
    ANUAL = "Anual"

class Aluno(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nome: str
    cpf: str = Field(unique=True, index=True) # Mantém str por conta dos zeros à esquerda
    email: str
    data_nascimento: Optional[date] = None # Tipo Data real do Python
    plano: PlanoEnum = PlanoEnum.MENSAL # Aceita apenas as opções do Enum
    status: StatusAluno = StatusAluno.ATIVO # Aceita apenas Ativo ou Inativo