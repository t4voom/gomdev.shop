# gomdev.shop

Site de uma página da gomdev: criação de sites para negócios locais em Blumenau, SC.
Feito com HTML, CSS e JavaScript puros: sem framework, sem build e sem dependências.

```
index.html           página principal
404.html             página de erro
css/style.css        estilos (cores, fontes e espaçamentos ficam no topo, em :root)
js/config.js         ← TUDO o que você vai querer mudar (WhatsApp, preços, textos)
js/main.js           monta planos, números, garantias e dúvidas a partir do config
assets/              logo, ícones, imagem de compartilhamento, fonte e mockups (SVG)
tools/               modelos para gerar de novo as imagens PNG/JPG (opcional)
robots.txt, sitemap.xml, site.webmanifest, favicon.ico
_headers, vercel.json  cabeçalhos de segurança e cache para a hospedagem
```

## Rodar no seu computador

Qualquer servidor estático serve. Na pasta do projeto:

```bash
python3 -m http.server 8080
# ou
npx serve .
```

Abra http://localhost:8080. Dá para abrir o `index.html` direto no navegador, mas os ícones da aba só aparecem com um servidor.

## Editar o conteúdo: `js/config.js`

Abra o arquivo em qualquer editor de texto. Cada bloco tem um comentário explicando o que é.

| O quê | Onde no `config.js` |
| --- | --- |
| Número do WhatsApp | `WHATSAPP_NUMBER`, na primeira linha: 55 + DDD + número, só dígitos (ex.: `"5547987654321"`) |
| Mensagens que chegam prontas no WhatsApp | `whatsapp.messages`. `{plano}`, `{preco}` e `{projeto}` são preenchidos sozinhos |
| Instagram | `instagram.url` e `instagram.handle` |
| Preços, nomes e itens dos planos | `plans` (preço em número, sem "R$" e sem ponto: `1890`) |
| Selo "Mais escolhido" | `badge` do plano com `featured: true` |
| Prazo em "O que você recebe" | `deliveryDays` |
| Números animados de "Por que comigo" | `stats` |
| Garantias | `guarantees` |
| Perguntas frequentes | `faq` |

Os outros textos (títulos, passos, exemplos de projeto) ficam direto no `index.html`.

Se mudar o título principal ou o logo, gere de novo a imagem de compartilhamento (`assets/og-image.jpg`) e os ícones (é preciso ter o Node instalado):

```bash
npm i -D playwright && npx playwright install chromium
node tools/generate-images.mjs
```

## Publicar

O site é só um monte de arquivos estáticos: não tem comando de build e a pasta de saída é a raiz do projeto.

### Cloudflare Pages (recomendado, gratuito)

1. Suba o projeto para um repositório no GitHub.
2. No painel da Cloudflare: **Workers & Pages → Create → Pages → Connect to Git** e escolha o repositório.
3. Em *Build settings*: Framework preset **None**, Build command **vazio**, Build output directory **`/`**. Clique em **Save and Deploy**.
4. Para usar o domínio: **Custom domains → Set up a custom domain → `gomdev.shop`**.
   - Se o domínio ainda não estiver na Cloudflare, ela pede para você trocar os *nameservers* no site onde comprou o `gomdev.shop` pelos dois que ela mostrar. A troca leva de minutos a algumas horas.
   - Adicione também `www.gomdev.shop` e crie um redirecionamento de `www` para o domínio principal (Rules → Redirect Rules), se quiser.

O arquivo `_headers` já configura segurança e cache na Cloudflare (e também na Netlify).

### Vercel (alternativa, gratuita)

1. Em vercel.com: **Add New → Project** e importe o repositório.
2. Framework Preset **Other**, sem Build Command, Output Directory **`.`** (raiz). **Deploy**.
3. Em **Settings → Domains**, adicione `gomdev.shop` e `www.gomdev.shop`.
4. No painel onde você comprou o domínio, crie os registros DNS que a Vercel mostrar (normalmente um registro `A` para `@` apontando para `76.76.21.21` e um `CNAME` para `www` apontando para `cname.vercel-dns.com`).

O `vercel.json` já configura segurança e cache na Vercel.

Também funciona no GitHub Pages e na Netlify: é só apontar para a raiz do repositório.

### Depois de publicar

- Teste em https://pagespeed.web.dev/ e no celular.
- Cadastre o site no Google Search Console e envie `https://gomdev.shop/sitemap.xml`.
- Crie ou atualize o Perfil da Empresa no Google com o link do site (ajuda muito nas buscas locais).

## Antes de publicar, revise

- [ ] `WHATSAPP_NUMBER` em `js/config.js` (o número atual é fictício)
- [ ] Preços, parcelamento e itens de cada plano (`plans` e `plansNote`)
- [ ] Link e @ do Instagram (`instagram`)
- [ ] Prazos: `deliveryDays`, os "Pronto em até…" dos planos, o primeiro item de `stats` e a primeira pergunta de `faq`
- [ ] Garantias e respostas das dúvidas: prometa só o que você cumpre
- [ ] Data em `sitemap.xml` (`lastmod`) quando fizer mudanças grandes

## Notas técnicas

- Fontes: usa a fonte do sistema da Apple (SF Pro) no iPhone e no Mac; nos outros aparelhos carrega a Inter, hospedada em `assets/fonts` (licença SIL OFL, em `assets/fonts/OFL.txt`).
- Todas as imagens da página são SVG desenhados à mão, leves e nítidos em qualquer tela. Os únicos arquivos raster são os ícones e a imagem de compartilhamento, que precisam ser PNG/JPG.
- Os projetos de exemplo (Aurora Pet, Lumen Odonto, Bruma Café, Nórdica Casa, Brasa Norte e Volta Elétrica) são fictícios e aparecem no site como "Exemplos de projeto".
- Acessibilidade: navegação completa por teclado, link "Pular para o conteúdo", contraste AA e animações desligadas para quem ativa "reduzir movimento" no aparelho.
- O cinza secundário `#86868b` só é usado em fundos escuros; em fundos claros ele fica abaixo do contraste mínimo, então lá usamos `#6e6e73`.
