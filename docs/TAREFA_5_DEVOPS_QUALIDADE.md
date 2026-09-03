# Tarefa 5: Qualidade, Automação e Entrega - GymFlow

## 1. Pipeline de Integração Contínua (CI/CD)
A automação de qualidade é executada via **GitHub Actions** em todo `push` ou `pull request` na branch principal:

```yaml
name: CI/CD Pipeline - GymFlow

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  qualidade-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: cd frontend && npm install
      - run: cd frontend && npx tsc --noEmit
      - run: cd frontend && npm run build

  qualidade-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - run: pip install -r backend/requirements.txt pytest
      - run: pytest backend/