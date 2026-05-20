import { useState, useEffect } from 'react';
import { api } from '@appdeploy/client';
import { useParams } from 'react-router-dom';

interface TrackingData { name:string; serviceType:string; status:string; createdAt:string; }
const STAGES = [
  { key:'brief', label:'Brief reçu', icon:'📋' },
  { key:'design', label:'Design', icon:'🎨' },
  { key:'dev', label:'Développement', icon:'💻' },
  { key:'livraison', label:'Livraison', icon:'🚀' },
];
const SVC_NAMES: Record<string,string> = { siteweb:'Site Web Professionnel', optimisation:'Optimisation de Site', workflow:'Workflow & Automatisation', whatsapp:'Agent WhatsApp IA' };
const STATUS_MSGS: Record<string,string> = {
  brief: '✅ <strong style="color:#fff">Votre brief a été reçu.</strong> Notre équipe l\'analyse et vous contacte sous 48h.',
  design: '🎨 <strong style="color:#fff">Phase Design en cours.</strong> Nos designers créent les maquettes.',
  dev: '💻 <strong style="color:#fff">Développement en cours.</strong> Votre site est en cours de construction.',
  livraison: '🚀 <strong style="color:#fff">Projet livré !</strong> Merci de votre confiance.',
};

export default function ClientTracking() {
  const { token } = useParams<{token:string}>();
  const [data, setData] = useState<TrackingData|null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    if(!token) return;
    api.get(`/api/suivi/${token}`)
      .then(r => setData(r.data as TrackingData))
      .catch(() => setErr('Lien de suivi invalide ou expiré.'))
      .finally(() => setLoading(false));
  }, [token]);

  const stageIdx = data ? STAGES.findIndex(s => s.key === data.status) : -1;

  return (
    <div style={{background:'#070B17',minHeight:'100vh',fontFamily:'Inter,-apple-system,sans-serif',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}>
      <div style={{maxWidth:520,width:'100%'}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:10}}>
            <div style={{width:36,height:36,borderRadius:8,background:'linear-gradient(135deg,#C9A050,#E4BC5A)',display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{color:'#070B17',fontWeight:800,fontSize:14}}>FW</span></div>
            <span style={{color:'#fff',fontWeight:700,fontSize:20}}>FlexWay</span>
          </div>
        </div>
        {loading && <div style={{background:'#0D1428',borderRadius:16,border:'1px solid #1A2540',padding:40,textAlign:'center'}}><p style={{color:'#8892B0',margin:0}}>Chargement...</p></div>}
        {err && <div style={{background:'#0D1428',borderRadius:16,border:'1px solid rgba(255,107,107,0.2)',padding:40,textAlign:'center'}}><p style={{color:'#FF6B6B',fontSize:15,margin:'0 0 16px'}}>{err}</p><p style={{color:'#8892B0',fontSize:13}}>Contact : <span style={{color:'#C9A050'}}>contact@flexway.ci</span></p></div>}
        {data && !loading && (
          <div style={{background:'#0D1428',borderRadius:16,border:'1px solid rgba(201,160,80,0.12)',padding:'32px 28px'}}>
            <p style={{color:'#8892B0',fontSize:12,textTransform:'uppercase',letterSpacing:'1px',margin:'0 0 4px'}}>Projet en cours</p>
            <h1 style={{color:'#fff',fontSize:22,fontWeight:700,margin:'0 0 4px'}}>{data.name}</h1>
            <p style={{color:'#8892B0',fontSize:13,margin:'0 0 24px'}}>{SVC_NAMES[data.serviceType]||'Service FlexWay'}</p>
            <div style={{display:'flex',alignItems:'flex-start',marginBottom:28}}>
              {STAGES.map((stage, i) => {
                const done = i < stageIdx, active = i === stageIdx;
                return (
                  <div key={stage.key} style={{flex:1,textAlign:'center',position:'relative'}}>
                    {i < STAGES.length-1 && <div style={{position:'absolute',top:19,left:'50%',width:'100%',height:2,background:done?'#C9A050':'#1A2540',zIndex:0}}/>}
                    <div style={{width:38,height:38,borderRadius:'50%',margin:'0 auto 8px',background:active?'linear-gradient(135deg,#C9A050,#E4BC5A)':done?'#C9A050':'#0A0F1E',border:active||done?'none':'2px solid #1A2540',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',zIndex:1}}>
                      {done ? '✓' : <span style={{opacity:active?1:0.3,fontSize:16}}>{stage.icon}</span>}
                    </div>
                    <p style={{color:active||done?'#C9A050':'#2D3F5E',fontSize:11,fontWeight:active?700:400,margin:0}}>{stage.label}</p>
                  </div>
                );
              })}
            </div>
            <div style={{padding:'14px 18px',borderRadius:10,background:'rgba(201,160,80,0.05)',border:'1px solid rgba(201,160,80,0.15)',marginBottom:20}}>
              <p style={{color:'#8892B0',fontSize:13,margin:0,lineHeight:1.6}} dangerouslySetInnerHTML={{__html:STATUS_MSGS[data.status]||STATUS_MSGS.brief}}/>
            </div>
            <div style={{textAlign:'center'}}>
              <p style={{color:'#3D4F6B',fontSize:12,margin:'0 0 4px'}}>Une question ?</p>
              <a href="mailto:contact@flexway.ci" style={{color:'#C9A050',fontSize:13,fontWeight:500}}>contact@flexway.ci</a>
            </div>
            <p style={{color:'#1A2540',fontSize:11,textAlign:'center',margin:'16px 0 0',fontFamily:'monospace'}}>ref: {token}</p>
          </div>
        )}
      </div>
    </div>
  );
}
