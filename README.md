# Task Manager Pro

Um sistema completo de gerenciamento de tarefas com autenticação de usuários, CRUD de tarefas e interface responsiva.

## Recursos Principais

- ✅ Autenticação segura com JWT
- ✅ CRUD completo de tarefas
- ✅ Validação de dados em backend e frontend
- ✅ Interface responsiva com EJS
- ✅ Banco de dados PostgreSQL com Sequelize
- ✅ Segurança reforçada (Helmet, rate limiting)
- ✅ Logging profissional
- ✅ Tratamento de erros centralizado
- ✅ Soft delete de tarefas

## Tecnologias Utilizadas

- **Backend**: Node.js, Express
- **Frontend**: EJS, CSS vanilla
- **Banco de Dados**: PostgreSQL (Supabase)
- **ORM**: Sequelize
- **Autenticação**: JWT
- **Logging**: Winston
- **Validação**: Joi
- **Segurança**: Helmet, express-rate-limit

## Estrutura do Projeto

```
task-manager-pro/
├── config/           # Configurações do app
├── controllers/      # Lógica dos controllers
├── middlewares/      # Middlewares customizados
├── migrations/       # Migrações do banco de dados
├── models/           # Modelos do Sequelize
├── public/           # Arquivos estáticos
├── routes/           # Definição de rotas
├── services/         # Lógica de negócios
├── utils/            # Utilitários
└── views/            # Templates EJS
```

## Como Executar

### Pré-requisitos

- Node.js 16+
- NPM 8+
- Conta no Supabase (para o banco de dados PostgreSQL)

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/task-manager-pro.git
   cd task-manager-pro
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o ambiente:
   - Crie um arquivo `.env` baseado no `.env.example`
   - Preencha com suas credenciais do Supabase

4. Execute as migrações:
   ```bash
   npm run migrate
   ```

5. (Opcional) Popule o banco com dados iniciais:
   ```bash
   npm run seed
   ```

6. Inicie o servidor:
   ```bash
   npm start
   ```

   Para desenvolvimento:
   ```bash
   npm run dev
   ```

7. Acesse no navegador:
   ```
   http://localhost:3000
   ```

## Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| DB_HOST | Host do PostgreSQL | aws-0-sa-east-1.pooler.supabase.com |
| DB_PORT | Porta do PostgreSQL | 6543 |
| DB_USER | Usuário do PostgreSQL | postgres.xxxxxxxxxxxx |
| DB_PASSWORD | Senha do PostgreSQL | sua_senha |
| DB_NAME | Nome do banco de dados | postgres |
| APP_PORT | Porta da aplicação | 3000 |
| APP_ENV | Ambiente (development/production) | development |
| SESSION_SECRET | Segredo para sessões | seu_segredo_super_secreto |
| JWT_SECRET | Segredo para JWT | outro_segredo |
| JWT_EXPIRES_IN | Tempo de expiração do JWT | 1d |

## API Documentation

Para informações detalhadas sobre a API, consulte o arquivo [WAD.md](WAD.md).

## Reflexão Crítica

### Desafios Enfrentados

1. **Configuração do Banco de Dados**: A migração de SQLite para PostgreSQL (Supabase) apresentou desafios relacionados à configuração SSL e estrutura dos modelos.

2. **Estrutura dos Modelos Sequelize**: Enfrentamos problemas com a estrutura dos modelos e como eles são importados/exportados, resultando em erros como "Class constructor cannot be invoked without 'new'".

3. **Gerenciamento de Sessões**: A integração do sistema de sessões com o Sequelize exigiu atenção especial para garantir que a tabela de sessões fosse criada corretamente.

### Soluções Implementadas

1. **Configuração Explícita do Sequelize**: Implementamos uma configuração explícita para o Sequelize, garantindo que todas as opções necessárias para o PostgreSQL fossem definidas corretamente.

2. **Refatoração dos Modelos**: Reestruturamos os modelos para seguir o padrão recomendado pelo Sequelize, garantindo que eles fossem exportados e importados corretamente.

3. **Sincronização de Modelos**: Implementamos a sincronização automática dos modelos com o banco de dados, facilitando o desenvolvimento e testes.

### Aprendizados

1. **Importância da Estrutura de Projeto**: Uma estrutura de projeto bem definida facilita a manutenção e evolução do código.

2. **Tratamento de Erros Centralizado**: Implementar um sistema centralizado de tratamento de erros melhora a experiência do usuário e facilita a depuração.

3. **Logging Eficiente**: Um sistema de logging bem implementado é essencial para monitorar e depurar aplicações em produção.

4. **Segurança como Prioridade**: Implementar medidas de segurança desde o início do projeto é fundamental para proteger os dados dos usuários.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
