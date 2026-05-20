import { useState, useEffect } from 'react';
import { api } from '@appdeploy/client';
import PricingView from './PricingView';

interface SubItem { id:string; serviceType:string; name:string; subName:string; createdAt:string; filesCount:number; score:Record<string,number>|null; status?:string; token?:string; }
interface FFile { name:string; category:string; path:string; }
interface Full { id:string; serviceType:string; files:FFile[]; fileUrls:Record<string,string>; createdAt:string; score:Record<string,number>|null; status?:string; token?:string; [key:string]:unknown; }
interface PlanSlot { clientName:string; month:string; }

const SVC: Record<string,{emoji:string;label:string;color:string;rgb:string}> = {
  siteweb:      { emoji:'🌐', label:'Création Site Web', color:'#C9A050', rgb:'201,160,80' },
  optimisation: { emoji:'🔧', label:'Optimisation',      color:'#E87C3E', rgb:'232,124,62' },
  workflow:     { emoji:'⚙️', label:'Workflows',          color:'#5B8AF5', rgb:'91,138,245' },
  whatsapp:     { emoji:'💬', label:'WhatsApp IA',        color:'#25C984', rgb:'37,201,132' },
};
const getSvc = (t:string) => SVC[t] || SVC.siteweb;

const STATUS: Record<string,{label:string;color:string;next?:string}> = {
  brief:     { label:'Brief reçu',    color:'#8892B0', next:'design' },
  design:    { label:'Design',        color:'#5B8AF5', next:'dev' },
  dev:       { label:'Développement', color:'#E87C3E', next:'livraison' },
  livraison: { label:'Livré ✅',      color:'#25C984' },
};
const getSt = (s:string) => STATUS[s] || STATUS.brief;

const BG='#070B17', CARD='#0D1428', TXT='#fff', SUB='#8892B0';
const cs: React.CSSProperties = { background:CARD, border:'1px solid rgba(255,255,255,0.05)', borderRadius:12, padding:22 };
const si: React.CSSProperties = { background:'#0A0F1E', border:'1px solid #1A2540', borderRadius:8, padding:'10px 14px', color:TXT, fontSize:14, outline:'none', boxSizing:'border-box', fontFamily:'Inter,sans-serif', width:'100%' };

function ClientLinkCopyBtn() {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={()=>{ void navigator.clipboard.writeText('https://96cf01b2ac464a148e.v2.appdeploy.ai/').then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);}); }}
      style={{padding:'8px 18px',borderRadius:8,border:'none',background:copied?'#25C984':'linear-gradient(135deg,#C9A050,#E4BC5A)',color:'#070B17',fontWeight:700,fontSize:13,cursor:'pointer',transition:'background 0.2s',whiteSpace:'nowrap'}}>
      {copied?'✓ Copié !':'📋 Copier le lien'}
    </button>
  );
}

function ScoreBar({label,value,color}:{label:string;value:number;color:string}) {
  return (
    <div style={{marginBottom:10}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
        <span style={{color:SUB,fontSize:12}}>{value>=80?'✅':value>=50?'⚠️':'❌'} {label}</span>
        <span style={{color:TXT,fontSize:12,fontWeight:600}}>{value}%</span>
      </div>
      <div style={{height:5,background:'#0A0F1E',borderRadius:3,overflow:'hidden'}}>
        <div style={{height:'100%',width:`${value}%`,background:`linear-gradient(90deg,${color},${color}88)`,borderRadius:3,transition:'width 0.6s'}}/>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [k, setK] = useState('');
  const [authed, setAuthed] = useState(false);
  const [subs, setSubs] = useState<SubItem[]>([]);
  const [sel, setSel] = useState<Full|null>(null);
  const [brief, setBrief] = useState('');
  const [load, setLoad] = useState(false);
  const [er, setEr] = useState('');
  const [tab, setTab] = useState<'clients'|'planning'|'tarifs'>('clients');
  const [slots, setSlots] = useState<PlanSlot[]>([{clientName:'',month:''},{clientName:'',month:''},{clientName:'',month:''}]);
  const [planSaved, setPlanSaved] = useState(false);
  const [updSt, setUpdSt] = useState('');

  const login = async () => {
    if(!k.trim()) return; setLoad(true); setEr('');
    try{
      const r = await api.get(`/api/admin/submissions?key=${encodeURIComponent(k)}`);
      setSubs((r.data as{submissions:SubItem[]}).submissions||[]);
      setAuthed(true);
    } catch{ setEr('Clé incorrecte.'); } finally{ setLoad(false); }
  };

  const loadPlanning = async () => {
    try{
      const r = await api.get(`/api/admin/planning?key=${encodeURIComponent(k)}`);
      const s = (r.data as{slots:PlanSlot[]}).slots||[];
      const filled = [...s];
      while(filled.length < 3) filled.push({clientName:'',month:''});
      setSlots(filled.slice(0,3));
    } catch{ /* ignore */ }
  };

  useEffect(() => { if(authed && tab==='planning') void loadPlanning(); }, [authed, tab]);

  const open = async (id:string) => {
    setLoad(true); setBrief('');
    try{ const r = await api.get(`/api/admin/submissions/${id}?key=${encodeURIComponent(k)}`); setSel(r.data as Full); }
    catch{ setEr('Erreur chargement.'); } finally{ setLoad(false); }
  };

  const loadBrief = async (id:string) => {
    try{ const r = await api.get(`/api/admin/brief/${id}?key=${encodeURIComponent(k)}`); setBrief((r.data as{markdown:string}).markdown); }
    catch{ setEr('Erreur brief.'); }
  };

  const updateStatus = async (id:string, status:string) => {
    setUpdSt(id); setEr('');
    try{
      await api.put(`/api/admin/submissions/${id}/status?key=${encodeURIComponent(k)}`, {status});
      setSubs(p => p.map(s => s.id===id ? {...s, status} : s));
      if(sel?.id===id) setSel(p => p ? {...p, status} : p);
    } catch{ setEr('Erreur mise à jour statut.'); }
    finally{ setUpdSt(''); }
  };

  const savePlanning = async () => {
    setEr(''); setPlanSaved(false);
    try{
      await api.put(`/api/admin/planning?key=${encodeURIComponent(k)}`, {slots});
      setPlanSaved(true); setTimeout(() => setPlanSaved(false), 2000);
    } catch{ setEr('Erreur sauvegarde planning.'); }
  };

  if(!authed) return (
    <div style={{background:BG,minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter,sans-serif'}}>
      <div style={{maxWidth:380,width:'100%',padding:'0 24px'}}>
        <div style={{...cs,textAlign:'center',padding:40}}>
          <div style={{width:52,height:52,borderRadius:10,background:'linear-gradient(135deg,#C9A050,#E4BC5A)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',fontSize:22}}>🔐</div>
          <h2 style={{color:TXT,margin:'0 0 4px',fontSize:20}}>FlexWay Admin</h2>
          <p style={{color:SUB,fontSize:14,margin:'0 0 22px'}}>Espace réservé à l'équipe</p>
          <input type="password" value={k} onChange={e=>setK(e.target.value)} onKeyDown={e=>e.key==='Enter'&&void login()} placeholder="Clé d'administration" style={si}/>
          {er&&<p style={{color:'#FF6B6B',fontSize:13,marginTop:8}}>{er}</p>}
          <button onClick={()=>void login()} disabled={load} style={{width:'100%',marginTop:14,padding:'12px',borderRadius:8,border:'none',background:load?'#1A2540':'linear-gradient(135deg,#C9A050,#E4BC5A)',color:load?SUB:'#070B17',fontWeight:700,fontSize:15,cursor:'pointer'}}>
            {load?'Connexion...':'Accéder au tableau de bord'}
          </button>
        </div>
      </div>
    </div>
  );

  if(sel) {
    const svc = getSvc(String(sel.serviceType||'siteweb'));
    const stInf = getSt(String(sel.status||'brief'));
    const entries = Object.entries(sel).filter(([kk])=>!['id','serviceType','files','fileUrls','createdAt','score','token','status','updatedAt'].includes(kk));
    return (
      <div style={{background:BG,minHeight:'100vh',fontFamily:'Inter,sans-serif',padding:'28px 24px'}}>
        <div style={{maxWidth:860,margin:'0 auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,flexWrap:'wrap',gap:10}}>
            <button onClick={()=>{setSel(null);setBrief('');}} style={{background:'transparent',border:'1px solid #1A2540',color:SUB,borderRadius:8,padding:'7px 16px',cursor:'pointer',fontSize:13}}>← Retour</button>
            <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
              <span style={{padding:'4px 12px',borderRadius:20,background:`${stInf.color}18`,border:`1px solid ${stInf.color}44`,color:stInf.color,fontSize:12,fontWeight:600}}>{stInf.label}</span>
              {stInf.next&&(
                <button onClick={()=>void updateStatus(sel.id, stInf.next!)} disabled={!!updSt}
                  style={{padding:'7px 16px',borderRadius:8,border:'none',background:`linear-gradient(135deg,${svc.color},${svc.color}CC)`,color:'#070B17',fontWeight:700,cursor:'pointer',fontSize:13}}>
                  {updSt?'...`:`→ ${getSt(stInf.next).label}`}
                </button>
              )}
              <button onClick={()=>void loadBrief(sel.id)} style={{padding:'7px 14px',borderRadius:8,border:'1px solid #1A2540',background:'transparent',color:TXT,cursor:'pointer',fontSize:13}}>📄 Brief</button>
              {brief&&<button onClick={()=>void navigator.clipboard.writeText(brief).then(()=>alert('✓ Copié !'))} style={{padding:'7px 14px',borderRadius:8,border:'none',background:`linear-gradient(135deg,${svc.color},${svc.color}CC)`,color:'#070B17',fontWeight:700,cursor:'pointer',fontSize:13}}>📋 Copier</button>}
            </div>
          </div>
          <h1 style={{color:TXT,fontSize:22,fontWeight:700,margin:'6px 0 3px'}}>{String(sel.raisonSociale||sel.nomEntreprise||sel.nomSociete||sel.nomContact||'—')}</h1>
          <p style={{color:SUB,margin:'0 0 18px',fontSize:13}}>{new Date(sel.createdAt).toLocaleDateString('fr-FR',{day:'2-digit',month:'long',year:'numeric'})}</p>
          {sel.score&&String(sel.serviceType)==='siteweb'&&(
            <div style={{...cs,marginBottom:14}}>
              <p style={{color:svc.color,fontSize:11,fontWeight:600,letterSpacing:'1px',textTransform:'uppercase',margin:'0 0 14px'}}>📊 Scores Qualité</p>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 24px'}}>
                <ScoreBar label="Complétude" value={sel.score.completion||0} color={svc.color}/>
                <ScoreBar label="Branding" value={sel.score.branding||0} color={svc.color}/>
                <ScoreBar label="Assets" value={sel.score.assets||0} color={svc.color}/>
                <ScoreBar label="Crédibilité" value={sel.score.trust||0} color={svc.color}/>
              </div>
            </div>
          )}
          {brief&&(
            <div style={{...cs,marginBottom:14}}>
              <p style={{color:svc.color,fontSize:11,fontWeight:600,letterSpacing:'1px',textTransform:'uppercase',margin:'0 0 10px'}}>Brief</p>
              <pre style={{color:SUB,fontSize:11.5,whiteSpace:'pre-wrap',wordBreak:'break-word',maxHeight:340,overflow:'auto',margin:0,lineHeight:1.6}}>{brief}</pre>
            </div>
          )}
          <div style={cs}>
            <p style={{color:svc.color,fontSize:11,fontWeight:600,letterSpacing:'1px',textTransform:'uppercase',margin:'0 0 12px'}}>Données brutes</p>
            {entries.map(([key,val])=>(
              <div key={key} style={{display:'flex',gap:14,padding:'5px 0',borderBottom:'1px solid #0F1A30'}}>
                <span style={{color:SUB,fontSize:12,minWidth:150,flexShrink:0}}>{key}</span>
                <span style={{color:TXT,fontSize:12,wordBreak:'break-word'}}>{Array.isArray(val)?(val as string[]).join(', '):String(val||'—')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const bySvc = {
    siteweb:      subs.filter(s=>s.serviceType==='siteweb'||!s.serviceType),
    optimisation: subs.filter(s=>s.serviceType==='optimisation'),
    workflow:     subs.filter(s=>s.serviceType==='workflow'),
    whatsapp:     subs.filter(s=>s.serviceType==='whatsapp'),
  };

  return (
    <div style={{background:BG,minHeight:'100vh',fontFamily:'Inter,sans-serif',padding:'28px 24px'}}>
      <div style={{maxWidth:860,margin:'0 auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:24}}>
          <div>
            <div style={{display:'inline-flex',alignItems:'center',gap:10,marginBottom:6}}>
              <div style={{width:30,height:30,borderRadius:6,background:'linear-gradient(135deg,#C9A050,#E4BC5A)',display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{color:'#070B17',fontWeight:800,fontSize:13}}>FW</span></div>
              <span style={{color:TXT,fontWeight:700,fontSize:18}}>FlexWay Admin</span>
            </div>
            <p style={{color:SUB,margin:0,fontSize:13}}>{subs.length} fiche(s) reçue(s)</p>
          </div>
          <button onClick={()=>setAuthed(false)} style={{background:'transparent',border:'1px solid #1A2540',color:SUB,borderRadius:8,padding:'7px 14px',cursor:'pointer',fontSize:13}}>Déconnexion</button>
        </div>

        <div style={{padding:'14px 20px',borderRadius:12,background:'#0D1428',border:'1px solid rgba(201,160,80,0.2)',marginBottom:20,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
          <div>
            <p style={{color:'#8892B0',fontSize:11,textTransform:'uppercase',letterSpacing:'0.8px',margin:'0 0 3px'}}>🔗 Lien à partager aux clients</p>
            <p style={{color:'#C9A050',fontSize:13,fontWeight:500,margin:0,fontFamily:'monospace'}}>https://96cf01b2ac464a148e.v2.appdeploy.ai/</p>
          </div>
          <ClientLinkCopyBtn/>
        </div>

        <div style={{display:'flex',gap:4,marginBottom:22,background:'#0D1428',borderRadius:10,padding:4,width:'fit-content'}}>
          {(['clients','planning','tarifs'] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              style={{padding:'8px 22px',borderRadius:7,border:'none',background:tab===t?'#1A2B4A':'transparent',color:tab===t?TXT:SUB,fontWeight:tab===t?600:400,fontSize:14,cursor:'pointer',transition:'all 0.15s'}}>
              {t==='clients'?'Fiches clients':t==='planning'?'Planning':'Tarification'}
            </button>
          ))}
        </div>

        {er&&<div style={{padding:'10px 14px',borderRadius:8,background:'rgba(255,107,107,0.08)',border:'1px solid rgba(255,107,107,0.2)',color:'#FF6B6B',marginBottom:14,fontSize:13}}>{er}</div>}

        {tab==='tarifs' && <PricingView />}

        {tab==='clients' && (
          <>
            {load&&<p style={{color:SUB,textAlign:'center',padding:30}}>Chargement...</p>}
            {subs.length===0&&!load&&<div style={{...cs,textAlign:'center',padding:50}}><p style={{color:'#2D3F5E',fontSize:15}}>Aucune fiche reçue pour le moment.</p></div>}
            {(['siteweb','optimisation','workflow','whatsapp'] as const).map(sk=>{
              const items = bySvc[sk]; if(!items.length) return null;
              const svc = getSvc(sk);
              return (
                <div key={sk} style={{marginBottom:28}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
                    <div style={{width:3,height:20,background:svc.color,borderRadius:2}}/>
                    <h2 style={{color:TXT,margin:0,fontSize:15,fontWeight:600}}>{svc.emoji} {svc.label}</h2>
                    <span style={{padding:'2px 10px',borderRadius:20,background:`rgba(${svc.rgb},0.1)`,color:svc.color,fontSize:11,fontWeight:600}}>{items.length}</span>
                  </div>
                  <div style={{display:'grid',gap:8}}>
                    {items.map(s=>{
                      const stInf = getSt(String(s.status||'brief'));
                      return (
                        <div key={s.id} style={{...cs,display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 20px',gap:12,flexWrap:'wrap'}}
                          onMouseEnter={e=>(e.currentTarget.style.borderColor=`rgba(${svc.rgb},0.3)`)}
                          onMouseLeave={e=>(e.currentTarget.style.borderColor='rgba(255,255,255,0.05)')}>
                          <div style={{minWidth:0,flex:1,cursor:'pointer'}} onClick={()=>void open(s.id)}>
                            <h3 style={{color:TXT,margin:'0 0 2px',fontSize:14,fontWeight:600}}>{s.name}</h3>
                            {s.subName&&<p style={{color:SUB,margin:0,fontSize:12}}>{s.subName}</p>}
                          </div>
                          <div style={{display:'flex',alignItems:'center',gap:8,flexShrink:0,flexWrap:'wrap'}}>
                            <span style={{padding:'3px 10px',borderRadius:20,background:`${stInf.color}18`,border:`1px solid ${stInf.color}44`,color:stInf.color,fontSize:11,fontWeight:600,whiteSpace:'nowrap'}}>{stInf.label}</span>
                            {stInf.next&&(
                              <button onClick={()=>void updateStatus(s.id, stInf.next!)} disabled={updSt===s.id}
                                style={{padding:'5px 12px',borderRadius:7,border:'none',background:svc.color,color:'#070B17',fontWeight:700,fontSize:12,cursor:'pointer',whiteSpace:'nowrap'}}>
                                {updSt===s.id?'...':'→ '+getSt(stInf.next).label}
                              </button>
                            )}
                            <div style={{textAlign:'right'}}>
                              <p style={{color:'#3D4F6B',margin:'0 0 2px',fontSize:11}}>{s.filesCount} fichier(s)</p>
                              <p style={{color:'#2D3F5E',margin:0,fontSize:11}}>{new Date(s.createdAt).toLocaleDateString('fr-FR',{day:'2-digit',month:'short',year:'numeric'})}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </>
        )}

        {tab==='planning' && (
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
              <h2 style={{color:TXT,margin:0,fontSize:15,fontWeight:600}}>Planning — 3 clients/mois</h2>
              <button onClick={()=>void savePlanning()}
                style={{padding:'8px 18px',borderRadius:8,border:'none',background:planSaved?'#25C984':'linear-gradient(135deg,#C9A050,#E4BC5A)',color:'#070B17',fontWeight:700,fontSize:13,cursor:'pointer'}}>
                {planSaved?'✓ Sauvegardé':'💾 Sauvegarder'}
              </button>
            </div>
            <div style={{display:'grid',gap:10}}>
              {slots.map((slot,i)=>(
                <div key={i} style={{...cs,display:'flex',alignItems:'center',gap:14,padding:'16px 20px'}}>
                  <div style={{width:32,height:32,borderRadius:8,flexShrink:0,background:slot.clientName?'linear-gradient(135deg,#C9A050,#E4BC5A)':'#0A0F1E',border:slot.clientName?'none':'1px solid #1A2540',display:'flex',alignItems:'center',justifyContent:'center',color:slot.clientName?'#070B17':'#2D3F5E',fontWeight:700,fontSize:14}}>{i+1}</div>
                  <input value={slot.clientName} onChange={e=>{const n=[...slots];n[i]={...slot,clientName:e.target.value};setSlots(n);}} placeholder="Nom du client…" style={{...si,flex:'2 1 auto'}}/>
                  <input value={slot.month} onChange={e=>{const n=[...slots];n[i]={...slot,month:e.target.value};setSlots(n);}} placeholder="Mois (ex: Juin 2025)" style={{...si,flex:'1 1 auto'}}/>
                  {slot.clientName&&<span style={{color:'#25C984',fontSize:16,flexShrink:0}}>✅</span>}
                </div>
              ))}
            </div>
          </div>
        )}
        <p style={{textAlign:'center',color:'#1A2540',fontSize:11,marginTop:20}}>© 2025 FlexWay</p>
      </div>
    </div>
  );
}
