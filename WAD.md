#  WAD.md — Web Application Description

##  Projeto: Gerenciador de Tarefas (MVC + Express + Sequelize + EJS)

Este documento descreve o funcionamento da aplicação web desenvolvida utilizando o padrão MVC. A aplicação permite **cadastrar, listar e remover tarefas**, integrando **views em EJS**, **backend com Express.js**, **ORM Sequelize** com banco SQLite, além de **integração assíncrona com a Fetch API**.

---

##  Funcionalidades Implementadas

###  Página Principal — Lista de Tarefas (`/tarefas`)

* Exibe a lista completa de tarefas cadastradas.
* As tarefas vêm diretamente do banco de dados.
* Botão de **exclusão** com confirmação.
* Link para adicionar nova tarefa.

---

###  Formulário — Cadastro de Nova Tarefa (`/formulario`)

* Página com formulário contendo campo de título e descrição.
* Ao enviar, os dados são enviados com `fetch()` para o backend.
* Redireciona automaticamente de volta para a página principal.

---

##  Integração Frontend  Backend

###  Envio de dados (POST via Fetch API)

```js
fetch('/api/tarefas', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ titulo, descricao })
});
```

### Exclusão de dados (DELETE via Fetch API)

```js
fetch(`/api/tarefas/${id}`, {
  method: 'DELETE'
});
```

---

##  Backend: Controladores e Rotas

* **Rotas principais:**

  * `GET /tarefas` — renderiza view com lista
  * `GET /formulario` — renderiza formulário de cadastro

* **Rotas de API (usadas por Fetch API):**

  * `GET /api/tarefas` — retorna tarefas em JSON
  * `POST /api/tarefas` — adiciona nova tarefa
  * `DELETE /api/tarefas/:id` — remove tarefa por ID

* **Controller inline:** As lógicas de controller foram aplicadas diretamente nas rotas, organizadas em blocos claros.

---

##  Modelo e Banco de Dados

* ORM utilizado: **Sequelize**
* Banco de dados: **SQLite**
* Tabela utilizada: `Tarefas`

  * Campos:

    * `id` (autoincremento)
    * `titulo` (string, obrigatório)
    * `descricao` (texto, opcional)


##  Como Executar

```bash
npm install
node server.js
```

Acesse a aplicação em: [http://localhost:3000/tarefas](http://localhost:3000/tarefas)