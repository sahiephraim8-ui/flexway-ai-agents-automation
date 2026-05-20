import { useState } from 'react';
import { useLocation } from 'react-router-dom';

const CONFIG: Record<string,{emoji:string;color:string;colorRgb:string;title:string;sub:string}> = {
  web:      { emoji:'🌐', color:'#C9A050', colorRgb:'201,160,80', title:'Fiche envoyée avec succès',    sub:'Notre équipe design analyse vos informations et vous contacte sous <strong style="color:#C9A050">48 heures</strong> pour démarrer la création de votre site.' },
  optim:    { emoji:'🔧', color:'#E87C3E', colorRgb:'232,124,62', title:"Demande d'audit reçue",         sub:'Notre équipe vous contacte sous <strong style="color:#E87C3E">24 heures</strong> pour organiser votre audit de site (20 000 FCFA, déductible du projet total).' },
  workflow: { emoji:'⚙️', color:'#5B8AF5', colorRgb:'91,138,245', title:'Brief automatisation reçu',    sub:'Notre équipe technique analyse vos processus et vous propose une architecture sur mesure sous <strong style="color:#5B8AF5">48 heures</strong>.' },
  whatsapp: { emoji:'💬', color:'#25C984', colorRgb:'37,201,132', title:'Configuration agent reçue',    sub:'Notre équipe IA configure votre assistant WhatsApp et vous contacte sous <strong style="color:#25C984">48 heures</strong> pour valider le paramétrage.' },
};

export default function SuccessPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const service = params.get('s') || 'web';
  const token = params.get('t') || '';
  const cfg = CONFIG[service] || CONFIG.web;
  const trackingUrl = token ? `${window.location.origin}${window.location.pathname}#/suivi/${token}` : '';
  const [copied, setCopied] = useState(false);
  const copyLink = () => { void navigator.clipboard.writeText(trackingUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); };
  return (
    <div style={{ background:'#070B17', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Inter,-apple-system,sans-serif' }}>
      <div style={{ textAlign:'center', maxWidth:520, padding:'0 24px' }}>
        <div style={{ width:80, height:80, borderRadius:'50%', background:`linear-gradient(135deg, ${cfg.color}, ${cfg.color}99)`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 28px', fontSize:34 }}>{cfg.emoji}</div>
        <h1 style={{ color:'#fff', fontSize:28, fontWeight:700, marginBottom:14 }}>{cfg.title}</h1>
        <p style={{ color:'#8892B0', fontSize:15, lineHeight:1.7, marginBottom:24 }} dangerouslySetInnerHTML={{ __html: cfg.sub }} />
        {token && (
          <div style={{ padding:'20px 22px', borderRadius:12, background:'#0D1428', border:`1px solid rgba(${cfg.colorRgb},0.2)`, textAlign:'left', marginBottom:16 }}>
            <p style={{ color:'#8892B0', fontSize:12, margin:'0 0 8px' }}>🔗 Votre lien de suivi</p>
            <p style={{ color:cfg.color, fontSize:12, margin:'0 0 12px', fontFamily:'monospace', wordBreak:'break-all' }}>{trackingUrl}</p>
            <button onClick={copyLink} style={{ padding:'8px 18px', borderRadius:7, border:'none', background:copied?'#25C984':`linear-gradient(135deg,${cfg.color},${cfg.color}CC)`, color:'#070B17', fontWeight:700, fontSize:13, cursor:'pointer' }}>
              {copied ? '✓ Copié !' : '📋 Copier le lien'}
            </button>
          </div>
        )}
        <div style={{ padding:'18px 22px', borderRadius:12, background:'#0D1428', border:`1px solid rgba(${cfg.colorRgb},0.15)`, textAlign:'left', marginBottom:20 }}>
          <p style={{ color:'#8892B0', fontSize:12, margin:'0 0 5px' }}>📧 Questions ?</p>
          <p style={{ color:cfg.color, fontSize:14, margin:0, fontWeight:500 }}>contact@flexway.ci</p>
        </div>
        <p style={{ color:'#2D3F5E', fontSize:12 }}>© 2025 FlexWay</p>
      </div>
    </div>
  );
}
