
# PicoZapZap

Frontend para o mensageiro PicoZapZap (Raspberry Pi Pico W).

## Deploy na Vercel
Para evitar a "tela branca", certifique-se de que os arquivos estão na **raiz** do projeto ou configure o **Root Directory** corretamente na Vercel.

1. Conecte seu repositório.
2. Se você moveu os arquivos para uma pasta `frontend/`, defina **Root Directory** como `frontend`.
3. Se os arquivos estão na raiz (como este exemplo), deixe o Root Directory como padrão (`./`).
4. Framework Preset: **Other** ou **Vite**.
5. Build Command: `npm run build`.
6. Output Directory: `dist`.

## Estrutura Atual
Esta versão consolidou os arquivos na raiz para garantir compatibilidade imediata com o ambiente de visualização e deploy simplificado.

- `index.html`: Ponto de entrada.
- `index.tsx`: Renderização React.
- `App.tsx`: Lógica principal.
- `style.css`: Estilos.
- `api.ts`: Comunicação com o backend (Prompt 2).
