/* Britland Academy: configuracao da assinatura online.
   ENABLE_AUTO_CHECKOUT = false  -> os botoes dos planos abrem o fluxo atual (WhatsApp com a mensagem pre-preenchida).
   ENABLE_AUTO_CHECKOUT = true   -> os botoes vao para o checkout_url do plano (Stripe Payment Link ou link de assinatura do Asaas).
   Se o plano ainda nao tem checkout_url, o botao continua abrindo o WhatsApp (nunca fica sem destino).
   Os mesmos links devem estar em billing_plans.checkout_url no Supabase (slug igual ao daqui). */
(function (G) {
  var BILLING = {
    ENABLE_AUTO_CHECKOUT: false,
    /* chave = slug do plano em billing_plans; o botao do site usa data-plan="<slug>" */
    plans: {
      vip:   { slug: 'vip',   checkout_url: '' },
      group: { slug: 'group', checkout_url: '' },
      /* planos oficiais por regiao: -brl = Asaas (R$), -eur = Stripe (EUR). Preencher o link quando a conta existir. */
      'essential-brl':         { slug: 'essential-brl',         checkout_url: '' },
      'fluency-club-brl':      { slug: 'fluency-club-brl',      checkout_url: '' },
      'vip-intensive-brl':     { slug: 'vip-intensive-brl',     checkout_url: '' },
      'essential-eur':         { slug: 'essential-eur',         checkout_url: '' },
      'fluency-club-eur':      { slug: 'fluency-club-eur',      checkout_url: '' },
      'vip-intensive-eur':     { slug: 'vip-intensive-eur',     checkout_url: '' }
    },
    /* devolve o link de checkout do plano, ou '' para usar o fluxo atual (WhatsApp/matricula) */
    checkoutFor: function (key) {
      var p = this.plans[key];
      return this.ENABLE_AUTO_CHECKOUT && p && /^https:\/\//.test(p.checkout_url || '') ? p.checkout_url : '';
    }
  };
  G.BL_BILLING = BILLING;
})(window);
