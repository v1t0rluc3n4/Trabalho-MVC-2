# WAD - Documentação

## Introdução
Este documento descreve o funcionamento do sistema de gerenciamento de tarefas com base em uma arquitetura MVC, utilizando Node.js, Express.js e banco de dados SQLite.

## Diagrama Entidade-Relacionamento
Veja o diagrama incluído na imagem `modelo-banco.png`.

- Um usuário pode ter várias tarefas.
- Cada tarefa pertence a uma categoria.

Tabelas:
- users
- tasks
- categories
