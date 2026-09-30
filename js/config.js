/* ==========================================================================
   gomdev — configuração do site
   --------------------------------------------------------------------------
   Este é o arquivo que você edita para trocar WhatsApp, portfólio,
   textos de garantia e perguntas frequentes.

   • WhatsApp e Instagram: mudam na hora, é só salvar e publicar.
   • Planos, portfólio, dúvidas e demais listas: depois de salvar, rode
       node tools/build.mjs
     para gerar de novo as páginas HTML (só precisa ter o Node instalado).

   Dicas: textos ficam entre aspas; nas mensagens, {projeto} é trocado
   sozinho pelo nome do projeto.
   ========================================================================== */

/* Seu WhatsApp com 55 (Brasil) + DDD + número, só dígitos: (47) 99938-1495 */
const WHATSAPP_NUMBER = "5547999381495";

window.SITE_CONFIG = {
  ownerName: "Gustavo",
  city: "Blumenau, SC",

  whatsapp: {
    number: WHATSAPP_NUMBER,
    messages: {
      default: "Olá, Gustavo! Vi o seu site e quero conversar sobre um site para o meu negócio.",
      quote: "Olá, Gustavo! Quero um orçamento de landing page para o meu negócio.",
      project: "Olá, Gustavo! Vi o projeto {projeto} no seu portfólio e quero algo parecido para o meu negócio.",
    },
    responseTime: "Resposta em até 24h em dias úteis.",
  },

  /* TROQUE AQUI: o link do seu Instagram (valor de exemplo). */
  instagram: {
    url: "https://www.instagram.com/gomdev.shop/",
    handle: "@gomdev.shop",
  },

  /* Faixa de aviso no topo da página inicial (deixe "" para esconder). */
  ribbon: "Agenda aberta: sua landing page pronta em até 2 dias.",

  /* Prazo de entrega, usado nos textos do site. */
  delivery: "2 dias",

  /* --------------------------------------------------------------------
     Portfólio
     - slug: nome do arquivo da página (projetos/<slug>.html) e das imagens
       em assets/portfolio/<slug>-desktop.webp, -mobile.webp, -page.webp
     - kind: "site" (site de cliente) ou "app" (aplicativo / sistema)
     - url: endereço publicado. TROQUE pelos links reais de cada projeto.
       Deixe "" se ainda não estiver no ar.
     - tint: cor principal do projeto (usada nos detalhes da página)
     - device: "both" mostra computador + celular; "phone" só celular
     - hidden: true tira o projeto do site sem apagar (os apps estão assim
       enquanto você só faz sites simples; mude para false para mostrar)
     -------------------------------------------------------------------- */
  portfolio: [
    {
      slug: "patas-e-cia",
      name: "Patas & Cia",
      kind: "site",
      category: "Hotel e creche para pets",
      city: "Blumenau, SC",
      tagline: "Seu pet feliz, você tranquilo.",
      summary:
        "Site para hotel, creche, banho e tosa e piscina de pets, com agendamento direto pelo WhatsApp.",
      highlights: [
        "Status “Aberto agora” que muda sozinho conforme o horário",
        "Avaliações do Google em destaque",
        "Seções para creche, hotel, piscina e banho e tosa",
        "Barra fixa no celular com WhatsApp, rota e ligação",
      ],
      url: "",
      tint: "#0f9d8a",
      device: "both",
      featured: true,
    },
    {
      slug: "motor-certo",
      name: "Motor Certo",
      kind: "site",
      category: "Oficina mecânica",
      city: "Gaspar, SC",
      tagline: "Seu carro em mãos de confiança.",
      summary:
        "Site para oficina de mecânica geral e injeção eletrônica, com pedido de orçamento em um toque.",
      highlights: [
        "Visual escuro e forte, com a cor da marca",
        "Pedido de orçamento pronto no WhatsApp",
        "Aviso de pausa para almoço em tempo real",
        "Serviços organizados por tipo de problema",
      ],
      url: "",
      tint: "#e53935",
      device: "both",
    },
    {
      slug: "flor-de-ipe",
      name: "Flor de Ipê",
      kind: "site",
      category: "Floricultura e garden center",
      city: "Gaspar, SC",
      tagline: "Seu jardim começa aqui.",
      summary:
        "Site para floricultura e garden center com vitrine de flores, plantas, vasos, presentes e serviço de paisagismo.",
      highlights: [
        "Fotos grandes que valorizam flores e arranjos",
        "Vitrine de produtos com pedido pelo WhatsApp",
        "Destaque para entrega no mesmo dia",
        "Horários e “Como chegar” com mapa",
      ],
      url: "",
      tint: "#d63d7c",
      device: "both",
    },
    {
      slug: "navalha-nobre",
      name: "Navalha Nobre",
      kind: "site",
      category: "Barbearia e estética",
      city: "Blumenau, SC",
      tagline: "Sua imagem, cuidada em cada detalhe.",
      summary:
        "Barbearia e estética no mesmo site, com serviços bem explicados e agendamento online pelo celular.",
      highlights: [
        "Visual escuro e elegante, com tipografia serifada",
        "Serviços de barbearia e estética lado a lado",
        "Agendamento online a partir do celular",
        "Avaliações de clientes logo no início",
      ],
      url: "",
      tint: "#c9a45c",
      device: "both",
    },
    {
      slug: "cafe-enxaimel",
      name: "Café Enxaimel",
      kind: "site",
      category: "Cafeteria e confeitaria",
      city: "Blumenau, SC",
      tagline: "Café especial e cuca quentinha.",
      summary:
        "Site para cafeteria com cardápio, café colonial com reserva de mesa e pedidos para retirar pelo WhatsApp.",
      highlights: [
        "Cardápio organizado por cafés, doces e salgados",
        "Reserva de mesa para o café colonial",
        "Pedido para retirar direto no WhatsApp",
        "Tons quentes e tipografia clássica, com cara de casa",
      ],
      url: "",
      tint: "#c7682e",
      device: "both",
    },
    {
      slug: "forja",
      hidden: true,
      name: "FORJA",
      kind: "app",
      category: "Aplicativo de treino",
      city: "",
      tagline: "Treino, carga e evolução. Tudo no seu bolso.",
      summary:
        "Aplicativo para registrar treinos, acompanhar cargas e ver a evolução, que funciona até sem internet.",
      highlights: [
        "Instala no celular como um app (PWA)",
        "Funciona offline e sincroniza depois",
        "Conta própria com login seguro",
        "Termos de uso e política de privacidade",
      ],
      url: "",
      tint: "#ff9f0a",
      device: "phone",
    },
    {
      slug: "forja-trainer",
      hidden: true,
      name: "FORJA Trainer",
      kind: "app",
      category: "Sistema para academias",
      city: "",
      tagline: "Seus alunos treinam no FORJA. Você comanda o treino.",
      summary:
        "Painel para treinadores e academias montarem treinos, que aparecem na hora no app do aluno.",
      highlights: [
        "Todos os alunos da academia em um só lugar",
        "Treinos editados aqui chegam no app do aluno",
        "Histórico de peso e atividade de cada aluno",
        "Funciona no computador e no celular",
      ],
      url: "",
      tint: "#ff9f0a",
      device: "both",
    },
    {
      slug: "juliano-entregas",
      hidden: true,
      name: "Juliano Entregas",
      kind: "app",
      category: "Sistema de entregas",
      city: "",
      tagline: "Cada entrega registrada, mesmo sem sinal.",
      summary:
        "Aplicativo para registrar entregas, quilômetros e valores do dia, com sincronização automática com planilha.",
      highlights: [
        "Registro de entrega em poucos toques",
        "Funciona offline e sincroniza quando volta o sinal",
        "Fechamento do dia e relatórios",
        "Integração com Google Planilhas",
      ],
      url: "",
      tint: "#0a84ff",
      device: "phone",
    },
    {
      slug: "meu-treino",
      hidden: true,
      name: "Meu Treino",
      kind: "app",
      category: "Aplicativo de treino",
      city: "",
      tagline: "O treino do dia, sem pensar.",
      summary:
        "Aplicativo pessoal de academia com a sequência de treinos, calendário e painel de evolução.",
      highlights: [
        "Mostra o próximo treino da sequência",
        "Calendário de treinos feitos",
        "Painel com a evolução",
        "Instala no celular e funciona offline",
      ],
      url: "",
      tint: "#ff6a00",
      device: "phone",
    },
  ],

  /* --------------------------------------------------------------------
     O que vem em toda landing page (fileira de ícones e página Serviços).
     icon: landing, phone, whatsapp, pin, search, speed, lock, globe, pen, care
     -------------------------------------------------------------------- */
  services: [
    { icon: "landing", name: "Página única", text: "Tudo o que o cliente precisa saber em uma página bonita e direta ao ponto." },
    { icon: "phone", name: "Perfeita no celular", text: "Pensada primeiro para a tela pequena, onde o seu cliente está." },
    { icon: "whatsapp", name: "WhatsApp em um toque", text: "Botões com a mensagem já escrita. O cliente só toca em enviar." },
    { icon: "pin", name: "Mapa e rota", text: "Endereço com Google Maps e botão “Como chegar”." },
    { icon: "search", name: "Aparece no Google", text: "Títulos, descrições e dados certos para buscas da sua região." },
    { icon: "speed", name: "Carrega rápido", text: "Nota acima de 90 no teste de velocidade do Google." },
    { icon: "lock", name: "Seguro", text: "Cadeado de segurança (HTTPS) sem custo extra." },
    { icon: "globe", name: "Seu domínio", text: "seunegocio.com.br configurado e no seu nome." },
    { icon: "care", name: "Suporte para sempre", text: "Com a mensalidade, ajustes e dúvidas continuam por minha conta, sem prazo para acabar." },
  ],

  /* --------------------------------------------------------------------
     Números da página Sobre. Use só o que é verdade hoje.
     "{projetos}" vira a quantidade de itens do portfólio.
     -------------------------------------------------------------------- */
  stats: [
    { value: "{projetos}", suffix: "", label: "modelos de sites no portfólio, cada um para um tipo de negócio." },
    { value: 2, suffix: " dias", label: "no máximo para a sua landing page ficar pronta." },
    { value: "∞", suffix: "", label: "de suporte: com a mensalidade, eu cuido do seu site para sempre." },
    { value: 24, suffix: "h", label: "no máximo para responder você, em dias úteis." },
  ],

  /* Cards "Por que a gomdev" (o + abre os detalhes). */
  reasons: [
    {
      icon: "person",
      title: "Você fala direto com quem faz.",
      detail:
        "Sem agência, sem atendente, sem telefone sem fio. Quem responde o seu WhatsApp é quem desenha, programa e publica o seu site.",
    },
    {
      icon: "speed",
      title: "Rápido no celular, de verdade.",
      detail:
        "Todo site sai com nota acima de 90 no teste de velocidade do Google. Se não bater, eu ajusto sem custo. Cliente que espera carregar é cliente que vai embora.",
    },
    {
      icon: "clock",
      title: "Pronto em até 2 dias.",
      detail:
        "Do primeiro papo à landing page no ar em até 2 dias. Você vê o site funcionando antes de publicar e pede os ajustes que quiser.",
    },
    {
      icon: "revisions",
      title: "Revisões até você aprovar.",
      detail:
        "Você vê o site funcionando antes de ir para o ar e pede ajustes do jeito que for mais fácil: texto, áudio ou print. Repetimos até ficar do jeito que você quer.",
    },
    {
      icon: "chat",
      title: "Feito para virar conversa.",
      detail:
        "Cada página leva para o WhatsApp com a mensagem já escrita. O cliente não precisa pensar no que dizer, só tocar em enviar.",
    },
    {
      icon: "support",
      title: "Suporte para sempre.",
      detail:
        "Com a mensalidade, o suporte não acaba: ajustes, troca de textos e fotos, atualizações e dúvidas pelo WhatsApp continuam por minha conta enquanto o seu site existir. Você nunca fica sozinho com ele.",
    },
    {
      icon: "pin",
      title: "Daqui do Vale.",
      detail:
        "Moro em Blumenau e atendo negócios de Blumenau, Gaspar e região. Se preferir, a gente toma um café e conversa pessoalmente.",
    },
  ],

  /* Passo a passo (página Serviços). */
  steps: [
    { tag: "Hoje", title: "Conversa", text: "Você me conta sobre o seu negócio pelo WhatsApp e eu te passo o orçamento sem compromisso." },
    { tag: "Dia 1", title: "Primeira versão", text: "Monto a landing page com os seus textos, fotos e contatos, e te mando o link." },
    { tag: "Dia 2", title: "Ajustes", text: "Você revisa no celular, pede mudanças e eu ajusto até ficar do jeito que imaginou." },
    { tag: "No ar", title: "Publicação e suporte", text: "Coloco o site no ar com o seu domínio e, com a mensalidade, continuo cuidando dele para sempre." },
  ],

  faq: [
    {
      q: "Como funciona o orçamento?",
      a: "Cada negócio tem uma necessidade, então cada site tem o seu preço. Me chama no WhatsApp, conta o que você precisa e em poucos minutos eu te passo um orçamento fechado, sem compromisso.",
    },
    {
      q: "Quanto tempo leva para o site ficar pronto?",
      a: "Até 2 dias depois que você me envia os textos, as fotos e os contatos. Se precisar de ajuda com os textos, eu também faço.",
    },
    {
      q: "O que eu preciso enviar?",
      a: "O básico: logo (se tiver), fotos do seu negócio, a lista de serviços ou produtos e os contatos. Não tem fotos boas ou não sabe o que escrever? Eu ajudo com os textos e explico como tirar boas fotos com o celular.",
    },
    {
      q: "O que é uma landing page?",
      a: "É um site de uma página só, feito para apresentar o seu negócio e levar o cliente direto para o WhatsApp. Tem tudo o que importa: quem você é, o que oferece, fotos, avaliações, endereço e contato.",
    },
    {
      q: "Como funcionam o domínio e a hospedagem?",
      a: "O domínio (por exemplo, seunegocio.com.br) fica no seu nome e é renovado uma vez por ano direto no Registro.br. A hospedagem eu configuro em um serviço rápido e confiável, que na maioria dos casos não tem custo mensal.",
    },
    {
      q: "E depois que o site estiver no ar?",
      a: "O suporte continua para sempre, com uma mensalidade: ajustes, troca de textos, fotos e horários, atualizações e dúvidas pelo WhatsApp. Você só me chama quando precisar, sem pagar nada a mais por cada mudança.",
    },
    {
      q: "Tem mensalidade?",
      a: "Tem, e é ela que garante que o seu site nunca fica abandonado. Com a mensalidade, eu cuido do site para sempre: mantenho no ar, faço os ajustes que você pedir e resolvo qualquer problema. O valor já vem no orçamento, sem surpresa.",
    },
    {
      q: "Vocês fazem loja virtual ou sistema?",
      a: "Por enquanto estou focado em sites simples, como landing pages, para entregar rápido e bem feito. Se você precisa de algo maior, me chama que eu te digo o melhor caminho.",
    },
  ],
};
