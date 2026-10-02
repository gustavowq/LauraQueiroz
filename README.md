# Laura Queiroz Arquitetura — esboço do site

Site de uma página feito em **Angular 21**, com animações em **GSAP** (ScrollTrigger, SplitText, DrawSVG, MorphSVG) e a cena 3D em **three.js**.

## Rodar no computador

```bash
npm install
npm start          # abre em http://localhost:4200
npm run build      # gera o site pronto em dist/lqa-site/browser
```

## Publicar no GitHub Pages

1. Crie um repositório no GitHub e envie esta pasta para a branch `main`.
2. No repositório: **Settings → Pages → Source → GitHub Actions**.
3. Pronto. A cada envio para a `main`, o arquivo `.github/workflows/deploy.yml` compila e publica sozinho.
   O endereço fica `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

> O build usa `baseHref: ./`, então o site funciona em qualquer subpasta do Pages sem configurar nada.

## Como o código está organizado

```
src/
├── index.html                 página base (fontes do Google)
├── main.ts                    inicia o Angular
├── styles/                    estilos globais
│   ├── tokens.css             cores, fontes, medidas e o modo "luz da noite"
│   ├── base.css               regras gerais da página
│   └── utilitarios.css        peças reutilizáveis: .wrap, .btn, .arco, texturas
└── app/
    ├── app.component.*        a ordem das seções na página
    ├── core/                  lógica compartilhada (sem visual)
    │   ├── animacao/gsap.ts       registra os plugins do GSAP
    │   ├── animacao/revelar.ts    animações de entrada (data-linhas, data-sobe, data-arco)
    │   ├── estado/estudio.service.ts   luz do dia/noite + fim da abertura
    │   └── materiais/             texturas desenhadas em código e o arco do logo
    ├── shared/                componentes usados por várias seções
    │   ├── tex-defs/              texturas registradas como padrões SVG
    │   └── ilustracao/            ilustrações que substituem as fotos
    ├── layout/                peças fixas da página
    │   ├── loader/  nav/  cursor/  rodape/
    └── sections/              uma pasta por seção (cada uma com .ts, .html e .css)
        ├── hero/              abertura + brises que se abrem para o manifesto
        ├── principios/        Matéria, Luz e Afeto
        ├── obra/              A CONSTRUÇÃO DA CASA DO LAGO (3D)
        │   ├── obra.component.*       liga a cena à rolagem
        │   ├── obra.capitulos.ts      textos dos 7 capítulos
        │   └── cena/
        │       ├── palco-3d.ts        renderizador, céu, sol, câmera, brilho
        │       ├── materiais-3d.ts    transição maquete branca → materiais reais
        │       ├── terreno-e-planta.ts  grade, curvas de nível, planta em L, cotas
        │       ├── casa.ts            paredes, lajes, vidros, móveis, luzes
        │       ├── paisagem.ts        lago e árvores
        │       ├── camera.ts          enquadramento de cada capítulo
        │       └── linha-do-tempo.ts  o roteiro: o que acontece em cada capítulo
        ├── projetos/          portfólio (dados em projetos.data.ts)
        ├── mundinho/          arquitetura infantil
        ├── processo/          as 4 etapas
        ├── traco/             antes × depois
        ├── estudio/           sobre a Laura
        ├── belo/              jornal "Sobre o Belo"
        └── contato/           formulário → WhatsApp
```

Cada arquivo começa com um comentário dizendo, em poucas palavras, o que ele faz.

## Antes de mostrar como site definitivo

- Trocar as ilustrações (`shared/ilustracao`) pelas fotos reais dos projetos.
- Confirmar o número de WhatsApp em `sections/contato/contato.component.ts`.
- Preencher os campos entre colchetes: valor do vale-projeto, número de projetos, bio completa.
- As medidas da Casa do Lago no 3D são ilustrativas.
