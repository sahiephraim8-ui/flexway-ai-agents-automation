import { useState } from 'react';
import { api } from '@appdeploy/client';
import { useNavigate } from 'react-router-dom';

const ACCENT = '#25C984', ACCENT_BG = 'rgba(37,201,132,0.1)', ACCENT_BORDER = 'rgba(37,201,132,0.25)';

interface WAData {
  nomEntreprise: string; secteur: string;
  aWhatsAppBusiness: string; volumeMessages: string; typesDemandes: string[];
  heureDebut: string; heureFin: string; messagesHorsHoraires: string;
  nomAgent: string; ton: string; langues: string[];
  question1: string; question2: string; question3: string;
  priseRDV: string; donnerPrix: string;
  reglesEscalade: string; numeroWhatsApp: string;
  nomContact: string; emailContact: string; telContact: string; budget: string;
}
const INIT: WAData = { nomEntreprise:'',secteur:'Assurance',aWhatsAppBusiness:'',volumeMessages:'',typesDemandes:[],heureDebut:'08',heureFin:'18',messagesHorsHoraires:'',nomAgent:'',ton:'',langues:[],question1:'',question2:'',question3:'',priseRDV:'',donnerPrix:'',reglesEscalade:'',numeroWhatsApp:'',nomContact:'',emailContact:'',telContact:'',budget:'' };
const SECTEURS = ['Assurance','Banque / Finance','Commerce / Distribution','Industrie / BTP','Services B2B','Santé','Autre'];
const DEMANDES = ['Informations produits','Demandes de devis','Déclaration de sinistres','Prise de rendez-vous','Suivi dossier','Paiements & reçus','Plaintes & réclamations','Autre'];
const VOLUMES = ['Moins de 10/jour','10 à 50/jour','50 à 200/jour','Plus de 200/jour'];
const TONES = ['Professionnel & Formel','Chaleureux & Proche','Neutre & Efficace'];
const LANGS = ['Français','Anglais','Dioula','Nouchi','Autre'];
const HORS = ['Oui, on répond manuellement (coûteux)','Non, les clients attendent','On les perd — problème critique'];
const OUI_NON = ['Oui','Non','À discuter selon le cas'];
const BUDGETS = ['Moins de 150 000 FCFA/mois','150 000 à 400 000 FCFA/mois','Plus de 400 000 FCFA/mois','Budget à définir'];
const STEPS = [{n:1,l:'WhatsApp'},{n:2,l:'Agent IA'},{n:3,l:'Contact'}];
const STITLES = [
  {t:"Votre usage WhatsApp actuel",s:"Comprenons comment vous utilisez WhatsApp aujourd'hui"},
  {t:'Configuration de votre Agent IA',s:'Comment doit se comporter et répondre votre assistant'},
  {t:'Règles & Contact',s:'Quand escalader vers un humain, et comment vous joindre'},
];

export default function WhatsAppForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WAData>(INIT);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [submitting, setSubmitting] = useState(false);
  const nav = useNavigate();

  const set = (f: keyof WAData, v: string|string[]) => { setData(p=>({...p,[f]:v})); setErrors(p=>{const e={...p};delete e[f];return e;}); };
  const tog = (f: keyof WAData, v: string) => { const cur = data[f] as string[]; set(f, cur.includes(v)?cur.filter(x=>x!==v):[...cur,v]); };

  const validate = (s: number) => {
    const e: Record<string,string> = {};
    if(s===1){if(!data.nomEntreprise.trim())e.nomEntreprise='Obligatoire';}
    if(s===3){if(!data.nomContact.trim())e.nomContact='Obligatoire';if(!data.emailContact.trim()||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.emailContact))e.emailContact='Email invalide';if(!data.telContact.trim())e.telContact='Obligatoire';}
    setErrors(e); return !Object.keys(e).length;
  };

  const next = () => { if(validate(step)){setStep(s=>s+1);window.scrollTo(0,0);} };
  const prev = () => { setStep(s=>s-1);window.scrollTo(0,0); };

  const submit = async () => {
    if(!validate(3))return; setSubmitting(true);
    try{ await api.post('/api/submit',{formData:data,files:[],serviceType:'whatsapp'}); nav('/merci?s=whatsapp'); }
    catch{ alert('Erreur. Veuillez réessayer.'); } finally{ setSubmitting(false); }
  };

  const I=(err?:boolean): React.CSSProperties=>({width:'100%',background:'#0A0F1E',border:`1px solid ${err?'#FF6B6B':'#1E2940'}`,borderRadius:8,padding:'12px 16px',color:'#fff',fontSize:15,outline:'none',boxSizing:'border-box',fontFamily:'Inter,sans-serif'});
  const T=(): React.CSSProperties=>({...I(),resize:'vertical' as const,minHeight:100});
  const L=(): React.CSSProperties=>({display:'block',marginBottom:8,color:'#8892B0',fontSize:12,letterSpacing:'0.8px',textTransform:'uppercase' as const});
  const g2=(): React.CSSProperties=>({display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 24px'});
  const F=(label:string,req:boolean,err:string|undefined,child:React.ReactNode,hint?:string)=>(
    <div style={{marginBottom:20}}><label style={L()}>{label}{req&&<span style={{color:ACCENT}}> *</span>}</label>{hint&&<p style={{color:'#3D4F6B',fontSize:12,margin:'-4px 0 8px',fontStyle:'italic'}}>{hint}</p>}{child}{err&&<p style={{marginTop:5,color:'#FF6B6B',fontSize:13}}>{err}</p>}</div>
  );
  const Multi=(f: keyof WAData,items:string[])=>(
    <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
      {items.map(item=>{const ch=(data[f] as string[]).includes(item);return(<button key={item} type="button" onClick={()=>tog(f,item)} style={{padding:'8px 14px',borderRadius:7,cursor:'pointer',background:ch?ACCENT_BG:'#0A0F1E',border:`1px solid ${ch?ACCENT:'#1E2940'}`,color:ch?ACCENT:'#8892B0',fontSize:13,display:'flex',alignItems:'center',gap:7}}><span style={{width:15,height:15,borderRadius:3,border:`1.5px solid ${ch?ACCENT:'#1E2940'}`,background:ch?ACCENT:'transparent',display:'inline-flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:9,color:'#070B17',fontWeight:800}}>{ch&&'✓'}</span>{item}</button>);})}
    </div>
  );
  const Radio=(f: keyof WAData,items:string[])=>(
    <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
      {items.map(item=>{const s=data[f]===item;return(<button key={item} type="button" onClick={()=>set(f,item)} style={{padding:'8px 14px',borderRadius:7,cursor:'pointer',background:s?ACCENT_BG:'#0A0F1E',border:`1px solid ${s?ACCENT:'#1E2940'}`,color:s?ACCENT:'#8892B0',fontSize:13}}>{item}</button>);})}
    </div>
  );
  const Sel=(f: keyof WAData,items:string[])=>(
    <select style={{...I(),cursor:'pointer'}} value={data[f] as string} onChange={e=>set(f,e.target.value)}>
      <option value="">— Sélectionner</option>
      {items.map(i=><option key={i} value={i}>{i}</option>)}
    </select>
  );

  const cur=STITLES[step-1];
  return (
    <div style={{background:'#070B17',minHeight:'100vh',fontFamily:'Inter,-apple-system,sans-serif',paddingBottom:80}}>
      <div style={{padding:'32px 24px 0',textAlign:'center',maxWidth:740,margin:'0 auto'}}>
        <button onClick={()=>nav('/')} style={{background:'transparent',border:'none',color:'#3D4F6B',fontSize:13,cursor:'pointer',display:'flex',alignItems:'center',gap:6,margin:'0 auto 16px'}}>← Retour à l'accueil</button>
        <div style={{display:'inline-flex',alignItems:'center',gap:12,marginBottom:6}}>
          <div style={{width:38,height:38,borderRadius:9,background:`linear-gradient(135deg,${ACCENT},#4EDFA0)`,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontSize:18}}>💬</span></div>
          <span style={{color:'#fff',fontWeight:700,fontSize:22}}>FlexWay</span>
        </div>
        <p style={{color:'#3D4F6B',fontSize:13,margin:'0 0 24px',letterSpacing:'1.5px',textTransform:'uppercase'}}>Agent WhatsApp IA</p>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',marginBottom:6}}>
          {STEPS.map((s,i)=>{const ia=s.n===step,id=s.n<step;return(<div key={s.n} style={{display:'flex',alignItems:'center'}}><div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}><div style={{width:34,height:34,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',background:id?ACCENT:ia?ACCENT_BG:'transparent',border:`2px solid ${id||ia?ACCENT:'#1E2940'}`,color:id?'#070B17':ia?ACCENT:'#3D4F6B',fontSize:13,fontWeight:600}}>{id?'✓':s.n}</div><span style={{color:ia?ACCENT:'#2D3F5E',fontSize:10,whiteSpace:'nowrap',textTransform:'uppercase',letterSpacing:'0.5px'}}>{s.l}</span></div>{i<STEPS.length-1&&<div style={{width:60,height:2,background:s.n<step?ACCENT:'#1A2540',margin:'0 4px',marginBottom:18}}/>}</div>);})}
        </div>
      </div>
      <div style={{maxWidth:740,margin:'18px auto 0',padding:'0 24px'}}>
        <div style={{height:3,background:'#1A2540',borderRadius:2,overflow:'hidden'}}><div style={{height:'100%',width:`${((step-1)/2)*100}%`,background:`linear-gradient(90deg,${ACCENT},#4EDFA0)`,transition:'width 0.4s ease',borderRadius:2}}/></div>
      </div>
      <div style={{maxWidth:740,margin:'18px auto 0',padding:'0 24px'}}>
        <div style={{background:'#0D1428',borderRadius:16,border:`1px solid ${ACCENT_BORDER}`,padding:'36px 40px'}}>
          <div style={{marginBottom:28}}>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:5}}>
              <div style={{width:4,height:28,background:`linear-gradient(180deg,${ACCENT},#4EDFA0)`,borderRadius:2,flexShrink:0}}/>
              <h2 style={{color:'#fff',fontSize:20,fontWeight:700,margin:0}}>{cur.t}</h2>
            </div>
            <p style={{color:'#8892B0',fontSize:14,margin:'0 0 0 16px'}}>{cur.s}</p>
          </div>
          {step===1&&<div>
            <div style={g2()}>
              {F('Nom de votre entreprise',true,errors.nomEntreprise,<input style={I(!!errors.nomEntreprise)} value={data.nomEntreprise} onChange={e=>set('nomEntreprise',e.target.value)} placeholder="Ex: Solidarité Assurances"/>)}
              {F('Secteur',false,undefined,Sel('secteur',SECTEURS))}
            </div>
            {F('Avez-vous déjà un compte WhatsApp Business ?',false,undefined,Radio('aWhatsAppBusiness',['Oui, actif','Oui, peu utilisé','Non, pas encore']))}
            {F('Volume de messages reçus par jour',false,undefined,Radio('volumeMessages',VOLUMES))}
            {F('Types de demandes reçues',false,undefined,Multi('typesDemandes',DEMANDES),'Sélectionnez tout ce que vos clients vous envoient')}
            <div style={{display:'flex',gap:16,marginBottom:20}}>
              <div style={{flex:1}}><label style={L()}>Heure début réponse</label><input style={I()} value={data.heureDebut} onChange={e=>set('heureDebut',e.target.value)} placeholder="08"/></div>
              <div style={{flex:1}}><label style={L()}>Heure fin réponse</label><input style={I()} value={data.heureFin} onChange={e=>set('heureFin',e.target.value)} placeholder="18"/></div>
            </div>
            {F('Messages reçus hors horaires ?',false,undefined,Radio('messagesHorsHoraires',HORS))}
          </div>}
          {step===2&&<div>
            {F("Nom de votre agent IA",false,undefined,<input style={I()} value={data.nomAgent} onChange={e=>set('nomAgent',e.target.value)} placeholder="Ex: Koffi, Awa, Assistant Solidarité..."/>,"Comment s'appellera votre assistant ?")}
            {F('Ton de communication souhaité',false,undefined,Radio('ton',TONES))}
            {F('Langue(s) de réponse',false,undefined,Multi('langues',LANGS))}
            <div style={{padding:'14px 18px',borderRadius:10,background:'rgba(37,201,132,0.05)',border:'1px solid rgba(37,201,132,0.15)',marginBottom:20}}>
              <p style={{color:ACCENT,fontSize:12,fontWeight:600,margin:'0 0 12px',textTransform:'uppercase',letterSpacing:'0.8px'}}>Top 3 questions fréquentes de vos clients</p>
              {(['question1','question2','question3'] as const).map((f,i)=>(
                <div key={f} style={{marginBottom:10}}>
                  <label style={{...L(),textTransform:'none' as const,fontSize:11,color:'#3D4F6B'}}>{i+1}. Question fréquente</label>
                  <input style={I()} value={data[f]} onChange={e=>set(f,e.target.value)} placeholder={i===0?'Ex: Comment déclarer un sinistre auto ?':i===1?'Ex: Quel est le prix de votre assurance auto ?':'Ex: Comment prendre rendez-vous ?'}/>
                </div>
              ))}
            </div>
            <div style={g2()}>
              {F("L'agent prend-il des rendez-vous ?",false,undefined,Radio('priseRDV',OUI_NON))}
              {F("L'agent donne-t-il des prix/devis ?",false,undefined,Radio('donnerPrix',OUI_NON))}
            </div>
          </div>}
          {step===3&&<div>
            {F("Règles d'escalade vers un humain",false,undefined,<textarea style={T()} value={data.reglesEscalade} onChange={e=>set('reglesEscalade',e.target.value)} placeholder="Ex: Transférer vers humain quand: le client est en colère, quand le montant > 500k FCFA..."/>,"Décrivez les situations où l'agent IA doit passer la main")}
            {F('Numéro WhatsApp Business (si existant)',false,undefined,<input style={I()} value={data.numeroWhatsApp} onChange={e=>set('numeroWhatsApp',e.target.value)} placeholder="+225 07 00 00 00"/>)}
            <div style={{borderTop:'1px solid #1A2540',marginBottom:20,marginTop:4}}/>
            <div style={g2()}>
              {F('Nom & Prénom',true,errors.nomContact,<input style={I(!!errors.nomContact)} value={data.nomContact} onChange={e=>set('nomContact',e.target.value)} placeholder="Votre nom"/>)}
              {F('Téléphone',true,errors.telContact,<input style={I(!!errors.telContact)} value={data.telContact} onChange={e=>set('telContact',e.target.value)} placeholder="+225 07 00 00 00"/>)}
            </div>
            {F('Email',true,errors.emailContact,<input style={I(!!errors.emailContact)} value={data.emailContact} onChange={e=>set('emailContact',e.target.value)} placeholder="vous@votrecompagnie.ci" type="email"/>)}
            {F('Budget mensuel approximatif',false,undefined,Radio('budget',BUDGETS))}
          </div>}
          <div style={{display:'flex',justifyContent:step===1?'flex-end':'space-between',marginTop:28,paddingTop:22,borderTop:'1px solid #1A2540'}}>
            {step>1&&<button onClick={prev} style={{padding:'11px 26px',borderRadius:8,border:'1px solid #1A2540',background:'transparent',color:'#8892B0',fontSize:15,cursor:'pointer'}}>← Précédent</button>}
            {step<3&&<button onClick={next} style={{padding:'11px 34px',borderRadius:8,border:'none',background:`linear-gradient(135deg,${ACCENT},#4EDFA0)`,color:'#070B17',fontSize:15,fontWeight:700,cursor:'pointer'}}>Suivant →</button>}
            {step===3&&<button onClick={()=>void submit()} disabled={submitting} style={{padding:'12px 38px',borderRadius:8,border:'none',background:submitting?'#1A2540':`linear-gradient(135deg,${ACCENT},#4EDFA0)`,color:submitting?'#8892B0':'#070B17',fontSize:15,fontWeight:700,cursor:'pointer'}}>{submitting?'⏳ Envoi...':'✓ Soumettre'}</button>}
          </div>
        </div>
        <p style={{textAlign:'center',color:'#1A2540',fontSize:12,marginTop:18}}>© 2025 FlexWay</p>
      </div>
    </div>
  );
}
