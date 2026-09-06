# MP Luna — deploy na Hostinger

## Build e execução

Use o projeto como uma aplicação **Node.js/Express**, não como site estático.

- Node.js: 20 ou superior
- Instalação: `npm install`
- Build: `npm run build`
- Start: `npm start`

## Variáveis de ambiente

Mantenha a `DATABASE_URL` real do banco e as demais variáveis já usadas pelo projeto. Configure também um `JWT_SECRET` forte, pois o painel administrativo depende dele.

Exemplo:

```env
NODE_ENV=production
JWT_SECRET="uma-chave-longa-e-aleatoria"
```

Para os vídeos:

```env
MAX_VIDEO_UPLOAD_MB=500
```

Opcionalmente, defina uma pasta persistente fora da pasta de build:

```env
UPLOADS_DIR="/caminho/persistente/uploads"
```

Se `UPLOADS_DIR` não for definido, o sistema salva em `storage/uploads` a partir da pasta em que o processo Node.js está rodando.

## Como validar os vídeos depois do deploy

1. Entre no painel administrativo.
2. Escolha um produto e envie um vídeo MP4/WEBM/MOV/M4V/OGG.
3. Se o envio terminar, abra o produto e confirme a reprodução.
4. A API também possui `GET /api/uploads-video/status` (exige login de admin) para verificar se a pasta de upload tem permissão de escrita.

O arquivo é salvo no disco do próprio servidor; o banco guarda apenas a URL `/uploads/videos/...`.

> Observação: o limite de 500 MB existe no código. A hospedagem/reverse proxy pode impor um limite menor de requisição; isso só pode ser validado no ambiente real da Hostinger.

## Meta Pixel

Pixel configurado: `1442653917680644`.

O snippet oficial está no `<head>` de `index.html`. O primeiro `PageView` é disparado pelo snippet e as navegações internas do React Router também geram `PageView` por meio de `MetaPixelPageView.tsx`.

## Domínio definitivo

Quando o domínio final da MP Luna estiver definido, substitua a URL temporária da Vercel nos seguintes arquivos para não manter referências SEO ao endereço de testes:

- `index.html` (canonical, Open Graph e Twitter image)
- `public/robots.txt`
- `public/sitemap.xml`

Não foi inventado um domínio novo nesta versão porque ele ainda não foi informado.
