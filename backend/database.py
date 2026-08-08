from sqlmodel import SQLModel, create_engine, Session

# Nome do arquivo de banco de dados SQLite que será gerado automaticamente
sqlite_file_name = "gymflow.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

# O engine é o "motor" que conversa com o banco
engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})

def criar_banco_e_tabelas():
    """Lê todas as classes em models.py e cria as tabelas no arquivo .db"""
    SQLModel.metadata.create_all(engine)

def get_session():
    """Abre uma sessão para ler ou gravar dados no banco"""
    with Session(engine) as session:
        yield session