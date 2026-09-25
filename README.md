# Maré Digital

Site institucional da Maré Digital. É uma página estática (`public/index.html`) publicada na Vercel.

## Estrutura

- `public/index.html`: o site. É um bundle exportado da ferramenta de design, com o código, as fontes e o React embutidos.
- `scripts/aplicar-patch.js`: aplica a navbar fixa, o menu no telemóvel e os estilos responsivos a um export novo.
- `vercel.json`: publica só a pasta `public/`, sem passo de build.

## Depois de um novo export da ferramenta de design

1. Substitua `public/index.html` pelo ficheiro exportado.
2. Rode `npm run patch`. Uma cópia do original fica em `backup/`.
3. Se o script disser que "o export mudou e o patch já não encaixa", o design mudou nessa parte e o patch tem de ser ajustado.

## Ver localmente

```
npm run dev
```

## Deploy

Pela CLI (`npm i -g vercel`, depois `vercel login`):

```
vercel          # pré-visualização
npm run deploy  # produção
```

Ou pelo Git: envie o repositório para o GitHub e importe-o em vercel.com/new. A configuração vem do `vercel.json`, não é preciso alterar nada.
