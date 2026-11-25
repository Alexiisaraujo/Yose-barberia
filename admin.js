const BU="https://www.gstatic.com/firebasejs/10.12.2/";
const $=s=>document.querySelector(s),ok=!!FIREBASE_CONFIG.apiKey;
const[A,Fs]=ok?await Promise.all([import(BU+"firebase-app.js"),import(BU+"firebase-firestore.js")]):[{},{}];
const{initializeApp}=A,{getFirestore,doc,getDoc,setDoc,collection,getDocs,query,orderBy,limit,updateDoc}=Fs;const app=ok?initializeApp(FIREBASE_CONFIG):null,db=ok?getFirestore(app):null;
const{getAuth,onAuthStateChanged,signInWithEmailAndPassword,signOut,sendPasswordResetEmail}=ok?await import(BU+"firebase-auth.js"):{};const auth=ok?getAuth(app):null;
const merge=(a,b)=>{for(const k in b)a[k]=b[k]&&typeof b[k]==="object"&&!Array.isArray(b[k])?merge(a[k]||{},b[k]):b[k];return a};
const e=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const toast=t=>{$("#msg").textContent=t;setTimeout(()=>$("#msg").textContent="",3500)};
const L=n=>`<i data-lucide="${n}"></i>`;let S=structuredClone(D),tab="tema";
const get=p=>p.split(".").reduce((o,k)=>o?.[k],S),set=(p,v)=>{const k=p.split("."),l=k.pop();k.reduce((o,x)=>o[x],S)[l]=v};
const I=(l,p,t="text")=>`<label>${l}<input type="${t}" data-p="${p}" value="${e(get(p))}"></label>`;
const T=(l,p,r=2)=>`<label>${l}<textarea rows="${r}" data-p="${p}">${e(get(p))}</textarea></label>`;
const Sel=(l,p,o)=>`<label>${l}<select data-p="${p}">${o.map(x=>[].concat(x)).map(([v,n=v])=>`<option value="${e(v)}" ${get(p)==v?"selected":""}>${n}</option>`).join("")}</select></label>`;
const R=(l,p,a,b,s)=>`<label>${l}: <b>${get(p)}</b><input type="range" min="${a}" max="${b}" step="${s}" data-p="${p}" value="${get(p)}"></label>`;
const C=(l,p)=>`<label class="chk" style="color:#f2f2f2"><input type="checkbox" data-p="${p}" ${get(p)!==false?"checked":""}>${l}</label>`;
const MV=(l,i,del=1)=>`<span class="mv"><button data-mv="${l}:${i}:-1">${L("arrow-up")}</button><button data-mv="${l}:${i}:1">${L("arrow-down")}</button>${del?`<button data-del="${l}:${i}">${L("trash-2")}</button>`:""}</span>`;
const IMG=(l,p)=>{const v=get(p)||"",d=v.startsWith("data:");return`<div class="im"><div class="th" style="background-image:url('${e(v)}')"></div><div><label style="margin:0">${l}</label><input data-p="${p}" placeholder="${d?"Foto do aparelho":"URL da imagem"}" value="${d?"":e(v)}"><label class="up">${L("camera")}Escolher foto<input type="file" accept="image/*" data-img="${p}" hidden></label></div></div>`};
const rz=(f,mx,ty)=>new Promise((resolve,reject)=>{const i=new Image(),url=URL.createObjectURL(f);i.onload=()=>{try{const scale=Math.min(1,mx/Math.max(i.width,i.height)),c=document.createElement("canvas");c.width=Math.max(1,Math.round(i.width*scale));c.height=Math.max(1,Math.round(i.height*scale));const ctx=c.getContext("2d");if(!ctx)throw new Error("Canvas no disponible");ctx.drawImage(i,0,0,c.width,c.height);resolve(c.toDataURL(ty,.72))}catch(err){reject(err)}finally{URL.revokeObjectURL(url)}};i.onerror=()=>{URL.revokeObjectURL(url);reject(new Error("No se pudo leer la imagen"))};i.src=url});
const TX={Hero:"heroKicker:Texto pequeno,h1a:Título linha 1,h1b:Título linha 2,h1c:Título linha 3 (dourada),heroLead:Subtítulo,perk1:Destaque 1,perk2:Destaque 2,perk3:Destaque 3",Serviços:"servEyebrow:Texto pequeno,servA:Título,servB:Título dourado,servSub:Subtítulo",Sobre:"sobreEyebrow:Texto pequeno,sobreA:Título,sobreB:Título dourado,sobreTexto:Texto",Galeria:"galEyebrow:Texto pequeno,galA:Título,galB:Título dourado",Diferenciais:"porqEyebrow:Texto pequeno,porqA:Título,porqB:Título dourado",Avaliações:"revEyebrow:Texto pequeno,revA:Título,revB:Título dourado",Regiões:"regEyebrow:Texto pequeno,regA:Título,regB:Título dourado","Chamada final":"ctaA:Título,ctaB:Título dourado,ctaSub:Subtítulo",Rodapé:"footTag:Frase,footLoc:Local"};
const SEC={hero:"Hero",servicos:"Serviços",sobre:"Sobre o Yose",galeria:"Galeria",porque:"Por que escolher",reviews:"Avaliações",regioes:"Regiões",amazon:"Produtos recomendados",cta:"Chamada final"};
const FN=["Montserrat","Inter","Playfair Display","Cormorant Garamond","Poppins","Raleway"],IO=["wa","ig","tt","phone","mail","link"].map(k=>[k,{wa:"WhatsApp",ig:"Instagram",tt:"TikTok",phone:"Telefone",mail:"E-mail",link:"Link"}[k]]);
const NB={wa:["wa","WhatsApp","wa","cta","solid",""],ig:["link","Instagram","ig","footer","solid","https://instagram.com/"],tt:["link","TikTok","tt","footer","solid","https://tiktok.com/@"],phone:["link","Ligar","phone","hero","ghost","tel:+55"],link:["link","Novo link","link","cta","ghost","https://"]};
const TPN={amazon:"Amazon",ml:"Mercado Livre",propria:"Loja própria",whatsapp:"WhatsApp",outro:"Outro"},TPB={amazon:"COMPRAR NA AMAZON →",ml:"COMPRAR NO MERCADO LIVRE →",propria:"COMPRAR AGORA →",whatsapp:"PEDIR PELO WHATSAPP →",outro:"VER PRODUTO →"};
const TPS=[["amazon","Amazon"],["ml","Mercado Livre"],["propria","Loja própria"],["whatsapp","WhatsApp"],["outro","Outro"]];
const hostOf=u=>{try{return new URL(String(u).trim()).hostname.toLowerCase()}catch{return""}};
const urlOk=u=>{try{const x=new URL(String(u).trim());return/^https?:$/.test(x.protocol)&&/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(x.hostname)&&!/^\d+(\.\d+){3}$/.test(x.hostname)}catch{return false}};
const SHOP=/(^|\.)(amazon\.[a-z.]{2,6}|amzn\.(to|com|eu|asia)|a\.co|mercadolivre\.com(\.br)?|mercadolibre\.[a-z.]{2,6}|meli\.(la|com)|wa\.me|whatsapp\.com)$/i;
const imgOk=u=>/^data:image\//i.test(u||"")||(urlOk(u)&&!SHOP.test(hostOf(u)));
const kindOf=u=>{const h=hostOf(u);return/(^|\.)(amazon\.|amzn\.)|^a\.co$/.test(h)?"amazon":/(^|\.)(mercadoli(vre|bre)\.|meli\.)/.test(h)?"ml":/(^|\.)(wa\.me|whatsapp\.com)$/.test(h)?"whatsapp":""};
const wn=m=>`<p class="w">${L("triangle-alert")}${m}</p>`;
const linkInfo=(u,tp)=>{u=(u||"").trim();if(!u)return"";if(!urlOk(u))return wn("Link inválido. Precisa começar com https://");let t="";const k=kindOf(u),x=new URL(u);
if(x.protocol==="http:")t+=wn("Link sem https. Prefira https://");
if(k&&k!==tp)t+=wn(`O link parece ser de ${TPN[k]}, mas o tipo está como ${TPN[tp]}.`);
if(k==="amazon"&&/(^|\.)amazon\./i.test(x.hostname)&&!x.searchParams.get("tag"))t+=wn("Link da Amazon sem tag= (seu ID de afiliado). Se for link curto (amzn.to), ignore este aviso.");
return t+`<a class="up" href="${e(u)}" target="_blank" rel="noopener noreferrer">${L("external-link")}Testar link</a>`};
const imgLoads=(u,ms=9000)=>new Promise(r=>{if(/^data:/i.test(u))return r(true);const i=new Image(),t=setTimeout(()=>r(false),ms);i.referrerPolicy="no-referrer";i.onload=()=>{clearTimeout(t);r(true)};i.onerror=()=>{clearTimeout(t);r(false)};i.src=u});
const pfErr=d=>{if(!d.name)return"Escreva o nome do produto.";if(!d.img)return"Cole o link da foto do produto.";if(!imgOk(d.img))return urlOk(d.img)?"Esse link parece ser de uma loja, não de uma foto. Cole o endereço direto da imagem (botão direito na foto > Copiar endereço da imagem).":"O link da foto não é válido. Ele precisa começar com https://";if(!d.url)return"Cole o link de compra ou de afiliado.";if(!urlOk(d.url))return"O link de compra não é válido. Ele precisa começar com https:// (ou http://).";if(d.img===d.url)return"A foto e o link de compra precisam ser endereços diferentes.";return""};
const amzCheck=pub=>{const it=S.amazon?.items||[];for(let i=0;i<it.length;i++){const p=it[i];p.url=(p.url||"").trim();p.img=(p.img||"").trim();p.name=(p.name||"").trim();const n=p.name||"Produto "+(i+1);if(p.url&&!urlOk(p.url))return`"${n}": o link de compra não é válido.`;if(p.img&&!imgOk(p.img))return`"${n}": o link da foto não é válido (ou é um link de loja).`;if(pub&&S.amazon.on!==false&&p.st==="pub"&&(!p.url||!p.name||!p.img))return`"${n}": falta nome, foto ou link. Complete ou deixe oculto.`}return""};
const fixO=()=>{if(!S.order.includes("amazon")){const k=S.order.indexOf("cta");S.order.splice(k<0?S.order.length:k,0,"amazon")}for(const p of S.amazon.items){if(!p.tp)p.tp="amazon";if(!p.st)p.st=p.on===false?"hid":"pub";delete p.on}};
let PF=null,pfTok=0;
const PI=(l,k,t="text",ph="")=>{const dt=k==="img"&&/^data:/i.test(PF.d.img||"");return`<label>${l}<input type="${t}" data-pf="${k}" value="${dt?"":e(PF.d[k])}" placeholder="${e(dt?"Foto enviada antes: cole um link para trocar":ph)}"></label>`};
const PT=(l,k,r=3)=>`<label>${l}<textarea rows="${r}" data-pf="${k}">${e(PF.d[k])}</textarea></label>`;
const PS=(l,k,o)=>`<label>${l}<select data-pf="${k}">${o.map(([v,n])=>`<option value="${v}" ${PF.d[k]===v?"selected":""}>${n}</option>`).join("")}</select></label>`;
function pfUpdate(){if(!PF||!$("#pfN"))return;const d=PF.d;
$("#pfN").textContent=d.name||"Nome do produto";$("#pfD").textContent=d.desc||"";$("#pfD").style.display=d.desc?"":"none";$("#pfP").textContent=d.price||"";$("#pfP").style.display=d.price?"":"none";$("#pfB").textContent=TPB[d.tp]||TPB.outro;
$("#pfLk").innerHTML=linkInfo(d.url,d.tp);lucide.createIcons();
const im=$("#pfImg"),st=$("#pfSt"),u=(d.img||"").trim(),my=++pfTok;
if(!u){im.style.display="none";im.removeAttribute("src");im.dataset.u="";st.textContent="";st.className="";return}
if(!imgOk(u)){im.style.display="none";im.dataset.u="";st.className="bad";st.textContent=urlOk(u)?"Esse link parece ser de uma loja, não de uma foto.":"Link da foto inválido (use https://...).";return}
if(im.dataset.u===u&&st.className==="good")return;
im.dataset.u=u;st.className="";st.textContent="Carregando foto...";
im.onload=()=>{if(my===pfTok){im.style.display="";st.className="good";st.textContent="Foto carregada ✓"}};
im.onerror=()=>{if(my===pfTok){im.style.display="none";st.className="bad";st.textContent="Não foi possível carregar essa imagem. Confira o link."}};
im.referrerPolicy="no-referrer";im.src=u}
async function persistAmz(msg){const er=amzCheck(false);if(er){alert(er);return false}const A=JSON.parse(JSON.stringify(S.amazon));
try{if(!ok){for(const k of["config","draft"]){const raw=localStorage.getItem("yose:"+k);if(k==="draft"&&!raw)continue;let o={};try{o=JSON.parse(raw||"{}")||{}}catch{}o.amazon=A;localStorage.setItem("yose:"+k,JSON.stringify(o))}}
else{for(const k of["config","draft"]){const r=doc(db,"site",k);if(k==="draft"&&!(await getDoc(r)).exists())continue;await setDoc(r,{amazon:A},{mergeFields:["amazon"]})}}
toast(msg);return true}catch(x){toast("Erro: "+(x.code||x.message));return false}}
async function saveProduct(){const d=PF.d;for(const k of["name","desc","price","img","url"])d[k]=(d[k]||"").trim();const er=pfErr(d);if(er){alert(er);return}
const b=$('[data-pa="save"]');b.disabled=true;toast("Verificando foto...");
if(!(await imgLoads(d.img))){b.disabled=false;toast("");alert("Não foi possível carregar a foto desse link. Confira se é o endereço direto da imagem e se ela é pública.");return}
const it={name:d.name,desc:d.desc,price:d.price,img:d.img,url:d.url,tp:d.tp,st:d.st},bk=JSON.stringify(S.amazon);
if(PF.i<0)S.amazon.items.push(it);else S.amazon.items[PF.i]=it;
if(await persistAmz(d.st==="pub"?"Produto salvo e publicado":"Produto salvo (oculto)"))PF=null;else{S.amazon=JSON.parse(bk);b.disabled=false}
ui();push()}
async function amzAct(a,i){const it=S.amazon.items;
if(PF&&["toggle","del","up","down"].includes(a)){alert("Salve ou cancele o produto que está em edição primeiro.");return}
if(a==="new")PF={i:-1,d:{name:"",img:"",desc:"",price:"",url:"",tp:"amazon",st:"pub"}};
else if(a==="edit"){const q=it[i];PF={i,d:{name:q.name||"",img:q.img||"",desc:q.desc||"",price:q.price||"",url:q.url||"",tp:q.tp||"outro",st:q.st||"pub"}}}
else if(a==="cancel")PF=null;
else if(a==="save")return saveProduct();
else{const bk=JSON.stringify(S.amazon);let good=true;
if(a==="toggle"){it[i].st=it[i].st==="pub"?"hid":"pub";good=await persistAmz(it[i].st==="pub"?"Produto publicado":"Produto oculto")}
else if(a==="del"){if(!confirm("Eliminar este produto?"))return;it.splice(i,1);good=await persistAmz("Produto eliminado")}
else if(a==="up"||a==="down"){const j=i+(a==="up"?-1:1);if(j<0||j>=it.length)return;[it[i],it[j]]=[it[j],it[i]];good=await persistAmz("Ordem salva")}
else if(a==="saveSec")await persistAmz("Seção salva");
if(!good)S.amazon=JSON.parse(bk)}
ui();push();if(a==="edit"||a==="new")$("#f").scrollTop=0}
const FEATURE_META=[
 ["booking","Reservas online","Formulario para que clientes soliciten fecha, horario y dirección. Las solicitudes quedan en el CRM."],
 ["vip","Planes VIP","Publica planes mensuales y propuestas de atención recurrente."],
 ["crm","CRM de clientes","Activa el módulo para consultar solicitudes, gestionar estados y dar seguimiento."],
 ["testimonials","Testimonios","Controla la publicación de las opiniones reales que cargues en la pestaña Contacto."],
 ["conversion","Conversiones","Cuenta clics en WhatsApp y en los planes. Requiere consentimiento de analítica."],
 ["analytics","Analítica de visitas","Registra visitas y zona aproximada después de que el visitante acepte." ]
];
const growthUI=()=>{const G=S.growth||(S.growth={features:{},booking:{},vip:{plans:[]}});G.features=G.features||{};return `<h4>Módulos opcionales</h4><p style="color:#aaa;font-size:12px">Todos empiezan desactivados. Puedes encenderlos cuando el negocio esté preparado. Guarda y publica para que el cambio llegue al sitio.</p>${FEATURE_META.map(([k,n,d])=>`<div class="cd"><div class="hd"><b>${n}</b><label class="chk"><input type="checkbox" data-p="growth.features.${k}" ${G.features[k]===true?"checked":""}> ${G.features[k]===true?"Activado":"Desactivado"}</label></div><p style="color:#999;font-size:12px;margin:6px 0">${d}</p></div>`).join("")}<h4>Formulario de reservas</h4><div class="cd">${I("Título","growth.booking.title")}${T("Descripción","growth.booking.subtitle",2)}${I("Texto del botón","growth.booking.button")}</div><h4>Planes VIP</h4><div class="cd">${I("Título","growth.vip.title")}${T("Descripción","growth.vip.subtitle",2)}</div>${(G.vip?.plans||[]).map((p,i)=>`<div class="cd"><div class="hd"><b>Plan ${i+1}</b><label class="chk"><input type="checkbox" data-p="growth.vip.plans.${i}.active" ${p.active===true?"checked":""}> Publicar plan</label></div>${I("Nombre","growth.vip.plans."+i+".name")}${I("Precio","growth.vip.plans."+i+".price")}${T("Descripción","growth.vip.plans."+i+".description",2)}</div>`).join("")}<h4>Solicitudes y clientes</h4><div class="cd"><p style="color:#aaa;font-size:12px">El CRM muestra las solicitudes recibidas desde el formulario. Para gestionarlas, activa CRM y publica.</p><button id="loadCRM">Actualizar solicitudes</button><div id="crmList" style="margin-top:12px">Pulsa actualizar para consultar.</div></div><h4>Conversiones</h4><div class="cd"><button id="loadConversions">Consultar clics de WhatsApp</button><div id="conversionList" style="margin-top:12px;color:#aaa">Estadísticas disponibles al activar Conversiones y obtener consentimiento.</div></div>`};
async function loadCRM(){const t=$("#crmList");if(!t)return;if(!ok){t.textContent="Configura Firebase para consultar solicitudes.";return}if(S.growth?.features?.crm!==true){t.textContent="Activa el módulo CRM y publica para gestionar solicitudes.";return}t.textContent="Cargando...";try{const snap=await getDocs(query(collection(db,"leads"),orderBy("createdAt","desc"),limit(100)));if(snap.empty){t.textContent="Todavía no hay solicitudes.";return}t.innerHTML=snap.docs.map(d=>{const x=d.data(),dt=x.createdAt?.toDate?x.createdAt.toDate().toLocaleString("pt-BR"):"Fecha pendiente";return `<div class="cd"><div class="hd"><b>${e(x.name||"Sin nombre")}</b><span class="bdg ${x.status==="finalizado"?"on":"off"}">${e(x.status||"nuevo")}</span></div><p style="color:#aaa;font-size:12px">${e(dt)} · ${e(x.phone||"")}</p><p>${e(x.service||"")} · ${e(x.date||"Fecha flexible")} ${e(x.time||"")}</p><p>${e(x.area||"")}</p><p>${e(x.notes||"")}</p><label>Estado<select data-lead-status="${d.id}"><option value="nuevo" ${x.status==="nuevo"?"selected":""}>Nuevo</option><option value="contactado" ${x.status==="contactado"?"selected":""}>Contactado</option><option value="agendado" ${x.status==="agendado"?"selected":""}>Agendado</option><option value="finalizado" ${x.status==="finalizado"?"selected":""}>Finalizado</option><option value="cancelado" ${x.status==="cancelado"?"selected":""}>Cancelado</option></select></label></div>`}).join("")}catch(err){t.textContent="No se pudo cargar el CRM. Revisa las reglas de Firestore."}}
async function loadConversions(){const t=$("#conversionList");if(!t)return;if(!ok){t.textContent="Configura Firebase.";return}if(S.growth?.features?.conversion!==true){t.textContent="Activa Conversiones y publica.";return}t.textContent="Consultando...";try{const snap=await getDocs(query(collection(db,"conversions"),orderBy("createdAt","desc"),limit(100)));t.textContent=`Registros recientes: ${snap.size}. Cada registro representa un clic en WhatsApp o un interés en un plan.`}catch{t.textContent="No se pudo consultar. Revisa las reglas de Firestore."}}
const V={
growth:growthUI,
visitas:()=>`<h4>Historial de visitas</h4><p style="color:#9a9a9a;font-size:12px">Últimas 100 visitas registradas. La zona es aproximada y depende del proveedor de geolocalización.</p><button id="refreshVisits">Actualizar</button><div id="visitList" style="margin-top:12px">Cargando visitas...</div>`,
tema:()=>`<h4>Temas prontos</h4><div class="pre">${Object.entries(PRESETS).map(([k,p])=>`<button data-pre="${k}" style="background:linear-gradient(135deg,${p.t.bg} 55%,${p.t.gold});color:${p.t.gold2}">${p.n}</button>`).join("")}</div>
<h4>Cores</h4><div class="cols">${[["gold","Destaque"],["gold2","Claro"],["bg","Fundo"],["card","Cartões"],["txt","Texto"],["mut","Suave"]].map(([k,l])=>I(l,"theme."+k,"color")).join("")}</div>
<h4>Letras</h4>${Sel("Títulos","theme.hf",FN)}${Sel("Textos","theme.bf",FN)}${R("Tamanho do texto","theme.fs",.85,1.3,.05)}
<h4>Layout</h4>${R("Arredondamento","theme.radius",0,32,1)}${R("Largura do site","theme.w",960,1440,20)}${R("Espaço entre seções","theme.sp",40,160,4)}${R("Tamanho do logo","theme.logoH",50,180,2)}${Sel("Estilo dos botões","theme.btnStyle",[["pill","Pílula"],["square","Quadrado"],["outline","Contorno"]])}${Sel("Alinhamento do hero","theme.align",[["left","Esquerda"],["center","Centro"]])}${C("Animações","theme.anim")}<p><button data-reset>${L("rotate-ccw")}Restaurar tema original</button></p>`,
sec:()=>`<h4>Ordem e visibilidade</h4>${S.order.map((id,i)=>`<div class="cd"><div class="hd"><label><input type="checkbox" data-h="${id}" ${S.hidden.includes(id)?"":"checked"}>${SEC[id]}</label>${MV("order",i,0)}</div></div>`).join("")}`,
txt:()=>Object.entries(TX).map(([g,l])=>`<h4>${g}</h4>`+l.split(",").map(x=>{const[k,n]=x.split(":");return T(n,"texts."+k,k==="sobreTexto"?4:2)}).join("")).join(""),
btn:()=>`<h4>Adicionar</h4><div class="chips">${Object.keys(NB).map(k=>`<button data-nb="${k}">${L("plus")}${NB[k][1]}</button>`).join("")}</div>`+S.buttons.map((b,i)=>`<div class="cd"><div class="hd"><label><input type="checkbox" data-p="buttons.${i}.on" ${b.on!==false?"checked":""}>${ico(b.icon)} ${e(b.label)}</label>${MV("buttons",i)}</div>${I("Texto","buttons."+i+".label")}${Sel("Tipo","buttons."+i+".kind",[["wa","WhatsApp"],["link","Link"]])}${b.kind==="wa"?T("Mensagem (vazio = padrão)","buttons."+i+".text"):I("Link","buttons."+i+".url")}${Sel("Ícone","buttons."+i+".icon",IO)}${Sel("Onde aparece","buttons."+i+".slot",[["header","Topo"],["hero","Hero"],["sobre","Sobre"],["cta","Chamada final"],["float","Flutuante"],["footer","Rodapé (só ícone)"]])}${Sel("Estilo","buttons."+i+".style",[["solid","Dourado"],["ghost","Contorno"]])}</div>`).join(""),
img:()=>`<h4>Marca e fundos</h4>${IMG("Logo","theme.logo")}${IMG("Foto do hero","theme.heroImg")}${IMG("Foto do Sobre","theme.aboutImg")}<h4>Galeria</h4>${S.gallery.map((g,i)=>`<div class="cd">${IMG("Foto "+(i+1),"gallery."+i)}<div class="hd"><span></span>${MV("gallery",i)}</div></div>`).join("")}<label class="up">${L("plus")}Adicionar foto<input type="file" accept="image/*" multiple data-addimg hidden></label>`,
srv:()=>S.services.map((s,i)=>`<div class="cd"><div class="hd"><label><input type="checkbox" data-p="services.${i}.on" ${s.on!==false?"checked":""}>${e(s.name)}</label>${MV("services",i)}</div>${I("Nome","services."+i+".name")}${I("Preço (vazio = consulte)","services."+i+".price")}${T("Descrição","services."+i+".desc")}${Sel("Mensagem do WhatsApp","services."+i+".msg",["geral","corte","barba","combo"])}${IMG("Foto","services."+i+".img")}</div>`).join("")+`<div class="chips"><button data-ns>${L("plus")}Novo serviço</button></div>`,
why:()=>S.why.map((w,i)=>`<div class="cd"><div class="hd"><label>${e(w.t)}</label>${MV("why",i)}</div>${Sel("Ícone","why."+i+".ic",WI)}${I("Título","why."+i+".t")}${T("Descrição","why."+i+".d")}</div>`).join("")+`<div class="chips"><button data-nw>${L("plus")}Novo diferencial</button></div>`,
amz:()=>{const A=S.amazon,it=A.items;
const form=PF?`<div class="cd"><h4 style="margin-top:12px">${PF.i<0?"Novo produto":"Editar produto"}</h4>${PI("Nome do produto","name")}${PI("Foto do produto (URL da imagem)","img","url","https://.../foto.jpg")}<span id="pfSt"></span><p style="color:#9a9a9a;font-size:12px;margin:4px 0 0">Cole o endereço direto da imagem. Este campo não é para o link de compra.</p>${PT("Descrição (curta)","desc")}${PI("Preço (opcional, ex.: R$ 89,90)","price")}${PI("Link de compra ou de afiliado","url","url","https://...")}<div id="pfLk"></div>${PS("Tipo de produto","tp",TPS)}${PS("Estado","st",[["pub","Publicado"],["hid","Oculto"]])}<h4>Prévia do cartão</h4><div class="pc"><div class="ph"><span>Sem foto</span><img id="pfImg" alt="" style="display:none"></div><div class="bd"><h5 id="pfN"></h5><p id="pfD"></p><span class="pr" id="pfP"></span><span class="bt" id="pfB"></span></div></div><div class="act" style="padding:10px 0 0;border:0"><button class="g" data-pa="save">${L("save")}SALVAR PRODUTO</button><button data-pa="cancel">Cancelar</button></div></div>`:`<div class="chips"><button data-pa="new">${L("plus")}Adicionar produto</button></div>`;
const list=it.length?it.map((q,i)=>{const pub=q.st==="pub",inc=!q.name||!q.img||!q.url;return`<div class="cd"><div class="im"><div class="th" style="background-image:url('${e(q.img)}')"></div><div style="min-width:0"><b style="display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${e(q.name||"Sem nome")}</b><span style="color:#9a9a9a;font-size:12px">${TPN[q.tp]||"Outro"} · ${e(q.price)||"sem preço"}</span><br><span class="bdg ${pub?"on":"off"}">${pub?"Publicado":"Oculto"}</span>${inc?` <span class="bdg off">Incompleto</span>`:""}</div></div><div class="mv" style="margin-top:10px;flex-wrap:wrap"><button data-pa="edit" data-i="${i}">${L("pencil")}Editar</button><button data-pa="toggle" data-i="${i}">${L(pub?"eye-off":"eye")}${pub?"Ocultar":"Publicar"}</button><button data-pa="up" data-i="${i}" aria-label="Subir">${L("arrow-up")}</button><button data-pa="down" data-i="${i}" aria-label="Descer">${L("arrow-down")}</button><button data-pa="del" data-i="${i}" aria-label="Eliminar">${L("trash-2")}</button></div></div>`}).join(""):`<p style="color:#9a9a9a">Nenhum produto ainda.</p>`;
return`<h4>Produtos</h4>${form}<h4>Seus produtos (${it.length})</h4>${list}<h4>Seção no site</h4><div class="cd"><div class="hd">${C("Mostrar “Produtos recomendados” no site","amazon.on")}</div><p style="color:#9a9a9a;font-size:12px;margin:6px 0 0">A seção aparece sozinha quando houver pelo menos um produto publicado.</p>${I("Texto pequeno","amazon.eyebrow")}${I("Título","amazon.a")}${I("Título dourado","amazon.b")}${T("Subtítulo","amazon.sub",2)}${T("Aviso de afiliado (aparece só quando há produtos da Amazon)","amazon.note",3)}<p><button data-pa="saveSec">${L("save")}Salvar seção</button></p></div>`},
ctt:()=>{const n=S.whatsapp.replace(/\D/g,"").length;return`<h4>WhatsApp</h4>${I("Número (55 + DDD + número)","whatsapp")}${n!==13?`<p class="w">${L("triangle-alert")}${n} dígitos. Celulares do Brasil têm 13. Confirme antes de publicar.</p>`:""}${["geral","corte","barba","combo"].map(k=>T("Mensagem: "+k,"msgs."+k)).join("")}<h4>Regiões (uma por linha)</h4><textarea rows="5" data-l="zones">${e(S.zones.join("\n"))}</textarea><h4>Avaliações reais (Nome | texto)</h4><textarea rows="5" data-l="reviews">${e(S.reviews.map(r=>r.name+" | "+r.text).join("\n"))}</textarea><h4>Google (SEO)</h4>${I("Título do site","seo.title")}${T("Descrição","seo.desc",3)}`},
ext:()=>`<h4>Backup</h4><div class="chips"><button data-exp>${L("download")}Exportar backup</button><label class="up" style="margin:0">${L("upload")}Importar<input type="file" accept=".json" data-imp hidden></label></div><h4>Zona de risco</h4><button data-all>${L("rotate-ccw")}Restaurar TUDO ao original</button>`};
const WI=["house","crown","clock","shield-check","scissors","sparkles","gem","star","map-pin","users","award","heart","lock","car","calendar-check"];
const TB=[["tema","Temas","palette"],["sec","Seções","arrow-up-down"],["txt","Textos","type"],["btn","Botões","mouse-pointer-click"],["img","Imagens","image"],["srv","Serviços","scissors"],["why","Diferenciais","gem"],["amz","Produtos","shopping-bag"],["ctt","Contato","phone"],["ext","Extras","settings"],["growth","Crecimiento","trending-up"],["visitas","Visitas","users"]];
function ui(){const y=$("#f").scrollTop;$("#tabs").innerHTML=TB.map(([k,n,i])=>`<button data-tab="${k}" class="${k===tab?"on":""}">${L(i)}${n}</button>`).join("");$("#f").innerHTML=V[tab]();lucide.createIcons();$("#f").scrollTop=y;if(tab==="amz"&&PF)pfUpdate()}
const push=()=>{$("#pv").contentWindow.postMessage({type:"cfg",cfg:S},"*");const k=Math.round(JSON.stringify(S).length/1024);$("#sz").textContent=k+" KB";$("#sz").className=k>900?"w":""};
const F=$("#f");
F.addEventListener("input",x=>{const el=x.target,d=el.dataset;
if(d.p){set(d.p,el.type==="checkbox"?el.checked:el.type==="range"?+el.value:el.value);const b=el.parentNode.querySelector("b");if(b&&el.type==="range")b.textContent=el.value}
else if(d.h)S.hidden=el.checked?S.hidden.filter(i=>i!==d.h):[...S.hidden,d.h];
else if(d.l){const v=el.value.split("\n").map(s=>s.trim()).filter(Boolean);S[d.l]=d.l==="reviews"?v.map(s=>{const[n,...r]=s.split("|");return{name:n.trim(),text:r.join("|").trim()}}):v}
if(d.pf&&PF){PF.d[d.pf]=el.value;if(d.pf==="url"){const k=kindOf(el.value);if(k&&k!==PF.d.tp){PF.d.tp=k;const s=F.querySelector('[data-pf="tp"]');if(s)s.value=k}}pfUpdate()}
push()});
F.addEventListener("change",async x=>{const el=x.target,d=el.dataset;
if(d.img&&el.files[0]){try{set(d.img,await rz(el.files[0],d.img==="theme.logo"?600:1000,d.img==="theme.logo"?"image/png":"image/jpeg"));ui();push()}catch{toast("No se pudo procesar la imagen. Prueba con JPG o PNG.")}}
else if("addimg"in d){try{for(const f of el.files)S.gallery.push(await rz(f,1000,"image/jpeg"));ui();push()}catch{toast("No se pudo procesar una de las imágenes.")}}
else if("imp"in d&&el.files[0]){try{S=merge(structuredClone(D),JSON.parse(await el.files[0].text()));fixO();ui();push();toast("Backup importado")}catch{toast("Arquivo inválido")}}
else if(el.tagName==="SELECT"&&d.p){ui();push()}});
F.addEventListener("click",x=>{const b=x.target.closest("button");if(!b)return;const d=b.dataset;
if(d.pa){amzAct(d.pa,+d.i);return}
else if(d.pre)Object.assign(S.theme,PRESETS[d.pre].t);
else if("reset"in d)Object.assign(S.theme,D.theme);
else if(d.mv){const[l,i,n]=d.mv.split(":"),a=S[l],j=+i+ +n;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]]}
else if(d.del){const[l,i]=d.del.split(":");if(confirm("Remover?"))S[l].splice(i,1);else return}
else if(d.nb){const[k,l,i,s,st,u]=NB[d.nb];S.buttons.push({kind:k,label:l,icon:i,slot:s,style:st,url:u,text:"",on:true})}
else if("ns"in d)S.services.push({name:"Novo serviço",desc:"",price:"",msg:"geral",img:"",on:true});
else if("nw"in d)S.why.push({ic:"sparkles",t:"Novo diferencial",d:""});
else if("exp"in d){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(S)],{type:"application/json"}));a.download="yose-backup.json";a.click();return}
else if("all"in d){if(confirm("Voltar tudo ao original?"))S=structuredClone(D);else return}
else return;ui();push()});
$("#tabs").onclick=x=>{const b=x.target.closest("[data-tab]");if(b){tab=b.dataset.tab;ui();if(tab==="visitas")loadVisits();if(tab==="growth"){loadCRM();loadConversions()}}};
async function loadVisits(){
  const target=$("#visitList"); if(!target)return;
  if(!ok){target.textContent="Configura Firebase para consultar el historial.";return}
  target.textContent="Cargando visitas...";
  try{
    const snap=await getDocs(query(collection(db,"visits"),orderBy("createdAt","desc"),limit(100)));
    if(snap.empty){target.textContent="Todavía no hay visitas registradas.";return}
    target.innerHTML=snap.docs.map(d=>{
      const v=d.data(),dt=v.createdAt?.toDate?v.createdAt.toDate().toLocaleString("es-ES"):"Fecha pendiente";
      const esc=x=>e(String(x||"No disponible"));
      return `<div class="cd"><div class="hd"><b>${esc(v.city)}, ${esc(v.region)}</b><span style="color:#9a9a9a;font-size:12px">${esc(dt)}</span></div><div style="color:#aaa;font-size:13px">${esc(v.country)} · ${esc(v.device)} · ${esc(v.path)}</div><div style="color:#777;font-size:12px">Origen: ${esc(v.referrer)}</div></div>`;
    }).join("");
  }catch(err){target.textContent="No se pudo cargar el historial. Revisa las reglas de Firestore y la conexión."}
}
document.addEventListener("click",ev=>{if(ev.target?.id==="refreshVisits")loadVisits();if(ev.target?.id==="loadCRM")loadCRM();if(ev.target?.id==="loadConversions")loadConversions()});
document.addEventListener("change",async ev=>{const el=ev.target;if(el.dataset.leadStatus){try{await updateDoc(doc(db,"leads",el.dataset.leadStatus),{status:el.value});toast("Estado actualizado")}catch{toast("No se pudo actualizar el estado. Revisa permisos.")}}});
document.querySelectorAll("[data-w]").forEach(b=>b.onclick=()=>$("#pv").style.width=b.dataset.w);
$("#pvb").onclick=()=>{$("#pvbox").classList.add("show");push()};$("#cl").onclick=()=>$("#pvbox").classList.remove("show");$("#pv").onload=push;
const save=async k=>{const bad=amzCheck(k==="config");if(bad){tab="amz";ui();alert(bad);return}if(!ok){try{localStorage.setItem("yose:"+k,JSON.stringify(S));toast(k==="config"?"Publicado (local)":"Rascunho salvo (local)")}catch{toast("Sem espaço: use fotos menores")}return}
try{await setDoc(doc(db,"site",k),JSON.parse(JSON.stringify(S)));toast(k==="config"?"Publicado":"Rascunho salvo")}catch(x){toast("Erro: "+(x.code||x.message))}};
$("#sv").onclick=()=>save("draft");$("#pb").onclick=()=>confirm("Publicar no site?")&&save("config");
const load=async ks=>{S=structuredClone(D);for(const k of ks){const d=ok?(await getDoc(doc(db,"site",k))).data():JSON.parse(localStorage.getItem("yose:"+k)||"null");if(d){merge(S,d);break}}fixO();ui();push()};
$("#rs").onclick=()=>load(["config"]).then(()=>toast("Versão publicada restaurada"));
const err=(t,g)=>{$("#le").textContent=t||"";$("#le").className=g?"ok":""};
const MS={"auth/invalid-credential":"E-mail ou senha incorretos.","auth/wrong-password":"E-mail ou senha incorretos.","auth/user-not-found":"E-mail ou senha incorretos.","auth/invalid-email":"E-mail inválido.","auth/too-many-requests":"Muitas tentativas. Aguarde alguns minutos e tente de novo.","auth/network-request-failed":"Sem conexão. Verifique sua internet.","auth/user-disabled":"Esta conta foi desativada."};
const show=v=>{$("#login").style.display=v?"none":"grid";$("#app").classList.toggle("off",!v)};
async function enter(){show(true);ui();try{await load(["draft","config"])}catch(x){if(x.code==="permission-denied"){await signOut(auth);err("Esta conta não tem permissão de administrador.")}else toast("Erro ao carregar")}}
if(!ok){show(true);ui();load(["draft","config"])}
else{
$("#lf").onsubmit=async x=>{x.preventDefault();err("");const b=$("#lg");b.disabled=true;b.textContent="Entrando...";
try{await signInWithEmailAndPassword(auth,$("#le1").value.trim(),$("#lp").value)}catch(z){err(MS[z.code]||"Não foi possível entrar. Tente novamente.")}b.disabled=false;b.textContent="Entrar"};
$("#ey").onclick=()=>{const p=$("#lp"),h=p.type==="password";p.type=h?"text":"password"};
$("#fp").onclick=async()=>{const m=$("#le1").value.trim();if(!m){err("Digite seu e-mail acima e clique novamente.");return}
try{await sendPasswordResetEmail(auth,m)}catch{}err("Se o e-mail estiver cadastrado, enviamos um link para redefinir a senha.",1)};
$("#lo").onclick=()=>confirm("Sair do painel?")&&signOut(auth);
onAuthStateChanged(auth,u=>{if(u)enter();else{show(false);$("#lp").value=""}});
}
lucide.createIcons();
