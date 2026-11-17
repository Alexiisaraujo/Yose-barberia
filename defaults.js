const u=i=>"https://images.unsplash.com/"+i+"?auto=format&fit=crop&w=900&q=75";
const IC={wa:'<path d="M3 21l1.6-4.6A8.5 8.5 0 1 1 8 19.4z"/>',ig:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/>',tt:'<path d="M14 3v11a4 4 0 1 1-4-4M14 3c0 3 2 5 5 5"/>',phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'};
const ico=k=>IC[k]?`<svg viewBox="0 0 24 24" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round">${IC[k]}</svg>`:"";
const PRESETS={
ouro:{n:"Ouro Clássico",t:{gold:"#D6A64B",gold2:"#F1C875",bg:"#080808",card:"#171717",txt:"#F5F5F5",mut:"#A5A5A5",hf:"Montserrat",bf:"Inter"}},
platina:{n:"Platina",t:{gold:"#C7CDD6",gold2:"#EEF1F5",bg:"#090B0E",card:"#14181D",txt:"#F5F7FA",mut:"#9AA3AF",hf:"Raleway",bf:"Inter"}},
esmeralda:{n:"Esmeralda",t:{gold:"#3DBE8B",gold2:"#8FE3BD",bg:"#07100C",card:"#101C16",txt:"#F2FAF6",mut:"#9DB5A9",hf:"Playfair Display",bf:"Inter"}},
bordo:{n:"Bordô Real",t:{gold:"#D4AF6A",gold2:"#F0D4A0",bg:"#12070A",card:"#1F0D12",txt:"#F8F1F2",mut:"#B8A0A5",hf:"Cormorant Garamond",bf:"Poppins"}},
noite:{n:"Meia-noite",t:{gold:"#6FA8FF",gold2:"#B4D2FF",bg:"#070A12",card:"#111726",txt:"#F2F6FF",mut:"#97A3BB",hf:"Poppins",bf:"Inter"}},
cobre:{n:"Cobre",t:{gold:"#C77D4A",gold2:"#EBA676",bg:"#0E0907",card:"#1B1411",txt:"#F8F1EC",mut:"#B5A397",hf:"Cormorant Garamond",bf:"Raleway"}}};
const B=(kind,label,icon,slot,style,extra={})=>({kind,label,icon,slot,style,text:"",url:"",on:true,...extra});
const D={
whatsapp:"554199658208",phoneLabel:"+55 41 9965-8208",
msgs:{geral:"Olá, Yose! Gostaria de agendar um horário para atendimento a domicílio. Poderia me informar a disponibilidade?",corte:"Olá, Yose! Tenho interesse em agendar um Corte Masculino. Quais horários estão disponíveis?",barba:"Olá, Yose! Gostaria de agendar um serviço de barba. Quais horários estão disponíveis?",combo:"Olá, Yose! Gostaria de agendar Corte + Barba. Quais horários estão disponíveis?"},
theme:{...PRESETS.ouro.t,radius:16,fs:1,w:1180,sp:84,logoH:92,btnStyle:"pill",align:"left",anim:true,logo:"logo.svg",heroImg:"https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1600&q=75",aboutImg:u("photo-1585747860715-2ba37e788b70")},
seo:{title:"Yose Barber | Barbeiro a domicílio em Curitiba",desc:"Barbearia profissional a domicílio em Curitiba. Seu estilo, no conforto da sua casa."},
texts:{heroKicker:"Barbearia premium a domicílio",h1a:"BARBEIRO",h1b:"A DOMICÍLIO",h1c:"EM CURITIBA",heroLead:"Conforto, qualidade e estilo sem sair de casa.",perk1:"Atendimento no seu endereço",perk2:"Profissional experiente",perk3:"Pontualidade e compromisso",
servEyebrow:"Nossos Serviços",servA:"Cuidado de alto nível,",servB:"onde você estiver",servSub:"Seu estilo, no conforto da sua casa.",
sobreEyebrow:"Sobre o Yose",sobreA:"Exclusividade e atenção",sobreB:"personalizada",sobreTexto:"Barbearia profissional onde você estiver. Cada atendimento é pensado para quem valoriza tempo, discrição e acabamento impecável, com pontualidade e total conforto.",
galEyebrow:"Galeria",galA:"Cortes e",galB:"acabamentos",porqEyebrow:"Por que escolher",porqA:"A experiência que o seu tempo",porqB:"merece",
revEyebrow:"Avaliações",revA:"O que dizem os",revB:"clientes",regEyebrow:"Zonas de atendimento",regA:"Atendemos em",regB:"Curitiba e região",
ctaA:"Pronto para o seu",ctaB:"próximo corte?",ctaSub:"Envie uma mensagem e consulte a disponibilidade de horários.",footTag:"Seu estilo, no conforto da sua casa.",footLoc:"Curitiba, Paraná"},
buttons:[B("wa","Agendar Agora","wa","header","solid"),B("wa","Agendar pelo WhatsApp →","wa","hero","solid"),B("wa","Falar com o Yose","wa","sobre","ghost"),B("wa","Agendar pelo WhatsApp →","wa","cta","solid"),B("wa","Fale Conosco no WhatsApp","wa","float","solid"),B("link","Instagram","ig","footer","solid",{url:"https://instagram.com/",on:false}),B("link","TikTok","tt","footer","solid",{url:"https://tiktok.com/",on:false})],
services:[
{name:"Corte Masculino",desc:"Corte moderno, degradê e acabamento preciso, feito na sua casa.",price:"",msg:"corte",img:u("photo-1503951914875-452162b0f3f1"),on:true},
{name:"Barba Modelada",desc:"Modelagem, toalha quente e acabamento com navalha.",price:"",msg:"barba",img:u("photo-1621605815971-fbc98d665033"),on:true},
{name:"Corte + Barba",desc:"A experiência completa para quem busca o visual impecável.",price:"",msg:"combo",img:u("photo-1599351431202-1e0f0137899a"),on:true}],
why:[{ic:"house",t:"No seu endereço",d:"Casa, escritório, hotel ou cobertura. Você não perde tempo em deslocamento."},{ic:"crown",t:"Atendimento exclusivo",d:"Um cliente por vez, com atenção total do início ao fim."},{ic:"clock",t:"Pontualidade",d:"Horário combinado é compromisso cumprido."},{ic:"shield-check",t:"Discrição e privacidade",d:"Seu momento, no seu espaço, com total reserva."},{ic:"scissors",t:"Acabamento impecável",d:"Técnica e precisão para uma imagem sempre afiada."},{ic:"sparkles",t:"Higiene e materiais profissionais",d:"Cuidado e organização em cada atendimento."}],
gallery:["photo-1503951914875-452162b0f3f1","photo-1621605815971-fbc98d665033","photo-1599351431202-1e0f0137899a","photo-1585747860715-2ba37e788b70","photo-1622286342621-4bd786c2447c","photo-1605497788044-5a32c7078486"].map(u),
reviews:[],zones:["Batel","Água Verde","Bigorrilho","Centro","Ecoville","Portão"],
order:["hero","servicos","sobre","galeria","porque","reviews","regioes","cta"],hidden:[]};
