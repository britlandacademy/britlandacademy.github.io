/* Britland Academy: secao de planos do site (tres cartoes e seletor de forma de pagamento).
   Os valores seguem claude/planos-e-precos.md. Os descontos nunca acumulam: vale sempre o maior.
   Os links de checkout vem de js/billing-config.js; sem link, o botao abre o WhatsApp. */
(function(G){
'use strict';

var PLANS=[
  {k:'essential',    nome:'Essential',     BRL:260,  EUR:50},
  {k:'fluency-club', nome:'Fluency Club',  BRL:790,  EUR:168, hi:true},
  {k:'vip-intensive',nome:'VIP Intensive', BRL:1800, EUR:360}
];

var T={
pt:{best:'Mais escolhido',title:'Escolha seu plano',cta:'Começar com 2 aulas grátis',
    sub:'Comece com 2 aulas grátis. Você só decide depois.',mo:' /mês',
    nostack:'Os descontos não acumulam: aplicamos sempre o maior.',
    dupla:'Estuda com alguém? No Fluency Club, os dois ganham 10% enquanto os dois estiverem ativos.',
    first:'A cobrança começa na 3ª aula, a primeira regular. As 2 aulas de teste são grátis.',
    cur:'Moeda',per:'Forma de pagamento',
    tag:{'essential':'Até 4 alunos','fluency-club':'Até 2 alunos','vip-intensive':'Individual'},
    sublan:{'essential':'Ritmo leve, turma pequena','fluency-club':'Para falar com confiança',
            'vip-intensive':'Para quem tem prazo'},
    li:{'essential':['1 aula ao vivo por semana (50 min)','1 conversação em grupo por mês',
                     'App completo: lições, áudios e revisão','1 estágio completo em cerca de 6 meses'],
        'fluency-club':['2 aulas ao vivo por semana (50 min)','2 conversações em grupo por mês',
                     'App completo e correção dos seus erros','1 estágio completo em cerca de 3 meses'],
        'vip-intensive':['3 aulas particulares por semana (50 min)','Conversações do seu nível à vontade',
                     'Plano por estágio e suporte prioritário','1 estágio completo em cerca de 2 meses']},
    per_:{mensal:'Mensal',cartao6:'Cartão, 6 meses',avista3:'3 meses à vista',avista6:'6 meses à vista'},
    paynote:{mensal:'Cancele quando quiser',cartao6:'Cobrado todo mês, compromisso de 6 meses',
             avista3:'Pix ou Wise',avista6:'Pix ou Wise, o maior desconto'},
    paynote_e:{avista3:'Wise ou cartão',avista6:'Wise ou cartão, o maior desconto'},
    msg:function(p,per){return 'Olá! Quero começar minhas 2 aulas grátis na Britland Academy, no plano '+p+' ('+per+').';}},
en:{best:'Most popular',title:'Choose your plan',cta:'Start with 2 free lessons',
    sub:'Start with 2 free lessons. You only decide afterwards.',mo:' /month',
    nostack:'Discounts do not stack: we always apply the best one.',
    dupla:'Studying with someone? On the Fluency Club you both get 10% off while both stay active.',
    first:'Billing starts on your 3rd lesson, the first regular one. The 2 trial lessons are free.',
    cur:'Currency',per:'Payment option',
    tag:{'essential':'Up to 4 students','fluency-club':'Up to 2 students','vip-intensive':'One to one'},
    sublan:{'essential':'A lighter pace, small group','fluency-club':'To speak with confidence',
            'vip-intensive':'For a set deadline'},
    li:{'essential':['1 live lesson per week (50 min)','1 group conversation a month',
                     'Full app: lessons, audio and revision','1 full stage in about 6 months'],
        'fluency-club':['2 live lessons per week (50 min)','2 group conversations a month',
                     'Full app and tracking of your mistakes','1 full stage in about 3 months'],
        'vip-intensive':['3 private lessons per week (50 min)','Conversations at your level, as many as you like',
                     'Stage-by-stage plan and priority support','1 full stage in about 2 months']},
    per_:{mensal:'Monthly',cartao6:'Card, 6 months',avista3:'3 months upfront',avista6:'6 months upfront'},
    paynote:{mensal:'Cancel whenever you want',cartao6:'Charged every month, 6-month commitment',
             avista3:'Pix or Wise',avista6:'Pix or Wise, biggest discount'},
    paynote_e:{avista3:'Wise or card',avista6:'Wise or card, biggest discount'},
    msg:function(p,per){return 'Hello! I would like to start my 2 free lessons at Britland Academy, on the '+p+' plan ('+per+').';}}
};

function periods(cur){
  var P=[{k:'mensal',off:0,m:1}];
  P.push({k:'cartao6',off:cur==='BRL'?(Date.now()<Date.UTC(2026,11,1,3,0,0)?20:5):10,m:1});
  P.push({k:'avista3',off:5,m:3},{k:'avista6',off:Date.now()<Date.UTC(2026,11,1,3,0,0)?30:10,m:6});
  return P;
}
function money(cur,v){
  var s=Number(v||0).toFixed(2),i=s.split('.')[0],d=s.split('.')[1];
  i=i.replace(/\B(?=(\d{3})+(?!\d))/g,'.');
  return (cur==='BRL'?'R$ ':'€ ')+i+(d==='00'?'':','+d);
}
function el(t,a,c){var n=document.createElement(t);
  if(a)Object.keys(a).forEach(function(k){if(a[k]!=null)n.setAttribute(k,a[k]);});
  (Array.isArray(c)?c:[c]).forEach(function(x){if(x==null||x===false)return;
    n.append(x.nodeType?x:document.createTextNode(String(x)));});return n;}

var cur='BRL',per='avista6',lang='pt';

function plabel(L,k){return L.per_[k];}
function go(p){
  var slug=p.k+(cur==='BRL'?'-brl':'-eur');
  var ck=G.BL_BILLING?G.BL_BILLING.checkoutFor(slug):'';
  if(ck)return ck;
  var L=T[lang];
  return 'https://wa.me/5511914881274?text='+encodeURIComponent(L.msg(p.nome,plabel(L,per)));
}

function render(l){
  if(l)lang=l;
  var L=T[lang]||T.pt,host=document.getElementById('planbox');
  if(!host)return;
  var P=periods(cur);
  if(!P.some(function(x){return x.k===per;}))per='mensal';
  var pp=P.filter(function(x){return x.k===per;})[0];
  host.textContent='';

  /* moeda */
  var cs=el('div',{class:'cursel',role:'group','aria-label':L.cur});
  [['BRL','R$'],['EUR','\u20ac']].forEach(function(x){
    var b=el('button',{type:'button','aria-pressed':cur===x[0]?'true':'false'},x[1]);
    b.addEventListener('click',function(){cur=x[0];render();});cs.append(b);});
  host.append(el('div',{style:'text-align:center'},cs));

  /* forma de pagamento: vale para os tres cartoes */
  var ps=el('div',{class:'persel',role:'group','aria-label':L.per});
  P.forEach(function(x){
    var b=el('button',{type:'button','aria-pressed':x.k===per?'true':'false',title:(cur!=='BRL'&&L.paynote_e[x.k])||L.paynote[x.k]},plabel(L,x.k));
    if(x.off)b.append(' ',el('span',{class:'save'},'\u2212'+x.off+'%'));
    if((x.k==='avista6'||(x.k==='cartao6'&&cur==='BRL'))&&x.off>10)b.append(' ',el('span',{class:'save'},lang==='pt'?'at\u00e9 30/11':'until Nov 30'));
    b.addEventListener('click',function(){per=x.k;render();});ps.append(b);});
  host.append(el('div',{style:'text-align:center'},ps));

  var grid=el('div',{class:'price3'});
  PLANS.forEach(function(p){
    var full=p[cur],val=full*(1-pp.off/100);
    var c=el('div',{class:'plan'+(p.hi?' vip':'')});
    if(p.hi)c.append(el('span',{class:'badge'},L.best));
    var amt=el('div',{class:'amt'},[money(cur,val),el('small',{},L.mo)]);
    c.append(el('h3',{},p.nome),amt,
      el('div',{class:'per'},pp.off?el('span',{class:'was'},money(cur,full)):'\u00a0'),
      el('div',{},el('span',{class:'turma'},L.tag[p.k])),
      el('div',{class:'per',style:'margin-top:8px'},L.sublan[p.k]));
    var ul=el('ul',{});L.li[p.k].forEach(function(x){ul.append(el('li',{},x));});
    c.append(ul,el('a',{class:'btn'+(p.hi?'':' d'),href:go(p),target:'_blank',rel:'noopener'},L.cta));
    grid.append(c);});
  host.append(grid);

  host.append(el('p',{class:'note'},L.nostack+' '+L.dupla));
  host.append(el('p',{class:'note',style:'margin-top:6px'},((cur!=='BRL'&&L.paynote_e[per])||L.paynote[per])+'. '+L.first));
}

G.BL_PLANSITE={render:render,PLANS:PLANS};
})(window);
