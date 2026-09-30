/* ==========================================================================
   gomdev — configuração do site
   --------------------------------------------------------------------------
   Este é o arquivo que você edita para trocar WhatsApp, preços, portfólio,
   textos de garantia e perguntas frequentes.

   • WhatsApp e Instagram: mudam na hora, é só salvar e publicar.
   • Planos, portfólio, dúvidas e demais listas: depois de salvar, rode
       node tools/build.mjs
     para gerar de novo as páginas HTML (só precisa ter o Node instalado).

   Dicas: textos ficam entre aspas; preços são números sem "R$" e sem ponto
   (ex.: 1890); nas mensagens, {plano}, {preco} e {projeto} são trocados
   sozinhos.
   ========================================================================== */

/* TROQUE AQUI: seu WhatsApp com 55 (Brasil) + DDD + número, só dígitos.
   Exemplo: (47) 98765-4321  →  "5547987654321". O número abaixo é FICTÍCIO. */
const WHATSAPP_NUMBER = "5547900000000";

window.SITE_CONFIG = {
  ownerName: "Gustavo",
  city: "Blumenau, SC",

  whatsapp: {
    number: WHATSAPP_NUMBER,
    messages: {
      default: "Olá, Gustavo! Vi o seu site e quero conversar sobre um site para o meu negócio.",
      plan: "Olá, Gustavo! Tenho interesse no plano {plano} (a partir de {preco}). Podemos conversar?",
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
  ribbon: "Agenda aberta para novos projetos. Sites a partir de R$ 990.",

  /* --------------------------------------------------------------------
     Portfólio
     - slug: nome do arquivo da página (projetos/<slug>.html) e das imagens
       em assets/portfolio/<slug>-desktop.webp, -mobile.webp, -page.webp
     - kind: "site" (site de cliente) ou "app" (aplicativo / sistema)
     - url: endereço publicado. TROQUE pelos links reais de cada projeto.
       Deixe "" se ainda não estiver no ar.
     - tint: cor principal do projeto (usada nos detalhes da página)
     - device: "both" mostra computador + celular; "phone" só celular
     -------------------------------------------------------------------- */
  portfolio: [
    {
      slug: "prince",
      name: "Prince Pet",
      kind: "site",
      category: "Hotel e creche para pets",
      city: "Blumenau, SC",
      tagline: "Todo pet tratado como realeza.",
      summary:
        "Site para hotel, creche, banho e tosa e piscina de pets no Centro de Blumenau, com agendamento direto pelo WhatsApp.",
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
      slug: "jc-auto-mecanica",
      name: "JC Auto Mecânica",
      kind: "site",
      category: "Oficina mecânica",
      city: "Gaspar, SC",
      tagline: "Seu carro em mãos de confiança.",
      summary:
        "Site para oficina de mecânica geral e injeção eletrônica no Gasparinho, com pedido de orçamento em um toque.",
      highlights: [
        "Painel de diagnóstico animado no topo",
        "Pedido de orçamento pronto no WhatsApp",
        "Aviso de pausa para almoço em tempo real",
        "Serviços organizados por tipo de problema",
      ],
      url: "",
      tint: "#e53935",
      device: "both",
    },
    {
      slug: "garden-blue",
      name: "Garden Blue",
      kind: "site",
      category: "Floricultura e garden center",
      city: "Gaspar, SC",
      tagline: "Seu jardim começa aqui.",
      summary:
        "Site para floricultura e garden center com vitrine de flores de época, plantas, vasos e serviço de paisagismo.",
      highlights: [
        "Ilustrações próprias no lugar de fotos de banco",
        "Vitrine de produtos com pedido pelo WhatsApp",
        "Seção sazonal de primavera",
        "Galeria e “Como chegar” com mapa",
      ],
      url: "https://t4voom.github.io/GardenBlue/",
      tint: "#e8672a",
      device: "both",
    },
    {
      slug: "barbearia-fk",
      name: "Estética & Barbearia FK",
      kind: "site",
      category: "Barbearia e estética",
      city: "Blumenau, SC",
      tagline: "Sua imagem, cuidada em cada detalhe.",
      summary:
        "Duas marcas em um só site: barbearia para eles e estética para elas, com tabela de preços e agendamento online.",
      highlights: [
        "Caminhos separados para barbearia e estética",
        "Tabela de serviços e preços sempre atualizada",
        "Agendamento online a partir do celular",
        "Visual escuro e elegante, com tipografia serifada",
      ],
      url: "",
      tint: "#c9a45c",
      device: "both",
    },
    {
      slug: "lucao",
      name: "Lucão Pet Shop",
      kind: "site",
      category: "Pet shop",
      city: "Blumenau, SC",
      tagline: "A gente cuida como se fosse nosso.",
      summary:
        "Site para pet shop com banho e tosa, hotel, creche, loja e leva e traz na Itoupava Seca.",
      highlights: [
        "Serviços para cães e gatos em cards com foto",
        "Leva e traz explicado passo a passo",
        "Horários e status de funcionamento automáticos",
        "Botões de WhatsApp, rota e ligação sempre à mão",
      ],
      url: "",
      tint: "#f06a1d",
      device: "both",
    },
    {
      slug: "forja",
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
     Serviços (fileira de ícones e página Serviços).
     icon: site, landing, store, calendar, app, care
     -------------------------------------------------------------------- */
  services: [
    { icon: "landing", name: "Página única", text: "Uma página bonita e direta ao ponto, para começar a ser encontrado." },
    { icon: "site", name: "Site completo", text: "Várias páginas com serviços, fotos, mapa, formulário e SEO local." },
    { icon: "store", name: "Loja virtual", text: "Vitrine de produtos com pedido pelo WhatsApp ou pagamento online." },
    { icon: "calendar", name: "Agendamento", text: "Horários marcados pelo celular, sem troca infinita de mensagens." },
    { icon: "app", name: "Apps e sistemas", text: "Ferramentas sob medida: treinos, entregas, controle interno." },
    { icon: "care", name: "Manutenção", text: "Atualizo textos, fotos e preços sempre que você precisar." },
  ],

  /* --------------------------------------------------------------------
     Planos e preços (valores sugeridos para pequenos negócios).
     compare: itens da tabela de comparação, na mesma ordem em todos
     -------------------------------------------------------------------- */
  plans: [
    {
      id: "essencial",
      name: "Essencial",
      tagline: "Para começar a ser encontrado.",
      price: 990,
      installments: "ou em até 10x no cartão",
      delivery: "7 dias úteis",
      features: [
        "Site de uma página, feito sob medida",
        "Perfeito no celular e no computador",
        "Botão direto para o seu WhatsApp",
        "Publicação com o seu domínio",
      ],
    },
    {
      id: "profissional",
      name: "Profissional",
      tagline: "Para aparecer no Google da sua cidade.",
      price: 1890,
      installments: "ou em até 10x no cartão",
      delivery: "14 dias úteis",
      featured: true,
      badge: "Mais escolhido",
      features: [
        "Tudo do Essencial",
        "Até 6 seções ou páginas",
        "Mapa, formulário e avaliações do Google",
        "SEO local para buscas da sua região",
      ],
    },
    {
      id: "completo",
      name: "Completo",
      tagline: "Para vender ou agendar pela internet.",
      price: 3490,
      installments: "ou em até 10x no cartão",
      delivery: "30 dias úteis",
      features: [
        "Tudo do Profissional",
        "Loja virtual ou agendamento online",
        "Painel para você atualizar sozinho",
        "Suporte estendido de 90 dias",
      ],
    },
  ],

  /* Tabela "Compare os planos": true = incluso, false = não incluso,
     texto = valor específico. Uma coluna por plano, na ordem acima. */
  compare: [
    { label: "Design exclusivo", values: [true, true, true] },
    { label: "Adaptado para celular", values: [true, true, true] },
    { label: "Botão de WhatsApp", values: [true, true, true] },
    { label: "Páginas ou seções", values: ["1 página", "Até 6", "Sem limite"] },
    { label: "Mapa e avaliações do Google", values: [false, true, true] },
    { label: "Formulário de contato", values: [false, true, true] },
    { label: "SEO local", values: [false, true, true] },
    { label: "Loja virtual ou agendamento", values: [false, false, true] },
    { label: "Painel para atualizar sozinho", values: [false, false, true] },
    { label: "Suporte após a publicação", values: ["30 dias", "30 dias", "90 dias"] },
    { label: "Prazo de entrega", values: ["7 dias úteis", "14 dias úteis", "30 dias úteis"] },
  ],

  plansNote:
    "Domínio (cerca de R$ 40 por ano) não incluso. Manutenção mensal opcional a partir de R$ 59.",

  /* --------------------------------------------------------------------
     Números da página Sobre. Use só o que é verdade hoje.
     "{projetos}" vira a quantidade de itens do portfólio.
     -------------------------------------------------------------------- */
  stats: [
    { value: "{projetos}", suffix: "", label: "projetos no portfólio, entre sites e aplicativos." },
    { value: 7, suffix: " dias", label: "para colocar um site Essencial no ar." },
    { value: 30, suffix: " dias", label: "de suporte grátis depois da publicação." },
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
      title: "Suporte depois da entrega.",
      detail:
        "Nos 30 dias após a publicação (90 no plano Completo), dúvidas e pequenos ajustes são por minha conta. Depois, a manutenção mensal é opcional.",
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
    { tag: "Dia 1", title: "Conversa", text: "Você me conta sobre o seu negócio e o que precisa. Pode ser por texto ou áudio." },
    { tag: "Até 2 dias", title: "Proposta e rascunho", text: "Você recebe uma proposta com valor fechado e o primeiro rascunho do visual." },
    { tag: "No seu ritmo", title: "Ajustes", text: "Você revisa no celular, pede mudanças e eu ajusto até ficar do jeito que imaginou." },
    { tag: "No ar", title: "Publicação e suporte", text: "Coloco o site no ar com o seu domínio e continuo por perto para o que precisar." },
  ],

  faq: [
    {
      q: "Quanto tempo leva para o site ficar pronto?",
      a: "Depende do plano: o Essencial fica pronto em até 7 dias úteis, o Profissional em até 14 e o Completo em até 30. O prazo começa quando você me envia os textos e as fotos.",
    },
    {
      q: "O que eu preciso enviar?",
      a: "O básico: logo (se tiver), fotos do seu negócio, a lista de serviços ou produtos e os contatos. Não tem fotos boas ou não sabe o que escrever? Eu ajudo com os textos e explico como tirar boas fotos com o celular.",
    },
    {
      q: "Como funcionam o domínio e a hospedagem?",
      a: "O domínio (por exemplo, seunegocio.com.br) fica no seu nome e custa cerca de R$ 40 por ano no Registro.br. A hospedagem eu configuro em um serviço rápido e confiável, que na maioria dos casos não tem custo mensal.",
    },
    {
      q: "E a manutenção depois que o site estiver no ar?",
      a: "Você tem 30 dias de suporte grátis (90 no plano Completo). Depois, pode contratar a manutenção mensal a partir de R$ 59 ou pedir ajustes avulsos só quando precisar.",
    },
    {
      q: "Quais são as formas de pagamento?",
      a: "Pix ou cartão de crédito em até 10x. O mais comum é 50% para começar e 50% na entrega, antes de o site ir para o ar.",
    },
    {
      q: "Vocês também fazem aplicativos?",
      a: "Sim. Além de sites, faço aplicativos e sistemas sob medida, como os apps de treino e de entregas do portfólio. O valor depende do que o app precisa fazer; me conta a ideia pelo WhatsApp.",
    },
  ],
};
