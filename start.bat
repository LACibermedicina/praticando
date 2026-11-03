@echo off
cd /d "%~dp0"
where node >nul 2>nul && (node server.js & goto :eof)
where python >nul 2>nul && (echo Node.js nao encontrado: modo simples em http://localhost:8080 & python -m http.server 8080 & goto :eof)
echo Instale o Node.js (https://nodejs.org) ou o Python 3 e execute de novo.
pause
