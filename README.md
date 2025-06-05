# Task Manager Pro
Um sistema completo de gerenciamento de tarefas com autenticação de usuários, CRUD de tarefas e interface responsiva.

##  Recursos Principais

- ✅ Autenticação segura com JWT
- ✅ CRUD completo de tarefas
- ✅ Validação de dados em backend e frontend
- ✅ Interface responsiva com EJS
- ✅ Banco de dados PostgreSQL com Sequelize
- ✅ Segurança reforçada (Helmet, rate limiting)
- ✅ Logging profissional
- ✅ Tratamento de erros centralizado
- ✅ Soft delete de tarefas

##  Tecnologias Utilizadas

- **Backend**: Node.js, Express
- **Frontend**: EJS, CSS vanilla
- **Banco de Dados**: PostgreSQL
- **ORM**: Sequelize
- **Autenticação**: JWT
- **Logging**: Winston
- **Validação**: Joi
- **Segurança**: Helmet, express-rate-limit

##  Estrutura do Projeto
task-manager-pro/
├── config/ # Configurações do app
├── controllers/ # Lógica dos controllers
├── middlewares/ # Middlewares customizados
├── migrations/ # Migrações do banco de dados
├── models/ # Modelos do Sequelize
├── public/ # Arquivos estáticos
├── routes/ # Definição de rotas
├── services/ # Lógica de negócios
├── utils/ # Utilitários
└── views/ # Templates EJS


##  Como Executar

### Pré-requisitos

- Node.js 16+
- PostgreSQL 12+
- NPM 8+

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/task-manager-pro.git
   cd task-manager-pro
Instale as dependências:

bash
npm install
Configure o ambiente:

Crie um arquivo .env baseado no .env.example

Preencha com suas credenciais do banco de dados

Execute as migrações:

bash
npx sequelize-cli db:migrate
(Opcional) Popule o banco com dados iniciais:

bash
npx sequelize-cli db:seed:all
Inicie o servidor:

bash
npm start
Para desenvolvimento:

bash
npm run dev
Acesse no navegador:

http://localhost:3000
 Variáveis de Ambiente
Variável	Descrição	Exemplo
DB_HOST	Host do PostgreSQL	localhost
DB_PORT	Porta do PostgreSQL	5432
DB_USER	Usuário do PostgreSQL	postgres
DB_PASSWORD	Senha do PostgreSQL	sua_senha
DB_NAME	Nome do banco de dados	task_manager_pro
APP_PORT	Porta da aplicação	3000
APP_ENV	Ambiente (development/production)	development
SESSION_SECRET	Segredo para sessões	seu_segredo_super_secreto
JWT_SECRET	Segredo para JWT	outro_segredo
JWT_EXPIRES_IN	Tempo de expiração do JWT	1d