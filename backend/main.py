from fastapi import FastAPI

app = FastAPI(title="GymFlow API")

@app.get("/")
def home():
    return {"message": "API do GymFlow rodando com sucesso!"}