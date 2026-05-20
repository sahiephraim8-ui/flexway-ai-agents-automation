import { useState } from 'react';
import { api } from '@appdeploy/client';
import { useNavigate } from 'react-router-dom';

interface OFormData {
  nomSociete: string; secteur: string; siteActuel: string; anneeSite: string;
  problemes: string[]; objectifs: string[]; budget: string; delai: string;
  nomContact: string; emailContact: string; telContact: string; description: string;
}
const INIT: OFormData = { nomSociete:'', secteur:'', siteActuel:'', anneeSite:'', problemes:[], objectifs:[], budget:'', delai:'', nomContact:'', emailContact:'', telContact:'', description:'' };
const PROBLEMES = ['Site lent (>3s)', 'Pas adapté mobile', 'Mauvais référencement Google', 'Design obsolète', 'Pas de conversions', 'Contenu difficile à mettre à jour', 'Sécurité insuffisante', 'Analytics manquants'];
const OBJECTIFS = ['Augmenter les leads', 'Améliorer la visibilité', 'Moderniser le design', 'Booster la vitesse', 'Améliorer le SEO', 'Ajouter des fonctionnalités', 'Refonte complète', 'Sécurisation SSL/HTTPS'];
const BUDGETS = ['Moins de 200 000 FCFA', '200 000 — 500 000 FCFA', '500 000 — 1 500 000 FCFA', 'Plus de 1 500 000 FCFA'];
const DELAIS = ['1 mois', '2 à 3 mois', '3 à 6 mois', 'Pas pressé'];
const STEPS = [{n:1,l:'Identité'},{n:2,l:'Site actuel'},{n:3,l:'Objectifs'},{n:4,l:'Contact'}];
const OR = '#E87C3E', OR_RGB = '232,124,62';

export default function OptimisationForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OFormData>(INIT);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [submitting, setSubmitting] = useState(false);
  const nav = useNavigate();

  const set = (f: keyof OFormData, v: string|string[]) => { setData(p=>({...p,[f]:v})); setErrors(p=>{const e={...p};delete e[f];return e;}); };
  const tog = (arr: string[], key: keyof OFormData, val: string) => { set(key, arr.includes(val) ? arr.filter(x=>x!==val) : [...arr, val]); };

  const validate = (s: number) => {
    const e: Record<string,string> = {};
    if(s===1){if(!data.nomSociete.trim())e.nomSociete='Obligatoire';if(!data.secteur.trim())e.secteur='Obligatoire';}
    if(s===2){if(!data.siteActuel.trim())e.siteActuel='Obligatoire';}
    if(s===3){if(!data.objectifs.length)e.objectifs='Sélectionnez au moins un objectif';}
    if(s===4){if(!data.nomContact.trim())e.nomContact='Obligatoire';if(!data.emailContact.trim()||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.emailContact))e.emailContact='Email invalide';if(!data.telContact.trim())e.telContact='Obligatoire';}
    setErrors(e); return !Object.keys(e).length;
  };

  const next = () => { if(validate(step)){setStep(s=>s+1);window.scrollTo(0,0);} };
  const prev = () => { setStep(s=>s-1);window.scrollTo(0,0); };

  const submit = async () => {
    if(!validate(4))return; setSubmitting(true);
    try{
      const r = await api.post('/api/submit',{formData:data,files:[],serviceType:'optimisation'});
      const t = (r.data as{token?:string}).token||'';
      nav('/merci?s=optim'+(t?'&t='+t:''));
    } catch{ alert('Erreur. Veuillez réessayer.'); } finally{ setSubmitting(false); }
  };

  const I=(err?:boolean): React.CSSProperties=>({width:'100%',background:'#0A0F1E',border:`1px solid ${err?'#FF6B6B':'#1E2940'}`,borderRadius:8,padding:'12px 16px',color:'#fff',fontSize:15,outline:'none',boxSizing:'border-box',fontFamily:'Inter,sans-serif'});
  const T=(): React.CSSProperties=>({...I(),resize:'vertical' as const,minHeight:100});
  const L=(): React.CSSProperties=>({display:'block',marginBottom:8,color:'#8892B0',fontSize:12,letterSpacing:'0.8px',textTransform:'uppercase' as const});
  const F=(label:string,req:boolean,err:string|undefined,child:React.ReactNode,hint?:string)=>(
    <div style={{marginBottom:22}}>
      <label style={L()}>{label}{req&&<span style={{color:OR}}> *</span>}</label>
      {hint&&<p style={{color:'#3D4F6B',fontSize:12,margin:'-4px 0 8px',fontStyle:'italic'}}>{hint}</p>}
      {child}
      {err&&<p style={{marginTop:6,color:'#FF6B6B',fontSize:13}}>{err}</p>}
    </div>
  );

  const ChkGrid = (items: string[], arr: string[], key: keyof OFormData) => (
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))',gap:10}}>
      {items.map(p=>{ const ch=arr.includes(p); return (
        <button key={p} onClick={()=>tog(arr,key,p)} type="button" style={{padding:'10px 14px',borderRadius:8,cursor:'pointer',textAlign:'left',background:ch?`rgba(${OR_RGB},0.1)`:'#0A0F1E',border:`1px solid ${ch?OR:'#1E2940'}`,color:ch?OR:'#8892B0',fontSize:13,transition:'all 0.15s',display:'flex',alignItems:'center',gap:10}}>
          <span style={{width:18,height:18,borderRadius:4,border:`2px solid ${ch?OR:'#1E2940'}`,background:ch?OR:'transparent',display:'inline-flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{ch&&<span style={{color:'#070B17',fontSize:11,fontWeight:800}}>✓</span>}</span>{p}
        </button>
      );})}
    </div>
  );

  const titles = ['Votre entreprise','Votre site actuel','Vos objectifs','Vos coordonnées'];
  const subtitles = ['Dites-nous qui vous êtes','Montrez-nous ce que vous avez','Définissons les résultats attendus','Pour vous recontacter sous 24h'];

  const renderStep = () => {
    if(step===1) return (
      <div>
        <div style={{padding:'16px 20px',borderRadius:12,background:`rgba(${OR_RGB},0.06)`,border:`1px solid rgba(${OR_RGB},0.2)`,marginBottom:28}}>
          <p style={{color:OR,fontWeight:700,fontSize:14,margin:'0 0 6px'}}>🔍 Audit de site — 50 000 FCFA</p>
          <p style={{color:'#8892B0',fontSize:13,margin:0,lineHeight:1.6}}>Analyse approfondie de votre site. Ce montant est <strong style={{color:'#fff'}}>déductible</strong> du coût total si vous validez le projet.</p>
        </div>
        {F('Nom de la société',true,errors.nomSociete,<input style={I(!!errors.nomSociete)} value={data.nomSociete} onChange={e=>set('nomSociete',e.target.value)} placeholder="Ex: Solidarité Assurances SA"/>)}
        {F("Secteur d'activité",true,errors.secteur,<input style={I(!!errors.secteur)} value={data.secteur} onChange={e=>set('secteur',e.target.value)} placeholder="Ex: Assurances, Immobilier, Commerce..."/>)}
        {F('Description libre',false,undefined,<textarea style={T()} value={data.description} onChange={e=>set('description',e.target.value)} placeholder="Décrivez brièvement votre activité..."/>,'Facultatif')}
      </div>
    );
    if(step===2) return (
      <div>
        {F('URL de votre site actuel',true,errors.siteActuel,<input style={I(!!errors.siteActuel)} value={data.siteActuel} onChange={e=>set('siteActuel',e.target.value)} placeholder="https://www.votresite.ci"/>)}
        {F('Année de création du site',false,undefined,<input style={I()} value={data.anneeSite} onChange={e=>set('anneeSite',e.target.value)} placeholder="Ex: 2019"/>,'Approximativement')}
        <div style={{marginBottom:22}}>
          <label style={L()}>Problèmes identifiés</label>
          <p style={{color:'#3D4F6B',fontSize:12,margin:'-4px 0 12px',fontStyle:'italic'}}>Sélectionnez tout ce qui correspond</p>
          {ChkGrid(PROBLEMES, data.problemes, 'problemes')}
        </div>
      </div>
    );
    if(step===3) return (
      <div>
        <div style={{marginBottom:22}}>
          <label style={L()}>Objectifs de l'optimisation<span style={{color:OR}}> *</span></label>
          {ChkGrid(OBJECTIFS, data.objectifs, 'objectifs')}
          {errors.objectifs&&<p style={{marginTop:8,color:'#FF6B6B',fontSize:13}}>{errors.objectifs}</p>}
        </div>
        <div style={{marginBottom:22}}>
          <label style={L()}>Budget</label>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:10}}>
            {BUDGETS.map(b=>{const s=data.budget===b;return(<button key={b} onClick={()=>set('budget',b)} type="button" style={{padding:'11px 14px',borderRadius:8,cursor:'pointer',background:s?`rgba(${OR_RGB},0.1)`:'#0A0F1E',border:`1px solid ${s?OR:'#1E2940'}`,color:s?OR:'#8892B0',fontSize:13}}>{b}</button>);})}
          </div>
        </div>
        <div style={{marginBottom:22}}>
          <label style={L()}>Délai souhaité</label>
          <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
            {DELAIS.map(d=>{const s=data.delai===d;return(<button key={d} onClick={()=>set('delai',d)} type="button" style={{padding:'10px 20px',borderRadius:8,cursor:'pointer',background:s?`rgba(${OR_RGB},0.1)`:'#0A0F1E',border:`1px solid ${s?OR:'#1E2940'}`,color:s?OR:'#8892B0',fontSize:13}}>{d}</button>);})}
          </div>
        </div>
      </div>
    );
    return (
      <div>
        <div style={{padding:'14px 18px',borderRadius:10,background:'rgba(201,160,80,0.05)',border:'1px solid rgba(201,160,80,0.15)',marginBottom:24}}>
          <p style={{color:'#C9A050',fontSize:13,margin:0}}>✅ Notre équipe vous contacte sous 24h pour organiser l'audit.</p>
        </div>
        {F('Votre nom',true,errors.nomContact,<input style={I(!!errors.nomContact)} value={data.nomContact} onChange={e=>set('nomContact',e.target.value)} placeholder="Ex: Kouamé Jean-Marie"/>)}
        {F('Email',true,errors.emailContact,<input style={I(!!errors.emailContact)} value={data.emailContact} onChange={e=>set('emailContact',e.target.value)} placeholder="vous@societe.ci" type="email"/>)}
        {F('Téléphone',true,errors.telContact,<input style={I(!!errors.telContact)} value={data.telContact} onChange={e=>set('telContact',e.target.value)} placeholder="+225 07 00 00 00"/>)}
      </div>
    );
  };

  return (
    <div style={{background:'#070B17',minHeight:'100vh',fontFamily:'Inter,-apple-system,sans-serif',backgroundImage:`radial-gradient(ellipse at 30% 20%, rgba(${OR_RGB},0.06) 0%, transparent 50%)`}}>
      <div style={{maxWidth:680,margin:'0 auto',padding:'40px 24px 80px'}}>
        <div style={{marginBottom:32}}>
          <button onClick={()=>nav('/')} style={{background:'transparent',border:'none',color:'#8892B0',cursor:'pointer',fontSize:13,padding:0,marginBottom:20}}>← Retour</button>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
            <div style={{width:38,height:38,borderRadius:9,background:`linear-gradient(135deg,${OR},#F5A070)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>🔧</div>
            <div>
              <h1 style={{color:'#fff',fontSize:22,fontWeight:700,margin:0}}>Optimisation de Site Web</h1>
              <p style={{color:'#8892B0',fontSize:13,margin:0}}>Audit + corrections — 4 étapes · ~7 min</p>
            </div>
          </div>
          <div style={{display:'flex',gap:6,marginBottom:6}}>
            {STEPS.map(s=>(<div key={s.n} style={{flex:1,height:3,borderRadius:3,background:s.n<=step?OR:'#1A2540',transition:'background 0.3s'}}/>))}
          </div>
          <div style={{display:'flex',justifyContent:'space-between'}}>
            {STEPS.map(s=>(<span key={s.n} style={{color:s.n===step?OR:'#3D4F6B',fontSize:11,fontWeight:s.n===step?600:400}}>{s.l}</span>))}
          </div>
        </div>
        <div style={{background:'#0D1428',borderRadius:16,border:`1px solid rgba(${OR_RGB},0.1)`,padding:'32px 28px',marginBottom:20}}>
          <h2 style={{color:'#fff',fontSize:19,fontWeight:700,margin:'0 0 4px'}}>{titles[step-1]}</h2>
          <p style={{color:'#8892B0',fontSize:14,margin:'0 0 28px'}}>{subtitles[step-1]}</p>
          {renderStep()}
        </div>
        <div style={{display:'flex',gap:12}}>
          {step>1&&<button onClick={prev} style={{flex:1,padding:'14px',borderRadius:10,border:'1px solid #1E2940',background:'transparent',color:'#8892B0',fontSize:15,cursor:'pointer'}}>← Précédent</button>}
          {step<4
            ?<button onClick={next} style={{flex:2,padding:'14px',borderRadius:10,border:'none',background:`linear-gradient(135deg,${OR},#F5A070)`,color:'#fff',fontSize:15,fontWeight:700,cursor:'pointer'}}>Suivant →</button>
            :<button onClick={()=>void submit()} disabled={submitting} style={{flex:2,padding:'14px',borderRadius:10,border:'none',background:submitting?'#1A2540':`linear-gradient(135deg,${OR},#F5A070)`,color:submitting?'#8892B0':'#fff',fontSize:15,fontWeight:700,cursor:'pointer'}}>{submitting?"Envoi...":"Envoyer ma demande d'audit →"}</button>
          }
        </div>
      </div>
    </div>
  );
}
