
# PicoZapZap

PicoZapZap é um mensageiro simples para Raspberry Pi Pico W (BitDogLab v7) em MicroPython. Este repositório contém o frontend da aplicação.

## Estrutura do Projeto
- `frontend/`: Aplicação React + Vite + TypeScript.

## Deploy na Vercel
Para realizar o deploy desta parte do projeto na Vercel:
1. Conecte seu repositório GitHub à Vercel.
2. Nas configurações do projeto, defina o **Root Directory** como `frontend`.
3. O comando de Build deve ser `npm run build`.
4. O diretório de saída deve ser `dist`.

## Próximos Passos
O backend (Vercel Serverless Functions + Firestore) será fornecido no **PROMPT 2/2**. Uma vez que o backend for adicionado na pasta `api/` na raiz ou dentro de `frontend/api`, as chamadas de mesma origem (`/api/...`) funcionarão automaticamente.

## Instalação Local
```bash
cd frontend
npm install
npm run dev
```
