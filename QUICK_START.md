# Quick Start - Podman

Guia rápido para executar o projeto com Podman.

## Pré-requisitos

- Podman instalado
- Node.js 20+ (para desenvolvimento local)

## 🚀 Início Rápido (3 comandos)

```bash
# 1. Construir a imagem
npm run docker:build

# 2. Executar o contêiner
npm run docker:run

# 3. Ver logs
npm run docker:logs
```

## 📦 Usando Podman Compose (Recomendado para apresentação)

```bash
# Instalar podman-compose (apenas uma vez)
pip3 install podman-compose

# Iniciar todos os serviços (API + Banco de Dados)
npm run compose:up

# Ver logs em tempo real
npm run compose:logs

# Parar todos os serviços
npm run compose:down
```

## 🧪 Testar a API

```bash
# Tornar o script executável
chmod +x test-api.sh

# Executar teste
./test-api.sh
```

Ou acesse no navegador:

```
http://localhost:3000
```

## 📝 Comandos Disponíveis

### Docker/Podman

- `npm run docker:build` - Construir imagem de produção
- `npm run docker:build-dev` - Construir imagem de desenvolvimento
- `npm run docker:run` - Executar contêiner
- `npm run docker:dev` - Executar em modo desenvolvimento
- `npm run docker:stop` - Parar contêiner
- `npm run docker:remove` - Remover contêiner
- `npm run docker:logs` - Ver logs do contêiner

### Compose

- `npm run compose:up` - Iniciar serviços
- `npm run compose:down` - Parar serviços
- `npm run compose:logs` - Ver logs

### Desenvolvimento Local

- `npm install` - Instalar dependências
- `npm run dev` - Executar em modo desenvolvimento
- `npm run build` - Compilar TypeScript
- `npm start` - Executar versão compilada

## 🎓 Para Apresentação em Sala

### Opção 1: Podman Compose (Mais Fácil)

```bash
podman-compose up -d
podman-compose logs -f
```

### Opção 2: Comandos Individuais

```bash
# Construir
podman build -t community-ecommerce:latest .

# Executar
podman run -d --name community-ecommerce-api -p 3000:3000 community-ecommerce:latest

# Logs
podman logs -f community-ecommerce-api
```

## 🔧 Troubleshooting

### Porta 3000 já em uso?

```bash
# Use outra porta
podman run -d --name community-ecommerce-api -p 8080:3000 community-ecommerce:latest
```

### Máquina Podman não está rodando (macOS)?

```bash
podman machine start
```

### Reconstruir sem cache?

```bash
podman build --no-cache -t community-ecommerce:latest .
```

## 📚 Documentação Completa

Para instruções detalhadas, consulte: [PODMAN_GUIDE.md](./PODMAN_GUIDE.md)
