/* ==========================================================================
   gomdev — configuração do site
   --------------------------------------------------------------------------
   Este é o ÚNICO arquivo que você precisa editar para trocar número de
   WhatsApp, preços, prazos, números da seção "Por que comigo", garantias,
   perguntas frequentes e links. O main.js lê tudo daqui e monta a página.

   Dicas:
   - Textos ficam entre aspas. Se precisar usar aspas dentro do texto,
     use aspas simples ou “aspas curvas”.
   - Preços são números sem "R$" e sem ponto de milhar (ex.: 1890).
   - Nas mensagens, {plano}, {preco} e {projeto} são trocados sozinhos.
   ========================================================================== */

/* TROQUE AQUI: seu WhatsApp com 55 (Brasil) + DDD + número, só dígitos.
   Exemplo: (47) 98765-4321  →  "5547987654321"
   O número abaixo é FICTÍCIO. */
const WHATSAPP_NUMBER = "5547900000000";

window.SITE_CONFIG = {
  /* Seu nome, usado nas mensagens prontas do WhatsApp. */
  ownerName: "Gustavo",

  whatsapp: {
    number: WHATSAPP_NUMBER,
    /* Mensagens que já chegam escritas quando o cliente clica. */
    messages: {
      default:
        "Olá, Gustavo! Vi o seu site e quero conversar sobre um site para o meu negócio.",
      plan:
        "Olá, Gustavo! Tenho interesse no plano {plano} (a partir de {preco}). Podemos conversar?",
      example:
        "Olá, Gustavo! Vi o exemplo {projeto} no seu site e quero algo parecido para o meu negócio.",
    },
    /* Prazo de resposta exibido perto dos botões. */
    responseTime: "Resposta em até 24h em dias úteis.",
  },

  /* TROQUE AQUI: o link do seu Instagram (valor de exemplo). */
  instagram: {
    url: "https://www.instagram.com/gomdev.shop/",
    handle: "@gomdev.shop",
  },

  /* Prazo de entrega do plano Essencial, em dias úteis.
     Aparece na seção "O que você recebe". Se mudar, confira também os
     prazos escritos em "plans", "stats" e "faq" logo abaixo. */
  deliveryDays: 7,

  /* --------------------------------------------------------------------
     Planos e preços (valores sugeridos para sites de pequenos negócios).
     - price: valor "a partir de", em reais.
     - featured: true destaca o card (use em apenas um plano).
     -------------------------------------------------------------------- */
  plans: [
    {
      id: "essencial",
      name: "Essencial",
      tagline: "Para começar a ser encontrado.",
      price: 990,
      installments: "ou em até 10x no cartão",
      features: [
        "Site de uma página, feito sob medida",
        "Perfeito no celular e no computador",
        "Botão direto para o seu WhatsApp",
        "Links para Instagram e redes sociais",
        "Publicação com o seu domínio",
        "Pronto em até 7 dias úteis",
      ],
    },
    {
      id: "profissional",
      name: "Profissional",
      tagline: "Para aparecer no Google da sua cidade.",
      price: 1890,
      installments: "ou em até 10x no cartão",
      featured: true,
      badge: "Mais escolhido",
      features: [
        "Tudo do Essencial",
        "Até 6 seções ou páginas",
        "Formulário de contato",
        "Mapa do Google com a sua localização",
        "SEO local: apareça em buscas da sua região",
        "Pronto em até 14 dias úteis",
      ],
    },
    {
      id: "completo",
      name: "Completo",
      tagline: "Para vender ou agendar pela internet.",
      price: 3490,
      installments: "ou em até 10x no cartão",
      features: [
        "Tudo do Profissional",
        "Loja virtual ou agendamento online",
        "Até 30 produtos ou serviços cadastrados",
        "Painel para você atualizar sozinho",
        "Suporte estendido de 90 dias",
        "Pronto em até 30 dias úteis",
      ],
    },
  ],

  /* Observação que aparece abaixo dos planos. */
  plansNote:
    "Domínio (cerca de R$ 40 por ano) não incluso. Manutenção mensal opcional a partir de R$ 59.",

  /* --------------------------------------------------------------------
     Seção "Por que comigo" — números animados.
     Use só promessas que você cumpre hoje (nada de histórico inventado).
     - value: número que conta de 0 até ele.
     - suffix: texto logo depois do número (ex.: "%", "h", " dias").
     -------------------------------------------------------------------- */
  stats: [
    { value: 7, suffix: " dias", label: "para colocar um site Essencial no ar." },
    { value: 100, suffix: "%", label: "adaptado para celular, tablet e computador." },
    { value: 30, suffix: " dias", label: "de suporte grátis depois da publicação." },
    { value: 24, suffix: "h", label: "no máximo para responder você, em dias úteis." },
  ],

  /* --------------------------------------------------------------------
     Garantias (no lugar de depoimentos).
     icon: "revisions", "speed" ou "support".
     -------------------------------------------------------------------- */
  guarantees: [
    {
      icon: "revisions",
      title: "Revisões até você aprovar",
      text:
        "Ajusto textos, cores e fotos quantas vezes forem necessárias, dentro do que combinamos, até você dizer: é isso.",
    },
    {
      icon: "speed",
      title: "Rápido no celular",
      text:
        "Seu site sai com nota acima de 90 no teste de velocidade do Google. Se não bater, eu ajusto sem custo.",
    },
    {
      icon: "support",
      title: "Suporte depois da entrega",
      text:
        "Nos 30 dias após a publicação, dúvidas e pequenos ajustes são por minha conta. Você não fica na mão.",
    },
  ],

  /* --------------------------------------------------------------------
     Perguntas frequentes.
     -------------------------------------------------------------------- */
  faq: [
    {
      q: "Quanto tempo leva para o site ficar pronto?",
      a: "Depende do plano: o Essencial fica pronto em até 7 dias úteis, o Profissional em até 14 e o Completo em até 30. O prazo começa a contar quando você me envia os textos e as fotos.",
    },
    {
      q: "O que eu preciso enviar?",
      a: "O básico: logo (se tiver), fotos do seu negócio, a lista de serviços ou produtos e os seus contatos. Não tem fotos boas ou não sabe o que escrever? Eu ajudo com os textos e explico como tirar boas fotos com o celular.",
    },
    {
      q: "Como funcionam o domínio e a hospedagem?",
      a: "O domínio (por exemplo, seunegocio.com.br) fica registrado no seu nome e custa cerca de R$ 40 por ano no Registro.br. A hospedagem eu configuro para você em um serviço rápido e confiável, que na maioria dos casos não tem custo mensal.",
    },
    {
      q: "E a manutenção depois que o site estiver no ar?",
      a: "Você tem 30 dias de suporte grátis (90 no plano Completo). Depois disso, pode contratar a manutenção mensal a partir de R$ 59 ou pedir ajustes avulsos só quando precisar.",
    },
    {
      q: "Quais são as formas de pagamento?",
      a: "Pix ou cartão de crédito em até 10x. O mais comum é 50% para começar e 50% na entrega, antes de o site ir para o ar.",
    },
    {
      q: "Como funciona a revisão?",
      a: "Você recebe um link para ver o site funcionando, no celular e no computador. Manda os ajustes pelo WhatsApp do jeito que for mais fácil (texto, áudio ou print) e eu faço. Repetimos até você aprovar.",
    },
  ],
};
