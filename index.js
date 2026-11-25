const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
const E=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safe=s=>{const v=String(s||"#").trim();if(/^(https?:|mailto:|tel:)/i.test(v))return E(v);return "#"};
const merge=(a,b)=>{for(const k in b)a[k]=b[k]&&typeof b[k]==="object"&&!Array.isArray(b[k])?merge(a[k]||{},b[k]):b[k];return a};
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.1});
const wl=(C,t)=>`https://wa.me/${String(C.whatsapp||"").replace(/\D/g,"")}?text=${encodeURIComponent(t||C.msgs.geral)}`;
const SL={header:"#hdBtns",hero:"#heroBtns",sobre:"#sobreBtns",cta:"#ctaBtns",float:"#floatBtns",footer:"#socials"};
const urlOk=u=>{try{const x=new URL(String(u).trim());return/^https?:$/.test(x.protocol)&&/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(x.hostname)&&!/^\d+(\.\d+){3}$/.test(x.hostname)}catch{return false}};
const TPL={amazon:["Amazon","COMPRAR NA AMAZON →",1],ml:["Mercado Livre","COMPRAR NO MERCADO LIVRE →",1],propria:["Loja própria","COMPRAR AGORA →",0],whatsapp:["WhatsApp","PEDIR PELO WHATSAPP →",0],outro:["","VER PRODUTO →",1]};
function amzRender(C){
const A=C.amazon||{},pub=p=>p&&(p.st?p.st==="pub":p.on!==false),ls=A.on===false?[]:(A.items||[]).filter(p=>pub(p)&&String(p.name||"").trim()&&urlOk(p.url));
$("#amzEy").textContent=A.eyebrow||"";$("#amzA").textContent=A.a||"";$("#amzB").textContent=A.b||"";$("#amzSub").textContent=A.sub||"";
$("#amzNote").textContent=ls.some(p=>(p.tp||"amazon")==="amazon")?(A.note||""):"";
$("#amzList").innerHTML=ls.map(p=>{const T=TPL[p.tp||"amazon"]||TPL.outro,im=p.img&&(/^data:image\//i.test(p.img)||urlOk(p.img));
return`<article class="card amz-card"><div class="pimg">${im?`<img src="${E(p.img)}" alt="${E(p.name)}" loading="lazy" referrerpolicy="no-referrer">`:`<i data-lucide="shopping-bag"></i>`}</div><div class="body">${T[0]?`<span class="tagc">${E(T[0])}</span>`:""}<h3>${E(p.name)}</h3><p>${E(p.desc)}</p>${p.price?`<span class="price">${E(p.price)}</span>`:""}<a class="btn" href="${E(p.url)}" target="_blank" rel="${T[2]?"noopener noreferrer sponsored nofollow":"noopener noreferrer"}">${T[1]}</a></div></article>`}).join("");
return ls.length}
addEventListener("error",ev=>{const t=ev.target;if(t&&t.tagName==="IMG"&&t.closest&&t.closest(".pimg")){t.parentNode.innerHTML='<i data-lucide="shopping-bag"></i>';window.lucide&&lucide.createIcons()}},true);
function renderGrowth(C){
 const G=C.growth||{},F=G.features||{};let root=document.getElementById("growthArea");
 if(!root){root=document.createElement("div");root.id="growthArea";document.querySelector("footer").before(root)}
 let html="";
 if(F.vip===true){const plans=(G.vip?.plans||[]).filter(p=>p.active===true);if(plans.length)html+=`<section class="growth-section"><div class="wrap"><p class="eyebrow">YOSE BARBER</p><h2>${E(G.vip.title||"Planos exclusivos")}</h2><p class="sub">${E(G.vip.subtitle||"")}</p><div class="grid g3">${plans.map(p=>`<article class="card growth-card"><h3>${E(p.name)}</h3><strong>${E(p.price||"Consulte")}</strong><p>${E(p.description)}</p><a class="btn" data-conversion="vip" href="${wl(C,"Olá, Yose! Tenho interesse no plano "+p.name+". Poderia me passar mais informações?")}" target="_blank" rel="noopener">Tenho interesse →</a></article>`).join("")}</div></div></section>`}
 if(F.booking===true)html+=`<section class="growth-section" id="booking"><div class="wrap"><p class="eyebrow">ATENDIMENTO PERSONALIZADO</p><h2>${E(G.booking?.title||"Agende seu atendimento")}</h2><p class="sub">${E(G.booking?.subtitle||"")}</p><form id="yoseBooking" class="growth-form"><div class="grid g2"><label>Nome<input name="name" required maxlength="90" autocomplete="name"></label><label>WhatsApp<input name="phone" required maxlength="30" autocomplete="tel"></label><label>Serviço<select name="service">${(C.services||[]).filter(x=>x.on!==false).map(x=>`<option>${E(x.name)}</option>`).join("")}</select></label><label>Data preferida<input name="date" type="date" min="${(()=>{const n=new Date();n.setMinutes(n.getMinutes()-n.getTimezoneOffset());return n.toISOString().slice(0,10)})()}"></label><label>Horário preferido<input name="time" type="time"></label><label>Local do atendimento<input name="area" maxlength="120" placeholder="Bairro, hotel ou escritório"></label></div><label>Observações<textarea name="notes" rows="3" maxlength="500"></textarea></label><button class="btn" type="submit">${E(G.booking?.button||"Solicitar agendamento")}</button><p id="bookingStatus" role="status"></p></form></div></section>`;
 root.innerHTML=html;
 const form=document.getElementById("yoseBooking");if(form)form.addEventListener("submit",async ev=>{ev.preventDefault();const b=form.querySelector("button[type=submit]"),st=document.getElementById("bookingStatus"),d=Object.fromEntries(new FormData(form));b.disabled=true;st.textContent="Enviando solicitação...";try{const [{initializeApp},{getFirestore,collection,addDoc,serverTimestamp}]=await Promise.all([import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js")]);const app=window.__YOSE_FIREBASE_APP__||initializeApp(FIREBASE_CONFIG);const db=getFirestore(app);await addDoc(collection(db,"leads"),{...d,status:"nuevo",source:"site",createdAt:serverTimestamp()});st.textContent="Solicitação enviada! Yose entrará em contato para confirmar.";form.reset()}catch(err){st.textContent="Não foi possível enviar agora. Fale diretamente pelo WhatsApp."}finally{b.disabled=false}});
}
function render(C){
window.__YOSE_CONFIG__=C;
const T=C.theme,r=document.documentElement.style,bc=document.body.classList;
for(const k of["gold","gold2","bg","card","txt","mut"])r.setProperty("--"+k,T[k]);
r.setProperty("--r",T.radius+"px");r.setProperty("--w",T.w+"px");r.setProperty("--sp",T.sp+"px");r.setProperty("--fs",T.fs);r.setProperty("--lh",T.logoH+"px");r.setProperty("--lhm",Math.round(T.logoH*.78)+"px");
r.setProperty("--himg",`url("${E(T.heroImg)}")`);
bc.toggle("bsq",T.btnStyle==="square");bc.toggle("bol",T.btnStyle==="outline");bc.toggle("hc",T.align==="center");bc.toggle("noan",T.anim===false);
$(".about .photo").style.backgroundImage=`url("${E(T.aboutImg)}")`;
document.body.style.fontFamily=`'${T.bf}',sans-serif`;
$$("h1,h2,h3,.logo,.btn,.price,.adv b").forEach(e=>e.style.fontFamily=`'${T.hf}',sans-serif`);
$$(".logoimg").forEach(i=>i.src=T.logo||"logo.svg");
document.title=C.seo.title;$("meta[name=description]").content=C.seo.desc;
$("#services").innerHTML=C.services.filter(s=>s.on!==false).map(s=>`<article class="card"><div class="img" style="background-image:url('${E(s.img)}')"></div><div class="body"><h3>${E(s.name)}</h3><p>${E(s.desc)}</p><span class="price">${E(s.price)||"Consulte os valores"}</span><a class="btn" data-conversion="whatsapp_click" href="${wl(C,C.msgs[s.msg])}" target="_blank" rel="noopener noreferrer">${ico("wa")}Agendar →</a></div></article>`).join("");
$("#why").innerHTML=C.why.map(w=>`<div class="card adv"><span class="ic"><i data-lucide="${E(w.ic)}"></i></span><b>${E(w.t)}</b><span>${E(w.d)}</span></div>`).join("");
$("#gallery").innerHTML=C.gallery.map(g=>`<div style="background-image:url('${E(g)}')"></div>`).join("");
$("#zones").innerHTML=C.zones.map(z=>`<span>${E(z)}</span>`).join("");
$("#reviewList").innerHTML=C.reviews.map(x=>`<div class="card adv"><span>“${E(x.text)}”</span><b>${E(x.name)}</b></div>`).join("");
$$("[data-t]").forEach(e=>{if(C.texts[e.dataset.t]!=null)e.textContent=C.texts[e.dataset.t]});
const amzN=amzRender(C);if(!C.order.includes("amazon")){const k=C.order.indexOf("cta");C.order.splice(k<0?C.order.length:k,0,"amazon")}const nl=$("#navAmz");if(nl)nl.style.display=amzN&&!C.hidden.includes("amazon")?"":"none";
for(const s in SL)$(SL[s]).innerHTML=C.buttons.filter(b=>b.on!==false&&b.slot===s).map(b=>{const h=b.kind==="wa"?wl(C,b.text):safe(b.url);return s==="footer"?`<a class="soc" href="${h}" target="_blank" rel="noopener" title="${E(b.label)}" aria-label="${E(b.label)}">${ico(b.icon)}</a>`:`<a class="btn ${b.style==="ghost"?"ghost":""}" href="${h}" target="_blank" rel="noopener">${ico(b.icon)}${E(b.label)}</a>`}).join("");
window.lucide&&lucide.createIcons();renderGrowth(C);dispatchEvent(new Event("yose-config-ready"));const m=$("#top");C.order.forEach(id=>{const s=m.querySelector(`[data-sec=${id}]`);if(!s)return;m.appendChild(s);s.style.display=C.hidden.includes(id)||(id==="reviews"&&(!C.growth?.features?.testimonials||!C.reviews.length))||(id==="amazon"&&!amzN)?"none":""});
$$("section h2,section .eyebrow,.card,.gal div,.zones span,.about .photo").forEach((e,i)=>{if(!e.classList.contains("rv")){e.classList.add("rv");e.style.setProperty("--d",(i%4)*.09+"s");io.observe(e)}});
}
render(structuredClone(D));
addEventListener("message",e=>{if(e.data&&e.data.type==="cfg")render(merge(structuredClone(D),e.data.cfg))});
(async()=>{if(!FIREBASE_CONFIG.apiKey){try{const l=localStorage.getItem("yose:config");if(l)render(merge(structuredClone(D),JSON.parse(l)))}catch{}return}
const{initializeApp}=await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
const{getFirestore,doc,getDoc}=await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
const app=initializeApp(FIREBASE_CONFIG);window.__YOSE_FIREBASE_APP__=app;const s=await getDoc(doc(getFirestore(app),"site","config"));
if(s.exists())render(merge(structuredClone(D),s.data()))})().catch(()=>{});
$("#yr").textContent=new Date().getFullYear();
$("#burger").onclick=()=>$("#nav").classList.toggle("open");
$$("nav a").forEach(a=>a.onclick=()=>$("#nav").classList.remove("open"));
addEventListener("scroll",()=>{const h=document.documentElement;$("#bar").style.width=scrollY/(h.scrollHeight-innerHeight)*100+"%";$("header").classList.toggle("sm",scrollY>40);if(innerWidth>860)$(".hero").style.backgroundPositionY=`calc(50% + ${scrollY*.22}px)`},{passive:true});


// Analítica y conversiones: ambas funciones permanecen apagadas hasta activarlas desde Admin.
(function growthTracking(){
 const consentKey="yose:analytics-consent";
 async function track(collectionName,payload){try{const [{initializeApp},{getFirestore,collection,addDoc,serverTimestamp}]=await Promise.all([import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js")]);const app=window.__YOSE_FIREBASE_APP__||initializeApp(FIREBASE_CONFIG);const db=getFirestore(app);await addDoc(collection(db,collectionName),{...payload,createdAt:serverTimestamp()})}catch(e){console.info("Registro opcional no disponible",e?.code||"")}}
 function visit(){if(window.__YOSE_CONFIG__?.growth?.features?.analytics!==true||sessionStorage.getItem("yose:visit-recorded"))return;sessionStorage.setItem("yose:visit-recorded","1");(async()=>{let area={city:"No disponible",region:"No disponible",country:"No disponible"};try{const r=await fetch("https://ipapi.co/json/",{cache:"no-store",signal:AbortSignal.timeout(3500)});if(r.ok){const g=await r.json();area={city:String(g.city||area.city).slice(0,80),region:String(g.region||area.region).slice(0,80),country:String(g.country_name||area.country).slice(0,80)}}}catch{}const ua=navigator.userAgent||"",device=/tablet|ipad/i.test(ua)?"Tablet":/mobile|android|iphone/i.test(ua)?"Celular":"Computadora";await track("visits",{...area,device,path:location.pathname.slice(0,160),referrer:document.referrer?new URL(document.referrer).hostname.slice(0,120):"Acceso directo"})})()}
 function consent(){if(localStorage.getItem(consentKey)==="yes")visit();else if(localStorage.getItem(consentKey)!=="no"){if(document.getElementById("yoseConsent"))return;const b=document.createElement("aside");b.id="yoseConsent";b.setAttribute("role","dialog");b.setAttribute("aria-label","Preferencias de privacidad");const parts=[];if(window.__YOSE_CONFIG__?.growth?.features?.analytics===true)parts.push("visitas y zona aproximada");if(window.__YOSE_CONFIG__?.growth?.features?.conversion===true)parts.push("clics de interés");b.innerHTML=`<p>Si aceptas, registraremos ${parts.join(" y ")}. No almacenamos la dirección IP.</p><button class="yes">Aceptar</button><button class="no">Rechazar</button>`;document.body.appendChild(b);b.querySelector(".yes").onclick=()=>{localStorage.setItem(consentKey,"yes");b.remove();visit()};b.querySelector(".no").onclick=()=>{localStorage.setItem(consentKey,"no");b.remove()}}}
 document.addEventListener("click",ev=>{const a=ev.target.closest("a[data-conversion],#hdBtns a,#heroBtns a,#sobreBtns a,#ctaBtns a,#floatBtns a");if(!a)return;const C=window.__YOSE_CONFIG__||{},type=a.dataset.conversion||(/^https:\/\/wa\.me\//i.test(a.href)?"whatsapp_click":"");if(!type)return;if(C.growth?.features?.conversion===true&&localStorage.getItem(consentKey)==="yes")track("conversions",{type,label:(a.textContent||"").trim().slice(0,100),path:location.pathname.slice(0,160)})});
 // Se configura después de recibir el documento publicado.
 window.addEventListener("yose-config-ready",()=>{const C=window.__YOSE_CONFIG__||{},F=C.growth?.features||{};if(F.analytics===true||F.conversion===true)consent()});
})();
