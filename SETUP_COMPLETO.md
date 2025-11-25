# ✅ Configuração Completa do Podman

Sua API Community E-commerce está totalmente configurada para execução com Podman!

## 📦 Arquivos Criados

### Configuração de Contêiner

- ✅ `Dockerfile` - Imagem de produção
- ✅ `Dockerfile.dev` - Imagem de desenvolvimento (com hot-reload)
- ✅ `docker-compose.yml` - Orquestração de serviços (API + PostgreSQL)
- ✅ `.dockerignore` - Arquivos ignorados no build
- ✅ `.podmanignore` - Arquivos ignorados no build do Podman

### Documentação

- ✅ `PODMAN_GUIDE.md` - Guia completo do Podman
- ✅ `QUICK_START.md` - Guia rápido de início
- ✅ `README.md` - Atualizado com instruções do Podman

### Scripts e Templates

- ✅ `test-api.sh` - Script para testar a API
- ✅ `env.template` - Template de variáveis de ambiente
- ✅ Scripts npm adicionados ao `package.json`

## 🚀 Como Usar

### Opção 1: Podman Compose (Recomendado para Apresentação)

```bash
# Instalar podman-compose (apenas uma vez)
pip3 install podman-compose

# Iniciar todos os serviços
npm run compose:up

# Ver logs
npm run compose:logs

# Testar
./test-api.sh
```

### Opção 2: Comandos Manuais

```bash
# Construir imagem
npm run docker:build

# Executar
npm run docker:run

# Ver logs
npm run docker:logs
```

## 📝 Scripts NPM Disponíveis

### Podman/Docker

- `npm run docker:build` - Construir imagem de produção
- `npm run docker:build-dev` - Construir imagem de desenvolvimento
- `npm run docker:run` - Executar contêiner
- `npm run docker:dev` - Executar em modo desenvolvimento
- `npm run docker:stop` - Parar contêiner
- `npm run docker:remove` - Remover contêiner
- `npm run docker:logs` - Ver logs

### Compose

- `npm run compose:up` - Iniciar serviços (API + BD)
- `npm run compose:down` - Parar serviços
- `npm run compose:logs` - Ver logs em tempo real

### Desenvolvimento Local

- `npm run dev` - Desenvolvimento com hot-reload
- `npm run build` - Compilar TypeScript
- `npm start` - Executar versão compilada

## 🎓 Para Apresentação na Sala de Aula

### Preparação Antes da Aula

```bash
# 1. Instalar Podman
brew install podman  # macOS
# ou consulte PODMAN_GUIDE.md para outros sistemas

# 2. Iniciar máquina Podman (macOS)
podman machine init
podman machine start

# 3. Construir a imagem (fazer isso antes!)
npm run docker:build
```

### Durante a Apresentação

```bash
# Opção Fácil (com compose)
npm run compose:up
npm run compose:logs

# Opção Manual
npm run docker:run
npm run docker:logs
```

### Demonstração

```bash
# Mostrar que a API está funcionando
curl http://localhost:3000

# Ou abra no navegador
open http://localhost:3000
```

## 🔧 Características da Configuração

### Dockerfile de Produção

- ✅ Baseado em Alpine Linux (leve)
- ✅ Node.js 20
- ✅ Build otimizado
- ✅ Porta 3000 exposta

### Dockerfile de Desenvolvimento

- ✅ Hot-reload ativo
- ✅ Volumes montados para código fonte
- ✅ Ideal para desenvolvimento

### Docker Compose

- ✅ API + PostgreSQL
- ✅ Rede compartilhada
- ✅ Volume persistente para o banco
- ✅ Variáveis de ambiente configuradas

## 🐛 Troubleshooting

### Problema: Porta 3000 já em uso

```bash
# Use outra porta
podman run -d --name community-ecommerce-api -p 8080:3000 community-ecommerce:latest
```

### Problema: Podman machine não está rodando (macOS)

```bash
podman machine start
```

### Problema: Erro de permissão

```bash
# Reconstruir com sudo (Linux)
sudo podman build -t community-ecommerce:latest .
```

### Problema: Imagem desatualizada

```bash
# Reconstruir sem cache
podman build --no-cache -t community-ecommerce:latest .
```

## 📚 Documentação de Referência

- **QUICK_START.md** - Início rápido (leia primeiro!)
- **PODMAN_GUIDE.md** - Documentação completa
- **README.md** - Visão geral do projeto

## 🎯 Próximos Passos

1. ✅ Podman configurado
2. ⏭️ Implementar rotas REST com Express
3. ⏭️ Conectar com banco de dados
4. ⏭️ Adicionar autenticação JWT
5. ⏭️ Criar testes automatizados

## 💡 Dicas Finais

- **Teste antes da apresentação**: Execute tudo pelo menos uma vez antes
- **Tenha um plano B**: Mantenha a versão local funcionando também
- **Prepare requisições**: Tenha comandos curl prontos para demonstrar
- **Mostre os logs**: Use `npm run compose:logs` para mostrar a aplicação funcionando
- **Seja confiante**: O professor vai adorar ver containerização!

## 📞 Comandos Rápidos de Emergência

```bash
# Parar tudo
podman stop -a

# Remover todos os contêineres
podman rm -a

# Reconstruir do zero
npm run docker:build
npm run docker:run
```

Boa sorte na apresentação! 🚀
