/* Britland Academy: secao de planos do site (tabela comparativa + configurador com resumo).
   Os valores seguem claude/planos-e-precos.md. Os descontos nunca acumulam: vale sempre o maior.
   Os links de checkout vem de js/billing-config.js; sem link, o botao abre o WhatsApp. */
(function(G){
'use strict';

var PLANS=[
  {k:'essential',    nome:'Essential',     BRL:320,  EUR:60},
  {k:'fluency-club', nome:'Fluency Club',  BRL:790,  EUR:168, hi:true},
  {k:'vip-intensive',nome:'VIP Intensive', BRL:1800, EUR:360}
];

var T={
pt:{best:'Mais escolhido',per:'Por mês',build:'Monte seu plano',plan:'Plano',how:'Como pagar',
    more:'Ver outras formas de pagar',less:'Ver menos opções',sum:'Resumo',
    total:'Por mês',once:'Cobrança única',pick:'Escolher',
    cta:'Começar com 2 aulas grátis',
    nostack:'Os descontos não acumulam: aplicamos sempre o maior.',
    first:'A cobrança começa na 3ª aula, a primeira regular. As 2 aulas de teste são grátis.',
    dupla:'Estuda com alguém? No Fluency Club, os dois ganham 10% enquanto os dois estiverem ativos.',
    rows:[['Alunos por aula','Até 4','Até 2','Individual'],
          ['Aulas ao vivo por semana','1','2','3'],
          ['Conversação em grupo','1 por mês','2 por mês','À vontade'],
          ['App completo: lições, áudios e revisão','Sim','Sim','Sim'],
          ['Correção dos seus erros no app','—','Sim','Sim'],
          ['Plano por estágio e suporte prioritário','—','—','Sim'],
          ['1 estágio completo (25 aulas) em','cerca de 6 meses','cerca de 3 meses','cerca de 2 meses']],
    sublan:{'essential':'Ritmo leve, turma pequena','fluency-club':'Para falar com confiança',
            'vip-intensive':'Para quem tem prazo'},
    per_:{mensal:['Mensal','Cancele quando quiser'],
          cartao6:['Cartão, 6 meses','Cobrado todo mês, compromisso de 6 meses'],
          avista3:['3 meses à vista','Pix ou Wise'],
          avista6:['6 meses à vista','Pix ou Wise, o maior desconto']},
    per_e:{avista3:['3 meses à vista','Wise ou cartão'],
           avista6:['6 meses à vista','Wise ou cartão, o maior desconto']},
    msg:function(p,per){return 'Olá! Quero começar minhas 2 aulas grátis na Britland Academy, no plano '+p+' ('+per+').';}},
en:{best:'Most popular',per:'Per month',build:'Build your plan',plan:'Plan',how:'How to pay',
    more:'See other ways to pay',less:'Show fewer options',sum:'Summary',
    total:'Per month',once:'Charged once',pick:'Choose',
    cta:'Start with 2 free lessons',
    nostack:'Discounts do not stack: we always apply the best one.',
    first:'Billing starts on your 3rd lesson, the first regular one. The 2 trial lessons are free.',
    dupla:'Studying with someone? On the Fluency Club you both get 10% off while both stay active.',
    rows:[['Students per lesson','Up to 4','Up to 2','One to one'],
          ['Live lessons per week','1','2','3'],
          ['Group conversation','1 a month','2 a month','As many as you like'],
          ['Full app: lessons, audio and revision','Yes','Yes','Yes'],
          ['Tracking of your mistakes in the app','—','Yes','Yes'],
          ['Stage-by-stage plan and priority support','—','—','Yes'],
          ['1 full stage (25 lessons) in','about 6 months','about 3 months','about 2 months']],
    sublan:{'essential':'A lighter pace, small group','fluency-club':'To speak with confidence',
            'vip-intensive':'For a set deadline'},
    per_:{mensal:['Monthly','Cancel whenever you want'],
          cartao6:['Card, 6 months','Charged every month, 6-month commitment'],
          avista3:['3 months upfront','Pix or Wise'],
          avista6:['6 months upfront','Pix or Wise, biggest discount']},
    per_e:{avista3:['3 months upfront','Wise or card'],
           avista6:['6 months upfront','Wise or card, biggest discount']},
    msg:function(p,per){return 'Hello! I would like to start my 2 free lessons at Britland Academy, on the '+p+' plan ('+per+').';}}
};

function periods(cur){
  var P=[{k:'mensal',off:0,m:1}];
  if(cur==='BRL')P.push({k:'cartao6',off:5,m:1});
  P.push({k:'avista3',off:5,m:3},{k:'avista6',off:10,m:6});
  return P;
}
function money(cur,v){
  var s=Number(v||0).toFixed(2),i=s.split('.')[0],d=s.split('.')[1];
  i=i.replace(/\B(?=(\d{3})+(?!\d))/g,'.');
  return (cur==='BRL'?'R$ ':'€ ')+i+','+d;
}
function el(t,a,c){var n=document.createElement(t);
  if(a)Object.keys(a).forEach(function(k){if(a[k]!=null)n.setAttribute(k,a[k]);});
  (Array.isArray(c)?c:[c]).forEach(function(x){if(x==null||x===false)return;
    n.append(x.nodeType?x:document.createTextNode(String(x)));});return n;}

var cur='BRL',sel='fluency-club',per='mensal',open=false,lang='pt';

function label(L,cur,k){
  var a=(cur!=='BRL'&&L.per_e[k])||L.per_[k];return a;
}
function go(p){
  var slug=p.k+(cur==='BRL'?'-brl':'-eur');
  var ck=G.BL_BILLING?G.BL_BILLING.checkoutFor(slug):'';
  if(ck)return ck;
  var L=T[lang];
  return 'https://wa.me/5511914881274?text='+encodeURIComponent(L.msg(p.nome,label(L,cur,per)[0]));
}

function render(l){
  if(l)lang=l;
  var L=T[lang]||T.pt,host=document.getElementById('planbox');
  if(!host)return;
  if(cur!=='BRL'&&per==='cartao6')per='mensal';
  host.textContent='';

  /* seletor de moeda */
  var cs=el('div',{class:'cursel',role:'group','aria-label':lang==='pt'?'Moeda':'Currency'});
  [['BRL','R$'],['EUR','€']].forEach(function(x){
    var b=el('button',{type:'button','aria-pressed':cur===x[0]?'true':'false'},x[1]);
    b.addEventListener('click',function(){cur=x[0];render();});cs.append(b);});
  host.append(el('div',{style:'text-align:center'},cs));

  /* tabela comparativa: preco cheio por mes, para comparar o que cada plano entrega */
  var tb=el('table',{class:'cmp'}),hd=el('tr',{},el('th',{scope:'col'},''));
  PLANS.forEach(function(p){
    var th=el('th',{scope:'col',class:p.hi?'hi':null});
    if(p.hi)th.append(el('span',{class:'bst'},L.best));
    th.append(el('span',{class:'nm'},p.nome),el('span',{class:'p'},money(cur,p[cur])),
      el('span',{class:'sb'},L.sublan[p.k]));
    hd.append(th);});
  tb.append(el('thead',{},hd));
  var bd=el('tbody',{});
  L.rows.forEach(function(r){
    bd.append(el('tr',{},[el('th',{scope:'row'},r[0]),el('td',{},r[1]),
      el('td',{class:'hi'},r[2]),el('td',{},r[3])]));});
  var last=el('tr',{},el('td',{}));
  PLANS.forEach(function(p){
    var b=el('button',{type:'button',class:'btn'+(p.hi?'':' d')},L.pick);
    b.addEventListener('click',function(){sel=p.k;render();
      var c=document.getElementById('planbuild');if(c)c.scrollIntoView({behavior:'smooth',block:'start'});});
    last.append(el('td',{class:p.hi?'hi':null},b));});
  bd.append(last);tb.append(bd);
  var w=el('div',{class:'cmpw'});w.append(tb);host.append(w);

  /* no celular a tabela nao cabe: os mesmos dados viram cartoes empilhados */
  var cc=el('div',{class:'cmpcards'});
  PLANS.forEach(function(p,ci){
    var c=el('div',{class:'plan'+(p.hi?' vip':'')});
    if(p.hi)c.append(el('span',{class:'badge'},L.best));
    c.append(el('h3',{},p.nome),el('div',{class:'amt'},[money(cur,p[cur]),el('small',{},lang==='pt'?' /mês':' /month')]),
      el('div',{class:'per'},L.sublan[p.k]));
    var ul=el('ul',{});
    L.rows.forEach(function(r){var v=r[ci+1];if(v==='\u2014')return;
      ul.append(el('li',{},v==='Sim'||v==='Yes'?r[0]:r[0]+': '+v));});
    c.append(ul);
    var b=el('button',{type:'button',class:'btn'+(p.hi?'':' d')},L.pick);
    b.addEventListener('click',function(){sel=p.k;render();
      var g=document.getElementById('planbuild');if(g)g.scrollIntoView({behavior:'smooth',block:'start'});});
    c.append(b);cc.append(c);});
  host.append(cc);

  /* configurador: plano, periodo e resumo */
  var p0=PLANS.filter(function(x){return x.k===sel;})[0]||PLANS[1],full=p0[cur];
  var P=periods(cur),pp=P.filter(function(x){return x.k===per;})[0]||P[0];
  var val=full*(1-pp.off/100);

  host.append(el('h3',{class:'bh2',id:'planbuild'},L.build));
  var two=el('div',{class:'two'}),left=el('div',{});

  left.append(el('div',{class:'lb'},L.plan));
  var pr=el('div',{class:'pickrow'});
  PLANS.forEach(function(p){
    var b=el('button',{type:'button',class:p.k===sel?'on':null,'aria-pressed':p.k===sel?'true':'false'});
    b.append(el('span',{},[el('b',{},p.nome),el('small',{},L.sublan[p.k])]),
      el('span',{class:'pp'},money(cur,p[cur])));
    b.addEventListener('click',function(){sel=p.k;render();});pr.append(b);});
  left.append(pr);

  left.append(el('div',{class:'lb'},L.how));
  var show=open?P:[P[0],P[P.length-1]],pw=el('div',{class:'pickrow'});
  show.forEach(function(x){
    var lb=label(L,cur,x.k),b=el('button',{type:'button',class:x.k===per?'on':null,'aria-pressed':x.k===per?'true':'false'});
    var t=el('b',{},lb[0]);
    if(x.off)t.append(el('span',{class:'save'},'−'+x.off+'%'));
    b.append(el('span',{},[t,el('small',{},lb[1])]),
      el('span',{class:'pp'},money(cur,full*(1-x.off/100))));
    b.addEventListener('click',function(){per=x.k;render();});pw.append(b);});
  left.append(pw);
  var lk=el('button',{type:'button',class:'morelink'},open?L.less:L.more);
  lk.addEventListener('click',function(){open=!open;
    if(!open&&!show.some(function(x){return x.k===per;}))per='mensal';render();});
  left.append(lk);
  if(sel==='fluency-club')left.append(el('p',{class:'fine'},L.dupla));

  var sm=el('aside',{class:'sumbox'});
  sm.append(el('h3',{},L.sum));
  sm.append(el('div',{class:'r'},[el('span',{},p0.nome),el('span',{},money(cur,full))]));
  if(pp.off)sm.append(el('div',{class:'r d'},[el('span',{},label(L,cur,pp.k)[0]+' ('+pp.off+'%)'),
    el('span',{},'−'+money(cur,full-val))]));
  sm.append(el('div',{class:'r t'},[el('span',{},L.total),el('span',{},money(cur,val))]));
  if(pp.m>1)sm.append(el('div',{class:'r'},[el('span',{},L.once+' ('+pp.m+(lang==='pt'?' meses':' months')+')'),
    el('span',{},money(cur,val*pp.m))]));
  sm.append(el('a',{class:'btn',href:go(p0),target:'_blank',rel:'noopener'},L.cta));
  sm.append(el('p',{class:'fine'},L.nostack));
  sm.append(el('p',{class:'fine'},L.first));

  two.append(left,sm);host.append(two);
}

G.BL_PLANSITE={render:render,PLANS:PLANS};
})(window);
