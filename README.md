# Gerenciador de Tarefas - Projeto Node.js MVC

## Descrição do Projeto
Este é um sistema de gerenciamento de tarefas construído com Node.js, Express, EJS e organizado no padrão de arquitetura MVC. Ele permite o cadastro, listagem, edição e exclusão de tarefas vinculadas a usuários.

## Tecnologias Utilizadas
- Node.js
- Express.js
- EJS (Embedded JavaScript Templates)
- SQLite (ou Supabase opcional)
- JavaScript
- HTML e CSS

## Como Executar o Projeto Localmente
1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   cd projeto
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Copie o arquivo de exemplo de ambiente e edite conforme necessário:
   ```bash
   cp .env.example .env
   ```

4. Execute o projeto:
   ```bash
   node server.js
   # ou
   npm start
   ```

## Estrutura de Pastas
```
projeto/
├── config/
├── controllers/
├── models/
├── routes/
├── services/
├── assets/
├── scripts/
├── styles/
├── tests/
├── views/
├── .env.example
├── jest.config.js
├── package.json
├── readme.md
├── server.js
├── rest.http
└── modelo-banco.png
```
