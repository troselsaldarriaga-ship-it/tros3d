const WA='573147201255';
const WAICON='<svg viewBox="0 0 32 32"><path d="M16 3C9 3 3.4 8.6 3.4 15.5c0 2.3.6 4.4 1.7 6.3L3 29l7.4-1.9c1.8 1 3.9 1.500 6 1.500 7 0 12.600-5.600 12.600-12.500S23 3 16 3zm0 22.800c-1.900 0-3.700-.5-5.300-1.500l-.4-.2-4.400 1.100 1.200-4.300-.3-.4a10 10 0 0 1-1.600-5.400C5.200 9.600 10 5 16 5s10.800 4.600 10.800 10.400S22 25.800 16 25.800zm5.900-7.700c-.3-.2-1.900-.9-2.200-1-.3-.1-.5-.2-.7.200s-.8 1-1 1.200c-.2.200-.4.200-.7.100-.3-.2-1.400-.5-2.600-1.600-1-.9-1.600-1.900-1.800-2.200-.2-.3 0-.5.100-.7l.5-.6c.1-.2.200-.3.300-.5.100-.2 0-.4 0-.6l-1-2.300c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.100-.9.400-.3.300-1.200 1.200-1.200 2.800s1.200 3.200 1.400 3.500c.2.200 2.400 3.700 5.800 5.100.8.3 1.400.5 1.900.7.8.3 1.500.2 2.100.1.600-.1 1.900-.8 2.200-1.500.3-.7.300-1.400.2-1.500l-.6-.3z"/></svg>';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(n);
const fin=p=>Math.round(p.price*(1-(p.discount||0)/100));
let C={logo:'logo.png',categories:[],products:[]};
const ld=()=>{try{return JSON.parse(localStorage.getItem('t3d_cart')||'{}')}catch(e){return{}}};
const S={cat:'all',q:'',cart:ld(),view:null,img:0,drawer:false,admin:location.hash==='#admin',canEdit:false,edit:null,busy:false};
const sv=()=>{try{localStorage.setItem('t3d_cart',JSON.stringify(S.cart))}catch(e){}};
const PH='data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#efe6d3"/><path d="M50 22l26 15v30L50 82 24 67V37z" fill="none" stroke="#b08968" stroke-width="3"/><path d="M24 37l26 15 26-15M50 52v30" fill="none" stroke="#b08968" stroke-width="3"/></svg>');
const im=p=>(p.images&&p.images[0])||PH;
const cnt=()=>Object.values(S.cart).reduce((a,b)=>a+b,0);
function toast(m){const t=document.createElement('div');t.className='toast';t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),2400)}

function card(p){const d=p.discount>0;return `<div class="card"><div class="ph" data-act="open" data-id="${p.id}">${d?`<span class="badge">-${p.discount}%</span>`:''}${p.featured?'<span class="star">★ Destacado</span>':''}<img loading="lazy" src="${esc(im(p))}" alt="${esc(p.name)}"></div><div class="info"><small>${esc(p.category)}</small><h3>${esc(p.name)}</h3><div class="price"><b>${fmt(fin(p))}</b>${d?`<s>${fmt(p.price)}</s>`:''}</div><button class="btn sm" data-act="add" data-id="${p.id}">Agregar al carrito</button></div></div>`}

function store(){
  let L=C.products.filter(p=>(S.cat==='all'||(S.cat==='feat'?p.featured:p.category===S.cat))&&(!S.q||(p.name+p.description).toLowerCase().includes(S.q.toLowerCase())));
  const chips=[['all','Todo'],['feat','★ Destacados'],...C.categories.map(c=>[c,c])].map(([k,l])=>`<button class="chip ${S.cat===k?'on':''}" data-act="cat" data-k="${esc(k)}">${esc(l)}</button>`).join('');
  return `<section class="hero wrap"><div><h1>Piezas únicas,<br>hechas capa por capa.</h1><p>Decoración, regalos y objetos útiles impresos en 3D con cariño. Elige tu favorito y pídelo por WhatsApp.</p><p><a href="#catalogo" class="btn" style="text-decoration:none;display:inline-block">Ver productos</a></p></div><div class="art"><img src="${C.logo}" alt="tros3d"></div></section>
  <main class="wrap" id="catalogo"><div class="sec"><h2>Categorías</h2></div><div class="chips">${chips}</div>
  <div class="sec"><h2>${S.cat==='all'?'Todos los productos':S.cat==='feat'?'Destacados':esc(S.cat)}</h2><input class="search" data-act="q" placeholder="Buscar…" value="${esc(S.q)}"></div>
  ${L.length?`<div class="grid">${L.map(card).join('')}</div>`:'<div class="empty">Aún no hay productos aquí 🌱</div>'}</main>
  <footer><div class="wrap">© tros3d · Impresiones 3D · <a href="https://wa.me/${WA}" style="color:inherit">WhatsApp 314 720 1255</a></div></footer>`}

function modal(){const p=C.products.find(x=>x.id===S.view);if(!p)return'';const imgs=p.images&&p.images.length?p.images:[PH];const d=p.discount>0;
  return `<div class="ov" data-act="close"><div class="modal" data-stop><button class="x" data-act="close">✕</button><div class="gal"><img class="main" src="${esc(imgs[S.img]||imgs[0])}" alt="">${imgs.length>1?`<div class="thumbs">${imgs.map((u,i)=>`<img class="${i===S.img?'on':''}" src="${esc(u)}" data-act="img" data-i="${i}">`).join('')}</div>`:''}</div><div class="txt"><small style="color:var(--acc2);text-transform:uppercase;letter-spacing:.08em">${esc(p.category)}</small><h2>${esc(p.name)}</h2><div class="price"><b style="font-size:1.5rem">${fmt(fin(p))}</b>${d?`<s>${fmt(p.price)}</s><span class="badge" style="position:static">-${p.discount}%</span>`:''}</div><p>${esc(p.description)}</p><button class="btn" data-act="add" data-id="${p.id}">Agregar al carrito</button><a class="wa" style="text-decoration:none" target="_blank" href="https://wa.me/${WA}?text=${encodeURIComponent('Hola tros3d! Me interesa: '+p.name)}">${WAICON.replace('<svg','<svg width="20" height="20" fill="#fff"')} Preguntar por WhatsApp</a></div></div></div>`}

function drawer(){const items=Object.entries(S.cart).map(([id,q])=>[C.products.find(p=>p.id===id),q]).filter(([p])=>p);const tot=items.reduce((a,[p,q])=>a+fin(p)*q,0);
  return `<div class="ov" style="place-items:stretch end;padding:0" data-act="closeD"></div><aside class="drawer"><div style="display:flex;justify-content:space-between;align-items:center"><h2>Tu carrito</h2><button class="x" style="position:static" data-act="closeD">✕</button></div><div class="list">${items.length?items.map(([p,q])=>`<div class="row"><img src="${esc(im(p))}"><div class="n"><b>${esc(p.name)}</b><br>${fmt(fin(p))}</div><div class="qty"><button data-act="dec" data-id="${p.id}">−</button>${q}<button data-act="add" data-id="${p.id}" data-q>+</button></div></div>`).join(''):'<div class="empty">Tu carrito está vacío</div>'}</div><div style="display:flex;justify-content:space-between;font-size:1.2rem;margin-bottom:12px"><span>Total</span><b>${fmt(tot)}</b></div>${items.length?`<button class="wa" data-act="order">${WAICON.replace('<svg','<svg width="22" height="22" fill="#fff"')} Pedir por WhatsApp</button><button class="btn ghost sm" style="width:100%;margin-top:8px" data-act="clear">Vaciar carrito</button>`:''}</aside>`}


function render(){
  const y=window.scrollY,q=document.activeElement&&document.activeElement.dataset&&document.activeElement.dataset.act==='q';
  $('#root').innerHTML=`<header><div class="wrap"><a class="brand" href="#" style="text-decoration:none;color:inherit"><img src="${C.logo}" alt="tros3d"><span>tros3d</span></a><button class="cartbtn" data-act="openD">🛒 Carrito${cnt()?`<b>${cnt()}</b>`:''}</button></div></header>${S.loading?'<div class="empty">Cargando…</div>':store()}<a class="fab" target="_blank" href="https://wa.me/${WA}?text=${encodeURIComponent('Hola tros3d! Quiero más información')}" aria-label="WhatsApp">${WAICON}</a>${S.view?modal():''}${S.drawer?drawer():''}`;
  if(q){const i=$('.search');i.focus();i.setSelectionRange(i.value.length,i.value.length)}window.scrollTo(0,y);
}
document.addEventListener('click',ev=>{
  const el=ev.target.closest('[data-act]');if(!el)return;const a=el.dataset.act,id=el.dataset.id;
  if(a==='close'&&el.classList.contains('ov')&&ev.target.closest('[data-stop]'))return;
  if(a==='cat'){S.cat=el.dataset.k;render()}
  else if(a==='open'){S.view=id;S.img=0;render()}
  else if(a==='close'){S.view=null;render()}
  else if(a==='img'){S.img=+el.dataset.i;render()}
  else if(a==='add'){S.cart[id]=(S.cart[id]||0)+1;sv();if(!el.hasAttribute('data-q'))toast('Agregado al carrito ✓');render()}
  else if(a==='dec'){S.cart[id]=(S.cart[id]||1)-1;if(S.cart[id]<=0)delete S.cart[id];sv();render()}
  else if(a==='openD'){S.drawer=true;render()}
  else if(a==='closeD'){S.drawer=false;render()}
  else if(a==='clear'){S.cart={};sv();render()}
  else if(a==='order'){const it=Object.entries(S.cart).map(([i,q])=>[C.products.find(p=>p.id===i),q]).filter(([p])=>p);const t=it.reduce((s,[p,q])=>s+fin(p)*q,0);
    const m='Hola tros3d! Quiero hacer este pedido:\n\n'+it.map(([p,q])=>`• ${q} x ${p.name} — ${fmt(fin(p)*q)}`).join('\n')+`\n\nTotal: ${fmt(t)}`;window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(m),'_blank')}
});
document.addEventListener('input',e=>{if(e.target.dataset.act==='q'){S.q=e.target.value;render()}});
(async()=>{
  S.loading=true;render();
  try{const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
    const [a,b]=await Promise.all([sb.from('categories').select('name').order('created_at'),sb.from('products').select('*').order('created_at',{ascending:false})]);
    if(a.error||b.error)throw (a.error||b.error);
    C.categories=a.data.map(x=>x.name);C.products=b.data.map(p=>({...p,price:+p.price,images:p.images||[]}));
  }catch(e){console.error(e);toast('No se pudo cargar la tienda')}
  S.loading=false;render();
})();
