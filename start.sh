#!/bin/sh
cd "$(dirname "$0")"
if command -v node >/dev/null 2>&1; then exec node server.js
elif command -v python3 >/dev/null 2>&1; then echo "Node.js não encontrado: iniciando modo simples (sem banco compartilhado) em http://localhost:8080"; exec python3 -m http.server 8080
else echo "Instale o Node.js (https://nodejs.org) ou o Python 3 e rode de novo."; exit 1; fi
