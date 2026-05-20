import { useState } from 'react';
import { api } from '@appdeploy/client';
import { useNavigate } from 'react-router-dom';

const ACCENT = '#5B8AF5', ACCENT_BG = 'rgba(91,138,245,0.1)', ACCENT_BORDER = 'rgba(91,138,245,0.25)';

interface WFData {
  nomEntreprise: string; secteur: string; problemePrincipal: string; tacheChronophage: string;
  outilsActuels: string[]; volumeWhatsApp: string; volumeEmails: string; volumeDossiers: string; typesDonnees: string[];
  prioritesAutomatisation: string[]; descriptionLibre: string; urgence: string;
  nomContact: string; emailContact: string; telContact: string; tailleEquipe: string; budget: string;
}
const INIT: WFData = { nomEntreprise:'', secteur:'Assurance', problemePrincipal:'', tacheChronophage:'', outilsActuels:[], volumeWhatsApp:'', volumeEmails:'', volumeDossiers:'', typesDonnees:[], prioritesAutomatisation:[], descriptionLibre:'', urgence:'', nomContact:'', emailContact:'', telContact:'', tailleEquipe:'', budget:'' };
const SECTEURS = ['Assurance','Banque / Finance','Commerce / Distribution','Industrie / BTP','Services B2B','Santé','Autre'];
const OUTILS = ['WhatsApp Business','Email / Gmail','Excel / Google Sheets','CRM','ERP / Logiciel métier','Formulaires papier','Aucun outil structuré'];
const DONNEES = ['PDFs','Photos / Images','Fichiers Excel','Formulaires papier','Messages texte','Données clients','Autre'];
const PRIOS = ['Relances clients automatiques','Génération de devis','Reporting automatisé','Suivi dossiers / sinistres','Envoi de documents','Facturation','Notifications & alertes','Saisie de données','Autre'];
const VOLUMES_WA = ['Moins de 10/jour','10 à 50/jour','50 à 200/jour','Plus de 200/jour'];
const VOLUMES_EMAIL = ['Moins de 20/jour','20 à 100/jour','100 à 500/jour','Plus de 500/jour'];
const URGENCES = ['Dans 1 mois','Sous 3 mois','Dans 6 mois','Pas pressé — on explore'];
const TAILLES = ['1 à 5 personnes','5 à 20 personnes','20 à 50 personnes','Plus de 50 personnes'];
const BUDGETS = ['Moins de 100 000 FCFA','100 000 à 300 000 FCFA','300 000 à 1 000 000 FCFA','Plus de 1 000 000 FCFA','Budget à définir'];
const STEPS = [{n:1,l:'Activité'},{n:2,l:'Outils'},{n:3,l:'Vision'},{n:4,l:'Contact'}];
const STITLES = [
  {t:'Votre activité & problème',s:'Décrivez votre situation actuelle et votre principal problème'},
  {t:'Vos outils & volumes',s:'Quels outils utilisez-vous et quel est votre volume quotidien ?'},
  {t:"Ce que vous voulez automatiser",s:"Vos priorités d'automatisation et votre vision"},
  {t:'Contact & Budget',s:'Pour que notre équipe puisse vous recontacter'},
];

export default function WorkflowForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WFData>(INIT);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [submitting, setSubmitting] = useState(false);
  const nav = useNavigate();

  const set = (f: keyof WFData, v: string|string[]) => { setData(p=>({...p,[f]:v})); setErrors(p=>{const e={...p};delete e[f];return e;}); };
  const tog = (f: keyof WFData, v: string) => { const cur = data[f] as string[]; set(f, cur.includes(v)?cur.filter(x=>x!==v):[...cur,v]); };

  const validate = (s: number) => {
    const e: Record<string,string> = {};
    if(s===1){if(!data.nomEntreprise.trim())e.nomEntreprise='Obligatoire';if(!data.problemePrincipal.trim())e.problemePrincipal='Obligatoire';}
    if(s===4){if(!data.nomContact.trim())e.nomContact='Obligatoire';if(!data.emailContact.trim()||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.emailContact))e.emailContact='Email invalide';if(!data.telContact.trim())e.telContact='Obligatoire';}
    setErrors(e); return !Object.keys(e).length;
  };

  const next = () => { if(validate(step)){setStep(s=>s+1);window.scrollTo(0,0);} };
  const prev = () => { setStep(s=>s-1);window.scrollTo(0,0); };

  const submit = async () => {
    if(!validate(4))return; setSubmitting(true);
    try{ await api.post('/api/submit',{formData:data,files:[],serviceType:'workflow'}); nav('/merci?s=workflow'); }
    catch{ alert('Erreur. Veuillez réessayer.'); } finally{ setSubmitting(false); }
  };

  const I=(err?:boolean): React.CSSProperties=>({width:'100%',background:'#0A0F1E',border:`1px solid ${err?'#FF6B6B':'#1E2940'}`,borderRadius:8,padding:'12px 16px',color:'#fff',fontSize:15,outline:'none',boxSizing:'border-box',fontFamily:'Inter,sans-serif'});
  const T=(err?:boolean): React.CSSProperties=>({...I(err),resize:'vertical' as const,minHeight:110});
  const L=(): React.CSSProperties=>({display:'block',marginBottom:8,color:'#8892B0',fontSize:12,letterSpacing:'0.8px',textTransform:'uppercase' as const});
  const g2=(): React.CSSProperties=>({display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 24px'});
  const F=(label:string,req:boolean,err:string|undefined,child:React.ReactNode,hint?:string)=>(
    <div style={{marginBottom:20}}>
      <label style={L()}>{label}{req&&<span style={{color:ACCENT}}> *</span>}</label>
      {hint&&<p style={{color:'#3D4F6B',fontSize:12,margin:'-4px 0 8px',fontStyle:'italic'}}>{hint}</p>}
      {child}
      {err&&<p style={{marginTop:5,color:'#FF6B6B',fontSize:13}}>{err}</p>}
    </div>
  );
  const Multi=(f: keyof WFData,items:string[])=>(
    <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
      {items.map(item=>{const ch=(data[f] as string[]).includes(item);return(<button key={item} type="button" onClick={()=>tog(f,item)} style={{padding:'8px 14px',borderRadius:7,cursor:'pointer',background:ch?ACCENT_BG:'#0A0F1E',border:`1px solid ${ch?ACCENT:'#1E2940'}`,color:ch?ACCENT:'#8892B0',fontSize:13,transition:'all 0.15s',display:'flex',alignItems:'center',gap:7}}><span style={{width:15,height:15,borderRadius:3,border:`1.5px solid ${ch?ACCENT:'#1E2940'}`,background:ch?ACCENT:'transparent',display:'inline-flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:9,color:'#070B17',fontWeight:800}}>{ch&&'✓'}</span>{item}</button>);})}
    </div>
  );
  const Radio=(f: keyof WFData,items:string[])=>(
    <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
      {items.map(item=>{const s=data[f]===item;return(<button key={item} type="button" onClick={()=>set(f,item)} style={{padding:'9px 16px',borderRadius:7,cursor:'pointer',background:s?ACCENT_BG:'#0A0F1E',border:`1px solid ${s?ACCENT:'#1E2940'}`,color:s?ACCENT:'#8892B0',fontSize:13}}>{item}</button>);})}
    </div>
  );
  const Sel=(f: keyof WFData,items:string[])=>(
    <select style={{...I(),cursor:'pointer'}} value={data[f] as string} onChange={e=>set(f,e.target.value)}>
      <option value="">— Sélectionner</option>
      {items.map(i=><option key={i} value={i}>{i}</option>)}
    </select>
  );

  const cur=STITLES[step-1];
  return (
    <div style={{background:'#070B17',minHeight:'100vh',fontFamily:'Inter,-apple-system,sans-serif',paddingBottom:80}}>
      <div style={{padding:'32px 24px 0',textAlign:'center',maxWidth:740,margin:'0 auto'}}>
        <button onClick={()=>nav('/')} style={{background:'transparent',border:'none',color:'#3D4F6B',fontSize:13,cursor:'pointer',marginBottom:16,display:'flex',alignItems:'center',gap:6,margin:'0 auto 16px'}}>← Retour à l'accueil</button>
        <div style={{display:'inline-flex',alignItems:'center',gap:12,marginBottom:6}}>
          <div style={{width:38,height:38,borderRadius:9,background:`linear-gradient(135deg,${ACCENT},#7FA3FF)`,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontSize:18}}>⚙️</span></div>
          <span style={{color:'#fff',fontWeight:700,fontSize:22}}>FlexWay</span>
        </div>
        <p style={{color:'#3D4F6B',fontSize:13,margin:'0 0 24px',letterSpacing:'1.5px',textTransform:'uppercase'}}>Workflows & Automatisation</p>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',marginBottom:6}}>
          {STEPS.map((s,i)=>{const ia=s.n===step,id=s.n<step;return(<div key={s.n} style={{display:'flex',alignItems:'center'}}><div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}><div style={{width:34,height:34,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',background:id?ACCENT:ia?ACCENT_BG:'transparent',border:`2px solid ${id||ia?ACCENT:'#1E2940'}`,color:id?'#fff':ia?ACCENT:'#3D4F6B',fontSize:13,fontWeight:600}}>{id?'✓':s.n}</div><span style={{color:ia?ACCENT:'#2D3F5E',fontSize:10,whiteSpace:'nowrap',textTransform:'uppercase',letterSpacing:'0.5px'}}>{s.l}</span></div>{i<STEPS.length-1&&<div style={{width:44,height:2,background:s.n<step?ACCENT:'#1A2540',margin:'0 4px',marginBottom:18}}/>}</div>);})}
        </div>
      </div>
      <div style={{maxWidth:740,margin:'18px auto 0',padding:'0 24px'}}>
        <div style={{height:3,background:'#1A2540',borderRadius:2,overflow:'hidden'}}><div style={{height:'100%',width:`${((step-1)/3)*100}%`,background:`linear-gradient(90deg,${ACCENT},#7FA3FF)`,transition:'width 0.4s ease',borderRadius:2}}/></div>
      </div>
      <div style={{maxWidth:740,margin:'18px auto 0',padding:'0 24px'}}>
        <div style={{background:'#0D1428',borderRadius:16,border:`1px solid ${ACCENT_BORDER}`,padding:'36px 40px'}}>
          <div style={{marginBottom:28}}>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:5}}>
              <div style={{width:4,height:28,background:`linear-gradient(180deg,${ACCENT},#7FA3FF)`,borderRadius:2,flexShrink:0}}/>
              <h2 style={{color:'#fff',fontSize:20,fontWeight:700,margin:0}}>{cur.t}</h2>
            </div>
            <p style={{color:'#8892B0',fontSize:14,margin:'0 0 0 16px'}}>{cur.s}</p>
          </div>
          {step===1&&<div>
            {F('Nom de votre entreprise',true,errors.nomEntreprise,<input style={I(!!errors.nomEntreprise)} value={data.nomEntreprise} onChange={e=>set('nomEntreprise',e.target.value)} placeholder="Ex: Solidarité Assurances SA"/>)}
            {F("Secteur d'activité",true,undefined,Sel('secteur',SECTEURS))}
            {F('Votre problème principal',true,errors.problemePrincipal,<textarea style={T(!!errors.problemePrincipal)} value={data.problemePrincipal} onChange={e=>set('problemePrincipal',e.target.value)} placeholder="Ex: Nous traitons 200+ messages WhatsApp/jour manuellement..."/>,'Décrivez concrètement ce qui vous prend du temps')}
            {F('Tâche la plus chronophage',false,undefined,<input style={I()} value={data.tacheChronophage} onChange={e=>set('tacheChronophage',e.target.value)} placeholder="Ex: Saisie manuelle des sinistres dans Excel"/>)}
          </div>}
          {step===2&&<div>
            {F('Outils actuellement utilisés',false,undefined,Multi('outilsActuels',OUTILS))}
            <div style={g2()}>
              {F('Volume messages WhatsApp / jour',false,undefined,Radio('volumeWhatsApp',VOLUMES_WA))}
              {F('Volume emails traités / jour',false,undefined,Radio('volumeEmails',VOLUMES_EMAIL))}
            </div>
            {F('Nombre de dossiers / semaine',false,undefined,<input style={I()} value={data.volumeDossiers} onChange={e=>set('volumeDossiers',e.target.value)} placeholder="Ex: 50 dossiers sinistres, 200 demandes devis"/>)}
            {F('Types de données manipulées',false,undefined,Multi('typesDonnees',DONNEES))}
          </div>}
          {step===3&&<div>
            {F('Automatisations prioritaires',false,undefined,Multi('prioritesAutomatisation',PRIOS))}
            {F('Décrivez librement votre vision',false,undefined,<textarea style={T()} value={data.descriptionLibre} onChange={e=>set('descriptionLibre',e.target.value)} placeholder="Ex: Idéalement, un client envoie son message WhatsApp, notre système détecte la demande..."/>)}
            {F("Niveau d'urgence",false,undefined,Radio('urgence',URGENCES))}
          </div>}
          {step===4&&<div>
            <div style={g2()}>
              {F('Nom & Prénom',true,errors.nomContact,<input style={I(!!errors.nomContact)} value={data.nomContact} onChange={e=>set('nomContact',e.target.value)} placeholder="Ex: Kouassi Jean-Marie"/>)}
              {F('Téléphone',true,errors.telContact,<input style={I(!!errors.telContact)} value={data.telContact} onChange={e=>set('telContact',e.target.value)} placeholder="+225 07 00 00 00"/>)}
            </div>
            {F('Email professionnel',true,errors.emailContact,<input style={I(!!errors.emailContact)} value={data.emailContact} onChange={e=>set('emailContact',e.target.value)} placeholder="vous@votrecompagnie.ci" type="email"/>)}
            <div style={g2()}>
              {F("Taille de l'équipe",false,undefined,Radio('tailleEquipe',TAILLES))}
              {F('Budget approximatif',false,undefined,Sel('budget',BUDGETS))}
            </div>
          </div>}
          <div style={{display:'flex',justifyContent:step===1?'flex-end':'space-between',marginTop:28,paddingTop:22,borderTop:'1px solid #1A2540'}}>
            {step>1&&<button onClick={prev} style={{padding:'11px 26px',borderRadius:8,border:'1px solid #1A2540',background:'transparent',color:'#8892B0',fontSize:15,cursor:'pointer'}}>← Précédent</button>}
            {step<4&&<button onClick={next} style={{padding:'11px 34px',borderRadius:8,border:'none',background:`linear-gradient(135deg,${ACCENT},#7FA3FF)`,color:'#fff',fontSize:15,fontWeight:700,cursor:'pointer'}}>Suivant →</button>}
            {step===4&&<button onClick={()=>void submit()} disabled={submitting} style={{padding:'12px 38px',borderRadius:8,border:'none',background:submitting?'#1A2540':`linear-gradient(135deg,${ACCENT},#7FA3FF)`,color:submitting?'#8892B0':'#fff',fontSize:15,fontWeight:700,cursor:'pointer'}}>{submitting?'⏳ Envoi...':'✓ Soumettre'}</button>}
          </div>
        </div>
        <p style={{textAlign:'center',color:'#1A2540',fontSize:12,marginTop:18}}>© 2025 FlexWay</p>
      </div>
    </div>
  );
}
