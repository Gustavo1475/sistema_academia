# ⚙️ Pipeline de Integração Contínua (CI/CD)

O GymFlow adota práticas modernas de DevOps para garantir a integridade do código antes de qualquer merge na branch principal.

## Fluxo do Pipeline (GitHub Actions)

A cada `push` ou `pull request` direcionado à branch `main`, os seguintes passos são disparados:

1. **Linting e Formatação**: Checagem de padronização do código TypeScript e Python.
2. **Checagem Estática de Tipos**: Execução do compilador do TypeScript (`tsc --noEmit`) para garantir que nenhuma tipagem quebrada vá para produção.
3. **Build do Frontend**: Validação da compilação dos ativos via Vite (`npm run build`).
4. **Verificação de Dependências**: Garantia de que todos os pacotes do `requirements.txt` e do `package.json` resolvem sem conflitos.