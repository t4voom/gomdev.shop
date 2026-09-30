# gomdev.shop

Site da gomdev: criação de sites e aplicativos para negócios locais em Blumenau, SC.
HTML, CSS e JavaScript puros, sem framework e sem dependências. Visual inspirado na apple.com.

```
index.html, portfolio.html, servicos.html, planos.html, sobre.html, contato.html, 404.html
projetos/<projeto>.html   uma página para cada projeto do portfólio
css/style.css             estilos (cores, fontes e espaçamentos no topo, em :root)
js/config.js              ← TUDO o que você vai querer mudar
js/main.js                menu, animações, vitrine, filtro, janelas, formulário
tools/build.mjs           gera as páginas .html e o sitemap a partir do config.js
tools/generate-images.mjs gera a imagem de compartilhamento e os ícones (opcional)
assets/portfolio/         capturas dos projetos em WebP (computador, celular, página inteira)
```

As páginas `.html` já estão prontas e são as que vão para o ar. Elas são **geradas** pelo `tools/build.mjs`, então não edite os `.html` direto: mude o `config.js` (ou o `build.mjs`) e gere de novo.

## Rodar no seu computador

```bash
npx serve .
```

Abra http://localhost:3000. Também dá para abrir o `index.html` direto no navegador: todos os caminhos são relativos, então o site funciona no domínio próprio, no GitHub Pages (`t4voom.github.io/gomdev.shop/`) ou em qualquer pasta.

## Editar o conteúdo: `js/config.js`

| O quê | Onde no `config.js` | Precisa gerar de novo? |
| --- | --- | --- |
| Número do WhatsApp | `WHATSAPP_NUMBER`, na primeira linha (55 + DDD + número) | Não, mas recomendo |
| Instagram | `instagram` | Não, mas recomendo |
| Faixa de aviso no topo | `ribbon` | Sim |
| Projetos do portfólio | `portfolio` (inclui o link publicado de cada um em `url`) | Sim |
| Serviços, passos, motivos | `services`, `steps`, `reasons` | Sim |
| Planos, preços e tabela | `plans`, `compare`, `plansNote` | Sim |
| Números da página Sobre | `stats` | Sim |
| Perguntas frequentes | `faq` | Sim |

Para gerar as páginas de novo (só precisa do Node 18+ instalado):

```bash
node tools/build.mjs
```

### Adicionar um projeto novo ao portfólio

1. Tire três capturas do site, em WebP, e salve em `assets/portfolio/`:
   `<slug>-desktop.webp` (1600×1000), `<slug>-desktop-800.webp` (800×500), `<slug>-mobile.webp` (780×1688) e, se quiser o iPhone rolando a página inteira, `<slug>-page.webp` (390 de largura, altura até 9000).
2. Adicione o projeto em `portfolio` no `config.js`.
3. Rode `node tools/build.mjs`.

Se mudar o título principal ou o logo, gere de novo a imagem de compartilhamento e os ícones:

```bash
npm i -D playwright && npx playwright install chromium
node tools/generate-images.mjs
```

## Publicar

O site é só um monte de arquivos estáticos: não tem comando de build e a pasta de saída é a raiz do projeto.

### Cloudflare Pages (recomendado, gratuito)

1. Suba o projeto para um repositório no GitHub.
2. No painel da Cloudflare: **Workers & Pages → Create → Pages → Connect to Git** e escolha o repositório.
3. Em *Build settings*: Framework preset **None**, Build command **vazio**, Build output directory **`/`**. Clique em **Save and Deploy**. A Cloudflare já entende os endereços limpos (`/portfolio` abre `portfolio.html`).
4. Para usar o domínio: **Custom domains → Set up a custom domain → `gomdev.shop`**.
   - Se o domínio ainda não estiver na Cloudflare, ela pede para você trocar os *nameservers* no site onde comprou o `gomdev.shop` pelos dois que ela mostrar. A troca leva de minutos a algumas horas.
   - Adicione também `www.gomdev.shop` e crie um redirecionamento de `www` para o domínio principal (Rules → Redirect Rules), se quiser.

O arquivo `_headers` já configura segurança e cache na Cloudflare (e também na Netlify).

### Vercel (alternativa, gratuita)

1. Em vercel.com: **Add New → Project** e importe o repositório.
2. Framework Preset **Other**, sem Build Command, Output Directory **`.`** (raiz). **Deploy**.
3. Em **Settings → Domains**, adicione `gomdev.shop` e `www.gomdev.shop`.
4. No painel onde você comprou o domínio, crie os registros DNS que a Vercel mostrar (normalmente um registro `A` para `@` apontando para `76.76.21.21` e um `CNAME` para `www` apontando para `cname.vercel-dns.com`).

O `vercel.json` já configura endereços limpos, segurança e cache na Vercel.

Também funciona no GitHub Pages e na Netlify: é só apontar para a raiz do repositório.

### Depois de publicar

- Teste em https://pagespeed.web.dev/ e no celular.
- Cadastre o site no Google Search Console e envie `https://gomdev.shop/sitemap.xml`.
- Crie ou atualize o Perfil da Empresa no Google com o link do site (ajuda muito nas buscas locais).

## Antes de publicar, revise

- [ ] `WHATSAPP_NUMBER` em `js/config.js` (o número atual é fictício)
- [ ] Os links publicados de cada projeto em `portfolio[].url` (só o Garden Blue tem link hoje)
- [ ] O texto da página Sobre, no `tools/build.mjs` (escrevi uma história curta; ajuste para a sua)
- [ ] Preços, parcelamento e itens de cada plano (`plans`, `compare`, `plansNote`)
- [ ] Link e @ do Instagram (`instagram`)
- [ ] Se os clientes do portfólio concordam em aparecer no site

## Notas técnicas

- Fontes: SF Pro no iPhone e no Mac; nos outros aparelhos, Inter hospedada em `assets/fonts` (licença SIL OFL em `assets/fonts/OFL.txt`).
- Imagens do portfólio em WebP com `srcset`, carregamento sob demanda e tamanhos fixos (sem pulos na tela).
- Acessibilidade: navegação completa por teclado, "Pular para o conteúdo", contraste AA, janelas com `<dialog>` e animações desligadas para quem ativa "reduzir movimento".
