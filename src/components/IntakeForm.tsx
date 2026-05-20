import { useState } from 'react';
import { api } from '@appdeploy/client';
import { useNavigate } from 'react-router-dom';

interface FormData {
  raisonSociale: string; nomCommercial: string; formeJuridique: string;
  numeroAgrement: string; pays: string; villeSiege: string; adresseSiege: string;
  villesImplantation: string; anneeCreation: string; slogan: string;
  nomDG: string; emailDG: string; telDG: string;
  nomContact: string; emailContact: string; telContact: string; fonctionContact: string;
  typesAssurance: string[]; produitPhare: string; cibleClientele: string;
  nombreAgences: string; zonesCouvertes: string;
  valeurs: string; differenciateurs: string; anneesMarche: string;
  estimationPortefeuille: string; certifications: string;
  sitesReference: string; couleursPreferees: string; presentationEntreprise: string; temoignages: string; budget: string; delai: string; fonctionnalites: string[];
}
interface UploadFile { name: string; type: string; base64: string; category: string; sizeKB: number; }

const INIT: FormData = {
  raisonSociale: '', nomCommercial: '', formeJuridique: 'SA', numeroAgrement: '',
  pays: "Côte d'Ivoire", villeSiege: 'Abidjan', adresseSiege: '', villesImplantation: '',
  anneeCreation: '', slogan: '', nomDG: '', emailDG: '', telDG: '',
  nomContact: '', emailContact: '', telContact: '', fonctionContact: '',
  typesAssurance: [], produitPhare: '', cibleClientele: '', nombreAgences: '', zonesCouvertes: '',
  valeurs: '', differenciateurs: '', anneesMarche: '', estimationPortefeuille: '',
  certifications: '', sitesReference: '', couleursPreferees: '', presentationEntreprise: '', temoignages: '', budget: '', delai: '', fonctionnalites: [],
};

const INS = ['Assurance Vie','Assurance Auto','Assurance Habitation / Multirisque','Assurance Santé','Assurance Professionnelle / RC','Assurance Voyage','Retraite & Épargne','Assurance Agriculture','Assurance Maritime / Transport','Cautionnement & Garanties'];
const FCATS = [
  { key: 'logo', label: 'Logo de la société', hint: 'PNG, SVG, AI — haute résolution', accept: '.png,.jpg,.jpeg,.svg,.ai,.eps', req: true },
  { key: 'charte', label: 'Charte graphique', hint: 'PDF, AI, PSD ou ZIP', accept: '.pdf,.ai,.psd,.zip', req: false },
  { key: 'equipe', label: "Photos de l'équipe", hint: 'JPEG ou PNG — dirigeants', accept: '.jpg,.jpeg,.png', req: false },
  { key: 'agences', label: 'Photos des agences', hint: 'JPEG ou PNG — bureaux', accept: '.jpg,.jpeg,.png', req: false },
  { key: 'plaquette', label: 'Plaquette commerciale', hint: 'PDF — brochure', accept: '.pdf', req: false },
  { key: 'agrement', label: "Document d'agrément", hint: 'PDF ou scan officiel', accept: '.pdf,.jpg,.jpeg,.png', req: false },
];
const STEPS = [{n:1,l:'Identité'},{n:2,l:'Contacts'},{n:3,l:'Offres'},{n:4,l:'Atouts'},{n:5,l:'Assets'}];
const STITLES = [
  {t:'Identité de la Société',s:'Informations légales et de base sur votre compagnie'},
  {t:'Contacts Clés',s:'Qui dirige la compagnie et qui sera notre interlocuteur projet'},
  {t:'Offres & Services',s:"Vos produits d'assurance et votre positionnement commercial"},
  {t:'Vos Atouts',s:"Ce qui fait la force et l'identité de votre compagnie"},
  {t:'Assets & Documents',s:'Vos fichiers graphiques et documents officiels'},
];
const FORMES = ['SA','SARL','SAS','GIE','SA Unipersonnelle','Autre'];
const FONCTS = ['Simulateur de devis','Espace client sécurisé','Chatbot / Assistant IA','Blog / Actualités','Galerie / Médiathèque','Formulaire de contact avancé','FAQ interactive','Téléchargement documents'];
const BUDGETS = ["Moins de 500 000 FCFA","500 000 — 1 000 000 FCFA","1 000 000 — 3 000 000 FCFA","Plus de 3 000 000 FCFA","À définir avec l'équipe"];
const DELAIS = ['2 semaines','1 mois','2 à 3 mois','Pas pressé — on explore'];

function b64(file: File): Promise<string> {
  return new Promise((res,rej) => { const r=new FileReader(); r.onload=()=>res((r.result as string).split(',')[1]); r.onerror=rej; r.readAsDataURL(file); });
}

export default function IntakeForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(INIT);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [drag, setDrag] = useState<string|null>(null);
  const nav = useNavigate();

  const set = (f: keyof FormData, v: string|string[]) => { setData(p=>({...p,[f]:v})); setErrors(p=>{const e={...p};delete e[f];return e;}); };
  const tog = (t: string) => { const c=data.typesAssurance; set('typesAssurance',c.includes(t)?c.filter(x=>x!==t):[...c,t]); };

  const validate = (s: number) => {
    const e: Record<string,string> = {};
    if(s===1){if(!data.raisonSociale.trim())e.raisonSociale='Obligatoire';if(!data.anneeCreation.trim())e.anneeCreation='Obligatoire';if(!data.adresseSiege.trim())e.adresseSiege='Obligatoire';}
    if(s===2){if(!data.nomDG.trim())e.nomDG='Obligatoire';if(!data.emailDG.trim()||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.emailDG))e.emailDG='Email invalide';if(!data.telDG.trim())e.telDG='Obligatoire';if(!data.nomContact.trim())e.nomContact='Obligatoire';if(!data.emailContact.trim()||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.emailContact))e.emailContact='Email invalide';if(!data.telContact.trim())e.telContact='Obligatoire';}
    if(s===3){if(!data.typesAssurance.length)e.typesAssurance='Sélectionnez au moins un produit';if(!data.cibleClientele)e.cibleClientele='Obligatoire';}
    if(s===4){if(!data.differenciateurs.trim())e.differenciateurs='Obligatoire';}
    if(s===5){if(!files.some(f=>f.category==='logo'))e.logo='Le logo est obligatoire';}
    setErrors(e); return !Object.keys(e).length;
  };

  const next = () => { if(validate(step)){setStep(s=>s+1);window.scrollTo(0,0);} };
  const prev = () => { setStep(s=>s-1);window.scrollTo(0,0); };

  const addFiles = async (fl: File[], cat: string) => {
    const r: UploadFile[] = [];
    for(const f of fl){ if(f.size>10*1024*1024){alert(`"${f.name}" dépasse 10 MB.`);continue;} try{r.push({name:f.name,type:f.type,base64:await b64(f),category:cat,sizeKB:Math.round(f.size/1024)});}catch{console.warn(`Read failed: ${f.name}`);} }
    setFiles(p=>[...p,...r]); setErrors(p=>{const e={...p};delete e.logo;return e;});
  };

  const submit = async () => { if(!validate(5))return; setSubmitting(true); try{const r=await api.post('/api/submit',{formData:data,files,serviceType:'siteweb'});const t=(r.data as{token?:string}).token||'';nav('/merci?s=web'+(t?'&t='+t:''));}catch{alert('Erreur. Veuillez réessayer.');}finally{setSubmitting(false);} };

  const I=(err?:boolean): React.CSSProperties=>({width:'100%',background:'#0A0F1E',border:`1px solid ${err?'#FF6B6B':'#1E2940'}`,borderRadius:8,padding:'12px 16px',color:'#fff',fontSize:15,outline:'none',boxSizing:'border-box',fontFamily:'Inter,sans-serif'});
  const T=(err?:boolean): React.CSSProperties=>({...I(err),resize:'vertical' as const,minHeight:100});
  const L=(): React.CSSProperties=>({display:'block',marginBottom:8,color:'#8892B0',fontSize:12,letterSpacing:'0.8px',textTransform:'uppercase' as const,fontFamily:'Inter,sans-serif'});
  const g2=(): React.CSSProperties=>({display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'0 24px'});
  const F=(label:string,req:boolean,err:string|undefined,child:React.ReactNode,hint?:string)=>(
    <div style={{marginBottom:22}}>
      <label style={L()}>{label}{req&&<span style={{color:'#C9A050'}}> *</span>}</label>
      {hint&&<p style={{color:'#3D4F6B',fontSize:12,margin:'-4px 0 8px',fontStyle:'italic'}}>{hint}</p>}
      {child}
      {err&&<p style={{marginTop:6,color:'#FF6B6B',fontSize:13}}>{err}</p>}
    </div>
  );
  const SB=(): React.CSSProperties=>({borderRadius:12,border:'1px solid rgba(201,160,80,0.15)',padding:20,marginBottom:24,background:'rgba(201,160,80,0.03)'});

  const renderStep = () => {
    if(step===1) return (
      <div>
        <div style={g2()}>
          {F('Raison Sociale',true,errors.raisonSociale,<input style={I(!!errors.raisonSociale)} value={data.raisonSociale} onChange={e=>set('raisonSociale',e.target.value)} placeholder="Ex: Solidarité Assurances SA"/>)}
          {F('Nom Commercial',false,undefined,<input style={I()} value={data.nomCommercial} onChange={e=>set('nomCommercial',e.target.value)} placeholder="Ex: SolAss"/>,'Si différent')}
        </div>
        <div style={g2()}>
          {F('Forme Juridique',true,undefined,<select style={{...I(),cursor:'pointer'}} value={data.formeJuridique} onChange={e=>set('formeJuridique',e.target.value)}>{FORMES.map(f=><option key={f} value={f}>{f}</option>)}</select>)}
          {F("Numéro d'Agrément",false,undefined,<input style={I()} value={data.numeroAgrement} onChange={e=>set('numeroAgrement',e.target.value)} placeholder="Ex: CI-ASSUR-2010-0042"/>,'CIMA ou national')}
        </div>
        <div style={g2()}>
          {F('Pays',true,undefined,<input style={I()} value={data.pays} onChange={e=>set('pays',e.target.value)} placeholder="Côte d'Ivoire"/>)}
          {F('Ville du Siège',true,undefined,<input style={I()} value={data.villeSiege} onChange={e=>set('villeSiege',e.target.value)} placeholder="Abidjan"/>)}
        </div>
        {F('Adresse complète du Siège',true,errors.adresseSiege,<input style={I(!!errors.adresseSiege)} value={data.adresseSiege} onChange={e=>set('adresseSiege',e.target.value)} placeholder="Ex: Plateau, Avenue Franchet d'Esperey, Immeuble Trade Center"/>)}
        <div style={g2()}>
          {F('Année de Création',true,errors.anneeCreation,<input style={I(!!errors.anneeCreation)} value={data.anneeCreation} onChange={e=>set('anneeCreation',e.target.value)} placeholder="Ex: 2005"/>)}
          {F("Villes d'Implantation",false,undefined,<input style={I()} value={data.villesImplantation} onChange={e=>set('villesImplantation',e.target.value)} placeholder="Ex: Abidjan, Bouaké, San Pedro"/>,'Toutes vos agences')}
        </div>
        {F('Slogan / Tagline',false,undefined,<input style={I()} value={data.slogan} onChange={e=>set('slogan',e.target.value)} placeholder='Ex: "Votre sécurité, notre engagement"'/>)}
      </div>
    );
    if(step===2) return (
      <div>
        <div style={SB()}>
          <p style={{color:'#C9A050',fontSize:12,fontWeight:600,textTransform:'uppercase',letterSpacing:'1px',margin:'0 0 16px'}}>Directeur Général</p>
          <div style={g2()}>
            {F('Nom & Prénom',true,errors.nomDG,<input style={I(!!errors.nomDG)} value={data.nomDG} onChange={e=>set('nomDG',e.target.value)} placeholder="Ex: Kouassi Jean-Marie"/>)}
            {F('Téléphone',true,errors.telDG,<input style={I(!!errors.telDG)} value={data.telDG} onChange={e=>set('telDG',e.target.value)} placeholder="+225 07 00 00 00"/>)}
          </div>
          {F('Email professionnel',true,errors.emailDG,<input style={I(!!errors.emailDG)} value={data.emailDG} onChange={e=>set('emailDG',e.target.value)} placeholder="dg@votrecompagnie.ci" type="email"/>)}
        </div>
        <div style={SB()}>
          <p style={{color:'#C9A050',fontSize:12,fontWeight:600,textTransform:'uppercase',letterSpacing:'1px',margin:'0 0 4px'}}>Responsable du Projet Digital</p>
          <p style={{color:'#3D4F6B',fontSize:12,margin:'0 0 16px'}}>La personne que nous contacterons pour les échanges du projet</p>
          <div style={g2()}>
            {F('Nom & Prénom',true,errors.nomContact,<input style={I(!!errors.nomContact)} value={data.nomContact} onChange={e=>set('nomContact',e.target.value)} placeholder="Ex: N'Guessan Amara"/>)}
            {F('Fonction',false,undefined,<input style={I()} value={data.fonctionContact} onChange={e=>set('fonctionContact',e.target.value)} placeholder="Ex: Directeur Marketing"/>)}
          </div>
          <div style={g2()}>
            {F('Email',true,errors.emailContact,<input style={I(!!errors.emailContact)} value={data.emailContact} onChange={e=>set('emailContact',e.target.value)} placeholder="contact@votrecompagnie.ci" type="email"/>)}
            {F('Téléphone',true,errors.telContact,<input style={I(!!errors.telContact)} value={data.telContact} onChange={e=>set('telContact',e.target.value)} placeholder="+225 05 00 00 00"/>)}
          </div>
        </div>
      </div>
    );
    if(step===3) return (
      <div>
        <div style={{marginBottom:22}}>
          <label style={L()}>Produits d'assurance proposés<span style={{color:'#C9A050'}}> *</span></label>
          <p style={{color:'#3D4F6B',fontSize:12,margin:'-4px 0 12px',fontStyle:'italic'}}>Sélectionnez tout ce qui s'applique</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:10}}>
            {INS.map(t=>{const ch=data.typesAssurance.includes(t);return(<button key={t} onClick={()=>tog(t)} type="button" style={{padding:'10px 14px',borderRadius:8,cursor:'pointer',textAlign:'left',background:ch?'rgba(201,160,80,0.1)':'#0A0F1E',border:`1px solid ${ch?'#C9A050':'#1E2940'}`,color:ch?'#C9A050':'#8892B0',fontSize:13,display:'flex',alignItems:'center',gap:10}}><span style={{width:18,height:18,borderRadius:4,border:`2px solid ${ch?'#C9A050':'#1E2940'}`,background:ch?'#C9A050':'transparent',display:'inline-flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{ch&&<span style={{color:'#070B17',fontSize:11,fontWeight:800}}>✓</span>}</span>{t}</button>);})}
          </div>
          {errors.typesAssurance&&<p style={{marginTop:8,color:'#FF6B6B',fontSize:13}}>{errors.typesAssurance}</p>}
        </div>
        {F('Produit / Service phare',false,undefined,<textarea style={T()} value={data.produitPhare} onChange={e=>set('produitPhare',e.target.value)} placeholder="Ex: Notre assurance Vie Premium intègre une épargne performante..."/>,'Décrivez votre offre principale')}
        <div style={{marginBottom:22}}>
          <label style={L()}>Clientèle cible<span style={{color:'#C9A050'}}> *</span></label>
          <div style={{display:'flex',gap:12}}>
            {['Particuliers','Entreprises','Les deux'].map(o=>{const s=data.cibleClientele===o;return(<button key={o} onClick={()=>set('cibleClientele',o)} type="button" style={{flex:1,padding:'12px',borderRadius:8,cursor:'pointer',background:s?'rgba(201,160,80,0.1)':'#0A0F1E',border:`1px solid ${s?'#C9A050':'#1E2940'}`,color:s?'#C9A050':'#8892B0',fontSize:14}}>{o}</button>);})}
          </div>
          {errors.cibleClientele&&<p style={{marginTop:6,color:'#FF6B6B',fontSize:13}}>{errors.cibleClientele}</p>}
        </div>
        <div style={g2()}>
          {F("Nombre d'agences",false,undefined,<input style={I()} value={data.nombreAgences} onChange={e=>set('nombreAgences',e.target.value)} placeholder="Ex: 12 agences"/>)}
          {F('Zones géographiques',false,undefined,<input style={I()} value={data.zonesCouvertes} onChange={e=>set('zonesCouvertes',e.target.value)} placeholder="Ex: Toute la Côte d'Ivoire"/>)}
        </div>
        <div style={{marginBottom:22}}>
          <label style={L()}>Fonctionnalités souhaitées</label>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:10}}>
            {FONCTS.map(t=>{const ch=data.fonctionnalites.includes(t);return(<button key={t} onClick={()=>{const c=data.fonctionnalites;set('fonctionnalites',c.includes(t)?c.filter(x=>x!==t):[...c,t]);}} type="button" style={{padding:'10px 14px',borderRadius:8,cursor:'pointer',textAlign:'left',background:ch?'rgba(201,160,80,0.1)':'#0A0F1E',border:`1px solid ${ch?'#C9A050':'#1E2940'}`,color:ch?'#C9A050':'#8892B0',fontSize:13,display:'flex',alignItems:'center',gap:10}}><span style={{width:18,height:18,borderRadius:4,border:`2px solid ${ch?'#C9A050':'#1E2940'}`,background:ch?'#C9A050':'transparent',display:'inline-flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{ch&&<span style={{color:'#070B17',fontSize:11,fontWeight:800}}>✓</span>}</span>{t}</button>);})}
          </div>
        </div>
      </div>
    );
    if(step===4) return (
      <div>
        {F('Vos 3 valeurs fondamentales',false,undefined,<input style={I()} value={data.valeurs} onChange={e=>set('valeurs',e.target.value)} placeholder="Ex: Proximité, Transparence, Excellence"/>)}
        {F('Ce qui vous différencie',true,errors.differenciateurs,<textarea style={T(!!errors.differenciateurs)} value={data.differenciateurs} onChange={e=>set('differenciateurs',e.target.value)} placeholder="Ex: Délai de règlement sinistres < 48h, réseau de 120 prestataires agréés..."/>)}
        <div style={g2()}>
          {F("Années d'expérience",false,undefined,<input style={I()} value={data.anneesMarche} onChange={e=>set('anneesMarche',e.target.value)} placeholder="Ex: 20 ans"/>)}
          {F('Estimation portefeuille clients',false,undefined,<input style={I()} value={data.estimationPortefeuille} onChange={e=>set('estimationPortefeuille',e.target.value)} placeholder="Ex: +50 000 clients"/>)}
        </div>
        {F('Certifications, prix & partenariats',false,undefined,<textarea style={{...T(),minHeight:80}} value={data.certifications} onChange={e=>set('certifications',e.target.value)} placeholder="Ex: Certifié ISO 9001, Partenaire Orange CI..."/>)}
        {F('Sites web que vous appréciez',false,undefined,<input style={I()} value={data.sitesReference} onChange={e=>set('sitesReference',e.target.value)} placeholder="Ex: axa.fr, sunu-assurances.com"/>,'2-3 URLs qui vous inspirent')}
        {F('Couleurs préférées',false,undefined,<input style={I()} value={data.couleursPreferees} onChange={e=>set('couleursPreferees',e.target.value)} placeholder="Ex: Bleu marine, Or, Blanc"/>)}
        {F('Présentation de la société',false,undefined,<textarea style={{...T(),minHeight:100}} value={data.presentationEntreprise} onChange={e=>set('presentationEntreprise',e.target.value)} placeholder="Texte pour votre page À propos..."/>)}
        {F('Témoignages clients',false,undefined,<textarea style={{...T(),minHeight:80}} value={data.temoignages} onChange={e=>set('temoignages',e.target.value)} placeholder='"Service exceptionnel !" — Kouamé A.'/>)}
        <div style={{marginBottom:22}}>
          <label style={L()}>Budget site web</label>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:10}}>
            {BUDGETS.map(b=>{const s=data.budget===b;return(<button key={b} onClick={()=>set('budget',b)} type="button" style={{padding:'10px 14px',borderRadius:8,cursor:'pointer',background:s?'rgba(201,160,80,0.1)':'#0A0F1E',border:`1px solid ${s?'#C9A050':'#1E2940'}`,color:s?'#C9A050':'#8892B0',fontSize:13,textAlign:'left'}}>{b}</button>);})}
          </div>
        </div>
        <div style={{marginBottom:22}}>
          <label style={L()}>Délai souhaité</label>
          <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
            {DELAIS.map(d=>{const s=data.delai===d;return(<button key={d} onClick={()=>set('delai',d)} type="button" style={{padding:'10px 20px',borderRadius:8,cursor:'pointer',background:s?'rgba(201,160,80,0.1)':'#0A0F1E',border:`1px solid ${s?'#C9A050':'#1E2940'}`,color:s?'#C9A050':'#8892B0',fontSize:13}}>{d}</button>);})}
          </div>
        </div>
      </div>
    );
    // step 5 — assets
    return (
      <div>
        <div style={{marginBottom:24,padding:'14px 18px',borderRadius:10,background:'rgba(201,160,80,0.05)',border:'1px solid rgba(201,160,80,0.15)'}}>
          <p style={{color:'#C9A050',fontSize:13,fontWeight:600,margin:'0 0 4px'}}>📋 Note importante</p>
          <p style={{color:'#8892B0',fontSize:13,lineHeight:1.6,margin:0}}>Partagez vos assets existants. <strong style={{color:'#fff'}}>Seul le logo est requis si vous en avez un.</strong> Max 10 MB par fichier.</p>
        </div>
        {errors.logo&&<div style={{marginBottom:16,padding:'12px 16px',borderRadius:8,background:'rgba(255,107,107,0.08)',border:'1px solid rgba(255,107,107,0.25)',color:'#FF6B6B',fontSize:13}}>⚠️ {errors.logo}</div>}
        {FCATS.map(cat=>{
          const cf=files.filter(f=>f.category===cat.key);
          const isd=drag===cat.key;
          return(
            <div key={cat.key} style={{marginBottom:18}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:6}}>
                <label style={L()}>{cat.label}{cat.req&&<span style={{color:'#C9A050'}}> *</span>}</label>
                <span style={{color:'#2D3F5E',fontSize:11}}>{cat.hint}</span>
              </div>
              <div onDragOver={e=>{e.preventDefault();setDrag(cat.key);}} onDragLeave={()=>setDrag(null)}
                onDrop={e=>{e.preventDefault();setDrag(null);void addFiles(Array.from(e.dataTransfer.files),cat.key);}}
                onClick={()=>document.getElementById(`fi-${cat.key}`)?.click()}
                style={{border:`2px dashed ${isd?'#C9A050':cf.length?'rgba(201,160,80,0.3)':'#1E2940'}`,borderRadius:10,padding:18,textAlign:'center',cursor:'pointer',background:isd?'rgba(201,160,80,0.05)':'transparent',transition:'all 0.2s'}}>
                <input id={`fi-${cat.key}`} type="file" multiple accept={cat.accept} style={{display:'none'}} onChange={e=>{void addFiles(Array.from(e.target.files||[]),cat.key);(e.target as HTMLInputElement).value='';}} />
                {cf.length===0?(
                  <div><p style={{color:'#8892B0',fontSize:14,margin:0}}>Glissez-déposez ou <span style={{color:'#C9A050'}}>parcourez</span></p><p style={{color:'#2D3F5E',fontSize:11,marginTop:3}}>{cat.accept.replace(/\./g,'').toUpperCase().replace(/,/g,' · ')}</p></div>
                ):(
                  <div onClick={e=>e.stopPropagation()}>
                    {cf.map((f)=>{const idx=files.indexOf(f);return(<div key={f.name+idx} style={{display:'flex',alignItems:'center',gap:10,padding:'7px 11px',background:'rgba(201,160,80,0.06)',borderRadius:6,marginBottom:5,textAlign:'left'}}><span style={{fontSize:16}}>{f.type.startsWith('image')?'🖼️':'📄'}</span><div style={{flex:1,minWidth:0}}><p style={{color:'#fff',fontSize:12,margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{f.name}</p><p style={{color:'#3D4F6B',fontSize:11,margin:0}}>{f.sizeKB>1024?`${(f.sizeKB/1024).toFixed(1)} MB`:`${f.sizeKB} KB`}</p></div><button onClick={()=>setFiles(p=>p.filter((_,i)=>i!==idx))} style={{background:'rgba(255,107,107,0.1)',border:'1px solid rgba(255,107,107,0.2)',color:'#FF6B6B',borderRadius:4,padding:'1px 7px',cursor:'pointer',fontSize:14}}>×</button></div>);})}
                    <button onClick={()=>document.getElementById(`fi-${cat.key}`)?.click()} style={{background:'transparent',border:'none',color:'#3D4F6B',fontSize:11,cursor:'pointer',marginTop:5}}>+ Ajouter d'autres fichiers</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const cur=STITLES[step-1];
  return (
    <div style={{background:'#070B17',minHeight:'100vh',fontFamily:'Inter,-apple-system,sans-serif',paddingBottom:80}}>
      <div style={{padding:'32px 24px 0',textAlign:'center',maxWidth:740,margin:'0 auto'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:12,marginBottom:6}}>
          <div style={{width:38,height:38,borderRadius:9,background:'linear-gradient(135deg,#C9A050,#E4BC5A)',display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{color:'#070B17',fontWeight:800,fontSize:16}}>FW</span></div>
          <span style={{color:'#fff',fontWeight:700,fontSize:24,letterSpacing:'-0.5px'}}>FlexWay</span>
        </div>
        <p style={{color:'#3D4F6B',fontSize:13,margin:'0 0 28px',letterSpacing:'1.5px',textTransform:'uppercase'}}>Fiche Client — Création de Site Web</p>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',marginBottom:6}}>
          {STEPS.map((s,i)=>{const ia=s.n===step,id=s.n<step;return(<div key={s.n} style={{display:'flex',alignItems:'center'}}><div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:5}}><div style={{width:36,height:36,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',background:id?'#C9A050':ia?'rgba(201,160,80,0.12)':'transparent',border:`2px solid ${id||ia?'#C9A050':'#1E2940'}`,color:id?'#070B17':ia?'#C9A050':'#3D4F6B',fontSize:14,fontWeight:600,transition:'all 0.3s'}}>{id?'✓':s.n}</div><span style={{color:ia?'#C9A050':'#2D3F5E',fontSize:10,whiteSpace:'nowrap',letterSpacing:'0.5px',textTransform:'uppercase'}}>{s.l}</span></div>{i<STEPS.length-1&&<div style={{width:50,height:2,background:s.n<step?'#C9A050':'#1A2540',margin:'0 4px',marginBottom:20,transition:'background 0.3s'}}/>}</div>);})}
        </div>
      </div>
      <div style={{maxWidth:740,margin:'20px auto 0',padding:'0 24px'}}>
        <div style={{height:3,background:'#1A2540',borderRadius:2,overflow:'hidden'}}><div style={{height:'100%',width:`${((step-1)/4)*100}%`,background:'linear-gradient(90deg,#C9A050,#E4BC5A)',transition:'width 0.4s ease',borderRadius:2}}/></div>
      </div>
      <div style={{maxWidth:740,margin:'20px auto 0',padding:'0 24px'}}>
        <div style={{background:'#0D1428',borderRadius:16,border:'1px solid rgba(201,160,80,0.12)',padding:'clamp(16px,4vw,40px)'}}>
          <div style={{marginBottom:32}}>
            <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:6}}>
              <div style={{width:4,height:30,background:'linear-gradient(180deg,#C9A050,#E4BC5A)',borderRadius:2,flexShrink:0}}/>
              <h2 style={{color:'#fff',fontSize:22,fontWeight:700,margin:0}}>{cur.t}</h2>
            </div>
            <p style={{color:'#8892B0',fontSize:14,margin:'0 0 0 18px',lineHeight:1.5}}>{cur.s}</p>
          </div>
          <div key={step} style={{animation:'fadeInUp 0.3s ease'}}>
            {renderStep()}
          </div>
          <div style={{display:'flex',justifyContent:step===1?'flex-end':'space-between',marginTop:32,paddingTop:24,borderTop:'1px solid #1A2540'}}>
            {step>1&&<button onClick={prev} style={{padding:'12px 28px',borderRadius:8,border:'1px solid #1A2540',background:'transparent',color:'#8892B0',fontSize:15,cursor:'pointer'}}>← Précédent</button>}
            {step<5&&<button onClick={next} style={{padding:'12px 36px',borderRadius:8,border:'none',background:'linear-gradient(135deg,#C9A050,#E4BC5A)',color:'#070B17',fontSize:15,fontWeight:700,cursor:'pointer'}}>Suivant →</button>}
            {step===5&&<button onClick={()=>void submit()} disabled={submitting} style={{padding:'13px 40px',borderRadius:8,border:'none',background:submitting?'#1A2540':'linear-gradient(135deg,#C9A050,#E4BC5A)',color:submitting?'#8892B0':'#070B17',fontSize:15,fontWeight:700,cursor:submitting?'not-allowed':'pointer',transition:'all 0.2s'}}>{submitting?'⏳ Envoi en cours...':'✓ Soumettre la fiche'}</button>}
          </div>
        </div>
        <p style={{textAlign:'center',color:'#1A2540',fontSize:12,marginTop:20}}>© 2025 FlexWay — Vos informations sont traitées de manière strictement confidentielle</p>
      </div>
    </div>
  );
}
