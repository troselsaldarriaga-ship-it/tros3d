const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(n);
const fin=p=>Math.round(p.price*(1-(p.discount||0)/100));
const S={user:null,cats:[],prods:[],edit:null,busy:false};
function toast(m){const t=document.createElement('div');t.className='toast';t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),2600)}
async function refresh(){const [a,b]=await Promise.all([sb.from('categories').select('name').order('created_at'),sb.from('products').select('*').order('created_at',{ascending:false})]);S.cats=(a.data||[]).map(x=>x.name);S.prods=(b.data||[]).map(p=>({...p,price:+p.price,images:p.images||[]}));render()}
async function shrink(f){const i=await createImageBitmap(f);const k=Math.min(1,1200/Math.max(i.width,i.height));const c=document.createElement('canvas');c.width=Math.round(i.width*k);c.height=Math.round(i.height*k);c.getContext('2d').drawImage(i,0,0,c.width,c.height);return new Promise(r=>c.toBlob(r,'image/webp',.85))}
function render(){
  if(!S.user){$('#root').innerHTML=`<main class="wrap"><div class="panel" style="max-width:380px;margin:60px auto"><div style="text-align:center"><img src="logo.png" style="height:90px;mix-blend-mode:multiply"></div><h2 style="text-align:center">Panel de control</h2><br><div class="f" style="grid-template-columns:1fr"><label>Usuario<input id="em" type="text" autocomplete="username" autocapitalize="none"></label><label>Contraseña<input id="pw" type="password" autocomplete="current-password"></label></div><br><button class="btn" style="width:100%" data-act="login">Entrar</button></div></main>`;return}
  const e=S.edit;
  const form=e?`<div class="panel"><h3>${e.id?'Editar producto':'Nuevo producto'}</h3><br><div class="f"><label class="full">Nombre<input id="f-name" value="${esc(e.name)}"></label><label>Precio (COP)<input id="f-price" type="number" min="0" value="${e.price??''}"></label><label>Descuento (%)<input id="f-disc" type="number" min="0" max="90" value="${e.discount||0}"></label><label>Categoría<select id="f-cat">${S.cats.map(c=>`<option ${c===e.category?'selected':''}>${esc(c)}</option>`).join('')}</select></label><label style="display:flex;gap:8px;align-items:center;flex-direction:row"><input id="f-feat" type="checkbox" ${e.featured?'checked':''}> Mostrar en Destacados</label><label class="full">Descripción<textarea id="f-desc" rows="4">${esc(e.description)}</textarea></label><label class="full">Imágenes<input id="f-files" type="file" accept="image/*" multiple></label><div class="full prev" id="f-prev">${(e.images||[]).map(u=>`<div class="t" data-url="${esc(u)}"><img src="${esc(u)}"><button data-act="rmimg">✕</button></div>`).join('')}</div></div><br><button class="btn" data-act="save" ${S.busy?'disabled':''}>${S.busy?'Guardando…':'Guardar'}</button> <button class="btn ghost" data-act="cancel">Cancelar</button></div>`:'';
  $('#root').innerHTML=`<main class="wrap"><div class="sec"><h2>Panel de control</h2><div><button class="btn" data-act="new">+ Nuevo producto</button> <a class="btn ghost" href="index.html">Ver tienda</a> <button class="btn ghost" data-act="logout">Salir</button></div></div>${form}
  <div class="panel"><h3>Categorías</h3><div class="chips" style="flex-wrap:wrap;margin-top:10px">${S.cats.map(c=>`<span class="chip">${esc(c)} <a data-act="delcat" data-k="${esc(c)}" style="cursor:pointer;color:var(--red)">✕</a></span>`).join('')}</div><div style="display:flex;gap:8px;margin-top:6px"><input class="search" id="newcat" placeholder="Nueva categoría (ej. Halloween)"><button class="btn sm" data-act="addcat">Agregar</button></div></div>
  <div class="panel"><h3>Productos (${S.prods.length})</h3>${S.prods.map(p=>`<div class="row"><img src="${esc(p.images[0]||'')}"><div class="n"><b>${esc(p.name)}</b> ${p.featured?'★':''}<br><small>${esc(p.category)} · ${fmt(fin(p))}${p.discount?` (−${p.discount}%)`:''}</small></div><button class="btn ghost sm" data-act="edit" data-id="${p.id}">Editar</button> <button class="btn red sm" data-act="del" data-id="${p.id}">Borrar</button></div>`).join('')||'<div class="empty">Sin productos</div>'}</div></main>`}
document.addEventListener('click',async ev=>{
  const el=ev.target.closest('[data-act]');if(!el)return;const a=el.dataset.act,id=el.dataset.id;
  try{
  if(a==='login'){if($('#em').value.trim().toLowerCase()!=='alfredo'||$('#pw').value!=='Alfredo-8')return toast('Usuario o contraseña incorrectos');try{localStorage.setItem('t3d_ok','1')}catch(e){}S.user={};await dbLogin();await refresh()}
  else if(a==='logout'){try{localStorage.removeItem('t3d_ok')}catch(e){}try{await sb.auth.signOut()}catch(e){}S.user=null;render()}
  else if(a==='new'){S.edit={name:'',price:'',discount:0,category:S.cats[0],description:'',images:[],featured:false};render();scrollTo(0,0)}
  else if(a==='edit'){S.edit=JSON.parse(JSON.stringify(S.prods.find(p=>p.id===id)));render();scrollTo(0,0)}
  else if(a==='cancel'){S.edit=null;render()}
  else if(a==='rmimg'){el.parentElement.remove()}
  else if(a==='del'){if(confirm('¿Borrar este producto?')){const {error}=await sb.from('products').delete().eq('id',id);if(error)throw error;toast('Producto borrado');await refresh()}}
  else if(a==='addcat'){const v=$('#newcat').value.trim();if(v){const {error}=await sb.from('categories').insert({name:v});if(error)throw error;await refresh()}}
  else if(a==='delcat'){if(confirm('¿Borrar la categoría "'+el.dataset.k+'"? Los productos no se borran.')){const {error}=await sb.from('categories').delete().eq('name',el.dataset.k);if(error)throw error;await refresh()}}
  else if(a==='save'){
    const name=$('#f-name').value.trim(),pr=$('#f-price').value;if(!name||pr===''){return toast('Escribe nombre y precio')}
    el.disabled=true;el.textContent='Subiendo…';
    const images=[...document.querySelectorAll('#f-prev .t')].map(t=>t.dataset.url);
    for(const f of [...$('#f-files').files]){const blob=await shrink(f);const path=Date.now()+'-'+Math.random().toString(36).slice(2,7)+'.webp';const {error}=await sb.storage.from('products').upload(path,blob,{contentType:'image/webp',cacheControl:'31536000'});if(error)throw error;images.push(sb.storage.from('products').getPublicUrl(path).data.publicUrl)}
    const row={name,price:+pr,discount:Math.min(90,Math.max(0,+$('#f-disc').value||0)),category:$('#f-cat').value,description:$('#f-desc').value.trim(),images,featured:$('#f-feat').checked};
    const q=S.edit.id?sb.from('products').update(row).eq('id',S.edit.id):sb.from('products').insert(row);const {error}=await q;if(error)throw error;
    S.edit=null;toast('Guardado ✓');await refresh()}
  }catch(e){toast(/row-level|policy|permission/i.test(e.message||'')?'Supabase no deja guardar: falta habilitar la escritura (ver instrucciones)':'Error: '+(e.message||e));render()}
});
async function dbLogin(){try{const c={email:'alfredo@tros3d.com',password:'Alfredo-8'};const {data}=await sb.auth.getSession();if(data.session)return;const r=await sb.auth.signInWithPassword(c);if(r.error)await sb.auth.signUp(c)}catch(e){}}
try{S.user=localStorage.getItem('t3d_ok')?{}:null}catch(e){}
S.user?dbLogin().then(refresh):render();
