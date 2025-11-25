# Community E-commerce

Repositório do projeto de e-commerce comunitário desenvolvido com Node.js e TypeScript.

## 🚀 Tecnologias

- Node.js
- TypeScript
- Express
- Sequelize (ORM)
- PostgreSQL / MySQL
- Podman (containerização)
- dotenv (gerenciamento de variáveis de ambiente)

## 📋 Pré-requisitos

- Node.js (versão 20 ou superior)
- npm ou yarn
- Podman (opcional, para execução em contêiner)

## 🔧 Instalação

1. Clone o repositório
2. Instale as dependências:

```bash
npm install
```

3. Copie o arquivo de exemplo das variáveis de ambiente:

```bash
cp .env.example .env
```

4. Configure as variáveis de ambiente no arquivo `.env`

## 🎮 Comandos

### Desenvolvimento Local

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Build do projeto
npm run build

# Executar versão de produção
npm start

# Limpar pasta de build
npm run clean
```

### Podman/Docker

```bash
# Construir imagem
npm run docker:build

# Executar contêiner
npm run docker:run

# Modo desenvolvimento (com hot-reload)
npm run docker:dev

# Ver logs
npm run docker:logs

# Parar contêiner
npm run docker:stop
```

### Podman Compose

```bash
# Iniciar todos os serviços (API + Banco)
npm run compose:up

# Ver logs em tempo real
npm run compose:logs

# Parar todos os serviços
npm run compose:down
```

## 🐳 Executando com Podman

Para instruções detalhadas sobre como usar Podman, consulte:

- **[QUICK_START.md](./QUICK_START.md)** - Guia rápido (recomendado)
- **[PODMAN_GUIDE.md](./PODMAN_GUIDE.md)** - Documentação completa

### Início Rápido

```bash
# 1. Construir e executar com Compose (recomendado)
npm run compose:up

# 2. Ou construir e executar manualmente
npm run docker:build
npm run docker:run
```

## 📁 Estrutura do Projeto

```
community-ecommerce/
├── src/
│   ├── entities/         # Entidades do domínio (4 principais)
│   │   ├── User.ts      # Usuários
│   │   ├── Store.ts     # Lojas
│   │   ├── Product.ts   # Produtos
│   │   └── Order.ts     # Pedidos
│   ├── repositories/    # Camada de acesso aos dados
│   │   ├── BaseRepository.ts
│   │   ├── UserRepository.ts
│   │   ├── StoreRepository.ts
│   │   ├── ProductRepository.ts
│   │   └── OrderRepository.ts
│   ├── services/        # Lógica de negócio
│   │   ├── UserService.ts
│   │   ├── StoreService.ts
│   │   ├── ProductService.ts
│   │   └── OrderService.ts
│   ├── controllers/     # Controladores (API)
│   │   ├── UserController.ts
│   │   ├── StoreController.ts
│   │   ├── ProductController.ts
│   │   └── OrderController.ts
│   └── index.ts        # Arquivo principal
├── dist/               # Código compilado
├── tsconfig.json       # Configuração TypeScript
└── package.json        # Dependências
```

## 🏪 Arquitetura do Sistema

### 📦 4 Entidades Principais

1. **User** - Usuários do sistema (Cliente, Admin, Dono de Loja)
2. **Store** - Lojas do comércio local
3. **Product** - Produtos das lojas
4. **Order** - Pedidos dos clientes

### 🏗️ Camadas da Aplicação

**Controllers** → **Services** → **Repositories** → **Database**

- **Controllers**: Recebem requisições e retornam respostas
- **Services**: Contêm a lógica de negócio
- **Repositories**: Acessam e manipulam dados do banco
- **Entities**: Definem a estrutura dos dados

## 🛠️ Desenvolvimento

O projeto segue o padrão de arquitetura em camadas para facilitar manutenção e testes:

```typescript
// Exemplo de uso
const userController = new UserController()
const user = await userController.create({
  email: 'user@example.com',
  password: '123456',
  name: 'João Silva',
  phone: '11999999999',
})
```

### Próximos Passos

1. Conectar banco de dados (PostgreSQL, MySQL ou MongoDB)
2. Implementar rotas REST com Express
3. Adicionar autenticação JWT
4. Criar validações com Zod ou Yup
