#!/bin/bash

echo "🧪 Testando a API Community E-commerce..."
echo ""

API_URL="http://localhost:3000"

echo "📡 Verificando se a API está online..."
response=$(curl -s -o /dev/null -w "%{http_code}" $API_URL)

if [ $response -eq 200 ] || [ $response -eq 404 ]; then
  echo "✅ API está respondendo (HTTP $response)"
else
  echo "❌ API não está respondendo (HTTP $response)"
  exit 1
fi

echo ""
echo "✨ Teste concluído!"

