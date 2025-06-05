
## WAD.md (Web API Documentation)


# Task Manager Pro - API Documentation

Documentação completa da API RESTful do Task Manager Pro.

## Autenticação

A API usa JWT para autenticação. Inclua o token no header `Authorization`:
Authorization: Bearer seu_token_jwt


## Convenções

- Todas as requisições devem usar `Content-Type: application/json`
- Todas as respostas seguem o formato:


{
  "status": "success|error",
  "data": {...},
  "message": "Mensagem descritiva"
}
Endpoints
Autenticação
Registrar novo usuário
POST /api/auth/register
Body:


{
  "name": "Nome do Usuário",
  "email": "usuario@example.com",
  "password": "senha123"
}
Resposta de sucesso:


{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "name": "Nome do Usuário",
      "email": "usuario@example.com",
      "role": "user"
    }
  }
}
Login
POST /api/auth/login
Body:


{
  "email": "usuario@example.com",
  "password": "senha123"
}
Resposta de sucesso:


{
  "status": "success",
  "data": {
    "token": "jwt_token",
    "user": {
      "id": 1,
      "name": "Nome do Usuário",
      "email": "usuario@example.com",
      "role": "user"
    }
  }
}
Tarefas
Listar todas as tarefas
GET /api/tasks
Resposta de sucesso:


{
  "status": "success",
  "data": {
    "tasks": [
      {
        "id": 1,
        "title": "Tarefa de Exemplo",
        "description": "Descrição da tarefa",
        "status": "pending",
        "priority": "medium",
        "dueDate": "2023-12-31T00:00:00.000Z",
        "userId": 1,
        "createdAt": "2023-10-01T12:00:00.000Z",
        "updatedAt": "2023-10-01T12:00:00.000Z"
      }
    ]
  }
}
Criar nova tarefa
POST /api/tasks
Body:


{
  "title": "Nova Tarefa",
  "description": "Descrição opcional",
  "status": "pending",
  "priority": "high",
  "dueDate": "2023-12-31"
}
Resposta de sucesso:


{
  "status": "success",
  "data": {
    "task": {
      "id": 2,
      "title": "Nova Tarefa",
      "description": "Descrição opcional",
      "status": "pending",
      "priority": "high",
      "dueDate": "2023-12-31T00:00:00.000Z",
      "userId": 1,
      "updatedAt": "2023-10-01T12:30:00.000Z",
      "createdAt": "2023-10-01T12:30:00.000Z"
    }
  }
}
Obter uma tarefa específica
GET /api/tasks/:id
Resposta de sucesso:


{
  "status": "success",
  "data": {
    "task": {
      "id": 1,
      "title": "Tarefa de Exemplo",
      "description": "Descrição da tarefa",
      "status": "pending",
      "priority": "medium",
      "dueDate": "2023-12-31T00:00:00.000Z",
      "userId": 1,
      "createdAt": "2023-10-01T12:00:00.000Z",
      "updatedAt": "2023-10-01T12:00:00.000Z"
    }
  }
}
Atualizar uma tarefa
PUT /api/tasks/:id
Body:


{
  "title": "Tarefa Atualizada",
  "status": "in_progress"
}
Resposta de sucesso:


{
  "status": "success",
  "data": {
    "task": {
      "id": 1,
      "title": "Tarefa Atualizada",
      "description": "Descrição da tarefa",
      "status": "in_progress",
      "priority": "medium",
      "dueDate": "2023-12-31T00:00:00.000Z",
      "userId": 1,
      "createdAt": "2023-10-01T12:00:00.000Z",
      "updatedAt": "2023-10-01T12:45:00.000Z"
    }
  }
}
Deletar uma tarefa
DELETE /api/tasks/:id
Resposta de sucesso:


{
  "status": "success",
  "data": null,
  "message": "Task deleted successfully"
}

Códigos de Erro
Código	Descrição
400	Bad Request - Validação falhou
401	Não autorizado
403	Proibido - Sem permissão
404	Não encontrado
500	Erro interno do servidor

Exemplos de Erros
Erro de validação:
{
  "status": "error",
  "message": "Validation error",
  "errors": [
    "Title must be between 3 and 100 characters",
    "Status must be one of: pending, in_progress, completed"
  ]
}
Erro de autenticação:
{
  "status": "error",
  "message": "Please authenticate"
}
Erro de permissão:
{
  "status": "error",
  "message": "You are not authorized to access this resource"
}

Considerações Finais
Todas as rotas de tarefas requerem autenticação

Usuários só podem acessar/modificar suas próprias tarefas

Administradores podem acessar todas as tarefas

Use HTTPS em produção para segurança dos tokens