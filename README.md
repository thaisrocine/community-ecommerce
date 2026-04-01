# Community E-commerce

API de e-commerce comunitario desenvolvida com Node.js, Express e TypeScript. O sistema permite a criacao e gerenciamento de lojas virtuais, cadastro de produtos, processamento de pedidos e gestao de usuarios.

## Tecnologias

- Node.js (v20+)
- TypeScript
- Express 5
- Sequelize ORM
- PostgreSQL 15
- Docker/Podman

## Pre-requisitos

- Node.js (versao 20 ou superior)
- npm
- Docker ou Podman (para o banco de dados)

## Instalacao

1. Clone o repositorio

2. Instale as dependencias:

```bash
npm install
```

3. Copie o arquivo de variaveis de ambiente:

```bash
cp env.template .env
```

4. Configure as variaveis de ambiente no arquivo `.env` se necessario

## Subindo o Banco de Dados

### Opcao 1: Docker Compose (Recomendado)

```bash
# Subir apenas o banco de dados
docker-compose up db -d

# Verificar se o container esta rodando
docker ps

# Ver logs do banco
docker logs community-ecommerce-db
```

### Opcao 2: Docker manual

```bash
docker run -d \
  --name community-ecommerce-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=community_ecommerce \
  -p 5433:5432 \
  postgres:15-alpine
```

### Configuracao do Banco

O banco de dados utiliza as seguintes configuracoes (definidas no `.env`):

```
DB_HOST=localhost
DB_PORT=5433
DB_NAME=community_ecommerce
DB_USER=postgres
DB_PASSWORD=postgres
```

Nota: A porta externa e 5433 para evitar conflitos com outras instalacoes do PostgreSQL.

## Executando a Aplicacao

### Desenvolvimento

```bash
npm run dev
```

A aplicacao ira:

1. Conectar ao banco de dados PostgreSQL
2. Criar/atualizar as tabelas automaticamente
3. Iniciar o servidor na porta 3001

### Producao

```bash
npm run build
npm start
```

## Acessando o Banco de Dados

Para acessar o banco via terminal:

```bash
docker exec -it community-ecommerce-db psql -U postgres -d community_ecommerce
```

Comandos uteis dentro do psql:

```sql
-- Listar tabelas
\dt

-- Ver estrutura de uma tabela
\d users

-- Consultar dados
SELECT * FROM users;
SELECT * FROM stores;
SELECT * FROM products;
SELECT * FROM orders;

-- Sair
\q
```

## Estrutura do Projeto

```
community-ecommerce/
├── src/
│   ├── controllers/      # Controladores (entrada de requisicoes)
│   ├── services/         # Logica de negocio
│   ├── repositories/     # Acesso a dados
│   ├── models/           # Interfaces TypeScript
│   ├── database/         # Configuracao e modelos Sequelize
│   │   ├── config.ts     # Configuracao de conexao
│   │   └── models/       # Modelos ORM
│   ├── routes.ts         # Definicao de rotas
│   └── index.ts          # Ponto de entrada
├── docker-compose.yml    # Orquestracao de containers
├── package.json          # Dependencias
├── tsconfig.json         # Configuracao TypeScript
└── env.template          # Template de variaveis de ambiente
```

## Entidades

O sistema possui 4 entidades principais:

- **User**: Usuarios do sistema (CLIENT, ADMIN, STORE_OWNER)
- **Store**: Lojas cadastradas
- **Product**: Produtos das lojas
- **Order**: Pedidos dos clientes

## Endpoints da API

### Users

| Metodo | Endpoint     | Descricao                    |
| ------ | ------------ | ---------------------------- |
| POST   | /users       | Cria um novo usuario         |
| GET    | /users/:id   | Retorna um usuario pelo ID   |
| PUT    | /users/:id   | Atualiza dados de um usuario |
| DELETE | /users/:id   | Remove um usuario            |
| POST   | /users/login | Autentica um usuario         |

### Stores

| Metodo | Endpoint               | Descricao                                 |
| ------ | ---------------------- | ----------------------------------------- |
| POST   | /stores                | Cria uma nova loja                        |
| GET    | /stores/:id            | Retorna uma loja pelo ID                  |
| GET    | /stores/owner/:ownerId | Retorna lojas de um proprietario          |
| GET    | /stores/nearby         | Busca lojas proximas (lat, lng, radiusKm) |
| PUT    | /stores/:id            | Atualiza dados de uma loja                |
| POST   | /stores/:id/approve    | Aprova uma loja pendente                  |

### Products

| Metodo | Endpoint                 | Descricao                    |
| ------ | ------------------------ | ---------------------------- |
| POST   | /products                | Cria um novo produto         |
| GET    | /products/:id            | Retorna um produto pelo ID   |
| GET    | /products/store/:storeId | Retorna produtos de uma loja |
| GET    | /products?q=termo        | Busca produtos por nome      |
| PUT    | /products/:id            | Atualiza dados de um produto |
| DELETE | /products/:id            | Remove um produto            |

### Orders

| Metodo | Endpoint               | Descricao                     |
| ------ | ---------------------- | ----------------------------- |
| POST   | /orders                | Cria um novo pedido           |
| GET    | /orders/:id            | Retorna um pedido pelo ID     |
| GET    | /orders/user/:userId   | Retorna pedidos de um usuario |
| GET    | /orders/store/:storeId | Retorna pedidos de uma loja   |
| POST   | /orders/:id/confirm    | Confirma um pedido            |
| POST   | /orders/:id/cancel     | Cancela um pedido             |

## Exemplos de Uso

### Criar usuario

```bash
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@email.com",
    "password": "123456",
    "name": "Nome do Usuario",
    "phone": "11999999999",
    "role": "CLIENT"
  }'
```

### Criar loja

```bash
curl -X POST http://localhost:3001/stores \
  -H "Content-Type: application/json" \
  -d '{
    "ownerId": "ID_DO_USUARIO",
    "name": "Nome da Loja",
    "slug": "nome-da-loja",
    "description": "Descricao da loja",
    "phone": "11988888888",
    "email": "loja@email.com",
    "address": "Endereco completo",
    "city": "Cidade",
    "state": "SP",
    "deliveryFee": 5.00
  }'
```

### Criar produto

```bash
curl -X POST http://localhost:3001/products \
  -H "Content-Type: application/json" \
  -d '{
    "storeId": "ID_DA_LOJA",
    "name": "Nome do Produto",
    "description": "Descricao do produto",
    "price": 29.90,
    "stock": 100
  }'
```

## Scripts Disponiveis

| Script        | Descricao                                      |
| ------------- | ---------------------------------------------- |
| npm run dev   | Executa em modo desenvolvimento com hot-reload |
| npm run build | Compila o TypeScript                           |
| npm start     | Executa a versao compilada                     |
| npm run clean | Remove a pasta dist                            |

## Arquitetura

O projeto segue arquitetura em camadas:

```
Routes -> Controllers -> Services -> Repositories -> Database
```

- **Routes**: Define os endpoints HTTP
- **Controllers**: Recebe requisicoes, valida entrada, retorna respostas
- **Services**: Contem a logica de negocio
- **Repositories**: Acessa e manipula dados do banco
- **Models**: Define interfaces e modelos ORM
