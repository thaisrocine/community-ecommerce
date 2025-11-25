# Guia de Configuração do Podman

Este guia explica como configurar e executar a API Community E-commerce usando Podman.

## 1. Instalação do Podman

### macOS

```bash
brew install podman
podman machine init
podman machine start
```

### Linux (Ubuntu/Debian)

```bash
sudo apt-get update
sudo apt-get install -y podman
```

### Windows

Baixe e instale o Podman Desktop: https://podman.io/getting-started/installation

## 2. Construir a Imagem

### Imagem de Produção

```bash
podman build -t community-ecommerce:latest .
```

### Imagem de Desenvolvimento

```bash
podman build -f Dockerfile.dev -t community-ecommerce:dev .
```

## 3. Executar o Contêiner

### Modo Simples (apenas API)

```bash
podman run -d \
  --name community-ecommerce-api \
  -p 3000:3000 \
  -e NODE_ENV=development \
  community-ecommerce:latest
```

### Modo Desenvolvimento (com hot-reload)

```bash
podman run -d \
  --name community-ecommerce-dev \
  -p 3000:3000 \
  -v $(pwd)/src:/app/src:Z \
  -e NODE_ENV=development \
  community-ecommerce:dev
```

## 4. Usar com Podman Compose

### Instalar podman-compose

```bash
pip3 install podman-compose
```

### Executar todos os serviços (API + Banco de Dados)

```bash
podman-compose up -d
```

### Ver logs

```bash
podman-compose logs -f
```

### Parar serviços

```bash
podman-compose down
```

## 5. Comandos Úteis

### Listar contêineres em execução

```bash
podman ps
```

### Ver logs do contêiner

```bash
podman logs -f community-ecommerce-api
```

### Acessar o shell do contêiner

```bash
podman exec -it community-ecommerce-api sh
```

### Parar contêiner

```bash
podman stop community-ecommerce-api
```

### Remover contêiner

```bash
podman rm community-ecommerce-api
```

### Remover imagem

```bash
podman rmi community-ecommerce:latest
```

## 6. Testar a API

### Verificar se a API está funcionando

```bash
curl http://localhost:3000
```

### Ou acesse no navegador

```
http://localhost:3000
```

## 7. Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações.

## 8. Troubleshooting

### Porta já em uso

Se a porta 3000 já estiver em uso, mude para outra porta:

```bash
podman run -d --name community-ecommerce-api -p 8080:3000 community-ecommerce:latest
```

### Problemas com volumes no macOS

Se tiver problemas com volumes, certifique-se de que a máquina Podman está rodando:

```bash
podman machine start
```

### Reconstruir imagem sem cache

```bash
podman build --no-cache -t community-ecommerce:latest .
```

## 9. Alternativas ao Docker Compose

Se não quiser usar podman-compose, pode usar os comandos nativos:

### Criar rede

```bash
podman network create ecommerce-network
```

### Executar banco de dados

```bash
podman run -d \
  --name community-ecommerce-db \
  --network ecommerce-network \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=community_ecommerce \
  -p 5432:5432 \
  postgres:15-alpine
```

### Executar API

```bash
podman run -d \
  --name community-ecommerce-api \
  --network ecommerce-network \
  -e NODE_ENV=development \
  -e DB_HOST=community-ecommerce-db \
  -p 3000:3000 \
  community-ecommerce:latest
```

## 10. Scripts NPM Adicionados

Use os scripts no package.json para facilitar:

```bash
npm run docker:build       # Construir imagem
npm run docker:run         # Executar contêiner
npm run docker:dev         # Modo desenvolvimento
npm run docker:stop        # Parar contêiner
npm run docker:logs        # Ver logs
```

## Dicas para Apresentação em Sala

1. **Prepare o ambiente antes**: Construa a imagem antes da aula
2. **Use podman-compose**: Mais fácil para demonstrar
3. **Tenha um backup**: Mantenha a aplicação rodando localmente também
4. **Mostre os logs**: Use `podman-compose logs -f` para mostrar a aplicação funcionando
5. **Prepare dados de teste**: Tenha requisições curl prontas para demonstrar

## Recursos

- [Documentação Oficial do Podman](https://docs.podman.io/)
- [Podman vs Docker](https://docs.podman.io/en/latest/Introduction.html)
- [Podman Compose](https://github.com/containers/podman-compose)
